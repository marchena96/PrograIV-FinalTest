# Fase 5 — UI del feature `products`

## Objetivo

Construir los cuatro componentes visuales del feature `products`:

1. **`ProductFilterBar`** — inputs para título, precio mínimo/máximo + botones Apply/Clear
2. **`ProductTable`** — tabla headless con TanStack Table v8
3. **`ProductCreateForm`** — formulario validado con TanStack Form + Zod
4. **`ProductsPage`** — contenedor que orquesta paginación, filtros, hooks y modales

## Arquitectura

```
ProductsPage (contenedor)
├── ProductFilterBar (filtros server-side)
├── ProductTable (datos paginados)
├── [Paginación controles]
└── Modal ── ProductCreateForm (Optimistic UI)
```

## Archivos creados

```
src/features/products/ui/
├── ProductFilterBar.tsx
├── ProductTable.tsx
├── ProductCreateForm.tsx
└── ProductsPage.tsx
```

---

## ProductFilterBar

### Props

```ts
interface ProductFilterBarProps {
  filters: ProductFilters    // filtros actuales (para estado inicial)
  onApply: (filters: ProductFilters) => void
  onClear: () => void
}
```

### Estado interno

```ts
const [title, setTitle] = useState(filters.title ?? '')
const [priceMin, setPriceMin] = useState(filters.price_min?.toString() ?? '')
const [priceMax, setPriceMax] = useState(filters.price_max?.toString() ?? '')
```

### Flujo

| Acción | Comportamiento |
|---|---|
| Escribir en inputs | Solo estado local — NO emite nada |
| Click **Apply** | Convierte strings a `number` (o `undefined` si vacío), llama `onApply`, resetea paginación a offset 0 |
| Click **Clear** | Resetea inputs locales, llama `onClear`, resetea paginación a offset 0 |

### Decisiones

- **Estado local vs. controlado:** se usa `useState` en vez de props controladas para evitar refetches de TanStack Query en cada keystroke. Solo Apply/Clear gatillan llamadas al API.
- **Conversión string → number:** los inputs HTML devuelven strings; se usa `Number(priceMin)` y si el string está vacío se manda `undefined` (el API ignora parámetros ausentes).

---

## ProductTable

### Configuración

```ts
const columnHelper = createColumnHelper<Product>()

const columns = [
  columnHelper.accessor('id', { header: 'ID', ... }),
  columnHelper.accessor('title', { header: 'Title' }),
  columnHelper.accessor('images', { header: 'Image', ... }),
  columnHelper.accessor('price', { header: 'Price', ... }),
  columnHelper.accessor('description', { header: 'Description', ... }),
  columnHelper.accessor((row) => row.category.id, { id: 'categoryId', header: 'Category', ... }),
  columnHelper.accessor('_optimisticStatus', { id: 'status', header: 'Status', ... }),
]
```

### Columnas

| Columna | Accessor | Render |
|---|---|---|
| ID | `id` | `#n` monospace, gris |
| Title | `title` | texto plano |
| Image | `images` | `<img>` 48×48, `getFirstImage()` con placeholder |
| Price | `price` | `formatPrice()` → USD ($1,234.56) |
| Description | `description` | `truncateText(60)` con ellipsis |
| Category | `row.category.id` | `#n` monospace, pequeño |
| Status | `_optimisticStatus` | Badge "Saving…" (yellow) o "Synced" (green) |

### API TanStack Table v8

```ts
const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
})
```

Render headless con `flexRender`:

```tsx
{table.getHeaderGroups().map(headerGroup => (
  <tr key={headerGroup.id}>
    {headerGroup.headers.map(header => (
      <th key={header.id}>
        {flexRender(header.column.columnDef.header, header.getContext())}
      </th>
    ))}
  </tr>
))}
```

---

## ProductCreateForm

### Props

```ts
interface ProductCreateFormProps {
  onSuccess: () => void   // cerrar modal después de crear
  onCancel: () => void    // cerrar modal sin crear
}
```

### Configuración de `useForm`

