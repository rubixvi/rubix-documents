import { TableAnchor, type TableAnchorProps } from '@/components/toc/anchor'
import { BackToTop } from '@/components/toc/backtotop'
import { Feedback } from '@/components/toc/feedback'
import { Settings } from '@/types/settings'

interface TableProps {
  frontmatter: { title: string }
  pathName: string
  tocs: TableAnchorProps
}

export function TableOfContents({ tocs, pathName, frontmatter }: TableProps) {
  return (
    <>
      {Settings.rightbar && (
        <aside
          aria-label="Table of contents"
          className="toc sticky top-26 hidden h-screen min-w-57.5 gap-3 xl:flex xl:flex-col"
        >
          {Settings.toc && <TableAnchor tocs={tocs.tocs} />}
          {Settings.feedback && <Feedback slug={pathName} title={frontmatter.title} />}
          {Settings.totop && <BackToTop />}
        </aside>
      )}
    </>
  )
}
