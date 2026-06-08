"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";

/* ── 1. The Problem ── */
function VisualProblem() {
  const market = "M55 130 C95 95,140 55,180 65 S240 110,270 82 S320 30,360 40 S410 62,430 50";
  const staticY = 100;
  const gapFill = `M55 ${staticY} C95 95,140 55,180 65 S240 110,270 82 S320 30,360 40 S410 62,430 50 L430 ${staticY} Z`;
  return (
    <svg viewBox="0 0 470 195">
      {/* Y-axis */}
      <line x1="50" y1="10" x2="50" y2="160" stroke="#e0e0e0" strokeWidth="1" />
      <text x="15" y="90" fontSize="10" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontWeight="500" transform="rotate(-90,15,90)">Price</text>
      {/* X-axis */}
      <line x1="50" y1="160" x2="445" y2="160" stroke="#e0e0e0" strokeWidth="1" />
      <text x="248" y="175" fontSize="10" fill="rgba(0,0,0,0.4)" textAnchor="middle" fontWeight="500">Time</text>

      {/* Gap fill — the hero */}
      <path d={gapFill} fill="#c62828" opacity="0.1" />

      {/* Market line */}
      <path d={market} fill="none" stroke={P} strokeWidth="3" />
      {[[55,130],[120,72],[180,65],[240,100],[270,82],[320,30],[360,40],[410,56],[430,50]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" fill={P} />
      ))}

      {/* Static price line */}
      <line x1="55" y1={staticY} x2="430" y2={staticY} stroke="#c62828" strokeWidth="3" strokeDasharray="8 5" />

      {/* Gap callout */}
      <line x1="360" y1="40" x2="360" y2={staticY} stroke="#c62828" strokeWidth="1.5" />
      <line x1="354" y1="40" x2="366" y2="40" stroke="#c62828" strokeWidth="1.5" />
      <line x1="354" y1={staticY} x2="366" y2={staticY} stroke="#c62828" strokeWidth="1.5" />
      <text x="382" y="65" fontSize="11" fill="#c62828" fontWeight="600">Lost</text>
      <text x="382" y="78" fontSize="11" fill="#c62828" fontWeight="600">value</text>

      {/* Legend — compact, inline */}
      <line x1="130" y1="188" x2="150" y2="188" stroke={P} strokeWidth="3" />
      <text x="155" y="192" fontSize="9" fill="rgba(0,0,0,0.5)">Market price</text>
      <line x1="260" y1="188" x2="280" y2="188" stroke="#c62828" strokeWidth="2.5" strokeDasharray="5 3" />
      <text x="285" y="192" fontSize="9" fill="rgba(0,0,0,0.5)">Your static price</text>
    </svg>
  );
}

/* ── 2. How the Model Comes Together ── */
function VisualModelBuilding() {
  const sources = [
    { y: 5, label: "Client Data", sub: "Transaction history", color: P },
    { y: 55, label: "Market Signals", sub: "Competitive + demand", color: O },
    { y: 105, label: "I2P Expertise", sub: "What to look for", color: G },
  ];
  return (
    <svg viewBox="0 0 340 160">
      {sources.map((s, i) => (
        <g key={i}>
          <rect x="5" y={s.y} width="125" height="40" rx="6" fill="white" stroke={s.color} strokeWidth="2" />
          <text x="67" y={s.y + 17} fontSize="10" fill={s.color} textAnchor="middle" fontWeight="600">{s.label}</text>
          <text x="67" y={s.y + 31} fontSize="8" fill="rgba(0,0,0,0.4)" textAnchor="middle">{s.sub}</text>
          <line x1="130" y1={s.y + 20} x2="195" y2="78" stroke={s.color} strokeWidth="2" />
        </g>
      ))}
      <rect x="195" y="50" width="135" height="56" rx="10" fill={P} />
      <text x="262" y="73" fontSize="13" fill="white" textAnchor="middle" fontWeight="700">ML Model</text>
      <text x="262" y="90" fontSize="9" fill="rgba(255,255,255,0.7)" textAnchor="middle">Deterministic Pricing</text>
    </svg>
  );
}

