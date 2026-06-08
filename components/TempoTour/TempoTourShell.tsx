"use client";

import { TempoTourProvider } from "./TempoTourContext";
import TempoTourOverlay from "./TempoTourOverlay";

export default function TempoTourShell({ children }: { children: React.ReactNode }) {
  return (
    <TempoTourProvider>
      {children}
      <TempoTourOverlay />
    </TempoTourProvider>
  );
}
