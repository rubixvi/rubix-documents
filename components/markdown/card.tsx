import { PropsWithChildren } from "react"
import Image from "next/image"
import { iconMap } from "@/settings/icons"
import clsx from "clsx"
import { Link } from "lib/transition"

type CardProps = PropsWithChildren & {
  subtitle?: string
  title: string
  description?: string
  href?: string
  image?: string
  className?: string
  external?: boolean
  icon?: keyof typeof iconMap
  variant?: "normal" | "small" | "image"
}

export function Card({
  subtitle,
  title,
  description,
  href,
  image,
  className,
  external = false,
  icon,
  variant = "normal",
  children,
}: CardProps) {
  const IconComponent = icon ? iconMap[icon] : null
  const ExternalIcon = iconMap["arrowUpRight"]

  const content = (
    <div
      className={clsx(
        "relative border rounded-lg flex overflow-hidden bg-white dark:bg-neutral-900 dark:border-neutral-800 shadow-md transition-shadow duration-300 ease-in-out hover:shadow-lg hover:dark:shadow-md group",
        variant === "small"
          ? "p-3 items-center space-x-2"
          : variant === "image"
            ? "p-0 h-full flex-col justify-between"
            : "p-4 h-full flex-col justify-between",
        className
      )}
    >
      {external && href && variant !== "image" && (
        <div
          className={clsx(
            "absolute top-2 text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transform transition-transform duration-300 ease-in-out group-hover:translate-x-1 group-hover:-translate-y-1",
            variant === "small" ? "right-0" : "right-2"
          )}
        >
          <ExternalIcon className="w-4 h-4" />
        </div>
      )}
      {IconComponent && (
        <IconComponent className="text-gray-500 dark:text-gray-300" />
      )}
      <div>
        {subtitle && variant === "normal" && (
          <p className="text-xs font-semibold !my-1 text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        )}
        {image && variant === "image" && (
          <Image
            src={image}
            alt={title}
            width={400}
            height={400}
            className="w-full h-[180px] object-cover object-center !m-0 border-0 !rounded-none"
          />
        )}
        <div
          className={clsx(
            "transition-all duration-300 group-hover:font-bold",
            variant === "small"
              ? "text-sm"
              : variant === "image"
                ? "text-sm !p-4 !py-2"
                : "text-lg font-semibold",
            className
          )}
        >
          {title}
        </div>
        {description && variant === "normal" && (
          <p className="text-sm font-normal text-gray-600 dark:text-gray-400 !my-2">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  )

  return href ? (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="!no-underline"
    >
      {content}
    </Link>
  ) : (
    content
  )
}

export function CardGrid({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
      {children}
    </div>
  )
}
