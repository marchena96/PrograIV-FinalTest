import { Link, useParams } from '@tanstack/react-router'
import { useProduct } from '@/features/products/hooks'
import { formatPrice, getFirstImage } from '@/shared/utils'
import Spinner from '@/shared/components/Spinner'

export function ProductDetailPage() {
  const { productId } = useParams({ from: '/products/$productId' })
  const { data: product, isLoading, isError, error } = useProduct(Number(productId))

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">
            {isError && error instanceof Error ? error.message : 'Product not found'}
          </p>
          <Link
            to="/products"
            className="inline-block mt-4 text-sm text-red-600 hover:text-red-800 underline"
          >
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const mainImage = getFirstImage(product.images)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        to="/products"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Products
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          <div>
            <img
              src={mainImage}
              alt={product.title}
              className="w-full aspect-square object-cover rounded-lg bg-gray-100"
            />
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                {product.category.name}
              </p>
              <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            </div>

            <p className="text-3xl font-bold text-blue-600">{formatPrice(product.price)}</p>

            <div>
              <h2 className="text-sm font-semibold text-gray-700 mb-1">Description</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
