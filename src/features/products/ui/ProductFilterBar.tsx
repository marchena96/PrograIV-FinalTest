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
    <div className="flex flex-wrap items-end gap-4 p-5 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-title" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Title</label>
        <input
          id="filter-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          placeholder="Search by title..."
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-price-min" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Min Price</label>
        <input
          id="filter-price-min"
          type="number"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          placeholder="0"
          min="0"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="filter-price-max" className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Max Price</label>
        <input
          id="filter-price-max"
          type="number"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
          placeholder="9999"
          min="0"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
        >
          Apply
        </button>
        <button
          onClick={handleClear}
          className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 active:bg-gray-300 border border-gray-300 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
