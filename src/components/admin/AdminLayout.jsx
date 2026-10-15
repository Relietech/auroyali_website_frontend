import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

export function AdminLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#FAF7F2] text-[#2F1F13] flex font-body selection:bg-[#B5532F] selection:text-white">
      {/* 1. LEFT SIDEBAR */}
      <AdminSidebar
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Admin Navbar */}
        <AdminNavbar
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
        />

        {/* Dynamic Route Content (scrolls cleanly inside this container) */}
        <main className="flex-1 overflow-y-auto min-h-0 bg-[#FAF7F2]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
