import { useState } from 'react'
import type { ProductFilters } from '@/features/products/types'

interface ProductFilterBarProps {
  filters: ProductFilters
  onApply: (filters: ProductFilters) => void
  onClear: () => void
}

export function ProductFilterBar({ filters, onApply, onClear }: ProductFilterBarProps) {
  const [title, setTitle] = useState(filters.title ?? '')
  const [priceMin, setPriceMin] = useState(filters.price_min?.toString() ?? '')
  const [priceMax, setPriceMax] = useState(filters.price_max?.toString() ?? '')

  function handleApply() {
    onApply({
      title: title || undefined,
      price_min: priceMin ? Number(priceMin) : undefined,
      price_max: priceMax ? Number(priceMax) : undefined,
    })
  }

  function handleClear() {
    setTitle('')
    setPriceMin('')
    setPriceMax('')
    onClear()
  }

  return (
    <div className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className="flex flex-col gap-1">
        <label htmlFor="filter-title" className="text-sm font-medium text-gray-700">Title</label>
        <input
          id="filter-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search by title..."
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="filter-price-min" className="text-sm font-medium text-gray-700">Min Price</label>
        <input
          id="filter-price-min"
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="0"
          min="0"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="filter-price-max" className="text-sm font-medium text-gray-700">Max Price</label>
        <input
          id="filter-price-max"
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="9999"
          min="0"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
