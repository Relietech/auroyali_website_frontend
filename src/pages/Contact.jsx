import React from 'react';
import { ContactInfo } from '../components/contact/ContactInfo';
import { ContactForm } from '../components/contact/ContactForm';

export function Contact() {
  return (
    <div className="pt-32 pb-24 bg-earth-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <div className="lg:col-span-5 sticky top-28">
            <ContactInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Contact;
