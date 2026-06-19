# CONVENTIONS — Bitácora de Desarrollo

## Fase 0: Configuración global de herramientas ✅

### Prompt utilizado
Plan arquitectónico global con Vertical Slices + Layered Architecture:
`@tanstack/react-query`, `@tanstack/react-table`, `@tanstack/react-form`,
`@tanstack/react-router`, `axios`, `zod`, `zustand`, `tailwindcss v4`.

### Archivos modificados/creados

| Archivo | Acción |
|---|---|
| `package.json` | Dependencias instaladas |
| `vite.config.ts` | Agregados plugins: `TanStackRouterVite`, `tailwindcss`, alias `@/` |
| `tsconfig.app.json` | Agregados `baseUrl: "."` y `paths: { "@/*": ["src/*"] }` |
| `src/index.css` | Reemplazado con directiva `@import "tailwindcss"` + tema básico |
| `src/App.css` | Eliminado (boilerplate) |
| `src/App.tsx` | Limpiado a placeholder mínimo con Tailwind |
| `index.html` | Título actualizado |
| `src/app/routes/` | Directorio creado (para TanStack Router) |
| `src/features/products/{api,hooks,types,ui}/` | Directorios creados (Vertical Slice) |
| `src/shared/{api,components,utils}/` | Directorios creados (capa compartida) |
| `src/store/` | Directorio creado (Zustand) |
| `CONVENTIONS.md` | Creado |

### Cumplimiento del requerimiento
- [x] Herramientas instaladas y configuradas
- [x] Estructura de carpetas Vertical Slices aplicada
- [x] Tailwind v4 con plugin Vite nativo
- [x] Path alias `@/` funcional
- [x] Proyecto compila (`npm run dev` debe iniciar sin errores)

### Notas técnicas
- Se usó `zod@3.25.76` en lugar de `zod@4` por compatibilidad con
  `@tanstack/zod-form-adapter@0.42.1`
- `@tailwindcss/vite@4.3.1` plugin nativo de Vite (sin PostCSS)
- Tailwind v4 sin archivo de configuración — tema definido en CSS con `@theme`
- Se agregó `"ignoreDeprecations": "6.0"` en tsconfig por deprecación de `baseUrl` en TS 6.0

## Fase 1: Capa Compartida (`shared/`) ✅

### Prompt utilizado
Construcción de la capa shared: cliente Axios, Spinner, utilidades de formato.

### Archivos modificados/creados

| Archivo | Acción |
|---|---|
| `src/shared/api/axiosClient.ts` | Creado — instancia Axios con `baseURL` e interceptor de errores |
| `src/shared/components/Spinner.tsx` | Creado — SVG spinner con props `size` (sm/md/lg) y aria-label |
| `src/shared/utils/index.ts` | Creado — `formatPrice`, `getFirstImage`, `truncateText` |
| `tsconfig.app.json` | Agregado `ignoreDeprecations: "6.0"` |
| `src/App.tsx` | Corregido — faltaba `export default function App()` |

### Cumplimiento del requerimiento
- [x] `axiosClient` con URL base, Content-Type e interceptor de errores
- [x] `Spinner` accesible con `role="status"` y `aria-label`
- [x] Utilidades puras sin efectos secundarios
- [x] Tipado estricto (cero `any`)
- [x] Build pasa sin errores (`tsc -b --noEmit`)

### API de shared exports
```ts
// axiosClient
export default axiosClient  // instancia Axios configurada

// Spinner
<Spinner size="sm" | "md" | "lg" />

// Utils
formatPrice(price: number): string          // "$1,234.56"
getFirstImage(images: string[]): string     // primer URL o placeholder
truncateText(text: string, max: number): string  // "texto…"
```

## Fase 2: Tipos del feature `products` ✅

### Prompt utilizado
Crear esquemas Zod e interfaces TypeScript para Product, ProductFilters, PaginationParams y CreateProductFormValues.

### Archivos creados

| Archivo | Acción |
|---|---|
| `src/features/products/types/index.ts` | Creado — interfaces y schemas de la feature |

### Tipos exportados

```ts
// Interfaces
Category          { id: number; name: string; image: string }
Product           { id; title; price; description; images; category; _optimisticStatus? }
ProductFilters    { title?; price_min?; price_max? }
PaginationParams  { offset: number; limit: number }

// Zod schema
createProductSchema  // title (string.min(1)), price (number.positive), description (string.min(1)), imageUrl (string.url), categoryId (number.int.positive)
CreateProductFormValues  // inferido del schema
```

