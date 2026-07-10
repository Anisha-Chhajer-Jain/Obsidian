"use client";

import React from "react";
import Ferrofluid from "./Ferrofluid";
import { useTheme } from "./ThemeContext";

export default function ThemeBackground() {
  const { isDark } = useTheme();

  return (
    <div style={{ width: '100%', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: -1 }}>
      {isDark ? (
        <Ferrofluid
          colors={["#ffffff", "#ffffff", "#ffffff"]}
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.2}
          sharpness={2.5}
          shimmer={1.5}
          glow={2}
          flowDirection="down"
          opacity={1}
          mouseInteraction={true}
          mouseStrength={1}
          mouseRadius={0.35}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--color-bg)",
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(14, 165, 233, 0.06) 0%, transparent 50%),
                              radial-gradient(circle at 80% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)`,
          }}
        />
      )}
    </div>
  );
}
