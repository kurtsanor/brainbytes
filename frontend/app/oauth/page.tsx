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

      const response = await fetch("/api/auth/oauth-login", {
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

      router.replace("/chat");
    };

    handleOAuth();
  }, [router]);

  return <div>Signing you in...</div>;
};

export default OAuthPage;
