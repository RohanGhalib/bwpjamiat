"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_PASSWORD = "ubaidnazim";

export async function submitAdminLogin(password: string) {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_auth", "authenticated", { 
       path: "/", 
       httpOnly: true, 
       secure: process.env.NODE_ENV === "production",
       maxAge: 60 * 60 * 24 * 7 // 1 week
    });
    return true;
  }
  return false;
}

export async function submitAdminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
  redirect("/admin");
}
