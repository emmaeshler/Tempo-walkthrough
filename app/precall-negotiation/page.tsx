"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  ViewColumn as ViewColumnIcon,
  TableRows as TableRowsIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import AppShell from "../../components/AppShell";

interface NegotiationRow {
  customer: string;
  serviceGroup: string;
  currentFee: number;
  proposedFee: number;
  marginPct: number;
  engagements: number;
  status: string;
  priority: string;
  lastReview: string;
  partner: string;
}

const negotiationItems: NegotiationRow[] = [
  { customer: "Meridian Health Systems", serviceGroup: "Audit & Assurance", currentFee: 285000, proposedFee: 310650, marginPct: 18.2, engagements: 12, status: "Ready", priority: "High", lastReview: "2026-05-28", partner: "M. Richardson" },
  { customer: "Meridian Health Systems", serviceGroup: "Tax Advisory", currentFee: 95000, proposedFee: 104500, marginPct: 22.1, engagements: 8, status: "In Progress", priority: "Medium", lastReview: "2026-06-01", partner: "S. Goldstein" },
  { customer: "Apex Capital Partners", serviceGroup: "Transaction Advisory", currentFee: 225000, proposedFee: 247500, marginPct: 15.8, engagements: 5, status: "Ready", priority: "High", lastReview: "2026-05-30", partner: "J. Whitfield" },
  { customer: "Apex Capital Partners", serviceGroup: "Fund Audit", currentFee: 175000, proposedFee: 192500, marginPct: 24.5, engagements: 4, status: "Pending Data", priority: "Low", lastReview: "2026-05-15", partner: "R. Patel" },
  { customer: "Greenfield Manufacturing", serviceGroup: "Accounting Services", currentFee: 84000, proposedFee: 91560, marginPct: 16.9, engagements: 6, status: "Ready", priority: "Medium", lastReview: "2026-06-02", partner: "M. Richardson" },
  { customer: "Summit Healthcare Group", serviceGroup: "Compliance Audit", currentFee: 320000, proposedFee: 352000, marginPct: 19.3, engagements: 9, status: "In Progress", priority: "High", lastReview: "2026-05-29", partner: "K. Donovan" },
  { customer: "Summit Healthcare Group", serviceGroup: "Operational Advisory", currentFee: 450000, proposedFee: 495000, marginPct: 14.7, engagements: 3, status: "Ready", priority: "Medium", lastReview: "2026-06-03", partner: "A. Bernstein" },
  { customer: "Blackstone River Capital", serviceGroup: "M&A Due Diligence", currentFee: 340000, proposedFee: 374000, marginPct: 17.1, engagements: 7, status: "Pending Data", priority: "Low", lastReview: "2026-05-20", partner: "T. Nakamura" },
  { customer: "Pinnacle Consumer Brands", serviceGroup: "Full Acctg Outsourcing", currentFee: 156000, proposedFee: 171600, marginPct: 13.5, engagements: 11, status: "Ready", priority: "High", lastReview: "2026-06-01", partner: "L. Chen" },
  { customer: "Harbor View Real Estate", serviceGroup: "Valuation Services", currentFee: 85000, proposedFee: 93500, marginPct: 20.4, engagements: 4, status: "In Progress", priority: "Medium", lastReview: "2026-05-27", partner: "S. Goldstein" },
  { customer: "Liberty Mutual Properties", serviceGroup: "Risk Management", currentFee: 135000, proposedFee: 148500, marginPct: 16.2, engagements: 6, status: "Ready", priority: "Medium", lastReview: "2026-05-25", partner: "J. Whitfield" },
  { customer: "NextGen Life Sciences", serviceGroup: "R&D Tax Credits", currentFee: 72000, proposedFee: 79920, marginPct: 21.8, engagements: 3, status: "Ready", priority: "High", lastReview: "2026-06-02", partner: "R. Patel" },
  { customer: "Atlantic Housing Trust", serviceGroup: "Government Grants", currentFee: 95000, proposedFee: 104500, marginPct: 18.5, engagements: 5, status: "In Progress", priority: "Medium", lastReview: "2026-05-31", partner: "K. Donovan" },
  { customer: "Cascade Food Group", serviceGroup: "Annual Audit", currentFee: 138000, proposedFee: 153180, marginPct: 15.4, engagements: 8, status: "Pending Data", priority: "Low", lastReview: "2026-05-18", partner: "A. Bernstein" },
  { customer: "Sterling Law Partners", serviceGroup: "Partner Tax Planning", currentFee: 82000, proposedFee: 90200, marginPct: 23.1, engagements: 4, status: "Ready", priority: "Medium", lastReview: "2026-06-03", partner: "T. Nakamura" },
  { customer: "Vanguard Senior Living", serviceGroup: "Business Performance", currentFee: 275000, proposedFee: 302500, marginPct: 17.8, engagements: 7, status: "Ready", priority: "High", lastReview: "2026-05-29", partner: "M. Richardson" },
  { customer: "Ironclad Distributors", serviceGroup: "System Implementation", currentFee: 165000, proposedFee: 181500, marginPct: 14.2, engagements: 3, status: "In Progress", priority: "Medium", lastReview: "2026-06-01", partner: "L. Chen" },
  { customer: "National Care Alliance", serviceGroup: "Operational Transform", currentFee: 520000, proposedFee: 572000, marginPct: 19.7, engagements: 10, status: "Ready", priority: "High", lastReview: "2026-05-30", partner: "S. Goldstein" },
  { customer: "Trident PE Group", serviceGroup: "M&A Due Diligence", currentFee: 420000, proposedFee: 462000, marginPct: 16.5, engagements: 6, status: "Pending Data", priority: "Low", lastReview: "2026-05-22", partner: "J. Whitfield" },
  { customer: "Coastal Ventures Fund", serviceGroup: "Fund Audit", currentFee: 205000, proposedFee: 225500, marginPct: 18.9, engagements: 5, status: "Ready", priority: "Medium", lastReview: "2026-06-02", partner: "R. Patel" },
];

