"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

const getKey = (pathname: string) => `scroll:${pathname}`;

export default function ScrollRestorer() {
  const pathname = usePathname();
  const hasRestored = useRef(false);
  const ticking = useRef(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    const key = getKey(pathname);
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const saved = sessionStorage.getItem(key);
    const savedY = saved ? Number(saved) : NaN;

    if (!Number.isNaN(savedY) && !hasRestored.current) {
      hasRestored.current = true;
      window.scrollTo(0, savedY);
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const key = getKey(pathname);
    const save = () => {
      sessionStorage.setItem(key, String(window.scrollY));
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        ticking.current = false;
        save();
      });
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        save();
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      save();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", save);
      window.removeEventListener("beforeunload", save);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [pathname]);

  return null;
}
