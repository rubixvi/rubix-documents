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

// Directory paths
const docsDir = path.join(process.cwd(), "contents/docs");
const outputDir = path.join(process.cwd(), "public", "search-data");

// Helper to create a slug from a file path
function createSlug(filePath: string): string {
  const relativePath = path.relative(docsDir, filePath);
  const parsed = path.parse(relativePath);

  if (parsed.name === "index") {
    return parsed.dir || '/'; // Default to root for top-level index.mdx
  } else {
    return path.join(parsed.dir, parsed.name);
  }
}

// Function to process MDX file content and extract plain text and frontmatter
async function processMdxFile(filePath: string) {
  const rawMdx = await fs.readFile(filePath, "utf-8");

  // Extract plain content from the MDX without compiling JSX
  const plainContent = await unified()
    .use(remarkParse)  // Parse Markdown to AST
    .use(remarkStringify)  // Convert AST back to plain Markdown text
    .process(rawMdx);

  // Compile MDX to extract frontmatter but avoid JSX compilation
  const compiledMdx = await compile(rawMdx, {
    remarkPlugins: [remarkGfm, remarkRehype],
    rehypePlugins: [
      rehypeSlug,
      rehypeAutolinkHeadings,
      rehypeCodeTitles,
      rehypeKatex,
      [rehypePrism, { ignoreMissing: true }], // Prevents unknown language errors
    ],
    format: "mdx",
  });

  const frontmatter = compiledMdx.data?.frontmatter || {};
  const slug = createSlug(filePath);

  return {
    slug,
    frontmatter,
    content: String(plainContent.value), // Use plain Markdown text content
  };
}

// Function to get all MDX files in the folder recursively
async function getMdxFiles(dir: string): Promise<string[]> {
  let files: string[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      const subFiles = await getMdxFiles(fullPath);
      files = files.concat(subFiles);
    } else if (item.name.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

// Ensure directory exists (create recursively if needed)
async function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

// Main function to convert all MDX files to JSON
async function convertMdxToJson() {
  try {
    const mdxFiles = await getMdxFiles(docsDir);

    for (const file of mdxFiles) {
      const jsonData = await processMdxFile(file);
      const outputFilePath = path.join(outputDir, `${jsonData.slug}.json`);

      await ensureDirectoryExists(outputFilePath);
      await fs.writeFile(outputFilePath, JSON.stringify(jsonData, null, 2));
      console.log(`Generated JSON for: ${jsonData.slug}`);
    }

    console.log("All MDX files have been converted to JSON.");
  } catch (err) {
    console.error("Error processing MDX files:", err);
  }
}

// Run the script
convertMdxToJson();
