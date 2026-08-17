export interface RowData {
  hasComments: boolean;
  status: string;
  approvalStatus: string;
  reviewPriority: string;
  engineOutputReason: string;
  rootNumber: string;
  region: string;
  productDescription: string;
  currentListPrice: number;
  recPctChangeFromCurPrice: number;
  recPrice: number;
  revisedPrice: number;
  revisedPriceReasonCode: string;
  grossProfit: number;
  recMargin35: number;
  revisedPricePctFromCurrent: number;
  currentCost: number;
  ttmRevenue: number;
  ttmQty: number;
  ttmMarginDollar: number;
  ttmMarginPct: number;
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  competitivePrice: number | null;
  popularity: string;
  productTier: string;
  priceFreezeFlag: boolean;
  costChangeCategory: string;
  inventoryStatus: string;
  expectedStockoutDays: number;
  baseCompPrice: number | null;
  mostRecentScrapeFlag: boolean;
  // Legacy fields for PS path and AnalyticsDrawer compatibility
  partnerName: string;
  clientName: string;
  projectName: string;
  serviceLine: string;
  clientTenure: string;
  retentionBucket: string;
  clientRenewalStatus: string;
  currentFixedFee: number;
  scopeChangePct: number;
  fixedFeeAfterScope: number;
  recPriceIncreasePct: number;
  recFixedFee: number;
  revisedFixedFee: number;
  revisedPriceIncreasePct: number;
  currentAdminFee: number;
  revisedAdminFee: number;
  revisedTotalFee: number;
  revisedImpact: number;
  impactDelta: number;
  revisionReason: string;
  clientCommStatus: string;
  custAcceptedFixedFee: number | null;
  custAcceptedAdminFee: number | null;
  finalTotalFee: number | null;
  finalTotalPct: number | null;
  qtyHrs?: number;
  estDays?: number;
  billRate?: number;
  extFees?: number;
  vcPerHr?: number;
  marginPct?: number;
  recBillRate?: number;
  recExtFees?: number;
  recMarginPct?: number;
  revisedBillRate?: number;
  revisedExtFees?: number;
  revisedMarginPct?: number;
  revisedVcPerHr?: number;
}

interface Product {
  rootNumber: string;
  productDescription: string;
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
  currentCost: number;
  currentListPrice: number;
  category: string;
}

