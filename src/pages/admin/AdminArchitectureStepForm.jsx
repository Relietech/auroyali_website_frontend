import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import {
  getProcessStepById,
  saveProcessStep,
  getArchitectureIcon,
  ARCHITECTURE_ICONS,
  getStoredArchitectureData
} from '../../services/architectureStore';

export function AdminArchitectureStepForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    id: '',
    step: '',
    title: '',
    iconName: 'Lightbulb',
    description: ''
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditing) {
      const existing = getProcessStepById(id);
      if (existing) {
        setFormData({
          id: existing.id,
          step: existing.step || '',
          title: existing.title || '',
          iconName: existing.iconName || 'Lightbulb',
          description: existing.description || ''
        });
      } else {
        setFormError('Process step not found.');
      }
    } else {
      const current = getStoredArchitectureData();
      const count = current.processSteps?.length || 0;
      setFormData((prev) => ({
        ...prev,
        step: (count + 1).toString().padStart(2, '0')
      }));
    }
  }, [id, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Step title is required.');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Step description is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      saveProcessStep(formData);
      navigate('/admin/architecture?tab=process');
    } catch {
      setFormError('Failed to save process step.');
      setIsSubmitting(false);
    }
  };

  const IconComp = getArchitectureIcon(formData.iconName);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 select-none font-body pb-24">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5D7C5]/60">
        <div>
          <Link
            to="/admin/architecture?tab=process"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#865430] hover:text-[#B5532F] transition-colors mb-2 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Architecture Console</span>
          </Link>

          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#B5532F]/10 border border-[#B5532F]/20 text-[#B5532F] text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider">
              <Lightbulb size={11} />
              <span>Step-by-Step Architecture Process</span>
            </span>
            <span className="text-xs font-mono text-[#865430]/70">•</span>
            <span className="text-xs font-mono text-[#524336]/80">
              {isEditing ? `Editing Step ${formData.step || '01'}` : 'New Step Entry'}
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-[#2F1F13] tracking-tight">
            {isEditing ? `Edit Step ${formData.step}: ${formData.title}` : 'Add Architectural Process Step'}
          </h1>
          <p className="text-xs sm:text-sm text-[#524336] mt-0.5 font-light max-w-2xl">
            Configure step details, sequential numbers, and descriptive explanations displayed in the 6-step architecture methodology.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/admin/architecture?tab=process"
            className="px-4 py-2 rounded-xl bg-white border border-[#E5D7C5] hover:bg-[#FAF7F2] text-[#524336] hover:text-[#2F1F13] text-xs font-mono uppercase tracking-wider transition-all"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <Save size={14} />
            <span>{isEditing ? 'Save Changes' : 'Create Step'}</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {formError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertTriangle size={16} className="text-rose-600 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* 2. FORM GRID */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-5 sm:p-7 rounded-2xl bg-white border border-[#E5D7C5] shadow-xs space-y-5">
            <h2 className="font-heading text-base font-bold text-[#2F1F13] flex items-center gap-2 border-b border-[#E5D7C5]/60 pb-3">
              <Sparkles size={16} className="text-[#B5532F]" />
              <span>Step Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Step # (e.g. 01)
                </label>
                <input
                  type="text"
                  value={formData.step}
                  onChange={(e) => setFormData({ ...formData, step: e.target.value })}
                  placeholder="01"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-xs font-mono focus:bg-white focus:border-[#B5532F]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                  Step Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Concept Development"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:bg-white focus:border-[#B5532F]"
                />
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-2">
                Select Step Icon: <span className="text-[#B5532F] font-bold">{formData.iconName}</span>
              </label>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-36 overflow-y-auto p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] scrollbar-thin">
                {Object.keys(ARCHITECTURE_ICONS).map((iconKey) => {
                  const ItemComp = ARCHITECTURE_ICONS[iconKey];
                  const isSelected = formData.iconName === iconKey;
                  return (
                    <button
                      key={iconKey}
                      type="button"
                      onClick={() => setFormData({ ...formData, iconName: iconKey })}
                      className={`p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#B5532F] text-white shadow-xs font-bold ring-2 ring-[#B5532F]/50'
                          : 'text-[#524336] hover:text-[#2F1F13] hover:bg-white border border-transparent hover:border-[#E5D7C5]'
                      }`}
                      title={iconKey}
                    >
                      <ItemComp size={16} />
                      <span className="text-[9px] truncate max-w-full font-mono">
                        {iconKey}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#524336] tracking-wider font-semibold mb-1.5">
                Step Description *
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="They work closely with clients to understand their needs, goals, and preferences..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5D7C5] text-[#2F1F13] text-sm focus:bg-white focus:border-[#B5532F] resize-y leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D7C5]/60">
              <Link
                to="/admin/architecture?tab=process"
                className="px-5 py-2.5 rounded-xl bg-white border border-[#E5D7C5] hover:bg-[#FAF7F2] text-[#524336] text-xs font-mono uppercase tracking-wider"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B5532F] hover:bg-[#963A22] text-white font-mono text-xs uppercase tracking-wider font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Save size={14} />
                <span>{isEditing ? 'Save Changes' : 'Create Step'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Card Preview */}
        <div className="lg:col-span-5 space-y-3">
          <div className="sticky top-6 space-y-3">
            <span className="text-[11px] font-mono uppercase text-[#865430] tracking-wider font-semibold flex items-center gap-1.5">
              <Eye size={13} className="text-[#B5532F]" />
              <span>Live Step Card Preview</span>
            </span>

            <div className="p-6 rounded-2xl bg-[#FAF6F1] border border-[#E8D9CC] shadow-md flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#B5472B]/10 text-[#B5472B] flex items-center justify-center">
                    <IconComp size={22} />
                  </div>
                  <span className="font-mono text-sm font-bold text-[#6B5B52]">
                    {formData.step || '01'}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-[#2A1A12]">
                  {formData.title || 'Step Title'}
                </h3>

                <p className="font-body text-xs sm:text-sm text-[#6B5B52] leading-relaxed font-light">
                  {formData.description || 'Step description will appear here as written...'}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8D9CC] flex items-center gap-1.5 text-xs font-mono text-[#6B5B52]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B5472B]" />
                <span>AuroYali Architectural Standard</span>
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}

export default AdminArchitectureStepForm;
