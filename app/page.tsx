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
} from "@mui/material";
import {
  Home as HomeIcon,
  Bookmark as BookmarkIcon,
  Description as DescriptionIcon,
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
} from "@mui/icons-material";
import { useState, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AppShell from "../components/AppShell";
import { generateTableData, type RowData } from "./data";
import AnalyticsDrawer from "../components/AnalyticsDrawer";

const fmt = (n: number | null) => n == null ? "—" : "$" + n.toLocaleString("en-US");
const pct = (n: number | null) => n == null ? "—" : n.toFixed(1) + "%";

const kpiCards = [
  { title: "REVIEW PROGRESS", value: "67% Complete" },
  { title: "NEEDS REVIEW #", value: "100 Items" },
  { title: "RECOMMENDED IMPACT", value: "$2,450,000" },
  { title: "REVISED IMPACT", value: "$1,875,000" },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  "Needs Review": { bg: "#fff3e0", color: "#e65100" },
  "In Progress": { bg: "#e3f2fd", color: "#1565c0" },
  "Approved": { bg: "#e8f5e9", color: "#2e7d32" },
  "Submitted": { bg: "#ede7f6", color: "#4527a0" },
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
    label: "Has Comments",
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
  { key: "partnerName", label: "Partner Name", width: 140 },
  { key: "clientName", label: "Client Name", width: 180 },
  { key: "projectName", label: "Project Name", width: 180 },
  { key: "serviceLine", label: "Service Line", width: 140 },
  { key: "clientTenure", label: "Client Tenure", width: 100, align: "center" },
  {
    key: "retentionBucket",
    label: "Retention Bucket",
    width: 120,
    align: "center",
    render: (row) => {
      const c = retentionColors[row.retentionBucket] || { bg: "#f5f5f5", color: "#333" };
      return (
        <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: c.bg }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: c.color }}>{row.retentionBucket}</Typography>
        </Box>
      );
    },
  },
  {
    key: "clientRenewalStatus",
    label: "Client Renewal Status",
    width: 140,
    align: "center",
    render: (row) => {
      const c = renewalColors[row.clientRenewalStatus] || { bg: "#f5f5f5", color: "#333" };
      return (
        <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: c.bg }}>
          <Typography sx={{ fontSize: 11, fontWeight: 500, color: c.color, whiteSpace: "nowrap" }}>{row.clientRenewalStatus}</Typography>
        </Box>
      );
    },
  },
  { key: "currentFixedFee", label: "Current Fixed Fee", width: 130, align: "right", render: (row) => fmt(row.currentFixedFee) },
  { key: "scopeChangePct", label: "Scope Change %", width: 110, align: "right", render: (row) => pct(row.scopeChangePct) },
  { key: "fixedFeeAfterScope", label: "Fixed Fee After Scope Change", width: 170, align: "right", render: (row) => fmt(row.fixedFeeAfterScope) },
  {
    key: "recPriceIncreasePct",
    label: "Rec Price Increase %",
    width: 140,
    align: "right",
    render: (row) => (
      <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: "#e8f5e9" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#2e7d32" }}>{pct(row.recPriceIncreasePct)}</Typography>
      </Box>
    ),
  },
  { key: "recFixedFee", label: "Rec Fixed Fee", width: 130, align: "right", render: (row) => <Box sx={{ bgcolor: "#b3e5fc", px: 1, py: 0.25, borderRadius: "2px", display: "inline-block" }}>{fmt(row.recFixedFee)}</Box> },
  { key: "revisedFixedFee", label: "Revised Fixed Fee", width: 130, align: "right", render: (row) => fmt(row.revisedFixedFee) },
  { key: "revisedPriceIncreasePct", label: "Revised Price Increase %", width: 150, align: "right", render: (row) => pct(row.revisedPriceIncreasePct) },
  { key: "currentAdminFee", label: "Current Admin Fee", width: 130, align: "right", render: (row) => fmt(row.currentAdminFee) },
  { key: "revisedAdminFee", label: "Revised Admin Fee", width: 130, align: "right", render: (row) => fmt(row.revisedAdminFee) },
  {
    key: "revisedTotalFee",
    label: "Revised Total Fee",
    width: 130,
    align: "right",
    render: (row) => <Typography sx={{ fontSize: 12, fontWeight: 600 }}>{fmt(row.revisedTotalFee)}</Typography>,
  },
  {
    key: "revisedImpact",
    label: "Revised Impact $",
    width: 120,
    align: "right",
    render: (row) => {
      const positive = row.revisedImpact >= 0;
      return <Typography sx={{ fontSize: 12, color: positive ? "#2e7d32" : "#c62828", fontWeight: 500 }}>{positive ? "+" : ""}{fmt(row.revisedImpact)}</Typography>;
    },
  },
  {
    key: "impactDelta",
    label: "Impact Delta",
    width: 110,
    align: "right",
    render: (row) => {
      const positive = row.impactDelta >= 0;
      return <Typography sx={{ fontSize: 12, color: row.impactDelta === 0 ? "#757575" : positive ? "#2e7d32" : "#c62828" }}>{positive && row.impactDelta !== 0 ? "+" : ""}{fmt(row.impactDelta)}</Typography>;
    },
  },
  { key: "revisionReason", label: "Revision Reason", width: 140, render: (row) => row.revisionReason || "—" },
  {
    key: "clientCommStatus",
    label: "Client Communication Status",
    width: 180,
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
  { key: "custAcceptedFixedFee", label: "Customer Accepted Fixed Fee", width: 170, align: "right", render: (row) => fmt(row.custAcceptedFixedFee) },
  { key: "custAcceptedAdminFee", label: "Customer Accepted Admin Fee", width: 180, align: "right", render: (row) => fmt(row.custAcceptedAdminFee) },
  {
    key: "finalTotalFee",
    label: "Final Total Fee",
    width: 130,
    align: "right",
    render: (row) => row.finalTotalFee != null ? <Typography sx={{ fontSize: 12, fontWeight: 700 }}>{fmt(row.finalTotalFee)}</Typography> : "—",
  },
  {
    key: "finalTotalPct",
    label: "Final Total %",
    width: 110,
    align: "right",
    render: (row) => row.finalTotalPct != null ? (
      <Box sx={{ display: "inline-flex", px: 1, py: 0.25, borderRadius: "4px", bgcolor: row.finalTotalPct >= 0 ? "#e8f5e9" : "#ffebee" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: row.finalTotalPct >= 0 ? "#2e7d32" : "#c62828" }}>{pct(row.finalTotalPct)}</Typography>
      </Box>
    ) : "—",
  },
];

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
  "Select at-risk renewal items",
  "Select all Needs Review items",
  "Sort by revised impact descending",
  "Filter to Gold retention clients",
];

