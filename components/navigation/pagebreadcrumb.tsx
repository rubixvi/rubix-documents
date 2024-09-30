import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PageBreadcrumb({ paths }: { paths: string[] }) {
  return (
    <div className="pb-5">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>Docs</BreadcrumbLink>
          </BreadcrumbItem>

          {paths.map((path, index) => {
            const href = `/docs/${paths.slice(0, index + 1).join("/")}`;

            return (
              <Fragment key={path}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {index < paths.length - 1 ? (
                      <BreadcrumbLink href={href} className="a">
                        {toTitleCase(path)}
                      </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="b">
                      {toTitleCase(path)}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}

function toTitleCase(input: string): string {
  const words = input.split("-");
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  return capitalizedWords.join(" ");
}
