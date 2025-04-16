"use client"

import { useEffect, useMemo, useState } from "react"
import { Documents } from "@/settings/documents"
import { LuFileText, LuSearch } from "react-icons/lu"

import { advanceSearch, cn, debounce, highlight, search } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import Anchor from "@/components/navigation/anchor"

interface Document {
  title?: string
  href?: string
  spacer?: boolean
  items?: Document[]
}

export default function Search() {
  const [searchedInput, setSearchedInput] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredResults, setFilteredResults] = useState<search[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const debouncedSearch = useMemo(
    () =>
      debounce((input) => {
        setIsLoading(true)
        const results = advanceSearch(input.trim())
        setFilteredResults(results)
        setIsLoading(false)
      }, 300),
    []
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Enter" && filteredResults.length > 2) {
        const selected = filteredResults[0]
        if ("href" in selected) {
          window.location.href = `/docs${selected.href}`
          setIsOpen(false)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, filteredResults])

  useEffect(() => {
    if (searchedInput.length >= 3) {
      debouncedSearch(searchedInput)
    } else {
      setFilteredResults([])
    }
  }, [searchedInput, debouncedSearch])

  function renderDocuments(
    documents: Document[],
    parentHref: string = "/docs"
  ): React.ReactNode[] {
    if (!documents || !Array.isArray(documents)) {
      return []
    }

    return documents.flatMap((doc) => {
      if ("spacer" in doc && doc.spacer) {
        return []
      }

      const href = `${parentHref}${doc.href}`

      return [
        <DialogClose key={href} asChild>
          <Anchor
            className={cn(
              "w-full px-3 flex items-center gap-2.5 text-[15px] rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300"
            )}
            href={href}
          >
            <div className="flex items-center h-full w-fit gap-1.5 py-3 whitespace-nowrap">
              <LuFileText className="h-[1.1rem] w-[1.1rem]" /> {doc.title}
            </div>
          </Anchor>
        </DialogClose>,
        ...renderDocuments(doc.items || [], `${href}`),
      ]
    })
  }

  return (
    <div>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) {
            setTimeout(() => setSearchedInput(""), 200)
          }
        }}
      >
        <DialogTrigger asChild>
          <div className="relative flex-1 max-w-md cursor-pointer">
            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            <Input
              className="h-9 w-full pl-10 pr-4 bg-background rounded-md border shadow text-sm md:w-full"
              placeholder="Search"
              type="search"
            />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-xs sm:max-w-lg p-0 top-[45%] sm:top-[38%]">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogHeader>
            <input
              value={searchedInput}
              onChange={(e) => setSearchedInput(e.target.value)}
              placeholder="Search..."
              autoFocus
              className="h-14 px-4 bg-transparent border-b text-[15px] outline-none"
            />
          </DialogHeader>
          {searchedInput.length > 0 && searchedInput.length < 3 && (
            <p className="mx-auto mt-2 text-sm text-warning">
              Please enter at least 3 characters.
            </p>
          )}
          {isLoading ? (
            <p className="mx-auto mt-2 text-sm text-muted-foreground">
              Searching...
            </p>
          ) : (
            filteredResults.length === 0 &&
            searchedInput.length >= 3 && (
              <p className="mx-auto mt-2 text-sm text-muted-foreground">
                No results found for{" "}
                <span className="text-primary">{`"${searchedInput}"`}</span>
              </p>
            )
          )}
          <ScrollArea className="max-h-[350px] overflow-hidden w-full">
            <div className="flex flex-col items-start px-1 pt-1 pb-4 sm:px-3 w-full">
              {searchedInput
                ? filteredResults.map((item) => {
                    if ("href" in item) {
                      return (
                        <DialogClose key={item.href} asChild>
                          <Anchor
                            className={cn(
                              "p-3 flex flex-col w-full max-w-[310px] sm:max-w-[480px] gap-0.5 text-[15px] rounded-sm hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300"
                            )}
                            href={`/docs${item.href}`}
                          >
                            <div className="flex items-center h-full gap-x-2">
                              <LuFileText className="h-[1.1rem] w-[1.1rem]" />
                              <span className="truncate">{item.title}</span>
                            </div>
                            {"snippet" in item && item.snippet && (
                              <p
                                className="truncate text-xs text-neutral-500 dark:text-neutral-400"
                                dangerouslySetInnerHTML={{
                                  __html: highlight(
                                    item.snippet,
                                    searchedInput
                                  ),
                                }}
                              />
                            )}
                          </Anchor>
                        </DialogClose>
                      )
                    }
                    return null
                  })
                : renderDocuments(Documents)}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
