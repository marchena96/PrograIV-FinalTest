# Fase 4 — Hooks del feature `products`

## Objetivo

Implementar los hooks de TanStack Query que conectan la capa API con los componentes UI:

1. **`useProducts`** — `useQuery` para obtener la lista paginada y filtrada.
2. **`useCreateProduct`** — `useMutation` con **Optimistic UI**: el producto aparece inmediatamente en la tabla mientras se espera la confirmación del servidor.

## Archivo creado

```
src/features/products/hooks/index.ts
```

## `useProducts`

```ts
export function useProducts(filters: ProductFilters, pagination: PaginationParams) {
  return useQuery({
    queryKey: ['products', filters, pagination],
    queryFn: () => fetchProducts(filters, pagination),
  })
}
```

- **Query Key:** `['products', filters, pagination]` — cada combinación de filtros+página tiene su propia entrada en caché.
- **Query Function:** llama a `fetchProducts` con los mismos argumentos.
- **Retorno:** `UseQueryResult<Product[], Error>` — expone `data`, `isLoading`, `isError`, `error`, `refetch`, etc.
- **Estabilidad:** el consumidor debe memorizar los objetos `filters` y `pagination` (con `useMemo` o `useState`) para evitar refetches innecesarios.

## `useCreateProduct`

```ts
export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onMutate: async (payload) => { /* ... */ },
    onError: (_err, _payload, context) => { /* ... */ },
    onSettled: () => { /* ... */ },
  })
}
```

### Flujo Optimistic UI

```
  Usuario hace clic en "Crear"
         │
         ▼
   onMutate(payload)
         │
         ├── 1. Cancelar queries activas ['products']
         │     (evita race conditions con refetches)
         │
         ├── 2. Guardar snapshot de todas las cachés
         │     queryClient.getQueriesData<Product[]>({ queryKey: ['products'] })
         │
         ├── 3. Crear producto optimista
         │     {
         │       id: Date.now(),
         │       title, price, description, images,
         │       category: { id: categoryId, name: '', image: '' },
         │       _optimisticStatus: 'saving',   // ← marca visual
         │     }
         │
         └── 4. Insertar al inicio de cada caché
               queryClient.setQueryData(queryKey, [optimisticProduct, ...old])
         │
         ▼
   createProduct(payload)  ← llamada real a POST /products
         │
         ├── Éxito ──► onSettled: invalidateQueries(['products'])
         │               (los datos reales reemplazan el optimista)
         │
         └── Error ──► onError: restaurar snapshots
                        ──► onSettled: invalidateQueries(['products'])
```

### Detalle de callbacks

#### `onMutate`

| Paso | Código |
|---|---|
| Cancelar queries | `queryClient.cancelQueries({ queryKey: ['products'] })` |
| Snapshot | `queryClient.getQueriesData<Product[]>({ queryKey: ['products'] })` |
| Producto optimista | `id: Date.now()`, `_optimisticStatus: 'saving'` |
| Insertar en caché | `setQueryData(key, [optimisticProduct, ...data])` |
| Retornar contexto | `{ previousQueries }` para rollback |

#### `onError`

Restaura cada query key a su dato anterior:

```ts
for (const [queryKey, data] of context.previousQueries) {
  queryClient.setQueryData(queryKey, data)
}
```

#### `onSettled`

Siempre invalida para asegurar consistencia:

```ts
queryClient.invalidateQueries({ queryKey: ['products'] })
```

### Retorno

`UseMutationResult<Product, Error, CreateProductPayload, { previousQueries: ... }>`

El consumidor usa:

```ts
const { mutate, isPending } = useCreateProduct()

mutate({
  title: 'Nuevo',
  price: 100,
  description: '...',
  images: ['https://...'],
  categoryId: 1,
})
```

## Decisiones técnicas

- **`getQueriesData` con queryKey parcial `['products']`** — afecta a todas las queries que comiencen con `'products'`, incluyendo las distintas combinaciones de filtros/paginación.
- **Parámetros con prefijo `_`** — `_err`, `_payload` evitan errores de `noUnusedParameters` sin suprimir la advertencia global.
- **`Date.now()` como ID temporal** — único dentro de la sesión, suficiente mientras el producto es optimista.
- **`category` mínimo** — solo se guarda `{ id: categoryId, name: '', image: '' }` porque el servidor devuelve el objeto completo al confirmar.
- **`invalidateQueries` en `onSettled`** — fuerza una recarga de todas las queries de productos, reemplazando los datos optimistas con la respuesta real del servidor.
- **Sin tipado genérico explícito** — TanStack Query v5 infiere `TVariables`, `TData`, `TError` y `TContext` automáticamente desde `mutationFn` y el retorno de `onMutate`.

## Verificación

```bash
npx tsc -b --noEmit     # Sin errores
```
