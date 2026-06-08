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
import { jsPDF } from "jspdf";
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
    defaultValue: 0,
    labels: ["Low", "Medium", "High"],
    endLabels: ["Low", "High"],
    badgeStyles: [
      { bg: "#FAECE7", color: "#993C1D" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#E1F5EE", color: "#0F6E56" },
    ],
    aggressiveness: [0, 1, 2],
    aiValue: 2,
    aiReason: "Set to High — Meridian has an active CFO sponsor and is a top-10 strategic account. They've never issued an RFP in 8 years, signaling deep trust and low flight risk.",
  },
  {
    key: "relationship",
    label: "Relationship length",
    defaultValue: 1,
    labels: ["Low", "Medium", "High"],
    endLabels: ["Low", "High"],
    badgeStyles: [
      { bg: "#FAECE7", color: "#993C1D" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#E1F5EE", color: "#0F6E56" },
    ],
    aggressiveness: [2, 1, 0],
    aiValue: 2,
    aiReason: "Set to High — 8 years across Audit, Tax, and Advisory with zero churn flags. Deep institutional knowledge the client can't easily replace. This is leverage for a confident pricing conversation.",
  },
  {
    key: "priceSensitivity",
    label: "Price sensitivity",
    defaultValue: 2,
    labels: ["Low", "Medium", "High"],
    endLabels: ["Low", "High"],
    badgeStyles: [
      { bg: "#E1F5EE", color: "#0F6E56" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#FAECE7", color: "#993C1D" },
    ],
    aggressiveness: [2, 1, 0],
    aiValue: 0,
    aiReason: "Set to Low — Meridian accepted 6%, 7.8%, and 8.1% increases over 3 consecutive cycles without pushback. Their CFO mentioned fee transparency but never challenged the amounts. The data says they'll absorb more.",
  },
  {
    key: "breadth",
    label: "Breadth of services",
    defaultValue: 0,
    labels: ["Narrow", "Moderate", "Broad"],
    endLabels: ["Narrow", "Broad"],
    badgeStyles: [
      { bg: "#FAECE7", color: "#993C1D" },
      { bg: "#FAEEDA", color: "#854F0B" },
      { bg: "#E1F5EE", color: "#0F6E56" },
    ],
    aggressiveness: [0, 1, 2],
    aiValue: 2,
    aiReason: "Set to Broad — Meridian engages across 3 service lines (Audit, Tax, Advisory) with whitespace in SOX and Government. Multi-service switching costs make this a sticky, high-breadth relationship.",
  },
  {
    key: "revenue",
    label: "Revenue potential",
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
    aiReason: "Set to High — Meridian expanded to a second campus and is exploring SOX advisory ($500K+ addressable wallet). The new scope signals strong growth trajectory and willingness to deepen the relationship.",
  },
];

const HEAT_DESCRIPTORS = [
  "Protect relationship",
  "Lean conservative",
  "Balanced approach",
  "Moderately aggressive",
  "Maximize capture",
];

const POSTURE_PCT = ["1.5%", "2.5%", "3.5%", "5.5%", "8.0%"];

const RADAR_LABELS = ["Priority", "Tenure", "Sensitivity", "Breadth", "Revenue"];

const CHIP_SUFFIXES: Record<string, string> = {
  clientPriority: "priority",
  relationship: "relationship",
  priceSensitivity: "sensitivity",
  breadth: "breadth",
  revenue: "revenue",
};

interface StrategyContent {
  pctIncrease: string;
  effectiveDate: string;
  talkingPoints: string[];
  valueAnchors: { point: string; context: string }[];
  buyingPatterns: { insight: string; implication: string }[];
  objections: { objection: string; response: string }[];
}

const STRATEGY_BY_POSTURE: Record<string, StrategyContent> = {
  "Protect relationship": {
    pctIncrease: "1.5%",
    effectiveDate: "September 1, 2026",
    talkingPoints: [
      "We’ve absorbed the majority of rising labor and compliance costs over the past 18 months to minimize disruption to your operations.",
      "This 1.5% adjustment applies only to the Advisory engagement where expanded scope has driven costs beyond our ability to hold fees.",
      "Your Audit and Tax engagement fees remain unchanged — we’re protecting continuity on your highest-value services.",
      "We’re offering a phased implementation so your finance team can plan around the fiscal calendar.",
      "Our goal is fee stability — this targeted adjustment helps us avoid a larger, broader correction down the road.",
    ],
    valueAnchors: [
      { point: "Your team stays exactly the same — Partner Greene and Manager Liu, no rotation", context: "Team continuity matters most to long-tenure clients; this removes the biggest switching-cost concern" },
      { point: "No further fee changes through the end of 2026", context: "Rate certainty is a concrete benefit that offsets the modest 1.5% adjustment" },
      { point: "Same priority staffing and 24-hour turnaround on urgent deadlines", context: "Reinforces that service quality isn't changing — only the fee is catching up to costs" },
      { point: "Core audit and tax fees are untouched — this only applies to advisory", context: "Isolating the adjustment to one engagement makes it easier to approve internally" },
    ],
    buyingPatterns: [
      { insight: "All three engagements have renewed annually for 8 consecutive years", implication: "Stable renewal cadence signals low churn risk — relationship-first messaging is appropriate" },
      { insight: "72% of fees concentrated in Audit & Assurance ($285K)", implication: "The core audit engagement is held flat; the adjustment targets only the expanded advisory scope" },
      { insight: "No competitive RFP activity detected in the last 6 months", implication: "Low switching intent supports a soft approach without urgency framing" },
      { insight: "Client expanded advisory scope with Internal Audit Support last year", implication: "Growth signal — frame fee stability as enabling continued service expansion" },
    ],
    objections: [
      { objection: "Any fee increase is difficult in this budget cycle.", response: "We understand — that’s why we limited this to 1.5% on one engagement. Your core audit and tax fees are unchanged, and this rate is well below the 8-12% industry average." },
      { objection: "We’ve been a loyal client for eight years.", response: "Exactly — your tenure is why this adjustment is the smallest we’re making this cycle. We’ve been absorbing increases that other clients saw months ago." },
      { objection: "Can we phase the increase across the fiscal year?", response: "We’re flexible. Given our partnership, we can implement the adjustment in two stages aligned with your budget quarters." },
    ],
  },
  "Lean conservative": {
    pctIncrease: "2.5%",
    effectiveDate: "August 15, 2026",
    talkingPoints: [
      "We’re applying a 2.5% fee adjustment across your audit, tax, and advisory engagements effective August 15 — roughly half the current market average of 5-6%.",
      "This reflects accumulated labor rate increases and expanded regulatory requirements we’ve been absorbing since Q3 2025.",
      "Your highest-value engagement (Annual Audit) carries the smallest adjustment; advisory services absorb the majority of the correction.",
      "We structured this to protect your core services — audit and tax fees see increases under 2%.",
      "Addressing this now with a modest correction prevents a steeper adjustment later in the fiscal year.",
    ],
    valueAnchors: [
      { point: "We're assigning a dedicated senior manager to your account — faster answers, fewer handoffs", context: "Tangible upgrade the client can see immediately; justifies the 2.5% as buying better access" },
      { point: "Rates are locked through January 2027 — no further adjustments this fiscal year", context: "Fee certainty is the #1 ask from CFOs; lead with this if they push back on timing" },
      { point: "Your three-engagement bundle pricing stays intact — no change to your volume discount", context: "Reassures them the multi-service relationship is still being rewarded" },
      { point: "Response times drop to 24 hours standard by Q4, with same-day on urgent items", context: "Concrete improvement they'll feel within one quarter" },
    ],
    buyingPatterns: [
      { insight: "Total engagement value is up 8% YoY driven by advisory scope expansion", implication: "Growth justifies holding multi-service pricing — use this as a retention lever" },
      { insight: "Client has consolidated from 2 service providers down to 1 over the past 3 years", implication: "Consolidation increases switching costs — a modest increase is well-tolerated" },
      { insight: "Audit season peak expected in Q3 based on 3-year trend", implication: "Time the conversation before peak season when switching costs are highest" },
      { insight: "Client has inquired about SOX compliance advisory", implication: "Expansion interest — position stable fees as a foundation for new service lines" },
    ],
    objections: [
      { objection: "We haven’t budgeted for a fee increase.", response: "We delayed this as long as possible for that reason. At 2.5%, it’s roughly half the market average — and we’re open to phased implementation across your budget quarters." },
      { objection: "Why now?", response: "Labor costs and regulatory requirements have been compounding for several quarters. A modest correction now prevents a larger one later and gives you fee certainty through early 2027." },
      { objection: "A competitor quoted us lower.", response: "Our fees reflect 8 years of institutional knowledge, team continuity, and dedicated partner engagement. Transitioning auditors typically incurs a 15-20% premium in year one." },
    ],
  },
  "Balanced approach": {
    pctIncrease: "3.5%",
    effectiveDate: "July 15, 2026",
    talkingPoints: [
      "Effective July 15, we’re adjusting fees by an average of 3.5% across your audit, tax, and advisory engagements.",
      "This consolidates several quarters of rising labor and compliance costs into one transparent adjustment rather than multiple ad-hoc changes.",
      "The new fee structure simplifies pricing across service lines — fewer exceptions, more consistency.",
      "Your multi-service relationship keeps your overall increase below the market average of 8-12%.",
      "We’ve timed this to align with your Q3 planning cycle so there are no mid-quarter surprises.",
    ],
    valueAnchors: [
      { point: "Your named engagement team — Greene, Liu, and associates — stays through FY27, guaranteed", context: "At 3.5%, leading with team continuity reframes the fee as buying stability, not paying more for the same thing" },
      { point: "Rates locked through March 2027 — one adjustment, then predictability", context: "Positions this as the last pricing conversation for 9+ months" },
      { point: "Same-day response on critical items, 24 hours on everything else", context: "A measurable improvement they'll notice; pairs well with 'here's what's changing for the better'" },
      { point: "Your multi-service relationship keeps you well below the 8–12% market average", context: "Anchors the 3.5% against what competitors and peers are seeing" },
    ],
    buyingPatterns: [
      { insight: "Client engages across 3 service lines (Audit, Tax, Advisory) with no single-provider dependency", implication: "Breadth gives us leverage to frame this as a portfolio-wide value proposition" },
      { insight: "Engagement renewals are predictable on an annual cycle for 8 consecutive years", implication: "Stable cadence means the per-engagement fee impact is small and absorbable" },
      { insight: "Audit & Assurance accounts for 57% of total fees ($285K of $500K)", implication: "The core audit engagement gets the most competitive rate; advisory absorbs the larger adjustment" },
      { insight: "Client has not evaluated alternative firms in 2+ years", implication: "Low switching momentum, but don’t over-leverage — maintain trust with transparency" },
    ],
    objections: [
      { objection: "We’ve already seen fee increases from other providers this year.", response: "This adjustment actually consolidates prior cost pressures into one consistent structure. Going forward, you’ll see fewer, more predictable updates." },
      { objection: "Another firm is offering lower rates.", response: "We’ve evaluated those comparisons. Our fees reflect 8 years of institutional knowledge, team continuity, and dedicated partner engagement — not just hourly rates." },
      { objection: "Shouldn’t our multi-service relationship earn a better rate?", response: "It already does. Your cross-service engagement is why you’re at 3.5% when comparable single-service clients are seeing 8%+." },
    ],
  },
  "Moderately aggressive": {
    pctIncrease: "5.5%",
    effectiveDate: "July 1, 2026",
    talkingPoints: [
      "Effective July 1, we’re implementing a 5.5% fee correction across your audit, tax, and advisory engagements.",
      "We held fees flat for 18+ months while labor costs rose 12% and new regulatory mandates expanded scope — this adjustment closes that gap in one move.",
      "This is a correction, not a trend. We’ve structured it so future adjustments will be incremental, not catch-up.",
      "Your core Audit engagement carries a lower increase than the portfolio average, reflecting its scale and predictability.",
      "The new fee structure locks through Q1 2027 with no additional adjustments planned.",
    ],
    valueAnchors: [
      { point: "You're getting a dedicated three-person team: named partner, senior manager, and associate — no more shared resources", context: "This is a real upgrade from the current model; frame the 5.5% as buying premium access, not just a cost increase" },
      { point: "Priority response lane — same-day on anything critical, next business day on everything else", context: "Concrete and measurable; the client can hold you to it, which builds trust" },
      { point: "Quarterly strategy reviews with fee forecasting — no more surprises", context: "Proactive communication is what enterprise clients value most; this shows you're investing in the relationship" },
      { point: "This is a one-time correction, not a trend — no further adjustments planned through Q1 2027", context: "Takes the fear of 'death by a thousand cuts' off the table" },
    ],
    buyingPatterns: [
      { insight: "Total engagement value has plateaued over the last 3 quarters despite scope expansion", implication: "Growth has stalled — frame the fee correction as enabling continued investment in the account" },
      { insight: "Client’s engagement complexity increased 20% (new regulatory requirements) but fees have not adjusted", implication: "We’re delivering more for the same fee — correction rebalances the value exchange" },
      { insight: "Current fee rates are 15-20% below market for comparable healthcare system engagements", implication: "Significant margin exposure — this is the primary driver for the correction" },
      { insight: "Client inquired about SOX compliance advisory last month", implication: "Expansion intent gives us room to anchor the correction against future value" },
    ],
    objections: [
      { objection: "That’s a significant increase.", response: "It is — and it’s intentional. We absorbed 18 months of rising costs so you wouldn’t face rolling increases. This one correction brings us to a sustainable baseline." },
      { objection: "We’ll need to evaluate alternative firms.", response: "We encourage that. Transitioning auditors incurs significant onboarding costs — typically 15-20% premium in year one — plus regulatory continuity risk. We’re confident in a transparent comparison." },
      { objection: "Can we negotiate on specific engagements?", response: "We’ve already tiered the adjustments — your Audit engagement carries the lowest rate given its scale. We can walk through the breakdown together." },
    ],
  },
  "Maximize capture": {
    pctIncrease: "8.0%",
    effectiveDate: "June 15, 2026",
    talkingPoints: [
      "Effective June 15, we’re moving to market-rate fees across all three engagements — an average adjustment of 8%.",
      "Historical fees reflected introductory and retention discounts that are no longer sustainable given current labor and compliance costs.",
      "The new fee structure aligns with what comparable healthcare system clients pay and reflects the full value of our service commitment.",
      "This is a one-time correction — no further adjustments are planned through 2027.",
      "We’re pairing this with enhanced service commitments to ensure the value behind every dollar is clear.",
    ],
    valueAnchors: [
      { point: "Full dedicated team: named partner, senior manager, associate, and a subject-matter specialist — reserved just for your account", context: "This is a premium service tier most clients don't get; positions the 8% as accessing a higher level, not just paying more" },
      { point: "Same-day response across all engagements — not just critical items", context: "The strongest response-time commitment in the book; leads with 'you're our priority'" },
      { point: "Contractual delivery guarantee with penalty SLA — we're putting skin in the game", context: "This is rare and bold; shows confidence and removes the 'what if service slips' objection before it's raised" },
      { point: "Unlimited ad-hoc advisory consultations through FY27 — call us anytime, no scope creep charges", context: "Turns the fee into an all-access pass; reframes the relationship from transactional to strategic" },
      { point: "Rates locked through 2027 — this is the last pricing conversation for 18 months", context: "At 8%, the lock period needs to be long enough to feel proportional; 18 months does that" },
    ],
    buyingPatterns: [
      { insight: "Account has been on legacy fee rates for 3+ years with no adjustment", implication: "Largest gap-to-market in the portfolio — correction is overdue and defensible" },
      { insight: "Meridian’s total fees rank in the top 15% of the book but margin contribution is bottom 25%", implication: "Revenue is strong but profitability is unsustainable — this rebalances the relationship" },
      { insight: "Engagement complexity is high and accelerating — new regulatory mandates added 20% more scope this year", implication: "Strong service dependency signals low churn risk even with an aggressive correction" },
      { insight: "No competitive evaluation initiated despite internal budget reviews", implication: "Switching costs are high for this client — 8 years of institutional knowledge supports a confident posture" },
    ],
    objections: [
      { objection: "This is far above what we’ve paid historically.", response: "Historical fees reflected introductory discounts that predate current cost structures. The new rate is in line with what comparable healthcare system clients pay for this service tier." },
      { objection: "We’ll need to go to bid.", response: "We support that. Our RFP data shows this fee is competitive for the service level and team continuity included. Transitioning auditors typically adds 15-20% in year one." },
      { objection: "Why such a large single increase?", response: "One correction gives you fee certainty through 2027 — no rolling increases, no surprises. We chose clarity over incremental uncertainty." },
    ],
  },
};

interface SelectedEngagement {
  engagementId: string;
  name: string;
  serviceLine: string;
  currentFee: number;
  proposedFee: number;
  annualHours: number;
}

const SELECTED_ENGAGEMENTS: SelectedEngagement[] = [
  { engagementId: "ENG-2601", name: "Annual Audit FY26", serviceLine: "Audit & Assurance", currentFee: 285000, proposedFee: 310650, annualHours: 2400 },
  { engagementId: "ENG-2602", name: "Federal Tax Planning", serviceLine: "Tax", currentFee: 95000, proposedFee: 104500, annualHours: 820 },
  { engagementId: "ENG-2603", name: "Internal Audit Support", serviceLine: "Advisory", currentFee: 120000, proposedFee: 138600, annualHours: 1100 },
];

const priceFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
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

function PostureGauge({
  driverValues,
  drivers,
  showAi,
}: {
  driverValues: Record<string, number>;
  drivers: DriverConfig[];
  showAi: boolean;
}) {
  const max = drivers.length * 2;
  const userTotal = drivers.reduce((s, d) => s + d.aggressiveness[driverValues[d.key]], 0);
  const aiTotal = drivers.reduce((s, d) => s + d.aggressiveness[d.aiValue], 0);
  const userPct = (userTotal / max) * 100;
  const aiPct = (aiTotal / max) * 100;

  const stops = HEAT_DESCRIPTORS;

  return (
    <Box sx={{ width: "100%" }}>
      {/* Spectrum bar */}
      <Box sx={{ position: "relative", height: 10, borderRadius: "5px", background: "linear-gradient(90deg, #E1F5EE 0%, #FAEEDA 40%, #FAECE7 100%)", mb: 0.5 }}>
        {/* AI marker — diamond shape, offset above */}
        {showAi && (
          <Tooltip title="AI suggested" arrow placement="top">
            <Box sx={{
              position: "absolute",
              top: -8,
              left: `${aiPct}%`,
              transform: "translateX(-50%) rotate(45deg)",
              width: 10,
              height: 10,
              bgcolor: "#f08b1d",
              border: "2px solid white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              transition: "left 0.4s ease",
              zIndex: 1,
              cursor: "default",
            }} />
          </Tooltip>
        )}
        {/* User marker — circle, offset below */}
        <Tooltip title="Your settings" arrow placement="bottom">
          <Box sx={{
            position: "absolute",
            top: 2,
            left: `${userPct}%`,
            transform: "translateX(-50%)",
            width: 14,
            height: 14,
            borderRadius: "50%",
            bgcolor: "#185FA5",
            border: "2.5px solid white",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            transition: "left 0.4s ease",
            zIndex: 2,
            cursor: "default",
          }} />
        </Tooltip>
      </Box>
      {/* Labels */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 9, color: "rgba(0,0,0,0.4)", fontWeight: 500 }}>Conservative</Typography>
        <Typography sx={{ fontSize: 9, color: "rgba(0,0,0,0.4)", fontWeight: 500 }}>Aggressive</Typography>
      </Box>
      {/* Legend */}
      <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#185FA5" }} />
          <Typography sx={{ fontSize: 9, color: "rgba(0,0,0,0.45)" }}>Your settings</Typography>
        </Box>
        {showAi && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Box sx={{ width: 7, height: 7, bgcolor: "#f08b1d", transform: "rotate(45deg)" }} />
            <Typography sx={{ fontSize: 9, color: "rgba(0,0,0,0.45)" }}>AI suggested</Typography>
          </Box>
        )}
      </Box>
    </Box>
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
        Pre-Call Strategy: Meridian Health Systems
      </Typography>
      <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.45)", mb: 3 }}>
        Posture: {posture} &middot; {SELECTED_ENGAGEMENTS.length} engagements selected
      </Typography>

      {/* Talking Points */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={sectionHeadingSx}>
          <DescriptionIcon sx={sectionIconSx} />
          Talking Points
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)", mb: 2, mt: -1 }}>
          These are sequenced — open with context, make the ask, then reinforce with value.
        </Typography>
        <Box component="ul" sx={{ pl: 2.5, m: 0, "& li": { fontSize: 13, color: "#000", mb: 1, lineHeight: 1.7, pl: 0.5 } }}>
          {content.talkingPoints.map((tp, i) => <li key={i}>{tp}</li>)}
        </Box>
      </Box>

      <Divider sx={{ mb: 3.5 }} />

      {/* Value Anchors */}
      <Box sx={{ mb: 3.5 }}>
        <Typography sx={sectionHeadingSx}>
          <AutoAwesomeIcon sx={sectionIconSx} />
          What You Can Tell Them They&rsquo;re Getting
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)", mb: 2, mt: -1 }}>
          Say these out loud — each one reframes the fee adjustment as something concrete the client receives.
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {content.valueAnchors.map((row, idx) => (
            <Paper key={idx} elevation={0} sx={{ p: 2, borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", bgcolor: "white" }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#00446a", lineHeight: 1.5, mb: 0.5 }}>
                &ldquo;{row.point}&rdquo;
              </Typography>
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", lineHeight: 1.5, fontStyle: "italic" }}>
                {row.context}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      <Divider sx={{ mb: 3.5 }} />

      {/* Buying Patterns */}
      <Box data-tour="buying-patterns" sx={{ mb: 3.5 }}>
        <Typography sx={sectionHeadingSx}>
          <DescriptionIcon sx={sectionIconSx} />
          Buying Pattern Analysis
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)", mb: 2, mt: -1 }}>
          Signals from the account data — use these to time the conversation and read the room.
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
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)", mb: 2, mt: -1 }}>
          The most likely pushbacks for this posture — scan these before the call so nothing catches you off guard.
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
  { id: 1, date: "Jun 3, 2026", label: "Initial strategy — +9.5% avg across 3 engagements", status: "draft" },
  { id: 2, date: "May 28, 2026", label: "Revised approach — focused on Advisory scope expansion", status: "declined" },
  { id: 3, date: "May 15, 2026", label: "Exploratory — broad fee adjustment across all service lines", status: "sent" },
];

