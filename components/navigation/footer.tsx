import Link from "next/link"

import { Settings } from "@/types/settings"

export function Footer() {
  return (
    <footer className="text-foreground flex h-16 w-full flex-wrap items-center justify-center gap-4 border-t px-2 py-3 text-sm sm:justify-between sm:gap-0 sm:px-4 sm:py-0 lg:px-8">
      <p className="items-center">
        &copy; {new Date().getFullYear()}{" "}
        Validador de Payload Official
      </p>
    </footer>
  )
}
