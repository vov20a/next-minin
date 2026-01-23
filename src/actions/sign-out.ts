'use server';

import { signOut } from '@/auth/auth';

export async function signOutFunc() {
  try {
    const result = await signOut({
      redirect: false,
      // redirectTo: '/',
    });

    return result;
  } catch (error) {
    console.error(error, 'Auth error');
  }
}
