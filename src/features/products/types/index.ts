import { z } from 'zod'

export interface Category {
  id: number
  name: string
  image: string
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  category: Category
  _optimisticStatus?: 'saving'
}

export interface ProductFilters {
  title?: string
  price_min?: number
  price_max?: number
}

export interface PaginationParams {
  offset: number
  limit: number
}

export const createProductSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  price: z
    .number({ message: 'El precio debe ser un número' })
    .positive('El precio debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es requerida'),
  imageUrl: z.string().url('Debe ser una URL válida'),
  categoryId: z
    .number({ message: 'Seleccione una categoría' })
    .int()
    .positive(),
})

export type CreateProductFormValues = z.infer<typeof createProductSchema>
