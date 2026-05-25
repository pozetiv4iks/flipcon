"use client";

import { Sidebar } from "@/src/components/sidebar/Sidebar";
import { usePathname } from "next/navigation";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const noSidebarPages = [
    "/login",
    "/registraition",
    "/onboarding",
    "/create-workspace",
  ];

  const showSidebar = !noSidebarPages.includes(pathname);
  
  return (
    <div className="flex min-h-screen bg-[var(--background)] bg-[var(--background-gradient)] bg-fixed bg-no-repeat">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'ml-[64px]' : ''}`}>
        {children}
      </div>
    </div>
  );
}
