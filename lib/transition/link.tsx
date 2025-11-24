import NextLink from 'next/link'
import { type ComponentProps, type MouseEvent, useCallback } from 'react'
import { type UrlObject } from 'url'

import { useTransitionRouter } from './use-transition-router'

function isModifiedEvent(event: MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement
  const target = eventTarget.getAttribute('target')
  return (
    (target && target !== '_self') ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (event.nativeEvent && event.button === 1)
  )
}

function shouldPreserveDefault(e: MouseEvent<HTMLAnchorElement>): boolean {
  const { nodeName } = e.currentTarget

  const isAnchorNodeName = nodeName.toUpperCase() === 'A'

  if (isAnchorNodeName && isModifiedEvent(e)) {
    return true
  }

  return false
}

const formatUrl = (url: string | UrlObject): string =>
  typeof url === 'string' ? url : new URL(url.pathname || '', window.location.href).toString()

export function Link(props: ComponentProps<typeof NextLink>) {
  const router = useTransitionRouter()

  const { as, href, onClick, replace, scroll, ...rest } = props

  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(e)
      }

      if (e.defaultPrevented) {
        return
      }

      if ('startViewTransition' in document) {
        if (shouldPreserveDefault(e)) {
          return
        }

        e.preventDefault()

        const navigate = replace ? router.replace : router.push
        navigate(formatUrl(as ?? href), { scroll: scroll ?? true })
      }
    },
    [onClick, href, as, replace, scroll, router]
  )

  return <NextLink {...rest} href={href} onClick={handleClick} as={as} />
}
