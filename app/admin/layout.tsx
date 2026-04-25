import { Suspense } from "react";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";

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
