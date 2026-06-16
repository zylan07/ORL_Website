import { createFileRoute } from "@tanstack/react-router";
import { RecordList } from "@/components/record-list";

export const Route = createFileRoute("/legacy/workshops")({
  head: () => ({
    meta: [
      { title: "Workshops — UWARL" },
      {
        name: "description",
        content:
          "Workshops, tutorials, and short courses organized by the laboratory.",
      },
    ],
  }),
  component: () => <RecordList type="workshop" />,
});
