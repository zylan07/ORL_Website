import { createFileRoute } from "@tanstack/react-router";
import { RecordList } from "@/components/record-list";

export const Route = createFileRoute("/awards")({
  head: () => ({
    meta: [
      { title: "Awards & Recognition — UWARL" },
      {
        name: "description",
        content: "Awards and recognitions received by laboratory members.",
      },
    ],
  }),
  component: () => <RecordList type="award" />,
});
