import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'architecture',
    projectType: 'Residential',
    location: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-3xl border border-earth-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-sage/20 text-sage rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="font-heading text-3xl font-bold text-earth-900 dark:text-stone-100">
          Inquiry Transmitted to AuroYali Studio
        </h3>
        <p className="body-text text-stone-600 dark:text-stone-400 max-w-md mx-auto">
          Thank you, <strong>{formData.name}</strong>. Our principal architects in Auroville will review your project brief and respond within 24 to 48 business hours.
        </p>
        <button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              service: 'architecture',
              projectType: 'Residential',
              location: '',
              message: ''
            });
          }}
          className="px-6 py-2.5 bg-earth-900 text-white rounded-full text-xs uppercase tracking-widest font-mono hover:bg-clay transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-stone-900 p-8 md:p-12 rounded-3xl border border-earth-200 shadow-xl space-y-6"
    >
      <div>
        <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-2">
          Project Inquiries & Workshop Registration
        </span>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-earth-900 dark:text-stone-100">
          Start Your Architectural Journey
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 font-mono mb-2">
            Your Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Marc Laurent"
            className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200 dark:border-stone-700 text-sm focus:outline-none focus:border-clay"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 font-mono mb-2">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@domain.com"
            className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200 dark:border-stone-700 text-sm focus:outline-none focus:border-clay"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 font-mono mb-2">
            Phone / WhatsApp Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200 dark:border-stone-700 text-sm focus:outline-none focus:border-clay"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 font-mono mb-2">
            Primary Area of Interest
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200 dark:border-stone-700 text-sm focus:outline-none focus:border-clay"
          >
            <option value="architecture">Bioclimatic Architecture</option>
            <option value="construction">Turnkey Natural Construction & CSEB</option>
            <option value="carpentry">Artisanal Carpentry & Bamboo</option>
            <option value="metal">Precision Metal Fabrication</option>
            <option value="workshop">Bamboo / Earth Workshop Registration</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 font-mono mb-2">
          Proposed Site Location (City / Region)
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g. Auroville, Chennai, Bangalore, or International"
          className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200 dark:border-stone-700 text-sm focus:outline-none focus:border-clay"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-stone-600 dark:text-stone-300 font-mono mb-2">
          Project Vision or Brief *
        </label>
        <textarea
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your plot, timeline, aesthetic aspirations, or questions regarding our earth building methods..."
          className="w-full px-4 py-3 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200 dark:border-stone-700 text-sm focus:outline-none focus:border-clay resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-clay hover:bg-earth-700 text-white font-medium rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
      >
        {loading ? (
          <span>Sending Transmission...</span>
        ) : (
          <>
            <span>Submit Architectural Brief</span>
            <Send size={15} />
          </>
        )}
      </button>
    </form>
  );
}
export default ContactForm;
