import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getDatasetRecords, DATA_SEEDS, useDatasetRecords } from "@/lib/admin-store";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { resolveAssetUrl } from "@/lib/storage-service";
import { z } from "zod";
import {
  Compass,
  Activity,
  Cpu,
  Anchor,
  Layers,
  FlaskConical,
  Sparkles,
  BookOpen,
  Users,
  ArrowRight,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MapPin,
  ChevronRight,
  Shield,
} from "lucide-react";

const researchSearchSchema = z.object({
  tab: z
    .enum([
      "areas",
      "facilities",
      "field-activities",
      "funded-projects",
      "student-projects",
      "supervision",
    ])
    .optional(),
});

export const Route = createFileRoute("/research")({
  validateSearch: (search) => researchSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Research & Facilities | Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Explore research areas, advanced testing facilities, subsea robotic platforms, field trials, and funded projects at ORL.",
      },
    ],
  }),
  component: ResearchPage,
});

// ----------------- CONFIGURABLE DATA MODELS (CMS-READY) -----------------
import {
  PLACEHOLDER_IMAGES,
  ProjectRecord,
  EquipmentRecord,
  FieldActivityRecord,
  PROJECTS_DATABASE,
  EQUIPMENT_DATABASE,
  FIELD_ACTIVITIES_DATABASE
} from "@/lib/research-data";

export interface FacilityCategory {
  id: string;
  name: string;
  icon: any;
  count: number;
  description: string;
  images?: string[];
  thumbnail?: string;
}

// Facilities categories mapping
const FACILITIES_CATEGORIES: FacilityCategory[] = [
  {
    id: "underwater-platforms",
    name: "Underwater Platforms",
    icon: Compass,
    count: EQUIPMENT_DATABASE.filter(eq => eq.category === "underwater-platforms").length,
    description: "ROVs, underwater drones and inspection systems.",
    thumbnail: PLACEHOLDER_IMAGES.facility,
    images: [PLACEHOLDER_IMAGES.facility]
  },
  {
    id: "acoustic-systems",
    name: "Acoustic & Survey Systems",
    icon: Anchor,
    count: EQUIPMENT_DATABASE.filter(eq => eq.category === "acoustic-systems").length,
    description: "Sonars, hydrophones and survey instrumentation.",
    thumbnail: PLACEHOLDER_IMAGES.facility,
    images: [PLACEHOLDER_IMAGES.facility]
  },
  {
    id: "test-facilities",
    name: "Test Facilities",
    icon: Layers,
    count: EQUIPMENT_DATABASE.filter(eq => eq.category === "test-facilities").length,
    description: "Indoor transparent basins, testing tanks, and soil beds.",
    thumbnail: PLACEHOLDER_IMAGES.facility,
    images: [PLACEHOLDER_IMAGES.facility]
  },
  {
    id: "sensors-comm",
    name: "Sensors & Communication",
    icon: Cpu,
    count: EQUIPMENT_DATABASE.filter(eq => eq.category === "sensors-comm").length,
    description: "Inertial measurement sensors, transceivers and cameras.",
    thumbnail: PLACEHOLDER_IMAGES.facility,
    images: [PLACEHOLDER_IMAGES.facility]
  },
  {
    id: "field-equipment",
    name: "Field Equipment",
    icon: Activity,
    count: EQUIPMENT_DATABASE.filter(eq => eq.category === "field-equipment").length,
    description: "Spools, winches, amplifiers and ocean safety gear.",
    thumbnail: PLACEHOLDER_IMAGES.facility,
    images: [PLACEHOLDER_IMAGES.facility]
  }
];

interface DetailModalProps {
  item: any;
  type: "project" | "equipment" | "activity" | null;
  onClose: () => void;
}

