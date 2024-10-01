import Link from "next/link";

import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { getPreviousNext } from "@/lib/markdown";

export default function Pagination({ pathname }: { pathname: string }) {
  const res = getPreviousNext(pathname);

  return (
    <div className="flex items-center justify-between sm:py-7 py-5">
      <div>
        {res.prev && (
          <Link
            className="inline-flex items-center justify-center h-9 px-4 py-2 ml-auto whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !no-underline"
            href={`/docs${res.prev.href}`}
          >
            <LuChevronLeft className="w-[1rem] h-[1rem] mr-1" />
            <p>{res.prev.title}</p>
          </Link>
        )}
      </div>
      <div>
        {res.next && (
          <Link
            className="inline-flex items-center justify-center h-9 px-4 py-2 ml-auto whitespace-nowrap rounded-md text-sm font-medium border border-input bg-background shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 !no-underline"
            href={`/docs${res.next.href}`}
          >
            <p>{res.next.title}</p>
            <LuChevronRight className="w-[1rem] h-[1rem] ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
