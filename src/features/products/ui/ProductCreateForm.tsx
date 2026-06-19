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
      className="space-y-4"
    >
      <form.Field name="title">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="create-title" className="text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="create-title"
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {field.state.meta.errors && (
              <span className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="price">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="create-price" className="text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              id="create-price"
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
            />
            {field.state.meta.errors && (
              <span className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="create-description" className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="create-description"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            {field.state.meta.errors && (
              <span className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="imageUrl">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="create-image" className="text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              id="create-image"
              type="url"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
            {field.state.meta.errors && (
              <span className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</span>
            )}
          </div>
        )}
      </form.Field>

      <form.Field name="categoryId">
        {(field) => (
          <div className="flex flex-col gap-1">
            <label htmlFor="create-category" className="text-sm font-medium text-gray-700">
              Category ID
            </label>
            <input
              id="create-category"
              type="number"
              value={field.state.value}
              onChange={(e) => field.handleChange(Number(e.target.value))}
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            {field.state.meta.errors && (
              <span className="text-xs text-red-600">{field.state.meta.errors.join(', ')}</span>
            )}
          </div>
        )}
      </form.Field>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Creating…' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
