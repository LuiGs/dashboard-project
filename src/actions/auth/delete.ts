'use server';

import prisma from '@/lib/prisma';

export const deleteUser = async (id: string) => {
  try {
    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
      },
    });

    if (!user) {
      return {
        ok: false,
        message: 'Usuario no encontrado',
      };
    }

    // Eliminar el usuario si existe
    await prisma.user.delete({
      where: { id },
    });

    return {
      ok: true,
      message: 'Usuario eliminado exitosamente',
    };
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return {
      ok: false,
      message: 'No se pudo eliminar el usuario',
    };
  }
};
