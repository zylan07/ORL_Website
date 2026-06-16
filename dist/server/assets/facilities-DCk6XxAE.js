import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Compass, Anchor } from "lucide-react";
import { H as Route } from "./router-ScoMlXed.js";
import "@tanstack/react-query";
import "react";
import "zod";
function FacilitiesPage() {
  const {
    tab
  } = Route.useSearch();
  const currentTab = tab || "equipment";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-16 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-[56px] z-30 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-2.5", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [
      /* @__PURE__ */ jsx(Link, { to: "/legacy/facilities", search: {
        tab: "equipment"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "equipment" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Equipment" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/facilities", search: {
        tab: "test-facilities"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "test-facilities" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Test Facilities" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/facilities", search: {
        tab: "underwater-systems"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "underwater-systems" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Underwater Systems" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/facilities", search: {
        tab: "field-instruments"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "field-instruments" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Field Instruments" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 mt-10", children: [
      /* @__PURE__ */ jsx("nav", { className: "text-3xs text-text-muted mb-6", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-accent transition-colors", children: "Home" }) }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { children: "›" }),
          /* @__PURE__ */ jsx("span", { children: "Facilities" })
        ] }),
        /* @__PURE__ */ jsxs("li", { children: [
          /* @__PURE__ */ jsx("span", { children: "›" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-text-secondary capitalize", children: currentTab.replace("-", " ") })
        ] })
      ] }) }),
      currentTab === "equipment" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Sensors & Equipment" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Acoustic Transducers & Measurement Devices" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4", children: [
          /* @__PURE__ */ jsx("p", { children: "The Ocean Research Laboratory houses specialised hardware to facilitate underwater acoustic signal telemetry and sensor calibration." }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 mt-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide", children: "Hydrophones & Transducers" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "Precision piezoelectric receivers (hydrophones) with integrated pre-amplification modules calibrated for ocean noise logging between 10 Hz and 100 kHz." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide", children: "Data Acquisition Systems (DAQ)" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "High-speed analog-to-digital converters (NI-DAQ cards) optimized for multi-channel acoustic array acquisitions." })
            ] })
          ] })
        ] })
      ] }),
      currentTab === "test-facilities" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Test Facilities" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Controlled Wet Labs" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-6 overflow-hidden hover:bg-card-hover transition-all duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "h-48 rounded-lg overflow-hidden bg-slate-950 relative mb-4", children: [
            /* @__PURE__ */ jsx("img", { src: "/images/laboratory_workspace.png", alt: "Acoustic Test Tank", className: "w-full h-full object-cover opacity-60" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-3 left-3 bg-accent-secondary text-white font-bold text-3xs uppercase px-2 py-0.5 rounded", children: "10,874L Capacity" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "Indoor Acoustic Test Tank" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-3 text-xs text-text-secondary leading-relaxed font-sans", children: [
            "The primary wet testing facility is an indoor glass/reinforced test tank basin measuring approximately",
            " ",
            /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "12' L × 8' W × 4' H" }),
            ". Used extensively for sensor calibration, array alignment, and testing ROV buoyancy parameters before sea deployments."
          ] })
        ] }) })
      ] }),
      currentTab === "underwater-systems" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Underwater Systems" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Deployable Subsea Platforms" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-6 hover:bg-card-hover transition-all duration-300", children: [
          /* @__PURE__ */ jsxs("div", { className: "h-48 rounded-lg overflow-hidden bg-slate-950 relative mb-4", children: [
            /* @__PURE__ */ jsx("img", { src: "/images/underwater_robot.png", alt: "ORCA ROV", className: "w-full h-full object-cover opacity-60" }),
            /* @__PURE__ */ jsx("span", { className: "absolute bottom-3 left-3 bg-accent text-white font-bold text-3xs uppercase px-2 py-0.5 rounded", children: "Inspection Class" })
          ] }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "ORCA Remotely Operated Vehicle" }),
          /* @__PURE__ */ jsx("p", { className: "mt-3 text-xs text-text-secondary leading-relaxed font-sans", children: "Developed entirely in-house by the laboratory scholars, ORCA is a light inspection-class ROV system. Outfitted with multiple thruster modules, LED lights, depth sensors, and a high-definition video camera. Used for seabed biological monitoring and coral diagnostics." })
        ] }) })
      ] }),
      currentTab === "field-instruments" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Field Instruments" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Marine Profiling & Mapping Telemetry" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors duration-300", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-foreground text-sm mb-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Compass, { className: "h-4.5 w-4.5 text-accent" }),
              /* @__PURE__ */ jsx("span", { children: "Side-Scan Sonar (SSS)" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted leading-relaxed", children: "Used for seabed acoustic mapping, highlighting geological formations and subsea debris layouts during coastal research trials." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors duration-300", children: [
            /* @__PURE__ */ jsxs("h3", { className: "font-bold text-foreground text-sm mb-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Anchor, { className: "h-4.5 w-4.5 text-accent-secondary" }),
              /* @__PURE__ */ jsx("span", { children: "Sound Velocity Profiler (SVP)" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted leading-relaxed", children: "Measures sound velocity variations across temperature gradients to optimize acoustic telemetry ray-tracing algorithms." })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  FacilitiesPage as component
};
