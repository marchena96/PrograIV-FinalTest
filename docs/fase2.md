# Fase 2 — Tipos y esquemas del feature `products`

## Objetivo

Definir el modelo de datos del feature `products` utilizando **Zod schemas** para validación en tiempo de ejecución e **interfaces TypeScript** para tipado estático. Todo el tipado es estricto (cero `any`) y compatible con `erasableSyntaxOnly` (sin `enum`).

## Archivo creado

```
src/features/products/types/index.ts
```

## Interfaces

### `Category`
```ts
interface Category {
  id: number
  name: string
  image: string
}
```
Categoría anidada dentro de cada producto devuelto por la API.

### `Product`
```ts
interface Product {
  id: number
  title: string
  price: number
  description: string
  images: string[]
  category: Category
  _optimisticStatus?: 'saving'
}
```
Representa un producto del endpoint `GET /products`. Incluye `_optimisticStatus` opcional para el patrón **Optimistic UI** (Fase 4): se marca como `'saving'` mientras se espera la confirmación del servidor.

### `ProductFilters`
```ts
interface ProductFilters {
  title?: string
  price_min?: number
  price_max?: number
}
```
Parámetros de filtrado que se enviarán como query params a la API. Todos son opcionales; cuando están presentes, el servidor filtra (no es filtrado local).

### `PaginationParams`
```ts
interface PaginationParams {
  offset: number
  limit: number
}
```
Control de paginación del lado del servidor. `offset` indica el desplazamiento y `limit` la cantidad de registros por página.

## Zod Schema

### `createProductSchema`
```ts
export const createProductSchema = z.object({
  title:       z.string().min(1, 'El título es requerido'),
  price:       z.number({ message: 'El precio debe ser un número' }).positive('El precio debe ser mayor a 0'),
  description: z.string().min(1, 'La descripción es requerida'),
  imageUrl:    z.string().url('Debe ser una URL válida'),
  categoryId:  z.number({ message: 'Seleccione una categoría' }).int().positive(),
})
```

Campos validados:

| Campo | Tipo | Restricción |
|---|---|---|
| `title` | `string` | No vacío |
| `price` | `number` | Positivo |
| `description` | `string` | No vacío |
| `imageUrl` | `string` | URL válida |
| `categoryId` | `number` | Entero positivo |

### `CreateProductFormValues`
```ts
export type CreateProductFormValues = z.infer<typeof createProductSchema>
```
Tipo inferido automáticamente desde el schema Zod. Se usa en el formulario de creación (Fase 5) con `@tanstack/zod-form-adapter`.

## Decisiones técnicas

- **`imageUrl` como string único** — el formulario pide una sola URL; la capa API (Fase 3) la convierte en el arreglo `[url]` que espera `POST /products`.
- **`_optimisticStatus` no está en el schema Zod** — es interno de la aplicación, no se valida ni se envía al servidor.
- **Sin `enum`** — compatible con `erasableSyntaxOnly: true` del tsconfig.
- **`import { z } from 'zod'`** — importación normal (valor, no tipo), válida con `verbatimModuleSyntax`.

## Verificación

```bash
npx tsc -b --noEmit     # Sin errores
```
