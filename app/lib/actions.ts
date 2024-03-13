'use server';
import { sql } from '@vercel/postgres';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
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

export async function createPlayer(formData: FormData) {
  const playerName = formData.get('playerName') as string;

  // playerName の取得が失敗した場合はエラーを返す
  if (!playerName) {
      return {
          message: 'Failed to get playerName.'
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
      message: 'Player created successfully.'
  };
}

export async function updatePlayer(formData: FormData) {
  const id = formData.get('id') as string;
  const newName = formData.get('playerName') as string;

  // playerName の取得が失敗した場合はエラーを返す
  if (!newName) {
      return {
          message: 'Failed to get playerName.'
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
      message: 'Player updated successfully.'
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
