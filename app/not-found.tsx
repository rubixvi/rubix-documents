import { Button } from '@/components/ui/button'
import { Link } from '@/lib/transition'

export default function NotFound() {
  return (
    <div className="flex min-h-[86.5vh] flex-col items-center justify-center px-2 py-8 text-center">
      <h1 className="mb-4 text-4xl font-bold sm:text-7xl">404</h1>
      <p className="mb-8 max-w-150 text-foreground sm:text-base">Page not found</p>
      <div className="flex items-center">
        <Button asChild size="lg" variant="default">
          <Link aria-label="Return Home" href="/" title="Return Home">
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  )
}
