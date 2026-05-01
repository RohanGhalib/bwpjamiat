"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function revalidateTeam() {
  revalidateTag("ember_team");
  revalidatePath("/ember/team");
  revalidatePath("/ember");
}

export async function revalidateEvents() {
  revalidateTag("events");
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function revalidateTaranas() {
  revalidateTag("taranas");
  revalidatePath("/admin/taranas");
  revalidatePath("/taranas");
}
