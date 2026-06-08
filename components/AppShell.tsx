"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CheckIcon from "@mui/icons-material/Check";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import LogoutIcon from "@mui/icons-material/Logout";
import AppsIcon from "@mui/icons-material/Apps";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { useWalkthrough } from "./ModelWalkthrough/WalkthroughContext";
import { useTempoTour } from "./TempoTour/TempoTourContext";

const DRAWER_WIDTH = 340;

const INSTANCES = [
  { id: 218, env: "live" as const, name: "Fixed Fee Model", desc: "Annual fixed-fee engagements reviewed against peer benchmarks and margin targets" },
  { id: 362, env: "live" as const, name: "Tax Recommendation Review", desc: "Tax service pricing recommendations based on complexity scoring and filing volume" },
  { id: 651, env: "live" as const, name: "Tax Engagement Fees Review", desc: "Existing tax engagement fees evaluated for rate-card alignment and margin recovery" },
  { id: 103, env: "uat" as const, name: "Fixed Fee Model", desc: "Staging copy of the fixed-fee model for testing configuration changes before go-live" },
  { id: 146, env: "uat" as const, name: "Tax Engagement Fees Review", desc: "Staging copy of tax engagement fees for validating new fee thresholds" },
  { id: 203, env: "uat" as const, name: "Tax Recommendation Review", desc: "Staging copy of tax recommendations for testing model updates" },
];

const NAV_ITEMS = [
  { label: "Price Review", path: "/" },
  { label: "Pre-Call Dashboard", path: "/pre-call-plan" },
];

