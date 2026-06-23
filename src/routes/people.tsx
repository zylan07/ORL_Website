import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useDatasetRecords, DATA_SEEDS, useSiteSettings } from "@/lib/admin-store";
import { StickySectionNav } from "@/components/sticky-section-nav";
import { PageHero } from "@/components/page-hero";
import { z } from "zod";
import { resolveAssetUrl } from "@/lib/storage-service";
import { isValidImage, hasContent } from "@/lib/utils";
import { normalizeImages } from "@/lib/media-normalizer";
import { ModalImageCarousel } from "@/components/modal-image-carousel";
import { CardImageCarousel } from "@/components/card-image-carousel";

import {
  GraduationCap,
  Users,
  Briefcase,
  Award,
  Sparkles,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Compass,
  ArrowRight,
} from "lucide-react";

const peopleSearchSchema = z.object({
  tab: z.enum(["faculty", "scholars", "staff", "phd", "alumni", "interns", "discussions"]).optional(),
});

export const Route = createFileRoute("/people")({
  validateSearch: (search) => peopleSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "People | Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Meet the faculty, research scholars, project engineers, interns, and alumni of the Ocean Research Laboratory.",
      },
    ],
  }),
  component: PeoplePage,
});

// ----------------- CMS-READY DATA STRUCTURES -----------------

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  institution: string;
  associatedProjects?: string[];
  projectRoles?: string[];
  imageUrl: string | null;
  galleryImages?: string[];
  link?: string;
  bio?: string;
  qualification?: string;
  specialization?: string;
  researchArea?: string;
  researchInterests?: string;
  email?: string;
  phone?: string;
  orcid?: string;
  googleScholar?: string;
  cvId?: string;
}

export interface ResearchScholar {
  id: string;
  name: string;
  mode: "Full Time" | "Part Time";
  status: "Thesis Submitted" | "Active" | "Coursework Completed";
  role?: string;
  associatedProject?: string;
  imageUrl: string | null;
  galleryImages?: string[];
  link?: string;
}

export interface ProjectStaff {
  id: string;
  name: string;
  role: string;
  project?: string;
  imageUrl: string | null;
  galleryImages?: string[];
  link?: string;
}

export interface PhDGraduate {
  id: string;
  name: string;
  researchArea: string;
  graduationDate: string;
  status: "Completed";
  imageUrl: string | null;
  galleryImages?: string[];
  link?: string;
}

export interface UGStudent {
  id: string;
  name: string;
  status: "Current Student";
  imageUrl: string | null;
  galleryImages?: string[];
}

export interface UGAlumnus {
  id: string;
  name: string;
  imageUrl: string | null;
  galleryImages?: string[];
  link?: string;
  institution?: string;
  duration?: string;
  topic?: string;
  status?: string;
}

export interface PGAlumnus {
  id: string;
  name: string;
  programme: string;
  imageUrl: string | null;
  galleryImages?: string[];
  link?: string;
  institution?: string;
  duration?: string;
  topic?: string;
  status?: string;
}

export interface Internship {
  id: string;
  name: string;
  institution: string;
  topic?: string;
  duration: string;
  imageUrl: string | null;
  galleryImages?: string[];
  cvId?: string;
}

export interface TechnicalDiscussion {
  id: string;
  title: string;
  date: string;
  participants?: string;
  summary?: string;
  imageUrl: string | null;
  galleryImages?: string[];
}

// ----------------- DATABASES -----------------

export const TEAM_MEMBERS: FacultyMember[] = [
  {
    id: "fac-1",
    name: "Dr. K. Muthumeenakshi",
    designation: "Associate Professor",
    department: "Department of Electronics and Communication Engineering",
    institution: "SSNCE",
    projectRoles: ["Principal Investigator", "Co-investigator"],
    associatedProjects: [
      "Automated Identification and Characterization of Underwater Images in Deep Ocean",
      "Implementation of Magnetic Induction based Underground Sensor Network for Smart Irrigation"
    ],
    imageUrl: null,
    link: "https://www.ssn.edu.in/staff-members/dr-k-muthumeenakshi/"
  },
  {
    id: "fac-2",
    name: "Dr. S. Sakthivel Murugan",
    designation: "Professor",
    department: "Department of ECE",
    institution: "NITTTR, Taramani, Chennai",
    bio: "Worked in the Department of ECE, SSN since June 2001 till September 2024. He has completed and ongoing research projects funded by MoES, DST-SSTP, TNSCST, NIOT, and SSN Trust worth more than 200 lakhs.",
    imageUrl: null,
    link: "https://www.ssn.edu.in/staff-members/dr-s-sakthivel-murugan/"
  },
  {
    id: "fac-3",
    name: "Dr. G. Satheesh Kumar",
    designation: "Associate Professor",
    department: "Department of Mechanical Engineering",
    institution: "SSNCE",
    projectRoles: ["Co-investigator"],
    associatedProjects: [
      "Amphibious waterbody and beach cleaning BOT"
    ],
    imageUrl: null,
    link: "https://www.ssn.edu.in/staff-members/satheesh-kumar/"
  },
  {
    id: "fac-4",
    name: "Dr. K. Murugesan",
    designation: "Assistant Professor",
    department: "Department of Electrical and Electronics Engineering",
    institution: "SSNCE",
    projectRoles: ["Co-investigator"],
    associatedProjects: [
      "Design and Development of Indigenous Research based Inspection Class Remotely Operated Vehicle (ROV)"
    ],
    imageUrl: null,
    link: "https://www.ssn.edu.in/staff-members/dr-k-murugesan/"
  },
  {
    id: "fac-5",
    name: "Dr. N. Padmapriya",
    designation: "Assistant Professor",
    department: "Department of Mathematics",
    institution: "SSNCE",
    projectRoles: ["Co-investigator"],
    associatedProjects: [
      "Off-shore excavation of heritage rich submerged sites of Poompuhar and Mahabalipuram by EMD using Deep Learning"
    ],
    imageUrl: null,
    link: "https://www.ssn.edu.in/staff-members/dr-n-padmapriya/"
  }
];

export const RESEARCH_SCHOLARS: ResearchScholar[] = [
  {
    id: "sch-1",
    name: "M. Vimal Raj",
    mode: "Full Time",
    status: "Thesis Submitted",
    role: "Project Associate- II",
    associatedProject: "MoES- DOM Project",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Vimal_Madhaiyan"
  },
  {
    id: "sch-2",
    name: "R. Logeshwaran",
    mode: "Part Time",
    status: "Thesis Submitted",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Logeshwaran_Kr"
  },
  {
    id: "sch-3",
    name: "K. Balaji",
    mode: "Part Time",
    status: "Thesis Submitted",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Balaji_Kathavarayan"
  },
  {
    id: "sch-4",
    name: "R. Sathya Priya",
    mode: "Full Time",
    status: "Active",
    role: "Project Associate-I",
    associatedProject: "MoES- DOM Project",
    imageUrl: null,
    link: "https://www.linkedin.com/in/r-sathya-priya-cse-kiot-922387265/"
  }
];

export const PROJECT_STAFF: ProjectStaff[] = [
  {
    id: "stf-1",
    name: "S. Sabareesan",
    role: "Project Associate - I",
    project: "MoES - DOM Project",
    imageUrl: null,
    link: "https://www.linkedin.com/in/sabareesans/"
  },
  {
    id: "stf-2",
    name: "R. M. Nithyalakshmi",
    role: "Research Assistant",
    imageUrl: null
  }
];

export const PHD_GRADUATES: PhDGraduate[] = [
  {
    id: "doc-1",
    name: "Dr. S. Swathi",
    researchArea: "Underground Communication",
    graduationDate: "October 2022",
    status: "Completed",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Swathi_Sugumar"
  },
  {
    id: "doc-2",
    name: "Dr. M. Somasekar",
    researchArea: "Underwater Image Enhancement",
    graduationDate: "January 2024",
    status: "Completed",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Somasekar_Muthusamy"
  },
  {
    id: "doc-3",
    name: "Dr. G. Annalakshmi",
    researchArea: "Coral Image Classification",
    graduationDate: "October 2022",
    status: "Completed",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Annalakshmi_Ganesan?"
  },
  {
    id: "doc-4",
    name: "Dr. S. Mary Cecilia",
    researchArea: "Underwater Image Dehazing",
    graduationDate: "February 2023",
    status: "Completed",
    imageUrl: null,
    link: "http://www.researchgate.net/profile/Mary_Cecilia2/research"
  },
  {
    id: "doc-5",
    name: "Dr. M. Dhana Lakshmi",
    researchArea: "Underwater Species Image Classification",
    graduationDate: "November 2023",
    status: "Completed",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Dhanalakshmi_Muthuraman"
  }
];

export const UG_STUDENTS: UGStudent[] = [
  {
    id: "ug-1",
    name: "S. Sivasankar",
    status: "Current Student",
    imageUrl: null
  }
];

