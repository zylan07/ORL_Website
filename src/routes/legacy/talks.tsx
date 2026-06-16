import { createFileRoute } from "@tanstack/react-router";
import { RecordList } from "@/components/record-list";

export const Route = createFileRoute("/legacy/talks")({
  head: () => ({
    meta: [
      { title: "Invited Talks — UWARL" },
      {
        name: "description",
        content:
          "Invited lectures and keynote presentations by laboratory members.",
      },
    ],
  }),
  component: () => <RecordList type="talk" />,
});
