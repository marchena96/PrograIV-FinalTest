import { useState } from 'react'
import { useProducts } from '@/features/products/hooks'
import { ProductFilterBar } from './ProductFilterBar'
import { ProductTable } from './ProductTable'
import { ProductCreateForm } from './ProductCreateForm'
import Spinner from '@/shared/components/Spinner'
import { useProductUIStore } from '@/store/useProductUIStore'
import type { ProductFilters, PaginationParams } from '@/features/products/types'

export function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({})
  const [pagination, setPagination] = useState<PaginationParams>({ offset: 0, limit: 10 })
  const { isCreateModalOpen, openCreateModal, closeCreateModal } = useProductUIStore()

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



    const hasPrevious = pagination.offset > 0
  const hasMore = data && data.length >= pagination.limit

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-sm text-gray-500 mt-1">Administra el catálogo de productos</p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      <ProductFilterBar
        filters={filters}
        onApply={handleApply}
        onClear={handleClear}
      />

      {isLoading && (
        <div className="flex justify-center py-16">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl flex items-center gap-3">
          <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">{error instanceof Error ? error.message : 'Failed to load products'}</span>
        </div>
      )}

      {data && (
        <>
          <ProductTable data={data} />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
            <span className="text-sm text-gray-600 order-2 sm:order-1">
              Mostrando <span className="font-semibold text-gray-900">{data.length === 0 ? 0 : pagination.offset + 1}</span>
              –<span className="font-semibold text-gray-900">{pagination.offset + data.length}</span> de <span className="font-semibold text-gray-900">{hasMore ? `${pagination.offset + data.length}+` : pagination.offset + data.length}</span>
            </span>

            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={handlePrevPage}
                disabled={!hasPrevious}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg border border-gray-200">
                {currentPage}
              </span>

              <button
                onClick={handleNextPage}
                disabled={!hasMore}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                Next
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeCreateModal}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900">Crear Producto</h2>
              <button
                onClick={closeCreateModal}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Cerrar modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ProductCreateForm onSuccess={closeCreateModal} onCancel={closeCreateModal} />
          </div>
        </div>
      )}
    </div>
  )
}
