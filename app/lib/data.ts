import { QueryResultRow, sql } from '@vercel/postgres';
import { User } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';

const ITEMS_PER_PAGE = 100;
export async function fetchFilteredPlayers(query: string, currentPage: number) {
  noStore();
  try {
    const userId = cookies().get('user')?.value;
    const players = await sql`
      SELECT *, RANK() OVER (ORDER BY TotalScore DESC) AS rank
      FROM players
      WHERE deleted = false AND UserId = ${userId} AND name ILIKE ${`%${query}%`};
    `;
    const playersWithRank = players.rows.map((player: any) => ({
      ...player,
      rank: parseInt(player.rank),
    }));
    return playersWithRank;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('プレイヤーの取得に失敗しました.');
  }
}

export async function fetchAllPlayers() {
  noStore();
  try {
    const userId = cookies().get('user')?.value;
    const players = await sql`
      SELECT *, RANK() OVER (ORDER BY TotalScore DESC) AS rank
      FROM players
      WHERE deleted = false AND UserId = ${userId};
    `;
    const playersWithRank = players.rows.map((player: any) => ({
      ...player,
      rank: parseInt(player.rank),
    }));
    return playersWithRank;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('プレイヤーの取得に失敗しました.');
  }
}

export async function getPlayerId(
  query: string,
  userId: string,
): Promise<QueryResultRow[]> {
  try {
    const playerId = await sql`
      SELECT Id FROM players
      WHERE deleted = false
        AND UserId = ${userId}
        AND name LIKE ${`%${query}%`}
    `;

    return playerId.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('検索に失敗しました.');
  }
}

export async function fetchFilteredGameResults(
  query: string,
  currentPage: number,
) {
  noStore();
  try {
    const userId = cookies().get('user')?.value;
    if (userId) {
      if (query) {
        const playerIds = await getPlayerId(query, userId);
        if (playerIds.length !== 0) {
          const gameResultsPromises = playerIds.map(async (player) => {
            const results = await sql`
              SELECT * FROM games
              WHERE deleted = false
                AND UserId = ${userId}
                AND (EastPlayer = ${player.id} OR SouthPlayer = ${player.id} OR WestPlayer = ${player.id} OR NorthPlayer = ${player.id})
              ORDER BY Date DESC;
            `;
            return results.rows;
          });
          // Promise.all を使用して全ての gameResultsPromises が解決するのを待つ
          const gameResultsArray = await Promise.all(gameResultsPromises);

          // gameResultsArray をフラットな配列に変換
          const gameResults = gameResultsArray.flat();

          return gameResults;
        }
      } else {
        const gameResults = await sql`
        SELECT * FROM games
        WHERE deleted = false AND UserId = ${userId}
        ORDER BY Date DESC;
      `;
        return gameResults.rows;
      }
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('試合結果の取得に失敗しました.');
  }
}

export async function fetchPlayersPages(query: string) {
  noStore();
  try {
    const userId = cookies().get('user')?.value;
    const count = await sql`SELECT COUNT(*)
    FROM players
    WHERE
    UserId = ${userId} AND players.name ILIKE ${`%${query}%`}
  `;
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('プレイヤーの取得に失敗しました');
  }
}

export async function getUser(userId: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE userId=${userId}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