/* ── 3. Why ML vs Gen AI ── */
function VisualMLvsGenAI() {
  const checks = ["Deterministic", "Transaction history", "Feedback loops", "Industry context"];
  const crosses = ["Probabilistic", "No history", "No feedback", "Generic only"];
  return (
    <svg viewBox="0 0 310 140">
      <rect x="10" y="4" width="130" height="24" rx="5" fill={P} />
      <text x="75" y="20" fontSize="10" fill="white" textAnchor="middle" fontWeight="700">Machine Learning</text>
      <rect x="170" y="4" width="130" height="24" rx="5" fill="#9e9e9e" />
      <text x="235" y="20" fontSize="10" fill="white" textAnchor="middle" fontWeight="700">Gen AI</text>
      {checks.map((t, i) => (
        <g key={`c${i}`}>
          <circle cx="24" cy={46 + i * 24} r="8" fill="#e8f5e9" />
          <text x="24" y={50 + i * 24} fontSize="12" fill={G} textAnchor="middle">&#x2713;</text>
          <text x="38" y={50 + i * 24} fontSize="10" fill="rgba(0,0,0,0.7)">{t}</text>
        </g>
      ))}
      {crosses.map((t, i) => (
        <g key={`x${i}`}>
          <circle cx="184" cy={46 + i * 24} r="8" fill="#ffebee" />
          <text x="184" y={50 + i * 24} fontSize="12" fill="#c62828" textAnchor="middle">&#x2717;</text>
          <text x="198" y={50 + i * 24} fontSize="10" fill="rgba(0,0,0,0.7)">{t}</text>
        </g>
      ))}
      <line x1="155" y1="8" x2="155" y2="132" stroke="#e0e0e0" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

/* ── 4. The Model Running — scatter plot showing differentiation ── */
function VisualModelRunning() {
  const pts: [number, number][] = [
    [35, 95], [48, 88], [62, 92], [78, 75], [93, 80], [108, 68],
    [125, 72], [140, 60], [158, 64], [175, 52], [190, 56], [208, 45],
    [225, 48], [242, 38], [258, 42], [275, 32],
  ];
  return (
    <svg viewBox="0 0 310 130">
      <line x1="25" y1="110" x2="290" y2="110" stroke="#ddd" strokeWidth="1" />
      <line x1="25" y1="15" x2="25" y2="110" stroke="#ddd" strokeWidth="1" />
      <text x="160" y="126" fontSize="8" fill="rgba(0,0,0,0.35)" textAnchor="middle">More transactions → better curve</text>
      <text x="10" y="62" fontSize="8" fill="rgba(0,0,0,0.35)" textAnchor="middle" transform="rotate(-90,10,62)">Accuracy</text>

      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={O} opacity={0.5 + (i / pts.length) * 0.4} />
      ))}

      <path d="M35 95 C70 82,110 68,155 58 S220 42,275 32" fill="none" stroke={P} strokeWidth="2.5" strokeLinecap="round" />

      {/* Differentiation callout */}
      <line x1="140" y1="60" x2="140" y2="85" stroke={G} strokeWidth="1" strokeDasharray="3 2" />
      <line x1="175" y1="52" x2="175" y2="85" stroke={G} strokeWidth="1" strokeDasharray="3 2" />
      <text x="157" y="96" fontSize="8" fill={G} textAnchor="middle" fontWeight="500">Differentiated</text>
      <text x="157" y="106" fontSize="7" fill={G} textAnchor="middle">not one-size-fits-all</text>
    </svg>
  );
}

