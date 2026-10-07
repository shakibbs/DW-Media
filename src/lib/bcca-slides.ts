export type SlideSection = {
  title: string;
  text: string;
};

export type BCCASlide = {
  id: number;
  type: "image" | "text" | "contact";
  header: string;
  subtitle: string;
  image?: string;
  sections?: SlideSection[];
  highlights?: string[];
  contactInfo?: {
    title: string;
    subtitle: string;
    description: string;
    founder: string;
    phone: string;
    email: string;
  };
};

export const bccaSlides: BCCASlide[] = [
  {
    id: 1,
    type: "image",
    header: "OFFICIAL WORK PROFILE",
    subtitle: "DW Production Media In Strategic Association With Dhaka Model Agency & Anando Binnodon",
    image: "/media/bcca-awards-cover.png",
  },
  {
    id: 2,
    type: "text",
    header: "About DW Production Media",
    subtitle: "Modern media initiative with strategic collaborators",
    sections: [
      {
        title: "Who We Are",
        text: "DW Production Media is a new-generation media and entertainment initiative focused on creator-led events, influencer campaigns, brand experiences, digital content, award show concepts and large-scale entertainment platforms.",
      },
      {
        title: "Important Positioning",
        text: "DW Production Media is new in formal structure, but the project is being developed with experienced industry collaborators from fashion, entertainment media, production, celebrity coordination and cultural event backgrounds.",
      },
      {
        title: "Corporate Promise",
        text: "Our approach is built on organized planning, partner-driven execution, brand-safe presentation and transparent sponsor deliverables.",
      },
    ],
  },
  {
    id: 3,
    type: "text",
    header: "BCCA Awards 2026",
    subtitle: "Project relevance and market opportunity",
    sections: [
      {
        title: "Why Now",
        text: "Bangladesh has a rapidly growing digital audience. Creators now influence consumer trends, fashion, food, technology, lifestyle, entertainment and youth culture.",
      },
      {
        title: "Project Need",
        text: "There are established awards for film, drama and traditional media, but a large-scale premium recognition platform for digital creators is still an emerging opportunity.",
      },
      {
        title: "BCCA Direction",
        text: "BCCA aims to recognize creators across multiple categories while giving brands direct access to a highly active digital-first audience.",
      },
    ],
  },
  {
    id: 4,
    type: "text",
    header: "Founder Vision",
    subtitle: "Why BCCA is being developed",
    sections: [
      {
        title: "Message from the Founder",
        text: "Bangladesh is experiencing a powerful digital transformation. Thousands of talented creators are shaping youth culture, consumer behaviour and modern media trends every day. BCCA Awards 2026 has been envisioned as a premium national platform to recognize creators, influencers, entertainers and digital excellence.",
      },
      {
        title: "Our Direction",
        text: "DW Production Media is developing BCCA as a long-term creator economy platform, not only as a one-day event. The vision is to connect creators, brands, media, celebrities and audiences under one credible ecosystem.",
      },
    ],
  },
  {
    id: 5,
    type: "text",
    header: "Strategic Association Model",
    subtitle: "Fresh vision backed by industry experience",
    sections: [
      {
        title: "DW Production Media",
        text: "Concept ownership, project development, sponsor coordination, creator economy positioning, brand communication and overall strategic direction of BCCA Awards 2026.",
      },
      {
        title: "Dhaka Model Agency",
        text: "Entertainment media legacy, cultural recognition platform experience, celebrity engagement, publication presence and award-oriented event exposure.",
      },
      {
        title: "Anandobinodon",
        text: "Fashion show execution, model coordination, visual production support, commercial shoot environment, styling and runway experience.",
      },
      {
        title: "How We Present This",
        text: "BCCA Awards 2026 is being developed through a collaborative media ecosystem combining fresh vision with experienced entertainment and production support.",
      },
    ],
  },
  {
    id: 6,
    type: "text",
    header: "Dhaka Model Agency Capability",
    subtitle: "How this supports BCCA",
    sections: [
      {
        title: "Relevant Strengths",
        text: "BCCA requires red carpet management, guest coordination, model and styling support, stage movement, visual presentation and production communication. Dhaka Model Agency's portfolio helps strengthen these execution areas.",
      },
      {
        title: "Use in BCCA",
        text: "The agency can support talent coordination, grooming, red carpet movement, stage rehearsal discipline, performance styling and visual presentation management.",
      },
      {
        title: "Corporate Value",
        text: "This association reduces execution risk by adding an experienced fashion and production support partner to the project ecosystem.",
      },
    ],
  },
  {
    id: 7,
    type: "image",
    header: "Dhaka Model Agency Showcase",
    subtitle: "Fashion, runway and production support experience",
    image: "/media/bcca-slide-07-dma-photos.jpg",
    highlights: [
      "Behind-the-scenes production coordination",
      "Runway presentation environment",
      "Creative team & model coordination",
      "Camera view & production monitoring",
      "Commercial shoot setup",
    ],
  },
  {
    id: 8,
    type: "image",
    header: "Fashion & Runway Portfolio",
    subtitle: "Visual event execution capability",
    image: "/media/bcca-slide-08-runway-photos.jpg",
    highlights: [
      "Fashion Show Presentation",
      "Fashion Event Presentation",
    ],
  },
  {
    id: 9,
    type: "text",
    header: "Anandobinodon Capability",
    subtitle: "Why this legacy matters",
    sections: [
      {
        title: "Entertainment Media Heritage",
        text: "Anandobinodon brings legacy value from entertainment publication, celebrity features, cultural programming and award-oriented recognition activities.",
      },
      {
        title: "Relevance to BCCA",
        text: "BCCA Awards needs credibility, cultural acceptance, media language, celebrity communication and award ceremony experience. Anandobinodon's legacy helps create that trust layer.",
      },
      {
        title: "Corporate Value",
        text: "For sponsors, this association shows that BCCA is connected with an entertainment media ecosystem rather than being a random one-time event idea.",
      },
    ],
  },
  {
    id: 10,
    type: "image",
    header: "Anandobinodo Legacy",
    subtitle: "Entertainment publication and cultural media presence",
    image: "/media/bcca-slide-10-magazine-covers.jpg",
    highlights: [
      "Decades of premier entertainment publication heritage",
      "Iconic magazine covers & star features",
    ],
  },
  {
    id: 11,
    type: "image",
    header: "Media & Recognition Presence",
    subtitle: "Institutional and celebrity engagement proof",
    image: "/media/bcca-slide-11-recognition-photos.jpg",
    highlights: [
      "Institutional award ceremonies",
      "Celebrity engagement & red carpet recognition",
    ],
  },
  {
    id: 12,
    type: "image",
    header: "Fashion & Event Execution",
    subtitle: "Entertainment Award Legacy",
    image: "/media/bcca-slide-07-dma-photos.jpg",
    highlights: [
      "Combined creative, productive, entertainment media ecosystem",
    ],
  },
  {
    id: 13,
    type: "text",
    header: "Combined Execution Ecosystem",
    subtitle: "The strength behind the project",
    sections: [
      {
        title: "Vision + Execution + Legacy",
        text: "DW Production Media provides the new creator-economy vision. Dhaka Model Agency adds production and fashion-event capability. Anandobinodon adds entertainment media legacy and award-oriented cultural credibility.",
      },
      {
        title: "Positioning Line",
        text: "BCCA Awards 2026 is being developed as a collaborative media platform where digital creators, entertainment culture, production experience and brand communication meet under one premium recognition event.",
      },
    ],
  },
  {
    id: 14,
    type: "text",
    header: "Sponsor Confidence Layer",
    subtitle: "What sponsors will understand from this profile",
    sections: [
      {
        title: "Capability",
        text: "The project is supported by collaborators with production, fashion event and entertainment media exposure.",
      },
      {
        title: "Credibility",
        text: "Anandobinodon's historical media presence and award environment create trust and cultural relevance.",
      },
      {
        title: "Execution Support",
        text: "Dhaka Model Agency's portfolio shows visual, runway, shoot and coordination experience that can support event execution.",
      },
      {
        title: "Business Value",
        text: "BCCA connects sponsors with creators, celebrity culture, digital content and youth audience attention.",
      },
    ],
  },
  {
    id: 15,
    type: "contact",
    header: "THANK YOU",
    subtitle: "DW Production Media",
    contactInfo: {
      title: "THANK YOU",
      subtitle: "DW Production Media · In Strategic Association With Dhaka Model Agency & Anandobinodon",
      description: "BCCA Awards 2026 is being developed as a long-term national creator recognition platform connecting creators, brands, media and entertainment culture.",
      founder: "Founder & Program Head: Md. Al Naser",
      phone: "+880 1345-741060",
      email: "mdalnaser9@gmail.com",
    },
  },
];
