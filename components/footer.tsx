import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full h-16 border-t">
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 sm:gap-0 w-full h-full px-2 sm:py-0 py-3 sm:px-4 lg:px-8 text-sm text-muted-foreground">
        <p className="text-center">
          Built by{" "}
          <Link
            className="font-semibold"
            href="https://www.rubixstudios.com.au"
          >
            Rubix Studios
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
