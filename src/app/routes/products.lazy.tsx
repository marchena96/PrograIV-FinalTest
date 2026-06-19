import { createLazyFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/products/ui/ProductsPage'

export const Route = createLazyFileRoute('/products')({
  component: ProductsPage,
})
