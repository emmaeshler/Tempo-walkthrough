"use client";

import {
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Home as HomeIcon,
  Description as DescriptionIcon,
  CheckCircle as CheckCircleIcon,
  SwapHoriz as SwapHorizIcon,
  OpenInFull as OpenInFullIcon,
  ArrowForward as ArrowForwardIcon,
  PriorityHigh as PriorityHighIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  LabelList,
} from "recharts";
import AppShell from "../components/AppShell";

const reviewByServiceLine = [
  { name: "Audit & Assurance", needsReview: 312, revised: 187, complete: 94 },
  { name: "Tax", needsReview: 248, revised: 156, complete: 131 },
  { name: "Advisory", needsReview: 164, revised: 98, complete: 72 },
  { name: "Technology", needsReview: 123, revised: 67, complete: 48 },
];

const marginByTier = [
  { name: "Platinum", current: 38.2, peer: 42.5 },
  { name: "Gold", current: 31.7, peer: 36.1 },
  { name: "Silver", current: 24.9, peer: 30.8 },
  { name: "Bronze", current: 18.3, peer: 25.2 },
];

const feeIncreaseTrend = [
  { cycle: "Q2 '24", recommended: 2.4, revised: 1.8, accepted: 1.6 },
  { cycle: "Q3 '24", recommended: 2.8, revised: 2.1, accepted: 1.9 },
  { cycle: "Q1 '25", recommended: 3.1, revised: 2.4, accepted: 2.2 },
  { cycle: "Q3 '25", recommended: 3.4, revised: 2.7, accepted: 2.5 },
  { cycle: "Q1 '26", recommended: 4.1, revised: 3.2, accepted: 2.9 },
];

const actionItems = [
  { label: "NEEDS REVIEW", count: "847 Engagements", icon: <WarningIcon sx={{ fontSize: 18, color: "#e65100" }} />, bgcolor: "rgba(230,81,0,0.08)" },
  { label: "BELOW MARGIN FLOOR", count: "34 Engagements", icon: <PriorityHighIcon sx={{ fontSize: 18, color: "#c62828" }} />, bgcolor: "rgba(198,40,40,0.08)" },
  { label: "ABOVE TARGET", count: "156 Engagements", icon: <TrendingUpIcon sx={{ fontSize: 18, color: "#2e7d32" }} />, bgcolor: "rgba(46,125,50,0.08)" },
  { label: "READY TO SEND", count: "508 Engagements", icon: <SendIcon sx={{ fontSize: 18, color: "#1565c0" }} />, bgcolor: "rgba(21,101,192,0.08)" },
];