const products: Product[] = [
  { rootNumber: "BRK-1001", productDescription: "Brake Pad Set - Front", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 45.20, currentListPrice: 89.99, category: "Brakes" },
  { rootNumber: "BRK-1002", productDescription: "Brake Pad Set - Rear", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 38.50, currentListPrice: 76.50, category: "Brakes" },
  { rootNumber: "BRK-1003", productDescription: "Brake Rotor - Front", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 52.80, currentListPrice: 104.99, category: "Brakes" },
  { rootNumber: "BRK-1004", productDescription: "Brake Pad Set - Front", make: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2024, currentCost: 35.60, currentListPrice: 72.50, category: "Brakes" },
  { rootNumber: "BRK-1005", productDescription: "Brake Pad Set - Front", make: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2024, currentCost: 32.40, currentListPrice: 65.99, category: "Brakes" },
  { rootNumber: "BRK-1006", productDescription: "Brake Rotor - Front", make: "Toyota", model: "RAV4", yearFrom: 2019, yearTo: 2024, currentCost: 48.90, currentListPrice: 97.50, category: "Brakes" },
  { rootNumber: "BRK-1007", productDescription: "Brake Caliper - Front LH", make: "Chevrolet", model: "Silverado", yearFrom: 2019, yearTo: 2024, currentCost: 78.30, currentListPrice: 155.00, category: "Brakes" },
  { rootNumber: "BRK-1008", productDescription: "Brake Pad Set - Front", make: "BMW", model: "3 Series", yearFrom: 2019, yearTo: 2024, currentCost: 62.10, currentListPrice: 124.99, category: "Brakes" },
  { rootNumber: "BRK-1009", productDescription: "Brake Rotor - Rear", make: "Honda", model: "CR-V", yearFrom: 2017, yearTo: 2024, currentCost: 42.30, currentListPrice: 86.50, category: "Brakes" },
  { rootNumber: "BRK-1010", productDescription: "Brake Pad Set - Rear", make: "Nissan", model: "Altima", yearFrom: 2019, yearTo: 2024, currentCost: 30.80, currentListPrice: 62.99, category: "Brakes" },
  { rootNumber: "FLT-2001", productDescription: "Oil Filter", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 4.20, currentListPrice: 8.99, category: "Filters" },
  { rootNumber: "FLT-2002", productDescription: "Oil Filter", make: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2024, currentCost: 3.80, currentListPrice: 7.99, category: "Filters" },
  { rootNumber: "FLT-2003", productDescription: "Air Filter", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 9.50, currentListPrice: 19.99, category: "Filters" },
  { rootNumber: "FLT-2004", productDescription: "Air Filter", make: "Honda", model: "CR-V", yearFrom: 2017, yearTo: 2024, currentCost: 8.20, currentListPrice: 16.99, category: "Filters" },
  { rootNumber: "FLT-2005", productDescription: "Cabin Air Filter", make: "Toyota", model: "RAV4", yearFrom: 2019, yearTo: 2024, currentCost: 7.40, currentListPrice: 15.50, category: "Filters" },
  { rootNumber: "FLT-2006", productDescription: "Fuel Filter", make: "Chevrolet", model: "Silverado", yearFrom: 2019, yearTo: 2024, currentCost: 12.80, currentListPrice: 26.99, category: "Filters" },
  { rootNumber: "FLT-2007", productDescription: "Oil Filter", make: "BMW", model: "X5", yearFrom: 2019, yearTo: 2024, currentCost: 8.90, currentListPrice: 18.50, category: "Filters" },
  { rootNumber: "FLT-2008", productDescription: "Air Filter", make: "Nissan", model: "Altima", yearFrom: 2019, yearTo: 2024, currentCost: 7.60, currentListPrice: 15.99, category: "Filters" },
  { rootNumber: "ENG-3001", productDescription: "Spark Plug Set (4)", make: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2024, currentCost: 18.40, currentListPrice: 37.99, category: "Engine" },
  { rootNumber: "ENG-3002", productDescription: "Spark Plug Set (6)", make: "Ford", model: "Explorer", yearFrom: 2020, yearTo: 2024, currentCost: 28.50, currentListPrice: 58.99, category: "Engine" },
  { rootNumber: "ENG-3003", productDescription: "Ignition Coil", make: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2024, currentCost: 22.30, currentListPrice: 45.99, category: "Engine" },
  { rootNumber: "ENG-3004", productDescription: "Serpentine Belt", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 14.80, currentListPrice: 29.99, category: "Engine" },
  { rootNumber: "ENG-3005", productDescription: "Timing Belt Kit", make: "Honda", model: "CR-V", yearFrom: 2017, yearTo: 2024, currentCost: 48.60, currentListPrice: 98.50, category: "Engine" },
  { rootNumber: "ENG-3006", productDescription: "Water Pump", make: "Toyota", model: "RAV4", yearFrom: 2019, yearTo: 2024, currentCost: 38.20, currentListPrice: 78.99, category: "Engine" },
  { rootNumber: "ENG-3007", productDescription: "Thermostat", make: "Chevrolet", model: "Equinox", yearFrom: 2018, yearTo: 2024, currentCost: 11.40, currentListPrice: 23.50, category: "Engine" },
  { rootNumber: "ENG-3008", productDescription: "Valve Cover Gasket", make: "Nissan", model: "Altima", yearFrom: 2019, yearTo: 2024, currentCost: 15.60, currentListPrice: 32.50, category: "Engine" },
  { rootNumber: "ELC-4001", productDescription: "Alternator", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 128.50, currentListPrice: 264.99, category: "Electrical" },
  { rootNumber: "ELC-4002", productDescription: "Starter Motor", make: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2024, currentCost: 95.20, currentListPrice: 195.00, category: "Electrical" },
  { rootNumber: "ELC-4003", productDescription: "Alternator", make: "Honda", model: "CR-V", yearFrom: 2017, yearTo: 2024, currentCost: 118.40, currentListPrice: 242.50, category: "Electrical" },
  { rootNumber: "ELC-4004", productDescription: "Starter Motor", make: "Chevrolet", model: "Silverado", yearFrom: 2019, yearTo: 2024, currentCost: 108.60, currentListPrice: 224.99, category: "Electrical" },
  { rootNumber: "ELC-4005", productDescription: "Battery - Group 65", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 82.30, currentListPrice: 169.99, category: "Electrical" },
  { rootNumber: "ELC-4006", productDescription: "Alternator", make: "BMW", model: "3 Series", yearFrom: 2019, yearTo: 2024, currentCost: 185.40, currentListPrice: 379.99, category: "Electrical" },
  { rootNumber: "ELC-4007", productDescription: "Starter Motor", make: "Hyundai", model: "Tucson", yearFrom: 2019, yearTo: 2024, currentCost: 88.90, currentListPrice: 182.50, category: "Electrical" },
  { rootNumber: "ELC-4008", productDescription: "Ignition Switch", make: "Nissan", model: "Altima", yearFrom: 2019, yearTo: 2024, currentCost: 34.80, currentListPrice: 71.99, category: "Electrical" },
  { rootNumber: "EXH-5001", productDescription: "Catalytic Converter - Direct Fit", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 245.80, currentListPrice: 499.99, category: "Exhaust" },
  { rootNumber: "EXH-5002", productDescription: "Oxygen Sensor - Upstream", make: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2024, currentCost: 42.60, currentListPrice: 87.99, category: "Exhaust" },
  { rootNumber: "EXH-5003", productDescription: "Catalytic Converter - Direct Fit", make: "Honda", model: "CR-V", yearFrom: 2017, yearTo: 2024, currentCost: 228.40, currentListPrice: 465.00, category: "Exhaust" },
  { rootNumber: "EXH-5004", productDescription: "Muffler Assembly", make: "Chevrolet", model: "Equinox", yearFrom: 2018, yearTo: 2024, currentCost: 68.90, currentListPrice: 142.50, category: "Exhaust" },
  { rootNumber: "EXH-5005", productDescription: "Oxygen Sensor - Downstream", make: "BMW", model: "X5", yearFrom: 2019, yearTo: 2024, currentCost: 55.80, currentListPrice: 114.99, category: "Exhaust" },
  { rootNumber: "EXH-5006", productDescription: "Exhaust Manifold", make: "Ford", model: "Explorer", yearFrom: 2020, yearTo: 2024, currentCost: 142.30, currentListPrice: 292.50, category: "Exhaust" },
  { rootNumber: "SUS-6001", productDescription: "Shock Absorber - Front", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 45.60, currentListPrice: 94.50, category: "Suspension" },
  { rootNumber: "SUS-6002", productDescription: "Strut Assembly - Front", make: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2024, currentCost: 68.40, currentListPrice: 141.99, category: "Suspension" },
  { rootNumber: "SUS-6003", productDescription: "Control Arm - Front Lower", make: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2024, currentCost: 52.80, currentListPrice: 109.50, category: "Suspension" },
  { rootNumber: "SUS-6004", productDescription: "Ball Joint - Front Lower", make: "Chevrolet", model: "Silverado", yearFrom: 2019, yearTo: 2024, currentCost: 28.40, currentListPrice: 58.99, category: "Suspension" },
  { rootNumber: "SUS-6005", productDescription: "Tie Rod End - Outer", make: "Toyota", model: "RAV4", yearFrom: 2019, yearTo: 2024, currentCost: 18.90, currentListPrice: 39.50, category: "Suspension" },
  { rootNumber: "SUS-6006", productDescription: "Wheel Bearing Assembly - Front", make: "Ford", model: "Explorer", yearFrom: 2020, yearTo: 2024, currentCost: 62.40, currentListPrice: 129.99, category: "Suspension" },
  { rootNumber: "SUS-6007", productDescription: "Sway Bar Link", make: "BMW", model: "3 Series", yearFrom: 2019, yearTo: 2024, currentCost: 24.60, currentListPrice: 50.99, category: "Suspension" },
  { rootNumber: "SUS-6008", productDescription: "Strut Assembly - Rear", make: "Hyundai", model: "Tucson", yearFrom: 2019, yearTo: 2024, currentCost: 58.20, currentListPrice: 119.99, category: "Suspension" },
  { rootNumber: "DRV-7001", productDescription: "CV Axle Assembly - Front", make: "Honda", model: "CR-V", yearFrom: 2017, yearTo: 2024, currentCost: 72.80, currentListPrice: 149.99, category: "Drivetrain" },
  { rootNumber: "DRV-7002", productDescription: "Wheel Hub Assembly - Front", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 58.40, currentListPrice: 119.99, category: "Drivetrain" },
  { rootNumber: "DRV-7003", productDescription: "CV Axle Assembly - Front", make: "Toyota", model: "RAV4", yearFrom: 2019, yearTo: 2024, currentCost: 68.90, currentListPrice: 142.50, category: "Drivetrain" },
  { rootNumber: "DRV-7004", productDescription: "Wheel Hub Assembly - Rear", make: "Chevrolet", model: "Equinox", yearFrom: 2018, yearTo: 2024, currentCost: 52.60, currentListPrice: 108.99, category: "Drivetrain" },
  { rootNumber: "CLG-8001", productDescription: "Radiator", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 95.40, currentListPrice: 196.99, category: "Cooling" },
  { rootNumber: "CLG-8002", productDescription: "Radiator", make: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2024, currentCost: 82.60, currentListPrice: 169.99, category: "Cooling" },
  { rootNumber: "CLG-8003", productDescription: "Radiator Hose - Upper", make: "Honda", model: "Civic", yearFrom: 2016, yearTo: 2024, currentCost: 12.40, currentListPrice: 25.99, category: "Cooling" },
  { rootNumber: "CLG-8004", productDescription: "Coolant Reservoir", make: "Chevrolet", model: "Silverado", yearFrom: 2019, yearTo: 2024, currentCost: 22.80, currentListPrice: 46.99, category: "Cooling" },
  { rootNumber: "CLG-8005", productDescription: "Radiator Fan Assembly", make: "BMW", model: "X5", yearFrom: 2019, yearTo: 2024, currentCost: 145.80, currentListPrice: 299.99, category: "Cooling" },
  { rootNumber: "CLG-8006", productDescription: "Heater Core", make: "Ford", model: "Explorer", yearFrom: 2020, yearTo: 2024, currentCost: 62.40, currentListPrice: 128.99, category: "Cooling" },
  { rootNumber: "STR-9001", productDescription: "Power Steering Pump", make: "Ford", model: "F-150", yearFrom: 2018, yearTo: 2024, currentCost: 88.60, currentListPrice: 182.50, category: "Steering" },
  { rootNumber: "STR-9002", productDescription: "Steering Rack", make: "Toyota", model: "Camry", yearFrom: 2018, yearTo: 2024, currentCost: 168.40, currentListPrice: 345.99, category: "Steering" },
  { rootNumber: "STR-9003", productDescription: "Power Steering Hose", make: "Honda", model: "CR-V", yearFrom: 2017, yearTo: 2024, currentCost: 28.60, currentListPrice: 58.99, category: "Steering" },
  { rootNumber: "STR-9004", productDescription: "Steering Column", make: "Nissan", model: "Altima", yearFrom: 2019, yearTo: 2024, currentCost: 142.80, currentListPrice: 294.50, category: "Steering" },
];

