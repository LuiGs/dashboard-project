"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/auth.config"

interface GetStatisticsPerDateParams {
  startDate?: string
  endDate?: string
}

export const getStatisticsPerDate = async ({ startDate, endDate }: GetStatisticsPerDateParams) => {
  const session = await auth()

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "Debe ser un usuario administrador",
    }
  }

  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const start = startDate ? new Date(startDate) : firstDayOfMonth
  const end = endDate ? new Date(endDate) : now

  try {
    const [products, orders, users] = await Promise.all([
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
        },
      }),

      prisma.order.findMany({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        include: {
          OrderItem: true,
          user: true,
        },
      }),

      prisma.user.findMany({
        include: {
          Order: {
            where: {
              createdAt: {
                gte: start,
                lte: end,
              },
            },
          },
        },
      }),
    ])

    const productsData = products.map((product) => ({
      ...product,
      totalRevenue: product.OrderItem.reduce((sum, item) => sum + item.price * item.quantity, 0),
      totalSales: product.OrderItem.reduce((sum, item) => sum + item.quantity, 0),
    }))

    const ordersData = orders.map((order) => ({
      ...order,
      totalRevenue: order.OrderItem.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }))

    const usersData = users.map((user) => ({
      ...user,
      totalOrders: user.Order.length,
      totalSpent: user.Order.reduce((sum, order) => sum + order.total, 0),
    }))

    return {
      ok: true,
      products: productsData,
      orders: ordersData,
      users: usersData,
    }
  } catch (error) {
    console.error("Error al obtener las estadísticas por fecha:", error)
    return {
      ok: false,
      message: "Error al obtener las estadísticas por fecha",
    }
  }
}