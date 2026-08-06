"use client";

import { useEffect, useState } from "react";

export default function RootPage() {
  const [isIdentityLink, setIsIdentityLink] = useState(false);

  useEffect(() => {
    const hasIdentityToken = window.location.hash.includes("invite_token") || window.location.hash.includes("recovery_token");
    setIsIdentityLink(hasIdentityToken);
    if (!hasIdentityToken) window.location.replace("/uz/");
  }, []);

  return isIdentityLink ? (
    <main className="min-h-screen grid place-items-center p-6 text-center">
      <p>Loading account setup…</p>
    </main>
  ) : null;
}
