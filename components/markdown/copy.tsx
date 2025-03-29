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
      className="cursor-pointer !size-8"
    >
      <LuCopy
        className={cn(
          "absolute transition-opacity duration-300 transform !size-3.5",
          isCopied ? "opacity-0 scale-90" : "opacity-100 scale-100"
        )}
      />
      <LuCheck
        className={cn(
          "absolute transition-opacity duration-300 transform !size-3.5",
          isCopied ? "opacity-100 scale-100" : "opacity-0 scale-90"
        )}
      />
    </Button>
  )
}
