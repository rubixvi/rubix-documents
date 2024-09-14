"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cn = cn;
exports.helperSearch = helperSearch;
exports.advanceSearch = advanceSearch;
exports.formatDate = formatDate;
exports.formatDate2 = formatDate2;
exports.stringToDate = stringToDate;
const clsx_1 = require("clsx");
const tailwind_merge_1 = require("tailwind-merge");
const pageroutes_1 = require("./pageroutes");
function cn(...inputs) {
    return (0, tailwind_merge_1.twMerge)((0, clsx_1.clsx)(inputs));
}
function isRoute(node) {
    return "href" in node && "title" in node;
}
function helperSearch(query, node, prefix, currentLevel, maxLevel) {
    const res = [];
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
function advanceSearch(query) {
    return pageroutes_1.Routes.map((node) => helperSearch(query, node, "", 1, query.length == 0 ? 2 : undefined)).flat();
}
function formatDateHelper(dateStr, options) {
    const [day, month, year] = dateStr.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", options);
}
function formatDate(dateStr) {
    return formatDateHelper(dateStr, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
function formatDate2(dateStr) {
    return formatDateHelper(dateStr, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
function stringToDate(date) {
    const [day, month, year] = date.split("-").map(Number);
    return new Date(year, month - 1, day);
}