### Cumplimiento del requerimiento
- [x] Tipado estricto, cero `any`
- [x] Schema Zod compatible con `@tanstack/zod-form-adapter`
- [x] `_optimisticStatus` para Optimistic UI
- [x] Ningún `enum` (compatible con `erasableSyntaxOnly`)
- [x] Build pasa sin errores

## Fase 3: Capa API del feature `products` ✅

### Prompt utilizado
Crear funciones Axios para fetchProducts (GET /products con filtros server-side) y createProduct (POST /products).

### Archivos creados/modificados

| Archivo | Acción |
|---|---|
| `src/features/products/types/index.ts` | Modificado — se agregó `CreateProductPayload` |
| `src/features/products/api/index.ts` | Creado — funciones API |

### API de la capa

```ts
fetchProducts(filters: ProductFilters, pagination: PaginationParams): Promise<Product[]>
  // GET /products?offset=...&limit=...&title=...&price_min=...&price_max=...

createProduct(payload: CreateProductPayload): Promise<Product>
  // POST /products  body: { title, price, description, images, categoryId }
```

### Cumplimiento del requerimiento
- [x] Filtros se envían como query params (no filtrado local)
- [x] Paginación server-side con offset/limit
- [x] `verbatimModuleSyntax` respetado (`import type` para tipos)
- [x] Tipado estricto, cero `any`
- [x] Build pasa sin errores

## Fase 4: Hooks del feature `products` ✅

### Prompt utilizado
Crear hooks TanStack Query con useQuery para listar productos (useProducts) y useMutation con Optimistic UI para crear productos (useCreateProduct).

### Archivos creados

| Archivo | Acción |
|---|---|
| `src/features/products/hooks/index.ts` | Creado — hooks con TanStack Query |

### API de hooks

```ts
useProducts(filters: ProductFilters, pagination: PaginationParams)
  // → UseQueryResult<Product[], Error>
  // queryKey: ['products', filters, pagination]
  // Llama a fetchProducts con los mismos filtros y paginación

useCreateProduct()
  // → UseMutationResult<Product, Error, CreateProductPayload, { previousQueries }>
  // Optimistic: inserta producto temporal con _optimisticStatus:'saving' en todas las cachés de products
  // onError: restaura la caché al snapshot anterior
  // onSettled: invalida todas las queries ['products']
```

### Flujo Optimistic UI
1. **`onMutate`**: cancela queries activas, guarda snapshot, agrega `optimisticProduct` (con `id: Date.now()`, `_optimisticStatus: 'saving'`) al inicio de cada caché de products
2. **`onError`**: restaura cada caché a su snapshot previo
3. **`onSettled`**: invalida todas las queries `['products']` para refrescar con datos reales

### Cumplimiento del requerimiento
- [x] `useQuery` con queryKey que incluye filtros + paginación
- [x] `useMutation` con ciclo completo Optimistic UI (cancel → snapshot → insert → rollback → invalidate)
- [x] `_optimisticStatus` en producto optimista
- [x] Cero `any`, tipado estricto
- [x] Build pasa sin errores

## Fase 5: UI del feature `products` ✅

### Prompt utilizado
Crear componentes visuales: ProductFilterBar, ProductTable, ProductCreateForm, ProductsPage.

### Archivos creados

| Archivo | Acción |
|---|---|
| `src/features/products/ui/ProductFilterBar.tsx` | Creado — inputs title, price_min/max + Apply/Clear |
| `src/features/products/ui/ProductTable.tsx` | Creado — TanStack Table v8, columnas: ID, title, image, price, description, category, status |
| `src/features/products/ui/ProductCreateForm.tsx` | Creado — TanStack Form + Zod Standard Schema + useCreateProduct |
| `src/features/products/ui/ProductsPage.tsx` | Creado — contenedor: paginación, filtros, modal, loading/error |

### Detalle de componentes

**ProductFilterBar**
- Props: `filters`, `onApply`, `onClear`
- `useState` local para campos, sincronización inicial desde `filters`
- Apply: emite filtros (convierte strings a `number` para price)
- Clear: resetea inputs locales + llama `onClear()`

**ProductTable**
- `createColumnHelper<Product>()` con 7 columnas tipadas
- `id`: `#n` monospace
- `images`: thumbnail 48×48
- `price`: `formatPrice` (USD)
- `description`: `truncateText(60)`
- `category.id`: `#n` monospace
- `_optimisticStatus`: badge "Saving…" (yellow) o "Synced" (green)
- `flexRender` para render headless; `getCoreRowModel`

**ProductCreateForm**
- `useForm` con `defaultValues` y `validators.onSubmit: createProductSchema`
- **Zod como esquema Standard Schema** (sin `validatorAdapter` — deprecado en Zod 3.24+)
- 5 fields: title (text), price (number), description (textarea), imageUrl (url), categoryId (number)
- On submit: transforma `imageUrl` → `images: [imageUrl]`, llama `mutate` + `onSuccess`
- Botón Cancel + Create (deshabilitado mientras `isPending`)

