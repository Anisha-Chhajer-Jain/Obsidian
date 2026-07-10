"use client";

import React from "react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 99999,
      }}
    >
      <button
        onClick={toggleTheme}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          borderRadius: "9999px",
          border: "1px solid var(--color-border)",
          background: isDark ? "rgba(17, 24, 39, 0.8)" : "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.5)" : "0 4px 12px rgba(15,23,42,0.08)",
          color: isDark ? "#F9FAFB" : "#0F172A",
          fontSize: "12px",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          outline: "none",
          userSelect: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px) scale(1.03)";
          if (isDark) {
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.25)";
          } else {
            e.currentTarget.style.borderColor = "rgba(15, 23, 42, 0.15)";
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0) scale(1)";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }}
      >
        {isDark ? (
          <>
            {/* Moon Icon */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#818CF8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 4px rgba(129, 140, 248, 0.5))" }}
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <span style={{ color: "var(--color-text-secondary)" }}>Night Mode</span>
          </>
        ) : (
          <>
            {/* Sun Icon */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#D97706"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ filter: "drop-shadow(0 0 4px rgba(217, 119, 6, 0.3))" }}
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <span style={{ color: "#334155" }}>Day Mode</span>
          </>
        )}
      </button>
    </div>
  );
}
