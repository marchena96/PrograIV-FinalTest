import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts, fetchProductById, createProduct } from '@/features/products/api'
import type { Product, ProductFilters, PaginationParams } from '@/features/products/types'

export function useProducts(filters: ProductFilters, pagination: PaginationParams) {
  return useQuery({
    queryKey: ['products', filters, pagination],
    queryFn: () => fetchProducts(filters, pagination),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => fetchProductById(id),
    enabled: id > 0,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
      const previousQueries = queryClient.getQueriesData<Product[]>({ queryKey: ['products'] })

      const optimisticProduct: Product = {
        id: Date.now(),
        title: payload.title,
        price: payload.price,
        description: payload.description,
        images: payload.images,
        category: { id: payload.categoryId, name: '', image: '' },
        _optimisticStatus: 'saving',
      }

      for (const [queryKey, data] of previousQueries) {
        queryClient.setQueryData(queryKey, [optimisticProduct, ...(data ?? [])])
      }

      return { previousQueries }
    },
    onError: (_err, _payload, context) => {
      if (context?.previousQueries) {
        for (const [queryKey, data] of context.previousQueries) {
          queryClient.setQueryData(queryKey, data)
        }
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
