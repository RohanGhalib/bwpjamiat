import { cookies } from "next/headers";
import AdminLogin from "./AdminLogin";

export default async function AdminAuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "authenticated";

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return children;
}
