"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import { deleteSession, type EventRecord } from "@/lib/api";
import { formatINR } from "@/lib/currency";
import { useDashboardData } from "@/components/DashboardContext";
import { showToast } from "@/components/Toast";
import Link from "next/link";
import {
  DollarSign, TrendingUp, Zap, ShieldAlert, ArrowRight,
  Activity, RefreshCw, Sparkles,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  order_status:   "#6366F1",
  refund:         "#A78BFA",
  sensitive_data: "#F87171",
  general_faq:    "#34D399",
};
const CATEGORY_LABELS: Record<string, string> = {
  order_status:   "Order Status",
  refund:         "Refund",
  sensitive_data: "Sensitive Data",
  general_faq:    "General FAQ",
};

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false, timeZone: "Asia/Kolkata",
  });
const formatLatency = (ms: number) =>
  ms >= 1000 ? `${(ms / 1000).toFixed(2)}s` : `${ms.toFixed(0)}ms`;

// Animated count-up hook
function useCountUp(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);
  useEffect(() => {
    if (target === prevTarget.current) return;
    const start = prevTarget.current;
    const diff = target - start;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(start + diff * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else { setValue(target); prevTarget.current = target; }
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function ActionBadge({ action }: { action: string }) {
  if (action === "allow") return <span className="badge badge-allow">✓ Allow</span>;
  if (action === "stop")  return <span className="badge badge-stop">✗ Block</span>;
  return <span className="badge badge-switch">⇄ {action}</span>;
}

function StatCard({ label, value, sub, color, icon, trend, delay = 0 }: {
  label: string; value: string; sub?: string; color: string;
  icon: React.ReactNode; trend?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="card card-hover"
      style={{ padding: "22px 24px", position: "relative", overflow: "hidden" }}
    >
      {/* Radial glow */}
      <div style={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      {/* Top accent line */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 24,
        right: 24,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
      }} />

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
<<<<<<< Updated upstream
          <p style={{
            margin: 0,
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            color: "var(--color-text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}>{label}</p>
          <p className="stat-number" style={{
            margin: "10px 0 0",
            fontSize: 28,
            fontWeight: 800,
            color: "var(--color-text-primary)",
            lineHeight: 1,
          }}>{value}</p>
          {sub && <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "var(--color-text-muted)" }}>{sub}</p>}
          {trend && (
            <p style={{ margin: "6px 0 0", fontSize: 11.5, color, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{
                display: "inline-block",
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px ${color}`,
              }} />
              {trend}
            </p>
          )}
=======
          <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
          <p className="font-mono-data" style={{ margin: "5px 0 0", fontSize: "26px", fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1, wordBreak: "break-all" }}>{value}</p>
          {sub && <p style={{ margin: "5px 0 0", fontSize: "11.5px", color: "var(--color-text-muted)" }}>{sub}</p>}
          {trend && <p style={{ margin: "4px 0 0", fontSize: "11.5px", color }}>{trend}</p>}
>>>>>>> Stashed changes
        </div>
        <motion.div
          animate={{ boxShadow: [`0 0 12px ${color}30`, `0 0 24px ${color}50`, `0 0 12px ${color}30`] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${color}10`,
            border: `1px solid ${color}20`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Arc gauge for budget
function BudgetArc({ pct, color }: { pct: number; color: string }) {
  const size = 120;
  const r = 46;
  const cx = size / 2;
  const cy = size / 2;
  const startAngle = -210;
  const sweep = 240;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (startDeg: number, sweepDeg: number) => {
    const start = toRad(startDeg);
    const end = toRad(startDeg + sweepDeg);
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end),   y2 = cy + r * Math.sin(end);
    const large = sweepDeg > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  };
  const filledSweep = (pct / 100) * sweep;
  return (
    <svg width={size} height={size}>
      <path d={arcPath(startAngle, sweep)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={10} strokeLinecap="round" />
      <motion.path
        d={arcPath(startAngle, filledSweep)}
        fill="none"
        stroke={color}
        strokeWidth={10}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
      />
    </svg>
  );
}

const tooltipStyle = {
  background: "rgba(15, 16, 24, 0.95)",
  border: "1px solid rgba(99,102,241,0.2)",
  color: "#F0F0FF",
  borderRadius: 10,
  fontSize: 11,
  boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
  backdropFilter: "blur(12px)",
};

export default function DashboardPage() {
  const { events, insights, refreshData: fetchData } = useDashboardData();
  const [resetting, setResetting] = useState(false);
  const [uptime, setUptime] = useState("00:00");
  const sessionStart = useRef(Date.now());

  useEffect(() => {
    const t = setInterval(() => {
      const e = Date.now() - sessionStart.current;
      const m = Math.floor(e / 60000), s = Math.floor((e % 60000) / 1000);
      setUptime(`${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const handleReset = async () => {
    setResetting(true);
    try {
      const res = await deleteSession();
      sessionStart.current = Date.now();
      setUptime("00:00");
      showToast(res?.message ?? "Session reset successfully!", "success");
      await fetchData();
    } catch (e: any) {
      showToast(e?.message ?? "Failed to reset session", "error");
    } finally {
      setResetting(false);
    }
  };

  const latest = events[0]?.audit_event;
  const isWarning = latest && (latest.action === "stop" || (latest.budget_state?.remaining ?? 1) <= 0);

  const budget = useMemo(() => {
    if (!latest?.budget_state) return { remaining: 0.02, max: 0.02, pct: 100 };
    const { remaining, max } = latest.budget_state;
    return { remaining, max, pct: Math.max(0, (remaining / max) * 100) };
  }, [latest]);

  const totalCost  = useMemo(() => events.reduce((s, e) => s + (e.audit_event.cost_total ?? 0), 0), [events]);
  const avgLatency = useMemo(() => {
    if (!events.length) return 0;
    return events.reduce((s, e) => s + (e.audit_event.latency_used_ms ?? 0), 0) / events.length;
  }, [events]);
  const blockRate  = useMemo(() => {
    if (!events.length) return 0;
    return (events.filter(e => e.audit_event.action === "stop").length / events.length) * 100;
  }, [events]);

  const chartData = useMemo(() => {
    let cum = 0;
    return [...events].reverse().map((r, i) => {
      cum += r.audit_event.cost_total ?? 0;
      return { i, cost: r.audit_event.cost_total ?? 0, cumulative: cum, time: formatTime(r.timestamp_ms) };
    });
  }, [events]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    events.forEach(r => { counts[r.category] = (counts[r.category] ?? 0) + 1; });
    return Object.entries(counts).map(([cat, value]) => ({
      name: CATEGORY_LABELS[cat] ?? cat, value,
<<<<<<< Updated upstream
      color: CATEGORY_COLORS[cat] ?? "#5C5D63",
=======
      color: CATEGORY_COLORS[cat] ?? "var(--color-text-muted)",
>>>>>>> Stashed changes
    }));
  }, [events]);

  const budgetBarColor = isWarning ? "#F87171" : budget.pct < 40 ? "#FBBF24" : "#34D399";

  return (
<<<<<<< Updated upstream
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
=======
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Top action row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="status-dot online" />
          <span style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--color-text-muted)" }}>
            Live · {uptime} · {events.length} events
          </span>
        </div>
        <button
          id="reset-session-btn"
          onClick={handleReset}
          disabled={resetting}
          className="btn btn-danger"
          style={{ fontSize: "13px", padding: "6px 14px" }}
        >
          {resetting ? <span className="animate-spin" style={{ display: "inline-block", width: 14, height: 14 }}>↻</span> : (
            <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Reset Session
        </button>
      </div>
>>>>>>> Stashed changes

      {/* Hero header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}
      >
        <div>
          <h1 style={{
            margin: 0,
            fontSize: 22,
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.03em",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <Sparkles size={20} style={{ color: "var(--color-accent-light)" }} />
            Command Center
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--color-text-muted)" }}>
            Real-time AI governance · {events.length} events
            <span className="font-mono-data" style={{ marginLeft: 8, color: "rgba(99,102,241,0.5)" }}>
              {uptime}
            </span>
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.15)",
          }}>
            <span className="status-dot online" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(52,211,153,0.9)", fontFamily: "'Space Grotesk', sans-serif", letterSpacing: "0.05em" }}>
              Governance Active
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleReset}
            disabled={resetting}
            className="btn btn-danger"
            style={{ gap: 6 }}
          >
            {resetting ? (
              <RefreshCw size={13} className="animate-spin" />
            ) : (
              <RefreshCw size={13} />
            )}
            Reset Session
          </motion.button>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        <StatCard
          delay={0}
          label="Budget Remaining"
          value={formatINR(budget.remaining, 4)}
          sub={`of ${formatINR(budget.max)} cap`}
          color={isWarning ? "#F87171" : budget.pct < 40 ? "#FBBF24" : "#34D399"}
          trend={isWarning ? "Budget exceeded!" : undefined}
          icon={<DollarSign size={20} />}
        />
        <StatCard
          delay={0.08}
          label="Total Spend"
          value={formatINR(totalCost, 5)}
          sub={`across ${events.length} queries`}
          color="#6366F1"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          delay={0.16}
          label="Avg Latency"
          value={formatLatency(avgLatency)}
          sub="per query"
          color="#A78BFA"
          icon={<Zap size={20} />}
        />
        <StatCard
          delay={0.24}
          label="Block Rate"
          value={`${blockRate.toFixed(0)}%`}
          sub="queries stopped by policy"
          color={blockRate > 20 ? "#F87171" : "#FBBF24"}
          icon={<ShieldAlert size={20} />}
        />
      </div>

<<<<<<< Updated upstream
      {/* Budget & Charts row */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 16 }}>
        {/* Budget arc card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`card${isWarning ? " animate-pulse-warning" : ""}`}
          style={{ padding: "24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}
        >
          <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Budget Status</p>
              <p style={{ margin: "3px 0 0", fontSize: 12, color: "var(--color-text-secondary)" }}>
                {isWarning ? "Exhausted" : budget.pct > 60 ? "Healthy" : "Running Low"}
              </p>
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: 800,
              fontFamily: "'Space Grotesk', sans-serif",
              padding: "3px 10px",
              borderRadius: 999,
              color: budgetBarColor,
              background: `${budgetBarColor}12`,
              border: `1px solid ${budgetBarColor}25`,
              letterSpacing: "0.06em",
            }}>
              {isWarning ? "EXCEEDED" : budget.pct > 60 ? "HEALTHY" : "LOW"}
            </span>
=======
      {/* Budget bar */}
      <div className={`card${isWarning ? " animate-pulse-warning" : ""}`} style={{ padding: "18px 22px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <p style={{ margin: 0, fontSize: "12px", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Budget Consumption</p>
            <p style={{ margin: "3px 0 0", fontSize: "13px", color: "var(--color-text-primary)" }}>
              <span className="font-mono-data" style={{ fontWeight: 700, color: budgetBarColor }}>{(100 - budget.pct).toFixed(1)}%</span>
              {" used · "}
              {isWarning ? "Budget exhausted — reset session to continue" : `${formatINR(budget.remaining, 5)} remaining`}
            </p>
          </div>
          <span style={{ fontSize: "11.5px", fontWeight: 600, color: budgetBarColor, background: `${budgetBarColor}18`, padding: "4px 10px", borderRadius: "999px" }}>
            {isWarning ? "EXCEEDED" : budget.pct > 60 ? "HEALTHY" : "LOW"}
          </span>
        </div>
        <div className="progress-track">
          <motion.div className="progress-fill"
            initial={{ width: "100%" }}
            animate={{ width: `${budget.pct}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
            style={{ background: budgetBarColor }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
          <span className="font-mono-data" style={{ fontSize: "10.5px", color: "var(--color-text-muted)" }}>{formatINR(0)}</span>
          <span className="font-mono-data" style={{ fontSize: "10.5px", color: "var(--color-text-muted)" }}>{formatINR(budget.max)}</span>
        </div>
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px", maxWidth: "1200px" }}>
        {/* Cost curve */}
        <div className="card" style={{ padding: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text-primary)", fontSize: "13.5px" }}>Cost Curve</p>
              <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--color-text-muted)" }}>Per-query cost + cumulative</p>
            </div>
            <span className="font-mono-data" style={{ fontSize: "10.5px", color: "var(--color-text-muted)", background: "rgba(17,24,39,0.4)", padding: "3px 8px", borderRadius: "5px", border: "1px solid rgba(255,255,255,0.12)" }}>{chartData.length} pts</span>
>>>>>>> Stashed changes
          </div>

          {/* Arc gauge */}
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BudgetArc pct={budget.pct} color={budgetBarColor} />
            <div style={{ position: "absolute", textAlign: "center" }}>
              <span className="stat-number" style={{ fontSize: 22, fontWeight: 800, color: budgetBarColor, lineHeight: 1 }}>
                {(100 - budget.pct).toFixed(0)}%
              </span>
              <br />
              <span style={{ fontSize: 10, color: "var(--color-text-muted)", fontFamily: "'Space Grotesk', sans-serif" }}>used</span>
            </div>
          </div>

          <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 10, color: "var(--color-text-muted)", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Remaining</p>
              <p className="font-mono-data" style={{ margin: "3px 0 0", fontSize: 14, fontWeight: 800, color: budgetBarColor }}>{formatINR(budget.remaining, 4)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 10, color: "var(--color-text-muted)", fontFamily: "'Space Grotesk', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em" }}>Cap</p>
              <p className="font-mono-data" style={{ margin: "3px 0 0", fontSize: 14, fontWeight: 800, color: "var(--color-text-secondary)" }}>{formatINR(budget.max)}</p>
            </div>
          </div>
        </motion.div>

        {/* Cost curve */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="card"
          style={{ padding: "22px" }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <p style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--color-text-primary)", fontSize: 14 }}>Cost Curve</p>
              <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--color-text-muted)" }}>Per-query cost + cumulative spend</p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 2, background: "#6366F1", borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>Per-query</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 2, background: "#A78BFA", borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>Cumulative</span>
              </div>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 8, left: -28, bottom: 0 }}>
                <defs>
                  <linearGradient id="gAccent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPurple" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#A78BFA" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#A78BFA" stopOpacity={0} />
                  </linearGradient>
                  <filter id="glow-line">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
<<<<<<< Updated upstream
                <CartesianGrid strokeDasharray="4 4" stroke="rgba(99,102,241,0.06)" vertical={false} />
                <XAxis dataKey="time" stroke="transparent" tick={{ fontSize: 9, fill: "#4E5170" }} axisLine={false} tickLine={false} />
                <YAxis stroke="transparent" tick={{ fontSize: 9, fill: "#4E5170" }} tickFormatter={v => formatINR(Number(v), 3)} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#F0F0FF" }} />
                <Area type="monotone" dataKey="cost"       name="Per-query"  stroke="#6366F1" strokeWidth={2.5} fill="url(#gAccent)" dot={false} filter="url(#glow-line)" />
                <Area type="monotone" dataKey="cumulative" name="Cumulative" stroke="#A78BFA" strokeWidth={2.5} fill="url(#gPurple)" dot={false} />
=======
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis dataKey="time" stroke="var(--color-text-muted)" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-text-muted)" tick={{ fontSize: 9 }} tickFormatter={v => formatINR(Number(v), 3)} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.12)", color: "var(--color-text-primary)", borderRadius: "8px", fontSize: "11px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)" }} itemStyle={{ color: "var(--color-text-primary)" }} />
                <Area type="monotone" dataKey="cost" name="Per-query" stroke="#0D9488" strokeWidth={3} fill="url(#gTeal)" dot={false} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
                <Area type="monotone" dataKey="cumulative" name="Cumulative" stroke="#6366F1" strokeWidth={3} fill="url(#gIndigo)" style={{ filter: "url(#shadow)" }} dot={false} isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />
>>>>>>> Stashed changes
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

<<<<<<< Updated upstream
      {/* Category mix + Quick actions row */}
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 16 }}>
        {/* Category donut */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
          style={{ padding: "22px" }}
        >
          <p style={{ margin: "0 0 2px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--color-text-primary)", fontSize: 14 }}>Category Mix</p>
          <p style={{ margin: "0 0 16px", fontSize: 11.5, color: "var(--color-text-muted)" }}>Query distribution by type</p>
=======
        {/* Category mix */}
        <div className="card" style={{ padding: "20px" }}>
          <p style={{ margin: "0 0 4px", fontWeight: 600, color: "var(--color-text-primary)", fontSize: "13.5px" }}>Category Mix</p>
          <p style={{ margin: "0 0 14px", fontSize: "11.5px", color: "var(--color-text-muted)" }}>Query distribution by type</p>
>>>>>>> Stashed changes
          {categoryData.length > 0 ? (
            <>
              <div style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%" cy="50%"
                      innerRadius={42} outerRadius={62}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={2}
                      stroke="rgba(7,8,12,0.8)"
                      isAnimationActive
                      animationDuration={1000}
                    >
                      {categoryData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} style={{ filter: `drop-shadow(0 0 4px ${entry.color}60)` }} />
                      ))}
                    </Pie>
<<<<<<< Updated upstream
                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: "#F0F0FF" }} />
=======
                    <Tooltip contentStyle={{ background: "#1F2937", border: "1px solid rgba(255,255,255,0.12)", color: "var(--color-text-primary)", borderRadius: "8px", fontSize: "11px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)" }} itemStyle={{ color: "var(--color-text-primary)" }} />
>>>>>>> Stashed changes
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                {categoryData.map(d => (
                  <div key={d.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
<<<<<<< Updated upstream
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, display: "inline-block", boxShadow: `0 0 6px ${d.color}80` }} />
                      <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{d.name}</span>
                    </div>
                    <span className="font-mono-data" style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 800 }}>{d.value}</span>
=======
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ width: 8, height: 8, borderRadius: "50%", background: d.color, display: "inline-block", flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>{d.name}</span>
                    </div>
                    <span className="font-mono-data" style={{ fontSize: "12px", color: "var(--color-text-primary)", fontWeight: 600 }}>{d.value}</span>
>>>>>>> Stashed changes
                  </div>
                ))}
              </div>
            </>
          ) : (
<<<<<<< Updated upstream
            <div className="empty-state" style={{ padding: 24 }}>
              <div className="empty-state-icon"><Activity size={22} style={{ color: "var(--color-accent-light)" }} /></div>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--color-text-muted)" }}>No queries yet</p>
=======
            <div className="empty-state" style={{ padding: "20px" }}>
              <p style={{ margin: 0, fontSize: "12.5px", color: "var(--color-text-muted)" }}>No queries yet</p>
>>>>>>> Stashed changes
            </div>
          )}
        </motion.div>

        {/* Quick action cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.44 }}
          style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}
        >
          {[
            { label: "Live Query",  desc: "Submit queries through Obsidian governance", href: "/dashboard/query",       color: "#6366F1", gradient: "from #4F46E5 to #6366F1" },
            { label: "Analytics",   desc: "Deep cost analysis & model distribution",    href: "/dashboard/analytics",   color: "#F472B6", gradient: "" },
            { label: "Trust Score", desc: "0-100 per-agent trust calculation",           href: "/dashboard/trust-score", color: "#34D399", gradient: "" },
            { label: "Insights",    desc: "Hindsight recall & routing suggestions",      href: "/dashboard/insights",    color: "#FBBF24", gradient: "" },
          ].map((item, i) => (
            <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.46 + i * 0.08 }}
                whileHover={{ y: -3, scale: 1.01 }}
                className="card"
                style={{
                  padding: "20px 22px",
                  borderLeft: `2px solid ${item.color}`,
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--color-text-primary)", fontSize: 13.5 }}>{item.label}</p>
                  <ArrowRight size={14} style={{ color: item.color, opacity: 0.7 }} />
                </div>
                <p style={{ margin: 0, fontSize: 11.5, color: "var(--color-text-muted)", lineHeight: 1.5 }}>{item.desc}</p>
                <div style={{ marginTop: "auto", width: "100%", height: 2, background: "rgba(255,255,255,0.04)", borderRadius: 1, overflow: "hidden" }}>
                  <div style={{ width: "60%", height: "100%", background: `linear-gradient(90deg, ${item.color}40, ${item.color})`, borderRadius: 1 }} />
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>

      {/* Recent events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="card"
        style={{ overflow: "hidden" }}
      >
        <div style={{
          padding: "18px 22px",
          borderBottom: "1px solid rgba(99,102,241,0.07)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
          background: "rgba(99,102,241,0.02)",
        }}>
          <div>
<<<<<<< Updated upstream
            <p style={{ margin: 0, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: "var(--color-text-primary)", fontSize: 14 }}>Recent Audit Events</p>
            <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--color-text-muted)" }}>Latest 8 governance decisions</p>
=======
            <p style={{ margin: 0, fontWeight: 600, color: "var(--color-text-primary)", fontSize: "13.5px" }}>Recent Events</p>
            <p style={{ margin: "2px 0 0", fontSize: "11.5px", color: "var(--color-text-muted)" }}>Latest 8 audit decisions</p>
>>>>>>> Stashed changes
          </div>
          <Link href="/dashboard/events" className="btn btn-ghost" style={{ fontSize: 11.5, gap: 5 }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Category</th>
                <th>Model</th>
                <th className="right">Cost</th>
                <th className="right">Latency</th>
                <th className="right">Decision</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence initial={false}>
                {events.slice(0, 8).map((r, i) => (
                  <motion.tr
                    key={`${r.timestamp_ms}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.04 }}
                    style={{
                      borderLeft: `2px solid ${
                        r.audit_event.action === "stop" ? "rgba(239,68,68,0.5)" :
                        r.audit_event.action === "allow" ? "rgba(16,185,129,0.3)" :
                        "rgba(99,102,241,0.3)"
                      }`,
                    }}
                  >
<<<<<<< Updated upstream
                    <td className="font-mono-data" style={{ color: "var(--color-text-muted)", fontSize: 11.5 }}>{formatTime(r.timestamp_ms)}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: CATEGORY_COLORS[r.category] ?? "var(--color-text-muted)" }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", background: CATEGORY_COLORS[r.category] ?? "var(--color-text-muted)", display: "inline-block", boxShadow: `0 0 5px ${CATEGORY_COLORS[r.category] ?? "transparent"}` }} />
                        {CATEGORY_LABELS[r.category] ?? r.category}
                      </span>
                    </td>
                    <td className="font-mono-data" style={{ fontSize: 11.5, color: "var(--color-text-secondary)" }}>{r.audit_event.model ?? "—"}</td>
                    <td className="font-mono-data right" style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-primary)" }}>{formatINR(r.audit_event.cost_total ?? 0, 5)}</td>
                    <td className="font-mono-data right" style={{ color: "var(--color-text-muted)", fontSize: 11.5 }}>{formatLatency(r.audit_event.latency_used_ms ?? 0)}</td>
=======
                    <td className="font-mono-data" style={{ color: "var(--color-text-muted)", fontSize: "11.5px" }}>{formatTime(r.timestamp_ms)}</td>
                    <td>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12.5px", fontWeight: 500, color: CATEGORY_COLORS[r.category] ?? "var(--color-text-muted)" }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: CATEGORY_COLORS[r.category] ?? "var(--color-text-muted)", display: "inline-block" }} />
                        {CATEGORY_LABELS[r.category] ?? r.category}
                      </span>
                    </td>
                    <td className="font-mono-data" style={{ fontSize: "11.5px", color: "var(--color-text-secondary)" }}>{r.audit_event.model ?? "—"}</td>
                    <td className="font-mono-data right" style={{ fontSize: "12px", fontWeight: 600 }}>{formatINR(r.audit_event.cost_total ?? 0, 5)}</td>
                    <td className="font-mono-data right" style={{ color: "var(--color-text-muted)", fontSize: "11.5px" }}>{formatLatency(r.audit_event.latency_used_ms ?? 0)}</td>
>>>>>>> Stashed changes
                    <td className="right"><ActionBadge action={r.audit_event.action} /></td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {events.length === 0 && (
                <tr><td colSpan={6}>
                  <div className="empty-state">
<<<<<<< Updated upstream
                    <div className="empty-state-icon"><Activity size={22} style={{ color: "var(--color-accent-light)" }} /></div>
                    <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", fontWeight: 600 }}>No events yet</p>
                    <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-muted)" }}>
                      <Link href="/dashboard/query" style={{ color: "var(--color-accent-light)", fontWeight: 700 }}>Submit a query</Link> to start the audit trail.
                    </p>
=======
                    <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-muted)" }}>No events — <Link href="/dashboard/query" style={{ color: "#14B8A6", fontWeight: 600 }}>submit a query</Link> to begin.</p>
>>>>>>> Stashed changes
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
<<<<<<< Updated upstream
      </motion.div>
=======
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
        {[
          { label: "Live Query", desc: "Submit queries to Groq", href: "/dashboard/query", color: "#0D9488" },
          { label: "Analytics", desc: "Deep cost analysis", href: "/dashboard/analytics", color: "#6366F1" },
          { label: "Session", desc: "Manage budget & reset", href: "/dashboard/session", color: "#D97706" },
          { label: "Health", desc: "Backend status check", href: "/dashboard/health", color: "#16A34A" },
        ].map(item => (
          <Link key={item.label} href={item.href} style={{ textDecoration: "none" }}>
            <div className="card card-hover" style={{ padding: "14px 16px", borderLeft: `3px solid ${item.color}`, cursor: "pointer" }}>
              <p style={{ margin: "0 0 3px", fontWeight: 600, color: "var(--color-text-primary)", fontSize: "13px" }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: "11.5px", color: "var(--color-text-muted)" }}>{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
>>>>>>> Stashed changes
    </div>
  );
}
