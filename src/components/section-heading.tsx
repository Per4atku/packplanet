import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  className?: string;
  centered?: boolean;
}

export function SectionHeading({
  children,
  className,
  centered = true,
}: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        "mb-12 text-4xl font-bold tracking-tight md:text-5xl",
        centered && "text-center",
        className
      )}
    >
      {children}
    </h2>
  );
}
