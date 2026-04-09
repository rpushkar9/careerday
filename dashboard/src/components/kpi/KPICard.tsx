import type { TrendDirection } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface KPICardProps {
  label: string;
  value: string | number;
  trend: TrendDirection;
  unit?: string;
}

function TrendIndicator({ trend }: { trend: TrendDirection }) {
  switch (trend) {
    case "up":
      return (
        <span aria-label="Trending up" className="text-green-600">
          &#9650;
        </span>
      );
    case "down":
      return (
        <span aria-label="Trending down" className="text-red-600">
          &#9660;
        </span>
      );
    case "neutral":
      return (
        <span aria-label="No change" className="text-gray-400">
          &#8212;
        </span>
      );
  }
}

export function KPICard({ label, value, trend, unit }: KPICardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {unit && (
            <span className="text-sm text-muted-foreground">{unit}</span>
          )}
          <TrendIndicator trend={trend} />
        </div>
      </CardContent>
    </Card>
  );
}
