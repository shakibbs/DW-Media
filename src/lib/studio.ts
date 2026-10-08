export const services = [
  { name: "TVC Production", short: "Stories made for the big screen.", description: "High-impact television commercials for brands and products, with international-standard visual production.", image: "/media/tvc-production.png", world: "gold", frame: "BROADCAST / COMMERCIAL" },
  { name: "OVC Production", short: "Small screens. Lasting impressions.", description: "Modern online video commercials that quickly capture audiences across social and digital platforms.", image: "/media/ovc-production.png", world: "cyan", frame: "DIGITAL / COMMERCIAL" },
  { name: "Video Production", short: "Every story deserves a great frame.", description: "Professional corporate films, product promotions, documentaries and video content, from concept to final cut.", image: "/media/video-production.png", world: "silver", frame: "FILM / STORYTELLING" },
  { name: "Photography", short: "A moment. An entire story.", description: "High-resolution product, fashion, corporate and commercial photography that brings your campaign into focus.", image: "/media/photography.png", world: "silver", frame: "STILLS / CAMPAIGNS" },
  { name: "Digital Content Creation", short: "Made for the culture. Built for your brand.", description: "Trendy, engaging branded content for Facebook, TikTok and Instagram.", image: "/media/digital-content-creation.png", world: "cyan", frame: "SOCIAL / CONTENT" },
  { name: "Event Production", short: "From an idea to a live experience.", description: "Planning, stage and set design, and flawless execution for corporate events and experiences of every scale.", image: "/media/institutional-awards.png", world: "gold", frame: "LIVE / EXPERIENCES" },
  { name: "Model Management", short: "The right face. The right presence.", description: "Professional model scouting, grooming and casting direction for advertising and production.", image: "/media/fashion-runway.png", world: "gold", frame: "TALENT / CASTING" },
  { name: "Media Management", short: "Your story, in the right places.", description: "Content distribution, campaign planning and digital media management across the platforms that matter.", image: "/media/anandobinodon-legacy.png", world: "cyan", frame: "STRATEGY / DISTRIBUTION" },
] as const;

/**
 * A finished production. Only `title`, `category`, `image`, `credit` and
 * `description` are required — every other field is rendered only when it is
 * supplied, so nothing is ever invented. Add real `client`, `year`, `video`,
 * `gallery` and `production` details here as they become available.
 */
export type Project = {
  title: string;
  category: string;
  image: string;
  credit: string;
  description: string;
  client?: string;
  year?: string;
  status?: string;
  video?: string;
  gallery?: readonly string[];
  production?: readonly string[];
};

export const portfolio: Project[] = [
  {
    title: "BCCA Awards 2026",
    category: "Award & Creator Platform",
    image: "/media/bcca-awards-cover.png",
    credit: "DW Production Media In Association with Dhaka Model Agency & Anando Binnodon",
    description: "Bangladesh Creative / Creator Content Awards 2026. Envisioned by Founder & Program Head Md. Al Naser as a premium national creator economy platform connecting creators, brands, media, celebrities, and youth culture under one credible ecosystem.",
    client: "Corporate Sponsors & Stakeholders",
    year: "2026",
    gallery: [
      "/media/bcca-awards-cover.png",
      "/media/bcca-slide-07-dma-photos.jpg",
      "/media/bcca-slide-08-runway-photos.jpg",
      "/media/bcca-slide-10-magazine-covers.jpg",
      "/media/bcca-slide-11-recognition-photos.jpg",
      "/media/bcca-slide-07-dma-photos.jpg",
    ],
  },
  {
    title: "BCCA Award 2026",
    category: "Award & Creator Platform",
    status: "UPCOMING",
    image: "/media/cca-awards-cover.png",
    credit: "DW Production Media In Association with Dhaka Model Agency & Anando Binodon",
    description: "Bangladesh Creator Content Awards 2026. Celebrating Digital Excellence at Bangladesh-China Friendship Exhibition Center (Hall of Fame) on 03-11-2026.",
    client: "Upcoming Project Profile",
    year: "2026",
    gallery: [
      "/media/cca-awards-cover.png",
      "/media/cca-slide-08-media.png",
      "/media/cca-slide-09-categories.png",
      "/media/cca-slide-10-rafsan.png",
      "/media/cca-slide-11-drama.png",
      "/media/cca-slide-12-music.png",
      "/media/cca-slide-13-bachelor.png",
      "/media/cca-slide-14-entertainment.png",
      "/media/cca-slide-15-dance.png",
      "/media/cca-slide-19-hosts.png",
    ],
  },
];

export function filterPortfolio(category: string) {
  return category === "All work" ? portfolio : portfolio.filter((item) => item.category === category);
}

export type UpcomingStatus = "PRE-PRODUCTION" | "IN PRODUCTION" | "COMING SOON";

/** Upcoming productions. */
export type Upcoming = {
  title: string;
  category: string;
  credit: string;
  status: UpcomingStatus;
  image: string;
  year?: string;
  note?: string;
  description?: string;
};

export const upcoming: Upcoming[] = [
  {
    title: "BCCA Awards 2026",
    category: "CREATOR ECONOMY PLATFORM",
    credit: "DW Production Media · In Strategic Association with Dhaka Model Agency & Anando Binnodon",
    status: "PRE-PRODUCTION",
    image: "/media/behind-the-scenes.png",
    year: "2026",
    note: "Recognizing creators, influencers, entertainers & digital excellence in Bangladesh.",
    description: "BCCA Awards 2026 is being developed as a long-term national creator economy platform, connecting creators, brands, media, celebrities, and youth culture under one credible ecosystem. Program Head: Md. Al Naser.",
  },
];

/** Drop a compressed MP4/WebM path (e.g. "/media/showreel.mp4") into `src` to enable the player. */
export const showreel: { src: string; poster: string } = {
  src: "",
  poster: "/media/behind-the-scenes.png",
};

export const process = [
  { name: "Idea", text: "Every production begins with a spark worth chasing." },
  { name: "Concept", text: "Story, tone and visual language take shape." },
  { name: "Pre-production", text: "Planning, casting, locations, schedules and set design." },
  { name: "Production", text: "Cameras roll. The idea becomes image and sound." },
  { name: "Post-production", text: "Edit, grade, sound and finishing." },
  { name: "Delivery", text: "Final assets, prepared for the platforms that matter." },
] as const;

export const processImages = [
  "/media/behind-the-scenes.png",
  "/media/bcca-slide-12-execution-photos.jpg",
  "/media/model-management.png",
  "/media/fashion-runway.png",
  "/media/anandobinodon-legacy.png",
] as const;

export const contact = {
  email: "dwproductionmedia@gmail.com",
  phone: "+880 1345-741060",
  phoneHref: "tel:+8801345741060",
  address: ["House 8, 9, 10/3, Free School Street", "Panthapath Road, Dhaka 1205, Bangladesh"],
} as const;

export const partners = ["Dhaka Model Agency", "Anondo Binodon", "Neo Classic Media"] as const;

export const navLinks = [
  { label: "Work", target: "#work", image: portfolio[0]?.image ?? "/media/bcca-awards-cover.png" },
  { label: "Services", target: "#services", image: "/media/behind-the-scenes.png" },
  { label: "Studio", target: "#studio", image: "/media/anandobinodon-legacy.png" },
  { label: "Showreel", target: "#showreel", image: "/media/fashion-runway.png" },
  { label: "Contact", target: "#contact", image: "/media/model-management.png" },
] as const;