import { Fragment } from "react"
import { toTitleCase } from "@/utils/toTitleCase"
import { Link } from "lib/transition"
import { LuHouse } from "react-icons/lu"

import { PageRoutes } from "@/lib/pageroutes"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function ArticleBreadcrumb({ paths }: { paths: string[] }) {
  return (
    <div className="pb-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                title="Documentation Home"
                aria-label="Documentation Home"
                href={`/docs${PageRoutes[0].href}`}
              >
                <LuHouse className="h-4" />
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>

          {paths.length > 2 ? (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    title={toTitleCase(paths[0])}
                    aria-label={toTitleCase(paths[0])}
                    href={`/docs/${paths[0]}`}
                  >
                    {toTitleCase(paths[0])}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbEllipsis className="h-1" />
              </BreadcrumbItem>

              {paths.slice(-1).map((path, i) => {
                const index = paths.length - 1 + i
                const href = `/docs/${paths.slice(0, index + 1).join("/")}`

                return (
                  <Fragment key={path}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {index < paths.length - 1 ? (
                        <BreadcrumbLink asChild>
                          <Link
                            title={toTitleCase(path)}
                            aria-label={toTitleCase(path)}
                            href={href}
                          >
                            {toTitleCase(path)}
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage className="b">
                          {toTitleCase(path)}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  </Fragment>
                )
              })}
            </>
          ) : (
            paths.map((path, index) => {
              const href = `/docs/${paths.slice(0, index + 1).join("/")}`

              return (
                <Fragment key={path}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {index < paths.length - 1 ? (
                      <BreadcrumbLink asChild>
                        <Link
                          title={toTitleCase(path)}
                          aria-label={toTitleCase(path)}
                          href={href}
                        >
                          {toTitleCase(path)}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="b">
                        {toTitleCase(path)}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  )
}
