import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PageBanner } from '../../components/common/PageBanner';
import { SectionHeading } from '../../components/common/SectionHeading';
import { CheckCircle, ArrowRight } from 'lucide-react';
import {
  getStoredConstructionData,
  subscribeToConstruction,
  DEFAULT_CONSTRUCTION_DATA
} from '../../services/constructionStore';

export function Construction() {
  const [data, setData] = useState(() => getStoredConstructionData());

  useEffect(() => {
    // Initial fetch in case localStorage changed
    setData(getStoredConstructionData());

    // Reactive subscription to live changes from admin panel
    const unsubscribe = subscribeToConstruction((updated) => {
      setData(updated);
    });

    return () => unsubscribe();
  }, []);

  const {
    hero = DEFAULT_CONSTRUCTION_DATA.hero,
    methodology = DEFAULT_CONSTRUCTION_DATA.methodology,
    capabilities = DEFAULT_CONSTRUCTION_DATA.capabilities,
    deliverables = DEFAULT_CONSTRUCTION_DATA.deliverables,
    sidebar = DEFAULT_CONSTRUCTION_DATA.sidebar
  } = data || {};

  return (
    <div>
      {/* 1. Dynamic Hero Banner */}
      <PageBanner
        title={hero.title || DEFAULT_CONSTRUCTION_DATA.hero.title}
        subtitle={hero.subtitle || DEFAULT_CONSTRUCTION_DATA.hero.subtitle}
        breadcrumb={hero.breadcrumb || hero.title || DEFAULT_CONSTRUCTION_DATA.hero.breadcrumb}
        bgImage={hero.bgImage || DEFAULT_CONSTRUCTION_DATA.hero.bgImage}
        tag={hero.tag || DEFAULT_CONSTRUCTION_DATA.hero.tag}
      />

      {/* 2. Main Methodology, Capabilities, Deliverables & Sidebar */}
      <section className="py-12 sm:py-16 md:py-24 bg-earth-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-start">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 w-full">
              <SectionHeading
                tag={methodology.tag || "Our Methodology"}
                title={methodology.title || "Crafting with environmental intelligence in natural building & cseb construction."}
              />

              <p className="body-text text-stone-700 leading-relaxed text-sm sm:text-base md:text-lg font-light whitespace-pre-line">
                {methodology.longDesc || DEFAULT_CONSTRUCTION_DATA.methodology.longDesc}
              </p>

              {/* Technical Capabilities */}
              <div className="pt-2 sm:pt-4">
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-earth-900 mb-3 sm:mb-4">
                  Key Technical Capabilities
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {(capabilities || []).map((feat, idx) => (
                    <div
                      key={feat.id || idx}
                      className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-earth-200/80 shadow-xs flex items-start gap-3 hover:shadow-md hover:border-earth-300 transition-all"
                    >
                      <CheckCircle size={18} className="text-clay shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <span className="text-stone-800 text-xs sm:text-sm font-medium leading-snug block">
                          {typeof feat === 'string' ? feat : feat.title}
                        </span>
                        {typeof feat === 'object' && feat.desc && (
                          <span className="text-stone-600 text-[11px] sm:text-xs font-light leading-relaxed block">
                            {feat.desc}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables */}
              <div className="pt-2 sm:pt-4">
                <h4 className="font-heading text-xl sm:text-2xl font-bold text-earth-900 mb-3 sm:mb-4">
                  Client Deliverables & Documentation
                </h4>
                <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-earth-100/60 border border-earth-300/40 space-y-3 sm:space-y-3.5">
                  {(deliverables || []).map((del, idx) => (
                    <div
                      key={del.id || idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-800 font-medium"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-clay shrink-0 mt-1.5" />
                      <div>
                        <span className="leading-snug block font-medium">
                          {typeof del === 'string' ? del : del.title}
                        </span>
                        {typeof del === 'object' && del.desc && (
                          <span className="text-[11px] sm:text-xs text-stone-600 font-light block mt-0.5">
                            {del.desc}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 sm:pt-4 flex flex-row items-center gap-2 sm:gap-4 w-full">
                <Link 
                  to={methodology.primaryCtaLink || "/contact"} 
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-clay hover:bg-earth-800 text-white font-mono text-[10.5px] sm:text-xs uppercase tracking-tight sm:tracking-wider font-semibold transition-all shadow-md hover:shadow-lg whitespace-nowrap text-center group"
                >
                  <span>{methodology.primaryCtaText || "Request Consultation"}</span>
                  <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link 
                  to={methodology.secondaryCtaLink || "/projects"} 
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 sm:py-3.5 rounded-full bg-earth-100 hover:bg-earth-200 text-earth-900 border border-earth-300/40 font-mono text-[10.5px] sm:text-xs uppercase tracking-tight sm:tracking-wider font-semibold transition-all shadow-xs hover:shadow-md whitespace-nowrap text-center group"
                >
                  <span>{methodology.secondaryCtaText || "Case Studies"}</span>
                  <ArrowRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Sidebar Column (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-5 sm:space-y-6 w-full mt-4 lg:mt-0">
              <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-earth-200 group">
                <img
                  src={sidebar.image || DEFAULT_CONSTRUCTION_DATA.sidebar.image}
                  alt={sidebar.imageAlt || hero.title || "AuroYali Natural CSEB Construction"}
                  className="w-full h-56 sm:h-72 md:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="bg-earth-900 text-stone-100 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-earth-800 space-y-5 sm:space-y-6 shadow-xl w-full">
                <span className="text-xs uppercase tracking-widest text-clay font-mono block">
                  {sidebar.trackRecordTag || "Studio Track Record"}
                </span>

                <div className="space-y-3.5 sm:space-y-4">
                  {(sidebar.stats || []).map((stat, idx) => (
                    <div key={stat.id || idx} className="flex items-center justify-between border-b border-earth-800 pb-2.5 sm:pb-3 gap-2">
                      <span className="text-[11px] sm:text-xs text-stone-400 uppercase font-mono">
                        {stat.label}
                      </span>
                      <span className="font-heading text-xl sm:text-2xl text-earth-100 font-bold shrink-0">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {sidebar.supervisionNote && (
                  <div className="pt-1 text-[11px] sm:text-xs text-stone-400 font-light leading-relaxed">
                    {sidebar.supervisionNote}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default Construction;
