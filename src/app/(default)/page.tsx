"use client";

import Main from "@/src/app/layouts/page/Main";
import LandingPage from "@/src/components/landing/LandingPage";
import { Dashboard } from "@/src/components/dashboard/Dashboard";

export default function Home() {
  const isAuthorithed = true;
  return <>{isAuthorithed ? <Dashboard /> : <LandingPage />}</>;
}
