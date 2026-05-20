import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Islami Jamiat-e-Talaba Bahawalpur",
    short_name: "IJT BWP",
    description: "Official website for Islami Jamiat-e-Talaba Bahawalpur.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFCFF",
    theme_color: "#123962",
    icons: [
      {
        src: absoluteUrl("/logo.png"),
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: absoluteUrl("/logo.png"),
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