const fmt = (n: number) => "$" + n.toLocaleString("en-US");

const statusConfig: Record<string, { bg: string; color: string }> = {
  "Ready": { bg: "#e8f5e9", color: "#2e7d32" },
  "In Progress": { bg: "#e3f2fd", color: "#1565c0" },
  "Pending Data": { bg: "#fff3e0", color: "#e65100" },
};

const priorityConfig: Record<string, { color: string }> = {
  "High": { color: "#c62828" },
  "Medium": { color: "#e65100" },
  "Low": { color: "#757575" },
};

const headerCellSx = {
  fontFamily: "Inter, sans-serif",
  fontSize: 11,
  fontWeight: 600,
  color: "rgba(0,0,0,0.7)",
  whiteSpace: "nowrap" as const,
  borderBottom: "2px solid #e0e0e0",
  py: 1,
  px: 1.5,
};

const bodyCellSx = {
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  borderBottom: "1px solid #eee",
  py: 0.75,
  px: 1.5,
};

const readyCount = negotiationItems.filter((r) => r.status === "Ready").length;
const inProgressCount = negotiationItems.filter((r) => r.status === "In Progress").length;
const pendingCount = negotiationItems.filter((r) => r.status === "Pending Data").length;
const avgMargin = (negotiationItems.reduce((s, r) => s + r.marginPct, 0) / negotiationItems.length).toFixed(1);

