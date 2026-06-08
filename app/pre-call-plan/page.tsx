"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Slider,
  Select,
  MenuItem,
  FormControl,
  TextField,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  CircularProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import {
  Send as SendIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Description as DescriptionIcon,
  AutoAwesome as AutoAwesomeIcon,
  Refresh as RefreshIcon,
  TuneRounded as TuneIcon,
  ExpandMore as ExpandMoreIcon,
  History as HistoryIcon,
  EditNote as DraftIcon,
  CheckCircle as CheckCircleIcon,
  Archive as ArchiveIcon,
  ThumbUp as AcceptedIcon,
  ThumbDown as DeclinedIcon,
  SendRounded as SentIcon,
  InfoOutlined as InfoIcon,
  PictureAsPdf as PdfIcon,
  Email as EmailIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
  Inventory2Outlined as InventoryIcon,
  OpenInNew as OpenInNewIcon,
} from "@mui/icons-material";
import AppShell from "../../components/AppShell";

interface DriverConfig {
  key: string;
  label: string;
  defaultValue: number;
  labels: string[];
  endLabels: [string, string];
  badgeStyles: { bg: string; color: string }[];
  aggressiveness: number[];
  aiValue: number;
  aiReason: string;
}

const SLIDER_DRIVERS: DriverConfig[] = [
  {
    key: "clientPriority",
    label: "Client priority",
    defaultValue: 1,
    labels: ["Low", "Medium", "High"],
    endLabels: ["Low", "High"],
    badgeStyles: [
      { bg: "#FAECE7", color: "#993C1D" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#E1F5EE", color: "#0F6E56" },
    ],
    aggressiveness: [0, 1, 2],
    aiValue: 2,
    aiReason: "Set to High because this account has a named executive sponsor and has been flagged as a top-10 strategic account this year.",
  },
  {
    key: "relationship",
    label: "Relationship length",
    defaultValue: 0,
    labels: ["Low", "Medium", "High"],
    endLabels: ["Low", "High"],
    badgeStyles: [
      { bg: "#FAECE7", color: "#993C1D" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#E1F5EE", color: "#0F6E56" },
    ],
    aggressiveness: [2, 1, 0],
    aiValue: 2,
    aiReason: "Set to High because this account has been a customer for 7 years with no churn risk flags in the last 4 quarters.",
  },
  {
    key: "timeSince",
    label: "Last price change",
    defaultValue: 2,
    labels: ["Recent", "Some time ago", "Long ago"],
    endLabels: ["Recent", "Long ago"],
    badgeStyles: [
      { bg: "#E1F5EE", color: "#0F6E56" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#FAECE7", color: "#993C1D" },
    ],
    aggressiveness: [0, 1, 2],
    aiValue: 2,
    aiReason: "Set to Long ago because the last price change on this account was 22 months ago, suggesting accumulated room for adjustment.",
  },
  {
    key: "breadth",
    label: "Breadth of sales",
    defaultValue: 0,
    labels: ["Narrow", "Moderate", "Broad"],
    endLabels: ["Narrow", "Broad"],
    badgeStyles: [
      { bg: "#FAECE7", color: "#993C1D" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#E1F5EE", color: "#0F6E56" },
    ],
    aggressiveness: [0, 1, 2],
    aiValue: 1,
    aiReason: "Set to Moderate because purchase data shows activity in 4 categories, with whitespace in services and consumables.",
  },
  {
    key: "revenue",
    label: "Revenue potential",
    defaultValue: 2,
    labels: ["Low", "Medium", "High"],
    endLabels: ["Low", "High"],
    badgeStyles: [
      { bg: "#FAECE7", color: "#993C1D" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#E1F5EE", color: "#0F6E56" },
    ],
    aggressiveness: [0, 1, 2],
    aiValue: 2,
    aiReason: "Set to High because the account expanded headcount by 30% this year and submitted an RFQ for two new product lines last month.",
  },
];

const HEAT_DESCRIPTORS = [
  "Protect relationship",
  "Lean conservative",
  "Balanced approach",
  "Moderately aggressive",
  "Maximize capture",
];

const RADAR_LABELS = ["Priority", "Tenure", "Last change", "Breadth", "Revenue"];

const CHIP_SUFFIXES: Record<string, string> = {
  clientPriority: "priority",
  relationship: "relationship",
  timeSince: "price change",
  breadth: "breadth",
  revenue: "revenue",
};

interface StrategyContent {
  pctIncrease: string;
  effectiveDate: string;
  talkingPoints: string[];
  serviceLevels: { metric: string; current: string; commitment: string }[];
  buyingPatterns: { insight: string; implication: string }[];
  objections: { objection: string; response: string }[];
}

const STRATEGY_BY_POSTURE: Record<string, StrategyContent> = {
  "Protect relationship": {
    pctIncrease: "1.5%",
    effectiveDate: "September 1, 2026",
    talkingPoints: [
      "We’ve absorbed the majority of cost increases over the past 18 months to minimize disruption to your business.",
      "This 1.5% adjustment is limited to a small subset of SKUs where raw material costs have exceeded our ability to hold pricing.",
      "85% of your current product catalog remains at the same rate — no changes to your highest-volume items.",
      "We’re offering a 60-day transition window so your team can plan and adjust purchase orders accordingly.",
      "Our goal is pricing stability — this targeted adjustment helps us avoid larger, broader corrections down the road.",
    ],
    serviceLevels: [
      { metric: "Order fulfillment rate", current: "97.2%", commitment: "Maintain 97%+ through Q4 2026" },
      { metric: "Average lead time", current: "3.2 days", commitment: "Hold at 3 business days or fewer" },
      { metric: "Dedicated account support", current: "Named rep + CSM", commitment: "No changes to support structure" },
      { metric: "Emergency/rush availability", current: "24-hr turnaround", commitment: "Continue offering rush at current rates" },
    ],
    buyingPatterns: [
      { insight: "Order frequency has been consistent at 2.4x/month for 14 months", implication: "Stable demand signals low churn risk — relationship-first messaging is appropriate" },
      { insight: "72% of spend concentrated in 3 product families", implication: "Those families are held flat; adjustment targets only the long-tail SKUs" },
      { insight: "No competitive RFQ activity detected in the last 6 months", implication: "Low switching intent supports a soft approach without urgency framing" },
      { insight: "Customer expanded into 1 new category last quarter", implication: "Growth signal — frame pricing stability as enabling continued expansion" },
    ],
    objections: [
      { objection: "Any increase feels like a lot right now.", response: "We understand — that’s why we limited this to 1.5% on a small subset. Your core items are unchanged, and this rate is well below the 4-6% industry average." },
      { objection: "We’ve been a loyal customer for years.", response: "Exactly — your tenure is why this adjustment is the smallest in your category. We’ve been absorbing increases that other accounts saw months ago." },
      { objection: "Can we delay the effective date?", response: "We’re flexible. Given our partnership, we can offer a 60-day transition window so your procurement team can plan accordingly." },
    ],
  },
  "Lean conservative": {
    pctIncrease: "2.5%",
    effectiveDate: "August 15, 2026",
    talkingPoints: [
      "We’re applying a 2.5% adjustment across 19 selected items — copy paper, forms, envelopes, and labels — effective August 15, roughly half the current market average.",
      "This reflects accumulated input cost increases we’ve been absorbing since Q3 2025.",
      "High-volume items carry the smallest adjustments; specialty and low-volume lines absorb the majority of the correction.",
      "We structured this to protect your purchasing patterns — your top 10 SKUs by volume see increases under 2%.",
      "Addressing this now with a modest correction prevents a steeper adjustment later in the fiscal year.",
    ],
    serviceLevels: [
      { metric: "Order fulfillment rate", current: "97.2%", commitment: "Target 97.5%+ with new inventory model" },
      { metric: "Average lead time", current: "3.2 days", commitment: "Reduce to 2.8 days by Q4 2026" },
      { metric: "Pricing lock period", current: "Quarterly review", commitment: "Lock new rates through January 2027" },
      { metric: "Volume discount tier", current: "Tier 2", commitment: "Maintain current tier thresholds" },
    ],
    buyingPatterns: [
      { insight: "Spend is up 8% YoY but concentrated in 4 categories", implication: "Growth justifies holding volume tiers — use this as a retention lever" },
      { insight: "Average order value has increased 12% in the last two quarters", implication: "Customer is consolidating orders — larger baskets make per-unit increase feel smaller" },
      { insight: "Seasonal spike expected in Q3 based on 3-year trend", implication: "Time the conversation before peak season when switching costs are highest" },
      { insight: "Customer has requested quotes on 2 new product lines", implication: "Expansion interest — position stable pricing as a foundation for the new business" },
    ],
    objections: [
      { objection: "We haven’t budgeted for a price increase.", response: "We delayed this as long as possible for that reason. At 2.5%, it’s roughly half the market average — and we’re open to staggered implementation if that helps." },
      { objection: "Why now?", response: "Input costs have been compounding for several quarters. A modest correction now prevents a larger one later and gives you rate certainty through early 2027." },
      { objection: "A competitor quoted us lower.", response: "Our rate includes priority fulfillment, dedicated support, and rush availability. When factoring total cost of service, we consistently benchmark favorably." },
    ],
  },
  "Balanced approach": {
    pctIncrease: "3.5%",
    effectiveDate: "July 15, 2026",
    talkingPoints: [
      "Effective July 15, we’re adjusting pricing by an average of 3.5% across 19 selected items spanning copy paper, forms, envelopes, and labels.",
      "This consolidates several smaller cost-of-goods increases into one transparent adjustment rather than multiple ad-hoc changes.",
      "The new rate structure simplifies pricing across product families — fewer exceptions, more consistency.",
      "Your multi-category volume keeps your overall increase below the market average of 5-6%.",
      "We’ve timed this to align with your Q3 planning cycle so there are no mid-quarter surprises.",
    ],
    serviceLevels: [
      { metric: "Order fulfillment rate", current: "97.2%", commitment: "Improve to 98%+ with supply chain investment" },
      { metric: "Average lead time", current: "3.2 days", commitment: "Target 2.5 days with new distribution model" },
      { metric: "Product availability", current: "94% in-stock rate", commitment: "Increase to 96% through safety stock expansion" },
      { metric: "Pricing lock period", current: "Quarterly review", commitment: "Lock new rates through March 2027" },
    ],
    buyingPatterns: [
      { insight: "Customer purchases across 5 categories (copy paper, specialty, forms, envelopes, labels) with no single-source dependency", implication: "Breadth gives us leverage to frame this as a portfolio-wide value proposition" },
      { insight: "Reorder cycle is predictable at 18-day intervals", implication: "Stable cadence means the per-order cost impact is small and absorbable" },
      { insight: "20% of SKUs account for 65% of total spend", implication: "High-volume items get the most competitive rates; tail SKUs absorb the larger adjustments" },
      { insight: "Customer has not evaluated alternatives in 2+ years", implication: "Low switching momentum, but don’t over-leverage — maintain trust with transparency" },
    ],
    objections: [
      { objection: "We’ve already seen several increases this year.", response: "This adjustment actually consolidates prior ad-hoc changes into one consistent structure. Going forward, you’ll see fewer, more predictable updates." },
      { objection: "Competitor X is offering lower rates.", response: "We’ve evaluated those comparisons. Our pricing reflects full service — reliability, lead times, and dedicated support — not just unit cost." },
      { objection: "Shouldn’t our multi-category volume earn a better rate?", response: "It already does. Your cross-category purchasing is why you’re at 3.5% when comparable single-category accounts are seeing 5%+." },
    ],
  },
  "Moderately aggressive": {
    pctIncrease: "5.5%",
    effectiveDate: "July 1, 2026",
    talkingPoints: [
      "Effective July 1, we’re implementing a 5.5% pricing correction across your active product lines.",
      "We held pricing flat for 18+ months while input costs rose 12% — this adjustment closes that gap in one move.",
      "This is a correction, not a trend. We’ve structured it so future adjustments will be incremental, not catch-up.",
      "High-volume items carry tiered rates — your top SKUs see a lower increase than the portfolio average.",
      "The new pricing locks through Q1 2027 with no additional adjustments planned.",
    ],
    serviceLevels: [
      { metric: "Order fulfillment rate", current: "97.2%", commitment: "Guarantee 98.5%+ with dedicated inventory allocation" },
      { metric: "Average lead time", current: "3.2 days", commitment: "Priority lane: 2-day standard, next-day rush" },
      { metric: "Dedicated account team", current: "Shared rep", commitment: "Upgrade to named account manager + technical specialist" },
      { metric: "Quarterly business review", current: "Ad hoc", commitment: "Scheduled QBR with pricing and demand forecasting" },
    ],
    buyingPatterns: [
      { insight: "Spend has plateaued over the last 3 quarters despite category expansion", implication: "Growth has stalled — frame the price correction as enabling investment in the account" },
      { insight: "Customer’s reorder frequency dropped 15% but average order size grew 20%", implication: "Consolidation pattern — they’re optimizing logistics, not reducing demand" },
      { insight: "40% of active SKUs are priced below current market floor", implication: "Significant margin exposure — this is the primary driver for the correction" },
      { insight: "Customer submitted an RFQ for two new product lines last month", implication: "Expansion intent gives us room to anchor the correction against future value" },
    ],
    objections: [
      { objection: "That’s a significant increase.", response: "It is — and it’s intentional. We absorbed 18 months of rising costs so you wouldn’t face rolling increases. This one correction brings us to a sustainable baseline." },
      { objection: "We’ll need to evaluate alternatives.", response: "We encourage that. Our total cost of ownership — reliability, lead times, dedicated support — positions this as a value investment, not just a price change." },
      { objection: "Can we negotiate on specific lines?", response: "We’ve already tiered the adjustments — your highest-volume items carry a lower rate. We can walk through the breakdown together." },
    ],
  },
  "Maximize capture": {
    pctIncrease: "8.0%",
    effectiveDate: "June 15, 2026",
    talkingPoints: [
      "Effective June 15, we’re moving to market-rate pricing across your full product catalog — an average adjustment of 8%.",
      "Historical pricing reflected introductory and retention discounts that are no longer sustainable at current cost levels.",
      "The new rate aligns with what comparable accounts pay and reflects the full value of our service tier.",
      "This is a one-time correction — no further adjustments are planned through 2027.",
      "We’re pairing this with enhanced service commitments to ensure the value behind every dollar is clear.",
    ],
    serviceLevels: [
      { metric: "Order fulfillment rate", current: "97.2%", commitment: "Guarantee 99%+ with reserved capacity allocation" },
      { metric: "Average lead time", current: "3.2 days", commitment: "Priority fulfillment: 1-2 day standard across all orders" },
      { metric: "Dedicated account team", current: "Shared rep", commitment: "Named account director + solution engineer + CSM" },
      { metric: "Supply guarantee", current: "Best effort", commitment: "Contractual supply guarantee with penalty SLA" },
      { metric: "Innovation access", current: "General availability", commitment: "Early access to new products and beta programs" },
    ],
    buyingPatterns: [
      { insight: "Account has been on legacy pricing for 3+ years with no rate adjustment", implication: "Largest gap-to-market in the portfolio — correction is overdue and defensible" },
      { insight: "Customer’s total spend ranks in the top 15% of the book but margin contribution is bottom 25%", implication: "Revenue is strong but profitability is unsustainable — this rebalances the relationship" },
      { insight: "Purchase velocity is high and accelerating — 3.1 orders/month, up from 2.4 last year", implication: "Strong demand signals low churn risk even with an aggressive correction" },
      { insight: "No competitive evaluation initiated despite internal budget reviews", implication: "Switching costs are high for this account — supports a confident posture" },
    ],
    objections: [
      { objection: "This is far above what we’ve paid historically.", response: "Historical pricing reflected introductory discounts that predate current cost structures. The new rate is in line with what comparable accounts pay for this service tier." },
      { objection: "We’ll need to go to bid.", response: "We support that. Our RFP data shows this rate is competitive for the SLAs and service level included. We’re confident in a transparent comparison." },
      { objection: "Why such a large single increase?", response: "One correction gives you pricing certainty through 2027 — no rolling increases, no surprises. We chose clarity over incremental uncertainty." },
    ],
  },
};

interface SelectedProduct {
  sku: string;
  name: string;
  category: string;
  currentPrice: number;
  proposedPrice: number;
  annualVolume: number;
}

const SELECTED_PRODUCTS: SelectedProduct[] = [
  { sku: "CPY-2080", name: "Premium Copy Paper 20lb 8.5x11", category: "Copy Paper", currentPrice: 42.50, proposedPrice: 43.99, annualVolume: 12400 },
  { sku: "CPY-2081", name: "Premium Copy Paper 20lb 11x17", category: "Copy Paper", currentPrice: 68.00, proposedPrice: 70.38, annualVolume: 3200 },
  { sku: "CPY-2490", name: "Recycled Copy Paper 20lb 8.5x11", category: "Copy Paper", currentPrice: 44.75, proposedPrice: 46.32, annualVolume: 8600 },
  { sku: "CPY-2495", name: "Bright White 24lb 8.5x11", category: "Copy Paper", currentPrice: 52.00, proposedPrice: 53.82, annualVolume: 6800 },
  { sku: "CPY-3200", name: "Color Copy Paper 28lb 8.5x11", category: "Specialty Paper", currentPrice: 78.50, proposedPrice: 81.25, annualVolume: 2100 },
  { sku: "CPY-3210", name: "Cardstock 65lb 8.5x11", category: "Specialty Paper", currentPrice: 94.00, proposedPrice: 97.29, annualVolume: 1450 },
  { sku: "CPY-3215", name: "Glossy Presentation Paper 32lb", category: "Specialty Paper", currentPrice: 112.00, proposedPrice: 115.92, annualVolume: 890 },
  { sku: "FRM-4010", name: "3-Part Carbonless Forms 8.5x11", category: "Forms", currentPrice: 156.00, proposedPrice: 161.46, annualVolume: 4200 },
  { sku: "FRM-4015", name: "2-Part Carbonless Forms 8.5x11", category: "Forms", currentPrice: 124.00, proposedPrice: 128.34, annualVolume: 5600 },
  { sku: "FRM-4050", name: "Continuous Feed Forms 9.5x11", category: "Forms", currentPrice: 89.00, proposedPrice: 92.12, annualVolume: 3100 },
  { sku: "FRM-4080", name: "Custom Invoice Forms 3-Part", category: "Forms", currentPrice: 210.00, proposedPrice: 217.35, annualVolume: 1800 },
  { sku: "ENV-5010", name: "#10 Business Envelopes White", category: "Envelopes", currentPrice: 34.00, proposedPrice: 35.19, annualVolume: 18200 },
  { sku: "ENV-5020", name: "#10 Window Envelopes", category: "Envelopes", currentPrice: 38.50, proposedPrice: 39.85, annualVolume: 14500 },
  { sku: "ENV-5040", name: "9x12 Catalog Envelopes Kraft", category: "Envelopes", currentPrice: 62.00, proposedPrice: 64.17, annualVolume: 4800 },
  { sku: "ENV-5060", name: "6x9 Booklet Envelopes White", category: "Envelopes", currentPrice: 48.00, proposedPrice: 49.68, annualVolume: 3600 },
  { sku: "LBL-6010", name: "Shipping Labels 2x4 (1000/box)", category: "Labels", currentPrice: 28.50, proposedPrice: 29.50, annualVolume: 9200 },
  { sku: "LBL-6020", name: "Address Labels 1x2.625 (3000/box)", category: "Labels", currentPrice: 32.00, proposedPrice: 33.12, annualVolume: 7400 },
  { sku: "LBL-6050", name: "File Folder Labels (1500/box)", category: "Labels", currentPrice: 24.00, proposedPrice: 24.84, annualVolume: 5100 },
  { sku: "LBL-6080", name: "Thermal Labels 4x6 (500/roll)", category: "Labels", currentPrice: 18.75, proposedPrice: 19.41, annualVolume: 11300 },
];

const priceFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
const volFmt = new Intl.NumberFormat("en-US");

const QUICK_ACTIONS = [
  "Generate Email For Customers",
  "Make It Shorter",
  "Rewrite for An Executive Audience",
  "Add a closing line inviting a follow-up meeting",
  "Create a call script outline",
];

const tableCellSx = {
  fontFamily: "Inter, Roboto, sans-serif",
  fontSize: 13,
  fontWeight: 400,
  color: "#000",
  borderBottom: "1px solid #eee",
  py: 1.5,
  px: 2,
  verticalAlign: "top" as const,
};

const sliderSx = {
  flex: 1,
  color: "#185FA5",
  height: 6,
  "& .MuiSlider-thumb": {
    width: 16,
    height: 16,
    bgcolor: "white",
    border: "2px solid #185FA5",
    boxShadow: "none",
    "&:hover, &.Mui-focusVisible": { boxShadow: "0 0 0 6px rgba(24,95,165,0.15)" },
  },
  "& .MuiSlider-track": { border: "none" },
  "& .MuiSlider-rail": { bgcolor: "rgba(0,0,0,0.12)" },
};

function RadarChart({
  driverValues,
  drivers,
}: {
  driverValues: Record<string, number>;
  drivers: DriverConfig[];
}) {
  const cx = 100, cy = 100, radius = 60;
  const n = drivers.length;

  const getPoint = (index: number, value: number, maxVal = 2) => {
    const angle = (Math.PI * 2 * index) / n - Math.PI / 2;
    const dist = (value / maxVal) * radius;
    return { x: cx + dist * Math.cos(angle), y: cy + dist * Math.sin(angle) };
  };

  const toPolygon = (values: number[]) =>
    values.map((v, i) => {
      const p = getPoint(i, v);
      return `${p.x},${p.y}`;
    }).join(" ");

  const currentValues = drivers.map((d) => driverValues[d.key]);
  const aiValues = drivers.map((d) => d.aiValue);
  const gridLevels = [0.67, 1.33, 2];

  return (
    <svg viewBox="0 0 200 200" width={140} height={140} style={{ display: "block" }}>
      {gridLevels.map((level, i) => (
        <polygon
          key={i}
          points={Array.from({ length: n }, (_, j) => {
            const p = getPoint(j, level);
            return `${p.x},${p.y}`;
          }).join(" ")}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth="0.75"
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const p = getPoint(i, 2);
        return (
          <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,0,0,0.08)" strokeWidth="0.75" />
        );
      })}
      <polygon
        points={toPolygon(aiValues)}
        fill="rgba(240,139,29,0.10)"
        stroke="#f08b1d"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />
      <polygon
        points={toPolygon(currentValues)}
        fill="rgba(24,95,165,0.15)"
        stroke="#185FA5"
        strokeWidth="1.5"
      />
      {currentValues.map((v, i) => {
        const p = getPoint(i, v);
        return <circle key={i} cx={p.x} cy={p.y} r="3" fill="#185FA5" />;
      })}
      {RADAR_LABELS.map((label, i) => {
        const p = getPoint(i, 2.8);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fill="rgba(0,0,0,0.45)"
            fontFamily="Inter, sans-serif"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

function GeneratedContent({ posture }: { posture: string }) {
  const content = STRATEGY_BY_POSTURE[posture] || STRATEGY_BY_POSTURE["Balanced approach"];

  const sectionHeadingSx = { fontSize: 16, fontWeight: 700, color: "#000", mb: 2, display: "flex", alignItems: "center", gap: 1 };
  const sectionIconSx = { fontSize: 20, color: "rgba(0,0,0,0.45)" };

  return (
    <Paper elevation={0} sx={{ bgcolor: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", p: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#f08b1d", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography sx={{ color: "white", fontSize: 14, fontWeight: 700 }}>A</Typography>
          </Box>
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            <Box component="span" sx={{ color: "rgba(0,0,0,0.54)" }}>Ask</Box>
            <Box component="span" sx={{ color: "#f08b1d" }}>Tempo</Box>
            <Box component="span" sx={{ color: "rgba(0,0,0,0.54)" }}> AI</Box>
          </Typography>
        </Box>
        <Chip
          label={`${content.pctIncrease} avg increase · effective ${content.effectiveDate}`}
          size="small"
          sx={{ bgcolor: "#f5f5f5", color: "rgba(0,0,0,0.6)", fontSize: 11, fontWeight: 500, height: 26 }}
        />
      </Box>

      <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#000", mb: 0.5 }}>
        Pre-Call Strategy: Cornerstone Financial
      </Typography>
      <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.45)", mb: 3 }}>
        Posture: {posture} &middot; {SELECTED_PRODUCTS.length} prices selected
      </Typography>

      {/* Talking Points */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={sectionHeadingSx}>
          <DescriptionIcon sx={sectionIconSx} />
          Talking Points
        </Typography>
        <Box component="ol" sx={{ pl: 2.5, m: 0, "& li": { fontSize: 13, color: "#000", mb: 1, lineHeight: 1.7, pl: 0.5 } }}>
          {content.talkingPoints.map((tp, i) => <li key={i}>{tp}</li>)}
        </Box>
      </Box>

      <Divider sx={{ mb: 3.5 }} />

      {/* Service Levels */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={sectionHeadingSx}>
          <AutoAwesomeIcon sx={sectionIconSx} />
          Service Level Commitments
        </Typography>
        <TableContainer sx={{ border: "1px solid #eee", borderRadius: "6px" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ ...tableCellSx, fontWeight: 600, color: "rgba(0,0,0,0.7)", borderBottom: "1px solid #ddd" }}>Metric</TableCell>
                <TableCell sx={{ ...tableCellSx, fontWeight: 600, color: "rgba(0,0,0,0.7)", borderBottom: "1px solid #ddd", textAlign: "center" }}>Current</TableCell>
                <TableCell sx={{ ...tableCellSx, fontWeight: 600, color: "rgba(0,0,0,0.7)", borderBottom: "1px solid #ddd" }}>Post-Adjustment Commitment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.serviceLevels.map((row, idx) => (
                <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? "#fff" : "#fafafa", "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={{ ...tableCellSx, fontWeight: 500 }}>{row.metric}</TableCell>
                  <TableCell sx={{ ...tableCellSx, textAlign: "center", color: "rgba(0,0,0,0.55)" }}>{row.current}</TableCell>
                  <TableCell sx={{ ...tableCellSx, color: "#0F6E56", fontWeight: 500 }}>{row.commitment}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Divider sx={{ mb: 3.5 }} />

      {/* Buying Patterns */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={sectionHeadingSx}>
          <DescriptionIcon sx={sectionIconSx} />
          Buying Pattern Analysis
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {content.buyingPatterns.map((bp, idx) => (
            <Box key={idx} sx={{ bgcolor: idx % 2 === 0 ? "#f8fafb" : "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "6px", px: 2, py: 1.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", lineHeight: 1.5, mb: 0.5 }}>
                {bp.insight}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>
                {bp.implication}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 3.5 }} />

      {/* Anticipated Objections */}
      <Box>
        <Typography sx={sectionHeadingSx}>
          <DescriptionIcon sx={sectionIconSx} />
          Anticipated Objections
        </Typography>
        <TableContainer sx={{ border: "1px solid #eee", borderRadius: "6px" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ ...tableCellSx, fontWeight: 600, color: "rgba(0,0,0,0.7)", width: "38%", borderBottom: "1px solid #ddd" }}>Objection</TableCell>
                <TableCell sx={{ ...tableCellSx, fontWeight: 600, color: "rgba(0,0,0,0.7)", borderBottom: "1px solid #ddd" }}>Recommended Response</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {content.objections.map((row, idx) => (
                <TableRow key={idx} sx={{ bgcolor: idx % 2 === 0 ? "#fff" : "#fafafa", "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={tableCellSx}>{row.objection}</TableCell>
                  <TableCell sx={tableCellSx}>{row.response}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
}

const STATUS_OPTIONS = [
  { key: "draft", label: "Draft", color: "#757575", bgcolor: "#eeeeee", icon: <DraftIcon sx={{ fontSize: 16 }} /> },
  { key: "finalized", label: "Finalized", color: "#1565c0", bgcolor: "#e3f2fd", icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
  { key: "sent", label: "Sent To Customer", color: "#ffffff", bgcolor: "#2e7d32", icon: <SentIcon sx={{ fontSize: 16 }} /> },
  { key: "accepted", label: "Customer Accepted", color: "#ffffff", bgcolor: "#00695c", icon: <AcceptedIcon sx={{ fontSize: 16 }} /> },
  { key: "declined", label: "Customer Declined", color: "#ffffff", bgcolor: "#c62828", icon: <DeclinedIcon sx={{ fontSize: 16 }} /> },
  { key: "archived", label: "Archived", color: "rgba(0,0,0,0.6)", bgcolor: "#e0e0e0", icon: <ArchiveIcon sx={{ fontSize: 16 }} /> },
];

const PLAN_HISTORY = [
  { id: 1, date: "Jun 3, 2026", label: "Initial strategy — +3.5% across 19 selected products", status: "draft" },
  { id: 2, date: "May 28, 2026", label: "Revised approach — focused on specialty lines", status: "declined" },
  { id: 3, date: "May 15, 2026", label: "Exploratory — broad category adjustment", status: "sent" },
];

export default function PreCallPlanPage() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [status, setStatus] = useState("draft");
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [driverValues, setDriverValues] = useState<Record<string, number>>(
    Object.fromEntries(SLIDER_DRIVERS.map((d) => [d.key, d.defaultValue]))
  );
  const [aiApplied, setAiApplied] = useState<Record<string, boolean>>({});
  const [aiBannerState, setAiBannerState] = useState<"suggest" | "applying" | "applied">("suggest");
  const [buyingPriority, setBuyingPriority] = useState("Speed of service");
  const [message, setMessage] = useState("");
  const [chatFocused, setChatFocused] = useState(false);
  const [chatState, setChatState] = useState<"idle" | "sent" | "responding" | "done">("idle");
  const [contentState, setContentState] = useState<"empty" | "loading" | "generated">("empty");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedPosture, setGeneratedPosture] = useState("");
  const generateTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  const PREPOPULATED_MSG = "What if the customer asks for a volume-based discount instead of accepting the flat increase?";

  const posture = useMemo(() => {
    const total = SLIDER_DRIVERS.reduce((sum, d) => {
      const val = driverValues[d.key];
      return sum + d.aggressiveness[val];
    }, 0);
    const max = SLIDER_DRIVERS.length * 2;
    const pct = Math.round((total / max) * 100);
    const idx = Math.min(4, Math.floor(pct / 25));
    return { pct, descriptor: HEAT_DESCRIPTORS[idx] };
  }, [driverValues]);

  const aiDriverCount = Object.keys(aiApplied).length;

  const updateDriver = (key: string, value: number) => {
    setDriverValues((prev) => ({ ...prev, [key]: value }));
    if (aiApplied[key]) {
      setAiApplied((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const applyAI = () => {
    setAiBannerState("applying");
    const applied: Record<string, boolean> = {};
    SLIDER_DRIVERS.forEach((d, i) => {
      setTimeout(() => {
        setDriverValues((prev) => ({ ...prev, [d.key]: d.aiValue }));
        applied[d.key] = true;
        setAiApplied({ ...applied });
        if (i === SLIDER_DRIVERS.length - 1) {
          setTimeout(() => setAiBannerState("applied"), 400);
        }
      }, 300 * (i + 1));
    });
  };

  const resetAll = () => {
    setDriverValues(Object.fromEntries(SLIDER_DRIVERS.map((d) => [d.key, d.defaultValue])));
    setAiApplied({});
    setAiBannerState("suggest");
  };

  const handleGenerate = () => {
    generateTimers.current.forEach(clearTimeout);
    generateTimers.current = [];
    setGeneratedPosture(posture.descriptor);
    setContentState("loading");
    const stages = [
      "Analyzing account history and pricing data…",
      "Evaluating customer sensitivity and risk factors…",
      "Building objection-response framework…",
      "Generating communication strategy…",
    ];
    setLoadingMessage(stages[0]);
    stages.forEach((msg, i) => {
      if (i === 0) return;
      const t = setTimeout(() => setLoadingMessage(msg), i * 1500);
      generateTimers.current.push(t);
    });
    const done = setTimeout(() => setContentState("generated"), stages.length * 1500);
    generateTimers.current.push(done);
  };

  useEffect(() => () => generateTimers.current.forEach(clearTimeout), []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setChatState("sent");
    setMessage("");
    setTimeout(() => {
      setChatState("responding");
      setTimeout(() => {
        setChatState("done");
        setTimeout(() => {
          if (contentRef.current) contentRef.current.scrollTo({ top: contentRef.current.scrollHeight, behavior: "smooth" });
        }, 50);
      }, 2500);
    }, 400);
  };

  return (
    <AppShell>
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Left Sidebar - Set Drivers */}
        <Box
            sx={{
              width: 380,
              flexShrink: 0,
              borderRight: "1px solid rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
              position: "relative",
            }}
          >
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {/* Radar Chart & Pricing Posture */}
              <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "flex-start" }}>
                  <Box sx={{ flexShrink: 0 }}>
                    <RadarChart driverValues={driverValues} drivers={SLIDER_DRIVERS} />
                  </Box>
                  <Box sx={{ flex: 1, pt: 0.5 }}>
                    <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.05em", mb: 0.25 }}>
                      Pricing posture
                    </Typography>
                    <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#000", mb: 1.25 }}>
                      {posture.descriptor}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                      {SLIDER_DRIVERS.map((d) => {
                        const val = driverValues[d.key];
                        const badge = d.badgeStyles[val];
                        return (
                          <Box key={d.key} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                            <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)", width: 58, flexShrink: 0 }}>
                              {RADAR_LABELS[SLIDER_DRIVERS.indexOf(d)]}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 11,
                                fontWeight: 500,
                                px: 1,
                                py: 0.25,
                                borderRadius: "20px",
                                border: `1.5px solid ${badge.color}30`,
                                color: badge.color,
                                lineHeight: 1.3,
                                whiteSpace: "nowrap",
                              }}
                            >
                              {d.labels[val]}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 2.5, mt: 1.25, pl: 0.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#185FA5" }} />
                    <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.45)" }}>Your settings</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f08b1d" }} />
                    <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.45)" }}>AI suggested</Typography>
                  </Box>
                </Box>
              </Box>

              {/* AI Suggestion Banner */}
              <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: "6px",
                    bgcolor: "#E6F1FB",
                    border: "1px solid #85B7EB",
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 16, color: "#185FA5", flexShrink: 0 }} />
                  {aiBannerState === "suggest" ? (
                    <>
                      <Typography sx={{ fontSize: 12, color: "#0C447C", flex: 1, lineHeight: 1.4 }}>
                        AI has suggested drivers based on this account&apos;s data.
                      </Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={applyAI}
                        sx={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: "#185FA5",
                          borderColor: "#85B7EB",
                          textTransform: "none",
                          px: 1,
                          py: 0.25,
                          minWidth: 0,
                          "&:hover": { bgcolor: "#B5D4F4", borderColor: "#85B7EB" },
                        }}
                      >
                        Apply
                      </Button>
                    </>
                  ) : aiBannerState === "applying" ? (
                    <>
                      <CircularProgress size={12} sx={{ color: "#185FA5", flexShrink: 0 }} />
                      <Typography sx={{ fontSize: 12, color: "#0C447C", flex: 1, lineHeight: 1.4 }}>
                        Analyzing account data and setting drivers&hellip;
                      </Typography>
                    </>
                  ) : (
                    <Typography sx={{ fontSize: 12, color: "#0C447C", flex: 1, lineHeight: 1.4 }}>
                      AI drivers applied. Hover the{" "}
                      <Box
                        component="span"
                        sx={{
                          display: "inline-block",
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: "#185FA5",
                          verticalAlign: "middle",
                          mx: 0.25,
                        }}
                      />
                      {" "}dot on any driver to see why. Adjust freely.
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Manual Drivers Section */}
              <Box sx={{ px: 2.5, pt: 1.5, pb: 0.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Manual drivers
                  </Typography>
                  <Typography
                    onClick={resetAll}
                    sx={{ fontSize: 11, color: "rgba(0,0,0,0.4)", cursor: "pointer", "&:hover": { color: "rgba(0,0,0,0.6)" } }}
                  >
                    Reset all
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                  {SLIDER_DRIVERS.map((driver) => {
                    const value = driverValues[driver.key];
                    const badge = driver.badgeStyles[value];
                    const isAi = aiApplied[driver.key];

                    return (
                      <Box key={driver.key} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: 130, flexShrink: 0 }}>
                          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#000", lineHeight: 1.3 }}>
                            {driver.label}
                          </Typography>
                          {isAi ? (
                            <Tooltip
                              title={driver.aiReason}
                              arrow
                              placement="top"
                              slotProps={{
                                tooltip: {
                                  sx: {
                                    bgcolor: "white",
                                    color: "#0C447C",
                                    border: "1px solid #85B7EB",
                                    fontSize: 11,
                                    lineHeight: 1.5,
                                    maxWidth: 220,
                                    p: 1.25,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                  },
                                },
                                arrow: { sx: { color: "white", "&::before": { border: "1px solid #85B7EB" } } },
                              }}
                            >
                              <Box
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: "50%",
                                  bgcolor: "#185FA5",
                                  cursor: "pointer",
                                  flexShrink: 0,
                                }}
                              />
                            </Tooltip>
                          ) : (
                            <InfoIcon sx={{ fontSize: 13, color: "rgba(0,0,0,0.2)", flexShrink: 0 }} />
                          )}
                        </Box>
                        <Slider
                          value={value}
                          min={0}
                          max={2}
                          step={1}
                          onChange={(_, v) => updateDriver(driver.key, v as number)}
                          sx={{ ...sliderSx, flex: 1 }}
                        />
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 600,
                            px: 1,
                            py: 0.25,
                            borderRadius: "20px",
                            bgcolor: badge.bg,
                            color: badge.color,
                            whiteSpace: "nowrap",
                            minWidth: 52,
                            textAlign: "center",
                            flexShrink: 0,
                          }}
                        >
                          {driver.labels[value]}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Divider sx={{ my: 1.5 }} />

                {/* Customer Buying Priority */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: 130, flexShrink: 0 }}>
                    <TuneIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.35)" }} />
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#000" }}>
                      Buying priority
                    </Typography>
                  </Box>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <Select
                      value={buyingPriority}
                      onChange={(e) => setBuyingPriority(e.target.value)}
                      sx={{ fontSize: 12, bgcolor: "rgba(0,0,0,0.02)", borderRadius: "6px", "& .MuiSelect-select": { py: 0.625 } }}
                    >
                      <MenuItem value="Speed of service">Speed of service</MenuItem>
                      <MenuItem value="Price sensitivity">Price sensitivity</MenuItem>
                      <MenuItem value="Product quality">Product quality</MenuItem>
                      <MenuItem value="Relationship trust">Relationship trust</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>

            {/* Plan History trigger */}
            <Box
              onClick={() => setHistoryOpen(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2.5,
                py: 1.25,
                borderTop: "1px solid rgba(0,0,0,0.06)",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
              }}
            >
              <HistoryIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.4)" }} />
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)", flex: 1 }}>
                Plan history
              </Typography>
              <Typography
                sx={{
                  fontSize: 11,
                  px: 0.875,
                  py: 0.125,
                  borderRadius: "20px",
                  bgcolor: "rgba(0,0,0,0.04)",
                  color: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                {PLAN_HISTORY.length}
              </Typography>
              <ExpandMoreIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.4)", transform: "rotate(-90deg)" }} />
            </Box>

            {/* Plan History overlay */}
            {historyOpen && (
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "white",
                  zIndex: 10,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 2.5, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <IconButton size="small" onClick={() => setHistoryOpen(false)} sx={{ color: "rgba(0,0,0,0.5)", mr: 0.5 }}>
                    <ExpandMoreIcon sx={{ fontSize: 18, transform: "rotate(90deg)" }} />
                  </IconButton>
                  <HistoryIcon sx={{ fontSize: 18, color: "#00446a" }} />
                  <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#000", flex: 1 }}>
                    Plan History
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>
                    {PLAN_HISTORY.length} versions
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 1 }}>
                  {PLAN_HISTORY.map((plan) => {
                    const sc = STATUS_OPTIONS.find((s) => s.key === plan.status) || STATUS_OPTIONS[0];
                    return (
                      <Box
                        key={plan.id}
                        sx={{
                          py: 1.5,
                          borderBottom: "1px solid rgba(0,0,0,0.05)",
                          "&:last-child": { borderBottom: "none" },
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          cursor: "pointer",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                          mx: -1,
                          px: 1,
                          borderRadius: "6px",
                        }}
                      >
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "rgba(0,0,0,0.7)" }}>
                              {plan.date}
                            </Typography>
                            <Chip
                              label={sc.label}
                              size="small"
                              sx={{
                                height: 20,
                                bgcolor: sc.bgcolor,
                                color: sc.color,
                                fontWeight: 500,
                                fontSize: 10,
                                borderRadius: "10px",
                                "& .MuiChip-label": { px: 0.75 },
                              }}
                            />
                          </Box>
                          <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", lineHeight: 1.4 }}>
                            {plan.label}
                          </Typography>
                        </Box>
                        <IconButton size="small" sx={{ color: "rgba(0,0,0,0.25)", mt: 0.25, flexShrink: 0 }}>
                          <OpenInNewIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* Generate Strategy CTA */}
            <Box sx={{ px: 2.5, py: 1.5, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleGenerate}
                disabled={contentState === "loading"}
                startIcon={
                  contentState === "loading"
                    ? <CircularProgress size={16} color="inherit" />
                    : contentState === "generated"
                      ? <RefreshIcon />
                      : <AutoAwesomeIcon />
                }
                sx={{
                  bgcolor: contentState === "generated" ? "#00446a" : "#D97C14",
                  color: "white",
                  fontWeight: 500,
                  fontSize: 14,
                  textTransform: "none",
                  py: 1.25,
                  borderRadius: "6px",
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: contentState === "generated" ? "#003354" : "#C06B10",
                    boxShadow: "none",
                  },
                  "&.Mui-disabled": { bgcolor: "rgba(0,0,0,0.12)", color: "rgba(0,0,0,0.38)" },
                }}
              >
                {contentState === "loading"
                  ? "Generating…"
                  : contentState === "generated"
                    ? "Regenerate Strategy"
                    : "Generate strategy"}
              </Button>
            </Box>
          </Box>

        {/* Main content area */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#f5f5f5" }}>
          {/* Title bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              px: 4,
              py: 1.5,
              bgcolor: "white",
              borderBottom: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            <Typography sx={{ fontWeight: 400, color: "#00446a", fontSize: 24, letterSpacing: "0.25px" }}>
              Communication Strategy | Cornerstone Financial
            </Typography>
            {(() => {
              const current = STATUS_OPTIONS.find((s) => s.key === status) || STATUS_OPTIONS[0];
              return (
                <>
                  <Chip
                    icon={<Box sx={{ display: "flex", color: `${current.color} !important` }}>{current.icon}</Box>}
                    label={current.label}
                    deleteIcon={<ArrowDownIcon sx={{ fontSize: 18, color: `${current.color} !important` }} />}
                    onDelete={(e) => setStatusAnchor(e.currentTarget as HTMLElement)}
                    onClick={(e) => setStatusAnchor(e.currentTarget)}
                    size="small"
                    sx={{
                      bgcolor: current.bgcolor,
                      color: current.color,
                      fontWeight: 500,
                      fontSize: 12,
                      height: 30,
                      borderRadius: "15px",
                      cursor: "pointer",
                      "& .MuiChip-icon": { ml: 0.5 },
                    }}
                  />
                  <Menu
                    anchorEl={statusAnchor}
                    open={Boolean(statusAnchor)}
                    onClose={() => setStatusAnchor(null)}
                    slotProps={{ paper: { sx: { mt: 0.5, minWidth: 200, borderRadius: "8px", boxShadow: "0 4px 20px rgba(0,0,0,0.12)" } } }}
                  >
                    {STATUS_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.key}
                        selected={option.key === status}
                        onClick={() => { setStatus(option.key); setStatusAnchor(null); }}
                        sx={{ py: 1, px: 2, gap: 1.5, fontSize: 13 }}
                      >
                        <ListItemIcon sx={{ minWidth: "auto !important", color: option.key === status ? "#00446a" : "rgba(0,0,0,0.54)" }}>
                          {option.icon}
                        </ListItemIcon>
                        <ListItemText slotProps={{ primary: { sx: { fontSize: 13 } } }}>
                          {option.label}
                        </ListItemText>
                        {option.key === status && (
                          <CheckCircleIcon sx={{ fontSize: 16, color: "#00446a", ml: 1 }} />
                        )}
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              );
            })()}
            <Box sx={{ flex: 1 }} />
            <Button
              variant="outlined"
              onClick={() => setSelectionOpen(true)}
              startIcon={<InventoryIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: "#00446a",
                borderColor: "#00446a",
                fontWeight: 600,
                fontSize: 12,
                textTransform: "none",
                letterSpacing: "0.25px",
                "&:hover": { bgcolor: "#00446a", color: "white", borderColor: "#00446a" },
              }}
            >
              View Selection ({SELECTED_PRODUCTS.length})
            </Button>
          </Box>

          {/* Content states */}
          {contentState === "empty" ? (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", px: 4 }}>
              <Box sx={{ width: 72, height: 72, borderRadius: "50%", bgcolor: "rgba(240,139,29,0.08)", display: "flex", alignItems: "center", justifyContent: "center", mb: 2.5 }}>
                <AutoAwesomeIcon sx={{ fontSize: 36, color: "#f08b1d" }} />
              </Box>
              <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#00446a", mb: 1.5 }}>
                Generate Communication Strategy
              </Typography>
              <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.5)", textAlign: "center", maxWidth: 480, lineHeight: 1.7, mb: 1 }}>
                Adjust the drivers on the left to match this customer&rsquo;s profile, then hit <strong>Generate Strategy</strong> to create a tailored pre-call plan.
              </Typography>
              <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.4)", textAlign: "center", maxWidth: 480, lineHeight: 1.7 }}>
                Use <strong>View Selection</strong> to review the products selected for this plan. Return to Tempo to edit your selection.
              </Typography>
            </Box>
          ) : contentState === "loading" ? (
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <CircularProgress size={44} sx={{ color: "#f08b1d", mb: 2.5 }} />
              <Typography
                key={loadingMessage}
                sx={{
                  fontSize: 14,
                  color: "rgba(0,0,0,0.5)",
                  animation: "fadeIn 0.4s ease",
                  "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(4px)" }, to: { opacity: 1, transform: "translateY(0)" } },
                }}
              >
                {loadingMessage}
              </Typography>
            </Box>
          ) : (
            <>
              <Box ref={contentRef} sx={{ flex: 1, overflowY: "auto", px: 4, py: 3 }}>
                <GeneratedContent posture={generatedPosture} />

                {/* Follow-up card */}
                <Paper
                  elevation={0}
                  sx={{
                    mt: 3,
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: "8px",
                    bgcolor: "white",
                    p: 2.5,
                  }}
                >
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", mb: 1.5 }}>
                    Follow up
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {[
                      { icon: <PdfIcon sx={{ fontSize: 16 }} />, label: "Generate PDF for customer delivery", highlighted: true },
                      { icon: <EmailIcon sx={{ fontSize: 16 }} />, label: "Draft email to send with pricing proposal" },
                      { icon: <CopyIcon sx={{ fontSize: 16 }} />, label: "Copy strategy summary to clipboard" },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          cursor: "pointer",
                          py: 0.5,
                          color: item.highlighted ? "#D97C14" : "rgba(0,0,0,0.55)",
                          fontWeight: item.highlighted ? 500 : 400,
                          "&:hover": { color: item.highlighted ? "#C06B10" : "#00446a" },
                          transition: "color 150ms ease",
                        }}
                      >
                        {item.highlighted && (
                          <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#D97C14", flexShrink: 0 }} />
                        )}
                        {item.icon}
                        <Typography sx={{ fontSize: 13, fontWeight: "inherit", color: "inherit" }}>
                          {item.label}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>

                {/* User sent message */}
                {chatState !== "idle" && (
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                    <Box sx={{ bgcolor: "#00446a", color: "white", px: 2.5, py: 1.5, borderRadius: "12px 12px 4px 12px", maxWidth: "70%" }}>
                      <Typography sx={{ fontSize: 13, lineHeight: 1.6 }}>
                        {PREPOPULATED_MSG}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* AI thinking indicator */}
                {chatState === "responding" && (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mt: 2 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#f08b1d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.25 }}>
                      <Typography sx={{ color: "white", fontSize: 14, fontWeight: 700 }}>A</Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, py: 1.5 }}>
                      <CircularProgress size={14} sx={{ color: "#f08b1d" }} />
                      <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.45)", fontStyle: "italic" }}>
                        Analyzing volume discount scenarios&hellip;
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* AI response */}
                {chatState === "done" && (
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mt: 2, animation: "fadeIn 0.4s ease", "@keyframes fadeIn": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } } }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#f08b1d", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.25 }}>
                      <Typography sx={{ color: "white", fontSize: 14, fontWeight: 700 }}>A</Typography>
                    </Box>
                    <Paper elevation={0} sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "4px 12px 12px 12px", p: 2.5, maxWidth: "85%", bgcolor: "white" }}>
                      <Typography sx={{ fontSize: 13, lineHeight: 1.7, color: "#000", mb: 2 }}>
                        This is a common negotiation tactic — here&apos;s how to handle it:
                      </Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", mb: 0.75 }}>
                        Acknowledge the ask, then reframe:
                      </Typography>
                      <Typography sx={{ fontSize: 13, lineHeight: 1.7, color: "rgba(0,0,0,0.7)", mb: 2, fontStyle: "italic", pl: 1.5, borderLeft: "2px solid rgba(0,0,0,0.1)" }}>
                        &ldquo;We understand the desire for volume-based pricing. Let&apos;s look at this together.&rdquo;
                      </Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", mb: 0.75 }}>
                        Key talking points:
                      </Typography>
                      <Box component="ol" sx={{ pl: 2.5, m: 0, mb: 2, "& li": { fontSize: 13, color: "rgba(0,0,0,0.7)", mb: 0.75, lineHeight: 1.7, pl: 0.5 } }}>
                        <li>Your current rates already reflect multi-category volume — this is why you&apos;re at 3.5% when single-category accounts see 5%+.</li>
                        <li>Offer to model a tiered structure: if they commit to a 12-month volume floor, you can lock the new rate through March 2027 with no further adjustments.</li>
                        <li>Position it as a partnership: &ldquo;We&apos;d rather build a structure that rewards your growth than apply a flat number.&rdquo;</li>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", mb: 0.75 }}>
                        What to avoid:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 2, "& li": { fontSize: 13, color: "rgba(0,0,0,0.7)", mb: 0.5, lineHeight: 1.7 } }}>
                        <li>Don&apos;t open with the tiered offer — let them ask for it</li>
                        <li>Don&apos;t discount below the 3.5% average without a firm volume commitment in return</li>
                        <li>Don&apos;t agree to retroactive credits on orders already placed</li>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", mb: 0.75 }}>
                        Fallback position:
                      </Typography>
                      <Typography sx={{ fontSize: 13, lineHeight: 1.7, color: "rgba(0,0,0,0.7)" }}>
                        If they push hard, offer a 60-day price protection window on their top 20 SKUs while you jointly model the volume tier — this buys time without conceding the increase.
                      </Typography>
                    </Paper>
                  </Box>
                )}
              </Box>

              {/* Chat input */}
              <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.1)", px: 4, py: 2, bgcolor: "white", flexShrink: 0 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Send A Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => {
                    if (!chatFocused && chatState === "idle") {
                      setChatFocused(true);
                      setMessage(PREPOPULATED_MSG);
                    }
                  }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendMessage(); }}
                  disabled={chatState === "sent" || chatState === "responding"}
                  sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13 } }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={handleSendMessage}
                            disabled={!message.trim() || chatState === "sent" || chatState === "responding"}
                            sx={{ color: message.trim() ? "#00446a" : "rgba(0,0,0,0.38)" }}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {QUICK_ACTIONS.map((action) => (
                    <Chip
                      key={action}
                      label={action}
                      variant="outlined"
                      size="small"
                      clickable
                      sx={{
                        fontSize: 12,
                        borderColor: "rgba(0,0,0,0.2)",
                        color: "rgba(0,0,0,0.6)",
                        borderRadius: "16px",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.4)" },
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* Selection Modal */}
      <Dialog
        open={selectionOpen}
        onClose={() => setSelectionOpen(false)}
        maxWidth="lg"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: "12px", maxHeight: "80vh" },
          },
        }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <InventoryIcon sx={{ fontSize: 20, color: "#00446a" }} />
              <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#00446a" }}>
                Tempo Price Selection
              </Typography>
            </Box>
            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", mt: 0.5, pl: 3.5 }}>
              {SELECTED_PRODUCTS.length} products selected for Cornerstone Financial &middot; Copy Paper, Specialty, Forms, Envelopes, Labels
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setSelectionOpen(false)} sx={{ color: "rgba(0,0,0,0.4)" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3, pt: 0 }}>
          {(() => {
            const categories = [...new Set(SELECTED_PRODUCTS.map((p) => p.category))];
            return (
              <Box sx={{ display: "flex", gap: 1, mb: 2, mt: 1 }}>
                {categories.map((cat) => {
                  const count = SELECTED_PRODUCTS.filter((p) => p.category === cat).length;
                  return (
                    <Chip
                      key={cat}
                      label={`${cat} (${count})`}
                      size="small"
                      sx={{ fontSize: 11, fontWeight: 500, bgcolor: "#f0f4f8", color: "#00446a", borderRadius: "6px" }}
                    />
                  );
                })}
              </Box>
            );
          })()}
          <TableContainer sx={{ border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px" }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#f5f7fa" }}>
                  {["SKU", "Product", "Category", "Current", "Proposed", "Change", "Annual Vol."].map((h, i) => (
                    <TableCell
                      key={h}
                      sx={{
                        fontFamily: "Inter, Roboto, sans-serif",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "rgba(0,0,0,0.55)",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        borderBottom: "2px solid rgba(0,0,0,0.1)",
                        py: 1.25,
                        px: 1.5,
                        textAlign: i >= 3 ? "right" : "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {SELECTED_PRODUCTS.map((p, idx) => {
                  const pctChange = ((p.proposedPrice - p.currentPrice) / p.currentPrice * 100).toFixed(1);
                  return (
                    <TableRow key={p.sku} sx={{ bgcolor: idx % 2 === 0 ? "#fff" : "#fafbfc", "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell sx={{ ...tableCellSx, fontFamily: "monospace", fontSize: 12, color: "rgba(0,0,0,0.5)", px: 1.5, py: 1.25 }}>{p.sku}</TableCell>
                      <TableCell sx={{ ...tableCellSx, fontWeight: 500, px: 1.5, py: 1.25 }}>{p.name}</TableCell>
                      <TableCell sx={{ ...tableCellSx, color: "rgba(0,0,0,0.55)", px: 1.5, py: 1.25 }}>{p.category}</TableCell>
                      <TableCell sx={{ ...tableCellSx, textAlign: "right", px: 1.5, py: 1.25 }}>{priceFmt.format(p.currentPrice)}</TableCell>
                      <TableCell sx={{ ...tableCellSx, textAlign: "right", fontWeight: 500, px: 1.5, py: 1.25 }}>{priceFmt.format(p.proposedPrice)}</TableCell>
                      <TableCell sx={{ ...tableCellSx, textAlign: "right", color: "#B85C18", fontWeight: 600, px: 1.5, py: 1.25 }}>+{pctChange}%</TableCell>
                      <TableCell sx={{ ...tableCellSx, textAlign: "right", color: "rgba(0,0,0,0.55)", px: 1.5, py: 1.25 }}>{volFmt.format(p.annualVolume)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
