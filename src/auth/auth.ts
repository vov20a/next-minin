import NextAuth from 'next-auth';
import { ZodError } from 'zod';
import Credentials from 'next-auth/providers/credentials';
import { signInSchema } from '@/schema/zod';
import { getUserFromDb } from '@/utils/user';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from '@/utils/prisma';
import bcryptjs from 'bcryptjs';
import type { Adapter } from 'next-auth/adapters';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials.email || !credentials.password) {
            throw new Error('Email & password are required');
          }
          //validation
          const { email, password } = await signInSchema.parseAsync(credentials);

          // logic to verify if the user exists
          const user = await getUserFromDb(email);

          if (!user || !user.password) {
            throw new Error('Not this user in DB');
          }
          const isPasswordValid = await bcryptjs.compare(password, user.password);

          if (!isPasswordValid) {
            throw new Error('Password error');
          }

          // return JSON object with the user data
          return { id: user.id, email: user.email, role: user.role };
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3600 * 24 * 7,
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // async jwt({ token, user }) {
    //   if (user) {
    //     token.id = user.id;
    //   }
    //   return token;
    // },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    // If you want to use the role in client components
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role;
      return session;
    },
  },
});
