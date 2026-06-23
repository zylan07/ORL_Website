import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteSettings } from "@/lib/admin-store";
import { hasContent } from "@/lib/utils";

type NavItem = {
  label: string;
  to: string;
};

const NAV: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "Research & Facilities", to: "/research" },
  { label: "Publications", to: "/publications" },
  { label: "Technical Training", to: "/technical-training" },
  { label: "Academic Activities", to: "/academic-activities" },
  { label: "People", to: "/people" },
  { label: "Gallery", to: "/gallery" },
  { label: "Awards & Recognitions", to: "/awards" },
  { label: "Collaborations & Consultancy", to: "/collaborations-consultancy" },
  { label: "Contact", to: "/contact" },
];

function ScrollableNav() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 2);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const handler = () => update();
    el.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      el.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.max(200, el.clientWidth * 0.6),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative flex min-w-0 flex-1 items-center justify-end">
      {canLeft && (
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Scroll navigation left"
          className="absolute left-0 z-10 flex h-full items-center bg-gradient-to-r from-primary via-primary/80 to-transparent pl-1.5 pr-4 text-primary-foreground/90 hover:text-primary-foreground transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      <div
        ref={ref}
        className={`flex max-w-full items-center gap-1 overflow-x-auto scroll-smooth whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-350 ${
          canLeft ? "pl-7" : "pl-2"
        } ${canRight ? "pr-7" : "pr-2"}`}
      >
        {NAV.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: item.to === "/" }}
            className="shrink-0 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground/85 transition-colors hover:text-primary-foreground md:px-2.5 md:text-xs"
            activeProps={{
              className:
                "shrink-0 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground relative after:absolute after:inset-x-1.5 after:-bottom-px after:h-0.5 after:bg-primary-foreground md:px-2.5 md:text-xs",
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
      {canRight && (
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Scroll navigation right"
          className="absolute right-0 z-10 flex h-full items-center bg-gradient-to-l from-primary via-primary/80 to-transparent pl-4 pr-1.5 text-primary-foreground/90 hover:text-primary-foreground transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [theme, setTheme] = useState<"light" | "dark" | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    let initialTheme: "light" | "dark";
    if (saved === "light" || saved === "dark") {
      initialTheme = saved;
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      initialTheme = systemDark ? "dark" : "light";
    }
    setTheme(initialTheme);
    // Write cookie on mount to synchronize with next page requests
    document.cookie = `theme=${initialTheme}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    // Write cookie when toggled
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-primary text-primary-foreground shadow-md transition-colors duration-300">
      {/* Animated Ocean Current line at the bottom of the sticky header */}
      <div className="nav-current-line" />
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2 md:gap-2.5">
          <Waves className="h-5 w-5 md:h-6 md:w-6 text-sky-300 drop-shadow-[0_0_4px_rgba(56,189,248,0.5)]" />
          <div className="leading-tight">
            <div className="text-xs font-bold tracking-wider md:text-sm md:tracking-wide">
              ORL
            </div>
            <div className="hidden text-[9px] uppercase tracking-wider opacity-85 sm:block md:text-[10px]">
              Ocean Research Laboratory
            </div>
          </div>
        </Link>

        <nav className="ml-auto flex min-w-0 flex-1 justify-end">
          <ScrollableNav />
        </nav>

        {theme !== null && (
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center rounded-md border border-sky-900/30 bg-sky-950/20 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-200 hover:bg-white/10 hover:text-white transition cursor-pointer select-none shrink-0"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? (
              <span className="flex items-center gap-1">
                <span>☀</span> <span className="hidden sm:inline">Light</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span>🌙</span> <span className="hidden sm:inline">Dark</span>
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}

function FooterBubblesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let bubbles: {
      x: number;
      y: number;
      r: number;
      vy: number;
      opacity: number;
    }[] = [];

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isReducedMotion = reducedMotionQuery.matches;

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      init();
    };
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 200;
      init();
    };

    const init = () => {
      bubbles = [];
      if (isReducedMotion) return;

      const isMobile = window.innerWidth < 768;
      const count = isMobile ? 8 : 22;

      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + Math.random() * 50,
          r: Math.random() * 2.5 + 1.5,
          vy: -(Math.random() * 0.3 + 0.1),
          opacity: Math.random() * 0.25 + 0.1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isReducedMotion) return;

      bubbles.forEach((b) => {
        b.y += b.vy;
        if (b.y < -10) {
          b.y = canvas.height + 10;
          b.x = Math.random() * canvas.width;
        }

        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(14, 165, 233, ${b.opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.15, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 1.5})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          draw();
        } else {
          cancelAnimationFrame(animationId);
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(canvas);

    window.addEventListener("resize", resize);
    resize();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0"
    />
  );
}

export function SiteFooter() {
  const settings = useSiteSettings();

  return (
    <footer className="relative mt-16 overflow-hidden border-t border-sky-950/40 bg-gradient-to-b from-slate-900 to-indigo-950 text-slate-300 py-10">
      <FooterBubblesCanvas />

      <div className="relative mx-auto max-w-6xl px-6 z-10 text-sm">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Card 1: Organization Details */}
          <div>
            <div className="font-bold text-white text-base tracking-wide">
              {settings.footerOrgName || "Ocean Research Laboratory"}
            </div>
            {hasContent(settings.footerOrgDesc) && (
              <p className="mt-2.5 text-slate-400 leading-relaxed font-sans">
                {settings.footerOrgDesc}
              </p>
            )}
          </div>

          {/* Card 2: Contact Info */}
          {(hasContent(settings.footerContactEmail) || hasContent(settings.footerContactPhone) || hasContent(settings.footerContactAddress)) && (
            <div>
              <div className="font-bold text-white text-base tracking-wide">
                {settings.footerContactTitle || "Contact Information"}
              </div>
              <p className="mt-2.5 text-slate-400 leading-relaxed font-sans space-y-1">
                {hasContent(settings.footerContactEmail) && (
                  <span className="block">
                    <span className="font-semibold text-slate-300">Email:</span>{" "}
                    <a
                      className="text-sky-400 hover:text-sky-300 hover:underline"
                      href={`mailto:${settings.footerContactEmail}`}
                    >
                      {settings.footerContactEmail}
                    </a>
                  </span>
                )}
                {hasContent(settings.footerContactPhone) && (
                  <span className="block">
                    <span className="font-semibold text-slate-300">Phone:</span>{" "}
                    {settings.footerContactPhone}
                  </span>
                )}
                {hasContent(settings.footerContactAddress) && (
                  <span className="block">
                    <span className="font-semibold text-slate-300">Address:</span>{" "}
                    {settings.footerContactAddress}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Card 3: Quick Navigation links */}
          {(settings.footerLinks || []).length > 0 && (
            <div>
              <div className="font-bold text-white text-base tracking-wide">
                {settings.footerLinksTitle || "Quick Links"}
              </div>
              <ul className="mt-2.5 space-y-1.5 font-sans">
                {(settings.footerLinks || []).map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link to={link.url} className="text-sky-400 hover:text-sky-300 hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Card 4: Social Connections */}
          {(settings.footerSocials || []).length > 0 && (
            <div>
              <div className="font-bold text-white text-base tracking-wide">
                {settings.footerSocialTitle || "Connect With Us"}
              </div>
              <ul className="mt-2.5 space-y-1.5 font-sans">
                {(settings.footerSocials || []).map((social, sIdx) => (
                  <li key={sIdx}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 hover:underline"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Card 5: Footer Bottom copyright & links */}
        <div className="mt-10 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-sans">
          <div>
            {settings.footerCopyright || `© ${new Date().getFullYear()} Ocean Research Laboratory, NITTTR Chennai. All rights reserved.`}
          </div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <Link to="/" className="hover:text-slate-400 transition-colors">
              Home
            </Link>
            <Link
              to="/publications"
              className="hover:text-slate-400 transition-colors"
            >
              Publications
            </Link>
            <Link
              to="/contact"
              className="hover:text-slate-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
