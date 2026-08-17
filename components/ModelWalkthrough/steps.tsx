"use client";

const P = "#00446a";
const O = "#D97C14";
const G = "#2e7d32";
const B = "#1a8fb8";

/* ═══════════════════════════════════════════════════════════════════
   Model Diagram — matches "Core components of the ideal pricing model"
   slide: grouped inputs → nested ML Prediction + Strategic Guidance center.
   ═══════════════════════════════════════════════════════════════════ */

type DiagramHighlight = "all" | "inputs" | "engine" | "outputs" | "feedback";

const DATA_INPUTS = [
  { label: "Internal Data", sub: "Transaction & customer history", color: G, y: 18 },
  { label: "Market Insights", sub: "Market sentiment & macro signals", color: G, y: 60 },
];

const EXPERTISE_INPUTS = [
  { label: "In-House Knowledge", sub: "Business realities & objectives", color: B, y: 118 },
  { label: "Industry Expertise", sub: "Benchmarks, drivers & paradigms", color: B, y: 160 },
];

const ALL_INPUTS = [...DATA_INPUTS, ...EXPERTISE_INPUTS];

function ModelDiagram({ highlight }: { highlight: DiagramHighlight }) {
  const inOp = highlight === "all" || highlight === "inputs" ? 1 : 0.13;
  const engOp = highlight === "all" || highlight === "engine" || highlight === "outputs" || highlight === "feedback" ? 1 : 0.13;
  const connOp = highlight === "all" || highlight === "inputs" || highlight === "engine" ? 0.35 : 0.08;
  const fbOp = highlight === "feedback" ? 0.7 : highlight === "all" ? 0.3 : 0.06;

  const iw = 145, ih = 33;
  const cx = 365, cy = 100, outerR = 72, innerR = 52;

  return (
    <svg viewBox="0 0 460 205">
      {/* Group labels */}
      <g opacity={inOp}>
        <text x="8" y="12" fontSize="7" fill={G} fontWeight="700" letterSpacing="1.2">DATA INPUTS</text>
        <text x="8" y="112" fontSize="7" fill={B} fontWeight="700" letterSpacing="1.2">EXPERTISE INPUTS</text>
      </g>

      {/* Connector lines from inputs to center */}
      {ALL_INPUTS.map((inp, i) => (
        <line key={`c${i}`} x1={iw + 8} y1={inp.y + ih / 2} x2={cx - outerR} y2={cy} stroke={inp.color} strokeWidth="1" opacity={connOp} />
      ))}
      {ALL_INPUTS.map((inp, i) => (
        <circle key={`dot${i}`} cx={iw + 8} cy={inp.y + ih / 2} r="2.5" fill={inp.color} opacity={connOp} />
      ))}

      {/* Input boxes */}
      {ALL_INPUTS.map((inp, i) => (
        <g key={`in${i}`} opacity={inOp}>
          <rect x="5" y={inp.y} width={iw} height={ih} rx="5" fill="white" stroke={highlight === "inputs" ? inp.color : "#ddd"} strokeWidth={highlight === "inputs" ? 1.5 : 1} />
          <text x="14" y={inp.y + 14} fontSize="9" fill={inp.color} fontWeight="600">{inp.label}</text>
          <text x="14" y={inp.y + 25} fontSize="7" fill="rgba(0,0,0,0.4)">{inp.sub}</text>
        </g>
      ))}

      {/* Outer ring — AI Execution Layer */}
      <g opacity={engOp}>
        <circle cx={cx} cy={cy} r={outerR} fill={P} />
        {/* Inner circle — split into ML Prediction (top) + Strategic Guidance (bottom) */}
        <clipPath id="top-half"><rect x={cx - innerR} y={cy - innerR} width={innerR * 2} height={innerR} /></clipPath>
        <clipPath id="bot-half"><rect x={cx - innerR} y={cy} width={innerR * 2} height={innerR} /></clipPath>

        <circle cx={cx} cy={cy} r={innerR} fill={G} clipPath="url(#top-half)" />
        <circle cx={cx} cy={cy} r={innerR} fill={B} clipPath="url(#bot-half)" />
        <line x1={cx - innerR + 5} y1={cy} x2={cx + innerR - 5} y2={cy} stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 3" />

        {/* Network icon for ML Prediction */}
        <circle cx={cx} cy={cy - 28} r="3" fill="none" stroke="white" strokeWidth="1.2" />
        <circle cx={cx - 10} cy={cy - 18} r="2.5" fill="none" stroke="white" strokeWidth="1" />
        <circle cx={cx + 10} cy={cy - 18} r="2.5" fill="none" stroke="white" strokeWidth="1" />
        <line x1={cx - 1} y1={cy - 25} x2={cx - 8} y2={cy - 19} stroke="white" strokeWidth="0.8" />
        <line x1={cx + 1} y1={cy - 25} x2={cx + 8} y2={cy - 19} stroke="white" strokeWidth="0.8" />

        <text x={cx} y={cy - 6} fontSize="9.5" fill="white" textAnchor="middle" fontWeight="700">ML Prediction</text>

        {/* Compass icon for Strategic Guidance */}
        <circle cx={cx} cy={cy + 20} r="5" fill="none" stroke="white" strokeWidth="1" />
        <line x1={cx} y1={cy + 15} x2={cx} y2={cy + 25} stroke="white" strokeWidth="0.8" />
        <line x1={cx - 5} y1={cy + 20} x2={cx + 5} y2={cy + 20} stroke="white" strokeWidth="0.8" />

        <text x={cx} y={cy + 38} fontSize="9" fill="white" textAnchor="middle" fontWeight="600">Strategic Guidance</text>

        {/* AI Execution Layer label */}
        <text x={cx + 2} y={cy + outerR - 4} fontSize="7" fill="rgba(255,255,255,0.55)" textAnchor="middle" fontStyle="italic">AI Execution Layer</text>
      </g>

      {/* Feedback arcs */}
      <path d={`M${cx - 20},${cy + outerR + 2} C${cx - 80},${cy + outerR + 30} 60,${cy + outerR + 10} 8,165`} fill="none" stroke={B} strokeWidth="1.2" strokeDasharray="4 3" opacity={fbOp} />
      <path d={`M${cx - 30},${cy - outerR - 2} C${cx - 90},${cy - outerR - 20} 60,5 8,25`} fill="none" stroke={G} strokeWidth="1.2" strokeDasharray="4 3" opacity={fbOp} />
      {highlight === "feedback" && (
        <>
          <text x={cx - 60} y={cy + outerR + 28} fontSize="7" fill={B} fontWeight="500" opacity="0.7">outcomes feed back</text>
        </>
      )}

      {/* Highlight labels */}
      {highlight === "inputs" && <text x={iw / 2 + 5} y="200" fontSize="8" fill={G} textAnchor="middle" fontWeight="600" letterSpacing="1.5" opacity="0.6">INPUTS</text>}
      {highlight === "engine" && <text x={cx} y={cy + outerR + 16} fontSize="8" fill={P} textAnchor="middle" fontWeight="600" letterSpacing="1.5" opacity="0.6">ENGINE</text>}
      {highlight === "outputs" && <text x={cx} y={cy + outerR + 16} fontSize="8" fill={P} textAnchor="middle" fontWeight="600" letterSpacing="1.5" opacity="0.6">MODEL</text>}
      {highlight === "feedback" && <text x={cx} y={cy + outerR + 16} fontSize="8" fill={P} textAnchor="middle" fontWeight="600" letterSpacing="1.5" opacity="0.6">LEARNS</text>}
    </svg>
  );
}

