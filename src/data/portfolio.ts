/**
 * Personal information, navigation, technologies and contact links.
 * Edit this file to update content across the whole site.
 *
 * Any link left as an empty string ("") is rendered as "forthcoming"
 * instead of a broken link — fill them in when they are ready.
 */

import type { TechLogoName } from "@/components/ui/tech-logos";

export const person = {
  name: "Trần Ánh Ngân",
  givenName: "Ánh Ngân",
  familyName: "Trần",
  monogram: "TAN",
  portrait: "/images/profile/portfolio.jpg",
  title: "Software Engineer",
  focus: "Backend & web systems",
  positioning:
    "Full-stack oriented engineer with a strong interest in backend engineering, APIs, web applications, and interactive projects.",
  intro:
    "I build practical software systems — web applications, REST APIs, and the occasional interactive experience.",
  // Shown in the hero sidebar. Change or clear as your situation changes.
  availability: "Open to opportunities",
};

export const site = {
  url: "https://portfolio-ant-antxventure.vercel.app/", // TODO: replace with the deployed domain
  title: "Trần Ánh Ngân — Software Engineer",
  description:
    "Personal archive of Trần Ánh Ngân, a full-stack oriented software engineer focused on backend engineering, APIs, web applications and interactive projects.",
};

export const navigation = [
  { id: "about", label: "About", number: "01" },
  { id: "skills", label: "Skills", number: "02" },
  { id: "work", label: "Work", number: "03" },
  { id: "journey", label: "Journey", number: "04" },
  { id: "contact", label: "Contact", number: "05" },
] as const;

export type SectionId = (typeof navigation)[number]["id"];

export const contact = {
  // TODO: add real values. Empty strings render as "forthcoming".
  email: "kieuantran123@gmail.com",
  links: [
    { label: "GitHub", href: "https://github.com/Ant2108" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/antxventure/" },
    { label: "Curriculum Vitae", href: "" }, // e.g. "/cv.pdf" placed in /public
  ],
};

export const technologyIndex = [
  {
    group: "Backend",
    note: "Where most of my projects live.",
    items: ["Java", "Spring Boot", "C#", "ASP.NET Core", "REST APIs", "JWT Authentication"],
  },
  {
    group: "Frontend",
    note: "Interfaces for the systems behind them.",
    items: ["Next.js", "React", "TypeScript"],
  },
  {
    group: "Data",
    note: "Relational and document stores.",
    items: ["MySQL", "SQL Server", "MongoDB"],
  },
  {
    group: "Tools",
    note: "Version control and media.",
    items: ["Git", "Cloudinary"],
  },
  {
    group: "Interactive",
    note: "Engines for games and experiments.",
    items: ["Unity", "Godot"],
  },
];

export const interests = ["Backend engineering", "Web applications", "API design", "Interactive experiences"];

export const principles = [
  {
    numeral: "I",
    title: "Understand",
    line: "Understand the problem first.",
    body: "Before writing a controller, I want to know what the data is, who touches it, and what “done” looks like.",
  },
  {
    numeral: "II",
    title: "Structure",
    line: "Keep the system understandable.",
    body: "Clear layers, honest names, predictable endpoints. Code should explain itself to the next person — often me.",
  },
  {
    numeral: "III",
    title: "Iterate",
    line: "Build, test, break, improve.",
    body: "The first version teaches you what the second one should be. I would rather learn that early.",
  },
  {
    numeral: "IV",
    title: "Ship",
    line: "A working solution matters.",
    body: "Elegant ideas count once they run. I aim for something real that people can actually use.",
  },
];

/** Learning journey — deliberately undated. Add dates if you want them shown. */
export const journey = [
  {
    title: "Foundations",
    summary: "Programming and software fundamentals.",
    tags: ["Programming", "Data structures", "Git"],
  },
  {
    title: "Backend",
    summary: "Server-side development with Java and Spring Boot, REST APIs and relational databases.",
    tags: ["Java", "Spring Boot", "REST", "MySQL"],
  },
  {
    title: "Full-stack",
    summary: "Building the interfaces that sit on top of those APIs.",
    tags: ["React", "Next.js", "JavaScript", "TypeScript"],
  },
  {
    title: "Systems",
    summary: "Authentication, authorization and role-based access across APIs; a second backend stack in .NET.",
    tags: ["JWT", "ASP.NET Core", "SQL Server", "MongoDB", "Cloudinary"],
  },
  {
    title: "Interactive",
    summary: "Game development as a playground for logic, state and feel.",
    tags: ["Unity", "Godot", "C#"],
  },
];

/** The "current entry" panel in the hero. Describes this website itself. */
export const currentEntry = {
  line: "The full-stack line",
  name: "Personal Archive",
  goal: "Design and build this site from scratch — data-driven, accessible, responsive, and quick to update.",
  stack: [
    // `icon` must be a key of the logos in src/components/ui/tech-logos.tsx
    { icon: "typescript", label: "TypeScript" },
    { icon: "nextjs", label: "Next.js" },
    { icon: "tailwind", label: "Tailwind" },
  ] satisfies { icon: TechLogoName; label: string }[],
};
