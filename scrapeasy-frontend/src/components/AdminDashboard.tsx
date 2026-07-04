"use client";

import React, { useMemo, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, ResponsiveContainer,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
} from "recharts";
import {
  Activity, Award, BarChart3, DollarSign, LogOut,
  Package, RefreshCw, ShieldCheck, Sliders,
  Trash2, TrendingUp, Truck, Users, Wallet, Bell,
} from "lucide-react";
import {
  useCustomers, useDashboard, useRiders,
  useScrapRates, useUpdateScrapRates,
} from "../hooks/useAdminData";
import { publicApi } from "../lib/api";
import toast from "react-hot-toast";

// ─── PALETTE ────────────────────────────────────────────────
const C = {
  green: "#22c55e",
  greenDark: "#006e2f",
  greenLight: "#dcfce7",
  slate950: "#020617",
  slate900: "#0f172a",
  slate800: "#1e293b",
  slate700: "#334155",
  slate600: "#475569",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  slate50: "#f8fafc",
  white: "#ffffff",
  blue: "#0ea5e9",
  amber: "#f59e0b",
  red: "#ef4444",
  purple: "#8b5cf6",
};

const PIE_COLORS = [C.green, C.blue, C.amber, C.red, C.purple, "#14b8a6"];
type Tab = "overview" | "rates" | "customers" | "riders";

// ─── HELPERS ────────────────────────────────────────────────
function fmt(v: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency", currency: "PKR", maximumFractionDigits: 0,
  }).format(v);
}

// ─── STAT CARD ──────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, accent, delay,
}: {
  label: string; value: string; sub?: string;
  icon: React.ComponentType<{ size?: number; className?: string; color?: string }>;
  accent: string; delay: number;
}) {
  return (
    <div
      className="rounded-2xl p-5 border flex flex-col gap-3"
      style={{
        background: C.white,
        borderColor: C.slate200,
        boxShadow: "0 1px 12px rgba(0,0,0,0.06)",
        animation: `fadeUp 0.4s ${delay}s both`,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.slate400 }}>
          {label}
        </span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: accent + "20" }}>
          <Icon size={18} color={accent} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black" style={{ color: C.slate900, letterSpacing: "-0.03em" }}>
          {value}
        </p>
        {sub && <p className="text-xs mt-1" style={{ color: C.slate400 }}>{sub}</p>}
      </div>
    </div>
  );
}

// ─── CHART CARD ─────────────────────────────────────────────
function ChartCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-5"
      style={{ background: C.white, borderColor: C.slate200, boxShadow: "0 1px 12px rgba(0,0,0,0.06)" }}>
      <div className="mb-4">
        <p className="text-sm font-bold" style={{ color: C.slate900 }}>{title}</p>
        <p className="text-xs" style={{ color: C.slate400 }}>{sub}</p>
      </div>
      <div style={{ height: 220 }}>{children}</div>
    </div>
  );
}

// ─── LOGIN ──────────────────────────────────────────────────
function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await publicApi.signInWithPassword(email.trim(), password.trim());
      if (!res?.access_token) throw new Error("Access token missing");
      localStorage.setItem("access_token", res.access_token);
      toast.success("Welcome back!");
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #006e2f22 100%)" }}>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* BG accent blob */}
      <div style={{
        position: "fixed", top: "10%", left: "50%", transform: "translateX(-50%)",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, #22c55e18 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="w-full max-w-sm rounded-3xl border p-8"
        style={{
          background: "rgba(15,23,42,0.9)", borderColor: "#1e293b",
          backdropFilter: "blur(20px)", animation: "fadeUp 0.5s both",
        }}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{ background: C.green + "20", border: "1px solid " + C.green + "40" }}>
            <ShieldCheck size={22} style={{ color: C.green }} />
          </div>
          <div>
            <p className="font-black text-lg" style={{ color: C.white }}>ScrapEasy</p>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: C.green }}>
              Admin Panel
            </p>
          </div>
        </div>

        <p className="text-sm mb-6" style={{ color: C.slate400 }}>Sign in to continue to your dashboard</p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-xl p-3 text-xs text-center"
              style={{ background: "#ef444415", border: "1px solid #ef444430", color: "#fca5a5" }}>
              {error}
            </div>
          )}

          <div className="space-y-3">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@scrapeasy.com" required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "#1e293b", border: "1px solid #334155",
                color: C.white, "--tw-ring-color": C.green,
              } as React.CSSProperties}
              onFocus={e => e.target.style.borderColor = C.green}
              onBlur={e => e.target.style.borderColor = "#334155"}
            />
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              className="w-full px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: "#1e293b", border: "1px solid #334155", color: C.white }}
              onFocus={e => e.target.style.borderColor = C.green}
              onBlur={e => e.target.style.borderColor = "#334155"}
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3.5 rounded-xl font-bold text-sm transition-all"
            style={{
              background: loading ? C.slate700 : C.green,
              color: loading ? C.slate400 : "#020617",
              cursor: loading ? "not-allowed" : "pointer",
            }}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── SIDEBAR ────────────────────────────────────────────────
