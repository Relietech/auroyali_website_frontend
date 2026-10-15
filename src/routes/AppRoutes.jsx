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
import { AdminProjects } from '../pages/admin/AdminProjects';
import { AdminProjectForm } from '../pages/admin/AdminProjectForm';
import { AdminTeam } from '../pages/admin/AdminTeam';
import { AdminWorkshops } from '../pages/admin/AdminWorkshops';
import { AdminWorkshopForm } from '../pages/admin/AdminWorkshopForm';
import { AdminWorkshopGalleryForm } from '../pages/admin/AdminWorkshopGalleryForm';
import { AdminLeads } from '../pages/admin/AdminLeads';
import { AdminHero3D } from '../pages/admin/AdminHero3D';
import { AdminMaterialStudio } from '../pages/admin/AdminMaterialStudio';
import { AdminCarpentry } from '../pages/admin/AdminCarpentry';
import { AdminArchitecture } from '../pages/admin/AdminArchitecture';
import { AdminArchitectureDisciplineForm } from '../pages/admin/AdminArchitectureDisciplineForm';
import { AdminArchitectureStepForm } from '../pages/admin/AdminArchitectureStepForm';
import { AdminMetalFabrication } from '../pages/admin/AdminMetalFabrication';
import { AdminMetalProjectForm } from '../pages/admin/AdminMetalProjectForm';
import { AdminConstruction } from '../pages/admin/AdminConstruction';
import { AdminLayout } from '../components/admin/AdminLayout';
import { NotFound } from '../pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        
        {/* Services & Direct Service Aliases */}
        <Route path="architecture" element={<Architecture />} />
        <Route path="carpentry" element={<Carpentry />} />
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

      {/* Standalone Admin Console with dedicated AdminNavbar and AdminSidebar */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminProjects />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/new" element={<AdminProjectForm />} />
        <Route path="projects/edit/:id" element={<AdminProjectForm />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="workshops" element={<AdminWorkshops />} />
        <Route path="workshops/new" element={<AdminWorkshopForm />} />
        <Route path="workshops/edit/:id" element={<AdminWorkshopForm />} />
        <Route path="workshops/gallery/new" element={<AdminWorkshopGalleryForm />} />
        <Route path="workshops/gallery/edit/:id" element={<AdminWorkshopGalleryForm />} />
        <Route path="inquiries" element={<AdminLeads initialTab="contact" />} />
        <Route path="leads" element={<AdminLeads initialTab="contact" />} />
        <Route path="workshop-inquiries" element={<AdminLeads initialTab="workshop" />} />
        <Route path="workshop-leads" element={<AdminLeads initialTab="workshop" />} />
        <Route path="hero" element={<AdminHero3D />} />
        <Route path="hero-3d" element={<AdminHero3D />} />
        <Route path="material-studio" element={<AdminMaterialStudio />} />
        <Route path="materials-3d" element={<AdminMaterialStudio />} />
        <Route path="carpentry" element={<AdminCarpentry />} />
        <Route path="carpentry-studio" element={<AdminCarpentry />} />
        <Route path="architecture" element={<AdminArchitecture />} />
        <Route path="architecture-studio" element={<AdminArchitecture />} />
        <Route path="architecture/disciplines/new" element={<AdminArchitectureDisciplineForm />} />
        <Route path="architecture/disciplines/edit/:id" element={<AdminArchitectureDisciplineForm />} />
        <Route path="architecture/steps/new" element={<AdminArchitectureStepForm />} />
        <Route path="architecture/steps/edit/:id" element={<AdminArchitectureStepForm />} />
        <Route path="metal-fabrication" element={<AdminMetalFabrication />} />
        <Route path="metal-fabrication/projects/new" element={<AdminMetalProjectForm />} />
        <Route path="metal-fabrication/projects/edit/:id" element={<AdminMetalProjectForm />} />
        <Route path="metal-studio" element={<AdminMetalFabrication />} />
        <Route path="construction" element={<AdminConstruction />} />
        <Route path="construction-studio" element={<AdminConstruction />} />
      </Route>
    </Routes>
  );
}
export default AppRoutes;
