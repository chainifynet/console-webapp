import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("");

  useEffect(() => {
    const initTheme = document.documentElement.getAttribute("data-theme") || "light";
    setTheme(initTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    const htmlEl = document.documentElement;
    htmlEl.style.removeProperty("background-color");
    localStorage.setItem("color-mode", newTheme);
    htmlEl.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
  };
  return (
    <label className="label cursor-pointer justify-center space-x-4">
      <span className="label-text">
        <Icon icon="ph:sun-bold" />
      </span>
      <input type="checkbox" className="toggle" checked={theme === "dark"} onChange={toggleTheme} />
      <span className="label-text">
        <Icon icon="ph:moon-bold" />
      </span>
    </label>
  );
};

export default ThemeToggle;
