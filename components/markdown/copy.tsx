"use client"

import { useState } from "react"
import { LuCheck, LuCopy } from "react-icons/lu"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Copy({ content }: { content: string }) {
  const [isCopied, setIsCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleCopy}
      className="!size-8 cursor-pointer"
    >
      <LuCopy
        className={cn(
          "absolute !size-3.5 transform transition-opacity duration-300",
          isCopied ? "scale-90 opacity-0" : "scale-100 opacity-100"
        )}
      />
      <LuCheck
        className={cn(
          "absolute !size-3.5 transform transition-opacity duration-300",
          isCopied ? "scale-100 opacity-100" : "scale-90 opacity-0"
        )}
      />
    </Button>
  )
}
