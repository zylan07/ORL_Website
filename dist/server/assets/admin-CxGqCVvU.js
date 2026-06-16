import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { Menu, X, LayoutDashboard, FolderGit2, Users, Network, Image, BookOpen, Award, GraduationCap, FileText, MapPin, Settings, ChevronRight, Pencil, Plus, ChevronUp, ChevronDown, Trash2, Download, Upload, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { k as useSiteSettings, u as useRecords, a as useDatasetRecords, m as getCarouselConfig, s as saveSettings, r as resolveAssetUrl, n as saveDatasetRecords, o as deleteRecord, p as saveCarouselConfig, q as exportSiteBackup, t as resetSiteToDefaults, v as getDatasetRecords, w as createRecord, x as updateRecord, D as DATA_SEEDS, y as importSiteBackup, z as registerAsset } from "./router-ScoMlXed.js";
import "@tanstack/react-query";
import "zod";
function AssetUploadInput({
  label,
  value,
  type,
  onChange,
  category = "",
  placeholder = ""
}) {
  const [loading, setLoading] = useState(false);
  const [altText, setAltText] = useState("");
  const fileInputRef = useRef(null);
  const resolvedUrl = resolveAssetUrl(value);
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const assetId = await registerAsset(file, type, category, altText);
      onChange(assetId);
      toast.success(`${type === "image" ? "Image" : "PDF Document"} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload file");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-3 bg-secondary/30 rounded-xl border border-border/60 space-y-2 font-sans text-xs", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase tracking-wider block", children: label }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      type === "image" && resolvedUrl ? /* @__PURE__ */ jsx("div", { className: "relative h-14 w-14 rounded-lg overflow-hidden border border-border shrink-0 bg-muted", children: /* @__PURE__ */ jsx("img", { src: resolvedUrl, className: "h-full w-full object-cover", alt: "Profile/Asset Preview" }) }) : type === "document" && value ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-secondary px-2.5 py-1.5 rounded-lg border border-border text-4xs font-mono font-bold text-teal-500", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-3.5 w-3.5" }),
        " PDF Reference"
      ] }) : /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-lg border border-dashed border-border flex items-center justify-center text-text-muted shrink-0 text-3xs", children: "None" }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 space-y-1", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-4xs font-bold uppercase tracking-wider transition cursor-pointer select-none", children: [
          /* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5 text-teal-500" }),
          loading ? "Uploading..." : "Select File",
          /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", className: "hidden", accept: type === "image" ? "image/*" : "application/pdf", onChange: handleFileChange, disabled: loading })
        ] }),
        value && /* @__PURE__ */ jsx("button", { type: "button", onClick: () => {
          onChange("");
          if (fileInputRef.current) fileInputRef.current.value = "";
        }, className: "px-2.5 py-1.5 text-4xs font-bold text-text-muted hover:text-destructive border border-border rounded-lg bg-card uppercase tracking-wider", children: "Clear" })
      ] }) })
    ] }),
    type === "image" && !value && /* @__PURE__ */ jsx("input", { type: "text", placeholder: "Image Alt Text (Accessibility description)", value: altText, onChange: (e) => setAltText(e.target.value), className: "w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-4xs outline-none focus:border-teal-500" }),
    value && /* @__PURE__ */ jsx("div", { className: "text-[9px] text-text-muted font-mono truncate", children: value })
  ] });
}
function MultiAssetUploadInput({
  label,
  values = [],
  type,
  onChange,
  category = ""
}) {
  const handleAddAsset = (newAssetId) => {
    if (newAssetId && !values.includes(newAssetId)) {
      onChange([...values, newAssetId]);
    }
  };
  const handleRemoveAsset = (idxToRemove) => {
    onChange(values.filter((_, i) => i !== idxToRemove));
  };
  const handleMoveAsset = (idx, dir) => {
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
  return /* @__PURE__ */ jsxs("div", { className: "p-3 bg-secondary/30 rounded-xl border border-border/60 space-y-3 font-sans text-xs", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase tracking-wider block", children: label }),
    values.length > 0 && /* @__PURE__ */ jsx("div", { className: "grid gap-2 sm:grid-cols-2", children: values.map((val, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-3 p-2 bg-card rounded-lg border border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
        type === "image" ? /* @__PURE__ */ jsx("div", { className: "relative h-10 w-10 rounded-lg overflow-hidden border border-border shrink-0 bg-muted", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(val), className: "h-full w-full object-cover" }) }) : /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 bg-secondary px-2 py-1 rounded border border-border text-[9px] font-mono font-bold text-teal-500 shrink-0", children: [
          /* @__PURE__ */ jsx(FileText, { className: "h-3 w-3" }),
          " PDF"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "text-[9px] text-text-muted font-mono truncate", children: val })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
        /* @__PURE__ */ jsx("button", { type: "button", disabled: idx === 0, onClick: () => handleMoveAsset(idx, "up"), className: "p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50 text-foreground", children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-3 w-3" }) }),
        /* @__PURE__ */ jsx("button", { type: "button", disabled: idx === values.length - 1, onClick: () => handleMoveAsset(idx, "down"), className: "p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50 text-foreground", children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-3 w-3" }) }),
        /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleRemoveAsset(idx), className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }, idx)) }),
    /* @__PURE__ */ jsx(AssetUploadInput, { label: `Upload New ${type === "image" ? "Image" : "Document"} Slide`, value: "", type, onChange: handleAddAsset, category })
  ] });
}
function OrderControls({
  index,
  total,
  onMoveUp,
  onMoveDown
}) {
  return /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
    /* @__PURE__ */ jsx("button", { type: "button", onClick: onMoveUp, disabled: index === 0, className: "p-1 rounded bg-secondary/60 text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none border border-border/50", "aria-label": "Move Up", children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-3.5 w-3.5" }) }),
    /* @__PURE__ */ jsx("button", { type: "button", onClick: onMoveDown, disabled: index === total - 1, className: "p-1 rounded bg-secondary/60 text-foreground hover:bg-secondary disabled:opacity-30 disabled:pointer-events-none border border-border/50", "aria-label": "Move Down", children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })
  ] });
}
function ResizingTextarea({
  value,
  onChange,
  placeholder = "",
  maxLength = 1e3
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-1", children: [
    /* @__PURE__ */ jsx("textarea", { value, onChange: (e) => onChange(e.target.value.slice(0, maxLength)), placeholder, rows: 4, className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none focus:border-teal-500 transition-all leading-relaxed" }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-[10px] text-text-muted font-mono", children: [
      /* @__PURE__ */ jsx("span", { children: "Avoid markup - write in plain text." }),
      /* @__PURE__ */ jsxs("span", { children: [
        value.length,
        " / ",
        maxLength,
        " characters"
      ] })
    ] })
  ] });
}
function AttachmentsManager({
  label,
  attachments = [],
  onChange,
  category = ""
}) {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const assetId = await registerAsset(file, "document", category, "");
      const newAttachment = {
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        kind: "PDF",
        url: assetId
      };
      onChange([...attachments, newAttachment]);
      toast.success("Attachment uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload attachment");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleRemove = (idxToRemove) => {
    onChange(attachments.filter((_, i) => i !== idxToRemove));
  };
  const handleRename = (idx, newName) => {
    const updated = attachments.map((att, i) => i === idx ? {
      ...att,
      name: newName
    } : att);
    onChange(updated);
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-3 bg-secondary/30 rounded-xl border border-border/60 space-y-3 font-sans text-xs", children: [
    /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase tracking-wider block", children: label }),
    attachments.length > 0 && /* @__PURE__ */ jsx("div", { className: "space-y-2", children: attachments.map((att, idx) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-2 bg-card rounded-lg border border-border", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0 flex-1", children: [
        /* @__PURE__ */ jsx(FileText, { className: "h-4 w-4 text-teal-500 shrink-0" }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
          /* @__PURE__ */ jsx("input", { type: "text", value: att.name, onChange: (e) => handleRename(idx, e.target.value), className: "w-full bg-transparent border-b border-transparent hover:border-border focus:border-teal-500 px-1 py-0.5 outline-none font-bold text-xs" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[9px] text-text-muted font-mono truncate", children: [
            att.url,
            " (",
            att.size,
            ")"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleRemove(idx), className: "p-1 rounded text-text-muted hover:text-destructive shrink-0", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
    ] }, att.id)) }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-4xs font-bold uppercase tracking-wider transition cursor-pointer select-none", children: [
      /* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5 text-teal-500" }),
      loading ? "Uploading..." : "Attach Document (PDF)",
      /* @__PURE__ */ jsx("input", { ref: fileInputRef, type: "file", className: "hidden", accept: "application/pdf", onChange: handleFileChange, disabled: loading })
    ] }) })
  ] });
}
function Admin() {
  const settings = useSiteSettings();
  const [activeTab, setActiveTab] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const repoRecords = useRecords();
  const focusCards = useDatasetRecords("home-research-focus", DATA_SEEDS["home-research-focus"]);
  const metrics = useDatasetRecords("home-highlights", DATA_SEEDS["home-highlights"]);
  const quickAccess = useDatasetRecords("home-quick-access", DATA_SEEDS["home-quick-access"]);
  const equipment = useDatasetRecords("research-equipment", DATA_SEEDS["research-equipment"]);
  const projects = useDatasetRecords("research-projects", DATA_SEEDS["research-projects"]);
  const fieldActivities = useDatasetRecords("research-activities", DATA_SEEDS["research-activities"]);
  const members = useDatasetRecords("people-members", DATA_SEEDS["people-members"]);
  const internships = useDatasetRecords("people-internships", DATA_SEEDS["people-internships"]);
  const mous = useDatasetRecords("collaborations-mous", DATA_SEEDS["collaborations-mous"]);
  useDatasetRecords("collaborations-institutions", DATA_SEEDS["collaborations-institutions"]);
  const consultancy = useDatasetRecords("collaborations-activities", DATA_SEEDS["collaborations-activities"]);
  const gallery = useDatasetRecords("gallery-records", DATA_SEEDS["gallery-records"]);
  const [carouselConfig, setCarouselConfigState] = useState(getCarouselConfig());
  const [editingItem, setEditingItem] = useState(null);
  const SIDEBAR_ITEMS = [{
    id: "home",
    label: "Home",
    icon: LayoutDashboard
  }, {
    id: "research",
    label: "Research",
    icon: FolderGit2
  }, {
    id: "people",
    label: "People",
    icon: Users
  }, {
    id: "collaborations",
    label: "Collaborations & Consultancy",
    icon: Network
  }, {
    id: "gallery",
    label: "Photo Gallery",
    icon: Image
  }, {
    id: "publications",
    label: "Publications",
    icon: BookOpen
  }, {
    id: "awards",
    label: "Awards & Recognition",
    icon: Award
  }, {
    id: "training",
    label: "Technical Training",
    icon: GraduationCap
  }, {
    id: "activities",
    label: "Academic Activities",
    icon: FileText
  }, {
    id: "contact",
    label: "Contact Details",
    icon: MapPin
  }, {
    id: "backup",
    label: "Settings & Backup",
    icon: Settings
  }];
  const handleImportFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result;
        importSiteBackup(json);
        toast.success("Website backup restored successfully! Reloading...");
        setTimeout(() => window.location.reload(), 1200);
      } catch (err) {
        toast.error("Failed to restore backup: File format invalid.");
      }
    };
    reader.readAsText(file);
  };
  const handleMoveItem = (key, list, index, direction) => {
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
    const ordered = updated.map((item, idx) => ({
      ...item,
      displayOrder: idx + 1
    }));
    saveDatasetRecords(key, ordered);
    toast.success("Item display order updated successfully.");
  };
  const handleMoveMember = (id, direction, filteredList) => {
    const listIndex = filteredList.findIndex((m) => m.id === id);
    if (listIndex === -1) return;
    let swapWithId = "";
    if (direction === "up" && listIndex > 0) {
      swapWithId = filteredList[listIndex - 1].id;
    } else if (direction === "down" && listIndex < filteredList.length - 1) {
      swapWithId = filteredList[listIndex + 1].id;
    }
    if (!swapWithId) return;
    const updated = [...members];
    const idxA = updated.findIndex((m) => m.id === id);
    const idxB = updated.findIndex((m) => m.id === swapWithId);
    if (idxA !== -1 && idxB !== -1) {
      const temp = updated[idxA];
      updated[idxA] = updated[idxB];
      updated[idxB] = temp;
      const ordered = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx + 1
      }));
      saveDatasetRecords("people-members", ordered);
      toast.success("Item display order updated successfully.");
    }
  };
  const handleMoveAwardCarouselItem = (id, direction, category) => {
    const fullList = [...carouselConfig["award"] || []];
    const subset = fullList.filter((item) => (item.category || "faculty") === category);
    const idx = subset.findIndex((item) => item.id === id);
    if (idx === -1) return;
    let swapWithId = "";
    if (direction === "up" && idx > 0) {
      swapWithId = subset[idx - 1].id;
    } else if (direction === "down" && idx < subset.length - 1) {
      swapWithId = subset[idx + 1].id;
    }
    if (!swapWithId) return;
    const idxA = fullList.findIndex((item) => item.id === id);
    const idxB = fullList.findIndex((item) => item.id === swapWithId);
    if (idxA !== -1 && idxB !== -1) {
      const temp = fullList[idxA];
      fullList[idxA] = fullList[idxB];
      fullList[idxB] = temp;
      const updatedList = fullList.map((item, index) => ({
        ...item,
        order: index + 1
      }));
      const updatedConfig = {
        ...carouselConfig,
        award: updatedList
      };
      setCarouselConfigState(updatedConfig);
      saveCarouselConfig(updatedConfig);
      toast.success("Showcase order updated.");
    }
  };
  const handleMoveProject = (id, direction, filteredList) => {
    const listIndex = filteredList.findIndex((p) => p.id === id);
    if (listIndex === -1) return;
    let swapWithId = "";
    if (direction === "up" && listIndex > 0) {
      swapWithId = filteredList[listIndex - 1].id;
    } else if (direction === "down" && listIndex < filteredList.length - 1) {
      swapWithId = filteredList[listIndex + 1].id;
    }
    if (!swapWithId) return;
    const updated = [...projects];
    const idxA = updated.findIndex((p) => p.id === id);
    const idxB = updated.findIndex((p) => p.id === swapWithId);
    if (idxA !== -1 && idxB !== -1) {
      const temp = updated[idxA];
      updated[idxA] = updated[idxB];
      updated[idxB] = temp;
      const ordered = updated.map((item, idx) => ({
        ...item,
        displayOrder: idx + 1
      }));
      saveDatasetRecords("research-projects", ordered);
      toast.success("Project display order updated successfully.");
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setEditingItem(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col md:flex-row transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("header", { className: "md:hidden flex items-center justify-between px-6 py-4 bg-card border-b border-border z-20 sticky top-0", children: [
      /* @__PURE__ */ jsx(Link, { to: "/", className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: "font-extrabold text-xs uppercase tracking-widest text-teal-500 font-mono", children: "ORL Manager" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => setIsSidebarOpen(!isSidebarOpen), className: "p-1.5 rounded-lg border border-border text-foreground hover:bg-secondary transition", "aria-label": "Toggle menu", children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" }) })
    ] }),
    /* @__PURE__ */ jsxs("aside", { className: `fixed inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col z-30 transition-transform duration-300 md:translate-x-0 md:sticky md:top-0 md:h-screen ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "p-6 border-b border-border flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "font-extrabold text-xs uppercase tracking-wider text-foreground", children: "Content Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-[9px] text-text-muted mt-0.5 font-mono", children: "Ocean Research Laboratory" })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setIsSidebarOpen(false), className: "md:hidden p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground", "aria-label": "Close menu", children: /* @__PURE__ */ jsx(X, { className: "h-4.5 w-4.5" }) })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "flex-1 overflow-y-auto px-4 py-4 space-y-1.5", children: SIDEBAR_ITEMS.map((item) => /* @__PURE__ */ jsxs("button", { onClick: () => {
        setActiveTab(item.id);
        setIsSidebarOpen(false);
      }, className: `w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition text-left cursor-pointer ${activeTab === item.id ? "bg-teal-500/10 text-teal-500 border-l-2 border-teal-500 rounded-l-none" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`, children: [
        /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4 shrink-0" }),
        item.label
      ] }, item.id)) }),
      /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-border bg-secondary/20 shrink-0", children: /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center justify-between text-4xs font-bold uppercase tracking-widest text-teal-500 hover:text-teal-600 transition", children: [
        "Public Landing Page ",
        /* @__PURE__ */ jsx(ChevronRight, { className: "h-3.5 w-3.5" })
      ] }) })
    ] }),
    isSidebarOpen && /* @__PURE__ */ jsx("div", { onClick: () => setIsSidebarOpen(false), className: "fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden" }),
    /* @__PURE__ */ jsxs("main", { className: "flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto w-full", children: [
      activeTab === "home" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Home Page Content Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Customize titles, background images, dynamic snap cards, quick accesses, and counters on the home screen." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2", children: "Hero Section Settings" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Hero Big Title" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.heroTitle || "", onChange: (e) => saveSettings({
                ...settings,
                heroTitle: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Hero Subtitle (Tamil/Hindi)" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.heroSubtitle || "", onChange: (e) => saveSettings({
                ...settings,
                heroSubtitle: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "sm:col-span-2", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Hero Overview Paragraph" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: settings.heroDescription || "", onChange: (val) => saveSettings({
                ...settings,
                heroDescription: val
              }), maxLength: 350 })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "sm:col-span-2", children: /* @__PURE__ */ jsx(AssetUploadInput, { label: "Hero Canvas Background Image", value: settings.heroBgImage || "", type: "image", onChange: (val) => saveSettings({
              ...settings,
              heroBgImage: val
            }), category: "home" }) }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Primary Button Label" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.heroPrimaryBtnText || "", onChange: (e) => saveSettings({
                ...settings,
                heroPrimaryBtnText: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Primary Button Link Path" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.heroPrimaryBtnLink || "", onChange: (e) => saveSettings({
                ...settings,
                heroPrimaryBtnLink: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Secondary Button Label" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.heroSecondaryBtnText || "", onChange: (e) => saveSettings({
                ...settings,
                heroSecondaryBtnText: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Secondary Button Link Path" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.heroSecondaryBtnLink || "", onChange: (e) => saveSettings({
                ...settings,
                heroSecondaryBtnLink: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2", children: "Research Focus Areas" }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Focus Card Title / Description" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Icon" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: focusCards.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block", children: item.title }),
                /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted", children: item.description })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono font-bold text-teal-500", children: item.icon }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: focusCards.length, onMoveUp: () => handleMoveItem("home-research-focus", focusCards, idx, "up"), onMoveDown: () => handleMoveItem("home-research-focus", focusCards, idx, "down") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                key: "home-research-focus",
                isNew: false,
                index: idx,
                data: item
              }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }) })
            ] }, item.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Homepage Statistic Counters" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "homepageStats",
              isNew: true,
              data: {
                label: "",
                value: "",
                description: "",
                icon: "FileText"
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Counter"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Metric Label" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 font-mono", children: "Value" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Icon" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: (settings.homepageStats || []).map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block", children: item.label }),
                /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted", children: item.description })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono font-bold text-teal-500", children: item.value }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-text-secondary", children: item.icon }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 justify-center", children: [
                /* @__PURE__ */ jsx("button", { type: "button", disabled: idx === 0, onClick: () => {
                  const list = [...settings.homepageStats || []];
                  const temp = list[idx];
                  list[idx] = list[idx - 1];
                  list[idx - 1] = temp;
                  saveSettings({
                    ...settings,
                    homepageStats: list.map((item2, index) => ({
                      ...item2,
                      displayOrder: index + 1
                    }))
                  });
                }, className: "p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50", children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-3.5 w-3.5" }) }),
                /* @__PURE__ */ jsx("button", { type: "button", disabled: idx === (settings.homepageStats || []).length - 1, onClick: () => {
                  const list = [...settings.homepageStats || []];
                  const temp = list[idx];
                  list[idx] = list[idx + 1];
                  list[idx + 1] = temp;
                  saveSettings({
                    ...settings,
                    homepageStats: list.map((item2, index) => ({
                      ...item2,
                      displayOrder: index + 1
                    }))
                  });
                }, className: "p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50", children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })
              ] }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "homepageStats",
                  isNew: false,
                  index: idx,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this stat counter?")) {
                    const filtered = (settings.homepageStats || []).filter((_, i) => i !== idx);
                    saveSettings({
                      ...settings,
                      homepageStats: filtered
                    });
                    toast.success("Counter removed successfully.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, idx)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Laboratory Highlights" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "home-highlights",
              isNew: true,
              data: {
                title: "",
                tag: "",
                description: "",
                link: "facilities",
                specs: [],
                image: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Highlight"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Image" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Title" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Tag" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: metrics.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.image || item.thumbnail), className: "h-8 w-12 rounded object-cover border" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.title }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-muted font-semibold", children: item.tag }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: metrics.length, onMoveUp: () => handleMoveItem("home-highlights", metrics, idx, "up"), onMoveDown: () => handleMoveItem("home-highlights", metrics, idx, "down") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "home-highlights",
                  isNew: false,
                  index: idx,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this highlight?")) {
                    const filtered = metrics.filter((_, i) => i !== idx);
                    saveDatasetRecords("home-highlights", filtered);
                    toast.success("Highlight removed successfully.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2", children: "Quick Access Navigation Cards" }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Card Label" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "To Path" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Icon" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Color" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: quickAccess.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.label }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-text-muted", children: item.to }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-text-secondary", children: item.icon }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-teal-500", children: item.color }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: quickAccess.length, onMoveUp: () => handleMoveItem("home-quick-access", quickAccess, idx, "up"), onMoveDown: () => handleMoveItem("home-quick-access", quickAccess, idx, "down") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsx("div", { className: "flex gap-1.5 justify-end", children: /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                key: "home-quick-access",
                isNew: false,
                index: idx,
                data: item
              }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }) }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] }),
      activeTab === "research" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Research Content Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Manage UWARL platform equipment, funded projects accordions, student registries, timelines, and ocean validation field diaries." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Funded Research Projects" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "research-projects",
              isNew: true,
              data: {
                type: "external",
                title: "",
                fundingAgency: "",
                amount: "",
                duration: "",
                pi: "",
                copi: "",
                description: "",
                thumbnail: "",
                documents: [],
                images: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Funded Project"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Project Title" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Sponsor & Amount" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "PI / Co-PI" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: projects.filter((p) => p.type === "external" || p.type === "internal" || !p.type).map((item, idx, arr) => {
              const absoluteIndex = projects.findIndex((p) => p.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold block leading-snug", children: item.title }),
                  /* @__PURE__ */ jsxs("span", { className: "text-4xs text-text-muted font-mono", children: [
                    item.duration,
                    " (",
                    item.type || "external",
                    ")"
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 font-semibold text-text-secondary", children: [
                  item.fundingAgency,
                  /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted block font-mono mt-0.5", children: item.amount })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-text-muted", children: [
                  item.pi,
                  item.copi && /* @__PURE__ */ jsxs("span", { className: "block text-4xs text-text-muted mt-0.5", children: [
                    "Co-PI: ",
                    item.copi
                  ] })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: arr.length, onMoveUp: () => handleMoveProject(item.id, "up", arr), onMoveDown: () => handleMoveProject(item.id, "down", arr) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "research-projects",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this project record?")) {
                      const filtered = projects.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("research-projects", filtered);
                      toast.success("Project removed successfully.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "PhD Research Registry" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "research-projects",
              isNew: true,
              data: {
                type: "phd",
                scholar: "",
                guide: "",
                title: "",
                researchArea: "",
                status: "Active",
                publicationCount: 0,
                thumbnail: "",
                documents: [],
                images: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add PhD Scholar"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Scholar / Title" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Research Domain" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Status" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: projects.filter((p) => p.type === "phd").map((item, idx, arr) => {
              const absoluteIndex = projects.findIndex((p) => p.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold block leading-snug", children: item.scholar || item.name }),
                  /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted line-clamp-1 mt-0.5", children: item.title })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-text-secondary", children: item.researchArea }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx("span", { className: "text-5xs font-bold uppercase tracking-wide border px-2 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500 border-emerald-500/20", children: item.status }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: arr.length, onMoveUp: () => handleMoveProject(item.id, "up", arr), onMoveDown: () => handleMoveProject(item.id, "down", arr) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "research-projects",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this PhD record?")) {
                      const filtered = projects.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("research-projects", filtered);
                      toast.success("Scholar record removed.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Student Projects Manager" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "research-projects",
              isNew: true,
              data: {
                type: "student",
                title: "",
                fundingAgency: "",
                amount: "",
                duration: "",
                role: "",
                description: "",
                thumbnail: "",
                documents: [],
                images: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Student Project"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Project Title" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Funding Agency" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 font-mono", children: "Amount" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Supervisor Role" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: projects.filter((p) => p.type === "student").map((item, idx, arr) => {
              const absoluteIndex = projects.findIndex((p) => p.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.title }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary", children: item.fundingAgency }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-text-muted", children: item.amount }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary", children: item.role || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: arr.length, onMoveUp: () => handleMoveProject(item.id, "up", arr), onMoveDown: () => handleMoveProject(item.id, "down", arr) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "research-projects",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this student project record?")) {
                      const filtered = projects.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("research-projects", filtered);
                      toast.success("Student project removed.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Facilities & Laboratory Equipment" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "research-equipment",
              isNew: true,
              data: {
                name: "",
                category: "sensors-comm",
                specs: "",
                purpose: "",
                url: "",
                thumbnail: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Equipment"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Image" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Sub-Category" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: equipment.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.thumbnail), className: "h-8 w-12 rounded object-cover border" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.name }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono font-bold text-teal-500 uppercase text-5xs", children: item.category }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: equipment.length, onMoveUp: () => handleMoveItem("research-equipment", equipment, idx, "up"), onMoveDown: () => handleMoveItem("research-equipment", equipment, idx, "down") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "research-equipment",
                  isNew: false,
                  index: idx,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this equipment record?")) {
                    const filtered = equipment.filter((_, i) => i !== idx);
                    saveDatasetRecords("research-equipment", filtered);
                    toast.success("Equipment removed successfully.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Field Activities & Ocean Deployments" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "research-activities",
              isNew: true,
              data: {
                title: "",
                year: "",
                location: "",
                date: "",
                activityType: "Survey",
                equipmentTags: "",
                team: "",
                description: "",
                thumbnail: "",
                images: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Expedition"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Expedition Title" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Location & Date" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Type" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: fieldActivities.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold leading-snug", children: item.title }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-semibold text-text-secondary block", children: item.location }),
                /* @__PURE__ */ jsxs("span", { className: "text-4xs text-text-muted font-mono block mt-0.5", children: [
                  item.date,
                  " (",
                  item.year,
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono font-bold text-teal-500 uppercase text-5xs", children: item.activityType }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: fieldActivities.length, onMoveUp: () => handleMoveItem("research-activities", fieldActivities, idx, "up"), onMoveDown: () => handleMoveItem("research-activities", fieldActivities, idx, "down") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "research-activities",
                  isNew: false,
                  index: idx,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this expedition record?")) {
                    const filtered = fieldActivities.filter((_, i) => i !== idx);
                    saveDatasetRecords("research-activities", filtered);
                    toast.success("Expedition removed successfully.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] }),
      activeTab === "people" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "People Directory content Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Maintain faculty credentials, CV PDFs, scholar registry cards, project staff details, UG assistant profiles, and internships." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Faculty Members" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "faculty",
              isNew: true,
              data: {
                name: "",
                designation: "",
                department: "Department of ECE",
                institution: "SSNCE",
                specialization: "",
                orcid: "",
                googleScholar: "",
                link: "",
                bio: "",
                imageUrl: "",
                cvId: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Faculty Profile"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Photo" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Faculty Name / Designation" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Specialization" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Professional Identifiers" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: members.filter((m) => m.role === "faculty").map((item, idx) => {
              const absoluteIndex = members.findIndex((m) => m.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.imageUrl || item.thumbnail), className: "h-8 w-8 rounded-full object-cover border" }) }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold block", children: item.name || item.title }),
                  /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted", children: item.designation })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary font-medium", children: item.specialization || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 text-4xs font-mono text-text-muted", children: [
                  item.orcid && /* @__PURE__ */ jsxs("span", { className: "block", children: [
                    "ORCID: ",
                    item.orcid
                  ] }),
                  item.googleScholar && /* @__PURE__ */ jsx("span", { className: "block truncate max-w-[150px]", children: "Scholar Profile Linked" }),
                  item.cvId && /* @__PURE__ */ jsx("span", { className: "block text-teal-500 font-bold", children: "CV PDF Uploaded" })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: members.filter((m) => m.role === "faculty").length, onMoveUp: () => handleMoveMember(item.id, "up", members.filter((m) => m.role === "faculty")), onMoveDown: () => handleMoveMember(item.id, "down", members.filter((m) => m.role === "faculty")) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "faculty",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this faculty profile?")) {
                      const filtered = members.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("people-members", filtered);
                      toast.success("Profile removed successfully.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Research Scholars" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "scholars",
              isNew: true,
              data: {
                name: "",
                mode: "Full Time",
                status: "Active",
                associatedProject: "",
                link: "",
                imageUrl: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Scholar Card"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Photo" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Scholar Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Study Mode" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Status" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Project Affiliation" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: members.filter((m) => m.role === "scholar").map((item, idx, filteredArray) => {
              const absoluteIndex = members.findIndex((m) => m.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.imageUrl || item.thumbnail), className: "h-8 w-8 rounded-full object-cover border" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.name || item.title }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-muted font-semibold", children: item.mode || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono font-bold text-teal-500 uppercase text-5xs", children: item.status || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary font-medium", children: item.associatedProject || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: filteredArray.length, onMoveUp: () => handleMoveMember(item.id, "up", filteredArray), onMoveDown: () => handleMoveMember(item.id, "down", filteredArray) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "scholars",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this scholar profile?")) {
                      const filtered = members.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("people-members", filtered);
                      toast.success("Scholar profile removed.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Project Staff" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "staff",
              isNew: true,
              data: {
                name: "",
                designation: "Project Associate-I",
                associatedProject: "",
                link: "",
                imageUrl: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Staff Profile"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Photo" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Staff Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Designation / Role" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Project Affiliation" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: members.filter((m) => m.role === "staff").map((item, idx, arr) => {
              const absoluteIndex = members.findIndex((m) => m.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.imageUrl || item.thumbnail), className: "h-8 w-8 rounded-full object-cover border" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.name || item.title }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-muted font-semibold", children: item.designation || item.role_in_project || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary font-medium", children: item.associatedProject || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: arr.length, onMoveUp: () => handleMoveMember(item.id, "up", arr), onMoveDown: () => handleMoveMember(item.id, "down", arr) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "staff",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this staff profile?")) {
                      const filtered = members.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("people-members", filtered);
                      toast.success("Staff profile removed.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "PhD Graduates" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "phd-graduates",
              isNew: true,
              data: {
                name: "",
                role: "phd",
                researchArea: "",
                graduationDate: "",
                link: "",
                imageUrl: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add PhD Graduate"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Photo" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Graduate Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Research Domain" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Graduation Date" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: members.filter((m) => m.role === "phd").map((item, idx, arr) => {
              const absoluteIndex = members.findIndex((m) => m.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.imageUrl || item.thumbnail), className: "h-8 w-8 rounded-full object-cover border" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.name || item.title }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary", children: item.researchArea || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-muted font-mono", children: item.graduationDate || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: arr.length, onMoveUp: () => handleMoveMember(item.id, "up", arr), onMoveDown: () => handleMoveMember(item.id, "down", arr) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "phd-graduates",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this PhD graduate?")) {
                      const filtered = members.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("people-members", filtered);
                      toast.success("Profile removed.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Undergraduate Students" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "ug-students",
              isNew: true,
              data: {
                name: "",
                role: "student",
                status: "Current Student",
                imageUrl: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add UG Student"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Photo" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Student Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: members.filter((m) => m.role === "student").map((item, idx, arr) => {
              const absoluteIndex = members.findIndex((m) => m.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.imageUrl || item.thumbnail), className: "h-8 w-8 rounded-full object-cover border" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.name || item.title }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: arr.length, onMoveUp: () => handleMoveMember(item.id, "up", arr), onMoveDown: () => handleMoveMember(item.id, "down", arr) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "ug-students",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this student?")) {
                      const filtered = members.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("people-members", filtered);
                      toast.success("Profile removed.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "UG Alumni" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "ug-alumni",
              isNew: true,
              data: {
                name: "",
                role: "alumni",
                link: "",
                imageUrl: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add UG Alumnus"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Photo" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Alumnus Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: members.filter((m) => m.role === "alumni" && !m.programme).map((item, idx, arr) => {
              const absoluteIndex = members.findIndex((m) => m.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.imageUrl || item.thumbnail), className: "h-8 w-8 rounded-full object-cover border" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.name || item.title }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: arr.length, onMoveUp: () => handleMoveMember(item.id, "up", arr), onMoveDown: () => handleMoveMember(item.id, "down", arr) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "ug-alumni",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this alumnus?")) {
                      const filtered = members.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("people-members", filtered);
                      toast.success("Profile removed.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "PG Alumni" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "pg-alumni",
              isNew: true,
              data: {
                name: "",
                role: "alumni",
                programme: "M.E Applied Electronics",
                link: "",
                imageUrl: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add PG Alumnus"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Photo" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Alumnus Name" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Programme" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: members.filter((m) => m.role === "alumni" && m.programme).map((item, idx, arr) => {
              const absoluteIndex = members.findIndex((m) => m.id === item.id);
              return /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.imageUrl || item.thumbnail), className: "h-8 w-8 rounded-full object-cover border" }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.name || item.title }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary", children: item.programme }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: arr.length, onMoveUp: () => handleMoveMember(item.id, "up", arr), onMoveDown: () => handleMoveMember(item.id, "down", arr) }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "pg-alumni",
                    isNew: false,
                    index: absoluteIndex,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this alumnus?")) {
                      const filtered = members.filter((_, i) => i !== absoluteIndex);
                      saveDatasetRecords("people-members", filtered);
                      toast.success("Profile removed.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, item.id);
            }) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Student Internships Manager" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "people-internships",
              isNew: true,
              data: {
                name: "",
                institution: "",
                topic: "",
                duration: "",
                imageUrl: "",
                cvId: ""
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Intern Record"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Intern Name / Institution" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Duration" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Internship Topic (Hidden in Public Table)" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Certificate PDF" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: internships.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block", children: item.name || item.title }),
                /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted", children: item.institution })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary font-semibold", children: item.duration }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-muted italic", children: item.topic || "—" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold", children: item.cvId ? /* @__PURE__ */ jsx("span", { className: "text-teal-500 font-bold", children: "Uploaded" }) : /* @__PURE__ */ jsx("span", { className: "text-text-muted", children: "None" }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: internships.length, onMoveUp: () => handleMoveItem("people-internships", internships, idx, "up"), onMoveDown: () => handleMoveItem("people-internships", internships, idx, "down") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "people-internships",
                  isNew: false,
                  index: idx,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this intern record?")) {
                    const filtered = internships.filter((_, i) => i !== idx);
                    saveDatasetRecords("people-internships", filtered);
                    toast.success("Internship record removed.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] }),
      activeTab === "collaborations" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Collaborations & Consultancy Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Edit memorandum of understandings (MoUs), partner logos, and industrial consultancy trial logs." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Institutional MoUs & Agreements" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "collaborations-mous",
              isNew: true,
              data: {
                title: "",
                date: "",
                researchFocus: "",
                notes: "",
                thumbnail: "",
                documents: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add MoU"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Organization" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Signing Date" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Research Focus" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: mous.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block", children: item.title || item.name }),
                /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted leading-relaxed max-w-sm block", children: item.notes })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-text-secondary font-mono", children: item.date }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-medium text-text-muted", children: item.researchFocus }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: mous.length, onMoveUp: () => handleMoveItem("collaborations-mous", mous, idx, "up"), onMoveDown: () => handleMoveItem("collaborations-mous", mous, idx, "down") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "collaborations-mous",
                  isNew: false,
                  index: idx,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this MoU record?")) {
                    const filtered = mous.filter((_, i) => i !== idx);
                    saveDatasetRecords("collaborations-mous", filtered);
                    toast.success("MoU agreement removed.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Consultancy Activities & Validation logs" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "collaborations-activities",
              isNew: true,
              data: {
                title: "",
                date: "",
                participants: "",
                purpose: "",
                equipment: "",
                thumbnail: "",
                documents: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Log"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Contracting Institution" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Date Reference" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Experts & Purpose" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: consultancy.map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block", children: item.title || item.name }),
                /* @__PURE__ */ jsxs("span", { className: "text-4xs text-text-muted block mt-0.5", children: [
                  "Gear: ",
                  item.equipment
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-text-secondary font-mono", children: item.date }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-text-muted", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block text-foreground leading-snug", children: item.participants }),
                /* @__PURE__ */ jsx("span", { className: "text-4xs leading-normal block mt-0.5", children: item.purpose })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsx(OrderControls, { index: idx, total: consultancy.length, onMoveUp: () => handleMoveItem("collaborations-activities", consultancy, idx, "up"), onMoveDown: () => handleMoveItem("collaborations-activities", consultancy, idx, "down") }) }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "collaborations-activities",
                  isNew: false,
                  index: idx,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this consultancy activity record?")) {
                    const filtered = consultancy.filter((_, i) => i !== idx);
                    saveDatasetRecords("collaborations-activities", filtered);
                    toast.success("Consultancy record removed.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] }),
      activeTab === "gallery" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Photo Gallery Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Upload image assets, categorize items, and arrange priority layouts on the public gallery grid." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Uploaded Photo Showcase Cards" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "gallery-records",
              isNew: true,
              data: {
                title: "",
                category: "research",
                date: "",
                tags: "",
                description: "",
                thumbnail: "",
                images: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Gallery Photo"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3", children: gallery.map((item, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card overflow-hidden flex flex-col justify-between shadow-xs hover:border-teal-500/25 transition", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "aspect-video bg-muted relative overflow-hidden", children: [
                /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.thumbnail || item.images && item.images[0]), className: "h-full w-full object-cover" }),
                /* @__PURE__ */ jsx("span", { className: "absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-4xs uppercase tracking-wider px-2 py-0.5 rounded font-bold", children: item.category })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-1", children: [
                /* @__PURE__ */ jsx("h4", { className: "font-bold text-xs text-foreground leading-snug", children: item.title }),
                /* @__PURE__ */ jsx("p", { className: "text-4xs text-text-muted leading-relaxed line-clamp-2", children: item.description })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-3 bg-secondary/20 border-t border-border/60 flex items-center justify-between gap-1.5", children: [
              /* @__PURE__ */ jsx(OrderControls, { index: idx, total: gallery.length, onMoveUp: () => handleMoveItem("gallery-records", gallery, idx, "up"), onMoveDown: () => handleMoveItem("gallery-records", gallery, idx, "down") }),
              /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "gallery-records",
                  isNew: false,
                  index: idx,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Delete this gallery image?")) {
                    const filtered = gallery.filter((_, i) => i !== idx);
                    saveDatasetRecords("gallery-records", filtered);
                    toast.success("Gallery record deleted successfully.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] })
            ] })
          ] }, item.id)) })
        ] })
      ] }),
      activeTab === "publications" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Publications registry Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Maintain academic journal papers, book chapters, and conferences in a structured format." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Peer-Reviewed Papers" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "repo-records",
              isNew: true,
              data: {
                type: "publication",
                subtype: "Journal",
                title: "",
                organization: "",
                authors: "",
                doi: "",
                date: "",
                summary: "",
                attachments: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Publication"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Paper Title / Authors" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Venue / Publisher" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 font-mono", children: "Date" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Subtype" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: repoRecords.filter((r) => r.type === "publication").map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block leading-snug", children: item.title }),
                /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted block mt-0.5", children: item.authors }),
                item.doi && /* @__PURE__ */ jsxs("span", { className: "text-4xs text-teal-500 font-mono block mt-1", children: [
                  "DOI: ",
                  item.doi
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-text-secondary", children: item.organization }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-text-muted", children: item.date }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-teal-500 font-bold font-mono text-5xs uppercase", children: item.subtype }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "repo-records",
                  isNew: false,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this publication record?")) {
                    deleteRecord(item.id);
                    toast.success("Publication record removed.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] }),
      activeTab === "awards" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Awards & Honors Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Customize structural honors lists and design beautiful showcase carousel banners with live mockups." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Faculty Showcase Banners" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "award-banner",
              isNew: true,
              data: {
                url: "",
                duration: 5,
                order: 1,
                recipient: "",
                title: "",
                organization: "",
                date: "",
                category: "faculty"
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Faculty Banner"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: (carouselConfig["award"] || []).filter((img) => (img.category || "faculty") === "faculty").map((img) => {
            const parts = (img.caption || "").split("\n");
            const recipient = parts[0] || "—";
            const title = parts[1] || "";
            const organization = parts[2] || "";
            const date = parts[3] || "";
            const originalIdx = (carouselConfig["award"] || []).findIndex((item) => item.id === img.id);
            return /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-border bg-background flex flex-col justify-between gap-4 font-sans text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Live Showcase Card Mockup (faculty)" }),
                /* @__PURE__ */ jsxs("div", { className: "border border-border bg-card p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden group", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-16 w-16 bg-muted rounded overflow-hidden shrink-0 border", children: img.url ? /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(img.url), className: "h-full w-full object-cover", alt: "Live award banner preview" }) : /* @__PURE__ */ jsx("div", { className: "h-full w-full flex items-center justify-center text-4xs text-text-muted bg-secondary", children: "No Image" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 text-xs min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-4xs text-amber-500 font-bold uppercase tracking-wider block", children: "Award Showcase" }),
                    /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground truncate", children: recipient }),
                    /* @__PURE__ */ jsx("p", { className: "text-text-secondary truncate font-medium", children: title }),
                    /* @__PURE__ */ jsxs("p", { className: "text-4xs text-text-muted truncate", children: [
                      organization,
                      " | ",
                      date
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-t border-border/40 pt-3 mt-1.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleMoveAwardCarouselItem(img.id, "up", "faculty"), className: "p-1 rounded bg-secondary/60 border border-border/50 text-foreground", children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleMoveAwardCarouselItem(img.id, "down", "faculty"), className: "p-1 rounded bg-secondary/60 border border-border/50 text-foreground", children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "award-banner",
                    isNew: false,
                    index: originalIdx,
                    data: {
                      ...img,
                      recipient,
                      title,
                      organization,
                      date
                    }
                  }), className: "p-1.5 rounded border border-border hover:bg-secondary text-teal-500", children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this showcase banner?")) {
                      const list = (carouselConfig["award"] || []).filter((item) => item.id !== img.id);
                      const updated = {
                        ...carouselConfig,
                        award: list.map((item, index) => ({
                          ...item,
                          order: index + 1
                        }))
                      };
                      setCarouselConfigState(updated);
                      saveCarouselConfig(updated);
                      toast.success("Banner deleted.");
                    }
                  }, className: "p-1.5 rounded border border-border hover:bg-destructive hover:text-white text-text-muted", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
                ] })
              ] })
            ] }, img.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Student Showcase Banners" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "award-banner",
              isNew: true,
              data: {
                url: "",
                duration: 5,
                order: 1,
                recipient: "",
                title: "",
                organization: "",
                date: "",
                category: "student"
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Student Banner"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2", children: (carouselConfig["award"] || []).filter((img) => img.category === "student").map((img) => {
            const parts = (img.caption || "").split("\n");
            const recipient = parts[0] || "—";
            const title = parts[1] || "";
            const organization = parts[2] || "";
            const date = parts[3] || "";
            const originalIdx = (carouselConfig["award"] || []).findIndex((item) => item.id === img.id);
            return /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-border bg-background flex flex-col justify-between gap-4 font-sans text-xs", children: [
              /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Live Showcase Card Mockup (student)" }),
                /* @__PURE__ */ jsxs("div", { className: "border border-border bg-card p-4 rounded-xl flex items-center gap-4 shadow-sm relative overflow-hidden group", children: [
                  /* @__PURE__ */ jsx("div", { className: "h-16 w-16 bg-muted rounded overflow-hidden shrink-0 border", children: img.url ? /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(img.url), className: "h-full w-full object-cover", alt: "Live award banner preview" }) : /* @__PURE__ */ jsx("div", { className: "h-full w-full flex items-center justify-center text-4xs text-text-muted bg-secondary", children: "No Image" }) }),
                  /* @__PURE__ */ jsxs("div", { className: "space-y-0.5 text-xs min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-4xs text-amber-500 font-bold uppercase tracking-wider block", children: "Award Showcase" }),
                    /* @__PURE__ */ jsx("h4", { className: "font-bold text-foreground truncate", children: recipient }),
                    /* @__PURE__ */ jsx("p", { className: "text-text-secondary truncate font-medium", children: title }),
                    /* @__PURE__ */ jsxs("p", { className: "text-4xs text-text-muted truncate", children: [
                      organization,
                      " | ",
                      date
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-t border-border/40 pt-3 mt-1.5", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1", children: [
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleMoveAwardCarouselItem(img.id, "up", "student"), className: "p-1 rounded bg-secondary/60 border border-border/50 text-foreground", children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsx("button", { type: "button", onClick: () => handleMoveAwardCarouselItem(img.id, "down", "student"), className: "p-1 rounded bg-secondary/60 border border-border/50 text-foreground", children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "award-banner",
                    isNew: false,
                    index: originalIdx,
                    data: {
                      ...img,
                      recipient,
                      title,
                      organization,
                      date
                    }
                  }), className: "p-1.5 rounded border border-border hover:bg-secondary text-teal-500", children: /* @__PURE__ */ jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this showcase banner?")) {
                      const list = (carouselConfig["award"] || []).filter((item) => item.id !== img.id);
                      const updated = {
                        ...carouselConfig,
                        award: list.map((item, index) => ({
                          ...item,
                          order: index + 1
                        }))
                      };
                      setCarouselConfigState(updated);
                      saveCarouselConfig(updated);
                      toast.success("Banner deleted.");
                    }
                  }, className: "p-1.5 rounded border border-border hover:bg-destructive hover:text-white text-text-muted", children: /* @__PURE__ */ jsx(Trash2, { className: "h-3.5 w-3.5" }) })
                ] })
              ] })
            ] }, img.id);
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Honors & Recognition Register" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "repo-records",
              isNew: true,
              data: {
                type: "award",
                title: "",
                organization: "",
                date: "",
                summary: "",
                recipient: "",
                attachments: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Award"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Honor Title" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Awarding Body" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 font-mono", children: "Date" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Recipient" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: repoRecords.filter((r) => r.type === "award").map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold leading-snug", children: item.title }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-text-secondary", children: item.organization }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-text-muted", children: item.date }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-text-secondary", children: item.recipient || "—" }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "repo-records",
                  isNew: false,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this award record?")) {
                    deleteRecord(item.id);
                    toast.success("Award removed successfully.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] }),
      activeTab === "training" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Technical Training Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Administer training sessions, course codes, syllabus documents, and coordinate PDP schedules." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Programme Catalog" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "repo-records",
              isNew: true,
              data: {
                type: "itec",
                title: "",
                organization: "",
                duration: "",
                mode: "Contact",
                code: "",
                date: "",
                summary: "",
                attachments: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Training Course"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Programme Title / Code" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Host / Coordinator" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Duration & Mode" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Course Type" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: repoRecords.filter((r) => ["host", "itec", "itp", "pdp", "coord", "pg"].includes(r.type)).map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block leading-snug", children: item.title }),
                item.code && /* @__PURE__ */ jsxs("span", { className: "text-4xs font-mono text-teal-500 block mt-0.5", children: [
                  "Code: ",
                  item.code
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-text-secondary", children: item.organization }),
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3 text-text-muted", children: [
                item.duration,
                /* @__PURE__ */ jsx("span", { className: "block text-4xs text-text-muted font-mono mt-0.5", children: item.mode })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-teal-500 font-bold font-mono text-5xs uppercase", children: item.type }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "repo-records",
                  isNew: false,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this training record?")) {
                    deleteRecord(item.id);
                    toast.success("Training record removed.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] }),
      activeTab === "activities" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Academic Activities Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Maintain timelines of doctoral committees (DC), keynote talk invitations, workshops, and Board of Studies (BoS) listings." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Academic Registries" }),
            /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
              key: "repo-records",
              isNew: true,
              data: {
                type: "dc",
                title: "",
                organization: "",
                date: "",
                duration: "",
                mode: "",
                place: "",
                subtitle: "",
                summary: "",
                attachments: []
              }
            }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
              /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
              " Add Activity"
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Activity Details" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Organization / University" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 font-mono", children: "Date" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Type" }),
              /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: repoRecords.filter((r) => ["dc", "talk", "workshop", "bos"].includes(r.type)).map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
              /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold block leading-snug", children: item.title }),
                item.subtitle && /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted block mt-0.5", children: item.subtitle })
              ] }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-semibold text-text-secondary", children: item.organization }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-text-muted", children: item.date }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-teal-500 font-bold font-mono text-5xs uppercase", children: item.type }),
              /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                  key: "repo-records",
                  isNew: false,
                  data: item
                }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                /* @__PURE__ */ jsx("button", { onClick: () => {
                  if (confirm("Remove this academic activity?")) {
                    deleteRecord(item.id);
                    toast.success("Activity removed successfully.");
                  }
                }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
              ] }) })
            ] }, item.id)) })
          ] }) })
        ] })
      ] }),
      activeTab === "contact" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Contact details content Manager" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Edit office phone numbers, email addresses, working timings, map locations, and direct coordinators list." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-6 grid-cols-1 lg:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2", children: "Office General Info" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Office Contact Email" }),
                /* @__PURE__ */ jsx("input", { type: "email", value: settings.contactEmail || "", onChange: (e) => saveSettings({
                  ...settings,
                  contactEmail: e.target.value
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Office Telephone Phone" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: settings.contactPhone || "", onChange: (e) => saveSettings({
                  ...settings,
                  contactPhone: e.target.value
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Working / Office Hours" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: settings.workingHours || "", onChange: (e) => saveSettings({
                  ...settings,
                  workingHours: e.target.value
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Postal Address" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: settings.address || "", onChange: (val) => saveSettings({
                  ...settings,
                  address: val
                }), maxLength: 300 })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2", children: "Maps & Coordinates Settings" }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Google Maps Embed iframe URL" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: settings.googleMapsEmbedUrl || "", onChange: (e) => saveSettings({
                  ...settings,
                  googleMapsEmbedUrl: e.target.value
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Open in Google Maps Direct URL" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: settings.googleMapsUrl || "", onChange: (e) => saveSettings({
                  ...settings,
                  googleMapsUrl: e.target.value
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Latitude" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: settings.latitude || "", onChange: (e) => saveSettings({
                    ...settings,
                    latitude: e.target.value
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Longitude" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: settings.longitude || "", onChange: (e) => saveSettings({
                    ...settings,
                    longitude: e.target.value
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4 lg:col-span-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center border-b border-border/40 pb-2", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase", children: "Laboratory Coordinators & Key Contacts" }),
              /* @__PURE__ */ jsxs("button", { onClick: () => setEditingItem({
                key: "keyContacts",
                isNew: true,
                data: {
                  name: "",
                  designation: "",
                  email: "",
                  phone: "",
                  imageUrl: ""
                }
              }), className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 text-4xs font-bold uppercase tracking-wider font-sans", children: [
                /* @__PURE__ */ jsx(Plus, { className: "h-3.5 w-3.5" }),
                " Add Key Contact"
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs text-left", children: [
              /* @__PURE__ */ jsx("thead", { className: "bg-secondary/40 text-[10px] font-bold uppercase tracking-wider text-text-muted font-mono border-b border-border", children: /* @__PURE__ */ jsxs("tr", { children: [
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Photo" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Coordinator Name / Designation" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2", children: "Email" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-28 text-center", children: "Reorder" }),
                /* @__PURE__ */ jsx("th", { className: "px-4 py-2 w-20 text-right", children: "Actions" })
              ] }) }),
              /* @__PURE__ */ jsx("tbody", { className: "divide-y divide-border", children: (settings.keyContacts || []).map((item, idx) => /* @__PURE__ */ jsxs("tr", { className: "hover:bg-secondary/10", children: [
                /* @__PURE__ */ jsx("td", { className: "px-4 py-2 w-14", children: /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(item.imageUrl), className: "h-8 w-8 rounded-full object-cover border" }) }),
                /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
                  /* @__PURE__ */ jsx("span", { className: "font-bold block", children: item.name }),
                  /* @__PURE__ */ jsx("span", { className: "text-4xs text-text-muted", children: item.designation })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 font-mono text-text-secondary", children: item.email || "—" }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-center", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1 justify-center", children: [
                  /* @__PURE__ */ jsx("button", { type: "button", disabled: idx === 0, onClick: () => {
                    const list = [...settings.keyContacts || []];
                    const temp = list[idx];
                    list[idx] = list[idx - 1];
                    list[idx - 1] = temp;
                    saveSettings({
                      ...settings,
                      keyContacts: list.map((item2, index) => ({
                        ...item2,
                        displayOrder: index + 1
                      }))
                    });
                  }, className: "p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50", children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-3.5 w-3.5" }) }),
                  /* @__PURE__ */ jsx("button", { type: "button", disabled: idx === (settings.keyContacts || []).length - 1, onClick: () => {
                    const list = [...settings.keyContacts || []];
                    const temp = list[idx];
                    list[idx] = list[idx + 1];
                    list[idx + 1] = temp;
                    saveSettings({
                      ...settings,
                      keyContacts: list.map((item2, index) => ({
                        ...item2,
                        displayOrder: index + 1
                      }))
                    });
                  }, className: "p-1 rounded bg-secondary/60 disabled:opacity-30 border border-border/50", children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-3.5 w-3.5" }) })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "flex gap-1.5 justify-end", children: [
                  /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem({
                    key: "keyContacts",
                    isNew: false,
                    index: idx,
                    data: item
                  }), className: "p-1 rounded text-teal-500 hover:bg-teal-500/10", children: /* @__PURE__ */ jsx(Pencil, { className: "h-4 w-4" }) }),
                  /* @__PURE__ */ jsx("button", { onClick: () => {
                    if (confirm("Remove this coordinator card?")) {
                      const filtered = (settings.keyContacts || []).filter((_, i) => i !== idx);
                      saveSettings({
                        ...settings,
                        keyContacts: filtered
                      });
                      toast.success("Coordinator card removed successfully.");
                    }
                  }, className: "p-1 rounded text-text-muted hover:text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
                ] }) })
              ] }, idx)) })
            ] }) })
          ] })
        ] })
      ] }),
      activeTab === "backup" && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "text-xl font-black tracking-tight text-foreground uppercase", children: "Settings & Global Website Backup" }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary mt-1", children: "Maintain system health, export current datasets, restore configurations, or reset variables back to default seed data." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx(Award, { className: "h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-text-secondary space-y-1", children: [
            /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground block uppercase font-mono tracking-wider", children: "Accidental Deletion Protection active" }),
            /* @__PURE__ */ jsx("p", { children: "Export a local backup before making extensive database additions. If you make a mistake, importing a previously exported JSON backup restores the full site structure." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-6 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2", children: "Website Backup Control Panel" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-3 pt-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-secondary/20 border border-border flex flex-col justify-between gap-3 text-center", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground block text-xs", children: "Export Website Data" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-text-muted mt-1 leading-relaxed", children: "Download a single JSON file containing all settings, custom assets, profiles, and record databases." })
              ] }),
              /* @__PURE__ */ jsxs("button", { onClick: () => {
                const data = exportSiteBackup();
                const blob = new Blob([data], {
                  type: "application/json"
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `uwarl_website_backup_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
                a.click();
                toast.success("JSON backup file exported and downloaded successfully!");
              }, className: "w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-teal-500 text-teal-950 text-3xs font-bold uppercase tracking-wider transition cursor-pointer select-none", children: [
                /* @__PURE__ */ jsx(Download, { className: "h-3.5 w-3.5" }),
                " Export Backup"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-secondary/20 border border-border flex flex-col justify-between gap-3 text-center", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground block text-xs", children: "Import Website Data" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-text-muted mt-1 leading-relaxed", children: "Upload a previously exported JSON backup to completely restore settings and all records." })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-3xs font-bold uppercase tracking-wider transition cursor-pointer select-none", children: [
                /* @__PURE__ */ jsx(Upload, { className: "h-3.5 w-3.5 text-teal-500" }),
                " Upload Backup JSON",
                /* @__PURE__ */ jsx("input", { type: "file", className: "hidden", accept: "application/json", onChange: handleImportFileChange })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "p-4 rounded-lg bg-secondary/20 border border-border flex flex-col justify-between gap-3 text-center", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground block text-xs", children: "Reset to Default Data" }),
                /* @__PURE__ */ jsx("p", { className: "text-[10px] text-text-muted mt-1 leading-relaxed", children: "Clear all custom edits and reset the site back to the original static seed records." })
              ] }),
              /* @__PURE__ */ jsxs("button", { onClick: () => {
                if (confirm("WARNING: This will wipe ALL your edits, custom images, uploaded PDFs, and settings! Are you sure you want to reset to defaults?")) {
                  resetSiteToDefaults();
                }
              }, className: "w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-destructive hover:bg-destructive/90 text-white text-3xs font-bold uppercase tracking-wider transition cursor-pointer select-none", children: [
                /* @__PURE__ */ jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                " Reset Site"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5 rounded-xl border border-border bg-card space-y-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-extrabold text-xs text-foreground uppercase border-b border-border/40 pb-2", children: "Global Metadata & Footer Settings" }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Public Website Brand Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.siteName || "", onChange: (e) => saveSettings({
                ...settings,
                siteName: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Public Header tag Description" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.siteDescription || "", onChange: (e) => saveSettings({
                ...settings,
                siteDescription: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Footer Content / Copyright" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: settings.footerContent || "", onChange: (e) => saveSettings({
                ...settings,
                footerContent: e.target.value
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] })
          ] })
        ] })
      ] }),
      editingItem && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto backdrop-blur-xs font-sans", onClick: () => setEditingItem(null), children: /* @__PURE__ */ jsxs("div", { className: "my-8 w-full max-w-2xl rounded-xl border border-border bg-background shadow-2xl overflow-hidden text-foreground", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-b border-border px-5 py-3 shrink-0", children: [
          /* @__PURE__ */ jsxs("h2", { className: "text-xs font-black text-foreground uppercase tracking-widest", children: [
            editingItem.isNew ? "Add New" : "Edit",
            " Record"
          ] }),
          /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem(null), className: "p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "px-5 py-4 max-h-[65vh] overflow-y-auto space-y-4", children: [
          editingItem.key === "home-research-focus" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Focus Area Title" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  title: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Lucide Icon Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.icon || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  icon: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. Compass, Bot, Cpu, Globe" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Focus Description" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.description || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  description: val
                }
              }), maxLength: 180 })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Focus Tags (Comma Separated)" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: Array.isArray(editingItem.data.tags) ? editingItem.data.tags.join(", ") : editingItem.data.tags || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  tags: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. Sonar, MIMO, Telemetry" })
            ] })
          ] }),
          editingItem.key === "homepageStats" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Counter Title Label" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.label || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  label: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Counter Numeric Value" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.value || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  value: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 169, 15+, 26" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Lucide Icon Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.icon || "FileText", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  icon: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Details description" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.description || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  description: val
                }
              }), maxLength: 120 })
            ] })
          ] }),
          editingItem.key === "home-highlights" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Highlight Title" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  title: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Visual Tag Category" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.tag || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  tag: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. ROV Platform, Acoustic Testing" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Scope Description" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.description || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  description: val
                }
              }), maxLength: 220 })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Specification 1 Label" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.specs?.[0]?.label || "", onChange: (e) => {
                  const currentSpecs = [...editingItem.data.specs || []];
                  if (!currentSpecs[0]) currentSpecs[0] = {
                    label: "",
                    value: ""
                  };
                  currentSpecs[0].label = e.target.value;
                  setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      specs: currentSpecs
                    }
                  });
                }, className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. Capacity" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Specification 1 Value" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.specs?.[0]?.value || "", onChange: (e) => {
                  const currentSpecs = [...editingItem.data.specs || []];
                  if (!currentSpecs[0]) currentSpecs[0] = {
                    label: "",
                    value: ""
                  };
                  currentSpecs[0].value = e.target.value;
                  setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      specs: currentSpecs
                    }
                  });
                }, className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold", placeholder: "e.g. 10,874 Litres" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Specification 2 Label" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.specs?.[1]?.label || "", onChange: (e) => {
                  const currentSpecs = [...editingItem.data.specs || []];
                  if (!currentSpecs[1]) currentSpecs[1] = {
                    label: "",
                    value: ""
                  };
                  currentSpecs[1].label = e.target.value;
                  setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      specs: currentSpecs
                    }
                  });
                }, className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. Equipment" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Specification 2 Value" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.specs?.[1]?.value || "", onChange: (e) => {
                  const currentSpecs = [...editingItem.data.specs || []];
                  if (!currentSpecs[1]) currentSpecs[1] = {
                    label: "",
                    value: ""
                  };
                  currentSpecs[1].value = e.target.value;
                  setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      specs: currentSpecs
                    }
                  });
                }, className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold", placeholder: "e.g. Modular Thrusters" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Highlight Banner Image", value: editingItem.data.image || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                image: val
              }
            }), category: "highlights" })
          ] }),
          editingItem.key === "keyContacts" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Coordinator Full Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.name || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  name: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Designation / Role" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.designation || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  designation: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Direct Email" }),
              /* @__PURE__ */ jsx("input", { type: "email", value: editingItem.data.email || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  email: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Office Phone Extension" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.phone || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  phone: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Coordinator profile Picture", value: editingItem.data.imageUrl || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                imageUrl: val
              }
            }), category: "contacts" })
          ] }),
          editingItem.key === "research-projects" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Project Title" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  title: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Sponsoring Agency" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.fundingAgency || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    fundingAgency: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Sponsorship Amount" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.amount || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    amount: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Duration Term" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    duration: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Principal Investigator" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.pi || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    pi: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Detailed Project Scope" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.description || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  description: val
                }
              }), maxLength: 500 })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Project Thumbnail Image", value: editingItem.data.thumbnail || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                thumbnail: val
              }
            }), category: "projects" }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Attach Research Report PDF", value: Array.isArray(editingItem.data.documents) ? editingItem.data.documents[0] || "" : editingItem.data.documents || "", type: "document", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                documents: val ? [val] : []
              }
            }), category: "reports" })
          ] }),
          editingItem.key === "research-equipment" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Equipment Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.name || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  name: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Sub-Category Tab" }),
              /* @__PURE__ */ jsxs("select", { value: editingItem.data.category || "sensors-comm", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  category: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", children: [
                /* @__PURE__ */ jsx("option", { value: "underwater-platforms", children: "Underwater Platforms & ROVs" }),
                /* @__PURE__ */ jsx("option", { value: "acoustic-systems", children: "Acoustic Transceivers & Telemetry" }),
                /* @__PURE__ */ jsx("option", { value: "test-facilities", children: "Calibration Basin & Hydrophones" }),
                /* @__PURE__ */ jsx("option", { value: "sensors-comm", children: "Sensors & Communication Arrays" }),
                /* @__PURE__ */ jsx("option", { value: "field-equipment", children: "Oceanographic Field Support" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Equipment Research Purpose" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.purpose || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  purpose: val
                }
              }), maxLength: 250 })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Technical Specs / Details (JSON Array format)" }),
              /* @__PURE__ */ jsx("textarea", { value: editingItem.data.specs || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  specs: e.target.value
                }
              }), placeholder: '[{"label":"Weight","value":"15kg"},{"label":"Depth Rating","value":"50m"}]', rows: 3, className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Equipment Calibration Photo", value: editingItem.data.thumbnail || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                thumbnail: val
              }
            }), category: "equipment" })
          ] }),
          editingItem.key === "faculty" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 font-sans text-xs", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Faculty Full Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.name || editingItem.data.title || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  name: e.target.value,
                  title: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Academic Designation" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.designation || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    designation: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Affiliated Institution" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.institution || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    institution: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Department" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.department || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    department: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. Department of ECE" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Qualification" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.qualification || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    qualification: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. Ph.D., M.E." })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Specialization / Core domain" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.specialization || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    specialization: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g., Underwater Acoustics / Deep Learning" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Research Area" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.researchArea || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    researchArea: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g., Under Water Acoustics" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1 sm:col-span-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Research Interests (Comma Separated)" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.researchInterests || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    researchInterests: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g., Ambient Noise, Sonar Telemetry" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Faculty Email" }),
                /* @__PURE__ */ jsx("input", { type: "email", value: editingItem.data.email || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    email: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Faculty Phone" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.phone || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    phone: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "ORCID Identifier Code" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.orcid || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    orcid: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 0000-0002-1825-0097" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Google Scholar Link" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.googleScholar || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    googleScholar: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Official Profile Link" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.link || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    link: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Brief Biography" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.bio || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  bio: val
                }
              }), maxLength: 500 })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Faculty Photo Image", value: editingItem.data.imageUrl || editingItem.data.thumbnail || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                imageUrl: val,
                thumbnail: val
              }
            }), category: "faculty" }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Curriculum Vitae (CV) PDF Document", value: editingItem.data.cvId || "", type: "document", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                cvId: val
              }
            }), category: "cv" })
          ] }),
          editingItem.key === "scholars" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Scholar Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.name || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  name: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Mode of Study" }),
                /* @__PURE__ */ jsxs("select", { value: editingItem.data.mode || "Full Time", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    mode: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none", children: [
                  /* @__PURE__ */ jsx("option", { value: "Full Time", children: "Full Time" }),
                  /* @__PURE__ */ jsx("option", { value: "Part Time", children: "Part Time" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Current Status" }),
                /* @__PURE__ */ jsxs("select", { value: editingItem.data.status || "Active", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    status: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none", children: [
                  /* @__PURE__ */ jsx("option", { value: "Active", children: "Active / Coursework Ongoing" }),
                  /* @__PURE__ */ jsx("option", { value: "Coursework Completed", children: "Coursework Completed" }),
                  /* @__PURE__ */ jsx("option", { value: "Thesis Submitted", children: "Thesis Submitted" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Associated Project" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.associatedProject || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  associatedProject: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "ResearchGate / Personal Profile Link" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.link || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  link: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Scholar Profile Picture", value: editingItem.data.imageUrl || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                imageUrl: val
              }
            }), category: "scholars" })
          ] }),
          editingItem.key === "staff" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Staff Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.name || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  name: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Designation / Role" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.designation || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  designation: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. Project Associate-I" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Consortium Project Affiliation" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.associatedProject || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  associatedProject: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Staff Profile Picture", value: editingItem.data.imageUrl || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                imageUrl: val
              }
            }), category: "staff" })
          ] }),
          editingItem.key === "people-internships" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Intern Name" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.name || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  name: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Sponsoring Institution" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.institution || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    institution: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Deployment Duration" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    duration: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. June - July 2024" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Internship Project Topic" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.topic || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  topic: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Intern Photograph", value: editingItem.data.imageUrl || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                imageUrl: val
              }
            }), category: "internships" }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Certificate PDF (Stored separately from records)", value: editingItem.data.cvId || "", type: "document", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                cvId: val
              }
            }), category: "certificates" })
          ] }),
          editingItem.key === "award-banner" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Carousel Banner Editor" }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Recipient Name" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.recipient || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    recipient: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Award / Honor Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Awarding Body / Organization" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    organization: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Year / Period" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    date: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 2023–2024" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Category Group" }),
                /* @__PURE__ */ jsxs("select", { value: editingItem.data.category || "faculty", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    category: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", children: [
                  /* @__PURE__ */ jsx("option", { value: "faculty", children: "Faculty Award Carousel" }),
                  /* @__PURE__ */ jsx("option", { value: "student", children: "Student Award Carousel" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Slide Duration (seconds)" }),
                /* @__PURE__ */ jsx("input", { type: "number", value: editingItem.data.duration || 5, onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    duration: Number(e.target.value)
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Banner Photograph", value: editingItem.data.url || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                url: val
              }
            }), category: "awards" })
          ] }),
          editingItem.key === "repo-records" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 font-sans text-xs", children: [
            editingItem.data.type === "publication" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Publication Record" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Publication Subtype" }),
                /* @__PURE__ */ jsxs("select", { value: editingItem.data.subtype || "Journal", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    subtype: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", children: [
                  /* @__PURE__ */ jsx("option", { value: "Journal", children: "Journal" }),
                  /* @__PURE__ */ jsx("option", { value: "Conference", children: "Conference" }),
                  /* @__PURE__ */ jsx("option", { value: "Book", children: "Book" }),
                  /* @__PURE__ */ jsx("option", { value: "Book Chapter", children: "Book Chapter" }),
                  /* @__PURE__ */ jsx("option", { value: "Patent", children: "Patent" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Publication Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Author List" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.authors || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    authors: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. A. Sen, B. Mitra" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Journal / Venue / Publisher" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "DOI Reference URL/Code" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.doi || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      doi: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1 sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Publication Date" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "YYYY-MM-DD or YYYY" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Abstract / Summary" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 800 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "PDF Reprints / Associated Documents", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "publications" })
            ] }),
            editingItem.data.type === "award" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Award Record" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Award / Honor Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Recipient Name" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.recipient || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      recipient: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Awarding Body / Organization" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1 sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Date / Period Received" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 2024-05-12 or 2024" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Award Citation / Summary" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 500 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Certificate PDFs / Proof of Honors", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "awards" })
            ] }),
            editingItem.data.type === "host" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Host Programme Engagement" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Program Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Sponsoring Institution" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Duration (e.g. 5 Days, 1 Week)" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      duration: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Venue / Place" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.place || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      place: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Participants Count" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.code || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      code: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1 sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Dates / Period" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 2024" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Description / Topic Scope" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 500 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Program Brochure (PDF)", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "brochures" }),
              /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "Gallery / Showcase Photos", values: editingItem.data.images || [], type: "image", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  images: val
                }
              }), category: "host" })
            ] }),
            editingItem.data.type === "itec" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "ITEC Programme Record" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "ITEC Program Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Delegates Country" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.place || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      place: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Duration" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      duration: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Participants Count" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.code || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      code: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Dates" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 2024" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Program Description" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 600 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Program PDF Brochure", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "itec" }),
              /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "ITEC Program Gallery / Photos", values: editingItem.data.images || [], type: "image", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  images: val
                }
              }), category: "itec" })
            ] }),
            editingItem.data.type === "itp" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "ITP Programme Record" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Programme Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Country / Venue" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.place || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      place: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Duration" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      duration: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1 sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Dates" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Program Description" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 500 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Program PDF Brochure", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "itp" }),
              /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "ITP Gallery Images", values: editingItem.data.images || [], type: "image", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  images: val
                }
              }), category: "itp" })
            ] }),
            editingItem.data.type === "pdp" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "PDP as Resource Person" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Programme Name" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Organizing Institution" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Topic Name" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.subtitle || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      subtitle: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Duration" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      duration: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Role" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.role || "Resource Person", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      role: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Mode (e.g. Online, Contact)" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.mode || "Contact", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      mode: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Date" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Certificate / Reference PDF", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "pdp" })
            ] }),
            editingItem.data.type === "coord" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "PDP as Coordinator" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Programme Name" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Organizing Institution" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Duration" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      duration: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Coordinator Role" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.role || "Coordinator", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      role: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Date" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Program Report / Brochure PDF", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "coord" })
            ] }),
            editingItem.data.type === "pg" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "PG Course Record" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Subject Name" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Subject Code" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.code || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      code: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Department / Programme" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Semester Term" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      duration: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Number of Students" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.mode || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      mode: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1 sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Academic Year" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 2024" })
                ] })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Syllabus / Curriculum PDF Documents", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "pg-syllabus" })
            ] }),
            editingItem.data.type === "dc" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Doctoral Committee (PhD Supervision)" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Scholar Name" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Research Guide Name" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.subtitle || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      subtitle: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Affiliated University / Institution" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1 sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Date / Year" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Scholar Progress Summary" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 500 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Minutes / Thesis Synopsis (PDFs)", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "dc-minutes" })
            ] }),
            editingItem.data.type === "talk" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Invited Talk Record" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Title of the Talk" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Speaker Name" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.recipient || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      recipient: e.target.value,
                      subtitle: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Host Institution / Venue" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Place / Location" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.place || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      place: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Date" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Talk Abstract" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 600 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Speaker Certificate PDF", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "talks" }),
              /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "Lecture Photos / Gallery", values: editingItem.data.images || [], type: "image", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  images: val
                }
              }), category: "talks" })
            ] }),
            editingItem.data.type === "workshop" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Workshop / Seminar Record" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Workshop Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Host / Organizing Body" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Duration" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.duration || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      duration: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Participants Count" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.code || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      code: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Date" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Abstract / Summary Scope" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 500 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Program Brochure (PDF)", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "workshops" }),
              /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "Workshop Photos / Gallery", values: editingItem.data.images || [], type: "image", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  images: val
                }
              }), category: "workshops" })
            ] }),
            editingItem.data.type === "bos" && /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Board of Studies Membership" }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Role & Academic Body Title" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    title: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "University / Institution" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.organization || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      organization: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Department / Panel" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.subtitle || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      subtitle: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "block space-y-1 sm:col-span-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Date / Tenure Period" }),
                  /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      date: e.target.value
                    }
                  }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Details Summary" }),
                /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.summary || "", onChange: (val) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    summary: val
                  }
                }), maxLength: 400 })
              ] }),
              /* @__PURE__ */ jsx(AttachmentsManager, { label: "Governance Documents / Reference PDFs", attachments: editingItem.data.attachments || [], onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  attachments: val
                }
              }), category: "bos" })
            ] })
          ] }),
          editingItem.key === "gallery-records" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 font-sans text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Photo Gallery Record" }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Gallery Item Title" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  title: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Category Tab" }),
                /* @__PURE__ */ jsxs("select", { value: editingItem.data.category || "research", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    category: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", children: [
                  /* @__PURE__ */ jsx("option", { value: "research", children: "Research Projects & Surveys" }),
                  /* @__PURE__ */ jsx("option", { value: "field", children: "Field Activities & Deployments" }),
                  /* @__PURE__ */ jsx("option", { value: "facilities", children: "Laboratory Infrastructure" }),
                  /* @__PURE__ */ jsx("option", { value: "events", children: "Workshops & Guest Lectures" }),
                  /* @__PURE__ */ jsx("option", { value: "internships", children: "Academic Internships" })
                ] })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Event Date" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    date: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 2024-05-12" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Detailed Description" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.description || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  description: val
                }
              }), maxLength: 500 })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2 select-none cursor-pointer", children: [
              /* @__PURE__ */ jsx("input", { type: "checkbox", checked: !!editingItem.data.featured, onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  featured: e.target.checked
                }
              }), className: "rounded border-border bg-background text-teal-500 focus:ring-teal-500" }),
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-secondary uppercase", children: "Featured on Homepage Grid" })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Cover Image (Thumbnail)", value: editingItem.data.thumbnail || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                thumbnail: val
              }
            }), category: "gallery" }),
            /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "Gallery Showcase Images", values: editingItem.data.images || [], type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                images: val
              }
            }), category: "gallery" }),
            /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "Associated PDF Reports / Documents", values: editingItem.data.documents || [], type: "document", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                documents: val
              }
            }), category: "gallery" })
          ] }),
          editingItem.key === "home-quick-access" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 font-sans text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Quick Access Navigation Card" }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Card Label" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.label || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  label: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Destination Route Link" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.to || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  to: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. /research or /publications" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Lucide Icon Name" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.icon || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    icon: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. BookOpen, FolderGit2, Map" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Theme Color" }),
                /* @__PURE__ */ jsxs("select", { value: editingItem.data.color || "teal", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    color: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", children: [
                  /* @__PURE__ */ jsx("option", { value: "sky", children: "Sky Blue" }),
                  /* @__PURE__ */ jsx("option", { value: "indigo", children: "Indigo Purple" }),
                  /* @__PURE__ */ jsx("option", { value: "teal", children: "Teal Green" }),
                  /* @__PURE__ */ jsx("option", { value: "emerald", children: "Emerald Green" }),
                  /* @__PURE__ */ jsx("option", { value: "amber", children: "Amber Gold" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Card Brief Description" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.description || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  description: val
                }
              }), maxLength: 150 })
            ] })
          ] }),
          editingItem.key === "research-activities" && /* @__PURE__ */ jsxs("div", { className: "space-y-4 font-sans text-xs", children: [
            /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-teal-500 uppercase tracking-widest block font-mono", children: "Field Activity / Timeline Record" }),
            /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Activity Title" }),
              /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.title || "", onChange: (e) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  title: e.target.value
                }
              }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-semibold" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Location" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.location || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    location: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500", placeholder: "e.g. Bay of Bengal" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Coordinates" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.coordinates || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    coordinates: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono", placeholder: "e.g. 13.0827 N, 80.2707 E" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Team Members" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.team || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    team: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Equipment Used" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.equipmentTags || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    equipmentTags: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Activity Date" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.date || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    date: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: "block space-y-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase", children: "Year" }),
                /* @__PURE__ */ jsx("input", { type: "text", value: editingItem.data.year || "", onChange: (e) => setEditingItem({
                  ...editingItem,
                  data: {
                    ...editingItem.data,
                    year: e.target.value
                  }
                }), className: "w-full rounded-lg border border-border bg-background px-3 py-1.75 text-xs outline-none focus:border-teal-500 font-mono" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { className: "text-[10px] font-bold text-text-muted uppercase block mb-1", children: "Scope Description" }),
              /* @__PURE__ */ jsx(ResizingTextarea, { value: editingItem.data.description || "", onChange: (val) => setEditingItem({
                ...editingItem,
                data: {
                  ...editingItem.data,
                  description: val
                }
              }), maxLength: 600 })
            ] }),
            /* @__PURE__ */ jsx(AssetUploadInput, { label: "Cover Photograph", value: editingItem.data.thumbnail || "", type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                thumbnail: val
              }
            }), category: "field-activities" }),
            /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "Gallery / Deployment Photos", values: editingItem.data.images || [], type: "image", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                images: val
              }
            }), category: "field-activities" }),
            /* @__PURE__ */ jsx(MultiAssetUploadInput, { label: "Associated PDF Reports / Documents", values: editingItem.data.documents || [], type: "document", onChange: (val) => setEditingItem({
              ...editingItem,
              data: {
                ...editingItem.data,
                documents: val
              }
            }), category: "field-activities" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 border-t border-border bg-secondary/40 px-5 py-3 text-2xs font-bold uppercase tracking-widest shrink-0", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setEditingItem(null), className: "px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition select-none cursor-pointer", children: "Cancel" }),
          /* @__PURE__ */ jsx("button", { onClick: () => {
            const {
              key,
              isNew,
              index,
              data
            } = editingItem;
            if (key === "homepageStats" || key === "keyContacts") {
              const list = [...settings[key] || []];
              if (isNew) {
                list.push({
                  ...data,
                  displayOrder: list.length + 1
                });
              } else if (index !== void 0) {
                list[index] = data;
              }
              saveSettings({
                ...settings,
                [key]: list
              });
              toast.success("Settings list updated successfully.");
            } else if (key === "home-research-focus" || key === "home-highlights" || key === "home-quick-access" || key === "research-projects" || key === "research-equipment" || key === "research-activities" || key === "people-internships" || key === "collaborations-mous" || key === "collaborations-institutions" || key === "collaborations-activities" || key === "gallery-records") {
              const dataset = getDatasetRecords(key, DATA_SEEDS[key] || []);
              if (isNew) {
                const newId = `${key.slice(0, 3)}-${Date.now()}`;
                dataset.push({
                  ...data,
                  id: newId,
                  displayOrder: dataset.length + 1
                });
              } else if (index !== void 0) {
                dataset[index] = data;
              }
              saveDatasetRecords(key, dataset);
              toast.success("Dataset records saved successfully.");
            } else if (key === "faculty" || key === "scholars" || key === "staff" || key === "phd-graduates" || key === "ug-students" || key === "ug-alumni" || key === "pg-alumni") {
              const dataset = [...members];
              const roleMap = {
                faculty: "faculty",
                scholars: "scholar",
                staff: "staff",
                "phd-graduates": "phd",
                "ug-students": "student",
                "ug-alumni": "alumni",
                "pg-alumni": "alumni"
              };
              const formatted = {
                ...data,
                role: roleMap[key] || data.role
              };
              if (isNew) {
                const newId = `peop-${Date.now()}`;
                dataset.push({
                  ...formatted,
                  id: newId,
                  displayOrder: dataset.length + 1
                });
              } else if (index !== void 0) {
                dataset[index] = formatted;
              }
              saveDatasetRecords("people-members", dataset);
              toast.success("Member profile saved successfully.");
            } else if (key === "award-banner") {
              const caption = `${data.recipient}
${data.title}
${data.organization}
${data.date}`;
              const list = [...carouselConfig["award"] || []];
              const slideItem = {
                id: data.id || `award-${Date.now()}`,
                url: data.url,
                duration: data.duration,
                order: data.order,
                caption,
                category: data.category
              };
              if (isNew) {
                list.push({
                  ...slideItem,
                  order: list.length + 1
                });
              } else if (index !== void 0) {
                list[index] = slideItem;
              }
              const updated = {
                ...carouselConfig,
                award: list
              };
              setCarouselConfigState(updated);
              saveCarouselConfig(updated);
              toast.success("Award showcase banner configuration saved.");
            } else if (key === "repo-records") {
              if (isNew) {
                createRecord(data);
                toast.success("Record created successfully.");
              } else {
                updateRecord(data.id, data);
                toast.success("Record updated successfully.");
              }
            }
            setEditingItem(null);
          }, className: "px-4 py-2.5 rounded-lg bg-teal-500 text-teal-950 hover:bg-teal-600 transition select-none cursor-pointer", children: "Save Changes" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  Admin as component
};
