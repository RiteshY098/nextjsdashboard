// import NextAuth from 'next-auth';
// import Credentials from 'next-auth/providers/credentials';
// import { authConfig } from './auth.config';
// import { z } from 'zod';
// import { sql } from '@vercel/postgres';
// import type { User } from '@/app/lib/definitions';
// import bcrypt from 'bcrypt';
 
// async function getUser(email: string): Promise<User | undefined> {
//   try {
//     const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
//     return user.rows[0];
//   } catch (error) {
//     console.error('Failed to fetch user:', error);
//     return undefined;
//     throw new Error('Failed to fetch user.');
//   }
// }
// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           return null; // Return null if credentials are not provided
//         }

//         const parsedCredentials = z
//           .object({ email: z.string().email(), password: z.string().min(6) })
//           .safeParse(credentials);
 
//         if (parsedCredentials.success) {
//           const { email, password } = parsedCredentials.data;
//           const user = await getUser(email);
//           if (!user) return null;
//           const passwordsMatch = await bcrypt.compare(password, user.password);
 
//           if (passwordsMatch) return user;
//         }
//         console.log('Invalid credentials');
//         return null;
//       },
//     }),
//   ],
// });

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import bcrypt from 'bcrypt';
import type { User } from '@/app/lib/definitions';

async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return undefined; // Return undefined if fetching fails
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; // Return null if credentials are not provided
        }

        // Parse credentials using Zod schema
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null; // Return null if validation fails
        }

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) {
          console.log('No user found with this email');
          return null; // Return null if user doesn't exist
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (passwordsMatch) {
          return user; // Return the user object if passwords match
        } else {
          console.log('Invalid credentials');
          return null; // Return null if passwords do not match
        }
      }
    }),
  ],
});
