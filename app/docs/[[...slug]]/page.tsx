import { notFound } from "next/navigation";
import { getDocument } from "@/lib/markdown";
import { PageRoutes } from "@/lib/pageroutes";
import { Settings } from "@/settings/config";

import GitHub from "@/components/GitHub";
import PageBreadcrumb from "@/components/pagebreadcrumb";
import Pagination from "@/components/pagination";
import Toc from "@/components/toc";
import { Typography } from "@/components/typography";

type PageProps = {
  params: { slug: string[] };
};

export const revalidate = 60; 

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
      {Settings.rightbar && (
        <div className="hidden xl:flex xl:flex-col sticky top-16 gap-5 py-8 min-w-[230px] h-[94.5vh] toc">
          <Toc path={pathName} />
          {Settings.fbedit && <GitHub slug={pathName} title={res.frontmatter.title} />}
        </div>
      )}
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

