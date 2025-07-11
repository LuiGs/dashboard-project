export interface Product {
  id: string;
  description: string;
  images: string[];
  inStock: number;
  price: number;
  sizes: Size[];
  slug: string;
  tags: string[];
  title: string;
  gender: 'men' | 'women' | 'kid' | 'unisex'; // Si estás usando 'gender' para el público objetivo
  categoryId: string; // Agrega este campo
  // Optionally, include category details
  category?: { id: string; name: string };
}


export interface CartProduct {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  size: Size;
  image: string;
}


export interface ProductImage {
  id: number;
  url: string;
  productId: string;
}


export type Category = 'men'|'women'|'kid'|'unisex';
export type Size = 'XS'|'S'|'M'|'L'|'XL'|'XXL'|'XXXL';
export type Type = 'shirts'|'pants'|'hoodies'|'hats';