export const siteConfig = {
  name: "IJT Bahawalpur",
  url: "https://www.bwpjamiat.org",
  defaultDescription:
    "Official website for Islami Jamiat-e-Talaba Bahawalpur. Largest student organization in Pakistan.",
  defaultOgImage: "/logo.png",
};

export function absoluteUrl(path = "") {
  return new URL(path, siteConfig.url).toString();
}
