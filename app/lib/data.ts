import { sql } from '@vercel/postgres';
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

export async function fetchFilteredGameResults(
  query: string,
  currentPage: number,
  playerId?: number,
) {
  noStore();
  try {
    const userId = cookies().get('user')?.value;
    if (playerId) {
      const gameResults = await sql`
        SELECT * FROM games
        WHERE deleted = false AND UserId = ${userId} AND (
          EastPlayer = ${playerId} OR
          SouthPlayer = ${playerId} OR
          WestPlayer = ${playerId} OR
          NorthPlayer = ${playerId}
        )
        ORDER BY Date DESC;
      `;
      return gameResults.rows;
    } else {
      const gameResults = await sql`
        SELECT * FROM games
        WHERE deleted = false AND UserId = ${userId}
        ORDER BY Date DESC;
      `;
      return gameResults.rows;
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

export async function getUser(email: string) {
  try {
    const user = await sql`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0] as User;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
