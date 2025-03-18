import type { Product } from "./product.interface"
import type { Category } from "./category.interface"

export interface Promotion {
  id: string;
  title: string;
  description?: string | null;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  startDate: string; // o Date
  endDate: string;   // o Date
  isActive: boolean;
  applyTo: 'PRODUCT' | 'CATEGORY' | 'ALL';
  productPromotions?: {
    product: Product;
  }[];
  categoryPromotions?: {
    category: Category;
  }[];
}
