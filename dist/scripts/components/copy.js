"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Copy;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lu_1 = require("react-icons/lu");
const button_1 = require("./ui/button");
const utils_1 = require("@/lib/utils");
function Copy({ content }) {
    const [isCopied, setIsCopied] = (0, react_1.useState)(false);
    async function handleCopy() {
        await navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    }
    return ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "secondary", size: "xs", onClick: handleCopy, children: (0, jsx_runtime_1.jsxs)("span", { className: "relative inline-block w-4 h-4", children: [(0, jsx_runtime_1.jsx)(lu_1.LuCopy, { className: (0, utils_1.cn)("absolute w-full h-full transition-opacity duration-300 transform", isCopied ? "opacity-0 scale-90" : "opacity-100 scale-100") }), (0, jsx_runtime_1.jsx)(lu_1.LuCheck, { className: (0, utils_1.cn)("absolute w-full h-full transition-opacity duration-300 transform", isCopied ? "opacity-100 scale-100" : "opacity-0 scale-90") })] }) }));
}
