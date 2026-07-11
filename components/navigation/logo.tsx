import Image from 'next/image'

import { Link } from '@/lib/transition'
import { Settings } from '@/types/settings'

export function Logo() {
  return (
    <Link
      aria-label={`${Settings.title} main logo`}
      className="items-center gap-2.5 hidden md:flex"
      href="/"
      title={`${Settings.title} main logo`}
    >
      <Image
        alt={`${Settings.title} main logo`}
        aria-label={`${Settings.title} main logo`}
        decoding="async"
        height={34}
        loading="lazy"
        src={Settings.siteicon}
        title={`${Settings.title} main logo`}
        width={34}
      />
      <span className="text-md font-semibold">{Settings.title}</span>
    </Link>
  )
}
