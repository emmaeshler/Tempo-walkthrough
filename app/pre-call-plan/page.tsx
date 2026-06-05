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
} from "@mui/material";
import {
  Close as CloseIcon,
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
    label: "Length of relationship",
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
    label: "Time since last price change",
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
    label: "2026 revenue potential",
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
  summaryBullets: string[];
  talkingPoint: string;
  objections: { objection: string; response: string }[];
  marginBullets: string[];
  valueProp: string;
  emailVersion: string;
}

const STRATEGY_BY_POSTURE: Record<string, StrategyContent> = {
  "Protect relationship": {
    pctIncrease: "1.5%",
    effectiveDate: "September 1, 2026",
    summaryBullets: [
      "Affects: Select high-volume lines under AstroBright",
      "Average price adjustment: +1.5% effective September 1, 2026",
      "Driver: Targeted cost-of-goods increases on specific raw materials",
      "Result: Minimal disruption — preserves current rate structure on 85% of SKUs",
    ],
    talkingPoint: "We’ve absorbed the majority of recent cost increases. This small adjustment to a handful of lines lets us maintain the service quality and lead times you rely on.",
    objections: [
      { objection: "Any increase feels like a lot right now.", response: "We understand — that’s why we kept this to 1.5%, well below the industry average of 4–6%. The vast majority of your pricing stays exactly the same." },
      { objection: "We’ve been a loyal customer for years.", response: "Absolutely, and that’s precisely why this adjustment is the smallest in your category. Your tenure and partnership are the reason we’ve been able to hold pricing this long." },
      { objection: "Can we defer the effective date?", response: "We can discuss phasing — given our relationship, we’re open to a 60-day transition window to help your team plan." },
    ],
    marginBullets: [
      "Estimated 2026 impact: +0.6% margin recovery on affected lines",
      "Key effect: Preserves current service levels and avoids deeper corrections later in the year.",
      "Overall portfolio pricing remains among the most competitive for accounts of this tenure.",
    ],
    valueProp: "This minor adjustment ensures we can continue investing in the reliability and turnaround times your team depends on — without broader pricing disruption down the line.",
    emailVersion: "We’re making a small pricing update (+1.5%) on a limited set of product lines, effective September 1. This reflects targeted material cost changes and lets us maintain the service levels and pricing stability you count on across the rest of your portfolio.",
  },
  "Lean conservative": {
    pctIncrease: "2.5%",
    effectiveDate: "August 15, 2026",
    summaryBullets: [
      "Affects: Core product lines under AstroBright",
      "Average price adjustment: +2.5% effective August 15, 2026",
      "Driver: Incremental input cost increases and logistics rate adjustments",
      "Result: Pricing stays competitive while closing the gap on cost creep",
    ],
    talkingPoint: "Effective August 15, we’re applying a modest 2.5% adjustment across core lines to reflect accumulated cost changes. This keeps your pricing well below market rate.",
    objections: [
      { objection: "We haven’t budgeted for an increase.", response: "We delayed this as long as possible to give planning time. At 2.5%, it’s roughly half the market average, and we’re happy to discuss staggered implementation." },
      { objection: "Why now?", response: "Input costs have been building for several quarters. Addressing them now with a modest adjustment prevents a larger correction later in the fiscal year." },
      { objection: "Competitor quoted lower.", response: "Our rate includes priority fulfillment and dedicated support. When factoring total cost of service, we consistently benchmark favorably — and this increase keeps that true." },
    ],
    marginBullets: [
      "Estimated 2026 impact: +1.1% margin improvement across affected SKUs",
      "Key effect: Closes the cost-price gap that’s been widening since Q3 2025 without disrupting purchasing patterns.",
      "High-volume items see the smallest adjustment; specialty lines absorb the bulk.",
    ],
    valueProp: "This update reflects our commitment to keeping pricing predictable and transparent. We’ve structured it to protect your highest-volume purchases while ensuring we can sustain the quality and responsiveness you expect.",
    emailVersion: "Starting August 15, select product lines will see a 2.5% pricing adjustment to reflect accumulated input cost changes. Your highest-volume items are minimally affected. This approach keeps your overall portfolio pricing well below market average while maintaining the service quality you rely on.",
  },
  "Balanced approach": {
    pctIncrease: "3.5%",
    effectiveDate: "July 15, 2026",
    summaryBullets: [
      "Affects: Copy & Forms lines under AstroBright",
      "Average price adjustment: +3.5% effective July 15, 2026",
      "Driver: Rising input costs in paper and distribution, offset by efficiency gains",
      "Result: Simplified, more consistent pricing across product families",
    ],
    talkingPoint: "Starting July 15, our updated pricing reflects moderate adjustments across select product lines to align with material costs and maintain consistency.",
    objections: [
      { objection: "We’ve already seen several increases this year.", response: "Understood — this adjustment consolidates prior ad-hoc changes into one consistent structure and avoids frequent smaller updates." },
      { objection: "Competitor X is offering lower rates.", response: "We evaluated market comparisons — our pricing now reflects full service, reliability, and lead-time advantages." },
      { objection: "We buy in multiple categories, shouldn’t we get a better rate?", response: "Your cross-category volume is why your overall increase is below the market average at just 3.5%. It recognizes your partnership breadth." },
    ],
    marginBullets: [
      "Estimated 2026 impact: +1.8% overall margin improvement",
      "Key effect: More sustainable pricing on low-margin SKUs; enables continued service levels and innovation investment.",
      "Broader portfolio mix remains competitive — small increases on high-volume items balanced by stable pricing on specialty forms.",
    ],
    valueProp: "These updates position you for stable supply, predictable pricing, and better alignment with our enhanced product mix for 2026. They reflect our continued investment in product quality, reliability, and service turnaround times — giving your teams fewer disruptions and more long-term cost control.",
    emailVersion: "We’re updating select product prices by an average of 3.5% effective July 15. This aligns with paper and distribution cost trends and helps sustain consistent supply without future volatility. The shift improves overall margin stability while keeping your multi-category pricing well below market averages.",
  },
  "Moderately aggressive": {
    pctIncrease: "5.5%",
    effectiveDate: "July 1, 2026",
    summaryBullets: [
      "Affects: All active product lines under AstroBright",
      "Average price adjustment: +5.5% effective July 1, 2026",
      "Driver: Significant raw material inflation, freight surcharges, and market realignment",
      "Result: Pricing corrected to sustainable levels with improved margin across the portfolio",
    ],
    talkingPoint: "Effective July 1, we’re implementing a 5.5% pricing correction across your portfolio. This reflects overdue realignment with market conditions and ensures long-term supply continuity.",
    objections: [
      { objection: "That’s a significant jump.", response: "It is meaningful — and intentionally so. We held pricing flat for over 18 months while costs rose 12%. This correction brings us to a sustainable baseline without future catch-up increases." },
      { objection: "We’ll need to evaluate alternatives.", response: "We encourage comparison. Our total cost of ownership — factoring reliability, lead times, and dedicated support — positions this increase as a value investment, not just a price change." },
      { objection: "Can we negotiate specific lines?", response: "We’ve structured tiered adjustments — your highest-volume items carry a lower rate. We can review the breakdown together to find the right balance." },
    ],
    marginBullets: [
      "Estimated 2026 impact: +3.2% margin recovery, bringing portfolio back to target",
      "Key effect: Eliminates unsustainable below-market pricing on 40% of active SKUs.",
      "Positions future adjustments as incremental rather than corrective — more predictable for both sides.",
    ],
    valueProp: "This reset ensures we can continue prioritizing your account with dedicated resources, priority fulfillment, and product innovation. It’s a one-time correction designed to prevent repeated smaller increases going forward.",
    emailVersion: "Effective July 1, we’re adjusting pricing by an average of 5.5% across your product lines. This reflects 18+ months of absorbed cost increases and realigns our partnership for sustainable, predictable pricing going forward. We’ve structured the changes to protect your highest-volume items.",
  },
  "Maximize capture": {
    pctIncrease: "8.0%",
    effectiveDate: "June 15, 2026",
    summaryBullets: [
      "Affects: Full product catalog under AstroBright",
      "Average price adjustment: +8.0% effective June 15, 2026",
      "Driver: Market repricing, input cost correction, and strategic portfolio realignment",
      "Result: Full market-rate pricing achieved; margin targets restored to benchmark levels",
    ],
    talkingPoint: "Effective June 15, we’re moving to market-rate pricing across your account. This 8% adjustment reflects the true cost of service and positions both sides for a more transparent pricing relationship.",
    objections: [
      { objection: "This is far above what we’ve paid historically.", response: "Historical pricing reflected introductory and retention discounts that are no longer sustainable. The new rate is competitive with what comparable accounts pay and reflects our full-service value." },
      { objection: "We’ll need to go to bid.", response: "We support transparent evaluation. Our RFP data shows this rate is in line with or below market for the service tier and SLAs included. We’re confident in the value comparison." },
      { objection: "Why such a large single increase?", response: "We chose a single correction over multiple smaller increases to give your team pricing certainty for the next 12+ months. No further adjustments are planned through 2027." },
    ],
    marginBullets: [
      "Estimated 2026 impact: +5.1% margin improvement — restores portfolio to full benchmark",
      "Key effect: Eliminates all legacy below-market pricing; every SKU now at or above floor margin.",
      "Enables reinvestment in account-specific innovation, dedicated support resources, and supply guarantees.",
    ],
    valueProp: "This pricing reflects the full value of our partnership — dedicated capacity, priority service, and product innovation tailored to your needs. It’s a reset that eliminates pricing uncertainty for both sides and locks in stability through 2027.",
    emailVersion: "Effective June 15, we’re updating pricing across your account to reflect current market rates — an average adjustment of 8%. This one-time correction replaces legacy pricing, aligns with industry benchmarks, and guarantees rate stability through 2027. We’re committed to ensuring the value behind every dollar is clear.",
  },
};

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

  return (
    <Paper elevation={0} sx={{ bgcolor: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", p: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#f08b1d", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Typography sx={{ color: "white", fontSize: 14, fontWeight: 700 }}>A</Typography>
        </Box>
        <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
          <Box component="span" sx={{ color: "rgba(0,0,0,0.54)" }}>Ask</Box>
          <Box component="span" sx={{ color: "#f08b1d" }}>Tempo</Box>
          <Box component="span" sx={{ color: "rgba(0,0,0,0.54)" }}> AI</Box>
        </Typography>
      </Box>

      <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#000", mb: 2.5 }}>
        Communicating Price Changes to AstroBright
      </Typography>

      <Box component="ul" sx={{ pl: 2.5, mb: 3.5, "& li": { fontSize: 13, color: "#000", mb: 0.75, lineHeight: 1.7 } }}>
        {content.summaryBullets.map((b, i) => <li key={i}>{b}</li>)}
      </Box>

      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#000", mb: 0.75 }}>
          Concise customer talking point:
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.7)", fontStyle: "italic", lineHeight: 1.7 }}>
          {content.talkingPoint}
        </Typography>
      </Box>

      <Divider sx={{ mb: 3.5 }} />

      <Box sx={{ mb: 3.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <DescriptionIcon sx={{ fontSize: 20, color: "rgba(0,0,0,0.54)" }} />
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#000" }}>
            Anticipated Customer Objections &amp; Guided Responses
          </Typography>
        </Box>
        <TableContainer sx={{ border: "1px solid #eee", borderRadius: "6px" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "#f5f5f5" }}>
                <TableCell sx={{ ...tableCellSx, fontWeight: 600, color: "rgba(0,0,0,0.7)", width: "40%", borderBottom: "1px solid #ddd" }}>Objection</TableCell>
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

      <Divider sx={{ mb: 3.5 }} />

      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#000", mb: 1.5 }}>
          Margin &amp; Profitability Impact
        </Typography>
        <Box component="ul" sx={{ pl: 2.5, "& li": { fontSize: 13, color: "#000", mb: 0.75, lineHeight: 1.7 } }}>
          {content.marginBullets.map((b, i) => <li key={i}>{b}</li>)}
        </Box>
      </Box>

      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#000", mb: 1 }}>
          Value Proposition Reinforcement
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.7)", fontStyle: "italic", lineHeight: 1.7 }}>
          {content.valueProp}
        </Typography>
      </Box>

      <Box>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#f08b1d", mb: 1 }}>
          Concise Version (for quick use / email):
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.7)", fontStyle: "italic", lineHeight: 1.7 }}>
          {content.emailVersion}
        </Typography>
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
  { id: 1, date: "Jun 3, 2026", label: "Initial strategy — +3.5% across Copy & Forms", drivers: "High relationship, Medium price sensitivity" },
  { id: 2, date: "May 28, 2026", label: "Revised approach — focused on specialty lines", drivers: "Low priority, High revenue potential" },
  { id: 3, date: "May 15, 2026", label: "Exploratory — broad category adjustment", drivers: "Medium across all drivers" },
];

export default function PreCallPlanPage() {
  const [driversOpen, setDriversOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [status, setStatus] = useState("draft");
  const [statusAnchor, setStatusAnchor] = useState<null | HTMLElement>(null);
  const [driverValues, setDriverValues] = useState<Record<string, number>>(
    Object.fromEntries(SLIDER_DRIVERS.map((d) => [d.key, d.defaultValue]))
  );
  const [aiApplied, setAiApplied] = useState<Record<string, boolean>>({});
  const [aiBannerState, setAiBannerState] = useState<"suggest" | "applying" | "applied">("suggest");
  const [buyingPriority, setBuyingPriority] = useState("Speed of service");
  const [message, setMessage] = useState("");
  const [contentState, setContentState] = useState<"empty" | "loading" | "generated">("empty");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [generatedPosture, setGeneratedPosture] = useState("");
  const generateTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

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

  return (
    <AppShell>
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Left Sidebar - Set Drivers */}
        {driversOpen && (
          <Box
            sx={{
              width: 340,
              flexShrink: 0,
              borderRight: "1px solid rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              bgcolor: "white",
            }}
          >
            <Box sx={{ flex: 1, overflowY: "auto" }}>
              {/* Header */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, pt: 2, pb: 1.5, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 500, color: "#000" }}>
                    Set drivers
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mt: 0.25 }}>
                    105 prices selected
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setDriversOpen(false)}
                  sx={{
                    width: 26,
                    height: 26,
                    border: "1px solid rgba(0,0,0,0.12)",
                    color: "rgba(0,0,0,0.4)",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>

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

                {SLIDER_DRIVERS.map((driver) => {
                  const value = driverValues[driver.key];
                  const badge = driver.badgeStyles[value];
                  const isAi = aiApplied[driver.key];

                  return (
                    <Box key={driver.key} sx={{ mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#000" }}>
                            {driver.label}
                          </Typography>
                          {isAi && (
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
                                  ml: 0.25,
                                  flexShrink: 0,
                                }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                        <Typography
                          sx={{
                            fontSize: 11,
                            fontWeight: 500,
                            px: 1,
                            py: 0.125,
                            borderRadius: "20px",
                            bgcolor: badge.bg,
                            color: badge.color,
                          }}
                        >
                          {driver.labels[value]}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)", width: 34, flexShrink: 0, lineHeight: 1.2 }}>
                          {driver.endLabels[0]}
                        </Typography>
                        <Slider
                          value={value}
                          min={0}
                          max={2}
                          step={1}
                          onChange={(_, v) => updateDriver(driver.key, v as number)}
                          sx={sliderSx}
                        />
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)", width: 34, flexShrink: 0, textAlign: "right", lineHeight: 1.2 }}>
                          {driver.endLabels[1]}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}

                <Divider sx={{ mb: 1.5 }} />

                {/* Customer Buying Priority */}
                <Box sx={{ mb: 2 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 500, color: "#000", mb: 0.75, display: "flex", alignItems: "center", gap: 0.75 }}>
                    Customer buying priority
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={buyingPriority}
                      onChange={(e) => setBuyingPriority(e.target.value)}
                      sx={{ fontSize: 13, bgcolor: "rgba(0,0,0,0.02)", borderRadius: "6px" }}
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

            {/* Collapsible Plan History */}
            <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <Box
                onClick={() => setHistoryOpen(!historyOpen)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2.5,
                  py: 1.25,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                }}
              >
                <HistoryIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.4)" }} />
                <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)", flex: 1 }}>
                  Plan history
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
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
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 16,
                      color: "rgba(0,0,0,0.4)",
                      transform: historyOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                    }}
                  />
                </Box>
              </Box>
              {historyOpen && (
                <Box sx={{ px: 2.5, pb: 1.5 }}>
                  {PLAN_HISTORY.map((plan) => (
                    <Box
                      key={plan.id}
                      sx={{
                        py: 1.25,
                        borderBottom: "1px solid rgba(0,0,0,0.05)",
                        "&:last-child": { borderBottom: "none" },
                      }}
                    >
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.7)", mb: 0.25 }}>
                        {plan.date}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: 1.4 }}>
                        {plan.label}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

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
        )}

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
            {!driversOpen && (
              <IconButton size="small" onClick={() => setDriversOpen(true)} sx={{ color: "#00446a", mr: -0.5 }}>
                <TuneIcon />
              </IconButton>
            )}
            <Typography sx={{ fontWeight: 400, color: "#00446a", fontSize: 24, letterSpacing: "0.25px" }}>
              Communication Strategy | Astrobrite
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
              sx={{
                color: "#00446a",
                borderColor: "#00446a",
                fontWeight: 600,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                "&:hover": { bgcolor: "#00446a", color: "white", borderColor: "#00446a" },
              }}
            >
              Open Price List
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
                Use <strong>Open Price List</strong> to review the products selected for this plan. Return to Tempo to edit your selection.
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
              <Box sx={{ flex: 1, overflowY: "auto", px: 4, py: 3 }}>
                <GeneratedContent posture={generatedPosture} />
              </Box>

              {/* Chat input */}
              <Box sx={{ borderTop: "1px solid rgba(0,0,0,0.1)", px: 4, py: 2, bgcolor: "white", flexShrink: 0 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Send A Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: 13 } }}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" sx={{ color: "rgba(0,0,0,0.38)" }}>
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
    </AppShell>
  );
}
