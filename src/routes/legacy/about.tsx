import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  Compass,
  Calendar,
  Award,
  Globe,
  History,
  ArrowRight,
} from "lucide-react";

const aboutSearchSchema = z.object({
  tab: z
    .enum(["overview", "vision-mission", "history", "collaborations"])
    .optional(),
});

export const Route = createFileRoute("/legacy/about")({
  validateSearch: (search) => aboutSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "About — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Learn about the history, evolution, vision, and mission of the Ocean Research Laboratory at NITTTR Chennai.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { tab } = Route.useSearch();
  const currentTab = tab || "overview";

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors duration-300">
      {/* Secondary Sticky Navbar */}
      <div className="sticky top-[56px] z-30 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-2.5">
        <div className="mx-auto max-w-6xl flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            to="/legacy/about"
            search={{ tab: "overview" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "overview"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Overview
          </Link>
          <Link
            to="/legacy/about"
            search={{ tab: "vision-mission" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "vision-mission"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Vision & Mission
          </Link>
          <Link
            to="/legacy/about"
            search={{ tab: "history" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "history"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            History & Evolution
          </Link>
          <Link
            to="/legacy/about"
            search={{ tab: "collaborations" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "collaborations"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Collaborations
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-4xl px-6 mt-10">
        {/* Breadcrumbs */}
        <nav className="text-3xs text-text-muted mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link to="/" className="hover:text-accent transition-colors">
                Home
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <span>›</span>
              <span>About</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span>›</span>
              <span className="font-medium text-text-secondary capitalize">
                {currentTab.replace("-", " & ")}
              </span>
            </li>
          </ol>
        </nav>

        {currentTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Laboratory Overview
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Department of ECE, NITTTR Chennai
              </p>
            </div>

            <div className="prose prose-invert max-w-none text-text-secondary space-y-6 text-sm leading-relaxed">
              <p>
                The{" "}
                <strong className="text-foreground">
                  Ocean Research Laboratory (ORL)
                </strong>{" "}
                is a premier scientific research unit focused on underwater
                technology, acoustics, and ocean engineering systems.
                Established originally to address critical signal gaps in
                underwater acoustic arrays, the lab has expanded into a center
                for technological validation, doctoral research supervision, and
                capacity building.
              </p>
              <p>
                Currently housed in the Department of Electronics and
                Communication Engineering at the National Institute of Technical
                Teachers Training and Research (NITTTR), Chennai, the laboratory
                provides an active test environment combining digital signal
                processing algorithms with mechanical deployment platforms.
              </p>

              <div className="grid gap-6 sm:grid-cols-2 mt-8">
                <div className="rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors duration-300">
                  <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                    <Compass className="h-4.5 w-4.5 text-accent" />
                    <span>Acoustic Inversion</span>
                  </h3>
                  <p className="text-xs text-text-muted">
                    Investigating underwater channel estimation, spatial
                    filtering, ambient noise, and signal extraction under heavy
                    marine attenuation.
                  </p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors duration-300">
                  <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                    <Globe className="h-4.5 w-4.5 text-accent-secondary" />
                    <span>Underwater Robotic Systems</span>
                  </h3>
                  <p className="text-xs text-text-muted">
                    Prototyping inspection-class ROVs and testing subsea sensory
                    configurations in real ocean trials and test tank basins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "vision-mission" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Vision & Mission
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Our Core Directives
              </p>
            </div>

            <div className="space-y-8">
              {/* Vision Card */}
              <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-xl"></div>
                <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent"></span>
                  <span>Vision Statement</span>
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed italic">
                  &ldquo;To be recognized globally as an institutional center of
                  excellence in ocean technologies and underwater acoustics. We
                  strive to pioneer sustainable engineering models, foster
                  interdisciplinary marine studies, and empower technical
                  educators and researchers to navigate and preserve subsea
                  domains.&rdquo;
                </p>
              </div>

              {/* Mission Steps */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-secondary"></span>
                  <span>Mission Objectives</span>
                </h3>
                <div className="grid gap-4">
                  <div className="rounded-lg border border-border bg-card p-4">
                    <span className="text-xs font-mono text-accent-secondary font-bold block mb-1">
                      01. Scientific Excellence
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Publish high-impact, peer-reviewed oceanographic and
                      acoustic research, pushing boundaries in digital signal
                      processing, coral diagnostics, and subsea automation.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <span className="text-xs font-mono text-accent-secondary font-bold block mb-1">
                      02. Capacity Building
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Deliver specialized training, technical courses, and
                      workshops for scholars, technical faculty, and
                      international delegations to foster professional
                      capability.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-card p-4">
                    <span className="text-xs font-mono text-accent-secondary font-bold block mb-1">
                      03. Technological Innovation
                    </span>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      Prototype custom subsea systems (like ORCA ROV), sensor
                      frameworks, and seawater energy converters, providing
                      reliable consultancy to defense and marine industries.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "history" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                History & Evolution
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                ORL Timeline & Relocation
              </p>
            </div>

            <div className="relative border-l border-border ml-3 pl-6 space-y-8">
              {/* Present Node */}
              <div className="relative">
                <div className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent">
                  <div className="h-2 w-2 rounded-full bg-background"></div>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Present: ORL at NITTTR Chennai (2024 - Present)
                </h3>
                <span className="inline-block rounded bg-accent/10 px-2 py-0.5 text-4xs font-bold font-mono text-accent uppercase tracking-wider mt-1 border border-accent/20">
                  Active Focus Area
                </span>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  In September 2024, the laboratory relocated to the National
                  Institute of Technical Teachers Training and Research
                  (NITTTR), Chennai. Now operating in a dedicated technical
                  teacher education environment, ORL merges advanced subsea
                  research with educator training and PG programs, establishing
                  direct validation platforms for underwater telemetry.
                </p>
              </div>

              {/* Transition Node */}
              <div className="relative">
                <div className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent-secondary">
                  <div className="h-2 w-2 rounded-full bg-background"></div>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Transition & Relocation (2024)
                </h3>
                <p className="mt-2 text-xs text-text-secondary leading-relaxed">
                  Following Dr. S. Sakthivel Murugan&apos;s transition to NITTTR
                  Chennai, the core lab equipment (hydrophone arrays, acoustic
                  profilers, side-scan sonar, and subsea drones) was
                  systematically migrated to support the institute&apos;s
                  academic infrastructure.
                </p>
              </div>

              {/* Origin Node */}
              <div className="relative opacity-75 hover:opacity-100 transition-opacity">
                <div className="absolute -left-[30px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-text-muted">
                  <div className="h-2 w-2 rounded-full bg-background"></div>
                </div>
                <h3 className="text-lg font-bold text-text-secondary">
                  Foundation & Early Development (2015)
                </h3>
                <p className="mt-2 text-xs text-text-muted leading-relaxed">
                  The laboratory originated in 2015 at the SSN College of
                  Engineering as the UnderWater Acoustic Research Lab (UWARL)
                  under the ECE department. Seed funding and initial
                  infrastructure enabled the team to build a 10,874-liter test
                  tank, publish early works on coral classification, and begin
                  prototyping AUV telemetry systems.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentTab === "collaborations" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Institutional Collaborations
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Synergies & Partnerships
              </p>
            </div>

            <div className="prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                To maintain standard validation protocols, ORL engages in active
                technical partnerships with leading academic institutes,
                national laboratories, and subsea defense contractors.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide">
                    National Institute of Ocean Technology (NIOT)
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    Joint validation of acoustic ambient noise profiles, sharing
                    datasets on ocean temperature gradients, and collaborative
                    field trials.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide">
                    Indian Institute of Technology (IIT) Madras
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    Research exchanges in subsea hydroacoustic modeling and
                    signal processing algorithms.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide">
                    Anna University Chennai
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    Academic coordination, doctoral evaluations, and advisory
                    committee interactions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
