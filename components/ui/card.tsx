import { PropsWithChildren } from "react";
import Link from "next/link";
import clsx from "clsx";

import { iconMap } from "@/settings/icons";

type CardProps = PropsWithChildren & {
  subtitle?: string;
  title: string;
  description?: string;
  href?: string;
  className?: string;
  external?: boolean;
  icon?: keyof typeof iconMap;
  variant?: "normal" | "small" | "image";
};

export default function Card({
  subtitle,
  title,
  description,
  href,
  className,
  external = false,
  icon,
  variant = "normal",
  children,
}: CardProps) {
  const IconComponent = icon ? iconMap[icon] : null;
  const ExternalIcon = iconMap["arrowUpRight"];

  const content = (
    <div
      className={clsx(
        "",
        variant === "small"
        ? "relative border rounded-lg p-3 flex items-center space-x-2 bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg hover:dark:shadow-md"
        : "relative p-6 border rounded-lg h-full flex flex-col justify-between bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg hover:dark:shadow-md",
        className
      )}
    >
      {external && href && (
        <div className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transform transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1">
          <ExternalIcon className="w-4 h-4 group-hover:stroke-[4]" strokeWidth={3} />
        </div>
      )}
      {IconComponent && <IconComponent className="text-gray-500 dark:text-gray-300" />}
      <div>
      {subtitle && (variant === "normal" || variant !== "small") && (
        <p className="text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
        
      <div
        className={clsx(
          variant === "small" 
          ? "text-sm transition-all group-hover:font-bold"
          : "text-lg font-semibold transition-all group-hover:font-bold",
          className
        )}
      >
        {title}
      </div>
        {description && variant !== "small" && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 mb-2">{description}</p>
        )}
      </div>
      {children}
    </div>
  );

  return href ? (
    <Link
      href={href}
      passHref
      target={external ? "_blank" : "_self"}
      rel={external ? "noopener noreferrer" : undefined}
      className="no-underline"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
