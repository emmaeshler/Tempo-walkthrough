"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  Search as SearchIcon,
  EditNote as DraftIcon,
  CheckCircle as CheckCircleIcon,
  SendRounded as SentIcon,
  ThumbUp as AcceptedIcon,
  ThumbDown as DeclinedIcon,
  Archive as ArchiveIcon,
  OpenInNew as OpenIcon,
} from "@mui/icons-material";
import AppShell from "../../components/AppShell";

const STATUS_CONFIG: Record<string, { label: string; color: string; bgcolor: string; icon: React.ReactNode }> = {
  draft: { label: "Draft", color: "#757575", bgcolor: "#eeeeee", icon: <DraftIcon sx={{ fontSize: 14 }} /> },
  finalized: { label: "Finalized", color: "#1565c0", bgcolor: "#e3f2fd", icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> },
  sent: { label: "Sent", color: "#fff", bgcolor: "#2e7d32", icon: <SentIcon sx={{ fontSize: 14 }} /> },
  accepted: { label: "Accepted", color: "#fff", bgcolor: "#00695c", icon: <AcceptedIcon sx={{ fontSize: 14 }} /> },
  declined: { label: "Declined", color: "#fff", bgcolor: "#c62828", icon: <DeclinedIcon sx={{ fontSize: 14 }} /> },
  archived: { label: "Archived", color: "rgba(0,0,0,0.6)", bgcolor: "#e0e0e0", icon: <ArchiveIcon sx={{ fontSize: 14 }} /> },
};

const POSTURE_COLORS: Record<string, string> = {
  "Protect relationship": "#0F6E56",
  "Lean conservative": "#3A7D5E",
  "Balanced approach": "#854F0B",
  "Moderately aggressive": "#B85C18",
  "Maximize capture": "#993C1D",
};

interface PlanRow {
  id: number;
  customer: string;
  partner: string;
  status: string;
  posture: string;
  priceCount: number;
  avgIncrease: number;
  totalRevenue: number;
  revenueImpact: number;
  lastModified: string;
  createdBy: string;
}

const PLANS: PlanRow[] = [
  { id: 1, customer: "Cornerstone Financial", partner: "Cathryn Greene", status: "draft", posture: "Balanced approach", priceCount: 19, avgIncrease: 3.5, totalRevenue: 2_450_000, revenueImpact: 85_750, lastModified: "Jun 3, 2026", createdBy: "Cathryn Greene" },
  { id: 2, customer: "NovaTech Industries", partner: "Cathryn Greene", status: "sent", posture: "Moderately aggressive", priceCount: 78, avgIncrease: 5.2, totalRevenue: 1_870_000, revenueImpact: 97_240, lastModified: "Jun 1, 2026", createdBy: "Cathryn Greene" },
  { id: 3, customer: "Meridian Supply Co.", partner: "James Holden", status: "accepted", posture: "Lean conservative", priceCount: 42, avgIncrease: 2.1, totalRevenue: 980_000, revenueImpact: 20_580, lastModified: "May 29, 2026", createdBy: "James Holden" },
  { id: 4, customer: "Pinnacle Group", partner: "Cathryn Greene", status: "finalized", posture: "Balanced approach", priceCount: 156, avgIncrease: 4.0, totalRevenue: 3_200_000, revenueImpact: 128_000, lastModified: "May 27, 2026", createdBy: "Cathryn Greene" },
  { id: 5, customer: "Summit Materials", partner: "Sarah Chen", status: "declined", posture: "Maximize capture", priceCount: 63, avgIncrease: 7.8, totalRevenue: 1_150_000, revenueImpact: 89_700, lastModified: "May 22, 2026", createdBy: "Sarah Chen" },
  { id: 6, customer: "Crestwood Partners", partner: "James Holden", status: "accepted", posture: "Protect relationship", priceCount: 31, avgIncrease: 1.5, totalRevenue: 620_000, revenueImpact: 9_300, lastModified: "May 18, 2026", createdBy: "James Holden" },
  { id: 7, customer: "BlueArc Solutions", partner: "Cathryn Greene", status: "sent", posture: "Balanced approach", priceCount: 89, avgIncrease: 3.8, totalRevenue: 1_540_000, revenueImpact: 58_520, lastModified: "May 15, 2026", createdBy: "Cathryn Greene" },
  { id: 8, customer: "Vanguard Logistics", partner: "Sarah Chen", status: "archived", posture: "Lean conservative", priceCount: 54, avgIncrease: 2.5, totalRevenue: 890_000, revenueImpact: 22_250, lastModified: "May 10, 2026", createdBy: "Sarah Chen" },
  { id: 9, customer: "Atlas Manufacturing", partner: "James Holden", status: "draft", posture: "Moderately aggressive", priceCount: 112, avgIncrease: 5.5, totalRevenue: 2_780_000, revenueImpact: 152_900, lastModified: "May 8, 2026", createdBy: "James Holden" },
  { id: 10, customer: "Ironclad Systems", partner: "Cathryn Greene", status: "finalized", posture: "Balanced approach", priceCount: 67, avgIncrease: 3.2, totalRevenue: 1_320_000, revenueImpact: 42_240, lastModified: "May 5, 2026", createdBy: "Cathryn Greene" },
];

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const headCellSx = {
  fontFamily: "Inter, Roboto, sans-serif",
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(0,0,0,0.55)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
  borderBottom: "2px solid rgba(0,0,0,0.1)",
  py: 1.5,
  px: 2,
  whiteSpace: "nowrap" as const,
};

