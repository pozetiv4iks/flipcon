"use client";

import Main from "@/src/app/layouts/page/Main";
import LandingPage from "@/src/components/landing/LandingPage";

export default function Page() {
  const isAuthorithed = false;
  return <>{isAuthorithed ? <Main /> : <LandingPage />}</>;
}
