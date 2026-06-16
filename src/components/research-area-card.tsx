import React from "react";
import { LucideIcon } from "lucide-react";

export interface ResearchArea {
  title: string;
  description: string;
  keywords: string[];
  achievements?: string[];
  icon?: LucideIcon;
}

interface ResearchAreaCardProps {
  area: ResearchArea;
  themeColor?: string; // sky, teal, emerald, indigo, amber
}

export function ResearchAreaCard({
  area,
  themeColor = "sky",
}: ResearchAreaCardProps) {
  const borderColors: Record<string, string> = {
    sky: "hover:border-sky-500/50 hover:shadow-sky-500/10",
    teal: "hover:border-teal-500/50 hover:shadow-teal-500/10",
    emerald: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    indigo: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    amber: "hover:border-amber-500/50 hover:shadow-amber-500/10",
  };

  const textColors: Record<string, string> = {
    sky: "text-sky-600 dark:text-sky-400",
    teal: "text-teal-600 dark:text-teal-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    indigo: "text-indigo-600 dark:text-indigo-400",
    amber: "text-amber-600 dark:text-amber-400",
  };

  const bgColors: Record<string, string> = {
    sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    teal: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  };

  const accentBorder = borderColors[themeColor] || borderColors.sky;
  const accentText = textColors[themeColor] || textColors.sky;
  const accentBg = bgColors[themeColor] || bgColors.sky;
  const IconComponent = area.icon;

  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm flex flex-col justify-between ${accentBorder}`}
    >
      <div>
        {IconComponent && (
          <div className={`rounded-lg p-2.5 w-fit ${accentBg}`}>
            <IconComponent className="h-5 w-5" />
          </div>
        )}
        <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug mt-4">
          {area.title}
        </h3>
        <p className="mt-3 text-xs text-text-secondary leading-relaxed font-sans">
          {area.description}
        </p>

        {area.achievements && area.achievements.length > 0 && (
          <div className="mt-4">
            <h4 className="text-3xs font-bold text-text-muted uppercase tracking-widest mb-2">
              Key Contributions
            </h4>
            <ul className="space-y-1.5">
              {area.achievements.map((ach, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-2xs text-text-secondary"
                >
                  <span className={`text-xs leading-none ${accentText}`}>
                    •
                  </span>
                  <span>{ach}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-1.5 border-t border-border pt-3">
        {area.keywords.map((kw, idx) => (
          <span
            key={idx}
            className={`rounded px-1.5 py-0.5 text-4xs font-semibold uppercase tracking-wider ${accentBg}`}
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  );
}
