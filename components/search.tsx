"use client";

import { useEffect, useMemo, useState } from "react";
import { LuCommand, LuFileText, LuSearch } from "react-icons/lu";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import Anchor from "./anchor";

import { advanceSearch, cn } from "@/lib/utils";
import searchData from "@/search-data/documents.json"

export default function Search() {
  const [searchedInput, setSearchedInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filteredResults = useMemo(
    () => advanceSearch(searchedInput.trim(), searchData),
    [searchedInput]
  );

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) setSearchedInput("");
          setIsOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <div className="relative flex-1 max-w-md cursor-pointer">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            <Input
              className="h-9 w-full pl-10 pr-4 rounded-md border bg-muted shadow-sm md:w-full"
              placeholder="Search..."
              type="search"
            />
            <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-0.5 rounded-sm bg-zinc-200 p-1 text-xs font-mono font-medium dark:bg-neutral-700 sm:flex">
              <LuCommand className="w-3 h-3" />
              <span>k</span>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-[650px] p-0 top-[45%] sm:top-[38%]">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogHeader>
            <input
              value={searchedInput}
              onChange={(e) => setSearchedInput(e.target.value)}
              placeholder="Search documents..."
              autoFocus
              className="h-14 px-4 bg-transparent border-b text-[15px] outline-none"
            />
          </DialogHeader>
          {filteredResults.length == 0 && searchedInput && (
            <p className="mx-auto mt-2 text-sm text-muted-foreground">
              No results found for{" "}
              <span className="text-primary">{`"${searchedInput}"`}</span>
            </p>
          )}
          <ScrollArea className="max-h-[350px]">
            <div className="flex flex-col items-start overflow-y-auto px-1 pb-4 sm:px-3">
              {filteredResults.map((item) => {
                if ("href" in item) {
                  const level = (item.href.split("/").slice(1).length - 1) as keyof typeof paddingMap;
                  const paddingClass = paddingMap[level];

                return (
                  <DialogClose key={item.href} asChild>
                    <Anchor
                      className={cn(
                        "w-full px-3 flex items-center gap-2.5 text-[15px] rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-900",
                        paddingClass
                      )}
                      href={`/docs${item.href}`}
                    >
                      <div
                        className={cn(
                          "flex items-center h-full w-fit gap-1.5 py-3",
                          level > 1 && "border-l pl-4"
                        )}
                      >
                        <LuFileText className="h-[1.1rem] w-[1.1rem]" />{" "}
                        {item.title}
                      </div>
                    </Anchor>
                  </DialogClose>
                  );
                }

                return null;
              })}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const paddingMap = {
  1: "pl-6",
  2: "pl-8",
  3: "pl-10",
} as const;
