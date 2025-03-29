"use client"

import { ComponentProps } from "react"
import { usePathname } from "next/navigation"
import { Link } from "lib/transition"

import { cn } from "@/lib/utils"

type AnchorProps = ComponentProps<typeof Link> & {
  absolute?: boolean
  activeClassName?: string
  disabled?: boolean
}

export default function Anchor({
  absolute,
  className = "",
  activeClassName = "",
  disabled,
  children,
  ...props
}: AnchorProps) {
  const path = usePathname()
  let isMatch = absolute
    ? props.href.toString().split("/")[1] == path.split("/")[1]
    : path === props.href

  if (props.href.toString().includes("http")) isMatch = false

  if (disabled)
    return <div className={cn(className, "cursor-not-allowed")}>{children}</div>

  return (
    <Link className={cn(className, isMatch && activeClassName)} {...props}>
      {children}
    </Link>
  )
}
