"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    netlifyIdentity?: {
      init: () => void;
      open: (tabName?: "login" | "signup") => void;
    };
  }
}

export default function NetlifyIdentity() {
  useEffect(() => {
    let attempts = 0;
    const openIdentity = () => {
      if (!window.netlifyIdentity) {
        if (++attempts < 100) window.setTimeout(openIdentity, 50);
        return;
      }

      window.netlifyIdentity.init();
      if (window.location.hash.includes("invite_token") || window.location.hash.includes("recovery_token")) {
        window.netlifyIdentity.open("signup");
      }
    };

    openIdentity();
  }, []);

  return null;
}
