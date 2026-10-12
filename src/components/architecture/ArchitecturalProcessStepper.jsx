import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lightbulb, 
  Compass, 
  PenTool, 
  FileText, 
  Users, 
  HardHat, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles,
  Layers,
  Clock,
  ShieldAlert
} from 'lucide-react';

export const architecturalServices = [
  {
    step: "01",
    id: "concept-development",
    title: "Concept Development",
    shortTitle: "Concept & Vision",
    subtitle: "Understanding client aspirations, lifestyle rituals, and functional space goals",
    icon: Lightbulb,
    duration: "2 - 3 Weeks",
    description: "Our architects work closely with clients to understand their needs, goals, and aesthetic preferences. We explore initial spatial layouts, bioclimatic orientation, and hand-drawn conceptual sketches, testing multiple creative possibilities and presenting them for active feedback and collaborative refinement.",
    keyActivities: [
      "Deep-dive client lifestyle and spatial requirement briefing",
      "Site solar path, prevailing wind, and contour study",
      "Conceptual massing and volumetric sketches",
      "Interactive feedback workshops and design iteration"
    ],
    deliverables: [
      "Client Vision & Spatial Brief Document",
      "Initial 2D Conceptual Floor Layout Options",
      "Volumetric 3D Massing Studies",
      "Material Inspiration & Mood Board"
    ],
    clientBenefit: "Ensures the foundational architectural direction aligns 100% with your lifestyle and budget before proceeding into technical design.",
    badge: "Stage 1: Exploration",
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80"
  },
  {
    step: "02",
    id: "feasibility-studies",
    title: "Feasibility Studies",
    shortTitle: "Feasibility & Codes",
    subtitle: "Analyzing microclimate, site conditions, zoning regulations, and environmental impact",
    icon: Compass,
    duration: "1 - 2 Weeks",
    description: "The architects assess the viability and potential of the project through thorough feasibility studies. This involves analyzing site soil conditions, zoning rules, Auroville / local municipal building codes, daylight hours, and environmental impact to ensure seamless execution.",
    keyActivities: [
      "Soil bearing capacity testing and foundation feasibility",
      "Auroville LND / local municipal building regulation audit",
      "Microclimate temperature variation and precipitation modeling",
      "Preliminary cost and material availability estimations"
    ],
    deliverables: [
      "Comprehensive Site Feasibility Report",
      "Zoning & Environmental Compliance Checklist",
      "Solar Radiation & Wind Corridor Simulations",
      "Preliminary Project Cost Framework"
    ],
    clientBenefit: "Eliminates legal, structural, or environmental surprises down the road, guaranteeing regulatory compliance and cost safety.",
    badge: "Stage 2: Validation",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80"
  },
  {
    step: "03",
    id: "design-development",
    title: "Design Development",
    shortTitle: "3D & Detailing",
    subtitle: "Crafting comprehensive architectural drawings, elevations, and photorealistic 3D models",
    icon: PenTool,
    duration: "3 - 5 Weeks",
    description: "Once the concept is approved, our architects proceed to the design development phase. We create detailed architectural drawings, floor plans, sections, elevations, and high-fidelity 3D renderings that illustrate the exact lighting, material textures, and spatial flow of the proposed building.",
    keyActivities: [
      "Precision 2D floor plans with wall thicknesses and window openings",
      "Building elevations, structural sections, and ceiling heights",
      "Photorealistic 3D external and internal visualization",
      "Material, texture, and natural lighting calibration"
    ],
    deliverables: [
      "Full Architectural Architectural Drawings (Plans/Sections/Elevations)",
      "High-Resolution 3D Photorealistic Renderings",
      "Natural Daylighting & Passive Ventilation Diagrams",
      "Interior Spatial Flow & Fixed Joinery Layouts"
    ],
    clientBenefit: "Allows you to visualize every room, courtyard, and light transition with photographic clarity prior to any construction.",
    badge: "Stage 3: Refinement",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
  },
  {
    step: "04",
    id: "construction-documentation",
    title: "Construction Documentation",
    shortTitle: "Blueprints & Specs",
    subtitle: "Preparing exhaustive working drawings, technical specifications, and Bill of Quantities",
    icon: FileText,
    duration: "2 - 4 Weeks",
    description: "Our architects prepare comprehensive construction documents that serve as the definitive handbook for builders and contractors. These documents include precise working blueprints, structural coordination, MEP diagrams, schedules, and Bill of Quantities (BOQ).",
    keyActivities: [
      "Exhaustive architectural working drawings with millimeter precision",
      "MEP (Mechanical, Electrical, Plumbing) integration plans",
      "Detailed door, window, and ventilation jali schedules",
      "Comprehensive Bill of Quantities (BOQ) and material specifications"
    ],
    deliverables: [
      "Full Set of Working Architectural Drawings (1:50 & 1:20)",
      "Integrated MEP & Electrical Distribution Layouts",
      "Joinery & Masonry Schedules (CSEB, Timber, Metal)",
      "Itemized Bill of Quantities (BOQ) & Tender Packages"
    ],
    clientBenefit: "Gives builders an exact, unambiguous manual, preventing costly on-site errors and keeping construction budgets transparent.",
    badge: "Stage 4: Documentation",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
  },
  {
    step: "05",
    id: "discussion-with-construction-team",
    title: "Discussion with Construction Team",
    shortTitle: "Team Alignment",
    subtitle: "Bridging architectural vision directly with project managers, site engineers, and master artisans",
    icon: Users,
    duration: "Continuous at Kickoff",
    description: "Our architects explain the designs and working drawings directly to the project manager, site engineers, master masons, carpenters, and metal fabricators. We ensure the whole building collective is aligned with the client's aspirations, quality standards, and detailing nuances.",
    keyActivities: [
      "On-site pre-construction technical alignment workshops",
      "Detailed walkthrough of CSEB bond patterns, arches, and joinery details",
      "Establishment of tolerance standards and material testing protocols",
      "Direct client representation in contractor coordination meetings"
    ],
    deliverables: [
      "Construction Kickoff & Detailing Minutes",
      "Masonry & Carpentry On-Site Execution Guides",
      "Sample Mockup Approvals (CSEB blocks, lime finish, wood joints)",
      "Master Project Timeline Schedule"
    ],
    clientBenefit: "Zero miscommunication between drawings and ground reality, ensuring the craft team executes the exact vision envisioned.",
    badge: "Stage 5: Coordination",
    image: "https://images.unsplash.com/photo-1540518614846-7ede433c4ef9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    step: "06",
    id: "construction-supervision",
    title: "Construction Supervision",
    shortTitle: "Site Supervision",
    subtitle: "On-site quality monitoring, progress audits, and ensuring fidelity to the architectural design",
    icon: HardHat,
    duration: "Throughout Build Phase",
    description: "During the construction phase, our architects provide regular on-site supervision, inspect structural workmanship, review shop drawings, respond to contractor inquiries, conduct milestone audits, and promptly address any design clarifications or modifications as the building rises.",
    keyActivities: [
      "Scheduled weekly on-site inspection visits and milestone reviews",
      "Quality verification of earth masonry, lime cures, and timber fittings",
      "Fast response to on-site queries and unexpected ground adjustments",
      "Final punch-list walkthrough and as-built documentation verification"
    ],
    deliverables: [
      "Periodic Site Inspection Progress Reports",
      "Structural & Material Quality Sign-Offs",
      "As-Built Architectural Drawings upon Handover",
      "Final Project Completion & Occupancy Certification"
    ],
    clientBenefit: "Guarantees peace of mind that your home or building is constructed to the highest standard of durability and beauty.",
    badge: "Stage 6: Realization",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
  }
];

