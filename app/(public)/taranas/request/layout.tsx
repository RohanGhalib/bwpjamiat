import type { Metadata } from "next";

import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Request a Tarana | IJT Bahawalpur",
  description: "Suggest a tarana for the IJT Bahawalpur collection and help expand the archive of official anthems.",
  path: "/taranas/request",
});

export default function RequestTaranaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
