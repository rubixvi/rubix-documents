"use client";

import React, { useLayoutEffect, useRef, useState, useCallback, useMemo, useEffect } from "react";
import mermaid from "mermaid";
import clsx from "clsx";

interface MermaidProps {
  chart: string;
  className?: string;
}

mermaid.initialize({
  theme: "neutral",
});

const Mermaid = ({ chart, className }: MermaidProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);

  const renderMermaid = useCallback(() => {
    if (ref.current) {
      ref.current.innerHTML = chart;

      try {
        mermaid.contentLoaded();
      } catch (error) {
        console.error("Mermaid diagram render error:", error);
      }
    }
  }, [chart]);

  const memoizedClassName = useMemo(() => clsx("mermaid", className), [className]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (mounted && ref.current) {
      renderMermaid();
    }
  }, [mounted, renderMermaid]);

  if (!mounted) {
    return null;
  }

  return (
    <div className={memoizedClassName} ref={ref} />
  );
};

const MermaidMemo = React.memo(Mermaid);
export default MermaidMemo;
