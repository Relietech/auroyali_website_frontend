import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Sparkles } from 'lucide-react';

const faqs = [
  {
    q: "How does the architectural design process with AuroYali work?",
    a: "We work through a clear 6-stage lifecycle: Concept Development, Feasibility Studies, Design Development, Construction Documentation, Construction Team Coordination, and Construction Supervision. This ensures you are fully aligned at every step from initial concept sketches to final building handover."
  },
  {
    q: "Can you design buildings outside of Auroville and Pondicherry?",
    a: "Yes! While our studio and master craftsmen are based in Auroville, Tamil Nadu, we provide full architectural design services for projects throughout India and internationally. For distant projects, we conduct initial site visits and provide comprehensive working documentation and virtual supervision."
  },
  {
    q: "Do you handle turnkey construction as well as architecture?",
    a: "Yes, this is one of our unique strengths. AuroYali integrates architectural design with in-house CSEB block production, masonry, structural carpentry, and metal fabrication teams, delivering turnkey projects with zero translation error between blueprint and site."
  },
  {
    q: "What makes bioclimatic & CSEB architecture different from conventional buildings?",
    a: "Bioclimatic architecture optimizes building orientation, breeze corridors, and shading to minimize heat gain. When paired with Compressed Stabilized Earth Blocks (CSEB) and lime plasters, interiors stay 5-7°C cooler than the outdoor peak temperature naturally without constant air conditioning."
  },
  {
    q: "How do we get started with an architectural consultation?",
    a: "You can submit the consultation form on this page or email us directly at auroyali@auroville.org.in. We will schedule an initial vision call or an on-site meeting in Auroville to explore your requirements and provide an initial roadmap."
  }
];

export function ArchitectureFAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden border-t border-earth-200/70">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-clay/10 text-clay font-mono text-xs uppercase tracking-widest font-semibold">
            <HelpCircle size={12} /> Frequently Asked Questions
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-earth-900 leading-tight">
            Everything You Need to Know
          </h2>
          <p className="text-stone-600 font-light text-sm sm:text-base">
            Common questions regarding our architectural commissions and turnkey execution.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-earth-200 bg-earth-50/50 overflow-hidden transition-all duration-300"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-earth-100/60 transition-colors"
                >
                  <span className="font-heading text-lg sm:text-xl font-bold text-earth-900">
                    {faq.q}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-clay text-white' : 'bg-earth-200/70 text-earth-800'}`}>
                    {isOpen ? <Minus size={15} /> : <Plus size={15} />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="p-5 sm:p-6 pt-0 text-stone-600 font-light text-sm sm:text-base leading-relaxed border-t border-earth-200/60">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default ArchitectureFAQ;
