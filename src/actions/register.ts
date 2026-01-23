'use server';

import { IFormData } from '@/types/form-data';
import { saltAndHashPasswords } from '@/utils/password';
import prisma from '@/utils/prisma';

export async function registerUser(formData: IFormData) {
  const { email, password, confirmPassword } = formData;

  if (password !== confirmPassword) {
    return { error: 'Пароли не совпадают' };
  }
  if (password.length < 6) {
    return { error: 'Пароль д.б. не менее 6 символов' };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Пользователь с таким email существует' };
    }

    const pwHash = await saltAndHashPasswords(password);
    const user = await prisma.user.create({
      data: {
        email: email,
        password: pwHash,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return { error: 'Ошибка при регистрации' };
  }
}
