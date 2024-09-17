import path from "path";
import { promises as fs } from "fs";
import grayMatter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { Documents } from '../settings/documents.mjs';
const docsDir = path.join(process.cwd(), "contents/docs");
const outputDir = path.join(process.cwd(), "public", "search-data");
function isRoute(node) {
    return "href" in node && "title" in node;
}
function createSlug(filePath) {
    const relativePath = path.relative(docsDir, filePath);
    const parsed = path.parse(relativePath);
    const slugPath = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name;
    const normalizedSlug = slugPath.replace(/\\/g, '/');
    if (parsed.name === "index") {
        return `/${parsed.dir.replace(/\\/g, '/')}` || "/";
    }
    else {
        return `/${normalizedSlug}`;
    }
}
function findDocumentBySlug(slug) {
    function searchDocs(docs, currentPath = "") {
        for (const doc of docs) {
            if (isRoute(doc)) {
                const fullPath = currentPath + doc.href;
                if (fullPath === slug)
                    return doc;
                if (doc.items) {
                    const found = searchDocs(doc.items, fullPath);
                    if (found)
                        return found;
                }
            }
        }
        return null;
    }
    return searchDocs(Documents);
}
async function ensureDirectoryExists(dir) {
    try {
        await fs.access(dir);
    }
    catch (err) {
        await fs.mkdir(dir, { recursive: true });
    }
}
function removeCustomComponents() {
    const customComponentNames = [
        "Tabs",
        "TabsList",
        "TabsTrigger",
        "pre",
        "Mermaid",
    ];
    return (tree) => {
        visit(tree, "mdxJsxFlowElement", (node, index, parent) => {
            if (customComponentNames.includes(node.name)) {
                parent.children.splice(index, 1);
            }
        });
    };
}
async function processMdxFile(filePath) {
    const rawMdx = await fs.readFile(filePath, "utf-8");
    const { content, data: frontmatter } = grayMatter(rawMdx);
    const plainContent = await unified()
        .use(remarkParse)
        .use(remarkMdx)
        .use(removeCustomComponents)
        .use(remarkStringify)
        .process(content);
    const slug = createSlug(filePath);
    const matchedDoc = findDocumentBySlug(slug);
    return {
        slug,
        title: frontmatter.title || (matchedDoc && isRoute(matchedDoc) ? matchedDoc.title : "Untitled"),
        description: frontmatter.description || "",
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
async function convertMdxToJson() {
    try {
        await ensureDirectoryExists(outputDir);
        const mdxFiles = await getMdxFiles(docsDir);
        const combinedData = [];
        for (const file of mdxFiles) {
            const jsonData = await processMdxFile(file);
            combinedData.push(jsonData);
        }
        const combinedOutputPath = path.join(outputDir, "documents.json");
        await fs.writeFile(combinedOutputPath, JSON.stringify(combinedData, null, 2));
    }
    catch (err) {
        console.error("Error processing MDX files:", err);
    }
}
convertMdxToJson();
