'use client'

import { type ReactElement, useEffect, useRef } from 'react'
import { LuArrowUp } from 'react-icons/lu'

function ScrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

export function BackToTop(): ReactElement {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function toggleVisible() {
      const { scrollTop } = document.documentElement
      if (ref.current) {
        ref.current.classList.toggle('opacity-0', scrollTop < 300)
      }
    }

    window.addEventListener('scroll', toggleVisible)
    return () => {
      window.removeEventListener('scroll', toggleVisible)
    }
  }, [])

  return (
    <button
      aria-label="Scroll to top"
      className="mt-2 ml-2 flex cursor-pointer items-center self-start text-sm text-foreground opacity-0 transition"
      onClick={ScrollToTop}
      ref={ref}
      title="Scroll to top"
      type="button"
    >
      <LuArrowUp className="mr-1 inline-block h-4 w-4 align-middle" />
      <span>Scroll to top</span>
    </button>
  )
}
