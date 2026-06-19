import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-8 shadow-sm">
        <Link to="/" className="text-lg font-bold text-gray-800 hover:text-blue-600 transition-colors">
          Home
        </Link>
        <Link to="/products" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
          Products
        </Link>
      </nav>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  ),
})
