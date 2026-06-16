import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, ArrowRight, Map, Briefcase, GraduationCap, FileText } from "lucide-react";
import { useSiteSettings } from "@/lib/admin-store";
import { resolveAssetUrl } from "@/lib/storage-service";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Get in touch with the Ocean Research Laboratory at NITTTR Chennai.",
      },
    ],
  }),
  component: ContactPage,
});

interface KeyContact {
  name: string;
  designation: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
}

const KEY_CONTACTS: KeyContact[] = [
  {
    name: "Dr. S. Sakthivel Murugan",
    designation: "Laboratory Head & Professor",
    email: "orl@nitttrc.ac.in",
  },
  {
    name: "Dr. K. Muthumeenakshi",
    designation: "Associate Professor (Research Enquiries)",
    email: "orl@nitttrc.ac.in",
  },
  {
    name: "Dr. S. Sakthivel Murugan",
    designation: "Professor (Consultancy Enquiries)",
    email: "orl@nitttrc.ac.in",
  },
  {
    name: "Dr. S. Sakthivel Murugan",
    designation: "Professor (Training Programmes)",
    email: "orl@nitttrc.ac.in",
  }
];

function ContactPage() {
  const settings = useSiteSettings();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
      
      {/* Section 1 – Contact Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-950/20 via-background to-background py-16 px-6 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(20,184,166,0.12),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-5xl text-center space-y-4 relative z-10 font-sans">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-500 border border-teal-500/25">
            ORL Touchpoint
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {settings.siteName}
          </h1>
          <p className="mx-auto max-w-xl text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest">
            {settings.siteDescription}
          </p>
          <p className="mx-auto max-w-lg text-[11px] text-text-secondary leading-relaxed font-medium pt-2">
            Connecting technical expertise and ocean science. Reach out to our laboratory coordinators for research partnerships, equipment hiring, and postgraduate courses.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-6 mt-12 space-y-16">
        
        {/* Section 2 – Contact Information Cards (Teal Theme) */}
        <section className="space-y-6">
          <div className="text-center border-b border-border/40 pb-4">
            <span className="text-5xs font-mono font-bold uppercase tracking-wider text-teal-500">Channels</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Contact Information</h2>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {/* Postal Address */}
            <div className="p-5 rounded-2xl border border-border bg-card flex gap-4 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1 font-sans">
                <h3 className="font-bold text-foreground text-xs leading-snug group-hover:text-teal-500 transition-colors">
                  Postal Address
                </h3>
                <p className="text-3xs text-text-secondary leading-relaxed pt-1 whitespace-pre-line">
                  {settings.address || `Department of Electronics and Communication Engineering\nNational Institute of Technical Teachers Training and Research\nTaramani, Chennai – 600113\nTamil Nadu, India`}
                </p>
              </div>
            </div>

            {/* Contact Details Stack */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Email Card */}
              <div className="p-5 rounded-2xl border border-border bg-card flex items-center gap-3.5 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none flex-1">
                <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Email</span>
                  <a href={`mailto:${settings.contactEmail}`} className="text-xs font-bold text-foreground hover:text-teal-500 transition-colors break-all">
                    {settings.contactEmail}
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-5 rounded-2xl border border-border bg-card flex items-center gap-3.5 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none flex-1">
                <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Office Contact</span>
                  <p className="text-xs font-mono font-bold text-foreground leading-none">
                    {settings.contactPhone}
                  </p>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="p-5 rounded-2xl border border-border bg-card flex items-center gap-3.5 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none flex-1">
                <div className="h-9 w-9 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs">
                  <Clock className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0">
                  <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Working Hours</span>
                  <p className="text-xs font-sans font-bold text-foreground leading-none">
                    {settings.workingHours}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 – Location Section (Google Maps Embed) */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-teal-500">Mapping</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Lab Location</h2>
            </div>
            
            {/* Open in Google Maps link */}
            <a
              href={settings.googleMapsUrl || "https://maps.google.com/?q=NITTTR+Chennai"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-500/25 bg-teal-500/5 hover:bg-teal-500/10 text-teal-500 text-4xs font-bold uppercase tracking-wider transition cursor-pointer select-none"
            >
              <Map className="h-3.5 w-3.5" /> Open in Google Maps
            </a>
          </div>

          {/* Container designed to prevent layout shifts */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-muted group shadow-xs">
            <iframe
              title="NITTTR Chennai Location Map"
              src={settings.googleMapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8967468114467!2d80.24716497479017!3d12.97841101473636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d614ffdfdd9%3A0xe5a363cb05697d!2sNITTTR%20Chennai!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin"}
              className="w-full h-full border-0 transition duration-300 dark:brightness-[0.75] dark:contrast-[1.2] dark:invert-[0.9] dark:hue-rotate-[180deg]"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>

        {/* Section 4 – Key Contacts */}
        <section className="space-y-6">
          <div className="border-b border-border/40 pb-4">
            <span className="text-5xs font-mono font-bold uppercase tracking-wider text-teal-500">Personnel</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Key Contacts</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {(settings.keyContacts || KEY_CONTACTS).map((contact, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-border bg-card flex flex-col justify-between hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none relative overflow-hidden"
              >
                <div className="space-y-3">
                  {/* Optional Image container: hide if not available */}
                  {contact.imageUrl && (
                    <div className="aspect-square w-full rounded-lg bg-muted overflow-hidden border border-border">
                      <img src={resolveAssetUrl(contact.imageUrl)} alt={contact.name} className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-1 font-sans">
                    <h3 className="font-bold text-foreground text-xs leading-snug group-hover:text-teal-500 transition-colors">
                      {contact.name}
                    </h3>
                    <p className="text-[10px] text-text-secondary leading-normal font-medium">
                      {contact.designation}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border/40 mt-4 text-xs space-y-1.5 font-sans">
                  {contact.email && (
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Mail className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                      <a href={`mailto:${contact.email}`} className="hover:underline break-all leading-none text-4xs font-mono">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  {contact.phone && (
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Phone className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                      <span className="leading-none text-4xs font-mono">{contact.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5 – Collaboration & Research CTA */}
        <section className="font-sans">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-teal-950/20 via-background to-background p-6 md:p-8 space-y-5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_bottom_right,rgba(20,184,166,0.08),rgba(255,255,255,0))]" />
            <div className="relative z-10 space-y-4 text-center sm:text-left">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-teal-500/10 text-teal-500 border border-teal-500/25 uppercase font-mono tracking-wider">
                Explore Laboratory Ecosystem
              </span>
              <h3 className="text-lg font-black text-foreground">
                Join our research projects and collaborations
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed font-medium max-w-2xl">
                Discover active agreements, industrial support services, doctoral candidates and underwater telemetry equipment configurations currently running at UWARL.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <Link
                  to="/collaborations-consultancy"
                  className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary hover:text-teal-500 transition cursor-pointer text-2xs font-bold uppercase tracking-wider"
                >
                  Collaborations & Consultancy <Briefcase className="h-3.5 w-3.5 text-teal-500 shrink-0" />
                </Link>
                <Link
                  to="/research"
                  className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-teal-500 text-teal-950 hover:bg-teal-600 transition cursor-pointer text-2xs font-bold uppercase tracking-wider"
                >
                  Research & Facilities <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
