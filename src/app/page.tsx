import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Statistics } from "@/components/sections/Statistics";
import { Services } from "@/components/sections/Services";
import { CityShowcase } from "@/components/sections/CityShowcase";
import { Projects } from "@/components/sections/Projects";
import { TechOrbit } from "@/components/sections/TechOrbit";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="relative min-h-screen bg-base-950">
        <Hero />
        <Statistics />
        <Services />
        <CityShowcase />
        <Projects />
        <TechOrbit />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}