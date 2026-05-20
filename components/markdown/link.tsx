import { Link } from '@/lib/transition'

interface Routed {
  href?: string
  children: React.ReactNode
}

export function RoutedLink({ href = '#', children }: Routed) {
  const isInternal = href.startsWith('/') || href.startsWith('#')

  if (isInternal) {
    return <Link href={href}>{children}</Link>
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
