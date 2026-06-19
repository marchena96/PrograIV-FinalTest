# Fase 6 — App Layer + Routing (TanStack Router)

## Objetivo

Migrar de un simple componente `App` a una arquitectura con **TanStack Router** (file-based routing), envolviendo toda la aplicación con `QueryClientProvider` para que los hooks de TanStack Query funcionen en cualquier ruta.

## Archivos

```
src/app/
├── App.tsx              ← QueryClientProvider + RouterProvider
├── routeTree.gen.ts     ← Generado automáticamente (Vite plugin)
└── routes/
    ├── __root.tsx       ← Root layout con <Outlet />
    └── index.lazy.tsx   ← Lazy route "/" → ProductsPage
```

## Flujo de entrada

```
main.tsx
  └── App (src/App.tsx → re-export desde src/app/App.tsx)
       └── QueryClientProvider (TanStack Query)
            └── RouterProvider (TanStack Router)
                 └── createRouter({ routeTree })
                      └── __root.tsx
                           └── <Outlet />
                                └── index.lazy.tsx
                                     └── <ProductsPage />
```

## Configuración del Vite plugin

En `vite.config.ts` se configuró explícitamente el directorio de rutas y la ubicación del árbol generado:

```ts
TanStackRouterVite({
  autoCodeSplitting: true,
  routesDirectory: './src/app/routes',
  generatedRouteTree: './src/app/routeTree.gen.ts',
})
```

| Opción | Valor | Efecto |
|---|---|---|
| `autoCodeSplitting: true` | Activa lazy loading automático | Las rutas se cargan bajo demanda (chunks separados) |
| `routesDirectory` | `./src/app/routes` | El plugin escanea este directorio para construir el árbol |
| `generatedRouteTree` | `./src/app/routeTree.gen.ts` | Archivo de salida generado por el plugin |

## Root Layout (`__root.tsx`)

```tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => <Outlet />,
})
```

- **Sin UI adicional:** el header "Gestión de Productos" y el layout visual viven en `ProductsPage` o podrían migrarse aquí si se necesita un layout común entre rutas.
- **`Outlet`**: renderiza el contenido de la ruta hija (`/` → `index.lazy.tsx`).

## Lazy Route (`index.lazy.tsx`)

```tsx
import { createLazyFileRoute } from '@tanstack/react-router'
import { ProductsPage } from '@/features/products/ui/ProductsPage'

export const Route = createLazyFileRoute('/')({
  component: ProductsPage,
})
```

- **`createLazyFileRoute`**: crea una ruta que se carga bajo demanda (gracias a `autoCodeSplitting`).
- **Import directo de `ProductsPage`**: el lazy loading se maneja a nivel de ruta, no de componente.

## App Layer (`app/App.tsx`)

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

- **`QueryClient`**: instancia única, sin opciones especiales (usamos defaults de TanStack Query).
- **`createRouter({ routeTree })`**: recibe el árbol de rutas generado por el Vite plugin.
- **`RouterProvider`**: inicia el router y renderiza la ruta activa.

## Puente (`src/App.tsx`)

```tsx
export { App as default } from './app/App'
```

`main.tsx` sigue importando `App` desde `./App.tsx`. El cambio es transparente.

## Árbol Generado (`routeTree.gen.ts`)

El archivo es generado automáticamente por `@tanstack/router-plugin` durante el build de Vite. Estructura generada para nuestra única ruta:

- **Importa** `Route` desde `./routes/__root` como `rootRouteImport`
- **Crea** `IndexLazyRouteImport` vía `createFileRoute('/')()`
- **Actualiza** con `update()` y conecta el lazy loading a `./routes/index.lazy`
- **Declara** interfaces `FileRoutesByFullPath`, `FileRoutesByTo`, `FileRoutesById`, `FileRouteTypes`
- **Declara** el módulo `@tanstack/react-router` con `FileRoutesByPath` para tipado estricto en `<Link>`, `useNavigate`, etc.
- **Exporta** `routeTree` combinando root + children

### Nota sobre inclusión en repo

El archivo generado está **incluido en el repositorio** (no en `.gitignore`). Esto permite que `tsc -b --noEmit` funcione sin necesidad de ejecutar Vite primero. El plugin regenera el archivo en cada build, manteniéndolo sincronizado.

## Verificación

```bash
npx vite build            # Build exitoso, genera routeTree.gen.ts
npx tsc -b --noEmit       # Sin errores
```
