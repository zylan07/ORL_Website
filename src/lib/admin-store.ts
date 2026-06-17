import { useSyncExternalStore } from "react";
import { supabase } from "./supabase";

// ----------------- GENERIC ENTITY INTERFACE -----------------
export interface GenericEntity {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  images?: string[];
  documents?: string[];
  featured?: boolean;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // entity-specific custom fields
}

// ----------------- MEDIA LIBRARY FILE SCHEMA -----------------
export interface MediaFile {
  id: string;
  title: string;
  category: "image" | "document" | "other";
  thumbnail: string; // Base64 URL or image path
  images?: string[];
  documents?: string[];
  uploadedAt: string;
  displayOrder: number;
  featured: boolean;
}

export interface KeyContactSetting {
  name: string;
  designation: string;
  email?: string;
  phone?: string;
  imageUrl?: string;
  displayOrder?: number;
}

export interface PeopleStatSetting {
  label: string;
  count: string;
  icon: string;
  desc: string;
  displayOrder?: number;
}

// ----------------- LIGHTWEIGHT SETTINGS SCHEMA -----------------
export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  workingHours: string;
  footerContent: string;
  homepageStats: { label: string; value: string; description?: string; icon?: string; displayOrder?: number }[];
  keyContacts?: KeyContactSetting[];
  peopleStats?: PeopleStatSetting[];
  
  // Hero section additions
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroBgImage?: string; // asset ID or URL
  heroPrimaryBtnText?: string;
  heroPrimaryBtnLink?: string;
  heroSecondaryBtnText?: string;
  heroSecondaryBtnLink?: string;

  // Contact maps management
  googleMapsEmbedUrl?: string;
  googleMapsUrl?: string;
  latitude?: string;
  longitude?: string;
  address?: string;
}

// Checking browser context
const isBrowser = typeof window !== "undefined";

// ----------------- LOCAL STORAGE HELPERS -----------------
const datasetCaches = new Map<string, any[]>();

function getStoredData<T>(key: string, fallback: T[]): T[] {
  if (datasetCaches.has(key)) {
    return datasetCaches.get(key) as T[];
  }
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(`uwarl-db-${key}`);
    if (raw) {
      const parsed = JSON.parse(raw) as T[];
      
      // Auto-merge logic: if the static seed has more items (e.g. newly added static seeds), merge them in
      if (Array.isArray(parsed) && Array.isArray(fallback) && fallback.length > parsed.length) {
        const merged = [...parsed];
        fallback.forEach((item: any) => {
          if (!merged.some((m: any) => m.id === item.id)) {
            merged.push(item);
          }
        });
        localStorage.setItem(`uwarl-db-${key}`, JSON.stringify(merged));
        datasetCaches.set(key, merged);
        return merged as T[];
      }
      
      datasetCaches.set(key, parsed);
      return parsed;
    }
    localStorage.setItem(`uwarl-db-${key}`, JSON.stringify(fallback));
  } catch (e) {
    console.error(`Error reading ${key} from localStorage:`, e);
  }
  datasetCaches.set(key, fallback);
  return fallback;
}

