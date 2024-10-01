import { PropsWithChildren } from "react";

export default function CardGrid({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
      {children}
    </div>
  );
}
