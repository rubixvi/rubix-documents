"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Note;
const jsx_runtime_1 = require("react/jsx-runtime");
const clsx_1 = __importDefault(require("clsx"));
const utils_1 = require("@/lib/utils");
function Note({ children, title = "Note", type = "note", }) {
    const noteClassNames = (0, clsx_1.default)({
        "dark:bg-neutral-900 bg-neutral-100": type == "note",
        "dark:bg-green-950 bg-green-100 border-green-200 dark:border-green-900": type === "success",
        "dark:bg-orange-950 bg-orange-100 border-orange-200 dark:border-orange-900": type === "warning",
        "dark:bg-red-950 bg-red-100 border-red-200 dark:border-red-900": type === "danger",
    });
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("border rounded-md py-0.5 px-3.5 text-sm tracking-wide", noteClassNames), children: [(0, jsx_runtime_1.jsxs)("p", { className: "font-semibold -mb-3", children: [title, ":"] }), " ", children] }));
}
