"use client";

import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Divider,
  TablePagination,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Tooltip,
  Popover,
  Radio,
  Dialog,
  DialogTitle,
  DialogContent,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Home as HomeIcon,
  Bookmark as BookmarkIcon,
  Description as DescriptionIcon,
  Folder as FolderIcon,
  ExpandMore as ExpandMoreIcon,
  Person as PersonIcon,
  ChevronRight as ChevronRightIcon,
  ChevronLeft as ChevronLeftIcon,
  FilterList as FilterListIcon,
  ViewColumn as ViewColumnIcon,
  TableRows as TableRowsIcon,
  SettingsOverscan as SettingsOverscanIcon,
  AddCircleOutlined as AddCircleOutlineIcon,
  ChatBubbleOutlined as ChatBubbleOutlineIcon,
  AutoAwesome as AutoAwesomeIcon,
  Close as CloseIcon,
  Add as AddIcon,
  History as HistoryIcon,
  Send as SendIcon,
  Mic as MicIcon,
  CheckCircle as CheckCircleIcon,
  Insights as InsightsIcon,
  InfoOutlined as InfoOutlinedIcon,
  BarChart as BarChartIcon,
  MoreVert as MoreVertIcon,
  Search as SearchIcon,
  Add as AddIconAlt,
  Refresh as RefreshIcon,
  RadioButtonUnchecked as RadioUncheckedIcon,
  SwapHoriz as SwapHorizIcon,
  Remove as RemoveCircleOutlineIcon,
  CalendarMonth as CalendarMonthIcon,
  ShowChart as ShowChartIcon,
  BubbleChart as BubbleChartIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  Area,
  ComposedChart,
  Bar,
} from "recharts";
import AppShell from "../../components/AppShell";
import { generateTableData, type RowData } from "../data";

const fmt = (n: number | null) => n == null ? "—" : "$" + n.toLocaleString("en-US");
const pct = (n: number | null) => n == null ? "—" : n.toFixed(1) + "%";

const elasticityData = [
  { period: "FY21", price: 245000, volume: 1420, priceIdx: 0.86, volumeIdx: 1.12 },
  { period: "FY22", price: 255000, volume: 1380, priceIdx: 0.89, volumeIdx: 1.09 },
  { period: "FY23", price: 268000, volume: 1310, priceIdx: 0.94, volumeIdx: 1.03 },
  { period: "FY24", price: 275000, volume: 1270, priceIdx: 0.96, volumeIdx: 1.0 },
  { period: "FY25", price: 285000, volume: 1240, priceIdx: 1.0, volumeIdx: 0.98 },
  { period: "FY26 (Rec)", price: 311000, volume: 1190, priceIdx: 1.09, volumeIdx: 0.94 },
];

const priceCompsData = [
  { client: "Pacific Rim Health", fee: 245000, increase: 7.5, size: 120 },
  { client: "Vanguard Senior", fee: 270000, increase: 8.1, size: 140 },
  { client: "Atlas Industrial", fee: 310000, increase: 10.3, size: 160 },
  { client: "Horizon Pharma", fee: 335000, increase: 11.0, size: 180 },
  { client: "Liberty Mutual HC", fee: 360000, increase: 11.8, size: 200 },
  { client: "Cornerstone Medical", fee: 390000, increase: 12.5, size: 160 },
  { client: "Apex Capital", fee: 210000, increase: 6.2, size: 100 },
  { client: "Summit HC Group", fee: 198000, increase: 5.8, size: 90 },
  { client: "Cascade Advisors", fee: 320000, increase: 9.8, size: 150 },
  { client: "Redwood Systems", fee: 280000, increase: 8.9, size: 130 },
  { client: "Northstar Medical", fee: 225000, increase: 7.0, size: 110 },
];

const staticComments = [
  { author: "M. Richardson", initials: "MR", time: "Aug 12, 2026 · 2:15 PM", text: "Client mentioned during quarterly call that they're evaluating competitive bids. Recommend we lead with the expanded SOX 404 scope as justification for the increase." },
  { author: "S. Goldstein", initials: "SG", time: "Aug 10, 2026 · 9:40 AM", text: "Reviewed against peer benchmark — 9% is defensible. Meridian's realized margin is still 5.8pp below the A&A average. Approved to proceed." },
  { author: "K. Donovan", initials: "KD", time: "Aug 7, 2026 · 4:22 PM", text: "Updated scope change to 0% — confirmed with engagement team that no additional work was added this cycle. Admin fee stays at standard 10% of fixed." },
];

function computeKpis(rows: RowData[]) {
  const total = rows.length;
  const complete = rows.filter(r => r.status === "Complete").length;
  const needsReview = rows.filter(r => r.status === "Needs Review").length;
  const avgRecChange = total > 0 ? rows.reduce((s, r) => s + r.recPctChangeFromCurPrice, 0) / total : 0;
  const totalTtmRevenue = rows.reduce((s, r) => s + r.ttmRevenue, 0);
  const avgTtmMargin = total > 0 ? rows.reduce((s, r) => s + r.ttmMarginPct, 0) / total : 0;
  const costDownCount = rows.filter(r => r.costChangeCategory === "COST DOWN").length;
  return [
    { title: "REVIEW PROGRESS", value: total > 0 ? `${Math.round((complete / total) * 100)}% Complete` : "—" },
    { title: "NEEDS REVIEW #", value: `${needsReview} Items` },
    { title: "TOTAL ITEMS", value: `${total}` },
    { title: "AVG REC. CHANGE", value: `${avgRecChange.toFixed(1)}%` },
    { title: "TOTAL TTM REVENUE", value: `$${Math.round(totalTtmRevenue).toLocaleString("en-US")}` },
    { title: "AVG TTM MARGIN", value: `${avgTtmMargin.toFixed(1)}%` },
    { title: "COST DOWN COUNT", value: `${costDownCount}` },
  ];
}

const statusColors: Record<string, { bg: string; color: string }> = {
  "Needs Review": { bg: "#f5f5f5", color: "#757575" },
  "Complete": { bg: "#e8f5e9", color: "#2e7d32" },
  "Revised": { bg: "#f5f5f5", color: "#757575" },
};

const commColors: Record<string, { bg: string; color: string }> = {
  "Not Started": { bg: "#f5f5f5", color: "#757575" },
  "Sent": { bg: "#e3f2fd", color: "#1565c0" },
  "Discussed": { bg: "#fff3e0", color: "#e65100" },
  "Accepted": { bg: "#e8f5e9", color: "#2e7d32" },
};

const retentionColors: Record<string, { bg: string; color: string }> = {
  "Platinum": { bg: "#e8eaf6", color: "#283593" },
  "Gold": { bg: "#fff8e1", color: "#f57f17" },
  "Silver": { bg: "#f5f5f5", color: "#616161" },
  "Bronze": { bg: "#efebe9", color: "#4e342e" },
};

const renewalColors: Record<string, { bg: string; color: string }> = {
  "Active": { bg: "#e8f5e9", color: "#2e7d32" },
  "Up for Renewal": { bg: "#fff3e0", color: "#e65100" },
  "Renewed": { bg: "#e3f2fd", color: "#1565c0" },
  "At Risk": { bg: "rgba(211,47,47,0.12)", color: "#c62828" },
};

const costChangeColors: Record<string, { bg: string; color: string; icon: "up" | "down" | "right" }> = {
  "COST DOWN": { bg: "#e8f5e9", color: "#2e7d32", icon: "up" },
  "COST UP": { bg: "#ffebee", color: "#c62828", icon: "down" },
  "COST SAME": { bg: "#fff3e0", color: "#e65100", icon: "right" },
};

const inventoryColors: Record<string, { bg: string; color: string }> = {
  "IN STOCK": { bg: "#e8f5e9", color: "#2e7d32" },
  "AT RISK": { bg: "#fff3e0", color: "#e65100" },
  "OUT OF STOCK": { bg: "#ffebee", color: "#c62828" },
};

const approvalColors: Record<string, { bg: string; color: string }> = {
  "Needs Review": { bg: "#fff3e0", color: "#e65100" },
  "Approved": { bg: "#e8f5e9", color: "#2e7d32" },
  "Pending": { bg: "#e3f2fd", color: "#1565c0" },
};

interface Column {
  key: string;
  label: string;
  width: number;
  align?: "left" | "right" | "center";
  render?: (row: RowData) => React.ReactNode;
}

const columns: Column[] = [
  {
    key: "hasComments",
    label: "Has\nComments",
    width: 50,
    align: "center",
    render: (row) => row.hasComments ? <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "#00446a" }} /> : null,
  },
  {
    key: "status",
    label: "Status",
    width: 120,
    render: (row) => {
      const c = statusColors[row.status] || { bg: "#f5f5f5", color: "#333" };
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center", px: 1, py: 0.25, borderRadius: "4px", bgcolor: c.bg }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: c.color, whiteSpace: "nowrap" }}>{row.status}</Typography>
        </Box>
      );
    },
  },
  {
    key: "approvalStatus",
    label: "Approval Status",
    width: 130,
    render: (row) => {
      const c = approvalColors[row.approvalStatus] || { bg: "#f5f5f5", color: "#333" };
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, borderRadius: "4px", bgcolor: c.bg }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: c.color, whiteSpace: "nowrap" }}>{row.approvalStatus}</Typography>
          <ExpandMoreIcon sx={{ fontSize: 14, color: c.color }} />
        </Box>
      );
    },
  },
  { key: "reviewPriority", label: "Review\nPriority", width: 90, align: "center" },
  { key: "engineOutputReason", label: "Engine Output\nReason", width: 150 },
  { key: "rootNumber", label: "Root #", width: 100 },
  { key: "region", label: "Region", width: 110 },
  { key: "productDescription", label: "Product Description", width: 200 },
  { key: "currentListPrice", label: "Current List\nPrice", width: 110, align: "right", render: (row) => fmt(row.currentListPrice) },
  {
    key: "recPctChangeFromCurPrice",
    label: "Rec % Change\nfrom Cur. Price",
    width: 130,
    align: "right",
    render: (row) => (
      <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: "#e8f5e9" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#2e7d32" }}>{pct(row.recPctChangeFromCurPrice)}</Typography>
      </Box>
    ),
  },
  { key: "recPrice", label: "Rec. Price", width: 110, align: "right", render: (row) => fmt(row.recPrice) },
  {
    key: "revisedPrice",
    label: "Revised Price",
    width: 110,
    align: "right",
    render: (row) => <Box sx={{ bgcolor: "#b3e5fc", px: 1, py: 0.25, borderRadius: "2px", textAlign: "right" }}>{fmt(row.revisedPrice)}</Box>,
  },
  { key: "revisedPriceReasonCode", label: "Revised Price\nReason Code", width: 140 },
  { key: "grossProfit", label: "Gross Profit", width: 100, align: "right", render: (row) => fmt(row.grossProfit) },
  {
    key: "recMargin35",
    label: "Rec. Margin\n(35% discount)",
    width: 130,
    align: "right",
    render: (row) => {
      const color = row.recMargin35 >= 0 ? "#2e7d32" : "#c62828";
      return <Typography sx={{ fontSize: 12, fontWeight: 600, color }}>{fmt(row.recMargin35)}</Typography>;
    },
  },
  {
    key: "revisedPricePctFromCurrent",
    label: "Revised Price %\nfrom Current",
    width: 130,
    align: "right",
    render: (row) => <Box sx={{ bgcolor: "#b3e5fc", px: 1, py: 0.25, borderRadius: "2px", textAlign: "right" }}>{pct(row.revisedPricePctFromCurrent)}</Box>,
  },
  { key: "currentCost", label: "Current Cost", width: 100, align: "right", render: (row) => fmt(row.currentCost) },
  { key: "ttmRevenue", label: "TTM Revenue", width: 120, align: "right", render: (row) => fmt(row.ttmRevenue) },
  { key: "ttmQty", label: "TTM Qty", width: 80, align: "right", render: (row) => row.ttmQty.toLocaleString("en-US") },
  { key: "ttmMarginDollar", label: "TTM Margin $", width: 120, align: "right", render: (row) => fmt(row.ttmMarginDollar) },
  {
    key: "ttmMarginPct",
    label: "TTM Margin %",
    width: 100,
    align: "right",
    render: (row) => {
      const color = row.ttmMarginPct >= 40 ? "#2e7d32" : row.ttmMarginPct >= 25 ? "#e65100" : "#c62828";
      return <Typography sx={{ fontSize: 12, fontWeight: 600, color }}>{pct(row.ttmMarginPct)}</Typography>;
    },
  },
  { key: "make", label: "Make", width: 100 },
  { key: "model", label: "Model", width: 100 },
  { key: "yearFrom", label: "Year From", width: 80, align: "center" },
  { key: "yearTo", label: "Year To", width: 80, align: "center" },
  { key: "competitivePrice", label: "Competitive\nPrice", width: 110, align: "right", render: (row) => fmt(row.competitivePrice) },
  { key: "popularity", label: "Popularity", width: 80, align: "center" },
  { key: "productTier", label: "Product Tier", width: 90, align: "center" },
  { key: "priceFreezeFlag", label: "Price Freeze\nFlag", width: 90, align: "center", render: (row) => row.priceFreezeFlag ? "TRUE" : "FALSE" },
  {
    key: "costChangeCategory",
    label: "Cost Change\nCategory",
    width: 130,
    render: (row) => {
      const c = costChangeColors[row.costChangeCategory] || { bg: "#f5f5f5", color: "#333", icon: "right" as const };
      const Icon = c.icon === "up" ? ArrowUpwardIcon : c.icon === "down" ? ArrowDownwardIcon : ArrowForwardIcon;
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, px: 1, py: 0.25, borderRadius: "4px", bgcolor: c.bg }}>
          <Icon sx={{ fontSize: 14, color: c.color }} />
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: c.color, whiteSpace: "nowrap" }}>{row.costChangeCategory}</Typography>
        </Box>
      );
    },
  },
  {
    key: "inventoryStatus",
    label: "Inventory\nStatus",
    width: 100,
    align: "center",
    render: (row) => {
      const c = inventoryColors[row.inventoryStatus] || { bg: "#f5f5f5", color: "#333" };
      return (
        <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: c.bg }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: c.color, whiteSpace: "nowrap" }}>{row.inventoryStatus}</Typography>
        </Box>
      );
    },
  },
  { key: "expectedStockoutDays", label: "Expected\nStockout Days", width: 110, align: "right" },
  { key: "baseCompPrice", label: "Base Comp\nPrice", width: 110, align: "right", render: (row) => fmt(row.baseCompPrice) },
  { key: "mostRecentScrapeFlag", label: "Most Recent\nScrape Flag", width: 100, align: "center", render: (row) => row.mostRecentScrapeFlag ? "TRUE" : "FALSE" },
];

