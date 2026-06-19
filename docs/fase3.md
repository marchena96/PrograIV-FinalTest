# Fase 3 — Capa API del feature `products`

## Objetivo

Implementar las funciones Axios que se comunican con la **Platzi Fake Store API**. Dos operaciones:

1. **`GET /products`** con paginación server-side (`offset`/`limit`) y filtros (`title`, `price_min`, `price_max`).
2. **`POST /products`** para crear un nuevo producto.

Todas las funciones están tipadas con `Promise<Product[]>` / `Promise<Product>` y usan el cliente Axios compartido (`shared/api/axiosClient`).

## Archivos modificados/creados

### `src/features/products/types/index.ts` (modificado)

Se agregó la interfaz `CreateProductPayload`, que describe el cuerpo que espera el endpoint `POST /products`:

```ts
export interface CreateProductPayload {
  title: string
  price: number
  description: string
  images: string[]
  categoryId: number
}
```

**Nota:** A diferencia de `CreateProductFormValues` (que tiene `imageUrl: string` para el formulario), `CreateProductPayload` usa `images: string[]` como exige la API. La transformación de `{ imageUrl }` a `{ images: [imageUrl] }` se hará en la capa de hooks (Fase 4).

### `src/features/products/api/index.ts` (creado)

```ts
import axiosClient from '@/shared/api/axiosClient'
import type { Product, ProductFilters, PaginationParams, CreateProductPayload } from '@/features/products/types'
```

#### `fetchProducts`

```ts
export async function fetchProducts(
  filters: ProductFilters,
  pagination: PaginationParams,
): Promise<Product[]>
```

- Construye los query params: siempre incluye `offset` y `limit`; agrega `title`, `price_min`, `price_max` solo si están definidos.
- Llama a `GET /products` con `axiosClient.get<Product[]>`.
- Retorna la respuesta deserializada directamente.

| Query param | Fuente |
|---|---|
| `offset` | `pagination.offset` |
| `limit` | `pagination.limit` |
| `title` | `filters.title` (si existe) |
| `price_min` | `filters.price_min` (si existe) |
| `price_max` | `filters.price_max` (si existe) |

#### `createProduct`

```ts
export async function createProduct(
  payload: CreateProductPayload,
): Promise<Product>
```

- Envía `POST /products` con el cuerpo tipado `{ title, price, description, images, categoryId }`.
- Retorna el producto creado (incluyendo el `id` asignado por el servidor).

## Decisiones técnicas

- **Filtros condicionales:** solo se agregan al `params` si están definidos, evitando enviar `undefined` como query string.
- **`Record<string, string \| number>`** para los params — TipScript infiere el tipo correctamente y Axios serializa los valores.
- **`const { data } = await axiosClient.get<T>()`** — destructuración directa del `data` de Axios; la función retorna `T`, no un `AxiosResponse<T>`.
- **No se manejan errores aquí** — el interceptor de `axiosClient` normaliza los errores a `Error` con mensaje legible; el manejo de errores se hace en la capa de hooks (TanStack Query).
- **`import type`** — respeta `verbatimModuleSyntax: true` al importar solo tipos.

## Verificación

```bash
npx tsc -b --noEmit     # Sin errores
```
