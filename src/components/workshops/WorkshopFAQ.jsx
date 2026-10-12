import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle } from 'lucide-react';
import { workshopFaqs } from '../../data/workshops';
import { Link } from 'react-router-dom';

export function WorkshopFAQ() {
  const [openIdx, setOpenIdx] = useState(0);

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section className="py-24 bg-earth-50 dark:bg-stone-900 border-t border-earth-200/80 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.25em] font-semibold text-clay block mb-3">
            Practical Logistics
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-earth-900 dark:text-stone-100 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="body-text text-stone-600 dark:text-stone-400 mt-4 font-light">
            Everything you need to know about joining our physical masterclasses in Auroville.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {workshopFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-stone-950 rounded-2xl border border-earth-200/90 dark:border-stone-800 shadow-sm overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 font-heading text-lg sm:text-xl font-bold text-earth-900 dark:text-stone-100 hover:text-clay transition-colors"
                >
                  <span>{faq.question}</span>
                  <span className={`p-1.5 rounded-full bg-earth-100 dark:bg-stone-800 text-clay shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-clay text-white' : ''
                  }`}>
                    {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-xs sm:text-sm font-light text-stone-600 dark:text-stone-300 leading-relaxed border-t border-earth-100 dark:border-stone-800/60 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Support Callout Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-earth-100/70 dark:bg-stone-800/80 border border-earth-200 dark:border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="font-heading text-2xl font-bold text-earth-900 dark:text-stone-100">
              Have specific questions about cohort batches?
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 font-mono">
              Our workshop coordinator is available to answer custom university, group, or research questions.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl bg-earth-900 dark:bg-stone-100 text-white dark:text-earth-900 font-mono text-xs font-semibold hover:bg-clay dark:hover:bg-clay dark:hover:text-white transition-colors shrink-0 flex items-center gap-2"
          >
            <MessageCircle size={15} />
            <span>Speak with Coordinator</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
export default WorkshopFAQ;
