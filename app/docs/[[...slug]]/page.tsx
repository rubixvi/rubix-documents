import { notFound } from "next/navigation";
import { getDocument } from "@/lib/markdown";
import { PageRoutes } from "@/lib/pageroutes";
import { Settings } from "@/settings/config";

import PageBreadcrumb from "@/components/pagebreadcrumb";
import Pagination from "@/components/pagination";
import { Typography } from "@/components/typography";

type PageProps = {
  params: { slug: string[] };
};

export default async function Pages({ params: { slug = [] } }: PageProps) {
  const pathName = slug.join("/");
  const res = await getDocument(pathName);

  if (!res) notFound();
  
  return (
    <div className="flex items-start gap-14">
      <div className="flex-[3] pt-10">
        <PageBreadcrumb paths={slug} />
        <Typography>
          <h1 className="text-3xl -mt-2">{res.frontmatter.title}</h1>
          <p className="-mt-4 text-base text-muted-foreground text-[16.5px]">
            {res.frontmatter.description}
          </p>
          <div>{res.content}</div>
          <Pagination pathname={pathName} />
        </Typography>
      </div>
    </div>
  );
}

export async function generateMetadata({ params: { slug = [] } }: PageProps) {
  const pathName = slug.join("/");
  const res = await getDocument(pathName);
  
  if (!res) return null;

  const { frontmatter } = res;

  return {
    title: `${frontmatter.title} - ${Settings.title}`,
    description: frontmatter.description,
  };
}

export function generateStaticParams() {
  return PageRoutes
    .filter((item) => item.href)
    .map((item) => ({
      slug: item.href.split("/").slice(1),
    }));
}
