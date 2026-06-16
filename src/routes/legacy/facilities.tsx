import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Anchor, Compass, Shield } from "lucide-react";

const facilitiesSearchSchema = z.object({
  tab: z
    .enum([
      "equipment",
      "test-facilities",
      "underwater-systems",
      "field-instruments",
    ])
    .optional(),
});

export const Route = createFileRoute("/legacy/facilities")({
  validateSearch: (search) => facilitiesSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Facilities — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Discover the testing facilities, subsea equipment, and ocean instruments at the Ocean Research Laboratory.",
      },
    ],
  }),
  component: FacilitiesPage,
});

function FacilitiesPage() {
  const { tab } = Route.useSearch();
  const currentTab = tab || "equipment";

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors duration-300">
      {/* Secondary Sticky Navbar */}
      <div className="sticky top-[56px] z-30 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-2.5">
        <div className="mx-auto max-w-6xl flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            to="/legacy/facilities"
            search={{ tab: "equipment" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "equipment"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Equipment
          </Link>
          <Link
            to="/legacy/facilities"
            search={{ tab: "test-facilities" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "test-facilities"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Test Facilities
          </Link>
          <Link
            to="/legacy/facilities"
            search={{ tab: "underwater-systems" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "underwater-systems"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Underwater Systems
          </Link>
          <Link
            to="/legacy/facilities"
            search={{ tab: "field-instruments" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "field-instruments"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Field Instruments
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
            <li>
              <span>›</span>
              <span>Facilities</span>
            </li>
            <li>
              <span>›</span>
              <span className="font-medium text-text-secondary capitalize">
                {currentTab.replace("-", " ")}
              </span>
            </li>
          </ol>
        </nav>

        {currentTab === "equipment" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Sensors & Equipment
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Acoustic Transducers & Measurement Devices
              </p>
            </div>

            <div className="prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                The Ocean Research Laboratory houses specialised hardware to
                facilitate underwater acoustic signal telemetry and sensor
                calibration.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide">
                    Hydrophones & Transducers
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    Precision piezoelectric receivers (hydrophones) with
                    integrated pre-amplification modules calibrated for ocean
                    noise logging between 10 Hz and 100 kHz.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide">
                    Data Acquisition Systems (DAQ)
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    High-speed analog-to-digital converters (NI-DAQ cards)
                    optimized for multi-channel acoustic array acquisitions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "test-facilities" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Test Facilities
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Controlled Wet Labs
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 overflow-hidden hover:bg-card-hover transition-all duration-300">
                <div className="h-48 rounded-lg overflow-hidden bg-slate-950 relative mb-4">
                  <img
                    src="/images/laboratory_workspace.png"
                    alt="Acoustic Test Tank"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <span className="absolute bottom-3 left-3 bg-accent-secondary text-white font-bold text-3xs uppercase px-2 py-0.5 rounded">
                    10,874L Capacity
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Indoor Acoustic Test Tank
                </h3>
                <p className="mt-3 text-xs text-text-secondary leading-relaxed font-sans">
                  The primary wet testing facility is an indoor glass/reinforced
                  test tank basin measuring approximately{" "}
                  <strong className="text-foreground">
                    12&apos; L &times; 8&apos; W &times; 4&apos; H
                  </strong>
                  . Used extensively for sensor calibration, array alignment,
                  and testing ROV buoyancy parameters before sea deployments.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentTab === "underwater-systems" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Underwater Systems
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Deployable Subsea Platforms
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6 hover:bg-card-hover transition-all duration-300">
                <div className="h-48 rounded-lg overflow-hidden bg-slate-950 relative mb-4">
                  <img
                    src="/images/underwater_robot.png"
                    alt="ORCA ROV"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <span className="absolute bottom-3 left-3 bg-accent text-white font-bold text-3xs uppercase px-2 py-0.5 rounded">
                    Inspection Class
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  ORCA Remotely Operated Vehicle
                </h3>
                <p className="mt-3 text-xs text-text-secondary leading-relaxed font-sans">
                  Developed entirely in-house by the laboratory scholars, ORCA
                  is a light inspection-class ROV system. Outfitted with
                  multiple thruster modules, LED lights, depth sensors, and a
                  high-definition video camera. Used for seabed biological
                  monitoring and coral diagnostics.
                </p>
              </div>
            </div>
          </div>
        )}

        {currentTab === "field-instruments" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Field Instruments
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Marine Profiling & Mapping Telemetry
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors duration-300">
                <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                  <Compass className="h-4.5 w-4.5 text-accent" />
                  <span>Side-Scan Sonar (SSS)</span>
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Used for seabed acoustic mapping, highlighting geological
                  formations and subsea debris layouts during coastal research
                  trials.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors duration-300">
                <h3 className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                  <Anchor className="h-4.5 w-4.5 text-accent-secondary" />
                  <span>Sound Velocity Profiler (SVP)</span>
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Measures sound velocity variations across temperature
                  gradients to optimize acoustic telemetry ray-tracing
                  algorithms.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
