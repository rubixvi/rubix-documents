import Card from "@/components/ui/card";
import CardGrid from "@/components/ui/cardgrid";
import RoutedLink from '@/components/ui/link';
import Mermaid from "@/components/ui/mermaid";
import Note from "@/components/ui/note";
import Pre from "@/components/ui/pre";
import { Step, StepItem } from "@/components/ui/step";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const components = {
    a: RoutedLink as React.ComponentType<React.AnchorHTMLAttributes<HTMLAnchorElement>>,
    Card,
    CardGrid,
    Mermaid,
    Note,
    pre: Pre,
    Step,
    StepItem,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
};