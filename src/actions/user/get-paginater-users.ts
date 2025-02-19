"use server"

import { auth } from "@/auth.config"
import prisma from "@/lib/prisma"

export const getPaginatedUsers = async (page = 1, itemsPerPage = 10) => {
  const session = await auth()

  if (session?.user.role !== "admin") {
    return {
      ok: false,
      message: "Debe de ser un usuario administrador",
    }
  }

  // Calculate the number of items to skip
  const skip = (page - 1) * itemsPerPage

  try {
    // Fetch paginated users
    const users = await prisma.user.findMany({
      orderBy: {
        name: "desc",
      },
      skip: skip,
      take: itemsPerPage,
    })

    // Get total count of users
    const totalUsers = await prisma.user.count()

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / itemsPerPage)

    return {
      ok: true,
      users: users,
      currentPage: page,
      totalPages: totalPages,
      itemsPerPage: itemsPerPage,
      totalUsers: totalUsers,
    }
  } catch (error) {
    console.error("Error fetching paginated users:", error)
    return {
      ok: false,
      message: "Error al obtener los usuarios",
    }
  }
}

