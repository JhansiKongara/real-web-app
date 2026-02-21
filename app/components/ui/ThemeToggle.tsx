"use client";

import * as React from "react";
import {
  Moon,
  Sun,
  Palette,
  Zap,
  ChevronDown,
  Check,
  Sparkles,
  Leaf,
  Gem,
} from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  const themes = [
    {
      id: "midnight",
      icon: <Palette size={16} />,
      label: "Midnight",
      color: "#22d3ee",
    },
    { id: "solar", icon: <Zap size={16} />, label: "Solar", color: "#fbbf24" },
    { id: "light", icon: <Sun size={16} />, label: "Light", color: "#3b82f6" },
    {
      id: "cyberpunk",
      icon: <Sparkles size={16} />,
      label: "Cyberpunk",
      color: "#ff00f7",
    },
    {
      id: "emerald",
      icon: <Leaf size={16} />,
      label: "Emerald",
      color: "#10b981",
    },
    {
      id: "amethyst",
      icon: <Gem size={16} />,
      label: "Amethyst",
      color: "#d8b4fe",
    },
  ];

  const currentTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[var(--card)]/80 backdrop-blur-md px-3 py-2 rounded-xl border border-[var(--primary)]/30 shadow-lg transition-all hover:border-[var(--primary)] group"
      >
        <span style={{ color: currentTheme.color }}>{currentTheme.icon}</span>
        <span className="text-sm font-bold text-[var(--foreground)] uppercase tracking-wider hidden sm:block">
          {currentTheme.label}
        </span>
        <ChevronDown
          size={14}
          className={`text-[var(--muted)] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[120%] right-0 w-48 bg-[var(--card)] border border-[var(--primary)]/30 rounded-2xl p-2 shadow-2xl z-[5000] animate-in fade-in zoom-in-95 duration-200">
          <div className="px-2 py-1.5 mb-1">
            <span className="text-[0.65rem] font-black text-[var(--muted)] uppercase tracking-[2px]">
              Select Theme
            </span>
          </div>
          <div className="flex flex-col gap-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all ${
                  theme === t.id
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-[var(--muted)] hover:bg-white/5 hover:text-[var(--foreground)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: t.color }}>{t.icon}</span>
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {t.label}
                  </span>
                </div>
                {theme === t.id && (
                  <Check size={14} className="animate-in zoom-in" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