export function ArchitecturalProcessStepper() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeService = architecturalServices[activeIdx];
  const IconComponent = activeService.icon;

  const nextStep = () => {
    setActiveIdx((prev) => (prev + 1) % architecturalServices.length);
  };

  const prevStep = () => {
    setActiveIdx((prev) => (prev - 1 + architecturalServices.length) % architecturalServices.length);
  };

  return (
    <section id="architectural-process" className="py-20 lg:py-28 bg-white relative overflow-hidden border-b border-earth-200/70">
      
      {/* Ambient background decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-earth-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-clay/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-clay/10 text-clay font-mono text-xs uppercase tracking-widest font-semibold">
            <Sparkles size={12} /> Architectural Services We Provide
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold text-earth-900 leading-tight">
            Our 6-Stage Architectural Lifecycle
          </h2>
          <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
            From initial concept sketch to turnkey site supervision, we carefully guide every single phase of your building project.
          </p>
        </div>

        {/* Step Navigation Bar / Tabs */}
        <div className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-earth-100/70 border border-earth-200/80 shadow-inner">
            {architecturalServices.map((service, idx) => {
              const StepIcon = service.icon;
              const isCurrent = activeIdx === idx;

              return (
                <button
                  key={service.id}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative flex flex-col sm:flex-row items-center gap-2 p-3 sm:p-3.5 rounded-xl text-left transition-all duration-300 cursor-pointer ${
                    isCurrent
                      ? 'bg-white text-earth-900 shadow-md border border-earth-300/80 scale-[1.02]'
                      : 'text-stone-600 hover:text-earth-900 hover:bg-white/60 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-clay text-white shadow-sm'
                        : 'bg-earth-200/70 text-earth-800'
                    }`}
                  >
                    <StepIcon size={16} />
                  </div>

                  <div className="min-w-0 text-center sm:text-left">
                    <span className="text-[10px] font-mono font-bold block text-clay">
                      STAGE {service.step}
                    </span>
                    <span className="text-xs font-heading font-semibold line-clamp-1">
                      {service.shortTitle}
                    </span>
                  </div>

                  {isCurrent && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-clay rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Stage Detailed Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeService.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl bg-earth-50 border border-earth-200/90 p-6 sm:p-8 lg:p-10 shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              
              {/* Left Column: Stage Info & Deliverables (7 Cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Stage Header Tags */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-clay text-white font-mono text-xs font-bold uppercase tracking-wider">
                    {activeService.badge}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-earth-200/80 text-earth-900 font-mono text-xs">
                    <Clock size={12} className="text-clay" /> Est. Timeline: {activeService.duration}
                  </span>
                </div>

                {/* Stage Title & Subtitle */}
                <div>
                  <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-earth-900 leading-snug">
                    {activeService.step}. {activeService.title}
                  </h3>
                  <p className="text-clay font-medium text-sm sm:text-base mt-1">
                    {activeService.subtitle}
                  </p>
                </div>

                {/* Paragraph Description */}
                <p className="text-stone-700 text-base sm:text-lg font-light leading-relaxed">
                  {activeService.description}
                </p>

                {/* Key Activities Grid */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-heading text-lg font-bold text-earth-900 flex items-center gap-2">
                    <Layers size={18} className="text-clay" /> Key Architectural Activities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeService.keyActivities.map((act, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-white border border-earth-200/70 text-xs sm:text-sm text-stone-700 font-light flex items-start gap-2 shadow-2xs"
                      >
                        <CheckCircle2 size={15} className="text-sage shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deliverables Box */}
                <div className="p-5 rounded-2xl bg-earth-100/80 border border-earth-300/60 space-y-2.5">
                  <h5 className="font-mono text-xs uppercase tracking-widest font-bold text-earth-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-clay" /> Client Deliverables Provided:
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {activeService.deliverables.map((del, i) => (
                      <div key={i} className="text-xs text-stone-800 font-medium flex items-center gap-2">
                        <span className="text-clay font-mono">0{i + 1}.</span>
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Client Benefit Callout */}
                <div className="p-4 rounded-xl bg-amber-50 border-l-4 border-amber-500 text-stone-800 text-xs sm:text-sm italic">
                  <strong>Why it matters for you: </strong> {activeService.clientBenefit}
                </div>

                {/* Stepper Navigation Buttons */}
                <div className="pt-4 flex items-center justify-between border-t border-earth-200">
                  <button
                    onClick={prevStep}
                    className="px-4 py-2.5 rounded-full bg-white hover:bg-earth-200 text-earth-900 text-xs font-mono font-medium border border-earth-300/80 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Previous Stage
                  </button>

                  <div className="text-xs font-mono text-stone-500">
                    Stage {activeIdx + 1} of {architecturalServices.length}
                  </div>

                  <button
                    onClick={nextStep}
                    className="px-5 py-2.5 rounded-full bg-clay hover:bg-clay/90 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                  >
                    <span>Next Stage</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>

              {/* Right Column: Visual Stage Showcase (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border-4 border-white bg-earth-200 group">
                  <img
                    src={activeService.image}
                    alt={activeService.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earth-950/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-amber-200 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      AuroYali Studio Practice
                    </span>
                    <h5 className="font-heading text-xl font-bold mt-1.5">
                      {activeService.title}
                    </h5>
                  </div>
                </div>

                {/* Summary Quick List Card */}
                <div className="p-6 rounded-2xl bg-earth-900 text-stone-200 space-y-4 shadow-md border border-earth-800">
                  <div className="flex items-center justify-between pb-3 border-b border-earth-800">
                    <span className="text-xs uppercase font-mono text-clay tracking-wider font-semibold">
                      Full Workflow Overview
                    </span>
                    <span className="text-xs font-mono text-stone-400">
                      Step {activeIdx + 1}/6
                    </span>
                  </div>

                  <div className="space-y-2">
                    {architecturalServices.map((s, idx) => (
                      <button
                        key={s.id}
                        onClick={() => setActiveIdx(idx)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all text-left cursor-pointer ${
                          idx === activeIdx
                            ? 'bg-clay text-white font-medium shadow-sm'
                            : 'hover:bg-earth-800 text-stone-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] opacity-80">{s.step}.</span>
                          <span>{s.title}</span>
                        </div>
                        {idx === activeIdx && <CheckCircle2 size={13} className="text-white" />}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

export default ArchitecturalProcessStepper;
