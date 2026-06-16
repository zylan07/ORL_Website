import { createFileRoute } from "@tanstack/react-router";
import { RecordList } from "@/components/record-list";

export const Route = createFileRoute("/legacy/bos")({
  head: () => ({ meta: [{ title: "Board of Studies — UWARL" }] }),
  component: () => <RecordList type="bos" />,
});
