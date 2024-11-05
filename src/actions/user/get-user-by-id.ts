'use server';

import prisma from '@/lib/prisma';

export const getUserById = async (id: string) => {
  if (id === 'new') return null;

  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) return null;

  return user;
};
