import NextAuth from 'next-auth';
import { cookies } from 'next/headers';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import credentials from 'next-auth/providers/credentials';

async function getUser(userId: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE userId=${userId}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ userId: z.string(), password: z.string().min(4) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { userId, password } = parsedCredentials.data;
          const user = await getUser(userId);
          if (!user) return null;
          const expiryDate = new Date();
          expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1年間有効に設定

          cookies().set('user', user.id, { expires: expiryDate });
          cookies().set('userName', user.name, { expires: expiryDate });
          const passwordsMatch = await bcrypt.compare(password, user.password);

          console.log(user);
          if (passwordsMatch) return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
