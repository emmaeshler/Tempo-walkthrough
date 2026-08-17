"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
import { useTempoTour } from "./TempoTourContext";

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface Step {
  page: string;
  target?: string;
  action?: string;
  icon: string;
  color: string;
  title: string;
  caption: string;
  detail: string;
}

const STEPS: Step[] = [
  {
    page: "/price-review",
    target: "tempo-full-page",
    icon: "🏠",
    color: "#00446a",
    title: "This is Tempo",
    caption:
      "A turnkey pricing platform that gives decision-makers everything they need to review, adjust, and act on pricing recommendations — configured for your business in weeks, not months.",
    detail:
      "Tempo is industry-agnostic. The same platform powers pricing reviews for professional services, manufacturing, distribution, SaaS, and more. What changes is the data — Tempo molds to it.",
  },
  {
    page: "/price-review",
    target: "data-table",
    icon: "📋",
    color: "#0F6E56",
    title: "Every Row is a Review Unit",
    caption:
      "Each row is a \"review unit\" — a combination of attributes from your data that uniquely identifies something you need to price. This is what makes Tempo flexible: you define the review unit, and the entire platform — columns, KPIs, model inputs, recommendations — reshapes around it.",
    detail:
      "In this instance the review unit is an engagement: Client + Project + Service Line. In another instance it might be Customer + Product + Region, or SKU + Plant + Channel. Tempo adapts to your business, not the other way around.",
  },
  {
    page: "/price-review",
    target: "revised-columns",
    action: "scroll-to-revised",
    icon: "✏️",
    color: "#0F6E56",
    title: "Review & Revise",
    caption:
      "Reviewers accept, adjust, or override each recommendation — then mark it complete or submit it for approval. The blue columns are the reviewer's workspace.",
    detail:
      "The model gives every engagement a starting point. Reviewers can accept as-is, revise based on their judgment, or override entirely. Once finalized, they mark it complete — or, if an approval workflow is configured, submit through the defined approval chain.",
  },
  {
    page: "/price-review",
    target: undefined,
    action: "open-mass-action",
    icon: "⚡",
    color: "#D97C14",
    title: "Mass Actions at Scale",
    caption:
      "When hundreds of rows need the same effective date or a consistent price adjustment, Mass Actions let you apply changes across your entire book in seconds — not hours. Select a segment, choose the action, review the impact, and submit.",
    detail:
      "Without this, pricing teams spend days copying values row by row or managing fragile spreadsheet macros. Mass Actions eliminate that manual work while keeping guardrails in place — validation errors surface before anything is committed, and approval workflows still apply.",
  },
  {
    page: "/price-review",
    target: "data-layout-panel",
    action: "open-data-layout",
    icon: "🗂️",
    color: "#00446a",
    title: "Organize Your Way",
    caption:
      "You can organize your data any way you want to get to pricing segmentation that makes sense for your business. Drill down by service line, region, partner, product — whatever hierarchy matters to your review process.",
    detail:
      "Permissions are configurable per user and per hierarchy level. A partner sees their clients; a practice leader sees the full service line; firm leadership sees the entire book. Filter to any level and the KPIs, table, and recommendations all update instantly.",
  },
  {
    page: "/price-review",
    target: "kpi-cards",
    icon: "📊",
    color: "#D97C14",
    title: "KPIs That Move With You",
    caption:
      "These metrics summarize your entire book at a glance — review progress, impact, average increases. Filter by partner or service line and every number recalculates instantly.",
    detail:
      "KPIs are configured per instance. This demo shows pricing-focused metrics, but Tempo can surface margin, volume, utilization, or any metric that matters to your review process.",
  },
  {
    page: "/price-review",
    target: "drawer",
    action: "open-drawer-engagement-details",
    icon: "📈",
    color: "#00446a",
    title: "Decision Support",
    caption:
      "Select any engagement and get the context you need to act — price history, fee trends, and recommendation history, all attached to the row. No digging through spreadsheets.",
    detail:
      "Every engagement opens a support panel with historical pricing data, fee breakdowns, and recommendation trends. The data is right there when you need to make a decision — before any AI enters the picture.",
  },
  {
    page: "/price-review",
    target: "drawer",
    action: "open-drawer-explain-price",
    icon: "🤖",
    color: "#0F6E56",
    title: "AI Where It Matters",
    caption:
      "On top of the data, AI layers on narrative explanations and interactive analytics — so reviewers understand the 'why,' not just the 'what.' Margin gaps, peer benchmarks, product complexity — surfaced automatically.",
    detail:
      "\"Explain the Price\" generates a plain-language breakdown of pricing drivers. \"AI Analytics\" lets you ask questions and explore scenarios in natural language. These AI features augment the data views — they don't replace them.",
  },
  {
    page: "/price-review",
    icon: "⚡",
    color: "#00446a",
    title: "Weeks, Not Months",
    caption:
      "Everything you just saw — the review table, KPIs, data layouts, and AI explanations — is configured for your business in weeks. No data templates required. Tempo connects to your existing data and molds around it.",
    detail:
      "Most implementations are live within 4–6 weeks. Your data stays in your systems — Tempo connects via API. Configurable permissions mean you can roll out to one team first and expand from there.",
  },
];

