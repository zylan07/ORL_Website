import { useState, useMemo, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  Handshake,
  Activity,
  Cpu,
  Layers,
  Search,
  X,
  Compass,
  Building2,
  Calendar,
  Users,
  ChevronRight,
  ExternalLink,
  Info,
  Sparkles,
  Wrench,
} from "lucide-react";
import { getDatasetRecords, DATA_SEEDS, useDatasetRecords, useSiteSettings } from "@/lib/admin-store";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { resolveAssetUrl } from "@/lib/storage-service";
import { PageHero } from "@/components/page-hero";
import { parseDateSafe } from "@/lib/utils";

const collabSearchSchema = z.object({
  tab: z.enum(["mous", "institutions", "activities"]).optional(),
});

export const Route = createFileRoute("/collaborations-consultancy")({
  validateSearch: (search) => {
    const res = collabSearchSchema.safeParse(search);
    return res.success ? res.data : {};
  },
  head: () => ({
    meta: [
      { title: "Collaborations & Consultancy — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Explore the academic collaborations, MoUs, technical support services, and consultancy activities at the Ocean Research Laboratory.",
      },
    ],
  }),
  component: CollaborationsPage,
});

// ----------------- CMS-READY DATA STRUCTURES -----------------

export interface MouRecord {
  id: string;
  organization: string;
  date: string;
  researchFocus: string;
  notes?: string;
  thumbnail?: string;
  images?: string[];
  documents?: string[];
  featured?: boolean;
  displayOrder?: number;
  title?: string;
  name?: string;
}

export interface TechnicalSupportService {
  id: string;
  title: string;
  thumbnail?: string;
  images?: string[];
  documents?: string[];
  featured?: boolean;
  displayOrder?: number;
}

export interface PartnerInstitution {
  id: string;
  name: string;
  title?: string;
  location: string;
  collaborationArea?: string;
  notes?: string;
  thumbnail?: string;
  images?: string[];
  documents?: string[];
  featured?: boolean;
  displayOrder?: number;
}

export interface ConsultancyActivity {
  id: string;
  institution: string;
  date: string;
  participants: string;
  purpose: string;
  equipment?: string;
  notes?: string;
  thumbnail?: string;
  images?: string[];
  documents?: string[];
  featured?: boolean;
  displayOrder?: number;
  title?: string;
  name?: string;
}

// ----------------- DATABASES -----------------

export const MOU_RECORDS = getDatasetRecords("collaborations-mous", DATA_SEEDS["collaborations-mous"]) as unknown as MouRecord[];

export const TECHNICAL_SUPPORT_SERVICES: TechnicalSupportService[] = [
  { id: "srv-1", title: "Utilization of Lab Facilities", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 1 },
  { id: "srv-2", title: "Underwater Equipment Hiring", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 2 },
  { id: "srv-3", title: "Technical Support", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 3 },
  { id: "srv-4", title: "Technical & Manpower Support for Data Collection & Processing", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 4 }
];

export const CONSULTANCY_INSTITUTIONS = getDatasetRecords("collaborations-institutions", DATA_SEEDS["collaborations-institutions"]) as unknown as PartnerInstitution[];

export const CONSULTANCY_ACTIVITIES = getDatasetRecords("collaborations-activities", DATA_SEEDS["collaborations-activities"]) as unknown as ConsultancyActivity[];

const serviceIcons: Record<string, any> = {
  "srv-1": Layers,
  "srv-2": Compass,
  "srv-3": Cpu,
  "srv-4": Users
};

// ----------------- UNIFIED DETAIL MODAL -----------------

interface DetailModalProps {
  item: any;
  themeColor: string;
  onClose: () => void;
}

