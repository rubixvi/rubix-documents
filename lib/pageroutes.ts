import { Documents } from '@/settings/documents';

export type Paths = {
  title: string;
  href: string;
  noLink?: true;
  heading?: string;
  items?: Paths[];
  spacer?: boolean;
};

export const Routes: Paths[] = [
  ...Documents,
];

type Page = { title: string; href: string };

function getRecurrsiveAllLinks(node: Paths) {
  const ans: Page[] = [];
  if (!node.noLink) {
    ans.push({ title: node.title, href: node.href });
  }
  node.items?.forEach((subNode) => {
    const temp = { ...subNode, href: `${node.href}${subNode.href}` };
    ans.push(...getRecurrsiveAllLinks(temp));
  });
  return ans;
}

export const PageRoutes = Routes.map((it) => getRecurrsiveAllLinks(it)).flat();