/* ── 5. Complication ── */
function VisualComplication() {
  const stable: [number, number][] = [[35, 85], [55, 75], [75, 80], [100, 65], [125, 68]];
  const shifted: [number, number][] = [[165, 78], [185, 88], [205, 82], [230, 92], [255, 85]];
  return (
    <svg viewBox="0 0 310 120">
      <line x1="25" y1="105" x2="290" y2="105" stroke="#ddd" strokeWidth="1" />
      {stable.map(([x, y], i) => <circle key={`s${i}`} cx={x} cy={y} r="4.5" fill={O} opacity="0.7" />)}
      <path d="M35 85 C65 77,95 68,125 65" fill="none" stroke={P} strokeWidth="2" />

      <line x1="145" y1="10" x2="145" y2="105" stroke="#c62828" strokeWidth="2" strokeDasharray="5 3" />

      {shifted.map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r="4.5" fill="#c62828" opacity="0.6" />)}

      <rect x="195" y="10" width="105" height="28" rx="5" fill="#c62828" />
      <text x="247" y="23" fontSize="9" fill="white" textAnchor="middle" fontWeight="600">&#9888; Signal Detected</text>
      <text x="247" y="33" fontSize="7" fill="rgba(255,255,255,0.8)" textAnchor="middle">Win rate, competitors, supply</text>
    </svg>
  );
}

/* ── 6. Lesson + Opportunity — feedback loop ── */
function VisualFeedbackLoop() {
  const cx = 150, cy = 65, r = 48;
  const nodes = [
    { angle: -90, label: "Detect", color: "#c62828" },
    { angle: 0, label: "Analyze", color: O },
    { angle: 90, label: "Retrain", color: P },
    { angle: 180, label: "Deploy", color: G },
  ];
  return (
    <svg viewBox="0 0 310 140">
      {[0, 1, 2, 3].map((i) => {
        const a1 = (-90 + i * 90 + 12) * Math.PI / 180;
        const a2 = (-90 + i * 90 + 68) * Math.PI / 180;
        return (
          <path key={i}
            d={`M${cx + r * Math.cos(a1)} ${cy + r * Math.sin(a1)} A${r} ${r} 0 0 1 ${cx + r * Math.cos(a2)} ${cy + r * Math.sin(a2)}`}
            fill="none" stroke={nodes[i].color} strokeWidth="2.5" markerEnd="url(#la)" />
        );
      })}
      {nodes.map((n, i) => {
        const rad = n.angle * Math.PI / 180;
        const nx = cx + r * Math.cos(rad), ny = cy + r * Math.sin(rad);
        return (
          <g key={i}>
            <circle cx={nx} cy={ny} r="22" fill="white" stroke={n.color} strokeWidth="2" />
            <text x={nx} y={ny + 4} fontSize="9" fill={n.color} textAnchor="middle" fontWeight="600">{n.label}</text>
          </g>
        );
      })}
      <text x={cx} y={cy + 3} fontSize="8" fill="rgba(0,0,0,0.25)" textAnchor="middle">Gets smarter</text>
      <defs>
        <marker id="la" markerWidth="7" markerHeight="5" refX="7" refY="2.5" orient="auto">
          <polygon points="0 0,7 2.5,0 5" fill={P} />
        </marker>
      </defs>
    </svg>
  );
}

/* ── 7. Improved Recommendation ── */
function VisualImprovedRec() {
  const pts: [number, number][] = [
    [35, 82], [55, 78], [75, 74], [100, 69], [125, 65], [150, 61],
    [175, 57], [200, 53], [225, 50], [250, 47], [275, 44],
  ];
  return (
    <svg viewBox="0 0 310 120">
      <line x1="25" y1="105" x2="290" y2="105" stroke="#ddd" strokeWidth="1" />
      <line x1="25" y1="15" x2="25" y2="105" stroke="#ddd" strokeWidth="1" />

      <path d="M35 78 C85 70,145 58,200 50 S260 44,275 41 L275 48 C260 50,200 57,145 65 S85 76,35 85 Z" fill={G} opacity="0.08" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4.5" fill={G} opacity="0.65" />)}
      <path d="M35 82 C85 72,145 60,205 52 S265 45,275 43" fill="none" stroke={G} strokeWidth="2.5" strokeLinecap="round" />

      <rect x="195" y="62" width="100" height="26" rx="6" fill={G} />
      <text x="245" y="76" fontSize="9" fill="white" textAnchor="middle" fontWeight="600">&#x2191; Better than before</text>
      <text x="245" y="86" fontSize="7" fill="rgba(255,255,255,0.8)" textAnchor="middle">Ready to approve</text>
    </svg>
  );
}

