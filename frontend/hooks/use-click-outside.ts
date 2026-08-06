"use client";

import { type RefObject, useEffect } from "react";

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: (event: Event) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;

    const listener = (event: Event) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      // Touch event uchun preventDefault() ni olib tashlaymiz
      handler(event);
    };

    // mousedown va touchstart eventlarini qaytaramiz, chunki ular ko'proq qurilmalarda ishlaydi
    document.addEventListener("mousedown", listener, { capture: true });
    document.addEventListener("touchstart", listener, { capture: true });

    return () => {
      document.removeEventListener("mousedown", listener, { capture: true });
      document.removeEventListener("touchstart", listener, { capture: true });
    };
  }, [ref, handler, enabled]);
}

export default useOnClickOutside;
