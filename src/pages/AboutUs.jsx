import React from 'react';
import { PageBanner } from '../components/common/PageBanner';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';
import { Leaf, Compass, Users, CheckCircle2, Trees } from 'lucide-react';

export function AboutUs() {
  return (
    <div>
      <PageBanner
        title="Conscious Architecture Rooted in Auroville"
        subtitle="Since 2012, AuroYali has been a pioneering force in earth-based sustainable architecture, bioclimatic engineering, and circular craftsmanship."
        breadcrumb="About Us"
        bgImage="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=80"
        tag="Our Legacy & Philosophy"
      />

      <section className="py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <SectionHeading
                tag="Founded in 2012"
                title="Manifesting a new consciousness in the built environment."
              />

              <p className="body-text text-stone-700 leading-relaxed font-light">
                Auroville is an international universal township in South India dedicated to sustainable human unity and experimental ecology. AuroYali was established within the International Zone as an architectural design and construction unit dedicated to eliminating the massive carbon footprint of conventional cement and fired clay.
              </p>

              <p className="body-text text-stone-700 leading-relaxed font-light">
                We believe that true luxury lies in breathable, toxin-free spaces where the walls regulate humidity, the roofs capture passive sea breezes, and the materials return gracefully to the earth at the end of their lifecycle.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-earth-200">
                  <CheckCircle2 size={20} className="text-clay shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-semibold text-earth-900">Zero-Waste Material Flow</strong>
                    <span className="text-xs text-stone-600 font-light">Earth excavated on-site is converted directly into high-strength CSEB masonry.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border border-earth-200">
                  <CheckCircle2 size={20} className="text-sage shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-semibold text-earth-900">Non-Toxic Living Spaces</strong>
                    <span className="text-xs text-stone-600 font-light">Pure lime plasters, natural earth pigments, and beeswax timber protection.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-earth-200">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
                  alt="Auroyali Courtyard Architecture"
                  className="w-full h-[460px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-earth-900 text-white p-6 rounded-2xl shadow-xl border border-earth-700 max-w-xs">
                <span className="font-heading text-3xl font-bold text-clay block">1.2 Million+</span>
                <span className="text-xs text-stone-300 font-mono mt-1 block">CSEB Blocks Pressed On-Site Across 80+ Structures</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-earth-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            align="center"
            tag="Guiding Principles"
            title="Our Four Architectural Pillars"
            subtitle="The holistic design criteria that govern every sketch, beam, and mortar mix."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white p-8 rounded-3xl border border-earth-200 shadow-sm space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-earth-100 text-clay flex items-center justify-center">
                <Compass size={24} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-earth-900">Bioclimatic Solar Logic</h3>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Utilizing microclimate wind modeling, thermal buoyancy chimneys, and deep shading to achieve passive comfort without active air conditioning.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-earth-200 shadow-sm space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-earth-100 text-sage flex items-center justify-center">
                <Leaf size={24} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-earth-900">Low Embodied Carbon</h3>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Replacing energy-intensive fired bricks with hydraulic compressed earth blocks and pozzolanic lime binding.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-earth-200 shadow-sm space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-earth-100 text-clay flex items-center justify-center">
                <Trees size={24} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-earth-900">Structural Bamboo</h3>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Engineering fast-growing structural bamboo species into earthquake-resilient tensile space grids and vaults.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-earth-200 shadow-sm space-y-4">
              <div className="p-3 w-12 h-12 rounded-2xl bg-earth-100 text-earth-700 flex items-center justify-center">
                <Users size={24} />
              </div>
              <h3 className="font-heading text-2xl font-bold text-earth-900">Artisanal Empowerment</h3>
              <p className="text-sm text-stone-600 font-light leading-relaxed">
                Training local Tamil craftsmen in precision masonry, advanced timber joinery, and sustainable building technologies.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-earth-900 text-stone-100 text-center">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <h3 className="font-heading text-3xl md:text-5xl text-earth-50">
            Let's Collaborate on Your Vision
          </h3>
          <p className="body-text text-stone-300 font-light">
            Whether for architectural master planning or exploring natural construction methods, we welcome your conversation.
          </p>
          <div className="pt-2">
            <Button to="/contact" variant="clay" size="lg">
              Contact Auroville Studio
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
export default AboutUs;
