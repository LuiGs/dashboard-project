export interface DiscountCode {
    id: string
    code: string
    discountAmount: number
    discountType: "PERCENTAGE" | "FIXED"
    uses: number
    isActive: boolean
    allProducts: boolean
    createdAt: Date
    limit?: number
    expiresAt?: Date
    products: { title: string }[]
  }