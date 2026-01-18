import { LuAlignLeft } from 'react-icons/lu'
import { Logo } from '@/components/navigation/logo'
import { NavMenu } from '@/components/navigation/navbar'
import { PageMenu } from '@/components/sidebar/pagemenu'
import { Button } from '@/components/ui/button'
import { DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet'

export function Sidebar() {
  return (
    <aside
      className="sticky top-26 hidden h-screen min-w-57.5 flex-1 flex-col overflow-y-auto md:flex"
      aria-label="Page navigation"
    >
      <ScrollArea>
        <PageMenu />
      </ScrollArea>
    </aside>
  )
}

export function SheetLeft() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="flex cursor-pointer md:hidden">
          <LuAlignLeft className="size-6!" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col gap-0 px-0" side="left">
        <DialogTitle className="sr-only">Menu</DialogTitle>
        <SheetHeader>
          <SheetClose asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className="flex h-full flex-col overflow-y-auto">
          <div className="mx-0 mt-3 flex flex-col gap-2.5 px-5">
            <NavMenu isSheet />
            <Separator className="my-2" />
            <PageMenu isSheet />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
