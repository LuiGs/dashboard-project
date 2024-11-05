'use server';

import prisma from '@/lib/prisma';

export const getRevenueByProduct = async () => {
  try {
    const revenueByProduct = await prisma.product.findMany({
      include: {
        ProductImage: true,
        OrderItem: true,
      },
    });

    return revenueByProduct.map(product => {
      const revenue = product.OrderItem.reduce((acc, item) => acc + item.price * item.quantity, 0);
      return {
        ...product,
        images: product.ProductImage.map(image => image.url),
        revenue,
      };
    });

  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener la recaudación por producto');
  }
};
