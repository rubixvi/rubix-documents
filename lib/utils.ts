import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Paths, Routes } from "./pageroutes";

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
  
    if (!node.noLink && node.title && node.title.toLowerCase().includes(query.toLowerCase())) {
      res.push({ ...node, items: undefined, href: nextLink });
      parentHas = true;
    }
  
    const goNext = maxLevel ? currentLevel < maxLevel : true;
  
    if (goNext && node.items) {
      node.items.forEach((item) => {
        const innerRes = helperSearch(
          query,
          item,
          nextLink,
          currentLevel + 1,
          maxLevel
        );
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

export function advanceSearch(query: string) {
  return Routes.map((node) =>
    helperSearch(query, node, "", 1, query.length == 0 ? 2 : undefined)
  ).flat();
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
