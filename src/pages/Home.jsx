import React from 'react';
import { Hero } from '../components/home/Hero';
import { AboutIntro } from '../components/home/AboutIntro';
import { ProjectShowcase } from '../components/home/ProjectShowcase';
import MaterialStudio from '../components/3d/MaterialStudio';
import { Button } from '../components/common/Button';
import WorkshopScrollHero from '../components/home/WorkshopScrollHero';

export function Home() {
  return (
    <div className="space-y-0">
      <Hero />
      <AboutIntro />

      {/* Interactive 3D Material Studio Section */}
      <MaterialStudio />

      <ProjectShowcase />

      {/* Interactive Scroll-driven Workshop Hero */}
      <WorkshopScrollHero />

      {/* Spacious Transition Buffer */}
      <div className="hidden md:block w-full h-12 md:h-20 bg-[#f6efe7]" />

      <section className="py-10 sm:py-16 md:py-28 bg-gradient-to-br from-earth-900 via-earth-950 to-stone-900 text-stone-100 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-clay font-mono block">
            AuroYali Studio &bull; International Zone
          </span>
          <h2 className="h1-hero text-earth-50 leading-tight font-bold">
            Ready to Build Your Ecological Sanctuary?
          </h2>
          <p className="body-text text-stone-300 max-w-2xl mx-auto font-light">
            Whether embarking on a residential home, institutional campus, or enrolling in our hands-on natural building workshops, we are here to manifest your vision with conscious craft.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Button to="/contact" variant="clay" size="lg">
              Start Project Inquiry
            </Button>
            <Button to="/projects" variant="secondary" size="lg">
              Explore Our Work
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;
