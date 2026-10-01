import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { Home } from '../pages/Home';
import { AboutUs } from '../pages/AboutUs';
import { Architecture } from '../pages/Services/Architecture';
import { Construction } from '../pages/Services/Construction';
import { Carpentry } from '../pages/Services/Carpentry';
import { MetalFabrication } from '../pages/Services/MetalFabrication';
import { Projects } from '../pages/Projects';
import { ProjectDetail } from '../pages/ProjectDetail';
import { Workshops } from '../pages/Workshops';
import { BambooWorkshop } from '../pages/BambooWorkshop';
import { Testimonials } from '../pages/Testimonials';
import { Contact } from '../pages/Contact';
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        
        {/* Services */}
        <Route path="services" element={<Architecture />} />
        <Route path="services/architecture" element={<Architecture />} />
        <Route path="services/construction" element={<Construction />} />
        <Route path="services/carpentry" element={<Carpentry />} />
        <Route path="services/metal-fabrication" element={<MetalFabrication />} />

        {/* Projects */}
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetail />} />

        {/* Workshops */}
        <Route path="workshops" element={<Workshops />} />
        <Route path="workshops/bamboo" element={<BambooWorkshop />} />

        {/* Testimonials & Contact */}
        <Route path="testimonials" element={<Testimonials />} />
        <Route path="contact" element={<Contact />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
export default AppRoutes;
