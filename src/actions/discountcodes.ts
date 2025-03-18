"use server"

import db from "@/lib/db"
import { DiscountCodeType } from "@prisma/client"
import { notFound, redirect } from "next/navigation"
import { z } from "zod"

const addSchema = z
  .object({
    code: z.string().min(1),
    discountAmount: z.coerce.number().int().min(1),
    discountType: z.nativeEnum(DiscountCodeType),
    allProducts: z.coerce.boolean(),
    productIds: z.array(z.string()).optional(),
    expiresAt: z.preprocess(
      value => (value === "" ? undefined : value),
      z.coerce.date().min(new Date()).optional()
    ),
    limit: z.preprocess(
      value => (value === "" ? undefined : value),
      z.coerce.number().int().min(1).optional()
    ),
  })
  .refine(
    data =>
      data.discountAmount <= 100 ||
      data.discountType !== DiscountCodeType.PERCENTAGE,
    {
      message: "Percentage discount must be less than or equal to 100",
      path: ["discountAmount"],
    }
  )
  .refine(data => !data.allProducts || data.productIds == null, {
    message: "Cannot select products when all products is selected",
    path: ["productIds"],
  })
  .refine(data => data.allProducts || data.productIds != null, {
    message: "Must select products when all products is not selected",
    path: ["productIds"],
  })

interface DiscountCodeFormInputs {
  id?: string
  code: string
  discountAmount: number
  discountType: DiscountCodeType
  limit?: number
  expiresAt?: string
  allProducts: boolean
  productIds?: string[]
}

export async function addDiscountCode(data: DiscountCodeFormInputs) {
  const result = addSchema.safeParse(data)

  if (result.success === false) return result.error.formErrors.fieldErrors

  await db.discountCode.create({
    data: {
      code: data.code,
      discountAmount: Number(data.discountAmount),
      discountType: data.discountType,
      allProducts: data.allProducts,
      products:
        data.productIds != null
          ? { connect: data.productIds.map(id => ({ id })) }
          : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      limit: data.limit ? Number(data.limit) : undefined,
    },
  })

}

export async function updateDiscountCode(id: string, data: DiscountCodeFormInputs) {
  const result = addSchema.safeParse(data)

  if (result.success === false) return result.error.formErrors.fieldErrors

  await db.discountCode.update({
    where: { id },
    data: {
      code: data.code,
      discountAmount: Number(data.discountAmount),
      discountType: data.discountType,
      allProducts: data.allProducts,
      products:
        data.productIds != null
          ? { connect: data.productIds.map(id => ({ id })) }
          : undefined,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      limit: data.limit ? Number(data.limit) : undefined,
    },
  })

}

export async function toggleDiscountCodeActive(id: string, isActive: boolean) {
  await db.discountCode.update({ where: { id }, data: { isActive } })
}

export async function deleteDiscountCode(id: string) {
  try {
    await db.discountCode.delete({ where: { id } })
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error.message }
  }
}

export async function getPaginatedDiscountCodes({ page }: { page: number }) {
  const pageSize = 10
  const [discountCodes, totalCount] = await Promise.all([
    db.discountCode.findMany({
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        products: {
          select: { title: true },
        },
      },
    }),
    db.discountCode.count(),
  ])

  return {
    discountCodes,
    totalPages: Math.ceil(totalCount / pageSize),
  }
}

export async function getDiscountCodeById(id: string) {
  const discountCode = await db.discountCode.findUnique({
    where: { id },
    include: {
      products: {
        select: { title: true },
      },
    },
  })

  if (!discountCode) {
    throw new Error("Discount code not found")
  }

  return {
    ...discountCode,
    expiresAt: discountCode.expiresAt ? discountCode.expiresAt.toISOString() : undefined,
  }
}