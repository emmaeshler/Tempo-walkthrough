export interface RowData {
  hasComments: boolean;
  status: string;
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
  // PS-specific fields
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

const partners = ["M. Richardson", "S. Goldstein", "J. Whitfield", "R. Patel", "K. Donovan", "A. Bernstein", "T. Nakamura", "L. Chen"];
const statuses = ["Needs Review", "Complete", "Revised"];
const retentionBuckets = ["Platinum", "Gold", "Silver", "Bronze"];
const renewalStatuses = ["Active", "Up for Renewal", "Renewed", "At Risk"];
const commStatuses = ["Not Started", "Sent", "Discussed", "Accepted"];
const reasons = ["Market Rate Adj", "Scope Expansion", "Inflation Adj", "Retention Risk", "Complexity Increase", "New Regulations", "Staff Reallocation", ""];
const psReasons = ["Rate Card Realignment", "Scope Expansion", "Staffing Mix Change", "Retention Risk", "Deliverable Increase", "Resource Escalation", "Market Rate Adj", ""];

interface Engagement {
  clientName: string;
  projectName: string;
  serviceLine: string;
  clientTenure: string;
  currentFixedFee: number;
  currentAdminFee: number;
  scopeChangePct: number;
  recPriceIncreasePct: number;
  qtyHrs?: number;
  billRate?: number;
  vcPerHr?: number;
}

const engagements: Engagement[] = [
  { clientName: "Meridian Health Systems", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "8 Years", currentFixedFee: 285000, currentAdminFee: 28500, scopeChangePct: 0, recPriceIncreasePct: 9 },
  { clientName: "Meridian Health Systems", projectName: "Federal Tax Planning", serviceLine: "Tax", clientTenure: "8 Years", currentFixedFee: 95000, currentAdminFee: 9500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Meridian Health Systems", projectName: "Internal Audit Support", serviceLine: "Advisory", clientTenure: "8 Years", currentFixedFee: 120000, currentAdminFee: 12000, scopeChangePct: 5, recPriceIncreasePct: 10 },
  { clientName: "Apex Capital Partners", projectName: "Fund Audit Q4", serviceLine: "Audit & Assurance", clientTenure: "5 Years", currentFixedFee: 175000, currentAdminFee: 17500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Apex Capital Partners", projectName: "Entity Tax Strategy", serviceLine: "Tax", clientTenure: "5 Years", currentFixedFee: 68000, currentAdminFee: 6800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Apex Capital Partners", projectName: "Transaction Advisory", serviceLine: "Advisory", clientTenure: "5 Years", currentFixedFee: 225000, currentAdminFee: 22500, scopeChangePct: 8, recPriceIncreasePct: 10 },
  { clientName: "Greenfield Manufacturing", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "12 Years", currentFixedFee: 195000, currentAdminFee: 19500, scopeChangePct: 0, recPriceIncreasePct: 12 },
  { clientName: "Greenfield Manufacturing", projectName: "Monthly Close Services", serviceLine: "Accounting", clientTenure: "12 Years", currentFixedFee: 84000, currentAdminFee: 8400, scopeChangePct: 0, recPriceIncreasePct: 9 },
  { clientName: "Greenfield Manufacturing", projectName: "Tax Return Preparation", serviceLine: "Tax", clientTenure: "12 Years", currentFixedFee: 42000, currentAdminFee: 4200, scopeChangePct: 0, recPriceIncreasePct: 9 },
  { clientName: "Harbor View Real Estate", projectName: "Quarterly Review", serviceLine: "Audit & Assurance", clientTenure: "3 Years", currentFixedFee: 65000, currentAdminFee: 6500, scopeChangePct: 0, recPriceIncreasePct: 9 },
  { clientName: "Harbor View Real Estate", projectName: "Transaction Tax DD", serviceLine: "Tax", clientTenure: "3 Years", currentFixedFee: 110000, currentAdminFee: 11000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Harbor View Real Estate", projectName: "Valuation Services", serviceLine: "Advisory", clientTenure: "3 Years", currentFixedFee: 85000, currentAdminFee: 8500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Summit Healthcare Group", projectName: "Compliance Audit", serviceLine: "Audit & Assurance", clientTenure: "6 Years", currentFixedFee: 320000, currentAdminFee: 32000, scopeChangePct: 3, recPriceIncreasePct: 10 },
  { clientName: "Summit Healthcare Group", projectName: "Operational Transform", serviceLine: "Advisory", clientTenure: "6 Years", currentFixedFee: 450000, currentAdminFee: 45000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Summit Healthcare Group", projectName: "Tax-Exempt Compliance", serviceLine: "Tax", clientTenure: "6 Years", currentFixedFee: 78000, currentAdminFee: 7800, scopeChangePct: 0, recPriceIncreasePct: 9 },
  { clientName: "Blackstone River Capital", projectName: "SOC 1 Attestation", serviceLine: "Audit & Assurance", clientTenure: "4 Years", currentFixedFee: 92000, currentAdminFee: 9200, scopeChangePct: 0, recPriceIncreasePct: 9 },
  { clientName: "Blackstone River Capital", projectName: "M&A Due Diligence", serviceLine: "Advisory", clientTenure: "4 Years", currentFixedFee: 340000, currentAdminFee: 34000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Blackstone River Capital", projectName: "International Tax", serviceLine: "Tax", clientTenure: "4 Years", currentFixedFee: 125000, currentAdminFee: 12500, scopeChangePct: 0, recPriceIncreasePct: 13 },
  { clientName: "Pinnacle Consumer Brands", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "7 Years", currentFixedFee: 165000, currentAdminFee: 16500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Pinnacle Consumer Brands", projectName: "Full Acctg Outsourcing", serviceLine: "Accounting", clientTenure: "7 Years", currentFixedFee: 156000, currentAdminFee: 15600, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Pinnacle Consumer Brands", projectName: "Federal Tax Planning", serviceLine: "Tax", clientTenure: "7 Years", currentFixedFee: 58000, currentAdminFee: 5800, scopeChangePct: 0, recPriceIncreasePct: 9 },
  { clientName: "Liberty Mutual Properties", projectName: "Financial Stmt Audit", serviceLine: "Audit & Assurance", clientTenure: "10 Years", currentFixedFee: 240000, currentAdminFee: 24000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Liberty Mutual Properties", projectName: "Risk Management", serviceLine: "Advisory", clientTenure: "10 Years", currentFixedFee: 135000, currentAdminFee: 13500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "NextGen Life Sciences", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "2 Years", currentFixedFee: 210000, currentAdminFee: 21000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "NextGen Life Sciences", projectName: "R&D Tax Credits", serviceLine: "Tax", clientTenure: "2 Years", currentFixedFee: 72000, currentAdminFee: 7200, scopeChangePct: 0, recPriceIncreasePct: 11 },
  { clientName: "NextGen Life Sciences", projectName: "Tech Implementation", serviceLine: "Advisory", clientTenure: "2 Years", currentFixedFee: 185000, currentAdminFee: 18500, scopeChangePct: 10, recPriceIncreasePct: 10 },
  { clientName: "Atlantic Housing Trust", projectName: "Compliance Audit", serviceLine: "Audit & Assurance", clientTenure: "9 Years", currentFixedFee: 148000, currentAdminFee: 14800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Atlantic Housing Trust", projectName: "Grants Management", serviceLine: "Government", clientTenure: "9 Years", currentFixedFee: 95000, currentAdminFee: 9500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Cascade Food Group", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "5 Years", currentFixedFee: 138000, currentAdminFee: 13800, scopeChangePct: 0, recPriceIncreasePct: 11 },
  { clientName: "Cascade Food Group", projectName: "State & Local Tax", serviceLine: "Tax", clientTenure: "5 Years", currentFixedFee: 46000, currentAdminFee: 4600, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Cascade Food Group", projectName: "AP/AR Management", serviceLine: "Accounting", clientTenure: "5 Years", currentFixedFee: 72000, currentAdminFee: 7200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Sterling Law Partners", projectName: "Financial Stmt Audit", serviceLine: "Audit & Assurance", clientTenure: "6 Years", currentFixedFee: 115000, currentAdminFee: 11500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Sterling Law Partners", projectName: "Partner Tax Planning", serviceLine: "Tax", clientTenure: "6 Years", currentFixedFee: 82000, currentAdminFee: 8200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Vanguard Senior Living", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "4 Years", currentFixedFee: 198000, currentAdminFee: 19800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Vanguard Senior Living", projectName: "Business Performance", serviceLine: "Advisory", clientTenure: "4 Years", currentFixedFee: 275000, currentAdminFee: 27500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Vanguard Senior Living", projectName: "Tax-Exempt Compliance", serviceLine: "Tax", clientTenure: "4 Years", currentFixedFee: 54000, currentAdminFee: 5400, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Ironclad Distributors", projectName: "SOC 2 Attestation", serviceLine: "Audit & Assurance", clientTenure: "3 Years", currentFixedFee: 78000, currentAdminFee: 7800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Ironclad Distributors", projectName: "System Implementation", serviceLine: "Accounting", clientTenure: "3 Years", currentFixedFee: 165000, currentAdminFee: 16500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Ironclad Distributors", projectName: "Tax Return Preparation", serviceLine: "Tax", clientTenure: "3 Years", currentFixedFee: 38000, currentAdminFee: 3800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Evergreen Community Fdn", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "11 Years", currentFixedFee: 88000, currentAdminFee: 8800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Evergreen Community Fdn", projectName: "Grant Compliance", serviceLine: "Government", clientTenure: "11 Years", currentFixedFee: 62000, currentAdminFee: 6200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Pacific Rim Ventures", projectName: "Transaction Advisory", serviceLine: "Advisory", clientTenure: "2 Years", currentFixedFee: 380000, currentAdminFee: 38000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Pacific Rim Ventures", projectName: "International Tax", serviceLine: "Tax", clientTenure: "2 Years", currentFixedFee: 145000, currentAdminFee: 14500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Pacific Rim Ventures", projectName: "Fund Audit Q4", serviceLine: "Audit & Assurance", clientTenure: "2 Years", currentFixedFee: 195000, currentAdminFee: 19500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Cornerstone Medical", projectName: "Compliance Audit", serviceLine: "Audit & Assurance", clientTenure: "7 Years", currentFixedFee: 258000, currentAdminFee: 25800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Cornerstone Medical", projectName: "Financial Restructure", serviceLine: "Advisory", clientTenure: "7 Years", currentFixedFee: 310000, currentAdminFee: 31000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Cornerstone Medical", projectName: "Entity Tax Strategy", serviceLine: "Tax", clientTenure: "7 Years", currentFixedFee: 74000, currentAdminFee: 7400, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Redwood Hospitality", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "5 Years", currentFixedFee: 142000, currentAdminFee: 14200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Redwood Hospitality", projectName: "Monthly Close Services", serviceLine: "Accounting", clientTenure: "5 Years", currentFixedFee: 96000, currentAdminFee: 9600, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Redwood Hospitality", projectName: "State & Local Tax", serviceLine: "Tax", clientTenure: "5 Years", currentFixedFee: 52000, currentAdminFee: 5200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Trident PE Group", projectName: "Fund Audit Q4", serviceLine: "Audit & Assurance", clientTenure: "6 Years", currentFixedFee: 185000, currentAdminFee: 18500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Trident PE Group", projectName: "M&A Due Diligence", serviceLine: "Advisory", clientTenure: "6 Years", currentFixedFee: 420000, currentAdminFee: 42000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Trident PE Group", projectName: "Transaction Tax DD", serviceLine: "Tax", clientTenure: "6 Years", currentFixedFee: 135000, currentAdminFee: 13500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Beacon Hill Nonprofit", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "15 Years", currentFixedFee: 72000, currentAdminFee: 7200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Beacon Hill Nonprofit", projectName: "Government Audit", serviceLine: "Government", clientTenure: "15 Years", currentFixedFee: 85000, currentAdminFee: 8500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Beacon Hill Nonprofit", projectName: "Tax-Exempt Compliance", serviceLine: "Tax", clientTenure: "15 Years", currentFixedFee: 38000, currentAdminFee: 3800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Atlas Industrial Supply", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "4 Years", currentFixedFee: 155000, currentAdminFee: 15500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Atlas Industrial Supply", projectName: "GL Accounting", serviceLine: "Accounting", clientTenure: "4 Years", currentFixedFee: 108000, currentAdminFee: 10800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Atlas Industrial Supply", projectName: "Federal Tax Planning", serviceLine: "Tax", clientTenure: "4 Years", currentFixedFee: 62000, currentAdminFee: 6200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Horizon Pharma Holdings", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "3 Years", currentFixedFee: 278000, currentAdminFee: 27800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Horizon Pharma Holdings", projectName: "R&D Tax Credits", serviceLine: "Tax", clientTenure: "3 Years", currentFixedFee: 98000, currentAdminFee: 9800, scopeChangePct: 0, recPriceIncreasePct: 12 },
  { clientName: "Horizon Pharma Holdings", projectName: "Valuation Services", serviceLine: "Advisory", clientTenure: "3 Years", currentFixedFee: 145000, currentAdminFee: 14500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Crestline Development", projectName: "Quarterly Review", serviceLine: "Audit & Assurance", clientTenure: "8 Years", currentFixedFee: 58000, currentAdminFee: 5800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Crestline Development", projectName: "Transaction Tax DD", serviceLine: "Tax", clientTenure: "8 Years", currentFixedFee: 92000, currentAdminFee: 9200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Crestline Development", projectName: "Tech Implementation", serviceLine: "Advisory", clientTenure: "8 Years", currentFixedFee: 210000, currentAdminFee: 21000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Maple Grove Schools", projectName: "Compliance Audit", serviceLine: "Audit & Assurance", clientTenure: "6 Years", currentFixedFee: 105000, currentAdminFee: 10500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Maple Grove Schools", projectName: "Grants Management", serviceLine: "Government", clientTenure: "6 Years", currentFixedFee: 78000, currentAdminFee: 7800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Sentinel Wealth Mgmt", projectName: "SOC 1 Attestation", serviceLine: "Audit & Assurance", clientTenure: "5 Years", currentFixedFee: 88000, currentAdminFee: 8800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Sentinel Wealth Mgmt", projectName: "Entity Tax Strategy", serviceLine: "Tax", clientTenure: "5 Years", currentFixedFee: 76000, currentAdminFee: 7600, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Sentinel Wealth Mgmt", projectName: "Risk Management", serviceLine: "Advisory", clientTenure: "5 Years", currentFixedFee: 115000, currentAdminFee: 11500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "National Care Alliance", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "9 Years", currentFixedFee: 345000, currentAdminFee: 34500, scopeChangePct: 5, recPriceIncreasePct: 10 },
  { clientName: "National Care Alliance", projectName: "Operational Transform", serviceLine: "Advisory", clientTenure: "9 Years", currentFixedFee: 520000, currentAdminFee: 52000, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "National Care Alliance", projectName: "Federal Tax Planning", serviceLine: "Tax", clientTenure: "9 Years", currentFixedFee: 112000, currentAdminFee: 11200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "CrossBridge Logistics", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "3 Years", currentFixedFee: 128000, currentAdminFee: 12800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "CrossBridge Logistics", projectName: "Process Automation", serviceLine: "Accounting", clientTenure: "3 Years", currentFixedFee: 145000, currentAdminFee: 14500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "CrossBridge Logistics", projectName: "State & Local Tax", serviceLine: "Tax", clientTenure: "3 Years", currentFixedFee: 48000, currentAdminFee: 4800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Oakmont Capital Grp", projectName: "Fund Audit Q4", serviceLine: "Audit & Assurance", clientTenure: "7 Years", currentFixedFee: 168000, currentAdminFee: 16800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Oakmont Capital Grp", projectName: "Transaction Advisory", serviceLine: "Advisory", clientTenure: "7 Years", currentFixedFee: 295000, currentAdminFee: 29500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Oakmont Capital Grp", projectName: "International Tax", serviceLine: "Tax", clientTenure: "7 Years", currentFixedFee: 118000, currentAdminFee: 11800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Brightpath Education", projectName: "Compliance Audit", serviceLine: "Audit & Assurance", clientTenure: "4 Years", currentFixedFee: 92000, currentAdminFee: 9200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Brightpath Education", projectName: "Grant Compliance", serviceLine: "Government", clientTenure: "4 Years", currentFixedFee: 68000, currentAdminFee: 6800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Ridgeline Construction", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "6 Years", currentFixedFee: 175000, currentAdminFee: 17500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Ridgeline Construction", projectName: "Tax Return Preparation", serviceLine: "Tax", clientTenure: "6 Years", currentFixedFee: 55000, currentAdminFee: 5500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Ridgeline Construction", projectName: "Consolidation Services", serviceLine: "Accounting", clientTenure: "6 Years", currentFixedFee: 88000, currentAdminFee: 8800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Coastal Ventures Fund", projectName: "Fund Audit Q4", serviceLine: "Audit & Assurance", clientTenure: "3 Years", currentFixedFee: 205000, currentAdminFee: 20500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Coastal Ventures Fund", projectName: "M&A Due Diligence", serviceLine: "Advisory", clientTenure: "3 Years", currentFixedFee: 365000, currentAdminFee: 36500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Midwest Grain Corp", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "10 Years", currentFixedFee: 158000, currentAdminFee: 15800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Midwest Grain Corp", projectName: "Federal Tax Planning", serviceLine: "Tax", clientTenure: "10 Years", currentFixedFee: 68000, currentAdminFee: 6800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Midwest Grain Corp", projectName: "Full Acctg Outsourcing", serviceLine: "Accounting", clientTenure: "10 Years", currentFixedFee: 132000, currentAdminFee: 13200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Paramount Hotel Group", projectName: "Financial Stmt Audit", serviceLine: "Audit & Assurance", clientTenure: "8 Years", currentFixedFee: 225000, currentAdminFee: 22500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Paramount Hotel Group", projectName: "Business Performance", serviceLine: "Advisory", clientTenure: "8 Years", currentFixedFee: 315000, currentAdminFee: 31500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Paramount Hotel Group", projectName: "State & Local Tax", serviceLine: "Tax", clientTenure: "8 Years", currentFixedFee: 72000, currentAdminFee: 7200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Heritage Family Office", projectName: "Estate & Trust Tax", serviceLine: "Tax", clientTenure: "14 Years", currentFixedFee: 145000, currentAdminFee: 14500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Heritage Family Office", projectName: "Wealth Strategy", serviceLine: "Advisory", clientTenure: "14 Years", currentFixedFee: 195000, currentAdminFee: 19500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "TechVault Solutions", projectName: "SOC 2 Attestation", serviceLine: "Audit & Assurance", clientTenure: "2 Years", currentFixedFee: 95000, currentAdminFee: 9500, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "TechVault Solutions", projectName: "Tech Implementation", serviceLine: "Advisory", clientTenure: "2 Years", currentFixedFee: 248000, currentAdminFee: 24800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "TechVault Solutions", projectName: "R&D Tax Credits", serviceLine: "Tax", clientTenure: "2 Years", currentFixedFee: 82000, currentAdminFee: 8200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Sunbelt Medical Center", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "5 Years", currentFixedFee: 298000, currentAdminFee: 29800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Sunbelt Medical Center", projectName: "Internal Audit Support", serviceLine: "Advisory", clientTenure: "5 Years", currentFixedFee: 142000, currentAdminFee: 14200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Keystone Industries", projectName: "Annual Audit FY26", serviceLine: "Audit & Assurance", clientTenure: "11 Years", currentFixedFee: 182000, currentAdminFee: 18200, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Keystone Industries", projectName: "Entity Tax Strategy", serviceLine: "Tax", clientTenure: "11 Years", currentFixedFee: 78000, currentAdminFee: 7800, scopeChangePct: 0, recPriceIncreasePct: 10 },
  { clientName: "Keystone Industries", projectName: "AP/AR Management", serviceLine: "Accounting", clientTenure: "11 Years", currentFixedFee: 65000, currentAdminFee: 6500, scopeChangePct: 0, recPriceIncreasePct: 10 },
];

const psPartners = ["D. McAllister", "C. Vasquez", "H. Brennan", "N. Okafor", "J. Lindström", "P. Ashworth", "M. Delacroix", "S. Reeves"];
const psServiceLines = ["Strategy", "Technology", "Operations", "Human Capital", "Risk & Compliance", "Digital", "Change Management", "Data & Analytics"];

const psEngagements: Engagement[] = [
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

export function generateTableData(instanceId?: number): RowData[] {
  const isPS = instanceId === 415;
  const sourceEngagements = isPS ? psEngagements : engagements;
  const sourcePartners = isPS ? psPartners : partners;
  const sourceReasons = isPS ? psReasons : reasons;
  return sourceEngagements.map((eng, i) => {
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

    const base = {
      hasComments: r3 < 0.3,
      status: statuses[statusIdx],
      partnerName: sourcePartners[Math.floor(r4 * sourcePartners.length)],
      clientName: eng.clientName,
      projectName: eng.projectName,
      serviceLine: eng.serviceLine,
      clientTenure: eng.clientTenure,
      retentionBucket: retentionBuckets[Math.floor(r5 * retentionBuckets.length)],
      clientRenewalStatus: renewalStatuses[Math.floor(r2 * renewalStatuses.length)],
      revisionReason: sourceReasons[Math.floor(r3 * sourceReasons.length)],
      clientCommStatus: commStatuses[commIdx],
    };

    if (isPS && eng.qtyHrs && eng.billRate && eng.vcPerHr) {
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
        ...base,
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
    }

    const fixedFeeAfterScope = Math.round(eng.currentFixedFee * (1 + eng.scopeChangePct / 100));
    const recFixedFee = Math.round(fixedFeeAfterScope * (1 + eng.recPriceIncreasePct / 100));
    const revisedAdjust = r1 < 0.3 ? -0.02 : r1 < 0.6 ? 0 : 0.01;
    const revisedFixedFee = Math.round(recFixedFee * (1 + revisedAdjust));
    const revisedPriceIncreasePct = Math.round(((revisedFixedFee - eng.currentFixedFee) / eng.currentFixedFee) * 1000) / 10;
    const revisedAdminFee = Math.round(eng.currentAdminFee * (1 + revisedPriceIncreasePct / 100));
    const revisedTotalFee = revisedFixedFee + revisedAdminFee;
    const currentTotal = eng.currentFixedFee + eng.currentAdminFee;
    const revisedImpact = revisedTotalFee - currentTotal;
    const recTotal = recFixedFee + Math.round(eng.currentAdminFee * (1 + eng.recPriceIncreasePct / 100));
    const impactDelta = revisedTotalFee - recTotal;

    const custAcceptedFixedFee = isFinalized ? (r7 < 0.7 ? revisedFixedFee : Math.round(revisedFixedFee * 0.98)) : null;
    const custAcceptedAdminFee = isFinalized ? (r7 < 0.7 ? revisedAdminFee : Math.round(revisedAdminFee * 0.98)) : null;
    const finalTotalFee = custAcceptedFixedFee !== null && custAcceptedAdminFee !== null ? custAcceptedFixedFee + custAcceptedAdminFee : null;
    const finalTotalPct = finalTotalFee !== null ? Math.round(((finalTotalFee - currentTotal) / currentTotal) * 1000) / 10 : null;

    return {
      ...base,
      currentFixedFee: eng.currentFixedFee,
      scopeChangePct: eng.scopeChangePct,
      fixedFeeAfterScope,
      recPriceIncreasePct: eng.recPriceIncreasePct,
      recFixedFee,
      revisedFixedFee,
      revisedPriceIncreasePct,
      currentAdminFee: eng.currentAdminFee,
      revisedAdminFee,
      revisedTotalFee,
      revisedImpact,
      impactDelta,
      custAcceptedFixedFee,
      custAcceptedAdminFee,
      finalTotalFee,
      finalTotalPct,
    };
  });
}
