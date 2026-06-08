"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import type { RowData } from "../app/data";

type ChartKind = "impact-by-service" | "increase-distribution" | "review-status" | "partner-portfolio" | "renewal-risk" | "peer-increase-comparison" | "peer-increase-scenario";

interface ChartConfig {
  type: ChartKind;
  data: Record<string, unknown>[];
  height?: number;
}

interface MetricCard {
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
}

interface Suggestion {
  label: string;
  inputText: string;
  flowKey: string;
  disabled?: boolean;
}

interface AnalyticsMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  title?: string;
  charts?: ChartConfig[];
  metrics?: MetricCard[];
  suggestions?: Suggestion[];
}

interface FlowEntry {
  thinkingDelay: number;
  thinkingMessage?: string;
  response: Omit<AnalyticsMsg, "id" | "role">;
}

// ─── Data aggregation helpers ────────────────────────────────

function groupSum(data: RowData[], keyFn: (r: RowData) => string, valFn: (r: RowData) => number) {
  const map = new Map<string, number>();
  for (const row of data) {
    const k = keyFn(row);
    map.set(k, (map.get(k) || 0) + valFn(row));
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function groupCount(data: RowData[], keyFn: (r: RowData) => string) {
  const map = new Map<string, number>();
  for (const row of data) {
    const k = keyFn(row);
    map.set(k, (map.get(k) || 0) + 1);
  }
  return [...map.entries()];
}

function fmtK(n: number) { return n >= 1000000 ? `$${(n / 1000000).toFixed(1)}M` : `$${(n / 1000).toFixed(0)}K`; }
function fmtFull(n: number) { return "$" + Math.round(n).toLocaleString("en-US"); }

function buildChartData(data: RowData[]) {
  const impactByService = groupSum(data, r => r.serviceLine, r => r.revisedImpact)
    .map(([serviceLine, impact]) => ({ serviceLine, impact: Math.round(impact) }));

  const buckets = [
    { label: "0–3%", min: 0, max: 3 },
    { label: "3–5%", min: 3, max: 5 },
    { label: "5–8%", min: 5, max: 8 },
    { label: "8–10%", min: 8, max: 10 },
    { label: "10%+", min: 10, max: 100 },
  ];
  const increaseDistribution = buckets.map(b => ({
    range: b.label,
    count: data.filter(r => r.revisedPriceIncreasePct >= b.min && r.revisedPriceIncreasePct < b.max).length,
  }));

  const statusOrder = ["Needs Review", "Complete", "Revised"];
  const statusCounts = groupCount(data, r => r.status);
  const reviewStatus = statusOrder.map(s => ({
    status: s,
    count: statusCounts.find(([k]) => k === s)?.[1] || 0,
  }));

  const partnerPortfolio = groupSum(data, r => r.partnerName, r => r.revisedTotalFee)
    .slice(0, 8)
    .map(([partner, totalFee]) => ({ partner, totalFee: Math.round(totalFee) }));

  const renewalOrder = ["Active", "Up for Renewal", "Renewed", "At Risk"];
  const renewalGroups = groupSum(data, r => r.clientRenewalStatus, r => r.currentFixedFee);
  const renewalCounts = groupCount(data, r => r.clientRenewalStatus);
  const renewalRisk = renewalOrder.map(s => ({
    status: s,
    totalFee: Math.round(renewalGroups.find(([k]) => k === s)?.[1] || 0),
    count: renewalCounts.find(([k]) => k === s)?.[1] || 0,
  }));

  return { impactByService, increaseDistribution, reviewStatus, partnerPortfolio, renewalRisk };
}

function buildMetrics(data: RowData[]) {
  const totalImpact = data.reduce((s, r) => s + r.revisedImpact, 0);
  const avgIncrease = data.reduce((s, r) => s + r.revisedPriceIncreasePct, 0) / data.length;
  const needsReview = data.filter(r => r.status === "Needs Review").length;
  const atRisk = data.filter(r => r.clientRenewalStatus === "At Risk").length;
  const totalRevised = data.reduce((s, r) => s + r.revisedTotalFee, 0);
  const approved = data.filter(r => r.status === "Complete" || r.status === "Revised").length;
  const topPartnerEntries = groupSum(data, r => r.partnerName, r => r.revisedTotalFee);
  const topPartner = topPartnerEntries[0];
  const acceptedComms = data.filter(r => r.clientCommStatus === "Accepted").length;

  return { totalImpact, avgIncrease, needsReview, atRisk, totalRevised, approved, topPartner, acceptedComms };
}

// ─── Chart Components ────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  "Needs Review": "#e65100",
  "In Progress": "#1565c0",
  "Approved": "#2e7d32",
  "Submitted": "#4527a0",
};

const RENEWAL_COLORS: Record<string, string> = {
  "Active": "#2e7d32",
  "Up for Renewal": "#e65100",
  "Renewed": "#1565c0",
  "At Risk": "#c62828",
};

function ImpactByServiceChart({ data, height = 200 }: { data: Record<string, unknown>[]; height?: number }) {
  return (
    <Box sx={{ width: "100%", mb: 1 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", mb: 0.75 }}>
        Total Revised Impact ($) by Service Line
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => fmtK(Number(v))} fontSize={10} />
          <YAxis type="category" dataKey="serviceLine" width={110} fontSize={9} tick={{ fill: "#374151" }} />
          <Tooltip formatter={(value) => fmtFull(Number(value))} contentStyle={{ fontSize: 11 }} />
          <Bar dataKey="impact" fill="#D97C14" radius={[0, 3, 3, 0]} barSize={14}>
            {data.map((entry, i) => (
              <Cell key={i} fill={Number(entry.impact) >= 0 ? "#2e7d32" : "#c62828"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

function IncreaseDistributionChart({ data, height = 200 }: { data: Record<string, unknown>[]; height?: number }) {
  return (
    <Box sx={{ width: "100%", mb: 1 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", mb: 0.75 }}>
        Engagements by Price Increase Range
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="range" fontSize={10} tick={{ fill: "#374151" }} />
          <YAxis fontSize={10} width={30} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Bar dataKey="count" name="# Engagements" fill="#00446a" radius={[3, 3, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

function ReviewStatusChart({ data, height = 200 }: { data: Record<string, unknown>[]; height?: number }) {
  return (
    <Box sx={{ width: "100%", mb: 1 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", mb: 0.75 }}>
        Engagements by Review Status
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="status" fontSize={10} tick={{ fill: "#374151" }} />
          <YAxis fontSize={10} width={30} />
          <Tooltip contentStyle={{ fontSize: 11 }} />
          <Bar dataKey="count" name="# Engagements" radius={[3, 3, 0, 0]} barSize={32}>
            {data.map((entry, i) => (
              <Cell key={i} fill={STATUS_COLORS[String(entry.status)] || "#999"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

function PartnerPortfolioChart({ data, height = 200 }: { data: Record<string, unknown>[]; height?: number }) {
  return (
    <Box sx={{ width: "100%", mb: 1 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", mb: 0.75 }}>
        Revised Total Fees by Partner
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => fmtK(Number(v))} fontSize={10} />
          <YAxis type="category" dataKey="partner" width={90} fontSize={9} tick={{ fill: "#374151" }} />
          <Tooltip formatter={(value) => fmtFull(Number(value))} contentStyle={{ fontSize: 11 }} />
          <Bar dataKey="totalFee" fill="#00446a" radius={[0, 3, 3, 0]} barSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}

function RenewalRiskChart({ data, height = 200 }: { data: Record<string, unknown>[]; height?: number }) {
  return (
    <Box sx={{ width: "100%", mb: 1 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", mb: 0.75 }}>
        Current Fee Exposure by Renewal Status
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={data} margin={{ top: 5, right: 15, left: 5, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="status" fontSize={9} tick={{ fill: "#374151" }} />
          <YAxis yAxisId="left" tickFormatter={(v) => fmtK(Number(v))} fontSize={10} width={50} />
          <YAxis yAxisId="right" orientation="right" fontSize={10} width={30} />
          <Tooltip contentStyle={{ fontSize: 11 }} formatter={(value, name) => name === "totalFee" ? fmtFull(Number(value)) : value} />
          <Legend wrapperStyle={{ fontSize: 10 }} />
          <Bar yAxisId="left" dataKey="totalFee" name="Total Fee $" radius={[3, 3, 0, 0]} barSize={32}>
            {data.map((entry, i) => (
              <Cell key={i} fill={RENEWAL_COLORS[String(entry.status)] || "#999"} />
            ))}
          </Bar>
          <Line yAxisId="right" type="monotone" dataKey="count" name="# Clients" stroke="#00446a" strokeWidth={2} dot={{ r: 4, fill: "#00446a" }} />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
}

function PeerIncreaseChart({ data, height = 260 }: { data: Record<string, unknown>[]; height?: number }) {
  const peerAvg = data.filter(d => !d.isTarget).reduce((s, d) => s + (d.increase as number), 0) / data.filter(d => !d.isTarget).length;
  return (
    <Box sx={{ width: "100%", mb: 1 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", mb: 0.5 }}>
        Recommended Price Increase % — Audit & Assurance Peers ($200K–$400K)
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 15, right: 50, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.4} />
          <XAxis type="number" domain={[0, 15]} ticks={[0, 3, 6, 9, 12, 15]} tickFormatter={(v) => `${v}%`} fontSize={10} />
          <YAxis type="category" dataKey="name" width={120} fontSize={10} tick={{ fill: "#374151", fontWeight: 500 }} />
          <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11 }} />
          <ReferenceLine x={peerAvg} stroke="#64748b" strokeDasharray="6 3" strokeWidth={1.5} label={{ value: `Peer Avg ${peerAvg.toFixed(1)}%`, position: "top", fontSize: 10, fill: "#64748b", fontWeight: 600 }} />
          <Bar dataKey="increase" radius={[0, 4, 4, 0]} barSize={20} label={{ position: "right", fontSize: 10, fontWeight: 600, fill: "#374151", formatter: (v: unknown) => `${Number(v).toFixed(1)}%` }}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isTarget ? "#D97C14" : "#00446a"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Box sx={{ display: "flex", gap: 2, mt: 0.5, ml: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: "#D97C14" }} />
          <Typography sx={{ fontSize: 9, color: "#666" }}>Meridian (this engagement)</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "2px", bgcolor: "#00446a" }} />
          <Typography sx={{ fontSize: 9, color: "#666" }}>Peer engagements</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function PeerIncreaseScenarioChart({ data, height = 260 }: { data: Record<string, unknown>[]; height?: number }) {
  return (
    <Box sx={{ width: "100%", mb: 1 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", mb: 0.5 }}>
        Scenario Analysis — Where Does 9% Sit?
      </Typography>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 15, right: 50, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.4} />
          <XAxis type="number" domain={[0, 15]} ticks={[0, 3, 6, 9, 12, 15]} tickFormatter={(v) => `${v}%`} fontSize={10} />
          <YAxis type="category" dataKey="name" width={120} fontSize={10} tick={{ fill: "#374151", fontWeight: 500 }} />
          <Tooltip formatter={(v) => `${v}%`} contentStyle={{ fontSize: 11 }} />
          <ReferenceArea x1={0} x2={7} fill="#c62828" fillOpacity={0.05} />
          <ReferenceLine x={7} stroke="#e65100" strokeDasharray="5 3" strokeWidth={1.5} />
          <ReferenceLine x={9} stroke="#2e7d32" strokeWidth={2} />
          <Bar dataKey="increase" radius={[0, 4, 4, 0]} barSize={20}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.isTarget ? "#D97C14" : "#00446a"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <Box sx={{ display: "flex", gap: 1.5, mt: 0.5, ml: 1, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 14, height: 2, bgcolor: "#2e7d32" }} />
          <Typography sx={{ fontSize: 9, color: "#2e7d32", fontWeight: 600 }}>9% recommended</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 14, height: 0, borderTop: "2px dashed #e65100" }} />
          <Typography sx={{ fontSize: 9, color: "#e65100", fontWeight: 600 }}>7% client comfort zone</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 10, height: 10, bgcolor: "#c62828", opacity: 0.15, borderRadius: "2px" }} />
          <Typography sx={{ fontSize: 9, color: "#c62828" }}>Margin trap zone (&lt;7%)</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function ChartRenderer({ chart }: { chart: ChartConfig }) {
  const h = chart.height ?? 200;
  switch (chart.type) {
    case "impact-by-service": return <ImpactByServiceChart data={chart.data} height={h} />;
    case "increase-distribution": return <IncreaseDistributionChart data={chart.data} height={h} />;
    case "review-status": return <ReviewStatusChart data={chart.data} height={h} />;
    case "partner-portfolio": return <PartnerPortfolioChart data={chart.data} height={h} />;
    case "renewal-risk": return <RenewalRiskChart data={chart.data} height={h} />;
    case "peer-increase-comparison": return <PeerIncreaseChart data={chart.data} height={h} />;
    case "peer-increase-scenario": return <PeerIncreaseScenarioChart data={chart.data} height={h} />;
    default: return null;
  }
}

function renderBold(text: string): React.ReactNode[] {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
}

// ─── Flow builder (uses real data) ──────────────────────────

const TOPICS: { key: ChartKind; label: string; inputText: string; flowKey: string }[] = [
  { key: "impact-by-service", label: "Where does this engagement sit vs. others in its service line?", inputText: "Where does this engagement sit vs. others in its service line?", flowKey: "impact-by-service" },
  { key: "increase-distribution", label: "How does this price increase compare to the rest of the portfolio?", inputText: "How does this price increase compare to the rest of the portfolio?", flowKey: "increase-distribution" },
  { key: "review-status", label: "How far along is the review cycle overall?", inputText: "How far along is the review cycle overall?", flowKey: "review-status" },
  { key: "partner-portfolio", label: "How does this partner's book compare to others?", inputText: "How does this partner's book compare to others?", flowKey: "partner-portfolio" },
  { key: "renewal-risk", label: "What's the renewal risk exposure across the portfolio?", inputText: "What's the renewal risk exposure across the portfolio?", flowKey: "renewal-risk" },
];

const COMPARE_KEYS: Record<string, string> = {
  "impact-by-service+increase-distribution": "compare-impact-increase",
  "impact-by-service+review-status": "compare-impact-status",
  "impact-by-service+partner-portfolio": "compare-impact-partner",
  "impact-by-service+renewal-risk": "compare-impact-renewal",
  "increase-distribution+review-status": "compare-increase-status",
  "increase-distribution+renewal-risk": "compare-increase-renewal",
  "review-status+partner-portfolio": "compare-status-partner",
  "review-status+renewal-risk": "compare-status-renewal",
  "partner-portfolio+renewal-risk": "compare-partner-renewal",
};

function getCompareKey(a: ChartKind, b: ChartKind) {
  return COMPARE_KEYS[`${a}+${b}`] || COMPARE_KEYS[`${b}+${a}`] || "";
}

function buildSuggestions(lastTopic: ChartKind | null, wasComparison: boolean) {
  const standalone = TOPICS.map((t) => ({ label: t.label, inputText: t.inputText, flowKey: t.flowKey }));
  if (!lastTopic || wasComparison) return { primary: standalone, alt: null as Suggestion[] | null };
  const currentLabel = TOPICS.find((t) => t.key === lastTopic)!.label;
  const compare = TOPICS.filter((t) => t.key !== lastTopic).map((t) => ({
    label: `Compare with ${t.label}`,
    inputText: `Compare ${currentLabel.toLowerCase()} with ${t.label.toLowerCase()}`,
    flowKey: getCompareKey(lastTopic, t.key),
  }));
  return { primary: compare, alt: standalone };
}

function buildFlows(charts: ReturnType<typeof buildChartData>, metrics: ReturnType<typeof buildMetrics>, allData: RowData[], engagementRow?: RowData): Record<string, FlowEntry> {
  const topService = charts.impactByService[0];
  const peakBucket = charts.increaseDistribution.reduce((a, b) => (b.count as number) > (a.count as number) ? b : a);
  const atRiskFee = charts.renewalRisk.find(r => r.status === "At Risk");

  const engSL = engagementRow?.serviceLine || "";
  const engIncrease = engagementRow?.revisedPriceIncreasePct ?? engagementRow?.recPriceIncreasePct ?? 0;
  const engFee = engagementRow?.revisedTotalFee ?? 0;
  const slPeers = allData.filter(r => r.serviceLine === engSL);
  const slAvgIncrease = slPeers.length > 0 ? slPeers.reduce((s, r) => s + r.revisedPriceIncreasePct, 0) / slPeers.length : 0;
  const slAvgFee = slPeers.length > 0 ? slPeers.reduce((s, r) => s + r.revisedTotalFee, 0) / slPeers.length : 0;
  const engVsSl = engIncrease - slAvgIncrease;
  const engVsSlDir = engVsSl > 0.2 ? "above" : engVsSl < -0.2 ? "below" : "in line with";

  const isMeridianDemo = engagementRow?.clientName === "Meridian Health Systems" && engagementRow?.projectName === "Annual Audit FY26";
  const peerChartData: Record<string, unknown>[] = isMeridianDemo
    ? [
        { name: "Apex Capital", increase: 6.2, fee: "$210K", isTarget: false },
        { name: "Pacific Rim Health", increase: 7.5, fee: "$245K", isTarget: false },
        { name: "Vanguard Senior", increase: 8.1, fee: "$270K", isTarget: false },
        { name: "Meridian Health ★", increase: 9.0, fee: "$285K", isTarget: true },
        { name: "Atlas Industrial", increase: 10.3, fee: "$310K", isTarget: false },
        { name: "Horizon Pharma", increase: 11.0, fee: "$335K", isTarget: false },
        { name: "Liberty Mutual HC", increase: 11.8, fee: "$360K", isTarget: false },
        { name: "Cornerstone Medical", increase: 12.5, fee: "$390K", isTarget: false },
      ]
    : [];

  return {
    "impact-by-service": {
      thinkingDelay: 1800,
      thinkingMessage: "Comparing this engagement to its service line...",
      response: {
        title: "This Engagement vs. Service Line",
        content: engagementRow
          ? `This engagement has a **${engIncrease.toFixed(1)}%** recommended increase and a revised fee of **${fmtFull(engFee)}**. That's **${engVsSlDir}** the **${engSL}** average of **${slAvgIncrease.toFixed(1)}%** across ${slPeers.length} engagements (avg fee: ${fmtFull(Math.round(slAvgFee))}). The chart below shows total revised impact by service line — **${engSL}** accounts for **${fmtFull(charts.impactByService.find(s => s.serviceLine === engSL)?.impact || 0)}** of the **${fmtFull(metrics.totalImpact)}** portfolio total.`
          : `**${topService?.serviceLine}** drives the largest revised impact at **${fmtFull(topService?.impact || 0)}**. Total portfolio impact is **${fmtFull(metrics.totalImpact)}** with an average increase of **${metrics.avgIncrease.toFixed(1)}%**.`,
        charts: [{ type: "impact-by-service", data: charts.impactByService }],
        metrics: [
          { label: "This Engagement", value: `${engIncrease.toFixed(1)}%` },
          { label: `${engSL || "SL"} Avg`, value: `${slAvgIncrease.toFixed(1)}%` },
          { label: "Portfolio Avg", value: `${metrics.avgIncrease.toFixed(1)}%` },
        ],
      },
    },
    "increase-distribution": {
      thinkingDelay: 1500,
      thinkingMessage: "Comparing this increase to the portfolio...",
      response: {
        title: "This Increase vs. Portfolio",
        content: engagementRow
          ? `This engagement's **${engIncrease.toFixed(1)}%** increase falls in the **${peakBucket.range}** range, where ${peakBucket.count} of ${allData.length} engagements land. The portfolio average is **${metrics.avgIncrease.toFixed(1)}%** — this engagement is **${engVsSlDir}** average. ${engVsSl > 0.5 ? "A higher-than-average increase here is supported by the margin gap and peer data." : engVsSl < -0.5 ? "The lower increase reflects relationship or retention considerations." : "This is a standard increase consistent with the rest of the book."}`
          : `Most engagements fall in the **${peakBucket.range}** increase range (${peakBucket.count} items), with the portfolio average at **${metrics.avgIncrease.toFixed(1)}%**.`,
        charts: [{ type: "increase-distribution", data: charts.increaseDistribution }],
        metrics: [
          { label: "This Engagement", value: `${engIncrease.toFixed(1)}%` },
          { label: "Portfolio Avg", value: `${metrics.avgIncrease.toFixed(1)}%` },
          { label: "Most Common", value: String(peakBucket.range) },
        ],
      },
    },
    "review-status": {
      thinkingDelay: 1200,
      thinkingMessage: "Loading review status...",
      response: {
        title: "Review Status Breakdown",
        content: engagementRow
          ? `This engagement is currently **${engagementRow.status}**. Across the portfolio, **${metrics.needsReview} engagements** still need review while ${metrics.approved} are complete or revised. The cycle is **${Math.round(metrics.approved / charts.reviewStatus.reduce((s, r) => s + (r.count as number), 0) * 100)}% complete**.`
          : `**${metrics.needsReview} engagements** still need review. ${metrics.approved} are complete or revised. The pipeline is **${Math.round(metrics.approved / charts.reviewStatus.reduce((s, r) => s + (r.count as number), 0) * 100)}% complete** through the review cycle.`,
        charts: [{ type: "review-status", data: charts.reviewStatus }],
        metrics: [
          { label: "Needs Review", value: String(metrics.needsReview), trend: "down" },
          { label: "Approved", value: String(metrics.approved), trend: "up" },
          { label: "Completion", value: `${Math.round(metrics.approved / charts.reviewStatus.reduce((s, r) => s + (r.count as number), 0) * 100)}%` },
        ],
      },
    },
    "partner-portfolio": {
      thinkingDelay: 1600,
      thinkingMessage: "Analyzing partner portfolios...",
      response: {
        title: "Partner Portfolio Overview",
        content: engagementRow
          ? `This engagement is managed by **${engagementRow.partnerName}**. The largest overall portfolio belongs to **${metrics.topPartner[0]}** at **${fmtFull(metrics.topPartner[1])}** in revised total fees. Total revised fees across all partners: **${fmtFull(metrics.totalRevised)}**.`
          : `**${metrics.topPartner[0]}** manages the largest portfolio at **${fmtFull(metrics.topPartner[1])}** in revised total fees. Total revised fees across all partners: **${fmtFull(metrics.totalRevised)}**.`,
        charts: [{ type: "partner-portfolio", data: charts.partnerPortfolio }],
        metrics: [
          { label: "Top Partner", value: String(metrics.topPartner[0]) },
          { label: "Their Portfolio", value: fmtK(metrics.topPartner[1]) },
          { label: "Total Revised", value: fmtK(metrics.totalRevised) },
        ],
      },
    },
    "renewal-risk": {
      thinkingDelay: 1800,
      thinkingMessage: "Assessing renewal risk exposure...",
      response: {
        title: "Renewal Risk Exposure",
        content: engagementRow
          ? `This engagement's client is currently **${engagementRow.clientRenewalStatus}**. Across the portfolio, **${metrics.atRisk} clients are flagged At Risk**, representing **${fmtFull(atRiskFee?.totalFee || 0)}** in fee exposure. ${engagementRow.clientRenewalStatus === "At Risk" ? "This client's at-risk status means the recommended increase should be approached carefully during the conversation." : "At-risk accounts should be prioritized for partner outreach before price increases take effect."}`
          : `**${metrics.atRisk} clients are flagged At Risk**, representing **${fmtFull(atRiskFee?.totalFee || 0)}** in current fee exposure. At-risk accounts should be prioritized for partner outreach before price increases take effect.`,
        charts: [{ type: "renewal-risk", data: charts.renewalRisk }],
        metrics: [
          { label: "At Risk", value: `${metrics.atRisk} clients`, trend: "down" },
          { label: "At Risk Fee $", value: fmtK(atRiskFee?.totalFee || 0) },
          { label: "Comm Accepted", value: String(metrics.acceptedComms) },
        ],
      },
    },
    "compare-impact-increase": {
      thinkingDelay: 2000,
      thinkingMessage: "Comparing impact with increase distribution...",
      response: {
        title: "Impact vs. Price Increase Spread",
        content: `Service lines with the **highest dollar impact** don't always correspond to the highest percentage increases. This suggests larger engagements may be absorbing proportionally smaller increases — worth verifying whether those clients can absorb more.`,
        charts: [
          { type: "impact-by-service", data: charts.impactByService, height: 160 },
          { type: "increase-distribution", data: charts.increaseDistribution, height: 160 },
        ],
        metrics: [
          { label: "Total Impact", value: fmtK(metrics.totalImpact) },
          { label: "Avg Increase", value: `${metrics.avgIncrease.toFixed(1)}%` },
        ],
      },
    },
    "compare-impact-status": {
      thinkingDelay: 1800,
      thinkingMessage: "Comparing impact with review status...",
      response: {
        title: "Impact vs. Review Status",
        content: `**${metrics.needsReview} items still need review**, including some from the highest-impact service lines. Prioritizing high-impact "Needs Review" items could unlock the most revenue value from the remaining pipeline.`,
        charts: [
          { type: "impact-by-service", data: charts.impactByService, height: 160 },
          { type: "review-status", data: charts.reviewStatus, height: 160 },
        ],
        metrics: [
          { label: "Unreviewed Impact", value: fmtK(metrics.totalImpact * (metrics.needsReview / 100)) },
          { label: "Pipeline %", value: `${Math.round(metrics.approved / 100 * 100)}%` },
        ],
      },
    },
    "compare-impact-partner": {
      thinkingDelay: 2000,
      thinkingMessage: "Comparing impact with partner portfolios...",
      response: {
        title: "Impact vs. Partner Portfolio",
        content: `Partners managing the highest-fee portfolios are also driving the most absolute impact. **${metrics.topPartner[0]}** leads both in total fees and dollar impact, suggesting effective pricing execution across their book.`,
        charts: [
          { type: "impact-by-service", data: charts.impactByService, height: 160 },
          { type: "partner-portfolio", data: charts.partnerPortfolio, height: 160 },
        ],
        metrics: [
          { label: "Top Partner", value: String(metrics.topPartner[0]) },
          { label: "Total Impact", value: fmtK(metrics.totalImpact) },
        ],
      },
    },
    "compare-impact-renewal": {
      thinkingDelay: 2000,
      thinkingMessage: "Comparing impact with renewal risk...",
      response: {
        title: "Impact vs. Renewal Risk",
        content: `At-risk accounts carry **${fmtFull(atRiskFee?.totalFee || 0)}** in fee exposure. Applying aggressive increases to these clients could accelerate churn. Consider **capping increases for at-risk renewals** while pursuing standard increases for active accounts.`,
        charts: [
          { type: "impact-by-service", data: charts.impactByService, height: 160 },
          { type: "renewal-risk", data: charts.renewalRisk, height: 160 },
        ],
        metrics: [
          { label: "At Risk Fee", value: fmtK(atRiskFee?.totalFee || 0) },
          { label: "Active Fee", value: fmtK(charts.renewalRisk.find(r => r.status === "Active")?.totalFee || 0) },
        ],
      },
    },
    "compare-increase-status": {
      thinkingDelay: 1600,
      thinkingMessage: "Comparing increase distribution with review status...",
      response: {
        title: "Increase Spread vs. Review Status",
        content: `The bulk of **"Needs Review" items fall in the ${peakBucket.range} range**, suggesting they are straightforward cases. Items at the extremes (0–3% or 10%+) may require more partner attention and should be triaged first.`,
        charts: [
          { type: "increase-distribution", data: charts.increaseDistribution, height: 160 },
          { type: "review-status", data: charts.reviewStatus, height: 160 },
        ],
        metrics: [
          { label: "Needs Review", value: String(metrics.needsReview) },
          { label: "Peak Range", value: String(peakBucket.range) },
        ],
      },
    },
    "compare-increase-renewal": {
      thinkingDelay: 1800,
      thinkingMessage: "Comparing increase distribution with renewal risk...",
      response: {
        title: "Increase Spread vs. Renewal Risk",
        content: `At-risk clients should be evaluated individually rather than receiving standard increases. Cross-referencing shows **at-risk accounts span multiple increase buckets** — a one-size-fits-all cap won't work. Partner-level discretion is recommended.`,
        charts: [
          { type: "increase-distribution", data: charts.increaseDistribution, height: 160 },
          { type: "renewal-risk", data: charts.renewalRisk, height: 160 },
        ],
        metrics: [
          { label: "At Risk", value: `${metrics.atRisk} clients` },
          { label: "Avg Increase", value: `${metrics.avgIncrease.toFixed(1)}%` },
        ],
      },
    },
    "compare-status-partner": {
      thinkingDelay: 1600,
      thinkingMessage: "Comparing review status with partner portfolios...",
      response: {
        title: "Review Status vs. Partner Portfolio",
        content: `Some partners have a disproportionate share of unreviewed items. Rebalancing review assignments could **accelerate overall pipeline completion** and ensure no single partner becomes a bottleneck.`,
        charts: [
          { type: "review-status", data: charts.reviewStatus, height: 160 },
          { type: "partner-portfolio", data: charts.partnerPortfolio, height: 160 },
        ],
        metrics: [
          { label: "Completion", value: `${Math.round(metrics.approved / 100 * 100)}%` },
          { label: "Partners", value: String(charts.partnerPortfolio.length) },
        ],
      },
    },
    "compare-status-renewal": {
      thinkingDelay: 1600,
      thinkingMessage: "Comparing review status with renewal risk...",
      response: {
        title: "Review Status vs. Renewal Risk",
        content: `At-risk clients that are still in **"Needs Review"** should be escalated immediately. Delayed pricing decisions for at-risk accounts increase the chance of losing the relationship entirely.`,
        charts: [
          { type: "review-status", data: charts.reviewStatus, height: 160 },
          { type: "renewal-risk", data: charts.renewalRisk, height: 160 },
        ],
        metrics: [
          { label: "At Risk Unreviewed", value: String(Math.round(metrics.atRisk * metrics.needsReview / 100)) },
          { label: "At Risk Total", value: String(metrics.atRisk) },
        ],
      },
    },
    "compare-partner-renewal": {
      thinkingDelay: 1800,
      thinkingMessage: "Comparing partner portfolios with renewal risk...",
      response: {
        title: "Partner Portfolio vs. Renewal Risk",
        content: `Partners with the most at-risk clients in their portfolios may need additional support or different pricing strategies. **Aligning partner incentives with retention outcomes** could improve overall renewal rates.`,
        charts: [
          { type: "partner-portfolio", data: charts.partnerPortfolio, height: 160 },
          { type: "renewal-risk", data: charts.renewalRisk, height: 160 },
        ],
        metrics: [
          { label: "At Risk", value: `${metrics.atRisk} clients` },
          { label: "Top Partner Fee", value: fmtK(metrics.topPartner[1]) },
        ],
      },
    },
    ...(isMeridianDemo ? {
      "meridian-why-9": {
        thinkingDelay: 2000,
        thinkingMessage: "Analyzing peer data and margin drivers...",
        response: {
          title: "Why 9% Is the Right Price Increase",
          content: "The model recommends a **9.0% price increase** based on three factors:\n\n**1. Peer positioning** — At 9.0%, this increase sits just below the **peer average of 9.6%** for similar-sized Audit & Assurance engagements ($200K–$400K). This is a defensible position — you're not asking for more than the market.\n\n**2. Client tolerance** — Meridian has accepted fee increases of **6.2%**, **7.8%**, and **8.1%** over the last three cycles. 9.0% is the highest increase with **85%+ predicted acceptance** based on their history.\n\n**3. Margin recovery** — Current realized margin is **18.3%** vs. the **24.1%** peer average. A 9.0% increase closes about 3.4pp of that 5.8pp gap, with the rest recoverable next cycle.",
          charts: [{ type: "peer-increase-comparison" as ChartKind, data: peerChartData }],
          metrics: [
            { label: "Price Increase", value: "9.0%" },
            { label: "Peer Avg Increase", value: "9.6%" },
            { label: "Acceptance Prob.", value: "~85%" },
          ],
          suggestions: [
            { label: "What if we proposed a lower increase?", inputText: "What if we proposed a lower increase?", flowKey: "meridian-what-if" },
            { label: "You could also explore: margin gap breakdown by cost driver, acceptance trend over past 5 cycles, or peer fee benchmarking by region", inputText: "", flowKey: "", disabled: true },
          ],
        },
      },
      "meridian-what-if": {
        thinkingDelay: 1800,
        thinkingMessage: "Running scenario analysis...",
        response: {
          title: "Scenario: What If We Go Lower?",
          content: "**At 7%** (what the client has accepted before):\n• Revised fee drops to ~**$305K** (vs. ~$311K at 9%)\n• Margin improves to only **20.1%** — still 4.0pp below peers\n• Leaves ~**$6K/year** on the table\n• Acceptance probability jumps to ~95%, but barely moves the needle on margin\n\n**Below 7%** enters what the model flags as a **margin trap** — each under-priced cycle makes the next correction steeper. At 5%, you'd need **12%+** next cycle to catch up, which is historically unacceptable for this client.\n\n**At 9%**, you're in the sweet spot: **meaningful margin recovery** without exceeding the client's tolerance. And you're still below the peer average, which gives you air cover in the conversation.",
          charts: [{ type: "peer-increase-scenario" as ChartKind, data: peerChartData }],
          metrics: [
            { label: "At 9%", value: "~$311K" },
            { label: "At 7%", value: "~$305K" },
            { label: "Gap", value: "~$6K/yr" },
          ],
          suggestions: [
            { label: "Give me talking points for the price conversation", inputText: "Give me talking points for the price conversation", flowKey: "meridian-talking-points" },
            { label: "Other analyses: multi-year scenario modeling, sensitivity to scope changes, or win/loss rate by increase bracket", inputText: "", flowKey: "", disabled: true },
          ],
        },
      },
      "meridian-talking-points": {
        thinkingDelay: 2200,
        thinkingMessage: "Preparing your conversation brief...",
        response: {
          title: "Meridian Health — Price Increase Conversation Brief",
          content: "**Your position:** 9.0% fee increase, $285K → ~$311K. This is below the 9.6% average across similar Audit & Assurance engagements.\n\n**Lead with value, not cost:**\n• \"We've been your audit partner for 8 years. Our team's knowledge of your multi-entity structure and SOX 404 requirements would take a new firm 12–18 months to rebuild.\"\n• \"This increase is below what we're seeing across similar healthcare audit engagements this cycle.\"\n\n**If they push back on the increase:**\n• \"We've kept increases in the 6–8% range for three straight cycles. This 9% reflects accumulated cost pressure — market labor rates, expanded regulatory scope (ASC 842, ESG), and multi-entity complexity.\"\n• \"A new auditor would likely quote 15–20% above our current rate in year one.\"\n\n**If they ask to reduce scope:**\n• \"The SOX 404 and multi-entity consolidation are standards-driven — not optional add-ons. We can discuss phasing advisory work, but the core audit scope is fixed.\"\n\n**Anchor statistic:** Peers in the $200K–$400K band are averaging 9.6% increases this cycle. You're recommending below that.",
          metrics: [
            { label: "Proposed Fee", value: "~$311K" },
            { label: "Peer Avg Increase", value: "9.6%" },
            { label: "Relationship", value: "8 Years" },
          ],
          suggestions: [
            { label: "Explore portfolio analytics", inputText: "Explore portfolio analytics", flowKey: "impact-by-service" },
            { label: "More possibilities: client profitability deep-dive, realization rate trend, or staffing cost attribution analysis", inputText: "", flowKey: "", disabled: true },
          ],
        },
      },
    } : {}),
  };
}

function resolveFlowKey(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes("why") && t.includes("9")) return "meridian-why-9";
  if ((t.includes("what if") || t.includes("lower")) && t.includes("increase")) return "meridian-what-if";
  if (t.includes("talking point")) return "meridian-talking-points";
  if (t.includes("impact") && t.includes("increase")) return "compare-impact-increase";
  if (t.includes("impact") && t.includes("status")) return "compare-impact-status";
  if (t.includes("impact") && t.includes("partner")) return "compare-impact-partner";
  if (t.includes("impact") && t.includes("renew")) return "compare-impact-renewal";
  if (t.includes("increase") && t.includes("status")) return "compare-increase-status";
  if (t.includes("increase") && t.includes("renew")) return "compare-increase-renewal";
  if (t.includes("status") && t.includes("partner")) return "compare-status-partner";
  if (t.includes("status") && t.includes("renew")) return "compare-status-renewal";
  if (t.includes("partner") && t.includes("renew")) return "compare-partner-renewal";
  if (t.includes("impact") || t.includes("service line")) return "impact-by-service";
  if (t.includes("increase") || t.includes("spread") || t.includes("distribution")) return "increase-distribution";
  if (t.includes("status") || t.includes("review") || t.includes("pipeline")) return "review-status";
  if (t.includes("partner") || t.includes("portfolio")) return "partner-portfolio";
  if (t.includes("risk") || t.includes("renew") || t.includes("retention")) return "renewal-risk";
  return null;
}

// ─── Main Component ──────────────────────────────────────────

let msgId = 0;
function nextId() { return `amsg-${++msgId}`; }

export default function AnalyticsDrawer({ clientName, projectName, data, preloadFlow }: { clientName: string; projectName: string; data: RowData[]; preloadFlow?: string }) {
  const engagementRow = useMemo(() => data.find(r => r.clientName === clientName && r.projectName === projectName), [data, clientName, projectName]);
  const charts = useMemo(() => buildChartData(data), [data]);
  const metrics = useMemo(() => buildMetrics(data), [data]);
  const flows = useMemo(() => buildFlows(charts, metrics, data, engagementRow), [charts, metrics, data, engagementRow]);

  const isMeridianDemo = clientName === "Meridian Health Systems" && projectName === "Annual Audit FY26";

  const greeting = isMeridianDemo
    ? `You're looking at **Meridian Health Systems — Annual Audit FY26**, a **$285K** engagement in Audit & Assurance. The model has analyzed this engagement against peer data, margin targets, and client history to recommend a **9.0% price increase** (current fee → ~$311K). I can walk you through the reasoning.`
    : `You're looking at **${clientName} — ${projectName}**, one of ${data.length} engagements in this review cycle. I can show you how this engagement compares to the rest of the portfolio.`;
  const initialSuggestions: Suggestion[] = isMeridianDemo
    ? [{ label: "Why is 9% the right price increase?", inputText: "Why is 9% the right price increase?", flowKey: "meridian-why-9" }]
    : TOPICS.map((t) => ({ label: t.label, inputText: t.inputText, flowKey: t.flowKey }));

  const [messages, setMessages] = useState<AnalyticsMsg[]>([
    { id: nextId(), role: "assistant", content: greeting, suggestions: initialSuggestions },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [thinkingMessage, setThinkingMessage] = useState<string | undefined>();
  const [lastTopic, setLastTopic] = useState<ChartKind | null>(null);
  const [wasComparison, setWasComparison] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pendingFlowKeyRef = useRef<string | null>(null);
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (!preloadFlow || preloadedRef.current) return;
    preloadedRef.current = true;
    const flow = flows[preloadFlow];
    if (!flow) return;
    setIsThinking(true);
    setThinkingMessage("Analyzing portfolio with ML-driven insights...");
    const t = setTimeout(() => {
      const { primary } = buildSuggestions(preloadFlow as ChartKind, false);
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "user", content: "Show me how the model analyzes this portfolio" },
        {
          ...flow.response,
          id: nextId(),
          role: "assistant",
          content: `Because the ML model trains on **real transaction history**, market signals, and feedback loops, it can surface patterns no static analysis would catch.\n\n${flow.response.content}`,
          suggestions: primary,
        },
      ]);
      setIsThinking(false);
      setThinkingMessage(undefined);
      setLastTopic(preloadFlow as ChartKind);
    }, 1200);
    return () => clearTimeout(t);
  }, [preloadFlow, flows]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleChipClick = useCallback((chip: Suggestion) => {
    if (isThinking) return;
    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: chip.inputText }]);
    pendingFlowKeyRef.current = chip.flowKey;
    setChatInput("");
    const flowKey = chip.flowKey;
    const flow = flowKey ? flows[flowKey] : null;
    if (!flow) return;
    setIsThinking(true);
    setThinkingMessage(flow.thinkingMessage);
    setTimeout(() => {
      const isMeridianFlow = flowKey.startsWith("meridian-");
      if (isMeridianFlow) {
        setMessages((prev) => [...prev, { id: nextId(), role: "assistant", ...flow.response }]);
      } else {
        const isCompare = flowKey.startsWith("compare-");
        const matchedTopic = TOPICS.find((t) => t.flowKey === flowKey);
        const newTopic = matchedTopic ? matchedTopic.key : lastTopic;
        if (newTopic && !isCompare) setLastTopic(newTopic);
        setWasComparison(isCompare);
        const { primary, alt } = buildSuggestions(newTopic, isCompare);
        setMessages((prev) => [...prev, { id: nextId(), role: "assistant", ...flow.response, suggestions: primary, altSuggestions: alt ?? undefined }]);
      }
      setIsThinking(false);
      setThinkingMessage(undefined);
    }, flow.thinkingDelay);
  }, [isThinking, flows, lastTopic]);

  const handleSend = useCallback(() => {
    const text = chatInput.trim();
    if (!text || isThinking) return;

    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: text }]);
    setChatInput("");

    const flowKey = pendingFlowKeyRef.current || resolveFlowKey(text);
    pendingFlowKeyRef.current = null;

    const flow = flowKey ? flows[flowKey] : null;

    if (!flow) {
      const { primary } = buildSuggestions(null, false);
      setTimeout(() => {
        setMessages((prev) => [...prev, {
          id: nextId(), role: "assistant",
          content: "I can help you analyze impact by service line, price increase distribution, review status, partner portfolios, and renewal risk. Try one of the suggestions below.",
          suggestions: primary,
        }]);
      }, 600);
      return;
    }

    setIsThinking(true);
    setThinkingMessage(flow.thinkingMessage);

    const isMeridianFlow = flowKey?.startsWith("meridian-") ?? false;

    const isCompare = flowKey?.startsWith("compare-") ?? false;
    let newTopic = lastTopic;
    if (!isCompare && !isMeridianFlow) {
      const matched = TOPICS.find((t) => t.flowKey === flowKey);
      if (matched) newTopic = matched.key;
    }

    setTimeout(() => {
      if (isMeridianFlow) {
        setMessages((prev) => [...prev, {
          ...flow.response,
          id: nextId(),
          role: "assistant",
        }]);
      } else {
        const { primary } = buildSuggestions(isCompare ? null : newTopic, isCompare);
        setMessages((prev) => [...prev, {
          ...flow.response,
          id: nextId(),
          role: "assistant",
          suggestions: primary,
        }]);
      }
      setIsThinking(false);
      setThinkingMessage(undefined);
      setLastTopic(newTopic);
      setWasComparison(isCompare);
    }, flow.thinkingDelay);
  }, [chatInput, isThinking, lastTopic, flows]);

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column" }}>
        {messages.map((msg) => (
          <Box key={msg.id} sx={{ mb: 2, display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <Box sx={{ maxWidth: "95%", px: 1.75, py: 1.25, borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", bgcolor: msg.role === "user" ? "#00446a" : "rgba(0,0,0,0.04)", color: msg.role === "user" ? "white" : "#333" }}>
              {msg.title && <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#00446a", mb: 0.75 }}>{msg.title}</Typography>}

              {msg.metrics && msg.metrics.length > 0 && (
                <Box sx={{ display: "flex", gap: 1, mb: 1.5, flexWrap: "wrap" }}>
                  {msg.metrics.map((m, i) => (
                    <Box key={i} sx={{ flex: "1 1 0", minWidth: 80, bgcolor: "white", border: "1px solid rgba(0,0,0,0.1)", borderRadius: "6px", px: 1.25, py: 0.75 }}>
                      <Typography sx={{ fontSize: 9, fontWeight: 600, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{m.label}</Typography>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: m.trend === "up" ? "#2e7d32" : m.trend === "down" ? "#c62828" : "#333" }}>{m.value}</Typography>
                    </Box>
                  ))}
                </Box>
              )}

              <Typography sx={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line", mb: msg.charts ? 1.5 : 0 }}>{renderBold(msg.content)}</Typography>

              {msg.charts && msg.charts.map((chart, i) => (
                <Box key={i}>
                  {i > 0 && <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.08)", my: 1.5 }} />}
                  <ChartRenderer chart={chart} />
                </Box>
              ))}
            </Box>
          </Box>
        ))}

        {isThinking && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.75, py: 1, bgcolor: "rgba(0,0,0,0.04)", borderRadius: "12px 12px 12px 2px", alignSelf: "flex-start", mb: 1.5 }}>
            <CircularProgress size={14} sx={{ color: "#00446a" }} />
            <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>{thinkingMessage || "Thinking…"}</Typography>
          </Box>
        )}

        {!isThinking && lastAssistant?.suggestions && lastAssistant.suggestions.length > 0 && (
          <Box sx={{ py: 1 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.4)", mb: 0.75 }}>
              {lastTopic && !wasComparison ? "Compare With" : "Explore"}
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
              {lastAssistant.suggestions.filter(s => !s.disabled).map((s) => (
                <Chip
                  key={s.label}
                  label={s.label}
                  size="small"
                  clickable
                  onClick={() => handleChipClick(s)}
                  sx={{ fontSize: 11, height: 28, borderRadius: "14px", bgcolor: "rgba(0,68,106,0.06)", border: "1px solid rgba(0,68,106,0.2)", color: "#00446a", fontWeight: 500, "&:hover": { bgcolor: "rgba(0,68,106,0.12)" } }}
                />
              ))}
            </Box>
            {lastAssistant.suggestions.filter(s => s.disabled).map((s) => (
              <Typography key={s.label} sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", fontStyle: "italic", mt: 1, lineHeight: 1.5 }}>
                {s.label}
              </Typography>
            ))}
            {lastTopic && !wasComparison && (() => {
              const { alt } = buildSuggestions(lastTopic, false);
              if (!alt) return null;
              return (
                <Box sx={{ mt: 1.5 }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.4)", mb: 0.75 }}>Or Explore</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {alt.map((s) => (
                      <Chip
                        key={s.label}
                        label={s.label}
                        size="small"
                        clickable
                        onClick={() => handleChipClick(s)}
                        sx={{ fontSize: 11, height: 28, borderRadius: "14px", bgcolor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.1)", color: "rgba(0,0,0,0.6)", fontWeight: 500, "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}
                      />
                    ))}
                  </Box>
                </Box>
              );
            })()}
          </Box>
        )}

        <div ref={bottomRef} />
      </Box>

      {/* Chat input */}
      <Box sx={{ px: 2, pb: 1.5, pt: 1, borderTop: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Ask about pricing analytics..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              fontSize: 13,
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00446a", borderWidth: 2 },
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={handleSend} disabled={isThinking} sx={{ color: "#00446a" }}>
                    <SendIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.3)", fontStyle: "italic", mt: 0.5, textAlign: "center" }}>
          InsightAI can make mistakes. Consider checking important information.
        </Typography>
      </Box>
    </Box>
  );
}
