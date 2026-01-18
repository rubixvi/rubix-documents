import { Link } from 'lib/transition'
import Image from 'next/image'

import { Settings } from '@/types/settings'

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
        alt={`${Settings.title} main logo`}
        title={`${Settings.title} main logo`}
        aria-label={`${Settings.title} main logo`}
        width={34}
        height={34}
        loading="lazy"
        decoding="async"
      />
      <span className="text-md font-semibold">{Settings.title}</span>
    </Link>
  )
}
