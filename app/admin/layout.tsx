import type { Metadata } from "next";
import { Suspense } from "react";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Dashboard | IJT Bahawalpur",
  description: "Internal administration area for IJT Bahawalpur.",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAFCFF]" />}>
      <AdminAuthWrapper>{children}</AdminAuthWrapper>
    </Suspense>
  );
}
