"use client";

import { useState, useMemo } from "react";
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

const OBJECTIONS = [
  {
    objection: "“We’ve already seen several increases this year.”",
    response: "“Understood — this adjustment consolidates prior ad-hoc changes into one consistent structure and avoids frequent smaller updates.”",
  },
  {
    objection: "“Competitor X is offering lower rates.”",
    response: "“We evaluated market comparisons — our pricing now reflects full service, reliability, and lead-time advantages.”",
  },
  {
    objection: "“We buy in multiple categories, shouldn’t we get a better rate?”",
    response: "“Your cross-category volume is why your overall increase is below the market average at just 3.5%. It recognizes your partnership breadth.”",
  },
];

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

function GeneratedContent() {
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
        <li>Affects: Copy &amp; Forms lines under AstroBright</li>
        <li>Average price adjustment: +3.5% effective July 15, 2026</li>
        <li>Driver: Rising input costs in paper and distribution, offset by efficiency gains</li>
        <li>Result: Simplified, more consistent pricing across product families</li>
      </Box>

      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#000", mb: 0.75 }}>
          Concise customer talking point:
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.7)", fontStyle: "italic", lineHeight: 1.7 }}>
          {"“Starting July 15, our updated pricing reflects moderate adjustments across select product lines to align with material costs and maintain consistency.”"}
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
              {OBJECTIONS.map((row, idx) => (
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
          <li>Estimated 2026 impact: +1.8% overall margin improvement</li>
          <li>Key effect: More sustainable pricing on low-margin SKUs; enables continued service levels and innovation investment.</li>
          <li>Broader portfolio mix remains competitive &mdash; small increases on high-volume items balanced by stable pricing on specialty forms.</li>
        </Box>
      </Box>

      <Box sx={{ mb: 3.5 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#000", mb: 1 }}>
          Value Proposition Reinforcement
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.7)", fontStyle: "italic", lineHeight: 1.7 }}>
          {"“These updates position you for stable supply, predictable pricing, and better alignment with our enhanced product mix for 2026. They reflect our continued investment in product quality, reliability, and service turnaround times — giving your teams fewer disruptions and more long-term cost control.”"}
        </Typography>
      </Box>

      <Box>
        <Typography sx={{ fontSize: 16, fontWeight: 700, color: "#f08b1d", mb: 1 }}>
          Concise Version (for quick use / email):
        </Typography>
        <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.7)", fontStyle: "italic", lineHeight: 1.7 }}>
          {"“We’re updating select product prices by an average of 3.5% effective July 15. This aligns with paper and distribution cost trends and helps sustain consistent supply without future volatility. The shift improves overall margin stability while keeping your multi-category pricing well below market averages.”"}
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
  const [aiBannerState, setAiBannerState] = useState<"suggest" | "applied">("suggest");
  const [buyingPriority, setBuyingPriority] = useState("Speed of service");
  const [message, setMessage] = useState("");
  const [contentState, setContentState] = useState<"empty" | "loading" | "generated">("empty");

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
    const newValues: Record<string, number> = {};
    const newAi: Record<string, boolean> = {};
    SLIDER_DRIVERS.forEach((d) => {
      newValues[d.key] = d.aiValue;
      newAi[d.key] = true;
    });
    setDriverValues((prev) => ({ ...prev, ...newValues }));
    setAiApplied(newAi);
    setAiBannerState("applied");
  };

  const resetAll = () => {
    setDriverValues(Object.fromEntries(SLIDER_DRIVERS.map((d) => [d.key, d.defaultValue])));
    setAiApplied({});
    setAiBannerState("suggest");
  };

  const handleGenerate = () => {
    setContentState("loading");
    setTimeout(() => setContentState("generated"), 2000);
  };

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

              {/* Pricing Posture Heat Strip */}
              <Box sx={{ px: 2.5, py: 2, borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    Pricing posture
                  </Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#000" }}>
                    {posture.descriptor}
                  </Typography>
                </Box>
                <Box sx={{ position: "relative", mb: 0.75 }}>
                  <Box
                    sx={{
                      height: 10,
                      borderRadius: "20px",
                      background: "linear-gradient(to right, #5DCAA5, #EF9F27, #D85A30)",
                    }}
                  />
                  <Box
                    sx={{
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      bgcolor: "white",
                      border: "2px solid #185FA5",
                      position: "absolute",
                      top: -2,
                      left: `${posture.pct}%`,
                      transform: "translateX(-50%)",
                      transition: "left 0.3s ease",
                      pointerEvents: "none",
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)" }}>Protect relationship</Typography>
                  <Typography sx={{ fontSize: 10, color: "rgba(0,0,0,0.4)" }}>Maximize capture</Typography>
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

            {/* Summary Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2.5,
                py: 1.25,
                borderTop: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "rgba(0,0,0,0.015)",
              }}
            >
              <InfoIcon sx={{ fontSize: 14, color: "rgba(0,0,0,0.35)", flexShrink: 0 }} />
              <Typography sx={{ fontSize: 11, color: "rgba(0,0,0,0.5)", lineHeight: 1.4 }}>
                5 drivers set &middot; posture is <strong>{posture.descriptor.toLowerCase()}</strong>
                {aiDriverCount > 0 && <> &middot; {aiDriverCount} AI-suggested</>}
              </Typography>
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
              <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.5)" }}>
                Generating communication strategy&hellip;
              </Typography>
            </Box>
          ) : (
            <>
              <Box sx={{ flex: 1, overflowY: "auto", px: 4, py: 3 }}>
                <GeneratedContent />
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
