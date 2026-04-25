import type { Metadata } from "next";
import { doc, getDoc } from "firebase/firestore";

import { type EventRecord } from "@/lib/event-utils";
import { db } from "@/lib/firebase";
import { absoluteUrl, siteConfig } from "@/lib/site";

type EventLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: EventLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const eventSnapshot = await getDoc(doc(db, "events", id));

  const event = eventSnapshot.exists()
    ? ({ id: eventSnapshot.id, ...(eventSnapshot.data() as Omit<EventRecord, "id">) } as EventRecord)
    : null;

  if (!event) {
    return {
      title: `Event Not Found | ${siteConfig.name}`,
      description: "The requested event could not be found.",
    };
  }

  const title = `${event.title} | ${siteConfig.name}`;
  const description = event.description || `${event.title} at ${event.location || "Bahawalpur"}.`;
  const canonicalUrl = absoluteUrl(`/events/${event.id}`);
  const imageUrl = event.imageUrl || absoluteUrl(siteConfig.defaultOgImage);

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: imageUrl,
          alt: event.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default function EventLayout({ children }: EventLayoutProps) {
  return <>{children}</>;
}
