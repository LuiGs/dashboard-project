'use server';

import prisma from '@/lib/prisma';

export const getTopSellingProducts = async () => {
  try {
    const topSellingProducts = await prisma.product.findMany({
      include: {
        ProductImage: true,
        OrderItem: {
          select: {
            id: true, // Solo necesitas el id para contar
            quantity: true,
            price: true,
          },
        },
      },
      orderBy: {
        OrderItem: {
          _count: 'desc',
        },
      },
    });

    return topSellingProducts.map(product => ({
      ...product,
      images: product.ProductImage.map(image => image.url),
      totalSold: product.OrderItem.reduce((total, item) => total + item.quantity, 0), // Total de unidades vendidas
    }));

  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener productos más vendidos');
  }
};
