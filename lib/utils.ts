import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Paths, Routes } from "./pageroutes";

import { Documents } from '@/settings/documents';
import searchData from "@/public/search-data/documents.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function isRoute(node: Paths): node is Extract<Paths, { href: string; title: string }> {
  return "href" in node && "title" in node;
}

export function helperSearch(
  query: string, 
  node: Paths, 
  prefix: string, 
  currentLevel: number, 
  maxLevel?: number
) {
  const res: Paths[] = [];
  let parentHas = false;

  if (isRoute(node)) {
    const nextLink = `${prefix}${node.href}`;
  
    if (!query || node.title.toLowerCase().includes(query.toLowerCase())) {
      res.push({ ...node, items: undefined, href: nextLink });
      parentHas = true;
    }
  
    const goNext = maxLevel ? currentLevel < maxLevel : true;
  
    if (goNext && node.items) {
      node.items.forEach((item) => {
        const innerRes = helperSearch(query, item, nextLink, currentLevel + 1, maxLevel);
        if (innerRes.length && !parentHas && !node.noLink) {
          res.push({ ...node, items: undefined, href: nextLink });
          parentHas = true;
        }
        res.push(...innerRes);
      });
    }
  }

  return res;
}

function searchMatch(a: string, b: string): number {
  const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) {
    matrix[i][0] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[a.length][b.length];
}

function calculateRelevance(query: string, title: string, content: string) {
  let score = 0;
  const lowerQuery = query.toLowerCase();
  
  if (title.toLowerCase().includes(lowerQuery)) {
    score += 10;
  }
  if (content.toLowerCase().includes(lowerQuery)) {
    score += 5;
  }
  return score;
}

export function cleanMdxContent(content: string): string {
  let strippedContent = content
    .replace(/<[^>]+>/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\|[^|]+\|/g, '')
    .replace(/[:\-]+/g, '')
    .replace(/[*-]\s|\[x\]|\[ \]/g, '')
    .replace(/[#>]/g, '')
    .replace(/[*_~`]+/g, '')
    .replace(/\\/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return strippedContent;
}

export function advanceSearch(query: string) {
  const lowerQuery = query.toLowerCase();

  if (!query) {
    const rootNode: Paths = {
      title: "Root",
      href: "/",
      items: Documents,
    };

    return helperSearch("", rootNode, "", 1);
  }

  return searchData
    .map((doc) => {
      const title = doc.title || "";
      const content = doc.content || "";

      const cleanedContent = cleanMdxContent(content);

      let relevanceScore = 0;

      if (title.toLowerCase().includes(lowerQuery)) {
        relevanceScore += 20;
      }

      const titleDistance = searchMatch(lowerQuery, title.toLowerCase());
      if (titleDistance <= 2) {
        relevanceScore += 10;
      }

      const contentIndex = cleanedContent.toLowerCase().indexOf(lowerQuery);
      if (contentIndex !== -1) {
        relevanceScore += 10;
      }

      const contentDistance = searchMatch(lowerQuery, cleanedContent.toLowerCase());
      if (contentDistance <= 5) {
        relevanceScore += 5;
      }

      let snippet = "";
      if (contentIndex !== -1) {
        const snippetLength = 100;
        const start = Math.max(0, contentIndex - snippetLength / 2);
        const end = Math.min(cleanedContent.length, contentIndex + snippetLength / 2);
        snippet = cleanedContent.slice(start, end).replace(/\n/g, " ").trim();

        if (start > 0) {
          snippet = `...${snippet}`;
        }

        if (end < cleanedContent.length) {
          snippet += "...";
        }
      }

      return {
        title: doc.title || "Untitled",
        href: `${doc.slug}`,
        snippet: snippet || cleanedContent.slice(0, 100),
        description: doc.description || "",
        relevance: relevanceScore,
      };
    })
    .filter((doc) => doc.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance);
}

function formatDateHelper(dateStr: string, options: Intl.DateTimeFormatOptions): string {
  const [day, month, year] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", options);
}

export function formatDate(dateStr: string): string {
  return formatDateHelper(dateStr, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDate2(dateStr: string): string {
  return formatDateHelper(dateStr, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function stringToDate(date: string) {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}
