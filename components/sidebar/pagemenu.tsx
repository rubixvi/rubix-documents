'use client'

import { usePathname } from 'next/navigation'

import { SubLink } from '@/components/sidebar/sublink'
import { Separator } from '@/components/ui/separator'
import { Routes } from '@/lib/pageroutes'

export function PageMenu({ isSheet = false }) {
  const path = usePathname()

  if (!path.startsWith('/docs')) return null

  return (
    <div className="flex flex-col gap-3.5 pb-6">
      {Routes.map((item, index) => {
        if ('spacer' in item) {
          return <Separator className="my-2" key={`spacer-${index}`} />
        }

        return (
          <div key={item.title + index}>
            {item.heading && <div className="mb-4 text-sm font-bold">{item.heading}</div>}
            <SubLink
              {...{
                ...item,
                href: `/docs${item.href}`,
                level: 0,
                isSheet,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
