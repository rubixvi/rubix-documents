import { type ReactNode } from 'react'

import { Sidebar } from '@/components/sidebar'

interface DocumentsProps {
  children: Readonly<ReactNode>
}

export default function Documents({ children }: DocumentsProps) {
  return (
    <div className="flex items-start gap-10 pt-10">
      <Sidebar />
      <div className="flex-1 md:flex-6">{children}</div>
    </div>
  )
}
