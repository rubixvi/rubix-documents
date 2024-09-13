import { PropsWithChildren } from "react";

export function Typography({ children }: PropsWithChildren) {
  return (
    <div className="text-sm prose prose-zinc dark:prose-invert prose-headings:scroll-m-20 w-[85vw] sm:w-full sm:mx-auto pt-2 !min-w-full prose-code:text-xs prose-code:leading-6 prose-code:bg-white dark:prose-code:bg-neutral-900 prose-code:text-neutral-800 dark:prose-code:text-white prose-code:font-code prose-code:p-1 prose-code:rounded-md prose-pre:bg-neutral-100 dark:prose-pre:bg-neutral-900 prose-pre:border prose-code:before:content-none prose-code:after:content-none prose-img:rounded-md prose-img:border">
      {children}
    </div>
  );
}
