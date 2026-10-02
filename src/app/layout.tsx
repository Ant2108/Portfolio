import type { Metadata, Viewport } from "next";
import { Inter, Lora } from "next/font/google";
import { SiteHeader } from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/sections/footer";
import { person, site } from "@/data/portfolio";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s — ${person.name}`,
  },
  description: site.description,
  authors: [{ name: person.name }],
  keywords: ["software developer", "backend", "Spring Boot", "ASP.NET Core", "Next.js", "portfolio", person.name],
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    siteName: person.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#f3ede1",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="label sr-only z-[70] bg-ink px-4 py-3 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
