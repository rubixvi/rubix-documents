"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.components = void 0;
const tabs_1 = require("@/components/ui/tabs");
const pre_1 = __importDefault(require("@/components/pre"));
const note_1 = __importDefault(require("@/components/note"));
const step_1 = require("@/components/ui/step");
exports.components = {
    Tabs: tabs_1.Tabs,
    TabsContent: tabs_1.TabsContent,
    TabsList: tabs_1.TabsList,
    TabsTrigger: tabs_1.TabsTrigger,
    pre: pre_1.default,
    Note: note_1.default,
    Step: step_1.Step,
    StepItem: step_1.StepItem,
};
