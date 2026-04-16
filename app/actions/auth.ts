"use server";
import { cookies } from "next/headers";

export async function submitAdminLogin(password: string) {
  if (password === "ubaidnazim") {
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
