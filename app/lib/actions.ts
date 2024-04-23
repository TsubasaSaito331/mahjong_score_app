'use server';
import { sql } from '@vercel/postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { GameResult, Result } from './definitions';

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
    await sql`
      INSERT INTO players (Name)
      VALUES (${playerName})
    `;
  } catch (error) {
    return {
      message: 'Database Error : Failed to create player.',
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
    (players[0].score + RANKING_POINTS[0] - BONUS_POINTS - 25000) / 1000;
  for (let i = 1; i < players.length; i++) {
    if (players[i].score === players[i - 1].score) {
      players[i].rank = rank;
      players[i].point =
        (players[i].score +
          (RANKING_POINTS[rank - 1] + RANKING_POINTS[rank]) / 2 -
          BONUS_POINTS -
          25000) /
        1000;
      players[i - 1].point =
        (players[i - 1].score +
          (RANKING_POINTS[rank - 1] + RANKING_POINTS[rank]) / 2 -
          BONUS_POINTS -
          25000) /
        1000;
      rank++;
    } else {
      rank++;
      players[i].rank = rank;
      players[i].point =
        (players[i].score + RANKING_POINTS[rank - 1] - BONUS_POINTS - 25000) /
        1000;
    }
  }
  return players;
}

export async function resisterGame(results: Result[], date?: Date) {
  if (!date) {
    date = new Date();
  }
  const japanTime = new Date(date.getTime() + 9 * 60 * 60 * 1000); // UTC+9時の場合
  const japanTimeString = japanTime.toISOString();

  const resultsWithGamePoints = calcGamePoints(results);
  console.log(resultsWithGamePoints)

  // Insert data into the database
  try {
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
    // 試合結果の登録
    await sql`
      INSERT INTO games (Date, EastPlayer, EastPlayerScore, SouthPlayer, SouthPlayerScore, WestPlayer, WestPlayerScore, NorthPlayer, NorthPlayerScore)
      VALUES (
        ${japanTimeString},
        ${results[0].id},
        ${results[0].score},
        ${results[1].id},
        ${results[1].score},
        ${results[2].id},
        ${results[2].score},
        ${results[3].id},
        ${results[3].score}
        )
    `;
  } catch (error) {
    return {
      message: 'Database Error : Failed to resister game.',
    };
  }
  return {
    message: 'Game resistered successfully.',
  };
}

export async function deleteGame(gameResult: GameResult) {
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
    // 試合結果の登録
    await sql`
      UPDATE games
      SET deleted = true
      WHERE Id = ${gameResult.id}
    `;
    return { message: 'Deleted Game.' };
  } catch (error) {
    return { message: 'Database Error: Failed to Delete Game.' };
  }
}