export const UG_ALUMNI: UGAlumnus[] = [
  { id: "al-ug-1", name: "M. Pranav", imageUrl: null },
  { id: "al-ug-2", name: "S. Nisha Nethraa", imageUrl: null },
  { id: "al-ug-3", name: "Janakiram.V", imageUrl: null },
  { id: "al-ug-4", name: "AKKASH ANNIYAPPA C.S", imageUrl: null, link: "https://www.linkedin.com/in/akkash-anniyappa-c-s-55179b218/" },
  { id: "al-ug-5", name: "D. Karthik", imageUrl: null, link: "https://www.linkedin.com/in/karthik-desingu/" },
  { id: "al-ug-6", name: "Karthik Raja A", imageUrl: null, link: "https://www.linkedin.com/in/karthik-raja-anandan-87ab5b200/" },
  { id: "al-ug-7", name: "A. Anirudh", imageUrl: null },
  { id: "al-ug-8", name: "B. Sandhya", imageUrl: null, link: "http://www.linkedin.com/in/sandhya-b-a98609216" },
  { id: "al-ug-9", name: "G.Sree Harine", imageUrl: null, link: "http://www.linkedin.com/in/sree-harine-govindaraj-3a604698" },
  { id: "al-ug-10", name: "D. Nivedhitha", imageUrl: null, link: "https://www.linkedin.com/in/nivedhitha-dhanasekaran/" },
  { id: "al-ug-11", name: "M.P.Shwetha", imageUrl: null, link: "https://www.linkedin.com/in/shwetha-m-p-9b6b641b2/" },
  { id: "al-ug-12", name: "Tejaswini Panati", imageUrl: null, link: "https://www.linkedin.com/in/tejaswini-panati-66a982181/" },
  { id: "al-ug-13", name: "Sai Deepika Indraganti", imageUrl: null, link: "https://www.linkedin.com/in/sai-deepika-i-746a55168/" },
  { id: "al-ug-14", name: "N.J. Raksshitha", imageUrl: null, link: "https://www.researchgate.net/profile/Raksshitha_Nj" },
  { id: "al-ug-15", name: "Hashmat Banday", imageUrl: null, link: "https://www.linkedin.com/in/hashmat-j-banday/" },
  { id: "al-ug-16", name: "Vishal Mohan", imageUrl: null, link: "https://www.linkedin.com/in/vishal-mohan-95a584160/" },
  { id: "al-ug-17", name: "Vigneshwar Veeravagu", imageUrl: null, link: "https://www.linkedin.com/in/vigneshwar-veeravagu-721675176/" },
  { id: "al-ug-18", name: "S. Shrinivas Badri", imageUrl: null, link: "https://www.linkedin.com/in/shrinivasbadri/" },
  { id: "al-ug-19", name: "Sharath N Chittaragi", imageUrl: null, link: "https://www.linkedin.com/in/sharath-chittaragi/" },
  { id: "al-ug-20", name: "A. Shashank Karthikeyaa", imageUrl: null, link: "https://www.linkedin.com/in/shashankkarrthikeyaaas/" },
  { id: "al-ug-21", name: "R. Priyadarshini", imageUrl: null, link: "https://www.linkedin.com/in/priya0297/" },
  { id: "al-ug-22", name: "G. Revathi", imageUrl: null, link: "https://www.researchgate.net/profile/Revathi_Gunasekaran" },
  { id: "al-ug-23", name: "V. Sneha", imageUrl: null, link: "https://www.researchgate.net/profile/Sneha_Vijayakumar2" },
  { id: "al-ug-24", name: "S. Nikitha", imageUrl: null, link: "https://www.researchgate.net/profile/Nikhitha_Senthilkumar" },
  { id: "al-ug-25", name: "V. Zohra Noori Mohsina", imageUrl: null, link: "https://www.linkedin.com/in/zohra-noori-mohsina-3a4132168/" },
  { id: "al-ug-26", name: "S.A. Thirumalini", imageUrl: null, link: "https://www.linkedin.com/in/thirumalini-s-a-5a2379134/" },
  { id: "al-ug-27", name: "D. Deepika", imageUrl: null }
];

export const PG_ALUMNI: PGAlumnus[] = [
  {
    id: "al-pg-1",
    name: "Sukanthi Kannan",
    programme: "M.E Applied Electronics",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Sukanthi?ev=hdr_xprf"
  },
  {
    id: "al-pg-2",
    name: "Mubeena Parveen",
    programme: "M.E Applied Electronics",
    imageUrl: null,
    link: "https://www.researchgate.net/profile/Mubeena_Parveen2"
  },
  {
    id: "al-pg-3",
    name: "B. Raagavi",
    programme: "M.E Applied Electronics",
    imageUrl: null,
    link: "https://www.linkedin.com/in/raagavi-balaji-90281b156/"
  },
  {
    id: "al-pg-4",
    name: "M. Pratyusha",
    programme: "M.E Communication Systems",
    imageUrl: null,
    link: "https://www.linkedin.com/in/pratyushamahavadi-aa886986/"
  },
  {
    id: "al-pg-5",
    name: "B. Arunkumar",
    programme: "M.E Communication Systems",
    imageUrl: null,
    link: "https://www.linkedin.com/in/arunkumar-balasubramanian-b11a71182/"
  }
];

