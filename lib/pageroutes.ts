import { Documents } from '@/settings/documents';

export type Paths = 
  | {
      title: string;
      href: string;
      noLink?: true;
      heading?: string;
      items?: Paths[];
    }
  | {
      spacer: true;
    };

export const Routes: Paths[] = [
  ...Documents,
];

type Page = { title: string; href: string };

function isRoute(node: Paths): node is Extract<Paths, { title: string; href: string }> {
  return "title" in node && "href" in node;
}

function getAllLinks(node: Paths): Page[] {
  const pages: Page[] = [];

  if (isRoute(node) && !node.noLink) {
    pages.push({ title: node.title, href: node.href });
  }

  if (isRoute(node) && node.items) {
    node.items.forEach((subNode) => {
      if (isRoute(subNode)) {
        const temp = { ...subNode, href: `${node.href}${subNode.href}` };
        pages.push(...getAllLinks(temp));
      }
    });
  }

  return pages;
}

export const PageRoutes = Routes.map((it) => getAllLinks(it)).flat();