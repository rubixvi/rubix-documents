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
    return helperSearch("", { items: Documents }, "", 1);
  }

  return searchData
    .map((doc) => {
      const title = doc.title || "";
      const content = doc.content || "";
      
      const cleanedContent = cleanMdxContent(content);

      const relevanceScore = calculateRelevance(query, title, content);

      const contentIndex = cleanedContent.toLowerCase().indexOf(lowerQuery);
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
