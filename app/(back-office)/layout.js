// app/home/layout.js
"use client"
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar/Sidebar";
import LoginModal from "@/components/LoginModal"; // Add this import
import { Menu } from "lucide-react";
import React from "react";

export default function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false); // Add this state

  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      setIsSidebarVisible(!newIsMobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Add event listener for login modal
    const handleShowLoginModal = () => setShowLoginModal(true);
    window.addEventListener('showLoginModal', handleShowLoginModal);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('showLoginModal', handleShowLoginModal);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {isSidebarVisible && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      )}
      <div className={`flex flex-col flex-1 ${!isMobile && (isSidebarCollapsed ? 'ml-58' : 'ml-58')} transition-all duration-300`}>
        {isMobile && (
          <header className="bg-white shadow-sm p-4 flex items-center">
            <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="p-2">
              <Menu size={24} />
            </button>
          </header>
        )}
        <main className="flex-1 overflow-y-auto bg-slate-100">
          {children}
        </main>
      </div>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}