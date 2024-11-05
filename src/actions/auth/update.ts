'use server';

import prisma from '@/lib/prisma';
import bcryptjs from 'bcryptjs'; // Asegúrate de tener bcryptjs instalado

export const updateUser = async (
  id: string,
  name: string,
  email: string,
  role: 'admin' | 'user',
  password?: string // La contraseña es opcional, solo se incluye si se quiere actualizar
) => {
  try {
    // Construir el objeto de datos para actualizar
    const updateData: any = {
      name,
      email: email.toLowerCase(),
      role,
    };

    // Si se proporciona una nueva contraseña, se hashifica y se agrega al objeto de actualización
    if (password) {
      updateData.password = bcryptjs.hashSync(password);
    }

    // Actualizar el usuario en la base de datos
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // Puedes incluir más campos si los necesitas
      },
    });

    return {
      ok: true,
      user: user,
      message: 'Usuario actualizado',
    };
  } catch (error) {
    console.error(error);

    return {
      ok: false,
      message: 'No se pudo actualizar el usuario',
    };
  }
};
