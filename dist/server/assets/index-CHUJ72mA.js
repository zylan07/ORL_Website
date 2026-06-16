import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useMemo, useRef, useEffect, useState } from "react";
import { k as useSiteSettings, r as resolveAssetUrl, a as useDatasetRecords } from "./router-ScoMlXed.js";
import { ArrowRight, Info, Cpu, Briefcase, Globe, Building2, MapPin, Mail, Phone, HelpCircle, GraduationCap, Library, Mic, Activity, Anchor, FileText, Camera, BookOpen, Award, Users, Bot, Compass } from "lucide-react";
import "@tanstack/react-query";
import "zod";
const RESEARCH_AREAS = [{
  id: "acoustics",
  title: "Underwater Acoustics",
  description: "Ambient noise modeling, propagation dynamics, and sonar telemetry characterization in shallow and deep coastal waters.",
  icon: "Compass",
  tags: ["Hydrophones", "Ambient Noise", "Propagation"]
}, {
  id: "observation",
  title: "Ocean Observation",
  description: "Development of autonomous subsea sensor networks, marine bio-acoustics mapping, and real-time environment monitoring stations.",
  icon: "Globe",
  tags: ["Sensors", "Monitoring", "Data Collection"]
}, {
  id: "signal-processing",
  title: "Marine Signal Processing",
  description: "Advanced algorithms for sonar de-noising, multi-carrier subsea communication (MIMO) structures, and AI-assisted degraded optical restoration.",
  icon: "Cpu",
  tags: ["De-noising", "MIMO Sonar", "AI Restoration"]
}, {
  id: "robotics",
  title: "Underwater Robotics",
  description: "Guidance, navigation, and control loop optimization for autonomous underwater vehicles (AUVs) and remotely operated vehicles (ROVs).",
  icon: "Bot",
  tags: ["AUVs & ROVs", "Control Loops", "Navigation"]
}];
const FACILITIES_HIGHLIGHTS = [{
  title: "Indoor Acoustic Test Tank",
  description: "Indoor calibrated water testing facility supporting sensor arrays and subsea platforms.",
  image: "/images/laboratory_workspace.png",
  tag: "Acoustic Testing",
  linkHash: "facilities",
  specs: [{
    label: "Capacity",
    value: "10,874 Litres"
  }, {
    label: "Purpose",
    value: "Sensor Calibration & Trim Testing"
  }]
}, {
  title: "ORCA ROV Platform",
  description: "Custom inspection vehicle designed for biological surveying and underwater recording.",
  image: "/images/underwater_robot.png",
  tag: "ROV Platform",
  linkHash: "facilities",
  specs: [{
    label: "Deployment",
    value: "Inspection class"
  }, {
    label: "Equipment",
    value: "Modular Thrusters & HD Cam"
  }]
}, {
  title: "Marine Instrumentation",
  description: "State-of-the-art arrays, velocimeters, and side-scan sonar interfaces.",
  image: "/images/academic_seminar.png",
  tag: "Field Systems",
  linkHash: "facilities",
  specs: [{
    label: "Sensing",
    value: "Hydrophones & SVP Profilers"
  }, {
    label: "Interface",
    value: "High-resolution side-scan"
  }]
}];
const FIELD_ACTIVITIES = [{
  title: "Coral Reef Survey",
  description: "Collected underwater coral reef data using the ROVITO-4 ROV camera Off-Akalmadam, Rameswaram.",
  image: "/images/underwater_robot.png",
  tag: "ROV Survey",
  location: "Off-Akalmadam, Rameswaram",
  operationType: "Survey"
}, {
  title: "Sea-bed Mapping Survey",
  description: "Collected underwater data using Side Scan Sonar (SSS) connected with ORV Sagar Manjusha from MoES for sea bed mapping.",
  image: "/images/laboratory_workspace.png",
  tag: "Sonar Mapping",
  location: "Off-Mahabalipuram",
  operationType: "Ocean Expedition"
}, {
  title: "Underwater Drone Deployment",
  description: "Deployed the Underwater Drone with GoPro Underwater Camera at Kasimedu Fishing harbour to capture subsea visuals.",
  image: "/images/academic_seminar.png",
  tag: "Drone Deployment",
  location: "Kasimedu Fishing Harbour",
  operationType: "Sea Trial"
}];
const COLLABORATIONS = [{
  title: "Active MoUs & Agreements",
  description: "Formal research partnerships and joint programs with leading research organizations including the M. S. Swaminathan Research Foundation (MSSRF) for agricultural wireless sensor nodes, and the Tamil Nadu Dr. J. Jayalalithaa Fisheries University (TNJFU) for marine bio-acoustics and sensor calibrations.",
  type: "Institutional Agreements",
  partners: ["MSSRF", "TNJFU", "Marine Bio-acoustics"]
}, {
  title: "Consultancy & Validation Services",
  description: "Design validation, acoustic telemetry trials, and subsea hardware diagnostic services conducted for prominent academic and industry bodies including K. S. School of Engineering and Management (KSSEM) and B. S. Abdur Rahman Crescent Institute of Science and Technology.",
  type: "Industrial Consultancies",
  partners: ["KSSEM", "Crescent Institute", "Telemetry Trials"]
}, {
  title: "Academic Exchange Partners",
  description: "Collaborative knowledge sharing, faculty exchange programs, student internships, and research partnerships maintained with premier institutions like Sathyabama Institute of Science and Technology, RMK Engineering College, SRM Institute of Science and Technology, and Alagappa University.",
  type: "Partner Institutions",
  partners: ["Sathyabama", "RMK", "SRM", "Alagappa University"]
}];
const QUICK_ACCESS_SECTIONS = [{
  label: "Research & Facilities",
  to: "/research",
  icon: "Compass",
  description: "Acoustics modeling and test tank facilities",
  color: "sky"
}, {
  label: "Publications",
  to: "/publications",
  icon: "FileText",
  description: "Peer-reviewed journals and books",
  color: "sky"
}, {
  label: "Technical Training",
  to: "/technical-training",
  icon: "Briefcase",
  description: "ITEC international and PDP courses",
  color: "indigo"
}, {
  label: "Academic Activities",
  to: "/academic-activities",
  icon: "GraduationCap",
  description: "Supervision registries and workshops",
  color: "violet"
}, {
  label: "Awards & Recognition",
  to: "/awards",
  icon: "Award",
  description: "National and institutional recognitions",
  color: "amber"
}, {
  label: "People",
  to: "/people",
  icon: "Users",
  description: "Faculty, scholars, staff, and alumni",
  color: "indigo"
}, {
  label: "Gallery",
  to: "/gallery",
  icon: "Camera",
  description: "Photo archives of underwater trials",
  color: "cyan"
}, {
  label: "Collaborations",
  to: "/collaborations-consultancy",
  icon: "Globe",
  description: "Joint MoUs and consultancy programs",
  color: "emerald"
}];
const ICON_MAP = {
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
  GraduationIcon: GraduationCap
};
function LucideIcon({
  name,
  className
}) {
  const IconComponent = ICON_MAP[name];
  if (!IconComponent) return /* @__PURE__ */ jsx(HelpCircle, { className });
  return /* @__PURE__ */ jsx(IconComponent, { className });
}
function AnimatedCounter({
  value,
  duration = 1500
}) {
  const numericMatch = value.match(/^(\d+)/);
  const endValue = numericMatch ? parseInt(numericMatch[1], 10) : 0;
  const suffix = value.replace(/^\d+/, "");
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTimestamp = null;
    let cancelled = false;
    const step = (timestamp) => {
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
  return /* @__PURE__ */ jsxs("span", { children: [
    count,
    suffix
  ] });
}
function HeroCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId;
    let particles = [];
    let waves = [];
    let fish = [];
    let vegetation = [];
    let rocks = [];
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = reducedMotionQuery.matches;
    const handleReducedMotionChange = (e) => {
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
        const rx = Math.random() * 2.2 + 1;
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          rx,
          ry: rx * (Math.random() * 0.45 + 0.45),
          // elongated ellipses representing organic plankton
          vx: (Math.random() - 0.5) * 0.08,
          vy: (Math.random() - 0.7) * 0.12,
          // slow upward drift
          rot: Math.random() * Math.PI * 2,
          vrot: (Math.random() - 0.5) * 4e-3,
          opacity: Math.random() * 0.08 + 0.04
          // soft transparency, low contrast
        });
      }
      const waveCount = 3;
      const maxR = Math.max(canvas.width, canvas.height) * 0.75;
      for (let i = 0; i < waveCount; i++) {
        waves.push({
          x: canvas.width / 2,
          y: canvas.height * 0.88,
          r: maxR / waveCount * i,
          maxR,
          speed: 0.45
        });
      }
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
          rx = Math.random() * 30 + 30;
          ry = Math.random() * 15 + 10;
          opacity = Math.random() * 0.1 + 0.08;
        } else if (layer === 1) {
          rx = Math.random() * 45 + 40;
          ry = Math.random() * 25 + 15;
          opacity = Math.random() * 0.15 + 0.12;
        } else {
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
          layer
        });
      }
      const plantCount = isMobile ? 8 : 26;
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
          height = type === "kelp" ? Math.random() * 80 + 120 : Math.random() * 60 + 50;
          opacity = Math.random() * 0.06 + 0.04;
          width = Math.random() * 3 + 2;
        } else if (layer === 1) {
          height = type === "kelp" ? Math.random() * 110 + 170 : Math.random() * 80 + 70;
          opacity = Math.random() * 0.12 + 0.08;
          width = Math.random() * 4 + 3;
        } else {
          height = type === "kelp" ? Math.random() * 140 + 230 : Math.random() * 110 + 100;
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
          swaySpeed: Math.random() * 6e-3 + 3e-3,
          swayOffset: Math.random() * Math.PI * 2,
          opacity,
          layer
        });
      }
      const fishCount = isMobile ? 5 : 18;
      const hasSchool = !isMobile;
      const schoolDirection = Math.random() < 0.5 ? 1 : -1;
      const schoolSpeed = Math.random() * 0.12 + 0.24;
      const schoolY = Math.random() * canvas.height * 0.4 + canvas.height * 0.18;
      const schoolLayer = 1;
      for (let i = 0; i < fishCount; i++) {
        let x, y, direction, speed, layer, size, opacity;
        if (hasSchool && i < 6) {
          layer = schoolLayer;
          direction = schoolDirection;
          speed = schoolSpeed;
          x = (direction === 1 ? -120 : canvas.width + 120) + (Math.random() * 40 - 20) + i * 45 * -direction;
          y = schoolY + (Math.random() * 50 - 25);
          size = Math.random() * 0.2 + 0.65;
          opacity = Math.random() * 0.06 + 0.12;
        } else {
          layer = Math.random() < 0.35 ? 0 : Math.random() < 0.75 ? 1 : 2;
          direction = Math.random() < 0.5 ? 1 : -1;
          if (layer === 0) {
            size = Math.random() * 0.2 + 0.35;
            speed = Math.random() * 0.15 + 0.15;
            opacity = Math.random() * 0.04 + 0.06;
          } else if (layer === 1) {
            size = Math.random() * 0.25 + 0.65;
            speed = Math.random() * 0.18 + 0.2;
            opacity = Math.random() * 0.08 + 0.12;
          } else {
            size = Math.random() * 0.4 + 1.1;
            speed = Math.random() * 0.22 + 0.25;
            opacity = Math.random() * 0.12 + 0.22;
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
          layer
        });
      }
    };
    const drawFish = (c, x, y, size, direction, wiggle, opacity, layer) => {
      c.save();
      c.translate(x, y);
      c.scale(direction * size, size);
      let baseColor;
      if (layer === 0) {
        baseColor = `rgba(56, 189, 248, ${opacity})`;
      } else if (layer === 1) {
        baseColor = `rgba(14, 165, 233, ${opacity})`;
      } else {
        baseColor = `rgba(8, 47, 73, ${opacity})`;
      }
      c.beginPath();
      c.moveTo(-15, 0);
      c.bezierCurveTo(-5, -5, 5, -4, 15, 0);
      c.bezierCurveTo(5, 4, -5, 5, -15, 0);
      c.closePath();
      c.fillStyle = baseColor;
      c.fill();
      c.beginPath();
      c.moveTo(-2, -4.5);
      c.quadraticCurveTo(2, -8, 5, -4);
      c.closePath();
      c.fillStyle = baseColor;
      c.fill();
      c.beginPath();
      c.moveTo(2, 3.5);
      c.quadraticCurveTo(4, 7, 6, 4);
      c.closePath();
      c.fillStyle = baseColor;
      c.fill();
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
    const drawGrassBlade = (c, baseX, baseY, height, width, swayAngle, opacity, layer) => {
      c.save();
      c.beginPath();
      c.moveTo(baseX - width / 2, baseY);
      const tipX = baseX + Math.sin(swayAngle) * (height * 0.25);
      const tipY = baseY - height;
      const cp1X = baseX - width / 4 + Math.sin(swayAngle * 0.6) * (height * 0.1);
      const cp1Y = baseY - height * 0.5;
      c.quadraticCurveTo(cp1X, cp1Y, tipX, tipY);
      const cp2X = baseX + width / 4 + Math.sin(swayAngle * 0.6) * (height * 0.1);
      const cp2Y = baseY - height * 0.5;
      c.quadraticCurveTo(cp2X, cp2Y, baseX + width / 2, baseY);
      c.closePath();
      const grad = c.createLinearGradient(baseX, baseY, tipX, tipY);
      if (layer === 0) {
        grad.addColorStop(0, `rgba(20, 184, 166, ${opacity})`);
        grad.addColorStop(1, `rgba(14, 165, 233, ${opacity * 0.3})`);
      } else if (layer === 1) {
        grad.addColorStop(0, `rgba(15, 118, 110, ${opacity})`);
        grad.addColorStop(1, `rgba(13, 148, 136, ${opacity * 0.3})`);
      } else {
        grad.addColorStop(0, `rgba(4, 47, 46, ${opacity})`);
        grad.addColorStop(1, `rgba(15, 118, 110, ${opacity * 0.4})`);
      }
      c.fillStyle = grad;
      c.fill();
      c.restore();
    };
    const drawKelp = (c, baseX, baseY, height, swayAngle, opacity, layer) => {
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
        const x = (1 - t) * (1 - t) * baseX + 2 * (1 - t) * t * cpX + t * t * tipX;
        const y = (1 - t) * (1 - t) * baseY + 2 * (1 - t) * t * cpY + t * t * tipY;
        const leafSize = (1 - t * 0.5) * (layer === 2 ? 14 : layer === 1 ? 10 : 7);
        const dir = i % 2 === 0 ? 1 : -1;
        c.save();
        c.translate(x, y);
        c.rotate(swayAngle + dir * Math.PI / 4.5);
        c.beginPath();
        c.ellipse(dir * leafSize * 0.5, 0, leafSize * 0.65, leafSize * 0.25, 0, 0, Math.PI * 2);
        const leafGrad = c.createRadialGradient(0, 0, 1, dir * leafSize * 0.5, 0, leafSize);
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
    const drawRock = (c, x, y, rx, ry, opacity, layer) => {
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
      rocks.filter((r) => r.layer === 0).forEach((r) => {
        drawRock(ctx, r.x, r.y, r.rx, r.ry, r.opacity, 0);
      });
      vegetation.filter((v) => v.layer === 0).forEach((v) => {
        v.swayOffset += v.swaySpeed;
        const swayAngle = Math.sin(v.swayOffset) * 0.1;
        if (v.type === "kelp") {
          drawKelp(ctx, v.x, canvas.height, v.height, swayAngle, v.opacity, 0);
        } else {
          drawGrassBlade(ctx, v.x, canvas.height, v.height, v.width, swayAngle, v.opacity, 0);
        }
      });
      fish.filter((f) => f.layer === 0).forEach((f) => {
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
      ctx.save();
      const sonarX = canvas.width / 2;
      const sonarY = canvas.height * 0.88;
      const maxR = Math.max(canvas.width, canvas.height) * 0.75;
      const angles = [Math.PI * 11 / 12, Math.PI * 5 / 6, Math.PI * 3 / 4, Math.PI * 2 / 3, Math.PI * 7 / 12, Math.PI * 1 / 2, Math.PI * 5 / 12, Math.PI * 1 / 3, Math.PI * 1 / 4, Math.PI * 1 / 6, Math.PI * 1 / 12];
      ctx.strokeStyle = "rgba(56, 189, 248, 0.02)";
      ctx.lineWidth = 1;
      angles.forEach((angle) => {
        ctx.beginPath();
        ctx.moveTo(sonarX, sonarY);
        ctx.lineTo(sonarX + Math.cos(angle) * maxR, sonarY - Math.sin(angle) * maxR);
        ctx.stroke();
      });
      waves.forEach((w) => {
        w.r += w.speed;
        if (w.r > w.maxR) {
          w.r = 0;
        }
        const progress = w.r / w.maxR;
        const currentOpacity = (1 - progress) * 0.055;
        ctx.beginPath();
        ctx.arc(sonarX, sonarY, w.r, Math.PI, 0);
        ctx.strokeStyle = `rgba(56, 189, 248, ${currentOpacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.setLineDash([3, 10]);
        ctx.arc(sonarX, sonarY, w.r * 0.95, Math.PI, 0);
        ctx.strokeStyle = `rgba(20, 184, 166, ${currentOpacity * 0.5})`;
        ctx.stroke();
        ctx.setLineDash([]);
        if (w.r > 50) {
          ctx.font = "8px monospace";
          ctx.fillStyle = `rgba(56, 189, 248, ${currentOpacity * 0.75})`;
          ctx.fillText(`${Math.round(w.r)}m`, sonarX + w.r * Math.cos(Math.PI * 5 / 6) - 15, sonarY - w.r * Math.sin(Math.PI * 5 / 6));
          ctx.fillText(`${Math.round(w.r)}m`, sonarX + w.r * Math.cos(Math.PI * 1 / 6) + 4, sonarY - w.r * Math.sin(Math.PI * 1 / 6));
        }
      });
      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(56, 189, 248, 0.045)";
      ctx.textAlign = "center";
      ctx.fillText("ACTIVE SONAR TRANSDUCER ARRAY // FREQ 15.4 kHz // HORIZ 180°", sonarX, sonarY + 12);
      ctx.fillText("ORL MARINE TECHNOLOGY GROUP // RADAR SWEEP R: 500m", sonarX, sonarY + 23);
      ctx.restore();
      rocks.filter((r) => r.layer === 1).forEach((r) => {
        drawRock(ctx, r.x, r.y, r.rx, r.ry, r.opacity, 1);
      });
      vegetation.filter((v) => v.layer === 1).forEach((v) => {
        v.swayOffset += v.swaySpeed;
        const swayAngle = Math.sin(v.swayOffset) * 0.12;
        if (v.type === "kelp") {
          drawKelp(ctx, v.x, canvas.height, v.height, swayAngle, v.opacity, 1);
        } else {
          drawGrassBlade(ctx, v.x, canvas.height, v.height, v.width, swayAngle, v.opacity, 1);
        }
      });
      fish.filter((f) => f.layer === 1).forEach((f) => {
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
      rocks.filter((r) => r.layer === 2).forEach((r) => {
        drawRock(ctx, r.x, r.y, r.rx, r.ry, r.opacity, 2);
      });
      vegetation.filter((v) => v.layer === 2).forEach((v) => {
        v.swayOffset += v.swaySpeed;
        const swayAngle = Math.sin(v.swayOffset) * 0.14;
        if (v.type === "kelp") {
          drawKelp(ctx, v.x, canvas.height, v.height, swayAngle, v.opacity, 2);
        } else {
          drawGrassBlade(ctx, v.x, canvas.height, v.height, v.width, swayAngle, v.opacity, 2);
        }
      });
      fish.filter((f) => f.layer === 2).forEach((f) => {
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
      reducedMotionQuery.removeEventListener("change", handleReducedMotionChange);
    };
  }, []);
  return /* @__PURE__ */ jsx("canvas", { ref: canvasRef, className: "absolute inset-0 w-full h-full pointer-events-none opacity-80 z-0" });
}
function ROV() {
  return /* @__PURE__ */ jsx("div", { className: "rov-animate absolute left-0 top-0 pointer-events-none z-10 w-24 h-16 md:w-32 md:h-20 opacity-70", children: /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 100 60", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "w-full h-full text-sky-400 drop-shadow-[0_0_8px_rgba(14,165,233,0.4)]", children: [
    /* @__PURE__ */ jsx("rect", { x: "25", y: "15", width: "50", height: "25", rx: "6", fill: "#eab308", stroke: "#0f172a", strokeWidth: "2.5" }),
    /* @__PURE__ */ jsx("rect", { x: "29", y: "19", width: "42", height: "17", rx: "3", fill: "#1e293b" }),
    /* @__PURE__ */ jsx("circle", { cx: "80", cy: "28", r: "4.5", fill: "#e2e8f0", stroke: "#0f172a", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "80", cy: "28", r: "1.5", fill: "#0ea5e9" }),
    /* @__PURE__ */ jsx("path", { d: "M72 23 L77 26 M72 33 L77 30", stroke: "#475569", strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("rect", { x: "12", y: "22", width: "10", height: "12", rx: "2", fill: "#475569", stroke: "#0f172a", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M8 20 L12 24 M8 36 L12 32 M8 28 H12", stroke: "#94a3b8", strokeWidth: "2", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("rect", { x: "45", y: "6", width: "10", height: "9", rx: "1.5", fill: "#475569", stroke: "#0f172a", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M42 6 H58", stroke: "#0f172a", strokeWidth: "1.5" }),
    /* @__PURE__ */ jsx("path", { d: "M70 38 L82 46 L88 44", stroke: "#64748b", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M88 42 L90 45 L86 48", stroke: "#f1f5f9", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }),
    /* @__PURE__ */ jsx("line", { x1: "35", y1: "15", x2: "35", y2: "5", stroke: "#0f172a", strokeWidth: "2" }),
    /* @__PURE__ */ jsx("circle", { cx: "35", cy: "4", r: "2", fill: "#f43f5e" }),
    /* @__PURE__ */ jsx("path", { d: "M20 48 H80", stroke: "#334155", strokeWidth: "3.5", strokeLinecap: "round" }),
    /* @__PURE__ */ jsx("path", { d: "M30 40 L25 48 M70 40 L75 48", stroke: "#334155", strokeWidth: "2.5" }),
    /* @__PURE__ */ jsx("path", { d: "M84 28 L115 15 L115 41 Z", fill: "url(#light-beam-grad)", className: "opacity-40" }),
    /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "light-beam-grad", x1: "84", y1: "28", x2: "115", y2: "28", gradientUnits: "userSpaceOnUse", children: [
      /* @__PURE__ */ jsx("stop", { stopColor: "#38bdf8", stopOpacity: "0.6" }),
      /* @__PURE__ */ jsx("stop", { offset: "1", stopColor: "#38bdf8", stopOpacity: "0" })
    ] }) })
  ] }) });
}
function Home() {
  const settings = useSiteSettings();
  const heroBg = resolveAssetUrl(settings.heroBgImage);
  const dynamicResearchAreas = useDatasetRecords("home-research-focus", RESEARCH_AREAS);
  const dynamicHighlights = useDatasetRecords("home-highlights", FACILITIES_HIGHLIGHTS);
  const dynamicQuickAccess = useDatasetRecords("home-quick-access", QUICK_ACCESS_SECTIONS);
  const sortedFocus = useMemo(() => {
    return [...dynamicResearchAreas].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [dynamicResearchAreas]);
  const sortedHighlights = useMemo(() => {
    return [...dynamicHighlights].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [dynamicHighlights]);
  const sortedQuickAccess = useMemo(() => {
    return [...dynamicQuickAccess].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [dynamicQuickAccess]);
  const stats = useMemo(() => {
    return [...settings.homepageStats || []].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [settings.homepageStats]);
  const peopleStats = useMemo(() => {
    return [...settings.peopleStats || []].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }, [settings.peopleStats]);
  return /* @__PURE__ */ jsxs("div", { className: "bg-background text-foreground min-h-screen transition-colors duration-300", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative overflow-hidden border-b border-border bg-gradient-to-b from-[#020712] via-[#060D1E] to-[#0A192F] text-white py-24 md:py-32 px-6", style: heroBg ? {
      backgroundImage: `linear-gradient(to bottom, rgba(2, 7, 18, 0.75), rgba(10, 25, 47, 0.95)), url(${heroBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center"
    } : {}, children: [
      /* @__PURE__ */ jsx("div", { className: "light-caustics" }),
      /* @__PURE__ */ jsx(HeroCanvas, {}),
      /* @__PURE__ */ jsx(ROV, {}),
      /* @__PURE__ */ jsxs("div", { className: "relative mx-auto max-w-5xl text-center flex flex-col items-center z-10", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-tamil text-2xl sm:text-3xl md:text-4xl font-bold tracking-wider text-sky-400 mb-3 drop-shadow-[0_2px_8px_rgba(56,189,248,0.3)] animate-pulse", lang: "ta", style: {
          animationDuration: "4s"
        }, children: settings.heroSubtitle || "ஆழி ஆராய்ச்சி ஆய்வகம்" }),
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl leading-tight drop-shadow-md mb-3", children: settings.heroTitle || "Ocean Research Laboratory" }),
        !settings.heroSubtitle && /* @__PURE__ */ jsx("h2", { className: "font-hindi text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-slate-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]", lang: "hi", children: "समुद्र अनुसंधान प्रयोगशाला" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 w-full max-w-3xl border-t border-sky-900/40 pt-6 text-center", children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm md:text-base text-slate-300 leading-relaxed font-normal", children: [
            settings.siteName || "Ocean Research Laboratory",
            ", ",
            settings.siteDescription || "National Institute of Technical Teachers Training and Research (NITTTR), Chennai.",
            /* @__PURE__ */ jsx("br", {}),
            /* @__PURE__ */ jsx("span", { className: "text-xs text-sky-400 font-mono mt-2 block tracking-wider uppercase", children: "A Pioneering Center for Ocean Engineering, Underwater Acoustics & Marine Technology" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "mt-5 text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-normal", children: settings.heroDescription || "The Ocean Research Laboratory (ORL) at NITTTR Chennai is dedicated to advancing underwater acoustics, ocean engineering, marine sensing technologies, and subsea exploration systems through research, innovation, technical training, and field validation." }),
          (settings.heroPrimaryBtnText || settings.heroSecondaryBtnText) && /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-center gap-4 mt-8", children: [
            settings.heroPrimaryBtnText && /* @__PURE__ */ jsxs(Link, { to: settings.heroPrimaryBtnLink || "/research", className: "inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-500 hover:bg-sky-600 text-slate-950 font-bold text-xs uppercase px-5 py-3 transition duration-300 shadow-md cursor-pointer select-none", children: [
              settings.heroPrimaryBtnText,
              " ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-4 w-4" })
            ] }),
            settings.heroSecondaryBtnText && /* @__PURE__ */ jsx(Link, { to: settings.heroSecondaryBtnLink || "/contact", className: "inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase px-5 py-3 transition duration-300 shadow-md cursor-pointer select-none", children: settings.heroSecondaryBtnText })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "mx-auto max-w-6xl px-6 py-16", id: "about", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-12 lg:grid-cols-12 items-stretch", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 flex flex-col justify-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
          /* @__PURE__ */ jsx("span", { className: "h-0.5 w-8 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-accent", children: "About the Laboratory" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground tracking-tight mb-5", children: "Advancing Deep-Ocean Exploration" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4 text-sm md:text-base text-text-secondary leading-relaxed", children: [
          /* @__PURE__ */ jsx("p", { children: "The Ocean Research Laboratory (ORL) is a multidisciplinary research facility focused on underwater acoustics, ocean observation, subsea systems, marine instrumentation, and technical education." }),
          /* @__PURE__ */ jsxs("ul", { className: "space-y-2.5 text-xs md:text-sm text-text-secondary pl-1", children: [
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-accent text-sm mt-0.5", children: "•" }),
              /* @__PURE__ */ jsx("span", { children: "Supports capacity building, educators' training, and defense consultancies." })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-accent text-sm mt-0.5", children: "•" }),
              /* @__PURE__ */ jsx("span", { children: "Fosters post-graduate academic research and mechanical deployment trials." })
            ] }),
            /* @__PURE__ */ jsxs("li", { className: "flex items-start gap-2.5", children: [
              /* @__PURE__ */ jsx("span", { className: "text-accent text-sm mt-0.5", children: "•" }),
              /* @__PURE__ */ jsx("span", { children: "Established in 2015 and currently operating in the ECE Department at NITTTR Chennai." })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "lg:col-span-5 flex", children: /* @__PURE__ */ jsxs("div", { className: "w-full rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm flex flex-col justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl pointer-events-none" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 border-b border-border pb-3 mb-4", children: [
            /* @__PURE__ */ jsx(Info, { className: "h-5 w-5 text-accent" }),
            /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground tracking-wide", children: "Key Laboratory Facts" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start border-b border-border/40 pb-2 text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-muted font-semibold", children: "Established" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-right ml-2", children: "2015" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start border-b border-border/40 pb-2 text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-muted font-semibold", children: "Institution" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-right ml-2", children: "NITTTR Chennai" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start border-b border-border/40 pb-2 text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-muted font-semibold", children: "Origin" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-right ml-2", children: "UWARL, SSN College" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start border-b border-border/40 pb-2 text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-muted font-semibold", children: "Domains" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-right ml-2", children: "Acoustics & Subsea Systems" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-start pb-2 text-xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-muted font-semibold", children: "Core Focus" }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground text-right ml-2", children: "Research, Training & Consultancy" })
            ] })
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-secondary/40 border-y border-border py-16", id: "vision-mission", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center max-w-2xl mx-auto mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "h-0.5 w-6 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-accent", children: "Our Foundations" }),
          /* @__PURE__ */ jsx("span", { className: "h-0.5 w-6 bg-accent" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold text-foreground tracking-tight", children: "Vision & Mission" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-8 lg:grid-cols-12 items-stretch", children: [
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-5 rounded-2xl border border-border bg-card p-6 relative overflow-hidden shadow-sm flex flex-col justify-center", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl pointer-events-none" }),
          /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-foreground mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-accent" }),
            /* @__PURE__ */ jsx("span", { children: "Vision" })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs md:text-sm text-text-secondary leading-relaxed italic border-l-2 border-accent pl-4", children: "“To be recognized globally as an institutional center of excellence in ocean technologies and underwater acoustics. We pioneer sustainable engineering models, foster interdisciplinary marine studies, and empower technical educators.”" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "lg:col-span-7 flex flex-col justify-between space-y-3", children: [
          /* @__PURE__ */ jsxs("h3", { className: "text-base font-bold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { className: "h-2 w-2 rounded-full bg-accent-secondary" }),
            /* @__PURE__ */ jsx("span", { children: "Mission" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
            /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-4 hover:border-accent-secondary/30 transition duration-300 flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-accent-secondary/10 p-2 text-accent-secondary w-fit mb-2.5", children: /* @__PURE__ */ jsx(Cpu, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-foreground mb-1.5", children: "Research" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed", children: "Publish high-impact research in digital signal processing, coral diagnostics, and subsea automation." })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-4 hover:border-accent-secondary/30 transition duration-300 flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-accent-secondary/10 p-2 text-accent-secondary w-fit mb-2.5", children: /* @__PURE__ */ jsx(Briefcase, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-foreground mb-1.5", children: "Capacity Training" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed", children: "Deliver specialized technical courses for educators, scholars, and international delegations." })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-border bg-card p-4 hover:border-accent-secondary/30 transition duration-300 flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "rounded-lg bg-accent-secondary/10 p-2 text-accent-secondary w-fit mb-2.5", children: /* @__PURE__ */ jsx(Globe, { className: "h-4 w-4" }) }),
              /* @__PURE__ */ jsx("h4", { className: "text-xs font-bold text-foreground mb-1.5", children: "Innovation" }),
              /* @__PURE__ */ jsx("p", { className: "text-3xs text-text-secondary leading-relaxed", children: "Prototype subsea platforms (ORCA ROV), sensor arrays, and seawater green energy converters." })
            ] }) })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "relative mx-auto max-w-6xl px-6 py-16 bg-gradient-to-b from-transparent via-sky-500/5 to-transparent dark:via-sky-500/2", id: "research-focus", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between border-b border-border pb-4 mb-8", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-1.5", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-500 border border-sky-500/20", children: "Core Domains" }) }),
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Research Focus Areas" }),
          /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-sky-500 rounded-full mt-2" })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/research", className: "text-xs font-bold text-sky-500 hover:underline inline-flex items-center gap-1", children: "Explore Technical Framework →" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: sortedFocus.map((area) => /* @__PURE__ */ jsxs("div", { className: "holographic-card rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-sky-500/40 hover:shadow-md transition-all duration-300", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-xl bg-sky-500/10 p-3 w-fit text-sky-500 mb-3.5 dark:bg-sky-500/20", children: /* @__PURE__ */ jsx(LucideIcon, { name: area.icon || "Compass", className: "h-6 w-6" }) }),
          /* @__PURE__ */ jsx("h3", { className: "text-sm font-bold text-foreground mb-1.5", children: area.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed", children: area.description }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1 mt-3.5", children: (Array.isArray(area.tags) ? area.tags : typeof area.tags === "string" ? area.tags.split(",").map((t) => t.trim()).filter(Boolean) : []).map((tag, tIdx) => /* @__PURE__ */ jsx("span", { className: "text-4xs font-bold bg-sky-500/10 text-sky-500 dark:text-sky-400 px-2 py-0.5 rounded", children: tag }, tIdx)) })
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/research", className: "mt-4 text-xs font-semibold text-sky-500 hover:underline w-fit inline-flex items-center gap-1 group", children: [
          "Learn more ",
          /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 group-hover:translate-x-0.5 transition-transform" })
        ] })
      ] }, area.id)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent dark:via-cyan-500/2 border-y border-border py-16", id: "highlights", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-1.5", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-500 border border-cyan-500/20", children: "Scientific Metrics" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Laboratory Highlights" }),
        /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-cyan-500 rounded-full mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 grid-cols-2 lg:grid-cols-6", children: stats.map((stat, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-4 hover:border-cyan-500/40 hover:shadow-xs transition duration-300 text-center flex flex-col justify-between min-h-[145px]", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-full bg-cyan-500/10 p-2 text-cyan-500 w-fit mx-auto mb-2 dark:bg-cyan-500/20", children: /* @__PURE__ */ jsx(LucideIcon, { name: stat.icon || "FileText", className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("div", { className: "font-extrabold text-2xl text-cyan-500 mb-0.5", children: /* @__PURE__ */ jsx(AnimatedCounter, { value: stat.value || "0" }) }),
          /* @__PURE__ */ jsx("div", { className: "text-3xs font-bold text-foreground uppercase tracking-wider mb-1", children: stat.label })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-4xs text-text-muted leading-tight border-t border-border/40 pt-1.5 mt-1", children: stat.description || "" })
      ] }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-6 py-16", id: "facilities", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-1.5", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-teal-500/10 text-teal-500 border border-teal-500/20", children: "Lab Resources" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Facilities Highlights" }),
        /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-teal-500 rounded-full mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-3", children: sortedHighlights.map((facility, idx) => /* @__PURE__ */ jsxs("div", { className: "group rounded-xl border border-border bg-card overflow-hidden hover:border-teal-500/40 hover:shadow-md transition duration-300 flex flex-col justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "h-44 bg-muted relative overflow-hidden", children: [
            /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(facility.image || facility.thumbnail), alt: facility.title, loading: "lazy", className: "w-full h-full object-cover opacity-75 group-hover:scale-103 transition-transform duration-500" }),
            /* @__PURE__ */ jsx("span", { className: "absolute top-3 left-3 bg-teal-500 text-white font-bold text-3xs uppercase px-2 py-0.5 rounded shadow-sm", children: facility.tag || "" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "p-5 pb-2", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm mb-1.5", children: facility.title }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed", children: facility.description }),
            /* @__PURE__ */ jsx("div", { className: "mt-3.5 border-t border-border/40 pt-3.5 space-y-1.5", children: (Array.isArray(facility.specs) ? facility.specs : typeof facility.specs === "string" ? (() => {
              try {
                return JSON.parse(facility.specs);
              } catch {
                return [];
              }
            })() : []).map((spec, sIdx) => /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-3xs", children: [
              /* @__PURE__ */ jsx("span", { className: "text-text-muted font-semibold", children: spec.label }),
              /* @__PURE__ */ jsx("span", { className: "font-bold text-foreground", children: spec.value })
            ] }, sIdx)) })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "p-5 pt-3", children: /* @__PURE__ */ jsx(Link, { to: "/research", hash: facility.linkHash || "facilities", className: "w-full inline-flex items-center justify-center gap-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white font-bold text-xs uppercase px-4 py-2 transition duration-300 shadow-sm cursor-pointer select-none", children: "Explore Facility →" }) })
      ] }, idx)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent dark:via-emerald-500/2 border-y border-border py-16", id: "field-activities", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-1.5", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20", children: "Ocean Validation" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Field Activities & Ocean Operations" }),
        /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-emerald-500 rounded-full mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-3", children: FIELD_ACTIVITIES.map((activity, idx) => /* @__PURE__ */ jsx("div", { className: "group rounded-xl border border-border bg-card overflow-hidden hover:border-emerald-500/40 hover:shadow-md transition duration-300 flex flex-col justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("div", { className: "h-44 bg-muted relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("img", { src: resolveAssetUrl(activity.image), alt: activity.title, loading: "lazy", className: "w-full h-full object-cover opacity-70 group-hover:scale-103 transition-transform duration-500" }),
          /* @__PURE__ */ jsx("span", { className: "absolute bottom-3 right-3 bg-black/60 text-white font-mono text-4xs px-2 py-0.5 rounded backdrop-blur-xs", children: activity.location }),
          /* @__PURE__ */ jsx("span", { className: "absolute top-3 left-3 bg-emerald-500 text-white font-bold text-3xs uppercase px-2 py-0.5 rounded shadow-sm", children: activity.operationType })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-5", children: [
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm mb-1.5", children: activity.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed", children: activity.description })
        ] })
      ] }) }, idx)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-6 py-16", id: "collaborations", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-1.5", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-emerald-600/10 text-emerald-600 border border-emerald-600/20", children: "Partners & Alliances" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground", children: "Collaborations Snapshot" }),
        /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-emerald-600 rounded-full mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 md:grid-cols-3", children: COLLABORATIONS.map((collab, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 hover:border-emerald-600/40 hover:shadow-md transition duration-300 flex flex-col h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col", children: [
          /* @__PURE__ */ jsx("span", { className: "text-3xs font-mono font-bold text-emerald-600 bg-emerald-600/10 px-2.5 py-1 rounded-md mb-3 inline-block w-fit", children: collab.type }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-foreground text-sm mb-2", children: collab.title }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-text-secondary leading-relaxed mb-4", children: collab.description })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "border-t border-border/40 pt-3.5 mt-auto", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xs font-bold uppercase tracking-wider text-text-muted mb-2", children: "Key Targets" }),
          /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1.5", children: collab.partners.map((partner, pidx) => /* @__PURE__ */ jsx("span", { className: "text-4xs font-semibold bg-secondary text-text-secondary border border-border/30 px-2 py-0.5 rounded-sm", children: partner }, pidx)) })
        ] })
      ] }, idx)) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent dark:via-indigo-500/2 border-y border-border py-16", id: "people-snapshot", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-4 mb-8", children: [
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 mb-1.5", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-2.5 py-0.5 rounded-full text-3xs font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20", children: "Our Team" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground", children: "People Snapshot" }),
        /* @__PURE__ */ jsx("div", { className: "h-1 w-16 bg-indigo-500 rounded-full mt-2" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto mb-10", children: peopleStats.map((stat, idx) => /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 hover:border-indigo-500/40 hover:shadow-xs transition duration-300 text-center flex flex-col justify-center min-h-[140px]", children: [
        /* @__PURE__ */ jsx("div", { className: "rounded-full bg-indigo-500/10 p-2 text-indigo-500 w-fit mx-auto mb-2 dark:bg-indigo-500/20", children: /* @__PURE__ */ jsx(LucideIcon, { name: stat.icon || "Users", className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsx("div", { className: "font-extrabold text-2xl text-indigo-500 mb-0.5", children: /* @__PURE__ */ jsx(AnimatedCounter, { value: stat.count || "0" }) }),
        /* @__PURE__ */ jsx("div", { className: "text-2xs font-bold text-foreground uppercase tracking-wider", children: stat.label }),
        /* @__PURE__ */ jsx("p", { className: "text-4xs text-text-muted mt-1 leading-normal", children: stat.desc || "" })
      ] }, idx)) }),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(Link, { to: "/people", className: "inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs uppercase px-5 py-3 transition duration-300 shadow-md cursor-pointer select-none", children: "Meet Our Team →" }) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { className: "mx-auto max-w-6xl px-6 py-16", id: "quick-access", children: [
      /* @__PURE__ */ jsxs("div", { className: "border-b border-border pb-3 mb-8", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold tracking-tight text-foreground", children: "Quick Access Sections" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted mt-1", children: "Navigate through consolidated research portals, publications, courses, and highlights." })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: sortedQuickAccess.map((item, idx) => {
        const colorClasses = {
          sky: {
            border: "hover:border-sky-400/50",
            bg: "bg-sky-500/10 text-sky-500 group-hover:bg-sky-500",
            text: "group-hover:text-sky-500"
          },
          teal: {
            border: "hover:border-teal-400/50",
            bg: "bg-teal-500/10 text-teal-500 group-hover:bg-teal-500",
            text: "group-hover:text-teal-500"
          },
          indigo: {
            border: "hover:border-indigo-400/50",
            bg: "bg-indigo-500/10 text-indigo-500 group-hover:bg-indigo-500",
            text: "group-hover:text-indigo-500"
          },
          violet: {
            border: "hover:border-violet-400/50",
            bg: "bg-violet-500/10 text-violet-500 group-hover:bg-violet-500",
            text: "group-hover:text-violet-500"
          },
          amber: {
            border: "hover:border-amber-400/50",
            bg: "bg-amber-500/10 text-amber-500 group-hover:bg-amber-500",
            text: "group-hover:text-amber-500"
          },
          cyan: {
            border: "hover:border-cyan-400/50",
            bg: "bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500",
            text: "group-hover:text-cyan-500"
          },
          emerald: {
            border: "hover:border-emerald-400/50",
            bg: "bg-emerald-500/10 text-emerald-500 group-hover:bg-emerald-500",
            text: "group-hover:text-emerald-500"
          }
        };
        const theme = colorClasses[item.color || "sky"] || colorClasses.sky;
        return /* @__PURE__ */ jsxs(Link, { to: item.to || "/", className: `group flex flex-col justify-between rounded-xl border border-border p-4 min-h-[125px] transition-all duration-300 bg-card ${theme.border} hover:bg-card-hover hover:shadow-xs`, children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: `rounded-lg p-2 transition duration-300 w-fit shrink-0 ${theme.bg} group-hover:text-white`, children: /* @__PURE__ */ jsx(LucideIcon, { name: item.icon || "Compass", className: "h-4.5 w-4.5" }) }),
            /* @__PURE__ */ jsx("h3", { className: `text-xs font-bold text-foreground transition-colors duration-300 ${theme.text}`, children: item.label })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between border-t border-border/40 pt-2.5 mt-3", children: [
            /* @__PURE__ */ jsx("p", { className: "text-4xs text-text-muted leading-tight line-clamp-1 pr-2", children: item.description }),
            /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-0.5 text-4xs font-bold shrink-0 ${theme.text} hover:underline`, children: [
              "Go ",
              /* @__PURE__ */ jsx(ArrowRight, { className: "h-3 w-3 group-hover:translate-x-0.5 transition-transform" })
            ] })
          ] })
        ] }, idx);
      }) })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "bg-secondary/40 border-t border-border py-16", id: "contact-preview", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl px-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "max-w-2xl mx-auto text-center mb-10", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 mb-2", children: [
          /* @__PURE__ */ jsx("span", { className: "h-0.5 w-6 bg-accent" }),
          /* @__PURE__ */ jsx("span", { className: "text-xs font-bold uppercase tracking-widest text-accent", children: "Connect With Us" }),
          /* @__PURE__ */ jsx("span", { className: "h-0.5 w-6 bg-accent" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold text-foreground tracking-tight", children: "Contact Information" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-text-muted mt-1", children: "Get in touch for research inquiries, academic collaborations, or program details." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-sky-500/10 to-indigo-500/10 dark:from-sky-500/5 dark:to-indigo-500/5 border border-border/45 p-4 rounded-xl text-center mb-8 max-w-xs mx-auto shadow-xs", children: [
        /* @__PURE__ */ jsx(Building2, { className: "h-7 w-7 text-accent mx-auto mb-2 animate-bounce", style: {
          animationDuration: "3.5s"
        } }),
        /* @__PURE__ */ jsx("div", { className: "text-3xs font-mono font-bold uppercase tracking-wider text-accent-secondary", children: "NITTTR Chennai Campus" }),
        /* @__PURE__ */ jsx("div", { className: "text-4xs text-text-muted mt-0.5", children: "ECE Department Laboratory" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid gap-6 md:grid-cols-3 max-w-4xl mx-auto", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex flex-col items-center text-center shadow-xs h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-full bg-accent/10 p-2.5 text-accent mb-3", children: /* @__PURE__ */ jsx(MapPin, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-xs text-foreground", children: "Postal Address" }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 text-3xs text-text-secondary leading-relaxed", children: [
            "Department of ECE, NITTTR Chennai,",
            /* @__PURE__ */ jsx("br", {}),
            "Taramani, Chennai, Tamil Nadu - 600113"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex flex-col items-center text-center shadow-xs h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-full bg-accent/10 p-2.5 text-accent mb-3", children: /* @__PURE__ */ jsx(Mail, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-xs text-foreground", children: "Email Contact" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xs text-text-secondary leading-relaxed font-mono", children: "orl@nitttrc.ac.in" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex flex-col items-center text-center shadow-xs h-full", children: [
          /* @__PURE__ */ jsx("div", { className: "rounded-full bg-accent/10 p-2.5 text-accent mb-3", children: /* @__PURE__ */ jsx(Phone, { className: "h-5 w-5" }) }),
          /* @__PURE__ */ jsx("h3", { className: "font-bold text-xs text-foreground", children: "Telephone Registry" }),
          /* @__PURE__ */ jsx("p", { className: "mt-2 text-3xs text-text-secondary leading-relaxed font-sans", children: "+91 44 2254 5400" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-10 text-center", children: /* @__PURE__ */ jsx(Link, { to: "/contact", className: "inline-flex items-center gap-2 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs uppercase px-5 py-3 transition duration-300 shadow-md", children: "View Full Contact Details →" }) })
    ] }) })
  ] });
}
export {
  Home as component
};
