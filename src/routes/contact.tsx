import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock, ArrowRight, Map, Briefcase, GraduationCap, FileText } from "lucide-react";
import { useSiteSettings } from "@/lib/admin-store";
import { resolveAssetUrl } from "@/lib/storage-service";
import { PageHero } from "@/components/page-hero";
import { hasContent } from "@/lib/utils";

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

function ContactPage() {
  const settings = useSiteSettings();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <PageHero
        title={settings.contactHero?.title || "Contact Details"}
        subtitle={settings.contactHero?.subtitle || "Ocean Research Laboratory"}
        description={settings.contactHero?.description || "Reach out to the ORL team for academic collaborations, industrial consultancy, student internships, or technical facility usage requests."}
        mediaType={settings.contactHero?.mediaType || "none"}
        mediaUrl={settings.contactHero?.mediaUrl || ""}
        mediaPosition={settings.contactHero?.mediaPosition || "background"}
        overlayOpacity={settings.contactHero?.overlayOpacity !== undefined ? settings.contactHero.overlayOpacity : 60}
      />

      <div className="mx-auto max-w-4xl px-6 mt-12 space-y-16">
        
        {/* Section 2 – Contact Information Cards (Teal Theme) */}
        {(hasContent(settings.address) || hasContent(settings.contactEmail) || hasContent(settings.contactPhone) || hasContent(settings.workingHours)) && (
          <section className="space-y-6">
            <div className="text-center border-b border-border/40 pb-4">
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-teal-500">Channels</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Contact Information</h2>
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Postal Address */}
              {hasContent(settings.address) && (
                <div className="p-5 rounded-2xl border border-border bg-card flex gap-4 hover:border-teal-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 group select-none">
                  <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-500 shrink-0 shadow-xs">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="space-y-1 font-sans">
                    <h3 className="font-bold text-foreground text-xs leading-snug group-hover:text-teal-500 transition-colors">
                      Postal Address
                    </h3>
                    <p className="text-3xs text-text-secondary leading-relaxed pt-1 whitespace-pre-line">
                      {settings.address}
                    </p>
                  </div>
                </div>
              )}

              {/* Contact Details Stack */}
              {(hasContent(settings.contactEmail) || hasContent(settings.contactPhone) || hasContent(settings.workingHours)) && (
                <div className="space-y-4 flex flex-col justify-between">
                  {/* Email Card */}
                  {hasContent(settings.contactEmail) && (
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
                  )}

                  {/* Phone Card */}
                  {hasContent(settings.contactPhone) && (
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
                  )}

                  {/* Working Hours Card */}
                  {hasContent(settings.workingHours) && (
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
                  )}
                </div>
              )}
            </div> {/* Close Grid container */}
          </section>
        )}

        {/* Section 3 – Lab Location */}
        {hasContent(settings.googleMapsEmbedUrl) && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-border/40 pb-4">
              <div>
                <span className="text-5xs font-mono font-bold uppercase tracking-wider text-teal-500">Mapping</span>
                <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Lab Location</h2>
              </div>
              
              {/* Open in Google Maps link */}
              {hasContent(settings.googleMapsUrl) && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-500/25 bg-teal-500/5 hover:bg-teal-500/10 text-teal-500 text-4xs font-bold uppercase tracking-wider transition cursor-pointer select-none"
                >
                  <Map className="h-3.5 w-3.5" /> Open in Google Maps
                </a>
              )}
            </div>
   
            {/* Container designed to prevent layout shifts */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-border bg-muted group shadow-xs">
              <iframe
                title="NITTTR Chennai Location Map"
                src={settings.googleMapsEmbedUrl}
                className="w-full h-full border-0 transition duration-300 dark:brightness-[0.75] dark:contrast-[1.2] dark:invert-[0.9] dark:hue-rotate-[180deg]"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </section>
        )}

        {/* Section 4 – Collaboration & Research CTA */}
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