const statuses = ["Needs Review", "Complete", "Revised"];
const regions = ["Northeast", "Southeast", "Midwest", "West", "Southwest", "Pacific NW"];
const priorities = ["High", "Medium", "Low"];
const engineReasons = ["Cost Decrease > 5%", "Margin Below Target", "Competitive Gap > 10%", "Cost Increase > 3%", "Volume Decline", "Stockout Risk", "New Competitive Data", "Margin Optimization"];
const reasonCodes = ["Market Adjustment", "Competitive Match", "Margin Target", "Cost Pass-Through", "Volume Protection", ""];
const costChangeCategories = ["COST DOWN", "COST UP", "COST SAME"];
const inventoryStatuses = ["IN STOCK", "AT RISK", "OUT OF STOCK"];
const popularities = ["A", "A", "A", "B", "B", "C"];
const productTiers = ["TIER A", "TIER A", "TIER A", "TIER B", "TIER B", "TIER C"];
const retentionBuckets = ["Platinum", "Gold", "Silver", "Bronze"];
const renewalStatuses = ["Active", "Up for Renewal", "Renewed", "At Risk"];
const commStatuses = ["Not Started", "Sent", "Discussed", "Accepted"];

// PS data kept intact for Professional Services instance
const psPartners = ["D. McAllister", "C. Vasquez", "H. Brennan", "N. Okafor", "J. Lindström", "P. Ashworth", "M. Delacroix", "S. Reeves"];
const psServiceLines = ["Strategy", "Technology", "Operations", "Human Capital", "Risk & Compliance", "Digital", "Change Management", "Data & Analytics"];
const psReasons = ["Rate Card Realignment", "Scope Expansion", "Staffing Mix Change", "Retention Risk", "Deliverable Increase", "Resource Escalation", "Market Rate Adj", ""];

