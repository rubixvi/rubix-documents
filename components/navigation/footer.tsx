import Image from "next/image"
import Link from "next/link"

import { Settings } from "@/lib/meta"

export function Footer() {
  return (
    <footer className="h-16 w-full border-t">
      <div className="text-muted-foreground flex h-full w-full flex-wrap items-center justify-center gap-4 px-2 py-3 text-sm sm:justify-between sm:gap-0 sm:px-4 sm:py-0 lg:px-8">
        <p className="text-center">
          &copy; {new Date().getFullYear()}{" "}
          <Link
            title={Settings.name}
            aria-label={Settings.name}
            className="font-semibold"
            href={Settings.link}
          >
            {Settings.name}
          </Link>
          .
        </p>
        {Settings.branding !== false && (
          <div className="hidden text-center md:block">
            <Link
              className="font-semibold"
              href="https://rubixstudios.com.au"
              title="Rubix Studios"
              aria-label="Rubix Studios"
              target="_blank"
            >
              <Image
                src="/logo.svg"
                alt="Rubix Studios Logo"
                title="Rubix Studios Logo"
                aria-label="Rubix Studios Logo"
                priority={false}
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
