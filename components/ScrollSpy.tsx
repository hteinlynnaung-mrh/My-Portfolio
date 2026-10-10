"use client";

import { useEffect } from "react";

const NAV_SECTIONS = [
  "about",
  "skills",
  "experience",
  "education",
  "repos",
  "blogs",
  "contact",
];

export default function ScrollSpy() {
  useEffect(() => {
    const sections = NAV_SECTIONS.map((name) =>
      document.querySelector<HTMLElement>(`section[data-section="${name}"]`),
    ).filter((section): section is HTMLElement => Boolean(section));

    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("#navbar a[data-nav-section]"),
    );

    if (!sections.length || !links.length) return;

    let animationFrame = 0;

    const setActiveSection = (sectionName: string) => {
      links.forEach((link) => {
        const isActive = link.dataset.navSection === sectionName;
        link.closest("li")?.classList.toggle("active", isActive);
        link.setAttribute("aria-current", isActive ? "page" : "false");
      });
    };

    const updateActiveSection = () => {
      const activationLine = window.scrollY + Math.max(120, window.innerHeight * 0.25);
      let currentSection = sections[0].dataset.section ?? "about";

      for (const section of sections) {
        if (section.offsetTop <= activationLine) {
          currentSection = section.dataset.section ?? currentSection;
        } else {
          break;
        }
      }

      const atPageBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      if (atPageBottom) currentSection = "contact";

      setActiveSection(currentSection);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    updateActiveSection();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return null;
}