const psColumns: Column[] = [
  {
    key: "hasComments",
    label: "Has\nComments",
    width: 50,
    align: "center",
    render: (row) => row.hasComments ? <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: "#00446a" }} /> : null,
  },
  {
    key: "status",
    label: "Status",
    width: 120,
    render: (row) => {
      const c = statusColors[row.status] || { bg: "#f5f5f5", color: "#333" };
      return (
        <Box sx={{ display: "inline-flex", alignItems: "center", px: 1, py: 0.25, borderRadius: "4px", bgcolor: c.bg }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: c.color, whiteSpace: "nowrap" }}>{row.status}</Typography>
        </Box>
      );
    },
  },
  { key: "partnerName", label: "Engagement Lead", width: 140 },
  { key: "clientName", label: "Client Name", width: 180 },
  { key: "projectName", label: "Service Description", width: 220 },
  { key: "serviceLine", label: "Practice Area", width: 150 },
  { key: "clientTenure", label: "Client Tenure", width: 100, align: "center" },
  { key: "qtyHrs", label: "Qty (Hrs)", width: 90, align: "right", render: (row) => row.qtyHrs?.toLocaleString("en-US") ?? "—" },
  { key: "estDays", label: "Est. Days", width: 90, align: "right", render: (row) => row.estDays?.toLocaleString("en-US") ?? "—" },
  { key: "billRate", label: "Bill Rate ($/Hr)", width: 120, align: "right", render: (row) => row.billRate ? `$${row.billRate}` : "—" },
  { key: "extFees", label: "Ext. Fees ($)", width: 130, align: "right", render: (row) => row.extFees ? fmt(row.extFees) : "—" },
  { key: "vcPerHr", label: "VC/Hr", width: 90, align: "right", render: (row) => row.vcPerHr ? `$${row.vcPerHr}` : "—" },
  {
    key: "marginPct",
    label: "Margin %",
    width: 100,
    align: "right",
    render: (row) => {
      const m = row.marginPct;
      if (m == null) return "—";
      const color = m >= 40 ? "#2e7d32" : m >= 30 ? "#e65100" : "#c62828";
      return <Typography sx={{ fontSize: 12, fontWeight: 600, color }}>{m.toFixed(1)}%</Typography>;
    },
  },
  {
    key: "recBillRate",
    label: "Rec Rate ($/Hr)",
    width: 120,
    align: "right",
    render: (row) => {
      if (!row.recBillRate) return "—";
      return (
        <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: "#e8f5e9" }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#2e7d32" }}>${row.recBillRate}</Typography>
        </Box>
      );
    },
  },
  { key: "recExtFees", label: "Rec Ext. Fees", width: 130, align: "right", render: (row) => row.recExtFees ? fmt(row.recExtFees) : "—" },
  {
    key: "recMarginPct",
    label: "Rec Margin %",
    width: 110,
    align: "right",
    render: (row) => {
      const m = row.recMarginPct;
      if (m == null) return "—";
      return (
        <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: "#e8f5e9" }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#2e7d32" }}>{m.toFixed(1)}%</Typography>
        </Box>
      );
    },
  },
  {
    key: "revisedBillRate",
    label: "Revised Rate ($/Hr)",
    width: 140,
    align: "right",
    render: (row) => row.revisedBillRate ? <Box sx={{ bgcolor: "#b3e5fc", px: 1, py: 0.25, borderRadius: "2px", textAlign: "right" }}>${row.revisedBillRate}</Box> : "—",
  },
  {
    key: "revisedExtFees",
    label: "Revised Ext. Fees",
    width: 140,
    align: "right",
    render: (row) => row.revisedExtFees ? <Box sx={{ bgcolor: "#b3e5fc", px: 1, py: 0.25, borderRadius: "2px", textAlign: "right" }}>{fmt(row.revisedExtFees)}</Box> : "—",
  },
  {
    key: "revisedMarginPct",
    label: "Revised Margin %",
    width: 130,
    align: "right",
    render: (row) => {
      const m = row.revisedMarginPct;
      if (m == null) return "—";
      return (
        <Box sx={{ bgcolor: "#b3e5fc", px: 1, py: 0.25, borderRadius: "2px", textAlign: "right" }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{m.toFixed(1)}%</Typography>
        </Box>
      );
    },
  },
  {
    key: "revisedImpact",
    label: "Revised Impact $",
    width: 130,
    align: "right",
    render: (row) => {
      const positive = row.revisedImpact >= 0;
      return <Box sx={{ bgcolor: "#b3e5fc", px: 1, py: 0.25, borderRadius: "2px", textAlign: "right" }}><Typography sx={{ fontSize: 12, color: positive ? "#2e7d32" : "#c62828", fontWeight: 500 }}>{positive ? "+" : ""}{fmt(row.revisedImpact)}</Typography></Box>;
    },
  },
  { key: "revisionReason", label: "Revision Reason", width: 150, render: (row) => row.revisionReason || "—" },
  {
    key: "clientCommStatus",
    label: "Client Comm Status",
    width: 160,
    align: "center",
    render: (row) => {
      const c = commColors[row.clientCommStatus] || { bg: "#f5f5f5", color: "#333" };
      return (
        <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: c.bg }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: c.color, whiteSpace: "nowrap" }}>{row.clientCommStatus}</Typography>
        </Box>
      );
    },
  },
];

function computePsKpis(rows: RowData[]) {
  const total = rows.length;
  const complete = rows.filter(r => r.status === "Complete").length;
  const needsReview = rows.filter(r => r.status === "Needs Review").length;
  const totalHrs = rows.reduce((s, r) => s + (r.qtyHrs || 0), 0);
  const totalExtFees = rows.reduce((s, r) => s + (r.extFees || 0), 0);
  const totalRevisedFees = rows.reduce((s, r) => s + (r.revisedExtFees || 0), 0);
  const avgMargin = total > 0 ? rows.reduce((s, r) => s + (r.marginPct || 0), 0) / total : 0;
  const avgRevisedMargin = total > 0 ? rows.reduce((s, r) => s + (r.revisedMarginPct || 0), 0) / total : 0;
  return [
    { title: "REVIEW PROGRESS", value: total > 0 ? `${Math.round((complete / total) * 100)}% Complete` : "—" },
    { title: "NEEDS REVIEW #", value: `${needsReview} Items` },
    { title: "TOTAL HOURS", value: totalHrs.toLocaleString("en-US") },
    { title: "CURRENT EXT. FEES", value: `$${Math.round(totalExtFees).toLocaleString("en-US")}` },
    { title: "REVISED EXT. FEES", value: `$${Math.round(totalRevisedFees).toLocaleString("en-US")}` },
    { title: "AVG CURRENT MARGIN", value: `${avgMargin.toFixed(1)}%` },
    { title: "AVG REVISED MARGIN", value: `${avgRevisedMargin.toFixed(1)}%` },
  ];
}

const headerCellSx = {
  fontFamily: "Inter, sans-serif",
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(0,0,0,0.7)",
  whiteSpace: "nowrap" as const,
  borderBottom: "2px solid #e0e0e0",
  py: 1,
  px: 1,
};

const bodyCellSx = {
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  borderBottom: "1px solid #eee",
  py: 0.75,
  px: 1,
};

const AI_SUGGESTIONS = [
  "Review Meridian Health Systems",
  "Select all Needs Review items",
  "Sort by revised impact descending",
  "Filter to Gold retention clients",
];

interface EtpSuggestion { label: string; inputText: string; flowKey: string }
interface EtpMsg { id: string; role: "user" | "assistant"; content: string; title?: string; suggestions?: EtpSuggestion[] }
interface DsMsg { id: string; role: "user" | "assistant"; content: string; title?: string; suggestions?: EtpSuggestion[]; table?: { headers: string[]; rows: string[][] }; chart?: "rate-history" }

const psRateHistoryData = [
  { date: "Q1 2024", rate: 275 },
  { date: "Q2 2024", rate: 275 },
  { date: "Q3 2024", rate: 285, annotation: "Annual review +3.6%" },
  { date: "Q4 2024", rate: 285 },
  { date: "Q1 2025", rate: 295, annotation: "Market rate adj +3.5%" },
  { date: "Q2 2025", rate: 295 },
  { date: "Q3 2025", rate: 295 },
  { date: "Q4 2025", rate: 295 },
  { date: "Q1 2026", rate: 295 },
  { date: "Q2 2026", rate: 319, annotation: "Model rec +8.1%" },
];

const dsFlows: Record<string, { thinkingDelay: number; thinkingMessage?: string; response: Omit<DsMsg, "id" | "role"> }> = {
  "ds-comparable": {
    thinkingDelay: 1400,
    thinkingMessage: "Finding comparable engagements…",
    response: {
      title: "Comparable Engagements",
      content: "**4 engagements** match this service profile. Rates ranged from **$285–$310/hr** with average project duration of **2,225 hours**.",
      table: {
        headers: ["Engagement", "Rate/Hr", "Hrs", "Margin"],
        rows: [
          ["ERP Implementation – Greenfield Mfg", "$305", "3,200", "43.6%"],
          ["Property Mgmt Platform – Liberty Mutual", "$285", "1,500", "43.2%"],
          ["Cloud Migration – TechVault Solutions", "$305", "1,800", "43.6%"],
          ["Telehealth Rollout – Vanguard Senior Living", "$290", "1,400", "43.1%"],
        ],
      },
      suggestions: [
        { label: "Show rate trend", inputText: "Show rate trend for this engagement", flowKey: "ds-rate-trend" },
      ],
    },
  },
  "ds-rate-trend": {
    thinkingDelay: 1200,
    thinkingMessage: "Loading rate history…",
    response: {
      title: "Rate Trend",
      content: "Rate evolution over the past **10 quarters** — from **$275/hr** to a recommended **$319/hr** (+16% cumulative).",
      chart: "rate-history",
      suggestions: [
        { label: "What drives this rate?", inputText: "What drives this rate?", flowKey: "ds-rate-drivers" },
        { label: "Summarize for client call", inputText: "Summarize for client call", flowKey: "ds-client-brief" },
      ],
    },
  },
  "ds-rate-drivers": {
    thinkingDelay: 1800,
    thinkingMessage: "Analyzing rate drivers…",
    response: {
      title: "Rate Drivers",
      content: "**Current rate: $295/hr** → Recommended: **$319/hr** (+8%)\n\nThe rate recommendation is driven by three factors:\n\n• **Variable cost floor** ($168/hr) — Direct delivery cost sets the minimum viable rate. Current margin of **43.1%** leaves **$127/hr** contribution\n• **Peer rate positioning** — Current rate is $4/hr above the **$291/hr** peer average for Technology engagements, but below top-quartile at **$310/hr**\n• **Scope complexity** — Digital Transformation Roadmap carries cross-functional dependencies and executive stakeholder management that justify premium positioning\n\nThe model balances rate competitiveness against margin recovery — pushing rates too aggressively risks client pushback on a **5-year** relationship.",
      suggestions: [
        { label: "Summarize for client call", inputText: "Summarize for client call", flowKey: "ds-client-brief" },
      ],
    },
  },
  "ds-client-brief": {
    thinkingDelay: 2000,
    thinkingMessage: "Preparing client brief…",
    response: {
      title: "Client Conversation Brief",
      content: "**Meridian Health Systems — Digital Transformation Roadmap**\n\n**Opening:** \"We've completed our annual rate review for the Technology engagement. The updated rate reflects market adjustments and the team's growing expertise on your account.\"\n\n**Key points:**\n• Rate moves from **$295/hr** to **$319/hr** — an **8%** adjustment\n• This is **below** the industry average of 9–12% for Technology consulting services\n• The team's **5 Years** of institutional knowledge delivers faster ramp-up and fewer rework cycles\n• Estimated project scope remains at **1,200 hours** — no expansion in effort\n\n**If pushback on rate:** \"We can explore phased increases or scope adjustments, but the base rate needs to reflect current market conditions to retain the caliber of talent assigned to your engagement.\"",
      suggestions: [
        { label: "Show comparable engagements", inputText: "Show comparable engagements for this service", flowKey: "ds-comparable" },
        { label: "Show rate trend", inputText: "Show rate trend for this engagement", flowKey: "ds-rate-trend" },
      ],
    },
  },
};

const HL_STYLE: React.CSSProperties = { backgroundColor: "rgba(217,124,20,0.18)", boxShadow: "0 0 0 3px rgba(217,124,20,0.18)", borderRadius: 3, padding: "1px 0" };

function renderBold(text: string, highlights?: string[]): React.ReactNode[] {
  const stripped = text.replace(/\*\*/g, "");
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) => {
    const isBold = i % 2 === 1;
    const shouldHighlight = highlights?.some((h) => stripped.includes(h) && part.includes(h.slice(0, 20)));
    if (isBold && shouldHighlight) return <strong key={i}><span style={HL_STYLE}>{part}</span></strong>;
    if (isBold) return <strong key={i}>{part}</strong>;
    if (!highlights?.length) return part;
    let result: React.ReactNode[] = [part];
    for (const h of highlights) {
      const next: React.ReactNode[] = [];
      for (const seg of result) {
        if (typeof seg !== "string" || !seg.includes(h)) { next.push(seg); continue; }
        const idx = seg.indexOf(h);
        if (idx > 0) next.push(seg.slice(0, idx));
        next.push(<span key={`hl-${i}-${idx}`} style={HL_STYLE}>{h}</span>);
        if (idx + h.length < seg.length) next.push(seg.slice(idx + h.length));
      }
      result = next;
    }
    return result;
  });
}

const etpFlows: Record<string, { thinkingDelay: number; thinkingMessage?: string; response: Omit<EtpMsg, "id" | "role"> }> = {
  "internal-explanation": {
    thinkingDelay: 2000,
    thinkingMessage: "Analyzing margin and peer data...",
    response: {
      title: "Internal Price Explanation",
      content: "**Margin shortfall breakdown:**\n• Realized margin: **18.3%** vs. peer avg **24.1%** (−5.8pp gap)\n• Product cost driver: full-scope audit with SOX 404 testing + multi-entity consolidation requires 3 senior staff × 6 weeks — higher delivery cost than single-entity peers\n• Client size effect: $285K engagement carries similar fixed infrastructure cost (quality review, IT audit, independence checks) as $400K+ peers, compressing margin\n\n**Why 9.0% and not higher:**\nMeridian has accepted increases in the **6–8% range** over the past 3 cycles. A 9.0% increase is at the upper bound of their historical tolerance. Pushing to 12%+ (what pure margin math suggests) risks a pricing conversation that delays renewal.\n\n**Product context:** The SOX 404 and multi-entity scope are non-negotiable — these aren't optional add-ons. The model factors this into the recommendation: you can't scope-reduce your way to margin parity here.",
      suggestions: [
        { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "talking-points" },
        { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "anticipate-objections" },
      ],
    },
  },
  "talking-points": {
    thinkingDelay: 1800,
    thinkingMessage: "Generating talking points...",
    response: {
      title: "Client Talking Points",
      content: "**Value-based justification:**\n• CohnReznick's specialized industry expertise reduces risk of restatement and regulatory findings\n• Continuity of engagement team provides institutional knowledge that would take a new firm 12–18 months to develop\n\n**Market context:**\n• Professional services fee increases across Big 4 and large regional firms average 8–12% this cycle\n• Our proposed increase is below market average while maintaining premium service quality\n\n**Scope drivers:**\n• New ASC 842 and ESG reporting requirements are industry-mandated, not discretionary\n• Early adoption of these standards positions the client favorably with stakeholders",
      suggestions: [
        { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "anticipate-objections" },
        { label: "Draft Client Email", inputText: "Draft a client email", flowKey: "draft-email" },
      ],
    },
  },
  "anticipate-objections": {
    thinkingDelay: 2200,
    thinkingMessage: "Analyzing potential objections...",
    response: {
      title: "Anticipated Client Objections",
      content: "**\"The increase is too steep year-over-year.\"**\nResponse: The 6.5% increase is below the industry average of 8–12%. We've absorbed a portion of cost increases to maintain competitive positioning.\n\n**\"We're considering other firms.\"**\nResponse: Transitioning auditors incurs significant onboarding costs (typically 15–20% premium in year one) and creates regulatory continuity risk. Our team's institutional knowledge is a valuable asset.\n\n**\"Can we reduce scope to lower the fee?\"**\nResponse: The expanded scope items (ASC 842, ESG) are regulatory requirements. We can discuss phasing of advisory services, but core audit scope is fixed by standards.",
      suggestions: [
        { label: "Draft Client Email", inputText: "Draft a client email", flowKey: "draft-email" },
        { label: "Show Similar Engagements", inputText: "Show similar engagements", flowKey: "similar-engagements" },
      ],
    },
  },
  "draft-email": {
    thinkingDelay: 2500,
    thinkingMessage: "Drafting email...",
    response: {
      title: "Draft Client Email",
      content: "Subject: **Engagement Fee Update — Annual Review**\n\nDear [Client Contact],\n\nThank you for your continued trust in CohnReznick. As we prepare for the upcoming engagement cycle, I wanted to share the updated fee schedule.\n\nThe revised fee reflects a modest adjustment driven by expanded regulatory scope requirements and market-aligned labor rate updates. We've worked to keep this increase well below industry benchmarks while maintaining the quality and depth of service you expect.\n\nKey factors in the adjustment:\n• New regulatory compliance requirements (ASC 842, ESG reporting)\n• Market-standard labor rate corrections\n• Enhanced analytics and technology investments benefiting your engagement\n\nI'd welcome a brief call to walk through the details. Please let me know your availability this week.\n\nBest regards,\n[Partner Name]\nCohnReznick LLP",
      suggestions: [
        { label: "Show Similar Engagements", inputText: "Show similar engagements", flowKey: "similar-engagements" },
        { label: "Start Over", inputText: "Start over", flowKey: "start-over" },
      ],
    },
  },
  "similar-engagements": {
    thinkingDelay: 1500,
    thinkingMessage: "Finding similar engagements...",
    response: {
      title: "Top 5 Similar Engagements",
      content: "1. **Meridian Health Systems** — Audit & Assurance, Gold retention — $310,650 — 9.0% increase — Complete\n2. **Summit Healthcare Group** — Compliance Audit, Platinum retention — $352,000 — 10.0% increase — Needs Review\n3. **Pinnacle Consumer Brands** — Full Acctg Outsourcing, Silver retention — $171,600 — 10.0% increase — Complete\n4. **Vanguard Senior Living** — Advisory Services, Gold retention — $302,500 — 10.0% increase — Revised\n5. **National Care Alliance** — Operational Consulting, Platinum retention — $572,000 — 10.0% increase — Needs Review\n\nAverage accepted increase: **9.7%** | Average fee: **$341,750** | Current engagement is within the accepted range.",
      suggestions: [
        { label: "Get Internal Explanation", inputText: "Get internal explanation", flowKey: "internal-explanation" },
        { label: "Start Over", inputText: "Start over", flowKey: "start-over" },
      ],
    },
  },
  "why-9-pct": {
    thinkingDelay: 1800,
    thinkingMessage: "Analyzing historical acceptance and model constraints...",
    response: {
      title: "Why 9.0% — Not Higher",
      content: "The model balances **margin recovery** against **acceptance probability**.\n\n**Pure margin math says 13.4%** — that's what it would take to reach the 24.1% peer average in one cycle. But Meridian's acceptance history caps practical increases:\n• 2023 cycle: accepted **6.2%**\n• 2024 cycle: accepted **7.8%**\n• 2025 cycle: accepted **8.1%**\n\nThe model fits a tolerance curve to these data points and finds **9.0% is the 85th-percentile bound** — the highest increase with ≥85% predicted acceptance. Going to 10%+ drops acceptance probability to ~62%, which the model flags as high-risk for a Gold-tier retention client.\n\nThe remaining margin gap can be closed over **2 cycles** at lower risk than a single aggressive adjustment.",
      suggestions: [
        { label: "What If We Go Below 9%?", inputText: "What if we go below 9%?", flowKey: "below-9-scenario" },
        { label: "Break Down the Margin Gap", inputText: "Break down the margin gap", flowKey: "margin-breakdown" },
        { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "talking-points" },
      ],
    },
  },
  "margin-breakdown": {
    thinkingDelay: 1600,
    thinkingMessage: "Decomposing margin drivers...",
    response: {
      title: "Margin Gap Breakdown",
      content: "**Current realized margin: 18.3%** vs. peer average **24.1%** (−5.8pp)\n\nThe gap decomposes into three drivers:\n\n• **Product complexity** (−3.2pp) — SOX 404 + multi-entity consolidation requires 40% more senior staff hours than single-entity peers\n• **Client size effect** (−1.8pp) — $285K fee carries the same fixed overhead (quality review, IT audit, independence) as $400K+ engagements\n• **Rate compression** (−0.8pp) — Blended hourly rate is 6% below band average, legacy pricing from initial engagement win\n\n**What 9.0% addresses:** The increase recovers **3.4pp** of the 5.8pp gap, primarily closing the rate compression and partially offsetting the size effect. The remaining **2.4pp** is structural (product complexity + fixed overhead) and requires either scope repricing or a second-cycle adjustment.",
      suggestions: [
        { label: "Why 9% and Not Higher?", inputText: "Why 9% and not higher?", flowKey: "why-9-pct" },
        { label: "Show Peer Comparisons", inputText: "Show peer comparisons", flowKey: "similar-engagements" },
        { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "anticipate-objections" },
      ],
    },
  },
  "below-9-scenario": {
    thinkingDelay: 1500,
    thinkingMessage: "Running scenario analysis...",
    response: {
      title: "Scenario: Below 9%",
      content: "**If you go to 7%** (client's recent comfort zone):\n• Revised fee: **$448,350** (vs. $456,750 at 9%)\n• Margin moves to **20.1%** — still 4.0pp below peer average\n• Acceptance probability: **~95%**\n• Leaves **$8,400/year** on the table vs. the 9% recommendation\n\n**If you go to 5%:**\n• Revised fee: **$439,950**\n• Margin moves to **19.2%** — 4.9pp below peers, barely improving from current\n• You'd need a **12%+ increase** next cycle to catch up — much harder to justify\n\n**The risk:** Below 7%, the model flags this engagement as a **multi-cycle margin trap** — each under-priced cycle makes the next correction steeper and harder to get accepted.",
      suggestions: [
        { label: "Why 9% and Not Higher?", inputText: "Why 9% and not higher?", flowKey: "why-9-pct" },
        { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "talking-points" },
        { label: "Draft Client Email", inputText: "Draft a client email", flowKey: "draft-email" },
      ],
    },
  },
  "start-over": {
    thinkingDelay: 500,
    response: {
      content: "Ready to analyze another aspect of this engagement's pricing.",
      suggestions: [
        { label: "Get Internal Explanation", inputText: "Get internal explanation", flowKey: "internal-explanation" },
        { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "talking-points" },
        { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "anticipate-objections" },
      ],
    },
  },
};

