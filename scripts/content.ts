import { promises as fs } from "fs"
import path from "path"
import { Documents } from "@/settings/documents"
import grayMatter from "gray-matter"
import remarkMdx from "remark-mdx"
import remarkParse from "remark-parse"
import remarkStringify from "remark-stringify"
import { unified } from "unified"
import { Node, Parent } from "unist"
import { visit } from "unist-util-visit"

import { Paths } from "@/lib/pageroutes"

const docsDir = path.join(process.cwd(), "contents/docs")
const outputDir = path.join(process.cwd(), "public", "search-data")

interface MdxJsxFlowElement extends Node {
  name: string
  children?: Node[]
}

function isMdxJsxFlowElement(node: Node): node is MdxJsxFlowElement {
  return node.type === "mdxJsxFlowElement" && "name" in node
}

function isRoute(
  node: Paths
): node is Extract<Paths, { href: string; title: string }> {
  return "href" in node && "title" in node
}

function createSlug(filePath: string): string {
  const relativePath = path.relative(docsDir, filePath)
  const parsed = path.parse(relativePath)

  const slugPath = parsed.dir ? `${parsed.dir}/${parsed.name}` : parsed.name
  const normalizedSlug = slugPath.replace(/\\/g, "/")

  if (parsed.name === "index") {
    return `/${parsed.dir.replace(/\\/g, "/")}` || "/"
  } else {
    return `/${normalizedSlug}`
  }
}

function findDocumentBySlug(slug: string): Paths | null {
  function searchDocs(docs: Paths[], currentPath = ""): Paths | null {
    for (const doc of docs) {
      if (isRoute(doc)) {
        const fullPath = currentPath + doc.href
        if (fullPath === slug) return doc
        if (doc.items) {
          const found: Paths | null = searchDocs(doc.items, fullPath)
          if (found) return found
        }
      }
    }
    return null
  }
  return searchDocs(Documents)
}

async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

function removeCustomComponents() {
  const customComponentNames = [
    "Tabs",
    "TabsList",
    "TabsTrigger",
    "pre",
    "Mermaid",
  ]

  return (tree: Node) => {
    visit(
      tree,
      "mdxJsxFlowElement",
      (node: Node, index: number | null, parent: Parent | null) => {
        if (
          isMdxJsxFlowElement(node) &&
          parent &&
          Array.isArray(parent.children) &&
          customComponentNames.includes(node.name)
        ) {
          parent.children.splice(index!, 1)
        }
      }
    )
  }
}

async function processMdxFile(filePath: string) {
  const rawMdx = await fs.readFile(filePath, "utf-8")

  const { content, data: frontmatter } = grayMatter(rawMdx)

  const plainContent = await unified()
    .use(remarkParse)
    .use(remarkMdx)
    .use(removeCustomComponents)
    .use(remarkStringify)
    .process(content)

  const slug = createSlug(filePath)
  const matchedDoc = findDocumentBySlug(slug)

  return {
    slug,
    title:
      frontmatter.title ||
      (matchedDoc && isRoute(matchedDoc) ? matchedDoc.title : "Untitled"),
    description: frontmatter.description || "",
    content: String(plainContent.value),
  }
}

async function getMdxFiles(dir: string): Promise<string[]> {
  let files: string[] = []
  const items = await fs.readdir(dir, { withFileTypes: true })

  for (const item of items) {
    const fullPath = path.join(dir, item.name)
    if (item.isDirectory()) {
      const subFiles = await getMdxFiles(fullPath)
      files = files.concat(subFiles)
    } else if (item.name.endsWith(".mdx")) {
      files.push(fullPath)
    }
  }

  return files
}

async function convertMdxToJson() {
  try {
    await ensureDirectoryExists(outputDir)

    const mdxFiles = await getMdxFiles(docsDir)
    const combinedData = []

    for (const file of mdxFiles) {
      const jsonData = await processMdxFile(file)
      combinedData.push(jsonData)
    }

    const combinedOutputPath = path.join(outputDir, "documents.json")
    await fs.writeFile(
      combinedOutputPath,
      JSON.stringify(combinedData, null, 2)
    )
  } catch (err) {
    console.error("Error processing MDX files:", err)
  }
}

convertMdxToJson()