interface PsEngagement {
  clientName: string;
  projectName: string;
  serviceLine: string;
  clientTenure: string;
  currentFixedFee: number;
  currentAdminFee: number;
  scopeChangePct: number;
  recPriceIncreasePct: number;
  qtyHrs: number;
  billRate: number;
  vcPerHr: number;
}

const psEngagements: PsEngagement[] = [
  { clientName: "Meridian Health Systems", projectName: "Digital Transformation Roadmap", serviceLine: "Technology", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 8, qtyHrs: 1200, billRate: 295, vcPerHr: 168 },
  { clientName: "Meridian Health Systems", projectName: "EHR Migration — Phase 2", serviceLine: "Technology", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 2400, billRate: 310, vcPerHr: 175 },
  { clientName: "Meridian Health Systems", projectName: "Workforce Planning", serviceLine: "Human Capital", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 6, qtyHrs: 640, billRate: 265, vcPerHr: 155 },
  { clientName: "Apex Capital Partners", projectName: "Operating Model Redesign", serviceLine: "Strategy", clientTenure: "3 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 11, qtyHrs: 1600, billRate: 350, vcPerHr: 195 },
  { clientName: "Apex Capital Partners", projectName: "Portfolio Analytics Platform", serviceLine: "Data & Analytics", clientTenure: "3 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 960, billRate: 285, vcPerHr: 162 },
  { clientName: "Apex Capital Partners", projectName: "Post-Merger Integration", serviceLine: "Change Management", clientTenure: "3 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1800, billRate: 320, vcPerHr: 180 },
  { clientName: "Greenfield Manufacturing", projectName: "Supply Chain Optimization", serviceLine: "Operations", clientTenure: "8 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 8, qtyHrs: 1100, billRate: 275, vcPerHr: 158 },
  { clientName: "Greenfield Manufacturing", projectName: "ERP Implementation", serviceLine: "Technology", clientTenure: "8 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 12, qtyHrs: 3200, billRate: 305, vcPerHr: 172 },
  { clientName: "Greenfield Manufacturing", projectName: "Lean Six Sigma Program", serviceLine: "Operations", clientTenure: "8 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 7, qtyHrs: 480, billRate: 250, vcPerHr: 145 },
  { clientName: "Summit Healthcare Group", projectName: "Revenue Cycle Transformation", serviceLine: "Operations", clientTenure: "6 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 2000, billRate: 325, vcPerHr: 185 },
  { clientName: "Summit Healthcare Group", projectName: "Compliance Framework Build", serviceLine: "Risk & Compliance", clientTenure: "6 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 880, billRate: 290, vcPerHr: 165 },
  { clientName: "Summit Healthcare Group", projectName: "Patient Experience Strategy", serviceLine: "Strategy", clientTenure: "6 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 8, qtyHrs: 520, billRate: 340, vcPerHr: 190 },
  { clientName: "Blackstone River Capital", projectName: "Due Diligence Accelerator", serviceLine: "Strategy", clientTenure: "4 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1400, billRate: 365, vcPerHr: 200 },
  { clientName: "Blackstone River Capital", projectName: "Data Warehouse Modernization", serviceLine: "Data & Analytics", clientTenure: "4 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 13, qtyHrs: 1600, billRate: 295, vcPerHr: 170 },
  { clientName: "Blackstone River Capital", projectName: "Regulatory Readiness", serviceLine: "Risk & Compliance", clientTenure: "4 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 720, billRate: 310, vcPerHr: 178 },
  { clientName: "Pinnacle Consumer Brands", projectName: "Go-to-Market Strategy", serviceLine: "Strategy", clientTenure: "7 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 800, billRate: 345, vcPerHr: 192 },
  { clientName: "Pinnacle Consumer Brands", projectName: "D2C Platform Build", serviceLine: "Digital", clientTenure: "7 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 2200, billRate: 280, vcPerHr: 160 },
  { clientName: "Pinnacle Consumer Brands", projectName: "Org Design & Talent", serviceLine: "Human Capital", clientTenure: "7 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 7, qtyHrs: 560, billRate: 260, vcPerHr: 150 },
  { clientName: "Liberty Mutual Properties", projectName: "Property Mgmt Platform", serviceLine: "Technology", clientTenure: "10 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 1500, billRate: 285, vcPerHr: 162 },
  { clientName: "Liberty Mutual Properties", projectName: "Risk Assessment Model", serviceLine: "Risk & Compliance", clientTenure: "10 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 900, billRate: 300, vcPerHr: 172 },
  { clientName: "NextGen Life Sciences", projectName: "Clinical Trial Analytics", serviceLine: "Data & Analytics", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 11, qtyHrs: 1300, billRate: 310, vcPerHr: 175 },
  { clientName: "NextGen Life Sciences", projectName: "Regulatory Submission Support", serviceLine: "Risk & Compliance", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 960, billRate: 295, vcPerHr: 168 },
  { clientName: "NextGen Life Sciences", projectName: "Lab Digitization Program", serviceLine: "Digital", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 2100, billRate: 275, vcPerHr: 158 },
  { clientName: "Harbor View Real Estate", projectName: "Investor Portal Redesign", serviceLine: "Digital", clientTenure: "3 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 840, billRate: 270, vcPerHr: 155 },
  { clientName: "Harbor View Real Estate", projectName: "Market Expansion Strategy", serviceLine: "Strategy", clientTenure: "3 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 600, billRate: 335, vcPerHr: 188 },
  { clientName: "Cascade Food Group", projectName: "Procurement Optimization", serviceLine: "Operations", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 11, qtyHrs: 780, billRate: 265, vcPerHr: 152 },
  { clientName: "Cascade Food Group", projectName: "Food Safety Compliance", serviceLine: "Risk & Compliance", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 8, qtyHrs: 520, billRate: 280, vcPerHr: 160 },
  { clientName: "Cascade Food Group", projectName: "BI Dashboard Suite", serviceLine: "Data & Analytics", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 640, billRate: 275, vcPerHr: 158 },
  { clientName: "Vanguard Senior Living", projectName: "Care Model Innovation", serviceLine: "Strategy", clientTenure: "4 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 920, billRate: 330, vcPerHr: 185 },
  { clientName: "Vanguard Senior Living", projectName: "Staff Retention Program", serviceLine: "Human Capital", clientTenure: "4 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 8, qtyHrs: 680, billRate: 255, vcPerHr: 148 },
  { clientName: "Vanguard Senior Living", projectName: "Telehealth Rollout", serviceLine: "Technology", clientTenure: "4 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1400, billRate: 290, vcPerHr: 165 },
  { clientName: "TechVault Solutions", projectName: "Cloud Migration Strategy", serviceLine: "Technology", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1800, billRate: 305, vcPerHr: 172 },
  { clientName: "TechVault Solutions", projectName: "Cybersecurity Assessment", serviceLine: "Risk & Compliance", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 640, billRate: 315, vcPerHr: 180 },
  { clientName: "TechVault Solutions", projectName: "DevOps Transformation", serviceLine: "Digital", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1200, billRate: 285, vcPerHr: 162 },
  { clientName: "Cornerstone Medical", projectName: "Clinical Ops Redesign", serviceLine: "Operations", clientTenure: "7 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1500, billRate: 300, vcPerHr: 170 },
  { clientName: "Cornerstone Medical", projectName: "Leadership Development", serviceLine: "Human Capital", clientTenure: "7 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 7, qtyHrs: 440, billRate: 255, vcPerHr: 148 },
  { clientName: "Cornerstone Medical", projectName: "HIPAA Modernization", serviceLine: "Risk & Compliance", clientTenure: "7 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 720, billRate: 295, vcPerHr: 168 },
  { clientName: "Pacific Rim Ventures", projectName: "Market Entry Strategy", serviceLine: "Strategy", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1400, billRate: 355, vcPerHr: 198 },
  { clientName: "Pacific Rim Ventures", projectName: "Cross-Border Ops Setup", serviceLine: "Operations", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1100, billRate: 280, vcPerHr: 160 },
  { clientName: "Pacific Rim Ventures", projectName: "Investment Analytics", serviceLine: "Data & Analytics", clientTenure: "2 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 800, billRate: 290, vcPerHr: 165 },
  { clientName: "Redwood Hospitality", projectName: "Guest Experience Platform", serviceLine: "Digital", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1300, billRate: 270, vcPerHr: 155 },
  { clientName: "Redwood Hospitality", projectName: "Revenue Management Strategy", serviceLine: "Strategy", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 720, billRate: 330, vcPerHr: 185 },
  { clientName: "Redwood Hospitality", projectName: "Workforce Scheduling System", serviceLine: "Human Capital", clientTenure: "5 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 8, qtyHrs: 560, billRate: 260, vcPerHr: 150 },
  { clientName: "National Care Alliance", projectName: "Value-Based Care Transition", serviceLine: "Strategy", clientTenure: "9 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 2400, billRate: 340, vcPerHr: 190 },
  { clientName: "National Care Alliance", projectName: "Population Health Analytics", serviceLine: "Data & Analytics", clientTenure: "9 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 1200, billRate: 295, vcPerHr: 168 },
  { clientName: "National Care Alliance", projectName: "Change Readiness Program", serviceLine: "Change Management", clientTenure: "9 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 8, qtyHrs: 680, billRate: 275, vcPerHr: 158 },
  { clientName: "Trident PE Group", projectName: "Portfolio Co. Benchmarking", serviceLine: "Strategy", clientTenure: "6 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1000, billRate: 360, vcPerHr: 200 },
  { clientName: "Trident PE Group", projectName: "Integration Playbook", serviceLine: "Change Management", clientTenure: "6 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 880, billRate: 300, vcPerHr: 170 },
  { clientName: "Trident PE Group", projectName: "Value Creation Dashboard", serviceLine: "Data & Analytics", clientTenure: "6 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 720, billRate: 285, vcPerHr: 162 },
  { clientName: "Paramount Hotel Group", projectName: "Brand Strategy Refresh", serviceLine: "Strategy", clientTenure: "8 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 9, qtyHrs: 860, billRate: 335, vcPerHr: 188 },
  { clientName: "Paramount Hotel Group", projectName: "Loyalty Platform Build", serviceLine: "Digital", clientTenure: "8 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 10, qtyHrs: 1800, billRate: 275, vcPerHr: 158 },
  { clientName: "Paramount Hotel Group", projectName: "Labor Model Optimization", serviceLine: "Operations", clientTenure: "8 Years", currentFixedFee: 0, currentAdminFee: 0, scopeChangePct: 0, recPriceIncreasePct: 8, qtyHrs: 600, billRate: 270, vcPerHr: 155 },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateProductData(): RowData[] {
  return products.map((prod, i) => {
    const seed = i + 42;
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 100);
    const r3 = seededRandom(seed + 200);
    const r4 = seededRandom(seed + 300);
    const r5 = seededRandom(seed + 400);
    const r6 = seededRandom(seed + 500);
    const r7 = seededRandom(seed + 600);
    const r8 = seededRandom(seed + 700);
    const r9 = seededRandom(seed + 800);
    const r10 = seededRandom(seed + 900);

    const statusIdx = r2 < 0.55 ? 0 : r2 < 0.85 ? 1 : 2;
    const status = statuses[statusIdx];
    const region = regions[Math.floor(r4 * regions.length)];
    const popularity = popularities[Math.floor(r5 * popularities.length)];
    const productTier = productTiers[Math.floor(r5 * productTiers.length)];
    const costChangeCategory = costChangeCategories[Math.floor(r6 * costChangeCategories.length)];
    const inventoryStatus = inventoryStatuses[Math.floor(r7 * inventoryStatuses.length)];
    const priceFreezeFlag = r8 < 0.15;
    const mostRecentScrapeFlag = r9 < 0.8;
    const expectedStockoutDays = Math.round((r10 - 0.4) * 80);

    const costChangeFactor = costChangeCategory === "COST DOWN" ? (1 - r3 * 0.08) : costChangeCategory === "COST UP" ? (1 + r3 * 0.06) : 1;
    const adjustedCost = Math.round(prod.currentCost * costChangeFactor * 100) / 100;

    const recPctChange = Math.round((r1 * 8 + 2) * 10) / 10;
    const recPrice = Math.round(prod.currentListPrice * (1 + recPctChange / 100) * 100) / 100;
    const revisedAdjust = r3 < 0.3 ? -0.015 : r3 < 0.6 ? 0 : 0.01;
    const revisedPrice = Math.round(recPrice * (1 + revisedAdjust) * 100) / 100;
    const revisedPricePctFromCurrent = Math.round(((revisedPrice - prod.currentListPrice) / prod.currentListPrice) * 1000) / 10;
    const grossProfit = Math.round((prod.currentListPrice - adjustedCost) * 100) / 100;
    const recMargin35 = Math.round((recPrice * 0.65 - adjustedCost) * 100) / 100;

    const ttmQty = Math.round(50 + r8 * 4950);
    const ttmRevenue = Math.round(prod.currentListPrice * ttmQty * 100) / 100;
    const ttmMarginDollar = Math.round(grossProfit * ttmQty * 100) / 100;
    const ttmMarginPct = Math.round(((prod.currentListPrice - adjustedCost) / prod.currentListPrice) * 1000) / 10;

    const competitivePrice = r7 < 0.7 ? Math.round(prod.currentListPrice * (0.9 + r9 * 0.2) * 100) / 100 : null;
    const baseCompPrice = mostRecentScrapeFlag ? (competitivePrice || Math.round(prod.currentListPrice * (0.92 + r10 * 0.16) * 100) / 100) : null;

    const revisedImpact = Math.round((revisedPrice - prod.currentListPrice) * 100) / 100;
    const impactDelta = Math.round((revisedPrice - recPrice) * 100) / 100;

    return {
      hasComments: r3 < 0.25,
      status,
      approvalStatus: statusIdx === 0 ? "Needs Review" : statusIdx === 1 ? "Approved" : "Pending",
      reviewPriority: priorities[Math.floor(r4 * priorities.length)],
      engineOutputReason: engineReasons[Math.floor(r6 * engineReasons.length)],
      rootNumber: prod.rootNumber,
      region,
      productDescription: prod.productDescription,
      currentListPrice: prod.currentListPrice,
      recPctChangeFromCurPrice: recPctChange,
      recPrice,
      revisedPrice,
      revisedPriceReasonCode: reasonCodes[Math.floor(r7 * reasonCodes.length)],
      grossProfit,
      recMargin35,
      revisedPricePctFromCurrent,
      currentCost: adjustedCost,
      ttmRevenue,
      ttmQty,
      ttmMarginDollar,
      ttmMarginPct,
      make: prod.make,
      model: prod.model,
      yearFrom: prod.yearFrom,
      yearTo: prod.yearTo,
      competitivePrice,
      popularity,
      productTier,
      priceFreezeFlag,
      costChangeCategory,
      inventoryStatus,
      expectedStockoutDays,
      baseCompPrice,
      mostRecentScrapeFlag,
      // Legacy field mappings for AnalyticsDrawer / PS compatibility
      partnerName: region,
      clientName: prod.make,
      projectName: prod.productDescription,
      serviceLine: prod.category,
      clientTenure: `${prod.yearTo - prod.yearFrom + 1} Years`,
      retentionBucket: retentionBuckets[Math.floor(r5 * retentionBuckets.length)],
      clientRenewalStatus: renewalStatuses[Math.floor(r2 * renewalStatuses.length)],
      currentFixedFee: prod.currentListPrice,
      scopeChangePct: 0,
      fixedFeeAfterScope: prod.currentListPrice,
      recPriceIncreasePct: recPctChange,
      recFixedFee: recPrice,
      revisedFixedFee: revisedPrice,
      revisedPriceIncreasePct: revisedPricePctFromCurrent,
      currentAdminFee: 0,
      revisedAdminFee: 0,
      revisedTotalFee: revisedPrice,
      revisedImpact,
      impactDelta,
      revisionReason: reasonCodes[Math.floor(r7 * reasonCodes.length)],
      clientCommStatus: commStatuses[Math.floor(r10 * commStatuses.length)],
      custAcceptedFixedFee: null,
      custAcceptedAdminFee: null,
      finalTotalFee: null,
      finalTotalPct: null,
    };
  });
}

function generatePsData(): RowData[] {
  return psEngagements.map((eng, i) => {
    const seed = i + 42;
    const r1 = seededRandom(seed);
    const r2 = seededRandom(seed + 100);
    const r3 = seededRandom(seed + 200);
    const r4 = seededRandom(seed + 300);
    const r5 = seededRandom(seed + 400);
    const r6 = seededRandom(seed + 500);
    const r7 = seededRandom(seed + 600);

    const statusIdx = r2 < 0.45 ? 0 : r2 < 0.8 ? 1 : 2;
    const isFinalized = statusIdx >= 1;
    const commIdx = isFinalized ? (r6 < 0.4 ? 3 : r6 < 0.7 ? 2 : 1) : (r6 < 0.5 ? 0 : 1);

    const qtyHrs = eng.qtyHrs;
    const estDays = Math.round(qtyHrs / 8);
    const billRate = eng.billRate;
    const extFees = qtyHrs * billRate;
    const vcPerHr = eng.vcPerHr;
    const marginPct = Math.round(((billRate - vcPerHr) / billRate) * 1000) / 10;

    const recBillRate = Math.round(billRate * (1 + eng.recPriceIncreasePct / 100));
    const recExtFees = qtyHrs * recBillRate;
    const recMarginPct = Math.round(((recBillRate - vcPerHr) / recBillRate) * 1000) / 10;

    const revisedAdjust = r1 < 0.3 ? -0.02 : r1 < 0.6 ? 0 : 0.01;
    const revisedBillRate = Math.round(recBillRate * (1 + revisedAdjust));
    const revisedExtFees = qtyHrs * revisedBillRate;
    const revisedVcPerHr = vcPerHr;
    const revisedMarginPct = Math.round(((revisedBillRate - revisedVcPerHr) / revisedBillRate) * 1000) / 10;

    const revisedImpact = revisedExtFees - extFees;
    const impactDelta = revisedExtFees - recExtFees;

    return {
      hasComments: r3 < 0.3,
      status: statuses[statusIdx],
      approvalStatus: "",
      reviewPriority: "",
      engineOutputReason: "",
      rootNumber: "",
      region: "",
      productDescription: eng.projectName,
      currentListPrice: 0,
      recPctChangeFromCurPrice: 0,
      recPrice: 0,
      revisedPrice: 0,
      revisedPriceReasonCode: "",
      grossProfit: 0,
      recMargin35: 0,
      revisedPricePctFromCurrent: 0,
      currentCost: 0,
      ttmRevenue: 0,
      ttmQty: 0,
      ttmMarginDollar: 0,
      ttmMarginPct: 0,
      make: "",
      model: "",
      yearFrom: 0,
      yearTo: 0,
      competitivePrice: null,
      popularity: "",
      productTier: "",
      priceFreezeFlag: false,
      costChangeCategory: "",
      inventoryStatus: "",
      expectedStockoutDays: 0,
      baseCompPrice: null,
      mostRecentScrapeFlag: false,
      partnerName: psPartners[Math.floor(r4 * psPartners.length)],
      clientName: eng.clientName,
      projectName: eng.projectName,
      serviceLine: eng.serviceLine,
      clientTenure: eng.clientTenure,
      retentionBucket: retentionBuckets[Math.floor(r5 * retentionBuckets.length)],
      clientRenewalStatus: renewalStatuses[Math.floor(r2 * renewalStatuses.length)],
      currentFixedFee: extFees,
      scopeChangePct: 0,
      fixedFeeAfterScope: extFees,
      recPriceIncreasePct: eng.recPriceIncreasePct,
      recFixedFee: recExtFees,
      revisedFixedFee: revisedExtFees,
      revisedPriceIncreasePct: Math.round(((revisedBillRate - billRate) / billRate) * 1000) / 10,
      currentAdminFee: 0,
      revisedAdminFee: 0,
      revisedTotalFee: revisedExtFees,
      revisedImpact,
      impactDelta,
      revisionReason: psReasons[Math.floor(r3 * psReasons.length)],
      clientCommStatus: commStatuses[commIdx],
      custAcceptedFixedFee: isFinalized ? (r7 < 0.7 ? revisedExtFees : Math.round(revisedExtFees * 0.98)) : null,
      custAcceptedAdminFee: null,
      finalTotalFee: isFinalized ? (r7 < 0.7 ? revisedExtFees : Math.round(revisedExtFees * 0.98)) : null,
      finalTotalPct: isFinalized ? Math.round(((r7 < 0.7 ? revisedExtFees : Math.round(revisedExtFees * 0.98)) - extFees) / extFees * 1000) / 10 : null,
      qtyHrs,
      estDays,
      billRate,
      extFees,
      vcPerHr,
      marginPct,
      recBillRate,
      recExtFees,
      recMarginPct,
      revisedBillRate,
      revisedExtFees,
      revisedMarginPct,
      revisedVcPerHr,
    };
  });
}

export function generateTableData(instanceId?: number): RowData[] {
  return instanceId === 415 ? generatePsData() : generateProductData();
}
