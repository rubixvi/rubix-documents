import Link from "next/link"
import {Navigations } from "@/settings/navigation"
import { LuArrowUpRight,} from "react-icons/lu"

import { buttonVariants } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import Anchor from "@/components/anchor"
import { SheetLeft } from "@/components/sidebar"
import { ModeToggle } from "@/components/theme-toggle"
import Image from "next/image"

export function Navbar() {
  return (
    <nav className="bg-opacity-5 sticky top-0 z-50 mx-auto flex h-16 w-full items-center justify-between border-b p-1 px-2 backdrop-blur-xl backdrop-filter sm:p-3 md:gap-2 md:px-4">
      <div className="flex items-center gap-5">
        <SheetLeft />
        <div className="flex items-center gap-6">
          <div className="hidden md:flex">
          <div className="flex gap-4 items-center">
              <Image
                src="/microcash-logo.png"
                alt="microcash-logo"
                title="Validador de Payload"
                aria-label="microcash-logo"
                priority={false}
                width={150}
                height={150}
              />
              <div className="h-8 border-l border-gray-600 mx-2" />
              <Image
                src="/a55.png"
                alt="a55-logo"
                title="Validador de Payload"
                aria-label="a55-logo"
                priority={false}
                width={80}
                height={80}
              />       
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href='https://docs.a55scd.com.br/'
          className={
            buttonVariants({ variant: "outline" }) +
            " px-3 py-2 text-sm transition-colors hover:bg-[#01a2f8] hover:text-white"
          }
          target="_blank"
          rel="noopener noreferrer"
          title="View the repository on GitHub"
          aria-label="View the repository on GitHub"
        >
          Doc a55
        </Link>
        <Link
          href='https://docs.microcashif.com.br/'
          className={
            buttonVariants({ variant: "outline" }) +
            " px-3 py-2 text-sm transition-colors hover:bg-[#13cf27] hover:text-white"
          }
          target="_blank"
          rel="noopener noreferrer"
          title="View the repository on GitHub"
          aria-label="View the repository on GitHub"
        >
          Doc Microcash
        </Link>
        <ModeToggle />
      </div>
    </nav>
  )
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {Navigations.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            absolute
            activeClassName="font-bold text-primary"
            className="flex items-center gap-1 text-sm"
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
          >
            {item.title}{" "}
            {item.external && (
              <LuArrowUpRight className="h-3 w-3 align-super" strokeWidth={3} />
            )}
          </Anchor>
        )
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        )
      })}
    </>
  )
}
