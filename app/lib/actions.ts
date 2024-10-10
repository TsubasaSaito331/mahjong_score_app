'use server';
import { sql } from '@vercel/postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { GameResult, Result } from './definitions';
import { cookies } from 'next/headers';
import { getUser } from './data';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { MdContactSupport } from 'react-icons/md';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function createAccount(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get('email') as string;
    const credentials = await getUser(formData.get('email') as string);
    if (!!credentials) {
      return 'そのメールアドレスは既に登録されています';
    }

    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = uuidv4();

    await sql`
      INSERT INTO users (Id, Name, email, Password)
      VALUES (${newId}, ${name}, ${email}, ${hashedPassword})
    `;
    console.log('created account success!:', {
      name: name,
      email: email,
      password: password,
    });
    return 'success';
  } catch (error) {
    console.error('Database Error:', error);
    return 'failed create account.';
  }
}

export async function createPlayer(formData: FormData) {
  const playerName = formData.get('playerName') as string;

  // playerName の取得が失敗した場合はエラーを返す
  if (!playerName) {
    return {
      message: 'Failed to get playerName.',
    };
  }

  // Insert data into the database
  try {
    const newId = uuidv4();
    const userId = cookies().get('user')?.value;
    await sql`
      INSERT INTO players (Id, Name, UserId)
      VALUES (${newId},${playerName}, ${userId})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to create player.',
    };
  }
  return {
    message: 'Player created successfully.',
  };
}

export async function updatePlayer(formData: FormData) {
  const id = formData.get('id') as string;
  const newName = formData.get('playerName') as string;

  // playerName の取得が失敗した場合はエラーを返す
  if (!newName) {
    return {
      message: 'Failed to get playerName.',
    };
  }

  // Insert data into the database
  try {
    await sql`
      UPDATE players
      SET Name = ${newName}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error : Failed to update player.',
    };
  }
  return {
    message: 'Player updated successfully.',
  };
}

export async function deletePlayer(id: string) {
  try {
    await sql`
      UPDATE players
      SET deleted = true
      WHERE id = ${id}
    `;
    return { message: 'Deleted Player.' };
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to Delete Player.' };
  }
}

const BONUS_POINTS = 5000;
const RANKING_POINTS = [30000 + BONUS_POINTS * 4, 10000, -10000, -30000];

function calcGamePoints(players: any[]) {
  players.sort((a, b) => b.score - a.score);
  let rank = 1;
  players[0].rank = rank;
  players[0].point =
    (players[0].score * 100 + RANKING_POINTS[0] - BONUS_POINTS - 25000) / 1000;
  for (let i = 1; i < players.length; i++) {
    if (players[i].score * 100 === players[i - 1].score * 100) {
      players[i].rank = rank;
      players[i].point =
        (players[i].score * 100 +
          (RANKING_POINTS[rank - 1] + RANKING_POINTS[rank]) / 2 -
          BONUS_POINTS -
          25000) /
        1000;
      players[i - 1].point =
        (players[i - 1].score * 100 +
          (RANKING_POINTS[rank - 1] + RANKING_POINTS[rank]) / 2 -
          BONUS_POINTS -
          25000) /
        1000;
      rank++;
    } else {
      rank++;
      players[i].rank = rank;
      players[i].point =
        (players[i].score * 100 +
          RANKING_POINTS[rank - 1] -
          BONUS_POINTS -
          25000) /
        1000;
    }
  }
  return players;
}

