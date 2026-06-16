import { createFileRoute } from "@tanstack/react-router";
import { RecordList } from "@/components/record-list";

export const Route = createFileRoute("/legacy/research-supervision")({
  head: () => ({
    meta: [
      { title: "Research Supervision — Academic Repository" },
      {
        name: "description",
        content:
          "Academic research supervision, doctoral committee evaluations, and advisory panels.",
      },
    ],
  }),
  component: () => <RecordList type="dc" />,
});
