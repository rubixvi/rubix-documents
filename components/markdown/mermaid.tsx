'use client'

import { memo, useEffect, useRef } from 'react'
import mermaid from 'mermaid'

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

export const Mermaid = memo(({ chart, className }: MermaidProps) => {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = ref.current

    if (!current || !chart) return

    const renderChart = async () => {
      const id = `mermaid-${crypto.randomUUID()}`

      try {
        const { svg } = await mermaid.render(id, normalizeChart(chart))
        current.innerHTML = svg
      } catch (err) {
        current.innerHTML = `<pre style="color:red">Mermaid error: ${
          err instanceof Error ? err.message : String(err)
        }</pre>`
      }
    }

    void renderChart()
  }, [chart])

  return <div ref={ref} className={className} />
})
