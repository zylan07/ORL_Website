import { createFileRoute } from "@tanstack/react-router";
import { RecordList } from "@/components/record-list";

export const Route = createFileRoute("/legacy/pg")({
  head: () => ({
    meta: [
      { title: "PG Courses — UWARL" },
      {
        name: "description",
        content:
          "Post Graduate courses and subjects taught and coordinated by laboratory faculty.",
      },
    ],
  }),
  component: () => <RecordList type="pg" />,
});