export default function PreCallPlanPage() {
  const [pageLoading, setPageLoading] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [status, setStatus] = useState("draft");
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [driverValues, setDriverValues] = useState<Record<string, number>>(
    Object.fromEntries(SLIDER_DRIVERS.map((d) => [d.key, d.defaultValue]))
  );
  const [aiApplied, setAiApplied] = useState<Record<string, boolean>>({});
  const [aiBannerState, setAiBannerState] = useState<"suggest" | "applying" | "applied">("suggest");
  const [buyingPriority, setBuyingPriority] = useState("Engagement continuity");
  const [recalculating, setRecalculating] = useState(false);
  const recalcTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [message, setMessage] = useState("");
  const [chatFocused, setChatFocused] = useState(false);
  const [chatState, setChatState] = useState<"idle" | "sent" | "responding" | "done">("idle");
  const [contentState, setContentState] = useState<"empty" | "loading" | "generated">("empty");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedPosture, setGeneratedPosture] = useState("");
  const generateTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const delay = params.get("tour") === "1" ? 0 : 1800;
    const t = setTimeout(() => setPageLoading(false), delay);
    return () => clearTimeout(t);
  }, []);

  const PREPOPULATED_MSG = "What if the client asks for a bundle discount across all three engagements instead of accepting the per-engagement increase?";

  const posture = useMemo(() => {
    const total = SLIDER_DRIVERS.reduce((sum, d) => {
      const val = driverValues[d.key];
      return sum + d.aggressiveness[val];
    }, 0);
    const max = SLIDER_DRIVERS.length * 2;
    const pct = Math.round((total / max) * 100);
    const idx = Math.min(4, Math.floor(pct / 25));
    return { pct, descriptor: HEAT_DESCRIPTORS[idx], recIncrease: POSTURE_PCT[idx] };
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
    if (recalcTimer.current) clearTimeout(recalcTimer.current);
    setRecalculating(true);
    recalcTimer.current = setTimeout(() => setRecalculating(false), 600);
  };

  const applyAI = () => {
    setAiBannerState("applying");
    const applied: Record<string, boolean> = {};
    SLIDER_DRIVERS.forEach((d, i) => {
      setTimeout(() => {
        const nudged = d.aiValue > 0 ? d.aiValue - 1 : 0;
        setDriverValues((prev) => ({ ...prev, [d.key]: nudged }));
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

  useEffect(() => () => {
    generateTimers.current.forEach(clearTimeout);
    if (recalcTimer.current) clearTimeout(recalcTimer.current);
  }, []);

  const handleGenerateRef = useRef(handleGenerate);
  handleGenerateRef.current = handleGenerate;

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.action === "auto-generate" && contentState === "empty") {
        handleGenerateRef.current();
      }
    };
    window.addEventListener("tour-step", handler);

    const tempoHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.action === "auto-generate" && contentState === "empty") {
        handleGenerateRef.current();
      }
    };
    window.addEventListener("tempo-tour-step", tempoHandler);
    return () => {
      window.removeEventListener("tour-step", handler);
      window.removeEventListener("tempo-tour-step", tempoHandler);
    };
  }, [contentState]);

  const generatePDF = () => {
    const content = STRATEGY_BY_POSTURE[generatedPosture] || STRATEGY_BY_POSTURE["Balanced approach"];
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const pw = doc.internal.pageSize.getWidth();
    const margin = 50;
    const usable = pw - margin * 2;
    let y = 50;

    const safe = (s: string) => s.replace(/—/g, "--").replace(/–/g, "-").replace(/‘|’/g, "'").replace(/“|”/g, '"').replace(/•/g, "-").replace(/…/g, "...").replace(/→/g, "->").replace(/[^\x00-\x7F]/g, "");

    const checkPage = (needed: number) => {
      if (y + needed > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage();
        y = 50;
      }
    };

    // Header bar
    doc.setFillColor(0, 68, 106);
    doc.rect(0, 0, pw, 70, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("Pre-Call Strategy: Meridian Health Systems", margin, 38);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Posture: ${generatedPosture}  |  ${content.pctIncrease} avg increase  |  Effective ${content.effectiveDate}`, margin, 56);
    y = 90;

    // Engagement summary
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 68, 106);
    doc.text("Engagement Summary", margin, y);
    y += 20;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    const engCols = [0, 140, 280, 370, 460];
    const engHeaders = ["Engagement", "Service Line", "Current Fee", "Proposed Fee", "Change"];
    engHeaders.forEach((h, i) => doc.text(h, margin + engCols[i], y));
    y += 4;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pw - margin, y);
    y += 14;

    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    SELECTED_ENGAGEMENTS.forEach((eng) => {
      const pctChg = ((eng.proposedFee - eng.currentFee) / eng.currentFee * 100).toFixed(1);
      doc.text(eng.name, margin + engCols[0], y);
      doc.text(eng.serviceLine, margin + engCols[1], y);
      doc.text(priceFmt.format(eng.currentFee), margin + engCols[2], y);
      doc.text(priceFmt.format(eng.proposedFee), margin + engCols[3], y);
      doc.text(`+${pctChg}%`, margin + engCols[4], y);
      y += 16;
    });
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pw - margin, y);
    y += 25;

    // Talking Points
    checkPage(120);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 68, 106);
    doc.text("Talking Points", margin, y);
    y += 18;

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    content.talkingPoints.forEach((tp, i) => {
      checkPage(40);
      const lines = doc.splitTextToSize(safe(`${i + 1}. ${tp}`), usable - 10);
      doc.text(lines, margin + 10, y);
      y += lines.length * 13 + 6;
    });
    y += 10;

    // Service Level Commitments
    checkPage(100);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 68, 106);
    doc.text("What You Can Tell Them They're Getting", margin, y);
    y += 20;

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(40, 40, 40);
    content.valueAnchors.forEach((row) => {
      checkPage(40);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 68, 106);
      const pointLines = doc.splitTextToSize(`"${safe(row.point)}"`, usable - 10);
      doc.text(pointLines, margin, y);
      y += pointLines.length * 12 + 2;
      doc.setFont("helvetica", "italic");
      doc.setTextColor(120, 120, 120);
      const ctxLines = doc.splitTextToSize(safe(row.context), usable - 10);
      doc.text(ctxLines, margin, y);
      y += ctxLines.length * 12 + 8;
    });
    y += 15;

    // Buying Patterns
    checkPage(100);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 68, 106);
    doc.text("Buying Pattern Analysis", margin, y);
    y += 18;

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    content.buyingPatterns.forEach((bp) => {
      checkPage(50);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      const insightLines = doc.splitTextToSize(safe(bp.insight), usable - 10);
      doc.text(insightLines, margin + 10, y);
      y += insightLines.length * 13;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 100, 100);
      const impLines = doc.splitTextToSize(safe(`Implication: ${bp.implication}`), usable - 15);
      doc.text(impLines, margin + 15, y);
      y += impLines.length * 13 + 10;
    });
    y += 5;

    // Objection Handling
    checkPage(100);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 68, 106);
    doc.text("Objection Handling", margin, y);
    y += 18;

    doc.setFontSize(9.5);
    content.objections.forEach((obj) => {
      checkPage(60);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(40, 40, 40);
      const objLines = doc.splitTextToSize(safe(`"${obj.objection}"`), usable - 10);
      doc.text(objLines, margin + 10, y);
      y += objLines.length * 13;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      const resLines = doc.splitTextToSize(safe(obj.response), usable - 15);
      doc.text(resLines, margin + 15, y);
      y += resLines.length * 13 + 12;
    });

    // Footer
    const pages = doc.internal.pages.length - 1;
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text(`Confidential - Meridian Health Systems Pre-Call Strategy`, margin, doc.internal.pageSize.getHeight() - 25);
      doc.text(`Page ${i} of ${pages}`, pw - margin, doc.internal.pageSize.getHeight() - 25, { align: "right" });
    }

    doc.save("Meridian_Health_Systems_Pre-Call_Strategy.pdf");
  };

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

  if (pageLoading) {
    return (
      <AppShell>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            bgcolor: "#f5f5f5",
            animation: "pcFadeIn 0.3s ease",
            "@keyframes pcFadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
        >
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              bgcolor: "rgba(240,139,29,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2.5,
            }}
          >
            <CircularProgress size={28} sx={{ color: "#f08b1d" }} />
          </Box>
          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 600,
              color: "#00446a",
              mb: 1,
              animation: "pcTextIn 0.4s ease 0.2s both",
              "@keyframes pcTextIn": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "translateY(0)" } },
            }}
          >
            Preparing Pre-Call Plan
          </Typography>
          <Typography
            key="stage1"
            sx={{
              fontSize: 13,
              color: "rgba(0,0,0,0.45)",
              animation: "pcTextIn 0.4s ease 0.5s both",
            }}
          >
            Loading account data and driver configuration&hellip;
          </Typography>
        </Box>
      </AppShell>
    );
  }

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
            <Tooltip
              title={`DEMO TALK TRACK — PRE-CALL PLAN\n\nThis is where the partner prepares before a pricing conversation.\n\n1. DRIVERS (left sliders): These set the negotiation posture. Each driver — priority, tenure, sensitivity, breadth, revenue — shifts the strategy from conservative to aggressive. The AI pre-fills based on account data, but the partner can override.\n\n2. POSTURE GAUGE: Shows at a glance where you sit on the conservative-to-aggressive spectrum. The blue dot is your settings, the orange ring is the AI suggestion.\n\n3. PRICING POSTURE: The model translates driver settings into a named strategy (e.g. "Balanced approach") with a specific % increase recommendation.\n\n4. RIGHT PANEL: Auto-generates talking points, objection handling, service commitments, and buying patterns — all tailored to the posture and this specific client.\n\n5. KEY INSIGHT: Everything on this page is connected. Move one slider and the talking points, objection responses, and recommended % all update. The partner walks into the meeting with a complete, data-backed playbook.`}
              arrow
              placement="right-start"
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: "white",
                    color: "#333",
                    border: "1px solid #D97C14",
                    fontSize: 11,
                    lineHeight: 1.6,
                    maxWidth: 320,
                    p: 2,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    whiteSpace: "pre-line",
                  },
                },
                arrow: { sx: { color: "white", "&::before": { border: "1px solid #D97C14" } } },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 16,
                  height: 16,
                  borderRadius: "3px",
                  bgcolor: "rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  zIndex: 1,
                  "&:hover": { bgcolor: "rgba(0,0,0,0.12)" },
                  transition: "background-color 0.15s",
                }}
              />
            </Tooltip>
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {/* Radar Chart & Pricing Posture */}
              <Box data-tour="radar-posture" sx={{ px: 2.5, py: 2, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                  <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Pricing posture
                  </Typography>
                  <Typography
                    key={posture.descriptor}
                    sx={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: recalculating ? "rgba(0,0,0,0.3)" : "#000",
                      transition: "color 0.2s ease",
                    }}
                  >
                    {posture.descriptor}
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: recalculating ? "rgba(0,0,0,0.2)" : "#2e7d32", transition: "color 0.2s ease" }}>
                    {posture.recIncrease} avg increase
                  </Typography>
                  {recalculating && (
                    <CircularProgress
                      size={14}
                      sx={{
                        color: "#f08b1d",
                        animation: "rcFadeIn 0.15s ease",
                        "@keyframes rcFadeIn": { from: { opacity: 0 }, to: { opacity: 1 } },
                      }}
                    />
                  )}
                </Box>
                <PostureGauge driverValues={driverValues} drivers={SLIDER_DRIVERS} showAi />
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
                      <Tooltip
                        title={"The model sees signals in the account history and market data that support a more aggressive posture than you’d typically set manually. Apply to see the difference."}
                        arrow
                        placement="top"
                        slotProps={{
                          tooltip: { sx: { bgcolor: "white", color: "#0C447C", border: "1px solid #85B7EB", fontSize: 11, lineHeight: 1.5, maxWidth: 220, p: 1.25, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } },
                          arrow: { sx: { color: "white", "&::before": { border: "1px solid #85B7EB" } } },
                        }}
                      >
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
                      </Tooltip>
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
              <Box data-tour="driver-sliders" sx={{ px: 2.5, pt: 1.5, pb: 0.5 }}>
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
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 148, flexShrink: 0 }}>
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
                  <Tooltip
                    title="What matters most to this client when evaluating the engagement. This shapes the talking points and objection handling — e.g. a client focused on 'Fee sensitivity' gets ROI justifications, while 'Engagement continuity' gets stability and risk-of-change framing."
                    arrow
                    placement="top"
                    slotProps={{ tooltip: { sx: { bgcolor: "white", color: "#333", border: "1px solid #e0e0e0", fontSize: 11, lineHeight: 1.5, maxWidth: 240, p: 1.25, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } }, arrow: { sx: { color: "white", "&::before": { border: "1px solid #e0e0e0" } } } }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, width: 130, flexShrink: 0, cursor: "help" }}>
                      <TuneIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.35)" }} />
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#000" }}>
                        Buying priority
                      </Typography>
                    </Box>
                  </Tooltip>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <Select
                      value={buyingPriority}
                      onChange={(e) => setBuyingPriority(e.target.value)}
                      sx={{ fontSize: 12, bgcolor: "rgba(0,0,0,0.02)", borderRadius: "6px", "& .MuiSelect-select": { py: 0.625 } }}
                    >
                      <MenuItem value="Engagement continuity">Engagement continuity</MenuItem>
                      <MenuItem value="Fee sensitivity">Fee sensitivity</MenuItem>
                      <MenuItem value="Service quality">Service quality</MenuItem>
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
            <Box data-tour="generate-button" sx={{ px: 2.5, py: 1.5, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
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
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#f5f5f5", position: "relative" }}>
            <Tooltip
              title={`DEMO TALK TRACK — GENERATED OUTPUT\n\n• This panel auto-generates a complete pre-call playbook based on the drivers you set\n\n• TALKING POINTS: Bullet-ready phrases the partner can use in the conversation — not scripts, just nudges\n\n• OBJECTION HANDLING: Pre-built responses to the 2–3 most likely pushbacks, tailored to this client's buying priority\n\n• BUYING PATTERNS: Historical signals (win/loss trends, seasonal timing, competitor activity) pulled from account data\n\n• SERVICE COMMITMENTS: What the firm is promising at this price point — helps the partner anchor value, not just cost\n\n• Everything regenerates live when you change a driver on the left — show the audience a slider change and watch the content update`}
              arrow
              placement="left-start"
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: "white",
                    color: "#333",
                    border: "1px solid #D97C14",
                    fontSize: 11,
                    lineHeight: 1.6,
                    maxWidth: 320,
                    p: 2,
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    whiteSpace: "pre-line",
                  },
                },
                arrow: { sx: { color: "white", "&::before": { border: "1px solid #D97C14" } } },
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  width: 16,
                  height: 16,
                  borderRadius: "3px",
                  bgcolor: "rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  zIndex: 1,
                  "&:hover": { bgcolor: "rgba(0,0,0,0.12)" },
                  transition: "background-color 0.15s",
                }}
              />
            </Tooltip>
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
              Communication Strategy | Meridian Health Systems
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
              View Selection ({SELECTED_ENGAGEMENTS.length})
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
                Use <strong>View Selection</strong> to review the engagements selected for this plan. Return to Tempo to edit your selection.
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
              <Box ref={contentRef} data-tour="generated-content" sx={{ flex: 1, overflowY: "auto", px: 4, py: 3 }}>
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
                      { icon: <PdfIcon sx={{ fontSize: 16 }} />, label: "Generate PDF for customer delivery", highlighted: true, onClick: generatePDF },
                      { icon: <EmailIcon sx={{ fontSize: 16 }} />, label: "Draft email to send with pricing proposal" },
                      { icon: <CopyIcon sx={{ fontSize: 16 }} />, label: "Copy strategy summary to clipboard" },
                    ].map((item) => (
                      <Box
                        key={item.label}
                        onClick={item.onClick}
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
                        &ldquo;We understand the appeal of a bundled fee structure. Let&apos;s look at this together.&rdquo;
                      </Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", mb: 0.75 }}>
                        Key talking points:
                      </Typography>
                      <Box component="ol" sx={{ pl: 2.5, m: 0, mb: 2, "& li": { fontSize: 13, color: "rgba(0,0,0,0.7)", mb: 0.75, lineHeight: 1.7, pl: 0.5 } }}>
                        <li>Your current rates already reflect a multi-service relationship discount — this is why you&apos;re below the 8-12% industry average for comparable healthcare clients.</li>
                        <li>Offer to model a commitment structure: if they confirm all three engagements through FY27, you can lock the new rates through March 2027 with no further adjustments.</li>
                        <li>Position it as a partnership: &ldquo;We&apos;d rather build a structure that rewards your continued trust than apply a flat number.&rdquo;</li>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", mb: 0.75 }}>
                        What to avoid:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2.5, m: 0, mb: 2, "& li": { fontSize: 13, color: "rgba(0,0,0,0.7)", mb: 0.5, lineHeight: 1.7 } }}>
                        <li>Don&apos;t open with the bundled offer — let them ask for it</li>
                        <li>Don&apos;t discount below the proposed rates without a firm multi-year commitment in return</li>
                        <li>Don&apos;t agree to retroactive credits on work already billed</li>
                      </Box>
                      <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#000", mb: 0.75 }}>
                        Fallback position:
                      </Typography>
                      <Typography sx={{ fontSize: 13, lineHeight: 1.7, color: "rgba(0,0,0,0.7)" }}>
                        If they push hard, offer to phase the Advisory increase over two quarters while they evaluate expanding into SOX compliance — this buys time without conceding the core fee adjustment.
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
              {SELECTED_ENGAGEMENTS.length} engagements selected for Meridian Health Systems &middot; Audit &amp; Assurance, Tax, Advisory
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setSelectionOpen(false)} sx={{ color: "rgba(0,0,0,0.4)" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3, pt: 0 }}>
          {(() => {
            const serviceLines = [...new Set(SELECTED_ENGAGEMENTS.map((p) => p.serviceLine))];
            return (
              <Box sx={{ display: "flex", gap: 1, mb: 2, mt: 1 }}>
                {serviceLines.map((cat) => {
                  const count = SELECTED_ENGAGEMENTS.filter((p) => p.serviceLine === cat).length;
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
                  {["ID", "Engagement", "Service Line", "Current Fee", "Proposed Fee", "Change", "Est. Hours"].map((h, i) => (
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
                {SELECTED_ENGAGEMENTS.map((p, idx) => {
                  const pctChange = ((p.proposedFee - p.currentFee) / p.currentFee * 100).toFixed(1);
                  return (
                    <TableRow key={p.engagementId} sx={{ bgcolor: idx % 2 === 0 ? "#fff" : "#fafbfc", "&:last-child td": { borderBottom: 0 } }}>
                      <TableCell sx={{ ...tableCellSx, fontFamily: "monospace", fontSize: 12, color: "rgba(0,0,0,0.5)", px: 1.5, py: 1.25 }}>{p.engagementId}</TableCell>
                      <TableCell sx={{ ...tableCellSx, fontWeight: 500, px: 1.5, py: 1.25 }}>{p.name}</TableCell>
                      <TableCell sx={{ ...tableCellSx, color: "rgba(0,0,0,0.55)", px: 1.5, py: 1.25 }}>{p.serviceLine}</TableCell>
                      <TableCell sx={{ ...tableCellSx, textAlign: "right", px: 1.5, py: 1.25 }}>{priceFmt.format(p.currentFee)}</TableCell>
                      <TableCell sx={{ ...tableCellSx, textAlign: "right", fontWeight: 500, px: 1.5, py: 1.25 }}>{priceFmt.format(p.proposedFee)}</TableCell>
                      <TableCell sx={{ ...tableCellSx, textAlign: "right", color: "#B85C18", fontWeight: 600, px: 1.5, py: 1.25 }}>+{pctChange}%</TableCell>
                      <TableCell sx={{ ...tableCellSx, textAlign: "right", color: "rgba(0,0,0,0.55)", px: 1.5, py: 1.25 }}>{volFmt.format(p.annualHours)}</TableCell>
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