interface EtpSuggestion { label: string; inputText: string; flowKey: string }
interface EtpMsg { id: string; role: "user" | "assistant"; content: string; title?: string; suggestions?: EtpSuggestion[] }

function renderBold(text: string): React.ReactNode[] {
  return text.split(/\*\*(.*?)\*\*/g).map((part, i) => i % 2 === 1 ? <strong key={i}>{part}</strong> : part);
}

const etpFlows: Record<string, { thinkingDelay: number; thinkingMessage?: string; response: Omit<EtpMsg, "id" | "role"> }> = {
  "internal-explanation": {
    thinkingDelay: 2000,
    thinkingMessage: "Analyzing pricing factors...",
    response: {
      title: "Internal Price Explanation",
      content: "Fee rates have increased for this engagement by **6.5% since the last review period**, driven primarily by increased labor costs and expanded service scope.\n\n**Labor rate adjustments** account for 4.2% of the increase, reflecting market-rate corrections for senior audit and advisory staff.\n\n**Scope expansion** from new regulatory requirements (ASC 842 lease accounting, ESG reporting) adds approximately 2.3% to the engagement cost.\n\nThis client's retention bucket and tenure suggest strong relationship stability, making a well-positioned price increase both defensible and expected.",
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
      content: "1. **Meridian Health Systems** — Audit & Assurance, Gold retention — $310,650 — 9.0% increase — Accepted\n2. **Summit Healthcare Group** — Compliance Audit, Platinum retention — $352,000 — 10.0% increase — In Progress\n3. **Pinnacle Consumer Brands** — Full Acctg Outsourcing, Silver retention — $171,600 — 10.0% increase — Accepted\n4. **Vanguard Senior Living** — Advisory Services, Gold retention — $302,500 — 10.0% increase — Accepted\n5. **National Care Alliance** — Operational Consulting, Platinum retention — $572,000 — 10.0% increase — In Progress\n\nAverage accepted increase: **9.7%** | Average fee: **$341,750** | Current engagement is within the accepted range.",
      suggestions: [
        { label: "Get Internal Explanation", inputText: "Get internal explanation", flowKey: "internal-explanation" },
        { label: "Start Over", inputText: "Start over", flowKey: "start-over" },
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
  content: "I can help explain the pricing for this engagement. Choose an option below to get started.",
  suggestions: [
    { label: "Get Internal Explanation", inputText: "Get internal explanation", flowKey: "internal-explanation" },
    { label: "Give Me Client Talking Points", inputText: "Give me client talking points", flowKey: "talking-points" },
    { label: "Anticipate Objections", inputText: "Anticipate objections", flowKey: "anticipate-objections" },
  ],
};

export default function PriceReviewPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [aiOpen, setAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiState, setAiState] = useState<"idle" | "thinking">("idle");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const tableData = useMemo(() => generateTableData(), []);
  const paginatedData = tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const [drawerOpenRow, setDrawerOpenRow] = useState<number | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<"analytics" | "details" | "explain" | "comments">("explain");
  const [etpMessages, setEtpMessages] = useState<EtpMsg[]>([initialEtpMsg]);
  const [etpThinking, setEtpThinking] = useState(false);
  const [etpThinkingMsg, setEtpThinkingMsg] = useState<string | undefined>();
  const etpBottomRef = useRef<HTMLDivElement>(null);
  const etpMsgIdRef = useRef(0);

  const drawerRow = drawerOpenRow !== null ? tableData[drawerOpenRow] : null;

  useEffect(() => {
    etpBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [etpMessages, etpThinking]);

  useEffect(() => {
    setEtpMessages([initialEtpMsg]);
    setEtpThinking(false);
    etpMsgIdRef.current = 0;
  }, [drawerOpenRow]);

  const handleEtpChip = (chip: EtpSuggestion) => {
    const userMsg: EtpMsg = { id: `etp-${++etpMsgIdRef.current}`, role: "user", content: chip.inputText };
    setEtpMessages((prev) => [...prev, userMsg]);
    const flow = etpFlows[chip.flowKey];
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

  const totalMinWidth = columns.reduce((sum, c) => sum + c.width, 0) + 80;

  const toggleRow = (globalIdx: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(globalIdx)) next.delete(globalIdx);
      else next.add(globalIdx);
      return next;
    });
  };

  const toggleAllOnPage = () => {
    const pageIndices = paginatedData.map((_, i) => page * rowsPerPage + i);
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
    const isSelectQuery = q.includes("select") || q.includes("at-risk") || q.includes("bundle") || q.includes("check");
    setAiMessages((prev) => [...prev, { role: "user", text }]);
    setAiQuery("");
    setAiState("thinking");
    setTimeout(() => {
      if (isSelectQuery) {
        const atRiskIndices = tableData
          .map((row, i) => (row.clientRenewalStatus === "At Risk" || row.status === "Needs Review") ? i : -1)
          .filter((i) => i !== -1)
          .slice(0, 8);
        setSelectedRows(new Set(atRiskIndices));
        const clientNames = [...new Set(atRiskIndices.map((i) => tableData[i].clientName))];
        setAiMessages((prev) => [
          ...prev,
          { role: "ai", text: `Selected ${atRiskIndices.length} items across ${clientNames.length} clients:\n\n${clientNames.map((c) => `• ${c}`).join("\n")}\n\nUse "Open Items in Pre-Call Plan" in the toolbar to continue.` },
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
            { icon: <HomeIcon />, active: true },
            { icon: <BookmarkIcon />, active: false },
            { icon: <DescriptionIcon />, active: false },
          ].map((item, i) => (
            <Box key={i} sx={{ width: 53, height: 40, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: item.active ? "#f8f8f8" : "transparent", borderLeft: item.active ? "2px solid #00446a" : "2px solid transparent", cursor: "pointer", "&:hover": { bgcolor: "#f8f8f8" } }}>
              <Box sx={{ color: item.active ? "#00446a" : "rgba(0,0,0,0.54)" }}>{item.icon}</Box>
            </Box>
          ))}
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", bgcolor: "#f8f8f8", position: "relative" }}>
          <Box sx={{ px: 3, pt: 2.5, pb: 1.5, bgcolor: "rgba(0,0,0,0.04)" }}>
            <Typography variant="h4" sx={{ fontWeight: 400, color: "#00446a", letterSpacing: "0.25px", lineHeight: "42px" }}>
              Price Review
            </Typography>
          </Box>

          {/* KPI Cards */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, py: 2 }}>
            <IconButton sx={{ width: 27, height: 63, borderRadius: "6px", bgcolor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0, "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}>
              <ChevronLeftIcon sx={{ fontSize: 16, color: "#00446a" }} />
            </IconButton>
            <Box sx={{ display: "flex", gap: 1.5, flex: 1, overflow: "hidden" }}>
              {kpiCards.map((card) => (
                <Paper key={card.title} elevation={0} sx={{ bgcolor: "white", border: "1px solid rgba(0,0,0,0.12)", borderRadius: "8px", px: 2, py: 1.25, minWidth: 200 }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 400, letterSpacing: "1px", textTransform: "uppercase", lineHeight: "32px" }}>{card.title}</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.15px", lineHeight: "24px" }}>{card.value}</Typography>
                </Paper>
              ))}
            </Box>
            <IconButton sx={{ width: 27, height: 63, borderRadius: "6px", bgcolor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.12)", flexShrink: 0, "&:hover": { bgcolor: "rgba(0,0,0,0.08)" } }}>
              <ChevronRightIcon sx={{ fontSize: 16, color: "#00446a" }} />
            </IconButton>
          </Box>

          {/* Toolbar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: "5px", px: 3, py: 1 }}>
            {[FilterListIcon, ViewColumnIcon, TableRowsIcon].map((Icon, i) => (
              <IconButton key={i} size="small" sx={{ height: 30, width: 30, borderRadius: "6px", bgcolor: "white", border: "1px solid rgba(0,0,0,0.12)", "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.24)" } }}>
                <Icon sx={{ fontSize: 20, color: "rgba(0,0,0,0.6)" }} />
              </IconButton>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "rgba(0,0,0,0.3)" }} />
            {["Toggle Filters", "Manage Columns", "Data Layouts"].map((label) => (
              <Button key={label} variant="outlined" size="small" sx={{ height: 30, px: 1.5, borderColor: "rgba(0,0,0,0.12)", borderRadius: "6px", color: "rgba(0,0,0,0.6)", fontSize: 10, fontWeight: 500, textTransform: "none", minWidth: 0, "&:hover": { bgcolor: "rgba(0,0,0,0.04)", borderColor: "rgba(0,0,0,0.24)" } }}>
                {label}
              </Button>
            ))}
            <Button variant="outlined" size="small" disabled={selectedRows.size === 0} sx={{ height: 30, px: 1.5, borderColor: selectedRows.size > 0 ? "rgba(0,0,0,0.24)" : "rgba(0,0,0,0.08)", borderRadius: "6px", fontSize: 10, fontWeight: 500, textTransform: "none", minWidth: 0, color: selectedRows.size > 0 ? "rgba(0,0,0,0.7)" : undefined }}>
              Create Mass Action to {selectedRows.size} Items
            </Button>
            {selectedRows.size > 0 && (
              <Button
                variant="contained"
                size="small"
                onClick={() => router.push("/pre-call-plan")}
                startIcon={<ChevronRightIcon sx={{ fontSize: 16 }} />}
                sx={{
                  height: 30,
                  px: 1.5,
                  borderRadius: "6px",
                  bgcolor: "#D97C14",
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: "none",
                  boxShadow: "none",
                  "&:hover": { bgcolor: "#C06B10", boxShadow: "none" },
                }}
              >
                Open {selectedRows.size} Items in Pre-Call Plan
              </Button>
            )}
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
          <TableContainer component={Paper} elevation={0} sx={{ flex: 1, mx: 3, bgcolor: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", overflow: "auto" }}>
            <Table size="small" stickyHeader sx={{ minWidth: totalMinWidth }}>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={{ ...headerCellSx, bgcolor: "#fafafa", width: 42, minWidth: 42 }}>
                    <Checkbox
                      size="small"
                      sx={{ p: 0 }}
                      checked={paginatedData.length > 0 && paginatedData.every((_, i) => selectedRows.has(page * rowsPerPage + i))}
                      indeterminate={paginatedData.some((_, i) => selectedRows.has(page * rowsPerPage + i)) && !paginatedData.every((_, i) => selectedRows.has(page * rowsPerPage + i))}
                      onChange={toggleAllOnPage}
                    />
                  </TableCell>
                  <TableCell sx={{ ...headerCellSx, bgcolor: "#fafafa", width: 38, minWidth: 38 }} />
                  {columns.map((col) => (
                    <TableCell key={col.key} align={col.align || "left"} sx={{ ...headerCellSx, bgcolor: "#fafafa", width: col.width, minWidth: col.width }}>
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, idx) => {
                  const globalIdx = page * rowsPerPage + idx;
                  const isSelected = selectedRows.has(globalIdx);
                  return (
                  <TableRow key={idx} hover sx={{ bgcolor: isSelected ? "rgba(0,68,106,0.08)" : idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <TableCell padding="checkbox" sx={{ ...bodyCellSx, width: 42, minWidth: 42 }}>
                      <Checkbox size="small" sx={{ p: 0, color: isSelected ? "#00446a" : undefined, "&.Mui-checked": { color: "#00446a" } }} checked={isSelected} onChange={() => toggleRow(globalIdx)} />
                    </TableCell>
                    <TableCell sx={{ ...bodyCellSx, width: 38, minWidth: 38 }}>
                      <AddCircleOutlineIcon onClick={() => { setDrawerOpenRow(drawerOpenRow === globalIdx ? null : globalIdx); setActiveDrawerTab("explain"); }} sx={{ fontSize: 20, color: drawerOpenRow === globalIdx ? "#00446a" : "rgba(0,0,0,0.4)", cursor: "pointer" }} />
                    </TableCell>
                    {columns.map((col) => (
                      <TableCell key={col.key} align={col.align || "left"} sx={bodyCellSx}>
                        {col.render ? col.render(row) : (row as unknown as Record<string, unknown>)[col.key] as React.ReactNode}
                      </TableCell>
                    ))}
                  </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={tableData.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
            rowsPerPageOptions={[25, 50, 100]}
            sx={{ mx: 3, mb: 1, bgcolor: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)", flexShrink: 0 }}
          />

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

        {/* Dark overlay when drawer is open */}
        {drawerOpenRow !== null && (
          <Box
            onClick={() => setDrawerOpenRow(null)}
            sx={{
              position: "fixed",
              top: 48,
              left: 0,
              width: "calc(100% - 464px)",
              bottom: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              zIndex: 10,
              cursor: "pointer",
            }}
          />
        )}

        {/* Right-side Decision Support Drawer */}
        {drawerOpenRow !== null && drawerRow && (
          <Box sx={{ display: "flex", flexShrink: 0, height: "100%" }}>
            {/* Icon tab strip */}
            <Box sx={{ width: 44, bgcolor: "white", borderLeft: "1px solid rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", pt: 1.5, gap: 0.5 }}>
              {([
                { key: "explain" as const, icon: <AutoAwesomeIcon sx={{ fontSize: 20 }} />, tooltip: "Explain The Price" },
                { key: "analytics" as const, icon: <InsightsIcon sx={{ fontSize: 20 }} />, tooltip: "AI Analytics" },
                { key: "details" as const, icon: <InfoOutlinedIcon sx={{ fontSize: 20 }} />, tooltip: "Engagement Details" },
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
                  {activeDrawerTab === "analytics" ? "Decision Support" : activeDrawerTab === "details" ? "Engagement Details" : activeDrawerTab === "explain" ? "Explain The Price" : "Comments"}
                </Typography>
                <IconButton size="small" onClick={() => setDrawerOpenRow(null)} sx={{ color: "rgba(0,0,0,0.4)" }}>
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Box>

              {/* Tab content */}
              <Box sx={{ flex: 1, overflowY: "auto" }}>
                {/* Analytics Tab — Interactive Chart Drawer */}
                {activeDrawerTab === "analytics" && (
                  <AnalyticsDrawer key={drawerOpenRow} clientName={drawerRow.clientName} projectName={drawerRow.projectName} data={tableData} />
                )}

                {/* Engagement Details Tab */}
                {activeDrawerTab === "details" && (
                  <Box sx={{ p: 2.5 }}>
                    <Box sx={{ mb: 2.5 }}>
                      <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Client</Typography>
                      <Typography sx={{ fontSize: 15, fontWeight: 600, color: "#333" }}>{drawerRow.clientName}</Typography>
                    </Box>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Project</Typography>
                        <Typography sx={{ fontSize: 13, color: "#333" }}>{drawerRow.projectName}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Service Line</Typography>
                        <Typography sx={{ fontSize: 13, color: "#333" }}>{drawerRow.serviceLine}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Partner</Typography>
                        <Typography sx={{ fontSize: 13, color: "#333" }}>{drawerRow.partnerName}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Status</Typography>
                        {(() => { const c = statusColors[drawerRow.status] || { bg: "#f5f5f5", color: "#333" }; return <Chip label={drawerRow.status} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 500, fontSize: 11, height: 22 }} />; })()}
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Retention</Typography>
                        {(() => { const c = retentionColors[drawerRow.retentionBucket] || { bg: "#f5f5f5", color: "#333" }; return <Chip label={drawerRow.retentionBucket} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 500, fontSize: 11, height: 22 }} />; })()}
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 0.5 }}>Renewal Status</Typography>
                        {(() => { const c = renewalColors[drawerRow.clientRenewalStatus] || { bg: "#f5f5f5", color: "#333" }; return <Chip label={drawerRow.clientRenewalStatus} size="small" sx={{ bgcolor: c.bg, color: c.color, fontWeight: 500, fontSize: 11, height: 22 }} />; })()}
                      </Box>
                    </Box>

                    <Divider sx={{ mb: 2.5 }} />

                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.45)", letterSpacing: "0.5px", textTransform: "uppercase", mb: 1.5 }}>Fee Summary</Typography>
                    <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2.5 }}>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.25 }}>Current Fixed Fee</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{fmt(drawerRow.currentFixedFee)}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.25 }}>Recommended Fee</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#00446a" }}>{fmt(drawerRow.recFixedFee)}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.25 }}>Revised Fixed Fee</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#333" }}>{fmt(drawerRow.revisedFixedFee)}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.25 }}>Revised Total Fee</Typography>
                        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#333" }}>{fmt(drawerRow.revisedTotalFee)}</Typography>
                      </Box>
                    </Box>

                    <Paper elevation={0} sx={{ p: 2, borderRadius: "8px", bgcolor: drawerRow.revisedImpact >= 0 ? "rgba(46,125,50,0.06)" : "rgba(198,40,40,0.06)", border: `1px solid ${drawerRow.revisedImpact >= 0 ? "rgba(46,125,50,0.2)" : "rgba(198,40,40,0.2)"}` }}>
                      <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", mb: 0.5 }}>Revised Impact</Typography>
                      <Typography sx={{ fontSize: 20, fontWeight: 700, color: drawerRow.revisedImpact >= 0 ? "#2e7d32" : "#c62828" }}>
                        {drawerRow.revisedImpact >= 0 ? "+" : ""}{fmt(drawerRow.revisedImpact)}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)", mt: 0.5 }}>
                        Price increase: {pct(drawerRow.revisedPriceIncreasePct)}
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

                {/* Comments Tab */}
                {activeDrawerTab === "comments" && (
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 8 }}>
                    <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.3)" }}>No comments yet</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </AppShell>
  );
}
