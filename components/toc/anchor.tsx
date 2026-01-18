'use client'

import clsx from 'clsx'
import Link from 'next/link'

import { ScrollArea } from '@/components/ui/scroll-area'

export interface TableAnchorProps {
  tocs: { href: string; level: number; text: string }[]
}

export function TableAnchor({ tocs }: TableAnchorProps) {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const id = href.startsWith('#') ? href.slice(1) : href
    const targetElement = document.getElementById(id)
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
      window.history.pushState(null, '', href)
    }
  }

  if (!tocs.length) {
    return null
  }

  return (
    <div className="flex w-full flex-col gap-3 pl-2">
      <h3 className="text-sm font-semibold">On this page</h3>
      <ScrollArea className="pt-0.5 pb-4">
        <div className="flex flex-col gap-2.5 text-sm text-foreground">
          {tocs.map(({ href, level, text }) => (
            <Link
              key={href}
              href={href}
              title={text}
              aria-label={text}
              scroll={false}
              onClick={(e) => handleSmoothScroll(e, href)}
              className={clsx({
                'pl-0': level == 2,
                'pl-3': level == 3,
                'pl-6': level == 4,
              })}
            >
              {text}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
