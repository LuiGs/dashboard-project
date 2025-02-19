"use server"

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"

export const getPaginatedOrders = async (page = 1, itemsPerPage = 10) => {
  const session = await auth()

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "Debe de estar autenticado",
    }
  }

  // Calculate the number of items to skip
  const skip = (page - 1) * itemsPerPage

  try {
    // Fetch paginated orders
    const orders = await prisma.order.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        OrderAddress: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        user: {
          select: {
            email: true,
          },
        },
      },
      skip: skip,
      take: itemsPerPage,
    })

    // Get total count of orders
    const totalOrders = await prisma.order.count()

    // Calculate total pages
    const totalPages = Math.ceil(totalOrders / itemsPerPage)

    return {
      ok: true,
      orders: orders,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      totalOrders: totalOrders,
    }
  } catch (error) {
    console.error("Error fetching paginated orders:", error)
    return {
      ok: false,
      message: "Error al obtener las órdenes",
    }
  }
}