function VisualModelOverview() { return <ModelDiagram highlight="all" />; }
function VisualInputs() { return <ModelDiagram highlight="inputs" />; }
function VisualEngine() { return <ModelDiagram highlight="engine" />; }
function VisualOutputs() { return <ModelDiagram highlight="outputs" />; }
function VisualFeedback() { return <ModelDiagram highlight="feedback" />; }

/* ═══════════════════════════════════════════════════════════════════
   Drivers Visual — Customer factors → Pricing Model → Recommended Price
   ═══════════════════════════════════════════════════════════════════ */

function VisualDrivers() {
  const factors: { label: string; color: string; pos: number }[] = [
    { label: "Product Category", color: O, pos: 0.82 },
    { label: "Geography", color: P, pos: 0.55 },
    { label: "End Market", color: P, pos: 0.48 },
    { label: "Product Importance", color: O, pos: 0.68 },
    { label: "Order Frequency", color: "#7b1fa2", pos: 0.52 },
    { label: "Customer Tenure", color: P, pos: 0.72 },
    { label: "Competitor Pricing", color: G, pos: 0.38 },
  ];

  const w = 620, h = 210;
  const cardX = 10, cardY = 8, cardW = 195, cardH = 190;
  const circCx = 325, circCy = 105, circR = 52;
  const resultX = 435, resultY = 20, resultW = 170, resultH = 170;
  const barX = cardX + 120, barW = 60;

  return (
    <svg viewBox={`0 0 ${w} ${h}`}>
      {/* Left card: customer + factors */}
      <rect x={cardX} y={cardY} width={cardW} height={cardH} rx="8" fill="white" stroke="#e0e0e0" strokeWidth="1" />
      <rect x={cardX} y={cardY} width={cardW} height="28" rx="8" fill={`${P}0d`} />
      <rect x={cardX} y={cardY + 20} width={cardW} height="8" fill={`${P}0d`} />
      <text x={cardX + cardW / 2} y={cardY + 14} fontSize="9" fill={P} textAnchor="middle" fontWeight="700">Acme Industrial</text>
      <text x={cardX + cardW / 2} y={cardY + 24} fontSize="6.5" fill={B} textAnchor="middle">High volume · loyal</text>

      {factors.map((f, i) => {
        const fy = cardY + 40 + i * 21;
        const dotR = 3;
        return (
          <g key={i}>
            <circle cx={cardX + 12} cy={fy} r={dotR} fill={f.color} />
            <text x={cardX + 20} y={fy + 3} fontSize="7" fill="#333" fontWeight="500">{f.label}</text>
            <rect x={barX} y={fy - 3} width={barW} height="6" rx="3" fill={`${f.color}20`} />
            <rect x={barX} y={fy - 3} width={barW * f.pos} height="6" rx="3" fill={f.color} />
            <circle cx={barX + barW * f.pos} cy={fy} r="4" fill="white" stroke={f.color} strokeWidth="1.5" />
          </g>
        );
      })}

      {/* Connector lines: card → circle */}
      <line x1={cardX + cardW} y1={circCy - 20} x2={circCx - circR - 8} y2={circCy - 8} stroke="#ccc" strokeWidth="0.75" strokeDasharray="3 2" />
      <line x1={cardX + cardW} y1={circCy} x2={circCx - circR - 8} y2={circCy} stroke="#ccc" strokeWidth="0.75" strokeDasharray="3 2" />
      <line x1={cardX + cardW} y1={circCy + 20} x2={circCx - circR - 8} y2={circCy + 8} stroke="#ccc" strokeWidth="0.75" strokeDasharray="3 2" />
      <circle cx={circCx - circR - 8} cy={circCy - 8} r="2" fill="#ccc" />
      <circle cx={circCx - circR - 8} cy={circCy} r="2" fill="#ccc" />
      <circle cx={circCx - circR - 8} cy={circCy + 8} r="2" fill="#ccc" />

      {/* "high product importance" annotation */}
      <text x={circCx - circR - 14} y={circCy - 24} fontSize="5.5" fill="rgba(0,0,0,0.3)" textAnchor="end" fontStyle="italic">high product importance</text>

      {/* Center: pricing model circle */}
      <rect x={circCx - 38} y={circCy - circR - 18} width="76" height="14" rx="7" fill={P} />
      <text x={circCx} y={circCy - circR - 9} fontSize="6.5" fill="white" textAnchor="middle" fontWeight="600">Pricing model</text>
      <circle cx={circCx} cy={circCy} r={circR + 4} fill="none" stroke={B} strokeWidth="1.5" opacity="0.5" />
      <circle cx={circCx} cy={circCy} r={circR} fill="none" stroke={O} strokeWidth="2" />
      <circle cx={circCx} cy={circCy} r={circR - 2} fill="white" />
      <text x={circCx} y={circCy - 14} fontSize="6" fill="rgba(0,0,0,0.35)" textAnchor="middle" letterSpacing="1.5" fontWeight="600">OPTIMIZED SKU</text>
      <text x={circCx} y={circCy + 6} fontSize="18" fill={P} textAnchor="middle" fontWeight="800">PRICE</text>
      <text x={circCx} y={circCy + 18} fontSize="6.5" fill="rgba(0,0,0,0.4)" textAnchor="middle">SKU #A-7200</text>
      <text x={circCx} y={circCy + circR + 18} fontSize="6.5" fill={B} textAnchor="middle" fontStyle="italic">ML-powered optimization</text>

      {/* Connector: circle → result */}
      <line x1={circCx + circR + 8} y1={circCy} x2={resultX} y2={circCy} stroke="#ccc" strokeWidth="0.75" strokeDasharray="3 2" />
      <circle cx={circCx + circR + 8} cy={circCy} r="2" fill={O} />

      {/* Right card: recommended price */}
      <rect x={resultX} y={resultY} width={resultW} height={resultH} rx="8" fill="white" stroke={`${P}40`} strokeWidth="1.5" strokeDasharray="4 2" />
      <text x={resultX + resultW / 2} y={resultY + 18} fontSize="7" fill="rgba(0,0,0,0.45)" textAnchor="middle">Recommended price</text>
      <text x={resultX + resultW / 2} y={resultY + 46} fontSize="22" fill={O} textAnchor="middle" fontWeight="800">$19.24</text>
      <text x={resultX + resultW / 2} y={resultY + 60} fontSize="7" fill={G} textAnchor="middle" fontWeight="500">+$1.74 above Historical Average</text>

      <line x1={resultX + 16} y1={resultY + 72} x2={resultX + resultW - 16} y2={resultY + 72} stroke="#eee" strokeWidth="0.75" />

      <text x={resultX + 20} y={resultY + 90} fontSize="7" fill="rgba(0,0,0,0.5)">Win probability</text>
      <text x={resultX + resultW - 20} y={resultY + 90} fontSize="9" fill={P} textAnchor="end" fontWeight="700">68%</text>

      <text x={resultX + 20} y={resultY + 108} fontSize="7" fill="rgba(0,0,0,0.5)">Margin impact</text>
      <text x={resultX + resultW - 20} y={resultY + 108} fontSize="9" fill={G} textAnchor="end" fontWeight="700">+9.9%</text>

      <line x1={resultX + 16} y1={resultY + 120} x2={resultX + resultW - 16} y2={resultY + 120} stroke="#eee" strokeWidth="0.75" />

      <text x={resultX + resultW / 2} y={resultY + 138} fontSize="6.5" fill="rgba(0,0,0,0.3)" textAnchor="middle">List: $17.50 / unit</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Inputs Visual — focused four-input view without the full model center.
   Used in "Decision Support" model tab.
   ═══════════════════════════════════════════════════════════════════ */

function VisualFourInputs() {
  const dataInputs = [
    { label: "Internal Data", sub: "Transaction & customer history", icon: "rows" },
    { label: "Market Insights", sub: "Market sentiment & macro signals", icon: "wave" },
  ];
  const expertiseInputs = [
    { label: "In-House Knowledge", sub: "Business realities & objectives", icon: "shield" },
    { label: "Industry Expertise", sub: "Benchmarks, drivers & paradigms", icon: "lens" },
  ];

  const bw = 200, bh = 52, gap = 10;
  const leftX = 10;
  const groupGap = 22;

  return (
    <svg viewBox="0 0 460 200">
      {/* Data Inputs group */}
      <text x={leftX} y="12" fontSize="7" fill={G} fontWeight="700" letterSpacing="1.2">DATA INPUTS</text>
      {dataInputs.map((inp, i) => {
        const y = 20 + i * (bh + gap);
        return (
          <g key={i}>
            <rect x={leftX} y={y} width={bw} height={bh} rx="6" fill="white" stroke={G} strokeWidth="1.5" />
            {/* Icon area */}
            <rect x={leftX + 1} y={y + 6} width="3" height={bh - 12} rx="1.5" fill={G} />
            <text x={leftX + 14} y={y + 20} fontSize="10" fill={G} fontWeight="600">{inp.label}</text>
            <text x={leftX + 14} y={y + 34} fontSize="7.5" fill="rgba(0,0,0,0.4)">{inp.sub}</text>
            {/* Connector to center */}
            <line x1={leftX + bw} y1={y + bh / 2} x2="300" y2="100" stroke={G} strokeWidth="1" opacity="0.3" />
            <circle cx={leftX + bw} cy={y + bh / 2} r="2.5" fill={G} opacity="0.3" />
          </g>
        );
      })}

      {/* Expertise Inputs group */}
      <text x={leftX} y={20 + 2 * (bh + gap) + groupGap - 6} fontSize="7" fill={B} fontWeight="700" letterSpacing="1.2">EXPERTISE INPUTS</text>
      {expertiseInputs.map((inp, i) => {
        const y = 20 + 2 * (bh + gap) + groupGap + i * (bh + gap);
        return (
          <g key={i}>
            <rect x={leftX} y={y} width={bw} height={bh} rx="6" fill="white" stroke={B} strokeWidth="1.5" />
            <rect x={leftX + 1} y={y + 6} width="3" height={bh - 12} rx="1.5" fill={B} />
            <text x={leftX + 14} y={y + 20} fontSize="10" fill={B} fontWeight="600">{inp.label}</text>
            <text x={leftX + 14} y={y + 34} fontSize="7.5" fill="rgba(0,0,0,0.4)">{inp.sub}</text>
            <line x1={leftX + bw} y1={y + bh / 2} x2="300" y2="100" stroke={B} strokeWidth="1" opacity="0.3" />
            <circle cx={leftX + bw} cy={y + bh / 2} r="2.5" fill={B} opacity="0.3" />
          </g>
        );
      })}

      {/* Center — simplified model target */}
      <circle cx="370" cy="100" r="60" fill={P} />
      <circle cx="370" cy="100" r="42" fill="white" opacity="0.1" />
      <text x="370" y="93" fontSize="11" fill="white" textAnchor="middle" fontWeight="700">One Model</text>
      <text x="370" y="108" fontSize="8" fill="rgba(255,255,255,0.6)" textAnchor="middle">Customized to you</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Review Flow Visual — model rec → reviewer decision → outcome feeds back.
   Specific to the "Review & Revise" step.
   ═══════════════════════════════════════════════════════════════════ */

function VisualReviewFlow() {
  const bh = 36, gap = 8;

  return (
    <svg viewBox="0 0 460 145">
      {/* Step 1: Model Recommendation */}
      <rect x="5" y="15" width="120" height="70" rx="8" fill={P} />
      <text x="65" y="40" fontSize="9" fill="white" textAnchor="middle" fontWeight="700">Recommended</text>
      <text x="65" y="54" fontSize="9" fill="white" textAnchor="middle" fontWeight="700">Price</text>
      <text x="65" y="70" fontSize="7.5" fill="rgba(255,255,255,0.55)" textAnchor="middle">Calibrated per deal</text>

      {/* Arrow 1 */}
      <line x1="130" y1="50" x2="158" y2="50" stroke="#ccc" strokeWidth="1.5" />
      <polygon points="156,46 164,50 156,54" fill="#ccc" />

      {/* Step 2: Blue column — reviewer workspace */}
      <rect x="168" y="8" width="128" height="84" rx="8" fill="#e8f4fd" stroke={B} strokeWidth="1.5" />
      <text x="232" y="26" fontSize="7" fill={B} fontWeight="700" letterSpacing="1">REVIEWER</text>
      <rect x="180" y="32" width="104" height={bh} rx="5" fill="white" stroke="#ddd" strokeWidth="1" />
      <text x="195" y="47" fontSize="8" fill={G} fontWeight="700">✓</text>
      <text x="208" y="48" fontSize="9" fill="#333" fontWeight="500">Accept</text>
      <text x="268" y="48" fontSize="7.5" fill="#999">as-is</text>
      <rect x="180" y={32 + bh + gap} width="104" height={bh} rx="5" fill="white" stroke={O} strokeWidth="1.5" />
      <text x="195" y={32 + bh + gap + 15} fontSize="8" fill={O} fontWeight="700">✎</text>
      <text x="208" y={32 + bh + gap + 16} fontSize="9" fill="#333" fontWeight="500">Adjust</text>
      <text x="253" y={32 + bh + gap + 16} fontSize="7.5" fill="#999">override</text>

      {/* Arrow 2 */}
      <line x1="300" y1="50" x2="328" y2="50" stroke="#ccc" strokeWidth="1.5" />
      <polygon points="326,46 334,50 326,54" fill="#ccc" />

      {/* Step 3: Final price */}
      <rect x="338" y="15" width="110" height="70" rx="8" fill={G} />
      <text x="393" y="40" fontSize="9" fill="white" textAnchor="middle" fontWeight="700">Final Price</text>
      <text x="393" y="55" fontSize="7.5" fill="rgba(255,255,255,0.6)" textAnchor="middle">Implemented</text>
      <text x="393" y="68" fontSize="7.5" fill="rgba(255,255,255,0.6)" textAnchor="middle">or sent for approval</text>

      {/* Feedback arc */}
      <path d="M393,88 C393,120 65,120 65,88" fill="none" stroke={B} strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
      <polygon points="63,90 67,90 65,96" fill={B} opacity="0.4" />
      <text x="230" y="128" fontSize="7" fill={B} textAnchor="middle" opacity="0.6">Outcome feeds back → next cycle starts smarter</text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   Step & sub-step types
   ═══════════════════════════════════════════════════════════════════ */

export interface SubStep {
  label: string;
  title?: string;
  caption: string;
  detail: string;
  target?: string;
  action?: string;
  Visual?: () => React.JSX.Element;
}

export interface TourStep {
  page: string;
  target?: string;
  action?: string;
  icon: string;
  color: string;
  title: string;
  subs: SubStep[];
}

/* ═══════════════════════════════════════════════════════════════════
   Combined feature walkthrough + model context
   ═══════════════════════════════════════════════════════════════════ */

export const STEPS: TourStep[] = [
  {
    page: "/",
    icon: "🏠",
    color: "#00446a",
    title: "Welcome to Tempo",
    subs: [
      {
        label: "Welcome",
        title: "Welcome to Tempo",
        caption:
          "A **turnkey pricing platform** for decision-makers.\nReview, adjust, and act on **pricing recommendations**.\nConfigured for your business in **weeks, not months**.",
        detail: "",
      },
    ],
  },
  {
    page: "/",
    target: "dashboard-content",
    icon: "🏠",
    color: "#00446a",
    title: "Your Home Base",
    subs: [
      {
        label: "Feature",
        title: "Summary Dashboard",
        caption:
          "Your **home base** — see where your book stands at a glance.\n**Review progress**, fee impact, margin benchmarks, and trend data.\nAll in one view before diving into **individual reviews**.",
        detail: "",
      },
    ],
  },
  {
    page: "/",
    target: "action-items",
    icon: "📋",
    color: "#D97C14",
    title: "Review Action Items",
    subs: [
      {
        label: "Feature",
        caption:
          "Surface what **needs attention right now**.\n**Needs Review** · Below Margin Floor · Above Target · **Ready to Send**\nClick any card to jump straight into **Price Review**.",
        detail: "",
      },
    ],
  },
  {
    page: "/",
    target: "analytics-summary",
    icon: "📊",
    color: "#00446a",
    title: "Analytics Summary",
    subs: [
      {
        label: "Feature",
        caption:
          "A **bird's-eye view** of your portfolio.\nFee impact, review progress, **margin benchmarks**, and fee increase trends.\nFilter by any dimension — every chart **recalculates instantly**.",
        detail: "",
      },
    ],
  },
  {
    page: "/",
    target: "nav-price-review",
    icon: "🧭",
    color: "#00446a",
    title: "Navigation",
    subs: [
      {
        label: "Feature",
        caption:
          "Use the **navigation rail** to move between views.\n**Summary Dashboard** · **Price Review** · **Approvals**\nLet's head to **Price Review**.",
        detail: "",
      },
    ],
  },
  {
    page: "/price-review",
    target: "tempo-full-page",
    icon: "📋",
    color: "#00446a",
    title: "Welcome to Price Review",
    subs: [
      {
        label: "Feature",
        caption:
          "This is the **Price Review** page — your **pricing book**.\nEvery engagement in your portfolio lives here, **ready for review**.\nThis is where you'll spend **most of your time**.",
        detail: "",
      },
    ],
  },
  {
    page: "/price-review",
    target: "kpi-cards",
    icon: "📊",
    color: "#D97C14",
    title: "KPIs That Move With You",
    subs: [
      {
        label: "Feature",
        caption:
          "Review progress, impact, average increases — **all at a glance**.\nFilter by partner or service line and every number **recalculates**.\nKPIs are **configurable per instance**.",
        detail: "",
      },
    ],
  },
  {
    page: "/price-review",
    target: "data-table",
    icon: "📋",
    color: "#0F6E56",
    title: "Every Row is a Review Unit",
    subs: [
      {
        label: "Feature",
        caption:
          "Each row is a **review unit** — a unique combination of attributes you need to price.\nHere it's **Product + Make + Model** — so each brake pad for each vehicle is its own row.\nSwitch to **Make + Model** and those rows roll up — you'd review **one price per vehicle**, not per part.\nColumns, KPIs, filters, and permissions **all reconfigure automatically**.",
        detail: "",
      },
      {
        label: "How It Prices",
        title: "How the Model Works",
        caption:
          "The model tests **every attribute** on a deal for pricing significance.\nA few **drivers** emerge — the rest are noise.\nEach driver becomes a knob. ML tunes **every knob, for every deal**, simultaneously — producing a **calibrated price per segment**.",
        detail: "",
        Visual: VisualDrivers,
      },
    ],
  },
  {
    page: "/price-review",
    target: "revised-columns",
    action: "scroll-to-revised",
    icon: "✏️",
    color: "#0F6E56",
    title: "Review & Revise",
    subs: [
      {
        label: "Review",
        caption:
          "The **blue columns** are the reviewer's workspace.\n**Accept, adjust, or override** each recommendation.\nThe model gives every engagement a starting point — reviewers bring the judgment.",
        detail: "",
      },
      {
        label: "Review Flow",
        title: "How the Model Works",
        caption:
          "The **recommended price** in the blue column is the model's starting point — calibrated from your data.\nYou **accept it as-is** or **adjust it** with your judgment — market context, relationship knowledge, strategic priorities.\nYour decision becomes the **final price**. That outcome feeds back into the model, making the **next cycle's starting point smarter**.",
        detail: "",
        Visual: VisualReviewFlow,
      },
    ],
  },
  {
    page: "/price-review",
    target: "status-columns",
    action: "scroll-to-status",
    icon: "✅",
    color: "#0F6E56",
    title: "Mark Complete & Approve",
    subs: [
      {
        label: "Feature",
        caption:
          "When a review is finalized, use the **Status** dropdown to mark it complete.\nIf an **approval workflow** is configured, marking complete sends it down the line for approval automatically.\nNo approval workflow? It's implemented at the end of the cycle.",
        detail: "",
      },
    ],
  },
  {
    page: "/price-review",
    target: "mass-action-btn",
    action: "close-mass-action",
    icon: "⚡",
    color: "#D97C14",
    title: "Mass Actions at Scale",
    subs: [
      {
        label: "Button",
        caption:
          "Need to update **dozens of engagements** at once?\nThe **Mass Action** button lets you apply changes across your entire book.\nSelect rows or apply to **all** — then choose what to change.",
        detail: "",
        action: "close-mass-action",
      },
      {
        label: "Modal",
        caption:
          "Set effective dates, adjust prices, update statuses — **all at once**.\nCombine **multiple actions** in a single pass.\n**Validation errors** surface before anything is committed.",
        detail: "",
        target: "_mass-action-modal",
        action: "open-mass-action",
      },
    ],
  },
  {
    page: "/price-review",
    icon: "🗂️",
    color: "#00446a",
    title: "Organize Your Way",
    action: "close-data-layout",
    subs: [
      {
        label: "Unfiltered",
        title: "Your Full Pricing Book",
        caption:
          "Right now you're looking at **every product** in your portfolio — unfiltered.\nHundreds of rows across **categories, makes, and regions**.\nGreat for a quick scan, but hard to **focus** when you own a specific slice.",
        detail: "",
        target: "data-table",
        action: "close-data-layout",
      },
      {
        label: "Challenge",
        title: "What If You Need to Focus?",
        caption:
          "Imagine you're a **regional manager** responsible for Brakes and Filters.\nYou need to see only **your categories**, grouped by make, so you can review progress.\nScrolling through the full list and manually filtering **wastes time**.",
        detail: "",
        target: "data-table",
        action: "close-data-layout",
      },
      {
        label: "Create Layout",
        title: "Create a Data Layout",
        caption:
          "Click **Data Layouts** to configure a view — think of it like a **pivot table**.\nNest by **category, make, region** — whatever hierarchy fits your workflow.\nSave it, name it, and **share it** with your team.",
        detail: "",
        target: "data-layout-btn",
        action: "close-data-layout",
      },
      {
        label: "Result",
        title: "Organized in One Click",
        caption:
          "Select a layout and the table **groups and filters instantly**.\nNow you see **Brakes → Ford → Northeast** — exactly the slice you need.\nClick any folder to **drill into that segment** and review it row by row.",
        detail: "",
        target: "data-layout-panel",
        action: "open-data-layout",
      },
    ],
  },
  {
    page: "/price-review",
    target: "drawer",
    action: "open-drawer-explain-price",
    icon: "📈",
    color: "#00446a",
    title: "Decision Support",
    subs: [
      {
        label: "Explain the Price",
        caption:
          "AI generates a **narrative explanation** of the recommendation.\nBreaks down **pricing drivers** in plain language — reviewers see the **why**, not just the number.\nAsk follow-up questions to **dig deeper** into any factor.",
        detail: "",
        action: "open-drawer-explain-price",
      },
      {
        label: "Elasticity",
        caption:
          "A **price vs. volume trend** chart showing how pricing changes affect engagement volume.\nThis is one example — we **configure the analysis to your business** needs.\nThe chart, metrics, and thresholds all **adapt to your data**.",
        detail: "",
        action: "open-drawer-elasticity",
      },
      {
        label: "Price Comps",
        caption:
          "See how this engagement's pricing **compares to peers** — similar size, scope, and service line.\nLike Elasticity, this view is **configured to your business** — dimensions, peer criteria, and benchmarks are all customizable.\nGives reviewers **market context** right where they need it.",
        detail: "",
        action: "open-drawer-price-comps",
      },
      {
        label: "Comments",
        caption:
          "**Collaborate directly** on each review unit.\nLeave notes, flag concerns, or tag colleagues — all **attached to the row**.\nConversation history stays with the engagement across **every review cycle**.",
        detail: "",
        action: "open-drawer-comments",
      },
      {
        label: "Model Inputs",
        title: "How the Model Powers Decision Support",
        caption:
          "Every tool in this drawer is **powered by the same model** — the inputs you configure shape what reviewers see.\n**Explain the Price** pulls from the model's weighted drivers to narrate **why** a price landed where it did.\n**Elasticity & Price Comps** use transaction history and market data to show **trade-offs and peer context** in real time.\nThe model doesn't just produce a number — it produces the **evidence and reasoning** reviewers need to act with confidence.",
        detail: "",
        Visual: VisualFourInputs,
      },
    ],
  },
  {
    page: "/price-review",
    target: "drawer",
    action: "open-drawer-rec-history",
    icon: "🔄",
    color: "#00446a",
    title: "The Model Improves",
    subs: [
      {
        label: "Recommendations",
        caption:
          "**Tighter, smarter** recommendations backed by **real outcomes**.\nEach review cycle produces **better starting points**.\nLess time adjusting — more time on **strategic decisions**.",
        detail: "",
        action: "open-drawer-rec-history",
      },
      {
        label: "Learning Loop",
        title: "How the Model Works",
        caption:
          "After each review cycle, **actual outcomes** — accepted prices, negotiated concessions, lost deals — flow back into the model as new training data.\nThe model **reweights its drivers**: if a segment consistently pushes back, it learns to start lower; if wins come easy, it learns there's room to **price more aggressively**.\nEach cycle produces **tighter confidence intervals** and fewer manual overrides — the model earns trust by getting smarter.",
        detail: "",
        Visual: VisualFeedback,
      },
    ],
  },
  {
    page: "/price-review",
    icon: "⚡",
    color: "#00446a",
    title: "Weeks, Not Months",
    subs: [
      {
        label: "Feature",
        caption:
          "Everything you just saw is configured in **weeks, not months**.\n**No data templates** — Tempo connects to your existing data.\n**Roll out** to one team first, then expand from there.",
        detail: "",
      },
    ],
  },
];
