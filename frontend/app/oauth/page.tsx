"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const OAuthPage = () => {
  const router = useRouter();

  useEffect(() => {
    const handleOAuth = async () => {
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        router.replace("/sign-in");
        return;
      }

      const response = await fetch("/api/oauth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        router.replace("/sign-in");
        return;
      }

      const result = await response.json();
      localStorage.setItem("session-token", result.token);
      router.replace("/chat");
    };

    handleOAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="flex flex-col items-center">
        <div className="h-6 w-6 animate-spin border-2 border-neutral-200 border-t-black" />

        <p className="mt-4 text-sm tracking-tight text-neutral-600">
          Signing you in...
        </p>
      </div>
    </div>
  );
};

export default OAuthPage;