const bodyCellSx = {
  fontFamily: "Inter, Roboto, sans-serif",
  fontSize: 13,
  color: "#000",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  py: 1.5,
  px: 2,
};

export default function PreCallPlansPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = PLANS.filter((p) => {
    const matchesSearch = !search || p.customer.toLowerCase().includes(search.toLowerCase()) || p.partner.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalImpact = filtered.reduce((sum, p) => sum + p.revenueImpact, 0);
  const totalRevenue = filtered.reduce((sum, p) => sum + p.totalRevenue, 0);

  return (
    <AppShell>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#f5f5f5" }}>
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
            Pre-Call Plans
          </Typography>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", lineHeight: 1.2 }}>Total revenue at stake</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#00446a" }}>{fmt.format(totalRevenue)}</Typography>
            </Box>
            <Box sx={{ width: 1, height: 32, bgcolor: "rgba(0,0,0,0.1)" }} />
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", lineHeight: 1.2 }}>Revenue impact</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: "#0F6E56" }}>{fmt.format(totalImpact)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Filters */}
        <Box sx={{ display: "flex", gap: 2, px: 4, py: 2, alignItems: "center" }}>
          <TextField
            size="small"
            placeholder="Search by customer or partner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300, bgcolor: "white", "& .MuiOutlinedInput-root": { borderRadius: "6px", fontSize: 13 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: "rgba(0,0,0,0.35)" }} />
                  </InputAdornment>
                ),
              },
            }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ fontSize: 13, bgcolor: "white", borderRadius: "6px" }}
            >
              <MenuItem value="all">All statuses</MenuItem>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <MenuItem key={key} value={key}>{cfg.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ flex: 1 }} />
          <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
            {filtered.length} plan{filtered.length !== 1 ? "s" : ""}
          </Typography>
        </Box>

        {/* Table */}
        <Box sx={{ flex: 1, px: 4, pb: 4, overflowY: "auto" }}>
          <TableContainer sx={{ bgcolor: "white", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.08)" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={headCellSx}>Customer</TableCell>
                  <TableCell sx={headCellSx}>Partner</TableCell>
                  <TableCell sx={headCellSx}>Status</TableCell>
                  <TableCell sx={headCellSx}>Posture</TableCell>
                  <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Prices</TableCell>
                  <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Avg increase</TableCell>
                  <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Total revenue</TableCell>
                  <TableCell sx={{ ...headCellSx, textAlign: "right" }}>Revenue impact</TableCell>
                  <TableCell sx={headCellSx}>Modified</TableCell>
                  <TableCell sx={{ ...headCellSx, width: 48 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row) => {
                  const sc = STATUS_CONFIG[row.status];
                  const postureColor = POSTURE_COLORS[row.posture] || "#555";
                  return (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{ cursor: "pointer", "&:hover": { bgcolor: "rgba(0,68,106,0.03)" } }}
                      onClick={() => router.push("/pre-call-plan")}
                    >
                      <TableCell sx={{ ...bodyCellSx, fontWeight: 600 }}>{row.customer}</TableCell>
                      <TableCell sx={bodyCellSx}>{row.partner}</TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Chip
                          icon={<Box sx={{ display: "flex", color: `${sc.color} !important` }}>{sc.icon}</Box>}
                          label={sc.label}
                          size="small"
                          sx={{
                            bgcolor: sc.bgcolor,
                            color: sc.color,
                            fontWeight: 500,
                            fontSize: 11,
                            height: 24,
                            borderRadius: "12px",
                            "& .MuiChip-icon": { ml: 0.5 },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={bodyCellSx}>
                        <Typography sx={{ fontSize: 12, fontWeight: 500, color: postureColor }}>
                          {row.posture}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>{row.priceCount}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>+{row.avgIncrease}%</TableCell>
                      <TableCell sx={{ ...bodyCellSx, textAlign: "right" }}>{fmt.format(row.totalRevenue)}</TableCell>
                      <TableCell sx={{ ...bodyCellSx, textAlign: "right", fontWeight: 600, color: "#0F6E56" }}>
                        {fmt.format(row.revenueImpact)}
                      </TableCell>
                      <TableCell sx={{ ...bodyCellSx, color: "rgba(0,0,0,0.5)" }}>{row.lastModified}</TableCell>
                      <TableCell sx={bodyCellSx}>
                        <IconButton size="small" sx={{ color: "rgba(0,0,0,0.35)" }}>
                          <OpenIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </AppShell>
  );
}
