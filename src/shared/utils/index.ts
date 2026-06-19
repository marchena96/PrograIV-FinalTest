const PLACEHOLDER_IMAGE = 'https://placehold.co/120x120?text=No+Image'

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function getFirstImage(images: string[]): string {
  return images[0] ?? PLACEHOLDER_IMAGE
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}…`
}
