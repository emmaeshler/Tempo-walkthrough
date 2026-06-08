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
} from "recharts";
import type { RowData } from "../app/data";

type ChartKind = "impact-by-service" | "increase-distribution" | "review-status" | "partner-portfolio" | "renewal-risk";

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

  const statusOrder = ["Needs Review", "In Progress", "Approved", "Submitted"];
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
  const approved = data.filter(r => r.status === "Approved" || r.status === "Submitted").length;
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

function ChartRenderer({ chart }: { chart: ChartConfig }) {
  const h = chart.height ?? 200;
  switch (chart.type) {
    case "impact-by-service": return <ImpactByServiceChart data={chart.data} height={h} />;
    case "increase-distribution": return <IncreaseDistributionChart data={chart.data} height={h} />;
    case "review-status": return <ReviewStatusChart data={chart.data} height={h} />;
    case "partner-portfolio": return <PartnerPortfolioChart data={chart.data} height={h} />;
    case "renewal-risk": return <RenewalRiskChart data={chart.data} height={h} />;
    default: return null;
  }
}

function renderBold(text: string): React.ReactNode[] {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
}

// ─── Flow builder (uses real data) ──────────────────────────

const TOPICS: { key: ChartKind; label: string; inputText: string; flowKey: string }[] = [
  { key: "impact-by-service", label: "Impact by Service Line", inputText: "Show impact by service line", flowKey: "impact-by-service" },
  { key: "increase-distribution", label: "Price Increase Spread", inputText: "Show price increase distribution", flowKey: "increase-distribution" },
  { key: "review-status", label: "Review Status", inputText: "Show review status breakdown", flowKey: "review-status" },
  { key: "partner-portfolio", label: "Partner Portfolio", inputText: "Show partner portfolio", flowKey: "partner-portfolio" },
  { key: "renewal-risk", label: "Renewal Risk", inputText: "Show renewal risk exposure", flowKey: "renewal-risk" },
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

function buildFlows(charts: ReturnType<typeof buildChartData>, metrics: ReturnType<typeof buildMetrics>): Record<string, FlowEntry> {
  const topService = charts.impactByService[0];
  const peakBucket = charts.increaseDistribution.reduce((a, b) => (b.count as number) > (a.count as number) ? b : a);
  const atRiskFee = charts.renewalRisk.find(r => r.status === "At Risk");

  return {
    "impact-by-service": {
      thinkingDelay: 1800,
      thinkingMessage: "Aggregating impact by service line...",
      response: {
        title: "Impact by Service Line",
        content: `**${topService?.serviceLine}** drives the largest revised impact at **${fmtFull(topService?.impact || 0)}**. Total portfolio impact across all service lines is **${fmtFull(metrics.totalImpact)}** with an average price increase of **${metrics.avgIncrease.toFixed(1)}%**.`,
        charts: [{ type: "impact-by-service", data: charts.impactByService }],
        metrics: [
          { label: "Total Impact", value: fmtK(metrics.totalImpact), trend: metrics.totalImpact >= 0 ? "up" : "down" },
          { label: "Avg Increase", value: `${metrics.avgIncrease.toFixed(1)}%` },
          { label: "Service Lines", value: String(charts.impactByService.length) },
        ],
      },
    },
    "increase-distribution": {
      thinkingDelay: 1500,
      thinkingMessage: "Analyzing price increase distribution...",
      response: {
        title: "Price Increase Distribution",
        content: `Most engagements fall in the **${peakBucket.range}** increase range (${peakBucket.count} items). The distribution shows a ${metrics.avgIncrease > 6 ? "skew toward higher increases" : "balanced spread"}, with the average across all ${charts.increaseDistribution.reduce((s, b) => s + (b.count as number), 0)} engagements at **${metrics.avgIncrease.toFixed(1)}%**.`,
        charts: [{ type: "increase-distribution", data: charts.increaseDistribution }],
        metrics: [
          { label: "Avg Increase", value: `${metrics.avgIncrease.toFixed(1)}%` },
          { label: "Peak Range", value: String(peakBucket.range) },
          { label: "Total Items", value: String(charts.increaseDistribution.reduce((s, b) => s + (b.count as number), 0)) },
        ],
      },
    },
    "review-status": {
      thinkingDelay: 1200,
      thinkingMessage: "Loading review status...",
      response: {
        title: "Review Status Breakdown",
        content: `**${metrics.needsReview} engagements** still need review. ${metrics.approved} have been approved or submitted. The pipeline is **${Math.round(metrics.approved / charts.reviewStatus.reduce((s, r) => s + (r.count as number), 0) * 100)}% complete** through the review cycle.`,
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
        content: `**${metrics.topPartner[0]}** manages the largest portfolio at **${fmtFull(metrics.topPartner[1])}** in revised total fees. Total revised fees across all partners: **${fmtFull(metrics.totalRevised)}**.`,
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
        content: `**${metrics.atRisk} clients are flagged At Risk**, representing **${fmtFull(atRiskFee?.totalFee || 0)}** in current fee exposure. The majority of the portfolio is in Active or Renewed status. At-risk accounts should be prioritized for partner outreach before price increases take effect.`,
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
  };
}

function resolveFlowKey(text: string): string | null {
  const t = text.toLowerCase();
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

export default function AnalyticsDrawer({ clientName, projectName, data }: { clientName: string; projectName: string; data: RowData[] }) {
  const charts = useMemo(() => buildChartData(data), [data]);
  const metrics = useMemo(() => buildMetrics(data), [data]);
  const flows = useMemo(() => buildFlows(charts, metrics), [charts, metrics]);

  const greeting = `Welcome to Decision Support for **${clientName} — ${projectName}**. I can help you explore pricing analytics across ${data.length} engagements. What would you like to see?`;
  const initialSuggestions = TOPICS.map((t) => ({ label: t.label, inputText: t.inputText, flowKey: t.flowKey }));

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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleChipClick = useCallback((chip: Suggestion) => {
    setChatInput(chip.inputText);
    pendingFlowKeyRef.current = chip.flowKey;
  }, []);

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

    const isCompare = flowKey?.startsWith("compare-") ?? false;
    let newTopic = lastTopic;
    if (!isCompare) {
      const matched = TOPICS.find((t) => t.flowKey === flowKey);
      if (matched) newTopic = matched.key;
    }

    setTimeout(() => {
      const { primary, alt } = buildSuggestions(isCompare ? null : newTopic, isCompare);
      setMessages((prev) => [...prev, {
        ...flow.response,
        id: nextId(),
        role: "assistant",
        suggestions: primary,
      }]);
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
              {lastAssistant.suggestions.map((s) => (
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