export async function registerGame(
  results: Result[],
  date?: Date,
  retryCount = 0,
) {
  if (!date) {
    date = new Date();
  }
  const options = {
    timeZone: 'Asia/Tokyo', // タイムゾーンを設定
    hour12: false, // 24時間表記にする場合
  };
  const japanTimeString = date.toLocaleString('ja-JP', options);

  const resultsWithGamePoints = calcGamePoints(results.slice());
  console.log(resultsWithGamePoints);

  // Insert data into the database
  try {
    const userId = cookies().get('user')?.value;
    const newId = uuidv4();
    // 試合結果の登録
    await sql`
      INSERT INTO games (Id,Date, EastPlayer, EastPlayerScore, SouthPlayer, SouthPlayerScore, WestPlayer, WestPlayerScore, NorthPlayer, NorthPlayerScore,UserId)
      VALUES (
        ${newId},
        ${japanTimeString},
        ${results[0].id},
        ${results[0].score * 100},
        ${results[1].id},
        ${results[1].score * 100},
        ${results[2].id},
        ${results[2].score * 100},
        ${results[3].id},
        ${results[3].score * 100},
        ${userId}
        );
    `;

    // プレイヤーのスコアの更新
    for (const player of resultsWithGamePoints) {
      await sql`
        UPDATE players
        SET
          TotalScore = TotalScore+${player.point},
          RawScore = RawScore+${(player.score - 25000) / 1000},
          Games = Games + 1,
          FirstNum = FirstNum + ${player.rank == 1 ? 1 : 0},
          SecondNum = SecondNum + ${player.rank == 2 ? 1 : 0},
          ThirdNum = ThirdNum + ${player.rank == 3 ? 1 : 0},
          FourthNum = FourthNum + ${player.rank == 4 ? 1 : 0},
          MaxScore = CASE WHEN MaxScore < ${player.score} THEN ${
            player.score
          } ELSE MaxScore END
        WHERE
          Id =${player.id};
        `;
    }
    return { message: 'Game registered successfully.' };
  } catch (error) {
    console.error('Database Error:', error);

    // リトライロジック (間隔200msで固定)
    if (retryCount < 3) {
      console.log(`Retrying registration in 100ms...`);
      await new Promise((resolve) => setTimeout(resolve, 100));
      return registerGame(results, date, retryCount + 1);
    } else {
      return {
        message:
          'Database Error: Failed to register game after multiple retries.',
      };
    }
  }
}

export async function deleteGame(gameResult: GameResult, retryCount = 0) {
  const Eplayer: Result = {
    id: gameResult.eastplayer,
    score: gameResult.eastplayerscore,
  };
  const Splayer: Result = {
    id: gameResult.southplayer,
    score: gameResult.southplayerscore,
  };
  const Wplayer: Result = {
    id: gameResult.westplayer,
    score: gameResult.westplayerscore,
  };
  const Nplayer: Result = {
    id: gameResult.northplayer,
    score: gameResult.northplayerscore,
  };

  const resultsWithGamePoints = calcGamePoints([
    Eplayer,
    Splayer,
    Wplayer,
    Nplayer,
  ]);

  try {
    for (const player of resultsWithGamePoints) {
      // maxScoreのデータを削除するときに要処理
      // const maxScore = await sql`
      //   SELECT MaxScore
      //   FROM players
      //   WHERE Id = ${player.id};`;

      await sql`
      UPDATE players
      SET
        TotalScore = TotalScore - ${player.point},
        RawScore = RawScore - ${(player.score - 25000) / 1000},
        Games = Games - 1,
        FirstNum = FirstNum - ${player.rank == 1 ? 1 : 0},
        SecondNum = SecondNum - ${player.rank == 2 ? 1 : 0},
        ThirdNum = ThirdNum - ${player.rank == 3 ? 1 : 0},
        FourthNum = FourthNum - ${player.rank == 4 ? 1 : 0}
      WHERE
        Id =${player.id};
      `;
    }
    // 試合結果をdeletedに変更
    await sql`
      UPDATE games
      SET deleted = true
      WHERE Id = ${gameResult.id}
    `;
    return { message: 'Deleted Game.' };
  } catch (error) {
    console.error('Database Error:', error);

    // リトライロジック (間隔200msで固定)
    if (retryCount < 5) {
      console.log(`Retrying registration in 200ms...`);
      await new Promise((resolve) => setTimeout(resolve, 200));
      return deleteGame(gameResult, retryCount + 1);
    } else {
      return {
        message:
          'Database Error: Failed to register game after multiple retries.',
      };
    }
  }
}
