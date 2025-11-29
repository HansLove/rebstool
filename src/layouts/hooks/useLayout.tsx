import { useEffect, useState } from "react";

export function useLayout() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // THEME: init & toggle
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored === "dark" || (!stored && prefers);
    document.documentElement.classList.toggle("dark", dark);
    setIsDarkMode(dark);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
    const dark = document.documentElement.classList.contains("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
    setIsDarkMode(dark);
  };
  return {
    isDarkMode,
    toggleDarkMode,
}
}