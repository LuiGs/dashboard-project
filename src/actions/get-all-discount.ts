'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';

export const getAllDiscount = async() => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de ser un usuario administrador'
    }
  }

  const discount = await prisma.discountCode.findMany({
    orderBy: {
      code: 'desc'
    }
  });

  return {
    ok: true,
    users: discount
  }
}
