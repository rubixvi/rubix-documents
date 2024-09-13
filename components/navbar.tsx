import Image from "next/image";
import Link from "next/link";
import { Settings } from "@/lib/settings";
import { LuArrowUpRight, LuGithub } from "react-icons/lu";

import { ModeToggle } from "@/components/theme-toggle";
import { SheetLeft } from "./sidebar";
import { buttonVariants } from "./ui/button";
import Search from "./search";
import Anchor from "./anchor";
import { Navigations, GitHubLink } from "@/lib/navigation";
import { SheetClose } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full h-16 border-b backdrop-filter backdrop-blur-xl bg-opacity-5 lg:px-4 px-2">
      <div className="mx-auto flex h-full items-center justify-between p-1 sm:p-3 md:gap-2">
        <div className="flex items-center gap-5">
          <SheetLeft />
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex">
              <Logo />
            </div>
            <div className="hidden lg:flex items-center gap-5 text-sm font-medium text-muted-foreground">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Search />
            <div className="flex ml-2.5 sm:ml-0">
            {GitHubLink.href && (
              <>
                <Link
                  href={GitHubLink.href}
                  className={buttonVariants({ variant: "ghost", size: "icon" })}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LuGithub className="w-[1.1rem] h-[1.1rem]" />
                </Link>
              </>
            )}
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <Image 
        src={Settings.siteicon}
        alt={Settings.title}
        width={34}
        height={34}
      />
      <h1 className="text-md font-semibold">{Settings.title}</h1>
    </Link>
  );
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {Navigations.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="font-bold text-primary"
            absolute
            className="flex items-center gap-1 text-sm"
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noopener noreferrer" : undefined}
          >
            {item.title}{" "}
            {item.external && (
              <LuArrowUpRight
                className="w-3 h-3 align-super"
                strokeWidth={3}
              />
            )}
          </Anchor>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        );
      })}
    </>
  );
}
