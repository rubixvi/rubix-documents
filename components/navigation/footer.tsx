import Image from "next/image"
import Link from "next/link"

import { Company } from "@/lib/meta"

export function Footer() {
  return (
    <footer className="h-16 w-full border-t">
      <div className="text-muted-foreground flex h-full w-full flex-wrap items-center justify-center gap-4 px-2 py-3 text-sm sm:justify-between sm:gap-0 sm:px-4 sm:py-0 lg:px-8">
        <p className="text-center">
          &copy; {new Date().getFullYear()}{" "}
          <Link className="font-semibold" href={Company.link}>
            {Company.name}
          </Link>
          .
        </p>
        {Company.branding !== false && (
          <div className="hidden text-center md:block">
            <Link
              className="font-semibold"
              href="https://rubixstudios.com.au"
              target="_blank"
            >
              <Image
                src="/logo.svg"
                alt="Rubix Studios Logo"
                width={30}
                height={30}
              />
            </Link>
          </div>
        )}
      </div>
    </footer>
  )
}
