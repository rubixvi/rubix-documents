import { Documents } from '../settings/documents.mjs';
export const Routes = [
    ...Documents,
];
function isRoute(node) {
    return "title" in node && "href" in node;
}
function getAllLinks(node) {
    const ans = [];
    if (isRoute(node) && !node.noLink) {
        ans.push({ title: node.title, href: node.href });
    }
    if (isRoute(node) && node.items) {
        node.items.forEach((subNode) => {
            if (isRoute(subNode)) {
                const temp = { ...subNode, href: `${node.href}${subNode.href}` };
                ans.push(...getAllLinks(temp));
            }
        });
    }
    return ans;
}
export const PageRoutes = Routes.map((it) => getAllLinks(it)).flat();
