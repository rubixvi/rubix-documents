import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Paths } from "@/lib/pageroutes";

import searchData from "@/public/search-data/documents.json"

export type search = {
  title: string;
  href: string;
  snippet?: string;
  description?: string;
  relevance?: number;
};

function memoize<T extends (...args: any[]) => any>(fn: T) {
  const cache = new Map<string, ReturnType<T>>();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      const cachedResult = cache.get(key);
      if (cachedResult !== undefined) return cachedResult;
    }

    const result = fn(...args);

    if (result !== '' && result != null) {
      cache.set(key, result);
    }

    return result;
  };
}

const memoizedSearchMatch = memoize(searchMatch);
const memoizedCleanMdxContent = memoize(cleanMdxContent);

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
    const titleDistance = memoizedSearchMatch(lowerQuery, node.title.toLowerCase());

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
  if (typeof a !== 'string' || typeof b !== 'string') return 0;

  const aLen = a.length;
  const bLen = b.length;

  if (aLen === 0) return bLen;
  if (bLen === 0) return aLen;

  if (aLen > bLen) [a, b] = [b, a];

  const maxDistance = Math.min(Math.max(Math.floor(aLen / 2), 2), 5);

  let prevRow = Array(aLen + 1).fill(0);
  let currRow = Array(aLen + 1).fill(0);

  for (let i = 0; i <= aLen; i++) prevRow[i] = i;

  for (let j = 1; j <= bLen; j++) {
    currRow[0] = j;
    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[i] = Math.min(prevRow[i] + 1, currRow[i - 1] + 1, prevRow[i - 1] + cost);
      
      if (currRow[i] > maxDistance) {
        return maxDistance;
      }
    }
    [prevRow, currRow] = [currRow, prevRow];
  }

  return Math.min(prevRow[aLen], maxDistance);
}


function calculateRelevance(query: string, title: string, content: string): number {
  const lowerQuery = query.toLowerCase().trim();
  const lowerTitle = title.toLowerCase();
  const lowerContent = memoizedCleanMdxContent(content);
  const queryWords = lowerQuery.split(/\s+/);

  let score = 0;

  if (lowerTitle.includes(queryWords[0])) {
    score += 40;
  } else if (lowerTitle.includes(lowerQuery)) {
    score += 30;
  } else {
    queryWords.forEach((word, idx) => {
      if (lowerTitle.includes(word)) {
        score += 10 + (5 * (queryWords.length - idx));
      }
    });
  }

  const titleDistances = queryWords.map((word) => memoizedSearchMatch(word, lowerTitle));
  for (const distance of titleDistances) {
    if (distance <= 2) {
      score += 5;
    }
  }

  const exactPhraseRegex = new RegExp(`\\b(${queryWords.join('|')})\\b`, 'g');
  const exactMatches = lowerContent.match(exactPhraseRegex);
  if (exactMatches) {
    score += exactMatches.length * 10;
  }

  queryWords.forEach((word) => {
    if (lowerContent.includes(word)) {
      score += 5;
    }
  });

  const proximityScore = calculateProximityScore(lowerQuery, lowerContent);
  score += proximityScore * 3;

  const lengthNormalizationFactor = Math.log(content.length + 1);
  return score / lengthNormalizationFactor;
}

function calculateProximityScore(query: string, content: string): number {
  if (typeof query !== 'string' || typeof content !== 'string') return 0;

  const words = content.split(/\s+/);
  const queryWords = query.split(/\s+/);
  
  let proximityScore = 0;
  let firstIndex = -1;

  queryWords.forEach((queryWord, queryIndex) => {
    const wordIndex = words.indexOf(queryWord, firstIndex + 1);
    
    if (wordIndex !== -1) {
      if (queryIndex === 0) {
        proximityScore += 30;
      } else if (wordIndex - firstIndex <= 3) {
        proximityScore += 20 - (wordIndex - firstIndex);
      }

      firstIndex = wordIndex;
    } else {
      firstIndex = -1;
    }
  });

  return proximityScore;
}

function cleanMdxContent(content: string): string {
  return content
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
}

function extractSnippet(content: string, query: string): string {
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
  if (start > 0) snippet = `...${snippet}`;
  if (end < content.length) snippet += "...";

  return snippet;
}

export function advanceSearch(query: string) {
  const lowerQuery = query.toLowerCase().trim();

  const queryWords = lowerQuery.split(/\s+/).filter(word => word.length >= 3);

  if (queryWords.length === 0) return [];

  const chunks = chunkArray(searchData, 100);

  const results = chunks.flatMap((chunk) =>
    chunk.map((doc) => {
      const title = doc.title || "";
      const content = doc.content || "";
      const cleanedContent = memoizedCleanMdxContent(content);

      let relevanceScore = calculateRelevance(queryWords.join(' '), title, cleanedContent);
      const proximityScore = calculateProximityScore(queryWords.join(' '), cleanedContent);
      relevanceScore += proximityScore;

      const snippet = extractSnippet(cleanedContent, lowerQuery);
      const highlightedSnippet = highlight(snippet, queryWords.join(' '));

      return {
        title: doc.title || "Untitled",
        href: `${doc.slug}`,
        snippet: highlightedSnippet,
        description: doc.description || "",
        relevance: relevanceScore,
      };
    })
    .filter((doc) => doc.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
  );

  return results;
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
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

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let rafId: number | null = null;
  let lastCallTime: number | null = null;

  const later = (time: number) => {
    const remaining = wait - (time - (lastCallTime || 0));
    if (remaining <= 0) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      func(...(lastArgs as Parameters<T>));
      lastArgs = null;
      lastCallTime = null;
    } else {
      rafId = requestAnimationFrame(later);
    }
  };

  return (...args: Parameters<T>) => {
    lastArgs = args;
    lastCallTime = performance.now();
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      rafId = requestAnimationFrame(later);
    }, wait);
    if (callNow) func(...args);
  };
}

export function highlight(snippet: string, searchTerms: string): string {
  if (!snippet || !searchTerms) return snippet;

  const terms = searchTerms
    .split(/\s+/)
    .filter(term => term.trim().length > 0)
    .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (terms.length === 0) return snippet;

  const regex = new RegExp(`(${terms.join('|')})(?![^<>]*>)`, 'gi');
  
  return snippet.replace(/(<[^>]+>)|([^<]+)/g, (match, htmlTag, textContent) => {
    if (htmlTag) return htmlTag;
    return textContent.replace(regex, "<span class='highlight'>$1</span>");
  });
}
