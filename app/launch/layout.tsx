import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Launch Experience | IJT Bahawalpur",
  description: "Special launch experience for IJT Bahawalpur.",
  path: "/launch",
  noIndex: true,
});

export default function LaunchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
