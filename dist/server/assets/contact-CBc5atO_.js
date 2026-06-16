import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { MapPin, Mail, Phone, Clock, Map, Briefcase, GraduationCap } from "lucide-react";
import { k as useSiteSettings, r as resolveAssetUrl } from "./router-ScoMlXed.js";
import "@tanstack/react-query";
import "react";
import "zod";
const KEY_CONTACTS = [{
  name: "Dr. S. Sakthivel Murugan",
  designation: "Laboratory Head & Professor",
  email: "orl@nitttrc.ac.in"
}, {
  name: "Dr. K. Muthumeenakshi",
  designation: "Associate Professor (Research Enquiries)",
  email: "orl@nitttrc.ac.in"
}, {
  name: "Dr. S. Sakthivel Murugan",
  designation: "Professor (Consultancy Enquiries)",
  email: "orl@nitttrc.ac.in"
}, {
  name: "Dr. S. Sakthivel Murugan",
  designation: "Professor (Training Programmes)",
  email: "orl@nitttrc.ac.in"
}];
function ContactPage() {
  const settings = useSiteSettings();
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground pb-20 transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden bg-gradient-to-b from-teal-950/20 via-background to-background py-16 px-6 border-b border-border/40", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.12),rgba(255,255,255,0))]" }),
      /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl text-center space-y-4 relative z-10 font-sans", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-500 border border-teal-500/25", children: "ORL Touchpoint" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl", children: settings.siteName }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-xl text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest", children: settings.siteDescription }),
        /* @__PURE__ */ jsx("p", { className: "mx-auto max-w-lg text-[11px] text-text-secondary leading-relaxed font-medium pt-2", children: "Connecting technical expertise and ocean science. Reach out to our laboratory coordinators for research partnerships, equipment hiring, and postgraduate courses." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-4xl px-6 mt-12 space-y-16", children: [
      /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-teal-500", children: "Channels" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Contact Information" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl border border-border bg-card flex gap-4 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none", children: [
            /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs", children: /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 font-sans", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-teal-500 transition-colors", children: "Postal Address" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed pt-1 whitespace-pre-line", children: settings.address || `Department of Electronics and Communication Engineering
National Institute of Technical Teachers Training and Research
Taramani, Chennai – 600113
Tamil Nadu, India` })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4 flex flex-col justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl border border-border bg-card flex items-center gap-3.5 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs", children: /* @__PURE__ */ jsx(Mail, { className: "h-4.5 w-4.5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Email" }),
                /* @__PURE__ */ jsx("a", { href: `mailto:${settings.contactEmail}`, className: "text-xs font-bold text-foreground hover:text-teal-500 transition-colors break-all", children: settings.contactEmail })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl border border-border bg-card flex items-center gap-3.5 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs", children: /* @__PURE__ */ jsx(Phone, { className: "h-4.5 w-4.5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Office Contact" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-mono font-bold text-foreground leading-none", children: settings.contactPhone })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl border border-border bg-card flex items-center gap-3.5 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs", children: /* @__PURE__ */ jsx(Clock, { className: "h-4.5 w-4.5" }) }),
              /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsx("span", { className: "text-5xs uppercase tracking-wider text-text-muted block font-semibold", children: "Working Hours" }),
                /* @__PURE__ */ jsx("p", { className: "text-xs font-sans font-bold text-foreground leading-none", children: settings.workingHours })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-teal-500", children: "Mapping" }),
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Lab Location" })
          ] }),
          /* @__PURE__ */ jsxs("a", { href: settings.googleMapsUrl || "https://maps.google.com/?q=NITTTR+Chennai", target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-500/25 bg-teal-500/5 hover:bg-teal-500/10 text-teal-500 text-4xs font-bold uppercase tracking-wider transition cursor-pointer select-none", children: [
            /* @__PURE__ */ jsx(Map, { className: "h-3.5 w-3.5" }),
            " Open in Google Maps"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "relative aspect-video rounded-2xl overflow-hidden border border-border bg-muted group shadow-xs", children: /* @__PURE__ */ jsx("iframe", { title: "NITTTR Chennai Location Map", src: settings.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8967468114467!2d80.24716497479017!3d12.97841101473636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d614ffdfdd9%3A0xe5a363cb05697d!2sNITTTR%20Chennai!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin", className: "w-full h-full border-0 transition duration-300 dark:brightness-[0.75] dark:contrast-[1.2] dark:invert-[0.9] dark:hue-rotate-[180deg]", allowFullScreen: false, loading: "lazy", referrerPolicy: "no-referrer-when-downgrade" }) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "border-b border-border/40 pb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-5xs font-mono font-bold uppercase tracking-wider text-teal-500", children: "Personnel" }),
          /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans", children: "Key Contacts" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 md:grid-cols-4", children: (settings.keyContacts || KEY_CONTACTS).map((contact, idx) => /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-2xl border border-border bg-card flex flex-col justify-between hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none relative overflow-hidden", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            contact.imageUrl && /* @__PURE__ */ jsx("div", { className: "aspect-square w-full rounded-lg bg-muted overflow-hidden border border-border", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(contact.imageUrl), alt: contact.name, className: "h-full w-full object-cover" }) }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-1 font-sans", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-xs leading-snug group-hover:text-teal-500 transition-colors", children: contact.name }),
              /* @__PURE__ */ jsx("p", { className: "text-[10px] text-text-secondary leading-normal font-medium", children: contact.designation })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "pt-4 border-t border-border/40 mt-4 text-xs space-y-1.5 font-sans", children: [
            contact.email && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-text-muted", children: [
              /* @__PURE__ */ jsx(Mail, { className: "h-3.5 w-3.5 text-teal-500 shrink-0" }),
              /* @__PURE__ */ jsx("a", { href: `mailto:${contact.email}`, className: "hover:underline break-all leading-none text-4xs font-mono", children: contact.email })
            ] }),
            contact.phone && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 text-text-muted", children: [
              /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5 text-teal-500 shrink-0" }),
              /* @__PURE__ */ jsx("span", { className: "leading-none text-4xs font-mono", children: contact.phone })
            ] })
          ] })
        ] }, idx)) })
      ] }),
      /* @__PURE__ */ jsx("section", { className: "font-sans", children: /* @__PURE__ */ jsxs("div", { className: "relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-teal-950/20 via-background to-background p-6 md:p-8 space-y-5", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_bottom_right,rgba(20,184,166,0.08),rgba(255,255,255,0))]" }),
        /* @__PURE__ */ jsxs("div", { className: "relative z-10 space-y-4 text-center sm:text-left", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-teal-500/10 text-teal-500 border border-teal-500/25 uppercase font-mono tracking-wider", children: "Explore Laboratory Ecosystem" }),
          /* @__PURE__ */ jsx("h3", { className: "text-lg font-black text-foreground", children: "Join our research projects and collaborations" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed font-medium max-w-2xl", children: "Discover active agreements, industrial support services, doctoral candidates and underwater telemetry equipment configurations currently running at UWARL." }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row gap-3 pt-3", children: [
            /* @__PURE__ */ jsxs(Link, { to: "/collaborations-consultancy", className: "inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary hover:text-teal-500 transition cursor-pointer text-2xs font-bold uppercase tracking-wider", children: [
              "Collaborations & Consultancy ",
              /* @__PURE__ */ jsx(Briefcase, { className: "h-3.5 w-3.5 text-teal-500 shrink-0" })
            ] }),
            /* @__PURE__ */ jsxs(Link, { to: "/research", className: "inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-teal-500 text-teal-950 hover:bg-teal-600 transition cursor-pointer text-2xs font-bold uppercase tracking-wider", children: [
              "Research & Facilities ",
              /* @__PURE__ */ jsx(GraduationCap, { className: "h-3.5 w-3.5 shrink-0" })
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  ContactPage as component
};
