import { cn } from "@/lib/utils";

interface SpaceProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8",
  md: "h-16",
  lg: "h-24",
  xl: "h-32",
  "2xl": "h-40",
};

export function Space({ size = "lg", className }: SpaceProps) {
  return <div className={cn(sizeClasses[size], className)} aria-hidden="true" />;
}
