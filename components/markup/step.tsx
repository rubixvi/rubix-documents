import { Children, PropsWithChildren, ReactNode } from "react";
import clsx from "clsx";
import { cn } from "@/lib/utils";

interface StepProps {
  children: ReactNode;
}

export function Step({ children }: PropsWithChildren<StepProps>) {
  const length = Children.count(children);

  return (
    <div className="flex flex-col">
      {Children.map(children, (child, index) => (
        <div
          className={cn(
            "relative border-l pl-9",
            clsx({ "pb-5": index < length - 1 })
          )}
        >
          <div className="absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-xs font-code font-medium">
            {index + 1}
          </div>
          {child}
        </div>
      ))}
    </div>
  );
}

interface StepItemProps {
  title?: string;
  children: ReactNode;
}

export function StepItem({ children, title }: StepItemProps) {
  return (
    <div className="!pt-0.5">
      {title && <h3 className="!mt-0">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}