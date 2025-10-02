import Image from "next/image"
import { Link } from "lib/transition"

import { Settings } from "@/types/settings"

export function Logo() {
  return (
    <Link
      href="/"
      title={`${Settings.title} main logo`}
      aria-label={`${Settings.title} main logo`}
      className="flex items-center gap-2.5"
    >
      <Image
        src={Settings.siteicon}
        title={`${Settings.title} main logo`}
        alt={`${Settings.title} main logo`}
        width={34}
        height={34}
        loading="lazy"
        decoding="async"
      />
      <span className="text-md font-semibold">{Settings.title}</span>
    </Link>
  )
}
