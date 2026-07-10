"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "./ThemeContext";
import { showToast } from "./Toast";

type AuthMode = "login" | "signup";

interface AuthCardProps {
  initialMode?: AuthMode;
}

export default function AuthCard({ initialMode = "login" }: AuthCardProps) {
  const router = useRouter();
  const { isDark } = useTheme();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  // Loading & error states
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (mode === "signup" && !name.trim()) {
      newErrors.name = "Full name is required";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (mode === "signup") {
      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      
      if (!agreeTerms) {
        newErrors.agreeTerms = "You must agree to the terms and conditions";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setIsLoading(false);
      
      const displayName = mode === "signup" ? name : email.split("@")[0];
      const mockUser = {
        email,
        name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
        isAuthenticated: true,
      };
      
      // Store session
      localStorage.setItem("obsidian-user", JSON.stringify(mockUser));
      
      // Show success feedback
      if (mode === "login") {
        showToast(`Welcome back, ${mockUser.name}!`, "success");
      } else {
        showToast("Account created successfully! Welcome to Obsidian.", "success");
      }
      
      // Redirect to dashboard
      router.push("/dashboard");
    }, 1500);
  };

  const handleSocialLogin = (provider: "google" | "github") => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const mockUser = {
        email: `${provider}-user@obsidian.ai`,
        name: provider === "google" ? "Google User" : "GitHub User",
        isAuthenticated: true,
      };
      localStorage.setItem("obsidian-user", JSON.stringify(mockUser));
      showToast(`Logged in successfully via ${provider.charAt(0).toUpperCase() + provider.slice(1)}!`, "success");
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div
      className="card w-full max-w-[440px] p-8 relative overflow-hidden transition-all duration-300"
      style={{
        background: isDark ? "var(--color-surface)" : "rgba(255, 255, 255, 0.85)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Decorative Glow elements */}
      <div 
        className="absolute top-0 right-0 w-[150px] h-[150px] rounded-full blur-[80px] pointer-events-none opacity-40 transition-all duration-500"
        style={{
          background: isDark ? "radial-gradient(circle, #2DD4BF 0%, transparent 70%)" : "radial-gradient(circle, #0EA5E9 0%, transparent 70%)"
        }}
      />
      <div 
        className="absolute bottom-0 left-0 w-[150px] h-[150px] rounded-full blur-[80px] pointer-events-none opacity-30 transition-all duration-500"
        style={{
          background: isDark ? "radial-gradient(circle, #818CF8 0%, transparent 70%)" : "radial-gradient(circle, #4F46E5 0%, transparent 70%)"
        }}
      />

      <div className="relative z-10">
        {/* Toggle tabs */}
        <div className="flex bg-black/10 dark:bg-black/20 p-1 rounded-full mb-6 relative">
          <div className="grid grid-cols-2 w-full relative z-10">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setErrors({});
              }}
              className="py-2 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none bg-transparent border-none cursor-pointer"
              style={{
                color: mode === "login" 
                  ? (isDark ? "#FFFFFF" : "#0D9488")
                  : (isDark ? "var(--color-text-muted)" : "#64748B"),
              }}
            >
              {mode === "login" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full shadow-sm"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
                    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(13,148,136,0.15)",
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrors({});
              }}
              className="py-2 text-sm font-semibold rounded-full transition-all duration-300 relative focus:outline-none bg-transparent border-none cursor-pointer"
              style={{
                color: mode === "signup" 
                  ? (isDark ? "#FFFFFF" : "#0D9488")
                  : (isDark ? "var(--color-text-muted)" : "#64748B"),
              }}
            >
              {mode === "signup" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-full shadow-sm"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.08)" : "#FFFFFF",
                    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(13,148,136,0.15)",
                    zIndex: -1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              Sign Up
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight" style={{ color: "var(--color-text-primary)" }}>
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {mode === "login" 
              ? "Access your AI governance cockpit"
              : "Start securing and optimizing your LLM pipeline"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <motion.div
                key="name-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="PK Jain"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: "" }));
                  }}
                  className="input"
                  disabled={isLoading}
                  style={{ borderColor: errors.name ? "var(--color-danger)" : "var(--color-border)" }}
                />
                {errors.name && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>{errors.name}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
              Email Address
            </label>
            <input
              type="email"
              placeholder="pkjain@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
              }}
              className="input"
              disabled={isLoading}
              style={{ borderColor: errors.email ? "var(--color-danger)" : "var(--color-border)" }}
            />
            {errors.email && (
              <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>{errors.email}</p>
            )}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-secondary)" }}>
                Password
              </label>
              {mode === "login" && (
                <button 
                  type="button" 
                  onClick={() => showToast("Password reset link simulated!", "info")}
                  className="text-xs hover:underline bg-none border-none p-0 cursor-pointer"
                  style={{ color: "var(--color-teal)" }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                }}
                className="input pr-10"
                disabled={isLoading}
                style={{ borderColor: errors.password ? "var(--color-danger)" : "var(--color-border)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center bg-transparent border-none text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                {showPassword ? (
                  /* Eye Off */
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  /* Eye */
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>{errors.password}</p>
            )}
          </div>

          <AnimatePresence mode="wait">
            {mode === "signup" && (
              <motion.div
                key="confirm-password-field"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--color-text-secondary)" }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: "" }));
                  }}
                  className="input"
                  disabled={isLoading}
                  style={{ borderColor: errors.confirmPassword ? "var(--color-danger)" : "var(--color-border)" }}
                />
                {errors.confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>{errors.confirmPassword}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options checkboxes */}
          <div className="flex items-start">
            {mode === "login" ? (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="rounded dark:bg-gray-800 border-gray-600 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  Remember me for 30 days
                </span>
              </label>
            ) : (
              <div className="flex flex-col">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => {
                      setAgreeTerms(!agreeTerms);
                      if (errors.agreeTerms) setErrors(prev => ({ ...prev, agreeTerms: "" }));
                    }}
                    className="mt-0.5 rounded dark:bg-gray-800 border-gray-600 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    I agree to the <span style={{ color: "var(--color-teal)" }} className="hover:underline">Terms of Service</span> and <span style={{ color: "var(--color-teal)" }} className="hover:underline">Privacy Policy</span>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs mt-1" style={{ color: "var(--color-danger)" }}>{errors.agreeTerms}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-2.5 mt-2 flex items-center justify-center gap-2 relative overflow-hidden"
            style={{ minHeight: "40px" }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 width-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} style={{ width: "16px", height: "16px" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H18" />
                </svg>
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === "login" ? "Log In" : "Sign Up"}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t" style={{ borderColor: "var(--color-border)" }}></div>
          <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            Or Continue With
          </span>
          <div className="flex-grow border-t" style={{ borderColor: "var(--color-border)" }}></div>
        </div>

        {/* Social SSO buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
            className="btn btn-ghost py-2 text-xs flex items-center justify-center gap-2 font-semibold transition-all duration-200"
            style={{
              borderColor: "var(--color-border)",
              background: isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF"
            }}
          >
            {/* Google Icon SVG */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.25c-2.62 0-4.75 2.13-4.75 4.75s2.13 4.75 4.75 4.75 4.75-2.13 4.75-4.75-2.13-4.75-4.75-4.75zm1.5 5.5h-3v-1.5h3v1.5z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleSocialLogin("github")}
            disabled={isLoading}
            className="btn btn-ghost py-2 text-xs flex items-center justify-center gap-2 font-semibold transition-all duration-200"
            style={{
              borderColor: "var(--color-border)",
              background: isDark ? "rgba(255,255,255,0.02)" : "#FFFFFF"
            }}
          >
            {/* Github Icon SVG */}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Form Mode switcher footer text */}
        <div className="text-center mt-6">
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {mode === "login" ? (
              <>
                New to Obsidian?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setErrors({});
                  }}
                  className="font-bold hover:underline bg-none border-none p-0 cursor-pointer"
                  style={{ color: "var(--color-teal)" }}
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrors({});
                  }}
                  className="font-bold hover:underline bg-none border-none p-0 cursor-pointer"
                  style={{ color: "var(--color-teal)" }}
                >
                  Log In
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
