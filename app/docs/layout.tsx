import { Sidebar } from '@/components/sidebar'

export default function Documents({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex items-start gap-10 pt-10">
      <Sidebar />
      <div className="flex-1 md:flex-6">{children}</div>
    </div>
  )
}
