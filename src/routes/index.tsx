import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, useMemo } from "react";
import { useSiteSettings, useDatasetRecords } from "@/lib/admin-store";
import { resolveAssetUrl } from "@/lib/storage-service";
import { isValidLogo } from "@/lib/asset-validation";


import {
  ArrowRight,
  Award,
  Mic,
  Users,
  FileText,
  GraduationCap,
  BookOpen,
  Globe,
  Building2,
  Briefcase,
  Library,
  GraduationCap as GraduationIcon,
  Compass,
  Bot,
  Cpu,
  Activity,
  Anchor,
  Info,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Camera,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ocean Research Laboratory (ORL) | NITTTR Chennai" },
      {
        name: "description",
        content:
          "The Ocean Research Laboratory (ORL) at NITTTR Chennai is dedicated to advancing underwater acoustics, ocean engineering, marine sensing technologies, and subsea exploration systems.",
      },
    ],
  }),
  component: Home,
});

// ----------------- CONFIGURABLE DATA MODELS (CMS-READY) -----------------

interface ResearchArea {
  id: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

const RESEARCH_AREAS: ResearchArea[] = [
  {
    id: "acoustics",
    title: "Underwater Acoustics",
    description: "Ambient noise modeling, propagation dynamics, and sonar telemetry characterization in shallow and deep coastal waters.",
    icon: "Compass",
    tags: ["Hydrophones", "Ambient Noise", "Propagation"],
  },
  {
    id: "observation",
    title: "Ocean Observation",
    description: "Development of autonomous subsea sensor networks, marine bio-acoustics mapping, and real-time environment monitoring stations.",
    icon: "Globe",
    tags: ["Sensors", "Monitoring", "Data Collection"],
  },
  {
    id: "signal-processing",
    title: "Marine Signal Processing",
    description: "Advanced algorithms for sonar de-noising, multi-carrier subsea communication (MIMO) structures, and AI-assisted degraded optical restoration.",
    icon: "Cpu",
    tags: ["De-noising", "MIMO Sonar", "AI Restoration"],
  },
  {
    id: "robotics",
    title: "Underwater Robotics",
    description: "Guidance, navigation, and control loop optimization for autonomous underwater vehicles (AUVs) and remotely operated vehicles (ROVs).",
    icon: "Bot",
    tags: ["AUVs & ROVs", "Control Loops", "Navigation"],
  },
];

interface LabHighlight {
  label: string;
  value: string;
  icon: string;
  description: string;
}

const LAB_HIGHLIGHTS: LabHighlight[] = [
  { label: "Publications", value: "169", icon: "FileText", description: "62 Journals, 97 Conferences, and 10 Books." },
  { label: "Awards", value: "26", icon: "Award", description: "National and institutional recognitions." },
  { label: "Invited Talks", value: "22", icon: "Mic", description: "Keynotes and technical sessions delivered." },
  { label: "Research Supervisions", value: "16", icon: "GraduationCap", description: "PhD scholars guided and doctoral committees chaired." },
  { label: "Training Programmes", value: "55", icon: "Briefcase", description: "ITEC international sessions and PDP courses." },
  { label: "Years of Research", value: "15+", icon: "Calendar", description: "Established in 2010 (15+ years of research)." },
];

interface FacilitySpec {
  label: string;
  value: string;
}

interface FacilityHighlight {
  title: string;
  description: string;
  image: string;
  tag: string;
  linkHash: string;
  specs: FacilitySpec[];
}

const FACILITIES_HIGHLIGHTS: FacilityHighlight[] = [
  {
    title: "Indoor Acoustic Test Tank",
    description: "Indoor calibrated water testing facility supporting sensor arrays and subsea platforms.",
    image: "/images/laboratory_workspace.png",
    tag: "Acoustic Testing",
    linkHash: "facilities",
    specs: [
      { label: "Capacity", value: "10,874 Litres" },
      { label: "Purpose", value: "Sensor Calibration & Trim Testing" },
    ],
  },
  {
    title: "ORCA ROV Platform",
    description: "Custom inspection vehicle designed for biological surveying and underwater recording.",
    image: "/images/underwater_robot.png",
    tag: "ROV Platform",
    linkHash: "facilities",
    specs: [
      { label: "Deployment", value: "Inspection class" },
      { label: "Equipment", value: "Modular Thrusters & HD Cam" },
    ],
  },
  {
    title: "Marine Instrumentation",
    description: "State-of-the-art arrays, velocimeters, and side-scan sonar interfaces.",
    image: "/images/academic_seminar.png",
    tag: "Field Systems",
    linkHash: "facilities",
    specs: [
      { label: "Sensing", value: "Hydrophones & SVP Profilers" },
      { label: "Interface", value: "High-resolution side-scan" },
    ],
  },
];

interface FieldActivity {
  title: string;
  description: string;
  image: string;
  tag: string;
  location: string;
  operationType: string;
}

const FIELD_ACTIVITIES: FieldActivity[] = [
  {
    title: "Coral Reef Survey",
    description: "Collected underwater coral reef data using the ROVITO-4 ROV camera Off-Akalmadam, Rameswaram.",
    image: "/images/underwater_robot.png",
    tag: "ROV Survey",
    location: "Off-Akalmadam, Rameswaram",
    operationType: "Survey",
  },
  {
    title: "Sea-bed Mapping Survey",
    description: "Collected underwater data using Side Scan Sonar (SSS) connected with ORV Sagar Manjusha from MoES for sea bed mapping.",
    image: "/images/laboratory_workspace.png",
    tag: "Sonar Mapping",
    location: "Off-Mahabalipuram",
    operationType: "Ocean Expedition",
  },
  {
    title: "Underwater Drone Deployment",
    description: "Deployed the Underwater Drone with GoPro Underwater Camera at Kasimedu Fishing harbour to capture subsea visuals.",
    image: "/images/academic_seminar.png",
    tag: "Drone Deployment",
    location: "Kasimedu Fishing Harbour",
    operationType: "Sea Trial",
  },
];

interface Collaboration {
  title: string;
  description: string;
  type: string;
  partners: string[];
}

const COLLABORATIONS: Collaboration[] = [
  {
    title: "Active MoUs & Agreements",
    description: "Formal research partnerships and joint programs with leading research organizations including the M. S. Swaminathan Research Foundation (MSSRF) for agricultural wireless sensor nodes, and the Tamil Nadu Dr. J. Jayalalithaa Fisheries University (TNJFU) for marine bio-acoustics and sensor calibrations.",
    type: "Institutional Agreements",
    partners: ["MSSRF", "TNJFU", "Marine Bio-acoustics"],
  },
  {
    title: "Consultancy & Validation Services",
    description: "Design validation, acoustic telemetry trials, and subsea hardware diagnostic services conducted for prominent academic and industry bodies including K. S. School of Engineering and Management (KSSEM) and B. S. Abdur Rahman Crescent Institute of Science and Technology.",
    type: "Industrial Consultancies",
    partners: ["KSSEM", "Crescent Institute", "Telemetry Trials"],
  },
  {
    title: "Academic Exchange Partners",
    description: "Collaborative knowledge sharing, faculty exchange programs, student internships, and research partnerships maintained with premier institutions like Sathyabama Institute of Science and Technology, RMK Engineering College, SRM Institute of Science and Technology, and Alagappa University.",
    type: "Partner Institutions",
    partners: ["Sathyabama", "RMK", "SRM", "Alagappa University"],
  },
];

interface PeopleStat {
  label: string;
  count: string;
  icon: string;
  desc: string;
}

const PEOPLE_STATS: PeopleStat[] = [
  { label: "Faculty Members", count: "5", icon: "Users", desc: "Scientific Directors & Founders" },
  { label: "Research Scholars", count: "4", icon: "GraduationCap", desc: "Ph.D. Candidates & Investigators" },
  { label: "Project Staff", count: "2", icon: "Briefcase", desc: "Hardware & Software Engineers" },
  { label: "Students & Interns", count: "58", icon: "BookOpen", desc: "Post-Graduate & Innovation Teams" },
];

const QUICK_ACCESS_SECTIONS = [
  {
    id: "qa-0",
    label: "Research & Facilities",
    to: "/research",
    icon: "Compass",
    description: "Acoustics modeling and test tank facilities",
    color: "sky",
  },
  {
    id: "qa-1",
    label: "Publications",
    to: "/publications",
    icon: "FileText",
    description: "Peer-reviewed journals and books",
    color: "sky",
  },
  {
    id: "qa-2",
    label: "Technical Training",
    to: "/technical-training",
    icon: "Briefcase",
    description: "ITEC international and PDP courses",
    color: "indigo",
  },
  {
    id: "qa-3",
    label: "Academic Activities",
    to: "/academic-activities",
    icon: "GraduationCap",
    description: "Supervision registries and workshops",
    color: "violet",
  },
  {
    id: "qa-4",
    label: "Awards & Recognition",
    to: "/awards",
    icon: "Award",
    description: "National and institutional recognitions",
    color: "amber",
  },
  {
    id: "qa-5",
    label: "People",
    to: "/people",
    icon: "Users",
    description: "Faculty, scholars, staff, and alumni",
    color: "indigo",
  },
  {
    id: "qa-6",
    label: "Gallery",
    to: "/gallery",
    icon: "Camera",
    description: "Photo archives of underwater trials",
    color: "cyan",
  },
  {
    id: "qa-7",
    label: "Collaborations",
    to: "/collaborations-consultancy",
    icon: "Globe",
    description: "Joint MoUs and consultancy programs",
    color: "emerald",
  },
];

const ICON_MAP: Record<string, any> = {
  Compass,
  Globe,
  Cpu,
  Bot,
  Users,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Camera,
  FileText,
  Mail,
  Phone,
  MapPin,
  Anchor,
  Activity,
  Mic,
  Building2,
  Library,
  GraduationIcon,
};

function LucideIcon({ name, className }: { name: string; className?: string }) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return <HelpCircle className={className} />;
  return <IconComponent className={className} />;
}