const NAV: { id: Tab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "rates", label: "Scrap Rates", icon: Sliders },
  { id: "customers", label: "Customers", icon: Users },
  { id: "riders", label: "Riders", icon: Truck },
];

// ─── MAIN DASHBOARD ─────────────────────────────────────────
export default function AdminDashboard() {
  const [authed, setAuthed] = useState(
    () => typeof window !== "undefined" && !!localStorage.getItem("access_token")
  );
  const [tab, setTab] = useState<Tab>("overview");
  const [draftRates, setDraftRates] = useState<Record<string, string>>({});

  const dashboard = useDashboard();
  const customers = useCustomers();
  const riders = useRiders();
  const scrapRates = useScrapRates();
  const updateRates = useUpdateScrapRates();

  const stats = dashboard.data?.stats;

  const mergedRates = useMemo(() => {
    return (scrapRates.data ?? []).map(r => ({
      ...r, draft: draftRates[r.id] ?? String(r.rate_per_kg),
    }));
  }, [scrapRates.data, draftRates]);

  const handleSaveRates = async () => {
    const changed = mergedRates
      .filter(r => Number(r.draft) !== r.rate_per_kg)
      .map(r => ({ id: r.id, rate_per_kg: Number(r.draft) }));
    if (!changed.length) { toast("No changes to save", { icon: "ℹ️" }); return; }
    try {
      await updateRates.mutateAsync(changed);
      setDraftRates({});
      toast.success(`Updated ${changed.length} rate(s)`);
    } catch { toast.error("Failed to update rates"); }
  };

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen flex" style={{ background: C.slate50, fontFamily: "Inter, sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0"
        style={{
          background: C.slate900,
          borderRight: "1px solid " + C.slate800,
          position: "sticky", top: 0, height: "100vh",
        }}>
        {/* Logo */}
        <div className="p-6 flex items-center gap-3" style={{ borderBottom: "1px solid " + C.slate800 }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: C.green + "20" }}>
            <ShieldCheck size={18} style={{ color: C.green }} />
          </div>
          <div>
            <p className="text-sm font-black" style={{ color: C.white }}>ScrapEasy</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: C.green }}>
              Admin
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: active ? C.green : "transparent",
                  color: active ? "#020617" : C.slate400,
                }}>
                <Icon size={16} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 space-y-2" style={{ borderTop: "1px solid " + C.slate800 }}>
          <button onClick={() => dashboard.refetch()}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all"
            style={{ background: C.slate800, color: C.slate400 }}>
            <RefreshCw size={13} className={dashboard.isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => { localStorage.removeItem("access_token"); setAuthed(false); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold"
            style={{ background: "#ef444415", color: "#fca5a5" }}>
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
          style={{
            background: "rgba(248,250,252,0.9)", backdropFilter: "blur(12px)",
            borderBottom: "1px solid " + C.slate200,
          }}>
          <div>
            <h1 className="text-lg font-black" style={{ color: C.slate900 }}>
              {NAV.find(n => n.id === tab)?.label ?? "Dashboard"}
            </h1>
            <p className="text-xs" style={{ color: C.slate400 }}>ScrapEasy Operations Center</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Mobile tabs */}
            <div className="flex md:hidden gap-1">
              {NAV.map(({ id, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)}
                  className="p-2 rounded-lg"
                  style={{ background: tab === id ? C.green : C.slate200, color: tab === id ? "#020617" : C.slate600 }}>
                  <Icon size={14} />
                </button>
              ))}
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: C.green + "20" }}>
              <Bell size={14} style={{ color: C.green }} />
            </div>
          </div>
        </header>

        <div className="p-6 max-w-7xl mx-auto space-y-6">

          {/* ══ OVERVIEW ══ */}
          {tab === "overview" && (
            <div className="space-y-6">
              {/* Stat cards */}
              {dashboard.isLoading ? (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  {[0,1,2,3].map(i => (
                    <div key={i} className="rounded-2xl h-32 animate-pulse" style={{ background: C.slate200 }} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  <StatCard label="Total Pickups" value={String(stats?.total_pickups ?? 0)}
                    sub="All time" icon={Package} accent={C.green} delay={0} />
                  <StatCard label="Active Sellers" value={String(stats?.active_sellers ?? 0)}
                    sub="Registered users" icon={Users} accent={C.blue} delay={0.05} />
                  <StatCard label="Carbon Saved" value={`${(stats?.carbon_saved_kg ?? 0).toLocaleString()} kg`}
                    sub="CO₂ equivalent" icon={Award} accent={C.amber} delay={0.1} />
                  <StatCard label="Total Revenue" value={fmt(stats?.total_revenue ?? 0)}
                    sub="PKR earned" icon={Wallet} accent={C.purple} delay={0.15} />
                </div>
              )}

              {/* Charts row 1 */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <ChartCard title="Revenue" sub="Last 6 months (PKR)">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dashboard.data?.revenue_chart ?? []} barSize={32}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.slate200} vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: C.slate400 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: C.slate400 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ background: C.slate900, border: "none", borderRadius: 12, color: C.white, fontSize: 12 }}
                        formatter={(v: number) => fmt(v)}
                      />
                      <Bar dataKey="value" fill={C.green} radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Pickups" sub="Last 7 days">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dashboard.data?.pickups_chart ?? []}>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.slate200} vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: C.slate400 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: C.slate400 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ background: C.slate900, border: "none", borderRadius: 12, color: C.white, fontSize: 12 }} />
                      <Line type="monotone" dataKey="value" stroke={C.blue} strokeWidth={3}
                        dot={{ r: 4, fill: C.blue, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: C.blue }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Charts row 2 */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <ChartCard title="Scrap Distribution" sub="By weight collected (kg)">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dashboard.data?.scrap_distribution ?? []}
                        dataKey="value" nameKey="label"
                        cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                        paddingAngle={3}>
                        {(dashboard.data?.scrap_distribution ?? []).map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: C.slate900, border: "none", borderRadius: 12, color: C.white, fontSize: 12 }} />
                      <Legend iconType="circle" iconSize={8}
                        wrapperStyle={{ fontSize: 11, color: C.slate600 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard title="Carbon Impact" sub="CO₂ saved per month (kg)">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dashboard.data?.carbon_chart ?? []}>
                      <defs>
                        <linearGradient id="carbonGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={C.green} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={C.green} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={C.slate200} vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: C.slate400 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: C.slate400 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: C.slate900, border: "none", borderRadius: 12, color: C.white, fontSize: 12 }} />
                      <Area type="monotone" dataKey="value" stroke={C.green}
                        fill="url(#carbonGrad)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </div>
          )}

          {/* ══ SCRAP RATES ══ */}
          {tab === "rates" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2" style={{ color: C.slate900 }}>
                    <DollarSign size={18} style={{ color: C.green }} />
                    Scrap Rate Control
                  </h2>
                  <p className="text-xs mt-0.5" style={{ color: C.slate400 }}>
                    Update market rates — changes apply immediately
                  </p>
                </div>
                <button onClick={handleSaveRates} disabled={updateRates.isPending}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{
                    background: updateRates.isPending ? C.slate200 : C.green,
                    color: updateRates.isPending ? C.slate400 : "#020617",
                  }}>
                  {updateRates.isPending ? "Saving…" : "Save Changes"}
                </button>
              </div>

              <div className="rounded-2xl border overflow-hidden"
                style={{ background: C.white, borderColor: C.slate200 }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: C.slate50, borderBottom: "1px solid " + C.slate200 }}>
                      {["Category", "Rate / kg (PKR)", "Unit", "Status"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                          style={{ color: C.slate400 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {scrapRates.isLoading && (
                      <tr><td colSpan={4} className="px-5 py-10 text-center text-sm" style={{ color: C.slate400 }}>
                        Loading rates…
                      </td></tr>
                    )}
                    {mergedRates.map((rate, i) => (
                      <tr key={rate.id} style={{ borderTop: i > 0 ? "1px solid " + C.slate100 : "none" }}>
                        <td className="px-5 py-4 font-semibold" style={{ color: C.slate900 }}>{rate.name}</td>
                        <td className="px-5 py-4">
                          <input type="number" step="0.01" min="0" value={rate.draft}
                            onChange={e => setDraftRates(p => ({ ...p, [rate.id]: e.target.value }))}
                            className="w-28 px-3 py-2 rounded-lg text-sm outline-none"
                            style={{ border: "1px solid " + C.slate200, color: C.slate900 }}
                            onFocus={e => e.target.style.borderColor = C.green}
                            onBlur={e => e.target.style.borderColor = C.slate200}
                          />
                        </td>
                        <td className="px-5 py-4 text-sm" style={{ color: C.slate400 }}>{rate.unit}</td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{
                              background: rate.is_active ? C.green + "15" : C.slate100,
                              color: rate.is_active ? C.greenDark : C.slate400,
                            }}>
                            {rate.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!scrapRates.isLoading && mergedRates.length === 0 && (
                      <tr><td colSpan={4} className="px-5 py-10 text-center text-sm" style={{ color: C.slate400 }}>
                        No categories found — add them in Supabase
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ CUSTOMERS ══ */}
          {tab === "customers" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2" style={{ color: C.slate900 }}>
                  <Users size={18} style={{ color: C.green }} /> Customers
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.slate400 }}>
                  {customers.data?.length ?? 0} registered customers
                </p>
              </div>

              <div className="rounded-2xl border overflow-hidden"
                style={{ background: C.white, borderColor: C.slate200 }}>
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ background: C.slate50, borderBottom: "1px solid " + C.slate200 }}>
                      {["Name", "Email", "Phone", "Joined", "Status"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                          style={{ color: C.slate400 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customers.isLoading && (
                      <tr><td colSpan={5} className="px-5 py-10 text-center" style={{ color: C.slate400 }}>Loading…</td></tr>
                    )}
                    {(customers.data ?? []).map((c, i) => (
                      <tr key={c.id} style={{ borderTop: i > 0 ? "1px solid " + C.slate100 : "none" }}>
                        <td className="px-5 py-4 font-semibold" style={{ color: C.slate900 }}>
                          {c.full_name ?? "—"}
                        </td>
                        <td className="px-5 py-4" style={{ color: C.slate600 }}>{c.email ?? "—"}</td>
                        <td className="px-5 py-4" style={{ color: C.slate600 }}>{c.phone ?? "—"}</td>
                        <td className="px-5 py-4 text-xs" style={{ color: C.slate400 }}>
                          {c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{
                              background: c.is_active ? C.green + "15" : C.slate100,
                              color: c.is_active ? C.greenDark : C.slate400,
                            }}>
                            {c.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!customers.isLoading && !customers.data?.length && (
                      <tr><td colSpan={5} className="px-5 py-10 text-center text-sm" style={{ color: C.slate400 }}>
                        No customers yet
                      </td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ RIDERS ══ */}
          {tab === "riders" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2" style={{ color: C.slate900 }}>
                  <Truck size={18} style={{ color: C.green }} /> Riders
                </h2>
                <p className="text-xs mt-0.5" style={{ color: C.slate400 }}>
                  {riders.data?.length ?? 0} active riders
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {riders.isLoading && [0,1,2].map(i => (
                  <div key={i} className="rounded-2xl h-32 animate-pulse" style={{ background: C.slate200 }} />
                ))}
                {(riders.data ?? []).map(r => (
                  <div key={r.id} className="rounded-2xl border p-5"
                    style={{ background: C.white, borderColor: C.slate200 }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm"
                        style={{ background: C.green + "20", color: C.greenDark }}>
                        {(r.full_name ?? "R")[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: C.slate900 }}>{r.full_name ?? "—"}</p>
                        <p className="text-xs" style={{ color: C.slate400 }}>{r.phone ?? "—"}</p>
                      </div>
                    </div>
                    <div className="text-xs rounded-lg px-3 py-2" style={{ background: C.slate50, color: C.slate600 }}>
                      🚛 {r.vehicle_info ?? "Vehicle info not set"}
                    </div>
                  </div>
                ))}
                {!riders.isLoading && !riders.data?.length && (
                  <div className="col-span-3 rounded-2xl border p-10 text-center text-sm"
                    style={{ background: C.white, borderColor: C.slate200, color: C.slate400 }}>
                    No riders registered yet
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}