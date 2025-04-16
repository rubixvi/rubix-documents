import type { UrlObject } from "url"

import { useCallback } from "react"
import NextLink from "next/link"

import { useTransitionRouter } from "./use-transition-router"

const supportsViewTransitions =
  typeof document !== "undefined" && "startViewTransition" in document

function isModifiedEvent(event: React.MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement
  const target = eventTarget.getAttribute("target")
  return (
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    (event.nativeEvent && event.button === 1)
  )
}

function shouldPreserveDefault(
  e: React.MouseEvent<HTMLAnchorElement>
): boolean {
  return e.currentTarget.nodeName.toUpperCase() === "A" && isModifiedEvent(e)
}

const formatUrl = (url: string | UrlObject): string =>
  typeof url === "string"
    ? url
    : new URL(url.pathname || "", window.location.href).toString()

export function Link(props: React.ComponentProps<typeof NextLink>) {
  const router = useTransitionRouter()

  const { href, as, replace, scroll, onClick, ...rest } = props

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (onClick) {
        onClick(e)
      }

      if (!supportsViewTransitions || shouldPreserveDefault(e)) {
        return
      }

      e.preventDefault()

      const navigate = replace ? router.replace : router.push
      navigate(formatUrl(as ?? href), { scroll: scroll ?? true })
    },
    [onClick, href, as, replace, scroll, router]
  )

  return <NextLink {...rest} href={href} as={as} onClick={handleClick} />
}
