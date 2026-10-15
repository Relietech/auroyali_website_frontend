import React, { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { createLead } from '../../services/leadStore';

export function ContactForm({ config }) {
  const defaultServices = [
    "Block making",
    "Architectural design",
    "Metal fabrication",
    "Carpentry works",
    "Painting",
    "Other"
  ];

  const services = config?.company?.services || defaultServices;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: services[0] || 'Block making',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation logic
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Your name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        return '';

      case 'email':
        if (!value.trim()) return 'Email address is required.';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value.trim())) {
          return 'Please enter a valid email address (e.g. name@example.com).';
        }
        return '';

      case 'phone':
        if (!value.trim()) return ''; // Phone is optional
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length !== 10) {
          return 'Please enter a valid 10-digit phone number.';
        }
        return '';

      case 'message':
        if (!value.trim()) return 'Please enter a message or project brief.';
        if (value.trim().length < 10) return 'Message must be at least 10 characters.';
        return '';

      default:
        return '';
    }
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validateField(field, formData[field]);
      if (err) newErrors[field] = err;
    });
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    // Restrict phone input strictly to numbers only, max 10 digits
    if (name === 'phone') {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData((prev) => ({ ...prev, [name]: finalValue }));

    // Clear or update error dynamically as user types
    if (touched[name]) {
      const fieldError = validateField(name, finalValue);
      setErrors((prev) => ({ ...prev, [name]: fieldError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all as touched
    setTouched({
      name: true,
      email: true,
      phone: true,
      message: true
    });

    const validationErrors = validateAll();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      // Focus the first invalid input
      const firstErrorField = Object.keys(validationErrors)[0];
      const el = document.querySelector(`[name="${firstErrorField}"]`);
      if (el) el.focus();
      return;
    }

    setLoading(true);

    try {
      createLead({
        category: 'contact',
        source: 'Contact Page (/contact)',
        title: `${formData.service} Inquiry`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
        priority: 'normal'
      });
    } catch (err) {
      console.error('Error logging contact lead:', err);
    }

    // Simulated submission delay
    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl border border-earth-200 dark:border-stone-800 shadow-xl text-center space-y-6 w-full">
        <div className="w-16 h-16 bg-sage/20 text-sage rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 size={36} />
        </div>
        <h3 className="font-heading text-2xl sm:text-3xl font-bold text-earth-900 dark:text-stone-100">
          Inquiry Successfully Received
        </h3>
        <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{formData.name}</strong>. The AuroYali construction and project team has received your message regarding <strong>{formData.service}</strong> and will get back to you shortly at <strong>{formData.email}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: '',
              email: '',
              phone: '',
              service: services[0] || 'Block making',
              message: ''
            });
            setErrors({});
            setTouched({});
          }}
          className="px-8 py-3 bg-earth-900 dark:bg-stone-800 text-white rounded-full text-xs uppercase tracking-widest font-mono hover:bg-clay dark:hover:bg-clay transition-colors cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white dark:bg-stone-900 p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-earth-200 dark:border-stone-800 shadow-xl space-y-5 sm:space-y-6 w-full"
    >
      <div>
        <span className="text-xs uppercase tracking-widest text-clay font-mono block mb-1.5 sm:mb-2 font-semibold">
          Get in Touch
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-earth-900 dark:text-stone-100 leading-tight">
          Request a Quote or Consultation
        </h2>
        <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1">
          Fill out the form below and our team will get back to you promptly.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Name - Required */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-mono mb-1.5 sm:mb-2">
            Your Name <span className="text-clay font-bold">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter your full name"
            aria-invalid={!!errors.name}
            className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl bg-earth-50 dark:bg-stone-800 text-earth-900 dark:text-stone-100 text-sm focus:outline-none transition-colors ${
              errors.name
                ? 'border-2 border-rose-500 focus:border-rose-600 bg-rose-50/20 dark:bg-rose-950/20'
                : 'border border-earth-200 dark:border-stone-700 focus:border-clay focus:ring-1 focus:ring-clay'
            }`}
          />
          {errors.name && (
            <p className="text-rose-600 dark:text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-mono">
              <AlertCircle size={13} className="shrink-0" />
              <span>{errors.name}</span>
            </p>
          )}
        </div>

        {/* Email - Required */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-mono mb-1.5 sm:mb-2">
            Email Address <span className="text-clay font-bold">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl bg-earth-50 dark:bg-stone-800 text-earth-900 dark:text-stone-100 text-sm focus:outline-none transition-colors ${
              errors.email
                ? 'border-2 border-rose-500 focus:border-rose-600 bg-rose-50/20 dark:bg-rose-950/20'
                : 'border border-earth-200 dark:border-stone-700 focus:border-clay focus:ring-1 focus:ring-clay'
            }`}
          />
          {errors.email && (
            <p className="text-rose-600 dark:text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-mono">
              <AlertCircle size={13} className="shrink-0" />
              <span>{errors.email}</span>
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Phone - Optional with 10 digits typing limit & exact 10-digit validation */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-mono mb-1.5 sm:mb-2">
            Phone Number <span className="text-stone-400 text-[10px] lowercase">(optional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            maxLength={10}
            inputMode="numeric"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="9876543210"
            aria-invalid={!!errors.phone}
            className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl bg-earth-50 dark:bg-stone-800 text-earth-900 dark:text-stone-100 text-sm focus:outline-none transition-colors ${
              errors.phone
                ? 'border-2 border-rose-500 focus:border-rose-600 bg-rose-50/20 dark:bg-rose-950/20'
                : 'border border-earth-200 dark:border-stone-700 focus:border-clay focus:ring-1 focus:ring-clay'
            }`}
          />
          {errors.phone && (
            <p className="text-rose-600 dark:text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-mono">
              <AlertCircle size={13} className="shrink-0" />
              <span>{errors.phone}</span>
            </p>
          )}
        </div>

        {/* Service of Interest */}
        <div>
          <label className="block text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-mono mb-1.5 sm:mb-2">
            Service of Interest <span className="text-clay font-bold">*</span>
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            className="w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl bg-earth-50 dark:bg-stone-800 border border-earth-200 dark:border-stone-700 text-earth-900 dark:text-stone-100 text-sm focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay cursor-pointer"
          >
            {services.map((svc) => (
              <option key={svc} value={svc}>
                {svc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message - Required with length validation */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-stone-700 dark:text-stone-300 font-mono mb-1.5 sm:mb-2">
          Your Message <span className="text-clay font-bold">*</span>
        </label>
        <textarea
          name="message"
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Please describe your requirements, project details, or any questions..."
          aria-invalid={!!errors.message}
          className={`w-full px-3.5 sm:px-4 py-3 sm:py-3.5 rounded-xl bg-earth-50 dark:bg-stone-800 text-earth-900 dark:text-stone-100 text-sm focus:outline-none resize-none transition-colors ${
            errors.message
              ? 'border-2 border-rose-500 focus:border-rose-600 bg-rose-50/20 dark:bg-rose-950/20'
              : 'border border-earth-200 dark:border-stone-700 focus:border-clay focus:ring-1 focus:ring-clay'
          }`}
        />
        {errors.message && (
          <p className="text-rose-600 dark:text-rose-400 text-xs mt-1.5 flex items-center gap-1 font-mono">
            <AlertCircle size={13} className="shrink-0" />
            <span>{errors.message}</span>
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 sm:py-4 bg-clay hover:bg-earth-800 text-white font-medium rounded-full text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
      >
        {loading ? (
          <span>Validating & Sending...</span>
        ) : (
          <>
            <span>Send Message</span>
            <Send size={15} />
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;
