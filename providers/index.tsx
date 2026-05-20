import { ThemeProvider } from 'next-themes'
import { type ReactNode } from 'react'

import { ViewTransitions } from '@/lib/transition'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ViewTransitions>{children}</ViewTransitions>
    </ThemeProvider>
  )
}
