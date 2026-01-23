import bcryptjs from 'bcryptjs';

export async function saltAndHashPasswords(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcryptjs.hash(password, saltRounds);
}
