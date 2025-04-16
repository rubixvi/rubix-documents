"use client"

import {
  createContext,
  memo,
  ReactElement,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react"
import cn from "clsx"
import { FiFileText } from "react-icons/fi"
import { LuFolder, LuFolderClosed } from "react-icons/lu"

const ctx = createContext(0)

interface FolderProps {
  name: string
  label?: ReactElement
  open?: boolean
  defaultOpen?: boolean
  onToggle?: (open: boolean) => void
  children: ReactNode
}

interface FileProps {
  name: string
  label?: ReactElement
}

function useIndent() {
  return useContext(ctx)
}

function Tree({ children }: { children: ReactNode }): ReactElement {
  return (
    <ul className="!m-0 w-full list-none overflow-hidden rounded-lg border !p-2">
      {children}
    </ul>
  )
}

export const Folder = memo(
  ({
    label,
    name,
    open,
    defaultOpen = false,
    onToggle,
    children,
  }: FolderProps) => {
    const indent = useIndent()
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const toggle = useCallback(() => {
      onToggle?.(!isOpen)
      setIsOpen(!isOpen)
    }, [isOpen, onToggle])

    const isFolderOpen = open === undefined ? isOpen : open

    return (
      <li className="list-none">
        <div
          onClick={toggle}
          title={name}
          className={cn(
            "hover:text-muted-foreground inline-flex cursor-pointer items-center py-1 text-xs transition-all"
          )}
        >
          <span className="ml-1">
            {isFolderOpen ? (
              <LuFolderClosed size={14} />
            ) : (
              <LuFolder size={14} />
            )}
          </span>
          <span className="ml-2">{label ?? name}</span>
        </div>
        <div
          className={cn(
            "grid transition-[grid-template-rows] duration-200 ease-in-out",
            isFolderOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          )}
        >
          <div className="overflow-hidden">
            <ul className="list-none !pl-[0.75rem]">
              <ctx.Provider value={indent + 1}>{children}</ctx.Provider>
            </ul>
          </div>
        </div>
      </li>
    )
  }
)

Folder.displayName = "Folder"

export const File = memo(({ label, name }: FileProps) => (
  <li className="list-none">
    <div className="hover:text-muted-foreground inline-flex cursor-default items-center py-1 text-xs transition-all">
      <span className="ml-1">
        <FiFileText size={14} />
      </span>
      <span className="mr-2 ml-2">{label ?? name}</span>
    </div>
  </li>
))

File.displayName = "File"

export default Tree
