import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from '../common/ScrollToTop';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-earth-50 text-earth-900 selection:bg-clay selection:text-white">
      <ScrollToTop />
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default Layout;
