'use server';

import prisma from '@/utils/prisma';

export async function getUserWithEmail(email: string | null | undefined) {
  try {
    const result = await prisma.user.findFirst({
      where: {
        email: email ?? '',
      },
    });
    return { success: true, user: result };
  } catch (error) {
    console.log('Not Found User', error);
    return { error: 'Not Found User' };
  }
}
