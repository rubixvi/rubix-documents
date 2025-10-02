import { PropsWithChildren } from "react"

export function Typography({ children }: PropsWithChildren) {
  return <article className="typography">{children}</article>
}