function UnifiedDetailModal({ item, themeColor, onClose }: DetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!item) return null;

  const hasGallery = !!((item.images && item.images.length > 0) || item.thumbnail);
  const galleryImages = [
    ...(item.thumbnail ? [item.thumbnail] : []),
    ...(item.images || [])
  ].filter((v, i, self) => self.indexOf(v) === i);

  const hasDocs = !!(item.documents && item.documents.length > 0);

  const themeClasses: Record<string, { text: string; bg: string; border: string }> = {
    emerald: { text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    teal: { text: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    sky: { text: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    amber: { text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  };

  const currentTheme = themeClasses[themeColor] || { text: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl text-foreground scrollbar-thin md:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 bg-secondary text-text-muted hover:text-foreground transition cursor-pointer hover:bg-secondary/80 border border-border/45"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 pr-8 font-sans">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider border ${currentTheme.bg} ${currentTheme.text} ${currentTheme.border}`}>
            {item.researchFocus ? "Memorandum of Understanding" : item.purpose ? "Consultancy Activity" : "Partner Institution"}
          </span>
          <h3 className="text-lg font-black leading-snug text-foreground">
            {item.organization || item.name || item.title || item.institution}
          </h3>
          {item.date && (
            <p className="text-3xs font-mono text-text-muted flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Date: {item.date}
            </p>
          )}
        </div>

        {/* Modal Body */}
        <div className="space-y-5 border-t border-border/40 pt-4 font-sans text-xs">
          {/* Research Focus */}
          {item.researchFocus && (
            <div>
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Research Focus Area</span>
              <span className="font-semibold text-foreground leading-relaxed block mt-0.5">{item.researchFocus}</span>
            </div>
          )}

          {/* Location */}
          {item.location && (
            <div>
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Location</span>
              <span className="font-semibold text-foreground leading-relaxed block mt-0.5">{item.location}</span>
            </div>
          )}

          {/* Participants */}
          {item.participants && (
            <div>
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Participants / Cohorts</span>
              <span className="font-semibold text-foreground leading-relaxed block mt-0.5">{item.participants}</span>
            </div>
          )}

          {/* Purpose */}
          {item.purpose && (
            <div>
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Activity Purpose</span>
              <p className="text-text-secondary leading-relaxed font-normal mt-0.5">{item.purpose}</p>
            </div>
          )}

          {/* Equipment */}
          {item.equipment && (
            <div>
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Equipment</span>
              <p className="text-text-secondary leading-relaxed font-normal mt-0.5">{item.equipment}</p>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div>
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Historical Notes</span>
              <p className="text-text-secondary leading-relaxed font-normal mt-0.5">{item.notes}</p>
            </div>
          )}

          {/* Documents Section */}
          {hasDocs && (
            <div className="space-y-1.5 pt-2">
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Associated Documents</span>
              {item.documents.map((doc: string, idx: number) => (
                <a
                  key={idx}
                  href={resolveAssetUrl(doc)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline mt-1"
                >
                  View Document {idx + 1} <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          )}

          {/* Future Gallery */}
          {hasGallery && galleryImages.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border/40">
              <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Uploaded Photo Records</span>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-2">
                {galleryImages.map((img: string, idx: number) => (
                  <div key={idx} className="relative aspect-square overflow-hidden rounded-lg border border-border/40 bg-muted">
                    <img src={resolveAssetUrl(img)} alt={`Record photo ${idx + 1}`} className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------- MAIN COMPONENT -----------------

function CollaborationsPage() {
  const settings = useSiteSettings();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("emerald");
  const [searchQuery, setSearchQuery] = useState("");

  const rawMouRecords = useDatasetRecords("collaborations-mous", DATA_SEEDS["collaborations-mous"]) as unknown as MouRecord[];
  const mouRecords = useMemo(() => {
    return [...rawMouRecords].sort((a, b) => parseDateSafe(a.date).getTime() - parseDateSafe(b.date).getTime());
  }, [rawMouRecords]);

  const consultancyInstitutions = useDatasetRecords("collaborations-institutions", DATA_SEEDS["collaborations-institutions"]) as unknown as PartnerInstitution[];

  const rawConsultancyActivities = useDatasetRecords("collaborations-activities", DATA_SEEDS["collaborations-activities"]) as unknown as ConsultancyActivity[];
  const consultancyActivities = useMemo(() => {
    return [...rawConsultancyActivities].sort((a, b) => parseDateSafe(b.date).getTime() - parseDateSafe(a.date).getTime());
  }, [rawConsultancyActivities]);

  const openDetail = (item: any, theme: string) => {
    setSelectedItem(item);
    setSelectedTheme(theme);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  // Smooth scroll handler
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 110;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth"
      });
    }
  };

  // Dynamic Metrics List
  const stats = useMemo(() => {
    return [
      { label: "MoUs", count: mouRecords.length, theme: "emerald", sectionId: "mous", icon: Handshake },
      { label: "Partner Institutions", count: consultancyInstitutions.length, theme: "sky", sectionId: "institutions", icon: Building2 },
      { label: "Consultancy Activities", count: consultancyActivities.length, theme: "amber", sectionId: "activities", icon: Activity }
    ];
  }, [mouRecords, consultancyInstitutions, consultancyActivities]);

  // Filtered Partner Institutions
  const filteredInstitutions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return consultancyInstitutions;
    return consultancyInstitutions.filter(
      (inst) =>
        (inst.name || inst.title || "").toLowerCase().includes(q) ||
        (inst.location || "").toLowerCase().includes(q)
    );
  }, [searchQuery, consultancyInstitutions]);

  const navItems = [
    { label: "MoUs", id: "mous", icon: Handshake, count: mouRecords.length, theme: "emerald" as const },
    { label: "Partner Institutions", id: "institutions", icon: Building2, count: filteredInstitutions.length, theme: "indigo" as const },
    { label: "Consultancy Activities", id: "activities", icon: Activity, count: consultancyActivities.length, theme: "cyan" as const }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300">
      
      {/* 1. Hero Section */}
      <PageHero
        title={settings.collaborationsHero?.title || "Collaborations & Consultancy"}
        subtitle={settings.collaborationsHero?.subtitle || "Bridging Academia, Industry, and Marine Field Operations"}
        description={settings.collaborationsHero?.description || "MoUs, industry projects, consultancy initiatives, and technical committees where ORL faculty actively participate."}
        mediaType={settings.collaborationsHero?.mediaType || "none"}
        mediaUrl={settings.collaborationsHero?.mediaUrl || ""}
        mediaPosition={settings.collaborationsHero?.mediaPosition || "background"}
        overlayOpacity={settings.collaborationsHero?.overlayOpacity !== undefined ? settings.collaborationsHero.overlayOpacity : 60}
      />

      {/* Team statement quote block */}
      <div className="mx-auto max-w-4xl px-6 mt-6">
        <div className="mx-auto max-w-2xl border-l-2 border-border/60 pl-4 py-1.5 text-left bg-secondary/20 rounded-r-lg">
          <p className="text-xs text-text-secondary leading-relaxed font-sans italic font-medium">
            "We as a team are looking forward and willing to collaborate with research institute / organization / college / individual who shares equal interest and wishes to achieve high goals in underwater related fields."
          </p>
        </div>
      </div>

      {/* Sticky Section Navigation */}
      <StickySectionNav items={navItems} />
      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-6 mt-12 space-y-16">
        
        {/* 1. Collaboration Opportunities CTA Section */}
        <section className="pt-4 font-sans">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-indigo-950/20 via-background to-background p-6 md:p-8 space-y-5">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_bottom_right,rgba(16,185,129,0.08),rgba(255,255,255,0))]" />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 uppercase font-mono tracking-wider">
                Consortium Invitation
              </span>
              <h3 className="text-lg font-black text-foreground">
                Collaboration Opportunities
              </h3>
              <div className="space-y-3.5 text-xs leading-relaxed text-text-secondary font-medium">
                <p>
                  "We extend our help to Research Institute by providing technical support, the utilization of lab facilities, underwater equipment hiring, technical and manpower support for data collection and data processing."
                </p>
                <p className="border-t border-border/40 pt-3.5">
                  "We as a team are looking forward and willing to collaborate with research institute/organization/college/individual who shares equal interest and wishes to achieve high goals in Underwater related fields"
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. MoU Timeline (Emerald Theme - Passport Grid) */}
        <section id="mous" className="scroll-mt-24 space-y-8">
          <div className="border-b border-border/40 pb-4 text-center">
            <span className="text-5xs font-mono font-bold uppercase tracking-wider text-emerald-500">Scientific Accords</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Memorandums of Understanding (MoU)</h2>
          </div>

          {mouRecords.length === 0 ? (
            <div className="text-center text-text-muted text-xs py-8 font-sans">No records available.</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {mouRecords.map((mou) => {
                const year = mou.date ? (mou.date.match(/\b\d{4}\b/)?.[0] || mou.date) : "N/A";
                const imgUrl = mou.thumbnail || (mou.images && mou.images.length > 0 ? mou.images[0] : null);
                return (
                  <div
                    key={mou.id}
                    onClick={() => openDetail(mou, "emerald")}
                    className="group relative rounded-2xl border border-border bg-card/60 p-5 transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] select-none flex flex-col justify-between cursor-pointer hover:border-emerald-500/35"
                  >
                    <div>
                      {/* Image Container */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/40 bg-muted mb-4 shadow-inner">
                        {imgUrl ? (
                          <img
                            src={resolveAssetUrl(imgUrl)}
                            alt={mou.organization || mou.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-500/10 to-emerald-600/20 text-emerald-500 border border-emerald-500/10">
                            <Handshake className="h-10 w-10 opacity-70 mb-1" />
                            <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-60">Academic MoU</span>
                          </div>
                        )}
                      </div>

                      {/* Text Content */}
                      <div className="space-y-2 font-sans">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 uppercase font-mono tracking-wider">
                            MoU Accord
                          </span>
                          <span className="text-5xs text-text-muted font-mono flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {year}
                          </span>
                        </div>
                        <h3 className="font-bold text-foreground text-xs leading-snug group-hover:text-emerald-500 transition-colors">
                          {mou.organization || mou.title}
                        </h3>
                        {mou.researchFocus && (
                          <p className="text-4xs text-text-secondary leading-relaxed font-sans line-clamp-3">
                            <strong className="text-text-muted block text-5xs uppercase tracking-wider font-semibold font-mono">Scope of Focus:</strong>
                            {mou.researchFocus}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-emerald-500 mt-4 border-t border-border/20">
                      <span>View Scope & Notes</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 3. Partner Institutions Grid (Sky Theme - Larger Logos) */}
        <section id="institutions" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-sky-500">Collaboration Consortium</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Partner Institutions</h2>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search institutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-sky-500/50 transition font-sans"
              />
            </div>
          </div>

          <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            {filteredInstitutions.map((inst) => (
              <div
                key={inst.id}
                onClick={() => openDetail(inst, "sky")}
                className="p-5 rounded-2xl border border-border bg-card/60 hover:border-sky-500/35 hover:shadow-md hover:translate-y-[-4px] transition duration-300 cursor-pointer flex flex-col items-center text-center justify-between aspect-square group select-none"
              >
                {/* Logo Container */}
                <div className="w-24 h-24 flex items-center justify-center bg-secondary/20 rounded-xl p-3 border border-border/40 overflow-hidden shrink-0 shadow-inner">
                  {inst.thumbnail ? (
                    <img
                      src={resolveAssetUrl(inst.thumbnail)}
                      alt={inst.name || inst.title}
                      className="max-w-full max-h-full object-contain filter dark:brightness-95 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-sky-500 select-none">
                      <Building2 className="h-8 w-8 opacity-70 mb-1" />
                      <span className="text-[11px] font-black font-mono">{(inst.name || inst.title || "").charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1 min-w-0 mt-3 flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-foreground text-xs leading-snug group-hover:text-sky-500 transition-colors line-clamp-2">
                    {inst.name || inst.title}
                  </h3>
                  <p className="text-5xs text-text-muted font-sans font-medium uppercase tracking-wider line-clamp-1">{inst.location}</p>
                </div>
              </div>
            ))}
            {filteredInstitutions.length === 0 && (
              <div className="col-span-full text-center text-text-muted text-xs py-6 font-sans">
                {consultancyInstitutions.length === 0 ? "No records available." : "No partner institutions match the active search."}
              </div>
            )}
          </div>
        </section>

        {/* 4. Consultancy Activities Timeline (Amber Theme - Image-First Grid) */}
        <section id="activities" className="scroll-mt-24 space-y-6">
          <div className="border-b border-border/40 pb-4">
            <span className="text-5xs font-mono font-bold uppercase tracking-wider text-amber-500">Consultancy Operations</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Recent Consultancy Activities</h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {consultancyActivities.map((act) => {
              const imgUrl = act.thumbnail || (act.images && act.images.length > 0 ? act.images[0] : null);
              return (
                <div
                  key={act.id}
                  onClick={() => openDetail(act, "amber")}
                  className="group relative rounded-2xl border border-border bg-card/60 p-5 transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] select-none flex flex-col justify-between cursor-pointer hover:border-amber-500/35"
                >
                  <div>
                    {/* Image Container */}
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border/40 bg-muted mb-4 shadow-inner">
                      {imgUrl ? (
                        <img
                          src={resolveAssetUrl(imgUrl)}
                          alt={act.institution || act.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 to-amber-600/20 text-amber-500 border border-amber-500/10">
                          <Activity className="h-10 w-10 opacity-70 mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider font-mono opacity-60">Consultancy</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3 font-sans">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 uppercase font-mono tracking-wider">
                          Technical Consultancy
                        </span>
                        <span className="text-5xs text-text-muted font-mono flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {act.date}
                        </span>
                      </div>
                      <h3 className="font-bold text-foreground text-xs leading-snug group-hover:text-amber-500 transition-colors">
                        {act.institution || act.title}
                      </h3>
                      
                      <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
                        {act.participants && (
                          <div>
                            <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Cohort Participants</span>
                            <p className="text-foreground font-semibold mt-0.5 leading-snug">{act.participants}</p>
                          </div>
                        )}
                        {act.purpose && (
                          <div>
                            <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Purpose</span>
                            <p className="text-text-secondary font-medium leading-relaxed mt-0.5 line-clamp-3">{act.purpose}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-500 mt-4 border-t border-border/20">
                    <span>View Consultancy Details</span>
                    <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
            {consultancyActivities.length === 0 && (
              <div className="col-span-2 text-center text-text-muted text-xs py-8 font-sans">No records available.</div>
            )}
          </div>
        </section>
      </div>

      {/* 8. Reusable Unified Detail Modal */}
      {selectedItem && (
        <UnifiedDetailModal
          item={selectedItem}
          themeColor={selectedTheme}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