const initialEtpMsg: EtpMsg = {
  id: "etp-0",
  role: "assistant",
  title: "Price Explanation",
  content: "This engagement's **realized margin is 18.3% — below the 24.1% peer average** for Audit & Assurance clients in the $250K–$350K band.\n\nThe gap is driven by two factors: **product complexity** (this is a full-scope audit with SOX 404 testing and multi-entity consolidation, which carries higher delivery cost) and **client size** (smaller clients have less fee leverage but require similar base infrastructure).\n\nThe model recommends a **9.0% increase** to close the margin gap while staying within the client's historical acceptance range. Peers of similar tenure accepted an average **9.7% increase** this cycle.",
  suggestions: [
    { label: "Why 9% and Not Higher?", inputText: "Why 9% and not higher?", flowKey: "why-9-pct" },
    { label: "Break Down the Margin Gap", inputText: "Break down the margin gap", flowKey: "margin-breakdown" },
    { label: "Show Peer Comparisons", inputText: "Show peer comparisons", flowKey: "similar-engagements" },
    { label: "What If We Go Below 9%?", inputText: "What if we go below 9%?", flowKey: "below-9-scenario" },
    { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "talking-points" },
    { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "anticipate-objections" },
  ],
};

const psInitialEtpMsg: EtpMsg = {
  id: "etp-ps-0",
  role: "assistant",
  title: "Rate Explanation",
  content: "The Digital Transformation Roadmap rate of **$295/hr** reflects current market benchmarks for senior Technology consulting talent. Peer engagements of similar scope averaged **$291/hr** last quarter. The blended margin of **43.1%** is in line with the **43.4%** peer threshold — placing this engagement in the target range.\n\nThe model recommends an **8% rate increase** to **$319/hr**, which would lift the margin to **47.3%**. This is conservative relative to the **9–12%** increases seen across the Technology portfolio this cycle — reflecting Meridian's **Gold** retention tier and the strategic value of the 5-year relationship.",
  suggestions: [
    { label: "Why 8% and Not Higher?", inputText: "Why 8% and not higher?", flowKey: "ps-why-8-pct" },
    { label: "Break Down the Margin", inputText: "Break down the margin", flowKey: "ps-margin-breakdown" },
    { label: "Show Peer Comparisons", inputText: "Show peer comparisons", flowKey: "ps-similar-engagements" },
    { label: "What If We Go Below 8%?", inputText: "What if we go below 8%?", flowKey: "ps-below-8-scenario" },
    { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "ps-talking-points" },
    { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "ps-anticipate-objections" },
  ],
};

const psEtpFlows: Record<string, { thinkingDelay: number; thinkingMessage?: string; response: Omit<EtpMsg, "id" | "role"> }> = {
  "ps-why-8-pct": {
    thinkingDelay: 1800,
    thinkingMessage: "Analyzing historical acceptance and model constraints...",
    response: {
      title: "Why 8% — Not Higher",
      content: "The model balances **margin improvement** against **rate sensitivity**.\n\n**Pure margin math says 12%** — that's what it would take to reach top-quartile positioning at **$330/hr** in one cycle. But Meridian's rate acceptance history caps practical increases:\n• 2024 renewal: accepted **$285 → $295/hr** (3.5%)\n• Prior engagement: pushed back at 10%+, settled at 7%\n\nThe model fits a tolerance curve and finds **8% is the 80th-percentile bound** — the highest increase with ≥80% predicted acceptance. Going to 10%+ drops acceptance probability to ~58%, which the model flags as high-risk for a Gold-tier client with 3 active engagements.\n\nThe remaining rate gap can be closed over **2 cycles** at lower risk than a single aggressive adjustment.",
      suggestions: [
        { label: "What If We Go Below 8%?", inputText: "What if we go below 8%?", flowKey: "ps-below-8-scenario" },
        { label: "Break Down the Margin", inputText: "Break down the margin", flowKey: "ps-margin-breakdown" },
        { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "ps-talking-points" },
      ],
    },
  },
  "ps-margin-breakdown": {
    thinkingDelay: 1600,
    thinkingMessage: "Decomposing margin drivers...",
    response: {
      title: "Margin Breakdown",
      content: "**Current margin: 43.1%** vs. peer average **43.4%** (−0.3pp)\n\nThe margin decomposes into three drivers:\n\n• **Staffing mix** (−1.8pp) — This roadmap requires a heavier mix of senior architects (65% senior vs. 50% peer norm), driving up the **$168/hr** variable cost\n• **Utilization offset** (+1.2pp) — At 1,200 hours, the engagement is well-scoped with minimal bench time, partially offsetting the staffing premium\n• **Rate positioning** (+0.3pp) — The $295/hr rate is slightly above peer average, contributing a small positive margin effect\n\n**What 8% addresses:** The increase lifts margin to **47.3%**, creating a **3.9pp** buffer above peer average. This positions the engagement for sustained profitability even if staffing mix shifts further toward senior talent in Phase 2.",
      suggestions: [
        { label: "Why 8% and Not Higher?", inputText: "Why 8% and not higher?", flowKey: "ps-why-8-pct" },
        { label: "Show Peer Comparisons", inputText: "Show peer comparisons", flowKey: "ps-similar-engagements" },
        { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "ps-anticipate-objections" },
      ],
    },
  },
  "ps-similar-engagements": {
    thinkingDelay: 1500,
    thinkingMessage: "Finding similar engagements...",
    response: {
      title: "Top 5 Similar Engagements",
      content: "1. **Meridian Health — EHR Migration Phase 2** — Technology, Gold — $310/hr — 2,400 hrs — 43.5% margin\n2. **Greenfield Mfg — ERP Implementation** — Technology, Platinum — $305/hr — 3,200 hrs — 43.6% margin\n3. **TechVault — Cloud Migration Strategy** — Technology, Silver — $305/hr — 1,800 hrs — 43.6% margin\n4. **Liberty Mutual — Property Mgmt Platform** — Technology, Gold — $285/hr — 1,500 hrs — 43.2% margin\n5. **Vanguard — Telehealth Rollout** — Technology, Silver — $290/hr — 1,400 hrs — 43.1% margin\n\nAverage rate: **$299/hr** | Average margin: **43.4%** | Current engagement is within the peer band.",
      suggestions: [
        { label: "Why 8% and Not Higher?", inputText: "Why 8% and not higher?", flowKey: "ps-why-8-pct" },
        { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "ps-talking-points" },
      ],
    },
  },
  "ps-below-8-scenario": {
    thinkingDelay: 1500,
    thinkingMessage: "Running scenario analysis...",
    response: {
      title: "Scenario: Below 8%",
      content: "**If you go to 5%** (client's recent comfort zone):\n• Revised rate: **$310/hr** (vs. $319/hr at 8%)\n• Margin moves to **45.8%** — above peer average but leaves $10.80/hr on the table\n• Acceptance probability: **~94%**\n• Leaves **$12,960** in annual revenue on the table (1,200 hrs × $10.80)\n\n**If you go to 3%:**\n• Revised rate: **$304/hr**\n• Margin moves to **44.7%** — barely above current peer average\n• You'd need a **10%+ increase** next cycle to reach top-quartile positioning\n\n**The risk:** Below 5%, the model flags this engagement as a **multi-cycle margin trap** — each under-priced cycle makes the next correction steeper and harder to get accepted.",
      suggestions: [
        { label: "Why 8% and Not Higher?", inputText: "Why 8% and not higher?", flowKey: "ps-why-8-pct" },
        { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "ps-talking-points" },
        { label: "Draft Client Email", inputText: "Draft a client email", flowKey: "ps-draft-email" },
      ],
    },
  },
  "ps-talking-points": {
    thinkingDelay: 1800,
    thinkingMessage: "Generating talking points...",
    response: {
      title: "Client Talking Points",
      content: "**Value-based justification:**\n• Our team's 5-year history with Meridian's technology landscape eliminates the 3–6 month ramp-up a new firm would require\n• The Digital Transformation Roadmap requires cross-functional expertise spanning clinical systems, data architecture, and change management — a rare combination\n\n**Market context:**\n• Technology consulting rate increases across comparable firms average 9–12% this cycle\n• Our proposed 8% increase is below market average while retaining senior talent continuity\n\n**Scope drivers:**\n• Phase 2 planning dependencies require sustained senior architect involvement\n• EHR integration complexity has increased vendor coordination requirements by ~20% since initial scoping",
      suggestions: [
        { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "ps-anticipate-objections" },
        { label: "Draft Client Email", inputText: "Draft a client email", flowKey: "ps-draft-email" },
      ],
    },
  },
  "ps-anticipate-objections": {
    thinkingDelay: 2200,
    thinkingMessage: "Analyzing potential objections...",
    response: {
      title: "Anticipated Client Objections",
      content: "**\"The rate increase is too steep.\"**\nResponse: The 8% adjustment is below the 9–12% industry average for Technology consulting. We've absorbed rising talent costs to keep this competitive.\n\n**\"We're evaluating other firms for Phase 2.\"**\nResponse: Transitioning consultants mid-transformation incurs significant knowledge transfer costs (typically 15–25% premium in year one). Our team's institutional knowledge of Meridian's EHR environment, security protocols, and stakeholder landscape is a non-trivial asset.\n\n**\"Can we reduce hours to offset the rate?\"**\nResponse: The 1,200-hour scope is calibrated to the roadmap deliverables. Reducing hours would require descoping workstreams — we can discuss which, but the core digital strategy and Phase 2 planning are interdependent.",
      suggestions: [
        { label: "Draft Client Email", inputText: "Draft a client email", flowKey: "ps-draft-email" },
        { label: "Show Peer Comparisons", inputText: "Show peer comparisons", flowKey: "ps-similar-engagements" },
      ],
    },
  },
  "ps-draft-email": {
    thinkingDelay: 2500,
    thinkingMessage: "Drafting email...",
    response: {
      title: "Draft Client Email",
      content: "Subject: **Engagement Rate Update — Digital Transformation Roadmap**\n\nDear [Client Contact],\n\nThank you for your continued partnership as we advance the Digital Transformation Roadmap. As we prepare for the next engagement cycle, I wanted to share the updated rate schedule.\n\nThe revised rate reflects market-aligned adjustments for Technology consulting talent and the increasing complexity of the program. We've kept this adjustment well below industry benchmarks while maintaining the depth of senior expertise your transformation requires.\n\nKey factors in the adjustment:\n• Market-standard rate corrections for specialized Technology consulting\n• Sustained senior architect involvement for Phase 2 planning\n• Expanded vendor coordination and EHR integration requirements\n\nThe overall scope and estimated hours remain unchanged at 1,200 hours.\n\nI'd welcome a brief call to walk through the details. Please let me know your availability this week.\n\nBest regards,\n[Partner Name]",
      suggestions: [
        { label: "Show Peer Comparisons", inputText: "Show peer comparisons", flowKey: "ps-similar-engagements" },
        { label: "Start Over", inputText: "Start over", flowKey: "ps-start-over" },
      ],
    },
  },
  "ps-start-over": {
    thinkingDelay: 500,
    response: {
      content: "Ready to analyze another aspect of this engagement's pricing.",
      suggestions: [
        { label: "Why 8% and Not Higher?", inputText: "Why 8% and not higher?", flowKey: "ps-why-8-pct" },
        { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "ps-talking-points" },
        { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "ps-anticipate-objections" },
      ],
    },
  },
};

const productLevelEtpMsg: EtpMsg = {
  id: "etp-product",
  role: "assistant",
  title: "Product-Level Price Explanation",
  content: "This instance's review definition is set to **engagement-level**. By switching the definition to **product-level**, the model breaks down the recommendation by each product line within the engagement:\n\n**SOX 404 Testing** — Current: $145,000 → Recommended: $158,000 (+9.0%)\n• Margin: 14.2% vs. 21.8% peer avg — most under-priced component\n• Requires 2 senior staff × 4 weeks; peers charge 12–18% more for equivalent scope\n• Key driver: multi-entity consolidation adds ~35% testing effort vs. single-entity\n\n**Core Audit** — Current: $210,000 → Recommended: $229,000 (+9.0%)\n• Margin: 20.1% vs. 25.3% peer avg\n• Standard scope but compressed rate card from original engagement pricing\n• ASC 842 and ESG reporting requirements added without proportional fee adjustment\n\n**IT Audit / Controls** — Current: $64,000 → Recommended: $69,750 (+9.0%)\n• Margin: 22.5% vs. 24.8% peer avg — closest to parity\n• Largely rate-driven gap; scope is appropriately sized\n\nThe model applies a **uniform 9.0% increase** across products rather than differentiated rates to simplify the client conversation. A differentiated approach (12% on SOX, 8% on Core, 6% on IT) would optimize margin faster but adds negotiation complexity.",
  suggestions: [
    { label: "Why 9% and Not Higher?", inputText: "Why 9% and not higher?", flowKey: "why-9-pct" },
    { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "talking-points" },
    { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "anticipate-objections" },
  ],
};