export const INTERNSHIPS: Internship[] = [
  {
    id: "intern-1",
    name: "Mr. Kavin R B",
    institution: "SSNCE",
    topic: "Localization of AUV : Trilateration and Triangle Localization",
    duration: "July- August 2024",
    imageUrl: null
  },
  {
    id: "intern-2",
    name: "Mr. R P Parvath Balaji",
    institution: "Anna University regional campus Tirunelveli",
    topic: "Control of ARM in ROV",
    duration: "June - July 2024",
    imageUrl: null
  },
  {
    id: "intern-3",
    name: "Mr. A Hridhay",
    institution: "VIT Chennai",
    topic: "Underwater Image Restoration using ML & DL",
    duration: "May - June 2024",
    imageUrl: null
  },
  {
    id: "intern-4",
    name: "Mr. K. Bharath",
    institution: "SRM Institute of Science and Technology",
    topic: "Testing of an Audio Signal in Underwater test tank",
    duration: "June - July 2024",
    imageUrl: null
  },
  {
    id: "intern-5",
    name: "Ms. T. Gayathri",
    institution: "SRM Valliammai Engineering College",
    topic: "Testing of an Audio Signal in Underwater test tank",
    duration: "June - July 2024",
    imageUrl: null
  },
  {
    id: "intern-6",
    name: "Ms. Harini Sri Ramesh",
    institution: "SRM Valliammai Engineering College",
    topic: "Testing of an Audio Signal in Underwater test tank",
    duration: "June - July 2024",
    imageUrl: null
  },
  {
    id: "intern-7",
    name: "Mr. Kishore R V",
    institution: "SRM Valliammai Engineering College",
    topic: "Control of ARM in ROV",
    duration: "June - July 2024",
    imageUrl: null
  },
  {
    id: "intern-8",
    name: "Mr. A. Immanuvel Kirthick",
    institution: "SRM Valliammai Engineering College",
    topic: "Control of ARM in ROV",
    duration: "June - July 2024",
    imageUrl: null
  },
  {
    id: "intern-9",
    name: "Ms. K. MADHUSHREE",
    institution: "SRM Valliammai Engineering College",
    topic: "Navigation Analysis of Underwater ROV",
    duration: "June - July 2024",
    imageUrl: null
  },
  {
    id: "intern-10",
    name: "Ms. P. Saranya",
    institution: "Sri Sairam Engineering College",
    topic: "Testing of acoustic signal transmission in underwater",
    duration: "June - August 2023",
    imageUrl: null
  },
  {
    id: "intern-11",
    name: "Mr. S. KIBAR",
    institution: "Sri Sairam Engineering College",
    topic: "Navigation System for Underwater ROV",
    duration: "June- August 2023",
    imageUrl: null
  },
  {
    id: "intern-12",
    name: "Mr. S. Sakthivel",
    institution: "Amrita Vishwa Vishwapeetham",
    topic: "Underwater Noise Analysis and Image Enhancement",
    duration: "May - June 2021",
    imageUrl: null
  },
  { id: "intern-13", name: "HARIKRISHNAN J", institution: "Sri Venkateswaraa College of Technology, Sriperumbudur", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-14", name: "KANNIGA K", institution: "Puducherry Techonological University", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-15", name: "PRASANNAA G", institution: "Puducherry Techonological University", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-16", name: "GIRIDHARAN N", institution: "CARE College of Engineering, Trichy", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-17", name: "JEEVA S", institution: "CARE College of Engineering, Trichy", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-18", name: "JEGADESWARAN R", institution: "CARE College of Engineering, Trichy", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-19", name: "SURYA R R", institution: "CARE College of Engineering, Trichy", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-20", name: "UDHAYAKUMAR S", institution: "Sri Venkateswara College of Engineering", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-21", name: "CHIDHAMBARAM P", institution: "Sri Venkateswara College of Engineering", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-22", name: "VISHNUPRASATH V", institution: "Sri Venkateswara College of Engineering", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-23", name: "Muhammad Arshad K", institution: "Sri Venkateswara College of Engineering", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-24", name: "DEEPA SREE S", institution: "Sri Venkateswara College of Engineering", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-25", name: "HIMAVARSHINI K R", institution: "Sri Venkateswara College of Engineering", duration: "15/12/2025 to 13/01/2026", imageUrl: null },
  { id: "intern-26", name: "KAVYA S", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-27", name: "NISHA K", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-28", name: "VIJAYALAKSHMI R", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-29", name: "SURUTHI D", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-30", name: "SUDARVIZHI S", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-31", name: "SUWETHA M", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-32", name: "KAVYASHREE R", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-33", name: "VERSIA SRI A", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-34", name: "SIBIRAM T", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-35", name: "KIRUBA K", institution: "KPR Institute of Engineering and Technology, Coimbatore", duration: "01/01/2026 to 30/01/2026", imageUrl: null },
  { id: "intern-36", name: "SUNDARAM V", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, Kanchipuram", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-37", name: "KARUNYA D", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-38", name: "HARINI R", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-39", name: "VINAYAGAMURTHI E", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-40", name: "YUGAL KISHORE", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-41", name: "SHAGUL", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-42", name: "NARESH KUMAR R", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-43", name: "SURENDER SAH K", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-44", name: "SAKTHIVEL S", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-45", name: "LOKESH M", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-46", name: "PRIYADHARSHINI R", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-47", name: "NIVETHALAKSHMI C B", institution: "Sri Venkateswara College of Engineering, Sriperumbudur, kanchipuram.", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-48", name: "SHRUTHI M G", institution: "Muthayammal Engineering College, Rasipuram, Namakkal", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-49", name: "VIJAYAKUMAR S", institution: "Muthayammal Engineering College, Rasipuram, Namakkal", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-50", name: "SRIMATHI T", institution: "Muthayammal Engineering College, Rasipuram, Namakkal", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-51", name: "SUBHASHREE R R", institution: "Muthayammal Engineering College, Rasipuram, Namakkal", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-52", name: "VAISHNAVI K", institution: "Muthayammal Engineering College, Rasipuram, Namakkal", duration: "02/12/2025 to 02/01/2026", imageUrl: null },
  { id: "intern-53", name: "PRADEEP S", institution: "Erode Sengunthar Engineering College, Perundurai", duration: "10/02/2026 to 10/03/2026", imageUrl: null },
  { id: "intern-54", name: "RAGHAVA SIMHAN S", institution: "Erode Sengunthar Engineering College, Perundurai", duration: "10/02/2026 to 10/03/2026", imageUrl: null },
  { id: "intern-55", name: "SORNA MAHI S A", institution: "Erode Sengunthar Engineering College, Perundurai", duration: "10/02/2026 to 10/03/2026", imageUrl: null },
  { id: "intern-56", name: "PRITHIVIRAJ R", institution: "Erode Sengunthar Engineering College, Perundurai", duration: "10/02/2026 to 10/03/2026", imageUrl: null },
  { id: "intern-57", name: "NARASHIMMAN M", institution: "Erode Sengunthar Engineering College, Perundurai", duration: "10/02/2026 to 10/03/2026", imageUrl: null },
  { id: "intern-58", name: "ARJUN E", institution: "Erode Sengunthar Engineering College, Perundurai", duration: "10/02/2026 to 10/03/2026", imageUrl: null }
];

const STATIC_TECHNICAL_DISCUSSIONS: TechnicalDiscussion[] = [
  {
    id: "disc-1",
    title: "Intern Students Discussion on Testing of an Audio Signal in Underwater test tank and Control of ARM in ROV",
    date: "June-August 2024",
    participants: "Intern students at ORL",
    summary: "Active review sessions covering experimental setups for acoustic signal transmission, hydrophone calibration, and joint testing of robotic arms for subsea remotely operated vehicles.",
    imageUrl: null
  },
  {
    id: "disc-2",
    title: "One Day Workshop on Design of ROV",
    date: "28 September & 4 October 2019",
    participants: "Dr. R. Satish (Guest Speaker), ORL Team & Scholars",
    summary: "One Day workshop by Dr. R. Satish on Design of Remotely Operated Vehicles (ROV) held inside the laboratory workspace to outline structural, buoyancy, and end-cap layout calculations.",
    imageUrl: null
  },
  {
    id: "disc-3",
    title: "Technical Discussion of Development of ROV at Arobotics",
    date: "22 October 2019",
    participants: "Arobotics Engineers, Dr. S. Sakthivel Murugan, and Project Associates",
    summary: "Collaborative systems engineering review regarding industrial fabrication of waterproof ROV chassis hulls and thruster power allocation tables.",
    imageUrl: null
  },
  {
    id: "disc-4",
    title: "Discussion on Development of Underwater Sea-Battery",
    date: "14 October 2019",
    participants: "Mr. S. R. Elamaran & colleague (AMET University), Dr. S. Sakthivel Murugan",
    summary: "Research alignment session detailing materials and stack configurations for sea-water activated galvanic batteries designed for long-duration low-power subsea transponders.",
    imageUrl: null
  },
  {
    id: "disc-5",
    title: "Academic Research Collaborative Discussion Visit",
    date: "17 March 2022",
    participants: "Miss. A. Priya (Associate Professor, Crescent Institute), Scholars & Students",
    summary: "Miss. A. Priya along with her research scholars and PG cohorts visited the lab and discussed ongoing research on magnetic induction-based underground networks.",
    imageUrl: null
  }
];

export function hasDetailContent(item: any): boolean {
  if (!item) return false;
  
  // Check basic biography / summary text
  const bioText = item.bio || item.summary || item.description || item.fullDescription;
  if (bioText && bioText.trim() !== "") return true;

  // Check academic credentials / details
  if (item.qualification || item.specialization || item.researchArea || item.researchInterests) return true;
  if (item.orcid || item.googleScholar || item.cvId || item.link) return true;
  if (item.department || item.institution || item.designation) return true;
  if (item.mode || item.graduationDate || item.topic || item.duration || item.programme) return true;

  // Check projects/publications counts or arrays
  if (item.associatedProjects && item.associatedProjects.length > 0) return true;
  if (item.projectRoles && item.projectRoles.length > 0) return true;
  if (item.publicationCount && item.publicationCount > 0) return true;
  if (item.participants) return true;

  // Check images/gallery
  const normalized = normalizeImages(item);
  if (normalized.length > 0) return true;
  if (item.galleryImages && item.galleryImages.length > 0) return true;

  return false;
}

// Shared CardImageCarousel imported from components


// ----------------- AVATAR FALLBACK RENDERER -----------------

function PersonAvatar({ imageUrl, name, themeColor }: { imageUrl: string | null; name: string; themeColor: string }) {
  if (isValidImage(imageUrl)) {
    return (
      <div className="relative aspect-square w-16 h-16 rounded-full overflow-hidden border border-border/40 bg-muted shrink-0 shadow-xs">
        <img src={resolveAssetUrl(imageUrl)} alt={name} className="h-full w-full object-cover" />
      </div>
    );
  }

  const gradients: Record<string, string> = {
    indigo: "from-indigo-500/20 to-indigo-600/35 text-indigo-500 border-indigo-500/20",
    sky: "from-sky-500/20 to-sky-600/35 text-sky-500 border-sky-500/20",
    teal: "from-teal-500/20 to-teal-600/35 text-teal-500 border-teal-500/20",
    emerald: "from-emerald-500/20 to-emerald-600/35 text-emerald-500 border-emerald-500/20",
    blue: "from-blue-500/20 to-blue-600/35 text-blue-500 border-blue-500/20",
    cyan: "from-cyan-500/20 to-cyan-600/35 text-cyan-500 border-cyan-500/20",
    amber: "from-amber-500/20 to-amber-600/35 text-amber-500 border-amber-500/20",
  };

  const gradientClass = gradients[themeColor] || "from-secondary to-muted text-text-muted border-border/40";
  
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`relative aspect-square w-16 h-16 rounded-full flex items-center justify-center text-sm font-black border tracking-wide bg-gradient-to-br select-none ${gradientClass}`}
    >
      {initials}
    </div>
  );
}

// ----------------- UNIFIED DETAIL MODAL -----------------

interface DetailModalProps {
  item: any;
  themeColor: string;
  onClose: () => void;
}

