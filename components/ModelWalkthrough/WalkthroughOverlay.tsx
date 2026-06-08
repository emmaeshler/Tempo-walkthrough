"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useWalkthrough } from "./WalkthroughContext";
import { STEPS } from "./steps";

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function WalkthroughOverlay() {
  const { isOpen, currentStep, totalSteps, close, next, prev, goToStep } = useWalkthrough();
  const router = useRouter();
  const pathname = usePathname();
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const rafRef = useRef<number>(0);

  const step = STEPS[currentStep];
  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

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
    if (!isOpen) {
      window.dispatchEvent(new CustomEvent("tour-step", { detail: null }));
      return;
    }
    setDetailOpen(false);
    window.dispatchEvent(new CustomEvent("tour-step", { detail: { step: currentStep, action: step.action } }));

    if (step.page !== pathname) {
      setNavigating(true);
      const url = step.page.includes("?") ? `${step.page}&tour=1` : `${step.page}?tour=1`;
      router.push(url);
    } else {
      setNavigating(false);
      const t1 = setTimeout(measureTarget, 250);
      const t2 = setTimeout(measureTarget, 600);
      const t3 = setTimeout(measureTarget, 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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
      const t3 = setTimeout(measureTarget, 1500);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
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

  const INTRO_W = 520;
  const SPOT_W = 420;
  const GAP = 20;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  let cardStyle: Record<string, unknown>;

  if (!spotlight) {
    cardStyle = {
      position: "fixed" as const,
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: INTRO_W,
    };
  } else {
    const wideTarget = spotlight.width > vw * 0.5;
    let top: number;
    let left: number;

    if (wideTarget) {
      top = spotlight.top + GAP;
      left = vw - SPOT_W - GAP - 40;
    } else {
      const targetCenterX = spotlight.left + spotlight.width / 2;
      const onLeft = targetCenterX < vw / 2;
      if (onLeft) {
        left = spotlight.left + spotlight.width + GAP;
      } else {
        left = spotlight.left - SPOT_W - GAP;
      }
      top = spotlight.top;
    }

    top = Math.max(GAP, Math.min(top, vh - 480));
    left = Math.max(GAP, Math.min(left, vw - SPOT_W - GAP));

    cardStyle = {
      position: "fixed" as const,
      top,
      left,
      width: SPOT_W,
    };
  }

  return (
    <>
      {/* Dark overlay with spotlight hole */}
      <Box
        onClick={close}
        sx={{
          position: "fixed",
          inset: 0,
          zIndex: 1400,
          pointerEvents: "auto",
        }}
      />

      {spotlight && (
        <Box
          sx={{
            position: "fixed",
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            borderRadius: "8px",
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 3px #D97C14, 0 0 24px rgba(217,124,20,0.4)",
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

      {/* Annotation card */}
      <Box
        key={currentStep}
        onClick={(e) => e.stopPropagation()}
        sx={{
          ...cardStyle,
          zIndex: 1402,
          bgcolor: "white",
          borderRadius: "12px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
          overflow: "hidden",
          animation: "tourCardIn 0.3s ease",
          "@keyframes tourCardIn": {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
        }}
      >
        {/* Close button */}
        <IconButton
          onClick={close}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1,
            color: "rgba(0,0,0,0.35)",
            bgcolor: "rgba(255,255,255,0.9)",
            "&:hover": { color: "rgba(0,0,0,0.6)", bgcolor: "white" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>

        {/* Visual — the hero of each step */}
        <Box
          sx={{
            bgcolor: "#f8fafb",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            px: 3,
            py: 3,
            "& svg": { width: "100%", height: "auto", display: "block" },
          }}
        >
          <step.Visual />
        </Box>

        {/* Text content */}
        <Box sx={{ px: 3.5, pt: 2.5, pb: 2 }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "#D97C14",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 0.75,
            }}
          >
            Step {currentStep + 1} of {totalSteps}
          </Typography>
          <Typography
            sx={{
              fontSize: 20,
              fontWeight: 700,
              color: "#00446a",
              fontFamily: "Inter, sans-serif",
              mb: 1,
              lineHeight: 1.3,
            }}
          >
            {step.title}
          </Typography>
          <Typography
            sx={{
              fontSize: 15,
              color: "rgba(0,0,0,0.45)",
              lineHeight: 1.6,
            }}
          >
            {step.caption}
          </Typography>

          {/* Expandable detail */}
          <Box
            onClick={() => setDetailOpen(!detailOpen)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mt: 1,
              cursor: "pointer",
              color: "rgba(0,0,0,0.35)",
              "&:hover": { color: "rgba(0,0,0,0.25)" },
              transition: "color 0.15s",
            }}
          >
            <ExpandMoreIcon
              sx={{
                fontSize: 16,
                transition: "transform 0.2s",
                transform: detailOpen ? "rotate(180deg)" : "rotate(0)",
              }}
            />
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
              {detailOpen ? "Less" : "More detail"}
            </Typography>
          </Box>
          {detailOpen && (
            <Typography
              sx={{
                fontSize: 14,
                color: "rgba(0,0,0,0.5)",
                lineHeight: 1.7,
                mt: 0.75,
                pl: 0.5,
                borderLeft: "2px solid rgba(0,0,0,0.08)",
                animation: "detailIn 0.2s ease",
                "@keyframes detailIn": {
                  from: { opacity: 0, maxHeight: 0 },
                  to: { opacity: 1, maxHeight: 200 },
                },
              }}
            >
              {step.detail}
            </Typography>
          )}
        </Box>

        {/* Footer: dots + nav */}
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
            {!isFirst && (
              <Button
                onClick={prev}
                size="small"
                sx={{
                  color: "#00446a",
                  fontWeight: 600,
                  fontSize: 14,
                  textTransform: "none",
                  minWidth: 0,
                  px: 1.5,
                }}
              >
                Back
              </Button>
            )}
            <Button
              onClick={isLast ? close : next}
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
                "&:hover": {
                  bgcolor: isLast ? "#1b5e20" : "#003050",
                  boxShadow: "none",
                },
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
