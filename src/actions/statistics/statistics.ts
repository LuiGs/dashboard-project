"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth.config"

interface GetStatisticsParams {
  startDate?: string
  endDate?: string
}

export const getStatistics = async ({ startDate, endDate }: GetStatisticsParams) => {
  const session = await auth()

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "Debe ser un usuario administrador",
    }
  }

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const alltime = new Date(0)
  const start = startDate ? new Date(startDate) : alltime
  const end = endDate ? new Date(endDate) : now

  try {
    const [
      totalUsers,
      newUsersThisMonth,
      totalOrders,
      ordersThisMonth,
      totalProducts,
      lowStockProducts,
      totalRevenue,
      revenueThisMonth,
      allProducts,
      allCategories,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.count({
        where: {
          Order: {
            some: {
              createdAt: {
                gte: firstDayOfMonth,
              },
            },
          },
        },
      }),

      prisma.order.count(),

      prisma.order.count({
        where: {
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      }),

      prisma.product.count(),

      prisma.product.count({
        where: {
          inStock: {
            lt: 10,
          },
        },
      }),

      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          isPaid: true,
        },
      }),

      prisma.order.aggregate({
        _sum: {
          total: true,
        },
        where: {
          isPaid: true,
          createdAt: {
            gte: firstDayOfMonth,
          },
        },
      }),

      prisma.product.findMany({
        include: {
          OrderItem: {
            where: {
              order: {
                createdAt: {
                  gte: start,
                  lte: end,
                },
              },
            },
          },
          category: true,
        },
      }),

      prisma.category.findMany({
        include: {
          Product: {
            include: {
              OrderItem: {
                where: {
                  order: {
                    createdAt: {
                      gte: start,
                      lte: end,
                    },
                  },
                },
              },
            },
          },
        },
      }),
    ])

    const topProductsWithNames = allProducts.map(product => ({
      name: product.title,
      sales: product.OrderItem.reduce((sum, item) => sum + (item.quantity ?? 0), 0),
      description: product.description,
      inStock: product.inStock,
      price: product.price,
      sizes: product.sizes,
      slug: product.slug,
      tags: product.tags,
      gender: product.gender,
      category: product.category.name,
    }))

    const categorySalesMap: Record<string, number> = {}
    allCategories.forEach(category => {
      const sales = category.Product.reduce((sum, product) => {
        return sum + product.OrderItem.reduce((productSum, item) => productSum + (item.quantity ?? 0), 0)
      }, 0)
      categorySalesMap[category.name] = sales
    })

    const sortedSalesByCategory = Object.entries(categorySalesMap)
      .map(([category, sales]) => ({ category, sales }))
      .sort((a, b) => b.sales - a.sales)

    return {
      ok: true,
      totalUsers,
      newUsersThisMonth,
      totalOrders,
      ordersThisMonth,
      totalProducts,
      lowStockProducts,
      totalRevenue: totalRevenue._sum?.total ?? 0,
      revenueThisMonth: revenueThisMonth._sum?.total ?? 0,
      topSellingProducts: topProductsWithNames,
      salesByCategory: sortedSalesByCategory,
    }
  } catch (error) {
    console.error("Error al obtener las estadísticas:", error)
    return {
      ok: false,
      message: "Error al obtener las estadísticas",
    }
  }
}