import React from "react";
import { User, Mail, GraduationCap, Link2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface Person {
  name: string;
  role: string;
  subRole?: string; // e.g. "PhD Scholar (Full Time)" / "Batch of 2022"
  email?: string;
  domain?: string;
  bio?: string;
  education?: string[];
  imageUrl?: string;
  links?: { label: string; url: string }[];
}

interface PeopleCardProps {
  person: Person;
  themeColor?: string; // sky, teal, emerald, indigo, amber
}

export function PeopleCard({ person, themeColor = "sky" }: PeopleCardProps) {
  const initials = person.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Color mapping based on themeColor argument
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

  return (
    <div
      className={`rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md ${accentBorder}`}
    >
      <div className="flex flex-col sm:flex-row gap-5 items-start">
        <Avatar className="h-16 w-16 rounded-xl border border-border bg-background shrink-0">
          <AvatarFallback
            className={`rounded-xl text-lg font-extrabold ${accentBg}`}
          >
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0 w-full">
          <h3 className="text-lg font-bold text-foreground tracking-tight leading-snug truncate">
            {person.name}
          </h3>
          <div className={`text-xs font-semibold ${accentText} mt-0.5`}>
            {person.role}
          </div>
          {person.subRole && (
            <div className="text-3xs text-text-muted font-mono mt-0.5 tracking-wider uppercase">
              {person.subRole}
            </div>
          )}

          {person.domain && (
            <p className="mt-2.5 text-xs text-text-secondary leading-relaxed font-sans">
              <span className="font-semibold text-text-muted">
                Research Focus:
              </span>{" "}
              {person.domain}
            </p>
          )}

          {person.bio && (
            <p className="mt-2 text-2xs text-text-secondary leading-relaxed">
              {person.bio}
            </p>
          )}

          {person.education && person.education.length > 0 && (
            <div className="mt-3 flex items-start gap-1.5 text-3xs text-text-muted">
              <GraduationCap className="h-3.5 w-3.5 text-text-muted shrink-0 mt-0.5" />
              <div className="flex-1">
                {person.education.map((edu, idx) => (
                  <div key={idx} className="line-clamp-1">
                    {edu}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3.5 border-t border-border pt-3">
            {person.email && (
              <a
                href={`mailto:${person.email}`}
                className="inline-flex items-center gap-1.5 text-3xs text-text-secondary hover:text-accent transition"
              >
                <Mail className="h-3 w-3 text-text-muted" />
                <span>{person.email}</span>
              </a>
            )}

            {person.links &&
              person.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-3xs text-accent hover:underline transition font-semibold"
                >
                  <Link2 className="h-3 w-3 shrink-0" />
                  <span>{link.label}</span>
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
