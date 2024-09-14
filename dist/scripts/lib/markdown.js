"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDocument = getDocument;
exports.getPreviousNext = getPreviousNext;
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const rsc_1 = require("next-mdx-remote/rsc");
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const rehype_prism_plus_1 = __importDefault(require("rehype-prism-plus"));
const rehype_autolink_headings_1 = __importDefault(require("rehype-autolink-headings"));
const rehype_slug_1 = __importDefault(require("rehype-slug"));
const rehype_code_titles_1 = __importDefault(require("rehype-code-titles"));
const rehype_katex_1 = __importDefault(require("rehype-katex"));
const unist_util_visit_1 = require("unist-util-visit");
const pageroutes_1 = require("./pageroutes");
const components_1 = require("./components");
async function parseMdx(rawMdx) {
    return await (0, rsc_1.compileMDX)({
        source: rawMdx,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                rehypePlugins: [
                    preCopy,
                    rehype_code_titles_1.default,
                    rehype_katex_1.default,
                    rehype_prism_plus_1.default,
                    rehype_slug_1.default,
                    rehype_autolink_headings_1.default,
                    postCopy,
                ],
                remarkPlugins: [remark_gfm_1.default],
            },
        },
        components: components_1.components,
    });
}
async function getDocument(slug) {
    try {
        const contentPath = getDocumentPath(slug);
        const rawMdx = await fs_1.promises.readFile(contentPath, "utf-8");
        return await parseMdx(rawMdx);
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
function getPreviousNext(path) {
    const index = pageroutes_1.PageRoutes.findIndex(({ href }) => href == `/${path}`);
    return {
        prev: pageroutes_1.PageRoutes[index - 1],
        next: pageroutes_1.PageRoutes[index + 1],
    };
}
function getDocumentPath(slug) {
    return path_1.default.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
}
const preCopy = () => (tree) => {
    (0, unist_util_visit_1.visit)(tree, (node) => {
        if (node?.type === "element" && node?.tagName === "pre") {
            const [codeEl] = node.children;
            if (codeEl.tagName !== "code")
                return;
            node.raw = codeEl.children?.[0].value;
        }
    });
};
const postCopy = () => (tree) => {
    (0, unist_util_visit_1.visit)(tree, "element", (node) => {
        if (node?.type === "element" && node?.tagName === "pre") {
            node.properties["raw"] = node.raw;
        }
    });
};
