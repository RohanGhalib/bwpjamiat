"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function revalidateTeam() {
  revalidateTag("ember_team", { expire: 0 });
  revalidatePath("/ember/team");
  revalidatePath("/ember");
}

export async function revalidateEvents() {
  revalidateTag("events", { expire: 0 });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function revalidateTaranas() {
  revalidateTag("taranas", { expire: 0 });
  revalidatePath("/admin/taranas");
  revalidatePath("/taranas");
}
