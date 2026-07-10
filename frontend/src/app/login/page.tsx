"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AuthCard from "@/components/AuthCard";
import { useTheme } from "@/components/ThemeContext";

export default function LoginPage() {
  const { isDark } = useTheme();

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-6 relative">
      {/* Top Navbar Back Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-semibold hover:opacity-80 transition-all duration-200"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full flex justify-center"
      >
        <AuthCard initialMode="login" />
      </motion.div>
    </div>
  );
}
