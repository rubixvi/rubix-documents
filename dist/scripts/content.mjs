import path from "path";
import { promises as fs } from "fs";
import { compile } from "@mdx-js/mdx";
import remarkGfm from "remark-gfm";
import rehypePrism from "rehype-prism-plus";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeKatex from "rehype-katex";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
const docsDir = path.join(process.cwd(), "contents/docs");
const outputDir = path.join(process.cwd(), "public", "search-data");
function createSlug(filePath) {
    const relativePath = path.relative(docsDir, filePath);
    const parsed = path.parse(relativePath);
    if (parsed.name === "index") {
        return parsed.dir || '/';
    }
    else {
        return path.join(parsed.dir, parsed.name);
    }
}
async function processMdxFile(filePath) {
    const rawMdx = await fs.readFile(filePath, "utf-8");
    const plainContent = await unified()
        .use(remarkParse)
        .use(remarkStringify)
        .process(rawMdx);
    const compiledMdx = await compile(rawMdx, {
        remarkPlugins: [remarkGfm, remarkRehype],
        rehypePlugins: [
            rehypeSlug,
            rehypeAutolinkHeadings,
            rehypeCodeTitles,
            rehypeKatex,
            [rehypePrism, { ignoreMissing: true }],
        ],
        format: "mdx",
    });
    const frontmatter = compiledMdx.data?.frontmatter || {};
    const slug = createSlug(filePath);
    return {
        slug,
        frontmatter,
        content: String(plainContent.value),
    };
}
async function getMdxFiles(dir) {
    let files = [];
    const items = await fs.readdir(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            const subFiles = await getMdxFiles(fullPath);
            files = files.concat(subFiles);
        }
        else if (item.name.endsWith(".mdx")) {
            files.push(fullPath);
        }
    }
    return files;
}
async function ensureDirectoryExists(filePath) {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
}
async function convertMdxToJson() {
    try {
        const mdxFiles = await getMdxFiles(docsDir);
        for (const file of mdxFiles) {
            const jsonData = await processMdxFile(file);
            const outputFilePath = path.join(outputDir, `${jsonData.slug}.json`);
            await ensureDirectoryExists(outputFilePath);
            await fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2));
        }
        console.log("All MDX files have been converted to JSON.");
    }
    catch (err) {
        console.error("Error processing MDX files:", err);
    }
}
convertMdxToJson();
