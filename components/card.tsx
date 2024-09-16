import { PropsWithChildren } from "react";
import Link from "next/link";

import { LuArrowUpRight } from "react-icons/lu";
import clsx from "clsx";

type CardProps = PropsWithChildren & {
  subtitle: string;
  title: string;
  description?: string;
  href: string;
  className?: string;
  external?: boolean;
};

export default function Card({
  subtitle,
  title,
  description,
  href,
  className,
  external = false,
  children,
}: CardProps) {
  return (
    <Link
      href={href}
      passHref
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      className="no-underline"
    >
        <div
        className={clsx(
            "relative p-6 border rounded-lg h-full flex flex-col justify-between bg-white hover:dark:shadow-[#711069] dark:bg-neutral-900 dark:border-neutral-800 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg hover:dark:shadow-md",
            className
        )}
        >
        {external && (
            <div className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transform transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1">
                <LuArrowUpRight className="w-4 h-4 group-hover:stroke-[4]" strokeWidth={3} />
            </div>
        )}

        <div>
          <p className="text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
          <h3 className="text-lg font-semibold mt-0 mb-2 transition-all group-hover:font-bold">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {description}
            </p>
          )}
        </div>
        <div>{children}</div>
      </div>
    </Link>
  );
}
