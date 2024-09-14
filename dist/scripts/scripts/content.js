"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const rsc_1 = require("next-mdx-remote/rsc");
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const rehype_prism_plus_1 = __importDefault(require("rehype-prism-plus"));
const rehype_slug_1 = __importDefault(require("rehype-slug"));
const rehype_autolink_headings_1 = __importDefault(require("rehype-autolink-headings"));
const rehype_code_titles_1 = __importDefault(require("rehype-code-titles"));
const rehype_katex_1 = __importDefault(require("rehype-katex"));
// Directory paths
const docsDir = path_1.default.join(process.cwd(), "contents/docs");
const outputDir = path_1.default.join(process.cwd(), "public", "search-data");
// Function to process MDX file content and convert to JSON
async function processMdxFile(filePath) {
    const rawMdx = await fs_1.promises.readFile(filePath, "utf-8");
    // Compile the MDX to extract frontmatter and content
    const { frontmatter, content } = await (0, rsc_1.compileMDX)({
        source: rawMdx,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                rehypePlugins: [
                    rehype_code_titles_1.default,
                    rehype_katex_1.default,
                    rehype_prism_plus_1.default,
                    rehype_slug_1.default,
                    rehype_autolink_headings_1.default,
                ],
                remarkPlugins: [remark_gfm_1.default],
            },
        },
    });
    const slug = path_1.default.basename(filePath, ".mdx");
    return { slug, frontmatter, content };
}
// Function to get all MDX files in the folder recursively
async function getMdxFiles(dir) {
    let files = [];
    const items = await fs_1.promises.readdir(dir, { withFileTypes: true });
    for (const item of items) {
        const fullPath = path_1.default.join(dir, item.name);
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
// Main function to convert all MDX files to JSON
async function convertMdxToJson() {
    try {
        const mdxFiles = await getMdxFiles(docsDir);
        await fs_1.promises.mkdir(outputDir, { recursive: true });
        for (const file of mdxFiles) {
            const jsonData = await processMdxFile(file);
            const outputFilePath = path_1.default.join(outputDir, `${jsonData.slug}.json`);
            await fs_1.promises.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2));
            console.log(`Generated JSON for: ${jsonData.slug}`);
        }
        console.log("All MDX files have been converted to JSON.");
    }
    catch (err) {
        console.error("Error processing MDX files:", err);
    }
}
// Run the script
convertMdxToJson();
