import type { MetadataRoute } from "next";
import { collection, getDocs, query } from "firebase/firestore";

import { getTaranas } from "@/lib/db";
import { db } from "@/lib/firebase";
import { absoluteUrl } from "@/lib/site";

type EventSitemapRecord = {
  id: string;
  updatedAt?: string;
  imageUrl?: string;
};

function staticRoute(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified: new Date(),
    changeFrequency,
    priority,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [
    staticRoute("/", 1.0, "daily"),
    staticRoute("/ember", 1.0, "daily"),
    staticRoute("/aghaz", 0.9, "daily"),
    staticRoute("/contact", 0.8, "monthly"),
    staticRoute("/events", 1.0, "daily"),
    staticRoute("/taranas", 0.9, "daily"),
    staticRoute("/taranas/request", 0.7, "monthly"),
    staticRoute("/articles", 0.9, "daily"),
    staticRoute("/literature", 0.8, "daily"),
    staticRoute("/lms", 0.6, "monthly"),
  ];

  try {
    const taranas = await getTaranas();

    routes.push(
      ...taranas.map((tarana) => ({
        url: absoluteUrl(`/taranas/${tarana.id}`),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: tarana.coverUrl ? [tarana.coverUrl] : undefined,
      }))
    );
  } catch (error) {
    console.error("Failed to load taranas for sitemap:", error);
  }

  try {
    const eventsSnapshot = await getDocs(query(collection(db, "events")));
    const events = eventsSnapshot.docs.map(
      (document) => ({ id: document.id, ...(document.data() as Omit<EventSitemapRecord, "id">) }) as EventSitemapRecord
    );

    routes.push(
      ...events.map((event) => ({
        url: absoluteUrl(`/events/${event.id}`),
        lastModified: event.updatedAt ? new Date(event.updatedAt) : new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        images: event.imageUrl ? [event.imageUrl] : undefined,
      }))
    );
  } catch (error) {
    console.error("Failed to load events for sitemap:", error);
  }

  return routes;
}
