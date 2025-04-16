"use client"

import type { ReactElement } from "react"
import { useEffect, useRef } from "react"
import cn from "clsx"
import { LuArrowUp } from "react-icons/lu"

function ScrollUp() {
  if (typeof window !== "undefined") {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }
}

export function BackToTop({ className }: { className?: string }): ReactElement {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function toggleVisible() {
      const { scrollTop } = document.documentElement
      if (ref.current) {
        ref.current.classList.toggle("opacity-0", scrollTop < 300)
      }
    }

    window.addEventListener("scroll", toggleVisible)
    return () => {
      window.removeEventListener("scroll", toggleVisible)
    }
  }, [])

  return (
    <button
      ref={ref}
      onClick={ScrollUp}
      className={cn(
        "ml-2 flex cursor-pointer items-center opacity-0 transition",
        className
      )}
    >
      <LuArrowUp className="mr-1 inline-block h-4 w-4 align-middle" />
      <span>Scroll to top</span>
    </button>
  )
}
