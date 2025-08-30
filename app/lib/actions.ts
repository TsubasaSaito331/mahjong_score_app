'use server';
import { sql, db } from '@vercel/postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { GameResult, Result, PlayerStats } from './definitions';
import { cookies } from 'next/headers';
import { getUser } from './data';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

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
  const userId = formData.get('userId') as string;
  const name = formData.get('name') as string;
  const password = formData.get('password') as string;
  const bonus_points = Number(formData.get('bonus_points'));
  const ranking_points = Number(formData.get('ranking_points'));
  const start_points = Number(formData.get('start_points'));

  try {
    const credentials = await getUser(userId);
    if (!!credentials) {
      return 'そのユーザIDは既に登録されています';
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newId = uuidv4();

    await sql`
      INSERT INTO users (Id, Name, userId, Password, bonus_points, ranking_points, start_points)
      VALUES (${newId}, ${name}, ${userId}, ${hashedPassword}, ${bonus_points}, ${ranking_points}, ${start_points})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return 'アカウントの作成に失敗しました。';
  }

  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      return 'アカウントは作成されましたが、自動ログインに失敗しました。';
    }
    throw error;
  }
}

export async function updateSettings(
  prevState: string | undefined,
  formData: FormData,
) {
  const name = formData.get('name') as string;
  const ranking_points = Number(formData.get('ranking_points'));
  const start_points = Number(formData.get('start_points'));
  const bonus_points = Number(formData.get('bonus_points'));

  try {
    const userId = cookies().get('user')?.value;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await sql`
      UPDATE users
      SET
        Name = ${name},
        ranking_points = ${ranking_points},
        start_points = ${start_points},
        bonus_points = ${bonus_points}
      WHERE Id = ${userId}
    `;

    cookies().set('userName', name);
    cookies().set('RANKING_POINTS', String(ranking_points));
    cookies().set('START_POINTS', String(start_points));
    cookies().set('BOUNUS_POINTS', String(bonus_points));

    revalidatePath('/dashboard/configPage');
    return 'success';
  } catch (error) {
    console.error('Database Error:', error);
    return '設定の更新に失敗しました。';
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
  let success = false;
  let retryCount = 0;
  while (!success && retryCount < 3) {
    try {
      const newId = uuidv4();
      const userId = cookies().get('user')?.value;
      await sql`
        INSERT INTO players (Id, Name, UserId)
        VALUES (${newId},${playerName}, ${userId})
      `;
      success = true; // 成功したらループを抜ける
    } catch (error) {
      console.error('Database Error:', error);
      // リトライロジック
      if (retryCount < 3) {
        console.log(`Retrying registration in 200ms...`);
        await new Promise((resolve) => setTimeout(resolve, 200));
        retryCount++;
      } else {
        // リトライ回数を超えた場合はエラーメッセージを返す
        return {
          message:
            'Database Error: Failed to create player after multiple retries.',
        };
      }
    }
  }

  // リトライが成功した場合
  if (success) {
    return {
      message: 'Player created successfully.',
    };
  } else {
    // このケースは通常発生しないはずですが、念のため
    return {
      message:
        'Database Error: Failed to create player after multiple retries.',
    };
  }
}

export async function recalculateAllPlayersStats() {
  const client = await db.connect();
  try {
    const userId = cookies().get('user')?.value;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    await client.query('BEGIN');

    // 1. 対象ユーザーの全ゲーム結果を取得
    const gamesResult = await client.query(
      `SELECT * FROM games WHERE UserId = $1 AND deleted = false ORDER BY Date ASC;`,
      [userId],
    );
    const allGames = gamesResult.rows as GameResult[];

    // プレイヤーごとの成績をメモリ上で計算するためのMap
    const playerStatsMap = new Map<string, PlayerStats>();

    // 2. 取得した全ゲームをループして成績を計算
    for (const game of allGames) {
      const gamePlayers = [
        { id: game.eastplayer, score: game.eastplayerscore / 100 },
        { id: game.southplayer, score: game.southplayerscore / 100 },
        { id: game.westplayer, score: game.westplayerscore / 100 },
        { id: game.northplayer, score: game.northplayerscore / 100 },
      ];

      // Mapにプレイヤーが存在しない場合は初期化
      for (const p of gamePlayers) {
        if (!p.id) continue;
        if (!playerStatsMap.has(p.id)) {
          playerStatsMap.set(p.id, {
            id: p.id,
            totalscore: 0,
            rawscore: 0,
            games: 0,
            firstnum: 0,
            secondnum: 0,
            thirdnum: 0,
            fourthnum: 0,
            maxscore: -100000,
          });
        }
      }

      const resultsWithGamePoints = calcGamePoints(gamePlayers);

      for (const playerResult of resultsWithGamePoints) {
        if (!playerResult.id) continue;
        const stats = playerStatsMap.get(playerResult.id)!; // !で非nullを断言
        stats.totalscore += playerResult.point;
        stats.rawscore += (playerResult.score * 100 - 25000) / 1000;
        stats.games += 1;
        if (playerResult.rank === 1) stats.firstnum += 1;
        if (playerResult.rank === 2) stats.secondnum += 1;
        if (playerResult.rank === 3) stats.thirdnum += 1;
        if (playerResult.rank === 4) stats.fourthnum += 1;
        if (stats.maxscore < playerResult.score * 100) {
          stats.maxscore = playerResult.score * 100;
        }
      }
    }

    // 3. 全プレイヤーの成績を一度リセット
    await client.query(
      `UPDATE players
        SET
          TotalScore = 0, RawScore = 0, Games = 0,
          FirstNum = 0, SecondNum = 0, ThirdNum = 0, FourthNum = 0,
          MaxScore = -100000
        WHERE UserId = $1 AND deleted = false;`,
      [userId],
    );

    // 4. 計算結果をデータベースに反映
    for (const stats of Array.from(playerStatsMap.values())) {
      await client.query(
        `UPDATE players
          SET
            TotalScore = $1, RawScore = $2, Games = $3, FirstNum = $4,
            SecondNum = $5, ThirdNum = $6, FourthNum = $7, MaxScore = $8
          WHERE Id = $9;`,
        [
          stats.totalscore,
          stats.rawscore,
          stats.games,
          stats.firstnum,
          stats.secondnum,
          stats.thirdnum,
          stats.fourthnum,
          stats.maxscore,
          stats.id,
        ],
      );
    }
    await client.query('COMMIT');
    return { message: 'All player stats recalculated successfully.' };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to recalculate player stats.' };
  } finally {
    client.release();
  }
}

export async function updatePlayer(formData: FormData) {
  const id = formData.get('id') as string;
  const newName = formData.get('playerName') as string;
  const totalScore = parseFloat(formData.get('totalScore') as string);
  const rawScore = parseFloat(formData.get('rawScore') as string);
  const games = parseInt(formData.get('games') as string);
  const firstNum = parseInt(formData.get('firstNum') as string);
  const secondNum = parseInt(formData.get('secondNum') as string);
  const thirdNum = parseInt(formData.get('thirdNum') as string);
  const fourthNum = parseInt(formData.get('fourthNum') as string);
  const maxScore = parseInt(formData.get('maxScore') as string);
  const deposition = parseInt(formData.get('deposition') as string);

  // playerName の取得が失敗した場合はエラーを返す
  if (!newName) {
    return {
      message: 'Failed to get playerName.',
    };
  }

  // データベースにデータを更新
  try {
    await sql`
      UPDATE players
      SET
        Name = ${newName},
        TotalScore = ${totalScore},
        RawScore = ${rawScore},
        Games = ${games},
        FirstNum = ${firstNum},
        SecondNum = ${secondNum},
        ThirdNum = ${thirdNum},
        FourthNum = ${fourthNum},
        MaxScore = ${maxScore},
        Deposition = ${deposition}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to update player.',
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

function calcGamePoints(players: any[]) {
  const bonusPoints = parseInt(cookies().get('BOUNUS_POINTS')?.value || '5000');
  const rankingPoints = parseInt(
    cookies().get('RANKING_POINTS')?.value || '20000',
  );
  const startPoints = parseInt(cookies().get('START_POINTS')?.value || '25000');
  const RANKING_POINTS = [
    rankingPoints * 1.5 + bonusPoints * 4,
    rankingPoints * 0.5,
    rankingPoints * -0.5,
    rankingPoints * -1.5,
  ];

  players.sort((a, b) => b.score - a.score);
  let rank = 1;
  players[0].rank = rank;
  players[0].point =
    (players[0].score * 100 + RANKING_POINTS[0] - bonusPoints - startPoints) /
    1000;
  for (let i = 1; i < players.length; i++) {
    if (players[i].score === players[i - 1].score) {
      players[i].rank = rank;
      players[i].point =
        (players[i].score * 100 +
          (RANKING_POINTS[rank - 1] + RANKING_POINTS[rank]) / 2 -
          bonusPoints -
          startPoints) /
        1000;
      players[i - 1].point =
        (players[i - 1].score * 100 +
          (RANKING_POINTS[rank - 1] + RANKING_POINTS[rank]) / 2 -
          bonusPoints -
          startPoints) /
        1000;
      rank++;
    } else {
      rank++;
      players[i].rank = rank;
      players[i].point =
        (players[i].score * 100 +
          RANKING_POINTS[rank - 1] -
          bonusPoints -
          startPoints) /
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
    timeZone: 'Asia/Tokyo',
    hour12: false,
  };
  const japanTimeString = date.toLocaleString('ja-JP', options);

  const resultsWithGamePoints = calcGamePoints(results.slice());
  console.log(resultsWithGamePoints);

  const userId = cookies().get('user')?.value;
  let success = false;
  while (!success && retryCount < 3) {
    try {
      const newId = uuidv4();
      await sql`
        INSERT INTO games (Id,Date, EastPlayer, EastPlayerScore, SouthPlayer, SouthPlayerScore, WestPlayer, WestPlayerScore, NorthPlayer, NorthPlayerScore,UserId)
        VALUES (
          ${newId},
          ${japanTimeString},
          ${results[0].id},
          ${parseInt(results[0].score as string) * 100},
          ${results[1].id},
          ${parseInt(results[1].score as string) * 100},
          ${results[2].id},
          ${parseInt(results[2].score as string) * 100},
          ${results[3].id},
          ${parseInt(results[3].score as string) * 100},
          ${userId}
          );
      `;
      success = true;
    } catch (error) {
      console.error('Database Error:', error);

      // リトライロジック (間隔200msで固定)
      if (retryCount < 3) {
        console.log(`Retrying registration in 200ms...`);
        await new Promise((resolve) => setTimeout(resolve, 200));
        retryCount++;
      } else {
        return {
          message:
            'Database Error: Failed to register game after multiple retries.',
        };
      }
    }
  }

  // プレイヤーのスコアの更新
  for (const player of resultsWithGamePoints) {
    success = false;
    while (!success && retryCount < 3) {
      try {
        await sql`
            UPDATE players
            SET
              TotalScore = TotalScore+${player.point},
              RawScore = RawScore+${(player.score * 100 - 25000) / 1000},
              Games = Games + 1,
              FirstNum = FirstNum + ${player.rank == 1 ? 1 : 0},
              SecondNum = SecondNum + ${player.rank == 2 ? 1 : 0},
              ThirdNum = ThirdNum + ${player.rank == 3 ? 1 : 0},
              FourthNum = FourthNum + ${player.rank == 4 ? 1 : 0},
              MaxScore = CASE WHEN MaxScore < ${player.score * 100} THEN ${
                player.score * 100
              } ELSE MaxScore END
            WHERE
              Id =${player.id};
            `;
        success = true;
      } catch (error) {
        console.error('Database Error:', error);

        // リトライロジック (間隔200msで固定)
        if (retryCount < 3) {
          console.log(`Retrying registration in 200ms...`);
          await new Promise((resolve) => setTimeout(resolve, 200));
          retryCount++;
        } else {
          return {
            message:
              'Database Error: Failed to register game after multiple retries.',
          };
        }
      }
    }
  }
  return { message: 'Game registered successfully.' };
}

export async function deleteGame(gameResultId: string, retryCount = 0) {
  const gameResultArray = await sql`
    SELECT * FROM games
    WHERE Id = ${gameResultId}
  `;
  const gameResult = gameResultArray.rows;

  const resultsWithGamePoints = calcGamePoints([
    {
      id: gameResult[0].eastplayer,
      score: gameResult[0].eastplayerscore / 100,
    },
    {
      id: gameResult[0].southplayer,
      score: gameResult[0].southplayerscore / 100,
    },
    {
      id: gameResult[0].westplayer,
      score: gameResult[0].westplayerscore / 100,
    },
    {
      id: gameResult[0].northplayer,
      score: gameResult[0].northplayerscore / 100,
    },
  ]);

  try {
    for (const player of resultsWithGamePoints) {
      await sql`
      UPDATE players
      SET
        TotalScore = TotalScore - ${player.point},
        RawScore = RawScore - ${(player.score * 100 - 25000) / 1000},
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
      WHERE Id = ${gameResultId}
    `;
    return { message: 'Deleted Game.' };
  } catch (error) {
    console.error('Database Error:', error);

    // リトライロジック (間隔200msで固定)
    if (retryCount < 5) {
      console.log(`Retrying registration in 200ms...`);
      await new Promise((resolve) => setTimeout(resolve, 200));
      return deleteGame(gameResultId, retryCount + 1);
    } else {
      return {
        message:
          'Database Error: Failed to register game after multiple retries.',
      };
    }
  }
}
