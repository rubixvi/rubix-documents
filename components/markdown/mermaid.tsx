"use client"

import React, { useCallback, useEffect, useMemo, useRef } from "react"
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

  const renderMermaid = useCallback(() => {
    if (!ref.current) return

    ref.current.innerHTML = chart

    try {
      mermaid.contentLoaded()
    } catch (error) {
      console.error("Mermaid diagram render error:", error)
    }
  }, [chart])

  const memoizedClassName = useMemo(
    () => clsx("mermaid", className),
    [className]
  )

  useEffect(() => {
    renderMermaid()
  }, [renderMermaid])

  return <div className={memoizedClassName} ref={ref} />
}

const MermaidMemo = React.memo(Mermaid)
export default MermaidMemo
