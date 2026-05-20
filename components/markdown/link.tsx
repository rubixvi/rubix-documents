import { type ReactNode } from 'react'

import { Link } from '@/lib/transition'

interface RouteProps {
  href?: string
  children: ReactNode
}

export function Route({ href = '#', children }: RouteProps) {
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