function DetailModal({ item, type, onClose }: DetailModalProps) {
  if (!item || !type) return null;

  // Safe parsing for array fields that could be stored as strings in database
  const specsArray = useMemo(() => {
    if (!item.specs) return [];
    if (Array.isArray(item.specs)) return item.specs;
    if (typeof item.specs === "string") {
      try {
        const parsed = JSON.parse(item.specs);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return item.specs.split(",").map((s: string) => {
          const parts = s.split(":");
          return { label: parts[0]?.trim() || "Spec", value: parts.slice(1).join(":")?.trim() || "" };
        });
      }
    }
    return [];
  }, [item.specs]);

  const teamArray = useMemo(() => {
    if (!item.team) return [];
    if (Array.isArray(item.team)) return item.team;
    if (typeof item.team === "string") {
      try {
        const parsed = JSON.parse(item.team);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return item.team.split(",").map((t: string) => t.trim()).filter(Boolean);
      }
    }
    return [];
  }, [item.team]);

  const equipmentTagsArray = useMemo(() => {
    if (!item.equipmentTags) return [];
    if (Array.isArray(item.equipmentTags)) return item.equipmentTags;
    if (typeof item.equipmentTags === "string") {
      try {
        const parsed = JSON.parse(item.equipmentTags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return item.equipmentTags.split(",").map((t: string) => t.trim()).filter(Boolean);
      }
    }
    return [];
  }, [item.equipmentTags]);

  // Determine available sections
  const hasOverview = !!(item.description || item.purpose);
  
  const hasProjectDetails = !!(
    item.fundingAgency ||
    item.amount ||
    item.duration ||
    item.pi ||
    item.copi ||
    item.role ||
    item.location ||
    item.date ||
    (specsArray.length > 0) ||
    item.url
  );

  const hasTeam = teamArray.length > 0;
  const hasEquipment = equipmentTagsArray.length > 0;
  const hasPublications = !!(item.publicationCount && item.publicationCount > 0);
  const hasGallery = !!(
    (item.images && item.images.length > 0) ||
    item.thumbnail ||
    item.image
  );

  const modalThumbnail = item.thumbnail || item.image;

  // Deduplicate gallery images so we don't display the cover image/thumbnail twice
  const galleryImages = useMemo(() => {
    const list: string[] = [];
    if (modalThumbnail) list.push(modalThumbnail);
    if (item.images && Array.isArray(item.images)) {
      item.images.forEach((img: string) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    return list;
  }, [modalThumbnail, item.images]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-cyan-500/20 bg-card p-6 shadow-2xl text-foreground scrollbar-thin md:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 bg-secondary text-text-muted hover:text-foreground transition cursor-pointer hover:bg-secondary/80"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 pr-8">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 border border-cyan-500/25">
              {type === "project" ? `${item.type} project` : type}
            </span>
            {item.status && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider border ${
                item.status === "Ongoing" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                item.status === "Thesis Submitted" ? "bg-sky-500/10 text-sky-500 border-sky-500/20" :
                "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              }`}>
                {item.status}
              </span>
            )}
            {item.activityType && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                {item.activityType}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-foreground leading-snug font-sans">
            {item.title || item.name}
          </h3>
          {item.scholar && (
            <p className="text-xs text-text-secondary font-medium font-sans">
              Scholar: <span className="text-foreground">{item.scholar}</span>
            </p>
          )}
          {item.researchArea && (
            <p className="text-xs text-text-secondary font-medium font-sans">
              Area: <span className="text-foreground">{item.researchArea}</span>
            </p>
          )}
        </div>

        {/* Modal Content Flow */}
        <div className="space-y-6">
          {type === "activity" ? (
            // Dedicated Field Activity modal layout
            <>
              {/* Gallery (top) */}
              {hasGallery && (
                <div className="space-y-3 pt-4 border-t border-border/30 first:pt-0 first:border-0 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Gallery</h4>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {galleryImages.map((img: string, index: number) => (
                      <div key={index} className="relative aspect-video overflow-hidden rounded-lg border border-border/40 bg-muted">
                        <img
                          src={resolveAssetUrl(img)}
                          alt={`${item.title || item.name || "Activity asset"} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              {item.description && (
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Overview</h4>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans">{item.description}</p>
                </div>
              )}

              {/* Location */}
              {item.location && (
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Location</h4>
                  <div className="flex items-center gap-2 text-xs font-sans text-foreground font-semibold">
                    <MapPin className="h-4 w-4 text-cyan-500 shrink-0" />
                    <span>{item.location}</span>
                  </div>
                </div>
              )}

              {/* Date */}
              {item.date && (
                <div className="space-y-3 pt-4 border-t border-border/30">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Date</h4>
                  <span className="text-xs font-semibold text-foreground font-sans">{item.date}</span>
                </div>
              )}

              {/* Equipment Used */}
              {hasEquipment && (
                <div className="space-y-3 pt-4 border-t border-border/30 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Equipment Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {equipmentTagsArray.map((tag: string, tIdx: number) => (
                      <span key={tIdx} className="text-4xs font-mono font-bold bg-indigo-500/10 text-indigo-500 px-2.5 py-1 rounded border border-indigo-500/25">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members */}
              {hasTeam && (
                <div className="space-y-3 pt-4 border-t border-border/30 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Team Members</h4>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {teamArray.map((member: string, mIdx: number) => (
                      <li key={mIdx} className="flex items-center gap-2 text-xs text-text-secondary bg-secondary/30 px-3 py-2 rounded-lg border border-border/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                        <span className="font-medium text-foreground">{member}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Additional Details */}
              {item.url && (
                <div className="space-y-3 pt-4 border-t border-border/30 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Additional Details</h4>
                  <div className="pt-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline"
                    >
                      View System Documentation <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Projects and Equipment standard layout
            <>
              {/* Overview */}
              {hasOverview && (
                <div className="space-y-3 pt-4 border-t border-border/30 first:pt-0 first:border-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Overview</h4>
                  {item.description && (
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">{item.description}</p>
                  )}
                  {item.purpose && (
                    <p className="text-xs text-text-secondary leading-relaxed font-sans">{item.purpose}</p>
                  )}
                </div>
              )}

              {/* Details */}
              {hasProjectDetails && (
                <div className="space-y-3 pt-4 border-t border-border/30 first:pt-0 first:border-0">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono font-bold">Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                    {item.fundingAgency && (
                      <div>
                        <span className="text-5xs font-bold uppercase tracking-wider text-text-muted block">Funding Agency</span>
                        <span className="font-semibold text-foreground">{item.fundingAgency}</span>
                      </div>
                    )}
                    {item.amount && (
                      <div>
                        <span className="text-5xs font-bold uppercase tracking-wider text-text-muted block">Project Cost / Grant</span>
                        <span className="font-semibold text-foreground">{item.amount}</span>
                      </div>
                    )}
                    {item.duration && (
                      <div>
                        <span className="text-5xs font-bold uppercase tracking-wider text-text-muted block">Duration</span>
                        <span className="font-semibold text-foreground">{item.duration}</span>
                      </div>
                    )}
                    {item.role && (
                      <div>
                        <span className="text-5xs font-bold uppercase tracking-wider text-text-muted block">Supervisor Role</span>
                        <span className="font-semibold text-foreground">{item.role}</span>
                      </div>
                    )}
                    {item.pi && (
                      <div>
                        <span className="text-5xs font-bold uppercase tracking-wider text-text-muted block">Principal Investigator (PI)</span>
                        <span className="font-semibold text-foreground">{item.pi}</span>
                      </div>
                    )}
                    {item.copi && (
                      <div className="col-span-2">
                        <span className="text-5xs font-bold uppercase tracking-wider text-text-muted block">Co-Investigator(s) (Co-PI)</span>
                        <span className="font-semibold text-foreground">{item.copi}</span>
                      </div>
                    )}
                  </div>

                  {/* Specs */}
                  {specsArray.length > 0 && (
                    <div className="border-t border-border/20 pt-3 space-y-2">
                      <span className="text-5xs font-bold uppercase tracking-wider text-text-muted block">Technical Specifications</span>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {specsArray.map((spec: any, sIdx: number) => (
                          <div key={sIdx} className="flex justify-between items-start text-xs border-b border-border/10 pb-1.5 pr-2">
                            <span className="text-text-muted font-medium">{spec.label}</span>
                            <span className="font-semibold text-foreground text-right">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {item.url && (
                    <div className="pt-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline"
                      >
                        View System Documentation <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Team Members */}
              {hasTeam && (
                <div className="space-y-3 pt-4 border-t border-border/30 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Team Members</h4>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {teamArray.map((member: string, mIdx: number) => (
                      <li key={mIdx} className="flex items-center gap-2 text-xs text-text-secondary bg-secondary/30 px-3 py-2 rounded-lg border border-border/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                        <span className="font-medium text-foreground">{member}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Publications */}
              {hasPublications && (
                <div className="space-y-3 pt-4 border-t border-border/30 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Publications</h4>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-secondary/15 rounded-xl border border-border/30">
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 text-cyan-500 animate-pulse" />
                      <div className="text-left">
                        <div className="text-base font-black text-cyan-500 leading-none">{item.publicationCount}</div>
                        <span className="text-5xs font-bold text-text-secondary uppercase tracking-wider">Publications Produced</span>
                      </div>
                    </div>
                    <Link
                      to="/publications"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline"
                    >
                      View Publications Catalog <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}

              {/* Associated Documents */}
              {item.documents && item.documents.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/30 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Associated Documents</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.documents.map((doc: string, docIdx: number) => (
                      <a
                        key={docIdx}
                        href={resolveAssetUrl(doc)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline"
                      >
                        View Report {docIdx + 1} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery (bottom) */}
              {hasGallery && (
                <div className="space-y-3 pt-4 border-t border-border/30 font-sans">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-500 font-mono">Gallery</h4>
                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {galleryImages.map((img: string, index: number) => (
                      <div key={index} className="relative aspect-video overflow-hidden rounded-lg border border-border/40 bg-muted">
                        <img
                          src={resolveAssetUrl(img)}
                          alt={`${item.title || item.name || "Asset"} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResearchPage() {
  const PROJECTS_DATABASE = useDatasetRecords("research-projects", DATA_SEEDS["research-projects"]) as ProjectRecord[];
  const EQUIPMENT_DATABASE = useDatasetRecords("research-equipment", DATA_SEEDS["research-equipment"]);
  const FIELD_ACTIVITIES_DATABASE = useDatasetRecords("research-activities", DATA_SEEDS["research-activities"]) as any[];

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<"project" | "equipment" | "activity" | null>(null);

  // Accordion Expand States
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({
    external: true,
    internal: false,
    student: false,
    phd: false,
  });

  const toggleProjectSection = (sec: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [sec]: !prev[sec],
    }));
  };

  const scrollToAndExpandSection = (sec: "external" | "internal" | "student" | "phd") => {
    setExpandedProjects((prev) => ({
      ...prev,
      [sec]: true,
    }));
    setTimeout(() => {
      const el = document.getElementById(`${sec}-projects-header`);
      if (el) {
        const offset = 110;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  // Student Projects Search & Sort States
  const [studentSearch, setStudentSearch] = useState("");
  const [studentSortField, setStudentSortField] = useState<"title" | "amount" | "duration" | "agency" | "role" | null>(null);
  const [studentSortOrder, setStudentSortOrder] = useState<"asc" | "desc">("asc");

  // Sorted and searched student projects
  const processedStudentProjects = useMemo(() => {
    let list = PROJECTS_DATABASE.filter((p) => p.type === "student");

    // Search filter (updates in real-time by title)
    if (studentSearch.trim()) {
      const q = studentSearch.toLowerCase().trim();
      list = list.filter((p) => String(p.title ?? "").toLowerCase().includes(q));
    }

    // Sort processing
    if (studentSortField) {
      list.sort((a, b) => {
        let valA: any = "";
        let valB: any = "";

        if (studentSortField === "title") {
          valA = String(a.title ?? "").toLowerCase();
          valB = String(b.title ?? "").toLowerCase();
        } else if (studentSortField === "amount") {
          const parseAmount = (str?: string) => {
            if (!str) return 0;
            const match = str.match(/[\d\.]+/);
            return match ? parseFloat(match[0]) : 0;
          };
          valA = parseAmount(a.amount);
          valB = parseAmount(b.amount);
        } else if (studentSortField === "duration") {
          valA = String(a.duration ?? "");
          valB = String(b.duration ?? "");
        } else if (studentSortField === "agency") {
          valA = String(a.fundingAgency ?? "").toLowerCase();
          valB = String(b.fundingAgency ?? "").toLowerCase();
        } else if (studentSortField === "role") {
          valA = String(a.role ?? "").toLowerCase();
          valB = String(b.role ?? "").toLowerCase();
        }

        if (valA < valB) return studentSortOrder === "asc" ? -1 : 1;
        if (valA > valB) return studentSortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [studentSearch, studentSortField, studentSortOrder]);

  const handleStudentSort = (field: "title" | "amount" | "duration" | "agency" | "role") => {
    if (studentSortField === field) {
      setStudentSortOrder(studentSortOrder === "asc" ? "desc" : "asc");
    } else {
      setStudentSortField(field);
      setStudentSortOrder("asc");
    }
  };

  // Search & Filters States
  const [projectSearch, setProjectSearch] = useState("");
  const [projectAgency, setProjectAgency] = useState("All");
  const [projectStatus, setProjectStatus] = useState("All");

  const [facilitiesSearch, setFacilitiesSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("underwater-platforms");

  const [activitiesSearch, setActivitiesSearch] = useState("");
  const [activitiesYear, setActivitiesYear] = useState("All");

  const openDetail = (item: any, type: "project" | "equipment" | "activity") => {
    setSelectedItem(item);
    setSelectedType(type);
  };

  const closeDetail = () => {
    setSelectedItem(null);
    setSelectedType(null);
  };

  // Unique lists for dropdown filters
  const agencies = useMemo(() => {
    const list = new Set<string>();
    PROJECTS_DATABASE.forEach((p) => {
      if (p.fundingAgency) {
        if (p.fundingAgency.includes("MoES")) list.add("MoES");
        else if (p.fundingAgency.includes("DST")) list.add("DST");
        else if (p.fundingAgency.includes("TNSCST")) list.add("TNSCST");
        else if (p.fundingAgency.includes("NIOT")) list.add("NIOT");
        else if (p.fundingAgency.includes("SSNCE")) list.add("SSNCE");
        else list.add("Internal");
      }
    });
    return ["All", ...Array.from(list)];
  }, []);

  const statuses = ["All", "Ongoing", "Completed", "Coursework Completed", "Thesis Submitted"];

  const years = useMemo(() => {
    const list = new Set<string>();
    FIELD_ACTIVITIES_DATABASE.forEach((fa) => {
      list.add(fa.year.toString());
    });
    return ["All", ...Array.from(list).sort().reverse()];
  }, []);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return PROJECTS_DATABASE.filter((p) => {
      // search
      const q = String(projectSearch ?? "").toLowerCase().trim();
      const matchField = (val: any) => String(val ?? "").toLowerCase().includes(q);
      const matchesSearch =
        matchField(p.title) ||
        matchField(p.scholar) ||
        matchField(p.researchArea) ||
        matchField(p.fundingAgency) ||
        matchField(p.description) ||
        matchField(p.purpose) ||
        matchField(p.keywords) ||
        matchField(p.location);

      // agency
      let matchesAgency = true;
      if (projectAgency !== "All") {
        if (projectAgency === "Internal") {
          matchesAgency = String(p.fundingAgency ?? "").includes("Internal") || p.fundingAgency === "SSNCE Internal Funding";
        } else {
          matchesAgency = String(p.fundingAgency ?? "").includes(projectAgency) || false;
        }
      }

      // status
      const matchesStatus = projectStatus === "All" || p.status === projectStatus;

      return matchesSearch && matchesAgency && matchesStatus;
    });
  }, [projectSearch, projectAgency, projectStatus]);

  // Filtered equipment list
  const filteredEquipment = useMemo(() => {
    return EQUIPMENT_DATABASE.filter((eq) => {
      const matchesCategory = eq.category === activeCategory;
      const q = String(facilitiesSearch ?? "").toLowerCase();
      const matchesSearch =
        String(eq.name ?? "").toLowerCase().includes(q) ||
        String(eq.shortDescription ?? "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, facilitiesSearch]);

  // Filtered field activities
  const filteredActivities = useMemo(() => {
    return FIELD_ACTIVITIES_DATABASE.filter((fa) => {
      const q = String(activitiesSearch ?? "").toLowerCase();
      const tagsArray = Array.isArray(fa.equipmentTags)
        ? fa.equipmentTags
        : typeof fa.equipmentTags === "string"
        ? fa.equipmentTags.split(",").map((t: string) => t.trim()).filter(Boolean)
        : [];

      const matchesSearch =
        String(fa.title ?? "").toLowerCase().includes(q) ||
        String(fa.location ?? "").toLowerCase().includes(q) ||
        tagsArray.some((t: string) => String(t ?? "").toLowerCase().includes(q));

      const matchesYear = activitiesYear === "All" || fa.year.toString() === activitiesYear;

      return matchesSearch && matchesYear;
    });
  }, [activitiesSearch, activitiesYear]);

  // Group field activities by year
  const groupedActivities = useMemo(() => {
    const groups: Record<string, FieldActivityRecord[]> = {};
    filteredActivities.forEach((fa) => {
      const yr = fa.year.toString();
      if (!groups[yr]) groups[yr] = [];
      groups[yr].push(fa);
    });
    // Sort years descending but keep "Undated" at the bottom
    const sortedYears = Object.keys(groups).sort((a, b) => {
      if (a === "Undated") return 1;
      if (b === "Undated") return -1;
      return b.localeCompare(a);
    });
    return { sortedYears, groups };
  }, [filteredActivities]);

  const navItems = [
    { label: "Funded Projects", id: "projects", icon: FlaskConical, count: PROJECTS_DATABASE.filter(p => p.type === "external" || p.type === "internal").length, theme: "teal" as const },
    { label: "PhD Research", id: "phd-projects-header", icon: BookOpen, count: PROJECTS_DATABASE.filter(p => p.type === "phd").length, theme: "indigo" as const },
    { label: "Facilities", id: "facilities", icon: Cpu, count: EQUIPMENT_DATABASE.length, theme: "cyan" as const },
    { label: "Field Activities", id: "field-activities", icon: Anchor, count: FIELD_ACTIVITIES_DATABASE.length, theme: "emerald" as const },
    { label: "Student Projects", id: "student-projects-header", icon: Users, count: PROJECTS_DATABASE.filter(p => p.type === "student").length, theme: "sky" as const }
  ];

  const handleNavScroll = (id: string) => {
    if (id === "projects") {
      setExpandedProjects(prev => ({ ...prev, external: true }));
    } else if (id === "phd-projects-header") {
      setExpandedProjects(prev => ({ ...prev, phd: true }));
    } else if (id === "student-projects-header") {
      setExpandedProjects(prev => ({ ...prev, student: true }));
    }
    
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 110;
        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth"
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300 page-research">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-950/20 via-background to-background py-16 px-6 border-b border-border/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.1),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-5xl text-center space-y-4 relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-5xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 border border-cyan-500/25">
            Ocean Engineering & Applied Acoustics
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl font-sans">
            Research & Facilities
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-text-secondary leading-relaxed font-sans">
            Explore authentic research projects, advanced oceanographic testing facilities, subsea robotic platforms, and coastal deployments mapping the depths of shallow water basins.
          </p>
        </div>
      </section>

      {/* Sticky Section Navigation */}
      <StickySectionNav items={navItems} onItemClick={handleNavScroll} />

      <div className="mx-auto max-w-5xl px-6 mt-12 space-y-16">


        {/* 3. Research Projects */}
        <section id="projects" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500">Investigational Registry</span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Research Projects</h2>
            </div>

            {/* Simple Filters */}
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none focus:border-cyan-500/50 w-44 transition"
                />
              </div>
              <select
                value={projectAgency}
                onChange={(e) => setProjectAgency(e.target.value)}
                className="text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="All">All Agencies</option>
                {agencies.filter(a => a !== "All").map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <select
                value={projectStatus}
                onChange={(e) => setProjectStatus(e.target.value)}
                className="text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                {statuses.filter(s => s !== "All").map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {/* Subsection: External Funded */}
            <div id="external-projects-header" className="rounded-xl border border-border bg-card/40 overflow-hidden">
              <button
                onClick={() => toggleProjectSection("external")}
                className="w-full flex items-center justify-between p-4 bg-secondary/15 hover:bg-secondary/30 transition text-left cursor-pointer select-none border-b border-border/40"
              >
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">External Funded Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-5xs font-mono font-bold bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/25">
                    {filteredProjects.filter(p => p.type === "external").length} Listed
                  </span>
                  {expandedProjects.external ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
                </div>
              </button>
              {expandedProjects.external && (
                <div className="p-4 grid gap-4 md:grid-cols-2">
                  {filteredProjects.filter(p => p.type === "external").map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => openDetail(proj, "project")}
                      className="p-5 rounded-2xl border border-border bg-card hover:border-cyan-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-5xs font-mono font-bold uppercase text-text-secondary bg-secondary px-2 py-0.5 rounded border border-border/25">
                            {proj.fundingAgency?.split("(")[0].trim() || proj.fundingAgency}
                          </span>
                          <span className={`text-5xs font-bold uppercase tracking-wide border px-2 py-0.5 rounded-sm ${
                            proj.status === "Ongoing" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          }`}>
                            {proj.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-foreground text-xs leading-snug group-hover:text-cyan-500 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      <div className="mt-4 border-t border-border/20 pt-3 flex items-center justify-between text-5xs font-mono text-text-muted">
                        <span>Grant: <strong className="text-foreground">{proj.amount}</strong></span>
                        {proj.duration && <span>Period: <strong className="text-foreground">{proj.duration}</strong></span>}
                      </div>
                    </div>
                  ))}
                  {filteredProjects.filter(p => p.type === "external").length === 0 && (
                    <div className="col-span-2 text-center text-text-muted text-xs py-6">
                      {PROJECTS_DATABASE.filter(p => p.type === "external").length === 0 ? "No records available." : "No external projects match the active filters."}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subsection: Internal Funded */}
            <div id="internal-projects-header" className="rounded-xl border border-border bg-card/40 overflow-hidden">
              <button
                onClick={() => toggleProjectSection("internal")}
                className="w-full flex items-center justify-between p-4 bg-secondary/15 hover:bg-secondary/30 transition text-left cursor-pointer select-none border-b border-border/40"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-cyan-500" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Internal Funded Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-5xs font-mono font-bold bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded border border-cyan-500/25">
                    {filteredProjects.filter(p => p.type === "internal").length} Listed
                  </span>
                  {expandedProjects.internal ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
                </div>
              </button>
              {expandedProjects.internal && (
                <div className="p-4 grid gap-4 md:grid-cols-2">
                  {filteredProjects.filter(p => p.type === "internal").map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => openDetail(proj, "project")}
                      className="p-5 rounded-2xl border border-border bg-card hover:border-cyan-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-5xs font-mono font-bold uppercase text-text-secondary bg-secondary px-2 py-0.5 rounded border border-border/25">
                            SSN Funding
                          </span>
                          <span className="text-5xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-sm">
                            {proj.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-foreground text-xs leading-snug group-hover:text-cyan-500 transition-colors">
                          {proj.title}
                        </h4>
                      </div>
                      <div className="mt-4 border-t border-border/20 pt-3 flex items-center justify-between text-5xs font-mono text-text-muted">
                        <span>Grant: <strong className="text-foreground">{proj.amount}</strong></span>
                        {proj.duration && <span>Period: <strong className="text-foreground">{proj.duration}</strong></span>}
                      </div>
                    </div>
                  ))}
                  {filteredProjects.filter(p => p.type === "internal").length === 0 && (
                    <div className="col-span-2 text-center text-text-muted text-xs py-6">
                      {PROJECTS_DATABASE.filter(p => p.type === "internal").length === 0 ? "No records available." : "No internal projects match the active filters."}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Subsection: Student Projects */}
            <div id="student-projects-header" className="rounded-xl border border-border bg-card/40 overflow-hidden">
              <button
                onClick={() => toggleProjectSection("student")}
                className="w-full flex items-center justify-between p-4 bg-secondary/15 hover:bg-secondary/30 transition text-left cursor-pointer select-none border-b border-border/40"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Student Projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-5xs font-mono font-bold bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded border border-indigo-500/25">
                    {filteredProjects.filter(p => p.type === "student").length} Listed
                  </span>
                  {expandedProjects.student ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
                </div>
              </button>
              {expandedProjects.student && (
                <div className="p-4 space-y-4">
                  {/* Search box above table */}
                  <div className="flex gap-2 max-w-sm">
                    <div className="relative flex-1">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                      <input
                        type="text"
                        placeholder="Search student projects by title..."
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none transition focus:border-indigo-500/50"
                      />
                    </div>
                  </div>

                  {/* Responsive Table */}
                  <div className="orl-table-container max-h-[500px]">
                    <table className="orl-table">
                      <thead>
                        <tr>
                          <th className="w-14 text-center">Sl.No</th>
                          <th
                            className="cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => handleStudentSort("title")}
                          >
                            <div className="flex items-center gap-1.5">
                              Project Title
                              {studentSortField === "title" && (
                                <span className="text-indigo-500">{studentSortOrder === "asc" ? "▲" : "▼"}</span>
                              )}
                            </div>
                          </th>
                          <th
                            className="w-40 cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => handleStudentSort("agency")}
                          >
                            <div className="flex items-center gap-1.5">
                              Funding Agency
                              {studentSortField === "agency" && (
                                <span className="text-indigo-500">{studentSortOrder === "asc" ? "▲" : "▼"}</span>
                              )}
                            </div>
                          </th>
                          <th
                            className="w-32 cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => handleStudentSort("amount")}
                          >
                            <div className="flex items-center gap-1.5">
                              Amount (Lakhs)
                              {studentSortField === "amount" && (
                                <span className="text-indigo-500">{studentSortOrder === "asc" ? "▲" : "▼"}</span>
                              )}
                            </div>
                          </th>
                          <th
                            className="w-32 cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => handleStudentSort("role")}
                          >
                            <div className="flex items-center gap-1.5">
                              Supervisor Role
                              {studentSortField === "role" && (
                                <span className="text-indigo-500">{studentSortOrder === "asc" ? "▲" : "▼"}</span>
                              )}
                            </div>
                          </th>
                          <th
                            className="w-32 cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => handleStudentSort("duration")}
                          >
                            <div className="flex items-center gap-1.5">
                              Duration
                              {studentSortField === "duration" && (
                                <span className="text-indigo-500">{studentSortOrder === "asc" ? "▲" : "▼"}</span>
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {processedStudentProjects.map((proj, idx) => (
                          <tr
                            key={proj.id}
                            onClick={() => openDetail(proj, "project")}
                            className="cursor-pointer"
                          >
                            <td className="text-center font-mono">{idx + 1}</td>
                            <td className="font-semibold text-foreground leading-snug">{proj.title}</td>
                            <td className="text-text-secondary">{proj.fundingAgency}</td>
                            <td className="font-mono text-text-primary">{proj.amount}</td>
                            <td className="text-text-secondary">{proj.role}</td>
                            <td className="font-mono text-text-secondary">{proj.duration}</td>
                          </tr>
                        ))}
                        {processedStudentProjects.length === 0 && (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-text-muted">
                              {PROJECTS_DATABASE.filter(p => p.type === "student").length === 0 ? "No records available." : "No student projects match your search query."}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Subsection: PhD Research */}
            <div id="phd-projects-header" className="rounded-xl border border-border bg-card/40 overflow-hidden">
              <button
                onClick={() => toggleProjectSection("phd")}
                className="w-full flex items-center justify-between p-4 bg-secondary/15 hover:bg-secondary/30 transition text-left cursor-pointer select-none border-b border-border/40"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">PhD Research Registry</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-5xs font-mono font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/25">
                    {filteredProjects.filter(p => p.type === "phd").length} Listed
                  </span>
                  {expandedProjects.phd ? <ChevronUp className="h-4 w-4 text-text-muted" /> : <ChevronDown className="h-4 w-4 text-text-muted" />}
                </div>
              </button>
              {expandedProjects.phd && (
                <div className="p-4 md:p-6 space-y-6">
                  {/* Vertical Timeline */}
                  <div className="relative pl-6 md:pl-8 border-l border-border/80 space-y-6 ml-2 md:ml-4 py-2">
                    {filteredProjects.filter((p) => p.type === "phd").map((proj) => (
                      <div key={proj.id} className="relative group">
                        {/* Timeline Bullet */}
                        <span className={`absolute -left-[31px] md:-left-[39px] top-1.5 h-4.5 w-4.5 rounded-full border bg-card flex items-center justify-center transition duration-300 ${
                          proj.status === "Coursework Completed" ? "border-amber-500 ring-4 ring-amber-500/10" :
                          proj.status === "Thesis Submitted" ? "border-cyan-500 ring-4 ring-cyan-500/10" :
                          "border-emerald-500 ring-4 ring-emerald-500/10"
                        }`}>
                          <span className={`h-2 w-2 rounded-full ${
                            proj.status === "Coursework Completed" ? "bg-amber-500" :
                            proj.status === "Thesis Submitted" ? "bg-cyan-500" :
                            "bg-emerald-500"
                          }`} />
                        </span>

                        <div
                          onClick={() => openDetail(proj, "project")}
                          className="rounded-2xl border border-border bg-card p-5 hover:border-emerald-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                        >
                          <div className="space-y-1">
                            <span className="text-5xs font-mono font-bold text-emerald-500 uppercase tracking-wider">
                              {proj.scholar}
                            </span>
                            <h4 className="font-bold text-foreground text-xs leading-relaxed group-hover:text-emerald-500 transition-colors">
                              {proj.title || proj.researchArea}
                            </h4>
                            {proj.researchArea && proj.title !== proj.researchArea && (
                              <p className="text-4xs text-text-secondary leading-snug">{proj.researchArea}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {proj.publicationCount && (
                              <span className="text-5xs font-mono font-bold bg-secondary text-text-secondary border border-border/40 px-2 py-0.5 rounded">
                                {proj.publicationCount} Publications
                              </span>
                            )}
                            <span className={`rounded-sm px-2 py-0.5 text-5xs font-semibold uppercase tracking-wide border ${
                              proj.status === "Coursework Completed" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                              proj.status === "Thesis Submitted" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" :
                              "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            }`}>
                              {proj.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredProjects.filter(p => p.type === "phd").length === 0 && (
                      <div className="text-center text-text-muted text-xs py-4">
                        {PROJECTS_DATABASE.filter(p => p.type === "phd").length === 0 ? "No records available." : "No scholars match the active filters."}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. Facilities */}
        <section id="facilities" className="space-y-6">
          <div>
            <span className="text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500">Infrastructure Divisions</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Laboratory Facilities</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {FACILITIES_CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isActive = activeCategory === cat.id;
              const catThumb = cat.thumbnail || cat.images?.[0];
              return (
                <div
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    document.getElementById("equipment")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] group select-none ${
                    isActive
                      ? "border-cyan-500 bg-cyan-500/5 ring-1 ring-cyan-500/20"
                      : "border-border bg-card/60 hover:border-cyan-500/35"
                  }`}
                >
                  <div className="space-y-2">
                    {catThumb && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border/40 mb-3 bg-secondary/50">
                        <img
                          src={resolveAssetUrl(catThumb)}
                          alt={cat.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg border transition ${
                        isActive ? "bg-cyan-500/10 border-cyan-500/25" : "bg-secondary/40 border-border/40 group-hover:border-cyan-500/20"
                      }`}>
                        <IconComp className={`h-4.5 w-4.5 ${isActive ? "text-cyan-500" : "text-text-secondary"}`} />
                      </div>
                      <span className={`text-5xs font-mono font-bold px-2 py-0.5 rounded border transition ${
                        isActive ? "bg-cyan-500/15 text-cyan-500 border-cyan-500/20" : "bg-secondary text-text-secondary border-border/40"
                      }`}>
                        {cat.count} Systems
                      </span>
                    </div>
                    <h3 className="font-bold text-foreground text-xs leading-snug">{cat.name}</h3>
                    <p className="text-4xs text-text-secondary leading-relaxed font-sans">{cat.description}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-1 text-5xs font-bold uppercase tracking-wider text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore Assets <ChevronRight className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 5. Equipment & Instrumentation */}
        <section id="equipment" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500">Asset Catalog</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">
                Equipment & Instrumentation
              </h2>
              <p className="text-4xs text-text-secondary mt-1 font-sans">
                Active Group: <span className="font-bold text-cyan-500">{FACILITIES_CATEGORIES.find(c => c.id === activeCategory)?.name}</span>
              </p>
            </div>

            {/* Local Equipment search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search active group..."
                value={facilitiesSearch}
                onChange={(e) => setFacilitiesSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 transition focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {filteredEquipment.map((eq) => {
              const eqThumb = eq.thumbnail || eq.image;
              return (
                <div
                  key={eq.id}
                  onClick={() => openDetail(eq, "equipment")}
                  className="p-5 rounded-2xl border border-border bg-card hover:border-cyan-500/35 shadow-xs hover:shadow-md hover:translate-y-[-4px] hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between cursor-pointer group"
                >
                  <div className="space-y-3">
                    {eqThumb && (
                      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-secondary/50 border border-border/40">
                        <img
                          src={resolveAssetUrl(eqThumb)}
                          alt={eq.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="inline-flex items-center text-5xs font-bold uppercase tracking-wider text-cyan-500 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20">
                        {FACILITIES_CATEGORIES.find(c => c.id === eq.category)?.name || eq.category}
                      </span>
                      <h4 className="font-bold text-foreground text-xs leading-snug group-hover:text-cyan-500 transition-colors">
                        {eq.name}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredEquipment.length === 0 && (
              <div className="col-span-3 text-center text-text-muted text-xs py-8">
                {EQUIPMENT_DATABASE.filter(eq => eq.category === activeCategory).length === 0 ? "No records available." : "No instrumentation systems found in this division matching your search."}
              </div>
            )}
          </div>
        </section>

        {/* 6. Data Collection & Field Activities */}
        <section id="field-activities" className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500">Ocean Validation</span>
              <h2 className="text-2xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Data Collection & Field Activities</h2>
            </div>

            {/* Dropdown Filters */}
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search location/gear..."
                  value={activitiesSearch}
                  onChange={(e) => setActivitiesSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 transition focus:border-cyan-500/50"
                />
              </div>
              <select
                value={activitiesYear}
                onChange={(e) => setActivitiesYear(e.target.value)}
                className="text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                <option value="All">All Years</option>
                {years.filter(y => y !== "All").map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Timeline Vertical Layout */}
          <div className="space-y-8 relative pl-6 border-l border-border/80 ml-2 py-4">
            {groupedActivities.sortedYears.map((yr) => (
              <div key={yr} className="space-y-4 relative">
                {/* Year Marker */}
                <div className="absolute -left-[38px] top-0.5 font-mono font-black text-xs bg-background text-cyan-500 border border-cyan-500/30 px-2 py-0.5 rounded shadow-sm z-10 select-none">
                  {yr}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 pl-2">
                  {groupedActivities.groups[yr].map((activity) => {
                    const actThumb = activity.thumbnail || activity.images?.[0];
                    return (
                      <div
                        key={activity.id}
                        onClick={() => openDetail(activity, "activity")}
                        className="p-5 rounded-lg border border-border bg-card hover:border-cyan-500/30 transition duration-300 flex flex-col justify-between cursor-pointer group"
                      >
                        <div className="space-y-3">
                          {actThumb && (
                            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-secondary/50 border border-border/40 mb-1">
                              <img
                                src={resolveAssetUrl(actThumb)}
                                alt={activity.title}
                                className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                              />
                            </div>
                          )}
                          <div className="flex items-center justify-between gap-2">
                            <span className="inline-flex items-center text-5xs font-bold uppercase tracking-wider text-cyan-500 bg-cyan-500/5 px-2 py-0.5 rounded border border-cyan-500/20">
                              {activity.activityType}
                            </span>
                            <span className="text-5xs font-mono text-text-muted">{activity.date}</span>
                          </div>
                          <h4 className="font-bold text-foreground text-xs leading-snug group-hover:text-cyan-500 transition-colors">
                            {activity.title}
                          </h4>
                          <div className="flex items-center gap-1 text-5xs text-text-secondary font-sans">
                            <MapPin className="h-3 w-3 text-text-muted shrink-0" />
                            <span className="truncate">{activity.location}</span>
                          </div>
                        </div>
                        {(() => {
                          const tagsArray = Array.isArray(activity.equipmentTags)
                            ? activity.equipmentTags
                            : typeof activity.equipmentTags === "string"
                            ? (activity.equipmentTags as string).split(",").map((t: string) => t.trim()).filter(Boolean)
                            : [];
                          if (tagsArray.length === 0) return null;
                          return (
                            <div className="mt-4 border-t border-border/20 pt-3 flex flex-wrap gap-1.5">
                              {tagsArray.map((tag: string, tIdx: number) => (
                                <span key={tIdx} className="text-5xs font-mono bg-secondary px-2.5 py-0.5 rounded border border-border/20 text-text-secondary">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            {groupedActivities.sortedYears.length === 0 && (
              <div className="text-center text-text-muted text-xs py-8">
                {FIELD_ACTIVITIES_DATABASE.length === 0 ? "No records available." : "No oceanographic campaigns or surveys found matching your query."}
              </div>
            )}
          </div>
        </section>

        {/* 7. Research Outputs Connection */}
        <section id="outputs" className="pt-6 border-t border-border">
          <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-2xl border border-blue-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider bg-blue-500/15 text-blue-500 border border-blue-500/30">
                Academic Output
              </span>
              <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">
                Research Publications
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">
                Our team publishes high-impact work detailing underwater acoustics telemetry, bio-acoustics mapping, and subsea digital signal processing algorithms across peer-reviewed international channels.
              </p>
              <div className="flex flex-wrap gap-x-12 gap-y-4 pt-2">
                <div>
                  <div className="text-base font-bold text-blue-500">62</div>
                  <div className="text-5xs text-text-muted font-bold uppercase">Journals</div>
                </div>
                <div>
                  <div className="text-base font-bold text-blue-500">97</div>
                  <div className="text-5xs text-text-muted font-bold uppercase">Conferences</div>
                </div>
                <div>
                  <div className="text-base font-bold text-blue-500">10</div>
                  <div className="text-5xs text-text-muted font-bold uppercase font-sans">Books / Chapters</div>
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <Link
                to="/publications"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-5 py-3.5 transition duration-300 shadow-md cursor-pointer select-none"
              >
                Publications Catalog <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Tabbed Detail Modal Overlay */}
      {selectedItem && selectedType && (
        <DetailModal
          item={selectedItem}
          type={selectedType}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
