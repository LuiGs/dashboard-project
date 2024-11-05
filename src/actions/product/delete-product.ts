'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { deleteProductImage } from './delete-product-image'; // Importa la función de eliminación de imágenes

export const deleteProduct = async (id: string) => {
  try {
    // Buscar todas las imágenes asociadas al producto
    const images = await prisma.productImage.findMany({
      where: { productId: id },
    });

    // Si el producto tiene imágenes, eliminarlas primero
    if (images.length > 0) {
      const deleteImagesPromises = images.map(async (image) => {
        // Usar la función deleteProductImage para eliminar las imágenes físicamente
        await deleteProductImage(image.id, image.url);

        // Eliminar el registro de imagen de la base de datos
        return await prisma.productImage.delete({
          where: { id: image.id },
        });
      });

      // Esperar a que todas las imágenes sean eliminadas
      await Promise.all(deleteImagesPromises);
    }

    // Después de eliminar las imágenes, eliminar el producto de la base de datos
    const product = await prisma.product.delete({
      where: { id },
    });

    // Revalidar los paths para reflejar el cambio
    revalidatePath('/admin/products');
    revalidatePath(`/products/${product.slug}`);

    return {
      ok: true,
      message: 'Producto eliminado correctamente',
    };
  } catch (error) {
    console.log('Error al eliminar el producto:', error);
    return {
      ok: false,
      message: 'No se pudo eliminar el producto',
    };
  }
};
