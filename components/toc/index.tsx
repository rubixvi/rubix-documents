import { TableAnchor, TableAnchorProps } from '@/components/toc/anchor'
import { BackToTop } from '@/components/toc/backtotop'
import Feedback from '@/components/toc/feedback'
import { Settings } from '@/types/settings'

interface TableProps {
  tocs: TableAnchorProps
  pathName: string
  frontmatter: { title: string }
}

export function TableOfContents({ tocs, pathName, frontmatter }: TableProps) {
  return (
    <>
      {Settings.rightbar && (
        <aside
          className="toc sticky top-26 hidden h-screen min-w-57.5 gap-3 xl:flex xl:flex-col"
          aria-label="Table of contents"
        >
          {Settings.toc && <TableAnchor tocs={tocs.tocs} />}
          {Settings.feedback && <Feedback slug={pathName} title={frontmatter.title} />}
          {Settings.totop && <BackToTop />}
        </aside>
      )}
    </>
  )
}
