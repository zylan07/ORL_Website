import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { Compass, Globe } from "lucide-react";
import { M as Route } from "./router-ScoMlXed.js";
import "@tanstack/react-query";
import "react";
import "zod";
function AboutPage() {
  const {
    tab
  } = Route.useSearch();
  const currentTab = tab || "overview";
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-16 transition-colors duration-300", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-[56px] z-30 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-2.5", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", children: [
      /* @__PURE__ */ jsx(Link, { to: "/legacy/about", search: {
        tab: "overview"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "overview" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Overview" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/about", search: {
        tab: "vision-mission"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "vision-mission" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Vision & Mission" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/about", search: {
        tab: "history"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "history" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "History & Evolution" }),
      /* @__PURE__ */ jsx(Link, { to: "/legacy/about", search: {
        tab: "collaborations"
      }, className: `px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${currentTab === "collaborations" ? "bg-accent/10 text-accent border border-accent/20" : "text-text-muted hover:text-foreground border border-transparent"}`, children: "Collaborations" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 mt-10", children: [
      /* @__PURE__ */ jsx("nav", { className: "text-3xs text-text-muted mb-6", "aria-label": "Breadcrumb", children: /* @__PURE__ */ jsxs("ol", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, { to: "/", className: "hover:text-accent transition-colors", children: "Home" }) }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { children: "›" }),
          /* @__PURE__ */ jsx("span", { children: "About" })
        ] }),
        /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsx("span", { children: "›" }),
          /* @__PURE__ */ jsx("span", { className: "font-medium text-text-secondary capitalize", children: currentTab.replace("-", " & ") })
        ] })
      ] }) }),
      currentTab === "overview" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Laboratory Overview" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Department of ECE, NITTTR Chennai" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "prose prose-invert max-w-none text-text-secondary space-y-6 text-sm leading-relaxed", children: [
          /* @__PURE__ */ jsxs("p", { children: [
            "The",
            " ",
            /* @__PURE__ */ jsx("strong", { className: "text-foreground", children: "Ocean Research Laboratory (ORL)" }),
            " ",
            "is a premier scientific research unit focused on underwater technology, acoustics, and ocean engineering systems. Established originally to address critical signal gaps in underwater acoustic arrays, the lab has expanded into a center for technological validation, doctoral research supervision, and capacity building."
          ] }),
          /* @__PURE__ */ jsx("p", { children: "Currently housed in the Department of Electronics and Communication Engineering at the National Institute of Technical Teachers Training and Research (NITTTR), Chennai, the laboratory provides an active test environment combining digital signal processing algorithms with mechanical deployment platforms." }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-6 sm:grid-cols-2 mt-8", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors duration-300", children: [
              /* @__PURE__ */ jsxs("h3", { className: "font-bold text-foreground text-sm mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Compass, { className: "h-4.5 w-4.5 text-accent" }),
                /* @__PURE__ */ jsx("span", { children: "Acoustic Inversion" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted", children: "Investigating underwater channel estimation, spatial filtering, ambient noise, and signal extraction under heavy marine attenuation." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors duration-300", children: [
              /* @__PURE__ */ jsxs("h3", { className: "font-bold text-foreground text-sm mb-2 flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Globe, { className: "h-4.5 w-4.5 text-accent-secondary" }),
                /* @__PURE__ */ jsx("span", { children: "Underwater Robotic Systems" })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted", children: "Prototyping inspection-class ROVs and testing subsea sensory configurations in real ocean trials and test tank basins." })
            ] })
          ] })
        ] })
      ] }),
      currentTab === "vision-mission" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Vision & Mission" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Our Core Directives" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-6 relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl" }),
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-foreground mb-3 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent" }),
              /* @__PURE__ */ jsx("span", { children: "Vision Statement" })
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-text-secondary leading-relaxed italic", children: "“To be recognized globally as an institutional center of excellence in ocean technologies and underwater acoustics. We strive to pioneer sustainable engineering models, foster interdisciplinary marine studies, and empower technical educators and researchers to navigate and preserve subsea domains.”" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("h3", { className: "text-lg font-bold text-foreground mb-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-accent-secondary" }),
              /* @__PURE__ */ jsx("span", { children: "Mission Objectives" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-accent-secondary font-bold block mb-1", children: "01. Scientific Excellence" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed", children: "Publish high-impact, peer-reviewed oceanographic and acoustic research, pushing boundaries in digital signal processing, coral diagnostics, and subsea automation." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-accent-secondary font-bold block mb-1", children: "02. Capacity Building" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed", children: "Deliver specialized training, technical courses, and workshops for scholars, technical faculty, and international delegations to foster professional capability." })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs font-mono text-accent-secondary font-bold block mb-1", children: "03. Technological Innovation" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed", children: "Prototype custom subsea systems (like ORCA ROV), sensor frameworks, and seawater energy converters, providing reliable consultancy to defense and marine industries." })
              ] })
            ] })
          ] })
        ] })
      ] }),
      currentTab === "history" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "History & Evolution" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "ORL Timeline & Relocation" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "relative border-l border-border ml-3 pl-6 space-y-8", children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent", children: /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-background" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "Present: ORL at NITTTR Chennai (2024 - Present)" }),
            /* @__PURE__ */ jsx("span", { className: "inline-block rounded bg-accent/10 px-2 py-0.5 text-4xs font-bold font-mono text-accent uppercase tracking-wider mt-1 border border-accent/20", children: "Active Focus Area" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-text-secondary leading-relaxed", children: "In September 2024, the laboratory relocated to the National Institute of Technical Teachers Training and Research (NITTTR), Chennai. Now operating in a dedicated technical teacher education environment, ORL merges advanced subsea research with educator training and PG programs, establishing direct validation platforms for underwater telemetry." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-secondary", children: /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-background" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-foreground", children: "Transition & Relocation (2024)" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-text-secondary leading-relaxed", children: "Following Dr. S. Sakthivel Murugan's transition to NITTTR Chennai, the core lab equipment (hydrophone arrays, acoustic profilers, side-scan sonar, and subsea drones) was systematically migrated to support the institute's academic infrastructure." })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "relative opacity-75 hover:opacity-100 transition-opacity", children: [
            /* @__PURE__ */ jsx("div", { className: "absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-text-muted", children: /* @__PURE__ */ jsx("div", { className: "h-2 w-2 rounded-full bg-background" }) }),
            /* @__PURE__ */ jsx("h3", { className: "text-lg font-bold text-text-secondary", children: "Foundation & Early Development (2015)" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-text-muted leading-relaxed", children: "The laboratory originated in 2015 at the SSN College of Engineering as the UnderWater Acoustic Research Lab (UWARL) under the ECE department. Seed funding and initial infrastructure enabled the team to build a 10,874-liter test tank, publish early works on coral classification, and begin prototyping AUV telemetry systems." })
          ] })
        ] })
      ] }),
      currentTab === "collaborations" && /* @__PURE__ */ jsxs("div", { className: "space-y-8 animate-fade-in", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Institutional Collaborations" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold", children: "Synergies & Partnerships" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4", children: [
          /* @__PURE__ */ jsx("p", { children: "To maintain standard validation protocols, ORL engages in active technical partnerships with leading academic institutes, national laboratories, and subsea defense contractors." }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 mt-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide", children: "National Institute of Ocean Technology (NIOT)" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "Joint validation of acoustic ambient noise profiles, sharing datasets on ocean temperature gradients, and collaborative field trials." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide", children: "Indian Institute of Technology (IIT) Madras" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "Research exchanges in subsea hydroacoustic modeling and signal processing algorithms." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground text-xs uppercase tracking-wide", children: "Anna University Chennai" }),
              /* @__PURE__ */ jsx("p", { className: "mt-1 text-2xs text-text-muted", children: "Academic coordination, doctoral evaluations, and advisory committee interactions." })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  AboutPage as component
};