/* ── Step config — follows the 7 core tenants exactly ── */

export interface TourStep {
  title: string;
  caption: string;
  detail: string;
  page: string;
  target?: string;
  action?: string;
  Visual: () => React.JSX.Element;
}

export const STEPS: TourStep[] = [
  {
    title: "The Problem",
    caption: "No model. Pricing isn't learning or adapting.",
    detail: "Without a model, every engagement is priced on gut feel. There's no feedback loop, no market signal integration — just static pricing that leaves money on the table.",
    page: "/",
    Visual: VisualProblem,
  },
  {
    title: "How the Model Comes Together",
    caption: "Client data + environmental signals → ML. Our expertise shapes what to look for. Their knowledge fills in the gaps.",
    detail: "Three streams converge: client transaction history and environmental market signals are fed into the ML model. INSIGHT2PROFIT's industry expertise determines what to look for, what to challenge, where to start, and what data they're missing. Combined with the client's own knowledge, the model produces recommendations no single source could.",
    page: "/pre-call-plan",
    target: "radar-posture",
    action: "auto-generate",
    Visual: VisualModelBuilding,
  },
  {
    title: "Why ML, Not Gen AI",
    caption: "Deterministic, not probabilistic. ChatGPT doesn't have the transaction history, market feedback loop, or industry context.",
    detail: "This distinction matters. ML produces repeatable, auditable outputs grounded in real transaction data. You can't get this from ChatGPT — it doesn't have the transaction history, the market feedback loop, or the industry context baked in. Every recommendation is traceable back to the data that produced it.",
    page: "/",
    target: "drawer",
    action: "open-drawer-analytics",
    Visual: VisualMLvsGenAI,
  },
  {
    title: "The Model Running",
    caption: "Transactions flow through. More price points, better curve fit. Prices that are predictable but not one-size-fits-all.",
    detail: "Every transaction that flows through the model tightens the fit. The scatter plot tells the story better than a revenue chart — each dot is a real price point, and the curve is the model's learned pricing function. The result is differentiation: prices that are predictable but tailored to each engagement.",
    page: "/",
    target: "drawer",
    action: "open-drawer-price-history",
    Visual: VisualModelRunning,
  },
  {
    title: "Complication",
    caption: "Something changes — win rate shifts, competitor prices drop, supply tightens. The model sees it.",
    detail: "Markets don't sit still. Win rates shift, competitors undercut, supply tightens. The model detects the signal in the data before it becomes a pattern you can't ignore — so you can act while there's still room to maneuver.",
    page: "/",
    target: "drawer",
    action: "open-drawer-explain-complication",
    Visual: VisualComplication,
  },
  {
    title: "Lesson + Opportunity",
    caption: "We identify what happened, why, and what to do. The model trains on itself and gets smarter.",
    detail: "This is where the loop closes. We identify what changed, why it matters, and what to do about it. The training loops back on itself — every outcome, every override, every market shift feeds the next cycle. The model doesn't just react, it learns.",
    page: "/",
    target: "drawer",
    action: "open-drawer-explain-complication",
    Visual: VisualFeedbackLoop,
  },
  {
    title: "Improved Recommendation",
    caption: "Comes back around — better than before, ready to approve.",
    detail: "The model comes back with tighter, smarter recommendations backed by real outcomes. The pre-call strategy is the final output — talking points, objection handling, and service commitments ready for the customer conversation.",
    page: "/",
    target: "drawer",
    action: "open-drawer-rec-history",
    Visual: VisualImprovedRec,
  },
];
