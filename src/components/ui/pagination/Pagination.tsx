"use client"

import { generatePaginationNumbers } from "@/utils"
import clsx from "clsx"
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5"

interface Props {
  totalPages: number
  currentPage: number
  onPageChange: (page: number) => void
}

export const Pagination = ({ totalPages, currentPage, onPageChange }: Props) => {
  const allPages = generatePaginationNumbers(currentPage, totalPages)

  return (
    <div className="flex text-center justify-center mt-10 mb-32">
      <nav aria-label="Page navigation">
        <ul className="flex list-style-none">
          <li className="page-item">
            <button
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <IoChevronBackOutline size={30} />
            </button>
          </li>

          {allPages.map((page, index) => (
            <li key={index} className="page-item">
              <button
                className={clsx(
                  "page-link relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none",
                  {
                    "bg-blue-600 shadow-sm text-white hover:text-white hover:bg-blue-700": page === currentPage,
                  },
                )}
                onClick={() => {
                  if (typeof page === "number") {
                    onPageChange(page)
                  }
                }}
                disabled={page === "..."}
              >
                {page}
              </button>
            </li>
          ))}

          <li className="page-item">
            <button
              className="page-link relative block py-1.5 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-800 hover:text-gray-800 hover:bg-gray-200 focus:shadow-none"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <IoChevronForwardOutline size={30} />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  )
}

