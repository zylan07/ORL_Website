import { createFileRoute } from "@tanstack/react-router";
import { RecordList } from "@/components/record-list";
import { PageHero } from "@/components/page-hero";
import { useSiteSettings } from "@/lib/admin-store";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards & Recognition — Ocean Research Laboratory" },
      {
        name: "description",
        content: "Awards and recognitions received by laboratory members.",
      },
    ],
  }),
  component: AwardsPage,
});

function AwardsPage() {
  const settings = useSiteSettings();
  const hero = settings.awardsHero || {
    title: "Awards & Recognition",
    subtitle: "Celebrating Scientific & Academic Excellence",
    description: "A legacy of research breakthroughs, keynotes, best presentation honors, and national recognitions.",
    mediaType: "none",
    mediaUrl: "",
    mediaPosition: "background",
    overlayOpacity: 60
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-16 transition-colors duration-300">
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        mediaType={hero.mediaType}
        mediaUrl={hero.mediaUrl}
        mediaPosition={hero.mediaPosition}
        overlayOpacity={hero.overlayOpacity}
      />
      <div className="mx-auto max-w-6xl px-6 mt-10">
        <RecordList type="award" hideHeader={true} />
      </div>
    </div>
  );
}
