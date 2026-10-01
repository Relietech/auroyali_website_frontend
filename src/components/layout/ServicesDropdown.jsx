import React from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../../data/services';
import { Compass, Layers, Hammer, Shield, ArrowRight } from 'lucide-react';

const icons = {
  Compass,
  Layers,
  Hammer,
  Shield
};

export function ServicesDropdown({ onClose }) {
  return (
    <div className="absolute top-full left-0 w-[540px] bg-white/95 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-earth-200/80 transition-all z-50">
      <div className="text-xs uppercase tracking-widest text-clay font-medium mb-4">
        Multi-Disciplinary Practices
      </div>
      <div className="grid grid-cols-2 gap-4">
        {servicesData.map((service) => {
          const IconComp = icons[service.icon] || Compass;
          return (
            <Link
              key={service.id}
              to={`/services/${service.slug}`}
              onClick={onClose}
              className="group p-3.5 rounded-xl hover:bg-earth-50 transition-all flex items-start gap-3 border border-transparent hover:border-earth-200/50"
            >
              <div className="p-2.5 rounded-lg bg-earth-100 text-earth-900 group-hover:bg-clay group-hover:text-white transition-colors">
                <IconComp size={18} />
              </div>
              <div>
                <h4 className="font-heading text-lg font-bold text-earth-900 group-hover:text-clay transition-colors leading-snug">
                  {service.title}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 mt-0.5 font-light">
                  {service.shortDesc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-earth-100 flex items-center justify-between text-xs">
        <span className="text-stone-500 font-mono">Auroville Ecological Unit</span>
        <Link
          to="/services/architecture"
          onClick={onClose}
          className="text-clay font-medium hover:underline flex items-center gap-1"
        >
          View all practices <ArrowRight size={13} />
        </Link>
      </div>
    </div>
  );
}
export default ServicesDropdown;
