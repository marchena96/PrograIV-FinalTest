# Fase 7 — Zustand Store para UI State

## Objetivo

Centralizar el estado de UI (modal de creación) en un store de **Zustand**, separando la lógica de presentación de la gestión de estado global. El store solo contiene flags de UI, nunca datos del servidor (eso es responsabilidad de TanStack Query).

## Archivos creados/modificados

| Archivo | Acción |
|---|---|
| `src/store/useProductUIStore.ts` | Creado — store Zustand: `isCreateModalOpen`, `openCreateModal`, `closeCreateModal` |
| `src/features/products/ui/ProductsPage.tsx` | Modificado — reemplaza `useState<boolean>` por `useProductUIStore` |

## Store (`useProductUIStore.ts`)

```ts
import { create } from 'zustand'

interface ProductUIState {
  isCreateModalOpen: boolean
  openCreateModal: () => void
  closeCreateModal: () => void
}

export const useProductUIStore = create<ProductUIState>((set) => ({
  isCreateModalOpen: false,
  openCreateModal: () => set({ isCreateModalOpen: true }),
  closeCreateModal: () => set({ isCreateModalOpen: false }),
}))
```

### Diseño

- **`create`** de Zustand recibe una función que expone `set` para actualizar el estado.
- **Estado inicial:** modal cerrado (`isCreateModalOpen: false`).
- **Acciones:** `openCreateModal` / `closeCreateModal` son funciones puras que mutan solo el flag booleano.
- **Sin middleware:** no necesitamos persistencia ni devtools para un flag simple.
- **Tipado estricto:** la interfaz `ProductUIState` define forma y acciones, cero `any`.

## Cambio en `ProductsPage.tsx`

### Antes (local `useState`)

```tsx
const [isModalOpen, setIsModalOpen] = useState(false)

function openModal() { setIsModalOpen(true) }
function closeModal() { setIsModalOpen(false) }

// JSX
<button onClick={openModal}>+ Nuevo Producto</button>
{isModalOpen && <ProductCreateForm onSuccess={closeModal} onCancel={closeModal} />}
```

### Después (Zustand store)

```tsx
const { isCreateModalOpen, openCreateModal, closeCreateModal } = useProductUIStore()

// JSX
<button onClick={openCreateModal}>+ Nuevo Producto</button>
{isCreateModalOpen && <ProductCreateForm onSuccess={closeCreateModal} onCancel={closeCreateModal} />}
```

### Beneficio

- **Consistencia:** si otro componente necesita abrir/cerrar el modal (ej. un atajo de teclado), accede al mismo store.
- **Separación de responsabilidades:** `ProductsPage` no gestiona estado de UI que no le pertenece conceptualmente.
- **Testeabilidad:** el store se puede testear de forma aislada.
- **Preparado para escalar:** más flags de UI (sidebar, toast, confirm dialog) se agregan al mismo store sin contaminar componentes.

## Árbol de `src/store/`

```
src/store/
└── useProductUIStore.ts    ← Store de UI del feature products
```

## Verificación

```bash
npx tsc -b --noEmit       # Sin errores
npx vite build            # Build exitoso
```