export default function PreCallNegotiationPage() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const paginatedData = negotiationItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <AppShell>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%", bgcolor: "#f8f8f8" }}>
        {/* Page title bar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3, pt: 2.5, pb: 1.5, bgcolor: "rgba(0,0,0,0.04)" }}>
          <Typography sx={{ color: "#2a7a4a", fontWeight: 700, fontSize: 20, cursor: "pointer" }}>&raquo;</Typography>
          <Typography variant="h4" sx={{ fontWeight: 400, color: "#2a7a4a", letterSpacing: "0.25px", lineHeight: "42px" }}>
            Pre-Call Negotiation
          </Typography>
        </Box>

        {/* KPI Cards */}
        <Box sx={{ display: "flex", gap: 1.5, px: 3, py: 2 }}>
          {[
            { title: "NEGOTIATIONS READY", value: String(readyCount), color: "#2e7d32" },
            { title: "IN PROGRESS", value: String(inProgressCount), color: "#1565c0" },
            { title: "PENDING DATA", value: String(pendingCount), color: "#e65100" },
            { title: "AVG. MARGIN", value: avgMargin + "%", color: "#000" },
          ].map((card) => (
            <Box key={card.title} sx={{ flex: 1, bgcolor: "white", border: "1px solid #000", borderRadius: "4px", px: 2, py: 1.25 }}>
              <Typography sx={{ fontSize: 12, fontWeight: 400, letterSpacing: "1px", textTransform: "uppercase", lineHeight: "32px" }}>{card.title}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.15px", lineHeight: "28px", color: card.color }}>{card.value}</Typography>
            </Box>
          ))}
        </Box>

        {/* Toolbar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "5px", px: 3, py: 1 }}>
          {[FilterListIcon, ViewColumnIcon, TableRowsIcon].map((Icon, i) => (
            <Box key={i} sx={{ height: 30, px: 0.75, bgcolor: "white", border: "1px solid #000", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Icon sx={{ fontSize: 24, color: "rgba(0,0,0,0.6)" }} />
            </Box>
          ))}
          <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: "rgba(0,0,0,0.3)" }} />
          {["All Negotiations", "By Customer", "By Service Group"].map((label) => (
            <Box key={label} sx={{ height: 30, px: 1, bgcolor: "white", border: "1px solid #000", borderRadius: "4px", display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Typography sx={{ fontSize: 10, fontWeight: 500, color: "rgba(0,0,0,0.6)" }}>{label}</Typography>
            </Box>
          ))}
          <Box sx={{ flex: 1 }} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#2a7a4a",
              color: "white",
              fontWeight: 600,
              fontSize: 12,
              textTransform: "none",
              height: 30,
              borderRadius: "4px",
              boxShadow: "none",
              "&:hover": { bgcolor: "#236b3e", boxShadow: "none" },
            }}
          >
            New Negotiation
          </Button>
        </Box>

        {/* Table */}
        <TableContainer sx={{ flex: 1, mx: 3, bgcolor: "white", borderRadius: "4px", overflow: "auto" }}>
          <Table size="small" stickyHeader sx={{ minWidth: 1200 }}>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" sx={{ ...headerCellSx, bgcolor: "#fafafa", width: 42 }}>
                  <Checkbox size="small" sx={{ p: 0 }} />
                </TableCell>
                <TableCell sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Customer</TableCell>
                <TableCell sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Service Group</TableCell>
                <TableCell align="right" sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Current Fee</TableCell>
                <TableCell align="right" sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Proposed Fee</TableCell>
                <TableCell align="right" sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Margin %</TableCell>
                <TableCell align="right" sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Engagements</TableCell>
                <TableCell align="center" sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Status</TableCell>
                <TableCell align="center" sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Priority</TableCell>
                <TableCell sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Last Review</TableCell>
                <TableCell sx={{ ...headerCellSx, bgcolor: "#fafafa" }}>Partner</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.map((row, idx) => {
                const sc = statusConfig[row.status] || { bg: "#f5f5f5", color: "#333" };
                const pc = priorityConfig[row.priority] || { color: "#757575" };
                return (
                  <TableRow key={idx} hover sx={{ bgcolor: idx % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <TableCell padding="checkbox" sx={{ ...bodyCellSx, width: 42 }}>
                      <Checkbox size="small" sx={{ p: 0 }} />
                    </TableCell>
                    <TableCell sx={bodyCellSx}>{row.customer}</TableCell>
                    <TableCell sx={bodyCellSx}>{row.serviceGroup}</TableCell>
                    <TableCell align="right" sx={bodyCellSx}>{fmt(row.currentFee)}</TableCell>
                    <TableCell align="right" sx={{ ...bodyCellSx, bgcolor: "#b3e5fc" }}>{fmt(row.proposedFee)}</TableCell>
                    <TableCell align="right" sx={bodyCellSx}>
                      <Typography sx={{ fontSize: 12, fontWeight: 500, color: row.marginPct >= 18 ? "#2e7d32" : row.marginPct >= 15 ? "#e65100" : "#c62828" }}>
                        {row.marginPct.toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={bodyCellSx}>{row.engagements}</TableCell>
                    <TableCell align="center" sx={bodyCellSx}>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{ bgcolor: sc.bg, color: sc.color, fontWeight: 500, fontSize: 11, height: 22, "& .MuiChip-label": { px: 1 } }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={bodyCellSx}>
                      <Typography sx={{ fontSize: 12, fontWeight: 600, color: pc.color }}>{row.priority}</Typography>
                    </TableCell>
                    <TableCell sx={bodyCellSx}>{row.lastReview}</TableCell>
                    <TableCell sx={bodyCellSx}>{row.partner}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={negotiationItems.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[25, 50, 100]}
          sx={{ mx: 3, mb: 1, bgcolor: "white", borderRadius: "4px", flexShrink: 0 }}
        />
      </Box>
    </AppShell>
  );
}