function PersonDetailModal({ item, themeColor, onClose }: DetailModalProps) {
  if (!item) return null;

  // Compute unique gallery images (exclude thumbnail/imageUrl duplication)
  const hasGallery = !!((item.galleryImages && item.galleryImages.filter(isValidImage).length > 0) || isValidImage(item.imageUrl || item.thumbnail));
  const galleryImages = [
    ...(isValidImage(item.imageUrl || item.thumbnail) ? [item.imageUrl || item.thumbnail] : []),
    ...(item.galleryImages || []).filter(isValidImage)
  ].filter((v, i, self) => self.indexOf(v) === i);

  // Field validation to prevent empty labels/sections
  const showFacultyDetails = !!(item.department || item.institution || item.designation);
  const showProjectDetails = item.roleCategory !== "faculty" && !!((item.associatedProjects && item.associatedProjects.length > 0) || (item.projectRoles && item.projectRoles.length > 0));
  const showScholarDetails = item.roleCategory !== "faculty" && item.roleCategory !== "phd" && !!(item.mode || item.status || item.role || item.associatedProject);
  const showPhDDetails = !!(item.researchArea || item.graduationDate);
  const showDiscussionDetails = !!(item.participants || item.summary);

  const themeColors: Record<string, { text: string; bg: string; border: string }> = {
    indigo: { text: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    sky: { text: "text-sky-500", bg: "bg-sky-500/10", border: "border-sky-500/20" },
    teal: { text: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    emerald: { text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    blue: { text: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    cyan: { text: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    amber: { text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  };

  const currentTheme = themeColors[themeColor] || { text: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs transition-opacity duration-300"
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
        <div className="flex items-start gap-4 pr-8">
          {!showDiscussionDetails ? (
            <PersonAvatar imageUrl={item.imageUrl} name={item.name || item.title} themeColor={themeColor} />
          ) : (
            <div className={`p-2.5 rounded-xl ${currentTheme.bg} ${currentTheme.text} shrink-0 border ${currentTheme.border}`}>
              <BookOpen className="h-5 w-5" />
            </div>
          )}
          <div className="space-y-1 mt-1">
            <h3 className="text-lg font-black leading-snug font-sans text-foreground">
              {item.name || item.title}
            </h3>
            {item.designation && (
              <p className="text-xs text-text-secondary font-medium font-sans">
                {item.designation}
              </p>
            )}
            {item.status && item.roleCategory !== "scholar" && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-5xs font-bold uppercase tracking-wider border ${
                item.status === "Completed" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                item.status === "Thesis Submitted" ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20" :
                "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}>
                {item.status}
              </span>
            )}
          </div>
        </div>

        {/* Modal Content Flow */}
        <div className="space-y-6">
          {/* Faculty / Insitution Info */}
          {showFacultyDetails && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Institution Profile</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1">
                {item.department && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Department</span>
                    <span className="font-semibold text-foreground leading-relaxed">{item.department}</span>
                  </div>
                )}
                {item.institution && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Institution</span>
                    <span className="font-semibold text-foreground leading-relaxed">{item.institution}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Research Credentials (Faculty profile enhancements) */}
          {(item.specialization || item.orcid || item.googleScholar || item.cvId || item.qualification || item.researchArea || item.researchInterests) && item.roleCategory !== "phd" && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Academic & Research Profile</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1">
                {item.qualification && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Qualification</span>
                    <span className="font-semibold text-foreground leading-relaxed">{item.qualification}</span>
                  </div>
                )}
                {item.specialization && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Specialization</span>
                    <span className="font-semibold text-foreground leading-relaxed">{item.specialization}</span>
                  </div>
                )}
                {item.researchArea && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Research Area</span>
                    <span className="font-semibold text-foreground leading-relaxed">{item.researchArea}</span>
                  </div>
                )}
                {item.researchInterests && (
                  <div className="col-span-2">
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Research Interests</span>
                    <span className="font-semibold text-foreground leading-relaxed">{item.researchInterests}</span>
                  </div>
                )}
                {item.orcid && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold font-mono">ORCID</span>
                    <a href={`https://orcid.org/${item.orcid}`} target="_blank" rel="noopener noreferrer" className="font-mono text-cyan-500 hover:underline">{item.orcid}</a>
                  </div>
                )}
                {item.googleScholar && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Google Scholar</span>
                    <a href={item.googleScholar} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline break-all">Scholar Profile &rarr;</a>
                  </div>
                )}
                {item.cvId && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">
                      {(item.role === "intern" || item.topic) ? "Internship Certificate" : "Curriculum Vitae"}
                    </span>
                    <a
                      href={resolveAssetUrl(item.cvId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-500 hover:underline font-bold"
                    >
                      {(item.role === "intern" || item.topic) ? "Download Internship Certificate" : "Download CV PDF"} &rarr;
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Details (Faculty profile contact fields) */}
          {(item.email || item.phone) && item.role === "faculty" && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Contact Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1 font-mono">
                {item.email && (
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold font-sans">Email Address</span>
                    <a href={`mailto:${item.email}`} className="font-semibold text-cyan-500 hover:underline break-all">{item.email}</a>
                  </div>
                )}
                {item.phone && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold font-sans">Telephone / Extension</span>
                    <span className="font-semibold text-foreground">{item.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Research Scholars Detailed Status */}
          {showScholarDetails && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Scholar Registry</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1">
                {item.mode && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Study Mode</span>
                    <span className="font-semibold text-foreground">{item.mode}</span>
                  </div>
                )}
                {item.role && item.roleCategory !== "scholar" && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Deployment Role</span>
                    <span className="font-semibold text-foreground">{item.role}</span>
                  </div>
                )}
                {item.associatedProject && (
                  <div className="col-span-2">
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Project Affiliation</span>
                    <span className="font-semibold text-foreground">{item.associatedProject}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PhD Graduates / Timeline Info */}
          {showPhDDetails && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Doctoral Thesis</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-1">
                {item.researchArea && (
                  <div className="col-span-2">
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Research Domain</span>
                    <span className="font-semibold text-foreground leading-relaxed">{item.researchArea}</span>
                  </div>
                )}
                {item.graduationDate && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Conferment Date</span>
                    <span className="font-semibold text-foreground">{item.graduationDate}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Internship details */}
          {item.topic && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Internship Registry</h4>
              <div className="space-y-2 text-xs mt-1">
                <div>
                  <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Assigned Task / Topic</span>
                  <span className="font-semibold text-foreground leading-relaxed">{item.topic}</span>
                </div>
                {item.duration && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Deployment Duration</span>
                    <span className="font-semibold text-foreground">{item.duration}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Roles & Affiliated Projects */}
          {showProjectDetails && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Lab Consortium Roles</h4>
              <div className="space-y-3 mt-1 text-xs">
                {item.projectRoles && item.projectRoles.length > 0 && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Consortium Title</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.projectRoles.map((role: string, rIdx: number) => (
                        <span key={rIdx} className={`px-2 py-0.5 text-5xs font-bold font-mono rounded ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {item.associatedProjects && item.associatedProjects.length > 0 && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Supervised Projects</span>
                    <ul className="space-y-1.5 mt-1">
                      {item.associatedProjects.map((proj: string, pIdx: number) => (
                        <li key={pIdx} className="flex items-start gap-2 text-text-secondary leading-snug">
                          <span className={`h-1.5 w-1.5 rounded-full mt-1 shrink-0 bg-cyan-500`} />
                          <span className="font-medium">{proj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Technical Discussion details */}
          {showDiscussionDetails && (
            <div className="space-y-3 pt-4 border-t border-border/40 font-sans">
              {item.roleCategory === "discussion" && item.images && item.images.length > 0 && (
                <div className="mb-4">
                  <ModalImageCarousel images={item.images} title={item.name || item.title} themeColor="amber" />
                </div>
              )}
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Discussion Records</h4>
              <div className="space-y-3 text-xs mt-1">
                {item.participants && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Participants / Cohorts</span>
                    <span className="font-semibold text-foreground leading-relaxed">{item.participants}</span>
                  </div>
                )}
                {item.summary && (
                  <div>
                    <span className="text-5xs uppercase tracking-wider text-text-muted block font-semibold">Session Summary</span>
                    <p className="text-text-secondary leading-relaxed font-normal mt-1">{item.summary}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Faculty / Staff Bios */}
          {item.bio && (
            <div className="space-y-2 pt-4 border-t border-border/40">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Biography / Synopsis</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-sans mt-1">{item.bio}</p>
            </div>
          )}

          {/* Links Section */}
          {item.link && !item.isPastContributor && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Reference Links</h4>
              <div className="mt-1">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-500 font-bold hover:underline"
                >
                  View Academic Profile <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          )}


          {/* Photo Gallery (when images uploaded in the future) */}
          {hasGallery && galleryImages.length > 0 && item.roleCategory !== "discussion" && (
            <div className="space-y-2 pt-4 border-t border-border/40 font-sans">
              <h4 className={`text-4xs font-mono font-bold uppercase tracking-wider ${currentTheme.text}`}>Uploaded Photo Records</h4>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 mt-2">
                {galleryImages.map((img: string, index: number) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-border/40 bg-muted">
                    <img
                      src={resolveAssetUrl(img)}
                      alt={`Photo record ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
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

// ----------------- PASSPORT LAYOUT CARD -----------------

interface PassportPersonCardProps {
  name: string;
  role?: string;
  institution?: string;
  description?: string;
  imageUrl: string | null;
  link?: string;
  linkText?: string;
  themeColor: string;
  onClick?: () => void;
}

function PassportPersonCard({
  name,
  role,
  institution,
  description,
  imageUrl,
  link,
  linkText = "Profile",
  themeColor,
  onClick,
}: PassportPersonCardProps) {
  const themeTextColors: Record<string, string> = {
    indigo: "text-indigo-400 group-hover:text-indigo-300",
    sky: "text-sky-400 group-hover:text-sky-300",
    teal: "text-teal-400 group-hover:text-teal-300",
    emerald: "text-emerald-400 group-hover:text-emerald-300",
    blue: "text-blue-400 group-hover:text-blue-300",
    cyan: "text-cyan-400 group-hover:text-cyan-300",
    amber: "text-amber-400 group-hover:text-amber-300",
  };

  const themeBorderColors: Record<string, string> = {
    indigo: "hover:border-indigo-500/35",
    sky: "hover:border-sky-500/35",
    teal: "hover:border-teal-500/35",
    emerald: "hover:border-emerald-500/35",
    blue: "hover:border-blue-500/35",
    cyan: "hover:border-cyan-500/35",
    amber: "hover:border-amber-500/35",
  };

  const textTheme = themeTextColors[themeColor] || "text-cyan-400 group-hover:text-cyan-300";
  const borderTheme = themeBorderColors[themeColor] || "hover:border-cyan-500/35";

  return (
    <div 
      onClick={onClick}
      className={`group relative rounded-2xl border border-border bg-card/60 p-4 transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] select-none flex flex-col items-center text-center ${borderTheme} ${onClick ? "cursor-pointer" : ""}`}
    >
      {/* Photo Container */}
      {isValidImage(imageUrl) && (
        <div className="relative aspect-square w-full rounded-xl overflow-hidden border border-border/40 bg-muted mb-4 shadow-inner">
          <img
            src={resolveAssetUrl(imageUrl)}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Profile Details */}
      <div className="w-full flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          <h4 className="font-bold text-foreground text-xs leading-tight transition-colors">
            {name}
          </h4>

          {role && (
            <span className={`inline-block text-[10px] font-semibold ${textTheme}`}>
              {role}
            </span>
          )}

          {institution && (
            <p className={`text-5xs text-text-muted font-sans font-medium uppercase tracking-wider ${onClick ? "line-clamp-1" : ""}`}>
              {institution}
            </p>
          )}

          {description && (
            <p className={`text-4xs text-text-secondary leading-relaxed font-sans mt-1 ${onClick ? "line-clamp-2" : ""}`}>
              {description}
            </p>
          )}

        </div>

        {link && (
          <div className="pt-2 flex justify-center">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`inline-flex items-center gap-1 text-[10px] font-bold ${textTheme} hover:underline`}
            >
              {linkText} <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// Save module-level static exports to avoid Temporal Dead Zone (TDZ) reference errors during shadowing
const STATIC_TEAM_MEMBERS = TEAM_MEMBERS;
const STATIC_RESEARCH_SCHOLARS = RESEARCH_SCHOLARS;
const STATIC_PROJECT_STAFF = PROJECT_STAFF;
const STATIC_PHD_GRADUATES = PHD_GRADUATES;
const STATIC_UG_STUDENTS = UG_STUDENTS;
const STATIC_UG_ALUMNI = UG_ALUMNI;
const STATIC_PG_ALUMNI = PG_ALUMNI;
const STATIC_INTERNSHIPS = INTERNSHIPS;

// ----------------- PEOPLE PAGE ROUTE COMPONENT -----------------

function PeoplePage() {
  const settings = useSiteSettings();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [selectedTheme, setSelectedTheme] = useState<string>("cyan");

  const openDetail = (item: any, theme: string) => {
    setSelectedItem(item);
    setSelectedTheme(theme);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  // Shadow variables with reactive useDatasetRecords store hook
  const staticMembers = useMemo(() => [
    ...STATIC_TEAM_MEMBERS.map(m => ({ ...m, role: "faculty", title: m.name })),
    ...STATIC_RESEARCH_SCHOLARS.map(m => ({ ...m, role: "scholar", title: m.name })),
    ...STATIC_PROJECT_STAFF.map(m => ({ ...m, role: "staff", title: m.name })),
    ...STATIC_PHD_GRADUATES.map(m => ({ ...m, role: "phd", title: m.name })),
    ...STATIC_UG_STUDENTS.map(m => ({ ...m, role: "student", title: m.name })),
    ...STATIC_UG_ALUMNI.map(m => ({ ...m, role: "alumni", title: m.name })),
    ...STATIC_PG_ALUMNI.map(m => ({ ...m, role: "alumni", title: m.name, programme: m.programme })),
  ], []);

  const allMembersRaw = useDatasetRecords("people-members", staticMembers) as any[];
  const allMembers = useMemo(() => {
    return allMembersRaw.filter(m => m.status !== "past-contributor");
  }, [allMembersRaw]);

  const allMembersPast = useMemo(() => {
    return allMembersRaw.filter(m => m.status === "past-contributor");
  }, [allMembersRaw]);

  const rawInternships = useDatasetRecords("people-internships", STATIC_INTERNSHIPS) as any[];
  const INTERNSHIPS = useMemo(() => {
    return rawInternships.filter(i => i.status !== "past-contributor").map(i => ({
      ...i,
      roleCategory: "intern",
      imageUrl: i.imageUrl || i.thumbnail || null
    }));
  }, [rawInternships]);

  const INTERNSHIPS_PAST = useMemo(() => {
    return rawInternships.filter(i => i.status === "past-contributor").map(i => ({
      ...i,
      roleCategory: "intern",
      imageUrl: i.imageUrl || i.thumbnail || null
    }));
  }, [rawInternships]);

  const rawDiscussions = useDatasetRecords("research-discussions", STATIC_TECHNICAL_DISCUSSIONS) as any[];
  const TECHNICAL_DISCUSSIONS = useMemo(() => {
    return rawDiscussions.map(disc => {
      const normImages = normalizeImages(disc);
      return {
        id: disc.id,
        title: disc.title || disc.name || "",
        date: disc.date || "",
        participants: disc.participants || "",
        summary: disc.summary || "",
        imageUrl: normImages[0] || null,
        images: normImages,
        galleryImages: disc.galleryImages || [],
        roleCategory: "discussion"
      };
    }) as any[];
  }, [rawDiscussions]);

  // Re-split members into separate list states with original types
  const TEAM_MEMBERS = useMemo(() => {
    return allMembers.filter(m => m.role === "faculty").map(m => ({
      id: m.id,
      role: "faculty",
      roleCategory: "faculty",
      name: m.title || m.name || "",
      designation: m.designation || "",
      department: m.department || "",
      institution: m.institution || "",
      projectRoles: m.projectRoles || [],
      associatedProjects: m.associatedProjects || [],
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || "",
      bio: m.bio || "",
      qualification: m.qualification || "",
      specialization: m.specialization || "",
      researchArea: m.researchArea || "",
      researchInterests: m.researchInterests || "",
      email: m.email || "",
      phone: m.phone || "",
      orcid: m.orcid || "",
      googleScholar: m.googleScholar || "",
      cvId: m.cvId || ""
    })) as FacultyMember[];
  }, [allMembers]);

  const TEAM_MEMBERS_PAST = useMemo(() => {
    return allMembersPast.filter(m => m.role === "faculty").map(m => ({
      id: m.id,
      role: "faculty",
      roleCategory: "faculty",
      name: m.title || m.name || "",
      designation: m.designation || "",
      department: m.department || "",
      institution: m.institution || "",
      projectRoles: m.projectRoles || [],
      associatedProjects: m.associatedProjects || [],
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || "",
      bio: m.bio || "",
      qualification: m.qualification || "",
      specialization: m.specialization || "",
      researchArea: m.researchArea || "",
      researchInterests: m.researchInterests || "",
      email: m.email || "",
      phone: m.phone || "",
      orcid: m.orcid || "",
      googleScholar: m.googleScholar || "",
      cvId: m.cvId || ""
    })) as FacultyMember[];
  }, [allMembersPast]);

  const RESEARCH_SCHOLARS = useMemo(() => {
    return allMembers.filter(m => m.role === "scholar" || m.role === "scholars").map(m => ({
      id: m.id,
      roleCategory: "scholar",
      name: m.title || m.name || "",
      mode: m.mode || "Full Time",
      status: m.status || "Active",
      role: m.role_in_project || m.designation || m.role || "",
      associatedProject: m.associatedProject || "",
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || ""
    })) as ResearchScholar[];
  }, [allMembers]);

  const RESEARCH_SCHOLARS_PAST = useMemo(() => {
    return allMembersPast.filter(m => m.role === "scholar" || m.role === "scholars").map(m => ({
      id: m.id,
      roleCategory: "scholar",
      name: m.title || m.name || "",
      mode: m.mode || "Full Time",
      status: m.status || "Active",
      role: m.role_in_project || m.designation || m.role || "",
      associatedProject: m.associatedProject || "",
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || ""
    })) as ResearchScholar[];
  }, [allMembersPast]);

  const PROJECT_STAFF = useMemo(() => {
    return allMembers.filter(m => m.role === "staff").map(m => ({
      id: m.id,
      roleCategory: "staff",
      name: m.title || m.name || "",
      role: m.role || m.designation || "",
      project: m.project || m.associatedProject || "",
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || ""
    })) as ProjectStaff[];
  }, [allMembers]);

  const PROJECT_STAFF_PAST = useMemo(() => {
    return allMembersPast.filter(m => m.role === "staff").map(m => ({
      id: m.id,
      roleCategory: "staff",
      name: m.title || m.name || "",
      role: m.role || m.designation || "",
      project: m.project || m.associatedProject || "",
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || ""
    })) as ProjectStaff[];
  }, [allMembersPast]);

  const PHD_GRADUATES = useMemo(() => {
    return allMembers.filter(m => m.role === "phd").map(m => ({
      id: m.id,
      roleCategory: "phd",
      name: m.title || m.name || "",
      researchArea: m.researchArea || "",
      graduationDate: m.graduationDate || "",
      status: "Completed" as const,
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || ""
    })) as PhDGraduate[];
  }, [allMembers]);

  const PHD_GRADUATES_PAST = useMemo(() => {
    return allMembersPast.filter(m => m.role === "phd").map(m => ({
      id: m.id,
      roleCategory: "phd",
      name: m.title || m.name || "",
      researchArea: m.researchArea || "",
      graduationDate: m.graduationDate || "",
      status: "Completed" as const,
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || ""
    })) as PhDGraduate[];
  }, [allMembersPast]);

  const UG_STUDENTS = useMemo(() => {
    return allMembers.filter(m => m.role === "student").map(m => ({
      id: m.id,
      roleCategory: "student",
      name: m.title || m.name || "",
      status: "Current Student" as const,
      imageUrl: m.imageUrl || m.thumbnail || null
    })) as UGStudent[];
  }, [allMembers]);

  const UG_STUDENTS_PAST = useMemo(() => {
    return allMembersPast.filter(m => m.role === "student").map(m => ({
      id: m.id,
      roleCategory: "student",
      name: m.title || m.name || "",
      status: "Current Student" as const,
      imageUrl: m.imageUrl || m.thumbnail || null
    })) as UGStudent[];
  }, [allMembersPast]);

  const UG_ALUMNI = useMemo(() => {
    return allMembers.filter(m => m.role === "alumni" && !m.programme).map(m => ({
      id: m.id,
      roleCategory: "alumni",
      name: m.title || m.name || "",
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || "",
      institution: m.institution || "",
      duration: m.duration || m.period || "",
      topic: m.topic || m.area || m.researchArea || m.description || "",
      status: m.status || ""
    })) as UGAlumnus[];
  }, [allMembers]);

  const UG_ALUMNI_PAST = useMemo(() => {
    return allMembersPast.filter(m => m.role === "alumni" && !m.programme).map(m => ({
      id: m.id,
      roleCategory: "alumni",
      name: m.title || m.name || "",
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || "",
      institution: m.institution || "",
      duration: m.duration || m.period || "",
      topic: m.topic || m.area || m.researchArea || m.description || "",
      status: m.status || ""
    })) as UGAlumnus[];
  }, [allMembersPast]);

  const PG_ALUMNI = useMemo(() => {
    return allMembers.filter(m => m.role === "alumni" && m.programme).map(m => ({
      id: m.id,
      roleCategory: "alumni",
      name: m.title || m.name || "",
      programme: m.programme || "",
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || "",
      institution: m.institution || "",
      duration: m.duration || m.period || "",
      topic: m.topic || m.area || m.researchArea || m.description || "",
      status: m.status || ""
    })) as PGAlumnus[];
  }, [allMembers]);

  const PG_ALUMNI_PAST = useMemo(() => {
    return allMembersPast.filter(m => m.role === "alumni" && m.programme).map(m => ({
      id: m.id,
      roleCategory: "alumni",
      name: m.title || m.name || "",
      programme: m.programme || "",
      imageUrl: m.imageUrl || m.thumbnail || null,
      link: m.link || "",
      institution: m.institution || "",
      duration: m.duration || m.period || "",
      topic: m.topic || m.area || m.researchArea || m.description || "",
      status: m.status || ""
    })) as PGAlumnus[];
  }, [allMembersPast]);

  // Stats derived dynamically (UG students removed)
  const stats = useMemo(() => {
    return [
      { label: "Team Members", count: TEAM_MEMBERS.length + TEAM_MEMBERS_PAST.length, icon: GraduationCap, theme: "indigo", id: "faculty" },
      { label: "Research Scholars", count: RESEARCH_SCHOLARS.length + RESEARCH_SCHOLARS_PAST.length, icon: Users, theme: "sky", id: "scholars" },
      { label: "Project Staff", count: PROJECT_STAFF.length + PROJECT_STAFF_PAST.length, icon: Briefcase, theme: "teal", id: "staff" },
      { label: "PhD Graduates", count: PHD_GRADUATES.length + PHD_GRADUATES_PAST.length, icon: Award, theme: "emerald", id: "phd" },
      { label: "UG Alumni", count: UG_ALUMNI.length + UG_ALUMNI_PAST.length, icon: Users, theme: "blue", id: "ug-alumni" },
      { label: "PG Alumni", count: PG_ALUMNI.length + PG_ALUMNI_PAST.length, icon: Users, theme: "blue", id: "pg-alumni" },
      { label: "Interns", count: INTERNSHIPS.length + INTERNSHIPS_PAST.length, icon: Sparkles, theme: "cyan", id: "interns" }
    ];
  }, [TEAM_MEMBERS, TEAM_MEMBERS_PAST, RESEARCH_SCHOLARS, RESEARCH_SCHOLARS_PAST, PROJECT_STAFF, PROJECT_STAFF_PAST, PHD_GRADUATES, PHD_GRADUATES_PAST, UG_ALUMNI, UG_ALUMNI_PAST, PG_ALUMNI, PG_ALUMNI_PAST, INTERNSHIPS, INTERNSHIPS_PAST]);

  // Section smooth scrolling helper with header offset
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 110;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Nav Items (UG students removed)
  const navItems = useMemo(() => [
    { label: "Faculty", id: "faculty", count: TEAM_MEMBERS.length + TEAM_MEMBERS_PAST.length, theme: "indigo" as const },
    { label: "Research Scholars", id: "scholars", count: RESEARCH_SCHOLARS.length + RESEARCH_SCHOLARS_PAST.length, theme: "sky" as const },
    { label: "Project Staff", id: "staff", count: PROJECT_STAFF.length + PROJECT_STAFF_PAST.length, theme: "teal" as const },
    { label: "PhD Graduates", id: "phd", count: PHD_GRADUATES.length + PHD_GRADUATES_PAST.length, theme: "emerald" as const },
    { label: "UG Alumni", id: "ug-alumni", count: UG_ALUMNI.length + UG_ALUMNI_PAST.length, theme: "blue" as const },
    { label: "PG Alumni", id: "pg-alumni", count: PG_ALUMNI.length + PG_ALUMNI_PAST.length, theme: "indigo" as const },
    { label: "Internships", id: "interns", count: INTERNSHIPS.length + INTERNSHIPS_PAST.length, theme: "cyan" as const }
  ], [TEAM_MEMBERS, TEAM_MEMBERS_PAST, RESEARCH_SCHOLARS, RESEARCH_SCHOLARS_PAST, PROJECT_STAFF, PROJECT_STAFF_PAST, PHD_GRADUATES, PHD_GRADUATES_PAST, UG_ALUMNI, UG_ALUMNI_PAST, PG_ALUMNI, PG_ALUMNI_PAST, INTERNSHIPS, INTERNSHIPS_PAST]);

  // Search & Filter States
  const [facultySearch, setFacultySearch] = useState("");
  const [scholarSearch, setScholarSearch] = useState("");
  const [scholarStatusFilter, setScholarStatusFilter] = useState("All");

  const [ugAlumniSearch, setUgAlumniSearch] = useState("");
  const [pgAlumniSearch, setPgAlumniSearch] = useState("");

  const [internSearch, setInternSearch] = useState("");
  const [internSortField, setInternSortField] = useState<"name" | "institution" | "duration" | null>(null);
  const [internSortOrder, setInternSortOrder] = useState<"asc" | "desc">("asc");

  const [discussionSearch, setDiscussionSearch] = useState("");

  // Filtered Faculty
  const filteredFaculty = useMemo(() => {
    return TEAM_MEMBERS.filter((fac) =>
      String(fac.name ?? "").toLowerCase().includes(facultySearch.toLowerCase().trim())
    );
  }, [TEAM_MEMBERS, facultySearch]);

  // Filtered Faculty Past
  const filteredFacultyPast = useMemo(() => {
    return TEAM_MEMBERS_PAST.filter((fac) =>
      String(fac.name ?? "").toLowerCase().includes(facultySearch.toLowerCase().trim())
    );
  }, [TEAM_MEMBERS_PAST, facultySearch]);

  // Filtered Scholars
  const filteredScholars = useMemo(() => {
    return RESEARCH_SCHOLARS.filter((sch) => {
      const matchesSearch = String(sch.name ?? "").toLowerCase().includes(scholarSearch.toLowerCase().trim());
      const matchesStatus = scholarStatusFilter === "All" || sch.status === scholarStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [RESEARCH_SCHOLARS, scholarSearch, scholarStatusFilter]);

  // Filtered Scholars Past
  const filteredScholarsPast = useMemo(() => {
    return RESEARCH_SCHOLARS_PAST.filter((sch) => {
      const matchesSearch = String(sch.name ?? "").toLowerCase().includes(scholarSearch.toLowerCase().trim());
      const matchesStatus = scholarStatusFilter === "All" || sch.status === scholarStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [RESEARCH_SCHOLARS_PAST, scholarSearch, scholarStatusFilter]);

  // Filtered UG Alumni
  const filteredUgAlumni = useMemo(() => {
    return UG_ALUMNI.filter((al) =>
      String(al.name ?? "").toLowerCase().includes(ugAlumniSearch.toLowerCase().trim())
    );
  }, [UG_ALUMNI, ugAlumniSearch]);

  // Filtered UG Alumni Past
  const filteredUgAlumniPast = useMemo(() => {
    return UG_ALUMNI_PAST.filter((al) =>
      String(al.name ?? "").toLowerCase().includes(ugAlumniSearch.toLowerCase().trim())
    );
  }, [UG_ALUMNI_PAST, ugAlumniSearch]);

  // Filtered PG Alumni
  const filteredPgAlumni = useMemo(() => {
    return PG_ALUMNI.filter((al) =>
      String(al.name ?? "").toLowerCase().includes(pgAlumniSearch.toLowerCase().trim())
    );
  }, [PG_ALUMNI, pgAlumniSearch]);

  // Filtered PG Alumni Past
  const filteredPgAlumniPast = useMemo(() => {
    return PG_ALUMNI_PAST.filter((al) =>
      String(al.name ?? "").toLowerCase().includes(pgAlumniSearch.toLowerCase().trim())
    );
  }, [PG_ALUMNI_PAST, pgAlumniSearch]);

  // Filtered & Sorted Internships
  const processedInternships = useMemo(() => {
    let list = [...INTERNSHIPS];

    if (internSearch.trim()) {
      const q = internSearch.toLowerCase().trim();
      list = list.filter(
        (i) =>
          String(i.name ?? "").toLowerCase().includes(q) ||
          String(i.institution ?? "").toLowerCase().includes(q)
      );
    }

    if (internSortField) {
      list.sort((a, b) => {
        let valA = "";
        let valB = "";

        if (internSortField === "name") {
          valA = String(a.name ?? "").toLowerCase();
          valB = String(b.name ?? "").toLowerCase();
        } else if (internSortField === "institution") {
          valA = String(a.institution ?? "").toLowerCase();
          valB = String(b.institution ?? "").toLowerCase();
        } else if (internSortField === "duration") {
          valA = String(a.duration ?? "").toLowerCase();
          valB = String(b.duration ?? "").toLowerCase();
        }

        if (valA < valB) return internSortOrder === "asc" ? -1 : 1;
        if (valA > valB) return internSortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [INTERNSHIPS, internSearch, internSortField, internSortOrder]);

  // Filtered & Sorted Internships Past
  const processedInternshipsPast = useMemo(() => {
    let list = [...INTERNSHIPS_PAST];

    if (internSearch.trim()) {
      const q = internSearch.toLowerCase().trim();
      list = list.filter(
        (i) =>
          String(i.name ?? "").toLowerCase().includes(q) ||
          String(i.institution ?? "").toLowerCase().includes(q)
      );
    }

    if (internSortField) {
      list.sort((a, b) => {
        let valA = "";
        let valB = "";

        if (internSortField === "name") {
          valA = String(a.name ?? "").toLowerCase();
          valB = String(b.name ?? "").toLowerCase();
        } else if (internSortField === "institution") {
          valA = String(a.institution ?? "").toLowerCase();
          valB = String(b.institution ?? "").toLowerCase();
        } else if (internSortField === "duration") {
          valA = String(a.duration ?? "").toLowerCase();
          valB = String(b.duration ?? "").toLowerCase();
        }

        if (valA < valB) return internSortOrder === "asc" ? -1 : 1;
        if (valA > valB) return internSortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [INTERNSHIPS_PAST, internSearch, internSortField, internSortOrder]);

  const handleInternSort = (field: "name" | "institution" | "duration") => {
    if (internSortField === field) {
      setInternSortOrder(internSortOrder === "asc" ? "desc" : "asc");
    } else {
      setInternSortField(field);
      setInternSortOrder("asc");
    }
  };

  // Filtered Discussions
  const filteredDiscussions = useMemo(() => {
    return TECHNICAL_DISCUSSIONS.filter((disc) =>
      String(disc.title ?? "").toLowerCase().includes(discussionSearch.toLowerCase().trim())
    );
  }, [TECHNICAL_DISCUSSIONS, discussionSearch]);

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-300 page-people">
      
      {/* 1. Hero Section */}
      <PageHero
        title={settings.peopleHero?.title || "People"}
        subtitle={settings.peopleHero?.subtitle || "ORL Research Personnel"}
        description={settings.peopleHero?.description || "Meet the faculty, research scholars, project engineers, and student cohorts driving underwater acoustic telemetry, subsea vehicle designs, and optical communication trials."}
        mediaType={settings.peopleHero?.mediaType || "none"}
        mediaUrl={settings.peopleHero?.mediaUrl || ""}
        mediaPosition={settings.peopleHero?.mediaPosition || "background"}
        overlayOpacity={settings.peopleHero?.overlayOpacity !== undefined ? settings.peopleHero.overlayOpacity : 60}
      />

      <StickySectionNav items={navItems} />

      {/* Main Content Sections */}
      <div className="mx-auto max-w-5xl px-6 mt-12 space-y-16">
        
        {/* 2. Faculty Section (Indigo Theme) */}
        <section id="faculty" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-indigo-500">Faculty</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Faculty</h2>
            </div>
            
            {/* Search filter */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search faculty..."
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-indigo-500/50 transition"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {filteredFaculty.map((member) => (
              <PassportPersonCard
                key={member.id}
                name={member.name}
                role={member.designation}
                institution={member.institution}
                description={member.department}
                imageUrl={member.imageUrl}
                link={member.link}
                themeColor="indigo"
                onClick={() => openDetail(member, "indigo")}
              />
            ))}
            {filteredFaculty.length === 0 && (
              <div className="col-span-4 text-center text-text-muted text-xs py-6">
                {TEAM_MEMBERS.length === 0 ? "No records available." : "No active faculty members found."}
              </div>
            )}
          </div>

          {TEAM_MEMBERS_PAST.length > 0 && (
            <div className="mt-8 space-y-4 pt-6 border-t border-border/20">
              <h3 className="text-sm font-bold tracking-tight text-text-secondary font-sans">
                Past Contributors (Faculty)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {filteredFacultyPast.map((member) => (
                  <PassportPersonCard
                    key={member.id}
                    name={member.name}
                    role={member.designation}
                    institution={member.institution}
                    description={member.department}
                    imageUrl={member.imageUrl}
                    themeColor="indigo"
                    onClick={hasDetailContent(member) ? () => openDetail({ ...member, isPastContributor: true }, "indigo") : undefined}
                  />
                ))}
                {filteredFacultyPast.length === 0 && (
                  <div className="col-span-4 text-center text-text-muted text-xs py-6">
                    No past faculty members found matching search filter.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 3. Research Scholars (Sky Theme) */}
        <section id="scholars" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-sky-500">Doctoral Cohorts</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Research Scholars</h2>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search scholars..."
                  value={scholarSearch}
                  onChange={(e) => setScholarSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-40 focus:border-sky-500/50 transition"
                />
              </div>
              <select
                value={scholarStatusFilter}
                onChange={(e) => setScholarStatusFilter(e.target.value)}
                className="text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-sky-500/50 cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Thesis Submitted">Thesis Submitted</option>
                <option value="Active">Active Candidate</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {filteredScholars.map((scholar) => (
              <PassportPersonCard
                key={scholar.id}
                name={scholar.name}
                role={`${scholar.mode} Scholar`}
                institution="Ocean Research Laboratory"
                description={
                  scholar.role 
                    ? `Role: ${scholar.role}${scholar.associatedProject ? ` | Project: ${scholar.associatedProject}` : ""}` 
                    : scholar.associatedProject 
                      ? `Project: ${scholar.associatedProject}` 
                      : ""
                }
                imageUrl={scholar.imageUrl}
                link={scholar.link}
                themeColor="sky"
              />
            ))}
            {filteredScholars.length === 0 && (
              <div className="col-span-4 text-center text-text-muted text-xs py-6">
                {RESEARCH_SCHOLARS.length === 0 ? "No records available." : "No active scholars found."}
              </div>
            )}
          </div>

          {RESEARCH_SCHOLARS_PAST.length > 0 && (
            <div className="mt-8 space-y-4 pt-6 border-t border-border/20">
              <h3 className="text-sm font-bold tracking-tight text-text-secondary font-sans">
                Past Contributors (Research Scholars)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {filteredScholarsPast.map((scholar) => (
                  <PassportPersonCard
                    key={scholar.id}
                    name={scholar.name}
                    role={`${scholar.mode} Scholar`}
                    institution="Ocean Research Laboratory"
                    description={
                      scholar.role 
                        ? `Role: ${scholar.role}${scholar.associatedProject ? ` | Project: ${scholar.associatedProject}` : ""}` 
                        : scholar.associatedProject 
                          ? `Project: ${scholar.associatedProject}` 
                          : ""
                    }
                    imageUrl={scholar.imageUrl}
                    themeColor="sky"
                    onClick={hasDetailContent(scholar) ? () => openDetail({ ...scholar, isPastContributor: true }, "sky") : undefined}
                  />
                ))}
                {filteredScholarsPast.length === 0 && (
                  <div className="col-span-4 text-center text-text-muted text-xs py-6">
                    No past scholars found matching search filters.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 4. Project Staff (Teal Theme) */}
        <section id="staff" className="scroll-mt-24 space-y-6">
          <div className="border-b border-border/40 pb-4">
            <span className="text-5xs font-mono font-bold uppercase tracking-wider text-teal-500">Deployments</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Project Staff</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {PROJECT_STAFF.map((staff) => (
              <PassportPersonCard
                key={staff.id}
                name={staff.name}
                role={staff.role}
                institution="Ocean Research Laboratory"
                description={staff.project ? `Project: ${staff.project}` : ""}
                imageUrl={staff.imageUrl}
                link={staff.link}
                themeColor="teal"
              />
            ))}
            {PROJECT_STAFF.length === 0 && (
              <div className="col-span-4 text-center text-text-muted text-xs py-6">
                No active project staff found.
              </div>
            )}
          </div>

          {PROJECT_STAFF_PAST.length > 0 && (
            <div className="mt-8 space-y-4 pt-6 border-t border-border/20">
              <h3 className="text-sm font-bold tracking-tight text-text-secondary font-sans">
                Past Contributors (Project Staff)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {PROJECT_STAFF_PAST.map((staff) => (
                  <PassportPersonCard
                    key={staff.id}
                    name={staff.name}
                    role={staff.role}
                    institution="Ocean Research Laboratory"
                    description={staff.project ? `Project: ${staff.project}` : ""}
                    imageUrl={staff.imageUrl}
                    themeColor="teal"
                    onClick={hasDetailContent(staff) ? () => openDetail({ ...staff, isPastContributor: true }, "teal") : undefined}
                  />
                ))}
                {PROJECT_STAFF_PAST.length === 0 && (
                  <div className="col-span-4 text-center text-text-muted text-xs py-6">
                    No past project staff found.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 5. Graduated Doctoral Scholars (Ph.D.) (Emerald Theme) */}
        <section id="phd" className="scroll-mt-24 space-y-6">
          <div className="border-b border-border/40 pb-4">
            <span className="text-5xs font-mono font-bold uppercase tracking-wider text-emerald-500">Thesis Alumni</span>
            <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Graduated Doctoral Scholars</h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {PHD_GRADUATES.map((grad) => (
              <PassportPersonCard
                key={grad.id}
                name={grad.name}
                role="Doctoral Graduate"
                institution="Ocean Research Laboratory"
                description={
                  grad.researchArea 
                    ? `Domain: ${grad.researchArea}${grad.graduationDate ? ` (${grad.graduationDate})` : ""}` 
                    : grad.graduationDate 
                      ? `Graduated: ${grad.graduationDate}` 
                      : ""
                }
                imageUrl={grad.imageUrl}
                link={grad.link}
                themeColor="emerald"
              />
            ))}
            {PHD_GRADUATES.length === 0 && (
              <div className="col-span-4 text-center text-text-muted text-xs py-6">
                No doctoral graduates found.
              </div>
            )}
          </div>

          {PHD_GRADUATES_PAST.length > 0 && (
            <div className="mt-8 space-y-4 pt-6 border-t border-border/20">
              <h3 className="text-sm font-bold tracking-tight text-text-secondary font-sans">
                Past Contributors (PhD Graduates)
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {PHD_GRADUATES_PAST.map((grad) => (
                  <PassportPersonCard
                    key={grad.id}
                    name={grad.name}
                    role="Doctoral Graduate"
                    institution="Ocean Research Laboratory"
                    description={
                      grad.researchArea 
                        ? `Domain: ${grad.researchArea}${grad.graduationDate ? ` (${grad.graduationDate})` : ""}` 
                        : grad.graduationDate 
                          ? `Graduated: ${grad.graduationDate}` 
                          : ""
                    }
                    imageUrl={grad.imageUrl}
                    themeColor="emerald"
                    onClick={hasDetailContent(grad) ? () => openDetail({ ...grad, isPastContributor: true }, "emerald") : undefined}
                  />
                ))}
                {PHD_GRADUATES_PAST.length === 0 && (
                  <div className="col-span-4 text-center text-text-muted text-xs py-6">
                    No past doctoral graduates found.
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 6. Graduated Project Students (UG) (Blue Theme) */}
        <section id="ug-alumni" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-blue-500">Undergraduate Alumni</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Graduated Project Students (UG)</h2>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search UG alumni..."
                value={ugAlumniSearch}
                onChange={(e) => setUgAlumniSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-blue-500/50 transition"
              />
            </div>
          </div>

          <div className="orl-table-container overflow-x-auto">
            <table className="orl-table">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUgAlumni.map((al) => (
                  <tr key={al.id}>
                    <td className="px-4 py-3 align-top font-semibold text-foreground">
                      {al.link ? (
                        <a href={al.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                          {al.name}
                        </a>
                      ) : (
                        al.name
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-text-secondary">
                      {al.status ? (
                        al.status === "active" ? "Active" :
                        al.status === "past-contributor" ? "Past Contributor" :
                        al.status
                      ) : "—"}
                    </td>
                  </tr>
                ))}
                {filteredUgAlumni.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-4 py-6 text-center text-text-muted text-xs">
                      {UG_ALUMNI.length === 0 ? "No records available." : "No UG project students match search filter."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {UG_ALUMNI_PAST.length > 0 && (
            <div className="mt-8 space-y-4 pt-6 border-t border-border/20">
              <h3 className="text-sm font-bold tracking-tight text-text-secondary font-sans">
                Past Contributors (UG Alumni)
              </h3>
              <div className="orl-table-container overflow-x-auto">
                <table className="orl-table">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredUgAlumniPast.map((al) => (
                      <tr key={al.id}>
                        <td className="px-4 py-3 align-top font-semibold text-foreground">
                          {al.link ? (
                            <a href={al.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                              {al.name}
                            </a>
                          ) : (
                            al.name
                          )}
                        </td>
                        <td className="px-4 py-3 align-top text-text-secondary">
                          {al.status ? (
                            al.status === "active" ? "Active" :
                            al.status === "past-contributor" ? "Past Contributor" :
                            al.status
                          ) : "—"}
                        </td>
                      </tr>
                    ))}
                    {filteredUgAlumniPast.length === 0 && (
                      <tr>
                        <td colSpan={2} className="px-4 py-6 text-center text-text-muted text-xs">
                          No past UG project students match search filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* 7. Graduated Project Students (PG) (Blue Theme) */}
        <section id="pg-alumni" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-blue-500">Postgraduate Alumni</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Graduated Project Students (PG)</h2>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search PG alumni..."
                value={pgAlumniSearch}
                onChange={(e) => setPgAlumniSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-blue-500/50 transition"
              />
            </div>
          </div>

          <div className="orl-table-container overflow-x-auto">
            <table className="orl-table">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Programme / Topic</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredPgAlumni.map((al) => (
                  <tr key={al.id}>
                    <td className="px-4 py-3 align-top font-semibold text-foreground">
                      {al.link ? (
                        <a href={al.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                          {al.name}
                        </a>
                      ) : (
                        al.name
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-text-secondary">{al.programme || al.topic || "—"}</td>
                    <td className="px-4 py-3 align-top text-text-secondary">
                      {al.status ? (
                        al.status === "active" ? "Active" :
                        al.status === "past-contributor" ? "Past Contributor" :
                        al.status
                      ) : "—"}
                    </td>
                  </tr>
                ))}
                {filteredPgAlumni.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-center text-text-muted text-xs">
                      {PG_ALUMNI.length === 0 ? "No records available." : "No PG project students match search filter."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {PG_ALUMNI_PAST.length > 0 && (
            <div className="mt-8 space-y-4 pt-6 border-t border-border/20">
              <h3 className="text-sm font-bold tracking-tight text-text-secondary font-sans">
                Past Contributors (PG Alumni)
              </h3>
              <div className="orl-table-container overflow-x-auto">
                <table className="orl-table">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Programme / Topic</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredPgAlumniPast.map((al) => (
                      <tr key={al.id}>
                        <td className="px-4 py-3 align-top font-semibold text-foreground">
                          {al.link ? (
                            <a href={al.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition">
                              {al.name}
                            </a>
                          ) : (
                            al.name
                          )}
                        </td>
                        <td className="px-4 py-3 align-top text-text-secondary">{al.programme || al.topic || "—"}</td>
                        <td className="px-4 py-3 align-top text-text-secondary">
                          {al.status ? (
                            al.status === "active" ? "Active" :
                            al.status === "past-contributor" ? "Past Contributor" :
                            al.status
                          ) : "—"}
                        </td>
                      </tr>
                    ))}
                    {filteredPgAlumniPast.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-6 text-center text-text-muted text-xs">
                          No past PG project students match search filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* 9. Internship Section (Cyan Theme - Passport Grid) */}
        <section id="interns" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-cyan-500">Deployment Logs</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Internship Section</h2>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search interns..."
                  value={internSearch}
                  onChange={(e) => setInternSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-cyan-500/50 transition font-sans"
                />
              </div>
              <select
                value={internSortField || "None"}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "None") {
                    setInternSortField(null);
                  } else {
                    setInternSortField(val as any);
                  }
                }}
                className="text-xs bg-card/50 border border-border rounded-lg px-2.5 py-1.5 outline-none focus:border-cyan-500/50 cursor-pointer text-foreground"
              >
                <option value="None">Sort By</option>
                <option value="name">Name</option>
                <option value="institution">Institution</option>
                <option value="duration">Duration</option>
              </select>
            </div>
          </div>

          <div className="orl-table-container overflow-x-auto">
            <table className="orl-table">
              <thead>
                <tr>
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Organization</th>
                  <th className="px-4 py-2">Duration</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {processedInternships.map((intern) => (
                  <tr key={intern.id}>
                    <td className="px-4 py-3 align-top font-semibold text-foreground">{intern.name}</td>
                    <td className="px-4 py-3 align-top text-text-secondary">{intern.institution || "—"}</td>
                    <td className="px-4 py-3 align-top text-text-secondary">{intern.duration || "—"}</td>
                    <td className="px-4 py-3 align-top text-text-secondary">
                      {intern.status ? (
                        intern.status === "active" ? "Active" :
                        intern.status === "past-contributor" ? "Past Contributor" :
                        intern.status
                      ) : "Active"}
                    </td>
                  </tr>
                ))}
                {processedInternships.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-text-muted text-xs">
                      {INTERNSHIPS.length === 0 ? "No records available." : "No active interns found matching search filters."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {INTERNSHIPS_PAST.length > 0 && (
            <div className="mt-8 space-y-4 pt-6 border-t border-border/20 font-sans">
              <h3 className="text-sm font-bold tracking-tight text-text-secondary font-sans">
                Past Contributors (Interns)
              </h3>
              <div className="orl-table-container overflow-x-auto">
                <table className="orl-table">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Organization</th>
                      <th className="px-4 py-2">Duration</th>
                      <th className="px-4 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {processedInternshipsPast.map((intern) => (
                      <tr key={intern.id}>
                        <td className="px-4 py-3 align-top font-semibold text-foreground">{intern.name}</td>
                        <td className="px-4 py-3 align-top text-text-secondary">{intern.institution || "—"}</td>
                        <td className="px-4 py-3 align-top text-text-secondary">{intern.duration || "—"}</td>
                        <td className="px-4 py-3 align-top text-text-secondary">
                          {intern.status ? (
                            intern.status === "active" ? "Active" :
                            intern.status === "past-contributor" ? "Past Contributor" :
                            intern.status
                          ) : "Past Contributor"}
                        </td>
                      </tr>
                    ))}
                    {processedInternshipsPast.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-text-muted text-xs">
                          No past interns found matching search filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* 10. Technical Discussions (Amber Theme - Image-First Grid) */}
        <section id="discussions" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border/40 pb-4">
            <div>
              <span className="text-5xs font-mono font-bold uppercase tracking-wider text-amber-500">Scientific Colloquia</span>
              <h2 className="text-xl font-bold tracking-tight text-foreground mt-0.5 font-sans">Technical Discussions</h2>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search discussions..."
                value={discussionSearch}
                onChange={(e) => setDiscussionSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-border bg-card/50 outline-none w-44 focus:border-amber-500/50 transition"
              />
            </div>
          </div>

          {/* Grid Stack */}
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredDiscussions.map((disc) => (
              <div
                key={disc.id}
                onClick={() => openDetail(disc, "amber")}
                className="group relative rounded-2xl border border-border bg-card/60 p-4 transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] select-none flex flex-col justify-between cursor-pointer hover:border-amber-500/35"
              >
                <div>
                  {/* Carousel or Single Image */}
                  {disc.images && disc.images.length > 0 && (
                    <CardImageCarousel
                      images={disc.images}
                      title={disc.title}
                      activeColorClass="bg-amber-500"
                    />
                  )}

                  {/* Content */}
                  <div className="space-y-2 mt-3">
                    <h3 className="font-bold text-foreground text-xs leading-snug group-hover:text-amber-500 transition-colors line-clamp-2">
                      {disc.title}
                    </h3>
                    
                    {disc.participants && (
                      <p className="text-5xs font-semibold text-amber-500 font-sans line-clamp-1">
                        👤 {disc.participants}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-5xs font-bold bg-amber-500/10 text-amber-500 border border-amber-500/25 uppercase font-mono tracking-wider">
                        Technical Meeting
                      </span>
                      <span className="text-5xs text-text-muted font-mono flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {disc.date.split("on")[1]?.trim() || disc.date}
                      </span>
                    </div>

                    {disc.summary && (
                      <p className="text-4xs text-text-secondary leading-relaxed font-sans line-clamp-3 pt-0.5">{disc.summary}</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-500 mt-4 border-t border-border/20">
                  <span>View Details</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
            {filteredDiscussions.length === 0 && (
              <div className="col-span-3 text-center text-text-muted text-xs py-8">
                {TECHNICAL_DISCUSSIONS.length === 0 ? "No records available." : "No technical discussions found."}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* 11. Reusable Person Detail Modal */}
      {selectedItem && (
        <PersonDetailModal
          item={selectedItem}
          themeColor={selectedTheme}
          onClose={closeDetail}
        />
      )}
    </div>
  );
}