```ts
const form = useForm({
  defaultValues: {
    title: '',
    price: 1,
    description: '',
    imageUrl: '',
    categoryId: 1,
  } as CreateProductFormValues,
  validators: {
    onSubmit: createProductSchema,  // ← Zod schema directo
  },
  onSubmit: ({ value }) => {
    mutate(
      {
        title: value.title,
        price: value.price,
        description: value.description,
        images: [value.imageUrl],   // ← single URL → string[]
        categoryId: value.categoryId,
      },
      { onSuccess: () => onSuccess() },
    )
  },
})
```

### Validación con Zod Standard Schema

**Importante:** En TanStack Form v1 con Zod 3.24+, **no se necesita** `@tanstack/zod-form-adapter`. Zod implementa la interfaz `StandardSchemaV1` directamente.

```ts
// ❌ No funciona (validatorAdapter no existe en FormOptions)
validatorAdapter: zodValidator,   // deprecated

// ✅ Correcto — Zod schema se pasa directamente como validator
validators: { onSubmit: createProductSchema }
```

### Transformación form → API

| Form (`CreateProductFormValues`) | API (`CreateProductPayload`) |
|---|---|
| `imageUrl: string` | `images: [imageUrl]` |

### Estados

- **Submit button:** texto cambia a "Creating…", botón deshabilitado con `disabled: isPending`
- **Cancel button:** `type="button"`, llama `onCancel()`
- **Errores de validación:** se muestran debajo de cada field como texto rojo (`field.state.meta.errors`)

---

## ProductsPage

### Estado

```ts
const [filters, setFilters] = useState<ProductFilters>({})
const [pagination, setPagination] = useState<PaginationParams>({ offset: 0, limit: 10 })
const [isModalOpen, setIsModalOpen] = useState(false)
```

### Hooks

```ts
const { data, isLoading, isError, error } = useProducts(filters, pagination)
```

### Layout

```
┌─────────────────────────────────────────────┐
│ Gestión de Productos         [+ Nuevo]      │
├─────────────────────────────────────────────┤
│ [ProductFilterBar]                          │
├─────────────────────────────────────────────┤
│ [ProductTable]                              │
├─────────────────────────────────────────────┤
│ [← Previous]  Showing X–Y  [Next →]        │
├─────────────────────────────────────────────┤
│ [Modal: ProductCreateForm] (condicional)    │
└─────────────────────────────────────────────┘
```

### Estados visuales

| Estado | Render |
|---|---|
| `isLoading` (y sin datos) | `Spinner size="lg"` centrado |
| `isError` | Banner rojo con `error.message` |
| `data` presente | Tabla + paginación + modal |
| `data` vacío (array []) | Tabla sin filas + paginación muestra `0` |

### Paginación

```ts
const hasPrevious = pagination.offset > 0
const hasMore = data && data.length >= pagination.limit
```

| Botón | Deshabilitado cuando |
|---|---|
| ← Previous | `offset === 0` |
| Next → | `data.length < limit` (no hay más páginas) |

Al aplicar filtros o limpiarlos, `offset` se resetea a `0`.

### Modal

```tsx
{isModalOpen && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
      <h2 className="text-lg font-semibold mb-4">Crear Producto</h2>
      <ProductCreateForm onSuccess={closeModal} onCancel={closeModal} />
    </div>
  </div>
)}
```

---

## Decisiones técnicas

1. **Estado local en FilterBar:** evita refetches innecesarios (no se llama `setFilters` en cada keystroke, solo en Apply/Clear)
2. **Paginación sin total count:** el API no devuelve `total`; se estima `hasMore` como `data.length >= limit`
3. **Modal overlay sin librería:** CSS `position: fixed` con `bg-black/50`, suficiente para el alcance del proyecto
4. **`as CreateProductFormValues`** en `defaultValues`: necesario porque TypeScript infiere `price: 1` como `1` (literal type), no como `number`
5. **TanStack Form sin validatorAdapter:** Zod 3.24+ implementa `StandardSchemaV1`; se pasa el schema directamente en `validators.onSubmit`
6. **`_optimisticStatus` como columna:** renderiza badge amarillo "Saving…" para productos optimistas; badge verde "Synced" para el resto
7. **`categoryId` como input numérico:** no se implementa selector de categorías; el rango Platzi es 1–5

## Verificación

```bash
npx tsc -b --noEmit     # Sin errores
```
