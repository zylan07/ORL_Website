import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Link, createRootRouteWithContext, useRouter, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, notFound, createRouter } from "@tanstack/react-router";
import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { z } from "zod";
const appCss = "/assets/styles-WO3g0ToW.css";
const NAV = [
  { label: "Home", to: "/" },
  { label: "Research & Facilities", to: "/research" },
  { label: "Publications", to: "/publications" },
  { label: "Technical Training", to: "/technical-training" },
  { label: "Academic Activities", to: "/academic-activities" },
  { label: "People", to: "/people" },
  { label: "Gallery", to: "/gallery" },
  { label: "Awards & Recognitions", to: "/awards" },
  { label: "Collaborations & Consultancy", to: "/collaborations-consultancy" },
  { label: "Contact", to: "/contact" }
];
function ScrollableNav() {
  const ref = useRef(null);
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
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);
  const nudge = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({
      left: dir * Math.max(200, el.clientWidth * 0.6),
      behavior: "smooth"
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "relative flex min-w-0 flex-1 items-center justify-end", children: [
    canLeft && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => nudge(-1),
        "aria-label": "Scroll navigation left",
        className: "absolute left-0 z-10 flex h-full items-center bg-gradient-to-r from-primary via-primary/80 to-transparent pl-1.5 pr-4 text-primary-foreground/90 hover:text-primary-foreground transition-all",
        children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: `flex max-w-full items-center gap-1 overflow-x-auto scroll-smooth whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-all duration-350 ${canLeft ? "pl-7" : "pl-2"} ${canRight ? "pr-7" : "pr-2"}`,
        children: NAV.map((item) => /* @__PURE__ */ jsx(
          Link,
          {
            to: item.to,
            activeOptions: { exact: item.to === "/" },
            className: "shrink-0 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground/85 transition-colors hover:text-primary-foreground md:px-2.5 md:text-xs",
            activeProps: {
              className: "shrink-0 px-2 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary-foreground relative after:absolute after:inset-x-1.5 after:-bottom-px after:h-0.5 after:bg-primary-foreground md:px-2.5 md:text-xs"
            },
            children: item.label
          },
          item.to
        ))
      }
    ),
    canRight && /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        onClick: () => nudge(1),
        "aria-label": "Scroll navigation right",
        className: "absolute right-0 z-10 flex h-full items-center bg-gradient-to-l from-primary via-primary/80 to-transparent pl-4 pr-1.5 text-primary-foreground/90 hover:text-primary-foreground transition-all",
        children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" })
      }
    )
  ] });
}
function SiteHeader() {
  const [theme, setTheme] = useState(null);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    let initialTheme;
    if (saved === "light" || saved === "dark") {
      initialTheme = saved;
    } else {
      const systemDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      initialTheme = systemDark ? "dark" : "light";
    }
    setTheme(initialTheme);
    document.cookie = `theme=${initialTheme}; path=/; max-age=31536000; SameSite=Lax`;
  }, []);
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    document.cookie = `theme=${nextTheme}; path=/; max-age=31536000; SameSite=Lax`;
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-40 border-b border-border bg-primary text-primary-foreground shadow-md transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("div", { className: "nav-current-line" }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:px-6", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex shrink-0 items-center gap-2 md:gap-2.5", children: [
        /* @__PURE__ */ jsx(Waves, { className: "h-5 w-5 md:h-6 md:w-6 text-sky-300 drop-shadow-[0_0_4px_rgba(56,189,248,0.5)]" }),
        /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsx("div", { className: "text-xs font-bold tracking-wider md:text-sm md:tracking-wide", children: "ORL" }),
          /* @__PURE__ */ jsx("div", { className: "hidden text-[9px] uppercase tracking-wider opacity-85 sm:block md:text-[10px]", children: "Ocean Research Laboratory" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "ml-auto flex min-w-0 flex-1 justify-end", children: /* @__PURE__ */ jsx(ScrollableNav, {}) }),
      theme !== null && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: toggleTheme,
          className: "flex items-center justify-center rounded-md border border-sky-900/30 bg-sky-950/20 px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider text-sky-200 hover:bg-white/10 hover:text-white transition cursor-pointer select-none shrink-0",
          title: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
          children: theme === "dark" ? /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { children: "☀" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Light" })
          ] }) : /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsx("span", { children: "🌙" }),
            " ",
            /* @__PURE__ */ jsx("span", { className: "hidden sm:inline", children: "Dark" })
          ] })
        }
      )
    ] })
  ] });
}
function FooterBubblesCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId;
    let bubbles = [];
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    let isReducedMotion = reducedMotionQuery.matches;
    const handleReducedMotionChange = (e) => {
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
          opacity: Math.random() * 0.25 + 0.1
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
      { threshold: 0.05 }
    );
    observer.observe(canvas);
    window.addEventListener("resize", resize);
    resize();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange
      );
      observer.disconnect();
    };
  }, []);
  return /* @__PURE__ */ jsx(
    "canvas",
    {
      ref: canvasRef,
      className: "absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0"
    }
  );
}
function SiteFooter() {
  return /* @__PURE__ */ jsxs("footer", { className: "relative mt-16 overflow-hidden border-t border-sky-950/40 bg-gradient-to-b from-slate-900 to-indigo-950 text-slate-300 py-10", children: [
    /* @__PURE__ */ jsx(FooterBubblesCanvas, {}),
    /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-6xl px-6 z-10 text-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid gap-8 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-white text-base tracking-wide", children: "Ocean Research Laboratory" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2.5 text-slate-400 leading-relaxed", children: [
            "National Institute of Technical Teachers Training and Research (NITTTR)",
            /* @__PURE__ */ jsx("br", {}),
            "Taramani, Chennai",
            /* @__PURE__ */ jsx("br", {}),
            "Tamil Nadu - 600113"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-white text-base tracking-wide", children: "Contact Information" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2.5 text-slate-400 leading-relaxed", children: [
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-300", children: "Email:" }),
            " ",
            /* @__PURE__ */ jsx(
              "a",
              {
                className: "text-sky-400 hover:text-sky-300 hover:underline",
                href: "mailto:orl@nitttrc.ac.in",
                children: "orl@nitttrc.ac.in"
              }
            ),
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "font-semibold text-slate-300", children: "Phone:" }),
            " +91 44 2254 5400"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-bold text-white text-base tracking-wide", children: "Academic Repository" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2.5 text-slate-400 leading-relaxed", children: "A comprehensive website detailing publications, academic awards, advisory boards, pg activities, and coordinator-led initiatives." })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Ocean Research Laboratory, NITTTR Chennai. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-2 sm:mt-0 flex gap-4", children: [
          /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-slate-400 transition-colors", children: "Home" }),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/publications",
              className: "hover:text-slate-400 transition-colors",
              children: "Publications"
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: "/contact",
              className: "hover:text-slate-400 transition-colors",
              children: "Contact"
            }
          )
        ] })
      ] })
    ] })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$k = createRootRouteWithContext()(
  {
    loader: ({ request }) => {
      const cookieHeader = request?.headers?.get("Cookie") || "";
      const match = cookieHeader.match(/theme=(light|dark)/);
      const serverTheme = match ? match[1] : null;
      return { serverTheme };
    },
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: "Lovable App" },
        { name: "description", content: "Lovable Generated Project" },
        { name: "author", content: "Lovable" },
        { property: "og:title", content: "Lovable App" },
        { property: "og:description", content: "Lovable Generated Project" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary" },
        { name: "twitter:site", content: "@Lovable" }
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss
        }
      ]
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: ErrorComponent
  }
);
function RootShell({ children }) {
  const loaderData = Route$k.useLoaderData();
  const themeClass = loaderData?.serverTheme === "dark" ? "dark" : "";
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: themeClass, suppressHydrationWarning: true, children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(HeadContent, {}),
      /* @__PURE__ */ jsx(
        "script",
        {
          dangerouslySetInnerHTML: {
            __html: `
          (function() {
            var saved = localStorage.getItem('theme');
            var theme = saved || '${loaderData?.serverTheme || "light"}';
            if (saved === 'dark' || saved === 'light') {
              theme = saved;
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              theme = 'dark';
            }
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          })();
        `
          }
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$k.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen flex-col bg-background", children: [
    /* @__PURE__ */ jsx(SiteHeader, {}),
    /* @__PURE__ */ jsx("main", { className: "flex-1", children: /* @__PURE__ */ jsx(Outlet, {}) }),
    /* @__PURE__ */ jsx(SiteFooter, {})
  ] }) });
}
const $$splitComponentImporter$j = () => import("./technical-training-88KLVUxr.js");
const technicalTrainingSearchSchema = z.object({
  tab: z.enum(["host", "itec", "itp", "pdp", "coordinator", "pg"]).optional()
});
const Route$j = createFileRoute("/technical-training")({
  validateSearch: (search) => technicalTrainingSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Technical Training & PG Courses — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Professional development programmes, ITEC activities, industrial training, PG courses, and host institution engagements at ORL."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$j, "component")
});
const $$splitComponentImporter$i = () => import("./research-DXgOBJzB.js");
const researchSearchSchema = z.object({
  tab: z.enum(["areas", "facilities", "field-activities", "funded-projects", "student-projects", "supervision"]).optional()
});
const Route$i = createFileRoute("/research")({
  validateSearch: (search) => researchSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Research & Facilities | Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Explore research areas, advanced testing facilities, subsea robotic platforms, field trials, and funded projects at ORL."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$i, "component")
});
const $$splitComponentImporter$h = () => import("./publications-o6YpYsO-.js");
const publicationsSearchSchema = z.object({
  tab: z.enum(["journals", "conferences", "books"]).optional()
});
const Route$h = createFileRoute("/publications")({
  validateSearch: (search) => publicationsSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Publications — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Peer-reviewed journal articles, conference papers, and books by ORL members."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$h, "component")
});
const $$splitComponentImporter$g = () => import("./people-VF2ZLIht.js");
const peopleSearchSchema = z.object({
  tab: z.enum(["faculty", "scholars", "staff", "phd", "alumni", "interns", "discussions"]).optional()
});
const Route$g = createFileRoute("/people")({
  validateSearch: (search) => peopleSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "People | Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Meet the faculty, research scholars, project engineers, interns, and alumni of the Ocean Research Laboratory."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const TEAM_MEMBERS = [{
  id: "fac-1",
  name: "Dr. K. Muthumeenakshi",
  designation: "Associate Professor",
  department: "Department of Electronics and Communication Engineering",
  institution: "SSNCE",
  projectRoles: ["Principal Investigator", "Co-investigator"],
  associatedProjects: ["Automated Identification and Characterization of Underwater Images in Deep Ocean", "Implementation of Magnetic Induction based Underground Sensor Network for Smart Irrigation"],
  imageUrl: null,
  link: "https://www.ssn.edu.in/staff-members/dr-k-muthumeenakshi/"
}, {
  id: "fac-2",
  name: "Dr. S. Sakthivel Murugan",
  designation: "Professor",
  department: "Department of ECE",
  institution: "NITTTR, Taramani, Chennai",
  bio: "Worked in the Department of ECE, SSN since June 2001 till September 2024. He has completed and ongoing research projects funded by MoES, DST-SSTP, TNSCST, NIOT, and SSN Trust worth more than 200 lakhs.",
  imageUrl: null,
  link: "https://www.ssn.edu.in/staff-members/dr-s-sakthivel-murugan/"
}, {
  id: "fac-3",
  name: "Dr. G. Satheesh Kumar",
  designation: "Associate Professor",
  department: "Department of Mechanical Engineering",
  institution: "SSNCE",
  projectRoles: ["Co-investigator"],
  associatedProjects: ["Amphibious waterbody and beach cleaning BOT"],
  imageUrl: null,
  link: "https://www.ssn.edu.in/staff-members/satheesh-kumar/"
}, {
  id: "fac-4",
  name: "Dr. K. Murugesan",
  designation: "Assistant Professor",
  department: "Department of Electrical and Electronics Engineering",
  institution: "SSNCE",
  projectRoles: ["Co-investigator"],
  associatedProjects: ["Design and Development of Indigenous Research based Inspection Class Remotely Operated Vehicle (ROV)"],
  imageUrl: null,
  link: "https://www.ssn.edu.in/staff-members/dr-k-murugesan/"
}, {
  id: "fac-5",
  name: "Dr. N. Padmapriya",
  designation: "Assistant Professor",
  department: "Department of Mathematics",
  institution: "SSNCE",
  projectRoles: ["Co-investigator"],
  associatedProjects: ["Off-shore excavation of heritage rich submerged sites of Poompuhar and Mahabalipuram by EMD using Deep Learning"],
  imageUrl: null,
  link: "https://www.ssn.edu.in/staff-members/dr-n-padmapriya/"
}];
const RESEARCH_SCHOLARS = [{
  id: "sch-1",
  name: "M. Vimal Raj",
  mode: "Full Time",
  status: "Thesis Submitted",
  role: "Project Associate- II",
  associatedProject: "MoES- DOM Project",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Vimal_Madhaiyan"
}, {
  id: "sch-2",
  name: "R. Logeshwaran",
  mode: "Part Time",
  status: "Thesis Submitted",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Logeshwaran_Kr"
}, {
  id: "sch-3",
  name: "K. Balaji",
  mode: "Part Time",
  status: "Thesis Submitted",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Balaji_Kathavarayan"
}, {
  id: "sch-4",
  name: "R. Sathya Priya",
  mode: "Full Time",
  status: "Active",
  role: "Project Associate-I",
  associatedProject: "MoES- DOM Project",
  imageUrl: null,
  link: "https://www.linkedin.com/in/r-sathya-priya-cse-kiot-922387265/"
}];
const PROJECT_STAFF = [{
  id: "stf-1",
  name: "S. Sabareesan",
  role: "Project Associate - I",
  project: "MoES - DOM Project",
  imageUrl: null,
  link: "https://www.linkedin.com/in/sabareesans/"
}, {
  id: "stf-2",
  name: "R. M. Nithyalakshmi",
  role: "Research Assistant",
  imageUrl: null
}];
const PHD_GRADUATES = [{
  id: "doc-1",
  name: "Dr. S. Swathi",
  researchArea: "Underground Communication",
  graduationDate: "October 2022",
  status: "Completed",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Swathi_Sugumar"
}, {
  id: "doc-2",
  name: "Dr. M. Somasekar",
  researchArea: "Underwater Image Enhancement",
  graduationDate: "January 2024",
  status: "Completed",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Somasekar_Muthusamy"
}, {
  id: "doc-3",
  name: "Dr. G. Annalakshmi",
  researchArea: "Coral Image Classification",
  graduationDate: "October 2022",
  status: "Completed",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Annalakshmi_Ganesan?"
}, {
  id: "doc-4",
  name: "Dr. S. Mary Cecilia",
  researchArea: "Underwater Image Dehazing",
  graduationDate: "February 2023",
  status: "Completed",
  imageUrl: null,
  link: "http://www.researchgate.net/profile/Mary_Cecilia2/research"
}, {
  id: "doc-5",
  name: "Dr. M. Dhana Lakshmi",
  researchArea: "Underwater Species Image Classification",
  graduationDate: "November 2023",
  status: "Completed",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Dhanalakshmi_Muthuraman"
}];
const UG_STUDENTS = [{
  id: "ug-1",
  name: "S. Sivasankar",
  status: "Current Student",
  imageUrl: null
}];
const UG_ALUMNI = [{
  id: "al-ug-1",
  name: "M. Pranav",
  imageUrl: null
}, {
  id: "al-ug-2",
  name: "S. Nisha Nethraa",
  imageUrl: null
}, {
  id: "al-ug-3",
  name: "Janakiram.V",
  imageUrl: null
}, {
  id: "al-ug-4",
  name: "AKKASH ANNIYAPPA C.S",
  imageUrl: null,
  link: "https://www.linkedin.com/in/akkash-anniyappa-c-s-55179b218/"
}, {
  id: "al-ug-5",
  name: "D. Karthik",
  imageUrl: null,
  link: "https://www.linkedin.com/in/karthik-desingu/"
}, {
  id: "al-ug-6",
  name: "Karthik Raja A",
  imageUrl: null,
  link: "https://www.linkedin.com/in/karthik-raja-anandan-87ab5b200/"
}, {
  id: "al-ug-7",
  name: "A. Anirudh",
  imageUrl: null
}, {
  id: "al-ug-8",
  name: "B. Sandhya",
  imageUrl: null,
  link: "http://www.linkedin.com/in/sandhya-b-a98609216"
}, {
  id: "al-ug-9",
  name: "G.Sree Harine",
  imageUrl: null,
  link: "http://www.linkedin.com/in/sree-harine-govindaraj-3a604698"
}, {
  id: "al-ug-10",
  name: "D. Nivedhitha",
  imageUrl: null,
  link: "https://www.linkedin.com/in/nivedhitha-dhanasekaran/"
}, {
  id: "al-ug-11",
  name: "M.P.Shwetha",
  imageUrl: null,
  link: "https://www.linkedin.com/in/shwetha-m-p-9b6b641b2/"
}, {
  id: "al-ug-12",
  name: "Tejaswini Panati",
  imageUrl: null,
  link: "https://www.linkedin.com/in/tejaswini-panati-66a982181/"
}, {
  id: "al-ug-13",
  name: "Sai Deepika Indraganti",
  imageUrl: null,
  link: "https://www.linkedin.com/in/sai-deepika-i-746a55168/"
}, {
  id: "al-ug-14",
  name: "N.J. Raksshitha",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Raksshitha_Nj"
}, {
  id: "al-ug-15",
  name: "Hashmat Banday",
  imageUrl: null,
  link: "https://www.linkedin.com/in/hashmat-j-banday/"
}, {
  id: "al-ug-16",
  name: "Vishal Mohan",
  imageUrl: null,
  link: "https://www.linkedin.com/in/vishal-mohan-95a584160/"
}, {
  id: "al-ug-17",
  name: "Vigneshwar Veeravagu",
  imageUrl: null,
  link: "https://www.linkedin.com/in/vigneshwar-veeravagu-721675176/"
}, {
  id: "al-ug-18",
  name: "S. Shrinivas Badri",
  imageUrl: null,
  link: "https://www.linkedin.com/in/shrinivasbadri/"
}, {
  id: "al-ug-19",
  name: "Sharath N Chittaragi",
  imageUrl: null,
  link: "https://www.linkedin.com/in/sharath-chittaragi/"
}, {
  id: "al-ug-20",
  name: "A. Shashank Karthikeyaa",
  imageUrl: null,
  link: "https://www.linkedin.com/in/shashankkarrthikeyaaas/"
}, {
  id: "al-ug-21",
  name: "R. Priyadarshini",
  imageUrl: null,
  link: "https://www.linkedin.com/in/priya0297/"
}, {
  id: "al-ug-22",
  name: "G. Revathi",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Revathi_Gunasekaran"
}, {
  id: "al-ug-23",
  name: "V. Sneha",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Sneha_Vijayakumar2"
}, {
  id: "al-ug-24",
  name: "S. Nikitha",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Nikhitha_Senthilkumar"
}, {
  id: "al-ug-25",
  name: "V. Zohra Noori Mohsina",
  imageUrl: null,
  link: "https://www.linkedin.com/in/zohra-noori-mohsina-3a4132168/"
}, {
  id: "al-ug-26",
  name: "S.A. Thirumalini",
  imageUrl: null,
  link: "https://www.linkedin.com/in/thirumalini-s-a-5a2379134/"
}, {
  id: "al-ug-27",
  name: "D. Deepika",
  imageUrl: null
}];
const PG_ALUMNI = [{
  id: "al-pg-1",
  name: "Sukanthi Kannan",
  programme: "M.E Applied Electronics",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Sukanthi?ev=hdr_xprf"
}, {
  id: "al-pg-2",
  name: "Mubeena Parveen",
  programme: "M.E Applied Electronics",
  imageUrl: null,
  link: "https://www.researchgate.net/profile/Mubeena_Parveen2"
}, {
  id: "al-pg-3",
  name: "B. Raagavi",
  programme: "M.E Applied Electronics",
  imageUrl: null,
  link: "https://www.linkedin.com/in/raagavi-balaji-90281b156/"
}, {
  id: "al-pg-4",
  name: "M. Pratyusha",
  programme: "M.E Communication Systems",
  imageUrl: null,
  link: "https://www.linkedin.com/in/pratyushamahavadi-aa886986/"
}, {
  id: "al-pg-5",
  name: "B. Arunkumar",
  programme: "M.E Communication Systems",
  imageUrl: null,
  link: "https://www.linkedin.com/in/arunkumar-balasubramanian-b11a71182/"
}];
const INTERNSHIPS = [{
  id: "intern-1",
  name: "Mr. Kavin R B",
  institution: "SSNCE",
  topic: "Localization of AUV : Trilateration and Triangle Localization",
  duration: "July- August 2024",
  imageUrl: null
}, {
  id: "intern-2",
  name: "Mr. R P Parvath Balaji",
  institution: "Anna University regional campus Tirunelveli",
  topic: "Control of ARM in ROV",
  duration: "June - July 2024",
  imageUrl: null
}, {
  id: "intern-3",
  name: "Mr. A Hridhay",
  institution: "VIT Chennai",
  topic: "Underwater Image Restoration using ML & DL",
  duration: "May - June 2024",
  imageUrl: null
}, {
  id: "intern-4",
  name: "Mr. K. Bharath",
  institution: "SRM Institute of Science and Technology",
  topic: "Testing of an Audio Signal in Underwater test tank",
  duration: "June - July 2024",
  imageUrl: null
}, {
  id: "intern-5",
  name: "Ms. T. Gayathri",
  institution: "SRM Valliammai Engineering College",
  topic: "Testing of an Audio Signal in Underwater test tank",
  duration: "June - July 2024",
  imageUrl: null
}, {
  id: "intern-6",
  name: "Ms. Harini Sri Ramesh",
  institution: "SRM Valliammai Engineering College",
  topic: "Testing of an Audio Signal in Underwater test tank",
  duration: "June - July 2024",
  imageUrl: null
}, {
  id: "intern-7",
  name: "Mr. Kishore R V",
  institution: "SRM Valliammai Engineering College",
  topic: "Control of ARM in ROV",
  duration: "June - July 2024",
  imageUrl: null
}, {
  id: "intern-8",
  name: "Mr. A. Immanuvel Kirthick",
  institution: "SRM Valliammai Engineering College",
  topic: "Control of ARM in ROV",
  duration: "June - July 2024",
  imageUrl: null
}, {
  id: "intern-9",
  name: "Ms. K. MADHUSHREE",
  institution: "SRM Valliammai Engineering College",
  topic: "Navigation Analysis of Underwater ROV",
  duration: "June - July 2024",
  imageUrl: null
}, {
  id: "intern-10",
  name: "Ms. P. Saranya",
  institution: "Sri Sairam Engineering College",
  topic: "Testing of acoustic signal transmission in underwater",
  duration: "June - August 2023",
  imageUrl: null
}, {
  id: "intern-11",
  name: "Mr. S. KIBAR",
  institution: "Sri Sairam Engineering College",
  topic: "Navigation System for Underwater ROV",
  duration: "June- August 2023",
  imageUrl: null
}, {
  id: "intern-12",
  name: "Mr. S. Sakthivel",
  institution: "Amrita Vishwa Vishwapeetham",
  topic: "Underwater Noise Analysis and Image Enhancement",
  duration: "May - June 2021",
  imageUrl: null
}, {
  id: "intern-13",
  name: "HARIKRISHNAN J",
  institution: "Sri Venkateswaraa College of Technology, Sriperumbudur",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-14",
  name: "KANNIGA K",
  institution: "Puducherry Techonological University",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-15",
  name: "PRASANNAA G",
  institution: "Puducherry Techonological University",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-16",
  name: "GIRIDHARAN N",
  institution: "CARE College of Engineering, Trichy",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-17",
  name: "JEEVA S",
  institution: "CARE College of Engineering, Trichy",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-18",
  name: "JEGADESWARAN R",
  institution: "CARE College of Engineering, Trichy",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-19",
  name: "SURYA R R",
  institution: "CARE College of Engineering, Trichy",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-20",
  name: "UDHAYAKUMAR S",
  institution: "Sri Venkateswara College of Engineering",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-21",
  name: "CHIDHAMBARAM P",
  institution: "Sri Venkateswara College of Engineering",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-22",
  name: "VISHNUPRASATH V",
  institution: "Sri Venkateswara College of Engineering",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-23",
  name: "Muhammad Arshad K",
  institution: "Sri Venkateswara College of Engineering",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-24",
  name: "DEEPA SREE S",
  institution: "Sri Venkateswara College of Engineering",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-25",
  name: "HIMAVARSHINI K R",
  institution: "Sri Venkateswara College of Engineering",
  duration: "15/12/2025 to 13/01/2026",
  imageUrl: null
}, {
  id: "intern-26",
  name: "KAVYA S",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-27",
  name: "NISHA K",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-28",
  name: "VIJAYALAKSHMI R",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-29",
  name: "SURUTHI D",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-30",
  name: "SUDARVIZHI S",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-31",
  name: "SUWETHA M",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-32",
  name: "KAVYASHREE R",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-33",
  name: "VERSIA SRI A",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-34",
  name: "SIBIRAM T",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-35",
  name: "KIRUBA K",
  institution: "KPR Institute of Engineering and Technology, Coimbatore",
  duration: "01/01/2026 to 30/01/2026",
  imageUrl: null
}, {
  id: "intern-36",
  name: "SUNDARAM V",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, Kanchipuram",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-37",
  name: "KARUNYA D",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-38",
  name: "HARINI R",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-39",
  name: "VINAYAGAMURTHI E",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-40",
  name: "YUGAL KISHORE",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-41",
  name: "SHAGUL",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-42",
  name: "NARESH KUMAR R",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-43",
  name: "SURENDER SAH K",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-44",
  name: "SAKTHIVEL S",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-45",
  name: "LOKESH M",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-46",
  name: "PRIYADHARSHINI R",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-47",
  name: "NIVETHALAKSHMI C B",
  institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-48",
  name: "SHRUTHI M G",
  institution: "Muthayammal Engineering College, Rasipuram, Namakkal",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-49",
  name: "VIJAYAKUMAR S",
  institution: "Muthayammal Engineering College, Rasipuram, Namakkal",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-50",
  name: "SRIMATHI T",
  institution: "Muthayammal Engineering College, Rasipuram, Namakkal",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-51",
  name: "SUBHASHREE R R",
  institution: "Muthayammal Engineering College, Rasipuram, Namakkal",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-52",
  name: "VAISHNAVI K",
  institution: "Muthayammal Engineering College, Rasipuram, Namakkal",
  duration: "02/12/2025 to 02/01/2026",
  imageUrl: null
}, {
  id: "intern-53",
  name: "PRADEEP S",
  institution: "Erode Sengunthar Engineering College, Perundurai",
  duration: "10/02/2026 to 10/03/2026",
  imageUrl: null
}, {
  id: "intern-54",
  name: "RAGHAVA SIMHAN S",
  institution: "Erode Sengunthar Engineering College, Perundurai",
  duration: "10/02/2026 to 10/03/2026",
  imageUrl: null
}, {
  id: "intern-55",
  name: "SORNA MAHI S A",
  institution: "Erode Sengunthar Engineering College, Perundurai",
  duration: "10/02/2026 to 10/03/2026",
  imageUrl: null
}, {
  id: "intern-56",
  name: "PRITHIVIRAJ R",
  institution: "Erode Sengunthar Engineering College, Perundurai",
  duration: "10/02/2026 to 10/03/2026",
  imageUrl: null
}, {
  id: "intern-57",
  name: "NARASHIMMAN M",
  institution: "Erode Sengunthar Engineering College, Perundurai",
  duration: "10/02/2026 to 10/03/2026",
  imageUrl: null
}, {
  id: "intern-58",
  name: "ARJUN E",
  institution: "Erode Sengunthar Engineering College, Perundurai",
  duration: "10/02/2026 to 10/03/2026",
  imageUrl: null
}];
const TECHNICAL_DISCUSSIONS = [{
  id: "disc-1",
  title: "Intern Students Discussion on Testing of an Audio Signal in Underwater test tank and Control of ARM in ROV",
  date: "June-August 2024",
  participants: "Intern students at ORL",
  summary: "Active review sessions covering experimental setups for acoustic signal transmission, hydrophone calibration, and joint testing of robotic arms for subsea remotely operated vehicles.",
  imageUrl: null
}, {
  id: "disc-2",
  title: "One Day Workshop on Design of ROV",
  date: "28 September & 4 October 2019",
  participants: "Dr. R. Satish (Guest Speaker), ORL Team & Scholars",
  summary: "One Day workshop by Dr. R. Satish on Design of Remotely Operated Vehicles (ROV) held inside the laboratory workspace to outline structural, buoyancy, and end-cap layout calculations.",
  imageUrl: null
}, {
  id: "disc-3",
  title: "Technical Discussion of Development of ROV at Arobotics",
  date: "22 October 2019",
  participants: "Arobotics Engineers, Dr. S. Sakthivel Murugan, and Project Associates",
  summary: "Collaborative systems engineering review regarding industrial fabrication of waterproof ROV chassis hulls and thruster power allocation tables.",
  imageUrl: null
}, {
  id: "disc-4",
  title: "Discussion on Development of Underwater Sea-Battery",
  date: "14 October 2019",
  participants: "Mr. S. R. Elamaran & colleague (AMET University), Dr. S. Sakthivel Murugan",
  summary: "Research alignment session detailing materials and stack configurations for sea-water activated galvanic batteries designed for long-duration low-power subsea transponders.",
  imageUrl: null
}, {
  id: "disc-5",
  title: "Academic Research Collaborative Discussion Visit",
  date: "17 March 2022",
  participants: "Miss. A. Priya (Associate Professor, Crescent Institute), Scholars & Students",
  summary: "Miss. A. Priya along with her research scholars and PG cohorts visited the lab and discussed ongoing research on magnetic induction-based underground networks.",
  imageUrl: null
}];
const PLACEHOLDER_IMAGES = {
  project: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g1' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%230891b2'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g1)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='50' fill='%23ffffff' fill-opacity='0.05' stroke='%230891b2' stroke-width='2'/><path d='M-15-20 h30 v40 h-30 z M-10-10 h20 M-10-2 h20 M-10 6 h12' stroke='%230891b2' stroke-width='3' fill='none'/><text x='0' y='90' font-family='Inter, sans-serif' font-size='22' font-weight='700' fill='%23f8fafc'>Project Record</text><text x='0' y='120' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8'>Research Archive Placeholder</text></g></svg>",
  facility: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g2' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%233b82f6'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g2)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='50' fill='%23ffffff' fill-opacity='0.05' stroke='%233b82f6' stroke-width='2'/><path d='M-20 20 v-30 l20-10 l20 10 v30 z M-20 0 h40 M0-20 v40' stroke='%233b82f6' stroke-width='3' fill='none'/><text x='0' y='90' font-family='Inter, sans-serif' font-size='22' font-weight='700' fill='%23f8fafc'>Lab Facility</text><text x='0' y='120' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8'>Research Archive Placeholder</text></g></svg>",
  equipment: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g3' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%2314b8a6'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g3)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='50' fill='%23ffffff' fill-opacity='0.05' stroke='%2314b8a6' stroke-width='2'/><path d='M-15-15 l30 30 M15-15 l-30 30' stroke='%2314b8a6' stroke-width='4' stroke-linecap='round'/><circle cx='0' cy='0' r='12' fill='%230f172a' stroke='%2314b8a6' stroke-width='3'/><text x='0' y='90' font-family='Inter, sans-serif' font-size='22' font-weight='700' fill='%23f8fafc'>Equipment Asset</text><text x='0' y='120' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8'>Research Archive Placeholder</text></g></svg>",
  fieldActivity: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><defs><linearGradient id='g4' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%236366f1'/><stop offset='100%' stop-color='%230f172a'/></linearGradient></defs><rect width='100%' height='100%' fill='url(%23g4)'/><g transform='translate(400, 270)' text-anchor='middle'><circle cx='0' cy='0' r='50' fill='%23ffffff' fill-opacity='0.05' stroke='%236366f1' stroke-width='2'/><path d='M-20 10 c10-10 30-10 40 0 M-20-5 c10-10 30-10 40 0' stroke='%236366f1' stroke-width='3' fill='none' stroke-linecap='round'/><text x='0' y='90' font-family='Inter, sans-serif' font-size='22' font-weight='700' fill='%23f8fafc'>Field Deployment</text><text x='0' y='120' font-family='Inter, sans-serif' font-size='14' fill='%2394a3b8'>Research Archive Placeholder</text></g></svg>"
};
const PROJECTS_DATABASE = [
  // EXTERNAL FUNDED PROJECTS
  {
    id: "ext-1",
    type: "external",
    title: "Automated Identification and Characterization of Underwater Images in Deep Ocean",
    fundingAgency: "Ministry of Earth Sciences (MoES/PAMC/DOM)",
    amount: "Rs. 48.16 Lakhs",
    status: "Ongoing",
    duration: "2023-2026",
    pi: "Dr. K. Muthumeenakshi",
    copi: "Dr. S. Sakthivel Murugan, Dr. N. Padmapriya",
    team: ["M. Vimal Raj", "S. Sabareesan", "R. Sathiya Priya", "K. Muthu Akila"],
    publicationCount: 3,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "ext-2",
    type: "external",
    title: "Off-shore Excavation of Heritage rich submerged sites of Poompuhar and Mahabalipuram using Machine Learning",
    fundingAgency: "Department of Science and Technology (DST-SSTP)",
    amount: "Rs. 50.00 Lakhs",
    status: "Completed",
    duration: "2018-2021",
    pi: "Dr. S. Sakthivel Murugan",
    copi: "Dr. N. Padmapriya",
    team: ["M. Dhana Lakshmi (JRF)"],
    description: "Underwater exploration creates awareness and knowledge transformation on the lost rich heritage sites mentioned in our epics were not a myth. Here, the project focuses on exploration of the buried objects in Mahabalipuram and Poompuhar shoreline. In Mahabalipuram, It is believed that only one shore temple is in existence out of seven shore temples built. Tsunami struck in the year 2004 pulled back the water from shore. People then witnessed the presence of wall like structures in the ocean. Archaeological Survey of India(ASI) then conducted explorations which brought light to Huge wall structures and some of the small structures around 5-8m depth. Similarly the well-known Poompuhar which was highly rich in heritage and culture will also be excavated. Hence it is very important for us to preserve our identity and ancient heritage that is submerged in water today. Underwater Submersible vehicle can be used for survey purposes. These captured images are in degradation quality due to the underwater environment. Due to this, the image enhancement method such as Empirical Mode Decomposition (EMD) and Xtended Central Symmetric Local Binary Pattern (XCS-LBP), Visibility improvement technique with weighted filter are applied on submersible images to extract the texture feature. On Feature Extraction, Different keypoint detector and mapping algorithms are considered for the extraction of keypoints (features). It is observed that the Scale Invariant Feature Transform (SIFT) with Fast Library for Approximate Nearest Neighbor Search (FLANN) and RANdom Sample Consensus RANSAC have shown superior results. Underwater Image Classification system using deep learning can be developed to classify the submerged objects.",
    publicationCount: 20,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "ext-3",
    type: "external",
    title: "Implementation of Magnetic Induction based Underground Sensor Network for Smart Irrigation",
    fundingAgency: "Tamil Nadu State Council for Science & Technology (TNSCST)",
    amount: "Rs. 8.7 Lakhs",
    status: "Completed",
    duration: "2017-2020",
    pi: "Dr. S. Sakthivel Murugan",
    copi: "Dr. K. Muthumeenakshi",
    team: ["M. Vimal Raj", "S. Swathi"],
    description: "India is primarily an agriculture-based country and agriculture depends on monsoon. Recently due to climatic conditions monsoon has become uncertain which makes farmer opt for irrigation. This emphasizes farmers to efficiently utilize the scarcely available water for high yield. Hence, this project focuses on introducing a novel idea of using magnetic induction (MI) coils for underground (UG) communication to achieve efficient agricultural data transfer for smart irrigation. MI sensor system prototype including moisture sensor, temperature sensor, transceiver coils, microcontroller etc. for analyzing various agriculture parameters such as soil moisture, air humidity, temperature, soil nutrients. MI sensor system prototype was developed; agricultural data from different parts of the field is collected by MI communication and sent to user’s mobile app through cloud. IoT based app is developed for easy access of field sensor data in mobile. The real field is monitored and their data is recorded through Blynk app. Prototype was successfully tested at in-lab UG test bed and real time field by deploying various sensors at a distance of 1m. In future additional sensors pertaining to soil pH and nutrient content will be included.",
    publicationCount: 7,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "ext-4",
    type: "external",
    title: "Design & Hardware Implementation of Adaptive Algorithm for Wind Driven Ambient Noise in Shallow Water",
    fundingAgency: "National Institute of Ocean Technology (NIOT)",
    amount: "Rs. 20.64 Lakhs",
    status: "Completed",
    duration: "2010-2013",
    pi: "Dr. S. Radha",
    copi: "Dr. S. Sakthivel Murugan",
    description: "The contribution of this work is the development of signal enhancement for underwater channels against ambient noise. The methods adapted for the signal enhancement is the use of adaptive algorithms that have fast and stable convergence and implementation of the adaptive algorithms in hardware. The efficacy of the proposed techniques is verified with real time noise data, collected from the shallow region of the Bay of Bengal. A family of adaptive filtering algorithms is applied for noise reduction in an underwater environment. The Least Mean Square (LMS), Normalized LMS (NLMS) and Kalman based Normalized Least Mean Square (KLMS) adaptive algorithms are analyzed in terms of their performance, with the aid of performance measure characteristics such as Signal to Noise Ratio (SNR) and Mean Square Error (MSE). The analysis is carried out for source signals with a frequency range of 100 Hz to 10 KHz, and the algorithms are designed to reconstruct the source signals against the presence of ambient noise in this frequency range. Finally, the KLMS adaptive filtering algorithms are implemented in hardware for real time applications and the results are validated.",
    publicationCount: 0,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  // INTERNAL FUNDED PROJECTS
  {
    id: "int-1",
    type: "internal",
    title: "Design and Development of Indigenous Research based Inspection Class Remotely Operated Vehicle (ROV)",
    fundingAgency: "SSNCE Internal Funding",
    amount: "Rs. 9.5 Lakhs",
    status: "Completed",
    duration: "2018-2020",
    pi: "Dr. S. Sakthivel Murugan",
    copi: "Dr. K. Murugesan, Dr. R. Vimal Samsingh",
    team: [
      "Tejaswini Panati",
      "Vishal M",
      "Raksshitha N J",
      "Sai Deepika I",
      "Vigneshwar Veeravagu",
      "Hashmat Banday",
      "Anirudh Anand",
      "Karthik Raja Anandan",
      "Nivedhitha D",
      "Karthick D",
      "Harsha Thippa Ramesh",
      "Sandhya B"
    ],
    description: "The main objective of this project is to design and develop an Inspection-class Remotely Operated Vehicle (ROV) that can operate in ocean conditions for inspection and surveillance purpose, to create a repository of the images and inspection data collected underwater. Remotely Operated Vehicles (ROVs) are mobile robots, which find their advantage in various underwater applications like surveillance and inspection of head race tunnels, ocean floor exploration, search, and rescue operation. Team Starboard has successfully developed one such inspection class ROV named ORCA for primary application of inspection underwater, specifically, inspection of silt detection inside the head race tunnels. Orca is an open frame low-cost ROV, 500 x 350 x 210 cm in dimension and weighs 8 kgs , built using HDPE and is neutrally buoyant. To enclose the electronics a watertight acrylic enclosure with Aluminum end caps were used. It is mounted with Six Blue Robotics T200 thrusters where four thrusters were vectored at 45° helping in the horizontal motion along with two vertical thrusters to dive. The vehicle can surge, sway, dive, roll and head actively. A voltage of 14.8V from the battery has been stepped down to 5V by using a buck converter to power up the electronics and the sensors of the system. ORCA is equipped with a DS18B20 temperature sensor and DFRobot analog pressure sensor to study the temperature and pressure variations underwater respectively. The 9-axis Honeywell HG1120 IMU mounted on the electronic tray gives us the vehicle’s current acceleration, gyroscope and magnetometer readings along x, y and z axes respectively. A PID control system was implemented to minimize the positional errors and drift of the vehicle. MOOS-IvP, a robust software architecture predominantly used for autonomous operation has been incorporated into the system for precise navigation and control which enables shuffling between remote and autonomous modes of operation. A Blue Robotics Low Light HD USB camera is also mounted in the vehicle for live streaming and capture of images underwater. A detailed simulation analysis of the vehicle was carried to ensure that the vehicle was sturdy and intact to handle the challenging ocean conditions. Preliminary tests such as buoyancy test, leak test, and bench test were successfully carried, and the vehicle was deployed in a nearby pool and easily maneuvered.",
    publicationCount: 4,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "int-2",
    type: "internal",
    title: "Establishment of Underwater Acoustic Test Tank",
    fundingAgency: "SSNCE Internal Funding",
    amount: "Rs. 6.0 Lakhs",
    status: "Completed",
    duration: "Sanctioned Year: 2019",
    description: "The underwater acoustic research lab was established with an essential equipments in the field of underwater acoustic signal processing. The main objective of the project is to establish the Underwater test tank with dimensions of 5m length, 4 m diameter and 2.5 m depth (5x4x2.5) with total water capacity of 52000 litres approximately to test those equipments. This will help in undergoing various researches on coherence analysis study, ambient noise characteristics, animal bioacoustics, absorption and scattering loss pattern modeling and analysis, testing of underwater systems such as Remotely Operated Vehicle (ROV), Ambient noise measurement system, Buried Object Detection (BOD) etc.",
    publicationCount: 0,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "int-3",
    type: "internal",
    title: "Enhancement of Underwater Acoustic Research Lab",
    fundingAgency: "SSNCE Internal Funding",
    amount: "Rs. 3.4 Lakhs",
    status: "Completed",
    publicationCount: 0
  },
  {
    id: "int-4",
    type: "internal",
    title: "Data Collection for Characterisation of Underwater Ambient Noise at Bay of Bengal",
    fundingAgency: "SSNCE Internal Funding",
    amount: "Rs. 2.85 Lakhs",
    status: "Completed",
    publicationCount: 0
  },
  {
    id: "int-5",
    type: "internal",
    title: "Development of Underwater Acoustic Research Lab",
    fundingAgency: "SSNCE Internal Funding",
    amount: "Rs. 7.0 Lakhs",
    status: "Completed",
    publicationCount: 0
  },
  // STUDENT FUNDED PROJECTS
  {
    id: "stud-1",
    type: "student",
    title: "Enhancement and Restoration of blurred underwater images.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.28 Lakhs",
    role: "Project Supervisor",
    duration: "2023-2025",
    status: "Completed"
  },
  {
    id: "stud-2",
    type: "student",
    title: "Hybrid underwater energy harvesting system using ocean water and solar cell.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2023-2025",
    status: "Completed"
  },
  {
    id: "stud-3",
    type: "student",
    title: "Amphibious waterbody and beach cleaning BOT.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.28 Lakhs",
    role: "Project Supervisor",
    duration: "2023-2025",
    status: "Completed"
  },
  {
    id: "stud-4",
    type: "student",
    title: "Passive acoustic detector for monitoring of underwater mammals.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.30 Lakhs",
    role: "Project Supervisor",
    duration: "2022-2024",
    status: "Completed"
  },
  {
    id: "stud-5",
    type: "student",
    title: "Arming and automation of remotely operable vehicles (RoV).",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.29 Lakhs",
    role: "Project Supervisor",
    duration: "2022-2024",
    status: "Completed"
  },
  {
    id: "stud-6",
    type: "student",
    title: "Development of autonomous navigation suite for an underwater vehicle (UWV).",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.30 Lakhs",
    role: "Project Supervisor",
    duration: "2022-2023",
    status: "Completed"
  },
  {
    id: "stud-7",
    type: "student",
    title: "Experimental study of permanent magnet linear generator for underwater wave motion.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2020",
    status: "Completed"
  },
  {
    id: "stud-8",
    type: "student",
    title: "Design and testing of metamaterial enhanced magnetic induction based underground communication.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.24 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2020",
    status: "Completed"
  },
  {
    id: "stud-9",
    type: "student",
    title: "Enhancement of Underwater Images Using Image Restoration Techniques",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-10",
    type: "student",
    title: "Prototype Development of energy harvesting system using acoustic signals from Aircraft engines.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-11",
    type: "student",
    title: "Design and development of a Chassis for a remotely operated vehicle.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-12",
    type: "student",
    title: "Thrust control for an inspection class mini-ROV.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2020",
    status: "Completed"
  },
  {
    id: "stud-13",
    type: "student",
    title: "Prototype of position tracking in a remotely operated vehicle using sensors.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-14",
    type: "student",
    title: "Geo acoustic inversion study to classify the sediments and determine the sediment depth.",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2018-2019",
    status: "Completed"
  },
  {
    id: "stud-15",
    type: "student",
    title: "Prototype Implementation of IoT in underwater using Lifi Technology",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2017-2019",
    status: "Completed"
  },
  {
    id: "stud-16",
    type: "student",
    title: "Designing the stack arrangement of galvanic cell for energy harvesting in underwater",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.20 Lakhs",
    role: "Project Supervisor",
    duration: "2017-2018",
    status: "Completed"
  },
  {
    id: "stud-17",
    type: "student",
    title: "Development of Smart electricity energy management system for smart campus using IoT",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.22 Lakhs",
    role: "Project Supervisor",
    duration: "2017-2018",
    status: "Completed"
  },
  {
    id: "stud-18",
    type: "student",
    title: "Prototype development of energy harvesting system using sea water activated battery for underwater applications",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2017-2019",
    status: "Completed"
  },
  {
    id: "stud-19",
    type: "student",
    title: "Design and development of Insulation tester",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.18 Lakhs",
    role: "Project Supervisor",
    duration: "2016-2017",
    status: "Completed"
  },
  {
    id: "stud-20",
    type: "student",
    title: "Development of an energy harvesting microbial fuel cell system using marine sediment for underwater applications",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.30 Lakhs",
    role: "Project Supervisor",
    duration: "2014-2015",
    status: "Completed"
  },
  {
    id: "stud-21",
    type: "student",
    title: "Development of wind speed frequency distribution algorithm and its implementation with DSP based hardware for real time graphical representation",
    fundingAgency: "SSNCE",
    amount: "Rs. 0.25 Lakhs",
    role: "Project Supervisor",
    duration: "2014-2015",
    status: "Completed"
  },
  // PHD RESEARCH PROJECTS
  {
    id: "phd-1",
    type: "phd",
    scholar: "R. Sathya Priya",
    researchArea: "Automated Identification and Classification of Underwater Images",
    status: "Coursework Completed",
    publicationCount: 1,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-2",
    type: "phd",
    scholar: "M. Vimal Raj",
    researchArea: "Deblurring and Enhancement of Underwater Motion Blurred Images",
    status: "Thesis Submitted",
    description: "Exploration of Underwater Images will be a challenging task due to its degradations by haze, blur, color cast and noise. In order to extract the latent information from the blurred portion, its parameters are estimated and various algorithms were analyzed. Initially, length and angle of motion blurred image are estimated. Then, filters and restoration algorithms were implemented for controlling of ringing artifacts, removal of noise and latent information restoration. Some of the model based classical methods were implemented and analyzed for underwater motion blurred image restoration.",
    publicationCount: 6,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-3",
    type: "phd",
    scholar: "R. Logeshwaran",
    researchArea: "Optimization of Cluster-Based Routing Protocol for AUV Localization",
    status: "Thesis Submitted",
    description: "Underwater communication has turned into a prominent research region in deep-sea investigation, undersea navigation, and control of automated underwater vehicles (AUVs). Acoustic communication is the most liable and universally accepted method in underwater medium because of the low attenuation (signal reduction) of sound in water. The operation of underwater acoustic communication (UWAC) structure is rendered challenging by factors such as limited available bandwidth, long propagation delay, huge Doppler spread, time-varying channel conditions, salinity and diverse pressure conditions. The vital applications of Underwater Wireless Sensor Networks (UWSN) are underwater military surveillances and underwater research. The current progressions in innovation, the outline of sensor networks was reborn to a new era of monitoring the global physical entity. These design advancements cleared a path to the disclosure of new unopened insider secrets in the field of marine habitats, deep sea environments and ice sheets explorations. This research gives a proficient technique for packet transmission in a selective frequency to enhance the scope and network between the sensor AUV’s which are in observation under secluded ocean. Scientific model is utilized to portray the dynamic changes in the sea. The channel model has been established considering all the channel properties under the sea. The AUVs are connected to a cluster-based network and an efficient cluster-based routing protocol (CBRP) is used to convey the 3-D location of the AUVs. By selecting an optimum frequency for transmitting the routing packets, overall life time of the network is extended with least routing delay. CBRP Technique is utilised to limit the channel impairments as a result of its vigour against excessively restricted transmission capacity and recurrence reuse. The simulation results of the proposed algorithm show better connectivity and coverage between the surveillance AUVs and to communicate their location with one another.",
    publicationCount: 3,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-4",
    type: "phd",
    scholar: "K. Balaji",
    researchArea: "Blue-Green Spectral Channel Characterization and Analysis of Channel Losses for Underwater Optical Wireless Communication",
    status: "Thesis Submitted",
    description: "One third of Earth is covered with water. Earth is also called as blue planet. Communication in underwater faces a lot of challenges due to underwater environment. Some of the challenges include Transmitter and Receiver Configurations, Transmission Wavelength, Solar Background and Transmission Protocol. Communication is broadly classified into Wired and Wireless communication. The wired communication includes Coaxial cable, Optical fiber communication etc..,. The wireless communication includes RF communication, optical communication, Magnetic Induction, Acoustic Communication, etc..,. For Underwater Environment, Acoustic and optical communication are possible. Acoustic communication suffers due to lack of Speed, high latency, low data rate and less bandwidth. Optical communication in Underwater overcomes the above drawbacks and provides the better solution. For Implementing Optical Communication in Underwater Environment, we utilized Bio-Optical Model of underwater. Various channel Losses like Absorption, Scattering and Attenuation were analyzed in detail using optical in Underwater Communication. Suitable wavelength (λ=532 nm) for using optical in Underwater Communication was found using Bio-Optical Model of Underwater. It is concluded that Green light is suitable for Optical Communication in underwater Environment.",
    publicationCount: 6,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-5",
    type: "phd",
    scholar: "M. Somasekar",
    researchArea: "Analysis of Underwater Image Enhancement Techniques based on Contrast and Edge Preservation",
    status: "Completed",
    description: "The ocean possesses vast treasures of ancient submerged remains. The last two decades have witnessed numerable ventures of underwater ancient discoveries. The object detection methodology is most widely used to trace the submerged objects in terms of image that were captured from modern maritime Side Scan Sonar (SSS) device. The images are usually of low color contrast due to varying lighting conditions. Moreover, this leads to loss of object texture and hence difficult to retrieve an object present on SSS image. This prompts an enhancement preprocessing prior to feature extraction. A comparative analysis on the different enhancement techniques such as Histogram Equalization, Contrast Stretching, EMD with Optimal have been considered in enhancing the side scan sonar images and corresponding enhancement processing. Exploratory outcomes demonstrate that EMDW technique can acquire exact edge information and improved Visual Appearance. The Empirical Mode Decomposition with Optimal Weight (EMDW) picture upgrade procedure has been utilized to enhance the nature of sonar pictures. However, there is a scope in improvising the contrast and detailed analysis on the various contrast enhancement techniques are in progress. Some of the feature extraction methods investigated includes Support Vector Machine (SVM) and YOLO. These are prone to time consumption. This research is directed towards evolving an effective preprocessing technique for feature extraction using the above mentioned algorithms with updations and advancements on the same.",
    publicationCount: 6,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-6",
    type: "phd",
    scholar: "G. Annalakshmi",
    researchArea: "Feature Descriptors and Optimization Techniques for Classification of Coral Images",
    status: "Completed",
    description: "The marine environment covers approximately 70% of the earth’s surface. In general, the classification of sea bottom characteristics has become an essential tool for various applications including marine resource investigations, marine environmental monitoring, coastal engineering, geotechnical engineering and scientific research. The traditional means of sediment surveying by direct sampling cannot be used on a large scale, as it is a complex and time-consuming process. Hence, the automatic processing of images with its visual contents based on different features like colour, shape and texture. In this work a texture based feature extraction method is carried to categorize the different types of ocean bottom sediments. The local feature descriptor play a significant role in texture classification. However, in the traditional local binary pattern (LBP) method, image pixels are converted into a binary pattern based on the relationship between centre and neighbourhood pixels. Here, a novel feature extraction method named LNERBP (Local Neighbourhood Edge Responsive Binary Pattern) is introduced to extract and categorize the reliable texture features from images. Initially, the local intensity difference values of pixels are extracted based on a mutual relationship between odd and even pixel value of a 3x3 image patch. Further, the edge information is extracted using the local directional pattern (LDP) method from all images. The edge response of the image is obtained using a kirsch mask in all the eight directions. Then the encoding condition is applied to both the local intensity and the edge information to create a unique descriptor value. Finally, a new learning algorithm called GMJAYA-ELM combines the Gaussian mutated JAYA (GMJAYA) with an extreme learning machine (ELM) for texture classification. The GMJAYA is used to optimize the input weights and hidden biases of single-hidden-layer feed-forward neural networks (SLFN). The experimental results demonstrate that the proposed approach produces higher performance in terms of accuracy and sensitivity across different classes. The proposed algorithm is validated by comparing the results with traditional learning schemes such as PSO-ELM, GA-ELM, ABC-ELM, Birds fly-ELM, and JAYA-ELM, and the result indicates GMJAYA-ELM superiority.",
    publicationCount: 12,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-7",
    type: "phd",
    scholar: "S. Swathi",
    researchArea: "Enhancement of Magnetic Induction System using Planar Spiral Coils for Underground Communication",
    status: "Completed",
    description: "Earlier researches have proved that magnetic induction (MI) communication has a better performance compared to the electromagnetic (EM) wave propagation in underground (UG) medium as it provides low signal attenuation using small MI coils. In general, non-planar coils are employed as transceivers in the MI UG communication and their performance is dependent on coil parameters. The disadvantages of non-planar coils are their bulkiness and limited transmission distance. A novel idea of using compact filamentary planar spiral coils for MI UG communication is proposed to achieve higher received power at a greater transmission distance. An enhanced MI channel model is also proposed to study the medium's influence on MI performance accurately by considering different soil characteristics. Performances of circular and square coils in the MI system are evaluated based on mutual inductance, path-loss, received power, and signal-to-noise ratio. The performance comparison suggests that the filamentary planar spiral square coil achieves 9.22% higher received power than the filamentary planar spiral circular coil. Moreover, the lateral and angular misalignment study shows that square coils are more tolerant to misalignments. For the proposed filamentary planar square spiral coil (FPSSC), the influence of coil parameters, channel parameters, and coil misalignment on the received power was carried out and its least sensitive and most sensitive parameters were identified for further optimization. The performance comparison between the proposed FPSSC and the traditional non-planar MI coil system suggests that the received power of the proposed system is improved by around 47- 49dBm thus extending the achievable transmission distance.",
    publicationCount: 7,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-8",
    type: "phd",
    scholar: "S. Mary Cecilia",
    researchArea: "Dehazing Algorithms for Visibility Improvement of Degraded Single Underwater Images",
    status: "Completed",
    description: "Underwater Images are of degraded quality due to the scattering and absorption. The color cast and turbidity that hinder the visibility of such images are due to the sediments present that vary for diverse environments. Shallow water images are very turbid. The images too suffer from negative effects of artificial illumination when capturing data. Here a two-step approach is formulated to restore and enhance the underwater images from different locations. The images are then blended using a wavelet fusion considering the mean of the images. The output images demonstrate reduced haze, improved contrast and enhanced sharpness with adequate removal of the color cast. The results project better visibility on both subjective and objective measures compared to recent restoration and enhancement methods.",
    publicationCount: 5,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  },
  {
    id: "phd-9",
    type: "phd",
    scholar: "M. Dhana Lakshmi",
    researchArea: "Enhancement and Classification of Underwater species images using Transfer Learning Neural Network",
    status: "Completed",
    description: "Underwater navigation and intelligent object recognition require robust machine learning algorithms to operate in turbid water. Modern life created the man-made pollution in oceans, rivers, and lakes, which contaminate our water resources. The underwater vehicle can be used for survey purposes. Submersible captured images are in degradation quality due to the underwater environment. To overcome this, Enhancement experimental analyses are carried out for both Image Formation Model (IFM) - free and IFM-based techniques. It is observed that proposed visibility improvement techniques have shown overwhelming qualitative observation. For the classification of submerged objects in the captured imagery, the Convolutional neural Network (ConvNet) is trained. Finally, the feature map size is condensed and complex features are extracted and passed into a neural network. The output of the network results in a probability distribution over L classes. Stochastic gradient descent with ADAM optimizer is used to square the gradients in order to scale the learning rate and reduces the difference between the actual and predicted classes. It is found that the proposed ConvNet underwater image recognition detector, achieves good accuracy than the existing multiclass detector.",
    publicationCount: 10,
    thumbnail: PLACEHOLDER_IMAGES.project,
    images: [PLACEHOLDER_IMAGES.project]
  }
];
const EQUIPMENT_DATABASE = [
  // Underwater Platforms
  {
    id: "eq-1",
    name: "ROVITO-4 ROV",
    category: "underwater-platforms",
    thumbnail: PLACEHOLDER_IMAGES.equipment,
    images: [PLACEHOLDER_IMAGES.equipment]
  },
  {
    id: "eq-2",
    name: "ORCA Remotely Operated Vehicle (ROV)",
    category: "underwater-platforms",
    specs: [
      { label: "Dimensions", value: "500 x 350 x 210 cm" },
      { label: "Weight", value: "8 kg" },
      { label: "Material", value: "High-density Polyethylene (HDPE) frame" },
      { label: "Propulsion", value: "6 Blue Robotics T200 thrusters (4 vectored, 2 vertical)" },
      { label: "Payload Camera", value: "Blue Robotics Low Light HD USB Camera" },
      { label: "Enclosure", value: "Acrylic pressure cylinder with aluminum end caps" },
      { label: "Sensors", value: "Honeywell HG1120 9-axis IMU, DS18B20 Temp, DFRobot pressure" }
    ],
    purpose: "Remotely Operated Vehicle designed for inspection of head race tunnels, ocean floor exploration, search, and rescue operations.",
    url: "https://sites.google.com/prod/view/uwarlssn/rd/consortium?authuser=0",
    thumbnail: PLACEHOLDER_IMAGES.equipment,
    images: [PLACEHOLDER_IMAGES.equipment]
  },
  {
    id: "eq-3",
    name: "SOFAR Trident - Underwater Drone",
    category: "underwater-platforms",
    url: "https://www.sofarocean.com/products/trident"
  },
  {
    id: "eq-4",
    name: "Trident Controller",
    category: "underwater-platforms",
    url: "https://www.sofarocean.com/products/trident"
  },
  {
    id: "eq-5",
    name: "100m Tether & Reel",
    category: "underwater-platforms",
    url: "https://www.sofarocean.com/products/trident"
  },
  // Acoustic & Survey Systems
  {
    id: "eq-6",
    name: "Side Scan Sonar (SSS)",
    category: "acoustic-systems",
    url: "http://www.cmaxsonar.com/towfish.html",
    thumbnail: PLACEHOLDER_IMAGES.equipment,
    images: [PLACEHOLDER_IMAGES.equipment]
  },
  {
    id: "eq-7",
    name: "Sonar Transceiver (STR)",
    category: "acoustic-systems",
    url: "http://www.cmaxsonar.com/acquisition.html"
  },
  {
    id: "eq-8",
    name: "Sound Velocity Profiler (SVP)",
    category: "acoustic-systems",
    url: "https://www.valeport.co.uk/products/swift-svp/"
  },
  {
    id: "eq-9",
    name: "Hydrophone 6 Array - Acoustic Receiver",
    category: "acoustic-systems",
    specs: [
      { label: "Manufacturer", value: "CEDICOM Electronics" },
      { label: "Frequency Range", value: "50 Hz - 10 kHz" },
      { label: "Operating Depth", value: "200 m" }
    ]
  },
  {
    id: "eq-10",
    name: "Acoustic Transmitter",
    category: "acoustic-systems",
    specs: [
      { label: "Manufacturer", value: "CEDICOM Electronics" },
      { label: "Frequency Range", value: "50 Hz - 25 kHz" },
      { label: "Operating Depth", value: "100 m" }
    ]
  },
  // Sensors & Communication Systems
  {
    id: "eq-11",
    name: "MEMS Inertial Measurement Unit (IMU)",
    category: "sensors-comm",
    specs: [
      { label: "Manufacturer", value: "Honeywell HG1120" }
    ],
    url: "https://aerospace.honeywell.com/en/learn/products/sensors/hg1120-mems-inertial-measurement-unit"
  },
  {
    id: "eq-12",
    name: "Data Acquisition System (DAS)",
    category: "sensors-comm",
    specs: [
      { label: "Manufacturer", value: "Measurement Computing USB-1608FS-Plus" }
    ],
    url: "https://www.mccdaq.com/usb-data-acquisition/USB-1608FS-Plus-Series"
  },
  {
    id: "eq-13",
    name: "Onboard Underwater Camera",
    category: "sensors-comm",
    specs: [
      { label: "Display", value: "7-inch LCD Monitor" },
      { label: "Resolution", value: "1000 TVL" },
      { label: "Illumination", value: "12pcs IR Infrared LEDs" },
      { label: "Cable", value: "15m Waterproof coaxial" }
    ],
    url: "https://www.eyoyousa.com/eyoyo-ice-fishing-camera-7-inch-lcd-monitor-1000tvl-camera-15m-cable-12pcs-ir-infrared-leds-p00139p1.html"
  },
  {
    id: "eq-14",
    name: "GoPro Underwater Camera",
    category: "sensors-comm",
    specs: [
      { label: "Model", value: "GoPro Hero 12 Black" }
    ],
    url: "https://gopro.com/en/in/shop/cameras/hero12-black/CHDHX-121-master.html"
  },
  {
    id: "eq-15",
    name: "Endoscope Underwater Camera",
    category: "sensors-comm",
    specs: [
      { label: "Model", value: "IWOBAC Inspection Camera" },
      { label: "Resolution", value: "2.0 Megapixels" }
    ],
    url: "https://www.amazon.com/IWOBAC-Inspection-Waterproof-Semi-Rigid-Megapixels/dp/B07YCB6DS2"
  },
  {
    id: "eq-16",
    name: "Handheld Salinity Refractometer",
    category: "sensors-comm",
    url: "https://www.pce-instruments.com/english/measuring-instruments/test-meters/refractometer-pce-instruments-handheld-refractometer-pce-0100-salinity-det_54316.htm"
  },
  {
    id: "eq-17",
    name: "Soil Moisture Sensors",
    category: "sensors-comm",
    url: "https://www.xcluma.com/soil-moisture-meter-testing-module"
  },
  // Test Facilities
  {
    id: "eq-18",
    name: "Underwater Test Tank I",
    category: "test-facilities",
    specs: [
      { label: "Dimensions", value: "12' L x 8' W x 4' H" },
      { label: "Capacity", value: "10,874 Liters" }
    ],
    thumbnail: PLACEHOLDER_IMAGES.equipment,
    images: [PLACEHOLDER_IMAGES.equipment]
  },
  {
    id: "eq-19",
    name: "Underwater Test Tank II",
    category: "test-facilities",
    specs: [
      { label: "Dimensions", value: "125cm x 78cm x 65 cm" },
      { label: "Capacity", value: "633.75 Liters" }
    ]
  },
  {
    id: "eq-20",
    name: "Underground Test Bed",
    category: "test-facilities",
    specs: [
      { label: "Dimensions", value: "225cm x 30cm x 30 cm" },
      { label: "Volume", value: "202,500 Cubic cm" }
    ]
  },
  // Field Equipment
  {
    id: "eq-21",
    name: "Portable Winch System",
    category: "field-equipment",
    url: "http://www.cmaxsonar.com/cables.html"
  },
  {
    id: "eq-22",
    name: "Manual Hand Winch",
    category: "field-equipment"
  },
  {
    id: "eq-23",
    name: "Water Sampler",
    category: "field-equipment"
  },
  {
    id: "eq-24",
    name: "Grab Collector",
    category: "field-equipment"
  },
  {
    id: "eq-25",
    name: "Ahuja Power Amplifier",
    category: "field-equipment",
    specs: [
      { label: "Model", value: "Ahuja SSB-120" }
    ],
    url: "https://www.ahujaradios.com/mixer-amplifiers/medium-wattage-pa-mixer-amplifiers/ssb-120supsup.html"
  },
  {
    id: "eq-26",
    name: "Scientific Dual Power Supply",
    category: "field-equipment",
    specs: [
      { label: "Model", value: "PSD3203 (30V, 3A)" }
    ],
    url: "https://www.scientificindia.com/products/PSD3203-30V-3-A-Dual-Power-Supply.aspx"
  },
  {
    id: "eq-27",
    name: "Portable UPS Units",
    category: "field-equipment"
  },
  {
    id: "eq-28",
    name: "Mooring Floats",
    category: "field-equipment"
  },
  {
    id: "eq-29",
    name: "Life Jackets",
    category: "field-equipment"
  }
];
const FIELD_ACTIVITIES_DATABASE = [
  // 2025
  {
    id: "fa-1",
    title: "Coral Reef Survey - Off Akalmadam",
    year: 2025,
    location: "Off-Akalmadam, Rameswaram",
    date: "10-12 August 2025",
    equipmentTags: ["ROVITO-4 ROV", "Onboard Camera"],
    activityType: "Survey",
    team: ["Dr. M. Vimal Raj", "Mr. S. Sabareesan", "Mrs. Manosundari"],
    description: "Collected underwater coral reef data using the ROVITO-4 ROV camera at the data collection spot Off-Akalmadam, Rameswaram, during the field surveys conducted from 10–12 August 2025.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-2",
    title: "Coral Reef Survey - Off Sippikulam",
    year: 2025,
    location: "Off-Sippikulam, Tuticorin",
    date: "15-16 March 2025",
    equipmentTags: ["ROVITO-4 ROV", "Onboard Camera"],
    activityType: "Survey",
    team: ["Dr. S. Sakthivel Murugan", "Dr. K. Muthumeenakshi", "Mr. M. Vimal Raj", "Mr. Sabareesan", "Dr. Saravanan R", "Mr. Sreenivasan"],
    description: "Collected underwater data using ROVITO-4 ROV and captured the coral reefs data along the coastal area of Off-sippikulam at Tuticorin, from 15th- 16th March 2025.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-3",
    title: "ROV Testing - Kalpakkam",
    year: 2025,
    location: "Off-Kalpakkam",
    date: "8 March 2025",
    equipmentTags: ["ROVITO-4 ROV"],
    activityType: "ROV Testing",
    team: ["Mr. M. Vimal Raj"],
    description: "Tested ROVITO-4 ROV along the coastal area of Off-Kalpakkam on 8th March 2025.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  // 2023
  {
    id: "fa-4",
    title: "Sea-bed Mapping Survey - Mahabalipuram",
    year: 2023,
    location: "Off-Mahabalipuram",
    date: "10-13 May 2023",
    equipmentTags: ["Side Scan Sonar (SSS)", "ORV Sagar Manjusha"],
    activityType: "Ocean Expedition",
    team: ["Dr. S. Sakthivel Murugan", "M. Vimal Raj", "Sairithvik", "Rahul"],
    description: "Collected underwater data using Side Scan Sonar (SSS), which captures the structure of the sea-bed using the towfish connected with ORV Sagar Manjusha from Ministry of Earth Sciences for sea bed mapping along the coastal area of Off-Mahabalipuram, from 10th May- 13th May. 2023.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  // 2022
  {
    id: "fa-5",
    title: "Side Scan Sonar Testing",
    year: 2022,
    location: "SSN Well & UWARL Test Tank",
    date: "21 & 25 March 2022",
    equipmentTags: ["Side Scan Sonar (SSS)"],
    activityType: "Laboratory Validation",
    team: ["Dr. S. Sakthivel Murugan", "Mr. M. Vimal Raj", "Ms. S. Mary Cecilia", "Ms. G. Annalakshmi", "Ms. M. Dhana Lakshmi", "Ms. S. Swathi"],
    description: "Tested the Side Scan Sonar at SSN Well on 25th March 2022, and deployed the Side Scan Sonar at UWARL Test Tank on 21st March 2022.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-6",
    title: "Underwater Drone Deployment - Kasimedu",
    year: 2022,
    location: "Kasimedu Fishing Harbour",
    date: "10 March 2022",
    equipmentTags: ["Underwater Drone", "GoPro Camera"],
    activityType: "Sea Trial",
    team: ["Mr. M. Vimal Raj", "Ms. M. Dhana Lakshmi", "Mr. Ramnath", "Scuba Divers"],
    description: "Deployed the Underwater Drone with GoPro Underwater Camera at Kasimedu Fishing harbour (lat. 13° 13'N and long. 80° 30'E) on 10th March 2022.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  // 2020-2021
  {
    id: "fa-7",
    title: "Underwater Drone Deployment - Various Locations",
    year: "2020-2021",
    location: "Chengalpattu Lake, Aquaculture Tank",
    date: "Dec 2020 - Aug 2021",
    equipmentTags: ["Underwater Drone", "GoPro Camera"],
    activityType: "Data Collection",
    team: ["Dr. S. Sakthivel Murugan", "Mr. M. Vimal Raj", "Ms. S. Mary Cecilia", "Mr. M. Somasekar", "Mr. R. Logeshwaran", "Mr. K. Balaji", "Ms. M. Dhana Lakshmi"],
    description: "Deployed the Underwater Drone at various locations between Dec 2020 and Aug 2021. On 14th August 2021, captured underwater images near Chengalpattu lake at 12.71° N 79.98° E. On 9th Dec 2020 and 2nd Aug 2021, the drone was deployed on aquaculture tank at 12.81° N 80.24° E.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-8",
    title: "Testing of Underwater Drone",
    year: "2020-2021",
    location: "SSN Fountain",
    date: "28 November 2020",
    equipmentTags: ["Underwater Drone"],
    activityType: "Laboratory Validation",
    team: ["Dr. S. Sakthivel Murugan", "Mr. M. Vimal Raj", "Ms. S. Mary Cecilia", "Ms. M. Dhana Lakshmi"],
    description: "Tested the Underwater Drone at SSN Fountain on 28th Nov. 2020.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-9",
    title: "Primary Qualitative Optical Data Collection",
    year: "2020-2021",
    location: "Kovalam Backwaters",
    date: "5 March 2020",
    equipmentTags: ["GoPro Camera", "Endoscope Camera"],
    activityType: "Data Collection",
    team: ["M. Vimal Raj", "S. Mary Cecilia", "Sukanthi Kannan"],
    description: "Endeavored to get underwater images from the backwaters near Kovalam (lat. 12° 46'N and long. 80° 18'E). The devices used are GoPro for capturing videos, endoscope camera, and a laptop for on board monitoring.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-10",
    title: "Underwater Image Collection",
    year: "2020-2021",
    location: "Lake at 13.1079° N, 80.1059° E",
    date: "6 March 2020",
    equipmentTags: ["GoPro Camera"],
    activityType: "Data Collection",
    team: ["M. Vimal Raj", "G. Annalakshmi", "S. Mary Cecilia"],
    description: "Strived to capture underwater images from a lake at 13.1079° N lat and 80.1059° E long.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  // 2019
  {
    id: "fa-11",
    title: "On-Shore Data Collection - Mahabalipuram",
    year: 2019,
    location: "Shore Temple, Pancha Rathas & Arjuna's Penance",
    date: "28 November 2019",
    equipmentTags: ["Nikon Coolpix", "Nikon D5200"],
    activityType: "Data Collection",
    team: ["G. Annalakshmi", "M. Vimal Raj", "M. Dhana Lakshmi", "S. Mary Cecilia"],
    description: "A team of Image Processing research scholars undertook a data collection expedition to Mahabalipuram to collect the images of the ancient structures at Shore Temple, Pancha Rathas and Arjuna’s Penance on the 28th of November 2019. The videos and images were captured with a view to study the structures and textures of the monuments.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  {
    id: "fa-12",
    title: "Testing of ROV - Pondicherry",
    year: 2019,
    location: "Pondicherry Coastal area",
    date: "10 April 2019",
    equipmentTags: ["ORCA ROV"],
    activityType: "Sea Trial",
    team: ["Dr. S. Sakthivel Murugan", "Vigneshwar Veeravagu"],
    description: "Took part in the testing of ROV arranged by Hexiqon Technologies at Pondicherry on 10th Apr. 2019.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  // 2018
  {
    id: "fa-13",
    title: "MBES Survey Campaign",
    year: 2018,
    location: "Off-Chennai, Off-Mettukuppam, Off-Mahabalipuram, Off-Kalpakkam",
    date: "29 Aug - 2 Sep 2018",
    equipmentTags: ["Multi-Beam Echo Sounder (MBES)", "ORV Sagar Manjusha"],
    activityType: "Ocean Expedition",
    team: ["Dr. S. Sakthivel Murugan", "R. Logeswaran", "M. Somasekar", "M. Vimal Raj", "S. Swathi", "M. Dhana Lakshmi", "B. Arunkumar"],
    description: "Collected underwater data using Multi-Beam Echo Sounder (MBES) which captures the structure of the sea-bed mounted at the bottom of ORV Sagar Manjusha from Ministry of Earth Sciences for various studies along the coastal areas of Off-Chennai, Off-Mettukuppam, Off-Mahabalipuram, Off-Kalpakkam from 29th Aug - 2nd Sep. 2018.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  // 2017
  {
    id: "fa-14",
    title: "Sagar Purvi Expedition",
    year: 2017,
    location: "Off-Chennai, Off-Mahabalipuram, Off-Kalpakkam, Off-Pondicherry, Off-Cuddalore, Off-Poompuhar",
    date: "6-8 August 2017",
    equipmentTags: ["Hydrophone Array", "CTD", "Grab Collector", "Water Sampler", "Sagar Purvi ship"],
    activityType: "Ocean Expedition",
    team: ["Dr. S. Sakthivel Murugan", "G. Annalakshmi", "R. Logeswaran", "M. Somasekar", "Sneha"],
    description: "Collected underwater data along with NIOT using the ship Sagar Purvi from Ministry of Earth Sciences for various studies along the coastal areas from 6th – 8th Aug. 2017. Deployed six-channel hydrophone array, CTD, grab collector and water sampler.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  },
  // Undated
  {
    id: "fa-15",
    title: "Ambient Noise Data Collection",
    year: "Undated",
    location: "Offshore Chennai Coast",
    date: "Estuary Trial Run",
    equipmentTags: ["Hydrophone Array", "Acoustic Transmitter", "DAS"],
    activityType: "Data Collection",
    description: "A set of ambient noise data was collected at off shores, Chennai using the vertical linear array of hydrophones deployed at various locations at 15 m depth. The data were collected at a wind speed of 2m/s to 7m/s.",
    thumbnail: PLACEHOLDER_IMAGES.fieldActivity,
    images: [PLACEHOLDER_IMAGES.fieldActivity]
  }
];
const seedData = /* @__PURE__ */ JSON.parse(`[{"id":"award-0001","type":"award","title":"Best Teacher Award (Academic Year 2023-2024)","date":"2024","organization":"SSN College of Engineering","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: SSN College of Engineering. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[],"showcaseImage":"/images/faculty_award.png","showInGallery":true,"showcaseCategory":"faculty","showcasePriority":1},{"id":"award-0002","type":"award","title":"Academic & Administrative Auditor","date":"2024","organization":"Sairam Engineering College","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: Sairam Engineering College. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0003","type":"award","title":"Best Teacher Award (Academic Year 2021-2022)","date":"2022","organization":"SSN College of Engineering","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: SSN College of Engineering. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0004","type":"award","title":"Best Teacher Award (Academic Year 2018-2019)","date":"2019","organization":"SSN College of Engineering","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: SSN College of Engineering. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0005","type":"award","title":"Best Faculty Award","date":"2019","organization":"Cognizant","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: Cognizant. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0006","type":"award","title":"Best Teacher Award","date":"2018","organization":"Redington Foundation","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: Redington Foundation. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0007","type":"award","title":"Best Poster Award","date":"2016","organization":"4th International Conference on Oceanography and Marine Biology","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: 4th International Conference on Oceanography and Marine Biology. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0008","type":"award","title":"Young Researcher Award","date":"2015","organization":"Venus International Foundation","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: Venus International Foundation. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0009","type":"award","title":"Best Paper Award","date":"2015","organization":"IEEE INDICON 2015","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: IEEE INDICON 2015. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0010","type":"award","title":"Best Paper Award","date":"2015","organization":"ISTE Regional Conference","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: ISTE Regional Conference. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0011","type":"award","title":"Best Oral Presenter Award","date":"2014","organization":"ICCSN 2014, Singapore","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: ICCSN 2014, Singapore. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0012","type":"award","title":"Best Paper Award","date":"2014","organization":"Springer ICAEES 2014","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: Springer ICAEES 2014. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0013","type":"award","title":"Best Teacher Award (Academic Year 2010-2011)","date":"2011","organization":"SSN College of Engineering","recipient":"Dr.S. Sakthivel Murugan","summary":"Awarded by: SSN College of Engineering. Recipient: Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0014","type":"award","title":"Best Paper Award","date":"2025","organization":"ICAIO 2025","recipient":"Sathya Priya R., Muthumeenakshi K., Dr.S. Sakthivel Murugan","summary":"Awarded by: ICAIO 2025. Recipient: Sathya Priya R., Muthumeenakshi K., Dr.S. Sakthivel Murugan .","tags":[],"attachments":[]},{"id":"award-0015","type":"award","title":"Smart India Hackathon Winner","date":"2022","organization":"Smart India Hackathon","recipient":"Team KYOGRE","summary":"Awarded by: Smart India Hackathon. Recipient: Team KYOGRE.","tags":[],"attachments":[]},{"id":"award-0016","type":"award","title":"UG Student Video Competition","date":"2021","organization":"IEEE Region 10","recipient":"Ms. Nivedhitha, Mr. Karthick","summary":"Awarded by: IEEE Region 10. Recipient: Ms. Nivedhitha, Mr. Karthick.","tags":[],"attachments":[]},{"id":"award-0017","type":"award","title":"Best Paper Award","date":"2021","organization":"ICITSD 2021","recipient":"Mary Cecilia S.","summary":"Awarded by: ICITSD 2021. Recipient: Mary Cecilia S..","tags":[],"attachments":[]},{"id":"award-0018","type":"award","title":"Best Paper Award","date":"2020","organization":"NCICT 2020","recipient":"Sukanthi Kannan","summary":"Awarded by: NCICT 2020. Recipient: Sukanthi Kannan.","tags":[],"attachments":[]},{"id":"award-0019","type":"award","title":"Best Paper Award","date":"2020","organization":"NCICT 2020","recipient":"Mubeena Parveen","summary":"Awarded by: NCICT 2020. Recipient: Mubeena Parveen.","tags":[],"attachments":[]},{"id":"award-0020","type":"award","title":"Best Oral Presenter Award","date":"2020","organization":"CESS-GS, IIT Kharagpur","recipient":"K. Balaji","summary":"Awarded by: CESS-GS, IIT Kharagpur. Recipient: K. Balaji.","tags":[],"attachments":[]},{"id":"award-0021","type":"award","title":"Best Oral Presenter Award","date":"2020","organization":"CESS-GS, IIT Kharagpur","recipient":"M. Vimalraj","summary":"Awarded by: CESS-GS, IIT Kharagpur. Recipient: M. Vimalraj.","tags":[],"attachments":[]},{"id":"award-0022","type":"award","title":"Best Paper Award","date":"2019","organization":"SYMPOL 2019","recipient":"S. Mary Cecilia","summary":"Awarded by: SYMPOL 2019. Recipient: S. Mary Cecilia.","tags":[],"attachments":[]},{"id":"award-0023","type":"award","title":"Best Participant Award","date":"2019","organization":"IIITDM Workshop","recipient":"G. Annalakshmi","summary":"Awarded by: IIITDM Workshop. Recipient: G. Annalakshmi.","tags":[],"attachments":[]},{"id":"award-0024","type":"award","title":"Best Paper Award","date":"2017","organization":"ICETSE 2017","recipient":"S. Swathi","summary":"Awarded by: ICETSE 2017. Recipient: S. Swathi.","tags":[],"attachments":[]},{"id":"award-0025","type":"award","title":"Best Paper Award","date":"2017","organization":"ICETSE 2017","recipient":"Hasthi Gowthami","summary":"Awarded by: ICETSE 2017. Recipient: Hasthi Gowthami.","tags":[],"attachments":[]},{"id":"award-0026","type":"award","title":"Best Poster Presentation Award","date":"2016","organization":"IISF 2016","recipient":"S. Swathi","summary":"Awarded by: IISF 2016. Recipient: S. Swathi.","tags":[],"attachments":[],"showcaseImage":"/images/student_award.png","showInGallery":true,"showcaseCategory":"student","showcasePriority":1},{"id":"talk-0001","type":"talk","title":"Underwater Sensors and Its Applications","subtitle":"(Keynote Speaker) ASIANComNet 2024","date":"2024-10-26","organization":"ASIANComNet","place":"Thailand","summary":"Venue (original): ASIANComNet 2024. Location: Bangkok.","tags":[],"attachments":[]},{"id":"talk-0002","type":"talk","title":"Session Chair in ASIANComNet 2024","subtitle":"ASIANComNet 2024","date":"2024-10-26","organization":"ASIANComNet","place":"Thailand","summary":"Venue (original): ASIANComNet 2024. Location: Bangkok.","tags":[],"attachments":[]},{"id":"talk-0003","type":"talk","title":"Underwater Sensors - Active/passive and its application in Ocean FDP on AI/ML and IOT Applications","subtitle":"","date":"2025-03-19","organization":"VIT Vellore","place":"Vellore","summary":"Venue (original): VIT Vellore. Location: Vellore.","tags":[],"attachments":[]},{"id":"talk-0004","type":"talk","title":"Underwater Signal and Image Processing","subtitle":"GREENCON 2025","date":"2025-03-20","organization":"VIT Chennai","place":"Chennai","summary":"Venue (original): VIT Chennai. Location: Chennai.","tags":[],"attachments":[]},{"id":"talk-0005","type":"talk","title":"Underwater ROV","subtitle":"(Keynote Address) ICEST 2025","date":"2025-09-24","organization":"ICEST 2025","place":"Indonesia","summary":"Venue (original): ICEST 2025. Location: Bali.","tags":[],"attachments":[]},{"id":"talk-0006","type":"talk","title":"State of Underwater Autonomy in India","subtitle":"(Inauguration & Keynote) Workshop on Autonomous Underwater Vehicles","date":"2025-09-22","organization":"SRM University","place":"Chennai","summary":"Venue (original): SRM University. Location: Chennai.","tags":[],"attachments":[]},{"id":"talk-0007","type":"talk","title":"Underwater Wireless Communication","subtitle":"National Seminar on \\"The Rise of Blue Finance\\"","date":"2025-09-11","organization":"SRM University","place":"Chennai","summary":"Venue (original): SRM University. Location: Chennai.","tags":[],"attachments":[]},{"id":"talk-0008","type":"talk","title":"Effective Proposal Drafting for Easy Funding Opportunity","subtitle":"Workshop on Research Proposal Writing","date":"2025-12-01","organization":"Kongu Engineering College","place":"Erode","summary":"Venue (original): Kongu Engineering College. Location: Erode.","tags":[],"attachments":[]},{"id":"talk-0009","type":"talk","title":"Role of EEE in Underwater","subtitle":"Invited Talk","date":"2026-01-29","organization":"St. Joseph's College of Engineering","place":"Chennai","summary":"Venue (original): St. Joseph's College of Engineering. Location: Chennai.","tags":[],"attachments":[]},{"id":"talk-0010","type":"talk","title":"Satellite and Fiber Optical Communication","subtitle":"Invited Talk","date":"2013-09-06","organization":"Velammal Engineering College","place":"Chennai","summary":"Venue (original): Velammal Engineering College. Location: Chennai.","tags":[],"attachments":[]},{"id":"talk-0011","type":"talk","title":"Modern Communication Techniques and Their Applications","subtitle":"Invited Talk","date":"2014-02-27","organization":"Mahendra Engineering College","place":"Namakkal","summary":"Venue (original): Mahendra Engineering College. Location: Namakkal.","tags":[],"attachments":[]},{"id":"talk-0012","type":"talk","title":"Satellite Communication","subtitle":"Invited Talk","date":"2014-09-30","organization":"Velammal Engineering College","place":"Chennai","summary":"Venue (original): Velammal Engineering College. Location: Chennai.","tags":[],"attachments":[]},{"id":"talk-0013","type":"talk","title":"Underwater Sensors","subtitle":"Invited Talk","date":"2018-06-27","organization":"Sri Krishna College of Engineering","place":"Coimbatore","summary":"Venue (original): Sri Krishna College of Engineering. Location: Coimbatore.","tags":[],"attachments":[]},{"id":"talk-0014","type":"talk","title":"Spread Spectrum and Multiple Access Techniques","subtitle":"Invited Talk","date":"2019-08-22","organization":"Velammal Engineering College","place":"Chennai","summary":"Venue (original): Velammal Engineering College. Location: Chennai.","tags":[],"attachments":[]},{"id":"talk-0015","type":"talk","title":"Underwater Object Detection","subtitle":"AICTE Sponsored Online STTP","date":"2020-12-19","organization":"Online","place":"Online","summary":"Venue (original): Online. Location: Online.","tags":[],"attachments":[]},{"id":"talk-0016","type":"talk","title":"Issues and Challenges in Underwater Acoustic Communication","subtitle":"DRDO-Sponsored Seminar","date":"2011-09-09","organization":"National Engineering College","place":"Kovilpatti","summary":"Venue (original): National Engineering College. Location: Kovilpatti.","tags":[],"attachments":[]},{"id":"talk-0017","type":"talk","title":"Handled Classes for Govt. Higher Secondary School Teachers","subtitle":"HSC Teachers Orientation Programme","date":"2012-07-27","organization":"SSN College of Engineering","place":"Chennai","summary":"Venue (original): SSN College of Engineering. Location: Chennai.","tags":[],"attachments":[]},{"id":"talk-0018","type":"talk","title":"Intro to Communication System & Industry Expectations","subtitle":"Invited Lecture","date":"2017-07-24","organization":"Mahendra Engineering College","place":"Namakkal","summary":"Venue (original): Mahendra Engineering College. Location: Namakkal.","tags":[],"attachments":[]},{"id":"talk-0019","type":"talk","title":"Underwater Sensors FDP \\"Sensor Technologies\\"","subtitle":"","date":"2020-09-24","organization":"NIE","place":"Mysuru","summary":"Venue (original): NIE. Location: Mysuru.","tags":[],"attachments":[]},{"id":"talk-0020","type":"talk","title":"Challenges in Underwater Data Collection","subtitle":"Invited Lecture","date":"2021-09-29","organization":"K S School of Engineering","place":"Bengaluru","summary":"Venue (original): K S School of Engineering. Location: Bengaluru.","tags":[],"attachments":[]},{"id":"talk-0021","type":"talk","title":"Underwater Communication ATAL","subtitle":"Online FDP","date":"2021-12-06","organization":"Mahendra Engineering College","place":"Namakkal","summary":"Venue (original): Mahendra Engineering College. Location: Namakkal.","tags":[],"attachments":[]},{"id":"talk-0022","type":"talk","title":"Underwater Antennas ATAL","subtitle":"Online FDP","date":"2021-12-11","organization":"Mailam Engineering College","place":"Villupuram","summary":"Venue (original): Mailam Engineering College. Location: Villupuram.","tags":[],"attachments":[]},{"id":"workshop-0001","type":"workshop","title":"Workshop on Engineering Principles in Nano Technology","date":"2011-07-23","organization":"SSNCE","duration":"23.07.2011","mode":"Contact","summary":"WORKSHOPS ORGANIZED. Duration: 23.07.2011. Mode: Contact.","tags":["WORKSHOPS ORGANIZED","Contact"],"attachments":[]},{"id":"workshop-0002","type":"workshop","title":"Two Day Workshop on ARM mbed Cortex M Processor Platform","date":"2013-09-20","organization":"SSNCE","duration":"20.09.2013 - 21.09.2013","mode":"Contact","summary":"WORKSHOPS ORGANIZED. Duration: 20.09.2013 - 21.09.2013. Mode: Contact.","tags":["WORKSHOPS ORGANIZED","Contact"],"attachments":[]},{"id":"workshop-0003","type":"workshop","title":"Virtual workshop on Ocean Observation and Hydrographic Surveying","date":"2020-08-18","organization":"SSNCE","duration":"18.08.2020","mode":"Online","summary":"WORKSHOPS ORGANIZED. Duration: 18.08.2020. Mode: Online.","tags":["WORKSHOPS ORGANIZED","Online"],"attachments":[]},{"id":"workshop-0004","type":"workshop","title":"International Workshop on Understanding Oceans and Exploration","date":"2020-08-25","organization":"SSNCE","duration":"25.08.2020","mode":"Online","summary":"WORKSHOPS ORGANIZED. Duration: 25.08.2020. Mode: Online.","tags":["WORKSHOPS ORGANIZED","Online"],"attachments":[]},{"id":"workshop-0005","type":"workshop","title":"International Workshop on Underwater Vehicle Communication","date":"2020-09-01","organization":"SSNCE","duration":"01.09.2020","mode":"Online","summary":"WORKSHOPS ORGANIZED. Duration: 01.09.2020. Mode: Online.","tags":["WORKSHOPS ORGANIZED","Online"],"attachments":[]},{"id":"workshop-0006","type":"workshop","title":"Two-day workshop with Alumni for future Alumni V 5.0","date":"2021-08-05","organization":"SSNCE","duration":"05.08.2021 - 06.08.2021","mode":"Contact","summary":"WORKSHOPS ORGANIZED. Duration: 05.08.2021 - 06.08.2021. Mode: Contact.","tags":["WORKSHOPS ORGANIZED","Contact"],"attachments":[]},{"id":"workshop-0007","type":"workshop","title":"Int. Workshop on Current Trends in Underwater Communication","date":"2022-02-17","organization":"SSNCE","duration":"17.02.2022 - 18.02.2022","mode":"Contact","summary":"WORKSHOPS ORGANIZED. Duration: 17.02.2022 - 18.02.2022. Mode: Contact.","tags":["WORKSHOPS ORGANIZED","Contact"],"attachments":[]},{"id":"workshop-0008","type":"workshop","title":"Int. Workshop on Ocean Observation Systems & Marine Resources","date":"2022-03-16","organization":"SSNCE","duration":"16.03.2022 - 17.03.2022","mode":"Contact","summary":"WORKSHOPS ORGANIZED. Duration: 16.03.2022 - 17.03.2022. Mode: Contact.","tags":["WORKSHOPS ORGANIZED","Contact"],"attachments":[]},{"id":"workshop-0011","type":"workshop","title":"National Workshop on University initiatives for Micro-Satellite","date":"2002-03-09","organization":"Anna Univ & ASI","duration":"09.03.2002","mode":"Contact","summary":"WORKSHOPS ATTENDED. Duration: 09.03.2002. Mode: Contact.","tags":["WORKSHOPS ATTENDED","Contact"],"attachments":[]},{"id":"workshop-0012","type":"workshop","title":"Faculty Development program workshop on LIFE SKILLS","date":"2006-11-20","organization":"SSNCE","duration":"20.11.2006 - 22.11.2006","mode":"Contact","summary":"WORKSHOPS ATTENDED. Duration: 20.11.2006 - 22.11.2006. Mode: Contact.","tags":["WORKSHOPS ATTENDED","Contact"],"attachments":[]},{"id":"workshop-0013","type":"workshop","title":"One day workshop on simulation of electronic circuit using Orchad","date":"2007-03-03","organization":"SSNCE","duration":"03.03.2007","mode":"Contact","summary":"WORKSHOPS ATTENDED. Duration: 03.03.2007. Mode: Contact.","tags":["WORKSHOPS ATTENDED","Contact"],"attachments":[]},{"id":"workshop-0014","type":"workshop","title":"National workshop on ‘Optical communication and networking”","date":"2007-08-10","organization":"St. Joseph’s CE","duration":"10.08.2007 - 11.08.2007","mode":"Contact","summary":"WORKSHOPS ATTENDED. Duration: 10.08.2007 - 11.08.2007. Mode: Contact.","tags":["WORKSHOPS ATTENDED","Contact"],"attachments":[]},{"id":"workshop-0015","type":"workshop","title":"Two days workshop on wireless sensor networks","date":"2008-04-18","organization":"SSNCE","duration":"18.04.2008 - 19.04.2008","mode":"Contact","summary":"WORKSHOPS ATTENDED. Duration: 18.04.2008 - 19.04.2008. Mode: Contact.","tags":["WORKSHOPS ATTENDED","Contact"],"attachments":[]},{"id":"workshop-0016","type":"workshop","title":"Int. Workshop on Microwave and Optical Communication","date":"2009-12-21","organization":"SRM Univ","duration":"21.12.2009","mode":"Contact","summary":"WORKSHOPS ATTENDED. Duration: 21.12.2009. Mode: Contact.","tags":["WORKSHOPS ATTENDED","Contact"],"attachments":[]},{"id":"workshop-0017","type":"workshop","title":"Five day workshop on “Artificial Intelligence for ALL”","date":"2019-06-17","organization":"IIITDM","duration":"17.06.2019 - 21.06.2019","mode":"Contact","summary":"WORKSHOPS ATTENDED. Duration: 17.06.2019 - 21.06.2019. Mode: Contact.","tags":["WORKSHOPS ATTENDED","Contact"],"attachments":[]},{"id":"pub-0002","type":"publication","title":"Study of De-noising Techniques for SNR improvement for underwater acoustic communication","date":"2014","organization":"International Journal of Marine Engineering and Technology – Vol.13","authors":"Kalpana G, Rajendran V, Sakthivel Murugan S","doi":"10.1080/20464177.2014.11658119","subtype":"Journal","summary":"Authors: Kalpana G, Rajendran V, Sakthivel Murugan S. Venue: International Journal of Marine Engineering and Technology – Vol.13. DOI: 10.1080/20464177.2014.11658119","tags":["Journal"],"attachments":[]},{"id":"pub-0003","type":"publication","title":"Analysis on Extraction of modulated signal using adaptive algorithms against ambient noises in underwater Communication","date":"2014","organization":"International Journal of Signal Processing Systems, Vol. 3, No. 1","authors":"Sakthivel Murugan S, Natarajan V, Prethivika S","doi":"10.12720/ijsps.3.1.25-29","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, Natarajan V, Prethivika S. Venue: International Journal of Signal Processing Systems, Vol. 3, No. 1. DOI: 10.12720/ijsps.3.1.25-29","tags":["Journal"],"attachments":[]},{"id":"pub-0004","type":"publication","title":"Analysis of EMD algorithm for identification and extraction of an acoustic signal in underwater channel against wind driven ambient noise","date":"2014","organization":"Springer’s China Ocean Engineering, Vol. 28, No. 5","authors":"Sakthivel Murugan S, Natarajan V, Maheswaran K","doi":"10.1007/s13344-014-0051-2","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, Natarajan V, Maheswaran K. Venue: Springer’s China Ocean Engineering, Vol. 28, No. 5. DOI: 10.1007/s13344-014-0051-2","tags":["Journal"],"attachments":[]},{"id":"pub-0005","type":"publication","title":"Hardware implementation of Kalman Least Mean Square based adaptive algorithm for denoising ambient noises in shallow water region","date":"2014","organization":"Fluctuation and Noise Letters, Vol. 13, No. 3","authors":"Sakthivel Murugan S, Natarajan V, Prethivika S","doi":"10.1142/S0219477514500187","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, Natarajan V, Prethivika S. Venue: Fluctuation and Noise Letters, Vol. 13, No. 3. DOI: 10.1142/S0219477514500187","tags":["Journal"],"attachments":[]},{"id":"pub-0006","type":"publication","title":"Implementation of Threshold Detection Technique for extraction of composite signals against ambient noises in underwater communication using Empirical Mode Decomposition","date":"2012","organization":"Fluctuation and Noise Letters, Vol. 11, No. 4","authors":"Sakthivel Murugan S, Natarajan V","doi":"10.1142/S0219477512500319","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, Natarajan V. Venue: Fluctuation and Noise Letters, Vol. 11, No. 4. DOI: 10.1142/S0219477512500319","tags":["Journal"],"attachments":[]},{"id":"pub-0007","type":"publication","title":"Analysis of MNLMS and KLMS algorithms for underwater acoustic communications","date":"2012","organization":"Fluctuation and Noise Letters, Vol. 11, No. 4","authors":"Sakthivel Murugan S, Natarajan V, Radha S","doi":"10.1142/S021947751250023X","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, Natarajan V, Radha S. Venue: Fluctuation and Noise Letters, Vol. 11, No. 4. DOI: 10.1142/S021947751250023X","tags":["Journal"],"attachments":[]},{"id":"pub-0008","type":"publication","title":"SNR and MSE analysis of KLMS Algorithm for underwater acoustic communications","date":"2012","organization":"Journal of Marine Engineering and Technology, Vol. 11, No.3","authors":"Sakthivel Murugan S, Natarajan V","doi":"10.1080/20464177.2012.11020267","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, Natarajan V. Venue: Journal of Marine Engineering and Technology, Vol. 11, No.3. DOI: 10.1080/20464177.2012.11020267","tags":["Journal"],"attachments":[]},{"id":"pub-0009","type":"publication","title":"Estimation of Noise Model and denoising of wind driven ambient noise in shallow water using the LMS algorithm","date":"2012","organization":"Journal of Acoustics Australia, Vol. 40, No.2","authors":"Sakthivel Murugan S, Natarajan V, Rajesh Kumar","doi":"","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, Natarajan V, Rajesh Kumar. Venue: Journal of Acoustics Australia, Vol. 40, No.2. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0010","type":"publication","title":"Algorithms for Underwater Acoustic Communications – Adaptive Algorithm Testing to determine best adaptive filtering approaches for denoising signals affected by Wind Noise","date":"2012","organization":"Journal of Sea Technology, Vol. 53, No.7","authors":"Sakthivel Murugan S, Natarajan V, Radha S","doi":"","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, Natarajan V, Radha S. Venue: Journal of Sea Technology, Vol. 53, No.7. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0011","type":"publication","title":"Noise Model Analysis and Estimation of Effect due to Wind Driven Ambient Noise in Shallow Water","date":"2011","organization":"International Journal of Oceanography, Vol.2011","authors":"Sakthivel Murugan S, V.Natarajan, R.Rajesh Kumar","doi":"10.1155/2011/950838","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, V.Natarajan, R.Rajesh Kumar. Venue: International Journal of Oceanography, Vol.2011. DOI: 10.1155/2011/950838","tags":["Journal"],"attachments":[]},{"id":"pub-0012","type":"publication","title":"Estimation and analysis of Ocean Wave Parameters Based on Buoy Motion","date":"2010","organization":"International Journal of Advanced Engineering Technology, Vol.1, No.3","authors":"Sakthivel Murugan S, V.Natarajan, JagadeeshAdapa","doi":"","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, V.Natarajan, JagadeeshAdapa. Venue: International Journal of Advanced Engineering Technology, Vol.1, No.3. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0013","type":"publication","title":"Interpretation of underwater Noise Spectra at different Rainfall and wind speed conditions based on Time series hydrophone Voltage signal Processing","date":"2010","organization":"International Journal of Advanced Engineering Technology, Vol.1, No.2","authors":"Sakthivel Murugan S, V.Natarajan, Lenin Joseph","doi":"","subtype":"Journal","summary":"Authors: Sakthivel Murugan S, V.Natarajan, Lenin Joseph. Venue: International Journal of Advanced Engineering Technology, Vol.1, No.2. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0014","type":"publication","title":"Design and Implementation of Secured Cloud-Based Remote Home Access Through an Application for Smart Infrastructure.","date":"2020","organization":"Advances in Smart System Technologies, Vol No. 1163. Springer","authors":"Shashank Karthikeyan A. S., Priyadarshni R, Revathi G, Sakthivel Murugan S.","doi":"10.1007/978-981-15-5029-4_44","subtype":"Journal","summary":"Authors: Shashank Karthikeyan A. S., Priyadarshni R, Revathi G, Sakthivel Murugan S.. Venue: Advances in Smart System Technologies, Vol No. 1163. Springer. DOI: 10.1007/978-981-15-5029-4_44","tags":["Journal"],"attachments":[]},{"id":"pub-0015","type":"publication","title":"Development of Smart Electricity Energy Management System Using IoT","date":"2020","organization":"Advances in Smart System Technologies, vol No. 1163. Springer","authors":"Nikitha S, Zohra Noori Mohsina, Sneha V, Sakthivel Murugan S","doi":"10.1007/978-981-15-5029-4_45","subtype":"Journal","summary":"Authors: Nikitha S, Zohra Noori Mohsina, Sneha V, Sakthivel Murugan S. Venue: Advances in Smart System Technologies, vol No. 1163. Springer. DOI: 10.1007/978-981-15-5029-4_45","tags":["Journal"],"attachments":[]},{"id":"pub-0016","type":"publication","title":"Keypoint-Based Mapping Analysis on Transformed Side Scan Sonar Images","date":"2020","organization":"Multimedia Tools and Applications 79 Springer","authors":"Dhana Lakshmi M, Sakthivel Murugan S","doi":"10.1007/s11042-020-09247-0","subtype":"Journal","summary":"Authors: Dhana Lakshmi M, Sakthivel Murugan S. Venue: Multimedia Tools and Applications 79 Springer. DOI: 10.1007/s11042-020-09247-0","tags":["Journal"],"attachments":[]},{"id":"pub-0017","type":"publication","title":"Modelling of submerged optical remote correspondence with low losses","date":"2020","organization":"International Journal of Mechanical and Production Engineering Research and Development, Vol. 10","authors":"Balaji K, Nithya R, Ganesan S, Nishavithri N, Sakthivel Murugan S","doi":"10.24247/ijmperdjun2020378","subtype":"Journal","summary":"Authors: Balaji K, Nithya R, Ganesan S, Nishavithri N, Sakthivel Murugan S. Venue: International Journal of Mechanical and Production Engineering Research and Development, Vol. 10. DOI: 10.24247/ijmperdjun2020378","tags":["Journal"],"attachments":[]},{"id":"pub-0018","type":"publication","title":"Seawater – Activated Battery : Developing prototype for Underwater Alternative Energy Source","date":"2019","organization":"Sea Technology, Vol .60, No.7","authors":"Arunkumar B, Sakthivel Murugan S","doi":"","subtype":"Journal","summary":"Authors: Arunkumar B, Sakthivel Murugan S. Venue: Sea Technology, Vol .60, No.7. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0019","type":"publication","title":"Implementing IoT in Underwater Communication using Li-Fi","date":"2019","organization":"International Journal of Recent Technology and Engineering, Vol. 8","authors":"Balaji K, Sakthivel Murugan S","doi":"10.35940/ijrte.b1190.0782s419","subtype":"Journal","summary":"Authors: Balaji K, Sakthivel Murugan S. Venue: International Journal of Recent Technology and Engineering, Vol. 8. DOI: 10.35940/ijrte.b1190.0782s419","tags":["Journal"],"attachments":[]},{"id":"pub-0020","type":"publication","title":"Implementation of sea sand in microbial fuel cell for an energy harvesting system using LTC for underwater applications","date":"2018","organization":"Indian Journal of Geo - Marine Sciences, Vol.47, No.4","authors":"Janani P, Sakthivel Murugan S","doi":"","subtype":"Journal","summary":"Authors: Janani P, Sakthivel Murugan S. Venue: Indian Journal of Geo - Marine Sciences, Vol.47, No.4. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0021","type":"publication","title":"Design and performance analysis of boost converters in an energy harvesting system for underwater applications using sea water in microbial fuel cell","date":"2017","organization":"Indian journal of Geo Marine Sciences, Vol.46, No.11","authors":"Janani. P, Sakthivel Murugan S","doi":"","subtype":"Journal","summary":"Authors: Janani. P, Sakthivel Murugan S. Venue: Indian journal of Geo Marine Sciences, Vol.46, No.11. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0022","type":"publication","title":"Coherence analysis of ambient noises in shallow water for underwater Communication","date":"2017","organization":"Journal of Marine Science and Technology, Vol. 25, No.3","authors":"Annalakshmi G, Sakthivel Murugan S, Venugopal Padmanabhan, Swetha Vivekananthan, Vaishali Selvaraj","doi":"10.6119/JMST-017-0113-1","subtype":"Journal","summary":"Authors: Annalakshmi G, Sakthivel Murugan S, Venugopal Padmanabhan, Swetha Vivekananthan, Vaishali Selvaraj. Venue: Journal of Marine Science and Technology, Vol. 25, No.3. DOI: 10.6119/JMST-017-0113-1","tags":["Journal"],"attachments":[]},{"id":"pub-0023","type":"publication","title":"Model predicting sediment transport","date":"2017","organization":"Sea technology Journal, Vol.54","authors":"K.Harshitha, G.Annalakshmi, Sakthivel Murugan S","doi":"","subtype":"Journal","summary":"Authors: K.Harshitha, G.Annalakshmi, Sakthivel Murugan S. Venue: Sea technology Journal, Vol.54. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0024","type":"publication","title":"Underwater acoustic Modem – Challenges Technology and Applications – A review Survey","date":"2017","organization":"International Journal of Oceanography and fisheries, Vol No.2, Issue No.4","authors":"Annalakshmi G, Sakthivel Murugan S","doi":"10.19080/OFOAJ.2017.02.555592","subtype":"Journal","summary":"Authors: Annalakshmi G, Sakthivel Murugan S. Venue: International Journal of Oceanography and fisheries, Vol No.2, Issue No.4. DOI: 10.19080/OFOAJ.2017.02.555592","tags":["Journal"],"attachments":[]},{"id":"pub-0025","type":"publication","title":"Performance analysis of magnetic induction technique over electromagnetic wave technique for underground wireless communication","date":"2017","organization":"International Journal of Emerging research in management and technology, Vol.6, No.5","authors":"Swathi Sugumar, Sakthivel Murugan S","doi":"","subtype":"Journal","summary":"Authors: Swathi Sugumar, Sakthivel Murugan S. Venue: International Journal of Emerging research in management and technology, Vol.6, No.5. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0026","type":"publication","title":"Study and analysis of various modulation techniques for underwater communication","date":"2017","organization":"International Journal of Emerging research in management and technology, Vol.6, No.5","authors":"Hasthi Gowthamni, Brintha Manivannan, Heera Parvin Azam, Sakthivel Murugan S","doi":"","subtype":"Journal","summary":"Authors: Hasthi Gowthamni, Brintha Manivannan, Heera Parvin Azam, Sakthivel Murugan S. Venue: International Journal of Emerging research in management and technology, Vol.6, No.5. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0027","type":"publication","title":"Design and Implementation of an Energy harvesting system using MFC with Marine sediments for underwater Applications","date":"2016","organization":"International Journal of Marine Science Research and Development, Vol.6, Issue No.4","authors":"Sakthivel Murugan S","doi":"10.4172/2155-9910.C1.014","subtype":"Journal","summary":"Authors: Sakthivel Murugan S. Venue: International Journal of Marine Science Research and Development, Vol.6, Issue No.4. DOI: 10.4172/2155-9910.C1.014","tags":["Journal"],"attachments":[]},{"id":"pub-0028","type":"publication","title":"Performance analysis of an energy efficient cross layer protocol for underwater acoustic wireless sensor network","date":"2016","organization":"International Journal of Marine Science Research and Development, Vol.6, Issue No.4","authors":"Sakthivel Murugan S","doi":"10.4172/2155-9910.C1.013","subtype":"Journal","summary":"Authors: Sakthivel Murugan S. Venue: International Journal of Marine Science Research and Development, Vol.6, Issue No.4. DOI: 10.4172/2155-9910.C1.013","tags":["Journal"],"attachments":[]},{"id":"pub-0029","type":"publication","title":"Study of Vertical coherence in shallow water ambient noise","date":"2016","organization":"International Journal of advances in natural and applied sciences, Vol.10, No.14","authors":"S.M.Asha Banu, Sakthivel Murugan S, P.Venugopal","doi":"","subtype":"Journal","summary":"Authors: S.M.Asha Banu, Sakthivel Murugan S, P.Venugopal. Venue: International Journal of advances in natural and applied sciences, Vol.10, No.14. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0030","type":"publication","title":"Microbial Fuel Cell Underwater Power System -Harvesting Energy from Seawater for low power applications","date":"2015","organization":"International Journal of Sea Technology, Vol 56, No.7","authors":"Janani P, Sakthivel Murugan S","doi":"","subtype":"Journal","summary":"Authors: Janani P, Sakthivel Murugan S. Venue: International Journal of Sea Technology, Vol 56, No.7. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0031","type":"publication","title":"Underwater MAD Blurred Image Classification by Versatile Interpretation of Machine Algorithmic Learning Classifiers","date":"2025","organization":"Fluctuation and Noise Letters, Aug(2025), 2550061","authors":"M. Vimal Raj, Sakthivel Murugan Santhanam and Muthumeenakshi Kailasam","doi":"","subtype":"Journal","summary":"Authors: M. Vimal Raj, Sakthivel Murugan Santhanam and Muthumeenakshi Kailasam. Venue: Fluctuation and Noise Letters, Aug(2025), 2550061. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0032","type":"publication","title":"Position and Velocity Analysis of Open and Closed loop system using various Controllers in Underwater ROV - ORCA for Stabilized Navigation","date":"2025","organization":"Journal of Technical and Vocational Education, vol. 26, no (1)","authors":"M. Vimal Raj, Sakthivel Murugan Santhanam, Muthumeenakshi Kailasam, B. Sandhya and G. Sree Harine","doi":"","subtype":"Journal","summary":"Authors: M. Vimal Raj, Sakthivel Murugan Santhanam, Muthumeenakshi Kailasam, B. Sandhya and G. Sree Harine. Venue: Journal of Technical and Vocational Education, vol. 26, no (1). DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0033","type":"publication","title":"Parallel desires: unifying local and semantic feature representations in marine species images for classification","date":"2024","organization":"Marine Geophysical Research, vol. 45:16","authors":"Dhana Lakshmi Manikandan, Sakthivel Murugan Santhanam","doi":"10.1007/s11001-024-09551-6","subtype":"Journal","summary":"Authors: Dhana Lakshmi Manikandan, Sakthivel Murugan Santhanam. Venue: Marine Geophysical Research, vol. 45:16. DOI: 10.1007/s11001-024-09551-6","tags":["Journal"],"attachments":[]},{"id":"pub-0034","type":"publication","title":"Underwater species classification using deep learning technique","date":"2024","organization":"Romanian Journal of Information Technology and Automatic Control, vol. 34(2)","authors":"Dhana Lakshmi MANIKANDAN, Sakthivel Murugan SANTHANAM","doi":"10.33436/v34i2y202401","subtype":"Journal","summary":"Authors: Dhana Lakshmi MANIKANDAN, Sakthivel Murugan SANTHANAM. Venue: Romanian Journal of Information Technology and Automatic Control, vol. 34(2). DOI: 10.33436/v34i2y202401","tags":["Journal"],"attachments":[]},{"id":"pub-0035","type":"publication","title":"Arm for ORCA ROV","date":"2024","organization":"Sea Technology, Volume 65, No. 2","authors":"Karthik Raja Anandan, Anirudh Anand and Dr. Sakthivel Murugan Santhanam","doi":"","subtype":"Journal","summary":"Authors: Karthik Raja Anandan, Anirudh Anand and Dr. Sakthivel Murugan Santhanam. Venue: Sea Technology, Volume 65, No. 2. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0036","type":"publication","title":"Veracious Interpolated Measure of Angle and Length for Underwater Motion Blurred Images.","date":"2023","organization":"Fluctuation and Noise Letters, vol. 22, no. 05","authors":"Vimal Raj M, and S. Sakthivel Murugan","doi":"10.1142/S0219477523500347","subtype":"Journal","summary":"Authors: Vimal Raj M, and S. Sakthivel Murugan. Venue: Fluctuation and Noise Letters, vol. 22, no. 05. DOI: 10.1142/S0219477523500347","tags":["Journal"],"attachments":[]},{"id":"pub-0037","type":"publication","title":"Modelling and performance analysis of open-loop remotely operated vehicles ORCA","date":"2023","organization":"IAES International Journal of Robotics and Automation (IJRA), Vol. 12, No. 1","authors":"Tejaswini Panati, Sai Deepika Indraganti, Sakthivel Murugan Santhanam","doi":"10.11591/ijra.v12i1.pp108-124","subtype":"Journal","summary":"Authors: Tejaswini Panati, Sai Deepika Indraganti, Sakthivel Murugan Santhanam. Venue: IAES International Journal of Robotics and Automation (IJRA), Vol. 12, No. 1. DOI: 10.11591/ijra.v12i1.pp108-124","tags":["Journal"],"attachments":[]},{"id":"pub-0038","type":"publication","title":"Underwater Cognitive Acoustic Networks Architecture  Development and Deployment.","date":"2022","organization":"International Journal of Next-Generation Computing, Vol. 13 Issue 2","authors":"K. Balaji, Sakthivel Murugan Santhanam, R. Logeshwaran","doi":"","subtype":"Journal","summary":"Authors: K. Balaji, Sakthivel Murugan Santhanam, R. Logeshwaran. Venue: International Journal of Next-Generation Computing, Vol. 13 Issue 2. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0039","type":"publication","title":"Reduction of Artifacts and Edge Preservation of Underwater Images Using Deep Convolution Neural Network","date":"2022","organization":"Fluctuation and Noise Letters, Vol. 21, No. 4","authors":"M. Somasekar, and S. Sakthivel Murugan","doi":"10.1142/S021947752250025022500250","subtype":"Journal","summary":"Authors: M. Somasekar, and S. Sakthivel Murugan. Venue: Fluctuation and Noise Letters, Vol. 21, No. 4. DOI: 10.1142/S021947752250025022500250","tags":["Journal"],"attachments":[]},{"id":"pub-0040","type":"publication","title":"Fractal adaptive weight synthesized–local directional pattern–based image classification using enhanced tree seed algorithm","date":"2022","organization":"Environmental Science and Pollution Research","authors":"Annalakshmi Ganesan, & Sakthivel Murugan Santhanam","doi":"10.1007/s11356-022-20265-3","subtype":"Journal","summary":"Authors: Annalakshmi Ganesan, & Sakthivel Murugan Santhanam. Venue: Environmental Science and Pollution Research. DOI: 10.1007/s11356-022-20265-3","tags":["Journal"],"attachments":[]},{"id":"pub-0041","type":"publication","title":"Contrast Improvement on Side Scan Sonar images using Retinex based edge preserved technique","date":"2022","organization":"Marine Geophysical Research","authors":"Dhana Lakshmi M, Sakthivel Murugan S","doi":"10.1007/s11001-022-09478-w","subtype":"Journal","summary":"Authors: Dhana Lakshmi M, Sakthivel Murugan S. Venue: Marine Geophysical Research. DOI: 10.1007/s11001-022-09478-w","tags":["Journal"],"attachments":[]},{"id":"pub-0042","type":"publication","title":"Characteristics Analysis of Metamaterial Enhanced Magnetic Induction Based Underground Communication","date":"2022","organization":"Wireless Personal Communications, Vol: 123","authors":"Raagavi B, Swathi S, Sakthivel Murugan S","doi":"10.1007/s11277-021-09207-3","subtype":"Journal","summary":"Authors: Raagavi B, Swathi S, Sakthivel Murugan S. Venue: Wireless Personal Communications, Vol: 123. DOI: 10.1007/s11277-021-09207-3","tags":["Journal"],"attachments":[]},{"id":"pub-0043","type":"publication","title":"Execution of Channel Characterization for Underwater Optical Wireless Communication System in Blue-green Spectral Range for different types of seawater based on Chlorophyll Content","date":"2022","organization":"Journal of Light and Engineering vol. 30 (1)","authors":"Balaji K, Sakthivel Murugan S","doi":"10.33383/2021-046","subtype":"Journal","summary":"Authors: Balaji K, Sakthivel Murugan S. Venue: Journal of Light and Engineering vol. 30 (1). DOI: 10.33383/2021-046","tags":["Journal"],"attachments":[]},{"id":"pub-0044","type":"publication","title":"Denoising  Edge Aware Restoration and Enhancement of Single Shallow Coastal Water Image","date":"2022","organization":"Fluctuation and Noise Letters, Vol.21, No.1","authors":"Mary Cecilia, Sakthivel Murugan S","doi":"10.1142/S0219477522500092","subtype":"Journal","summary":"Authors: Mary Cecilia, Sakthivel Murugan S. Venue: Fluctuation and Noise Letters, Vol.21, No.1. DOI: 10.1142/S0219477522500092","tags":["Journal"],"attachments":[]},{"id":"pub-0045","type":"publication","title":"A Complete Analysis of Clarity (C50) Using I-SIMPA to Maintain Ideal Conditions in an Acoustic Chamber","date":"2022","organization":"Journal of Sound and Vibration, Vol.56, No:1","authors":"R.Adithya Pillai, S. Sakthivel Murugan, Guruprasad Gupta","doi":"10.32604/sv.2022.012085","subtype":"Journal","summary":"Authors: R.Adithya Pillai, S. Sakthivel Murugan, Guruprasad Gupta. Venue: Journal of Sound and Vibration, Vol.56, No:1. DOI: 10.32604/sv.2022.012085","tags":["Journal"],"attachments":[]},{"id":"pub-0046","type":"publication","title":"A novel feature descriptor based coral image classification using extreme learning machine with ameliorated chimp optimization algorithm","date":"2021","organization":"Ecological Informatics (Elsevier Publication)","authors":"Annalakshmi G, Sakthivel Murugan S","doi":"10.1016/j.ecoinf.2021.101527","subtype":"Journal","summary":"Authors: Annalakshmi G, Sakthivel Murugan S. Venue: Ecological Informatics (Elsevier Publication). DOI: 10.1016/j.ecoinf.2021.101527","tags":["Journal"],"attachments":[]},{"id":"pub-0047","type":"publication","title":"Implementing Blue-Green Spectral range channel characterization for underwater optical wireless communication system for sailors and submarines","date":"2021","organization":"Journal of Environmental Protection and Ecology vol. 22 (5)","authors":"Balaji K, Sakthivel Murugan S","doi":"10.33383/2021-046","subtype":"Journal","summary":"Authors: Balaji K, Sakthivel Murugan S. Venue: Journal of Environmental Protection and Ecology vol. 22 (5). DOI: 10.33383/2021-046","tags":["Journal"],"attachments":[]},{"id":"pub-0048","type":"publication","title":"Visibility Improvement of Underwater Turbid Image using Hybrid restoration network with Weighted filter","date":"2021","organization":"Multidimensional System and Signal Processing","authors":"Dhana Lakshmi M, Sakthivel Murugan S","doi":"10.1007/s11045-021-00795-8","subtype":"Journal","summary":"Authors: Dhana Lakshmi M, Sakthivel Murugan S. Venue: Multidimensional System and Signal Processing. DOI: 10.1007/s11045-021-00795-8","tags":["Journal"],"attachments":[]},{"id":"pub-0049","type":"publication","title":"Fusion based approach for quality enhancement of Underwater images","date":"2021","organization":"Journal of Environmental Protection and Ecology, Vol.22, Issue 4","authors":"Somasekar M, Sakthivel Murugan S","doi":"","subtype":"Journal","summary":"Authors: Somasekar M, Sakthivel Murugan S. Venue: Journal of Environmental Protection and Ecology, Vol.22, Issue 4. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0050","type":"publication","title":"ROV Development","date":"2021","organization":"Sea Technology, Vol .62, No.9","authors":"Tejaswini Panati, Sai Deepika I, Dr. S. Sakthivel Murugan","doi":"","subtype":"Journal","summary":"Authors: Tejaswini Panati, Sai Deepika I, Dr. S. Sakthivel Murugan. Venue: Sea Technology, Vol .62, No.9. DOI: ","tags":["Journal"],"attachments":[]},{"id":"pub-0051","type":"publication","title":"Modified Restoration technique for improved visual perception of shallow underwater imagery","date":"2021","organization":"Current Science, Vol. 121, Issue 1","authors":"Dhana Lakshmi M, Sakthivel Murugan S","doi":"10.18520/cs/v121/i1/103-108","subtype":"Journal","summary":"Authors: Dhana Lakshmi M, Sakthivel Murugan S. Venue: Current Science, Vol. 121, Issue 1. DOI: 10.18520/cs/v121/i1/103-108","tags":["Journal"],"attachments":[]},{"id":"pub-0052","type":"publication","title":"Development of a Navigation and Position Tracking System for a Remotely Operated Vehicle (ROV)–ORCA","date":"2021","organization":"Journal of Physics: Conference Series, Vol. 1911, No. 1","authors":"Tejaswini, P, I. Sai Deepika, Sakthivel Murugan S","doi":"10.1088/1742-6596/1911/1/012017","subtype":"Journal","summary":"Authors: Tejaswini, P, I. Sai Deepika, Sakthivel Murugan S. Venue: Journal of Physics: Conference Series, Vol. 1911, No. 1. DOI: 10.1088/1742-6596/1911/1/012017","tags":["Journal"],"attachments":[]},{"id":"pub-0053","type":"publication","title":"Edge Aware Turbidity Restoration of Single Shallow Coastal Water Image","date":"2021","organization":"Journal of Physics: Conference Series, Vol. 1911, No. 1","authors":"S. Mary Cecilia, S. Sakthivel Murugan","doi":"10.1088/1742-6596/1911/1/012021","subtype":"Journal","summary":"Authors: S. Mary Cecilia, S. Sakthivel Murugan. Venue: Journal of Physics: Conference Series, Vol. 1911, No. 1. DOI: 10.1088/1742-6596/1911/1/012021","tags":["Journal"],"attachments":[]},{"id":"pub-0054","type":"publication","title":"Motion Deblurring Analysis for Underwater Image Restoration.","date":"2021","organization":"Journal of Physics: Conference Series, Vol. 1911, No. 1","authors":"Vimal Raj M, Sakthivel Murugan S","doi":"10.1088/1742-6596/1911/1/012028","subtype":"Journal","summary":"Authors: Vimal Raj M, Sakthivel Murugan S. Venue: Journal of Physics: Conference Series, Vol. 1911, No. 1. DOI: 10.1088/1742-6596/1911/1/012028","tags":["Journal"],"attachments":[]},{"id":"pub-0055","type":"publication","title":"Binarization of Stone Inscription Images by Modified Bi-level Entropy Thresholding","date":"2021","organization":"Fluctuations and Noise Letters, Vol: 20, Issue No:6","authors":"Sukanthi, Sakthivel Murugan S, Hanis","doi":"10.1142/S0219477521500541","subtype":"Journal","summary":"Authors: Sukanthi, Sakthivel Murugan S, Hanis. Venue: Fluctuations and Noise Letters, Vol: 20, Issue No:6. DOI: 10.1142/S0219477521500541","tags":["Journal"],"attachments":[]},{"id":"pub-0056","type":"publication","title":"Optimum frequency Selection for localization of underwater AUV using dynamic positioning parameters","date":"2021","organization":"Microsystem Technologies, Vol: 5","authors":"Logeswaran Rajasekaran, Sakthivel Murugan S","doi":"10.1007/s00542-021-05222-3","subtype":"Journal","summary":"Authors: Logeswaran Rajasekaran, Sakthivel Murugan S. Venue: Microsystem Technologies, Vol: 5. DOI: 10.1007/s00542-021-05222-3","tags":["Journal"],"attachments":[]},{"id":"pub-0057","type":"publication","title":"Design of Filamentary planar spiral coils with enhanced channel model for magnetic induction based underground communication","date":"2021","organization":"Transactions on Emerging Telecommunications Technologies, Vol: 32, Issue: 5","authors":"Swathi S, Sakthivel Murugan S","doi":"10.1002/ett.4282","subtype":"Journal","summary":"Authors: Swathi S, Sakthivel Murugan S. Venue: Transactions on Emerging Telecommunications Technologies, Vol: 32, Issue: 5. DOI: 10.1002/ett.4282","tags":["Journal"],"attachments":[]},{"id":"pub-0058","type":"publication","title":"PCB planar and filamentary planar spiral coils based underground Magnetic induction communication with enhanced channel model","date":"2021","organization":"Wireless Personal Communications, Vol: 118, Issue: 2","authors":"Swathi S, Sakthivel Murugan S","doi":"10.1007/s11277-021-08508-x","subtype":"Journal","summary":"Authors: Swathi S, Sakthivel Murugan S. Venue: Wireless Personal Communications, Vol: 118, Issue: 2. DOI: 10.1007/s11277-021-08508-x","tags":["Journal"],"attachments":[]},{"id":"pub-0059","type":"publication","title":"Framework for health Management and recording for sailors using the Internet of Things in Underwater Communication","date":"2021","organization":"International Journal for Multiscale Computational Engineering, Vol:19(1)","authors":"Balaji K, Sakthivel Murugan S","doi":"10.1615/IntJMultCompEng.2021037543","subtype":"Journal","summary":"Authors: Balaji K, Sakthivel Murugan S. Venue: International Journal for Multiscale Computational Engineering, Vol:19(1). DOI: 10.1615/IntJMultCompEng.2021037543","tags":["Journal"],"attachments":[]},{"id":"pub-0060","type":"publication","title":"Local Neighbourhood Edge Responsive Image Descriptor for Texture Classification Using Gaussian Mutated JAYA Optimization Algorithm","date":"2021","organization":"Arabian Journal of Science and Engineering, Vol:46","authors":"Annalakshmi Ganesan, Sakthivel Murugan Santhanam","doi":"10.1007/s13369-021-05417-w","subtype":"Journal","summary":"Authors: Annalakshmi Ganesan, Sakthivel Murugan Santhanam. Venue: Arabian Journal of Science and Engineering, Vol:46. DOI: 10.1007/s13369-021-05417-w","tags":["Journal"],"attachments":[]},{"id":"pub-0061","type":"publication","title":"Localization Systems for Autonomous Operation of Underwater Robotic Vehicles: A Survey.","date":"2022","organization":"OCEANS 2022-Chennai, pp. 1-8. IEEE","authors":"Nivedhitha, D., and D. Karthik","doi":"10.1109/OCEANSChennai45887.2022.9775325","subtype":"Journal","summary":"Authors: Nivedhitha, D., and D. Karthik. Venue: OCEANS 2022-Chennai, pp. 1-8. IEEE. DOI: 10.1109/OCEANSChennai45887.2022.9775325","tags":["Journal"],"attachments":[]},{"id":"pub-0062","type":"publication","title":"Magnetic Circuit Analysis of Tubular-Direct Drive Linear Generator for Wave Energy Conversion","date":"2022","organization":"OCEANS 2022-Chennai, pp. 1-6. IEEE","authors":"Mubeena Parveen S, Nelson S, Sakthivel Murugan Santhanam","doi":"10.1109/OCEANSChennai45887.2022.9775255","subtype":"Journal","summary":"Authors: Mubeena Parveen S, Nelson S, Sakthivel Murugan Santhanam. Venue: OCEANS 2022-Chennai, pp. 1-6. IEEE. DOI: 10.1109/OCEANSChennai45887.2022.9775255","tags":["Journal"],"attachments":[]},{"id":"pub-0063","type":"publication","title":"Local Intensity Gradient Directional Pattern Based Coral Image Classification using Deep Neural Network","date":"2023","organization":"IEEE 20th India Council International Conference (INDICON)","authors":"Dr. Annalakshmi Ganesan, Dr. S. Sakthivel Murugan","doi":"10.1109/INDICON59947.2023.10440954","subtype":"Journal","summary":"Authors: Dr. Annalakshmi Ganesan, Dr. S. Sakthivel Murugan. Venue: IEEE 20th India Council International Conference (INDICON). DOI: 10.1109/INDICON59947.2023.10440954","tags":["Journal"],"attachments":[]},{"id":"pub-0065","type":"publication","title":"Design and Prototype Implementation of an Automatic Energy Harvesting system for Low power Devices from Vibration of Vehicles","date":"2015","organization":"12th IEEE INDICON 2015, Jamia Millia Islamia University, New Delhi","authors":"Sakthivel Murugan S, Ann Agneta Chandru","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S, Ann Agneta Chandru. Venue: 12th IEEE INDICON 2015, Jamia Millia Islamia University, New Delhi. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0066","type":"publication","title":"Design and development of power management system for underwater applications","date":"2015","organization":"Second International Conference on Innovations in Information Embedded and Communication Systems (ICIIECS)","authors":"P.Janani, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: P.Janani, Sakthivel Murugan S. Venue: Second International Conference on Innovations in Information Embedded and Communication Systems (ICIIECS). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0067","type":"publication","title":"Best Fit analysis of wind speed using conventional distribution","date":"2015","organization":"Second International Conference on Innovations in Information Embedded and Communication Systems (ICIIECS)","authors":"N.Archanna, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: N.Archanna, Sakthivel Murugan S. Venue: Second International Conference on Innovations in Information Embedded and Communication Systems (ICIIECS). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0068","type":"publication","title":"Development of Microbial Fuel cell based energy harvesting system using marine sediments for underwater applications","date":"2015","organization":"4th National conference of ocean society of India (OSICON 2015)","authors":"P.Janani, Sakthivel Murugan S, N.Archanna","doi":"","subtype":"Conference","summary":"Authors: P.Janani, Sakthivel Murugan S, N.Archanna. Venue: 4th National conference of ocean society of India (OSICON 2015). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0069","type":"publication","title":"Design of Energy harvesting system from rotational force for low power applications","date":"2015","organization":"ISTE regional Conference on the role of Technical education in Energy Conservation","authors":"D.Keerthika, Sakthivel Murugan S, V.Rajendran, Ann Agnetta Chandru","doi":"","subtype":"Conference","summary":"Authors: D.Keerthika, Sakthivel Murugan S, V.Rajendran, Ann Agnetta Chandru. Venue: ISTE regional Conference on the role of Technical education in Energy Conservation. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0070","type":"publication","title":"Design and Implementation of an energy harvester for low power devices from vibration of automobile engine","date":"2015","organization":"Springer International Conference on Soft Computing Systems (ICSCS 2015)","authors":"Ann Agnetta Chandru, Sakthivel Murugan S, Keerthika D","doi":"","subtype":"Conference","summary":"Authors: Ann Agnetta Chandru, Sakthivel Murugan S, Keerthika D. Venue: Springer International Conference on Soft Computing Systems (ICSCS 2015). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0071","type":"publication","title":"Extraction of useful Signal Buried in Ambient Noise from Underwater Acoustic Channels using Adaptive Filtering Techniques","date":"2013","organization":"Proceedings of National Conference of Ocean Society of India (OSICON 2015)","authors":"Prethivika Srinivasan, Sakthivel Murugan S, V.Natarajan","doi":"","subtype":"Conference","summary":"Authors: Prethivika Srinivasan, Sakthivel Murugan S, V.Natarajan. Venue: Proceedings of National Conference of Ocean Society of India (OSICON 2015). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0072","type":"publication","title":"Analysis on Extraction of Modulated signal using Adaptive filtering algorithms against ambient noises in underwater communication","date":"2014","organization":"International Conference on Communication Software and Networks (ICCSN 2014)","authors":"Sakthivel Murugan S, Natarajan V, Prethivika Srinivasan","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S, Natarajan V, Prethivika Srinivasan. Venue: International Conference on Communication Software and Networks (ICCSN 2014). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0073","type":"publication","title":"Extraction of Binary Sequences in a Frequency Shift Keying Modulated Signal by Empirical Mode Decomposition Algorithm against Ambient Noises in Underwater Acoustic Channel","date":"2014","organization":"Springer International Conference on Artificial Intelligence and Evolutionary Algorithms in Engineering Systems (ICAEES 2014)","authors":"Suvasini L, Prethivika S, Sakthivel Murugan S, Natarajan V","doi":"","subtype":"Conference","summary":"Authors: Suvasini L, Prethivika S, Sakthivel Murugan S, Natarajan V. Venue: Springer International Conference on Artificial Intelligence and Evolutionary Algorithms in Engineering Systems (ICAEES 2014). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0074","type":"publication","title":"Extraction of frequency shift keying modulated signal by empirical mode decomposition algorithm against ambient noises in underwater acoustic channel","date":"2014","organization":"Proceedings of the Fifth Indian National Conference on Harbour and Ocean Engineering (INCHOE 2014)","authors":"Suvasini L, Prethivika S, Sakthivel Murugan S, Natarajan V","doi":"","subtype":"Conference","summary":"Authors: Suvasini L, Prethivika S, Sakthivel Murugan S, Natarajan V. Venue: Proceedings of the Fifth Indian National Conference on Harbour and Ocean Engineering (INCHOE 2014). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0075","type":"publication","title":"Extraction of Hidden Signal using FFT Implementation of Empirical Mode Decomposition Technique in an Underwater Acoustic Channel","date":"2013","organization":"Proceedings of National Conference of Ocean Society of India (OSICON 2013)","authors":"Suvasini Lakshminarayanan, Sakthivel Murugan S, V.Natarajan","doi":"","subtype":"Conference","summary":"Authors: Suvasini Lakshminarayanan, Sakthivel Murugan S, V.Natarajan. Venue: Proceedings of National Conference of Ocean Society of India (OSICON 2013). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0076","type":"publication","title":"Analysis and SNR Comparison of various Adaptive Algorithms to De-noise Wind Driven Ambient Noise in Shallow Water","date":"2011","organization":"India Conference (INDICON 2011), Annual IEEE","authors":"Sakthivel Murugan S, Natarajan.V, Rajesh Kumar.R, Balagayathri.K","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S, Natarajan.V, Rajesh Kumar.R, Balagayathri.K. Venue: India Conference (INDICON 2011), Annual IEEE. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0077","type":"publication","title":"Analysis of Adaptive Algorithms to improve SNR of the Acoustic Signal Affected due to Wind Driven Ambient Noise in Shallow Water","date":"2011","organization":"International Symposium on Ocean Electronics (SYMPOL 2011)","authors":"Sakthivel Murugan S, Natarajan.V, Kiruba Veni.S, Balagayathri.K","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S, Natarajan.V, Kiruba Veni.S, Balagayathri.K. Venue: International Symposium on Ocean Electronics (SYMPOL 2011). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0078","type":"publication","title":"Analysis of Power Spectral Density and Development of an Adaptive Algorithm for Filtering Wind Driven Ambient Noise in Shallow Water","date":"2011","organization":"International Conference on Electronics Computer Technology (ICECT 2011)","authors":"Rajesh Kumar.R, Sakthivel Murugan S, Natarajan.V, Radha.S","doi":"","subtype":"Conference","summary":"Authors: Rajesh Kumar.R, Sakthivel Murugan S, Natarajan.V, Radha.S. Venue: International Conference on Electronics Computer Technology (ICECT 2011). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0079","type":"publication","title":"Denoising Algorithm using Wavelet for Underwater Signal Affected by Wind Driven Ambient Noise","date":"2011","organization":"IEEE-International Conference on Recent Trends in Information Technology (ICRTIT 2011)","authors":"Mathan Raj.K, Sakthivel Murugan S, Natarajan.V, Radha.S","doi":"","subtype":"Conference","summary":"Authors: Mathan Raj.K, Sakthivel Murugan S, Natarajan.V, Radha.S. Venue: IEEE-International Conference on Recent Trends in Information Technology (ICRTIT 2011). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0080","type":"publication","title":"Modified LMS Adaptive Algorithm for Detection of Underwater Acoustic Signals against Ambient Noise in Shallow Water of Indian Sea","date":"2011","organization":"IEEE International Conference on Recent Trends in Information Technology (ICRTIT 2011)","authors":"Kiruba Veni. S, Sakthivel Murugan S, Natarajan.V","doi":"","subtype":"Conference","summary":"Authors: Kiruba Veni. S, Sakthivel Murugan S, Natarajan.V. Venue: IEEE International Conference on Recent Trends in Information Technology (ICRTIT 2011). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0081","type":"publication","title":"Performance Analysis of Signal to Noise Ratio and Bit Error Rate for Multiuser using Passive Time Reversal Technique in Underwater Communication","date":"2010","organization":"IEEE International Conference on Wireless Communication and Sensor Computing (ICWCSC 2010)","authors":"Sakthivel Murugan S, Natarajan.V","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S, Natarajan.V. Venue: IEEE International Conference on Wireless Communication and Sensor Computing (ICWCSC 2010). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0082","type":"publication","title":"Analysis of adaptive filter for reduction of wind driven ambient noise in shallow water","date":"2011","organization":"National Conference on advanced Communication Networks and Signal Processing (NCACNSP 2011)","authors":"K.Balagayathri, Sakthivel Murugan S, S.Radha, R.Rajesh Kumar, S.Kiruba Veni","doi":"","subtype":"Conference","summary":"Authors: K.Balagayathri, Sakthivel Murugan S, S.Radha, R.Rajesh Kumar, S.Kiruba Veni. Venue: National Conference on advanced Communication Networks and Signal Processing (NCACNSP 2011). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0083","type":"publication","title":"Analysis and reduction of wind driven ambient noise in shallow waters of Indian Seas","date":"2011","organization":"3rd International conference on Intelligent Science and technology (IIST 2011)","authors":"R.Rajesh Kumar, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: R.Rajesh Kumar, Sakthivel Murugan S. Venue: 3rd International conference on Intelligent Science and technology (IIST 2011). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0084","type":"publication","title":"Development of noise reduction algorithm using wavelet to improve the SNR for underwater signal affected by wind driven ambient noise","date":"2011","organization":"3rd International conference on Intelligent Science and technology (IIST 2011)","authors":"K.Mathan Raj, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: K.Mathan Raj, Sakthivel Murugan S. Venue: 3rd International conference on Intelligent Science and technology (IIST 2011). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0085","type":"publication","title":"Adaptive algorithm for detection of underwater acoustic signals against ambient noise in shallow water at Indian seas","date":"2011","organization":"IEEE International conference on Emerging Trends in Electrical and Computer technology (ICETECT 2011)","authors":"S.Kiruba Veni, Sakthivel Murugan S, S.Radha","doi":"","subtype":"Conference","summary":"Authors: S.Kiruba Veni, Sakthivel Murugan S, S.Radha. Venue: IEEE International conference on Emerging Trends in Electrical and Computer technology (ICETECT 2011). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0086","type":"publication","title":"Performance analysis of passive time reversal in underwater Communication systems","date":"2009","organization":"National conference on Signal and Image Processing (NCSIP 2009)","authors":"K.S.Priyamvadha, S.R.Saradha, R.Sivasankari, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: K.S.Priyamvadha, S.R.Saradha, R.Sivasankari, Sakthivel Murugan S. Venue: National conference on Signal and Image Processing (NCSIP 2009). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0087","type":"publication","title":"Performance analysis of an energy efficient MAC Protocol for underwater acoustic wireless sensor networks","date":"2009","organization":"National conference on computer communication and networking (NCCCN 2009)","authors":"L.Priyadharshini, M.Sarojini, G.Shyama Panicker, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: L.Priyadharshini, M.Sarojini, G.Shyama Panicker, Sakthivel Murugan S. Venue: National conference on computer communication and networking (NCCCN 2009). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0088","type":"publication","title":"Wave data Analysis and application to buoy data to derive wave parameters","date":"2010","organization":"International Conference on Advanced computing and Communication (ICACC 2010)","authors":"Jagadeesh Adapa, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Jagadeesh Adapa, Sakthivel Murugan S. Venue: International Conference on Advanced computing and Communication (ICACC 2010). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0089","type":"publication","title":"Analysis of Underwater rain Noise based on an Averaging Modified Periodogram Spectral estimation method using real time ocean ambient noise measurements","date":"2010","organization":"International Conference on Emerging Trends in Engineering Technologies (ICETES 2010)","authors":"Lenin Joseph, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Lenin Joseph, Sakthivel Murugan S. Venue: International Conference on Emerging Trends in Engineering Technologies (ICETES 2010). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0090","type":"publication","title":"Prediction and estimation of wind dependent underwater ambient noise spectra at light medium and heavy rainfall using Welch’s Method","date":"2010","organization":"International Conference on Computational System and Communication Technology (CSCT 2010)","authors":"Lenin Joseph, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Lenin Joseph, Sakthivel Murugan S. Venue: International Conference on Computational System and Communication Technology (CSCT 2010). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0091","type":"publication","title":"Development of real time algorithm for ocean wave measurement","date":"2010","organization":"National Conference on Emerging Trends and applications in Computer Science (NCETACS 2010)","authors":"Jagadeesh Adapa, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Jagadeesh Adapa, Sakthivel Murugan S. Venue: National Conference on Emerging Trends and applications in Computer Science (NCETACS 2010). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0092","type":"publication","title":"Implementation of digital filtering and drop parameter Estimation algorithm on real time underwater ambient noise spectra","date":"2010","organization":"IEEE International Conference on Convergence of Science and Engineering in Education and Research (ICSE 2010)","authors":"Lenin Joseph, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Lenin Joseph, Sakthivel Murugan S. Venue: IEEE International Conference on Convergence of Science and Engineering in Education and Research (ICSE 2010). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0093","type":"publication","title":"Interpretation of Underwater noise spectra at different rainfall and wind speed conditions based on time series hydrophone voltage signal processing","date":"2010","organization":"3rd National Conference on communication technologies (NCCT 2010)","authors":"Lenin Joseph, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Lenin Joseph, Sakthivel Murugan S. Venue: 3rd National Conference on communication technologies (NCCT 2010). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0094","type":"publication","title":"Detecting Malicious Faults in MANET","date":"2005","organization":"11th National Conference on Communication (NCC 2005)","authors":"K. Nakkeran, B. Parthibane, Sakthivel Murugan S, N. Prabagarane","doi":"","subtype":"Conference","summary":"Authors: K. Nakkeran, B. Parthibane, Sakthivel Murugan S, N. Prabagarane. Venue: 11th National Conference on Communication (NCC 2005). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0095","type":"publication","title":"Design of IP VPN using IP SEC","date":"2005","organization":"National Conference on Broad Band Communication (NCBBCOM 2005)","authors":"Sakthivel Murugan S, R. J. Swapna","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S, R. J. Swapna. Venue: National Conference on Broad Band Communication (NCBBCOM 2005). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0096","type":"publication","title":"Frequency and Time response analysis of MAP and CO for new born EEG Seizures","date":"2002","organization":"Viroka at Vellore Institute of Technologies 2002","authors":"R. Lavanya, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: R. Lavanya, Sakthivel Murugan S. Venue: Viroka at Vellore Institute of Technologies 2002. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0097","type":"publication","title":"Memory management and Response time analysis for wireless broadband communication","date":"2002","organization":"National conference on Communication (NCC 2002)","authors":"Sakthivel Murugan S, G.Sivaradje, R. Gounassoundary, P. Daynanjayan","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S, G.Sivaradje, R. Gounassoundary, P. Daynanjayan. Venue: National conference on Communication (NCC 2002). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0098","type":"publication","title":"Experimental Study and analysis of low frequency signal characteristics for UWA Communication in Bay of Bengal","date":"2020","organization":"4th IEEE International Conference on Information and Communication (CICT 2020)","authors":"Logeswaran R, S. Sakthivel Murugan","doi":"","subtype":"Conference","summary":"Authors: Logeswaran R, S. Sakthivel Murugan. Venue: 4th IEEE International Conference on Information and Communication (CICT 2020). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0099","type":"publication","title":"Restoration of Single Shallow Coastal Water Images","date":"2020","organization":"28th International Conference (Virtual) of Forum for Interdisciplinary Mathematics (FIM 2020)","authors":"S.Mary Cecilia, S. Sakthivel Murugan, N. Padmapriya","doi":"","subtype":"Conference","summary":"Authors: S.Mary Cecilia, S. Sakthivel Murugan, N. Padmapriya. Venue: 28th International Conference (Virtual) of Forum for Interdisciplinary Mathematics (FIM 2020). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0100","type":"publication","title":"Leak Detection Using Comsol Multiphysics for a Laminar Flow through Pipes","date":"2020","organization":"International Conference on green energy for environmental sustainability (ICGEES 2020)","authors":"Gnana Prakash D, Harish S, Rishikesh M, Sakthivel Murugan S, Prasanth S. M.","doi":"","subtype":"Conference","summary":"Authors: Gnana Prakash D, Harish S, Rishikesh M, Sakthivel Murugan S, Prasanth S. M.. Venue: International Conference on green energy for environmental sustainability (ICGEES 2020). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0101","type":"publication","title":"Performance Analysis of Ocean Wave Based Energy Harvesting System using Permanent Magnet Linear Generator","date":"2020","organization":"NCICT -2020","authors":"Mubeena Parveen, Sakthivel Murugan S, Nelson I","doi":"","subtype":"Conference","summary":"Authors: Mubeena Parveen, Sakthivel Murugan S, Nelson I. Venue: NCICT -2020. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0102","type":"publication","title":"Metamaterial enhanced Magnetic Induction based Underground Wireless Communication","date":"2020","organization":"NCICT, SSNCE","authors":"Raagavi B, Swathi S, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Raagavi B, Swathi S, Sakthivel Murugan S. Venue: NCICT, SSNCE. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0103","type":"publication","title":"Binarization of Stone inscription images","date":"2020","organization":"NCICT2020","authors":"Sukanthi, Sakthivel Murugan S, S. Hanis","doi":"","subtype":"Conference","summary":"Authors: Sukanthi, Sakthivel Murugan S, S. Hanis. Venue: NCICT2020. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0104","type":"publication","title":"Underwater Image Recognition Detector using Deep ConvNet","date":"2020","organization":"Twenty Sixth National Conference on Communications (NCC 2020)","authors":"Dhana Lakshmi M, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Dhana Lakshmi M, Sakthivel Murugan S. Venue: Twenty Sixth National Conference on Communications (NCC 2020). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0105","type":"publication","title":"Intensity Based Shadow Classification - SSS Images","date":"2020","organization":"Challenges in Earth System Science for Global Sustainability (CESS-GS 2020)","authors":"Dhana Lakshmi M, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Dhana Lakshmi M, Sakthivel Murugan S. Venue: Challenges in Earth System Science for Global Sustainability (CESS-GS 2020). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0106","type":"publication","title":"Analysis of Channel Losses for implementation of optical communication in underwater","date":"2020","organization":"Challenges in Earth System Science for Global Sustainability (CESS-GS 2020)","authors":"Balaji K, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Balaji K, Sakthivel Murugan S. Venue: Challenges in Earth System Science for Global Sustainability (CESS-GS 2020). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0107","type":"publication","title":"Underwater Image Processing using Hyperparameter algorithms","date":"2020","organization":"Challenges in Earth System Science for Global Sustainability (CESS-GS 2020)","authors":"Vimal Raj M, Sakthivel Murugan S, Padmapriya N","doi":"","subtype":"Conference","summary":"Authors: Vimal Raj M, Sakthivel Murugan S, Padmapriya N. Venue: Challenges in Earth System Science for Global Sustainability (CESS-GS 2020). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0108","type":"publication","title":"Prototype of Inspection Class Remotely Operated Vehicle","date":"2019","organization":"2019 International Symposium on Ocean Technology (SYMPOL 2019)","authors":"Vigneshwar Veeravagu, Vishal Mohan, Tejaswini P, Sai Deepika, Raksshitha NJ, Hashmat Jeelani Banday, Sakthivel Murugan S, Vimal Samsingh, Murugaesan K","doi":"","subtype":"Conference","summary":"Authors: Vigneshwar Veeravagu, Vishal Mohan, Tejaswini P, Sai Deepika, Raksshitha NJ, Hashmat Jeelani Banday, Sakthivel Murugan S, Vimal Samsingh, Murugaesan K. Venue: 2019 International Symposium on Ocean Technology (SYMPOL 2019). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0109","type":"publication","title":"Texture Analysis on Side Scan Sonar images using EMD XCS-LBP and Statistical Co-Occurence","date":"2019","organization":"2019 International Symposium on Ocean Technology (SYMPOL 2019)","authors":"Dhanalakshmi M, Sakthivel Murugan S, Padmapriya N, Somasekar M","doi":"","subtype":"Conference","summary":"Authors: Dhanalakshmi M, Sakthivel Murugan S, Padmapriya N, Somasekar M. Venue: 2019 International Symposium on Ocean Technology (SYMPOL 2019). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0110","type":"publication","title":"Analysis of Various De-hazing algorithms for Underwater images","date":"2019","organization":"2019 International Symposium on Ocean Technology (SYMPOL 2019)","authors":"Mary Cecilia S, Sakthivel Murugan S, Padmapriya N","doi":"","subtype":"Conference","summary":"Authors: Mary Cecilia S, Sakthivel Murugan S, Padmapriya N. Venue: 2019 International Symposium on Ocean Technology (SYMPOL 2019). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0111","type":"publication","title":"Side Scan Sonar images based ocean bottom sediment classification","date":"2019","organization":"2019 International Symposium on Ocean Technology (SYMPOL 2019)","authors":"Annalakshmi G, Sakthivel Murugan S, Ramasundaram K","doi":"","subtype":"Conference","summary":"Authors: Annalakshmi G, Sakthivel Murugan S, Ramasundaram K. Venue: 2019 International Symposium on Ocean Technology (SYMPOL 2019). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0112","type":"publication","title":"Underwater Image Classification using Machine Learning Technique","date":"2019","organization":"2019 International Symposium on Ocean Technology (SYMPOL 2019)","authors":"Vimal Raj M, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Vimal Raj M, Sakthivel Murugan S. Venue: 2019 International Symposium on Ocean Technology (SYMPOL 2019). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0113","type":"publication","title":"Feature Matching and Assessment of similarity rate on geometrically distorted side scan sonar images","date":"2019","organization":"International Conference on Microwave Integrated Circuits Photonics and Wireless Networks (IMICPW - 2019)","authors":"Dhanalakshmi M, Vimal Raj M, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Dhanalakshmi M, Vimal Raj M, Sakthivel Murugan S. Venue: International Conference on Microwave Integrated Circuits Photonics and Wireless Networks (IMICPW - 2019). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0114","type":"publication","title":"Design and implementation of secured cloud based remote home access through an app for smart infrastructure","date":"2019","organization":"International conference on frontiers in smart system technologies","authors":"A.S.Shashank Karthikeyan, R.Priyadarshni, Revathi.G, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: A.S.Shashank Karthikeyan, R.Priyadarshni, Revathi.G, Sakthivel Murugan S. Venue: International conference on frontiers in smart system technologies. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0115","type":"publication","title":"Development of smart electricity energy harvesting system using IoT","date":"2019","organization":"International conference on frontiers in smart system technologies","authors":"S.Nikitha, Zohra Noori Mohsina, Sneha V, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: S.Nikitha, Zohra Noori Mohsina, Sneha V, Sakthivel Murugan S. Venue: International conference on frontiers in smart system technologies. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0116","type":"publication","title":"Design of galvanic cell battery for underwater applications using seawater as electrolyte","date":"2019","organization":"International Conference on Emerging Trends in Science Engineering & Technology (ICETSET 2019)","authors":"Thirumalini, Deepika, K.Muhumeenakshi, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Thirumalini, Deepika, K.Muhumeenakshi, Sakthivel Murugan S. Venue: International Conference on Emerging Trends in Science Engineering & Technology (ICETSET 2019). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0117","type":"publication","title":"Studies on water column nutrient distribution and sound profile variations along coastal region of India","date":"2018","organization":"176th Meeting of the Acoustical Society of America","authors":"Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S. Venue: 176th Meeting of the Acoustical Society of America. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0118","type":"publication","title":"Segmentation of underwater acoustic images by FCM with EMD","date":"2018","organization":"176th Meeting of the Acoustical Society of America","authors":"Sakthivel Murugan S, Somasekar M","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S, Somasekar M. Venue: 176th Meeting of the Acoustical Society of America. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0119","type":"publication","title":"Design and development of energy harvesting system using seawater for underwater applications","date":"2018","organization":"Student Engineering Model Competition, India International Science festival, IISF -SEMC 2018","authors":"Arun Kumar B, Hashmat Jeelani B and Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Arun Kumar B, Hashmat Jeelani B and Sakthivel Murugan S. Venue: Student Engineering Model Competition, India International Science festival, IISF -SEMC 2018. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0120","type":"publication","title":"Energy harvesting system using seawater activated battery for underwater applications","date":"2018","organization":"India’s 2nd Tech Surge, Technology and Innovation for Sustainable Fishing (TISF) 2018","authors":"Arun Kumar B, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Arun Kumar B, Sakthivel Murugan S. Venue: India’s 2nd Tech Surge, Technology and Innovation for Sustainable Fishing (TISF) 2018. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0121","type":"publication","title":"Study on Suitable Electrode for Energy Harvesting using Galvanic Cell in Sea water","date":"2018","organization":"4th International Conference on Ocean Engineering (ICOE 2018)","authors":"Nithya Sivakami, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Nithya Sivakami, Sakthivel Murugan S. Venue: 4th International Conference on Ocean Engineering (ICOE 2018). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0122","type":"publication","title":"Feature Extraction of Underwater images by Combining Fuzzy C-Means Color Clustering and LBP Texture Analysis Algorithm with Empirical Mode Decomposition","date":"2018","organization":"4th International Conference on Ocean Engineering (ICOE 2018)","authors":"Somasekar M, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Somasekar M, Sakthivel Murugan S. Venue: 4th International Conference on Ocean Engineering (ICOE 2018). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0123","type":"publication","title":"Analyzing the Physical and Chemical Properties of Water Column Nutrients and Sediments along Southeast Coast of India","date":"2018","organization":"4th International Conference on Ocean Engineering (ICOE 2018)","authors":"Annalakshmi, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Annalakshmi, Sakthivel Murugan S. Venue: 4th International Conference on Ocean Engineering (ICOE 2018). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0124","type":"publication","title":"Investigations on the geo acoustic properties of sediment in poompuhar","date":"2018","organization":"International Conference on Sonar Systems and sensors (ICONS 2018)","authors":"Annalakshmi G, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Annalakshmi G, Sakthivel Murugan S. Venue: International Conference on Sonar Systems and sensors (ICONS 2018). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0125","type":"publication","title":"Geo Acoustic Inversion method for analyzing impact due to sediments in underwater channel","date":"2017","organization":"39th Indian Geotechnical Conference 2017 GeoNEst - 2017","authors":"G.Annalakshmi, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: G.Annalakshmi, Sakthivel Murugan S. Venue: 39th Indian Geotechnical Conference 2017 GeoNEst - 2017. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0126","type":"publication","title":"A Survey on Fuzzy C Means algorithm using Empirical mode Decomposition for Underwater Image Enhancement","date":"2017","organization":"5th International Conference on Ship and Offshore Technology - India, ICSOT 2017","authors":"Somasekar.M, Sakthivel Murugan S, N.Pradeesha, N.Padmapriya","doi":"","subtype":"Conference","summary":"Authors: Somasekar.M, Sakthivel Murugan S, N.Pradeesha, N.Padmapriya. Venue: 5th International Conference on Ship and Offshore Technology - India, ICSOT 2017. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0127","type":"publication","title":"Implementation of acoustic Propagation model for predicting ocean bottom in geo - acoustic inversion","date":"2017","organization":"5th International Conference on Ship and Offshore Technology - India, ICSOT 2017","authors":"Annalakshmi G, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Annalakshmi G, Sakthivel Murugan S. Venue: 5th International Conference on Ship and Offshore Technology - India, ICSOT 2017. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0128","type":"publication","title":"Sensor based detection and modelling of submerged objects for conservation of ancient heritage","date":"2016","organization":"2nd India International Science Festival 2016","authors":"Pradeesha S K, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Pradeesha S K, Sakthivel Murugan S. Venue: 2nd India International Science Festival 2016. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0129","type":"publication","title":"Development of high frequency underwater acoustic modem","date":"2016","organization":"2nd India International Science Festival 2016","authors":"Annalakshmi G, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Annalakshmi G, Sakthivel Murugan S. Venue: 2nd India International Science Festival 2016. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0130","type":"publication","title":"Development of Geo acoustic Inversion model predicting sediment transport causing submergence","date":"2016","organization":"2nd India International Science Festival 2016","authors":"Harshitha D, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Harshitha D, Sakthivel Murugan S. Venue: 2nd India International Science Festival 2016. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0131","type":"publication","title":"Design and Implementation of an Energy harvesting system using MFC with Marine sediments for underwater Applications","date":"2016","organization":"4th International conference on Oceanography and Marine Biology (Oceanography 2016)","authors":"Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S. Venue: 4th International conference on Oceanography and Marine Biology (Oceanography 2016). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0132","type":"publication","title":"Performance analysis of an energy efficient cross layer protocol for underwater acoustic wireless sensor network","date":"2016","organization":"4th International conference on Oceanography and Marine Biology (Oceanography 2016)","authors":"Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan S. Venue: 4th International conference on Oceanography and Marine Biology (Oceanography 2016). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0133","type":"publication","title":"An Efficient MI waveguide based Underground wireless Communication for Smart Irrigation","date":"2017","organization":"14th IEEE India Council International conference INDICON 2017","authors":"Swathi S, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Swathi S, Sakthivel Murugan S. Venue: 14th IEEE India Council International conference INDICON 2017. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0134","type":"publication","title":"Empirical Mode Decomposition By Weight Optimization For Amelioration Of Underwater Images","date":"2017","organization":"OSICON 2017","authors":"M.Somasekar, Sakthivel Murugan S, K.Pradeesh","doi":"","subtype":"Conference","summary":"Authors: M.Somasekar, Sakthivel Murugan S, K.Pradeesh. Venue: OSICON 2017. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0135","type":"publication","title":"Mac Layer Optimization For Cluster Based Auv Localization In Deep Water Surveillance","date":"2017","organization":"OSICON 2017","authors":"R.Logeshwaran, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: R.Logeshwaran, Sakthivel Murugan S. Venue: OSICON 2017. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0136","type":"publication","title":"Performance Analysis of Magnetic Induction Technique over Electromagnetic Wave Technique for Underground Wireless Communication","date":"2017","organization":"International Conference on Emerging Trends in Science & Engineering (ICETSE – 2107)","authors":"Swathi S, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Swathi S, Sakthivel Murugan S. Venue: International Conference on Emerging Trends in Science & Engineering (ICETSE – 2107). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0137","type":"publication","title":"Study and Analysis of Various Modulation Techniques for Underwater Communication","date":"2017","organization":"International Conference on Emerging Trends in Science & Engineering (ICETSE – 2107)","authors":"Hasthi Gowthami, Brindha Manivannan, Heera Parvin Azam, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Hasthi Gowthami, Brindha Manivannan, Heera Parvin Azam, Sakthivel Murugan S. Venue: International Conference on Emerging Trends in Science & Engineering (ICETSE – 2107). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0138","type":"publication","title":"Magnetic Induction based wireless underground sensor network system for agriculture automation","date":"2016","organization":"2nd India International Science Festival 2016","authors":"Swathi S, Sakthivel Murugan S","doi":"","subtype":"Conference","summary":"Authors: Swathi S, Sakthivel Murugan S. Venue: 2nd India International Science Festival 2016. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0139","type":"publication","title":"Study of Vertical Coherence in Shallow Water Ambient Noise","date":"2016","organization":"International Conference on Innovative and Emerging Trends in Engineering and Technology 2016","authors":"S.M. Ashabanu, Sakthivel Murugan S, P.Venugopal","doi":"","subtype":"Conference","summary":"Authors: S.M. Ashabanu, Sakthivel Murugan S, P.Venugopal. Venue: International Conference on Innovative and Emerging Trends in Engineering and Technology 2016. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0140","type":"publication","title":"Improving Visual Quality of Underwater Color Images from the Indian Ocean using Adaptive Color and Detail Restoration","date":"2025","organization":"International Conference on Oceans of Opportunity: Bioresources for a Better Tomorrow, BRIC-ILS","authors":"Sabareesan Srinivasan, Muthumeenakshi K, Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Sabareesan Srinivasan, Muthumeenakshi K, Sakthivel Murugan Santhanam. Venue: International Conference on Oceans of Opportunity: Bioresources for a Better Tomorrow, BRIC-ILS. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0141","type":"publication","title":"Underwater Coral Detection using a CBAM Integrated YOLO Model","date":"2025","organization":"International Conference on Oceans of Opportunity: Bioresources for a Better Tomorrow, BRIC-ILS","authors":"Sakthivel Murugan Santhanam, Muthumeenakshi K, Sathya Priya R","doi":"","subtype":"Conference","summary":"Authors: Sakthivel Murugan Santhanam, Muthumeenakshi K, Sathya Priya R. Venue: International Conference on Oceans of Opportunity: Bioresources for a Better Tomorrow, BRIC-ILS. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0142","type":"publication","title":"Adaptive Color Restoration And Detail Restoration in Underwater image enhancement","date":"2025","organization":"7th International Conference on Ocean Engineering (ICOE 2025)","authors":"Sabareesan Srinivasan, Muthumeenakshi K and Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Sabareesan Srinivasan, Muthumeenakshi K and Sakthivel Murugan Santhanam. Venue: 7th International Conference on Ocean Engineering (ICOE 2025). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0143","type":"publication","title":"Enhancing Underwater Image Classification with Object-GCN and Semantic Correlation on Custom Datasets","date":"2025","organization":"International Conference on AI for the Oceans (ICAIO 2025)","authors":"Sathya Priya R, Muthumeenakshi K and Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Sathya Priya R, Muthumeenakshi K and Sakthivel Murugan Santhanam. Venue: International Conference on AI for the Oceans (ICAIO 2025). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0144","type":"publication","title":"MITIGATING THE IMPACT OF DATASET IMBALANCE IN MULTILABEL CLASSIFICATION OF UNDERWATER IMAGES USING BILAYER GRAPH CONVOLUTION LEARNING","date":"2025","organization":"Ninth National Conference of Ocean Society of India (OSICON-25)","authors":"Sathya Priya R, Muthumeenakshi K and Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Sathya Priya R, Muthumeenakshi K and Sakthivel Murugan Santhanam. Venue: Ninth National Conference of Ocean Society of India (OSICON-25). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0145","type":"publication","title":"COLOUR CORRECTION AND CONTRAST ENHANCEMENT OF UNDERWATER CORAL REEF IMAGE","date":"2025","organization":"Ninth National Conference of Ocean Society of India (OSICON-25)","authors":"Sabareesan Srinivasan, Sakthivel Murugan Santhanam and Muthumeenakshi K","doi":"","subtype":"Conference","summary":"Authors: Sabareesan Srinivasan, Sakthivel Murugan Santhanam and Muthumeenakshi K. Venue: Ninth National Conference of Ocean Society of India (OSICON-25). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0146","type":"publication","title":"DEEP-SEA MARINE BIOACOUSTICS: A STUDY OF BEHAVIORAL AND COMMUNICATION PATTERNS IN CATFISH AND DAMSEL FISH","date":"2025","organization":"Ninth National Conference of Ocean Society of India (OSICON-25)","authors":"Karun Pias Aro S, Vishaal S, Sakthivel Murugan S and Muthumeenakshi","doi":"","subtype":"Conference","summary":"Authors: Karun Pias Aro S, Vishaal S, Sakthivel Murugan S and Muthumeenakshi. Venue: Ninth National Conference of Ocean Society of India (OSICON-25). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0147","type":"publication","title":"DESIGN AND FIVE DOF FUNCTIONAL ANALYSIS IN ORCA ROV","date":"2025","organization":"Ninth National Conference of Ocean Society of India (OSICON-25)","authors":"Parvath Balaji R P, Vimal Raj M and Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Parvath Balaji R P, Vimal Raj M and Sakthivel Murugan Santhanam. Venue: Ninth National Conference of Ocean Society of India (OSICON-25). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0148","type":"publication","title":"A SOFTWARE TOOLKIT FOR HIGH RESOLUTION 3D UNDERWATER ENVIRONMENT RECONSTRUCTION USING CUSTOM SLAM FOR HIGHDENSITY DATA COLLECTION","date":"2025","organization":"Ninth National Conference of Ocean Society of India (OSICON-25)","authors":"Johann Sylvester J, Karthayani T S, Sakthivel Murugan S, Muthumeenakshi K","doi":"","subtype":"Conference","summary":"Authors: Johann Sylvester J, Karthayani T S, Sakthivel Murugan S, Muthumeenakshi K. Venue: Ninth National Conference of Ocean Society of India (OSICON-25). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0149","type":"publication","title":"OPTIMIZING UNDERWATER POINT CLOUD GENERATION USING SLAM TECHNIQUES FOR OCEAN FLOOR MAPPING","date":"2025","organization":"Ninth National Conference of Ocean Society of India (OSICON-25)","authors":"Indhra SS, Gowshika J, Sakthivel Murugan S, Muthumeenakshi K","doi":"","subtype":"Conference","summary":"Authors: Indhra SS, Gowshika J, Sakthivel Murugan S, Muthumeenakshi K. Venue: Ninth National Conference of Ocean Society of India (OSICON-25). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0150","type":"publication","title":"INTELLIGENT SLAM-BASED AUTONOMOUS NAVIGATION SYSTEM FOR ROVS IN CONFINED UNDERWATER ENVIRONMENTS","date":"2025","organization":"Ninth National Conference of Ocean Society of India (OSICON-25)","authors":"Divya Jha, Fadhil Syed Kader, Sakthivel Murugan S, Muthumeenakshi K","doi":"","subtype":"Conference","summary":"Authors: Divya Jha, Fadhil Syed Kader, Sakthivel Murugan S, Muthumeenakshi K. Venue: Ninth National Conference of Ocean Society of India (OSICON-25). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0151","type":"publication","title":"Feature Extraction and Classification on Underwater Blurred Images","date":"2024","organization":"5th International Conference on Recent Trends in Engineering and Technology (ICRTET - 2024)","authors":"M. Vimal Raj, S. Sakthivel Murugan, S. Nisha Nethraa, M. Pranav","doi":"","subtype":"Conference","summary":"Authors: M. Vimal Raj, S. Sakthivel Murugan, S. Nisha Nethraa, M. Pranav. Venue: 5th International Conference on Recent Trends in Engineering and Technology (ICRTET - 2024). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0153","type":"publication","title":"A study on passive acoustics monitoring of underwater species – black tilapia","date":"2023","organization":"3rd International Conference on Signal & Data Processing (ICSDP) 2023","authors":"V. Janakiam, C.S. Akkash Anniyappa, Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: V. Janakiam, C.S. Akkash Anniyappa, Sakthivel Murugan Santhanam. Venue: 3rd International Conference on Signal & Data Processing (ICSDP) 2023. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0154","type":"publication","title":"Augmenting Remotely Operated Vehicles with Autonomous Robotic Manipulators","date":"2023","organization":"3rd International Conference on Signal & Data Processing (ICSDP) 2023","authors":"A. Anirudh, Karthik Raja Anandan, Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: A. Anirudh, Karthik Raja Anandan, Sakthivel Murugan Santhanam. Venue: 3rd International Conference on Signal & Data Processing (ICSDP) 2023. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0155","type":"publication","title":"Illumination correction and restoration of blurred underwater images","date":"2023","organization":"OSICON-23","authors":"Vimal Raj M., Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Vimal Raj M., Sakthivel Murugan Santhanam. Venue: OSICON-23. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0156","type":"publication","title":"Analysis of Various Controllers and Control Systems of a Remotely Operated Vehicle for Stabilized Navigation","date":"2023","organization":"OSICON-23","authors":"Sree Harine Govindaraj, Sandhya B, Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Sree Harine Govindaraj, Sandhya B, Sakthivel Murugan Santhanam. Venue: OSICON-23. DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0159","type":"publication","title":"Performance Analysis of N40 Permanent Magnet using PMSLG for Wave energy conversion","date":"2022","organization":"International Conference on Power Electronics Smart Grid and Renewable energy (PESGRE 2022)","authors":"Mubeena Parveen S, Nelson S, Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Mubeena Parveen S, Nelson S, Sakthivel Murugan Santhanam. Venue: International Conference on Power Electronics Smart Grid and Renewable energy (PESGRE 2022). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0160","type":"publication","title":"Influence of Various Soil Types and its Properties on Filamentary Planar Coil based Magnetic Induction Communication System","date":"2021","organization":"Twenty Seventh National Conference on Communications (NCC-2021)","authors":"Swathi Sugumar and Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Swathi Sugumar and Sakthivel Murugan Santhanam. Venue: Twenty Seventh National Conference on Communications (NCC-2021). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0161","type":"publication","title":"Visibility Restoration of Diverse Turbid Underwater Images- Two Step Approach","date":"2021","organization":"Twenty Seventh National Conference on Communications (NCC-2021)","authors":"S. Mary Cecilia and Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: S. Mary Cecilia and Sakthivel Murugan Santhanam. Venue: Twenty Seventh National Conference on Communications (NCC-2021). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0162","type":"publication","title":"Motion Deblurring Analysis for Underwater Image Restoration","date":"2021","organization":"1st International Conference on Innovative Technology for Sustainable Development (ICITSD-2021)","authors":"Vimal Raj M., Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Vimal Raj M., Sakthivel Murugan Santhanam. Venue: 1st International Conference on Innovative Technology for Sustainable Development (ICITSD-2021). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0163","type":"publication","title":"Edge Aware Turbidity Restoration of Single Shallow Coastal Water Image","date":"2021","organization":"1st International Conference on Innovative Technology for Sustainable Development (ICITSD-2021)","authors":"Mary Cecilia S., Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Mary Cecilia S., Sakthivel Murugan Santhanam. Venue: 1st International Conference on Innovative Technology for Sustainable Development (ICITSD-2021). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0164","type":"publication","title":"Development of a Navigation and Position Tracking System for a Remotely Operated Vehicle (ROV) – ORCA","date":"2021","organization":"1st International Conference on Innovative Technology for Sustainable Development (ICITSD-2021)","authors":"Tejaswini Panati, Sai Deepika I, Sakthivel Murugan Santhanam","doi":"","subtype":"Conference","summary":"Authors: Tejaswini Panati, Sai Deepika I, Sakthivel Murugan Santhanam. Venue: 1st International Conference on Innovative Technology for Sustainable Development (ICITSD-2021). DOI: ","tags":["Conference"],"attachments":[]},{"id":"pub-0167","type":"publication","title":"Communication Theory","date":"2018","organization":"McGraw Hill","authors":"Sakthivel Murugan S","doi":"","subtype":"Book","summary":"Authors: Sakthivel Murugan S. Venue: McGraw Hill. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0168","type":"publication","title":"Communication Engineering","date":"2013","organization":"Second Edition","authors":"Sakthivel Murugan S","doi":"","subtype":"Book","summary":"Authors: Sakthivel Murugan S. Venue: Second Edition. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0169","type":"publication","title":"Principles of Communication","date":"2014","organization":"First edition","authors":"Sakthivel Murugan S","doi":"","subtype":"Book","summary":"Authors: Sakthivel Murugan S. Venue: First edition. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0170","type":"publication","title":"Analog and Digital Communication","date":"2010","organization":"Second Edition","authors":"Sakthivel Murugan S","doi":"","subtype":"Book","summary":"Authors: Sakthivel Murugan S. Venue: Second Edition. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0171","type":"publication","title":"Principles of Analog and Digital Communications","date":"2006","organization":"First edition","authors":"Sakthivel Murugan S","doi":"","subtype":"Book","summary":"Authors: Sakthivel Murugan S. Venue: First edition. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0172","type":"publication","title":"Communication Engineering","date":"2013","organization":"First Edition","authors":"Sakthivel Murugan S","doi":"","subtype":"Book","summary":"Authors: Sakthivel Murugan S. Venue: First Edition. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0173","type":"publication","title":"Electrical Engineering Principles and Application","date":"","organization":"International Edition – 6th","authors":"Allan R. Hambley (Reviewed by Sakthivel Murugan S)","doi":"","subtype":"Book","summary":"Authors: Allan R. Hambley (Reviewed by Sakthivel Murugan S). Venue: International Edition – 6th. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0174","type":"publication","title":"Adaptive Filter Theory","date":"","organization":"International Edition - 5th","authors":"Simon Haykin (Reviewed by Sakthivel Murugan S)","doi":"","subtype":"Book","summary":"Authors: Simon Haykin (Reviewed by Sakthivel Murugan S). Venue: International Edition - 5th. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0175","type":"publication","title":"Electromagnetic Engineering and Waves","date":"","organization":"International edition – 2nd","authors":"Inan/ Said (Reviewed by Sakthivel Murugan S)","doi":"","subtype":"Book","summary":"Authors: Inan/ Said (Reviewed by Sakthivel Murugan S). Venue: International edition – 2nd. DOI: ","tags":["Book"],"attachments":[]},{"id":"pub-0176","type":"publication","title":"Fundamentals of Communication Systems","date":"","organization":"International edition -2nd","authors":"(Reviewed by Sakthivel Murugan S)","doi":"","subtype":"Book","summary":"Authors: (Reviewed by Sakthivel Murugan S). Venue: International edition -2nd. DOI: ","tags":["Book"],"attachments":[]},{"id":"bos-0001","type":"bos","title":"Expert Member","date":"2025-07-03","organization":"Board of Studies","summary":"Served as expert member for AU – CAC – Affiliated Institutions (Non – Autonomous) – B.Tech. Electronics Engineering (VLSI Design & Technology), M.E. VLSI Design & M.E. Applied Electronics programmes.","tags":["Board of Studies"],"attachments":[]},{"id":"dc-0001","type":"dc","title":"Mr. K. Balaji","date":"2024-12-01","organization":"Anna University","mode":"Online","summary":"Institution: Anna University.","tags":[],"attachments":[]},{"id":"dc-0002","type":"dc","title":"Ms. H. Mary Shyni","date":"2024-12-01","organization":"SRM Kattankulathur","mode":"Online","summary":"Institution: SRM Kattankulathur.","tags":[],"attachments":[]},{"id":"dc-0003","type":"dc","title":"Mr. Janarthanan M","date":"2024-12-01","organization":"SRM Vadapalani","mode":"Online","summary":"Institution: SRM Vadapalani.","tags":[],"attachments":[]},{"id":"dc-0004","type":"dc","title":"Dr. K. Chitra","date":"2025-01-01","organization":"SRM University, Kattankulathur","mode":"Online","summary":"Institution: SRM University, Kattankulathur.","tags":[],"attachments":[]},{"id":"dc-0005","type":"dc","title":"Ramya S","date":"2025-02-01","organization":"SRM University, Kattankulathur","mode":"Online","summary":"Institution: SRM University, Kattankulathur.","tags":[],"attachments":[]},{"id":"dc-0006","type":"dc","title":"Academic Activities Committee","date":"2025-02-01","organization":"Institute Level","mode":"Offline","summary":"Institution: Institute Level.","tags":[],"attachments":[]},{"id":"dc-0007","type":"dc","title":"Technical Evaluation Committee","date":"2025-02-01","organization":"IITTNiF (IIT Tirupati)","mode":"Online","summary":"Institution: IITTNiF (IIT Tirupati).","tags":[],"attachments":[]},{"id":"dc-0008","type":"dc","title":"Ms. N. T. Velusudha","date":"2025-02-01","organization":"SSN College of Engineering","mode":"Online","summary":"Institution: SSN College of Engineering.","tags":[],"attachments":[]},{"id":"dc-0009","type":"dc","title":"Ms. Bharanidivya M","date":"2025-02-01","organization":"SRM Institute of Science and Tech","mode":"Online","summary":"Institution: SRM Institute of Science and Tech.","tags":[],"attachments":[]},{"id":"dc-0010","type":"dc","title":"Mr. M. Vimalraj","date":"2025-07-01","organization":"Part Time Scholar","mode":"Online","summary":"Institution: Part Time Scholar.","tags":[],"attachments":[]},{"id":"dc-0011","type":"dc","title":"Ms. T. Kamizhelakkiya","date":"2025-09-01","organization":"SRM University","mode":"Offline","summary":"Institution: SRM University.","tags":[],"attachments":[]},{"id":"dc-0012","type":"dc","title":"Ms. Moganavalli C B","date":"2025-10-01","organization":"RAP Meeting","mode":"Online","summary":"Institution: RAP Meeting.","tags":[],"attachments":[]},{"id":"dc-0013","type":"dc","title":"Mr. Senthil Vel Murugan E","date":"2025-10-01","organization":"RAP Meeting","mode":"Online","summary":"Institution: RAP Meeting.","tags":[],"attachments":[]},{"id":"dc-0014","type":"dc","title":"PhD Scholar","date":"2025-11-01","organization":"Anna University","mode":"Online","summary":"Institution: Anna University.","tags":[],"attachments":[]},{"id":"dc-0015","type":"dc","title":"Ms. S. Aruna Devi","date":"2026-01-01","organization":"Anna University","mode":"Online","summary":"Institution: Anna University.","tags":[],"attachments":[]},{"id":"dc-0016","type":"dc","title":"Ms. S. V. Sarojini","date":"2026-01-01","organization":"Anna University","mode":"Online","summary":"Institution: Anna University.","tags":[],"attachments":[]},{"id":"host-0001","type":"host","title":"Writing Successful Research Proposals for Funding","date":"2025-03-27","organization":"Coimbatore Institute of Technology (CIT)","code":"—","duration":"1 day","mode":"Contact","role":"Coordinator & Resource Person","summary":"Host: Coimbatore Institute of Technology (CIT). Duration: 1 day. Mode: Contact.","tags":[],"attachments":[]},{"id":"itec-0001","type":"itec","title":"Leveraging Drone Technology for SDGs and Promoting Entrepreneurship","date":"2025-09-17","organization":"ITEC Programme","code":"","duration":"1.30 pm - 4.30 pm","mode":"Contact","role":"Resource Person","summary":"Duration: 1.30 pm - 4.30 pm. Mode: Contact.","tags":[],"attachments":[]},{"id":"itec-0002","type":"itec","title":"Skill Development in Electronics for TVET Trainers and Planners","date":"2025-02-01","organization":"ITEC Programme","code":"","duration":"09:30 am - 12:45 pm","mode":"Contact","role":"Resource Person","summary":"Duration: 09:30 am - 12:45 pm. Mode: Contact.","tags":[],"attachments":[]},{"id":"itp-0001","type":"itp","title":"Industrial Training Programme for EIE and ECE","date":"2026-02-04","organization":"Industrial Training Programme","code":"ITP-14","duration":"3 weeks","mode":"Contact","role":"Coordinator & Resource Person","summary":"Code: ITP-14. Duration: 3 weeks. Mode: Contact.","tags":[],"attachments":[]},{"id":"itp-0002","type":"itp","title":"Industrial Training Programme for EIE and ECE","date":"2026-02-13","organization":"Industrial Training Programme","code":"ITP-14","duration":"3 weeks","mode":"Contact","role":"Coordinator & Resource Person","summary":"Code: ITP-14. Duration: 3 weeks. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0001","type":"pdp","title":"Measurement and Control for Industrial Automation","date":"2026-03-12","organization":"SSN College of Engineering","code":"","duration":"09.03.2026 - 13.03.2026","mode":"Contact","summary":"Code: nan. Duration: 09.03.2026 - 13.03.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0002","type":"pdp","title":"Autonomous Systems and its Applications","date":"2026-03-12","organization":"SSN College of Engineering","code":"","duration":"09.03.2026 - 13.03.2026","mode":"Contact","summary":"Code: nan. Duration: 09.03.2026 - 13.03.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0003","type":"pdp","title":"Transformative Engineering Education Through Design Thinking and EdTech Integration","date":"2026-03-19","organization":"SSN College of Engineering","code":"","duration":"16.03.2026 - 20.03.2026","mode":"Contact","summary":"Code: nan. Duration: 16.03.2026 - 20.03.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0004","type":"pdp","title":"Industrial Training Programme for EIE and ECE","date":"2026-02-13","organization":"SSN College of Engineering","code":"ITP-14","duration":"02.02.2026 - 20.02.2026","mode":"Contact","summary":"Code: ITP-14. Duration: 02.02.2026 - 20.02.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0005","type":"pdp","title":"Industrial Mechatronics","date":"2026-02-12","organization":"SSN College of Engineering","code":"ME-37-364","duration":"09.02.2026 - 13.02.2026","mode":"Contact","summary":"Code: ME-37-364. Duration: 09.02.2026 - 13.02.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0006","type":"pdp","title":"Industrial Training Programme for EIE and ECE","date":"2026-02-04","organization":"SSN College of Engineering","code":"ITP-14","duration":"02.02.2026 - 20.02.2026","mode":"Contact","summary":"Code: ITP-14. Duration: 02.02.2026 - 20.02.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0007","type":"pdp","title":"Television Studio Production and Broadcasting Techniques","date":"2026-02-05","organization":"SSN College of Engineering","code":"EM-31-303","duration":"02.02.2026 - 06.02.2026","mode":"Online","summary":"Code: EM-31-303. Duration: 02.02.2026 - 06.02.2026. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0008","type":"pdp","title":"Robot Modeling and Simulation","date":"2026-02-03","organization":"SSN College of Engineering","code":"ME-24-229","duration":"02.02.2026 - 06.02.2026","mode":"Contact","summary":"Code: ME-24-229. Duration: 02.02.2026 - 06.02.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0009","type":"pdp","title":"INNOVATIVE TEACHING STRATEGIES FOR MODERN LEARNERS","date":"2026-02-20","organization":"SSN College of Engineering","code":"ED-83-369","duration":"16.02.2026 - 20.02.2026","mode":"Contact","summary":"Code: ED-83-369. Duration: 16.02.2026 - 20.02.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0010","type":"pdp","title":"Research Paper Writing made Simple: A Technology Supported Framework","date":"2026-01-07","organization":"SSN College of Engineering","code":"EM-32-331","duration":"05.01.2026 - 09.01.2026","mode":"Contact","summary":"Code: EM-32-331. Duration: 05.01.2026 - 09.01.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0011","type":"pdp","title":"Data Science and Research Analytics Using R Programming","date":"2025-12-19","organization":"SSN College of Engineering","code":"CS-41-298","duration":"15.12.2025 - 19.12.2025","mode":"Contact","summary":"Code: CS-41-298. Duration: 15.12.2025 - 19.12.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0012","type":"pdp","title":"Current Trends and Future Directions In Unmanned Aerial Vehicles","date":"2025-12-19","organization":"SSN College of Engineering","code":"ME-33-316","duration":"15.12.2025 - 19.12.2025","mode":"Contact","summary":"Code: ME-33-316. Duration: 15.12.2025 - 19.12.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0013","type":"pdp","title":"Agentic AI for Problem Solving in Real-World Applications","date":"2025-12-09","organization":"SSN College of Engineering","code":"CS-40-297","duration":"08.12.2025 - 12.12.2025","mode":"Contact","summary":"Code: CS-40-297. Duration: 08.12.2025 - 12.12.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0014","type":"pdp","title":"Exploring Recent Advances and Applications in Transfer Learning","date":"2025-11-13","organization":"SSN College of Engineering","code":"CS-34-267","duration":"10.11.2025 - 14.11.2025","mode":"Contact","summary":"Code: CS-34-267. Duration: 10.11.2025 - 14.11.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0015","type":"pdp","title":"Application of Generative AI for Question Paper Setting (BTL)","date":"2025-09-23","organization":"SSN College of Engineering","code":"CD-29-219","duration":"22.09.2025 - 26.09.2025","mode":"Contact","summary":"Code: CD-29-219. Duration: 22.09.2025 - 26.09.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0016","type":"pdp","title":"Effective Research Proposal Writing","date":"2025-09-10","organization":"SSN College of Engineering","code":"ED-43-196","duration":"08.09.2025 - 12.09.2025","mode":"Contact","summary":"Code: ED-43-196. Duration: 08.09.2025 - 12.09.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0017","type":"pdp","title":"Mastering in Research Article Writing and Grant Proposal Drafting","date":"2025-09-10","organization":"SSN College of Engineering","code":"EM-24-239","duration":"08.09.2025 - 12.09.2025","mode":"Contact","summary":"Code: EM-24-239. Duration: 08.09.2025 - 12.09.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0018","type":"pdp","title":"Smart UAV Systems: Leveraging loT and Image Processing","date":"2025-08-19","organization":"SSN College of Engineering","code":"ME-18-182","duration":"18.08.2025 - 22.08.2025","mode":"Online","summary":"Code: ME-18-182. Duration: 18.08.2025 - 22.08.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0019","type":"pdp","title":"Developing a Curriculum Framework Aligned with NEP 2020","date":"2025-08-06","organization":"SSN College of Engineering","code":"CD-19-153","duration":"04.08.2025 - 08.08.2025","mode":"Online","summary":"Code: CD-19-153. Duration: 04.08.2025 - 08.08.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0020","type":"pdp","title":"Advanced Pedagogical Strategies for STEM Learning","date":"2025-08-07","organization":"SSN College of Engineering","code":"CS-20-150","duration":"04.08.2025 - 08.08.2025","mode":"Online","summary":"Code: CS-20-150. Duration: 04.08.2025 - 08.08.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0021","type":"pdp","title":"Networking and Data Communication","date":"2025-08-05","organization":"SSN College of Engineering","code":"EC-10-158","duration":"04.08.2025 - 08.08.2025","mode":"Online","summary":"Code: EC-10-158. Duration: 04.08.2025 - 08.08.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0022","type":"pdp","title":"Tech driven Research Paper Writing","date":"2025-07-16","organization":"SSN College of Engineering","code":"EM-15-112","duration":"14.07.2025 - 18.07.2025","mode":"Contact","summary":"Code: EM-15-112. Duration: 14.07.2025 - 18.07.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0023","type":"pdp","title":"Empowering Text Intelligence Through NLP","date":"2025-07-11","organization":"SSN College of Engineering","code":"CS-13-101","duration":"07.07.2025 - 11.07.2025","mode":"Contact","summary":"Code: CS-13-101. Duration: 07.07.2025 - 11.07.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0024","type":"pdp","title":"Strategic Thinking with AI: Multimedia Potential","date":"2025-03-20","organization":"SSN College of Engineering","code":"EM-27-320","duration":"17.03.2025 - 21.03.2025","mode":"Online","summary":"Code: EM-27-320. Duration: 17.03.2025 - 21.03.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0025","type":"pdp","title":"Quality Management","date":"2025-03-12","organization":"SSN College of Engineering","code":"RE-34-314","duration":"10.03.2025 - 14.03.2025","mode":"Online","summary":"Code: RE-34-314. Duration: 10.03.2025 - 14.03.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0026","type":"pdp","title":"Wireless Communication","date":"2025-03-10","organization":"SSN College of Engineering","code":"EC-12-312","duration":"10.03.2025 - 14.03.2025","mode":"Online","summary":"Code: EC-12-312. Duration: 10.03.2025 - 14.03.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0027","type":"pdp","title":"Advancement in Robotics","date":"2025-02-17","organization":"SSN College of Engineering","code":"ME-49-286","duration":"17.02.2025 - 21.02.2025","mode":"Contact","summary":"Code: ME-49-286. Duration: 17.02.2025 - 21.02.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0028","type":"pdp","title":"Technical Research to Publication Practical Insights","date":"2025-02-24","organization":"SSN College of Engineering","code":"CD-31-288","duration":"24.02.2025 - 28.02.2025","mode":"Contact","summary":"Code: CD-31-288. Duration: 24.02.2025 - 28.02.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0029","type":"pdp","title":"Design Thinking for Entrepreneurship","date":"2025-02-11","organization":"SSN College of Engineering","code":"RE-31-279","duration":"10.02.2025 - 14.02.2025","mode":"Contact","summary":"Code: RE-31-279. Duration: 10.02.2025 - 14.02.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0030","type":"pdp","title":"Innovation & Startup in Under Water","date":"2025-01-28","organization":"SSN College of Engineering","code":"RE-29-261","duration":"27.01.2025 - 31.01.2025","mode":"Contact","summary":"Code: RE-29-261. Duration: 27.01.2025 - 31.01.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0031","type":"pdp","title":"Robot Modeling and Simulation","date":"2025-01-09","organization":"SSN College of Engineering","code":"ME-13-61","duration":"06.01.2025 - 10.01.2025","mode":"Contact","summary":"Code: ME-13-61. Duration: 06.01.2025 - 10.01.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0032","type":"pdp","title":"Sensors and Instrumentation","date":"2024-12-17","organization":"SSN College of Engineering","code":"EE-21-230","duration":"16.12.2024 - 20.12.2024","mode":"Online","summary":"Code: EE-21-230. Duration: 16.12.2024 - 20.12.2024. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0033","type":"pdp","title":"Product development for entrepreneurship","date":"2024-12-06","organization":"SSN College of Engineering","code":"RE-25-215","duration":"02.12.2024 - 06.12.2024","mode":"Online","summary":"Code: RE-25-215. Duration: 02.12.2024 - 06.12.2024. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0034","type":"pdp","title":"Research Article, Thesis Writing and IPR","date":"2024-12-18","organization":"SSN College of Engineering","code":"Null","duration":"16.12.2024 - 20.12.2024","mode":"Contact","summary":"Code: Null. Duration: 16.12.2024 - 20.12.2024. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0035","type":"pdp","title":"Concept to Creation: Design Thinking","date":"2024-12-05","organization":"SSN College of Engineering","code":"RE-21-199","duration":"02.12.2024 - 06.12.2024","mode":"Online","summary":"Code: RE-21-199. Duration: 02.12.2024 - 06.12.2024. Mode: Online.","tags":[],"attachments":[]},{"id":"pdp-0036","type":"pdp","title":"Course Material Preparation Workshop C.24.1","date":"2024-11-20","organization":"SSN College of Engineering","code":"CD-22-190","duration":"19.11.2024 - 23.11.2024","mode":"Contact","summary":"Code: CD-22-190. Duration: 19.11.2024 - 23.11.2024. Mode: Contact.","tags":[],"attachments":[]},{"id":"pdp-0037","type":"pdp","title":"Present and Future Trends in UAVs","date":"2024-11-19","organization":"SSN College of Engineering","code":"ME-35-198","duration":"18.11.2024 - 22.11.2024","mode":"Online","summary":"Code: ME-35-198. Duration: 18.11.2024 - 22.11.2024. Mode: Online.","tags":[],"attachments":[]},{"id":"coord-0001","type":"coord","title":"Unmanned and Manned Underwater robots and its applications","date":"2026-03-23","organization":"SSN College of Engineering","code":"EC-27-405","duration":"23.03.2026 - 27.03.2026","mode":"Hybrid","summary":"Code: EC-27-405. Duration: 23.03.2026 - 27.03.2026. Mode: Hybrid.","tags":[],"attachments":[]},{"id":"coord-0002","type":"coord","title":"Industrial IoT 4.0 and Beyond Empowering Smart Industries","date":"2026-02-23","organization":"SSN College of Engineering","code":"EC-24-377","duration":"23.02.2026 - 27.02.2026","mode":"Contact","summary":"Code: EC-24-377. Duration: 23.02.2026 - 27.02.2026. Mode: Contact.","tags":[],"attachments":[]},{"id":"coord-0003","type":"coord","title":"Role of wireless Sensor Networks","date":"2026-01-27","organization":"SSN College of Engineering","code":"EC-22-344","duration":"27.01.2026 - 31.01.2026","mode":"Hybrid","summary":"Code: EC-22-344. Duration: 27.01.2026 - 31.01.2026. Mode: Hybrid.","tags":[],"attachments":[]},{"id":"coord-0004","type":"coord","title":"Technical Transformation from I to E (Innovator to Entrepreneur through Incubation) in an Engineering Perspective","date":"2025-12-15","organization":"SSN College of Engineering","code":"","duration":"15.12.2025 - 19.12.2025","mode":"Contact","summary":"Code: nan. Duration: 15.12.2025 - 19.12.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"coord-0005","type":"coord","title":"Quality 3P (Paper, patent and Projects) for an academician from Engineering Perspective","date":"2025-12-01","organization":"SSN College of Engineering","code":"SP-20","duration":"01.12.2025 - 05.12.2025","mode":"Hybrid","summary":"Code: SP-20. Duration: 01.12.2025 - 05.12.2025. Mode: Hybrid.","tags":[],"attachments":[]},{"id":"coord-0006","type":"coord","title":"Hands on Training: Drafting and review insights on Technical Proposals for funding","date":"2025-11-17","organization":"SSN College of Engineering","code":"EC-20-281","duration":"17.11.2025 - 21.11.2025","mode":"Hybrid","summary":"Code: EC-20-281. Duration: 17.11.2025 - 21.11.2025. Mode: Hybrid.","tags":[],"attachments":[]},{"id":"coord-0007","type":"coord","title":"Enabling Modern Communication through Radar and Satellites","date":"2025-10-13","organization":"SSN College of Engineering","code":"EC-17-246","duration":"13.10.2025 - 17.10.2025","mode":"Online","summary":"Code: EC-17-246. Duration: 13.10.2025 - 17.10.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"coord-0008","type":"coord","title":"Imaging Sensors: Data Interpretation with ML and DL","date":"2025-09-15","organization":"SSN College of Engineering","code":"EC-02-11","duration":"15.09.2025 - 19.09.2025","mode":"Online","summary":"Code: EC-02-11. Duration: 15.09.2025 - 19.09.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"coord-0009","type":"coord","title":"Underwater Sensors and its Applications","date":"2025-08-18","organization":"SSN College of Engineering","code":"EC-12-177","duration":"18.08.2025 - 22.08.2025","mode":"Online","summary":"Code: EC-12-177. Duration: 18.08.2025 - 22.08.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"coord-0010","type":"coord","title":"Core and Interdisciplinary Research Methodology and IPR","date":"2025-03-24","organization":"SSN College of Engineering","code":"ED-67-299","duration":"24.03.2025 - 28.03.2025","mode":"Online","summary":"Code: ED-67-299. Duration: 24.03.2025 - 28.03.2025. Mode: Online.","tags":[],"attachments":[]},{"id":"coord-0011","type":"coord","title":"Effective Funding and Consultancy Proposal Writing","date":"2025-01-27","organization":"SSN College of Engineering","code":"ED-55-256","duration":"27.01.2025 - 31.01.2025","mode":"Contact","summary":"Code: ED-55-256. Duration: 27.01.2025 - 31.01.2025. Mode: Contact.","tags":[],"attachments":[]},{"id":"coord-0012","type":"coord","title":"Communication systems and Its application in Underwater","date":"2024-12-16","organization":"SSN College of Engineering","code":"EC-09-229","duration":"16.12.2024 - 20.12.2024","mode":"Online","summary":"Code: EC-09-229. Duration: 16.12.2024 - 20.12.2024. Mode: Online.","tags":[],"attachments":[]},{"id":"coord-0013","type":"coord","title":"Role of Underwater sensors in Ocean technology","date":"2024-11-25","organization":"SSN College of Engineering","code":"EC-06-204","duration":"25.11.2024 - 29.11.2024","mode":"Online","summary":"Code: EC-06-204. Duration: 25.11.2024 - 29.11.2024. Mode: Online.","tags":[],"attachments":[]},{"id":"pg-0001","type":"pg","title":"Embedded Wireless Sensor Networks","date":"2025","organization":"M.Tech VLSI Embedded System","code":"VE24P13","duration":"2","mode":"24","summary":"Programme: M.Tech VLSI Embedded System. Subject Code: VE24P13. Semester: 2. Students: 24","tags":[],"attachments":[]},{"id":"pg-0002","type":"pg","title":"Embedded Wireless Sensor Networks","date":"2025","organization":"M.Tech VLSI Embedded System","code":"VE24P13","duration":"1","mode":"18","summary":"Programme: M.Tech VLSI Embedded System. Subject Code: VE24P13. Semester: 1. Students: 18","tags":[],"attachments":[]},{"id":"pg-0003","type":"pg","title":"Network Embedded Application","date":"2026","organization":"M.Tech VLSI Embedded System","code":"VE24B12","duration":"2","mode":"18","summary":"Programme: M.Tech VLSI Embedded System. Subject Code: VE24B12. Semester: 2. Students: 18","tags":[],"attachments":[]}]`);
const ASSETS_KEY = "uwarl-db-assets-v1";
function getAssets() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ASSETS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading assets from localStorage:", e);
  }
  return {};
}
function saveAssets(assets) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  } catch (e) {
    console.error("Error saving assets to localStorage:", e);
    alert("Local storage limit reached. Please remove some files to save space.");
  }
}
function resolveAssetUrl(idOrUrl) {
  if (!idOrUrl) return "";
  if (idOrUrl.startsWith("asset_")) {
    const assets = getAssets();
    return assets[idOrUrl]?.url || "";
  }
  return idOrUrl;
}
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
function readPdfAsBase64(file) {
  return new Promise((resolve, reject) => {
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("PDF file size exceeds 2MB limit. Please upload a smaller PDF."));
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      resolve(event.target?.result);
    };
    reader.onerror = (err) => reject(err);
  });
}
async function registerAsset(file, type, category = "", altText = "") {
  const id = `asset_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  let url = "";
  if (type === "image") {
    url = await compressImage(file);
  } else {
    url = await readPdfAsBase64(file);
  }
  const asset = {
    id,
    url,
    type,
    fileName: file.name,
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    altText,
    category
  };
  const assets = getAssets();
  assets[id] = asset;
  saveAssets(assets);
  return id;
}
const RECORDS_KEY = "uwarl-repo-records-v3";
const CAROUSEL_KEY = "uwarl-repo-carousels-v1";
const PAGE_TEXT_KEY = "uwarl-repo-pagetext-v1";
const DEFAULT_CAROUSEL_IMAGES = [
  {
    id: "default-1",
    url: "/images/underwater_robot.png",
    duration: 5,
    order: 1,
    caption: "Autonomous Underwater Vehicle (AUV) Testing"
  },
  {
    id: "default-2",
    url: "/images/academic_seminar.png",
    duration: 5,
    order: 2,
    caption: "Marine Signal Processing Seminar"
  },
  {
    id: "default-3",
    url: "/images/laboratory_workspace.png",
    duration: 5,
    order: 3,
    caption: "Underwater Technology Laboratory Workspace"
  }
];
const DEFAULT_AWARD_CAROUSEL_IMAGES = [
  {
    id: "award-default-1",
    url: "/images/faculty_award.png",
    duration: 5,
    order: 1,
    caption: "Dr. S. Sakthivel Murugan\nBest Teacher Award\nSSN College of Engineering\n2023–2024",
    category: "faculty"
  },
  {
    id: "award-default-2",
    url: "/images/student_award.png",
    duration: 5,
    order: 2,
    caption: "S. Swathi\nBest Poster Presentation Award\nCSIR New Delhi\n2018",
    category: "student"
  }
];
const DEFAULT_CAROUSEL_CONFIG = {
  award: [...DEFAULT_AWARD_CAROUSEL_IMAGES],
  talk: [...DEFAULT_CAROUSEL_IMAGES],
  workshop: [...DEFAULT_CAROUSEL_IMAGES],
  publication: [...DEFAULT_CAROUSEL_IMAGES],
  bos: [...DEFAULT_CAROUSEL_IMAGES],
  dc: [...DEFAULT_CAROUSEL_IMAGES],
  host: [...DEFAULT_CAROUSEL_IMAGES],
  itec: [...DEFAULT_CAROUSEL_IMAGES],
  itp: [...DEFAULT_CAROUSEL_IMAGES],
  pdp: [...DEFAULT_CAROUSEL_IMAGES],
  pg: [...DEFAULT_CAROUSEL_IMAGES],
  coord: [...DEFAULT_CAROUSEL_IMAGES]
};
const isBrowser$1 = typeof window !== "undefined";
function getRecords() {
  if (isBrowser$1) {
    try {
      const raw = localStorage.getItem(RECORDS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading records from localStorage:", e);
    }
  }
  return seedData.map((r) => ({
    ...r,
    attachments: r.attachments ?? [],
    tags: (r.tags ?? []).filter(Boolean)
  }));
}
function saveRecords(records) {
  if (isBrowser$1) {
    try {
      localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
    } catch (e) {
      console.error("Error saving records to localStorage:", e);
      alert(
        "Local storage limit reached. Please delete some records or attachments to free up space."
      );
    }
  }
}
function getCarouselConfig() {
  if (isBrowser$1) {
    try {
      const raw = localStorage.getItem(CAROUSEL_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const merged = { ...DEFAULT_CAROUSEL_CONFIG };
        for (const type of Object.keys(parsed)) {
          merged[type] = parsed[type] || [];
        }
        return merged;
      }
    } catch (e) {
      console.error("Error reading carousel config from localStorage:", e);
    }
  }
  return DEFAULT_CAROUSEL_CONFIG;
}
function saveCarouselConfig(config) {
  if (isBrowser$1) {
    try {
      localStorage.setItem(CAROUSEL_KEY, JSON.stringify(config));
    } catch (e) {
      console.error("Error saving carousel config to localStorage:", e);
      alert(
        "Local storage limit reached. Please reduce the number of images or delete older items to free up space."
      );
    }
  }
}
function getPageTexts() {
  if (isBrowser$1) {
    try {
      const raw = localStorage.getItem(PAGE_TEXT_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error("Error reading page text overrides from localStorage:", e);
    }
  }
  return {};
}
const isBrowser = typeof window !== "undefined";
const datasetCaches = /* @__PURE__ */ new Map();
function getStoredData(key, fallback) {
  if (datasetCaches.has(key)) {
    return datasetCaches.get(key);
  }
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(`uwarl-db-${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && Array.isArray(fallback) && fallback.length > parsed.length) {
        const merged = [...parsed];
        fallback.forEach((item) => {
          if (!merged.some((m) => m.id === item.id)) {
            merged.push(item);
          }
        });
        localStorage.setItem(`uwarl-db-${key}`, JSON.stringify(merged));
        datasetCaches.set(key, merged);
        return merged;
      }
      datasetCaches.set(key, parsed);
      return parsed;
    }
    localStorage.setItem(`uwarl-db-${key}`, JSON.stringify(fallback));
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
  }
  datasetCaches.set(key, fallback);
  return fallback;
}
function saveStoredData(key, data) {
  datasetCaches.set(key, data);
  if (!isBrowser) return;
  try {
    localStorage.setItem(`uwarl-db-${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}
const INITIAL_PROJECTS = PROJECTS_DATABASE.map((p) => ({
  ...p,
  title: p.title || p.scholar || "",
  description: p.description || ""
}));
const INITIAL_EQUIPMENT = EQUIPMENT_DATABASE.map((eq) => ({
  id: eq.id,
  title: eq.name,
  name: eq.name,
  description: eq.shortDescription || eq.purpose || "",
  category: eq.category,
  specs: Array.isArray(eq.specs) ? JSON.stringify(eq.specs) : eq.specs || "",
  purpose: eq.purpose || "",
  url: eq.url || "",
  thumbnail: eq.thumbnail || eq.image || "",
  images: eq.images || [],
  featured: false,
  displayOrder: 1
}));
const INITIAL_FIELD_ACTIVITIES = FIELD_ACTIVITIES_DATABASE.map((fa) => ({
  id: fa.id,
  title: fa.title,
  description: fa.description || "",
  location: fa.location,
  date: fa.date,
  year: fa.year.toString(),
  activityType: fa.activityType,
  equipmentTags: Array.isArray(fa.equipmentTags) ? fa.equipmentTags.join(", ") : fa.equipmentTags || "",
  team: Array.isArray(fa.team) ? fa.team.join(", ") : fa.team || "",
  thumbnail: fa.thumbnail || "",
  images: Array.isArray(fa.images) ? fa.images : fa.images ? [fa.images] : [],
  featured: false,
  displayOrder: 1
}));
const INITIAL_PEOPLE = [
  {
    id: "peop-1",
    title: "Dr. K. Muthumeenakshi",
    description: "Associate Professor in ECE, SSNCE. Principal investigator in automated deep ocean object mapping consortiums.",
    designation: "Associate Professor",
    role: "faculty",
    institution: "SSNCE",
    link: "https://www.ssn.edu.in/staff-members/dr-k-muthumeenakshi/",
    associatedProjects: ["Deep Ocean Object Mapping", "Smart Underground MI Sensor Network"],
    projectRoles: ["Principal Investigator"],
    thumbnail: "/images/faculty_award.png",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 1
  },
  {
    id: "peop-2",
    title: "Dr. S. Sakthivel Murugan",
    description: "Professor in Department of ECE, NITTTR Chennai. Completed/ongoing research projects worth more than 200 lakhs funded by MoES, DST, TNSCST, NIOT.",
    designation: "Professor",
    role: "faculty",
    institution: "NITTTR, Taramani, Chennai",
    link: "https://www.ssn.edu.in/staff-members/dr-s-sakthivel-murugan/",
    associatedProjects: ["Submerged Poompuhar ML Exploration", "Underground Communication System"],
    projectRoles: ["Principal Investigator", "Research Advisor"],
    thumbnail: "/images/faculty_award.png",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 2
  },
  {
    id: "peop-3",
    title: "M. Vimal Raj",
    description: "Full-time scholar who has submitted his doctoral thesis. Serving as Project Associate-II under MoES-DOM Project.",
    designation: "Project Associate-II & Scholar",
    role: "scholar",
    mode: "Full Time",
    status: "Thesis Submitted",
    associatedProjects: ["MoES-DOM Pamc Project"],
    link: "https://www.researchgate.net/profile/Vimal_Madhaiyan",
    thumbnail: "",
    images: [],
    documents: [],
    featured: false,
    displayOrder: 3
  },
  {
    id: "peop-4",
    title: "S. Sabareesan",
    description: "Project Associate - I working under MoES DOM Project.",
    designation: "Project Associate - I",
    role: "staff",
    institution: "SSNCE",
    associatedProjects: ["MoES-DOM pamc Project"],
    thumbnail: "",
    images: [],
    documents: [],
    featured: false,
    displayOrder: 4
  },
  {
    id: "peop-5",
    title: "Dr. S. Swathi",
    description: "PhD Graduate under UWARL specializing in Underground Communication systems.",
    designation: "Doctoral Graduate",
    role: "phd",
    graduationDate: "October 2022",
    researchArea: "Underground Communication",
    status: "Graduated",
    thumbnail: "/images/student_award.png",
    images: [],
    documents: [],
    featured: false,
    displayOrder: 5
  }
];
const INITIAL_INTERNSHIPS = [
  {
    id: "int-1",
    title: "Mr. Kavin R B",
    description: "Trilateration based acoustic beacons mapping for Autonomous Underwater Vehicle pathing.",
    institution: "SSNCE",
    topic: "Localization of AUV : Trilateration and Triangle Localization",
    duration: "July - August 2024",
    featured: false,
    displayOrder: 1
  },
  {
    id: "int-2",
    title: "Mr. R P Parvath Balaji",
    description: "Embedded motor actuators controller logic design for subsea robotic arms.",
    institution: "Anna University Regional Campus, Tirunelveli",
    topic: "Control of ARM in ROV",
    duration: "June - July 2024",
    featured: false,
    displayOrder: 2
  }
];
const INITIAL_MOUS = [
  {
    id: "mou-1",
    title: "M. S. Swaminathan Research Foundation",
    description: "Agreement on smart agricultural underground wireless sensors development for underground water table monitoring.",
    date: "21 July 2017",
    researchFocus: "Underground Communication – Smart Irrigation System",
    notes: "Initiated and organized by Dr. S. Sakthivel Murugan, Associate Professor, for Underground Communication and Smart Irrigation.",
    thumbnail: "",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 1
  },
  {
    id: "mou-2",
    title: "Tamil Nadu Dr. J. Jayalalithaa Fisheries University",
    description: "Agreement focused on animal bio-acoustics research, coastal recording trials, and hydrophone calibrations.",
    date: "31 March 2021",
    researchFocus: "Animal Bio-acoustics Research",
    notes: "Initiated and organized by Dr. S. Sakthivel Murugan, Associate Professor, for collaborative animal bio-acoustics projects.",
    thumbnail: "",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 2
  }
];
const INITIAL_PARTNERS = [
  { id: "part-1", title: "Satyabhama University", location: "Chennai, India", description: "Consortium partner for coastal trials data extraction.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 1 },
  { id: "part-2", title: "RMK Engineering College", location: "Chennai, India", description: "Consortium partner for subsea acoustic modeling.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 2 },
  { id: "part-3", title: "SRM University", location: "Chennai, India", description: "Technical exchange partner for subsea robot testings.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 3 },
  { id: "part-4", title: "Alagappa College of Technology", location: "Chennai, India", description: "Material analysis consultancy partner.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 4 },
  { id: "part-5", title: "SRM Eswari Engineering College", location: "Chennai, India", description: "Joint academic technical workshop partner.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 5 },
  { id: "part-6", title: "B. S. Abdur Rahman Crescent Institute of Science & Technology", location: "Chennai, India", description: "Research consultancy partner for data processing.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 6 },
  { id: "part-7", title: "K S School of Engineering and Management", location: "Bangalore, India", description: "Joint consultancy for shallow water trial surveys.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 7 }
];
const INITIAL_CONSULTANCY = [
  {
    id: "con-1",
    title: "K S School of Engineering and Management",
    description: "Assisted faculties in acoustic transceiver data extraction and test tank validation trials.",
    date: "27 April 2024",
    participants: "Dr. P. Karthik (Professor) and Mr. Gopalakrishna Murthy C R (Associate Professor)",
    purpose: "Collected data through consultancy for the research work carried out in the lab.",
    equipment: "UWARL Testing Basin, Transceiver Setup",
    thumbnail: "",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 1
  },
  {
    id: "con-2",
    title: "B. S. Abdur Rahman Crescent Institute of Science and Technology",
    description: "Acoustic signal processing data extraction consultancy conducted in UWARL facilities.",
    date: "13 March 2024",
    participants: "Miss. A. Priya (Associate Professor, ECE) and Mr. Afzar Ali (Research Scholar), along with their students",
    purpose: "Collected data through consultancy for the research work carried out in the lab.",
    equipment: "Hydrophone Arrays, Test Tanks",
    thumbnail: "",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 2
  }
];
const INITIAL_GALLERY = [
  {
    id: "gal-1",
    title: "Acoustic Signal Validation",
    description: "Processing transceiver backscatter arrays in shallow ocean trial zones.",
    category: "research",
    date: "2024",
    thumbnail: "/images/academic_seminar.png",
    images: ["/images/academic_seminar.png", "/images/laboratory_workspace.png"],
    tags: ["Acoustics", "Signal Validation"],
    documents: [],
    featured: true,
    displayOrder: 1
  },
  {
    id: "gal-2",
    title: "ORCA ROV Deployments",
    description: "Buoyancy calibration testing of ORCA ROV in open water estuary trials.",
    category: "field",
    date: "2022",
    thumbnail: "/images/underwater_robot.png",
    images: ["/images/underwater_robot.png", "/images/laboratory_workspace.png"],
    tags: ["ROV", "Trials"],
    documents: [],
    featured: true,
    displayOrder: 2
  },
  {
    id: "gal-3",
    title: "Indoor Acoustic Test Tank",
    description: "Our 10,874-liter testing basin configured with transducer calibration gear.",
    category: "facilities",
    date: "2023",
    thumbnail: "/images/laboratory_workspace.png",
    images: ["/images/laboratory_workspace.png"],
    tags: ["Basin", "Test Tank"],
    documents: [],
    featured: true,
    displayOrder: 3
  },
  {
    id: "gal-4",
    title: "ITEC Delegations Lectures",
    description: "Academic sessions organized on subsea wireless arrays and acoustic propagation.",
    category: "events",
    date: "2021",
    thumbnail: "/images/academic_seminar.png",
    images: ["/images/academic_seminar.png", "/images/faculty_award.png"],
    tags: ["ITEC", "Seminar"],
    documents: [],
    featured: true,
    displayOrder: 4
  }
];
const INITIAL_GALLERY_ALL = [
  ...INITIAL_GALLERY,
  {
    id: "gal-5",
    title: "Localization of AUV : Trilateration and Triangle Localization",
    description: "Internship topic by Mr. Kavin R B from SSNCE on Localization of AUV.",
    category: "internships",
    date: "July - August 2024",
    thumbnail: "",
    images: [],
    tags: ["AUV Navigation", "Trilateration"],
    documents: [],
    featured: false,
    displayOrder: 5
  },
  {
    id: "gal-6",
    title: "Control of ARM in ROV",
    description: "Internship topic by Mr. R P Parvath Balaji from Anna University Tirunelveli.",
    category: "internships",
    date: "June - July 2024",
    thumbnail: "",
    images: [],
    tags: ["ROV Controls", "Robotic Arm"],
    documents: [],
    featured: false,
    displayOrder: 6
  }
];
const INITIAL_MEDIA_LIBRARY = [
  {
    id: "med-1",
    title: "underwater_robot.png",
    category: "image",
    thumbnail: "/images/underwater_robot.png",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    displayOrder: 1,
    featured: true
  },
  {
    id: "med-2",
    title: "academic_seminar.png",
    category: "image",
    thumbnail: "/images/academic_seminar.png",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    displayOrder: 2,
    featured: true
  },
  {
    id: "med-3",
    title: "laboratory_workspace.png",
    category: "image",
    thumbnail: "/images/laboratory_workspace.png",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    displayOrder: 3,
    featured: false
  },
  {
    id: "med-4",
    title: "faculty_award.png",
    category: "image",
    thumbnail: "/images/faculty_award.png",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    displayOrder: 4,
    featured: false
  },
  {
    id: "med-5",
    title: "student_award.png",
    category: "image",
    thumbnail: "/images/student_award.png",
    uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
    displayOrder: 5,
    featured: false
  }
];
const DEFAULT_SETTINGS = {
  siteName: "Ocean Research Laboratory",
  siteDescription: "National Institute of Technical Teachers Training and Research (NITTTR), Chennai",
  contactEmail: "orl@nitttrc.ac.in",
  contactPhone: "+91 44 2254 5400",
  workingHours: "Monday – Friday: 9:00 AM – 5:30 PM",
  footerContent: "© 2026 Ocean Research Laboratory, NITTTR Chennai. All rights reserved.",
  homepageStats: [
    { label: "Publications", value: "169", icon: "FileText", description: "62 Journals, 97 Conferences, and 10 Books.", displayOrder: 1 },
    { label: "Awards", value: "26", icon: "Award", description: "National and institutional recognitions.", displayOrder: 2 },
    { label: "Invited Talks", value: "22", icon: "Mic", description: "Keynotes and technical sessions delivered.", displayOrder: 3 },
    { label: "Research Supervisions", value: "16", icon: "GraduationCap", description: "PhD scholars guided and doctoral committees chaired.", displayOrder: 4 },
    { label: "Training Programmes", value: "55", icon: "Briefcase", description: "ITEC international sessions and PDP courses.", displayOrder: 5 },
    { label: "Years of Research", value: "15+", icon: "Calendar", description: "Established in 2010 (15+ years of research).", displayOrder: 6 }
  ],
  peopleStats: [
    { label: "Faculty Members", count: "5", icon: "Users", desc: "Scientific Directors & Founders", displayOrder: 1 },
    { label: "Research Scholars", count: "4", icon: "GraduationCap", desc: "Ph.D. Candidates & Investigators", displayOrder: 2 },
    { label: "Project Staff", count: "2", icon: "Briefcase", desc: "Hardware & Software Engineers", displayOrder: 3 },
    { label: "Students & Interns", count: "58", icon: "BookOpen", desc: "Post-Graduate & Innovation Teams", displayOrder: 4 }
  ],
  keyContacts: [
    {
      name: "Dr. S. Sakthivel Murugan",
      designation: "Laboratory Head & Professor",
      email: "orl@nitttrc.ac.in",
      displayOrder: 1
    },
    {
      name: "Dr. K. Muthumeenakshi",
      designation: "Associate Professor (Research Enquiries)",
      email: "orl@nitttrc.ac.in",
      displayOrder: 2
    },
    {
      name: "Dr. S. Sakthivel Murugan",
      designation: "Professor (Consultancy Enquiries)",
      email: "orl@nitttrc.ac.in",
      displayOrder: 3
    },
    {
      name: "Dr. S. Sakthivel Murugan",
      designation: "Professor (Training Programmes)",
      email: "orl@nitttrc.ac.in",
      displayOrder: 4
    }
  ],
  heroTitle: "Ocean Research Laboratory",
  heroSubtitle: "ஆழி ஆராய்ச்சி ஆய்வகம் / समुद्र अनुसंधान प्रयोगशाला",
  heroDescription: "The Ocean Research Laboratory (ORL) at NITTTR Chennai is dedicated to advancing underwater acoustics, ocean engineering, marine sensing technologies, and subsea exploration systems through research, innovation, technical training, and field validation.",
  heroBgImage: "",
  heroPrimaryBtnText: "Explore Research",
  heroPrimaryBtnLink: "/research",
  heroSecondaryBtnText: "Contact Us",
  heroSecondaryBtnLink: "/contact",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8967468114467!2d80.24716497479017!3d12.97841101473636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d614ffdfdd9%3A0xe5a363cb05697d!2sNITTTR%20Chennai!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin",
  googleMapsUrl: "https://maps.google.com/?q=NITTTR+Chennai",
  latitude: "12.9784",
  longitude: "80.2472",
  address: "Department of ECE, NITTTR Chennai, Taramani, Chennai, Tamil Nadu - 600113"
};
const storeListeners = /* @__PURE__ */ new Map();
function subscribeStore(key, listener) {
  if (!storeListeners.has(key)) {
    storeListeners.set(key, /* @__PURE__ */ new Set());
  }
  storeListeners.get(key).add(listener);
  return () => {
    storeListeners.get(key)?.delete(listener);
  };
}
function notifyStoreChange(key) {
  storeListeners.get(key)?.forEach((cb) => cb());
}
function getDatasetRecords(key, seed) {
  return getStoredData(key, seed);
}
function saveDatasetRecords(key, records) {
  saveStoredData(key, records);
  notifyStoreChange(key);
}
let settingsCache = null;
function getSettings() {
  if (settingsCache) return settingsCache;
  if (!isBrowser) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem("uwarl-db-settings");
    if (raw) {
      settingsCache = JSON.parse(raw);
      return settingsCache;
    }
    localStorage.setItem("uwarl-db-settings", JSON.stringify(DEFAULT_SETTINGS));
  } catch (e) {
    console.error("Error reading site settings:", e);
  }
  settingsCache = DEFAULT_SETTINGS;
  return settingsCache;
}
function saveSettings(settings) {
  settingsCache = settings;
  if (!isBrowser) return;
  try {
    localStorage.setItem("uwarl-db-settings", JSON.stringify(settings));
    notifyStoreChange("settings");
  } catch (e) {
    console.error("Error saving site settings:", e);
  }
}
const INITIAL_HOME_RESEARCH_FOCUS = [
  {
    id: "focus-1",
    title: "Underwater Acoustics",
    description: "Ambient noise modeling, propagation dynamics, and sonar telemetry characterization in shallow and deep coastal waters.",
    icon: "Compass",
    tags: ["Hydrophones", "Ambient Noise", "Propagation"],
    displayOrder: 1
  },
  {
    id: "focus-2",
    title: "Ocean Observation",
    description: "Development of autonomous subsea sensor networks, marine bio-acoustics mapping, and real-time environment monitoring stations.",
    icon: "Globe",
    tags: ["Sensors", "Monitoring", "Data Collection"],
    displayOrder: 2
  },
  {
    id: "focus-3",
    title: "Marine Signal Processing",
    description: "Advanced algorithms for sonar de-noising, multi-carrier subsea communication (MIMO) structures, and AI-assisted degraded optical restoration.",
    icon: "Cpu",
    tags: ["De-noising", "MIMO Sonar", "AI Restoration"],
    displayOrder: 3
  },
  {
    id: "focus-4",
    title: "Underwater Robotics",
    description: "Guidance, navigation, and control loop optimization for autonomous underwater vehicles (AUVs) and remotely operated vehicles (ROVs).",
    icon: "Bot",
    tags: ["AUVs & ROVs", "Control Loops", "Navigation"],
    displayOrder: 4
  }
];
const INITIAL_HOME_HIGHLIGHTS = [
  {
    id: "h-high-1",
    title: "Indoor Acoustic Test Tank",
    description: "Indoor calibrated water testing facility supporting sensor arrays and subsea platforms.",
    image: "/images/laboratory_workspace.png",
    tag: "Acoustic Testing",
    link: "facilities",
    specs: [
      { label: "Capacity", value: "10,874 Litres" },
      { label: "Purpose", value: "Sensor Calibration & Trim Testing" }
    ],
    displayOrder: 1
  },
  {
    id: "h-high-2",
    title: "ORCA ROV Platform",
    description: "Custom inspection vehicle designed for biological surveying and underwater recording.",
    image: "/images/underwater_robot.png",
    tag: "ROV Platform",
    link: "facilities",
    specs: [
      { label: "Deployment", value: "Inspection class" },
      { label: "Equipment", value: "Modular Thrusters & HD Cam" }
    ],
    displayOrder: 2
  },
  {
    id: "h-high-3",
    title: "Marine Instrumentation",
    description: "State-of-the-art arrays, velocimeters, and side-scan sonar interfaces.",
    image: "/images/academic_seminar.png",
    tag: "Field Systems",
    link: "facilities",
    specs: [
      { label: "Sensing", value: "Hydrophones & SVP Profilers" },
      { label: "Interface", value: "High-resolution side-scan" }
    ],
    displayOrder: 3
  }
];
const INITIAL_HOME_QUICK_ACCESS = [
  { label: "Research & Facilities", to: "/research", icon: "Compass", description: "Acoustics modeling and test tank facilities", color: "sky", displayOrder: 1 },
  { label: "Publications", to: "/publications", icon: "FileText", description: "Peer-reviewed journals and books", color: "sky", displayOrder: 2 },
  { label: "Technical Training", to: "/technical-training", icon: "Briefcase", description: "ITEC international and PDP courses", color: "indigo", displayOrder: 3 },
  { label: "Academic Activities", to: "/academic-activities", icon: "GraduationCap", description: "Supervision registries and workshops", color: "violet", displayOrder: 4 },
  { label: "Awards & Recognition", to: "/awards", icon: "Award", description: "National and institutional recognitions", color: "amber", displayOrder: 5 },
  { label: "People", to: "/people", icon: "Users", description: "Faculty, scholars, staff, and alumni", color: "indigo", displayOrder: 6 },
  { label: "Gallery", to: "/gallery", icon: "Camera", description: "Photo archives of underwater trials", color: "cyan", displayOrder: 7 },
  { label: "Collaborations", to: "/collaborations-consultancy", icon: "Globe", description: "Joint MoUs and consultancy programs", color: "emerald", displayOrder: 8 }
].map((item, idx) => ({ id: `qa-${idx}`, title: item.label, ...item }));
function exportSiteBackup() {
  const backup = {
    settings: getSettings(),
    assets: getAssets(),
    datasets: {}
  };
  const keys = [
    "research-projects",
    "research-equipment",
    "research-activities",
    "people-members",
    "people-internships",
    "collaborations-mous",
    "collaborations-institutions",
    "collaborations-activities",
    "gallery-records",
    "home-research-focus",
    "home-highlights",
    "home-quick-access",
    "media-library"
  ];
  keys.forEach((key) => {
    try {
      const raw = localStorage.getItem(`uwarl-db-${key}`);
      if (raw) {
        backup.datasets[key] = JSON.parse(raw);
      } else {
        backup.datasets[key] = DATA_SEEDS[key] || [];
      }
    } catch (e) {
      console.error(`Error exporting ${key}:`, e);
    }
  });
  try {
    const rawRecords = localStorage.getItem("uwarl-repo-records-v3");
    if (rawRecords) {
      backup.datasets["repo-records"] = JSON.parse(rawRecords);
    }
    const rawCarousels = localStorage.getItem("uwarl-repo-carousels-v1");
    if (rawCarousels) {
      backup.datasets["repo-carousels"] = JSON.parse(rawCarousels);
    }
  } catch (e) {
    console.error("Error exporting repo records:", e);
  }
  return JSON.stringify(backup, null, 2);
}
function importSiteBackup(jsonString) {
  try {
    const backup = JSON.parse(jsonString);
    if (!backup || typeof backup !== "object") {
      throw new Error("Invalid backup data format.");
    }
    if (backup.settings) {
      saveSettings(backup.settings);
    }
    if (backup.assets) {
      saveAssets(backup.assets);
    }
    if (backup.datasets && typeof backup.datasets === "object") {
      Object.entries(backup.datasets).forEach(([key, data]) => {
        if (key === "repo-records") {
          localStorage.setItem("uwarl-repo-records-v3", JSON.stringify(data));
        } else if (key === "repo-carousels") {
          localStorage.setItem("uwarl-repo-carousels-v1", JSON.stringify(data));
        } else {
          localStorage.setItem(`uwarl-db-${key}`, JSON.stringify(data));
          datasetCaches.delete(key);
          notifyStoreChange(key);
        }
      });
    }
    notifyStoreChange("settings");
    notifyStoreChange("repo-records");
  } catch (e) {
    console.error("Error restoring backup:", e);
    throw e;
  }
}
function resetSiteToDefaults() {
  const keys = [
    "settings",
    "assets-v1",
    "research-projects",
    "research-equipment",
    "research-activities",
    "people-members",
    "people-internships",
    "collaborations-mous",
    "collaborations-institutions",
    "collaborations-activities",
    "gallery-records",
    "home-research-focus",
    "home-highlights",
    "home-quick-access",
    "media-library",
    "repo-records-v3",
    "repo-carousels-v1"
  ];
  keys.forEach((k) => {
    localStorage.removeItem(`uwarl-db-${k}`);
    localStorage.removeItem(`uwarl-${k}`);
  });
  datasetCaches.clear();
  settingsCache = null;
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}
function useDatasetRecords(key, seed) {
  return useSyncExternalStore(
    (cb) => subscribeStore(key, cb),
    () => getStoredData(key, seed),
    () => seed
  );
}
function useSiteSettings() {
  return useSyncExternalStore(
    (cb) => subscribeStore("settings", cb),
    () => getSettings(),
    () => DEFAULT_SETTINGS
  );
}
const DATA_SEEDS = {
  "research-projects": INITIAL_PROJECTS,
  "research-equipment": INITIAL_EQUIPMENT,
  "research-activities": INITIAL_FIELD_ACTIVITIES,
  "people-members": INITIAL_PEOPLE,
  "people-internships": INITIAL_INTERNSHIPS,
  "collaborations-mous": INITIAL_MOUS,
  "collaborations-institutions": INITIAL_PARTNERS,
  "collaborations-activities": INITIAL_CONSULTANCY,
  "gallery-records": INITIAL_GALLERY_ALL,
  "media-library": INITIAL_MEDIA_LIBRARY,
  "home-research-focus": INITIAL_HOME_RESEARCH_FOCUS,
  "home-highlights": INITIAL_HOME_HIGHLIGHTS,
  "home-quick-access": INITIAL_HOME_QUICK_ACCESS
};
const $$splitComponentImporter$f = () => import("./gallery-CogJ0lOi.js");
const gallerySearchSchema = z.object({
  tab: z.enum(["research", "field", "facilities", "events", "internships"]).optional()
});
const Route$f = createFileRoute("/gallery")({
  validateSearch: (search) => gallerySearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Gallery — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Browse photos from underwater surveys, laboratory facilities, subsea testing, and academic workshops at ORL."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const GALLERY_RECORDS = getDatasetRecords("gallery-records", DATA_SEEDS["gallery-records"]);
const $$splitComponentImporter$e = () => import("./contact-CBc5atO_.js");
const Route$e = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Get in touch with the Ocean Research Laboratory at NITTTR Chennai."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./collaborations-consultancy-CEijsb9u.js");
const collabSearchSchema = z.object({
  tab: z.enum(["mous", "services", "institutions", "activities"]).optional()
});
const Route$d = createFileRoute("/collaborations-consultancy")({
  validateSearch: (search) => {
    const res = collabSearchSchema.safeParse(search);
    return res.success ? res.data : {};
  },
  head: () => ({
    meta: [{
      title: "Collaborations & Consultancy — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Explore the academic collaborations, MoUs, technical support services, and consultancy activities at the Ocean Research Laboratory."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
getDatasetRecords("collaborations-mous", DATA_SEEDS["collaborations-mous"]);
const TECHNICAL_SUPPORT_SERVICES = [{
  id: "srv-1",
  title: "Utilization of Lab Facilities",
  thumbnail: "",
  images: [],
  documents: [],
  featured: false,
  displayOrder: 1
}, {
  id: "srv-2",
  title: "Underwater Equipment Hiring",
  thumbnail: "",
  images: [],
  documents: [],
  featured: false,
  displayOrder: 2
}, {
  id: "srv-3",
  title: "Technical Support",
  thumbnail: "",
  images: [],
  documents: [],
  featured: false,
  displayOrder: 3
}, {
  id: "srv-4",
  title: "Technical & Manpower Support for Data Collection & Processing",
  thumbnail: "",
  images: [],
  documents: [],
  featured: false,
  displayOrder: 4
}];
getDatasetRecords("collaborations-institutions", DATA_SEEDS["collaborations-institutions"]);
getDatasetRecords("collaborations-activities", DATA_SEEDS["collaborations-activities"]);
const $$splitComponentImporter$c = () => import("./awards-HLxXKRsD.js");
const Route$c = createFileRoute("/awards")({
  head: () => ({
    meta: [{
      title: "Awards & Recognition — UWARL"
    }, {
      name: "description",
      content: "Awards and recognitions received by laboratory members."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./admin-CxGqCVvU.js");
const Route$b = createFileRoute("/admin")({
  head: () => ({
    meta: [{
      title: "Admin Dashboard — Website Content Manager"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./academic-activities-h0vQlxki.js");
const academicActivitiesSearchSchema = z.object({
  tab: z.enum(["dc", "talks", "workshops", "bos"]).optional()
});
const Route$a = createFileRoute("/academic-activities")({
  validateSearch: (search) => {
    const res = academicActivitiesSearchSchema.safeParse(search);
    return res.success ? res.data : {};
  },
  head: () => ({
    meta: [{
      title: "Academic Activities — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Explore doctoral research supervision, invited academic talks, workshops, and board of studies governance at ORL."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./index-CHUJ72mA.js");
const Route$9 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Ocean Research Laboratory (ORL) | NITTTR Chennai"
    }, {
      name: "description",
      content: "The Ocean Research Laboratory (ORL) at NITTTR Chennai is dedicated to advancing underwater acoustics, ocean engineering, marine sensing technologies, and subsea exploration systems."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const TYPE_META = {
  award: {
    label: "Award",
    plural: "Awards & Recognition",
    path: "/awards",
    description: "Honors, awards, and recognitions received by laboratory faculty, scholars and students."
  },
  talk: {
    label: "Invited Talk",
    plural: "Invited Talks",
    path: "/legacy/talks",
    description: "Invited lectures, keynotes, and session chair engagements at academic and industry venues."
  },
  workshop: {
    label: "Workshop",
    plural: "Workshops",
    path: "/legacy/workshops",
    description: "Workshops, tutorials, and short courses organized, hosted, or chaired by laboratory members."
  },
  publication: {
    label: "Publication",
    plural: "Publications",
    path: "/publications",
    description: "Peer-reviewed journal articles, conference papers, and books authored by laboratory members."
  },
  bos: {
    label: "Board of Studies",
    plural: "Board of Studies",
    path: "/legacy/bos",
    description: "Board of studies memberships and academic governance roles held by laboratory faculty."
  },
  dc: {
    label: "Research Supervision",
    plural: "Research Supervision",
    path: "/legacy/research-supervision",
    description: "Research supervision, doctoral committee participations, research advisory panels, and PhD evaluations."
  },
  host: {
    label: "Host Institution",
    plural: "Host Institution",
    path: "/technical-training?tab=host",
    description: "Programmes conducted as visiting faculty or resource person at host institutions."
  },
  itec: {
    label: "ITEC Programme",
    plural: "ITEC Programmes",
    path: "/technical-training?tab=itec",
    description: "Indian Technical and Economic Cooperation (ITEC) programmes delivered to international participants."
  },
  itp: {
    label: "ITP Programme",
    plural: "ITP Programmes",
    path: "/technical-training?tab=itp",
    description: "Industrial Training Programmes conducted for engineering students and industry participants."
  },
  pdp: {
    label: "PDP as Resource Person",
    plural: "PDP as Resource Person",
    path: "/technical-training?tab=pdp",
    description: "Professional Development Programmes conducted as resource person."
  },
  pg: {
    label: "PG Course",
    plural: "PG Courses",
    path: "/legacy/pg",
    description: "Post Graduate (M.Tech VLSI & Embedded Systems) courses taught and subjects coordinated by laboratory faculty."
  },
  coord: {
    label: "PDP as Coordinator",
    plural: "PDP as Coordinator",
    path: "/technical-training?tab=coordinator",
    description: "Professional Development Programmes coordinated and managed by laboratory faculty."
  }
};
let recordsCache = getRecords();
const recordsListeners = /* @__PURE__ */ new Set();
function triggerRecordsUpdate() {
  recordsCache = getRecords();
  for (const cb of recordsListeners) cb();
}
function subscribeRecords(cb) {
  recordsListeners.add(cb);
  return () => recordsListeners.delete(cb);
}
function useRecords() {
  return useSyncExternalStore(
    subscribeRecords,
    () => recordsCache,
    () => recordsCache
  );
}
function getRecord(id) {
  return recordsCache.find((r) => r.id === id);
}
function createRecord(input) {
  const id = `${input.type}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const rec = {
    ...input,
    id,
    attachments: input.attachments ?? [],
    tags: input.tags ?? []
  };
  const current = getRecords();
  const updated = [rec, ...current];
  saveRecords(updated);
  triggerRecordsUpdate();
  return rec;
}
function updateRecord(id, patch) {
  const current = getRecords();
  const updated = current.map(
    (r) => r.id === id ? { ...r, ...patch, id: r.id } : r
  );
  saveRecords(updated);
  triggerRecordsUpdate();
}
function deleteRecord(id) {
  const current = getRecords();
  const updated = current.filter((r) => r.id !== id);
  saveRecords(updated);
  triggerRecordsUpdate();
}
let pageTextCache = getPageTexts();
const pageTextListeners = /* @__PURE__ */ new Set();
function usePageText(type) {
  const snap = useSyncExternalStore(
    (cb) => {
      pageTextListeners.add(cb);
      return () => pageTextListeners.delete(cb);
    },
    () => pageTextCache,
    () => pageTextCache
  );
  const meta = TYPE_META[type];
  return {
    title: snap[type]?.title ?? meta.plural,
    description: snap[type]?.description ?? meta.description
  };
}
let carouselCache = getCarouselConfig();
const carouselListeners = /* @__PURE__ */ new Set();
function useCarousel(type) {
  const snap = useSyncExternalStore(
    (cb) => {
      carouselListeners.add(cb);
      return () => carouselListeners.delete(cb);
    },
    () => carouselCache,
    () => carouselCache
  );
  return (snap[type] || []).sort((a, b) => a.order - b.order);
}
function formatDate(dateStr) {
  if (!dateStr) return "N/A";
  const trimStr = dateStr.trim();
  if (/^\d{4}$/.test(trimStr)) {
    return trimStr;
  }
  if (/^\d{4}-\d{2}$/.test(trimStr)) {
    const [year, month] = trimStr.split("-");
    const d = new Date(Number(year), Number(month) - 1, 1);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", { year: "numeric", month: "short" });
    }
    return trimStr;
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimStr)) {
    const [year, month, day] = trimStr.split("-");
    const d = new Date(Number(year), Number(month) - 1, Number(day));
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit"
      });
    }
    return trimStr;
  }
  return dateStr;
}
function parseTerm(term) {
  if (/^\d{4}$/.test(term)) return { kind: "date", value: term };
  if (/^\d{4}-\d{1,2}$/.test(term)) {
    const [y, m] = term.split("-");
    return { kind: "date", value: `${y}-${m.padStart(2, "0")}` };
  }
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(term)) {
    const [y, m, d] = term.split("-");
    return {
      kind: "date",
      value: `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`
    };
  }
  return { kind: "text", value: term.toLowerCase() };
}
function recordHaystack(r) {
  return [
    r.title,
    r.organization,
    r.summary,
    r.authors ?? "",
    r.place ?? "",
    r.code ?? "",
    r.duration ?? "",
    r.mode ?? "",
    r.role ?? "",
    r.doi ?? "",
    r.subtype ?? "",
    r.tags.join(" ")
  ].join(" ").toLowerCase();
}
function searchRecords(type, query) {
  const list = recordsCache.filter((r) => r.type === type);
  const q = query.trim();
  if (!q) return [...list].sort((a, b) => b.date.localeCompare(a.date));
  const terms = q.split(/\s+/).map(parseTerm);
  return list.filter((r) => {
    const hay = recordHaystack(r);
    return terms.every((t) => {
      if (t.kind === "date") return r.date.startsWith(t.value);
      return hay.includes(t.value);
    });
  }).sort((a, b) => b.date.localeCompare(a.date));
}
const $$splitComponentImporter$8 = () => import("./record._id-zrukk-3H.js");
const $$splitErrorComponentImporter = () => import("./record._id-BdreAf4M.js");
const $$splitNotFoundComponentImporter = () => import("./record._id-CcQmIbAn.js");
const Route$8 = createFileRoute("/record/$id")({
  loader: ({
    params
  }) => {
    const record = getRecord(params.id);
    if (!record) throw notFound();
    return {
      record
    };
  },
  head: ({
    loaderData
  }) => ({
    meta: [{
      title: `${loaderData?.record.title ?? "Record"} — UWARL`
    }, {
      name: "description",
      content: loaderData?.record.summary ?? "Repository record"
    }]
  }),
  notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
  errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./workshops-CsG-wkmn.js");
const Route$7 = createFileRoute("/legacy/workshops")({
  head: () => ({
    meta: [{
      title: "Workshops — UWARL"
    }, {
      name: "description",
      content: "Workshops, tutorials, and short courses organized by the laboratory."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./talks-BJCE29wd.js");
const Route$6 = createFileRoute("/legacy/talks")({
  head: () => ({
    meta: [{
      title: "Invited Talks — UWARL"
    }, {
      name: "description",
      content: "Invited lectures and keynote presentations by laboratory members."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./research-supervision-DSahHSDi.js");
const Route$5 = createFileRoute("/legacy/research-supervision")({
  head: () => ({
    meta: [{
      title: "Research Supervision — Academic Repository"
    }, {
      name: "description",
      content: "Academic research supervision, doctoral committee evaluations, and advisory panels."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./pg-BabSrEIw.js");
const Route$4 = createFileRoute("/legacy/pg")({
  head: () => ({
    meta: [{
      title: "PG Courses — UWARL"
    }, {
      name: "description",
      content: "Post Graduate courses and subjects taught and coordinated by laboratory faculty."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./field-activities-B0Ox2Rtg.js");
const fieldSearchSchema = z.object({
  tab: z.enum(["surveys", "data-collection", "sea-trials", "expeditions"]).optional()
});
const Route$3 = createFileRoute("/legacy/field-activities")({
  validateSearch: (search) => fieldSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Field Activities — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Details of subsea surveys, ambient noise collections, and open-ocean vehicle expeditions."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./facilities-DCk6XxAE.js");
const facilitiesSearchSchema = z.object({
  tab: z.enum(["equipment", "test-facilities", "underwater-systems", "field-instruments"]).optional()
});
const Route$2 = createFileRoute("/legacy/facilities")({
  validateSearch: (search) => facilitiesSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "Facilities — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Discover the testing facilities, subsea equipment, and ocean instruments at the Ocean Research Laboratory."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./bos-etv7giHd.js");
const Route$1 = createFileRoute("/legacy/bos")({
  head: () => ({
    meta: [{
      title: "Board of Studies — UWARL"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./about-BxfxGPwK.js");
const aboutSearchSchema = z.object({
  tab: z.enum(["overview", "vision-mission", "history", "collaborations"]).optional()
});
const Route = createFileRoute("/legacy/about")({
  validateSearch: (search) => aboutSearchSchema.parse(search),
  head: () => ({
    meta: [{
      title: "About — Ocean Research Laboratory"
    }, {
      name: "description",
      content: "Learn about the history, evolution, vision, and mission of the Ocean Research Laboratory at NITTTR Chennai."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TechnicalTrainingRoute = Route$j.update({
  id: "/technical-training",
  path: "/technical-training",
  getParentRoute: () => Route$k
});
const ResearchRoute = Route$i.update({
  id: "/research",
  path: "/research",
  getParentRoute: () => Route$k
});
const PublicationsRoute = Route$h.update({
  id: "/publications",
  path: "/publications",
  getParentRoute: () => Route$k
});
const PeopleRoute = Route$g.update({
  id: "/people",
  path: "/people",
  getParentRoute: () => Route$k
});
const GalleryRoute = Route$f.update({
  id: "/gallery",
  path: "/gallery",
  getParentRoute: () => Route$k
});
const ContactRoute = Route$e.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$k
});
const CollaborationsConsultancyRoute = Route$d.update({
  id: "/collaborations-consultancy",
  path: "/collaborations-consultancy",
  getParentRoute: () => Route$k
});
const AwardsRoute = Route$c.update({
  id: "/awards",
  path: "/awards",
  getParentRoute: () => Route$k
});
const AdminRoute = Route$b.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$k
});
const AcademicActivitiesRoute = Route$a.update({
  id: "/academic-activities",
  path: "/academic-activities",
  getParentRoute: () => Route$k
});
const IndexRoute = Route$9.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$k
});
const RecordIdRoute = Route$8.update({
  id: "/record/$id",
  path: "/record/$id",
  getParentRoute: () => Route$k
});
const LegacyWorkshopsRoute = Route$7.update({
  id: "/legacy/workshops",
  path: "/legacy/workshops",
  getParentRoute: () => Route$k
});
const LegacyTalksRoute = Route$6.update({
  id: "/legacy/talks",
  path: "/legacy/talks",
  getParentRoute: () => Route$k
});
const LegacyResearchSupervisionRoute = Route$5.update({
  id: "/legacy/research-supervision",
  path: "/legacy/research-supervision",
  getParentRoute: () => Route$k
});
const LegacyPgRoute = Route$4.update({
  id: "/legacy/pg",
  path: "/legacy/pg",
  getParentRoute: () => Route$k
});
const LegacyFieldActivitiesRoute = Route$3.update({
  id: "/legacy/field-activities",
  path: "/legacy/field-activities",
  getParentRoute: () => Route$k
});
const LegacyFacilitiesRoute = Route$2.update({
  id: "/legacy/facilities",
  path: "/legacy/facilities",
  getParentRoute: () => Route$k
});
const LegacyBosRoute = Route$1.update({
  id: "/legacy/bos",
  path: "/legacy/bos",
  getParentRoute: () => Route$k
});
const LegacyAboutRoute = Route.update({
  id: "/legacy/about",
  path: "/legacy/about",
  getParentRoute: () => Route$k
});
const rootRouteChildren = {
  IndexRoute,
  AcademicActivitiesRoute,
  AdminRoute,
  AwardsRoute,
  CollaborationsConsultancyRoute,
  ContactRoute,
  GalleryRoute,
  PeopleRoute,
  PublicationsRoute,
  ResearchRoute,
  TechnicalTrainingRoute,
  LegacyAboutRoute,
  LegacyBosRoute,
  LegacyFacilitiesRoute,
  LegacyFieldActivitiesRoute,
  LegacyPgRoute,
  LegacyResearchSupervisionRoute,
  LegacyTalksRoute,
  LegacyWorkshopsRoute,
  RecordIdRoute
};
const routeTree = Route$k._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$a as A,
  Route$8 as B,
  TYPE_META as C,
  DATA_SEEDS as D,
  EQUIPMENT_DATABASE as E,
  Route$3 as F,
  GALLERY_RECORDS as G,
  Route$2 as H,
  INTERNSHIPS as I,
  usePageText as J,
  useCarousel as K,
  searchRecords as L,
  Route as M,
  router as N,
  PLACEHOLDER_IMAGES as P,
  Route$j as R,
  TEAM_MEMBERS as T,
  UG_STUDENTS as U,
  useDatasetRecords as a,
  Route$h as b,
  RESEARCH_SCHOLARS as c,
  PROJECT_STAFF as d,
  PHD_GRADUATES as e,
  formatDate as f,
  UG_ALUMNI as g,
  PG_ALUMNI as h,
  TECHNICAL_DISCUSSIONS as i,
  Route$f as j,
  useSiteSettings as k,
  TECHNICAL_SUPPORT_SERVICES as l,
  getCarouselConfig as m,
  saveDatasetRecords as n,
  deleteRecord as o,
  saveCarouselConfig as p,
  exportSiteBackup as q,
  resolveAssetUrl as r,
  saveSettings as s,
  resetSiteToDefaults as t,
  useRecords as u,
  getDatasetRecords as v,
  createRecord as w,
  updateRecord as x,
  importSiteBackup as y,
  registerAsset as z
};
