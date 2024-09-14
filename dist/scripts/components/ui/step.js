"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Step = Step;
exports.StepItem = StepItem;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const clsx_1 = __importDefault(require("clsx"));
const utils_1 = require("@/lib/utils");
function Step({ children }) {
    const length = react_1.Children.count(children);
    return ((0, jsx_runtime_1.jsx)("div", { className: "flex flex-col", children: react_1.Children.map(children, (child, index) => ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)("relative border-l pl-9", (0, clsx_1.default)({ "pb-5": index < length - 1 })), children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-xs font-code font-medium", children: index + 1 }), child] }))) }));
}
function StepItem({ children, title }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "pt-0.5", children: [title && (0, jsx_runtime_1.jsx)("h4", { className: "mt-0", children: title }), (0, jsx_runtime_1.jsx)("div", { children: children })] }));
}
