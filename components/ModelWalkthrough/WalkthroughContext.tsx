"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface WalkthroughState {
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  open: () => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  goToStep: (step: number) => void;
}

const TOTAL_STEPS = 7;

const WalkthroughContext = createContext<WalkthroughState | null>(null);

export function WalkthroughProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const open = useCallback(() => {
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const next = useCallback(() => {
    setCurrentStep((s) => (s < TOTAL_STEPS - 1 ? s + 1 : s));
  }, []);

  const prev = useCallback(() => {
    setCurrentStep((s) => (s > 0 ? s - 1 : s));
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOTAL_STEPS) setCurrentStep(step);
  }, []);

  return (
    <WalkthroughContext value={{ isOpen, currentStep, totalSteps: TOTAL_STEPS, open, close, next, prev, goToStep }}>
      {children}
    </WalkthroughContext>
  );
}

export function useWalkthrough() {
  const ctx = useContext(WalkthroughContext);
  if (!ctx) throw new Error("useWalkthrough must be used within WalkthroughProvider");
  return ctx;
}
