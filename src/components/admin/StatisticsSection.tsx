"use client"

import React, { useState, useEffect } from "react"
import { FaUsers, FaShoppingCart, FaTshirt, FaMoneyBillWave, FaChartBar, FaTable } from "react-icons/fa"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { DatePickerDemo } from "../ui/date-picker"
import { getStatistics } from "@/actions"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

interface Statistics {
  totalUsers: number
  newUsersThisMonth: number
  totalOrders: number
  ordersThisMonth: number
  totalProducts: number
  lowStockProducts: number
  totalRevenue: number
  revenueThisMonth: number
  topSellingProducts: { name: string; sales: number, description: string, inStock: number, price: number, sizes: string[], slug: string, tags: string[], gender: string, category: string }[]
  salesByCategory: { category: string; sales: number }[]
}


export default function StatisticsSection() {
  const [stats, setStats] = useState<Statistics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"charts" | "tables">("charts")
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [productLimit, setProductLimit] = useState<number>(5)
  const [categoryLimit, setCategoryLimit] = useState<number>(4)

  const fetchStatistics = async (startDate?: string, endDate?: string) => {
    const data = await getStatistics({ startDate, endDate })
    if (data.ok && "totalUsers" in data) {
      setStats(data as Statistics)
      setError(null)
    } else {
      setStats(null)
      setError(data.message || "Error al cargar las estadísticas")
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  const handleDateChange = () => {
    const start = startDate ? startDate.toISOString().split("T")[0] : undefined
    const end = endDate ? endDate.toISOString().split("T")[0] : undefined
    fetchStatistics(start, end)
  }

  const handleProductLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (value > 0) {
      setProductLimit(value)
    }
  }

  const handleCategoryLimitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (value > 0) {
      setCategoryLimit(value)
    }
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  if (!stats) {
    return <div>Cargando inicio...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "charts" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("charts")}
        >
          <FaChartBar className="inline-block mr-2" /> Gráficos
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${activeTab === "tables" ? "bg-purple-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveTab("tables")}
        >
          <FaTable className="inline-block mr-2" /> Tablas
        </button>
        <div className="flex items-center space-x-2">
          <h1>Desde:</h1>
          <DatePickerDemo date={startDate} setDate={setStartDate} />
          <h1>Hasta:</h1>
          <DatePickerDemo date={endDate} setDate={setEndDate} />
          <button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg"
            onClick={handleDateChange}
          >
            Filtrar
          </button>
        </div>
      </div>

      {activeTab === "charts" ? <ChartsView stats={stats} productLimit={productLimit} categoryLimit={categoryLimit} handleProductLimitChange={handleProductLimitChange} handleCategoryLimitChange={handleCategoryLimitChange} /> : <TablesView stats={stats} productLimit={productLimit} categoryLimit={categoryLimit} handleProductLimitChange={handleProductLimitChange} handleCategoryLimitChange={handleCategoryLimitChange} />}
    </div>
  )
}

function ChartsView({ stats, productLimit, categoryLimit, handleProductLimitChange, handleCategoryLimitChange }: { stats: Statistics, productLimit: number, categoryLimit: number, handleProductLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleCategoryLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {

  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const topSellingProductsData = React.useMemo(() => stats.topSellingProducts.sort((a, b) => b.sales - a.sales).slice(0, productLimit), [stats.topSellingProducts, productLimit]);
  const salesByCategoryData = React.useMemo(() => stats.salesByCategory.sort((a, b) => b.sales - a.sales).slice(0, categoryLimit), [stats.salesByCategory, categoryLimit]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Usuarios Historicos"
          value={stats.totalUsers}
          icon={<FaUsers className="text-blue-500" />}
          subtext={`+${stats.newUsersThisMonth} este mes`}
        />
        <StatCard
          title="Órdenes Historicas"
          value={stats.totalOrders}
          icon={<FaShoppingCart className="text-green-500" />}
          subtext={`${stats.ordersThisMonth} este mes`}
        />
        <StatCard
          title="Productos"
          value={stats.totalProducts}
          icon={<FaTshirt className="text-purple-500" />}
          subtext={`${stats.lowStockProducts} con stock bajo`}
        />
        <StatCard
          title="Ingresos Historicos"
          value={stats.totalRevenue}
          icon={<FaMoneyBillWave className="text-yellow-500" />}
          subtext={`+$${stats.revenueThisMonth.toLocaleString()} este mes`}
          isCurrency={true}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Productos Más Vendidos</h3>
            <input
              type="number"
              min="1"
              value={productLimit}
              onChange={handleProductLimitChange}
              className="border rounded p-2"
              placeholder="Número de barras"
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSellingProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Ventas por Categoría</h3>
            <input
              type="number"
              min="1"
              value={categoryLimit}
              onChange={handleCategoryLimitChange}
              className="border rounded p-2"
              placeholder="Número de barras"
            />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByCategoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </>
  );
}

function TablesView({ stats, productLimit, categoryLimit, handleProductLimitChange, handleCategoryLimitChange }: { stats: Statistics, productLimit: number, categoryLimit: number, handleProductLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void, handleCategoryLimitChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const topSellingProductsData = React.useMemo(() => stats.topSellingProducts, [stats.topSellingProducts]);
  const salesByCategoryData = React.useMemo(() => stats.salesByCategory, [stats.salesByCategory]);

  const topSellingProductsColumns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'name',
      header: 'Producto',
    },
    {
      accessorKey: 'sales',
      header: 'Ventas',
      cell: info => info.getValue(),
    },
    {
      accessorKey: 'inStock',
      header: 'Stock',
    },
    {
      accessorKey: 'price',
      header: 'Precio',
    },
    {
      accessorKey: 'sizes',
      header: 'Tallas',
      cell: info => (info.getValue() as string[] || []).join(', '),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
    },
    {
      accessorKey: 'gender',
      header: 'Género',
    },
  ], []);

  const salesByCategoryColumns = React.useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'category',
      header: 'Categoría',
    },
    {
      accessorKey: 'sales',
      header: 'Ventas',
      cell: info => info.getValue(),
    },
  ], []);

  const topSellingProductsTable = useReactTable({
    data: topSellingProductsData,
    columns: topSellingProductsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const salesByCategoryTable = useReactTable({
    data: salesByCategoryData,
    columns: salesByCategoryColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const sortedTopSellingProducts = topSellingProductsTable.getSortedRowModel().rows.slice(0, productLimit);
  const sortedSalesByCategory = salesByCategoryTable.getSortedRowModel().rows.slice(0, categoryLimit);

  const exportPDF = async () => {
    const doc = new jsPDF();
    const tables = document.querySelectorAll('.table-container');
  
    let yOffset = 0;
  
    for (let i = 0; i < tables.length; i++) {
      const canvas = await html2canvas(tables[i] as HTMLElement);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      if (yOffset + pdfHeight > doc.internal.pageSize.getHeight()) {
        doc.addPage();
        yOffset = 0;
      }
  
      doc.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, pdfHeight);
      yOffset += pdfHeight;
    }
  
    doc.save('tablas.pdf');
  };

  return (
    <div className="space-y-6">
      <button
        className="px-4 py-2 bg-red-500 text-white rounded-lg"
        onClick={exportPDF}
      >
        Exportar como PDF
      </button>

      <div className="bg-white p-4 rounded-lg shadow table-container">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Lista de Productos</h3>
          <input
            type="number"
            min="1"
            value={productLimit}
            onChange={handleProductLimitChange}
            className="border rounded p-2"
            placeholder="Número de filas"
          />
        </div>
        <table className="min-w-full">
          <thead>
            {topSellingProductsTable.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="text-left cursor-pointer"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === 'desc' ? ' 🔽' : ' 🔼') : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {sortedTopSellingProducts.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="text-left">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-4 rounded-lg shadow table-container">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Lista de Categorias</h3>
          <input
            type="number"
            min="1"
            value={categoryLimit}
            onChange={handleCategoryLimitChange}
            className="border rounded p-2"
            placeholder="Número de filas"
          />
        </div>
        <table className="min-w-full">
          <thead>
            {salesByCategoryTable.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="text-left cursor-pointer"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() ? (header.column.getIsSorted() === 'desc' ? ' 🔽' : ' 🔼') : null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {sortedSalesByCategory.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="text-left">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string
  value: number
  icon: React.ReactNode
  subtext?: string
  isCurrency?: boolean
}

function StatCard({ title, value, icon, subtext, isCurrency = false }: StatCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-semibold">{isCurrency ? `$${value.toLocaleString()}` : value}</p>
          {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  )
}