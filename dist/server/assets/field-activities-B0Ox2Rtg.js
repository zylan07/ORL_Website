import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Compass, Activity, Anchor, Map } from "lucide-react";
import { F as Route } from "./router-ScoMlXed.js";
import "@tanstack/react-query";
import "react";
import "zod";
function FieldActivitiesPage() {
  const {
    tab
  } = Route.useSearch();
  const currentTab = tab || "surveys";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-16 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-[56px] z-30 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-2.5", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [
      /* @__PURE__ */ jsx(Link, { to: "/legacy/field-activities", search: {
        tab: "surveys"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "surveys" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Ocean Surveys" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/field-activities", search: {
        tab: "data-collection"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "data-collection" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Data Collection" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/field-activities", search: {
        tab: "sea-trials"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "sea-trials" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Sea Trials" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/field-activities", search: {
        tab: "expeditions"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "expeditions" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Expeditions" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 mt-10", children: [
      /* @__PURE__ */ jsx("nav", { className: "text-3xs text-text-muted mb-6", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-accent transition-colors", children: "Home" }) }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { children: "›" }),
          /* @__PURE__ */ jsx("span", { children: "Field Activities" })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { children: "›" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-text-secondary capitalize", children: currentTab.replace("-", " ") })
        ] })
      ] }) }),
      currentTab === "surveys" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Ocean Surveys" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Bathymetric Mapping & Estuary Auditing" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4", children: [
          /* @__PURE__ */ jsx("p", { children: "Our laboratory coordinates regular ocean and estuary bathymetry mapping surveys to audit spatial depth parameters and seabed profiles in local ports and shallow sea zones." }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 mt-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Compass, { className: "h-4.5 w-4.5 text-accent" }),
              /* @__PURE__ */ jsx("span", { children: "Coastal Chennai Profiling" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "Conducted shallow harbor transects logging backscatter profiles to track silt buildup and map local underwater obstacles." })
          ] }) })
        ] })
      ] }),
      currentTab === "data-collection" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Data Collection" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Ambient Noise & Sound Profiling Logs" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4", children: [
          /* @__PURE__ */ jsx("p", { children: "Data logging runs are scheduled at selected offshore coordinates to build a comprehensive historical record of ambient acoustic noise levels." }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 mt-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Activity, { className: "h-4.5 w-4.5 text-accent-secondary" }),
              /* @__PURE__ */ jsx("span", { children: "Bay of Bengal Acoustic Datasets" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "Logged ship propeller backscatter patterns, wind-induced wave noise, and thermal gradient logs to validate underwater channel telemetry codes." })
          ] }) })
        ] })
      ] }),
      currentTab === "sea-trials" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Sea Trials" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Vehicle Buoyancy & Telemetry Field Testing" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4", children: [
          /* @__PURE__ */ jsx("p", { children: "Before deploying newly designed subsea hardware, rigorous open-water field trials are conducted to verify buoyancy control, thruster efficiency, and waterproof sealing." }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 mt-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Anchor, { className: "h-4.5 w-4.5 text-accent" }),
              /* @__PURE__ */ jsx("span", { children: "ORCA ROV Sea Validations" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "Conducted subsea deployments down to 15 meters to calibrate motor controllers, test optical feed latency, and verify telemetry integrity." })
          ] }) })
        ] })
      ] }),
      currentTab === "expeditions" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Ocean Expeditions" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Collaborative Deep Water Deployments" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4", children: [
          /* @__PURE__ */ jsx("p", { children: "Collaborative deep-water expeditions are coordinated in partnership with government organizations, providing access to specialized research vessels and deep marine trial sites." }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 mt-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
            /* @__PURE__ */ jsxs("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Map, { className: "h-4.5 w-4.5 text-accent-secondary" }),
              /* @__PURE__ */ jsx("span", { children: "National Laboratory Joint Cruises" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "Participated in research cruises for hydrophone calibration, deep sea profiling, and testing subsea communications transceivers." })
          ] }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  FieldActivitiesPage as component
};
