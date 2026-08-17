"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import CloseIcon from "@mui/icons-material/Close";
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
  const [subStep, setSubStep] = useState(0);
  const [navigating, setNavigating] = useState(false);
  const rafRef = useRef<number>(0);

  const step = STEPS[currentStep];
  const isLast = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;
  const hasSubs = step?.subs.length > 1;
  const activeSub = step?.subs[subStep] ?? step?.subs[0];

  const activeTarget = activeSub?.target ?? step?.target;

  const measureTarget = useCallback(() => {
    if (!activeTarget) {
      setSpotlight(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${activeTarget}"]`);
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
  }, [activeTarget]);

  useEffect(() => {
    setSubStep(0);
  }, [currentStep]);

  useEffect(() => {
    if (!isOpen || navigating) return;
    const t1 = setTimeout(measureTarget, 100);
    const t2 = setTimeout(measureTarget, 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [subStep, isOpen, navigating, measureTarget]);

  useEffect(() => {
    if (!isOpen) {
      window.dispatchEvent(new CustomEvent("tour-step", { detail: null }));
      return;
    }
    window.dispatchEvent(
      new CustomEvent("tour-step", { detail: { step: currentStep, action: step.action } })
    );
  }, [currentStep, isOpen, step]);

  useEffect(() => {
    if (!isOpen) return;

    if (step.page !== pathname) {
      setNavigating(true);
      const url = step.page.includes("?") ? `${step.page}&tour=1` : `${step.page}?tour=1`;
      router.push(url);
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

  const CARD_W = 540;
  const GAP = 20;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  let cardStyle: Record<string, unknown>;

  if (!spotlight && (step.action === "open-mass-action" || activeSub?.action === "open-mass-action")) {
    cardStyle = { position: "fixed" as const, top: GAP, right: GAP, width: CARD_W };
  } else if (!spotlight) {
    cardStyle = { position: "fixed" as const, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 620 };
  } else {
    const wideTarget = spotlight.width > vw * 0.5;
    let top: number;
    let left: number;

    if (wideTarget && activeTarget === "kpi-cards") {
      top = spotlight.top + spotlight.height + GAP;
      left = vw / 2 - CARD_W / 2;
    } else if (wideTarget) {
      top = activeTarget === "data-table" ? GAP : spotlight.top + GAP;
      left = activeTarget === "data-table" ? GAP : vw - CARD_W - GAP - 40;
    } else {
      const targetCenterX = spotlight.left + spotlight.width / 2;
      const onLeft = targetCenterX < vw / 2;
      left = onLeft ? spotlight.left + spotlight.width + GAP : spotlight.left - CARD_W - GAP;
      top = spotlight.top;
    }

    if (activeSub?.Visual) top = GAP;
    top = Math.max(GAP, Math.min(top, vh - 480));
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
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55), 0 0 0 3px #D97C14, 0 0 24px rgba(217,124,20,0.4)",
            zIndex: 1401,
            pointerEvents: "none",
            transition: "all 0.35s ease",
          }}
        />
      )}

      {!spotlight && (
        <Box sx={{ position: "fixed", inset: 0, bgcolor: "rgba(0,0,0,0.55)", zIndex: 1401, pointerEvents: "none" }} />
      )}

      {/* Card */}
      <Box
        key={`${currentStep}-${subStep}`}
        onClick={(e) => e.stopPropagation()}
        sx={{
          ...cardStyle,
          zIndex: 1500,
          bgcolor: "white",
          borderRadius: "12px",
          boxShadow: "0 12px 48px rgba(0,0,0,0.25)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100vh - 40px)",
          animation: "wtCardIn 0.3s ease",
          "@keyframes wtCardIn": { from: { opacity: 0 }, to: { opacity: 1 } },
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

        {/* Colored header */}
        <Box sx={{ bgcolor: step.color, px: 4, py: 3, display: "flex", alignItems: "center", gap: 2.5, flexShrink: 0 }}>
          <Box component="img" src="/tempo-logo-white.png" alt="Tempo" sx={{ height: 36, width: "auto", flexShrink: 0 }} />
          <Box>
            <Typography
              sx={{
                fontSize: 13,
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
                fontSize: 24,
                fontWeight: 700,
                color: "white",
                fontFamily: "Inter, sans-serif",
                lineHeight: 1.3,
              }}
            >
              {activeSub?.title ?? step.title}
            </Typography>
          </Box>
        </Box>

        {/* Body */}
        <Box sx={{ px: 4, pt: 3, pb: 2.5, overflowY: "auto", flexShrink: 1, minHeight: 0 }}>
          {/* Sub-step chips — only for parallel views (no per-sub targets) */}
          {hasSubs && !step.subs.some(s => s.target) && (
            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {step.subs.map((sub, i) => (
                <Chip
                  key={i}
                  label={sub.label}
                  size="small"
                  onClick={() => {
                    setSubStep(i);
                    if (sub.action) {
                      window.dispatchEvent(new CustomEvent("tour-step", {
                        detail: { step: currentStep, action: sub.action },
                      }));
                    }
                  }}
                  sx={{
                    fontSize: 12,
                    fontWeight: 600,
                    bgcolor: subStep === i ? step.color : "rgba(0,0,0,0.06)",
                    color: subStep === i ? "white" : "rgba(0,0,0,0.6)",
                    "&:hover": { bgcolor: subStep === i ? step.color : "rgba(0,0,0,0.1)" },
                  }}
                />
              ))}
            </Box>
          )}

          {/* Model diagram visual */}
          {activeSub?.Visual && (
            <Box
              sx={{
                bgcolor: "#f8fafb",
                borderRadius: "8px",
                border: "1px solid rgba(0,0,0,0.06)",
                px: 1.5,
                py: 1.5,
                mb: 1.5,
                "& svg": { width: "100%", height: "auto", display: "block" },
              }}
            >
              <activeSub.Visual />
            </Box>
          )}

          <Box component="ul" sx={{ m: 0, pl: 2.5, listStyle: "none", "& li": { position: "relative", pl: 2, mb: 1.5, "&::before": { content: "'•'", position: "absolute", left: 0, color: step.color, fontWeight: 700, fontSize: 18 } } }}>
            {activeSub?.caption.split("\n").map((line, i) => {
              const parts = line.split(/\*\*(.*?)\*\*/g);
              return (
                <Typography key={i} component="li" sx={{ fontSize: 16, color: "rgba(0,0,0,0.55)", lineHeight: 1.7 }}>
                  {parts.map((part, j) =>
                    j % 2 === 1
                      ? <Box key={j} component="span" sx={{ fontWeight: 700, color: "#00446a" }}>{part}</Box>
                      : <span key={j}>{part}</span>
                  )}
                </Typography>
              );
            })}
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 4,
            py: 2.5,
            borderTop: "1px solid rgba(0,0,0,0.06)",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", gap: 1 }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <Box
                key={i}
                onClick={() => goToStep(i)}
                sx={{
                  width: i === currentStep ? 24 : 12,
                  height: 12,
                  borderRadius: "5px",
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
                  if (hasSubs && subStep > 0) {
                    const newSub = subStep - 1;
                    setSubStep(newSub);
                    if (step.subs[newSub]?.action) {
                      window.dispatchEvent(new CustomEvent("tour-step", {
                        detail: { step: currentStep, action: step.subs[newSub].action },
                      }));
                    }
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
                if (hasSubs && subStep < step.subs.length - 1) {
                  const newSub = subStep + 1;
                  setSubStep(newSub);
                  if (step.subs[newSub]?.action) {
                    window.dispatchEvent(new CustomEvent("tour-step", {
                      detail: { step: currentStep, action: step.subs[newSub].action },
                    }));
                  }
                } else if (isLast) {
                  close();
                } else {
                  next();
                }
              }}
              variant="contained"
              size="small"
              sx={{
                bgcolor: isLast && subStep === step.subs.length - 1 ? "#2e7d32" : "#00446a",
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                textTransform: "none",
                px: 3,
                py: 1,
                borderRadius: "6px",
                boxShadow: "none",
                "&:hover": { bgcolor: isLast && subStep === step.subs.length - 1 ? "#1b5e20" : "#003050", boxShadow: "none" },
              }}
            >
              {isLast && subStep === step.subs.length - 1 ? "Done" : "Next"}
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
