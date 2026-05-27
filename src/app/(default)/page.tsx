"use client";

import { useEffect, useState } from "react";
import Main from "@/src/app/layouts/page/Main";
import LandingPage from "@/src/components/landing/LandingPage";
import { Dashboard } from "@/src/components/dashboard/Dashboard";

export default function Home() {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthorized(!!token);
  }, []);

  if (isAuthorized === null) return null; // Or a loading spinner

  return <>{isAuthorized ? <Dashboard /> : <LandingPage />}</>;
}