export default function SummaryDashboardPage() {
  const router = useRouter();

  return (
    <AppShell>
      <Box sx={{ display: "flex", height: "100%" }}>
        {/* Left Icon Rail */}
        <Box data-tour="nav-rail" sx={{ width: 53, bgcolor: "white", borderRight: "1px solid rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
          {[
            { icon: <HomeIcon />, active: true, path: "/" },
            { icon: <DescriptionIcon />, active: false, path: "/price-review", tourId: "nav-price-review" },
            { icon: <CheckCircleIcon />, active: false, path: "#" },
          ].map((item, i) => (
            <Box key={i} data-tour={item.tourId} onClick={() => item.path !== "#" && router.push(item.path)} sx={{ width: 53, height: 40, display: "flex", alignItems: "center", justifyContent: "center", bgcolor: item.active ? "#f8f8f8" : "transparent", borderLeft: item.active ? "2px solid #00446a" : "2px solid transparent", cursor: "pointer", "&:hover": { bgcolor: "#f8f8f8" } }}>
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

        {/* Main Content */}
        <Box data-tour="dashboard-content" sx={{ flex: 1, overflow: "auto", bgcolor: "#f5f6fa" }}>
          {/* Header */}
          <Box sx={{ px: 3, pt: 2.5, pb: 1.5, bgcolor: "rgba(0,0,0,0.04)", display: "flex", alignItems: "baseline", gap: 1.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 400, color: "#00446a", letterSpacing: "0.25px", lineHeight: "42px" }}>
              Summary Dashboard <Typography component="span" variant="h4" sx={{ fontWeight: 300, color: "rgba(0,0,0,0.35)", letterSpacing: "0.25px" }}>|</Typography>{" "}
              <Typography component="span" variant="h4" sx={{ fontWeight: 300, color: "rgba(0,0,0,0.5)", letterSpacing: "0.25px" }}>Welcome Back, </Typography>
              <Typography component="span" variant="h4" sx={{ fontWeight: 600, color: "#f08b1d", fontStyle: "italic", letterSpacing: "0.25px" }}>Emma</Typography>
            </Typography>
          </Box>

          {/* Review Action Items */}
          <Box data-tour="action-items" sx={{ bgcolor: "white", px: 3, pt: 2, pb: 2.5, borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333", mb: 1.5, fontFamily: "Inter, sans-serif" }}>
              Review Action Items
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {actionItems.map((item, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  onClick={() => router.push("/price-review")}
                  sx={{ flex: 1, px: 2, py: 1.5, border: "1px solid rgba(0,0,0,0.1)", borderRadius: "8px", display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.08)" } }}
                >
                  <Box sx={{ width: 32, height: 32, borderRadius: "6px", bgcolor: item.bgcolor, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.5)", letterSpacing: "0.05em" }}>{item.label}</Typography>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{item.count}</Typography>
                  </Box>
                  <ArrowForwardIcon sx={{ fontSize: 18, color: "rgba(0,0,0,0.3)" }} />
                </Paper>
              ))}
            </Box>
          </Box>

          {/* Analytics Summary */}
          <Box data-tour="analytics-summary">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 1.5, bgcolor: "#eef1f5", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#00446a", fontFamily: "Inter, sans-serif" }}>
                Analytics Summary
              </Typography>
              <FormControl size="small" sx={{ minWidth: 260 }}>
                <Select value="engagement" sx={{ fontSize: 13, borderRadius: "6px", bgcolor: "white" }}>
                  <MenuItem value="engagement">Engagement Review Overview</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", color: "#00446a" }}>
              <OpenInFullIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: 12, fontWeight: 600 }}>EXPAND VIEW</Typography>
            </Box>
          </Box>

          {/* Charts Area */}
          <Box sx={{ px: 3, py: 2, bgcolor: "#e8ecf0" }}>
            {/* Charts Row 1 */}
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              {/* Fee Impact Summary — KPI card */}
              <Paper elevation={0} sx={{ flex: 1, p: 2.5, borderRadius: "8px" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#333", mb: 2.5, fontFamily: "Inter, sans-serif" }}>
                  Fee Impact Summary
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em", mb: 0.25 }}>RECOMMENDED IMPACT</Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#00446a", lineHeight: 1.1 }}>+$4.2M</Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em", mb: 0.25 }}>REVISED IMPACT</Typography>
                    <Typography sx={{ fontSize: 28, fontWeight: 700, color: "#f08b1d", lineHeight: 1.1 }}>+$3.1M</Typography>
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em" }}>CAPTURE RATE</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#00446a" }}>73.8%</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={73.8}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        bgcolor: "rgba(0,68,106,0.08)",
                        "& .MuiLinearProgress-bar": { bgcolor: "#00446a", borderRadius: 3 },
                      }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em" }}>AVG REC. INCREASE</Typography>
                    <Typography sx={{ fontSize: 20, fontWeight: 700, color: "#2e7d32" }}>+4.8%</Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Review Progress by Service Line */}
              <Paper elevation={0} sx={{ flex: 1.3, p: 2.5, borderRadius: "8px" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#333", mb: 1, fontFamily: "Inter, sans-serif" }}>
                  Review Progress by Service Line
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  {[
                    { label: "COMPLETE", color: "#2e7d32" },
                    { label: "REVISED", color: "#1565c0" },
                    { label: "NEEDS REVIEW", color: "#f08b1d" },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: item.color }} />
                      <Typography sx={{ fontSize: 9, color: "rgba(0,0,0,0.55)", fontWeight: 600, letterSpacing: "0.02em" }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Box>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={reviewByServiceLine} barSize={32}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" fontSize={10} tick={{ fill: "rgba(0,0,0,0.6)" }} interval={0} tickLine={false} axisLine={{ stroke: "rgba(0,0,0,0.08)" }} />
                    <YAxis fontSize={10} tick={{ fill: "rgba(0,0,0,0.4)" }} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} />
                    <Bar dataKey="complete" stackId="a" fill="#2e7d32" radius={[0, 0, 0, 0]}>
                      <LabelList dataKey="complete" position="center" style={{ fontSize: 10, fill: "white", fontWeight: 600 }} />
                    </Bar>
                    <Bar dataKey="revised" stackId="a" fill="#1565c0">
                      <LabelList dataKey="revised" position="center" style={{ fontSize: 10, fill: "white", fontWeight: 600 }} />
                    </Bar>
                    <Bar dataKey="needsReview" stackId="a" fill="#f08b1d" radius={[3, 3, 0, 0]}>
                      <LabelList dataKey="needsReview" position="center" style={{ fontSize: 10, fill: "white", fontWeight: 600 }} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>

              {/* Margin vs Peer Benchmark */}
              <Paper elevation={0} sx={{ flex: 1.3, p: 2.5, borderRadius: "8px" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#333", mb: 1, fontFamily: "Inter, sans-serif" }}>
                  Margin vs Peer Benchmark
                </Typography>
                <Box sx={{ display: "flex", gap: 2, mb: 1 }}>
                  {[
                    { label: "CURRENT MARGIN", color: "#00446a" },
                    { label: "PEER AVG", color: "#d0d0d0" },
                  ].map((item) => (
                    <Box key={item.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: item.color }} />
                      <Typography sx={{ fontSize: 9, color: "rgba(0,0,0,0.55)", fontWeight: 600, letterSpacing: "0.02em" }}>{item.label}</Typography>
                    </Box>
                  ))}
                </Box>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={marginByTier} barSize={18} barGap={2}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                    <XAxis dataKey="name" fontSize={10} tick={{ fill: "rgba(0,0,0,0.6)" }} tickLine={false} axisLine={{ stroke: "rgba(0,0,0,0.08)" }} />
                    <YAxis fontSize={10} tick={{ fill: "rgba(0,0,0,0.4)" }} tickFormatter={(v) => `${v}%`} domain={[0, 50]} tickLine={false} axisLine={false} />
                    <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} formatter={(value) => `${value}%`} />
                    <Bar dataKey="peer" fill="#d0d0d0" radius={[3, 3, 0, 0]}>
                      <LabelList dataKey="peer" position="top" style={{ fontSize: 9, fill: "rgba(0,0,0,0.4)", fontWeight: 500 }} formatter={(v) => `${v}%`} />
                    </Bar>
                    <Bar dataKey="current" fill="#00446a" radius={[3, 3, 0, 0]}>
                      <LabelList dataKey="current" position="top" style={{ fontSize: 9, fill: "#00446a", fontWeight: 600 }} formatter={(v) => `${v}%`} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>

            {/* Charts Row 2 */}
            <Box sx={{ display: "flex", gap: 2 }}>
              {/* Portfolio Fees */}
              <Paper elevation={0} sx={{ flex: 1, p: 2.5, borderRadius: "8px" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#333", mb: 2.5, fontFamily: "Inter, sans-serif" }}>
                  Portfolio Fees
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em", mb: 0.25 }}>CURRENT TOTAL</Typography>
                    <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#00446a", lineHeight: 1.1 }}>$87.3M</Typography>
                  </Box>
                  <ArrowForwardIcon sx={{ fontSize: 18, color: "rgba(0,0,0,0.15)", mt: 1.5 }} />
                  <Box>
                    <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em", mb: 0.25 }}>REVISED TOTAL</Typography>
                    <Typography sx={{ fontSize: 26, fontWeight: 700, color: "#f08b1d", lineHeight: 1.1 }}>$90.4M</Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2.5, pt: 1.5, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#2e7d32" }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#2e7d32" }}>+$3.1M</Typography>
                    <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>revised uplift (+3.6%)</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#00446a" }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#00446a" }}>+$4.2M</Typography>
                    <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>recommended (+4.8%)</Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                  <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.4)", letterSpacing: "0.05em", mb: 0.5 }}>REVIEW PROGRESS</Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box sx={{ flex: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={55}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "rgba(0,68,106,0.08)",
                          "& .MuiLinearProgress-bar": { bgcolor: "#2e7d32", borderRadius: 4 },
                        }}
                      />
                    </Box>
                    <Typography sx={{ fontSize: 14, fontWeight: 700, color: "#333" }}>55%</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.4)", mt: 0.5 }}>849 of 1,545 engagements reviewed</Typography>
                </Box>
              </Paper>

              {/* Fee Increase Trend */}
              <Paper elevation={0} sx={{ flex: 2.5, p: 2.5, borderRadius: "8px" }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#333", mb: 1, fontFamily: "Inter, sans-serif" }}>
                  Fee Increase Trend by Review Cycle
                </Typography>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <ResponsiveContainer width="100%" height={210}>
                      <LineChart data={feeIncreaseTrend}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                        <XAxis dataKey="cycle" fontSize={10} tick={{ fill: "rgba(0,0,0,0.5)" }} tickLine={false} axisLine={{ stroke: "rgba(0,0,0,0.08)" }} />
                        <YAxis fontSize={10} tick={{ fill: "rgba(0,0,0,0.4)" }} tickFormatter={(v) => `${v}%`} domain={[0, 5]} tickLine={false} axisLine={false} />
                        <RechartsTooltip contentStyle={{ fontSize: 11, borderRadius: 6, border: "1px solid rgba(0,0,0,0.08)", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }} formatter={(value) => `${value}%`} />
                        <Line type="monotone" dataKey="recommended" stroke="#00446a" strokeWidth={2.5} dot={{ r: 4, fill: "#00446a", strokeWidth: 0 }} name="Recommended %" />
                        <Line type="monotone" dataKey="revised" stroke="#f08b1d" strokeWidth={2.5} dot={{ r: 4, fill: "#f08b1d", strokeWidth: 0 }} name="Revised %" />
                        <Line type="monotone" dataKey="accepted" stroke="#2e7d32" strokeWidth={2.5} dot={{ r: 4, fill: "#2e7d32", strokeWidth: 0 }} name="Accepted %" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                  <Box sx={{ minWidth: 150, pt: 1 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#333", mb: 1.5 }}>Increase Rate</Typography>
                    {[
                      { label: "Recommended", color: "#00446a", value: "4.1%" },
                      { label: "Revised", color: "#f08b1d", value: "3.2%" },
                      { label: "Accepted", color: "#2e7d32", value: "2.9%" },
                    ].map((item) => (
                      <Box key={item.label} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: "2px", bgcolor: item.color, flexShrink: 0 }} />
                          <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.6)" }}>{item.label}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 600, color: item.color }}>{item.value}</Typography>
                      </Box>
                    ))}
                    <Box sx={{ mt: 2, pt: 1.5, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                      <Typography sx={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.35)", letterSpacing: "0.03em", mb: 0.5 }}>CURRENT CYCLE</Typography>
                      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#00446a" }}>Q2 '26</Typography>
                      <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.5)", mt: 0.25 }}>4.8% recommended</Typography>
                      <Typography sx={{ fontSize: 11, color: "#e65100", fontWeight: 500 }}>847 pending review</Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
          </Box>

        </Box>
      </Box>
    </AppShell>
  );
}