const complicationEtpMsg: EtpMsg = {
  id: "etp-complication",
  role: "assistant",
  title: "Alert: Market Signal Detected",
  content: "⚠️ **Win rate in Audit & Assurance has shifted -12% this quarter.** The model detected competitive pressure impacting pricing in this segment.\n\nThe recommended price has been adjusted from **$465,000 to $452,000** to maintain competitiveness while protecting margins.\n\nThis adjustment reflects real-time market signals — not a blanket correction. The model identified 3 competing bids in the last 60 days that were 8–15% below our previous recommendation.",
  suggestions: [
    { label: "Get Internal Explanation", inputText: "Get internal explanation", flowKey: "internal-explanation" },
    { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "anticipate-objections" },
    { label: "Show Similar Engagements", inputText: "Show similar engagements", flowKey: "similar-engagements" },
  ],
};

const priceHistoryData = [
  { date: "Q1 2024", price: 79.99, annotation: null as string | null },
  { date: "Q2 2024", price: 79.99, annotation: null as string | null },
  { date: "Q3 2024", price: 82.99, annotation: "Cost increase pass-through +3.8%" },
  { date: "Q4 2024", price: 82.99, annotation: null as string | null },
  { date: "Q1 2025", price: 84.99, annotation: "Competitive adjustment +2.4%" },
  { date: "Q2 2025", price: 84.99, annotation: null as string | null },
  { date: "Q3 2025", price: 87.49, annotation: "Model recommendation" },
  { date: "Q4 2025", price: 87.49, annotation: null as string | null },
  { date: "Q1 2026", price: 89.99, annotation: "Annual review +2.9%" },
  { date: "Q2 2026", price: 89.99, annotation: null as string | null },
];

const recHistoryData = [
  { period: "Q3 2024", recommended: 84.49, accepted: 82.99, status: "Overridden" as const, reason: "Competitive pressure in brakes category" },
  { period: "Q1 2025", recommended: 86.99, accepted: 84.99, status: "Overridden" as const, reason: "Volume protection — high TTM qty" },
  { period: "Q3 2025", recommended: 87.49, accepted: 87.49, status: "Accepted" as const, reason: "" },
  { period: "Q1 2026", recommended: 89.99, accepted: 89.99, status: "Accepted" as const, reason: "" },
  { period: "Q3 2026", recommended: 94.49, accepted: 0, status: "Pending" as const, reason: "" },
];

const recStatusColors: Record<string, { bg: string; color: string }> = {
  Accepted: { bg: "#e8f5e9", color: "#2e7d32" },
  Overridden: { bg: "#fff3e0", color: "#e65100" },
  Pending: { bg: "#f5f5f5", color: "#757575" },
};

function PriceHistoryView() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#00446a", mb: 0.5 }}>Price History</Typography>
      <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)", mb: 2 }}>List price over time with change annotations</Typography>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={priceHistoryData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} angle={-45} textAnchor="end" height={50} />
          <YAxis fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} tickFormatter={(v: number) => `$${v.toFixed(0)}`} domain={["dataMin - 5", "dataMax + 5"]} width={45} />
          <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]} />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00446a"
            strokeWidth={2.5}
            dot={(props: Record<string, unknown>) => {
              const idx = props.index as number;
              const entry = priceHistoryData[idx];
              const hasAnnotation = entry?.annotation;
              return (
                <circle key={idx} cx={props.cx as number} cy={props.cy as number} r={hasAnnotation ? 6 : 4} fill={hasAnnotation ? "#f08b1d" : "#00446a"} stroke="white" strokeWidth={hasAnnotation ? 2 : 0} />
              );
            }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <Box sx={{ mt: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {priceHistoryData.filter((d) => d.annotation).map((d, i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f08b1d", flexShrink: 0 }} />
            <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.6)" }}><strong>{d.date}</strong>: {d.annotation}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function RecHistoryView() {
  return (
    <Box sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#00446a", mb: 0.5 }}>Recommendation History</Typography>
      <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)", mb: 2 }}>Model recommendations vs. accepted prices</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {recHistoryData.map((entry, i) => {
          const sc = recStatusColors[entry.status];
          const delta = entry.status !== "Pending" ? entry.accepted - entry.recommended : null;
          return (
            <Paper key={i} elevation={0} sx={{ p: 1.5, border: "1px solid rgba(0,0,0,0.08)", borderRadius: "8px", borderLeft: `3px solid ${sc.color}` }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{entry.period}</Typography>
                <Box sx={{ px: 1, py: 0.25, borderRadius: "4px", bgcolor: sc.bg }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 600, color: sc.color }}>{entry.status}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Box>
                  <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)" }}>Recommended</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#00446a" }}>${entry.recommended.toLocaleString("en-US")}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)" }}>{entry.status === "Pending" ? "Pending" : "Accepted"}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: entry.status === "Pending" ? "rgba(0,0,0,0.3)" : "#333" }}>
                    {entry.status === "Pending" ? "---" : `$${entry.accepted.toLocaleString("en-US")}`}
                  </Typography>
                </Box>
                {delta !== null && (
                  <Box>
                    <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)" }}>Variance</Typography>
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: delta === 0 ? "#2e7d32" : "#e65100" }}>
                      {delta === 0 ? "Exact match" : `$${delta.toLocaleString("en-US")}`}
                    </Typography>
                  </Box>
                )}
              </Box>
              {entry.reason && <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mt: 0.75, fontStyle: "italic" }}>{entry.reason}</Typography>}
            </Paper>
          );
        })}
      </Box>
      <Paper elevation={0} sx={{ mt: 2, p: 1.5, bgcolor: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.2)", borderRadius: "8px" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#2e7d32", mb: 0.5 }}>Model Convergence</Typography>
        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.6)", lineHeight: 1.6 }}>
          The model&apos;s recommendations have been accepted without override for the last 2 cycles, indicating improved alignment with partner judgment and market conditions.
        </Typography>
      </Paper>
    </Box>
  );
}