function AnimatedCounter({ value, duration = 1500 }: { value: string; duration?: number }) {
  const numericMatch = value.match(/^(\d+)/);
  const endValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const suffix = value.replace(/^\d+/, "");
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let cancelled = false;
    const step = (timestamp: number) => {
      if (cancelled) return;
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
    return () => {
      cancelled = true;
    };
  }, [endValue, duration]);

  return <span>{count}{suffix}</span>;
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: {
      x: number;
      y: number;
      rx: number;
      ry: number;
      vx: number;
      vy: number;
      rot: number;
      vrot: number;
      opacity: number;
    }[] = [];
    let waves: {
      x: number;
      y: number;
      r: number;
      maxR: number;
      speed: number;
    }[] = [];

    interface FishType {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      direction: number;
      wiggleOffset: number;
      wiggleSpeed: number;
      yOffset: number;
      layer: number; // 0=background, 1=midground, 2=foreground
    }

    interface VegetationType {
      x: number;
      height: number;
      width: number;
      type: "kelp" | "grass";
      swaySpeed: number;
      swayOffset: number;
      opacity: number;
      layer: number; // 0=background, 1=midground, 2=foreground
    }

    interface RockType {
      x: number;
      y: number;
      rx: number;
      ry: number;
      opacity: number;
      layer: number; // 0=background, 1=midground, 2=foreground
    }

    let fish: FishType[] = [];
    let vegetation: VegetationType[] = [];
    let rocks: RockType[] = [];

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let isReducedMotion = reducedMotionQuery.matches;

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
      init();
    };
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      canvas.width = rect?.width || window.innerWidth;
      canvas.height = rect?.height || 420;
      init();
    };

    const init = () => {
      particles = [];
      waves = [];
      fish = [];
      vegetation = [];
      rocks = [];

      if (isReducedMotion) return;

      const isMobile = window.innerWidth < 768;
      const particleCount = isMobile ? 12 : 35;

      for (let i = 0; i < particleCount; i++) {
        const rx = Math.random() * 2.2 + 1.0;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          rx,
          ry: rx * (Math.random() * 0.45 + 0.45), // elongated ellipses representing organic plankton
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.7) * 0.12, // slow upward drift
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 0.004,
          opacity: Math.random() * 0.08 + 0.04, // soft transparency, low contrast
        });
      }

      const waveCount = 3;
      const maxR = Math.max(canvas.width, canvas.height) * 0.75;
      for (let i = 0; i < waveCount; i++) {
        waves.push({
          x: canvas.width / 2,
          y: canvas.height * 0.88,
          r: (maxR / waveCount) * i,
          maxR,
          speed: 0.45,
        });
      }

      // Seed rocks (seabed anchors) at bottom corners to framing text
      const rockCount = isMobile ? 4 : 10;
      for (let i = 0; i < rockCount; i++) {
        const side = Math.random() < 0.5 ? "left" : "right";
        let x = 0;
        if (side === "left") {
          x = Math.random() * canvas.width * 0.18;
        } else {
          x = canvas.width * (0.82 + Math.random() * 0.18);
        }

        const layer = Math.random() < 0.3 ? 0 : Math.random() < 0.65 ? 1 : 2;

        let rx, ry, opacity;
        if (layer === 0) {
          // Background
          rx = Math.random() * 30 + 30;
          ry = Math.random() * 15 + 10;
          opacity = Math.random() * 0.1 + 0.08;
        } else if (layer === 1) {
          // Midground
          rx = Math.random() * 45 + 40;
          ry = Math.random() * 25 + 15;
          opacity = Math.random() * 0.15 + 0.12;
        } else {
          // Foreground
          rx = Math.random() * 65 + 60;
          ry = Math.random() * 35 + 20;
          opacity = Math.random() * 0.25 + 0.2;
        }

        rocks.push({
          x,
          y: canvas.height,
          rx,
          ry,
          opacity,
          layer,
        });
      }

      // Sea plant vegetation near bottom corners (do not obstruct text)
      // Restricted to left 18% and right 18% boundary
      const plantCount = 0;
      for (let i = 0; i < plantCount; i++) {
        let x = 0;
        const side = Math.random() < 0.5 ? "left" : "right";
        if (side === "left") {
          x = Math.random() * canvas.width * 0.18;
        } else {
          x = canvas.width * (0.82 + Math.random() * 0.18);
        }

        const layer = Math.random() < 0.25 ? 0 : Math.random() < 0.7 ? 1 : 2;
        const type = Math.random() < 0.45 ? "kelp" : "grass";

        let height = 0;
        let opacity = 0;
        let width = 0;

        if (layer === 0) {
          // Background (Subtle kelp)
          height =
            type === "kelp"
              ? Math.random() * 80 + 120
              : Math.random() * 60 + 50;
          opacity = Math.random() * 0.06 + 0.04;
          width = Math.random() * 3 + 2;
        } else if (layer === 1) {
          // Midground
          height =
            type === "kelp"
              ? Math.random() * 110 + 170
              : Math.random() * 80 + 70;
          opacity = Math.random() * 0.12 + 0.08;
          width = Math.random() * 4 + 3;
        } else {
          // Foreground (Very tall, highly visible kelp/grass framing the screen)
          height =
            type === "kelp"
              ? Math.random() * 140 + 230
              : Math.random() * 110 + 100;
          opacity = Math.random() * 0.18 + 0.16;
          width = Math.random() * 5 + 4;
        }

        const distToEdge = x < canvas.width / 2 ? x : canvas.width - x;
        const edgeFactor = 1 - distToEdge / (canvas.width * 0.25);
        if (edgeFactor > 0) {
          height += edgeFactor * 60;
        }

        vegetation.push({
          x,
          height,
          width,
          type,
          swaySpeed: Math.random() * 0.006 + 0.003,
          swayOffset: Math.random() * Math.PI * 2,
          opacity,
          layer,
        });
      }

      // Fish silhouettes: schools and solo fish layered in depth
      const fishCount = 0;
      const hasSchool = !isMobile;
      const schoolDirection = Math.random() < 0.5 ? 1 : -1;
      const schoolSpeed = Math.random() * 0.12 + 0.24; // Slow swimming
      const schoolY =
        Math.random() * canvas.height * 0.4 + canvas.height * 0.18;
      const schoolLayer = 1; // Midground school

      for (let i = 0; i < fishCount; i++) {
        let x, y, direction, speed, layer, size, opacity;

        if (hasSchool && i < 6) {
          // Schooling fish (6 fish swimming together)
          layer = schoolLayer;
          direction = schoolDirection;
          speed = schoolSpeed;
          x =
            (direction === 1 ? -120 : canvas.width + 120) +
            (Math.random() * 40 - 20) +
            i * 45 * -direction;
          y = schoolY + (Math.random() * 50 - 25);
          size = Math.random() * 0.2 + 0.65; // Medium size
          opacity = Math.random() * 0.06 + 0.12; // 12% to 18%
        } else {
          // Solo fish distributed across layers
          layer = Math.random() < 0.35 ? 0 : Math.random() < 0.75 ? 1 : 2;
          direction = Math.random() < 0.5 ? 1 : -1;

          if (layer === 0) {
            // Background (Far/Small)
            size = Math.random() * 0.2 + 0.35;
            speed = Math.random() * 0.15 + 0.15;
            opacity = Math.random() * 0.04 + 0.06; // 6% to 10%
          } else if (layer === 1) {
            // Midground (Medium)
            size = Math.random() * 0.25 + 0.65;
            speed = Math.random() * 0.18 + 0.2;
            opacity = Math.random() * 0.08 + 0.12; // 12% to 20%
          } else {
            // Foreground (Close/Large)
            size = Math.random() * 0.4 + 1.1; // 1.1 to 1.5 (High visual impact)
            speed = Math.random() * 0.22 + 0.25;
            opacity = Math.random() * 0.12 + 0.22; // 22% to 34% (Highly visible)
          }

          x = Math.random() * canvas.width;
          y = Math.random() * canvas.height * 0.65 + canvas.height * 0.12;
        }

        fish.push({
          x,
          y,
          size,
          speed,
          opacity,
          direction,
          wiggleOffset: Math.random() * Math.PI * 2,
          wiggleSpeed: Math.random() * 0.035 + 0.02,
          yOffset: (Math.random() - 0.5) * 0.03,
          layer,
        });
      }
    };

    const drawFish = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      direction: number,
      wiggle: number,
      opacity: number,
      layer: number,
    ) => {
      c.save();
      c.translate(x, y);
      c.scale(direction * size, size);

      // Slate-blue and deep-sea gray-blue tone selection
      let baseColor;
      if (layer === 0) {
        baseColor = `rgba(56, 189, 248, ${opacity})`; // Background (light teal-blue tint)
      } else if (layer === 1) {
        baseColor = `rgba(14, 165, 233, ${opacity})`; // Midground (sky-500 tint)
      } else {
        baseColor = `rgba(8, 47, 73, ${opacity})`; // Foreground (deep blue-sky-950 slate)
      }

      // Torpedo fish body
      c.beginPath();
      c.moveTo(-15, 0);
      c.bezierCurveTo(-5, -5, 5, -4, 15, 0);
      c.bezierCurveTo(5, 4, -5, 5, -15, 0);
      c.closePath();
      c.fillStyle = baseColor;
      c.fill();

      // Dorsal fin (top)
      c.beginPath();
      c.moveTo(-2, -4.5);
      c.quadraticCurveTo(2, -8, 5, -4);
      c.closePath();
      c.fillStyle = baseColor;
      c.fill();

      // Pectoral fin (bottom)
      c.beginPath();
      c.moveTo(2, 3.5);
      c.quadraticCurveTo(4, 7, 6, 4);
      c.closePath();
      c.fillStyle = baseColor;
      c.fill();

      // Forked tail fin with wiggle animation
      c.beginPath();
      c.moveTo(-14, 0);

      const tailX = -21;
      const tailYTop = -6 + wiggle * 2.5;
      const tailYBottom = 6 + wiggle * 2.5;

      c.lineTo(tailX, tailYTop);
      c.quadraticCurveTo(-17, wiggle * 2.5, tailX, tailYBottom);
      c.closePath();

      let tailColor;
      if (layer === 0) {
        tailColor = `rgba(38, 166, 222, ${opacity * 1.1})`;
      } else if (layer === 1) {
        tailColor = `rgba(2, 132, 199, ${opacity * 1.1})`;
      } else {
        tailColor = `rgba(3, 37, 65, ${opacity * 1.1})`;
      }
      c.fillStyle = tailColor;
      c.fill();

      c.restore();
    };

    const drawGrassBlade = (
      c: CanvasRenderingContext2D,
      baseX: number,
      baseY: number,
      height: number,
      width: number,
      swayAngle: number,
      opacity: number,
      layer: number,
    ) => {
      c.save();
      c.beginPath();
      c.moveTo(baseX - width / 2, baseY);

      const tipX = baseX + Math.sin(swayAngle) * (height * 0.25);
      const tipY = baseY - height;

      const cp1X =
        baseX - width / 4 + Math.sin(swayAngle * 0.6) * (height * 0.1);
      const cp1Y = baseY - height * 0.5;

      c.quadraticCurveTo(cp1X, cp1Y, tipX, tipY);

      const cp2X =
        baseX + width / 4 + Math.sin(swayAngle * 0.6) * (height * 0.1);
      const cp2Y = baseY - height * 0.5;
      c.quadraticCurveTo(cp2X, cp2Y, baseX + width / 2, baseY);

      c.closePath();

      const grad = c.createLinearGradient(baseX, baseY, tipX, tipY);
      if (layer === 0) {
        grad.addColorStop(0, `rgba(20, 184, 166, ${opacity})`); // Teal-600
        grad.addColorStop(1, `rgba(14, 165, 233, ${opacity * 0.3})`);
      } else if (layer === 1) {
        grad.addColorStop(0, `rgba(15, 118, 110, ${opacity})`); // Teal-700
        grad.addColorStop(1, `rgba(13, 148, 136, ${opacity * 0.3})`);
      } else {
        grad.addColorStop(0, `rgba(4, 47, 46, ${opacity})`); // Deep forest-teal-950
        grad.addColorStop(1, `rgba(15, 118, 110, ${opacity * 0.4})`);
      }

      c.fillStyle = grad;
      c.fill();
      c.restore();
    };

    const drawKelp = (
      c: CanvasRenderingContext2D,
      baseX: number,
      baseY: number,
      height: number,
      swayAngle: number,
      opacity: number,
      layer: number,
    ) => {
      c.save();
      c.beginPath();
      c.moveTo(baseX, baseY);

      const tipX = baseX + Math.sin(swayAngle) * (height * 0.3);
      const tipY = baseY - height;

      const cpX = baseX + Math.sin(swayAngle * 0.7) * (height * 0.15);
      const cpY = baseY - height * 0.5;

      c.quadraticCurveTo(cpX, cpY, tipX, tipY);

      let stemColor;
      if (layer === 0) {
        stemColor = `rgba(13, 148, 136, ${opacity * 0.5})`;
      } else if (layer === 1) {
        stemColor = `rgba(15, 118, 110, ${opacity * 0.6})`;
      } else {
        stemColor = `rgba(4, 47, 46, ${opacity * 0.7})`;
      }
      c.strokeStyle = stemColor;
      c.lineWidth = layer === 2 ? 3.5 : layer === 1 ? 2.5 : 1.5;
      c.stroke();

      const leafCount = layer === 2 ? 6 : layer === 1 ? 5 : 4;
      for (let i = 1; i <= leafCount; i++) {
        const t = i / (leafCount + 1);
        const x =
          (1 - t) * (1 - t) * baseX + 2 * (1 - t) * t * cpX + t * t * tipX;
        const y =
          (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * cpY + t * t * tipY;

        const leafSize =
          (1 - t * 0.5) * (layer === 2 ? 14 : layer === 1 ? 10 : 7);
        const dir = i % 2 === 0 ? 1 : -1;

        c.save();
        c.translate(x, y);
        c.rotate(swayAngle + (dir * Math.PI) / 4.5);

        c.beginPath();
        c.ellipse(
          dir * leafSize * 0.5,
          0,
          leafSize * 0.65,
          leafSize * 0.25,
          0,
          0,
          Math.PI * 2,
        );

        const leafGrad = c.createRadialGradient(
          0,
          0,
          1,
          dir * leafSize * 0.5,
          0,
          leafSize,
        );
        if (layer === 0) {
          leafGrad.addColorStop(0, `rgba(20, 184, 166, ${opacity})`);
          leafGrad.addColorStop(1, `rgba(13, 148, 136, ${opacity * 0.2})`);
        } else if (layer === 1) {
          leafGrad.addColorStop(0, `rgba(13, 148, 136, ${opacity})`);
          leafGrad.addColorStop(1, `rgba(15, 118, 110, ${opacity * 0.2})`);
        } else {
          leafGrad.addColorStop(0, `rgba(15, 118, 110, ${opacity})`);
          leafGrad.addColorStop(1, `rgba(4, 47, 46, ${opacity * 0.3})`);
        }

        c.fillStyle = leafGrad;
        c.fill();
        c.restore();
      }

      c.restore();
    };

    const drawRock = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      rx: number,
      ry: number,
      opacity: number,
      layer: number,
    ) => {
      c.save();
      c.beginPath();
      c.ellipse(x, y, rx, ry, 0, Math.PI, 0);
      c.closePath();

      let rockColor;
      if (layer === 0) {
        rockColor = `rgba(16, 37, 66, ${opacity})`;
      } else if (layer === 1) {
        rockColor = `rgba(8, 47, 73, ${opacity})`;
      } else {
        rockColor = `rgba(3, 17, 30, ${opacity})`;
      }
      c.fillStyle = rockColor;
      c.fill();
      c.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isReducedMotion) return;

      // ----------------- LAYER 0: BACKGROUND -----------------
      // Draw Background Rocks
      rocks
        .filter((r) => r.layer === 0)
        .forEach((r) => {
          drawRock(ctx, r.x, r.y, r.rx, r.ry, r.opacity, 0);
        });

      // Draw Background Sea Plants
      vegetation
        .filter((v) => v.layer === 0)
        .forEach((v) => {
          v.swayOffset += v.swaySpeed;
          const swayAngle = Math.sin(v.swayOffset) * 0.1;
          if (v.type === "kelp") {
            drawKelp(
              ctx,
              v.x,
              canvas.height,
              v.height,
              swayAngle,
              v.opacity,
              0,
            );
          } else {
            drawGrassBlade(
              ctx,
              v.x,
              canvas.height,
              v.height,
              v.width,
              swayAngle,
              v.opacity,
              0,
            );
          }
        });

      // Draw Background Fish
      fish
        .filter((f) => f.layer === 0)
        .forEach((f) => {
          f.x += f.speed * f.direction;
          f.wiggleOffset += f.wiggleSpeed;
          f.y += f.yOffset + Math.sin(f.wiggleOffset * 0.35) * 0.1;

          if (f.direction === 1 && f.x > canvas.width + 50) {
            f.x = -50;
            f.y = Math.random() * canvas.height * 0.55 + canvas.height * 0.12;
          } else if (f.direction === -1 && f.x < -50) {
            f.x = canvas.width + 50;
            f.y = Math.random() * canvas.height * 0.55 + canvas.height * 0.12;
          }

          const wiggle = Math.sin(f.wiggleOffset);
          drawFish(ctx, f.x, f.y, f.size, f.direction, wiggle, f.opacity, 0);
        });

      // ----------------- SONAR GRID / ACTIVE WAVES -----------------
      ctx.save();
      const sonarX = canvas.width / 2;
      const sonarY = canvas.height * 0.88;
      const maxR = Math.max(canvas.width, canvas.height) * 0.75;

      // 1. Static Sonar Bearing spokes
      const angles = [
        (Math.PI * 11) / 12,
        (Math.PI * 5) / 6,
        (Math.PI * 3) / 4,
        (Math.PI * 2) / 3,
        (Math.PI * 7) / 12,
        (Math.PI * 1) / 2,
        (Math.PI * 5) / 12,
        (Math.PI * 1) / 3,
        (Math.PI * 1) / 4,
        (Math.PI * 1) / 6,
        (Math.PI * 1) / 12,
      ];
      ctx.strokeStyle = "rgba(56, 189, 248, 0.02)";
      ctx.lineWidth = 1;
      angles.forEach((angle) => {
        ctx.beginPath();
        ctx.moveTo(sonarX, sonarY);
        ctx.lineTo(
          sonarX + Math.cos(angle) * maxR,
          sonarY - Math.sin(angle) * maxR,
        );
        ctx.stroke();
      });

      // 2. Concentric Active Waves
      waves.forEach((w) => {
        w.r += w.speed;
        if (w.r > w.maxR) {
          w.r = 0;
        }

        const progress = w.r / w.maxR;
        const currentOpacity = (1 - progress) * 0.055;

        // Sonar arc
        ctx.beginPath();
        ctx.arc(sonarX, sonarY, w.r, Math.PI, 0);
        ctx.strokeStyle = `rgba(56, 189, 248, ${currentOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner dotted grid ring
        ctx.beginPath();
        ctx.setLineDash([3, 10]);
        ctx.arc(sonarX, sonarY, w.r * 0.95, Math.PI, 0);
        ctx.strokeStyle = `rgba(20, 184, 166, ${currentOpacity * 0.5})`;
        ctx.stroke();
        ctx.setLineDash([]);

        // Dynamic ranges text
        if (w.r > 50) {
          ctx.font = "8px monospace";
          ctx.fillStyle = `rgba(56, 189, 248, ${currentOpacity * 0.75})`;
          ctx.fillText(
            `${Math.round(w.r)}m`,
            sonarX + w.r * Math.cos((Math.PI * 5) / 6) - 15,
            sonarY - w.r * Math.sin((Math.PI * 5) / 6),
          );
          ctx.fillText(
            `${Math.round(w.r)}m`,
            sonarX + w.r * Math.cos((Math.PI * 1) / 6) + 4,
            sonarY - w.r * Math.sin((Math.PI * 1) / 6),
          );
        }
      });

      // 3. Sensor arrays metadata labeling
      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(56, 189, 248, 0.045)";
      ctx.textAlign = "center";
      ctx.fillText(
        "ACTIVE SONAR TRANSDUCER ARRAY // FREQ 15.4 kHz // HORIZ 180°",
        sonarX,
        sonarY + 12,
      );
      ctx.fillText(
        "ORL MARINE TECHNOLOGY GROUP // RADAR SWEEP R: 500m",
        sonarX,
        sonarY + 23,
      );
      ctx.restore();

      // ----------------- LAYER 1: MIDGROUND -----------------
      // Draw Midground Rocks
      rocks
        .filter((r) => r.layer === 1)
        .forEach((r) => {
          drawRock(ctx, r.x, r.y, r.rx, r.ry, r.opacity, 1);
        });

      // Draw Midground Sea Plants
      vegetation
        .filter((v) => v.layer === 1)
        .forEach((v) => {
          v.swayOffset += v.swaySpeed;
          const swayAngle = Math.sin(v.swayOffset) * 0.12;
          if (v.type === "kelp") {
            drawKelp(
              ctx,
              v.x,
              canvas.height,
              v.height,
              swayAngle,
              v.opacity,
              1,
            );
          } else {
            drawGrassBlade(
              ctx,
              v.x,
              canvas.height,
              v.height,
              v.width,
              swayAngle,
              v.opacity,
              1,
            );
          }
        });

      // Draw Midground Fish (Includes school)
      fish
        .filter((f) => f.layer === 1)
        .forEach((f) => {
          f.x += f.speed * f.direction;
          f.wiggleOffset += f.wiggleSpeed;
          f.y += f.yOffset + Math.sin(f.wiggleOffset * 0.32) * 0.12;

          if (f.direction === 1 && f.x > canvas.width + 60) {
            f.x = -60;
            f.y = Math.random() * canvas.height * 0.55 + canvas.height * 0.12;
          } else if (f.direction === -1 && f.x < -60) {
            f.x = canvas.width + 60;
            f.y = Math.random() * canvas.height * 0.55 + canvas.height * 0.12;
          }

          const wiggle = Math.sin(f.wiggleOffset);
          drawFish(ctx, f.x, f.y, f.size, f.direction, wiggle, f.opacity, 1);
        });

      // ----------------- PLANKTON PARTICLES -----------------
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
        ctx.fill();
        ctx.restore();
      });

      // ----------------- LAYER 2: FOREGROUND -----------------
      // Draw Foreground Rocks
      rocks
        .filter((r) => r.layer === 2)
        .forEach((r) => {
          drawRock(ctx, r.x, r.y, r.rx, r.ry, r.opacity, 2);
        });

      // Draw Foreground Sea Plants
      vegetation
        .filter((v) => v.layer === 2)
        .forEach((v) => {
          v.swayOffset += v.swaySpeed;
          const swayAngle = Math.sin(v.swayOffset) * 0.14;
          if (v.type === "kelp") {
            drawKelp(
              ctx,
              v.x,
              canvas.height,
              v.height,
              swayAngle,
              v.opacity,
              2,
            );
          } else {
            drawGrassBlade(
              ctx,
              v.x,
              canvas.height,
              v.height,
              v.width,
              swayAngle,
              v.opacity,
              2,
            );
          }
        });

      // Draw Foreground Fish
      fish
        .filter((f) => f.layer === 2)
        .forEach((f) => {
          f.x += f.speed * f.direction;
          f.wiggleOffset += f.wiggleSpeed;
          f.y += f.yOffset + Math.sin(f.wiggleOffset * 0.28) * 0.15;

          if (f.direction === 1 && f.x > canvas.width + 100) {
            f.x = -100;
            f.y = Math.random() * canvas.height * 0.55 + canvas.height * 0.12;
          } else if (f.direction === -1 && f.x < -100) {
            f.x = canvas.width + 100;
            f.y = Math.random() * canvas.height * 0.55 + canvas.height * 0.12;
          }

          const wiggle = Math.sin(f.wiggleOffset);
          drawFish(ctx, f.x, f.y, f.size, f.direction, wiggle, f.opacity, 2);
        });

      animationId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resize);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80 z-0"
    />
  );
}


function Home() {
  const settings = useSiteSettings();
  const mediaType = settings.heroMediaType || "none";
  const heroBg = mediaType === "image" ? resolveAssetUrl(settings.heroBgImage) : null;
  const heroVid = mediaType === "video" ? resolveAssetUrl(settings.heroBgVideo, "video") : null;

  // Dynamic homepage sections
  const dynamicResearchAreas = useDatasetRecords("home-research-focus", RESEARCH_AREAS);
  const dynamicFacts = useDatasetRecords("home-facts", []);
  const dynamicQuickAccess = useDatasetRecords("home-quick-access", QUICK_ACCESS_SECTIONS);

  // Sort by displayOrder
  const sortedFocus = useMemo(() => {
    return [...dynamicResearchAreas].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [dynamicResearchAreas]);

  const sortedFacts = useMemo(() => {
    const factsList = dynamicFacts.length > 0 ? dynamicFacts : [
      { id: "fact-1", title: "Established", value: "2015", displayOrder: 1, active: true },
      { id: "fact-2", title: "Institution", value: "NITTTR Chennai", displayOrder: 2, active: true },
      { id: "fact-3", title: "Origin", value: "UWARL, SSN College", displayOrder: 3, active: true },
      { id: "fact-4", title: "Domains", value: "Acoustics & Subsea Systems", displayOrder: 5, active: true },
      { id: "fact-5", title: "Core Focus", value: "Research, Training & Consultancy", displayOrder: 6, active: true }
    ];
    return factsList
      .filter((f) => f.active === true)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [dynamicFacts]);

  const sortedQuickAccess = useMemo(() => {
    return [...dynamicQuickAccess].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [dynamicQuickAccess]);

  const stats = useMemo(() => {
    return [...(settings.homepageStats || [])].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [settings.homepageStats]);

  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section 
        className="relative overflow-hidden border-b border-border bg-[#020712] text-white py-24 md:py-32 px-6"
        style={heroBg ? { backgroundImage: `linear-gradient(to bottom, rgba(2, 7, 18, 0.75), rgba(10, 25, 47, 0.95)), url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >

        {heroVid && (
          <>
            <video 
              src={heroVid}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
            />
            <div 
              className="absolute inset-0 bg-gradient-to-b from-[#020712]/75 via-[#060D1E]/85 to-[#0A192F]/95" 
              style={{ zIndex: 0 }}
            />
          </>
        )}
        <div className="light-caustics" />
        <HeroCanvas />
        {isValidLogo(settings.institutionLogo) && (
          <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 h-16 md:h-32 max-w-[180px] md:max-w-[300px] w-auto select-none pointer-events-none flex items-center justify-start">
            <img
              src={resolveAssetUrl(settings.institutionLogo)}
              alt={settings.institutionLogoAlt || "NITTTR Chennai Logo"}
              className="h-full w-auto object-contain"
            />
          </div>
        )}
        {isValidLogo(settings.websiteLogo) && (
          <div className="absolute top-4 right-4 md:top-6 md:right-6 z-20 h-16 md:h-32 max-w-[180px] md:max-w-[300px] w-auto select-none pointer-events-none flex items-center justify-end">
            <img
              src={resolveAssetUrl(settings.websiteLogo)}
              alt={settings.websiteLogoAlt || "ORL Website Logo"}
              className="h-full w-auto object-contain"
            />
          </div>
        )}
        <div className="relative mx-auto max-w-5xl text-center flex flex-col items-center z-10">
          <h2
            className="font-tamil text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-sky-400 mb-3 drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)] animate-pulse"
            lang="ta"
            style={{ animationDuration: "4s" }}
          >
            {typeof settings.heroTitle === "object" ? settings.heroTitle.ta || "ஆழி ஆராய்ச்சி ஆய்வகம்" : "ஆழி ஆராய்ச்சி ஆய்வகம்"}
          </h2>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight drop-shadow-md mb-3">
            {typeof settings.heroTitle === "object" ? settings.heroTitle.en || "Ocean Research Laboratory" : settings.heroTitle || "Ocean Research Laboratory"}
          </h1>
          <h2
            className="font-hindi text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-slate-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] mb-3"
            lang="hi"
          >
            {typeof settings.heroTitle === "object" ? settings.heroTitle.hi || "समुद्र अनुसंधान प्रयोगशाला" : "समुद्र अनुसंधान प्रयोगशाला"}
          </h2>
          <div className="mt-8 w-full max-w-3xl border-t border-sky-900/40 pt-6 text-center">
            <p className="text-sm md:text-base text-slate-300 leading-relaxed font-normal whitespace-pre-line">
              {settings.heroSubtitle || `Ocean Research Laboratory, National Institute of Technical Teachers Training and Research (NITTTR), Chennai.\nA Pioneering Center for Ocean Engineering, Underwater Acoustics & Marine Technology`}
            </p>
            <p className="mt-5 text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal whitespace-pre-line">
              {typeof settings.heroDescription === "object" ? settings.heroDescription.en || "" : settings.heroDescription || "The Ocean Research Laboratory (ORL) at NITTTR Chennai is dedicated to advancing underwater acoustics, ocean engineering, marine sensing technologies, and subsea exploration systems through research, innovation, technical training, and field validation."}
            </p>
            
            {(settings.heroPrimaryBtnText || settings.heroSecondaryBtnText) && (
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                {settings.heroPrimaryBtnText && (
                  <Link
                    to={settings.heroPrimaryBtnLink || "/research"}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs uppercase px-5 py-3 transition duration-300 shadow-md cursor-pointer select-none"
                  >
                    {settings.heroPrimaryBtnText} <ArrowRight className="h-4 w-4" />
                  </Link>
                )}
                {settings.heroSecondaryBtnText && (
                  <Link
                    to={settings.heroSecondaryBtnLink || "/contact"}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase px-5 py-3 transition duration-300 shadow-md cursor-pointer select-none"
                  >
                    {settings.heroSecondaryBtnText}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. ABOUT ORL SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-16" id="about">
        <div className="grid gap-12 lg:grid-cols-12 items-stretch">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-0.5 w-8 bg-accent"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                About the Laboratory
              </span>
            </div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight mb-5">
              {settings.aboutLabTitle || "Advancing Deep-Ocean Exploration"}
            </h2>
            <div className="space-y-4 text-sm md:text-base text-text-secondary leading-relaxed">
              <p className="whitespace-pre-line">
                {settings.aboutLabDesc || "The Ocean Research Laboratory (ORL) is a multidisciplinary research facility focused on underwater acoustics, ocean observation, subsea systems, marine instrumentation, and technical education."}
              </p>
              {!settings.aboutLabDesc && (
                <ul className="space-y-2.5 text-xs md:text-sm text-text-secondary pl-1 mt-4">
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent text-sm mt-0.5">•</span>
                    <span>Supports capacity building, educators' training, and defense consultancies.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent text-sm mt-0.5">•</span>
                    <span>Fosters post-graduate academic research and mechanical deployment trials.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-accent text-sm mt-0.5">•</span>
                    <span>Established in 2015 and currently operating in the ECE Department at NITTTR Chennai.</span>
                  </li>
                </ul>
              )}
            </div>
          </div>
 
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="flex items-center gap-3 border-b border-border pb-3 mb-4">
                  <Info className="h-5 w-5 text-accent" />
                  <h3 className="text-sm font-bold text-foreground tracking-wide">
                    Key Laboratory Facts
                  </h3>
                </div>
                <div className="space-y-3">
                  {sortedFacts.map((fact, fIdx) => (
                    <div key={fact.id || fIdx} className={`flex justify-between items-start ${fIdx < sortedFacts.length - 1 ? 'border-b border-border/40 pb-2' : ''} text-xs`}>
                      <span className="text-text-muted font-semibold">{fact.title}</span>
                      <span className="font-bold text-foreground text-right ml-2">{fact.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VISION & MISSION SECTION */}
      <section className="bg-secondary/40 border-y border-border py-16" id="vision-mission">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="h-0.5 w-6 bg-accent"></span>
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Our Foundations
              </span>
              <span className="h-0.5 w-6 bg-accent"></span>
            </div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Vision & Mission
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-12 items-stretch">
            {/* Vision Card */}
            <div className="lg:col-span-5 rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl pointer-events-none"></div>
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent"></span>
                <span>Vision</span>
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed italic border-l-2 border-accent pl-4">
                &ldquo;{settings.visionText || "To be recognized globally as an institutional center of excellence in ocean technologies and underwater acoustics. We pioneer sustainable engineering models, foster interdisciplinary marine studies, and empower technical educators."}&rdquo;
              </p>
            </div>

            {/* Mission Card */}
            <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm flex flex-col justify-center">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent-secondary/5 rounded-full blur-xl pointer-events-none"></div>
              <h3 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent-secondary"></span>
                <span>Mission</span>
              </h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed border-l-2 border-accent-secondary pl-4 whitespace-pre-line">
                {settings.missionText || `Publish high-impact research in digital signal processing, coral diagnostics, and subsea automation.\n\nDeliver specialized technical courses for educators, scholars, and international delegations.\n\nPrototype subsea platforms (ORCA ROV), sensor arrays, and seawater green energy converters.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. RESEARCH FOCUS AREAS SECTION */}
      <section className="relative mx-auto max-w-6xl px-6 py-16 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent dark:via-sky-500/2" id="research-focus">
        <div className="flex flex-wrap items-center justify-between border-b border-border pb-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-500 border border-sky-500/20">
                Core Domains
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Research Focus Areas
            </h2>
            <div className="h-1 w-16 bg-sky-500 rounded-full mt-2"></div>
          </div>
          <Link
            to="/research"
            className="text-xs font-bold text-sky-500 hover:underline inline-flex items-center gap-1"
          >
            Explore Technical Framework &rarr;
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sortedFocus.map((area) => (
            <div
              key={area.id}
              className="holographic-card rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-sky-500/40 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="rounded-xl bg-sky-500/10 p-3 w-fit text-sky-500 mb-3.5 dark:bg-sky-500/20">
                  <LucideIcon name={area.icon || "Compass"} className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">
                  {area.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {area.description}
                </p>
                {/* Keyword Tags */}
                <div className="flex flex-wrap gap-1 mt-3.5">
                  {(Array.isArray(area.tags) 
                    ? area.tags 
                    : typeof area.tags === "string" 
                      ? area.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
                      : []
                  ).map((tag, tIdx) => (
                    <span key={tIdx} className="text-4xs font-bold bg-sky-500/10 text-sky-500 dark:text-sky-400 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Link
                to="/research"
                className="mt-4 text-xs font-semibold text-sky-500 hover:underline w-fit inline-flex items-center gap-1 group"
              >
                Learn more <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. LABORATORY HIGHLIGHTS SECTION */}
      <section className="bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent dark:via-cyan-500/2 border-y border-border py-16" id="highlights">
        <div className="mx-auto max-w-6xl px-6">
          <div className="border-b border-border pb-4 mb-8">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                Scientific Metrics
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Laboratory Highlights
            </h2>
            <div className="h-1 w-16 bg-cyan-500 rounded-full mt-2"></div>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-card p-4 hover:border-cyan-500/40 hover:shadow-xs transition duration-300 text-center flex flex-col justify-between min-h-[145px] w-[calc(50%-12px)] sm:w-[calc(33.333%-16px)] md:w-[calc(25%-18px)] lg:w-[calc(16.666%-20px)] min-w-[140px] max-w-[180px]"
              >
                <div>
                  <div className="rounded-full bg-cyan-500/10 p-2 text-cyan-500 w-fit mx-auto mb-2 dark:bg-cyan-500/20">
                    <LucideIcon name={stat.icon || "FileText"} className="h-4 w-4" />
                  </div>
                  <div className="font-extrabold text-2xl text-cyan-500 mb-0.5">
                    <AnimatedCounter value={stat.value || "0"} />
                  </div>
                  <div className="text-3xs font-bold text-foreground uppercase tracking-wider mb-1">
                    {stat.label}
                  </div>
                </div>
                <p className="text-4xs text-text-muted leading-tight border-t border-border/40 pt-1.5 mt-1">
                  {stat.description || ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. QUICK ACCESS CARDS SECTION */}
      <section className="mx-auto max-w-6xl px-6 py-16" id="quick-access">
        <div className="border-b border-border pb-3 mb-8">
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Quick Access Sections
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Navigate through consolidated research portals, publications, courses, and highlights.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sortedQuickAccess.map((item, idx) => {
            // Map color classes
            const colorClasses: Record<string, { border: string; bg: string; text: string }> = {
              sky: { border: "hover:border-sky-400/50", bg: "bg-sky-500/10 text-sky-500 group-hover:bg-sky-500", text: "group-hover:text-sky-500" },
              teal: { border: "hover:border-teal-400/50", bg: "bg-teal-500/10 text-teal-500 group-hover:bg-teal-500", text: "group-hover:text-teal-500" },
              indigo: { border: "hover:border-indigo-400/50", bg: "bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500", text: "group-hover:text-indigo-500" },
              violet: { border: "hover:border-violet-400/50", bg: "bg-violet-500/10 text-violet-500 group-hover:bg-violet-500", text: "group-hover:text-violet-500" },
              amber: { border: "hover:border-amber-400/50", bg: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500", text: "group-hover:text-amber-500" },
              cyan: { border: "hover:border-cyan-400/50", bg: "bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500", text: "group-hover:text-cyan-500" },
              emerald: { border: "hover:border-emerald-400/50", bg: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500", text: "group-hover:text-emerald-500" },
            };
            const theme = colorClasses[item.color || "sky"] || colorClasses.sky;

            return (
              <Link
                key={idx}
                to={item.to || "/"}
                className={`group flex flex-col justify-between rounded-xl border border-border p-4 min-h-[125px] transition-all duration-300 bg-card ${theme.border} hover:bg-card-hover hover:shadow-xs`}
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 transition duration-300 w-fit shrink-0 ${theme.bg} group-hover:text-white`}>
                    <LucideIcon name={item.icon || "Compass"} className="h-4.5 w-4.5" />
                  </div>
                  <h3 className={`text-xs font-bold text-foreground transition-colors duration-300 ${theme.text}`}>
                    {item.label}
                  </h3>
                </div>
                <div className="flex items-center justify-between border-t border-border/40 pt-2.5 mt-3">
                  <p className="text-4xs text-text-muted leading-tight line-clamp-1 pr-2">
                    {item.description}
                  </p>
                  <div className={`flex items-center gap-0.5 text-4xs font-bold shrink-0 ${theme.text} hover:underline`}>
                    Go <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>


    </div>
  );
}
