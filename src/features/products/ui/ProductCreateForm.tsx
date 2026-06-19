import { useForm } from '@tanstack/react-form'
import { useCreateProduct } from '@/features/products/hooks'
import { createProductSchema } from '@/features/products/types'
import type { CreateProductFormValues } from '@/features/products/types'

interface ProductCreateFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function ProductCreateForm({ onSuccess, onCancel }: ProductCreateFormProps) {
  const { mutate, isPending } = useCreateProduct()

  const form = useForm({
    defaultValues: {
      title: '',
      price: 1,
      description: '',
      imageUrl: '',
      categoryId: 1,
    } as CreateProductFormValues,
    validators: {
      onSubmit: createProductSchema,
    },
    onSubmit: ({ value }) => {
      mutate(
        {
          title: value.title,
          price: value.price,
          description: value.description,
          images: [value.imageUrl],
          categoryId: value.categoryId,
        },
        { onSuccess: () => { onSuccess() } },
      )
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-5"
    >
      <form.Field name="title">
        {(field) => {
          const hasError = field.state.meta.errors && field.state.meta.errors.length > 0
          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-title" className="text-sm font-semibold text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="create-title"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`border ${hasError ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
              />
              {hasError && (
                <span className="text-xs text-red-600 font-medium">{field.state.meta.errors.join(', ')}</span>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="price">
        {(field) => {
          const hasError = field.state.meta.errors && field.state.meta.errors.length > 0
          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-price" className="text-sm font-semibold text-gray-700">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                id="create-price"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className={`border ${hasError ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                min="0"
                step="0.01"
              />
              {hasError && (
                <span className="text-xs text-red-600 font-medium">{field.state.meta.errors.join(', ')}</span>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="description">
        {(field) => {
          const hasError = field.state.meta.errors && field.state.meta.errors.length > 0
          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-description" className="text-sm font-semibold text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="create-description"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`border ${hasError ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                rows={3}
              />
              {hasError && (
                <span className="text-xs text-red-600 font-medium">{field.state.meta.errors.join(', ')}</span>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="imageUrl">
        {(field) => {
          const hasError = field.state.meta.errors && field.state.meta.errors.length > 0
          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-image" className="text-sm font-semibold text-gray-700">
                Image URL <span className="text-red-500">*</span>
              </label>
              <input
                id="create-image"
                type="url"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`border ${hasError ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                placeholder="https://..."
              />
              {hasError && (
                <span className="text-xs text-red-600 font-medium">{field.state.meta.errors.join(', ')}</span>
              )}
            </div>
          )
        }}
      </form.Field>

      <form.Field name="categoryId">
        {(field) => {
          const hasError = field.state.meta.errors && field.state.meta.errors.length > 0
          return (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="create-category" className="text-sm font-semibold text-gray-700">
                Category ID <span className="text-red-500">*</span>
              </label>
              <input
                id="create-category"
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
                className={`border ${hasError ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'} rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                min="1"
              />
              {hasError && (
                <span className="text-xs text-red-600 font-medium">{field.state.meta.errors.join(', ')}</span>
              )}
            </div>
          )
        }}
      </form.Field>

      <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 active:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating…
            </span>
          ) : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
