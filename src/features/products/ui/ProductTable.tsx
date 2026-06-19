import { Link } from '@tanstack/react-router'
import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table'
import { formatPrice, getFirstImage, truncateText } from '@/shared/utils'
import type { Product } from '@/features/products/types'

const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor('id', {
    header: 'ID',
    cell: (info) => (
      <span className="font-mono text-gray-500">#{info.getValue()}</span>
    ),
  }),
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (info) => (
      <Link
        to="/products/$productId"
        params={{ productId: info.row.original.id.toString() }}
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
      >
        {info.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('images', {
    header: 'Image',
    cell: (info) => (
      <img
        src={getFirstImage(info.getValue())}
        alt=""
        className="w-12 h-12 object-cover rounded"
      />
    ),
  }),
  columnHelper.accessor('price', {
    header: 'Price',
    cell: (info) => formatPrice(info.getValue()),
  }),
  columnHelper.accessor('description', {
    header: 'Description',
    cell: (info) => (
      <span className="block max-w-xs truncate" title={info.getValue()}>
        {truncateText(info.getValue(), 60)}
      </span>
    ),
  }),
  columnHelper.accessor((row) => row.category.id, {
    id: 'categoryId',
    header: 'Category',
    cell: (info) => <span className="font-mono text-xs">#{info.getValue()}</span>,
  }),
  columnHelper.accessor('_optimisticStatus', {
    id: 'status',
    header: 'Status',
    cell: (info) => {
      const status = info.getValue()
      if (status === 'saving') {
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Saving…
          </span>
        )
      }
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Synced
        </span>
      )
    },
  }),
]

interface ProductTableProps {
  data: Product[]
}

export function ProductTable({ data }: ProductTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200">
          {table.getRowModel().rows.map((row, i) => (
            <tr key={row.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-blue-50/50 transition-colors`}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
