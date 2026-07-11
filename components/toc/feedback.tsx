import Link from 'next/link'
import { LuArrowUpRight } from 'react-icons/lu'

import { GitHubLink } from '@/settings/navigation'

interface FeedbackProps {
  slug: string
  title: string
}

export function Feedback({ slug, title }: FeedbackProps) {
  const feedbackUrl = `${GitHubLink.href}/issues/new?title=Feedback for "${title}"&labels=feedback`
  const editUrl = `${GitHubLink.href}/edit/main/contents/docs/${slug}/index.mdx`

  return (
    <div className="flex flex-col gap-3 pl-2">
      <h3 className="text-sm font-semibold">Content</h3>
      <div className="flex flex-col gap-2">
        <Link
          aria-label="Give Feedback"
          className="flex items-center text-sm text-foreground"
          href={feedbackUrl}
          rel="noopener noreferrer"
          target="_blank"
          title="Give Feedback"
        >
          <LuArrowUpRight className="mr-1 inline-block h-4 w-4" />
          <span>Feedback</span>
        </Link>
        <Link
          aria-label="Edit this page"
          className="flex items-center text-sm text-foreground"
          href={editUrl}
          rel="noopener noreferrer"
          target="_blank"
          title="Edit this page"
        >
          <LuArrowUpRight className="mr-1 inline-block h-4 w-4" />
          <span>Edit page</span>
        </Link>
      </div>
    </div>
  )
}
