"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Pre;
const jsx_runtime_1 = require("react/jsx-runtime");
const copy_1 = __importDefault(require("./copy"));
function Pre({ children, raw, ...rest }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "my-5 relative", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute top-3 right-2.5 z-10 hidden sm:block", children: (0, jsx_runtime_1.jsx)(copy_1.default, { content: raw }) }), (0, jsx_runtime_1.jsx)("div", { className: "relative", children: (0, jsx_runtime_1.jsx)("pre", { ...rest, children: children }) })] }));
}
