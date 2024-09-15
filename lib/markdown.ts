import path from "path";
import { promises as fs, createReadStream } from "fs";

import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeKatex from 'rehype-katex'
import { visit } from "unist-util-visit";

import { PageRoutes } from "./pageroutes";
import { components } from './components'; 

async function parseMdx<Frontmatter>(rawMdx: string) {
  return await compileMDX<Frontmatter>({
    source: rawMdx,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        rehypePlugins: [
          preCopy,
          rehypeCodeTitles,
          rehypeKatex,
          rehypePrism,
          rehypeSlug,
          rehypeAutolinkHeadings,
          postCopy,
        ],
        remarkPlugins: [remarkGfm],
      },
    },
    components,
  });
}

type BaseMdxFrontmatter = {
  title: string;
  description: string;
};

const getDocumentPathMemoized = (() => {
  const cache = new Map<string, string>();
  return (slug: string) => {
    const cachedPath = cache.get(slug);
    if (cachedPath) return cachedPath;

    const contentPath = path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
    cache.set(slug, contentPath);
    return contentPath;
  };
})();

export async function getDocument(slug: string) {
  try {
    const contentPath = getDocumentPathMemoized(slug);
    const rawMdx = await fs.readFile(contentPath, "utf-8");
    return await parseMdx<BaseMdxFrontmatter>(rawMdx);
  } catch (err) {
    console.log(err);
    return null;
  }
}

const headingsRegex = /^(#{2,4})\s(.+)$/gm;

export async function getTable(slug: string) {
  const contentPath = await getDocumentPath(slug);
  const extractedHeadings = [];

  const stream = createReadStream(contentPath, { encoding: 'utf-8' });
  for await (const chunk of stream) {
    const matches = [...chunk.matchAll(headingsRegex)];
    extractedHeadings.push(...matches.map((match) => {
      const level = match[1].length;
      const text = match[2].trim();
      return {
        level: level,
        text: text,
        href: `#${innerslug(text)}`,
      };
    }));
  }

  return extractedHeadings;
}

function innerslug(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

function getDocumentPath(slug: string) {
  return path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
}

const pathIndexMap = new Map(PageRoutes.map((route, index) => [route.href, index]));

export function getPreviousNext(path: string) {
  const index = pathIndexMap.get(`/${path}`) || -1;
  return {
    prev: PageRoutes[index - 1],
    next: PageRoutes[index + 1],
  };
}

const preCopy = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "pre") {
      const [codeEl] = node.children;
      if (codeEl?.tagName === "code") {
        node.raw = codeEl.children?.[0]?.value || "";
      }
    }
  });
};

const postCopy = () => (tree: any) => {
  visit(tree, "element", (node) => {
    if (node.tagName === "pre" && node.raw) {
      node.properties["raw"] = node.raw;
    }
  });
};