import { useState } from 'react'
import { useProducts } from '@/features/products/hooks'
import { ProductFilterBar } from './ProductFilterBar'
import { ProductTable } from './ProductTable'
import { ProductCreateForm } from './ProductCreateForm'
import Spinner from '@/shared/components/Spinner'
import type { ProductFilters, PaginationParams } from '@/features/products/types'

export function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({})
  const [pagination, setPagination] = useState<PaginationParams>({ offset: 0, limit: 10 })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, isError, error } = useProducts(filters, pagination)

  function handleApply(newFilters: ProductFilters) {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  function handleClear() {
    setFilters({})
    setPagination((prev) => ({ ...prev, offset: 0 }))
  }

  function handleNextPage() {
    setPagination((prev) => ({ ...prev, offset: prev.offset + prev.limit }))
  }

  function handlePrevPage() {
    setPagination((prev) => ({ ...prev, offset: Math.max(0, prev.offset - prev.limit) }))
  }

  function openModal() { setIsModalOpen(true) }
  function closeModal() { setIsModalOpen(false) }

  const hasPrevious = pagination.offset > 0
  const hasMore = data && data.length >= pagination.limit

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>

      <ProductFilterBar
        filters={filters}
        onApply={handleApply}
        onClear={handleClear}
      />

      {isLoading && (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error instanceof Error ? error.message : 'Failed to load products'}
        </div>
      )}

      {data && (
        <>
          <ProductTable data={data} />

          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevPage}
              disabled={!hasPrevious}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            <span className="text-sm text-gray-600">
              Showing {data.length === 0 ? 0 : pagination.offset + 1}
              –{pagination.offset + data.length}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!hasMore}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">Crear Producto</h2>
            <ProductCreateForm onSuccess={closeModal} onCancel={closeModal} />
          </div>
        </div>
      )}
    </div>
  )
}
