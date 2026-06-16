import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Anchor, Compass, Activity, Map } from "lucide-react";

const fieldSearchSchema = z.object({
  tab: z
    .enum(["surveys", "data-collection", "sea-trials", "expeditions"])
    .optional(),
});

export const Route = createFileRoute("/legacy/field-activities")({
  validateSearch: (search) => fieldSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Field Activities — Ocean Research Laboratory" },
      {
        name: "description",
        content:
          "Details of subsea surveys, ambient noise collections, and open-ocean vehicle expeditions.",
      },
    ],
  }),
  component: FieldActivitiesPage,
});

function FieldActivitiesPage() {
  const { tab } = Route.useSearch();
  const currentTab = tab || "surveys";

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors duration-300">
      {/* Secondary Sticky Navbar */}
      <div className="sticky top-[56px] z-30 w-full border-b border-border bg-background/85 backdrop-blur-md px-6 py-2.5">
        <div className="mx-auto max-w-6xl flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            to="/legacy/field-activities"
            search={{ tab: "surveys" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "surveys"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Ocean Surveys
          </Link>
          <Link
            to="/legacy/field-activities"
            search={{ tab: "data-collection" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "data-collection"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Data Collection
          </Link>
          <Link
            to="/legacy/field-activities"
            search={{ tab: "sea-trials" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "sea-trials"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Sea Trials
          </Link>
          <Link
            to="/legacy/field-activities"
            search={{ tab: "expeditions" }}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${
              currentTab === "expeditions"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "text-text-muted hover:text-foreground border border-transparent"
            }`}
          >
            Expeditions
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
              <span>Field Activities</span>
            </li>
            <li>
              <span>›</span>
              <span className="font-medium text-text-secondary capitalize">
                {currentTab.replace("-", " ")}
              </span>
            </li>
          </ol>
        </nav>

        {currentTab === "surveys" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Ocean Surveys
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Bathymetric Mapping & Estuary Auditing
              </p>
            </div>

            <div className="prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                Our laboratory coordinates regular ocean and estuary bathymetry
                mapping surveys to audit spatial depth parameters and seabed
                profiles in local ports and shallow sea zones.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide flex items-center gap-2">
                    <Compass className="h-4.5 w-4.5 text-accent" />
                    <span>Coastal Chennai Profiling</span>
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    Conducted shallow harbor transects logging backscatter
                    profiles to track silt buildup and map local underwater
                    obstacles.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "data-collection" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Data Collection
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Ambient Noise & Sound Profiling Logs
              </p>
            </div>

            <div className="prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                Data logging runs are scheduled at selected offshore coordinates
                to build a comprehensive historical record of ambient acoustic
                noise levels.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide flex items-center gap-2">
                    <Activity className="h-4.5 w-4.5 text-accent-secondary" />
                    <span>Bay of Bengal Acoustic Datasets</span>
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    Logged ship propeller backscatter patterns, wind-induced
                    wave noise, and thermal gradient logs to validate underwater
                    channel telemetry codes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "sea-trials" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Sea Trials
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Vehicle Buoyancy & Telemetry Field Testing
              </p>
            </div>

            <div className="prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                Before deploying newly designed subsea hardware, rigorous
                open-water field trials are conducted to verify buoyancy
                control, thruster efficiency, and waterproof sealing.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide flex items-center gap-2">
                    <Anchor className="h-4.5 w-4.5 text-accent" />
                    <span>ORCA ROV Sea Validations</span>
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    Conducted subsea deployments down to 15 meters to calibrate
                    motor controllers, test optical feed latency, and verify
                    telemetry integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentTab === "expeditions" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-border pb-4">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Ocean Expeditions
              </h1>
              <p className="text-xs text-accent mt-1.5 font-mono uppercase tracking-wider font-semibold">
                Collaborative Deep Water Deployments
              </p>
            </div>

            <div className="prose prose-invert text-text-secondary text-sm leading-relaxed space-y-4">
              <p>
                Collaborative deep-water expeditions are coordinated in
                partnership with government organizations, providing access to
                specialized research vessels and deep marine trial sites.
              </p>

              <div className="grid gap-4 mt-6">
                <div className="rounded-lg border border-border bg-card p-4 hover:bg-card-hover transition-colors duration-300">
                  <h4 className="font-bold text-foreground text-xs uppercase tracking-wide flex items-center gap-2">
                    <Map className="h-4.5 w-4.5 text-accent-secondary" />
                    <span>National Laboratory Joint Cruises</span>
                  </h4>
                  <p className="mt-1 text-2xs text-text-muted">
                    Participated in research cruises for hydrophone calibration,
                    deep sea profiling, and testing subsea communications
                    transceivers.
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
