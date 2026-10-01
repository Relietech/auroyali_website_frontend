import React from 'react';
import { Hero } from '../components/home/Hero';
import { AboutIntro } from '../components/home/AboutIntro';
import { FeatureCards } from '../components/home/FeatureCards';
import { ProjectShowcase } from '../components/home/ProjectShowcase';
import { MaterialExplorer3D } from '../components/3d/MaterialExplorer3D';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { testimonialsData, workshopsData } from '../data/testimonials';
import { TestimonialCard } from '../components/testimonials/TestimonialCard';

export function Home() {
  const upcomingWorkshop = workshopsData[0];

  return (
    <div className="space-y-0">
      <Hero />
      <AboutIntro />
      <FeatureCards />

      <section className="py-24 bg-earth-900 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MaterialExplorer3D />
        </div>
      </section>

      <ProjectShowcase />

      {upcomingWorkshop && (
        <section className="py-24 bg-earth-100/50 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-14 border border-earth-200 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <span className="text-xs uppercase tracking-[0.25em] text-clay font-mono font-medium">
                  Auroville Green Practices &bull; Upcoming Workshop
                </span>
                <h3 className="font-heading text-3xl md:text-5xl text-earth-900 dark:text-stone-100 leading-tight font-bold">
                  {upcomingWorkshop.title}
                </h3>
                <p className="body-text text-stone-600 dark:text-stone-400 font-light">
                  {upcomingWorkshop.description}
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200/60">
                    <span className="text-[11px] text-stone-400 font-mono block uppercase">Duration</span>
                    <span className="text-stone-800 dark:text-stone-200 font-medium text-sm">{upcomingWorkshop.duration}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200/60">
                    <span className="text-[11px] text-stone-400 font-mono block uppercase">Next Dates</span>
                    <span className="text-stone-800 dark:text-stone-200 font-medium text-sm">{upcomingWorkshop.dates.split(': ')[1] || upcomingWorkshop.dates}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200/60">
                    <span className="text-[11px] text-stone-400 font-mono block uppercase">Class Size</span>
                    <span className="text-stone-800 dark:text-stone-200 font-medium text-sm">{upcomingWorkshop.seats}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-4">
                  <Button to="/workshops/bamboo" variant="clay" size="lg">
                    Register For Workshop
                  </Button>
                  <Button to="/workshops" variant="outline" size="lg">
                    See All Courses
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-earth-50">
                  <img
                    src="https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80"
                    alt="Bamboo Workshop"
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-earth-900 text-white px-4 py-2 rounded-xl text-xs font-mono shadow-lg">
                  Certification Included
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

      <section className="py-24 md:py-32 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            tag="Client & Fellow Endorsements"
            title="Trusted by sustainable pioneers across Auroville & beyond."
            subtitle="Voices of our homeowners, institutional leaders, and international researchers."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {testimonialsData.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-earth-900 via-earth-950 to-stone-900 text-stone-100 text-center relative overflow-hidden">
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
