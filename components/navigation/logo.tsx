import Image from 'next/image'
import { Link } from '@/lib/transition'

import { Settings } from '@/types/settings'

export const Logo = () => {
  return (
    <Link
      href="/"
      title={`${Settings.title} main logo`}
      aria-label={`${Settings.title} main logo`}
      className="items-center gap-2.5 hidden md:flex"
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
