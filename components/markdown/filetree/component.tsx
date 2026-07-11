'use client'

import {
  createContext,
  memo,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react'
import cn from 'clsx'
import { FiFileText } from 'react-icons/fi'
import { LuFolder, LuFolderClosed } from 'react-icons/lu'

const ctx = createContext(0)

interface FolderProps {
  children: ReactNode
  defaultOpen?: boolean
  label?: ReactElement
  name: string
  onToggle?: (open: boolean) => void
  open?: boolean
}

interface FileProps {
  label?: ReactElement
  name: string
}

function useIndent() {
  return useContext(ctx)
}

export function FileTree({ children }: { children: ReactNode }): ReactElement {
  return (
    <ul className="m-0! w-full list-none overflow-hidden rounded-lg border p-2!">{children}</ul>
  )
}

export const Folder = memo(
  ({ label, name, open, defaultOpen = false, onToggle, children }: FolderProps) => {
    const indent = useIndent()
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const toggle = useCallback(() => {
      onToggle?.(!isOpen)
      setIsOpen(!isOpen)
    }, [isOpen, onToggle])

    const isFolderOpen = open === undefined ? isOpen : open

    return (
      <li className="list-none">
        <button
          className={cn(
            'inline-flex cursor-pointer items-center gap-2 py-1 text-xs transition-all hover:text-muted-foreground'
          )}
          onClick={toggle}
          title={name}
          type="button"
        >
          <span>{isFolderOpen ? <LuFolderClosed size={14} /> : <LuFolder size={14} />}</span>

          <span>{label ?? name}</span>
        </button>
        <div
          className={cn(
            'grid transition-[grid-template-rows] duration-200 ease-in-out',
            isFolderOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          )}
        >
          <div className="overflow-hidden">
            <ul className="list-none pl-3!">
              <ctx.Provider value={indent + 1}>{children}</ctx.Provider>
            </ul>
          </div>
        </div>
      </li>
    )
  }
)

export const File = memo(({ label, name }: FileProps) => (
  <li className="list-none">
    <div className="inline-flex cursor-default items-center gap-2 py-1 text-xs transition-all hover:text-muted-foreground">
      <span>
        <FiFileText size={14} />
      </span>
      <span>{label ?? name}</span>
    </div>
  </li>
))
