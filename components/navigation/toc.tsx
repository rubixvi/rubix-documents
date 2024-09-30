"use client";

import Link from "next/link";
import clsx from "clsx";
import { ScrollArea } from "@/components/ui/scroll-area";

type TocProps = {
  tocs: { href: string; level: number; text: string }[];
};

export default function Toc({ tocs }: TocProps) {
  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, '', href);
    }
  };

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
              scroll={false}
              onClick={(e) => handleSmoothScroll(e, href)}
              className={clsx({
                "pl-0": level == 2,
                "pl-3": level == 3,
                "pl-6": level == 4,
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
