import { About } from "@/components/sections/about";
import { Approach } from "@/components/sections/approach";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Journey } from "@/components/sections/journey";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Work />
      <Approach />
      <Journey />
      <Contact />
    </>
  );
}
