import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  LayoutDashboard,
  FolderGit2,
  Wrench,
  Map,
  Users,
  GraduationCap,
  Briefcase,
  Network,
  FileSpreadsheet,
  Image as ImageIcon,
  BookOpen,
  Award,
  Settings as SettingsIcon,
  Search,
  Plus,
  Trash2,
  Pencil,
  X,
  Menu,
  Save,
  Upload,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  FileText,
  Clock,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  RefreshCw,
  Download
} from "lucide-react";
import { toast } from "sonner";
import {
  getSettings,
  saveSettings,
  getDatasetRecords,
  saveDatasetRecords,
  exportSiteBackup,
  importSiteBackup,
  resetSiteToDefaults,
  useSiteSettings,
  useDatasetRecords,
  DATA_SEEDS,
  type SiteSettings,
  type GenericEntity,
  type KeyContactSetting,
  type PeopleStatSetting
} from "@/lib/admin-store";
import { resolveAssetUrl, registerAsset, getAssets, type UploadedAsset, type Attachment } from "@/lib/storage-service";
import {
  useRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getCarouselConfig,
  saveCarouselConfig,
  type RepoRecord,
  type CarouselImage
} from "@/lib/repository-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Website Content Manager" },
      { name: "robots", content: "noindex" }
    ]
  }),
  component: Admin
});

