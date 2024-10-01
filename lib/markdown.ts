import path from "path";
import { createReadStream, promises as fs } from "fs";

import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeKatex from 'rehype-katex'
import { visit } from "unist-util-visit";

import { PageRoutes } from "@/lib/pageroutes";
import { components } from '@/lib/components'; 
import { Settings } from "@/lib/meta";
import { GitHubLink } from "@/settings/navigation";

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
  keywords: string;
};

const computeDocumentPath = (slug: string) => {
  return Settings.gitload
    ? `${GitHubLink.href}/raw/main/contents/docs/${slug}/index.mdx`
    : path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
};

const getDocumentPathMemoized = (() => {
  const cache = new Map<string, string>();
  return (slug: string) => {
    if (!cache.has(slug)) {
      cache.set(slug, computeDocumentPath(slug));
    }
    return cache.get(slug)!;
  };
})();

export async function getDocument(slug: string) {
  try {
    const contentPath = getDocumentPathMemoized(slug);
    let rawMdx = "";
    let lastUpdated: string | null = null;

    if (Settings.gitload) {
      const response = await fetch(contentPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch content from GitHub: ${response.statusText}`);
      }
      rawMdx = await response.text();
      lastUpdated = response.headers.get('Last-Modified') ?? null;
    } else {
      rawMdx = await fs.readFile(contentPath, "utf-8");
      const stats = await fs.stat(contentPath);
      lastUpdated = stats.mtime.toISOString();
    }

    const parsedMdx = await parseMdx<BaseMdxFrontmatter>(rawMdx);
    const tocs = await getTable(slug);

    return {
      frontmatter: parsedMdx.frontmatter,
      content: parsedMdx.content,
      tocs,
      lastUpdated,
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

const headingsRegex = /^(#{2,4})\s(.+)$/gm;

export async function getTable(slug: string): Promise<Array<{ level: number; text: string; href: string }>> {
  const extractedHeadings: Array<{ level: number; text: string; href: string }> = [];
  let rawMdx = "";

  if (Settings.gitload) {
    const contentPath = `${GitHubLink.href}/raw/main/contents/docs/${slug}/index.mdx`;
    try {
      const response = await fetch(contentPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch content from GitHub: ${response.statusText}`);
      }
      rawMdx = await response.text();
    } catch (error) {
      console.error("Error fetching content from GitHub:", error);
      return [];
    }
  } else {
    const contentPath = path.join(process.cwd(), "/contents/docs/", `${slug}/index.mdx`);
    try {
      const stream = createReadStream(contentPath, { encoding: 'utf-8' });
      for await (const chunk of stream) {
        rawMdx += chunk;
      }
    } catch (error) {
      console.error("Error reading local file:", error);
      return [];
    }
  }

  let match;
  while ((match = headingsRegex.exec(rawMdx)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    extractedHeadings.push({
      level: level,
      text: text,
      href: `#${innerslug(text)}`,
    });
  }

  return extractedHeadings;
}

function innerslug(text: string) {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

const pathIndexMap = new Map(PageRoutes.map((route, index) => [route.href, index]));

export function getPreviousNext(path: string) {
  const index = pathIndexMap.get(`/${path}`);

  if (index === undefined || index === -1) {
    return { prev: null, next: null };
  }

  const prev = index > 0 ? PageRoutes[index - 1] : null;
  const next = index < PageRoutes.length - 1 ? PageRoutes[index + 1] : null;

  return { prev, next };
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