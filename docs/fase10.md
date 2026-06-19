# Fase 10 — Vista de detalle de producto

## Objetivo

Crear una página de detalle para cada producto, accesible desde la tabla de productos mediante un link en el título.

## Archivos creados

| Archivo | Propósito |
|---|---|
| `src/features/products/ui/ProductDetailPage.tsx` | Componente de la vista detalle |
| `src/app/routes/products.$productId.lazy.tsx` | Ruta dinámica `/products/$productId` |

## Archivos modificados

| Archivo | Cambios |
|---|---|
| `src/features/products/api/index.ts` | Nueva función `fetchProductById(id)` → `GET /products/{id}` |
| `src/features/products/hooks/index.ts` | Nuevo hook `useProduct(id)` con React Query |
| `src/features/products/ui/ProductTable.tsx` | Columna `title` cambia a `<Link>` hacía `/products/$productId` |

## Flujo de navegación

```
ProductsPage ( /products )
  └── clic en título del producto
        └── ProductDetailPage ( /products/123 )
              └── "Back to Products" → /products
```

## Componente ProductDetailPage

- **Loading:** Muestra `<Spinner size="lg" />` centrado
- **Error:** Banner rojo con mensaje de error + link "Back to Products"
- **Success:** Layout de dos columnas (md:+) con:
  - Imagen principal del producto (`aspect-square`, `object-cover`, `rounded-lg`)
  - Categoría, título, precio (azul destacado), descripción
- **Navegación:** Link "Back to Products" con icono chevron left

## API y Data Fetching

- `fetchProductById(id)`: llama a `GET https://api.escuelajs.co/api/v1/products/{id}`
- `useProduct(id)`: `useQuery` con `queryKey: ['products', id]`, deshabilitado si `id <= 0`

## Verificación

```bash
npx tsc -b --noEmit       # Sin errores
npx vite build            # Build exitoso, chunk separado: products._productId.lazy (2.26 kB)
```
