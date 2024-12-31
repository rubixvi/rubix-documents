"use client"

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import clsx from "clsx"
import mermaid from "mermaid"

interface MermaidProps {
  chart: string
  className?: string
}

mermaid.initialize({
  theme: "neutral",
})

const Mermaid = ({ chart, className }: MermaidProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const uniqueId = `mermaid-${Math.random().toString(36).slice(2, 11)}`
  const [mounted, setMounted] = useState(false)

  const renderMermaid = useCallback(async () => {
    if (ref.current) {
      try {
        const { svg } = await mermaid.render(uniqueId, chart)
        ref.current.innerHTML = svg
      } catch (error) {
        console.error("Mermaid diagram render error:", error)
      }
    }
  }, [chart, uniqueId])

  const memoizedClassName = useMemo(
    () => clsx("mermaid", className),
    [className]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (mounted && ref.current) {
      renderMermaid()
    }
  }, [mounted, renderMermaid])

  if (!mounted) {
    return null
  }

  return <div className={memoizedClassName} ref={ref} />
}

const MermaidMemo = React.memo(Mermaid)
export default MermaidMemo
