'use client'

import Link from 'next/link'
import { LuArrowUpRight, LuGithub } from 'react-icons/lu'

import { Anchor } from '@/components/anchor'
import { Logo } from '@/components/navigation/logo'
import { Search } from '@/components/navigation/search'
import { SheetLeft } from '@/components/sidebar'
import { buttonVariants } from '@/components/ui/button'
import { SheetClose } from '@/components/ui/sheet'
import { ModeToggle } from '@/components/ui/theme-toggle'
import { GitHubLink, Navigations } from '@/settings/navigation'

export function Navbar() {
  return (
    <nav className="bg-opacity-5 sticky top-0 z-50 mx-auto flex h-16 w-full items-center justify-between border-b p-1 px-2 backdrop-blur-xl backdrop-filter sm:p-3 md:gap-2 md:px-4">
      <div className="flex items-center gap-5">
        <SheetLeft />
        <Logo />
        <div className="hidden items-center gap-5 text-sm font-medium text-muted-foreground md:flex">
          <NavMenu />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Search />
        <div className="flex gap-2 sm:ml-0">
          {GitHubLink.href && (
            <Link
              aria-label="View the repository on GitHub"
              className={buttonVariants({ variant: 'outline', size: 'icon-lg' })}
              href={GitHubLink.href}
              rel="noopener noreferrer"
              target="_blank"
              title="View the repository on GitHub"
            >
              <LuGithub className="size-4" />
            </Link>
          )}
          <ModeToggle />
        </div>
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
            absolute
            activeClassName="font-bold text-primary"
            className="flex items-center gap-1 text-sm"
            href={item.href}
            key={item.title + item.href}
            rel={item.external ? 'noopener noreferrer' : undefined}
            target={item.external ? '_blank' : undefined}
          >
            {item.title}{' '}
            {item.external && <LuArrowUpRight className="h-3 w-3 align-super" strokeWidth={3} />}
          </Anchor>
        )
        return isSheet ? (
          <SheetClose asChild key={item.title + item.href}>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        )
      })}
    </>
  )
}