function Logo({ size = 20 }: { size?: number }) {
  const half = size / 2;
  const gap = 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect x={0} y={0} width={half - gap} height={half - gap} fill="#d4712a" />
      <rect x={half + gap} y={0} width={half - gap} height={half - gap} fill="#e8944a" />
      <rect x={0} y={half + gap} width={half - gap} height={half - gap} fill="#1e2a3a" />
      <rect x={half + gap} y={half + gap} width={half - gap} height={half - gap} fill="#d4712a" />
    </svg>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tempoExpanded, setTempoExpanded] = useState(true);
  const [activeInstance, setActiveInstance] = useState(INSTANCES[0]);
  const [instanceModalOpen, setInstanceModalOpen] = useState(false);
  const { open: openTempoTour } = useTempoTour();
  const { open: openWalkthrough } = useWalkthrough();
  const pathname = usePathname();
  const router = useRouter();

  const isTempoActive = pathname === "/" || pathname.startsWith("/tempo") || pathname.startsWith("/pre-call");

  useEffect(() => {
    const handler = () => setInstanceModalOpen(true);
    window.addEventListener("open-instance-modal", handler);
    return () => window.removeEventListener("open-instance-modal", handler);
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header */}
      <Box
        component="header"
        sx={{
          display: "flex",
          alignItems: "center",
          height: 48,
          bgcolor: "white",
          borderBottom: "1px solid rgba(0,0,0,0.12)",
          pr: 3,
          flexShrink: 0,
        }}
      >
        <Box sx={{ width: 53, display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <IconButton
            onClick={() => setSidebarOpen(!sidebarOpen)}
            size="small"
            sx={{ color: "#666" }}
            aria-label="Toggle menu"
          >
            <MenuIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Logo size={22} />
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              color: "#333",
              letterSpacing: "0.05em",
              fontFamily: "Inter, sans-serif",
            }}
          >
            INSIGHT2PROFIT
          </Typography>
        </Box>
        <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="What is Tempo?" arrow>
            <IconButton onClick={openTempoTour} size="small" sx={{ color: "#666" }}>
              <SlideshowIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        {/* Drawer */}
        <Drawer
          anchor="left"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          variant="temporary"
          slotProps={{
            paper: {
              sx: {
                width: DRAWER_WIDTH,
                top: 48,
                height: "calc(100% - 48px)",
                display: "flex",
                flexDirection: "column",
              },
            },
            backdrop: {
              sx: { top: 48 },
            },
          }}
        >
          {/* Logo + subtitle + shortcut */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2.5, pt: 2.5, pb: 1.5 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Logo size={28} />
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.2)" }}>|</Typography>
              <Typography sx={{ fontSize: 12, color: "#f08b1d", fontWeight: 500 }}>Drive Account</Typography>
            </Box>
            <Box
              sx={{
                fontSize: 11,
                color: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(0,0,0,0.2)",
                borderRadius: 1,
                px: 1,
                py: 0.25,
              }}
            >
              CTRL + M
            </Box>
          </Box>

          {/* Drive Applications */}
          <Typography sx={{ px: 2.5, py: 1, fontSize: 12, color: "rgba(0,0,0,0.45)", fontWeight: 500 }}>
            Drive Applications
          </Typography>

          {/* Tempo — expandable */}
          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <List disablePadding>
              <ListItemButton
                onClick={() => setTempoExpanded(!tempoExpanded)}
                sx={{
                  py: 1.5,
                  px: 2.5,
                  borderLeft: "3px solid",
                  borderColor: isTempoActive || tempoExpanded ? "#00446a" : "transparent",
                  bgcolor: isTempoActive || tempoExpanded ? "#f5f7fa" : "transparent",
                  "&:hover": { bgcolor: isTempoActive || tempoExpanded ? "#f0f2f5" : "rgba(0,0,0,0.04)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AppsIcon sx={{ color: "#00446a", fontSize: 22 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Tempo"
                  slotProps={{ primary: { sx: { fontWeight: 500, fontSize: 15, color: "#333" } } }}
                />
                <ExpandMoreIcon
                  sx={{
                    color: "#f08b1d",
                    fontSize: 20,
                    transition: "transform 0.2s",
                    transform: tempoExpanded ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                />
              </ListItemButton>

              <Collapse in={tempoExpanded} timeout="auto" unmountOnExit>
                <List disablePadding>
                  {NAV_ITEMS.map((item) => (
                    <ListItemButton
                      key={item.label}
                      onClick={() => navigateTo(item.path)}
                      sx={{
                        py: 1.25,
                        pl: 7,
                        "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        slotProps={{ primary: { sx: { fontSize: 14, color: "#555" } } }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </List>
          </Box>

          {/* User Resources */}
          <Divider />
          <Box sx={{ bgcolor: "#f5f5f5", px: 2.5, py: 1.25 }}>
            <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.45)", fontWeight: 500 }}>
              User Resources
            </Typography>
          </Box>

          <List disablePadding>
            <ListItemButton sx={{ py: 1.5, px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SupportAgentIcon sx={{ color: "#00446a", fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText
                primary="Get Customer Support"
                slotProps={{ primary: { sx: { fontSize: 14, color: "#555" } } }}
              />
              <ChevronRightIcon sx={{ color: "rgba(0,0,0,0.3)", fontSize: 18 }} />
            </ListItemButton>

            <ListItemButton sx={{ py: 1.5, px: 2.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <PersonSearchIcon sx={{ color: "#00446a", fontSize: 22 }} />
              </ListItemIcon>
              <ListItemText
                primary="Impersonate User"
                slotProps={{ primary: { sx: { fontSize: 14, color: "#555" } } }}
              />
              <ChevronRightIcon sx={{ color: "rgba(0,0,0,0.3)", fontSize: 18 }} />
            </ListItemButton>

            <ListItemButton
              onClick={() => { openWalkthrough(); setSidebarOpen(false); }}
              sx={{ py: 1, px: 2.5, opacity: 0.4, "&:hover": { opacity: 0.7 } }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SlideshowIcon sx={{ color: "rgba(0,0,0,0.3)", fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Model Walkthrough"
                slotProps={{ primary: { sx: { fontSize: 12, color: "rgba(0,0,0,0.4)" } } }}
              />
            </ListItemButton>
          </List>

          {/* User info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: 2.5,
              py: 1.5,
              borderTop: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#e0e0e0", color: "#666", fontSize: 16 }}>C</Avatar>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#333" }}>Cathryn Greene</Typography>
              <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>cgreene@insight2profit.com</Typography>
            </Box>
          </Box>

          {/* Logout */}
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={() => {}}
            sx={{
              py: 1.5,
              bgcolor: "#f08b1d",
              color: "white",
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "0.05em",
              borderRadius: 0,
              "&:hover": { bgcolor: "#d97c14" },
            }}
          >
            LOGOUT
          </Button>
        </Drawer>

        {/* Main content */}
        <Box component="main" sx={{ flex: 1, overflow: "auto" }}>
          {children}
        </Box>
      </Box>

      <Dialog
        open={instanceModalOpen}
        onClose={() => setInstanceModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "12px" } } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography sx={{ fontSize: 18, fontWeight: 700, color: "#333", textAlign: "center" }}>Available Instances</Typography>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3 }}>
          {INSTANCES.map((inst) => {
            const isActive = inst.id === activeInstance.id;
            return (
              <Box
                key={inst.id}
                onClick={() => { setActiveInstance(inst); setInstanceModalOpen(false); }}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1.5,
                  px: 2,
                  py: 1.5,
                  borderRadius: "8px",
                  cursor: "pointer",
                  bgcolor: isActive ? "rgba(0,68,106,0.08)" : "transparent",
                  border: isActive ? "1px solid rgba(0,68,106,0.2)" : "1px solid transparent",
                  "&:hover": { bgcolor: isActive ? "rgba(0,68,106,0.1)" : "rgba(0,0,0,0.04)" },
                  mb: 0.5,
                }}
              >
                <Box sx={{ width: 20, pt: 0.25, flexShrink: 0 }}>
                  {isActive && <CheckIcon sx={{ fontSize: 18, color: "#00446a" }} />}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography sx={{ fontSize: 14, fontWeight: isActive ? 600 : 400, color: "#333" }}>
                      {inst.name}
                    </Typography>
                    <Tooltip
                      arrow
                      title={inst.env === "live" ? "Production instance — changes here affect active reviews" : "Staging instance — safe to test configuration changes"}
                    >
                      <Chip
                        label={inst.env}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: 10,
                          fontWeight: 600,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          bgcolor: inst.env === "live" ? "#e8f5e9" : "#fff3e0",
                          color: inst.env === "live" ? "#2e7d32" : "#e65100",
                          "& .MuiChip-label": { px: 1 },
                        }}
                      />
                    </Tooltip>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "rgba(0,0,0,0.5)", lineHeight: 1.5, mt: 0.25 }}>
                    {inst.desc}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </DialogContent>
      </Dialog>

    </Box>
  );
}
