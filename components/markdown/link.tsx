import { type ReactNode } from 'react'

import { Link } from '@/lib/transition'

interface RouteProps {
  children: ReactNode
  href?: string
}

export function Route({ href = '#', children }: RouteProps) {
  const isInternal = href.startsWith('/') || href.startsWith('#')

  if (isInternal) {
    return <Link href={href}>{children}</Link>
  }

  return (
    <a href={href} rel="noopener noreferrer" target="_blank">
      {children}
    </a>
  )
}
