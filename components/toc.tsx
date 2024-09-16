import Link from "next/link";
import clsx from "clsx";

import { getTable } from "@/lib/markdown";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function Toc({ path }: { path: string }) {
  const tocs = await getTable(path);

  if (!tocs.length) {
    return null;
  }
  
  return (
    <div className="flex flex-col gap-3 w-full pl-2">
      <h3 className="text-sm font-semibold">On this page</h3>
      <ScrollArea className="pt-0.5 pb-4">
        <div className="flex flex-col gap-2.5 text-sm text-neutral-800 dark:text-neutral-300/85">
          {tocs.map(({ href, level, text }) => (
            <Link
              key={href}
              href={href}
              className={clsx({
                "pl-0": level == 2,
                "pl-4": level == 3,
                "pl-8 ": level == 4,
              })}
            >
              {text}
            </Link>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}