export default function TempoTourOverlay() {
  const { isOpen, currentStep, totalSteps, close, next, prev, goToStep } = useTempoTour();
  const router = useRouter();
  const pathname = usePathname();
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [navigating, setNavigating] = useState(false);
  const [subStep, setSubStep] = useState(0);
  const rafRef = useRef<number>(0);

  const step = STEPS[currentStep];
  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  const isDecisionSupport = step?.action === "open-drawer-engagement-details";
  const decisionSupportSubs = [
    {
      caption: "Every review unit carries its own profile — engagement details, key contacts, historical context, and scope attributes. Everything a reviewer needs to understand the relationship before making a pricing decision.",
      subLabel: "Engagement Details",
    },
    { caption: step?.caption, subLabel: "Price History" },
  ];
  const activeCaption = isDecisionSupport ? decisionSupportSubs[subStep]?.caption : step?.caption;

  const measureTarget = useCallback(() => {
    if (!step?.target) {
      setSpotlight(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${step.target}"]`);
    if (!el) {
      setSpotlight(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const pad = 10;
    setSpotlight({
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    });
  }, [step]);

  useEffect(() => {
    setSubStep(0);
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen) {
      window.dispatchEvent(new CustomEvent("tempo-tour-step", { detail: null }));
      return;
    }
    window.dispatchEvent(
      new CustomEvent("tempo-tour-step", { detail: { step: currentStep, action: step.action } })
    );

    if (step.page !== pathname) {
      setNavigating(true);
      router.push(step.page);
    } else {
      setNavigating(false);
      const t1 = setTimeout(measureTarget, 250);
      const t2 = setTimeout(measureTarget, 600);
      const t3 = setTimeout(measureTarget, 1200);
      const t4 = setTimeout(measureTarget, 2000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
    }
  }, [currentStep, isOpen, step, pathname, router, measureTarget]);

  useEffect(() => {
    if (!isOpen || navigating) return;
    const t = setTimeout(measureTarget, 200);
    return () => clearTimeout(t);
  }, [pathname, isOpen, navigating, measureTarget]);

  useEffect(() => {
    if (!isOpen) return;
    if (step.page === pathname && navigating) {
      setNavigating(false);
      const t1 = setTimeout(measureTarget, 300);
      const t2 = setTimeout(measureTarget, 800);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [pathname, isOpen, navigating, step, measureTarget]);

  useEffect(() => {
    if (!isOpen || !spotlight) return;
    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measureTarget);
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, spotlight, measureTarget]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "Enter") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, close, next, prev]);

  if (!isOpen) return null;

  const CARD_W = 420;
  const GAP = 20;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  let cardStyle: Record<string, unknown>;

  if (!spotlight && step.action === "open-mass-action") {
    cardStyle = {
      position: "fixed" as const,
      top: GAP,
      right: GAP,
      width: CARD_W,
    };
  } else if (!spotlight) {
    cardStyle = {
      position: "fixed" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 520,
    };
  } else {
    const wideTarget = spotlight.width > vw * 0.5;
    let top: number;
    let left: number;

    if (wideTarget && step.target === "kpi-cards") {
      top = spotlight.top + spotlight.height + GAP;
      left = vw / 2 - CARD_W / 2;
    } else if (wideTarget) {
      top = spotlight.top + GAP;
      left = currentStep === 1 ? GAP : vw - CARD_W - GAP - 40;
    } else {
      const targetCenterX = spotlight.left + spotlight.width / 2;
      const onLeft = targetCenterX < vw / 2;
      if (onLeft) {
        left = spotlight.left + spotlight.width + GAP;
      } else {
        left = spotlight.left - CARD_W - GAP;
      }
      top = spotlight.top;
    }

    top = Math.max(GAP, Math.min(top, vh - 400));
    left = Math.max(GAP, Math.min(left, vw - CARD_W - GAP));

    cardStyle = { position: "fixed" as const, top, left, width: CARD_W };
  }

  return (
    <>
      <Box onClick={close} sx={{ position: "fixed", inset: 0, zIndex: 1400, pointerEvents: "auto" }} />

      {spotlight && (
        <Box
          sx={{
            position: "fixed",
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            borderRadius: "8px",
            boxShadow:
              "0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 3px #D97C14, 0 0 24px rgba(217,124,20,0.4)",
            zIndex: 1401,
            pointerEvents: "none",
            transition: "all 0.35s ease",
          }}
        />
      )}

      {!spotlight && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.55)",
            zIndex: 1401,
            pointerEvents: "none",
          }}
        />
      )}

      {/* Card */}
      <Box
        key={currentStep}
        onClick={(e) => e.stopPropagation()}
        sx={{
          ...cardStyle,
          zIndex: 1500,
          bgcolor: "white",
          borderRadius: "12px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
          overflow: "hidden",
          animation: "tempoCardIn 0.3s ease",
          "@keyframes tempoCardIn": { from: { opacity: 0 }, to: { opacity: 1 } },
        }}
      >
        <IconButton
          onClick={close}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            color: "rgba(255,255,255,0.6)",
            "&:hover": { color: "white" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* Visual header */}
        <Box
          sx={{
            bgcolor: step.color,
            px: 3,
            py: 2.5,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography sx={{ fontSize: 36 }}>{step.icon}</Typography>
          <Box>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                mb: 0.25,
              }}
            >
              Step {currentStep + 1} of {totalSteps}
            </Typography>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "white",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.3,
              }}
            >
              {step.title}
            </Typography>
          </Box>
        </Box>

        {/* Text */}
        <Box sx={{ px: 3.5, pt: 2.5, pb: 2 }}>
          {isDecisionSupport && (
            <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
              {decisionSupportSubs.map((sub, i) => (
                <Chip
                  key={i}
                  label={sub.subLabel}
                  size="small"
                  onClick={() => {
                    setSubStep(i);
                    window.dispatchEvent(new CustomEvent("tempo-tour-step", {
                      detail: { step: currentStep, action: i === 0 ? "open-drawer-engagement-details" : "open-drawer-price-history" },
                    }));
                  }}
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    bgcolor: subStep === i ? "#00446a" : "rgba(0,0,0,0.06)",
                    color: subStep === i ? "white" : "rgba(0,0,0,0.6)",
                    "&:hover": { bgcolor: subStep === i ? "#003050" : "rgba(0,0,0,0.1)" },
                  }}
                />
              ))}
            </Box>
          )}
          <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.6)", lineHeight: 1.7 }}>
            {activeCaption}
          </Typography>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3.5,
            py: 2,
            borderTop: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <Box
                key={i}
                onClick={() => goToStep(i)}
                sx={{
                  width: i === currentStep ? 22 : 10,
                  height: 10,
                  borderRadius: "4px",
                  bgcolor: i === currentStep ? "#D97C14" : i < currentStep ? "#00446a" : "#ddd",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  "&:hover": { bgcolor: i === currentStep ? "#D97C14" : "#999" },
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            {!(isFirst && subStep === 0) && (
              <Button
                onClick={() => {
                  if (isDecisionSupport && subStep > 0) {
                    setSubStep(0);
                    window.dispatchEvent(new CustomEvent("tempo-tour-step", { detail: { step: currentStep, action: "open-drawer-engagement-details" } }));
                  } else {
                    prev();
                  }
                }}
                size="small"
                sx={{ color: "#00446a", fontWeight: 600, fontSize: 14, textTransform: "none", minWidth: 0, px: 1.5 }}
              >
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (isDecisionSupport && subStep < decisionSupportSubs.length - 1) {
                  setSubStep(subStep + 1);
                  window.dispatchEvent(new CustomEvent("tempo-tour-step", { detail: { step: currentStep, action: "open-drawer-price-history" } }));
                } else if (isLast) {
                  close();
                } else {
                  next();
                }
              }}
              variant="contained"
              size="small"
              sx={{
                bgcolor: isLast ? "#2e7d32" : "#00446a",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: "6px",
                boxShadow: "none",
                "&:hover": { bgcolor: isLast ? "#1b5e20" : "#003050", boxShadow: "none" },
              }}
            >
              {isLast ? "Done" : "Next"}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
