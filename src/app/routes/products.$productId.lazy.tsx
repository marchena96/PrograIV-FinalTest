import { createLazyFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@/features/products/ui/ProductDetailPage'

export const Route = createLazyFileRoute('/products/$productId')({
  component: ProductDetailPage,
})
