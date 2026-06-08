"use client";

import { createContext, useContext, useState, useCallback } from "react";

const TOTAL_STEPS = 9;

interface TempoTourCtx {
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  open: () => void;
  close: () => void;
  next: () => void;
  prev: () => void;
  goToStep: (s: number) => void;
}

const Ctx = createContext<TempoTourCtx>({
  isOpen: false,
  currentStep: 0,
  totalSteps: TOTAL_STEPS,
  open: () => {},
  close: () => {},
  next: () => {},
  prev: () => {},
  goToStep: () => {},
});

export function TempoTourProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const open = useCallback(() => {
    setCurrentStep(0);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const next = useCallback(() => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)), []);
  const prev = useCallback(() => setCurrentStep((s) => Math.max(s - 1, 0)), []);
  const goToStep = useCallback((s: number) => setCurrentStep(s), []);

  return (
    <Ctx value={{ isOpen, currentStep, totalSteps: TOTAL_STEPS, open, close, next, prev, goToStep }}>
      {children}
    </Ctx>
  );
}

export function useTempoTour() {
  return useContext(Ctx);
}
