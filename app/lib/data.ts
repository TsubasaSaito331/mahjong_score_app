import { QueryResultRow, sql } from '@vercel/postgres';
import { User } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import { cookies } from 'next/headers';

const ITEMS_PER_PAGE = 1000;
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
  startDate?: string,
  endDate?: string,
  playerIds?: string[],
) {
  noStore();
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const userId = cookies().get('user')?.value;
    if (userId) {
      // 基本的な条件
      let sqlQuery = `
        SELECT * FROM games
        WHERE deleted = false AND UserId = $1
      `;
      let params: any[] = [userId];

      // 日付期間フィルター
      if (startDate) {
        params.push(startDate);
        sqlQuery += ` AND Date >= $${params.length}`;
      }
      if (endDate) {
        params.push(endDate + ' 23:59:59');
        sqlQuery += ` AND Date <= $${params.length}`;
      }

      // プレイヤーフィルター
      if (playerIds && playerIds.length > 0) {
        if (playerIds.length === 1) {
          params.push(playerIds[0]);
          sqlQuery += ` AND (EastPlayer = $${params.length} OR SouthPlayer = $${params.length} OR WestPlayer = $${params.length} OR NorthPlayer = $${params.length})`;
        } else {
          // 複数プレイヤーのAND検索
          const playerConditions = playerIds.map((playerId) => {
            params.push(playerId);
            return `(EastPlayer = $${params.length} OR SouthPlayer = $${params.length} OR WestPlayer = $${params.length} OR NorthPlayer = $${params.length})`;
          });
          sqlQuery += ` AND (${playerConditions.join(' AND ')})`;
        }
      } else if (query) {
        // 従来のテキスト検索
        const searchPlayerIds = await getPlayerId(query, userId);
        if (searchPlayerIds.length > 0) {
          const playerConditions = searchPlayerIds.map((player) => {
            params.push(player.id);
            return `(EastPlayer = $${params.length} OR SouthPlayer = $${params.length} OR WestPlayer = $${params.length} OR NorthPlayer = $${params.length})`;
          });
          sqlQuery += ` AND (${playerConditions.join(' OR ')})`;
        }
      }

      sqlQuery += ` ORDER BY Date DESC LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}`;

      const gameResults = await sql.query(sqlQuery, params);
      return gameResults.rows;
    }
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('試合結果の取得に失敗しました.');
  }
}

export async function fetchGameResultsPages(
  query: string,
  startDate?: string,
  endDate?: string,
  playerIds?: string[],
) {
  noStore();
  try {
    const userId = cookies().get('user')?.value;
    if (userId) {
      // 基本的な条件
      let sqlQuery = `
        SELECT COUNT(*) FROM games
        WHERE deleted = false AND UserId = $1
      `;
      let params: any[] = [userId];

      // 日付期間フィルター
      if (startDate) {
        params.push(startDate);
        sqlQuery += ` AND Date >= $${params.length}`;
      }
      if (endDate) {
        params.push(endDate + ' 23:59:59');
        sqlQuery += ` AND Date <= $${params.length}`;
      }

      // プレイヤーフィルター
      if (playerIds && playerIds.length > 0) {
        if (playerIds.length === 1) {
          params.push(playerIds[0]);
          sqlQuery += ` AND (EastPlayer = $${params.length} OR SouthPlayer = $${params.length} OR WestPlayer = $${params.length} OR NorthPlayer = $${params.length})`;
        } else {
          // 複数プレイヤーのAND検索
          const playerConditions = playerIds.map((playerId) => {
            params.push(playerId);
            return `(EastPlayer = $${params.length} OR SouthPlayer = $${params.length} OR WestPlayer = $${params.length} OR NorthPlayer = $${params.length})`;
          });
          sqlQuery += ` AND (${playerConditions.join(' AND ')})`;
        }
      } else if (query) {
        // 従来のテキスト検索
        const searchPlayerIds = await getPlayerId(query, userId);
        if (searchPlayerIds.length > 0) {
          const playerConditions = searchPlayerIds.map((player) => {
            params.push(player.id);
            return `(EastPlayer = $${params.length} OR SouthPlayer = $${params.length} OR WestPlayer = $${params.length} OR NorthPlayer = $${params.length})`;
          });
          sqlQuery += ` AND (${playerConditions.join(' OR ')})`;
        }
      }

      const count = await sql.query(sqlQuery, params);
      const totalPages = Math.ceil(
        Number(count.rows[0].count) / ITEMS_PER_PAGE,
      );
      return totalPages;
    }
    return 0;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('試合結果ページ数の取得に失敗しました.');
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