**ProductsPage**
- Estado: `filters` + `pagination` (offset/limit 10) + `isModalOpen`
- `useProducts(filters, pagination)` conecta Query
- Estados: loading (Spinner), error (red banner), data (tabla + paginación)
- Paginación: Previous (deshabilitado si offset=0), Next (deshabilitado si data.length < limit)
- Modal overlay con `ProductCreateForm`, cierre al cancelar o al crear exitosamente

### Observaciones técnicas
- **TanStack Form v1 + Zod:** no se necesita `@tanstack/zod-form-adapter`. Zod 3.24+ implementa `StandardSchemaV1` directamente. El schema se pasa como `validators.onSubmit`.
- **`as CreateProductFormValues`** en `defaultValues` — necesaria porque los valores literales (`1`) son subtipo de `number` pero TypeScript los infiere como `1` literal.
- **`useState` local en FilterBar:** para evitar refetches en cada keystroke; los filtros se emiten solo al hacer clic en Apply.
- **Paginación:** no hay total count del API; se estima `hasMore` como `data.length >= limit`.

### Cumplimiento del requerimiento
- [x] TanStack Table v8 con columnas headless
- [x] TanStack Form v1 + Zod Standard Schema (sin adapter)
- [x] Optimistic UI visual (badge Saving…/Synced)
- [x] Server-side pagination y filtros
- [x] Loading + Error states
- [x] Cero `any`, tipado estricto
- [x] Build pasa sin errores

## Fase 6: App Layer + Routing ✅

### Prompt utilizado
Crear la capa de aplicación con TanStack Router (file-based routing) y QueryClientProvider.

### Archivos creados/modificados

| Archivo | Acción |
|---|---|
| `vite.config.ts` | Modificado — agregado `routesDirectory` y `generatedRouteTree` al plugin |
| `src/app/routes/__root.tsx` | Creado — root layout con `<Outlet />` |
| `src/app/routes/index.lazy.tsx` | Creado — lazy route `/` → `<ProductsPage />` |
| `src/app/App.tsx` | Creado — `QueryClientProvider` + `RouterProvider` + `createRouter` |
| `src/App.tsx` | Modificado — re-exporta `App` desde `src/app/App.tsx` |
| `src/app/routeTree.gen.ts` | Generado automáticamente por el Vite plugin |

### Estructura resultante

```
src/app/
├── App.tsx              ← Punto de entrada: providers + router
├── routeTree.gen.ts     ← Generado por @tanstack/router-plugin
└── routes/
    ├── __root.tsx       ← Root layout (Outlet)
    └── index.lazy.tsx   ← Ruta principal → ProductsPage
```

### Flujo de entrada

```
main.tsx → App (src/App.tsx → re-export desde src/app/App.tsx)
         → QueryClientProvider (TanStack Query)
         → RouterProvider (TanStack Router)
         → __root.tsx (Outlet)
         → index.lazy.tsx (ProductsPage)
```

### Detalle de archivos

**`vite.config.ts`** — configuración del plugin:
```ts
TanStackRouterVite({
  autoCodeSplitting: true,
  routesDirectory: './src/app/routes',
  generatedRouteTree: './src/app/routeTree.gen.ts',
})
```

**`__root.tsx`** — layout raíz sin UI adicional (el header está en ProductsPage):
```tsx
export const Route = createRootRoute({
  component: () => <Outlet />,
})
```

**`index.lazy.tsx`** — lazy route (gracias a `autoCodeSplitting: true`):
```tsx
export const Route = createLazyFileRoute('/')({
  component: ProductsPage,
})
```

**`app/App.tsx`** — providers + router tipado:
```tsx
const queryClient = new QueryClient()
const router = createRouter({ routeTree })

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}
```

**`src/App.tsx`** — puente simple:
```tsx
export { App as default } from './app/App'
```

**`routeTree.gen.ts`** — archivo autogenerado, incluido en el repo para que `tsc` funcione offline.

### Cumplimiento del requerimiento
- [x] File-based routing con `@tanstack/router-plugin`
- [x] `autoCodeSplitting: true` para lazy loading de rutas
- [x] `QueryClientProvider` envuelve toda la app
- [x] Root layout con `<Outlet />` para anidamiento futuro
- [x] `src/App.tsx` es solo un re-export (código real en `src/app/`)
- [x] Cero `any`, tipado estricto
- [x] Build (Vite + tsc) pasa sin errores
