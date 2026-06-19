# Fase 9 — Autofiltro, navegación y .gitignore

## Objetivo

Mejorar la UX del filtro de productos con auto-aplicación al escribir, agregar navegación entre Home y Products, y configurar el `.gitignore` del proyecto.

## Archivos modificados

| Archivo | Cambios |
|---|---|
| `src/features/products/ui/ProductFilterBar.tsx` | Auto-apply del filtro de título con debounce de 300ms |
| `src/app/routes/__root.tsx` | Nav bar global con links Home / Products |
| `src/app/routes/index.lazy.tsx` | Convertido en HomePage con botón "View Products" |
| `.gitignore` | Agregadas entradas para `.env*`, `*.tsbuildinfo`, `coverage/`, etc. |

## Archivo creado

```
src/app/routes/products.lazy.tsx
```

## Detalle de cambios

### 1. Auto-filtro por título

- `ProductFilterBar` ahora aplica el filtro de título automáticamente cuando el usuario escribe **≥ 2 caracteres** o vacía el campo.
- Usa `useEffect` + `setTimeout` con debounce de **300ms** para evitar re-fetchs excesivos.
- Los filtros de precio (`Min Price` / `Max Price`) siguen siendo manuales con el botón **Apply**.
- El botón **Clear** resetea todo sin disparar el debounce (usa un ref `isClearing`).

### 2. Navegación Home ↔ Products

- **`__root.tsx`**: Layout global con `<nav>` que contiene links a Home y Products, y `<Outlet>` para el contenido.
- **`index.lazy.tsx`**: Ahora es una página de bienvenida simple con título, subtítulo y botón "View Products".
- **`products.lazy.tsx`**: Nueva ruta `/products` que renderiza `ProductsPage`.
- El `routeTree.gen.ts` se regenera automáticamente vía `@tanstack/router-plugin`.

### 3. .gitignore

Agregadas las siguientes entradas:

| Entrada | Propósito |
|---|---|
| `.env`, `.env*.local`, `.env.development`, `.env.production` | Secretos y configuración sensible |
| `*.tsbuildinfo` | Archivos incrementales de TypeScript |
| `coverage` | Reportes de cobertura de tests |
| `Thumbs.db` | Archivos del sistema Windows |
| `.pnp`, `.pnp.js` | Plug'n'Play de Yarn |

## Verificación

```bash
npx tsc -b --noEmit       # Sin errores
npx vite build            # Build exitoso, chunks separados por lazy loading
```
