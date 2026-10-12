import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Compass, 
  LayoutGrid, 
  Settings, 
  Flame, 
  Award, 
  ShieldCheck, 
  Wrench
} from 'lucide-react';

/* ==========================================================================
   FABRICATION PROCESS DATA (6 Steps)
   ========================================================================== */
export const fabricationProcess = [
  {
    step: '01',
    title: 'Consultation & Site Review',
    desc: 'We inspect architectural drawings, site conditions, load requirements, and material aesthetic goals.',
    icon: Compass,
    phase: 'Phase 1 of 6'
  },
  {
    step: '02',
    title: 'CAD & 3D Shop Drawings',
    desc: 'Detailed shop drawings, connection details, and 3D mockups are engineered for client & architect approval.',
    icon: LayoutGrid,
    phase: 'Phase 2 of 6'
  },
  {
    step: '03',
    title: 'CNC & Precision Cutting',
    desc: 'Fiber laser and high-definition plasma cutting ensure exact 0.5mm tolerances on all components.',
    icon: Settings,
    phase: 'Phase 3 of 6'
  },
  {
    step: '04',
    title: 'TIG / MIG Welding',
    desc: 'Certified master welders assemble components with deep penetration welds and smooth seam grinding.',
    icon: Flame,
    phase: 'Phase 4 of 6'
  },
  {
    step: '05',
    title: 'Surface Finishing & Coating',
    desc: 'Thorough grit-blasting followed by zinc galvanizing, powder coating, or hand-rubbed patination.',
    icon: Award,
    phase: 'Phase 5 of 6'
  },
  {
    step: '06',
    title: 'On-Site Installation',
    desc: 'Our specialized erection crew installs on site, aligning with CSEB earth walls and timber structures.',
    icon: ShieldCheck,
    phase: 'Phase 6 of 6'
  }
];