export default function PriceReviewPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiState, setAiState] = useState<"idle" | "thinking">("idle");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [activeInstanceId, setActiveInstanceId] = useState(() => {
    if (typeof window === "undefined") return 218;
    const saved = localStorage.getItem("tempo-instance-id");
    return saved ? Number(saved) : 218;
  });
  const tableData = useMemo(() => generateTableData(activeInstanceId), [activeInstanceId]);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail;
      setActiveInstanceId(id);
      setPage(0);
      setSelectedRows(new Set());
    };
    window.addEventListener("instance-change", handler);
    return () => window.removeEventListener("instance-change", handler);
  }, []);

  const [drawerOpenRow, setDrawerOpenRow] = useState<number | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"details" | "explain" | "comments" | "decision-support" | "elasticity" | "price-comps">("explain");
  const [decisionSupportView, setDecisionSupportView] = useState<"price-history" | "rec-history">("price-history");
  const [etpMessages, setEtpMessages] = useState<EtpMsg[]>([initialEtpMsg]);
  const [etpThinking, setEtpThinking] = useState(false);
  const [etpThinkingMsg, setEtpThinkingMsg] = useState<string | undefined>();
  const etpBottomRef = useRef<HTMLDivElement>(null);
  const etpMsgIdRef = useRef(0);
  const complicationPreloadRef = useRef(false);
  const [dsMessages, setDsMessages] = useState<DsMsg[]>([]);
  const [dsThinking, setDsThinking] = useState(false);
  const [dsThinkingMsg, setDsThinkingMsg] = useState<string | undefined>();
  const dsMsgIdRef = useRef(0);
  const dsBottomRef = useRef<HTMLDivElement>(null);
  const kpiScrollRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const revisedColRef = useRef<HTMLTableCellElement>(null);
  const statusColRef = useRef<HTMLTableCellElement>(null);
  const [revisedOverlay, setRevisedOverlay] = useState<{ left: number; width: number } | null>(null);
  const [statusOverlay, setStatusOverlay] = useState<{ left: number; width: number } | null>(null);
  const [analyticsPreload, setAnalyticsPreload] = useState<string | undefined>();
  const [activeTourStep, setActiveTourStep] = useState<number | null>(null);
  const [statusFilterAnchor, setStatusFilterAnchor] = useState<HTMLElement | null>(null);
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());
  const [layoutAnchor, setLayoutAnchor] = useState<HTMLElement | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<string | null>(null);
  const [createLayoutOpen, setCreateLayoutOpen] = useState(false);
  const [expandedSubs, setExpandedSubs] = useState<Set<string>>(new Set());
  const [layoutPartnerFilter, setLayoutPartnerFilter] = useState<string | null>(null);
  const [massActionOpen, setMassActionOpen] = useState(false);
  const [massActionStep, setMassActionStep] = useState<1 | 2>(1);
  const filteredData = useMemo(() => {
    let data = tableData;
    if (statusFilter.size > 0) data = data.filter(r => statusFilter.has(r.status));
    if (layoutPartnerFilter) data = data.filter(r => r.partnerName === layoutPartnerFilter);
    return data;
  }, [tableData, statusFilter, layoutPartnerFilter]);
  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const isPS = activeInstanceId === 415;
  const activeColumns = isPS ? psColumns : columns;
  const kpiCards = useMemo(() => isPS ? computePsKpis(filteredData) : computeKpis(filteredData), [filteredData, isPS]);

  const drawerRow = drawerOpenRow !== null ? tableData[drawerOpenRow] : null;

  useEffect(() => {
    etpBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [etpMessages, etpThinking]);

  useEffect(() => {
    dsBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dsMessages, dsThinking]);

  useEffect(() => {
    if (drawerOpenRow === null) {
      setDsMessages([]);
      setDsThinking(false);
      dsMsgIdRef.current = 0;
      return;
    }
    if (!isPS || drawerOpenRow !== 0) {
      setDsMessages([]);
      setDsThinking(false);
      dsMsgIdRef.current = 0;
      return;
    }
    setDsMessages([]);
    setDsThinking(true);
    setDsThinkingMsg("Analyzing engagement data…");
    dsMsgIdRef.current = 0;
    const t = setTimeout(() => {
      setDsMessages([{
        id: "ds-0",
        role: "assistant",
        title: "Engagement Analysis",
        content: "The Technology rate of **$295/hr** reflects current market benchmarks for senior consulting talent. Peer engagements of similar scope averaged **$291/hr** last quarter. The blended margin of **43.1%** is in line with the **43.4%** threshold — placing this engagement in the target range.",
        suggestions: [
          { label: "Show comparable engagements for this service", inputText: "Show comparable engagements for this service", flowKey: "ds-comparable" },
        ],
      }]);
      setDsThinking(false);
      setDsThinkingMsg(undefined);
    }, 1200);
    return () => clearTimeout(t);
  }, [drawerOpenRow, isPS]);

  useEffect(() => {
    if (complicationPreloadRef.current) {
      complicationPreloadRef.current = false;
      return;
    }
    const activeMsg = isPS && drawerOpenRow === 0 ? psInitialEtpMsg : initialEtpMsg;
    if (drawerOpenRow === null) {
      setEtpMessages([activeMsg]);
      setEtpThinking(false);
      etpMsgIdRef.current = 0;
      return;
    }
    setEtpMessages([]);
    setEtpThinking(true);
    setEtpThinkingMsg("Loading price explanation…");
    etpMsgIdRef.current = 0;
    const t = setTimeout(() => {
      setEtpMessages([activeMsg]);
      setEtpThinking(false);
      setEtpThinkingMsg(undefined);
    }, 1500);
    return () => clearTimeout(t);
  }, [drawerOpenRow, isPS]);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) {
        setActiveTourStep(null);
        setDrawerOpenRow(null);
        setRevisedOverlay(null);
        setStatusOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setSelectedLayout(null);
        return;
      }
      setActiveTourStep(detail.step ?? null);
      if (detail.action === "open-data-layout") {
        setRevisedOverlay(null);
        setStatusOverlay(null);
        setDrawerOpenRow(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setSelectedLayout("org-region");
      } else if (detail.action === "close-data-layout") {
        setRevisedOverlay(null);
        setStatusOverlay(null);
        setDrawerOpenRow(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setSelectedLayout(null);
        setLayoutPartnerFilter(null);
      } else if (detail.action === "close-mass-action") {
        setRevisedOverlay(null);
        setStatusOverlay(null);
        setDrawerOpenRow(null);
        setMassActionOpen(false);
        setMassActionStep(1);
      } else if (detail.action === "open-mass-action") {
        setRevisedOverlay(null);
        setStatusOverlay(null);
        setDrawerOpenRow(null);
        setMassActionOpen(true);
        setMassActionStep(1);
      } else if (detail.action === "open-drawer-engagement-details") {
        setRevisedOverlay(null);
        setStatusOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setDrawerOpenRow(0);
        setActiveDrawerTab("details");
      } else if (detail.action === "open-drawer-price-history") {
        setDrawerOpenRow(0);
        setActiveDrawerTab("decision-support");
        setDecisionSupportView("price-history");
      } else if (detail.action === "open-drawer-explain-complication") {
        complicationPreloadRef.current = true;
        setDrawerOpenRow(0);
        setActiveDrawerTab("explain");
        setEtpMessages([complicationEtpMsg]);
        setEtpThinking(false);
        etpMsgIdRef.current = 1;
      } else if (detail.action === "scroll-to-revised") {
        setDrawerOpenRow(null);
        setSelectedLayout(null);
        setStatusOverlay(null);
        setTimeout(() => {
          const el = tableContainerRef.current;
          const cell = revisedColRef.current;
          if (el && cell) {
            el.scrollTo({ left: cell.offsetLeft - 80, behavior: "smooth" });
            setTimeout(() => {
              setRevisedOverlay({ left: cell.offsetLeft, width: cell.offsetWidth + 150 + 130 + 130 + 130 + 120 });
            }, 400);
          }
        }, 300);
      } else if (detail.action === "scroll-to-status") {
        setDrawerOpenRow(null);
        setSelectedLayout(null);
        setRevisedOverlay(null);
        setTimeout(() => {
          const el = tableContainerRef.current;
          const cell = statusColRef.current;
          if (el && cell) {
            el.scrollTo({ left: cell.offsetLeft - 80, behavior: "smooth" });
            setTimeout(() => {
              setStatusOverlay({ left: cell.offsetLeft, width: cell.offsetWidth + 140 });
            }, 400);
          }
        }, 300);
      } else if (detail.action === "open-drawer-decision-support") {
        setDrawerOpenRow(0);
        setActiveDrawerTab("details");
      } else if (detail.action === "open-drawer-explain-price") {
        setDrawerOpenRow(0);
        setActiveDrawerTab("explain");
      } else if (detail.action === "open-drawer-elasticity") {
        setDrawerOpenRow(0);
        setActiveDrawerTab("elasticity");
      } else if (detail.action === "open-drawer-price-comps") {
        setDrawerOpenRow(0);
        setActiveDrawerTab("price-comps");
      } else if (detail.action === "open-drawer-comments") {
        setDrawerOpenRow(0);
        setActiveDrawerTab("comments");
      } else if (detail.action === "open-drawer-rec-history") {
        setDrawerOpenRow(0);
        setActiveDrawerTab("decision-support");
        setDecisionSupportView("rec-history");
      } else if (detail.action === "reset-view") {
        setDrawerOpenRow(null);
        setRevisedOverlay(null);
        setStatusOverlay(null);
      }
    };
    window.addEventListener("tour-step", handler);

    const tempoHandler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail) {
        setActiveTourStep(null);
        setSelectedLayout(null);
        setLayoutPartnerFilter(null);
        setExpandedSubs(new Set());
        setRevisedOverlay(null);
        return;
      }
      if (detail.action === "open-data-layout") {
        setRevisedOverlay(null);
        setDrawerOpenRow(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setSelectedLayout("org-region");
      } else if (detail.action === "close-data-layout") {
        setRevisedOverlay(null);
        setDrawerOpenRow(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setSelectedLayout(null);
        setLayoutPartnerFilter(null);
      } else if (detail.action === "scroll-to-revised") {
        setDrawerOpenRow(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setSelectedLayout(null);
        setTimeout(() => {
          const el = tableContainerRef.current;
          const cell = revisedColRef.current;
          if (el && cell) {
            el.scrollTo({ left: cell.offsetLeft - 80, behavior: "smooth" });
            setTimeout(() => {
              setRevisedOverlay({ left: cell.offsetLeft, width: cell.offsetWidth + 150 + 130 + 130 + 130 + 120 });
            }, 400);
          }
        }, 300);
      } else if (detail.action === "open-drawer-price-history") {
        setRevisedOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setDrawerOpenRow(0);
        setActiveDrawerTab("decision-support");
        setDecisionSupportView("price-history");
      } else if (detail.action === "open-drawer-engagement-details") {
        setRevisedOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setDrawerOpenRow(0);
        setActiveDrawerTab("details");
      } else if (detail.action === "open-drawer-explain-price") {
        setRevisedOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setDrawerOpenRow(0);
        setActiveDrawerTab("explain");
      } else if (detail.action === "open-drawer-elasticity") {
        setRevisedOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setDrawerOpenRow(0);
        setActiveDrawerTab("elasticity");
      } else if (detail.action === "open-drawer-price-comps") {
        setRevisedOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setDrawerOpenRow(0);
        setActiveDrawerTab("price-comps");
      } else if (detail.action === "open-drawer-comments") {
        setRevisedOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
        setDrawerOpenRow(0);
        setActiveDrawerTab("comments");
      } else if (detail.action === "close-mass-action") {
        setRevisedOverlay(null);
        setDrawerOpenRow(null);
        setMassActionOpen(false);
        setMassActionStep(1);
      } else if (detail.action === "open-mass-action") {
        setRevisedOverlay(null);
        setDrawerOpenRow(null);
        setMassActionOpen(true);
        setMassActionStep(1);
      } else {
        setRevisedOverlay(null);
        setMassActionOpen(false);
        setMassActionStep(1);
      }
    };
    window.addEventListener("tempo-tour-step", tempoHandler);
    return () => {
      window.removeEventListener("tour-step", handler);
      window.removeEventListener("tempo-tour-step", tempoHandler);
    };
  }, [drawerOpenRow]);

  const handleEtpChip = (chip: EtpSuggestion) => {
    const userMsg: EtpMsg = { id: `etp-${++etpMsgIdRef.current}`, role: "user", content: chip.inputText };
    setEtpMessages((prev) => [...prev, userMsg]);
    const flow = (isPS && drawerOpenRow === 0 ? psEtpFlows[chip.flowKey] : null) || etpFlows[chip.flowKey];
    if (!flow) return;
    setEtpThinking(true);
    setEtpThinkingMsg(flow.thinkingMessage);
    setTimeout(() => {
      const response: EtpMsg = { ...flow.response, id: `etp-${++etpMsgIdRef.current}`, role: "assistant" };
      setEtpMessages((prev) => [...prev, response]);
      setEtpThinking(false);
      setEtpThinkingMsg(undefined);
    }, flow.thinkingDelay);
  };

  const handleDsChip = (chip: EtpSuggestion) => {
    const userMsg: DsMsg = { id: `ds-${++dsMsgIdRef.current}`, role: "user", content: chip.inputText };
    setDsMessages((prev) => [...prev, userMsg]);
    const flow = dsFlows[chip.flowKey];
    if (!flow) return;
    setDsThinking(true);
    setDsThinkingMsg(flow.thinkingMessage);
    setTimeout(() => {
      const response: DsMsg = { ...flow.response, id: `ds-${++dsMsgIdRef.current}`, role: "assistant" };
      setDsMessages((prev) => [...prev, response]);
      setDsThinking(false);
      setDsThinkingMsg(undefined);
    }, flow.thinkingDelay);
  };

  const totalMinWidth = activeColumns.reduce((sum, c) => sum + c.width, 0) + 100;

  const toggleRow = (globalIdx: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(globalIdx)) next.delete(globalIdx);
      else next.add(globalIdx);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    const pageIndices = paginatedData.map((row) => tableData.indexOf(row));
    const allSelected = pageIndices.every((i) => selectedRows.has(i));
    setSelectedRows((prev) => {
      const next = new Set(prev);
      pageIndices.forEach((i) => allSelected ? next.delete(i) : next.add(i));
      return next;
    });
  };

  const handleAiSubmit = (text: string) => {
    if (!text.trim()) return;
    const q = text.toLowerCase();
    const isMeridianQuery = q.includes("meridian") || q.includes("select") || q.includes("at-risk") || q.includes("review") || q.includes("bundle") || q.includes("check");
    setAiMessages((prev) => [...prev, { role: "user", text }]);
    setAiQuery("");
    setAiState("thinking");
    setTimeout(() => {
      if (isMeridianQuery) {
        const meridianIndices = tableData
          .map((row, i) => row.clientName === "Meridian Health Systems" ? i : -1)
          .filter((i) => i !== -1);
        setSelectedRows(new Set(meridianIndices));
        const engagements = meridianIndices.map((i) => tableData[i].projectName);
        setAiMessages((prev) => [
          ...prev,
          { role: "ai", text: `Selected ${meridianIndices.length} engagements for Meridian Health Systems:\n\n${engagements.map((e) => `• ${e}`).join("\n")}\n\nTotal relationship value: $500,000.` },
        ]);
      } else {
        setAiMessages((prev) => [
          ...prev,
          { role: "ai", text: `Done. I've applied "${text}" to the current view.` },
        ]);
      }
      setAiState("idle");
    }, 1500);
  };

  return (
    <AppShell>
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Left Drawer */}
        <Box sx={{ width: 53, bgcolor: "white", borderRight: "1px solid rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {[
            { icon: <HomeIcon />, active: false, path: "/" },
            { icon: <DescriptionIcon />, active: true, path: "/price-review" },
            { icon: <CheckCircleIcon />, active: false, path: "#" },
          ].map((item, i) => (
            <Box key={i} onClick={() => item.path !== "#" && router.push(item.path)} sx={{ width: 53, height: 40, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: item.active ? "#f8f8f8" : "transparent", borderLeft: item.active ? "2px solid #00446a" : "2px solid transparent", cursor: "pointer", "&:hover": { bgcolor: "#f8f8f8" } }}>
              <Box sx={{ color: item.active ? "#00446a" : "rgba(0,0,0,0.54)" }}>{item.icon}</Box>
            </Box>
          ))}
          <Box sx={{ mt: "auto", mb: 1.5 }}>
            <Tooltip title="Switch instance" placement="right" arrow>
              <Box
                onClick={() => window.dispatchEvent(new CustomEvent("open-instance-modal"))}
                sx={{ width: 53, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", "&:hover": { bgcolor: "#f8f8f8" } }}
              >
                <SwapHorizIcon sx={{ fontSize: 20, color: "rgba(0,0,0,0.45)" }} />
              </Box>
            </Tooltip>
          </Box>
        </Box>

        {/* Data Layout Side Panel */}
        {selectedLayout === "org-region" && (
          <Box data-tour="data-layout-panel" sx={{ width: 280, flexShrink: 0, bgcolor: "white", borderRight: "1px solid rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <Box sx={{ borderTop: "3px solid #00446a" }} />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, py: 1.5 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#00446a" }}>Data Layout View</Typography>
              <Typography onClick={() => { setSelectedLayout(null); setLayoutPartnerFilter(null); }} sx={{ fontSize: 16, color: "#00446a", cursor: "pointer", fontWeight: 300 }}>&laquo;</Typography>
            </Box>
            <Box sx={{ px: 2, pb: 1 }}>
              <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.5)" }}>
                <strong style={{ color: "rgba(0,0,0,0.6)" }}>Viewing:</strong> Category &gt; Make &gt; Region
              </Typography>
            </Box>
            <Box sx={{ px: 2, pb: 1.5 }}>
              <TextField size="small" fullWidth placeholder="Search Categories" sx={{ "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 11 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }} /></InputAdornment> } }} />
            </Box>
            <Box sx={{ display: "flex", gap: 2, px: 2, mb: 1 }}>
              <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", cursor: "pointer" }}>COLLAPSE ALL</Typography>
              <Typography onClick={() => { setLayoutPartnerFilter(null); setPage(0); }} sx={{ fontSize: 11, fontWeight: 600, color: layoutPartnerFilter ? "#00446a" : "rgba(0,0,0,0.3)", cursor: layoutPartnerFilter ? "pointer" : "default" }}>CLEAR SELECTION</Typography>
            </Box>
            <Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
              {[
                { label: "Brakes", pct: "22.1%", children: [
                  { name: "Ford", partners: ["Northeast", "Southeast", "Midwest"] },
                  { name: "Toyota", partners: ["West", "Northeast"] },
                  { name: "Honda", partners: ["Southeast", "Midwest"] },
                  { name: "Chevrolet", partners: ["West", "Northeast", "Southeast"] },
                ]},
                { label: "Filters", pct: "18.4%", children: [
                  { name: "Toyota", partners: ["Northeast", "West"] },
                  { name: "BMW", partners: ["Northeast", "Southeast"] },
                  { name: "Nissan", partners: ["Midwest"] },
                  { name: "Hyundai", partners: ["West", "Southeast"] },
                ]},
                { label: "Engine", pct: "16.7%", children: [
                  { name: "Ford", partners: ["Midwest", "Northeast"] },
                  { name: "Chevrolet", partners: ["Southeast", "West"] },
                  { name: "Honda", partners: ["Northeast"] },
                ]},
                { label: "Suspension", pct: "14.2%", children: [
                  { name: "Toyota", partners: ["West", "Midwest"] },
                  { name: "BMW", partners: ["Northeast"] },
                  { name: "Ford", partners: ["Southeast", "West"] },
                ]},
                { label: "Electrical", pct: "10.8%", children: [
                  { name: "Nissan", partners: ["Midwest", "Southeast"] },
                  { name: "Hyundai", partners: ["West"] },
                  { name: "Honda", partners: ["Northeast", "Southeast"] },
                ]},
                { label: "Cooling", pct: "8.3%", children: [
                  { name: "Ford", partners: ["Northeast"] },
                  { name: "Chevrolet", partners: ["Midwest", "West"] },
                ]},
                { label: "Drivetrain", pct: "5.1%", children: [
                  { name: "Toyota", partners: ["Southeast"] },
                  { name: "BMW", partners: ["West", "Northeast"] },
                ]},
                { label: "Exhaust", pct: "2.9%", children: [
                  { name: "Nissan", partners: ["Midwest"] },
                  { name: "Hyundai", partners: ["Southeast", "West"] },
                ]},
                { label: "Steering", pct: "1.5%", children: [
                  { name: "Honda", partners: ["Northeast"] },
                  { name: "Ford", partners: ["Midwest", "Southeast"] },
                ]},
              ].map((folder) => (
                <Box key={folder.label}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, py: 1, cursor: "pointer", borderRadius: "4px", "&:hover": { bgcolor: "rgba(0,0,0,0.03)" } }}>
                    <ExpandMoreIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.4)" }} />
                    <FolderIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.25)" }} />
                    <Typography sx={{ fontSize: 12, color: "#333", fontWeight: 500, flex: 1 }}>{folder.label}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "rgba(0,0,0,0.2)" }} />
                      <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>{folder.pct}</Typography>
                    </Box>
                  </Box>
                  {folder.children.map((child) => {
                    const subKey = `${folder.label}::${child.name}`;
                    const isOpen = expandedSubs.has(subKey);
                    return (
                      <Box key={child.name}>
                        <Box
                          onClick={() => setExpandedSubs(prev => { const next = new Set(prev); next.has(subKey) ? next.delete(subKey) : next.add(subKey); return next; })}
                          sx={{ display: "flex", alignItems: "center", gap: 1, pl: 4.5, pr: 1, py: 0.75, cursor: "pointer", borderRadius: "4px", "&:hover": { bgcolor: "rgba(0,0,0,0.03)" } }}
                        >
                          <ChevronRightIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.3)", transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }} />
                          <DescriptionIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.2)" }} />
                          <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.6)", flex: 1 }}>{child.name}</Typography>
                          <Box sx={{ width: 5, height: 5, borderRadius: "50%", bgcolor: "rgba(0,0,0,0.15)" }} />
                        </Box>
                        {isOpen && child.partners.map((partner) => (
                          <Box
                            key={partner}
                            onClick={() => { setLayoutPartnerFilter(prev => prev === partner ? null : partner); setPage(0); }}
                            sx={{ display: "flex", alignItems: "center", gap: 1, pl: 8, pr: 1, py: 0.5, cursor: "pointer", borderRadius: "4px", bgcolor: layoutPartnerFilter === partner ? "rgba(0,68,106,0.08)" : "transparent", "&:hover": { bgcolor: layoutPartnerFilter === partner ? "rgba(0,68,106,0.12)" : "rgba(0,0,0,0.03)" } }}
                          >
                            <PersonIcon sx={{ fontSize: 13, color: layoutPartnerFilter === partner ? "#00446a" : "rgba(0,0,0,0.2)" }} />
                            <Typography sx={{ fontSize: 10.5, color: layoutPartnerFilter === partner ? "#00446a" : "rgba(0,0,0,0.5)", fontWeight: layoutPartnerFilter === partner ? 600 : 400 }}>{partner}</Typography>
                          </Box>
                        ))}
                      </Box>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {/* Main content */}
        <Box data-tour="tempo-full-page" sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#f8f8f8", position: "relative" }}>
          <Box sx={{ px: 3, pt: 2.5, pb: 1.5, bgcolor: "rgba(0,0,0,0.04)", display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 400, color: "#00446a", letterSpacing: "0.25px", lineHeight: "42px" }}>
                Price Review
              </Typography>
              <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.4)", fontWeight: 400 }}>
                {({ 218: "Fixed Fee Model", 362: "Tax Recommendation Review", 651: "Tax Engagement Fees Review", 415: "Professional Services", 103: "Fixed Fee Model (UAT)", 146: "Tax Engagement Fees (UAT)", 203: "Tax Recommendation (UAT)" } as Record<number, string>)[activeInstanceId] || ""}
              </Typography>
            </Box>
          </Box>

          {/* KPI Cards */}
          <Box data-tour="kpi-cards" sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 2 }}>
            <IconButton onClick={() => kpiScrollRef.current?.scrollBy({ left: -430, behavior: "smooth" })} sx={{ width: 27, height: 63, borderRadius: "6px", bgcolor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0, "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}>
              <ChevronLeftIcon sx={{ fontSize: 16, color: "#00446a" }} />
            </IconButton>
            <Box ref={kpiScrollRef} sx={{ display: "flex", gap: 1.5, flex: 1, overflow: "hidden", scrollBehavior: "smooth" }}>
              {kpiCards.map((card) => (
                <Paper key={card.title} elevation={0} sx={{ bgcolor: "white", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px", px: 2, py: 1.25, minWidth: 200, flexShrink: 0 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, letterSpacing: "1px", textTransform: "uppercase", lineHeight: "32px" }}>{card.title}</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.15px", lineHeight: "24px" }}>{card.value}</Typography>
                </Paper>
              ))}
            </Box>
            <IconButton onClick={() => kpiScrollRef.current?.scrollBy({ left: 430, behavior: "smooth" })} sx={{ width: 27, height: 63, borderRadius: "6px", bgcolor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0, "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}>
              <ChevronRightIcon sx={{ fontSize: 16, color: "#00446a" }} />
            </IconButton>
          </Box>

          {/* Toolbar */}
          <Box data-tour="toolbar-area" sx={{ display: "flex", alignItems: "center", gap: "5px", px: 3, py: 1 }}>
            {[FilterListIcon, ViewColumnIcon, TableRowsIcon].map((Icon, i) => (
              <IconButton key={i} size="small" sx={{ height: 30, width: 30, borderRadius: "6px", bgcolor: "white", border: "1px solid rgba(0,0,0,0.12)", "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.24)" } }}>
                <Icon sx={{ fontSize: 20, color: "rgba(0,0,0,0.6)" }} />
              </IconButton>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "rgba(0,0,0,0.3)" }} />
            {["Toggle Filters", "Manage Columns"].map((label) => (
              <Button key={label} variant="outlined" size="small" sx={{ height: 30, px: 1.5, borderColor: "rgba(0,0,0,0.12)", borderRadius: "6px", color: "rgba(0,0,0,0.6)", fontSize: 10, fontWeight: 500, textTransform: "none", minWidth: 0, "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.24)" } }}>
                {label}
              </Button>
            ))}
            <Button data-tour="data-layout-btn" variant="outlined" size="small" onClick={(e) => setLayoutAnchor(e.currentTarget)} sx={{ height: 30, px: 1.5, borderColor: layoutAnchor ? "#00446a" : "rgba(0,0,0,0.12)", borderRadius: "6px", color: layoutAnchor ? "#00446a" : "rgba(0,0,0,0.6)", fontSize: 10, fontWeight: 500, textTransform: "none", minWidth: 0, bgcolor: layoutAnchor ? "rgba(0,68,106,0.04)" : undefined, "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.24)" } }}>
              Data Layouts
            </Button>
            <Button data-tour="mass-action-btn" variant="outlined" size="small" onClick={() => setMassActionOpen(true)} sx={{ height: 30, px: 1.5, borderColor: selectedRows.size > 0 ? "rgba(0,0,0,0.24)" : "rgba(0,0,0,0.12)", borderRadius: "6px", fontSize: 10, fontWeight: 500, textTransform: "none", minWidth: 0, color: selectedRows.size > 0 ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.6)", "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.24)" } }}>
              Create Mass Action{selectedRows.size > 0 ? ` to ${selectedRows.size} Items` : ""}
            </Button>
            <Button variant="outlined" size="small" sx={{ height: 30, px: 1.5, borderColor: "rgba(0,0,0,0.12)", borderRadius: "6px", color: "rgba(0,0,0,0.6)", fontSize: 10, fontWeight: 500, textTransform: "none", minWidth: 0, "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.24)" } }}>
              Mark as Complete
            </Button>
            <Box sx={{ flex: 1 }} />
            <IconButton
              size="small"
              onClick={() => setAiOpen(!aiOpen)}
              sx={{
                height: 30,
                width: 30,
                borderRadius: "6px",
                bgcolor: aiOpen ? "#00446a" : "white",
                border: aiOpen ? "1px solid #00446a" : "1px solid rgba(0,0,0,0.12)",
                "&:hover": { bgcolor: aiOpen ? "#003354" : "rgba(0,0,0,0.04)", borderColor: aiOpen ? "#003354" : "rgba(0,0,0,0.24)" },
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 18, color: aiOpen ? "white" : "#00446a" }} />
            </IconButton>
            <IconButton size="small" sx={{ height: 30, width: 30, borderRadius: "6px", bgcolor: "white", border: "1px solid rgba(0,0,0,0.12)", "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.24)" } }}>
              <SettingsOverscanIcon sx={{ fontSize: 20, color: "rgba(0,0,0,0.6)" }} />
            </IconButton>
          </Box>

          {/* Table */}
          <TableContainer ref={tableContainerRef} data-tour="data-table" component={Paper} elevation={0} sx={{ flex: 1, mx: 3, bgcolor: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", overflow: "auto", position: "relative" }}>
            <Table size="small" stickyHeader sx={{ minWidth: totalMinWidth }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ ...headerCellSx, bgcolor: "#fafafa", width: 42, minWidth: 42 }}>
                    <Checkbox
                      size="small"
                      sx={{ p: 0 }}
                      checked={paginatedData.length > 0 && paginatedData.every((row) => selectedRows.has(tableData.indexOf(row)))}
                      indeterminate={paginatedData.some((row) => selectedRows.has(tableData.indexOf(row))) && !paginatedData.every((row) => selectedRows.has(tableData.indexOf(row)))}
                      onChange={toggleAllOnPage}
                    />
                  </TableCell>
                  <TableCell sx={{ ...headerCellSx, bgcolor: "#fafafa", width: 38, minWidth: 38 }} />
                  {activeColumns.map((col) => (
                    <TableCell key={col.key} align={col.align || "left"} ref={col.key === "revisedFixedFee" || col.key === "revisedBillRate" || col.key === "revisedPrice" ? revisedColRef : col.key === "status" ? statusColRef : undefined} sx={{ ...headerCellSx, bgcolor: "#fafafa", width: col.width, minWidth: col.width, ...(col.label.includes("\n") && { whiteSpace: "pre-line", lineHeight: 1.3 }) }}>
                      {col.key === "status" ? (
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span>{col.label}</span>
                          <IconButton size="small" onClick={(e) => setStatusFilterAnchor(e.currentTarget)} sx={{ ml: 0.5, p: 0.25, color: statusFilter.size > 0 ? "#00446a" : "rgba(0,0,0,0.3)" }}>
                            <MoreVertIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>
                      ) : col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, idx) => {
                  const globalIdx = tableData.indexOf(row);
                  const isSelected = selectedRows.has(globalIdx);
                  return (
                  <TableRow key={idx} hover sx={{ bgcolor: drawerOpenRow === globalIdx ? "rgba(0,68,106,0.12)" : isSelected ? "rgba(0,68,106,0.08)" : idx % 2 === 0 ? "#fff" : "#fafafa", boxShadow: drawerOpenRow === globalIdx ? "inset 3px 0 0 #00446a" : "none", transition: "background-color 0.2s ease" }}>
                    <TableCell padding="checkbox" sx={{ ...bodyCellSx, width: 42, minWidth: 42 }}>
                      <Checkbox size="small" sx={{ p: 0, color: isSelected ? "#00446a" : undefined, "&.Mui-checked": { color: "#00446a" } }} checked={isSelected} onChange={() => toggleRow(globalIdx)} />
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, width: 38, minWidth: 38 }}>
                      <AddCircleOutlineIcon onClick={() => { setDrawerOpenRow(drawerOpenRow === globalIdx ? null : globalIdx); setActiveDrawerTab(isPS && globalIdx === 0 ? "decision-support" : "explain"); setAnalyticsPreload(undefined); }} sx={{ fontSize: 20, color: drawerOpenRow === globalIdx ? "#00446a" : "rgba(0,0,0,0.4)", cursor: "pointer" }} />
                    </TableCell>
                    {activeColumns.map((col) => (
                      <TableCell key={col.key} align={col.align || "left"} sx={bodyCellSx}>
                        {col.render ? col.render(row) : (row as unknown as Record<string, unknown>)[col.key] as React.ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {revisedOverlay && (
              <Box
                data-tour="revised-columns"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: revisedOverlay.left,
                  width: revisedOverlay.width,
                  height: "100%",
                  pointerEvents: "none",
                }}
              />
            )}
            {statusOverlay && (
              <Box
                data-tour="status-columns"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: statusOverlay.left,
                  width: statusOverlay.width,
                  height: "100%",
                  pointerEvents: "none",
                }}
              />
            )}
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[25, 50, 100]}
            sx={{ mx: 3, mb: 1, bgcolor: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}
          />

          <Popover
            open={Boolean(statusFilterAnchor)}
            anchorEl={statusFilterAnchor}
            onClose={() => setStatusFilterAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{ paper: { sx: { borderRadius: "8px", minWidth: 180, py: 0.5 } } }}
          >
            <Box sx={{ px: 2, py: 1, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
              <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#00446a" }}>Filter by Status</Typography>
            </Box>
            {["Needs Review", "Complete", "Revised"].map((s) => (
              <Box
                key={s}
                onClick={() => {
                  const next = new Set(statusFilter);
                  if (next.has(s)) next.delete(s); else next.add(s);
                  setStatusFilter(next);
                  setPage(0);
                }}
                sx={{ display: "flex", alignItems: "center", gap: 1, px: 2, py: 0.75, cursor: "pointer", "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}
              >
                <Checkbox size="small" checked={statusFilter.has(s)} sx={{ p: 0, color: "#00446a", "&.Mui-checked": { color: "#00446a" } }} />
                <Box sx={{ display: "inline-flex", alignItems: "center", px: 1, py: 0.25, borderRadius: "4px", bgcolor: (statusColors[s] || { bg: "#f5f5f5" }).bg }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 500, color: (statusColors[s] || { color: "#333" }).color }}>{s}</Typography>
                </Box>
              </Box>
            ))}
            {statusFilter.size > 0 && (
              <Box sx={{ px: 2, py: 1, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                <Typography onClick={() => { setStatusFilter(new Set()); setPage(0); }} sx={{ fontSize: 11, color: "#00446a", cursor: "pointer", fontWeight: 500, "&:hover": { textDecoration: "underline" } }}>Clear filter</Typography>
              </Box>
            )}
          </Popover>

          {/* AI Assistant Panel */}
          {aiOpen && (
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                bottom: 16,
                right: 16,
                width: 380,
                height: 480,
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                zIndex: 1000,
                border: "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {/* Panel Header */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                <Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#000" }}>AI Assistant</Typography>
                  <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>New conversation</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton size="small" sx={{ color: "rgba(0,0,0,0.4)" }}>
                    <AddIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton size="small" sx={{ color: "rgba(0,0,0,0.4)" }}>
                    <HistoryIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton size="small" onClick={() => setAiOpen(false)} sx={{ color: "rgba(0,0,0,0.4)" }}>
                    <CloseIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Messages Area */}
              <Box sx={{ flex: 1, overflowY: "auto", px: 2.5, py: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {aiMessages.length === 0 ? (
                  <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.3)" }}>No prompt history</Typography>
                  </Box>
                ) : (
                  aiMessages.map((msg, i) => (
                    <Box
                      key={i}
                      sx={{
                        alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                        maxWidth: "85%",
                        px: 1.75,
                        py: 1,
                        borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                        bgcolor: msg.role === "user" ? "#00446a" : "rgba(0,0,0,0.04)",
                        color: msg.role === "user" ? "white" : "#000",
                      }}
                    >
                      <Typography sx={{ fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-line" }}>{msg.text}</Typography>
                    </Box>
                  ))
                )}
                {aiState === "thinking" && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.75, py: 1, bgcolor: "rgba(0,0,0,0.04)", borderRadius: "12px 12px 12px 2px", alignSelf: "flex-start" }}>
                    <CircularProgress size={14} sx={{ color: "#00446a" }} />
                    <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>Thinking…</Typography>
                  </Box>
                )}
              </Box>

              {/* Input Area */}
              <Box sx={{ px: 2, pb: 1.5, pt: 1, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type or record a prompt..."
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAiSubmit(aiQuery); }}
                  sx={{
                    mb: 1.25,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "8px",
                      fontSize: 13,
                      borderColor: "#00446a",
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#00446a", borderWidth: 2 },
                    },
                  }}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <MicIcon sx={{ fontSize: 20, color: "rgba(0,0,0,0.35)" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => handleAiSubmit(aiQuery)} sx={{ color: "#00446a" }}>
                            <SendIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <Box>
                  <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.4)", mb: 0.75 }}>Suggestions</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {AI_SUGGESTIONS.map((s) => (
                      <Chip
                        key={s}
                        label={s}
                        size="small"
                        clickable
                        onClick={() => handleAiSubmit(s)}
                        sx={{
                          fontSize: 11,
                          height: 28,
                          borderRadius: "14px",
                          bgcolor: "rgba(0,0,0,0.04)",
                          border: "1px solid rgba(0,0,0,0.1)",
                          color: "rgba(0,0,0,0.65)",
                          "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>

        {/* Right-side Decision Support Drawer */}
        {drawerOpenRow !== null && drawerRow && (
          <Box data-tour="drawer" sx={{ display: "flex", flexShrink: 0, height: "100%" }}>
            {/* Icon tab strip */}
            <Box sx={{ width: 44, bgcolor: "white", borderLeft: "1px solid rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", pt: 1.5, gap: 0.5 }}>
              {([
                { key: "explain" as const, icon: <AutoAwesomeIcon sx={{ fontSize: 20 }} />, tooltip: "Explain The Price" },
                { key: "elasticity" as const, icon: <ShowChartIcon sx={{ fontSize: 20 }} />, tooltip: "Elasticity" },
                { key: "price-comps" as const, icon: <BubbleChartIcon sx={{ fontSize: 20 }} />, tooltip: "Price Comps" },
                { key: "decision-support" as const, icon: <BarChartIcon sx={{ fontSize: 20 }} />, tooltip: isPS && drawerOpenRow === 0 ? "Decision Support" : "Price History" },
                { key: "details" as const, icon: <InfoOutlinedIcon sx={{ fontSize: 20 }} />, tooltip: isPS ? "Engagement Details" : "Product Details" },
                { key: "comments" as const, icon: <ChatBubbleOutlineIcon sx={{ fontSize: 20 }} />, tooltip: "Comments" },
              ]).map((tab) => (
                <Tooltip key={tab.key} title={tab.tooltip} placement="left" arrow>
                  <IconButton
                    size="small"
                    onClick={() => setActiveDrawerTab(tab.key)}
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "6px",
                      color: activeDrawerTab === tab.key ? "#00446a" : "rgba(0,0,0,0.4)",
                      bgcolor: activeDrawerTab === tab.key ? "rgba(0,68,106,0.08)" : "transparent",
                      "&:hover": { bgcolor: activeDrawerTab === tab.key ? "rgba(0,68,106,0.12)" : "rgba(0,0,0,0.04)" },
                    }}
                  >
                    {tab.icon}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>

            {/* Content panel */}
            <Box sx={{ width: 420, borderLeft: "1px solid rgba(0,0,0,0.1)", bgcolor: "white", display: "flex", flexDirection: "column", overflow: "hidden" }}>
              {/* Drawer header */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, py: 1.5, borderBottom: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>
                  {activeDrawerTab === "decision-support" ? (isPS && drawerOpenRow === 0 ? "Decision Support" : "Price History") : activeDrawerTab === "details" ? (isPS ? "Engagement Details" : "Product Details") : activeDrawerTab === "explain" ? "Explain The Price" : activeDrawerTab === "elasticity" ? "Elasticity" : activeDrawerTab === "price-comps" ? "Price Comps" : "Comments"}
                </Typography>
                <IconButton size="small" onClick={() => setDrawerOpenRow(null)} sx={{ color: "rgba(0,0,0,0.4)" }}>
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>

              {/* Tab content */}
              <Box
                key={activeDrawerTab}
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  animation: "drawerTabIn 0.3s ease",
                  "@keyframes drawerTabIn": {
                    from: { opacity: 0, transform: "translateY(6px)" },
                    to: { opacity: 1, transform: "translateY(0)" },
                  },
                }}
              >
                {/* Decision Support Tab */}
                {activeDrawerTab === "decision-support" && (
                  isPS && drawerOpenRow === 0 ? (
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column" }}>
                        {dsMessages.map((msg) => (
                          <Box key={msg.id} sx={{ mb: 1.5, display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                            <Box sx={{ maxWidth: "90%", px: 1.75, py: 1.25, borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", bgcolor: msg.role === "user" ? "#00446a" : "rgba(0,0,0,0.04)", color: msg.role === "user" ? "white" : "#333" }}>
                              {msg.title && <Typography sx={{ fontSize: 12, fontWeight: 700, color: msg.role === "user" ? "rgba(255,255,255,0.7)" : "#00446a", mb: 0.5 }}>{msg.title}</Typography>}
                              <Typography sx={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{renderBold(msg.content)}</Typography>
                              {msg.table && (
                                <Box sx={{ mt: 1.5, borderRadius: "6px", overflow: "hidden", border: "1px solid rgba(0,0,0,0.12)" }}>
                                  <Table size="small">
                                    <TableHead>
                                      <TableRow sx={{ bgcolor: "rgba(0,68,106,0.06)" }}>
                                        {msg.table.headers.map((h, hi) => (
                                          <TableCell key={hi} sx={{ fontSize: 11, fontWeight: 700, color: "#00446a", py: 0.75, px: 1.25, borderBottom: "1px solid rgba(0,0,0,0.12)" }}>{h}</TableCell>
                                        ))}
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {msg.table.rows.map((row, ri) => (
                                        <TableRow key={ri} sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                          {row.map((cell, ci) => (
                                            <TableCell key={ci} sx={{ fontSize: 12, py: 0.75, px: 1.25, color: "#333", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>{cell}</TableCell>
                                          ))}
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </Box>
                              )}
                              {msg.chart === "rate-history" && (
                                <Box sx={{ mt: 1.5 }}>
                                  <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={psRateHistoryData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                      <XAxis dataKey="date" fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} angle={-45} textAnchor="end" height={50} />
                                      <YAxis fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} tickFormatter={(v: number) => `$${v}`} domain={[260, 330]} width={40} />
                                      <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(value) => [`$${Number(value)}/hr`, "Rate"]} />
                                      <Line type="monotone" dataKey="rate" stroke="#00446a" strokeWidth={2.5} dot={(props: Record<string, unknown>) => { const idx = props.index as number; const entry = psRateHistoryData[idx]; const has = !!(entry as Record<string, unknown>)?.annotation; return <circle key={idx} cx={props.cx as number} cy={props.cy as number} r={has ? 6 : 4} fill={has ? "#f08b1d" : "#00446a"} stroke="white" strokeWidth={has ? 2 : 0} />; }} activeDot={{ r: 6 }} />
                                    </LineChart>
                                  </ResponsiveContainer>
                                  <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                                    {psRateHistoryData.filter((d) => d.annotation).map((d, i) => (
                                      <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#f08b1d", flexShrink: 0 }} />
                                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.6)" }}><strong>{d.date}</strong>: {d.annotation}</Typography>
                                      </Box>
                                    ))}
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        ))}
                        {dsThinking && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.75, py: 1, bgcolor: "rgba(0,0,0,0.04)", borderRadius: "12px 12px 12px 2px", alignSelf: "flex-start", mb: 1.5 }}>
                            <CircularProgress size={14} sx={{ color: "#00446a" }} />
                            <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>{dsThinkingMsg || "Thinking…"}</Typography>
                          </Box>
                        )}
                        {!dsThinking && (() => {
                          const last = [...dsMessages].reverse().find((m) => m.role === "assistant");
                          if (!last?.suggestions?.length) return null;
                          return (
                            <Box sx={{ py: 1 }}>
                              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                                {last.suggestions.map((s) => (
                                  <Chip key={s.label} label={s.label} size="small" clickable onClick={() => handleDsChip(s)} sx={{ fontSize: 11, height: 28, borderRadius: "14px", bgcolor: "rgba(0,68,106,0.06)", border: "1px solid rgba(0,68,106,0.2)", color: "#00446a", fontWeight: 500, "&:hover": { bgcolor: "rgba(0,68,106,0.12)" } }} />
                                ))}
                              </Box>
                            </Box>
                          );
                        })()}
                        <div ref={dsBottomRef} />
                      </Box>
                      <Box sx={{ px: 2, py: 1, borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center", flexShrink: 0 }}>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.35)", fontStyle: "italic" }}>
                          Data sourced from this review cycle. Context is engagement-specific.
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                      <Box sx={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}>
                        {([
                          { key: "price-history" as const, label: "Price History" },
                          { key: "rec-history" as const, label: "Recommendations" },
                        ]).map((sv) => (
                          <Box
                            key={sv.key}
                            onClick={() => setDecisionSupportView(sv.key)}
                            sx={{
                              flex: 1,
                              py: 1.25,
                              textAlign: "center",
                              cursor: "pointer",
                              borderBottom: decisionSupportView === sv.key ? "2px solid #00446a" : "2px solid transparent",
                              color: decisionSupportView === sv.key ? "#00446a" : "rgba(0,0,0,0.4)",
                              fontWeight: decisionSupportView === sv.key ? 600 : 400,
                              fontSize: 12,
                              fontFamily: "Inter, sans-serif",
                              transition: "all 0.15s ease",
                              "&:hover": { color: "#00446a", bgcolor: "rgba(0,68,106,0.04)" },
                            }}
                          >
                            {sv.label}
                          </Box>
                        ))}
                      </Box>
                      <Box
                        key={decisionSupportView}
                        sx={{
                          flex: 1,
                          overflowY: "auto",
                          animation: "drawerContentIn 0.35s ease",
                          "@keyframes drawerContentIn": {
                            from: { opacity: 0, transform: "translateY(8px)" },
                            to: { opacity: 1, transform: "translateY(0)" },
                          },
                        }}
                      >
                        {decisionSupportView === "price-history" ? <PriceHistoryView /> : <RecHistoryView />}
                      </Box>
                    </Box>
                  )
                )}

                {/* Product Details Tab */}
                {activeDrawerTab === "details" && (
                  <Box sx={{ p: 2.5 }}>
                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>{isPS ? "Client" : "Product"}</Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{isPS ? drawerRow.clientName : drawerRow.productDescription}</Typography>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>{isPS ? "Project" : "Root #"}</Typography>
                        <Typography sx={{ fontSize: 13, color: "#333" }}>{isPS ? drawerRow.projectName : drawerRow.rootNumber}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>{isPS ? "Service Line" : "Category"}</Typography>
                        <Typography sx={{ fontSize: 13, color: "#333" }}>{drawerRow.serviceLine}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>{isPS ? "Partner" : "Make / Model"}</Typography>
                        <Typography sx={{ fontSize: 13, color: "#333" }}>{isPS ? drawerRow.partnerName : `${drawerRow.make} ${drawerRow.model}`}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Status</Typography>
                        {(() => { const c = statusColors[drawerRow.status] || { bg: "#f5f5f5", color: "#333" }; return <Chip label={drawerRow.status} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 500, fontSize: 11, height: 22 }} />; })()}
                      </Box>
                      {isPS ? (
                        <>
                          <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Retention</Typography>
                            {(() => { const c = retentionColors[drawerRow.retentionBucket] || { bg: "#f5f5f5", color: "#333" }; return <Chip label={drawerRow.retentionBucket} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 500, fontSize: 11, height: 22 }} />; })()}
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Renewal Status</Typography>
                            {(() => { const c = renewalColors[drawerRow.clientRenewalStatus] || { bg: "#f5f5f5", color: "#333" }; return <Chip label={drawerRow.clientRenewalStatus} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 500, fontSize: 11, height: 22 }} />; })()}
                          </Box>
                        </>
                      ) : (
                        <>
                          <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Inventory Status</Typography>
                            {(() => { const c = inventoryColors[drawerRow.inventoryStatus] || { bg: "#f5f5f5", color: "#333" }; return <Chip label={drawerRow.inventoryStatus} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 500, fontSize: 11, height: 22 }} />; })()}
                          </Box>
                          <Box>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Cost Change</Typography>
                            {(() => { const c = costChangeColors[drawerRow.costChangeCategory] || { bg: "#f5f5f5", color: "#333", icon: "right" as const }; return <Chip label={drawerRow.costChangeCategory} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 500, fontSize: 11, height: 22 }} />; })()}
                          </Box>
                        </>
                      )}
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 1.5 }}>{isPS ? "Fee Summary" : "Pricing Summary"}</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.25 }}>{isPS ? "Current Fixed Fee" : "Current List Price"}</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{fmt(isPS ? drawerRow.currentFixedFee : drawerRow.currentListPrice)}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.25 }}>{isPS ? "Recommended Fee" : "Rec. Price"}</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#00446a" }}>{fmt(isPS ? drawerRow.recFixedFee : drawerRow.recPrice)}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.25 }}>{isPS ? "Revised Fixed Fee" : "Revised Price"}</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{fmt(isPS ? drawerRow.revisedFixedFee : drawerRow.revisedPrice)}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.25 }}>{isPS ? "Revised Total Fee" : "Current Cost"}</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#333" }}>{fmt(isPS ? drawerRow.revisedTotalFee : drawerRow.currentCost)}</Typography>
                      </Box>
                    </Box>

                    <Paper elevation={0} sx={{ p: 2, borderRadius: "8px", bgcolor: drawerRow.revisedImpact >= 0 ? "rgba(46,125,50,0.06)" : "rgba(198,40,40,0.06)", border: `1px solid ${drawerRow.revisedImpact >= 0 ? "rgba(46,125,50,0.2)" : "rgba(198,40,40,0.2)"}` }}>
                      <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.5 }}>{isPS ? "Revised Impact" : "Price Change"}</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 700, color: drawerRow.revisedImpact >= 0 ? "#2e7d32" : "#c62828" }}>
                        {drawerRow.revisedImpact >= 0 ? "+" : ""}{fmt(drawerRow.revisedImpact)}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)", mt: 0.5 }}>
                        {isPS ? `Price increase: ${pct(drawerRow.revisedPriceIncreasePct)}` : `Rec. change: ${pct(drawerRow.recPctChangeFromCurPrice)}`}
                      </Typography>
                    </Paper>
                  </Box>
                )}

                {/* Explain The Price Tab */}
                {activeDrawerTab === "explain" && (
                  <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column" }}>
                      {etpMessages.map((msg) => (
                        <Box key={msg.id} sx={{ mb: 1.5, display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
                          <Box sx={{ maxWidth: "90%", px: 1.75, py: 1.25, borderRadius: msg.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", bgcolor: msg.role === "user" ? "#00446a" : "rgba(0,0,0,0.04)", color: msg.role === "user" ? "white" : "#333" }}>
                            {msg.title && <Typography sx={{ fontSize: 12, fontWeight: 700, color: msg.role === "user" ? "rgba(255,255,255,0.7)" : "#00446a", mb: 0.5 }}>{msg.title}</Typography>}
                            <Typography sx={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{renderBold(msg.content)}</Typography>
                          </Box>
                        </Box>
                      ))}

                      {etpThinking && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.75, py: 1, bgcolor: "rgba(0,0,0,0.04)", borderRadius: "12px 12px 12px 2px", alignSelf: "flex-start", mb: 1.5 }}>
                          <CircularProgress size={14} sx={{ color: "#00446a" }} />
                          <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>{etpThinkingMsg || "Thinking…"}</Typography>
                        </Box>
                      )}

                      {!etpThinking && (() => {
                        const last = [...etpMessages].reverse().find((m) => m.role === "assistant");
                        if (!last?.suggestions?.length) return null;
                        return (
                          <Box sx={{ py: 1 }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.4)", mb: 0.75 }}>Suggested Follow-Ups</Typography>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                              {last.suggestions.map((s) => (
                                <Chip key={s.label} label={s.label} size="small" clickable onClick={() => handleEtpChip(s)} sx={{ fontSize: 11, height: 28, borderRadius: "14px", bgcolor: "rgba(0,68,106,0.06)", border: "1px solid rgba(0,68,106,0.2)", color: "#00446a", fontWeight: 500, "&:hover": { bgcolor: "rgba(0,68,106,0.12)" } }} />
                              ))}
                            </Box>
                            <Typography
                              onClick={() => {
                                setEtpMessages([]);
                                setEtpThinking(true);
                                setEtpThinkingMsg("Loading product-level explanation…");
                                setTimeout(() => {
                                  setEtpMessages([productLevelEtpMsg]);
                                  setEtpThinking(false);
                                  setEtpThinkingMsg(undefined);
                                }, 1500);
                              }}
                              sx={{ fontSize: 11, color: "rgba(0,0,0,0.35)", mt: 1, cursor: "pointer", "&:hover": { color: "#00446a", textDecoration: "underline" }, transition: "color 0.15s" }}
                            >
                              View example at the product level →
                            </Typography>
                          </Box>
                        );
                      })()}

                      <div ref={etpBottomRef} />
                    </Box>

                    <Box sx={{ px: 2, py: 1, borderTop: "1px solid rgba(0,0,0,0.06)", textAlign: "center", flexShrink: 0 }}>
                      <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.35)", fontStyle: "italic" }}>
                        InsightAI can make mistakes. Consider checking important information.
                      </Typography>
                    </Box>
                  </Box>
                )}

                {/* Elasticity Tab */}
                {activeDrawerTab === "elasticity" && (
                  <Box sx={{ p: 2.5 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>
                      {drawerRow.clientName} — {drawerRow.projectName}
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.6)", mb: 2.5, lineHeight: 1.5 }}>
                      Price and volume trend over time. As pricing increases, engagement hours show modest elasticity — volume declines are within acceptable thresholds.
                    </Typography>

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#00446a", mb: 1 }}>Price vs. Volume (Indexed to FY25)</Typography>
                    <ResponsiveContainer width="100%" height={220}>
                      <ComposedChart data={elasticityData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="period" fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} />
                        <YAxis yAxisId="left" fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} domain={[0.8, 1.15]} tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`} width={40} />
                        <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} formatter={(value, name) => [name === "priceIdx" ? `${(Number(value) * 100).toFixed(0)}%` : `${(Number(value) * 100).toFixed(0)}%`, name === "priceIdx" ? "Price Index" : "Volume Index"]} />
                        <Area yAxisId="left" type="monotone" dataKey="volumeIdx" fill="rgba(0,68,106,0.08)" stroke="none" />
                        <Line yAxisId="left" type="monotone" dataKey="priceIdx" stroke="#D97C14" strokeWidth={2.5} dot={{ r: 4, fill: "#D97C14" }} name="priceIdx" />
                        <Line yAxisId="left" type="monotone" dataKey="volumeIdx" stroke="#00446a" strokeWidth={2.5} dot={{ r: 4, fill: "#00446a" }} name="volumeIdx" strokeDasharray="5 3" />
                        <ReferenceLine yAxisId="left" y={1} stroke="rgba(0,0,0,0.2)" strokeDasharray="3 3" />
                      </ComposedChart>
                    </ResponsiveContainer>

                    <Box sx={{ display: "flex", gap: 2, mt: 1, mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 16, height: 3, bgcolor: "#D97C14", borderRadius: 1 }} />
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.5)" }}>Price Index</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 16, height: 0, borderTop: "2.5px dashed #00446a" }} />
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.5)" }}>Volume Index</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#00446a", mb: 1.5 }}>Absolute Values</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1 }}>
                      {elasticityData.map((d) => (
                        <Paper key={d.period} elevation={0} sx={{ p: 1.25, border: "1px solid rgba(0,0,0,0.08)", borderRadius: "6px", bgcolor: d.period.includes("Rec") ? "rgba(217,124,20,0.06)" : "transparent" }}>
                          <Typography sx={{ fontSize: 10, fontWeight: 600, color: d.period.includes("Rec") ? "#D97C14" : "rgba(0,0,0,0.45)", mb: 0.25 }}>{d.period}</Typography>
                          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}>${(d.price / 1000).toFixed(0)}K</Typography>
                          <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)" }}>{d.volume.toLocaleString()} hrs</Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Price Comps Tab */}
                {activeDrawerTab === "price-comps" && (
                  <Box sx={{ p: 2.5 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>
                      Audit & Assurance — Peer Pricing
                    </Typography>
                    <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.6)", mb: 2.5, lineHeight: 1.5 }}>
                      Scatter of other customer price points for similar engagements. Each dot represents a peer engagement in the $150K–$400K range.
                    </Typography>

                    <ResponsiveContainer width="100%" height={280}>
                      <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" dataKey="fee" name="Total Fee" tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} domain={[150000, 420000]} />
                        <YAxis type="number" dataKey="increase" name="Price Increase" unit="%" fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} domain={[4, 14]} width={35} />
                        <ZAxis type="number" dataKey="size" range={[60, 200]} />
                        <RechartsTooltip
                          cursor={{ strokeDasharray: "3 3" }}
                          contentStyle={{ fontSize: 11, borderRadius: 6 }}
                          formatter={(value, name) => [name === "Total Fee" ? `$${(Number(value) / 1000).toFixed(0)}K` : `${value}%`, name]}
                          labelFormatter={() => ""}
                        />
                        <ReferenceLine y={9.0} stroke="#D97C14" strokeWidth={2} strokeDasharray="6 3" />
                        <ReferenceLine x={285000} stroke="#D97C14" strokeWidth={2} strokeDasharray="6 3" />
                        <Scatter name="Peer Engagements" data={priceCompsData} fill="#00446a" opacity={0.7} />
                        <Scatter name="This Engagement" data={[{ client: "Meridian Health", fee: 285000, increase: 9.0, size: 250 }]} fill="#D97C14" />
                      </ScatterChart>
                    </ResponsiveContainer>

                    <Box sx={{ display: "flex", gap: 2, mt: 1, mb: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#D97C14" }} />
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.5)" }}>Meridian Health (this engagement)</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: "#00446a", opacity: 0.7 }} />
                        <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.5)" }}>Peer engagements</Typography>
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2 }} />

                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#00446a", mb: 1 }}>Peer Summary</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1.5 }}>
                      {[
                        { label: "Peer Avg Fee", value: `$${Math.round(priceCompsData.reduce((s, d) => s + d.fee, 0) / priceCompsData.length / 1000)}K` },
                        { label: "Peer Avg Increase", value: `${(priceCompsData.reduce((s, d) => s + d.increase, 0) / priceCompsData.length).toFixed(1)}%` },
                        { label: "Peer Count", value: `${priceCompsData.length}` },
                      ].map((m) => (
                        <Paper key={m.label} elevation={0} sx={{ p: 1.25, border: "1px solid rgba(0,0,0,0.08)", borderRadius: "6px" }}>
                          <Typography sx={{ fontSize: 9, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase" }}>{m.label}</Typography>
                          <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#333" }}>{m.value}</Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}

                {/* Comments Tab */}
                {activeDrawerTab === "comments" && (
                  <Box sx={{ p: 2.5 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {staticComments.map((comment, i) => (
                        <Box key={i} sx={{ display: "flex", gap: 1.5 }}>
                          <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#00446a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, mt: 0.25 }}>
                            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "white" }}>{comment.initials}</Typography>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, mb: 0.25 }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{comment.author}</Typography>
                              <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.35)" }}>{comment.time}</Typography>
                            </Box>
                            <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.7)", lineHeight: 1.5 }}>{comment.text}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Add a comment..."
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          fontSize: 13,
                        },
                      }}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" sx={{ color: "#00446a" }}>
                                <SendIcon sx={{ fontSize: 18 }} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {/* Data Layouts Popover */}
      <Popover
        open={Boolean(layoutAnchor)}
        anchorEl={layoutAnchor}
        onClose={() => setLayoutAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { width: 360, borderRadius: "8px", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", mt: 0.5 } } }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", borderBottom: "2px solid transparent", mb: 1.5 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 700, color: "#00446a", textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "2px solid #00446a", pb: 0.75, mr: 3 }}>Data Layouts</Typography>
            <Typography sx={{ fontSize: 12, fontWeight: 500, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", pb: 0.75, cursor: "pointer", "&:hover": { color: "rgba(0,0,0,0.6)" } }}>Table Layouts</Typography>
          </Box>
          <TextField
            size="small"
            fullWidth
            placeholder="Search for Data Layouts"
            sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 12 } }}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.3)" }} /></InputAdornment> } }}
          />
        </Box>
        <Box sx={{ maxHeight: 320, overflowY: "auto" }}>
          {[
            { id: "org-region", name: "Category Overview", creator: "Admin", desc: "Review completion by category, make, and region", isDefault: true },
            { id: "default", name: "Default Layout", creator: "System Default", desc: "All items in a single flat list" },
            { id: "custom-1", name: "Make + Model View", creator: "Cathryn Greene", desc: "Track pricing progress per vehicle make" },
            { id: "org-product", name: "Region + Category", creator: "Jeremy Heit", desc: "See each region's book of business" },
            { id: "region-view", name: "Product Tier View", creator: "Admin", desc: "Compare review status across product tiers" },
          ].map((layout) => (
            <Box
              key={layout.id}
              onClick={() => { setSelectedLayout(layout.id); setLayoutAnchor(null); }}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: "pointer",
                bgcolor: selectedLayout === layout.id ? "rgba(0,68,106,0.06)" : "transparent",
                border: selectedLayout === layout.id ? "1.5px solid rgba(0,68,106,0.3)" : "1.5px solid transparent",
                borderLeft: "none",
                borderRight: "none",
                "&:hover": { bgcolor: selectedLayout === layout.id ? "rgba(0,68,106,0.08)" : "rgba(0,0,0,0.02)" },
              }}
            >
              <Radio checked={selectedLayout === layout.id} size="small" sx={{ p: 0, mt: 0.25, color: "rgba(0,0,0,0.3)", "&.Mui-checked": { color: "#00446a" } }} />
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{layout.name}</Typography>
                <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>Created By: {layout.creator}</Typography>
                {layout.desc && <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>{layout.desc}</Typography>}
                {layout.isDefault && (
                  <Box sx={{ display: "inline-block", mt: 0.5, px: 1, py: 0.25, borderRadius: "4px", bgcolor: "#00446a" }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "white" }}>Admin Default</Typography>
                  </Box>
                )}
              </Box>
              <IconButton size="small" sx={{ mt: 0.25, color: "rgba(0,0,0,0.3)" }}><MoreVertIcon sx={{ fontSize: 18 }} /></IconButton>
            </Box>
          ))}
        </Box>
        <Box sx={{ display: "flex", borderTop: "1px solid rgba(0,0,0,0.1)", px: 2, py: 1.5 }}>
          <Button size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />} onClick={() => { setLayoutAnchor(null); setCreateLayoutOpen(true); }} sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", textTransform: "uppercase", letterSpacing: "0.03em" }}>
            Create New
          </Button>
          <Button size="small" startIcon={<RefreshIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.03em", ml: "auto" }}>
            Reset to Default
          </Button>
        </Box>
      </Popover>

      {/* Create New Data Layout Dialog */}
      <Dialog open={createLayoutOpen} onClose={() => setCreateLayoutOpen(false)} maxWidth="md" fullWidth slotProps={{ paper: { sx: { borderRadius: "12px" } } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", pb: 1 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 400, color: "#333" }}>Create New Data Layout</Typography>
          <IconButton onClick={() => setCreateLayoutOpen(false)} size="small"><CloseIcon sx={{ fontSize: 20 }} /></IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
            {/* Left: Define Layout */}
            <Box sx={{ flex: 1, border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", p: 2.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#00446a", mb: 2 }}>Define Layout</Typography>
              <TextField fullWidth size="small" label="Layout Name *" sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 13 } }} />
              <TextField fullWidth size="small" label="Layout Description *" slotProps={{ htmlInput: { maxLength: 30 } }} helperText="0/30" sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 13 } }} />
              <FormControlLabel control={<Switch size="small" />} label={<Box><Typography sx={{ fontSize: 13 }}>Make this your default data layout</Typography><Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>If you choose to make this your default data layout, this layout will be applied automatically when you load this page.</Typography></Box>} sx={{ alignItems: "flex-start", mb: 2 }} />
              <FormControlLabel control={<Switch size="small" />} label={<Box><Typography sx={{ fontSize: 13 }}>Make this a shared data layout</Typography><Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>If you choose to share this layout, anyone can access this layout for use. Deleting this layout will delete it for all users.</Typography></Box>} sx={{ alignItems: "flex-start" }} />
            </Box>
            {/* Right: Configure Layout */}
            <Box sx={{ flex: 1, border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", p: 2.5 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#00446a", mb: 2 }}>Configure Layout</Typography>
              {[1, 2, 3].map((n) => (
                <Box key={n} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 1, borderLeft: "2px dotted rgba(0,0,0,0.2)", height: n > 1 ? 32 : 0 }} />
                    <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.6)", minWidth: 120 }}>{n}. {n === 1 ? "Assign First" : "Add A Nested"} Condition</Typography>
                  </Box>
                  <Select size="small" displayEmpty fullWidth sx={{ fontSize: 12, borderRadius: "6px" }} value="">
                    <MenuItem value="" disabled><em>Select Attribute *</em></MenuItem>
                    <MenuItem value="region">Organization Region</MenuItem>
                    <MenuItem value="service">Service Line</MenuItem>
                    <MenuItem value="partner">Partner Name</MenuItem>
                    <MenuItem value="status">Status</MenuItem>
                    <MenuItem value="client">Client Name</MenuItem>
                  </Select>
                  <IconButton size="small" sx={{ color: "#00446a" }}><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
                </Box>
              ))}
              <Button size="small" startIcon={<AddIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: 11, fontWeight: 600, color: "#00446a", textTransform: "uppercase" }}>
                Add Additional Nested Condition
              </Button>
            </Box>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button variant="contained" sx={{ bgcolor: "#00446a", fontWeight: 600, fontSize: 12, textTransform: "uppercase", borderRadius: "6px", px: 3, "&:hover": { bgcolor: "#003354" } }}>
              Save &amp; Apply Layout
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Mass Action Dialog */}
      <Dialog open={massActionOpen} onClose={() => { setMassActionOpen(false); setMassActionStep(1); }} maxWidth="md" fullWidth sx={{ zIndex: 1403 }} slotProps={{ paper: { sx: { borderRadius: "12px", overflow: "hidden" } } }}>
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#f8f9fa", borderBottom: "1px solid rgba(0,0,0,0.08)", py: 1.5, px: 3 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#333" }}>Create Mass Action</Typography>
          <IconButton onClick={() => { setMassActionOpen(false); setMassActionStep(1); }} size="small"><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {massActionStep === 1 ? (
            <>
              {/* Affected Rows */}
              <Box sx={{ px: 3, py: 1.5, bgcolor: "#fff", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                  Affected Rows: <Box component="span" sx={{ fontWeight: 600, color: "#333" }}>{selectedRows.size > 0 ? selectedRows.size : 127}</Box>
                  <Box component="span" sx={{ ml: 1, fontSize: 12, color: "rgba(0,0,0,0.4)" }}>(read-only rows will be ignored)</Box>
                </Typography>
              </Box>

              {/* Select Mass Action Type */}
              <Box sx={{ px: 3, pt: 2.5, pb: 1 }}>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333", mb: 0.5 }}>Select Mass Action Type</Typography>
                <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", mb: 2 }}>Choose a column and action type to apply to the selected rows.</Typography>
              </Box>

              {/* Action Rows */}
              <Box sx={{ px: 3, display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "#e3f2fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#1976d2" }}>1</Typography>
                  </Box>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel sx={{ fontSize: 13 }}>Column</InputLabel>
                    <Select label="Column" value="effective-start" sx={{ fontSize: 13, borderRadius: "6px" }}>
                      <MenuItem value="effective-start">Effective Start</MenuItem>
                      <MenuItem value="revised-target">Revised Target %</MenuItem>
                      <MenuItem value="revised-fee">Revised Fee</MenuItem>
                      <MenuItem value="revised-effective">Revised Effective Rate</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel sx={{ fontSize: 13 }}>Action Type</InputLabel>
                    <Select label="Action Type" value="set-to-date" sx={{ fontSize: 13, borderRadius: "6px" }}>
                      <MenuItem value="set-to-date">Set to Date</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    type="date"
                    defaultValue="2026-07-01"
                    sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 13 } }}
                    slotProps={{ input: { startAdornment: <InputAdornment position="start"><CalendarMonthIcon sx={{ fontSize: 16, color: "rgba(0,0,0,0.4)" }} /></InputAdornment> } }}
                  />
                  <IconButton size="small" sx={{ color: "rgba(0,0,0,0.3)" }}>
                    <RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: "#e3f2fd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 700, color: "#1976d2" }}>2</Typography>
                  </Box>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel sx={{ fontSize: 13 }}>Column</InputLabel>
                    <Select label="Column" value="revised-target" sx={{ fontSize: 13, borderRadius: "6px" }}>
                      <MenuItem value="effective-start">Effective Start</MenuItem>
                      <MenuItem value="revised-target">Revised Target %</MenuItem>
                      <MenuItem value="revised-fee">Revised Fee</MenuItem>
                      <MenuItem value="revised-effective">Revised Effective Rate</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl size="small" sx={{ flex: 1 }}>
                    <InputLabel sx={{ fontSize: 13 }}>Action Type</InputLabel>
                    <Select label="Action Type" value="" sx={{ fontSize: 13, borderRadius: "6px" }}>
                      <MenuItem value="set-amount">Set to Amount</MenuItem>
                      <MenuItem value="change-amount">Change by Amount</MenuItem>
                      <MenuItem value="change-pct">Change by Percentage</MenuItem>
                      <MenuItem value="set-column">Set to Another Column</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    placeholder="Value"
                    disabled
                    sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 13 } }}
                  />
                  <IconButton size="small" sx={{ color: "rgba(0,0,0,0.3)" }}>
                    <RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Bottom Cards */}
              <Box sx={{ px: 3, pt: 3, pb: 2.5, display: "flex", gap: 2 }}>
                <Box sx={{ flex: 1, border: "1px dashed rgba(0,0,0,0.15)", borderRadius: "8px", p: 2, display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", "&:hover": { borderColor: "rgba(0,0,0,0.3)", bgcolor: "rgba(0,0,0,0.01)" } }}>
                  <Box sx={{ width: 32, height: 32, borderRadius: "50%", bgcolor: "#e3f2fd", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <AddIcon sx={{ fontSize: 18, color: "#1976d2" }} />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Additional Mass Action</Typography>
                    <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>Add another action to apply</Typography>
                  </Box>
                </Box>
                <Box sx={{ flex: 1, border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Mark Rows Complete</Typography>
                    <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>Mark affected rows as complete</Typography>
                  </Box>
                  <Switch size="small" />
                </Box>
                <Box sx={{ flex: 1, border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#333" }}>Include Selections</Typography>
                    <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)" }}>Apply to selected rows only</Typography>
                  </Box>
                  <Switch size="small" defaultChecked color="success" />
                </Box>
              </Box>

              {/* Footer */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, px: 3, py: 2, borderTop: "1px solid rgba(0,0,0,0.08)", bgcolor: "#f8f9fa" }}>
                <Button onClick={() => { setMassActionOpen(false); setMassActionStep(1); }} sx={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "rgba(0,0,0,0.5)", letterSpacing: "0.05em" }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={() => setMassActionStep(2)} sx={{ bgcolor: "#D97C14", fontSize: 12, fontWeight: 600, textTransform: "uppercase", borderRadius: "6px", px: 3, letterSpacing: "0.05em", "&:hover": { bgcolor: "#c06a0a" } }}>
                  Review Changes
                </Button>
              </Box>
            </>
          ) : (
            <>
              {/* Step 2: Review Affected Rows */}
              <Box sx={{ px: 3, pt: 2, pb: 1 }}>
                <Button onClick={() => setMassActionStep(1)} startIcon={<ChevronLeftIcon sx={{ fontSize: 18 }} />} sx={{ fontSize: 13, fontWeight: 600, color: "#333", textTransform: "none", border: "1px solid rgba(0,0,0,0.15)", borderRadius: "20px", px: 2, py: 0.5, mb: 2, "&:hover": { bgcolor: "rgba(0,0,0,0.03)" } }}>
                  Edit Mass Action
                </Button>
                <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#333", mb: 0.5 }}>Review Affected Rows</Typography>
                <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.5)", mb: 2, lineHeight: 1.5 }}>
                  You can remove rows you do not want to commit from this mass action by deselecting the checkbox or use the button above to revisit editing this mass action.
                </Typography>
              </Box>

              {/* Stat Cards */}
              <Box sx={{ px: 3, display: "flex", gap: 0 }}>
                {[
                  { label: "COUNT OF ROWS", value: selectedRows.size > 0 ? selectedRows.size : 127 },
                  { label: "TERMINAL ERRORS", value: 0 },
                  { label: "VALIDATION ERRORS", value: 3 },
                  { label: "ITEMS REQUIRING APPROVAL", value: selectedRows.size > 0 ? selectedRows.size : 124 },
                ].map((stat, i) => (
                  <Box key={i} sx={{ flex: 1, border: "1px solid rgba(0,0,0,0.1)", borderLeft: i === 0 ? "1px solid rgba(0,0,0,0.1)" : "none", p: 2 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.05em", textTransform: "uppercase", mb: 0.5 }}>{stat.label}</Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#333" }}>{stat.value}</Typography>
                  </Box>
                ))}
              </Box>

              {/* Review Table */}
              <Box sx={{ px: 3, pt: 2 }}>
                <TableContainer sx={{ border: "1px solid rgba(0,0,0,0.1)", borderRadius: "4px" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: "#fafafa" }}>
                        <TableCell padding="checkbox"><Checkbox size="small" defaultChecked /></TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)" }}>Status</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)" }}>Approval Status</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)" }}>Product</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)" }} align="right">Revised Price</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)" }} align="right">Price Change</TableCell>
                        <TableCell sx={{ fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.6)" }}>Effective Start</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { status: "Validation Error", client: "Brake Pad Set - Front (Ford F-150)", target: "$94.49", delta: "+$4.50", date: "07/01/26" },
                        { status: "Validation Error", client: "Alternator (BMW 3 Series)", target: "$399.79", delta: "+$19.80", date: "07/01/26" },
                        { status: "Validation Error", client: "Catalytic Converter (Honda CR-V)", target: "$488.25", delta: "+$23.25", date: "07/01/26" },
                        { status: "Pending", client: "Radiator (Toyota Camry)", target: "$178.49", delta: "+$8.50", date: "07/01/26" },
                        { status: "Pending", client: "Starter Motor (Chevrolet Silverado)", target: "$236.24", delta: "+$11.25", date: "07/01/26" },
                      ].map((row, i) => (
                        <TableRow key={i} sx={{ "&:hover": { bgcolor: "rgba(0,0,0,0.02)" } }}>
                          <TableCell padding="checkbox"><Checkbox size="small" defaultChecked /></TableCell>
                          <TableCell>
                            <Chip
                              label={row.status}
                              size="small"
                              sx={{
                                fontSize: 11,
                                fontWeight: 600,
                                height: 22,
                                bgcolor: row.status === "Validation Error" ? "#fff3e0" : "#e8f5e9",
                                color: row.status === "Validation Error" ? "#e65100" : "#2e7d32",
                                "& .MuiChip-label": { px: 1 },
                              }}
                              icon={<Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: row.status === "Validation Error" ? "#e65100" : "#2e7d32", ml: 1 }} />}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label="Requires Approval"
                              size="small"
                              sx={{ fontSize: 11, height: 22, bgcolor: "transparent", color: "#c62828", border: "1px solid #ffcdd2", "& .MuiChip-label": { px: 1 } }}
                              icon={<Box component="span" sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: "#c62828", ml: 1 }} />}
                            />
                          </TableCell>
                          <TableCell sx={{ fontSize: 12, color: "#333" }}>{row.client}</TableCell>
                          <TableCell sx={{ fontSize: 12, color: "#333", fontFamily: "monospace" }} align="right">{row.target}</TableCell>
                          <TableCell sx={{ fontSize: 12, color: "#333", fontFamily: "monospace" }} align="right">{row.delta}</TableCell>
                          <TableCell sx={{ fontSize: 12, color: "#333" }}>{row.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2, py: 1, fontSize: 12, color: "rgba(0,0,0,0.5)" }}>
                  <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>Rows per page: 50</Typography>
                  <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)" }}>1–5 of {selectedRows.size > 0 ? selectedRows.size : 127}</Typography>
                </Box>
              </Box>

              {/* Footer */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, px: 3, py: 2, borderTop: "1px solid rgba(0,0,0,0.08)", bgcolor: "#f8f9fa" }}>
                <Button onClick={() => { setMassActionOpen(false); setMassActionStep(1); }} sx={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "rgba(0,0,0,0.5)", letterSpacing: "0.05em" }}>
                  Cancel
                </Button>
                <Button variant="contained" onClick={() => { setMassActionOpen(false); setMassActionStep(1); }} sx={{ bgcolor: "#D97C14", fontSize: 12, fontWeight: 600, textTransform: "uppercase", borderRadius: "6px", px: 3, letterSpacing: "0.05em", "&:hover": { bgcolor: "#c06a0a" } }}>
                  Submit Mass Action
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
