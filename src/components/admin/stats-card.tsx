import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className="border-neutral-200 bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-neutral-600">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-bold text-neutral-900">{value}</h3>
              {trend && (
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trend.isPositive ? "+" : ""}
                  {trend.value}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-neutral-500">{description}</p>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-neutral-100 p-3">
              <Icon className="h-5 w-5 text-neutral-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
