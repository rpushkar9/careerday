import { useState } from "react";
import { Info } from "lucide-react";
import type { TrendDirection } from "@/types";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  label: string;
  value: string | number;
  trend: TrendDirection;
  icon: React.ComponentType<{ className?: string }>;
  unit?: string;
  delta?: string;
  tooltip?: string;
}

function trendSymbol(trend: TrendDirection): string {
  switch (trend) {
    case "up":
      return "▲";
    case "down":
      return "▼";
    case "neutral":
      return "—";
  }
}

function trendAriaLabel(trend: TrendDirection): string {
  switch (trend) {
    case "up":
      return "Trending up";
    case "down":
      return "Trending down";
    case "neutral":
      return "No change";
  }
}

function badgeClasses(trend: TrendDirection): string {
  if (trend === "up") return "text-primary bg-secondary/70";
  return "text-muted-foreground bg-secondary/50";
}

export function KPICard({ label, value, trend, icon: Icon, unit, delta, tooltip }: KPICardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Card>
      <CardContent className="pt-5 pb-5">
        {/* Top row: icon + change badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 rounded-xl bg-secondary/50 text-primary">
            <Icon className="w-5 h-5" />
          </div>
          {(delta !== undefined || trend !== "neutral") && (
            <span
              aria-label={trendAriaLabel(trend)}
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badgeClasses(trend)}`}
            >
              {delta ?? trendSymbol(trend)}
            </span>
          )}
        </div>

        {/* Bottom: label + value */}
        <div>
          <div className="flex items-center gap-1 mb-1">
            <p className="text-sm text-muted-foreground">{label}</p>
            {tooltip && (
              <div className="relative">
                <button
                  type="button"
                  data-tooltip-trigger
                  aria-label="More information"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onFocus={() => setShowTooltip(true)}
                  onBlur={() => setShowTooltip(false)}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                {showTooltip && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded-xl border bg-white p-3 shadow text-xs text-muted-foreground z-10">
                    {tooltip}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{value}</span>
            {unit && (
              <span className="text-sm text-muted-foreground">{unit}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
