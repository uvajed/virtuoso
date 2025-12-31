"use client";

import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <div className="md:ml-[280px]">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="min-h-[calc(100vh-64px)]">
          <div className="p-4 md:p-6 lg:p-8 bg-gradient-to-b from-surface-elevated to-background">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
