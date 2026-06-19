import axiosClient from '@/shared/api/axiosClient'
import type { Product, ProductFilters, PaginationParams, CreateProductPayload } from '@/features/products/types'

export async function fetchProducts(
  filters: ProductFilters,
  pagination: PaginationParams,
): Promise<Product[]> {
  const params: Record<string, string | number> = {
    offset: pagination.offset,
    limit: pagination.limit,
  }
  if (filters.title) params.title = filters.title
  if (filters.price_min !== undefined) params.price_min = filters.price_min
  if (filters.price_max !== undefined) params.price_max = filters.price_max

  const { data } = await axiosClient.get<Product[]>('/products', { params })
  return data
}

export async function fetchProductById(id: number): Promise<Product> {
  const { data } = await axiosClient.get<Product>(`/products/${id}`)
  return data
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product> {
  const { data } = await axiosClient.post<Product>('/products', payload)
  return data
}