function saveStoredData<T>(key: string, data: T[]): void {
  datasetCaches.set(key, data);
  if (!isBrowser) return;
  try {
    localStorage.setItem(`uwarl-db-${key}`, JSON.stringify(data));
    cleanupOrphanAssets();
    
    if (supabase) {
      (async () => {
        try {
          const { error } = await supabase
            .from("datasets")
            .upsert({ dataset_key: key, data }, { onConflict: "dataset_key" });
          if (error) throw error;
        } catch (err: any) {
          console.warn(`Background dataset save to Supabase failed for ${key}. running in offline fallback.`, err.message || err);
        }
      })();
    }
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

// ----------------- INITIAL DEFAULT DATA (SEED) -----------------
import {
  PROJECTS_DATABASE,
  EQUIPMENT_DATABASE,
  FIELD_ACTIVITIES_DATABASE
} from "./research-data";

const INITIAL_PROJECTS: GenericEntity[] = PROJECTS_DATABASE.map(p => ({
  ...p,
  title: p.title || p.scholar || "",
  description: p.description || ""
})) as any[];

const INITIAL_EQUIPMENT: GenericEntity[] = EQUIPMENT_DATABASE.map(eq => ({
  id: eq.id,
  title: eq.name,
  name: eq.name,
  description: eq.shortDescription || eq.purpose || "",
  category: eq.category,
  specs: Array.isArray(eq.specs) ? JSON.stringify(eq.specs) : eq.specs || "",
  purpose: eq.purpose || "",
  url: eq.url || "",
  thumbnail: eq.thumbnail || eq.image || "",
  images: eq.images || [],
  featured: false,
  displayOrder: 1
})) as any[];

const INITIAL_FIELD_ACTIVITIES: GenericEntity[] = FIELD_ACTIVITIES_DATABASE.map(fa => ({
  id: fa.id,
  title: fa.title,
  description: fa.description || "",
  location: fa.location,
  date: fa.date,
  year: fa.year.toString(),
  activityType: fa.activityType,
  equipmentTags: Array.isArray(fa.equipmentTags) ? fa.equipmentTags.join(", ") : fa.equipmentTags || "",
  team: Array.isArray(fa.team) ? fa.team.join(", ") : fa.team || "",
  thumbnail: fa.thumbnail || "",
  images: Array.isArray(fa.images) ? fa.images : fa.images ? [fa.images] : [],
  featured: false,
  displayOrder: 1
})) as any[];

const INITIAL_PEOPLE: GenericEntity[] = [
  {
    id: "peop-1",
    title: "Dr. K. Muthumeenakshi",
    description: "Associate Professor in ECE, SSNCE. Principal investigator in automated deep ocean object mapping consortiums.",
    designation: "Associate Professor",
    role: "faculty",
    institution: "SSNCE",
    link: "https://www.ssn.edu.in/staff-members/dr-k-muthumeenakshi/",
    associatedProjects: ["Deep Ocean Object Mapping", "Smart Underground MI Sensor Network"],
    projectRoles: ["Principal Investigator"],
    thumbnail: "/images/faculty_award.png",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 1
  },
  {
    id: "peop-2",
    title: "Dr. S. Sakthivel Murugan",
    description: "Professor in Department of ECE, NITTTR Chennai. Completed/ongoing research projects worth more than 200 lakhs funded by MoES, DST, TNSCST, NIOT.",
    designation: "Professor",
    role: "faculty",
    institution: "NITTTR, Taramani, Chennai",
    link: "https://www.ssn.edu.in/staff-members/dr-s-sakthivel-murugan/",
    associatedProjects: ["Submerged Poompuhar ML Exploration", "Underground Communication System"],
    projectRoles: ["Principal Investigator", "Research Advisor"],
    thumbnail: "/images/faculty_award.png",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 2
  },
  {
    id: "peop-3",
    title: "M. Vimal Raj",
    description: "Full-time scholar who has submitted his doctoral thesis. Serving as Project Associate-II under MoES-DOM Project.",
    designation: "Project Associate-II & Scholar",
    role: "scholar",
    mode: "Full Time",
    status: "Thesis Submitted",
    associatedProjects: ["MoES-DOM Pamc Project"],
    link: "https://www.researchgate.net/profile/Vimal_Madhaiyan",
    thumbnail: "",
    images: [],
    documents: [],
    featured: false,
    displayOrder: 3
  },
  {
    id: "peop-4",
    title: "S. Sabareesan",
    description: "Project Associate - I working under MoES DOM Project.",
    designation: "Project Associate - I",
    role: "staff",
    institution: "SSNCE",
    associatedProjects: ["MoES-DOM pamc Project"],
    thumbnail: "",
    images: [],
    documents: [],
    featured: false,
    displayOrder: 4
  },
  {
    id: "peop-5",
    title: "Dr. S. Swathi",
    description: "PhD Graduate under UWARL specializing in Underground Communication systems.",
    designation: "Doctoral Graduate",
    role: "phd",
    graduationDate: "October 2022",
    researchArea: "Underground Communication",
    status: "Graduated",
    thumbnail: "/images/student_award.png",
    images: [],
    documents: [],
    featured: false,
    displayOrder: 5
  }
];

const INITIAL_INTERNSHIPS: GenericEntity[] = [
  {
    id: "int-1",
    title: "Mr. Kavin R B",
    description: "Trilateration based acoustic beacons mapping for Autonomous Underwater Vehicle pathing.",
    institution: "SSNCE",
    topic: "Localization of AUV : Trilateration and Triangle Localization",
    duration: "July - August 2024",
    featured: false,
    displayOrder: 1
  },
  {
    id: "int-2",
    title: "Mr. R P Parvath Balaji",
    description: "Embedded motor actuators controller logic design for subsea robotic arms.",
    institution: "Anna University Regional Campus, Tirunelveli",
    topic: "Control of ARM in ROV",
    duration: "June - July 2024",
    featured: false,
    displayOrder: 2
  }
];

const INITIAL_MOUS: GenericEntity[] = [
  {
    id: "mou-1",
    title: "M. S. Swaminathan Research Foundation",
    description: "Agreement on smart agricultural underground wireless sensors development for underground water table monitoring.",
    date: "21 July 2017",
    researchFocus: "Underground Communication – Smart Irrigation System",
    notes: "Initiated and organized by Dr. S. Sakthivel Murugan, Associate Professor, for Underground Communication and Smart Irrigation.",
    thumbnail: "",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 1
  },
  {
    id: "mou-2",
    title: "Tamil Nadu Dr. J. Jayalalithaa Fisheries University",
    description: "Agreement focused on animal bio-acoustics research, coastal recording trials, and hydrophone calibrations.",
    date: "31 March 2021",
    researchFocus: "Animal Bio-acoustics Research",
    notes: "Initiated and organized by Dr. S. Sakthivel Murugan, Associate Professor, for collaborative animal bio-acoustics projects.",
    thumbnail: "",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 2
  }
];

const INITIAL_PARTNERS: GenericEntity[] = [
  { id: "part-1", title: "Satyabhama University", location: "Chennai, India", description: "Consortium partner for coastal trials data extraction.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 1 },
  { id: "part-2", title: "RMK Engineering College", location: "Chennai, India", description: "Consortium partner for subsea acoustic modeling.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 2 },
  { id: "part-3", title: "SRM University", location: "Chennai, India", description: "Technical exchange partner for subsea robot testings.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 3 },
  { id: "part-4", title: "Alagappa College of Technology", location: "Chennai, India", description: "Material analysis consultancy partner.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 4 },
  { id: "part-5", title: "SRM Eswari Engineering College", location: "Chennai, India", description: "Joint academic technical workshop partner.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 5 },
  { id: "part-6", title: "B. S. Abdur Rahman Crescent Institute of Science & Technology", location: "Chennai, India", description: "Research consultancy partner for data processing.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 6 },
  { id: "part-7", title: "K S School of Engineering and Management", location: "Bangalore, India", description: "Joint consultancy for shallow water trial surveys.", thumbnail: "", images: [], documents: [], featured: false, displayOrder: 7 }
];

const INITIAL_CONSULTANCY: GenericEntity[] = [
  {
    id: "con-1",
    title: "K S School of Engineering and Management",
    description: "Assisted faculties in acoustic transceiver data extraction and test tank validation trials.",
    date: "27 April 2024",
    participants: "Dr. P. Karthik (Professor) and Mr. Gopalakrishna Murthy C R (Associate Professor)",
    purpose: "Collected data through consultancy for the research work carried out in the lab.",
    equipment: "UWARL Testing Basin, Transceiver Setup",
    thumbnail: "",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 1
  },
  {
    id: "con-2",
    title: "B. S. Abdur Rahman Crescent Institute of Science and Technology",
    description: "Acoustic signal processing data extraction consultancy conducted in UWARL facilities.",
    date: "13 March 2024",
    participants: "Miss. A. Priya (Associate Professor, ECE) and Mr. Afzar Ali (Research Scholar), along with their students",
    purpose: "Collected data through consultancy for the research work carried out in the lab.",
    equipment: "Hydrophone Arrays, Test Tanks",
    thumbnail: "",
    images: [],
    documents: [],
    featured: true,
    displayOrder: 2
  }
];

const INITIAL_GALLERY: GenericEntity[] = [
  {
    id: "gal-1",
    title: "Acoustic Signal Validation",
    description: "Processing transceiver backscatter arrays in shallow ocean trial zones.",
    category: "research",
    date: "2024",
    thumbnail: "/images/academic_seminar.png",
    images: ["/images/academic_seminar.png", "/images/laboratory_workspace.png"],
    tags: ["Acoustics", "Signal Validation"],
    documents: [],
    featured: true,
    displayOrder: 1
  },
  {
    id: "gal-2",
    title: "ORCA ROV Deployments",
    description: "Buoyancy calibration testing of ORCA ROV in open water estuary trials.",
    category: "field",
    date: "2022",
    thumbnail: "/images/underwater_robot.png",
    images: ["/images/underwater_robot.png", "/images/laboratory_workspace.png"],
    tags: ["ROV", "Trials"],
    documents: [],
    featured: true,
    displayOrder: 2
  },
  {
    id: "gal-3",
    title: "Indoor Acoustic Test Tank",
    description: "Our 10,874-liter testing basin configured with transducer calibration gear.",
    category: "facilities",
    date: "2023",
    thumbnail: "/images/laboratory_workspace.png",
    images: ["/images/laboratory_workspace.png"],
    tags: ["Basin", "Test Tank"],
    documents: [],
    featured: true,
    displayOrder: 3
  },
  {
    id: "gal-4",
    title: "ITEC Delegations Lectures",
    description: "Academic sessions organized on subsea wireless arrays and acoustic propagation.",
    category: "events",
    date: "2021",
    thumbnail: "/images/academic_seminar.png",
    images: ["/images/academic_seminar.png", "/images/faculty_award.png"],
    tags: ["ITEC", "Seminar"],
    documents: [],
    featured: true,
    displayOrder: 4
  }
];

// Combine dynamic cards for gallery internships
const INITIAL_GALLERY_ALL = [
  ...INITIAL_GALLERY,
  {
    id: "gal-5",
    title: "Localization of AUV : Trilateration and Triangle Localization",
    description: "Internship topic by Mr. Kavin R B from SSNCE on Localization of AUV.",
    category: "internships",
    date: "July - August 2024",
    thumbnail: "",
    images: [],
    tags: ["AUV Navigation", "Trilateration"],
    documents: [],
    featured: false,
    displayOrder: 5
  },
  {
    id: "gal-6",
    title: "Control of ARM in ROV",
    description: "Internship topic by Mr. R P Parvath Balaji from Anna University Tirunelveli.",
    category: "internships",
    date: "June - July 2024",
    thumbnail: "",
    images: [],
    tags: ["ROV Controls", "Robotic Arm"],
    documents: [],
    featured: false,
    displayOrder: 6
  }
];

const INITIAL_MEDIA_LIBRARY: MediaFile[] = [
  {
    id: "med-1",
    title: "underwater_robot.png",
    category: "image",
    thumbnail: "/images/underwater_robot.png",
    uploadedAt: new Date().toISOString(),
    displayOrder: 1,
    featured: true
  },
  {
    id: "med-2",
    title: "academic_seminar.png",
    category: "image",
    thumbnail: "/images/academic_seminar.png",
    uploadedAt: new Date().toISOString(),
    displayOrder: 2,
    featured: true
  },
  {
    id: "med-3",
    title: "laboratory_workspace.png",
    category: "image",
    thumbnail: "/images/laboratory_workspace.png",
    uploadedAt: new Date().toISOString(),
    displayOrder: 3,
    featured: false
  },
  {
    id: "med-4",
    title: "faculty_award.png",
    category: "image",
    thumbnail: "/images/faculty_award.png",
    uploadedAt: new Date().toISOString(),
    displayOrder: 4,
    featured: false
  },
  {
    id: "med-5",
    title: "student_award.png",
    category: "image",
    thumbnail: "/images/student_award.png",
    uploadedAt: new Date().toISOString(),
    displayOrder: 5,
    featured: false
  }
];

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Ocean Research Laboratory",
  siteDescription: "National Institute of Technical Teachers Training and Research (NITTTR), Chennai",
  contactEmail: "orl@nitttrc.ac.in",
  contactPhone: "+91 44 2254 5400",
  workingHours: "Monday – Friday: 9:00 AM – 5:30 PM",
  footerContent: "© 2026 Ocean Research Laboratory, NITTTR Chennai. All rights reserved.",
  homepageStats: [
    { label: "Publications", value: "169", icon: "FileText", description: "62 Journals, 97 Conferences, and 10 Books.", displayOrder: 1 },
    { label: "Awards", value: "26", icon: "Award", description: "National and institutional recognitions.", displayOrder: 2 },
    { label: "Invited Talks", value: "22", icon: "Mic", description: "Keynotes and technical sessions delivered.", displayOrder: 3 },
    { label: "Research Supervisions", value: "16", icon: "GraduationCap", description: "PhD scholars guided and doctoral committees chaired.", displayOrder: 4 },
    { label: "Training Programmes", value: "55", icon: "Briefcase", description: "ITEC international sessions and PDP courses.", displayOrder: 5 },
    { label: "Years of Research", value: "15+", icon: "Calendar", description: "Established in 2010 (15+ years of research).", displayOrder: 6 }
  ],
  peopleStats: [
    { label: "Faculty Members", count: "5", icon: "Users", desc: "Scientific Directors & Founders", displayOrder: 1 },
    { label: "Research Scholars", count: "4", icon: "GraduationCap", desc: "Ph.D. Candidates & Investigators", displayOrder: 2 },
    { label: "Project Staff", count: "2", icon: "Briefcase", desc: "Hardware & Software Engineers", displayOrder: 3 },
    { label: "Students & Interns", count: "58", icon: "BookOpen", desc: "Post-Graduate & Innovation Teams", displayOrder: 4 }
  ],
  keyContacts: [
    {
      name: "Dr. S. Sakthivel Murugan",
      designation: "Laboratory Head & Professor",
      email: "orl@nitttrc.ac.in",
      displayOrder: 1
    },
    {
      name: "Dr. K. Muthumeenakshi",
      designation: "Associate Professor (Research Enquiries)",
      email: "orl@nitttrc.ac.in",
      displayOrder: 2
    },
    {
      name: "Dr. S. Sakthivel Murugan",
      designation: "Professor (Consultancy Enquiries)",
      email: "orl@nitttrc.ac.in",
      displayOrder: 3
    },
    {
      name: "Dr. S. Sakthivel Murugan",
      designation: "Professor (Training Programmes)",
      email: "orl@nitttrc.ac.in",
      displayOrder: 4
    }
  ],
  heroTitle: "Ocean Research Laboratory",
  heroSubtitle: "ஆழி ஆராய்ச்சி ஆய்வகம் / समुद्र अनुसंधान प्रयोगशाला",
  heroDescription: "The Ocean Research Laboratory (ORL) at NITTTR Chennai is dedicated to advancing underwater acoustics, ocean engineering, marine sensing technologies, and subsea exploration systems through research, innovation, technical training, and field validation.",
  heroBgImage: "",
  heroPrimaryBtnText: "Explore Research",
  heroPrimaryBtnLink: "/research",
  heroSecondaryBtnText: "Contact Us",
  heroSecondaryBtnLink: "/contact",
  googleMapsEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8967468114467!2d80.24716497479017!3d12.97841101473636!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d614ffdfdd9%3A0xe5a363cb05697d!2sNITTTR%20Chennai!5e0!3m2!1sen!2sin!4v1718000000000!5m2!1sen!2sin",
  googleMapsUrl: "https://maps.google.com/?q=NITTTR+Chennai",
  latitude: "12.9784",
  longitude: "80.2472",
  address: "Department of ECE, NITTTR Chennai, Taramani, Chennai, Tamil Nadu - 600113"
};

// ----------------- REACT STATE MANAGERS & TRIGGER HOOKS -----------------

const storeListeners = new Map<string, Set<() => void>>();

function subscribeStore(key: string, listener: () => void) {
  if (!storeListeners.has(key)) {
    storeListeners.set(key, new Set());
  }
  storeListeners.get(key)!.add(listener);
  return () => {
    storeListeners.get(key)?.delete(listener);
  };
}

function notifyStoreChange(key: string) {
  storeListeners.get(key)?.forEach((cb) => cb());
}

export function notifyAllStoreListeners() {
  storeListeners.forEach((listeners) => {
    listeners.forEach((cb) => cb());
  });
}

export function updateSettingsCache(settings: SiteSettings) {
  settingsCache = settings;
  notifyStoreChange("settings");
}

export function updateDatasetCache(key: string, data: any[]) {
  datasetCaches.set(key, data);
  notifyStoreChange(key);
}

export function getDatasetRecords(key: string, seed: any[]): GenericEntity[] {
  return getStoredData(key, seed);
}

export function saveDatasetRecords(key: string, records: GenericEntity[]): void {
  saveStoredData(key, records);
  notifyStoreChange(key);
}

let settingsCache: SiteSettings | null = null;

export function getSettings(): SiteSettings {
  if (settingsCache) return settingsCache;
  if (!isBrowser) return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem("uwarl-db-settings");
    if (raw) {
      settingsCache = JSON.parse(raw) as SiteSettings;
      return settingsCache;
    }
    localStorage.setItem("uwarl-db-settings", JSON.stringify(DEFAULT_SETTINGS));
  } catch (e) {
    console.error("Error reading site settings:", e);
  }
  settingsCache = DEFAULT_SETTINGS;
  return settingsCache;
}

export function saveSettings(settings: SiteSettings): void {
  settingsCache = settings;
  if (!isBrowser) return;
  try {
    localStorage.setItem("uwarl-db-settings", JSON.stringify(settings));
    notifyStoreChange("settings");
    cleanupOrphanAssets();

    if (supabase) {
      (async () => {
        try {
          const { error } = await supabase
            .from("site_settings")
            .upsert({ key: "site_settings", value: settings }, { onConflict: "key" });
          if (error) throw error;
        } catch (err: any) {
          console.warn("Background site settings save to Supabase failed. running in offline fallback.", err.message || err);
        }
      })();
    }
  } catch (e) {
    console.error("Error saving site settings:", e);
  }
}

const INITIAL_HOME_RESEARCH_FOCUS: GenericEntity[] = [
  {
    id: "focus-1",
    title: "Underwater Acoustics",
    description: "Ambient noise modeling, propagation dynamics, and sonar telemetry characterization in shallow and deep coastal waters.",
    icon: "Compass",
    tags: ["Hydrophones", "Ambient Noise", "Propagation"],
    displayOrder: 1
  },
  {
    id: "focus-2",
    title: "Ocean Observation",
    description: "Development of autonomous subsea sensor networks, marine bio-acoustics mapping, and real-time environment monitoring stations.",
    icon: "Globe",
    tags: ["Sensors", "Monitoring", "Data Collection"],
    displayOrder: 2
  },
  {
    id: "focus-3",
    title: "Marine Signal Processing",
    description: "Advanced algorithms for sonar de-noising, multi-carrier subsea communication (MIMO) structures, and AI-assisted degraded optical restoration.",
    icon: "Cpu",
    tags: ["De-noising", "MIMO Sonar", "AI Restoration"],
    displayOrder: 3
  },
  {
    id: "focus-4",
    title: "Underwater Robotics",
    description: "Guidance, navigation, and control loop optimization for autonomous underwater vehicles (AUVs) and remotely operated vehicles (ROVs).",
    icon: "Bot",
    tags: ["AUVs & ROVs", "Control Loops", "Navigation"],
    displayOrder: 4
  }
];

const INITIAL_HOME_HIGHLIGHTS: GenericEntity[] = [
  {
    id: "h-high-1",
    title: "Indoor Acoustic Test Tank",
    description: "Indoor calibrated water testing facility supporting sensor arrays and subsea platforms.",
    image: "/images/laboratory_workspace.png",
    tag: "Acoustic Testing",
    link: "facilities",
    specs: [
      { label: "Capacity", value: "10,874 Litres" },
      { label: "Purpose", value: "Sensor Calibration & Trim Testing" }
    ],
    displayOrder: 1
  },
  {
    id: "h-high-2",
    title: "ORCA ROV Platform",
    description: "Custom inspection vehicle designed for biological surveying and underwater recording.",
    image: "/images/underwater_robot.png",
    tag: "ROV Platform",
    link: "facilities",
    specs: [
      { label: "Deployment", value: "Inspection class" },
      { label: "Equipment", value: "Modular Thrusters & HD Cam" }
    ],
    displayOrder: 2
  },
  {
    id: "h-high-3",
    title: "Marine Instrumentation",
    description: "State-of-the-art arrays, velocimeters, and side-scan sonar interfaces.",
    image: "/images/academic_seminar.png",
    tag: "Field Systems",
    link: "facilities",
    specs: [
      { label: "Sensing", value: "Hydrophones & SVP Profilers" },
      { label: "Interface", value: "High-resolution side-scan" }
    ],
    displayOrder: 3
  }
];

const INITIAL_HOME_QUICK_ACCESS: GenericEntity[] = ([
  { label: "Research & Facilities", to: "/research", icon: "Compass", description: "Acoustics modeling and test tank facilities", color: "sky", displayOrder: 1 },
  { label: "Publications", to: "/publications", icon: "FileText", description: "Peer-reviewed journals and books", color: "sky", displayOrder: 2 },
  { label: "Technical Training", to: "/technical-training", icon: "Briefcase", description: "ITEC international and PDP courses", color: "indigo", displayOrder: 3 },
  { label: "Academic Activities", to: "/academic-activities", icon: "GraduationCap", description: "Supervision registries and workshops", color: "violet", displayOrder: 4 },
  { label: "Awards & Recognition", to: "/awards", icon: "Award", description: "National and institutional recognitions", color: "amber", displayOrder: 5 },
  { label: "People", to: "/people", icon: "Users", description: "Faculty, scholars, staff, and alumni", color: "indigo", displayOrder: 6 },
    { label: "Gallery", to: "/gallery", icon: "Camera", description: "Photo archives of underwater trials", color: "cyan", displayOrder: 7 },
    { label: "Collaborations", to: "/collaborations-consultancy", icon: "Globe", description: "Joint MoUs and consultancy programs", color: "emerald", displayOrder: 8 }
  ] as any[]).map((item, idx) => ({ id: `qa-${idx}`, title: item.label, ...item }));

// ----------------- GLOBAL BACKUP & RESTORE SYSTEMS -----------------
import { resolveAssetUrl, registerAsset, getAssets, saveAssets, type UploadedAsset, type Attachment, cleanupOrphanAssets } from "@/lib/storage-service";

export function exportSiteBackup(): string {
  const backup = {
    settings: getSettings(),
    assets: getAssets(),
    datasets: {} as Record<string, any>
  };
  
  const keys = [
    "research-projects",
    "research-equipment",
    "research-activities",
    "people-members",
    "people-internships",
    "collaborations-mous",
    "collaborations-institutions",
    "collaborations-activities",
    "gallery-records",
    "home-research-focus",
    "home-highlights",
    "home-quick-access",
    "media-library"
  ];
  
  keys.forEach(key => {
    try {
      const raw = localStorage.getItem(`uwarl-db-${key}`);
      if (raw) {
        backup.datasets[key] = JSON.parse(raw);
      } else {
        backup.datasets[key] = DATA_SEEDS[key as keyof typeof DATA_SEEDS] || [];
      }
    } catch (e) {
      console.error(`Error exporting ${key}:`, e);
    }
  });

  try {
    const rawRecords = localStorage.getItem("uwarl-repo-records-v3");
    if (rawRecords) {
      backup.datasets["repo-records"] = JSON.parse(rawRecords);
    }
    const rawCarousels = localStorage.getItem("uwarl-repo-carousels-v1");
    if (rawCarousels) {
      backup.datasets["repo-carousels"] = JSON.parse(rawCarousels);
    }
  } catch (e) {
    console.error("Error exporting repo records:", e);
  }

  return JSON.stringify(backup, null, 2);
}

export function importSiteBackup(jsonString: string): void {
  try {
    const backup = JSON.parse(jsonString);
    if (!backup || typeof backup !== "object") {
      throw new Error("Invalid backup data format.");
    }

    if (backup.settings) {
      saveSettings(backup.settings);
    }
    if (backup.assets) {
      saveAssets(backup.assets);
    }
    
    if (backup.datasets && typeof backup.datasets === "object") {
      Object.entries(backup.datasets).forEach(([key, data]) => {
        if (key === "repo-records") {
          localStorage.setItem("uwarl-repo-records-v3", JSON.stringify(data));
        } else if (key === "repo-carousels") {
          localStorage.setItem("uwarl-repo-carousels-v1", JSON.stringify(data));
        } else {
          localStorage.setItem(`uwarl-db-${key}`, JSON.stringify(data));
          datasetCaches.delete(key);
          notifyStoreChange(key);
        }
      });
    }
    
    notifyStoreChange("settings");
    notifyStoreChange("repo-records");
    cleanupOrphanAssets();
  } catch (e) {
    console.error("Error restoring backup:", e);
    throw e;
  }
}

export function resetSiteToDefaults(): void {
  const keys = [
    "settings",
    "assets-v1",
    "research-projects",
    "research-equipment",
    "research-activities",
    "people-members",
    "people-internships",
    "collaborations-mous",
    "collaborations-institutions",
    "collaborations-activities",
    "gallery-records",
    "home-research-focus",
    "home-highlights",
    "home-quick-access",
    "media-library",
    "repo-records-v3",
    "repo-carousels-v1"
  ];
  keys.forEach(k => {
    localStorage.removeItem(`uwarl-db-${k}`);
    localStorage.removeItem(`uwarl-${k}`);
  });
  datasetCaches.clear();
  settingsCache = null;
  
  if (typeof window !== "undefined") {
    window.location.reload();
  }
}

// React hooks to sync variables
export function useDatasetRecords(key: string, seed: any[]): GenericEntity[] {
  return useSyncExternalStore(
    (cb) => subscribeStore(key, cb),
    () => getStoredData(key, seed),
    () => seed
  );
}

export function useSiteSettings(): SiteSettings {
  return useSyncExternalStore(
    (cb) => subscribeStore("settings", cb),
    () => getSettings(),
    () => DEFAULT_SETTINGS
  );
}

// ----------------- DATA SEEDS REGISTRY EXPORTS -----------------
export const DATA_SEEDS = {
  "research-projects": INITIAL_PROJECTS,
  "research-equipment": INITIAL_EQUIPMENT,
  "research-activities": INITIAL_FIELD_ACTIVITIES,
  "people-members": INITIAL_PEOPLE,
  "people-internships": INITIAL_INTERNSHIPS,
  "collaborations-mous": INITIAL_MOUS,
  "collaborations-institutions": INITIAL_PARTNERS,
  "collaborations-activities": INITIAL_CONSULTANCY,
  "gallery-records": INITIAL_GALLERY_ALL,
  "media-library": INITIAL_MEDIA_LIBRARY,
  "home-research-focus": INITIAL_HOME_RESEARCH_FOCUS,
  "home-highlights": INITIAL_HOME_HIGHLIGHTS,
  "home-quick-access": INITIAL_HOME_QUICK_ACCESS
};