// ----------------- PURPOSE-BUILT DIRECT FILE UPLOAD INPUT -----------------
function AssetUploadInput({
  label,
  value,
  type,
  onChange,
  category = "",
  placeholder = ""
}: {
  label: string;
  value: string;
  type: "image" | "document";
  onChange: (assetId: string) => void;
  category?: string;
  placeholder?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [altText, setAltText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resolvedUrl = resolveAssetUrl(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const assetId = await registerAsset(file, type, category, altText);
      onChange(assetId);
      toast.success(`${type === "image" ? "Image" : "PDF Document"} uploaded successfully!`);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 bg-secondary/30 rounded-xl border border-border/60 space-y-2 font-sans text-xs">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">{label}</span>
      
      <div className="flex items-center gap-3">
        {type === "image" && resolvedUrl ? (
          <div className="relative h-14 w-14 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
            <img src={resolvedUrl} className="h-full w-full object-cover" alt="Profile/Asset Preview" />
          </div>
        ) : type === "document" && value ? (
          <div className="flex items-center gap-1.5 bg-secondary px-2.5 py-1.5 rounded-lg border border-border text-4xs font-mono font-bold text-teal-500">
            <FileText className="h-3.5 w-3.5" /> PDF Reference
          </div>
        ) : (
          <div className="h-10 w-10 rounded-lg border border-dashed border-border flex items-center justify-center text-text-muted shrink-0 text-3xs">
            None
          </div>
        )}

        <div className="flex-1 space-y-1">
          <div className="flex gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-4xs font-bold uppercase tracking-wider transition cursor-pointer select-none">
              <Upload className="h-3.5 w-3.5 text-teal-500" />
              {loading ? "Uploading..." : "Select File"}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={type === "image" ? "image/*" : "application/pdf"}
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="px-2.5 py-1.5 text-4xs font-bold text-text-muted hover:text-destructive border border-border rounded-lg bg-card uppercase tracking-wider"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {type === "image" && !value && (
        <input
          type="text"
          placeholder="Image Alt Text (Accessibility description)"
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-4xs outline-none focus:border-teal-500"
        />
      )}

      {value && <div className="text-[9px] text-text-muted font-mono truncate">{value}</div>}
    </div>
  );
}

// ----------------- PURPOSE-BUILT MULTI-FILE UPLOAD INPUT -----------------
function MultiAssetUploadInput({
  label,
  values = [],
  type,
  onChange,
  category = ""
}: {
  label: string;
  values: string[];
  type: "image" | "document";
  onChange: (assetIds: string[]) => void;
  category?: string;
}) {
  const handleAddAsset = (newAssetId: string) => {
    if (newAssetId && !values.includes(newAssetId)) {
      onChange([...values, newAssetId]);
    }
  };

  const handleRemoveAsset = (idxToRemove: number) => {
    onChange(values.filter((_, i) => i !== idxToRemove));
  };

  const handleMoveAsset = (idx: number, dir: "up" | "down") => {
    const list = [...values];
    if (dir === "up" && idx > 0) {
      const temp = list[idx];
      list[idx] = list[idx - 1];
      list[idx - 1] = temp;
    } else if (dir === "down" && idx < list.length - 1) {
      const temp = list[idx];
      list[idx] = list[idx + 1];
      list[idx + 1] = temp;
    }
    onChange(list);
  };

  return (
    <div className="p-3 bg-secondary/30 rounded-xl border border-border/60 space-y-3 font-sans text-xs">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">{label}</span>
      
      {values.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2">
          {values.map((val, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 p-2 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 min-w-0">
                {type === "image" ? (
                  <div className="relative h-10 w-10 rounded-lg overflow-hidden border border-border shrink-0 bg-muted">
                    <img src={resolveAssetUrl(val)} className="h-full w-full object-cover" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 bg-secondary px-2 py-1 rounded border border-border text-[9px] font-mono font-bold text-teal-500 shrink-0">
                    <FileText className="h-3 w-3" /> PDF
                  </div>
                )}
                <div className="text-[9px] text-text-muted font-mono truncate">{val}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMoveAsset(idx, "up")}
                  className="p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50 text-foreground"
                >
                  <ChevronUp className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  disabled={idx === values.length - 1}
                  onClick={() => handleMoveAsset(idx, "down")}
                  className="p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50 text-foreground"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveAsset(idx)}
                  className="p-1 rounded text-text-muted hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AssetUploadInput
        label={`Upload New ${type === "image" ? "Image" : "Document"} Slide`}
        value=""
        type={type}
        onChange={handleAddAsset}
        category={category}
      />
    </div>
  );
}

// ----------------- REUSABLE DISPLAY ORDER CONTROL PANEL -----------------
function OrderControls({
  index,
  total,
  onMoveUp,
  onMoveDown
}: {
  index: number;
  total: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="flex gap-1">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={index === 0}
        className="p-1 rounded bg-secondary/60 text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none border border-border/50"
        aria-label="Move Up"
      >
        <ChevronUp className="h-3.5 w-3.5" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={index === total - 1}
        className="p-1 rounded bg-secondary/60 text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none border border-border/50"
        aria-label="Move Down"
      >
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ----------------- AUTO-RESIZING TEXTAREA WITH COUNTER -----------------
function ResizingTextarea({
  value,
  onChange,
  placeholder = "",
  maxLength = 1000
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div className="space-y-1">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-teal-500 transition-all leading-relaxed"
      />
      <div className="flex justify-between items-center text-[10px] text-text-muted font-mono">
        <span>Avoid markup - write in plain text.</span>
        <span>{value.length} / {maxLength} characters</span>
      </div>
    </div>
  );
}

// ----------------- REUSABLE ATTACHMENTS LIST MANAGER -----------------
function AttachmentsManager({
  label,
  attachments = [],
  onChange,
  category = ""
}: {
  label: string;
  attachments: Attachment[];
  onChange: (attachments: Attachment[]) => void;
  category?: string;
}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const assetId = await registerAsset(file, "document", category, "");
      const newAttachment: Attachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        kind: "PDF",
        url: assetId
      };
      onChange([...attachments, newAttachment]);
      toast.success("Attachment uploaded successfully!");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload attachment");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (idxToRemove: number) => {
    onChange(attachments.filter((_, i) => i !== idxToRemove));
  };

  const handleRename = (idx: number, newName: string) => {
    const updated = attachments.map((att, i) => i === idx ? { ...att, name: newName } : att);
    onChange(updated);
  };

  return (
    <div className="p-3 bg-secondary/30 rounded-xl border border-border/60 space-y-3 font-sans text-xs">
      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">{label}</span>
      
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((att, idx) => (
            <div key={att.id} className="flex items-center gap-3 p-2 bg-card rounded-lg border border-border">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <FileText className="h-4 w-4 text-teal-500 shrink-0" />
                <div className="min-w-0 flex-1 space-y-1">
                  <input
                    type="text"
                    value={att.name}
                    onChange={(e) => handleRename(idx, e.target.value)}
                    className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-teal-500 px-1 py-0.5 outline-none font-bold text-xs"
                  />
                  <div className="text-[9px] text-text-muted font-mono truncate">{att.url} ({att.size})</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="p-1 rounded text-text-muted hover:text-destructive shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-4xs font-bold uppercase tracking-wider transition cursor-pointer select-none">
          <Upload className="h-3.5 w-3.5 text-teal-500" />
          {loading ? "Uploading..." : "Attach Document (PDF)"}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
          />
        </label>
      </div>
    </div>
  );
}

// ----------------- ADMIN DASHBOARD CONTENT MANAGER -----------------
function Admin() {
  const settings = useSiteSettings();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Load all repository academic records reactive hooks
  const repoRecords = useRecords();

  // Load datasets lists from reactive hooks
  const focusCards = useDatasetRecords("home-research-focus", DATA_SEEDS["home-research-focus"]);
  const metrics = useDatasetRecords("home-highlights", DATA_SEEDS["home-highlights"]);
  const quickAccess = useDatasetRecords("home-quick-access", DATA_SEEDS["home-quick-access"]);
  const equipment = useDatasetRecords("research-equipment", DATA_SEEDS["research-equipment"]);
  const projects = useDatasetRecords("research-projects", DATA_SEEDS["research-projects"]);
  const fieldActivities = useDatasetRecords("research-activities", DATA_SEEDS["research-activities"]);
  const members = useDatasetRecords("people-members", DATA_SEEDS["people-members"]);
  const internships = useDatasetRecords("people-internships", DATA_SEEDS["people-internships"]);
  const mous = useDatasetRecords("collaborations-mous", DATA_SEEDS["collaborations-mous"]);
  const partners = useDatasetRecords("collaborations-institutions", DATA_SEEDS["collaborations-institutions"]);
  const consultancy = useDatasetRecords("collaborations-activities", DATA_SEEDS["collaborations-activities"]);
  const gallery = useDatasetRecords("gallery-records", DATA_SEEDS["gallery-records"]);

  // Local config state for awards carousels
  const [carouselConfig, setCarouselConfigState] = useState(getCarouselConfig());

  // Edit modals state
  const [editingItem, setEditingItem] = useState<{ key: string; isNew: boolean; index?: number; data: any } | null>(null);

  // Sidebar list mapping
  const SIDEBAR_ITEMS = [
    { id: "home", label: "Home", icon: LayoutDashboard },
    { id: "research", label: "Research", icon: FolderGit2 },
    { id: "people", label: "People", icon: Users },
    { id: "collaborations", label: "Collaborations & Consultancy", icon: Network },
    { id: "gallery", label: "Photo Gallery", icon: ImageIcon },
    { id: "publications", label: "Publications", icon: BookOpen },
    { id: "awards", label: "Awards & Recognition", icon: Award },
    { id: "training", label: "Technical Training", icon: GraduationCap },
    { id: "activities", label: "Academic Activities", icon: FileText },
    { id: "contact", label: "Contact Details", icon: MapPin },
    { id: "backup", label: "Settings & Backup", icon: SettingsIcon }
  ];

  // Backup file import handler
  const handleImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        importSiteBackup(json);
        toast.success("Website backup restored successfully! Reloading...");
        setTimeout(() => window.location.reload(), 1200);
      } catch (err: any) {
        toast.error("Failed to restore backup: File format invalid.");
      }
    };
    reader.readAsText(file);
  };

  // Generic Move List Item Helper
  const handleMoveItem = (key: string, list: any[], index: number, direction: "up" | "down") => {
    const updated = [...list];
    if (direction === "up" && index > 0) {
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
    } else if (direction === "down" && index < updated.length - 1) {
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
    }
    // Update display orders
    const ordered = updated.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    saveDatasetRecords(key, ordered);
    toast.success("Item display order updated successfully.");
  };

  // Swap within filtered list in people-members dataset
  const handleMoveMember = (id: string, direction: "up" | "down", filteredList: any[]) => {
    const listIndex = filteredList.findIndex(m => m.id === id);
    if (listIndex === -1) return;
    
    let swapWithId = "";
    if (direction === "up" && listIndex > 0) {
      swapWithId = filteredList[listIndex - 1].id;
    } else if (direction === "down" && listIndex < filteredList.length - 1) {
      swapWithId = filteredList[listIndex + 1].id;
    }
    
    if (!swapWithId) return;
    
    const updated = [...members];
    const idxA = updated.findIndex(m => m.id === id);
    const idxB = updated.findIndex(m => m.id === swapWithId);
    if (idxA !== -1 && idxB !== -1) {
      const temp = updated[idxA];
      updated[idxA] = updated[idxB];
      updated[idxB] = temp;
      const ordered = updated.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
      saveDatasetRecords("people-members", ordered);
      toast.success("Item display order updated successfully.");
    }
  };

  // Swap within filtered list in award-banners carouselConfig
  const handleMoveAwardCarouselItem = (id: string, direction: "up" | "down", category: "faculty" | "student") => {
    const fullList = [...(carouselConfig["award"] || [])];
    const subset = fullList.filter(item => (item.category || "faculty") === category);
    const idx = subset.findIndex(item => item.id === id);
    if (idx === -1) return;

    let swapWithId = "";
    if (direction === "up" && idx > 0) {
      swapWithId = subset[idx - 1].id;
    } else if (direction === "down" && idx < subset.length - 1) {
      swapWithId = subset[idx + 1].id;
    }

    if (!swapWithId) return;

    const idxA = fullList.findIndex(item => item.id === id);
    const idxB = fullList.findIndex(item => item.id === swapWithId);
    if (idxA !== -1 && idxB !== -1) {
      const temp = fullList[idxA];
      fullList[idxA] = fullList[idxB];
      fullList[idxB] = temp;
      const updatedList = fullList.map((item, index) => ({ ...item, order: index + 1 }));
      const updatedConfig = { ...carouselConfig, award: updatedList };
      setCarouselConfigState(updatedConfig);
      saveCarouselConfig(updatedConfig);
      toast.success("Showcase order updated.");
    }
  };

  // Swap within filtered list in research-projects dataset
  const handleMoveProject = (id: string, direction: "up" | "down", filteredList: any[]) => {
    const listIndex = filteredList.findIndex(p => p.id === id);
    if (listIndex === -1) return;

    let swapWithId = "";
    if (direction === "up" && listIndex > 0) {
      swapWithId = filteredList[listIndex - 1].id;
    } else if (direction === "down" && listIndex < filteredList.length - 1) {
      swapWithId = filteredList[listIndex + 1].id;
    }

    if (!swapWithId) return;

    const updated = [...projects];
    const idxA = updated.findIndex(p => p.id === id);
    const idxB = updated.findIndex(p => p.id === swapWithId);
    if (idxA !== -1 && idxB !== -1) {
      const temp = updated[idxA];
      updated[idxA] = updated[idxB];
      updated[idxB] = temp;
      const ordered = updated.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
      saveDatasetRecords("research-projects", ordered);
      toast.success("Project display order updated successfully.");
    }
  };

  // Close modals listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditingItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row transition-colors duration-300">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-card border-b border-border z-20 sticky top-0">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-extrabold text-xs uppercase tracking-widest text-teal-500 font-mono">ORL Manager</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-lg border border-border text-foreground hover:bg-secondary transition"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Sidebar Panel Navigation */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-30 transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen ${
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b border-border flex items-center justify-between shrink-0">
          <div>
            <h2 className="font-extrabold text-xs uppercase tracking-wider text-foreground">Content Manager</h2>
            <p className="text-[9px] text-text-muted mt-0.5 font-mono">Ocean Research Laboratory</p>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition text-left cursor-pointer ${
                activeTab === item.id
                  ? "bg-teal-500/10 text-teal-500 border-l-2 border-teal-500 rounded-l-none"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border bg-secondary/20 shrink-0">
          <Link
            to="/"
            className="flex items-center justify-between text-4xs font-bold uppercase tracking-widest text-teal-500 hover:text-teal-600 transition"
          >
            Public Landing Page <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* Dark overlay backdrop for mobile sidebar toggle */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden"
        />
      )}

      {/* Right Main Content Scroll Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full">
        
        {/* ==================== HOME MANAGER ==================== */}
        {activeTab === "home" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Home Page Content Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Customize titles, background images, dynamic snap cards, quick accesses, and counters on the home screen.
              </p>
            </div>

            {/* Hero Section Card */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <h3 className="font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2">Hero Section Settings</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Hero Big Title</span>
                  <input
                    type="text"
                    value={settings.heroTitle || ""}
                    onChange={(e) => saveSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Hero Subtitle (Tamil/Hindi)</span>
                  <input
                    type="text"
                    value={settings.heroSubtitle || ""}
                    onChange={(e) => saveSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                  />
                </label>
                <div className="sm:col-span-2">
                  <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Hero Overview Paragraph</span>
                  <ResizingTextarea
                    value={settings.heroDescription || ""}
                    onChange={(val) => saveSettings({ ...settings, heroDescription: val })}
                    maxLength={350}
                  />
                </div>

                <div className="sm:col-span-2">
                  <AssetUploadInput
                    label="Hero Canvas Background Image"
                    value={settings.heroBgImage || ""}
                    type="image"
                    onChange={(val) => saveSettings({ ...settings, heroBgImage: val })}
                    category="home"
                  />
                </div>

                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Primary Button Label</span>
                  <input
                    type="text"
                    value={settings.heroPrimaryBtnText || ""}
                    onChange={(e) => saveSettings({ ...settings, heroPrimaryBtnText: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Primary Button Link Path</span>
                  <input
                    type="text"
                    value={settings.heroPrimaryBtnLink || ""}
                    onChange={(e) => saveSettings({ ...settings, heroPrimaryBtnLink: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Secondary Button Label</span>
                  <input
                    type="text"
                    value={settings.heroSecondaryBtnText || ""}
                    onChange={(e) => saveSettings({ ...settings, heroSecondaryBtnText: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Secondary Button Link Path</span>
                  <input
                    type="text"
                    value={settings.heroSecondaryBtnLink || ""}
                    onChange={(e) => saveSettings({ ...settings, heroSecondaryBtnLink: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                  />
                </label>
              </div>
            </div>

            {/* Research Focus Card */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <h3 className="font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2">Research Focus Areas</h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Focus Card Title / Description</th>
                      <th className="px-4 py-2">Icon</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {focusCards.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <span className="font-bold block">{item.title}</span>
                          <span className="text-4xs text-text-muted">{item.description}</span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-teal-500">{item.icon}</td>
                        <td className="px-4 py-3 text-center">
                          <OrderControls
                            index={idx}
                            total={focusCards.length}
                            onMoveUp={() => handleMoveItem("home-research-focus", focusCards, idx, "up")}
                            onMoveDown={() => handleMoveItem("home-research-focus", focusCards, idx, "down")}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setEditingItem({ key: "home-research-focus", isNew: false, index: idx, data: item })}
                            className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statistic Counters */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Homepage Statistic Counters</h3>
                <button
                  onClick={() => setEditingItem({ key: "homepageStats", isNew: true, data: { label: "", value: "", description: "", icon: "FileText" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Counter
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Metric Label</th>
                      <th className="px-4 py-2 font-mono">Value</th>
                      <th className="px-4 py-2">Icon</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(settings.homepageStats || []).map((item, idx) => (
                      <tr key={idx} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <span className="font-bold block">{item.label}</span>
                          <span className="text-4xs text-text-muted">{item.description}</span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-teal-500">{item.value}</td>
                        <td className="px-4 py-3 font-mono text-text-secondary">{item.icon}</td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex gap-1 justify-center">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...(settings.homepageStats || [])];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                saveSettings({ ...settings, homepageStats: list.map((item, index) => ({ ...item, displayOrder: index + 1 })) });
                              }}
                              className="p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50"
                            >
                              <ChevronUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (settings.homepageStats || []).length - 1}
                              onClick={() => {
                                const list = [...(settings.homepageStats || [])];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                saveSettings({ ...settings, homepageStats: list.map((item, index) => ({ ...item, displayOrder: index + 1 })) });
                              }}
                              className="p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50"
                            >
                              <ChevronDown className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "homepageStats", isNew: false, index: idx, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this stat counter?")) {
                                  const filtered = (settings.homepageStats || []).filter((_, i) => i !== idx);
                                  saveSettings({ ...settings, homepageStats: filtered });
                                  toast.success("Counter removed successfully.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Laboratory Highlights */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Laboratory Highlights</h3>
                <button
                  onClick={() => setEditingItem({ key: "home-highlights", isNew: true, data: { title: "", tag: "", description: "", link: "facilities", specs: [], image: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Highlight
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Image</th>
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Tag</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {metrics.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-2 w-14">
                          <img src={resolveAssetUrl(item.image || item.thumbnail)} className="h-8 w-12 rounded object-cover border" />
                        </td>
                        <td className="px-4 py-3 font-semibold">{item.title}</td>
                        <td className="px-4 py-3 text-text-muted font-semibold">{item.tag}</td>
                        <td className="px-4 py-3 text-center">
                          <OrderControls
                            index={idx}
                            total={metrics.length}
                            onMoveUp={() => handleMoveItem("home-highlights", metrics, idx, "up")}
                            onMoveDown={() => handleMoveItem("home-highlights", metrics, idx, "down")}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "home-highlights", isNew: false, index: idx, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this highlight?")) {
                                  const filtered = metrics.filter((_, i) => i !== idx);
                                  saveDatasetRecords("home-highlights", filtered);
                                  toast.success("Highlight removed successfully.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Access Links */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <h3 className="font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2">Quick Access Navigation Cards</h3>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Card Label</th>
                      <th className="px-4 py-2">To Path</th>
                      <th className="px-4 py-2">Icon</th>
                      <th className="px-4 py-2">Color</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {quickAccess.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3 font-semibold">{item.label}</td>
                        <td className="px-4 py-3 font-mono text-text-muted">{item.to}</td>
                        <td className="px-4 py-3 font-mono text-text-secondary">{item.icon}</td>
                        <td className="px-4 py-3 font-semibold text-teal-500">{item.color}</td>
                        <td className="px-4 py-3 text-center">
                          <OrderControls
                            index={idx}
                            total={quickAccess.length}
                            onMoveUp={() => handleMoveItem("home-quick-access", quickAccess, idx, "up")}
                            onMoveDown={() => handleMoveItem("home-quick-access", quickAccess, idx, "down")}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "home-quick-access", isNew: false, index: idx, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== RESEARCH PAGE MANAGER ==================== */}
        {activeTab === "research" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Research Content Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Manage UWARL platform equipment, funded projects accordions, student registries, timelines, and ocean validation field diaries.
              </p>
            </div>

            {/* Funded Projects List */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Funded Research Projects</h3>
                <button
                  onClick={() => setEditingItem({ key: "research-projects", isNew: true, data: { type: "external", title: "", fundingAgency: "", amount: "", duration: "", pi: "", copi: "", description: "", thumbnail: "", documents: [], images: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Funded Project
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Project Title</th>
                      <th className="px-4 py-2">Sponsor & Amount</th>
                      <th className="px-4 py-2">PI / Co-PI</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projects.filter(p => p.type === "external" || p.type === "internal" || !p.type).map((item, idx, arr) => {
                      const absoluteIndex = projects.findIndex(p => p.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-3">
                            <span className="font-bold block leading-snug">{item.title}</span>
                            <span className="text-4xs text-text-muted font-mono">{item.duration} ({item.type || "external"})</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-text-secondary">
                            {item.fundingAgency}
                            <span className="text-4xs text-text-muted block font-mono mt-0.5">{item.amount}</span>
                          </td>
                          <td className="px-4 py-3 text-text-muted">
                            {item.pi}
                            {item.copi && <span className="block text-4xs text-text-muted mt-0.5">Co-PI: {item.copi}</span>}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={arr.length}
                              onMoveUp={() => handleMoveProject(item.id, "up", arr)}
                              onMoveDown={() => handleMoveProject(item.id, "down", arr)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "research-projects", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this project record?")) {
                                    const filtered = projects.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("research-projects", filtered);
                                    toast.success("Project removed successfully.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PhD Research Registry */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">PhD Research Registry</h3>
                <button
                  onClick={() => setEditingItem({ key: "research-projects", isNew: true, data: { type: "phd", scholar: "", guide: "", title: "", researchArea: "", status: "Active", publicationCount: 0, thumbnail: "", documents: [], images: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add PhD Scholar
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Scholar / Title</th>
                      <th className="px-4 py-2">Research Domain</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projects.filter(p => p.type === "phd").map((item, idx, arr) => {
                      const absoluteIndex = projects.findIndex(p => p.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-3">
                            <span className="font-bold block leading-snug">{item.scholar || item.name}</span>
                            <span className="text-4xs text-text-muted line-clamp-1 mt-0.5">{item.title}</span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-text-secondary">
                            {item.researchArea}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-5xs font-bold uppercase tracking-wide border px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={arr.length}
                              onMoveUp={() => handleMoveProject(item.id, "up", arr)}
                              onMoveDown={() => handleMoveProject(item.id, "down", arr)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "research-projects", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this PhD record?")) {
                                    const filtered = projects.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("research-projects", filtered);
                                    toast.success("Scholar record removed.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student Projects Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Student Projects Manager</h3>
                <button
                  onClick={() => setEditingItem({ key: "research-projects", isNew: true, data: { type: "student", title: "", fundingAgency: "", amount: "", duration: "", role: "", description: "", thumbnail: "", documents: [], images: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Student Project
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Project Title</th>
                      <th className="px-4 py-2">Funding Agency</th>
                      <th className="px-4 py-2 font-mono">Amount</th>
                      <th className="px-4 py-2">Supervisor Role</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {projects.filter(p => p.type === "student").map((item, idx, arr) => {
                      const absoluteIndex = projects.findIndex(p => p.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-3 font-semibold">{item.title}</td>
                          <td className="px-4 py-3 text-text-secondary">{item.fundingAgency}</td>
                          <td className="px-4 py-3 font-mono text-text-muted">{item.amount}</td>
                          <td className="px-4 py-3 text-text-secondary">{item.role || "—"}</td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={arr.length}
                              onMoveUp={() => handleMoveProject(item.id, "up", arr)}
                              onMoveDown={() => handleMoveProject(item.id, "down", arr)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "research-projects", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this student project record?")) {
                                    const filtered = projects.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("research-projects", filtered);
                                    toast.success("Student project removed.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Equipment & Facilities List */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Facilities & Laboratory Equipment</h3>
                <button
                  onClick={() => setEditingItem({ key: "research-equipment", isNew: true, data: { name: "", category: "sensors-comm", specs: "", purpose: "", url: "", thumbnail: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Equipment
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Image</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Sub-Category</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {equipment.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-2 w-14">
                          <img src={resolveAssetUrl(item.thumbnail)} className="h-8 w-12 rounded object-cover border" />
                        </td>
                        <td className="px-4 py-3 font-semibold">{item.name}</td>
                        <td className="px-4 py-3 font-mono font-bold text-teal-500 uppercase text-5xs">{item.category}</td>
                        <td className="px-4 py-3 text-center">
                          <OrderControls
                            index={idx}
                            total={equipment.length}
                            onMoveUp={() => handleMoveItem("research-equipment", equipment, idx, "up")}
                            onMoveDown={() => handleMoveItem("research-equipment", equipment, idx, "down")}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "research-equipment", isNew: false, index: idx, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this equipment record?")) {
                                  const filtered = equipment.filter((_, i) => i !== idx);
                                  saveDatasetRecords("research-equipment", filtered);
                                  toast.success("Equipment removed successfully.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Field Activities Section */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Field Activities & Ocean Deployments</h3>
                <button
                  onClick={() => setEditingItem({ key: "research-activities", isNew: true, data: { title: "", year: "", location: "", date: "", activityType: "Survey", equipmentTags: "", team: "", description: "", thumbnail: "", images: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Expedition
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Expedition Title</th>
                      <th className="px-4 py-2">Location & Date</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {fieldActivities.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3 font-semibold leading-snug">{item.title}</td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-text-secondary block">{item.location}</span>
                          <span className="text-4xs text-text-muted font-mono block mt-0.5">{item.date} ({item.year})</span>
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-teal-500 uppercase text-5xs">{item.activityType}</td>
                        <td className="px-4 py-3 text-center">
                          <OrderControls
                            index={idx}
                            total={fieldActivities.length}
                            onMoveUp={() => handleMoveItem("research-activities", fieldActivities, idx, "up")}
                            onMoveDown={() => handleMoveItem("research-activities", fieldActivities, idx, "down")}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "research-activities", isNew: false, index: idx, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this expedition record?")) {
                                  const filtered = fieldActivities.filter((_, i) => i !== idx);
                                  saveDatasetRecords("research-activities", filtered);
                                  toast.success("Expedition removed successfully.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== PEOPLE SECTION MANAGER ==================== */}
        {activeTab === "people" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">People Directory content Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Maintain faculty credentials, CV PDFs, scholar registry cards, project staff details, UG assistant profiles, and internships.
              </p>
            </div>

            {/* Faculty List Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Faculty Members</h3>
                <button
                  onClick={() => setEditingItem({ key: "faculty", isNew: true, data: { name: "", designation: "", department: "Department of ECE", institution: "SSNCE", specialization: "", orcid: "", googleScholar: "", link: "", bio: "", imageUrl: "", cvId: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Faculty Profile
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Faculty Name / Designation</th>
                      <th className="px-4 py-2">Specialization</th>
                      <th className="px-4 py-2">Professional Identifiers</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.filter(m => m.role === "faculty").map((item, idx) => {
                      const absoluteIndex = members.findIndex(m => m.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 w-14">
                            <img src={resolveAssetUrl(item.imageUrl || item.thumbnail)} className="h-8 w-8 rounded-full object-cover border" />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold block">{item.name || item.title}</span>
                            <span className="text-4xs text-text-muted">{item.designation}</span>
                          </td>
                          <td className="px-4 py-3 text-text-secondary font-medium">{item.specialization || "—"}</td>
                          <td className="px-4 py-3">
                            <div className="space-y-0.5 text-4xs font-mono text-text-muted">
                              {item.orcid && <span className="block">ORCID: {item.orcid}</span>}
                              {item.googleScholar && <span className="block truncate max-w-[150px]">Scholar Profile Linked</span>}
                              {item.cvId && <span className="block text-teal-500 font-bold">CV PDF Uploaded</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={members.filter(m => m.role === "faculty").length}
                              onMoveUp={() => handleMoveMember(item.id, "up", members.filter(m => m.role === "faculty"))}
                              onMoveDown={() => handleMoveMember(item.id, "down", members.filter(m => m.role === "faculty"))}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "faculty", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this faculty profile?")) {
                                    const filtered = members.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("people-members", filtered);
                                    toast.success("Profile removed successfully.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scholars List Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Research Scholars</h3>
                <button
                  onClick={() => setEditingItem({ key: "scholars", isNew: true, data: { name: "", mode: "Full Time", status: "Active", associatedProject: "", link: "", imageUrl: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Scholar Card
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Scholar Name</th>
                      <th className="px-4 py-2">Study Mode</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Project Affiliation</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.filter(m => m.role === "scholar").map((item, idx, filteredArray) => {
                      const absoluteIndex = members.findIndex(m => m.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 w-14">
                            <img src={resolveAssetUrl(item.imageUrl || item.thumbnail)} className="h-8 w-8 rounded-full object-cover border" />
                          </td>
                          <td className="px-4 py-3 font-semibold">{item.name || item.title}</td>
                          <td className="px-4 py-3 text-text-muted font-semibold">{item.mode || "—"}</td>
                          <td className="px-4 py-3 font-mono font-bold text-teal-500 uppercase text-5xs">{item.status || "—"}</td>
                          <td className="px-4 py-3 text-text-secondary font-medium">{item.associatedProject || "—"}</td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={filteredArray.length}
                              onMoveUp={() => handleMoveMember(item.id, "up", filteredArray)}
                              onMoveDown={() => handleMoveMember(item.id, "down", filteredArray)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "scholars", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this scholar profile?")) {
                                    const filtered = members.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("people-members", filtered);
                                    toast.success("Scholar profile removed.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Project Staff List Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Project Staff</h3>
                <button
                  onClick={() => setEditingItem({ key: "staff", isNew: true, data: { name: "", designation: "Project Associate-I", associatedProject: "", link: "", imageUrl: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Staff Profile
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Staff Name</th>
                      <th className="px-4 py-2">Designation / Role</th>
                      <th className="px-4 py-2">Project Affiliation</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.filter(m => m.role === "staff").map((item, idx, arr) => {
                      const absoluteIndex = members.findIndex(m => m.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 w-14">
                            <img src={resolveAssetUrl(item.imageUrl || item.thumbnail)} className="h-8 w-8 rounded-full object-cover border" />
                          </td>
                          <td className="px-4 py-3 font-semibold">{item.name || item.title}</td>
                          <td className="px-4 py-3 text-text-muted font-semibold">{item.designation || item.role_in_project || "—"}</td>
                          <td className="px-4 py-3 text-text-secondary font-medium">{item.associatedProject || "—"}</td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={arr.length}
                              onMoveUp={() => handleMoveMember(item.id, "up", arr)}
                              onMoveDown={() => handleMoveMember(item.id, "down", arr)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "staff", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this staff profile?")) {
                                    const filtered = members.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("people-members", filtered);
                                    toast.success("Staff profile removed.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PhD Graduates List Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">PhD Graduates</h3>
                <button
                  onClick={() => setEditingItem({ key: "phd-graduates", isNew: true, data: { name: "", role: "phd", researchArea: "", graduationDate: "", link: "", imageUrl: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add PhD Graduate
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Graduate Name</th>
                      <th className="px-4 py-2">Research Domain</th>
                      <th className="px-4 py-2">Graduation Date</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.filter(m => m.role === "phd").map((item, idx, arr) => {
                      const absoluteIndex = members.findIndex(m => m.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 w-14">
                            <img src={resolveAssetUrl(item.imageUrl || item.thumbnail)} className="h-8 w-8 rounded-full object-cover border" />
                          </td>
                          <td className="px-4 py-3 font-semibold">{item.name || item.title}</td>
                          <td className="px-4 py-3 text-text-secondary">{item.researchArea || "—"}</td>
                          <td className="px-4 py-3 text-text-muted font-mono">{item.graduationDate || "—"}</td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={arr.length}
                              onMoveUp={() => handleMoveMember(item.id, "up", arr)}
                              onMoveDown={() => handleMoveMember(item.id, "down", arr)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "phd-graduates", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this PhD graduate?")) {
                                    const filtered = members.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("people-members", filtered);
                                    toast.success("Profile removed.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* UG Students List Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Undergraduate Students</h3>
                <button
                  onClick={() => setEditingItem({ key: "ug-students", isNew: true, data: { name: "", role: "student", status: "Current Student", imageUrl: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add UG Student
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.filter(m => m.role === "student").map((item, idx, arr) => {
                      const absoluteIndex = members.findIndex(m => m.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 w-14">
                            <img src={resolveAssetUrl(item.imageUrl || item.thumbnail)} className="h-8 w-8 rounded-full object-cover border" />
                          </td>
                          <td className="px-4 py-3 font-semibold">{item.name || item.title}</td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={arr.length}
                              onMoveUp={() => handleMoveMember(item.id, "up", arr)}
                              onMoveDown={() => handleMoveMember(item.id, "down", arr)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "ug-students", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this student?")) {
                                    const filtered = members.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("people-members", filtered);
                                    toast.success("Profile removed.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* UG Alumni List Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">UG Alumni</h3>
                <button
                  onClick={() => setEditingItem({ key: "ug-alumni", isNew: true, data: { name: "", role: "alumni", link: "", imageUrl: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add UG Alumnus
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Alumnus Name</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.filter(m => m.role === "alumni" && !m.programme).map((item, idx, arr) => {
                      const absoluteIndex = members.findIndex(m => m.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 w-14">
                            <img src={resolveAssetUrl(item.imageUrl || item.thumbnail)} className="h-8 w-8 rounded-full object-cover border" />
                          </td>
                          <td className="px-4 py-3 font-semibold">{item.name || item.title}</td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={arr.length}
                              onMoveUp={() => handleMoveMember(item.id, "up", arr)}
                              onMoveDown={() => handleMoveMember(item.id, "down", arr)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "ug-alumni", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this alumnus?")) {
                                    const filtered = members.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("people-members", filtered);
                                    toast.success("Profile removed.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PG Alumni List Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">PG Alumni</h3>
                <button
                  onClick={() => setEditingItem({ key: "pg-alumni", isNew: true, data: { name: "", role: "alumni", programme: "M.E Applied Electronics", link: "", imageUrl: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add PG Alumnus
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Photo</th>
                      <th className="px-4 py-2">Alumnus Name</th>
                      <th className="px-4 py-2">Programme</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {members.filter(m => m.role === "alumni" && m.programme).map((item, idx, arr) => {
                      const absoluteIndex = members.findIndex(m => m.id === item.id);
                      return (
                        <tr key={item.id} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 w-14">
                            <img src={resolveAssetUrl(item.imageUrl || item.thumbnail)} className="h-8 w-8 rounded-full object-cover border" />
                          </td>
                          <td className="px-4 py-3 font-semibold">{item.name || item.title}</td>
                          <td className="px-4 py-3 text-text-secondary">{item.programme}</td>
                          <td className="px-4 py-3 text-center">
                            <OrderControls
                              index={idx}
                              total={arr.length}
                              onMoveUp={() => handleMoveMember(item.id, "up", arr)}
                              onMoveDown={() => handleMoveMember(item.id, "down", arr)}
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "pg-alumni", isNew: false, index: absoluteIndex, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this alumnus?")) {
                                    const filtered = members.filter((_, i) => i !== absoluteIndex);
                                    saveDatasetRecords("people-members", filtered);
                                    toast.success("Profile removed.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Internships List Manager */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Student Internships Manager</h3>
                <button
                  onClick={() => setEditingItem({ key: "people-internships", isNew: true, data: { name: "", institution: "", topic: "", duration: "", imageUrl: "", cvId: "" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Intern Record
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Intern Name / Institution</th>
                      <th className="px-4 py-2">Duration</th>
                      <th className="px-4 py-2">Internship Topic (Hidden in Public Table)</th>
                      <th className="px-4 py-2">Certificate PDF</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {internships.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <span className="font-bold block">{item.name || item.title}</span>
                          <span className="text-4xs text-text-muted">{item.institution}</span>
                        </td>
                        <td className="px-4 py-3 text-text-secondary font-semibold">{item.duration}</td>
                        <td className="px-4 py-3 text-text-muted italic">{item.topic || "—"}</td>
                        <td className="px-4 py-3 font-semibold">
                          {item.cvId ? (
                            <span className="text-teal-500 font-bold">Uploaded</span>
                          ) : (
                            <span className="text-text-muted">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <OrderControls
                            index={idx}
                            total={internships.length}
                            onMoveUp={() => handleMoveItem("people-internships", internships, idx, "up")}
                            onMoveDown={() => handleMoveItem("people-internships", internships, idx, "down")}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "people-internships", isNew: false, index: idx, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this intern record?")) {
                                  const filtered = internships.filter((_, i) => i !== idx);
                                  saveDatasetRecords("people-internships", filtered);
                                  toast.success("Internship record removed.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== COLLABORATIONS MANAGER ==================== */}
        {activeTab === "collaborations" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Collaborations & Consultancy Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Edit memorandum of understandings (MoUs), partner logos, and industrial consultancy trial logs.
              </p>
            </div>

            {/* MoUs List */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Institutional MoUs & Agreements</h3>
                <button
                  onClick={() => setEditingItem({ key: "collaborations-mous", isNew: true, data: { title: "", date: "", researchFocus: "", notes: "", thumbnail: "", documents: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add MoU
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Organization</th>
                      <th className="px-4 py-2">Signing Date</th>
                      <th className="px-4 py-2">Research Focus</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {mous.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <span className="font-bold block">{item.title || item.name}</span>
                          <span className="text-4xs text-text-muted leading-relaxed max-w-sm block">{item.notes}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-text-secondary font-mono">{item.date}</td>
                        <td className="px-4 py-3 font-medium text-text-muted">{item.researchFocus}</td>
                        <td className="px-4 py-3 text-center">
                          <OrderControls
                            index={idx}
                            total={mous.length}
                            onMoveUp={() => handleMoveItem("collaborations-mous", mous, idx, "up")}
                            onMoveDown={() => handleMoveItem("collaborations-mous", mous, idx, "down")}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "collaborations-mous", isNew: false, index: idx, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this MoU record?")) {
                                  const filtered = mous.filter((_, i) => i !== idx);
                                  saveDatasetRecords("collaborations-mous", filtered);
                                  toast.success("MoU agreement removed.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Consultancy Activities */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Consultancy Activities & Validation logs</h3>
                <button
                  onClick={() => setEditingItem({ key: "collaborations-activities", isNew: true, data: { title: "", date: "", participants: "", purpose: "", equipment: "", thumbnail: "", documents: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Log
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Contracting Institution</th>
                      <th className="px-4 py-2">Date Reference</th>
                      <th className="px-4 py-2">Experts & Purpose</th>
                      <th className="px-4 py-2 w-28 text-center">Reorder</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {consultancy.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <span className="font-bold block">{item.title || item.name}</span>
                          <span className="text-4xs text-text-muted block mt-0.5">Gear: {item.equipment}</span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-text-secondary font-mono">{item.date}</td>
                        <td className="px-4 py-3 text-text-muted">
                          <span className="font-bold block text-foreground leading-snug">{item.participants}</span>
                          <span className="text-4xs leading-normal block mt-0.5">{item.purpose}</span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <OrderControls
                            index={idx}
                            total={consultancy.length}
                            onMoveUp={() => handleMoveItem("collaborations-activities", consultancy, idx, "up")}
                            onMoveDown={() => handleMoveItem("collaborations-activities", consultancy, idx, "down")}
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "collaborations-activities", isNew: false, index: idx, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this consultancy activity record?")) {
                                  const filtered = consultancy.filter((_, i) => i !== idx);
                                  saveDatasetRecords("collaborations-activities", filtered);
                                  toast.success("Consultancy record removed.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== PHOTO GALLERY MANAGER ==================== */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Photo Gallery Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Upload image assets, categorize items, and arrange priority layouts on the public gallery grid.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Uploaded Photo Showcase Cards</h3>
                <button
                  onClick={() => setEditingItem({ key: "gallery-records", isNew: true, data: { title: "", category: "research", date: "", tags: "", description: "", thumbnail: "", images: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Gallery Photo
                </button>
              </div>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                {gallery.map((item, idx) => (
                  <div key={item.id} className="rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between shadow-xs hover:border-teal-500/25 transition">
                    <div>
                      <div className="aspect-video bg-muted relative overflow-hidden">
                        <img src={resolveAssetUrl(item.thumbnail || (item.images && item.images[0]))} className="h-full w-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-4xs uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                          {item.category}
                        </span>
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="font-bold text-xs text-foreground leading-snug">{item.title}</h4>
                        <p className="text-4xs text-text-muted leading-relaxed line-clamp-2">{item.description}</p>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/20 border-t border-border/60 flex items-center justify-between gap-1.5">
                      <OrderControls
                        index={idx}
                        total={gallery.length}
                        onMoveUp={() => handleMoveItem("gallery-records", gallery, idx, "up")}
                        onMoveDown={() => handleMoveItem("gallery-records", gallery, idx, "down")}
                      />
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingItem({ key: "gallery-records", isNew: false, index: idx, data: item })}
                          className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm("Delete this gallery image?")) {
                              const filtered = gallery.filter((_, i) => i !== idx);
                              saveDatasetRecords("gallery-records", filtered);
                              toast.success("Gallery record deleted successfully.");
                            }
                          }}
                          className="p-1 rounded text-text-muted hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== PUBLICATIONS MANAGER ==================== */}
        {activeTab === "publications" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Publications registry Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Maintain academic journal papers, book chapters, and conferences in a structured format.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Peer-Reviewed Papers</h3>
                <button
                  onClick={() => setEditingItem({ key: "repo-records", isNew: true, data: { type: "publication", subtype: "Journal", title: "", organization: "", authors: "", doi: "", date: "", summary: "", attachments: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Publication
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Paper Title / Authors</th>
                      <th className="px-4 py-2">Venue / Publisher</th>
                      <th className="px-4 py-2 font-mono">Date</th>
                      <th className="px-4 py-2">Subtype</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {repoRecords.filter(r => r.type === "publication").map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <span className="font-bold block leading-snug">{item.title}</span>
                          <span className="text-4xs text-text-muted block mt-0.5">{item.authors}</span>
                          {item.doi && <span className="text-4xs text-teal-500 font-mono block mt-1">DOI: {item.doi}</span>}
                        </td>
                        <td className="px-4 py-3 font-semibold text-text-secondary">{item.organization}</td>
                        <td className="px-4 py-3 font-mono text-text-muted">{item.date}</td>
                        <td className="px-4 py-3 text-teal-500 font-bold font-mono text-5xs uppercase">{item.subtype}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "repo-records", isNew: false, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this publication record?")) {
                                  deleteRecord(item.id);
                                  toast.success("Publication record removed.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== AWARDS MANAGER ==================== */}
        {activeTab === "awards" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Awards & Honors Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Customize structural honors lists and design beautiful showcase carousel banners with live mockups.
              </p>
            </div>

            {/* Faculty Banners Showcase Editor with Live Mockup */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Faculty Showcase Banners</h3>
                <button
                  onClick={() => setEditingItem({ key: "award-banner", isNew: true, data: { url: "", duration: 5, order: 1, recipient: "", title: "", organization: "", date: "", category: "faculty" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Faculty Banner
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {(carouselConfig["award"] || []).filter(img => (img.category || "faculty") === "faculty").map((img) => {
                  const parts = (img.caption || "").split("\n");
                  const recipient = parts[0] || "—";
                  const title = parts[1] || "";
                  const organization = parts[2] || "";
                  const date = parts[3] || "";
                  const originalIdx = (carouselConfig["award"] || []).findIndex(item => item.id === img.id);

                  return (
                    <div key={img.id} className="p-4 rounded-xl border border-border bg-background flex flex-col justify-between gap-4 font-sans text-xs">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">
                          Live Showcase Card Mockup (faculty)
                        </span>
                        
                        <div className="border border-border bg-card p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden group">
                          <div className="h-16 w-16 bg-muted rounded overflow-hidden shrink-0 border">
                            {img.url ? (
                              <img src={resolveAssetUrl(img.url)} className="h-full w-full object-cover" alt="Live award banner preview" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-4xs text-text-muted bg-secondary">No Image</div>
                            )}
                          </div>
                          <div className="space-y-0.5 text-xs min-w-0 flex-1">
                            <span className="text-4xs text-amber-500 font-bold uppercase tracking-wider block">Award Showcase</span>
                            <h4 className="font-bold text-foreground truncate">{recipient}</h4>
                            <p className="text-text-secondary truncate font-medium">{title}</p>
                            <p className="text-4xs text-text-muted truncate">{organization} | {date}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-border/40 pt-3 mt-1.5">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveAwardCarouselItem(img.id, "up", "faculty")}
                            className="p-1 rounded bg-secondary/60 border border-border/50 text-foreground"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveAwardCarouselItem(img.id, "down", "faculty")}
                            className="p-1 rounded bg-secondary/60 border border-border/50 text-foreground"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditingItem({ key: "award-banner", isNew: false, index: originalIdx, data: { ...img, recipient, title, organization, date } })}
                            className="p-1.5 rounded border border-border hover:bg-secondary text-teal-500"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Remove this showcase banner?")) {
                                const list = (carouselConfig["award"] || []).filter(item => item.id !== img.id);
                                const updated = { ...carouselConfig, award: list.map((item, index) => ({ ...item, order: index + 1 })) };
                                setCarouselConfigState(updated);
                                saveCarouselConfig(updated);
                                toast.success("Banner deleted.");
                              }
                            }}
                            className="p-1.5 rounded border border-border hover:bg-destructive hover:text-white text-text-muted"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Student Banners Showcase Editor with Live Mockup */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Student Showcase Banners</h3>
                <button
                  onClick={() => setEditingItem({ key: "award-banner", isNew: true, data: { url: "", duration: 5, order: 1, recipient: "", title: "", organization: "", date: "", category: "student" } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Student Banner
                </button>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {(carouselConfig["award"] || []).filter(img => img.category === "student").map((img) => {
                  const parts = (img.caption || "").split("\n");
                  const recipient = parts[0] || "—";
                  const title = parts[1] || "";
                  const organization = parts[2] || "";
                  const date = parts[3] || "";
                  const originalIdx = (carouselConfig["award"] || []).findIndex(item => item.id === img.id);

                  return (
                    <div key={img.id} className="p-4 rounded-xl border border-border bg-background flex flex-col justify-between gap-4 font-sans text-xs">
                      <div className="space-y-3">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">
                          Live Showcase Card Mockup (student)
                        </span>
                        
                        <div className="border border-border bg-card p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden group">
                          <div className="h-16 w-16 bg-muted rounded overflow-hidden shrink-0 border">
                            {img.url ? (
                              <img src={resolveAssetUrl(img.url)} className="h-full w-full object-cover" alt="Live award banner preview" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-4xs text-text-muted bg-secondary">No Image</div>
                            )}
                          </div>
                          <div className="space-y-0.5 text-xs min-w-0 flex-1">
                            <span className="text-4xs text-amber-500 font-bold uppercase tracking-wider block">Award Showcase</span>
                            <h4 className="font-bold text-foreground truncate">{recipient}</h4>
                            <p className="text-text-secondary truncate font-medium">{title}</p>
                            <p className="text-4xs text-text-muted truncate">{organization} | {date}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-center border-t border-border/40 pt-3 mt-1.5">
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveAwardCarouselItem(img.id, "up", "student")}
                            className="p-1 rounded bg-secondary/60 border border-border/50 text-foreground"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveAwardCarouselItem(img.id, "down", "student")}
                            className="p-1 rounded bg-secondary/60 border border-border/50 text-foreground"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => setEditingItem({ key: "award-banner", isNew: false, index: originalIdx, data: { ...img, recipient, title, organization, date } })}
                            className="p-1.5 rounded border border-border hover:bg-secondary text-teal-500"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Remove this showcase banner?")) {
                                const list = (carouselConfig["award"] || []).filter(item => item.id !== img.id);
                                const updated = { ...carouselConfig, award: list.map((item, index) => ({ ...item, order: index + 1 })) };
                                setCarouselConfigState(updated);
                                saveCarouselConfig(updated);
                                toast.success("Banner deleted.");
                              }
                            }}
                            className="p-1.5 rounded border border-border hover:bg-destructive hover:text-white text-text-muted"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General Awards Table List */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Honors & Recognition Register</h3>
                <button
                  onClick={() => setEditingItem({ key: "repo-records", isNew: true, data: { type: "award", title: "", organization: "", date: "", summary: "", recipient: "", attachments: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Award
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Honor Title</th>
                      <th className="px-4 py-2">Awarding Body</th>
                      <th className="px-4 py-2 font-mono">Date</th>
                      <th className="px-4 py-2">Recipient</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {repoRecords.filter(r => r.type === "award").map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3 font-semibold leading-snug">{item.title}</td>
                        <td className="px-4 py-3 text-text-secondary">{item.organization}</td>
                        <td className="px-4 py-3 font-mono text-text-muted">{item.date}</td>
                        <td className="px-4 py-3 font-semibold text-text-secondary">{item.recipient || "—"}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "repo-records", isNew: false, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this award record?")) {
                                  deleteRecord(item.id);
                                  toast.success("Award removed successfully.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TECHNICAL TRAINING MANAGER ==================== */}
        {activeTab === "training" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Technical Training Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Administer training sessions, course codes, syllabus documents, and coordinate PDP schedules.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Programme Catalog</h3>
                <button
                  onClick={() => setEditingItem({ key: "repo-records", isNew: true, data: { type: "itec", title: "", organization: "", duration: "", mode: "Contact", code: "", date: "", summary: "", attachments: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Training Course
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Programme Title / Code</th>
                      <th className="px-4 py-2">Host / Coordinator</th>
                      <th className="px-4 py-2">Duration & Mode</th>
                      <th className="px-4 py-2">Course Type</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {repoRecords.filter(r => ["host", "itec", "itp", "pdp", "coord", "pg"].includes(r.type)).map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <span className="font-bold block leading-snug">{item.title}</span>
                          {item.code && <span className="text-4xs font-mono text-teal-500 block mt-0.5">Code: {item.code}</span>}
                        </td>
                        <td className="px-4 py-3 font-semibold text-text-secondary">{item.organization}</td>
                        <td className="px-4 py-3 text-text-muted">
                          {item.duration}
                          <span className="block text-4xs text-text-muted font-mono mt-0.5">{item.mode}</span>
                        </td>
                        <td className="px-4 py-3 text-teal-500 font-bold font-mono text-5xs uppercase">{item.type}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "repo-records", isNew: false, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this training record?")) {
                                  deleteRecord(item.id);
                                  toast.success("Training record removed.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== ACADEMIC ACTIVITIES ==================== */}
        {activeTab === "activities" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Academic Activities Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Maintain timelines of doctoral committees (DC), keynote talk invitations, workshops, and Board of Studies (BoS) listings.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <div className="flex justify-between items-center border-b border-border/40 pb-2">
                <h3 className="font-extrabold text-xs text-foreground uppercase">Academic Registries</h3>
                <button
                  onClick={() => setEditingItem({ key: "repo-records", isNew: true, data: { type: "dc", title: "", organization: "", date: "", duration: "", mode: "", place: "", subtitle: "", summary: "", attachments: [] } })}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Activity
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs text-left">
                  <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                    <tr>
                      <th className="px-4 py-2">Activity Details</th>
                      <th className="px-4 py-2">Organization / University</th>
                      <th className="px-4 py-2 font-mono">Date</th>
                      <th className="px-4 py-2">Type</th>
                      <th className="px-4 py-2 w-20 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {repoRecords.filter(r => ["dc", "talk", "workshop", "bos"].includes(r.type)).map((item, idx) => (
                      <tr key={item.id} className="hover:bg-secondary/10">
                        <td className="px-4 py-3">
                          <span className="font-bold block leading-snug">{item.title}</span>
                          {item.subtitle && <span className="text-4xs text-text-muted block mt-0.5">{item.subtitle}</span>}
                        </td>
                        <td className="px-4 py-3 font-semibold text-text-secondary">{item.organization}</td>
                        <td className="px-4 py-3 font-mono text-text-muted">{item.date}</td>
                        <td className="px-4 py-3 text-teal-500 font-bold font-mono text-5xs uppercase">{item.type}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex gap-1.5 justify-end">
                            <button
                              onClick={() => setEditingItem({ key: "repo-records", isNew: false, data: item })}
                              className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Remove this academic activity?")) {
                                  deleteRecord(item.id);
                                  toast.success("Activity removed successfully.");
                                }
                              }}
                              className="p-1 rounded text-text-muted hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== CONTACT DETAILS MANAGER ==================== */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Contact details content Manager</h1>
              <p className="text-xs text-text-secondary mt-1">
                Edit office phone numbers, email addresses, working timings, map locations, and direct coordinators list.
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              
              {/* General Contact Info card */}
              <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                <h3 className="font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2">Office General Info</h3>
                <div className="space-y-3">
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Office Contact Email</span>
                    <input
                      type="email"
                      value={settings.contactEmail || ""}
                      onChange={(e) => saveSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Office Telephone Phone</span>
                    <input
                      type="text"
                      value={settings.contactPhone || ""}
                      onChange={(e) => saveSettings({ ...settings, contactPhone: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Working / Office Hours</span>
                    <input
                      type="text"
                      value={settings.workingHours || ""}
                      onChange={(e) => saveSettings({ ...settings, workingHours: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                    />
                  </label>
                  <div>
                    <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Postal Address</span>
                    <ResizingTextarea
                      value={settings.address || ""}
                      onChange={(val) => saveSettings({ ...settings, address: val })}
                      maxLength={300}
                    />
                  </div>
                </div>
              </div>

              {/* Map Location card */}
              <div className="p-5 rounded-xl border border-border bg-card space-y-4">
                <h3 className="font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2">Maps & Coordinates Settings</h3>
                <div className="space-y-3">
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Google Maps Embed iframe URL</span>
                    <input
                      type="text"
                      value={settings.googleMapsEmbedUrl || ""}
                      onChange={(e) => saveSettings({ ...settings, googleMapsEmbedUrl: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase">Open in Google Maps Direct URL</span>
                    <input
                      type="text"
                      value={settings.googleMapsUrl || ""}
                      onChange={(e) => saveSettings({ ...settings, googleMapsUrl: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                    />
                  </label>
                  <div className="grid gap-3 grid-cols-2">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Latitude</span>
                      <input
                        type="text"
                        value={settings.latitude || ""}
                        onChange={(e) => saveSettings({ ...settings, latitude: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Longitude</span>
                      <input
                        type="text"
                        value={settings.longitude || ""}
                        onChange={(e) => saveSettings({ ...settings, longitude: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Key Contacts Coordinator Lists */}
              <div className="p-5 rounded-xl border border-border bg-card space-y-4 lg:col-span-2">
                <div className="flex justify-between items-center border-b border-border/40 pb-2">
                  <h3 className="font-extrabold text-xs text-foreground uppercase">Laboratory Coordinators & Key Contacts</h3>
                  <button
                    onClick={() => setEditingItem({ key: "keyContacts", isNew: true, data: { name: "", designation: "", email: "", phone: "", imageUrl: "" } })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Key Contact
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border">
                      <tr>
                        <th className="px-4 py-2">Photo</th>
                        <th className="px-4 py-2">Coordinator Name / Designation</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2 w-28 text-center">Reorder</th>
                        <th className="px-4 py-2 w-20 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(settings.keyContacts || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-secondary/10">
                          <td className="px-4 py-2 w-14">
                            <img src={resolveAssetUrl(item.imageUrl)} className="h-8 w-8 rounded-full object-cover border" />
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold block">{item.name}</span>
                            <span className="text-4xs text-text-muted">{item.designation}</span>
                          </td>
                          <td className="px-4 py-3 font-mono text-text-secondary">{item.email || "—"}</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex gap-1 justify-center">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => {
                                  const list = [...(settings.keyContacts || [])];
                                  const temp = list[idx];
                                  list[idx] = list[idx - 1];
                                  list[idx - 1] = temp;
                                  saveSettings({ ...settings, keyContacts: list.map((item, index) => ({ ...item, displayOrder: index + 1 })) });
                                }}
                                className="p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50"
                              >
                                <ChevronUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === (settings.keyContacts || []).length - 1}
                                onClick={() => {
                                  const list = [...(settings.keyContacts || [])];
                                  const temp = list[idx];
                                  list[idx] = list[idx + 1];
                                  list[idx + 1] = temp;
                                  saveSettings({ ...settings, keyContacts: list.map((item, index) => ({ ...item, displayOrder: index + 1 })) });
                                }}
                                className="p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50"
                              >
                                <ChevronDown className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button
                                onClick={() => setEditingItem({ key: "keyContacts", isNew: false, index: idx, data: item })}
                                className="p-1 rounded text-teal-500 hover:bg-teal-500/10"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm("Remove this coordinator card?")) {
                                    const filtered = (settings.keyContacts || []).filter((_, i) => i !== idx);
                                    saveSettings({ ...settings, keyContacts: filtered });
                                    toast.success("Coordinator card removed successfully.");
                                  }
                                }}
                                className="p-1 rounded text-text-muted hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== SETTINGS & BACKUP ==================== */}
        {activeTab === "backup" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-black tracking-tight text-foreground uppercase">Settings & Global Website Backup</h1>
              <p className="text-xs text-text-secondary mt-1">
                Maintain system health, export current datasets, restore configurations, or reset variables back to default seed data.
              </p>
            </div>

            {/* Warning Header */}
            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
              <Award className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-text-secondary space-y-1">
                <span className="font-bold text-foreground block uppercase font-mono tracking-wider">Accidental Deletion Protection active</span>
                <p>
                  Export a local backup before making extensive database additions. If you make a mistake, importing a previously exported JSON backup restores the full site structure.
                </p>
              </div>
            </div>

            {/* Backup Actions Card */}
            <div className="p-6 rounded-xl border border-border bg-card space-y-4">
              <h3 className="font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2">Website Backup Control Panel</h3>
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                
                {/* Export Card */}
                <div className="p-4 rounded-lg bg-secondary/20 border border-border flex flex-col justify-between gap-3 text-center">
                  <div>
                    <span className="font-bold text-foreground block text-xs">Export Website Data</span>
                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                      Download a single JSON file containing all settings, custom assets, profiles, and record databases.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const data = exportSiteBackup();
                      const blob = new Blob([data], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `uwarl_website_backup_${new Date().toISOString().split("T")[0]}.json`;
                      a.click();
                      toast.success("JSON backup file exported and downloaded successfully!");
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500 text-teal-950 text-3xs font-bold uppercase tracking-wider transition cursor-pointer select-none"
                  >
                    <Download className="h-3.5 w-3.5" /> Export Backup
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-4 rounded-lg bg-secondary/20 border border-border flex flex-col justify-between gap-3 text-center">
                  <div>
                    <span className="font-bold text-foreground block text-xs">Import Website Data</span>
                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                      Upload a previously exported JSON backup to completely restore settings and all records.
                    </p>
                  </div>
                  <label className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-3xs font-bold uppercase tracking-wider transition cursor-pointer select-none">
                    <Upload className="h-3.5 w-3.5 text-teal-500" /> Upload Backup JSON
                    <input
                      type="file"
                      className="hidden"
                      accept="application/json"
                      onChange={handleImportFileChange}
                    />
                  </label>
                </div>

                {/* Reset Card */}
                <div className="p-4 rounded-lg bg-secondary/20 border border-border flex flex-col justify-between gap-3 text-center">
                  <div>
                    <span className="font-bold text-foreground block text-xs">Reset to Default Data</span>
                    <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                      Clear all custom edits and reset the site back to the original static seed records.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("WARNING: This will wipe ALL your edits, custom images, uploaded PDFs, and settings! Are you sure you want to reset to defaults?")) {
                        resetSiteToDefaults();
                      }
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-white text-3xs font-bold uppercase tracking-wider transition cursor-pointer select-none"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Reset Site
                  </button>
                </div>

              </div>
            </div>

            {/* General Site Footer Settings card */}
            <div className="p-5 rounded-xl border border-border bg-card space-y-4">
              <h3 className="font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2">Global Metadata & Footer Settings</h3>
              <div className="space-y-4">
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Public Website Brand Name</span>
                  <input
                    type="text"
                    value={settings.siteName || ""}
                    onChange={(e) => saveSettings({ ...settings, siteName: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Public Header tag Description</span>
                  <input
                    type="text"
                    value={settings.siteDescription || ""}
                    onChange={(e) => saveSettings({ ...settings, siteDescription: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[10px] font-bold text-text-muted uppercase">Footer Content / Copyright</span>
                  <input
                    type="text"
                    value={settings.footerContent || ""}
                    onChange={(e) => saveSettings({ ...settings, footerContent: e.target.value })}
                    className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                  />
                </label>
              </div>
            </div>

          </div>
        )}

        {/* ==================== MODAL DIALOG EDITOR FOR ALL SECTIONS ==================== */}
        {editingItem && (
          <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs font-sans"
            onClick={() => setEditingItem(null)}
          >
            <div
              className="my-8 w-full max-w-2xl rounded-xl border border-border bg-background shadow-2xl overflow-hidden text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border px-5 py-3 shrink-0">
                <h2 className="text-xs font-black text-foreground uppercase tracking-widest">
                  {editingItem.isNew ? "Add New" : "Edit"} Record
                </h2>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Content Scroll */}
              <div className="px-5 py-4 max-h-[65vh] overflow-y-auto space-y-4">
                
                {/* 1. EDITOR: RESEARCH FOCUS CARD */}
                {editingItem.key === "home-research-focus" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Focus Area Title</span>
                      <input
                        type="text"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Lucide Icon Name</span>
                      <input
                        type="text"
                        value={editingItem.data.icon || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, icon: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        placeholder="e.g. Compass, Bot, Cpu, Globe"
                      />
                    </label>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Focus Description</span>
                      <ResizingTextarea
                        value={editingItem.data.description || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: val } })}
                        maxLength={180}
                      />
                    </div>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Focus Tags (Comma Separated)</span>
                      <input
                        type="text"
                        value={Array.isArray(editingItem.data.tags) ? editingItem.data.tags.join(", ") : editingItem.data.tags || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tags: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        placeholder="e.g. Sonar, MIMO, Telemetry"
                      />
                    </label>
                  </div>
                )}

                {/* 2. EDITOR: METRIC COUNTER */}
                {editingItem.key === "homepageStats" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Counter Title Label</span>
                      <input
                        type="text"
                        value={editingItem.data.label || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, label: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Counter Numeric Value</span>
                      <input
                        type="text"
                        value={editingItem.data.value || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, value: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        placeholder="e.g. 169, 15+, 26"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Lucide Icon Name</span>
                      <input
                        type="text"
                        value={editingItem.data.icon || "FileText"}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, icon: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                      />
                    </label>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Details description</span>
                      <ResizingTextarea
                        value={editingItem.data.description || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: val } })}
                        maxLength={120}
                      />
                    </div>
                  </div>
                )}

                {/* 3. EDITOR: LABORATORY HIGHLIGHT */}
                {editingItem.key === "home-highlights" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Highlight Title</span>
                      <input
                        type="text"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Visual Tag Category</span>
                      <input
                        type="text"
                        value={editingItem.data.tag || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, tag: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        placeholder="e.g. ROV Platform, Acoustic Testing"
                      />
                    </label>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Scope Description</span>
                      <ResizingTextarea
                        value={editingItem.data.description || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: val } })}
                        maxLength={220}
                      />
                    </div>
                    {/* Highlight Specifications */}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Specification 1 Label</span>
                        <input
                          type="text"
                          value={editingItem.data.specs?.[0]?.label || ""}
                          onChange={(e) => {
                            const currentSpecs = [...(editingItem.data.specs || [])];
                            if (!currentSpecs[0]) currentSpecs[0] = { label: "", value: "" };
                            currentSpecs[0].label = e.target.value;
                            setEditingItem({ ...editingItem, data: { ...editingItem.data, specs: currentSpecs } });
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          placeholder="e.g. Capacity"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Specification 1 Value</span>
                        <input
                          type="text"
                          value={editingItem.data.specs?.[0]?.value || ""}
                          onChange={(e) => {
                            const currentSpecs = [...(editingItem.data.specs || [])];
                            if (!currentSpecs[0]) currentSpecs[0] = { label: "", value: "" };
                            currentSpecs[0].value = e.target.value;
                            setEditingItem({ ...editingItem, data: { ...editingItem.data, specs: currentSpecs } });
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          placeholder="e.g. 10,874 Litres"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Specification 2 Label</span>
                        <input
                          type="text"
                          value={editingItem.data.specs?.[1]?.label || ""}
                          onChange={(e) => {
                            const currentSpecs = [...(editingItem.data.specs || [])];
                            if (!currentSpecs[1]) currentSpecs[1] = { label: "", value: "" };
                            currentSpecs[1].label = e.target.value;
                            setEditingItem({ ...editingItem, data: { ...editingItem.data, specs: currentSpecs } });
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          placeholder="e.g. Equipment"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Specification 2 Value</span>
                        <input
                          type="text"
                          value={editingItem.data.specs?.[1]?.value || ""}
                          onChange={(e) => {
                            const currentSpecs = [...(editingItem.data.specs || [])];
                            if (!currentSpecs[1]) currentSpecs[1] = { label: "", value: "" };
                            currentSpecs[1].value = e.target.value;
                            setEditingItem({ ...editingItem, data: { ...editingItem.data, specs: currentSpecs } });
                          }}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          placeholder="e.g. Modular Thrusters"
                        />
                      </label>
                    </div>

                    <AssetUploadInput
                      label="Highlight Banner Image"
                      value={editingItem.data.image || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, image: val } })}
                      category="highlights"
                    />
                  </div>
                )}

                {/* 4. EDITOR: KEY CONTACTS */}
                {editingItem.key === "keyContacts" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Coordinator Full Name</span>
                      <input
                        type="text"
                        value={editingItem.data.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Designation / Role</span>
                      <input
                        type="text"
                        value={editingItem.data.designation || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, designation: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Direct Email</span>
                      <input
                        type="email"
                        value={editingItem.data.email || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, email: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Office Phone Extension</span>
                      <input
                        type="text"
                        value={editingItem.data.phone || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, phone: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                      />
                    </label>

                    <AssetUploadInput
                      label="Coordinator profile Picture"
                      value={editingItem.data.imageUrl || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: val } })}
                      category="contacts"
                    />
                  </div>
                )}

                {/* 5. EDITOR: FUNDED PROJECT RECORD */}
                {editingItem.key === "research-projects" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Project Title</span>
                      <input
                        type="text"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Sponsoring Agency</span>
                        <input
                          type="text"
                          value={editingItem.data.fundingAgency || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, fundingAgency: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Sponsorship Amount</span>
                        <input
                          type="text"
                          value={editingItem.data.amount || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, amount: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Duration Term</span>
                        <input
                          type="text"
                          value={editingItem.data.duration || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Principal Investigator</span>
                        <input
                          type="text"
                          value={editingItem.data.pi || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, pi: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Detailed Project Scope</span>
                      <ResizingTextarea
                        value={editingItem.data.description || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: val } })}
                        maxLength={500}
                      />
                    </div>

                    <AssetUploadInput
                      label="Project Thumbnail Image"
                      value={editingItem.data.thumbnail || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, thumbnail: val } })}
                      category="projects"
                    />

                    {/* PDF Document separation trigger */}
                    <AssetUploadInput
                      label="Attach Research Report PDF"
                      value={Array.isArray(editingItem.data.documents) ? editingItem.data.documents[0] || "" : editingItem.data.documents || ""}
                      type="document"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, documents: val ? [val] : [] } })}
                      category="reports"
                    />
                  </div>
                )}

                {/* 6. EDITOR: FACILITIES / EQUIPMENT */}
                {editingItem.key === "research-equipment" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Equipment Name</span>
                      <input
                        type="text"
                        value={editingItem.data.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Sub-Category Tab</span>
                      <select
                        value={editingItem.data.category || "sensors-comm"}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      >
                        <option value="underwater-platforms">Underwater Platforms & ROVs</option>
                        <option value="acoustic-systems">Acoustic Transceivers & Telemetry</option>
                        <option value="test-facilities">Calibration Basin & Hydrophones</option>
                        <option value="sensors-comm">Sensors & Communication Arrays</option>
                        <option value="field-equipment">Oceanographic Field Support</option>
                      </select>
                    </label>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Equipment Research Purpose</span>
                      <ResizingTextarea
                        value={editingItem.data.purpose || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, purpose: val } })}
                        maxLength={250}
                      />
                    </div>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Technical Specs / Details (JSON Array format)</span>
                      <textarea
                        value={editingItem.data.specs || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, specs: e.target.value } })}
                        placeholder='[{"label":"Weight","value":"15kg"},{"label":"Depth Rating","value":"50m"}]'
                        rows={3}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                      />
                    </label>

                    <AssetUploadInput
                      label="Equipment Calibration Photo"
                      value={editingItem.data.thumbnail || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, thumbnail: val } })}
                      category="equipment"
                    />
                  </div>
                )}

                {/* 7. EDITOR: FACULTY PROFILE ENHANCEMENT */}
                {editingItem.key === "faculty" && (
                  <div className="space-y-4 font-sans text-xs">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Faculty Full Name</span>
                      <input
                        type="text"
                        value={editingItem.data.name || editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value, title: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Academic Designation</span>
                        <input
                          type="text"
                          value={editingItem.data.designation || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, designation: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Affiliated Institution</span>
                        <input
                          type="text"
                          value={editingItem.data.institution || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, institution: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Department</span>
                        <input
                          type="text"
                          value={editingItem.data.department || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, department: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          placeholder="e.g. Department of ECE"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Qualification</span>
                        <input
                          type="text"
                          value={editingItem.data.qualification || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, qualification: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          placeholder="e.g. Ph.D., M.E."
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Specialization / Core domain</span>
                        <input
                          type="text"
                          value={editingItem.data.specialization || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, specialization: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          placeholder="e.g., Underwater Acoustics / Deep Learning"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Research Area</span>
                        <input
                          type="text"
                          value={editingItem.data.researchArea || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, researchArea: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          placeholder="e.g., Under Water Acoustics"
                        />
                      </label>
                      <label className="block space-y-1 sm:col-span-2">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Research Interests (Comma Separated)</span>
                        <input
                          type="text"
                          value={editingItem.data.researchInterests || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, researchInterests: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          placeholder="e.g., Ambient Noise, Sonar Telemetry"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Faculty Email</span>
                        <input
                          type="email"
                          value={editingItem.data.email || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, email: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Faculty Phone</span>
                        <input
                          type="text"
                          value={editingItem.data.phone || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, phone: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">ORCID Identifier Code</span>
                        <input
                          type="text"
                          value={editingItem.data.orcid || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, orcid: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                          placeholder="e.g. 0000-0002-1825-0097"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Google Scholar Link</span>
                        <input
                          type="text"
                          value={editingItem.data.googleScholar || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, googleScholar: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Official Profile Link</span>
                        <input
                          type="text"
                          value={editingItem.data.link || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, link: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        />
                      </label>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Brief Biography</span>
                      <ResizingTextarea
                        value={editingItem.data.bio || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, bio: val } })}
                        maxLength={500}
                      />
                    </div>

                    <AssetUploadInput
                      label="Faculty Photo Image"
                      value={editingItem.data.imageUrl || editingItem.data.thumbnail || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: val, thumbnail: val } })}
                      category="faculty"
                    />

                    {/* PDF Storage Separation compliance */}
                    <AssetUploadInput
                      label="Curriculum Vitae (CV) PDF Document"
                      value={editingItem.data.cvId || ""}
                      type="document"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, cvId: val } })}
                      category="cv"
                    />
                  </div>
                )}

                {/* 8. EDITOR: RESEARCH SCHOLAR */}
                {editingItem.key === "scholars" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Scholar Name</span>
                      <input
                        type="text"
                        value={editingItem.data.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Mode of Study</span>
                        <select
                          value={editingItem.data.mode || "Full Time"}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, mode: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none"
                        >
                          <option value="Full Time">Full Time</option>
                          <option value="Part Time">Part Time</option>
                        </select>
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Current Status</span>
                        <select
                          value={editingItem.data.status || "Active"}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, status: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none"
                        >
                          <option value="Active">Active / Coursework Ongoing</option>
                          <option value="Coursework Completed">Coursework Completed</option>
                          <option value="Thesis Submitted">Thesis Submitted</option>
                        </select>
                      </label>
                    </div>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Associated Project</span>
                      <input
                        type="text"
                        value={editingItem.data.associatedProject || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, associatedProject: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">ResearchGate / Personal Profile Link</span>
                      <input
                        type="text"
                        value={editingItem.data.link || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, link: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                      />
                    </label>

                    <AssetUploadInput
                      label="Scholar Profile Picture"
                      value={editingItem.data.imageUrl || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: val } })}
                      category="scholars"
                    />
                  </div>
                )}

                {/* 9. EDITOR: PROJECT STAFF */}
                {editingItem.key === "staff" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Staff Name</span>
                      <input
                        type="text"
                        value={editingItem.data.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Designation / Role</span>
                      <input
                        type="text"
                        value={editingItem.data.designation || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, designation: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        placeholder="e.g. Project Associate-I"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Consortium Project Affiliation</span>
                      <input
                        type="text"
                        value={editingItem.data.associatedProject || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, associatedProject: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      />
                    </label>

                    <AssetUploadInput
                      label="Staff Profile Picture"
                      value={editingItem.data.imageUrl || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: val } })}
                      category="staff"
                    />
                  </div>
                )}

                {/* 10. EDITOR: INTERNSHIP WITH TOPIC IN ADMIN AND CV CERTIFICATE */}
                {editingItem.key === "people-internships" && (
                  <div className="space-y-4">
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Intern Name</span>
                      <input
                        type="text"
                        value={editingItem.data.name || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, name: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Sponsoring Institution</span>
                        <input
                          type="text"
                          value={editingItem.data.institution || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, institution: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Deployment Duration</span>
                        <input
                          type="text"
                          value={editingItem.data.duration || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                          placeholder="e.g. June - July 2024"
                        />
                      </label>
                    </div>
                    
                    {/* Topic is editable here in the admin manager and visible in details modal */}
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Internship Project Topic</span>
                      <input
                        type="text"
                        value={editingItem.data.topic || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, topic: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                      />
                    </label>

                    <AssetUploadInput
                      label="Intern Photograph"
                      value={editingItem.data.imageUrl || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, imageUrl: val } })}
                      category="internships"
                    />

                    <AssetUploadInput
                      label="Certificate PDF (Stored separately from records)"
                      value={editingItem.data.cvId || ""}
                      type="document"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, cvId: val } })}
                      category="certificates"
                    />
                  </div>
                )}

                {/* 11. EDITOR: AWARDS CAROUSEL BANNER */}
                {editingItem.key === "award-banner" && (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">
                      Carousel Banner Editor
                    </span>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Recipient Name</span>
                        <input
                          type="text"
                          value={editingItem.data.recipient || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, recipient: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Award / Honor Title</span>
                        <input
                          type="text"
                          value={editingItem.data.title || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Awarding Body / Organization</span>
                        <input
                          type="text"
                          value={editingItem.data.organization || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Year / Period</span>
                        <input
                          type="text"
                          value={editingItem.data.date || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                          placeholder="e.g. 2023–2024"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Category Group</span>
                        <select
                          value={editingItem.data.category || "faculty"}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        >
                          <option value="faculty">Faculty Award Carousel</option>
                          <option value="student">Student Award Carousel</option>
                        </select>
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Slide Duration (seconds)</span>
                        <input
                          type="number"
                          value={editingItem.data.duration || 5}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: Number(e.target.value) } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        />
                      </label>
                    </div>

                    <AssetUploadInput
                      label="Banner Photograph"
                      value={editingItem.data.url || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, url: val } })}
                      category="awards"
                    />
                  </div>
                )}

                {/* 12. EDITOR: GENERAL REPOSITORY ACADEMIC RECORD */}
                {editingItem.key === "repo-records" && (
                  <div className="space-y-4 font-sans text-xs">
                    {/* Publication */}
                    {editingItem.data.type === "publication" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Publication Record</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Publication Subtype</span>
                          <select
                            value={editingItem.data.subtype || "Journal"}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, subtype: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          >
                            <option value="Journal">Journal</option>
                            <option value="Conference">Conference</option>
                            <option value="Book">Book</option>
                            <option value="Book Chapter">Book Chapter</option>
                            <option value="Patent">Patent</option>
                          </select>
                        </label>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Publication Title</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Author List</span>
                          <input
                            type="text"
                            value={editingItem.data.authors || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, authors: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            placeholder="e.g. A. Sen, B. Mitra"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Journal / Venue / Publisher</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">DOI Reference URL/Code</span>
                            <input
                              type="text"
                              value={editingItem.data.doi || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, doi: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Publication Date</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                              placeholder="YYYY-MM-DD or YYYY"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Abstract / Summary</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={800}
                          />
                        </div>
                        <AttachmentsManager
                          label="PDF Reprints / Associated Documents"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="publications"
                        />
                      </div>
                    )}

                    {/* Award */}
                    {editingItem.data.type === "award" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Award Record</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Award / Honor Title</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Recipient Name</span>
                            <input
                              type="text"
                              value={editingItem.data.recipient || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, recipient: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Awarding Body / Organization</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Date / Period Received</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                              placeholder="e.g. 2024-05-12 or 2024"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Award Citation / Summary</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={500}
                          />
                        </div>
                        <AttachmentsManager
                          label="Certificate PDFs / Proof of Honors"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="awards"
                        />
                      </div>
                    )}

                    {/* Host Institution */}
                    {editingItem.data.type === "host" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Host Programme Engagement</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Program Title</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Sponsoring Institution</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Duration (e.g. 5 Days, 1 Week)</span>
                            <input
                              type="text"
                              value={editingItem.data.duration || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Venue / Place</span>
                            <input
                              type="text"
                              value={editingItem.data.place || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, place: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Participants Count</span>
                            <input
                              type="text"
                              value={editingItem.data.code || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, code: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Dates / Period</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                              placeholder="e.g. 2024"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Description / Topic Scope</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={500}
                          />
                        </div>
                        <AttachmentsManager
                          label="Program Brochure (PDF)"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="brochures"
                        />
                        <MultiAssetUploadInput
                          label="Gallery / Showcase Photos"
                          values={editingItem.data.images || []}
                          type="image"
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, images: val } })}
                          category="host"
                        />
                      </div>
                    )}

                    {/* ITEC */}
                    {editingItem.data.type === "itec" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">ITEC Programme Record</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">ITEC Program Title</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Delegates Country</span>
                            <input
                              type="text"
                              value={editingItem.data.place || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, place: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                            <input
                              type="text"
                              value={editingItem.data.duration || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Participants Count</span>
                            <input
                              type="text"
                              value={editingItem.data.code || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, code: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Dates</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                              placeholder="e.g. 2024"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Program Description</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={600}
                          />
                        </div>
                        <AttachmentsManager
                          label="Program PDF Brochure"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="itec"
                        />
                        <MultiAssetUploadInput
                          label="ITEC Program Gallery / Photos"
                          values={editingItem.data.images || []}
                          type="image"
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, images: val } })}
                          category="itec"
                        />
                      </div>
                    )}

                    {/* ITP */}
                    {editingItem.data.type === "itp" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">ITP Programme Record</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Programme Title</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Country / Venue</span>
                            <input
                              type="text"
                              value={editingItem.data.place || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, place: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                            <input
                              type="text"
                              value={editingItem.data.duration || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Dates</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Program Description</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={500}
                          />
                        </div>
                        <AttachmentsManager
                          label="Program PDF Brochure"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="itp"
                        />
                        <MultiAssetUploadInput
                          label="ITP Gallery Images"
                          values={editingItem.data.images || []}
                          type="image"
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, images: val } })}
                          category="itp"
                        />
                      </div>
                    )}

                    {/* PDP */}
                    {editingItem.data.type === "pdp" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">PDP as Resource Person</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Programme Name</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Organizing Institution</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Topic Name</span>
                            <input
                              type="text"
                              value={editingItem.data.subtitle || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, subtitle: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                            <input
                              type="text"
                              value={editingItem.data.duration || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Role</span>
                            <input
                              type="text"
                              value={editingItem.data.role || "Resource Person"}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, role: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Mode (e.g. Online, Contact)</span>
                            <input
                              type="text"
                              value={editingItem.data.mode || "Contact"}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, mode: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Date</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                        </div>
                        <AttachmentsManager
                          label="Certificate / Reference PDF"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="pdp"
                        />
                      </div>
                    )}

                    {/* Coordinator */}
                    {editingItem.data.type === "coord" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">PDP as Coordinator</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Programme Name</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Organizing Institution</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                            <input
                              type="text"
                              value={editingItem.data.duration || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Coordinator Role</span>
                            <input
                              type="text"
                              value={editingItem.data.role || "Coordinator"}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, role: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Date</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                        </div>
                        <AttachmentsManager
                          label="Program Report / Brochure PDF"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="coord"
                        />
                      </div>
                    )}

                    {/* PG Course */}
                    {editingItem.data.type === "pg" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">PG Course Record</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Subject Name</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Subject Code</span>
                            <input
                              type="text"
                              value={editingItem.data.code || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, code: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Department / Programme</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Semester Term</span>
                            <input
                              type="text"
                              value={editingItem.data.duration || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Number of Students</span>
                            <input
                              type="text"
                              value={editingItem.data.mode || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, mode: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Academic Year</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                              placeholder="e.g. 2024"
                            />
                          </label>
                        </div>
                        <AttachmentsManager
                          label="Syllabus / Curriculum PDF Documents"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="pg-syllabus"
                        />
                      </div>
                    )}

                    {/* DC (Doctoral Committee) */}
                    {editingItem.data.type === "dc" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Doctoral Committee (PhD Supervision)</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Scholar Name</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Research Guide Name</span>
                            <input
                              type="text"
                              value={editingItem.data.subtitle || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, subtitle: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Affiliated University / Institution</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Date / Year</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Scholar Progress Summary</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={500}
                          />
                        </div>
                        <AttachmentsManager
                          label="Minutes / Thesis Synopsis (PDFs)"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="dc-minutes"
                        />
                      </div>
                    )}

                    {/* Talk */}
                    {editingItem.data.type === "talk" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Invited Talk Record</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Title of the Talk</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Speaker Name</span>
                            <input
                              type="text"
                              value={editingItem.data.recipient || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, recipient: e.target.value, subtitle: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Host Institution / Venue</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Place / Location</span>
                            <input
                              type="text"
                              value={editingItem.data.place || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, place: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Date</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Talk Abstract</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={600}
                          />
                        </div>
                        <AttachmentsManager
                          label="Speaker Certificate PDF"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="talks"
                        />
                        <MultiAssetUploadInput
                          label="Lecture Photos / Gallery"
                          values={editingItem.data.images || []}
                          type="image"
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, images: val } })}
                          category="talks"
                        />
                      </div>
                    )}

                    {/* Workshop */}
                    {editingItem.data.type === "workshop" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Workshop / Seminar Record</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Workshop Title</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Host / Organizing Body</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Duration</span>
                            <input
                              type="text"
                              value={editingItem.data.duration || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, duration: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Participants Count</span>
                            <input
                              type="text"
                              value={editingItem.data.code || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, code: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Date</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Abstract / Summary Scope</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={500}
                          />
                        </div>
                        <AttachmentsManager
                          label="Program Brochure (PDF)"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="workshops"
                        />
                        <MultiAssetUploadInput
                          label="Workshop Photos / Gallery"
                          values={editingItem.data.images || []}
                          type="image"
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, images: val } })}
                          category="workshops"
                        />
                      </div>
                    )}

                    {/* BoS */}
                    {editingItem.data.type === "bos" && (
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Board of Studies Membership</span>
                        <label className="block space-y-1">
                          <span className="text-[10px] font-bold text-text-muted uppercase">Role & Academic Body Title</span>
                          <input
                            type="text"
                            value={editingItem.data.title || ""}
                            onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                            className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                          />
                        </label>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">University / Institution</span>
                            <input
                              type="text"
                              value={editingItem.data.organization || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, organization: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Department / Panel</span>
                            <input
                              type="text"
                              value={editingItem.data.subtitle || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, subtitle: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                            />
                          </label>
                          <label className="block space-y-1 sm:col-span-2">
                            <span className="text-[10px] font-bold text-text-muted uppercase">Date / Tenure Period</span>
                            <input
                              type="text"
                              value={editingItem.data.date || ""}
                              onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                              className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                            />
                          </label>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Details Summary</span>
                          <ResizingTextarea
                            value={editingItem.data.summary || ""}
                            onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, summary: val } })}
                            maxLength={400}
                          />
                        </div>
                        <AttachmentsManager
                          label="Governance Documents / Reference PDFs"
                          attachments={editingItem.data.attachments || []}
                          onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, attachments: val } })}
                          category="bos"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* 13. EDITOR: PHOTO GALLERY RECORDS */}
                {editingItem.key === "gallery-records" && (
                  <div className="space-y-4 font-sans text-xs">
                    <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Photo Gallery Record</span>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Gallery Item Title</span>
                      <input
                        type="text"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Category Tab</span>
                        <select
                          value={editingItem.data.category || "research"}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, category: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        >
                          <option value="research">Research Projects & Surveys</option>
                          <option value="field">Field Activities & Deployments</option>
                          <option value="facilities">Laboratory Infrastructure</option>
                          <option value="events">Workshops & Guest Lectures</option>
                          <option value="internships">Academic Internships</option>
                        </select>
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Event Date</span>
                        <input
                          type="text"
                          value={editingItem.data.date || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                          placeholder="e.g. 2024-05-12"
                        />
                      </label>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Detailed Description</span>
                      <ResizingTextarea
                        value={editingItem.data.description || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: val } })}
                        maxLength={500}
                      />
                    </div>
                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!editingItem.data.featured}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, featured: e.target.checked } })}
                        className="rounded border-border bg-background text-teal-500 focus:ring-teal-500"
                      />
                      <span className="text-[10px] font-bold text-text-secondary uppercase">Featured on Homepage Grid</span>
                    </label>
                    <AssetUploadInput
                      label="Cover Image (Thumbnail)"
                      value={editingItem.data.thumbnail || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, thumbnail: val } })}
                      category="gallery"
                    />
                    <MultiAssetUploadInput
                      label="Gallery Showcase Images"
                      values={editingItem.data.images || []}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, images: val } })}
                      category="gallery"
                    />
                    <MultiAssetUploadInput
                      label="Associated PDF Reports / Documents"
                      values={editingItem.data.documents || []}
                      type="document"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, documents: val } })}
                      category="gallery"
                    />
                  </div>
                )}

                {/* 14. EDITOR: HOME QUICK ACCESS CARDS */}
                {editingItem.key === "home-quick-access" && (
                  <div className="space-y-4 font-sans text-xs">
                    <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Quick Access Navigation Card</span>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Card Label</span>
                      <input
                        type="text"
                        value={editingItem.data.label || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, label: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Destination Route Link</span>
                      <input
                        type="text"
                        value={editingItem.data.to || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, to: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        placeholder="e.g. /research or /publications"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Lucide Icon Name</span>
                        <input
                          type="text"
                          value={editingItem.data.icon || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, icon: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                          placeholder="e.g. BookOpen, FolderGit2, Map"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Theme Color</span>
                        <select
                          value={editingItem.data.color || "teal"}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, color: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        >
                          <option value="sky">Sky Blue</option>
                          <option value="indigo">Indigo Purple</option>
                          <option value="teal">Teal Green</option>
                          <option value="emerald">Emerald Green</option>
                          <option value="amber">Amber Gold</option>
                        </select>
                      </label>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Card Brief Description</span>
                      <ResizingTextarea
                        value={editingItem.data.description || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: val } })}
                        maxLength={150}
                      />
                    </div>
                  </div>
                )}

                {/* 15. EDITOR: RESEARCH ACTIVITIES (FIELD DIARY) */}
                {editingItem.key === "research-activities" && (
                  <div className="space-y-4 font-sans text-xs">
                    <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono">Field Activity / Timeline Record</span>
                    <label className="block space-y-1">
                      <span className="text-[10px] font-bold text-text-muted uppercase">Activity Title</span>
                      <input
                        type="text"
                        value={editingItem.data.title || ""}
                        onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, title: e.target.value } })}
                        className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold"
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Location</span>
                        <input
                          type="text"
                          value={editingItem.data.location || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, location: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                          placeholder="e.g. Bay of Bengal"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Coordinates</span>
                        <input
                          type="text"
                          value={editingItem.data.coordinates || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, coordinates: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                          placeholder="e.g. 13.0827 N, 80.2707 E"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Team Members</span>
                        <input
                          type="text"
                          value={editingItem.data.team || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, team: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Equipment Used</span>
                        <input
                          type="text"
                          value={editingItem.data.equipmentTags || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, equipmentTags: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Activity Date</span>
                        <input
                          type="text"
                          value={editingItem.data.date || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, date: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        />
                      </label>
                      <label className="block space-y-1">
                        <span className="text-[10px] font-bold text-text-muted uppercase">Year</span>
                        <input
                          type="text"
                          value={editingItem.data.year || ""}
                          onChange={(e) => setEditingItem({ ...editingItem, data: { ...editingItem.data, year: e.target.value } })}
                          className="w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono"
                        />
                      </label>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase block mb-1">Scope Description</span>
                      <ResizingTextarea
                        value={editingItem.data.description || ""}
                        onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, description: val } })}
                        maxLength={600}
                      />
                    </div>
                    <AssetUploadInput
                      label="Cover Photograph"
                      value={editingItem.data.thumbnail || ""}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, thumbnail: val } })}
                      category="field-activities"
                    />
                    <MultiAssetUploadInput
                      label="Gallery / Deployment Photos"
                      values={editingItem.data.images || []}
                      type="image"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, images: val } })}
                      category="field-activities"
                    />
                    <MultiAssetUploadInput
                      label="Associated PDF Reports / Documents"
                      values={editingItem.data.documents || []}
                      type="document"
                      onChange={(val) => setEditingItem({ ...editingItem, data: { ...editingItem.data, documents: val } })}
                      category="field-activities"
                    />
                  </div>
                )}

              </div>

              {/* Modal Action buttons */}
              <div className="flex items-center justify-end gap-2 border-t border-border bg-secondary/40 px-5 py-3 text-2xs font-bold uppercase tracking-widest shrink-0">
                <button
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition select-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const { key, isNew, index, data } = editingItem;

                    // 1. Save general settings hooks keys
                    if (key === "homepageStats" || key === "keyContacts") {
                      const list = [...(settings[key] || [])];
                      if (isNew) {
                        list.push({ ...data, displayOrder: list.length + 1 });
                      } else if (index !== undefined) {
                        list[index] = data;
                      }
                      saveSettings({ ...settings, [key]: list });
                      toast.success("Settings list updated successfully.");
                    }

                    // 2. Save dynamic JSON datasets
                    else if (
                      key === "home-research-focus" ||
                      key === "home-highlights" ||
                      key === "home-quick-access" ||
                      key === "research-projects" ||
                      key === "research-equipment" ||
                      key === "research-activities" ||
                      key === "people-internships" ||
                      key === "collaborations-mous" ||
                      key === "collaborations-institutions" ||
                      key === "collaborations-activities" ||
                      key === "gallery-records"
                    ) {
                      const dataset = getDatasetRecords(key, DATA_SEEDS[key as keyof typeof DATA_SEEDS] || []);
                      if (isNew) {
                        const newId = `${key.slice(0, 3)}-${Date.now()}`;
                        dataset.push({ ...data, id: newId, displayOrder: dataset.length + 1 });
                      } else if (index !== undefined) {
                        dataset[index] = data;
                      }
                      saveDatasetRecords(key, dataset);
                      toast.success("Dataset records saved successfully.");
                    }

                    // 3. Save people members list
                    else if (
                      key === "faculty" ||
                      key === "scholars" ||
                      key === "staff" ||
                      key === "phd-graduates" ||
                      key === "ug-students" ||
                      key === "ug-alumni" ||
                      key === "pg-alumni"
                    ) {
                      const dataset = [...members];
                      const roleMap: Record<string, string> = {
                        faculty: "faculty",
                        scholars: "scholar",
                        staff: "staff",
                        "phd-graduates": "phd",
                        "ug-students": "student",
                        "ug-alumni": "alumni",
                        "pg-alumni": "alumni"
                      };
                      const formatted = { ...data, role: roleMap[key] || data.role };

                      if (isNew) {
                        const newId = `peop-${Date.now()}`;
                        dataset.push({ ...formatted, id: newId, displayOrder: dataset.length + 1 });
                      } else if (index !== undefined) {
                        dataset[index] = formatted;
                      }
                      saveDatasetRecords("people-members", dataset);
                      toast.success("Member profile saved successfully.");
                    }

                    // 4. Save awards carousel banners config
                    else if (key === "award-banner") {
                      const caption = `${data.recipient}\n${data.title}\n${data.organization}\n${data.date}`;
                      const list = [...(carouselConfig["award"] || [])];
                      const slideItem: CarouselImage = {
                        id: data.id || `award-${Date.now()}`,
                        url: data.url,
                        duration: data.duration,
                        order: data.order,
                        caption,
                        category: data.category
                      };

                      if (isNew) {
                        list.push({ ...slideItem, order: list.length + 1 });
                      } else if (index !== undefined) {
                        list[index] = slideItem;
                      }
                      const updated = { ...carouselConfig, award: list };
                      setCarouselConfigState(updated);
                      saveCarouselConfig(updated);
                      toast.success("Award showcase banner configuration saved.");
                    }

                    // 5. Save academic repository records
                    else if (key === "repo-records") {
                      if (isNew) {
                        createRecord(data);
                        toast.success("Record created successfully.");
                      } else {
                        updateRecord(data.id, data);
                        toast.success("Record updated successfully.");
                      }
                    }

                    setEditingItem(null);
                  }}
                  className="px-4 py-2.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 transition select-none cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
