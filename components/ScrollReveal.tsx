"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("scroll-reveal-ready");

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveal = (element: HTMLElement) => {
      element.classList.add(
        element.dataset.animateEffect || "fadeInUp",
        "animated",
        "scroll-revealed",
      );
      observer.unobserve(element);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal(entry.target as HTMLElement);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    const observeElements = () => {
      document.querySelectorAll<HTMLElement>(".animate-box:not(.scroll-revealed)").forEach((element) => {
        if (reducedMotion.matches) reveal(element);
        else observer.observe(element);
      });
    };

    observeElements();
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.getElementById("colorlib-main") || document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
      root.classList.remove("scroll-reveal-ready");
    };
  }, []);

  return null;
}
