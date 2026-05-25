"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const OAuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    if (!token) {
      router.replace("/sign-in");
      return;
    }

    localStorage.setItem("session-token", token);
    router.replace("/chat");
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 text-sm text-neutral-600">
      Signing you in...
    </div>
  );
};

export default OAuthPage;
