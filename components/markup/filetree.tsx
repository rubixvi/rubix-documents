"use client";

import { createContext, memo, useCallback, useContext, useState, ReactElement, ReactNode } from 'react';
import { FiFileText } from "react-icons/fi";
import { LuFolder, LuFolderClosed } from "react-icons/lu";

import cn from "clsx";

const ctx = createContext(0);

interface FolderProps {
  name: string;
  label?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  children: ReactNode;
}

interface FileProps {
  name: string;
  label?: ReactElement;
}

function useIndent() {
  return useContext(ctx);
}


function Tree({ children }: { children: ReactNode }): ReactElement {
  return (
    <div className={cn("flex")}>
      <ul className="border list-none !p-4 !py-1 !m-0">{children}</ul>
    </div>
  );
}

export const Folder = memo(({ label, name, open, defaultOpen = false, onToggle, children }: FolderProps) => {
  const indent = useIndent();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggle = useCallback(() => {
    onToggle?.(!isOpen);
    setIsOpen(!isOpen);
  }, [isOpen, onToggle]);

  const isFolderOpen = open === undefined ? isOpen : open;

  return (
    <li className="list-none">
      <div
        onClick={toggle}
        title={name}
        className={cn("inline-flex items-center cursor-pointer py-1 text-xs hover:text-muted-foreground transition-all")}>
        <span className="ml-1">
          {isFolderOpen ? <LuFolderClosed size={14} /> : <LuFolder size={14} />}
        </span>
        <span className="ml-2">{label ?? name}</span>
      </div>
      {isFolderOpen && (
        <ul className="list-none">
          <ctx.Provider value={indent + 1}>{children}</ctx.Provider>
        </ul>
      )}
    </li>
  );
});

Folder.displayName = 'Folder';

export const File = memo(({ label, name }: FileProps) => (
  <li className="list-none">
    <div className="inline-flex items-center py-1 cursor-default text-xs hover:text-muted-foreground  transition-all">
      <span className="ml-1">
        <FiFileText size={14} />
      </span>
      <span className="ml-2 mr-2">{label ?? name}</span>
    </div>
  </li>
));

File.displayName = 'File';

export default Tree;
