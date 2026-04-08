'use client'

import mermaid from 'mermaid'
import { memo, useEffect, useRef } from 'react'

interface MermaidProps {
  chart: string
  className?: string
}

const normalizeChart = (input?: string): string => {
  if (!input) return ''
  return input
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n')
}

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
})

const Mermaid = memo(({ chart, className }: MermaidProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || !chart) return

    const id = `mermaid-${crypto.randomUUID()}`

    mermaid
      .render(id, normalizeChart(chart))
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg
      })
      .catch((err) => {
        if (ref.current)
          ref.current.innerHTML = `<pre style="color:red">Mermaid error: ${err?.message ?? err}</pre>`
      })
  }, [chart])

  return <div ref={ref} className={className} />
})

Mermaid.displayName = 'Mermaid'

export default Mermaid
