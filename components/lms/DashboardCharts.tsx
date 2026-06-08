"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const weekly = [
  { day: "Mon", a: 40, b: 110 },
  { day: "Tue", a: 55, b: 95 },
  { day: "Wed", a: 35, b: 120 },
  { day: "Thu", a: 50, b: 88 },
  { day: "Fri", a: 45, b: 130 },
  { day: "Sat", a: 30, b: 70 },
  { day: "Sun", a: 25, b: 60 },
];

const engagement = [
  { w: "W1", v: 42 },
  { w: "W2", v: 48 },
  { w: "W3", v: 55 },
  { w: "W4", v: 62 },
  { w: "W5", v: 74 },
  { w: "W6", v: 82 },
];

function useChartPalette() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Default to light palette before mount to avoid hydration mismatch.
  const isDark = mounted && resolvedTheme === "dark";

  return {
    grid: isDark ? "#3f3f46" : "#e4e4e7",
    tick: isDark ? "#a1a1aa" : "#71717a",
    tooltipBg: isDark ? "#18181b" : "#ffffff",
    tooltipBorder: isDark ? "#3f3f46" : "#e4e4e7",
    tooltipText: isDark ? "#fafafa" : "#18181b",
    bar1: isDark ? "#60a5fa" : "#3b82f6",
    bar2: isDark ? "#818cf8" : "#6366f1",
    line: isDark ? "#60a5fa" : "#3b82f6",
  };
}

export function DashboardCharts() {
  const c = useChartPalette();

  const tooltipStyle = {
    borderRadius: 12,
    border: `1px solid ${c.tooltipBorder}`,
    backgroundColor: c.tooltipBg,
    color: c.tooltipText,
    fontSize: 12,
  };
  const tooltipItemStyle = { color: c.tooltipText };
  const tooltipLabelStyle = { color: c.tooltipText, fontWeight: 600 };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:col-span-2">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Weekly activity</h3>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">Logins vs submissions (mock)</p>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly} barGap={4} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: c.tick, fontSize: 11 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: c.tick, fontSize: 11 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={tooltipItemStyle}
                labelStyle={tooltipLabelStyle}
                cursor={{ fill: c.grid, opacity: 0.3 }}
              />
              <Bar dataKey="a" fill={c.bar1} radius={[6, 6, 0, 0]} />
              <Bar dataKey="b" fill={c.bar2} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Engagement trend</h3>
        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">% over weeks (mock)</p>
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagement} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
              <XAxis dataKey="w" tickLine={false} axisLine={false} tick={{ fill: c.tick, fontSize: 11 }} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: c.tick, fontSize: 11 }} />
              <Tooltip
                contentStyle={tooltipStyle}
                itemStyle={tooltipItemStyle}
                labelStyle={tooltipLabelStyle}
                cursor={{ stroke: c.grid, strokeWidth: 1 }}
              />
              <Line type="monotone" dataKey="v" stroke={c.line} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
