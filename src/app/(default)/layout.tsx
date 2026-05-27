"use client";

import { Sidebar } from "@/src/components/sidebar/Sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthorized(!!token);
  }, [pathname]);

  const noSidebarPages = [
    "/login",
    "/registraition",
    "/onboarding",
    "/create-workspace",
    "/accept",
  ];

  // Don't show sidebar on specific pages OR on home page if not authorized
  const isNoSidebarPage = noSidebarPages.includes(pathname);
  const isLandingOnHome = pathname === "/" && isAuthorized === false;
  
  const showSidebar = !isNoSidebarPage && !isLandingOnHome && isAuthorized !== null;
  
  return (
    <div className="flex min-h-screen bg-[var(--background)] bg-[var(--background-gradient)] bg-fixed bg-no-repeat">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 transition-all duration-300 ${showSidebar ? 'pl-[64px]' : ''}`}>
        {children}
      </div>
    </div>
  );
}
