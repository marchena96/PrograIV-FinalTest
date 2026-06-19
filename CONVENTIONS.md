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
