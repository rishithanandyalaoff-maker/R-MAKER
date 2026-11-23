import type { Metadata } from "next";
import { PrintablePlan } from "@/components/plan/printable-plan";

export const metadata: Metadata = {
  title: "My Plan (printable)",
};

export default function PrintPlanPage() {
  return <PrintablePlan />;
}
