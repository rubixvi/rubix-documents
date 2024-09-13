import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[86.5vh] flex flex-col justify-center items-center text-center px-2 py-8">
      <h1 className="text-4xl font-bold mb-4 sm:text-7xl">
        404
      </h1>
      <p className="max-w-[600px] text-foreground mb-8 sm:text-base">
        Page not found
      </p>
      <div className="flex items-center">
        <Link 
          href="/" 
          className={buttonVariants({ className: "px-6", size: "lg" })}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}