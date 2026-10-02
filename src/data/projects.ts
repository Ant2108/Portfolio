/**
 * Project archive. Add a new object to `projects` to publish a new entry —
 * it appears on the home page and gets its own page at /projects/[slug].
 *
 * Leave `year`, `githubUrl` or `liveUrl` empty when unknown:
 *   year ""      → shown as "n.d." (no date)
 *   githubUrl "" → shown as "Repository — forthcoming"
 *   liveUrl ""   → shown as "Live demo — not deployed"
 *
 * Images live in /public/images/projects. Replace the SVG plates with real
 * screenshots (png/jpg/webp) whenever you have them.
 */

export type Project = {
  slug: string;
  title: string;
  year: string;
  category: string;
  description: string;
  overview: string;
  features: string[];
  technologies: string[];
  image: string;
  imageAlt: string;
  /** Extra plates shown on the project page — screenshots or diagrams. */
  gallery?: { src: string; alt: string; caption: string }[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "franchise-system",
    title: "Franchise System",
    year: "2026", // TODO
    category: "Backend · Supply chain",
    description:
      "Supply-chain backend for a coffee franchise — warehouses, ingredient stock, supplier orders and deliveries out to franchise stores.",
    overview:
      "A Spring Boot REST API that keeps track of ingredient stock across warehouses. Stock arrives through inbound orders from suppliers, is held as available and reserved quantities, and leaves through outbound orders to franchise stores; every order moves through its own status flow. The service talks to the store service through OpenFeign and registers with Eureka, stores its data in PostgreSQL, and uploads images to Cloudinary.",
    features: [
      "Warehouse and ingredient management, with available and reserved stock per warehouse",
      "Inbound orders from suppliers with per-item received quantities (partial deliveries)",
      "Outbound orders to franchise stores: pending → packing → shipping → delivered",
      "Inventory log of stock transactions (inbound, outbound, adjustment, dispatch)",
      "Low-stock alerts based on each ingredient's threshold",
      "Supplier marketplace and a per-warehouse cart",
      "Status sync with the store service via OpenFeign; Eureka service registration",
      "Image uploads to Cloudinary; API documented with Swagger",
    ],
    technologies: ["Java", "Spring Boot", "PostgreSQL", "Spring Cloud", "OpenFeign", "Cloudinary", "Swagger", "Docker"],
    image: "/images/projects/inventory.svg",
    imageAlt: "Engraved plate of warehouse shelving drawn as an isometric grid of crates",
    gallery: [
      {
        src: "/images/projects/franchise-model.svg",
        alt: "Entity diagram: Supplier, SupplierIngredient, Cart, InboundOrder, Ingredient, Warehouse, InventoryLog, Inventory and OutboundOrder with their relations",
        caption: "Data model — the JPA entities and how they relate",
      },
      {
        src: "/images/projects/franchise-flow.svg",
        alt: "Flow diagram: supplier to warehouse by inbound order, warehouse to franchise store by outbound order, with the status of each order type",
        caption: "How stock moves — order statuses and the inventory log",
      },
    ],
    githubUrl: "https://github.com/Ant2108/franchise",
    liveUrl: "",
    featured: true,
  },
  {
    slug: "yggdrasil",
    title: "Yggdrasil",
    year: "", // TODO
    category: "Backend · Web management",
    description:
      "A management application for customers, categories and products, with authentication and authorization guarding each area.",
    overview:
      "A backend and web management project. It covers customer management, product categories and product-related functionality, with authentication and authorization controlling who can do what. Built with Spring Boot and a relational database.",
    features: [
      "Customer management",
      "Category management",
      "Product-related functionality",
      "Authentication and authorization",
      "Database management behind the application",
    ],
    // TODO: add the database engine you used to `technologies`.
    technologies: ["Java", "Spring Boot", "Authentication", "Authorization"],
    image: "/images/projects/yggdrasil.svg",
    imageAlt: "Engraved plate of a branching tree whose limbs end in connected nodes",
    gallery: [
      {
        src: "/images/projects/yggdrasil-modules.svg",
        alt: "Diagram of the three modules — customers, categories and products — growing from an authentication and authorization layer",
        caption: "Modules — customers, categories and products behind one auth layer",
      },
    ],
    githubUrl: "",
    liveUrl: "",
    featured: true,
  },
  {
    slug: "self-storage",
    title: "Self Storage",
    year: "2026", // TODO
    category: "Backend · API",
    description:
      "A self-storage platform with a secured Spring Boot API — JWT and Google sign-in, five user roles, and a React admin frontend.",
    overview:
      "A Spring Boot API backed by SQL Server, with a React (Vite) frontend. Users sign in with email and password or with Google; the API issues a JWT access token and a refresh token kept in the database. Five roles — from customer to system admin — control who can manage users and assign staff to storage facilities. Password resets and email changes go through single-use, expiring tokens sent as HTML emails.",
    features: [
      "JWT access tokens and database-backed refresh tokens; logout",
      "Google sign-in through Spring Security OAuth2",
      "Five roles with route rules and method-level @PreAuthorize checks",
      "Admin user management: create, update, change role or status, delete",
      "Assigning staff to storage facilities",
      "Forgot-password and change-email flows with expiring tokens and Thymeleaf emails",
      "Passwords hashed with BCrypt; request validation and a global exception handler",
      "OpenAPI / Swagger documentation",
    ],
    technologies: ["Java", "Spring Boot", "Spring Security", "JWT", "OAuth2", "SQL Server", "React", "Vite"],
    image: "/images/projects/storage.svg",
    imageAlt: "Engraved plate of a wall of numbered storage lockers with a single key",
    gallery: [
      {
        src: "/images/projects/storage-pipeline.svg",
        alt: "Pipeline diagram of a request: client, JWT filter, security config, PreAuthorize, controller, service, repository and SQL Server, with tokens, sign-in routes and the five roles",
        caption: "The path of a request — authentication, authorization and the five roles",
      },
      {
        src: "/images/projects/storage-accounts.svg",
        alt: "Entity diagram of Users with RefreshToken, PasswordResetToken, EmailChangeToken and Facility, and the email flows between them",
        caption: "Accounts, tokens and the email flows",
      },
    ],
    githubUrl: "https://github.com/Ant2108/SWP391",
    liveUrl: "",
    featured: true,
  },
  {
    slug: "game-development",
    title: "Game Studies",
    year: "", // TODO
    category: "Interactive · Games",
    description:
      "Interactive and game projects made in Unity and Godot — a place to practise game logic, state and feel.",
    overview:
      "A collection of interactive and game development work using Unity and Godot, scripted in C#. Replace this paragraph with the specific games, jams or prototypes you want to show.",
    features: ["Unity projects scripted in C#", "Godot projects", "Gameplay logic and interaction"],
    technologies: ["Unity", "Godot", "C#"],
    image: "/images/projects/game.svg",
    imageAlt: "Engraved plate of a tile-based level map with a small figure and a winding path",
    githubUrl: "",
    liveUrl: "",
    featured: false,
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

/** Display order: featured entries first, then the rest. Entry numbers follow this order. */
export const orderedProjects = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
