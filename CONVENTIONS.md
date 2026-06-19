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
