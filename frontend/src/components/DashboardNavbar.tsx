"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react";
import ThreeDLogo from "./ThreeDLogo";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", href: "/dashboard" },
  { id: "analytics", label: "Analytics", href: "/dashboard/analytics" },
  { id: "query", label: "Query", href: "/dashboard/query" },
  { id: "events", label: "Events", href: "/dashboard/events" },
  { id: "insights", label: "Insights", href: "/dashboard/insights" },
  { id: "platform", label: "Platform", href: "/dashboard/platform" },
  { id: "trust-score", label: "Trust Score", href: "/dashboard/trust-score" },
  { id: "session", label: "Session", href: "/dashboard/session" },
  { id: "health", label: "Health", href: "/dashboard/health" },
  { id: "settings", label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);

    // Initialize theme
    const savedTheme = localStorage.getItem("obsidian-theme") || "dark";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("obsidian-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const isActive = (href: string) => {
    "use client";

    import React, { useState, useEffect } from "react";
    import Link from "next/link";
    import { usePathname, useRouter } from "next/navigation";
    import { Sun, Moon } from "lucide-react";
    import ThreeDLogo from "./ThreeDLogo";

    const NAV_ITEMS = [
      { id: "overview", label: "Overview", href: "/dashboard" },
      { id: "analytics", label: "Analytics", href: "/dashboard/analytics" },
      { id: "query", label: "Query", href: "/dashboard/query" },
      { id: "events", label: "Events", href: "/dashboard/events" },
      { id: "insights", label: "Insights", href: "/dashboard/insights" },
      { id: "platform", label: "Platform", href: "/dashboard/platform" },
      { id: "trust-score", label: "Trust Score", href: "/dashboard/trust-score" },
      { id: "session", label: "Session", href: "/dashboard/session" },
      { id: "health", label: "Health", href: "/dashboard/health" },
      { id: "settings", label: "Settings", href: "/dashboard/settings" },
    ];

    export default function DashboardNavbar() {
      const pathname = usePathname();
      const router = useRouter();
      const [isMobile, setIsMobile] = useState(false);
      const [theme, setTheme] = useState("dark");

      useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 1024);
        check();
        window.addEventListener("resize", check);

        // Initialize theme
        const savedTheme = localStorage.getItem("obsidian-theme") || "dark";
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);

        return () => window.removeEventListener("resize", check);
      }, []);

      const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        localStorage.setItem("obsidian-theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
      };

      const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
      };

      return (
        <div className="w-full flex justify-center mb-6 pt-6 px-4">
          <nav
            className="flex items-center justify-between px-4 py-2 w-full max-w-6xl rounded-full relative"
            style={{
              background: "var(--color-surface)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Brand */}
            <div className="flex items-center gap-3 shrink-0 mr-4">
              <ThreeDLogo className="w-9 h-9" />
              <span className="font-bold text-[16px] tracking-wide hidden sm:block" style={{ color: "var(--color-text-primary)" }}>
                Obsidian
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-200 whitespace-nowrap`}
                    style={{
                      backgroundColor: active ? "var(--color-text-primary)" : "transparent",
                      color: active ? "var(--color-bg)" : "var(--color-text-muted)",
                      border: active ? "1px solid transparent" : "1px solid transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center ml-4 shrink-0">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full transition-colors flex items-center justify-center"
                style={{
                  color: "var(--color-text-primary)",
                  backgroundColor: "var(--color-border)"
                }}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </nav>
        </div>
      );
    }