export function FabricationProcessSection() {
  const shouldReduceMotion = useReducedMotion();

  const row1 = fabricationProcess.slice(0, 3);
  const row2 = fabricationProcess.slice(3, 6);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6F1] border-b border-[#E5D5C0] text-[#2B2B2B] relative overflow-hidden">
      {/* Subtle Blueprint Radial Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#2B2B2B 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
        aria-hidden="true"
      />

      {/* Ambient Warm Spark Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-[#E8782A]/6 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-20"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/30 text-[#B5532F] text-[10px] sm:text-xs font-mono uppercase tracking-[0.14em] font-semibold mb-2.5 sm:mb-3.5">
            <Wrench size={12} className="text-[#B5532F]" />
            <span>CONNECTED 6-STAGE PIPELINE</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#2B2B2B] tracking-tight">
            Our Fabrication Process
          </h2>
          <p className="font-body text-[#4A4F55] text-xs sm:text-base md:text-lg font-light mt-2 sm:mt-3 leading-relaxed">
            From concept sketches and structural calculations to precision CNC cutting and final on-site erection.
          </p>
        </motion.div>

        {/* ===================================================================
            DESKTOP / TABLET: 2-ROW CONNECTED HORIZONTAL PIPELINE (lg & above)
            =================================================================== */}
        <div className="hidden lg:block space-y-10">
          
          {/* ROW 1: Steps 01 -> 02 -> 03 with Connected Line */}
          <div className="relative">
            {/* Continuous Connecting Line Track linking Row 1 */}
            <div className="absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#E8782A] via-[#E8782A] to-[#B5532F] z-0 pointer-events-none" />

            <div className="grid grid-cols-3 gap-8 relative z-10">
              {row1.map((proc, index) => {
                const IconComp = proc.icon;

                return (
                  <motion.div
                    key={proc.step}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    className="group relative flex flex-col rounded-2xl bg-white border border-[#E5D5C0] hover:border-[#E8782A] shadow-sm hover:shadow-xl transition-all duration-300 p-7 h-full overflow-hidden"
                  >
                    {/* Top Subtle Color Accent Strip */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#F0E6D8] group-hover:bg-gradient-to-r group-hover:from-[#E8782A] group-hover:to-[#B5532F] transition-all duration-300" />

                    {/* Step Number & Technical Icon Header */}
                    <div className="flex items-center justify-between mb-5 mt-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-3xl font-black text-[#E8782A] tracking-tight">
                          {proc.step}
                        </span>
                        <div className="h-4 w-[1px] bg-[#E5D5C0]" />
                        <span className="text-[11px] font-mono text-[#B5532F] font-semibold uppercase tracking-wider">
                          {proc.phase}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-[#FAF6F1] border border-[#E5D5C0] text-[#B5532F] flex items-center justify-center group-hover:bg-[#E8782A] group-hover:text-white group-hover:border-[#E8782A] transition-all duration-300 shadow-2xs">
                        <IconComp size={18} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2B2B2B] leading-snug group-hover:text-[#B5532F] transition-colors">
                      {proc.title}
                    </h3>

                    {/* 1-2 Line Description */}
                    <p className="font-body text-xs sm:text-sm text-[#4A4F55] font-light leading-relaxed mt-2.5 mb-6">
                      {proc.desc}
                    </p>

                    {/* Micro Progress Bar at Base */}
                    <div className="mt-auto pt-4 border-t border-[#F0E6D8] flex items-center justify-between text-xs font-mono text-[#8C939A]">
                      <span>STAGE 0{index + 1}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-1 rounded-full bg-[#E8782A]" />
                        <span className={`w-5 h-1 rounded-full ${index >= 1 ? 'bg-[#E8782A]' : 'bg-[#E5D5C0]'}`} />
                        <span className={`w-5 h-1 rounded-full ${index >= 2 ? 'bg-[#E8782A]' : 'bg-[#E5D5C0]'}`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* ROW 2: Steps 04 -> 05 -> 06 with Connected Line */}
          <div className="relative">
            {/* Continuous Connecting Line Track linking Row 2 */}
            <div className="absolute top-[48px] left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-[#E8782A] via-[#E8782A] to-[#B5532F] z-0 pointer-events-none" />

            <div className="grid grid-cols-3 gap-8 relative z-10">
              {row2.map((proc, index) => {
                const IconComp = proc.icon;

                return (
                  <motion.div
                    key={proc.step}
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index + 3) * 0.12, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25 } }}
                    className="group relative flex flex-col rounded-2xl bg-white border border-[#E5D5C0] hover:border-[#E8782A] shadow-sm hover:shadow-xl transition-all duration-300 p-7 h-full overflow-hidden"
                  >
                    {/* Top Subtle Color Accent Strip */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#F0E6D8] group-hover:bg-gradient-to-r group-hover:from-[#E8782A] group-hover:to-[#B5532F] transition-all duration-300" />

                    {/* Step Number & Technical Icon Header */}
                    <div className="flex items-center justify-between mb-5 mt-1">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-3xl font-black text-[#E8782A] tracking-tight">
                          {proc.step}
                        </span>
                        <div className="h-4 w-[1px] bg-[#E5D5C0]" />
                        <span className="text-[11px] font-mono text-[#B5532F] font-semibold uppercase tracking-wider">
                          {proc.phase}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-xl bg-[#FAF6F1] border border-[#E5D5C0] text-[#B5532F] flex items-center justify-center group-hover:bg-[#E8782A] group-hover:text-white group-hover:border-[#E8782A] transition-all duration-300 shadow-2xs">
                        <IconComp size={18} />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-[#2B2B2B] leading-snug group-hover:text-[#B5532F] transition-colors">
                      {proc.title}
                    </h3>

                    {/* 1-2 Line Description */}
                    <p className="font-body text-xs sm:text-sm text-[#4A4F55] font-light leading-relaxed mt-2.5 mb-6">
                      {proc.desc}
                    </p>

                    {/* Micro Progress Bar at Base */}
                    <div className="mt-auto pt-4 border-t border-[#F0E6D8] flex items-center justify-between text-xs font-mono text-[#8C939A]">
                      <span>STAGE 0{index + 4}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-1 rounded-full bg-[#E8782A]" />
                        <span className="w-5 h-1 rounded-full bg-[#E8782A]" />
                        <span className={`w-5 h-1 rounded-full ${index >= 2 ? 'bg-[#E8782A]' : 'bg-[#E5D5C0]'}`} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

        {/* ===================================================================
            MOBILE / TABLET: CONNECTED VERTICAL TIMELINE PIPELINE (< lg)
            =================================================================== */}
        <div className="lg:hidden relative pl-5 sm:pl-8 border-l-2 border-[#E8782A]/40 space-y-5 sm:space-y-8 ml-2.5 sm:ml-4">
          {fabricationProcess.map((proc, index) => {
            const IconComp = proc.icon;
            return (
              <motion.div
                key={proc.step}
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative rounded-2xl bg-white border border-[#E5D5C0] p-4 sm:p-6 shadow-sm"
              >
                {/* Connected Node on the Vertical Line */}
                <div className="absolute -left-[27px] sm:-left-[39px] top-5 sm:top-6 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#FAF6F1] border-2 border-[#E8782A] flex items-center justify-center shadow-[0_0_8px_rgba(232,120,42,0.4)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E8782A]" />
                </div>

                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="font-mono text-xl sm:text-2xl font-bold text-[#E8782A]">
                    {proc.step}
                  </span>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FAF6F1] border border-[#E5D5C0] text-[#B5532F] flex items-center justify-center">
                    <IconComp size={15} />
                  </div>
                </div>

                <h3 className="font-heading text-base sm:text-lg font-bold text-[#2B2B2B]">
                  {proc.title}
                </h3>
                <p className="font-body text-xs sm:text-sm text-[#4A4F55] font-light leading-relaxed mt-1 sm:mt-1.5">
                  {proc.desc}
                </p>

                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#E5D5C0] flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-[#B5532F] uppercase tracking-wider font-medium">
                  <span>{proc.phase}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default FabricationProcessSection;
