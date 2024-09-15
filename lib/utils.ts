import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Paths, Routes } from "./pageroutes";

import { Documents } from '@/settings/documents';
import searchData from "@/public/search-data/documents.json"

export type search = {
  title: string;
  href: string;
  snippet?: string;
  description?: string;
  relevance?: number;
};

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
  const lowerQuery = query.toLowerCase();

  if (isRoute(node)) {
    const nextLink = `${prefix}${node.href}`;

    const titleMatch = node.title.toLowerCase().includes(lowerQuery);
    const titleDistance = searchMatch(lowerQuery, node.title.toLowerCase());

    if (titleMatch || titleDistance <= 2) {
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
  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  if (aLen > bLen) [a, b] = [b, a];

  let prevRow = Array(aLen + 1).fill(0);
  let currRow = Array(aLen + 1).fill(0);

  for (let i = 0; i <= aLen; i++) prevRow[i] = i;

  for (let j = 1; j <= bLen; j++) {
    currRow[0] = j;
    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[i] = Math.min(prevRow[i] + 1, currRow[i - 1] + 1, prevRow[i - 1] + cost);
    }
    [prevRow, currRow] = [currRow, prevRow];
  }

  return prevRow[aLen];
}

function calculateRelevance(query: string, title: string, content: string): number {
  let score = 0;
  const lowerQuery = query.toLowerCase().trim();
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();
  
  const queryWords = lowerQuery.split(/\s+/);

  if (lowerTitle.includes(lowerQuery)) {
    score += 30;
  } else {
    queryWords.forEach((word) => {
      if (lowerTitle.includes(word)) {
        score += 10;
      }
    });
  }

  queryWords.forEach((word) => {
    const titleDistance = searchMatch(word, lowerTitle);
    if (titleDistance <= 2) {
      score += 5;
    }
  });

  queryWords.forEach((word) => {
    const exactPhraseMatch = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const exactMatches = lowerContent.match(exactPhraseMatch);
    if (exactMatches) {
      score += exactMatches.length * 10;
    }
  });

  queryWords.forEach((word) => {
    if (lowerContent.includes(word)) {
      score += 5;
    }
  });

  const proximityScore = calculateProximityScore(lowerQuery, lowerContent);
  score += proximityScore * 3;

  const lengthNormalizationFactor = Math.log(content.length + 1);
  score = score / lengthNormalizationFactor;

  return score;
}

function calculateProximityScore(query: string, content: string): number {
  const words = content.split(/\s+/);
  const queryWords = query.split(/\s+/);
  let proximityScore = 0;

  for (let i = 0; i < words.length; i++) {
    for (let j = 0; j < queryWords.length; j++) {
      if (words[i] === queryWords[j]) {
        for (let k = j + 1; k < queryWords.length; k++) {
          const nextWordIndex = words.indexOf(queryWords[k], i + 1);
          if (nextWordIndex !== -1 && nextWordIndex - i <= 3) {
            proximityScore += 20;
          }
        }
      }
    }
  }

  return proximityScore;
}

function cleanMdxContent(content: string): string {
  let strippedContent = content
    .replace(/<[^>]+>/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\|.*?\|/g, '')
    .replace(/[*+-]\s|\d+\.\s|\[x\]|\[ \]/g, '')
    .replace(/^(#{1,6}\s|>\s|-{3,}|\*{3,})/gm, '')
    .replace(/[*_~`]+/g, '')
    .replace(/!\[.*?\]\(.*?\)|\[.*?\]\(.*?\)/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$[^$]*\$/g, '')
    .replace(/\\/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return strippedContent;
}

export function extractSnippet(content: string, query: string): string {
  const lowerContent = content.toLowerCase();
  const queryWords = query.toLowerCase().split(/\s+/);

  let indices: number[] = [];
  queryWords.forEach((word) => {
    const index = lowerContent.indexOf(word);
    if (index !== -1) {
      indices.push(index);
    }
  });

  if (indices.length === 0) {
    return content.slice(0, 100);
  }

  const avgIndex = Math.floor(indices.reduce((a, b) => a + b) / indices.length);

  const snippetLength = 100;
  const contextLength = Math.floor(snippetLength / 2);

  const start = Math.max(0, avgIndex - contextLength);
  const end = Math.min(avgIndex + contextLength, content.length);

  let snippet = content.slice(start, end).replace(/\n/g, " ").trim();

  if (start > 0) {
    snippet = `...${snippet}`;
  }
  if (end < content.length) {
    snippet += "...";
  }

  return snippet;
}

export function advanceSearch(query: string) {
  const lowerQuery = query.toLowerCase().trim();
  
  if (lowerQuery.length <= 2) {
    return [];
  }

  return searchData
    .map((doc) => {
      const title = doc.title || "";
      const content = doc.content || "";
      const cleanedContent = cleanMdxContent(content);

      let relevanceScore = calculateRelevance(lowerQuery, title, cleanedContent);

      const proximityScore = calculateProximityScore(lowerQuery, cleanedContent);
      relevanceScore += proximityScore;

      let snippet = extractSnippet(cleanedContent, lowerQuery);

      const highlightedSnippet = highlight(snippet, query);

      return {
        title: doc.title || "Untitled",
        href: `${doc.slug}`,
        snippet: highlightedSnippet,
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

export function debounce(func: (...args: any[]) => void, wait: number, immediate = false) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args: any[]) {
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = undefined;
      if (!immediate) func.apply(this, args);
    }, wait);
    if (callNow) func.apply(this, args);
  };
}

export function highlight(snippet: string, searchTerms: string): string {
  const terms = searchTerms
    .split(/\s+/)
    .filter(term => term.trim().length > 0)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (terms.length === 0) return snippet;

  const regex = new RegExp(`(${terms.join('|')})`, 'gi');

  return snippet.replace(/(<[^>]+>)|([^<]+)/g, (match, htmlTag, textContent) => {
    if (htmlTag) {
      return htmlTag;
    }
    return textContent.replace(regex, "<span class='highlight'>$1</span>");
  });
}