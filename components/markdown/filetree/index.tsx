"use client"

import dynamic from "next/dynamic"

export const FileTree = dynamic(
  () => import("@/components/markdown/filetree/component"),
  {
    ssr: false,
  }
)
