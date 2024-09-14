"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageRoutes = exports.Routes = void 0;
const documents_1 = require("@/settings/documents");
exports.Routes = [
    ...documents_1.Documents,
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
exports.PageRoutes = exports.Routes.map((it) => getAllLinks(it)).flat();
