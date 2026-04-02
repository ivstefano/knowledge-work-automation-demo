import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type Step = 'upload' | 'rules' | 'analysis' | 'escalation' | 'evaluation';

interface Rule {
  id: string;
  title: string;
  source: string;
  description: string;
  active: boolean;
}

interface Flag {
  id: number;
  title: string;
  ruleId: string;
  severity: 'high' | 'medium' | 'low';
  issue: string;
  contractRef: string;
  regulationRef: string;
  confidence: number;
  likelihood: string;
  impact: string;
  feedback: 'pending' | 'agreed' | 'dismissed' | 'skipped';
  escalate: boolean;
  contractName: string;
  contractClauseNum: number;
  regulationClauseId: string;
}

interface RegulationClause {
  id: string;
  section: string;
  text: string;
}

interface AuditEntry { time: string; text: string; }

interface UploadedFile {
  name: string;
  selected: boolean;
  flagCount: number;
  type: 'contract' | 'regulation' | 'registry';
  pdfPath?: string;
  previewText: string;
}

interface VendorRow {
  vendorId: string;
  vendorName: string;
  contractId: string;
  responsibleTeam: string;
  contact: string;
  riskTier: string;
}

interface Regulation {
  id: string;
  label: string;
  description: string;
  selected: boolean;
  autoSuggested: boolean;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-copilot',
  imports: [CommonModule, FormsModule],
  templateUrl: './copilot.component.html',
  styleUrl: './copilot.component.scss',
})
export class CopilotComponent {
  currentStep: Step = 'upload';
  steps: { key: Step; label: string }[] = [
    { key: 'upload', label: 'Upload' },
    { key: 'rules', label: 'Rules' },
    { key: 'analysis', label: 'Analysis' },
    { key: 'escalation', label: 'Escalation' },
    { key: 'evaluation', label: 'Evaluation' },
  ];

  // ── Upload ──
  dragOver = false;
  uploadedFiles: UploadedFile[] = [
    { name: 'DLC-2026-Alpha.pdf', selected: true, flagCount: 4, type: 'contract', previewText: 'Draft Digital Lending Contract — Decentralized Peer-to-Peer Loan Agreement between Borrower Alpha (0x4fA6...B1cE) and Lender Omega (0x9eD5...C8fF). Principal: 10,000 USDC, Term: 180 Days, Collateral: 5 ETH.' },
    { name: 'SDALP-v2.1-2026.pdf', selected: true, flagCount: 0, type: 'regulation', previewText: 'Standardized Digital Asset Lending Protocol v2.1 — Industry standard for DeFi lending contracts covering interest rate transparency, liquidation procedures, collateral requirements, and audit obligations.' },
    { name: 'vendor_registry.xlsx', selected: true, flagCount: 0, type: 'registry', previewText: 'Vendor registry containing counterparty details: Borrower Alpha (High risk), Lender Omega (Medium risk), Liquidation Agent (Low risk).' },
  ];
  previewFile: UploadedFile | null = null;
  ruleSource: 'database' | 'upload' | 'manual' = 'database';
  regulationSearch = '';
  regulations: Regulation[] = [
    { id: 'SDALP', label: 'SDALP', description: 'Standardized Digital Asset Lending Protocol', selected: true, autoSuggested: true },
    { id: 'DORA', label: 'DORA', description: 'Digital Operational Resilience Act', selected: false, autoSuggested: true },
    { id: 'EU_AI', label: 'EU AI Act', description: 'Classification & Transparency Rules', selected: false, autoSuggested: false },
    { id: 'CONSUMER', label: 'Consumer Rights Directive', description: 'EU Consumer Protection Law', selected: false, autoSuggested: false },
    { id: 'GDPR', label: 'GDPR', description: 'General Data Protection Regulation', selected: false, autoSuggested: false },
    { id: 'MIFID2', label: 'MiFID II', description: 'Markets in Financial Instruments', selected: false, autoSuggested: false },
  ];

  // ── Vendor Registry ──
  vendorRegistry: VendorRow[] = [
    { vendorId: 'V-001', vendorName: 'Borrower Alpha (0x4fA6...B1cE)', contractId: 'DLC-2026-Alpha', responsibleTeam: 'DeFi Risk — Sarah Chen', contact: 'sarah.chen@iris.ai', riskTier: 'High' },
    { vendorId: 'V-002', vendorName: 'Lender Omega (0x9eD5...C8fF)', contractId: 'DLC-2026-Alpha', responsibleTeam: 'Compliance — John Smith', contact: 'john.smith@iris.ai', riskTier: 'Medium' },
    { vendorId: 'V-003', vendorName: 'Liquidation Agent', contractId: 'DLC-2026-Alpha', responsibleTeam: 'Smart Contract Ops — Mike Chen', contact: 'mike.chen@iris.ai', riskTier: 'Low' },
  ];

  get fileUploaded(): boolean { return this.uploadedFiles.length > 0; }
  get selectedRegCount(): number { return this.regulations.filter(r => r.selected).length; }
  get filteredRegulations(): Regulation[] {
    const q = this.regulationSearch.toLowerCase();
    return q ? this.regulations.filter(r => r.label.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)) : this.regulations;
  }

  // ── Rules ──
  savedRulesetVisible = true;
  customRuleForm = { id: '', title: '', description: '' };
  rules: Rule[] = [
    { id: 'SDALP-2.1.1', title: 'Interest Rate Transparency', source: 'SDALP §2.1.1', description: 'DLC MUST specify exact formula for interest rates. Variable rates require 72h notice and a hard-coded cap.', active: true },
    { id: 'SDALP-2.1.2', title: 'Liquidation Grace Period', source: 'SDALP §2.1.2', description: 'Mandatory 48-hour grace period after LTV crosses threshold before any liquidation can commence.', active: true },
    { id: 'SDALP-2.2', title: 'Security Audit Required', source: 'SDALP §2.2', description: 'All DLCs MUST complete independent security audit. Audit report MUST be publicly linked.', active: true },
    { id: 'SDALP-2.3.1', title: 'Collateral Diversification', source: 'SDALP §2.3.1', description: 'Single collateral asset SHALL NOT exceed 90% of total assets in the contract pool.', active: true },
    { id: 'CUST-1', title: 'Governance Override Check', source: 'Custom', description: 'Any governance mechanism that can unilaterally modify contract terms must be flagged for review.', active: true },
  ];

  // ── Contract text (from DLC-2026-Alpha) ──
  contractClauses = [
    { num: 1, text: 'Draft Digital Lending Contract (DLC-2026-Alpha). Decentralized Peer-to-Peer Loan Agreement. Effective Date: 2 April 2026. Borrower: 0x4fA6...B1cE (Borrower Alpha). Lender: 0x9eD5...C8fF (Lender Omega).' },
    { num: 2, text: '§1.1 Principal and Term — Principal Asset: 10,000 USDC. Term: 180 Days. Repayment Asset: USDC.' },
    { num: 3, text: '§1.2 Interest Rate — The annual interest rate is set at 10% APR, compounded hourly. The interest rate is subject to dynamic adjustment by the Lender\'s governance mechanism (0x1A2B...3C4D). Adjustments may occur immediately upon governance consensus.' },
    { num: 4, text: '§1.3 Collateral — Collateral Asset: 5 ETH. Collateral Deposit Address: 0x4fA6...B1cE (Locked in Smart Contract Escrow).' },
    { num: 5, text: '§2.1 LTV and Liquidation Threshold — LTV at Origination: based on ETH/USDC price feed. Liquidation Threshold: 85% LTV.' },
    { num: 6, text: '§2.2 Liquidation Procedure — If LTV exceeds 85%, the Smart Contract will IMMEDIATELY initiate sale of Collateral Asset (ETH) via public AMM pool. No grace period specified.' },
    { num: 7, text: '§2.3 Fees — A liquidation fee of 1% of the sold collateral value will be deducted and paid to the Liquidation Agent.' },
    { num: 8, text: '§3 Governing Clause — Borrower warrants 5 ETH collateral represents 100% of assets used as collateral. Contract allows addition of further collateral only with written consent, overriding any pool diversification requirements.' },
    { num: 9, text: '§4 Audit — This DLC has not yet been submitted for an independent security audit but is pending internal review.' },
  ];

  // ── Regulation text (from SDALP v2.1) ──
  regulationClauses: RegulationClause[] = [
    { id: 'SDALP-2.1.1', section: '§2.1.1', text: 'Interest Rate Transparency — DLC MUST specify exact formula for interest rate calculation. Variable rates MUST include: (a) 72-hour advance notice to borrower before any rate change, (b) a hard-coded interest rate cap in the smart contract, (c) public on-chain governance vote record for any adjustment.' },
    { id: 'SDALP-2.1.2', section: '§2.1.2', text: 'Liquidation Grace Period — A mandatory 48-hour grace period SHALL apply after the Loan-to-Value ratio crosses the liquidation threshold. During this period: (a) the borrower MUST be notified via on-chain event, (b) the borrower MAY deposit additional collateral, (c) NO liquidation action may commence.' },
    { id: 'SDALP-2.2', section: '§2.2', text: 'Security Audit Requirement — All Digital Lending Contracts MUST complete an independent security audit by a certified blockchain auditor before deployment. The audit report MUST be publicly linked on-chain and include: scope, methodology, findings, and remediation status.' },
    { id: 'SDALP-2.3.1', section: '§2.3.1', text: 'Collateral Diversification — Single collateral asset SHALL NOT exceed 90% of total assets in the contract pool. Contracts accepting single-asset collateral MUST include automated rebalancing triggers or explicit regulatory exemption documentation.' },
    { id: 'SDALP-3.1', section: '§3.1', text: 'Governance Safeguards — Any governance mechanism with authority to modify contract terms MUST require: (a) multi-signature approval (minimum 3-of-5), (b) 7-day timelock on parameter changes, (c) borrower notification and opt-out window before changes take effect.' },
  ];

  // ── Analysis ──
  likelihoodLevels = ['Rare', 'Unlikely', 'Moderate', 'Likely', 'Very Likely'] as const;
  impactLevels = ['Trivial', 'Minor', 'Moderate', 'Major', 'Extreme'] as const;
  minLikelihood = 2;
  minImpact = 2;

  flags: Flag[] = [
    {
      id: 1, title: 'Interest Rate Not Transparent', ruleId: 'SDALP-2.1.1', severity: 'high',
      issue: 'Interest rate is subject to immediate dynamic adjustment by governance mechanism without 72h notice or hard-coded cap — violates SDALP §2.1.1.',
      contractRef: '§1.2: "subject to dynamic adjustment by the Lender\'s governance mechanism... Adjustments may occur immediately"',
      regulationRef: 'SDALP §2.1.1: "Variable rates require 72h notice and a hard-coded cap"',
      confidence: 96, likelihood: 'Very Likely', impact: 'Extreme',
      feedback: 'pending', escalate: true, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 3, regulationClauseId: 'SDALP-2.1.1',
    },
    {
      id: 2, title: 'No Liquidation Grace Period', ruleId: 'SDALP-2.1.2', severity: 'high',
      issue: 'Contract specifies IMMEDIATE liquidation with no grace period — directly violates mandatory 48-hour grace period requirement.',
      contractRef: '§2.2: "Smart Contract will IMMEDIATELY initiate sale... No grace period specified"',
      regulationRef: 'SDALP §2.1.2: "Mandatory 48-hour grace period after LTV crosses threshold"',
      confidence: 98, likelihood: 'Very Likely', impact: 'Extreme',
      feedback: 'pending', escalate: true, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 6, regulationClauseId: 'SDALP-2.1.2',
    },
    {
      id: 3, title: 'Security Audit Missing', ruleId: 'SDALP-2.2', severity: 'medium',
      issue: 'Contract has not been submitted for independent security audit — only "pending internal review" is mentioned.',
      contractRef: '§4: "has not yet been submitted for an independent security audit but is pending internal review"',
      regulationRef: 'SDALP §2.2: "All DLCs MUST complete independent security audit. Audit report MUST be publicly linked"',
      confidence: 92, likelihood: 'Likely', impact: 'Major',
      feedback: 'pending', escalate: true, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 9, regulationClauseId: 'SDALP-2.2',
    },
    {
      id: 4, title: 'Collateral Concentration Risk', ruleId: 'SDALP-2.3.1', severity: 'high',
      issue: 'Collateral is 100% single asset (ETH) and contract explicitly overrides diversification requirements.',
      contractRef: '§3: "5 ETH collateral represents 100% of assets... overriding any pool diversification requirements"',
      regulationRef: 'SDALP §2.3.1: "Single collateral asset SHALL NOT exceed 90% of total assets"',
      confidence: 95, likelihood: 'Very Likely', impact: 'Major',
      feedback: 'pending', escalate: true, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 8, regulationClauseId: 'SDALP-2.3.1',
    },
    {
      id: 5, title: 'Unilateral Governance Override', ruleId: 'CUST-1', severity: 'medium',
      issue: 'Governance mechanism (0x1A2B...3C4D) can unilaterally modify interest rate terms without borrower consent.',
      contractRef: '§1.2: "dynamic adjustment by the Lender\'s governance mechanism (0x1A2B...3C4D)"',
      regulationRef: 'Custom Rule: "Any governance mechanism that can unilaterally modify contract terms must be flagged"',
      confidence: 89, likelihood: 'Likely', impact: 'Major',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 3, regulationClauseId: 'SDALP-3.1',
    },
    {
      id: 6, title: 'Hourly Compounding Disclosure', ruleId: 'SDALP-2.1.1', severity: 'medium',
      issue: 'Contract specifies hourly compounding but does not disclose the effective annual rate (EAR) — borrower may not understand true cost.',
      contractRef: '§1.2: "10% APR, compounded hourly"',
      regulationRef: 'SDALP §2.1.1: "DLC MUST specify exact formula for interest rate calculation"',
      confidence: 74, likelihood: 'Moderate', impact: 'Moderate',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 3, regulationClauseId: 'SDALP-2.1.1',
    },
    {
      id: 7, title: 'Liquidation Fee Exceeds Guidance', ruleId: 'SDALP-2.1.2', severity: 'low',
      issue: 'Liquidation fee of 1% is within range but lacks a cap mechanism — could compound with slippage in volatile markets.',
      contractRef: '§2.3: "liquidation fee of 1% of the sold collateral value"',
      regulationRef: 'SDALP §2.1.2: Best practice recommends capped liquidation fees',
      confidence: 52, likelihood: 'Unlikely', impact: 'Minor',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 7, regulationClauseId: 'SDALP-2.1.2',
    },
    {
      id: 8, title: 'Price Feed Source Not Specified', ruleId: 'SDALP-2.3.1', severity: 'medium',
      issue: 'LTV calculation references "ETH/USDC price feed" but does not specify oracle source — risk of price manipulation.',
      contractRef: '§2.1: "based on ETH/USDC price feed"',
      regulationRef: 'SDALP §2.3.1: Collateral valuation must use verifiable, tamper-resistant price sources',
      confidence: 81, likelihood: 'Moderate', impact: 'Major',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 5, regulationClauseId: 'SDALP-2.3.1',
    },
    {
      id: 9, title: 'Missing Borrower Notification Mechanism', ruleId: 'SDALP-2.1.2', severity: 'low',
      issue: 'No on-chain event or notification mechanism specified to alert borrower when LTV approaches liquidation threshold.',
      contractRef: '§2.1: No notification mechanism referenced',
      regulationRef: 'SDALP §2.1.2: "borrower MUST be notified via on-chain event"',
      confidence: 68, likelihood: 'Moderate', impact: 'Minor',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 5, regulationClauseId: 'SDALP-2.1.2',
    },
    {
      id: 10, title: 'Escrow Address Reuse', ruleId: 'SDALP-2.2', severity: 'low',
      issue: 'Collateral deposit address matches borrower address — no dedicated escrow contract referenced, minor security concern.',
      contractRef: '§1.3: "Collateral Deposit Address: 0x4fA6...B1cE"',
      regulationRef: 'SDALP §2.2: Audit should verify isolation of collateral in dedicated escrow',
      confidence: 45, likelihood: 'Unlikely', impact: 'Moderate',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 4, regulationClauseId: 'SDALP-2.2',
    },
    {
      id: 11, title: 'Repayment Currency Mismatch Risk', ruleId: 'SDALP-2.1.1', severity: 'low',
      issue: 'Repayment is in USDC while collateral is ETH — no mention of handling depegging scenarios for stablecoins.',
      contractRef: '§1.1: "Principal Asset: 10,000 USDC... Repayment Asset: USDC"',
      regulationRef: 'SDALP §2.1.1: Interest and repayment terms should account for asset-specific risks',
      confidence: 38, likelihood: 'Rare', impact: 'Minor',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 2, regulationClauseId: 'SDALP-2.1.1',
    },
    {
      id: 12, title: 'AMM Pool Slippage Unaddressed', ruleId: 'SDALP-2.1.2', severity: 'low',
      issue: 'Liquidation via "public AMM pool" does not specify slippage tolerance or minimum output — borrower could suffer excess loss.',
      contractRef: '§2.2: "initiate sale of Collateral Asset (ETH) via public AMM pool"',
      regulationRef: 'SDALP §2.1.2: Liquidation procedures should protect borrower from excessive slippage',
      confidence: 55, likelihood: 'Unlikely', impact: 'Moderate',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 6, regulationClauseId: 'SDALP-2.1.2',
    },
    {
      id: 13, title: 'Written Consent Mechanism Undefined', ruleId: 'CUST-1', severity: 'low',
      issue: 'Contract references "written consent" for additional collateral but does not define how consent is obtained on-chain.',
      contractRef: '§3: "addition of further collateral only with written consent"',
      regulationRef: 'Custom Rule: On-chain contracts should use verifiable consent mechanisms',
      confidence: 42, likelihood: 'Rare', impact: 'Trivial',
      feedback: 'pending', escalate: false, contractName: 'DLC-2026-Alpha.pdf',
      contractClauseNum: 8, regulationClauseId: 'SDALP-3.1',
    },
  ];

  get filteredFlags(): Flag[] {
    return this.flags.filter(f => {
      const li = this.likelihoodLevels.indexOf(f.likelihood as any);
      const im = this.impactLevels.indexOf(f.impact as any);
      return li >= this.minLikelihood && im >= this.minImpact;
    });
  }
  get allFlagsReviewed(): boolean {
    return this.filteredFlags.every(f => f.feedback !== 'pending');
  }
  get reviewedFlagCount(): number {
    return this.filteredFlags.filter(f => f.feedback !== 'pending').length;
  }
  flagCountForFile(name: string): number {
    return this.filteredFlags.filter(f => f.contractName === name).length;
  }

  // ── Escalation ──
  escalationTeams = [
    { name: 'Legal / Compliance — John Smith', selected: true },
    { name: 'DeFi Risk — Sarah Chen', selected: false },
    { name: 'Smart Contract Ops — Mike Chen', selected: false },
    { name: 'Executive Risk Committee', selected: false },
  ];
  escalationComment = '';
  escalationSent = false;

  auditTrail: AuditEntry[] = [
    { time: '14:32', text: 'DLC-2026-Alpha.pdf + SDALP-v2.1-2026.pdf uploaded' },
    { time: '14:33', text: 'SDALP selected as primary regulatory source' },
    { time: '14:33', text: '5 compliance rules loaded (1 custom), all active' },
    { time: '14:34', text: 'Analysis complete — 5 findings flagged in DLC-2026-Alpha' },
    { time: '14:35', text: 'User agreed with Flag 1, 2, 3, 4. Dismissed Flag 5.' },
    { time: '14:36', text: 'Escalation initiated to Legal / Compliance Team' },
  ];

  get escalatableFlags(): Flag[] { return this.filteredFlags.filter(f => f.escalate && f.feedback === 'agreed'); }
  get flaggedFiles(): UploadedFile[] {
    const names = new Set(this.filteredFlags.filter(f => f.feedback === 'agreed').map(f => f.contractName));
    return this.uploadedFiles.filter(f => names.has(f.name));
  }
  get selectedEscalationFiles(): UploadedFile[] { return this.flaggedFiles.filter(f => f.selected); }
  get totalRisk(): string {
    const count = this.escalatableFlags.length;
    if (count === 0) return '€0';
    return '€' + (count * 7_000_000).toLocaleString();
  }
  get contractNames(): string[] {
    return [...new Set(this.escalatableFlags.map(f => f.contractName))];
  }
  get selectedTeamCount(): number { return this.escalationTeams.filter(t => t.selected).length; }
  get canSendEscalation(): boolean {
    return this.selectedEscalationFiles.length > 0 && this.escalatableFlags.length > 0 && this.selectedTeamCount > 0;
  }

  // ── Evaluation ──
  evalMetrics = { accuracy: '4.2', total: 5, findings: 12, agreed: 8, dismissed: 3 };
  comparisonTable = [
    { metric: 'True violations found', pipeline: '8 / 10', baseline: '5 / 10' },
    { metric: 'False positives', pipeline: '3', baseline: '7' },
    { metric: 'Missed violations', pipeline: '2', baseline: '5' },
    { metric: 'Precision', pipeline: '73%', baseline: '42%' },
  ];
  perRuleAccuracy = [
    { rule: 'SDALP-2.1.1 Interest Rate Transparency', correct: 5, total: 5, color: '#4ade80' },
    { rule: 'SDALP-2.1.2 Liquidation Grace Period', correct: 5, total: 5, color: '#4ade80' },
    { rule: 'SDALP-2.2 Security Audit', correct: 4, total: 5, color: '#4ade80' },
    { rule: 'SDALP-2.3.1 Collateral Diversification', correct: 3, total: 4, color: '#facc15' },
    { rule: 'CUST-1 Governance Override', correct: 3, total: 4, color: '#4ade80' },
  ];

  // ── Chat ──
  chatOpen = false;
  chatInput = '';
  chatMessages: ChatMessage[] = [
    { role: 'assistant', text: 'I can help you understand the compliance implications of your contracts. What would you like to know?' },
  ];

  get chatContextTitle(): string {
    switch (this.currentStep) {
      case 'upload': return 'Upload Assistant';
      case 'rules': return 'Rules Advisor';
      case 'analysis': return 'Analysis — SDALP Compliance';
      case 'escalation': return 'Escalation Helper';
      case 'evaluation': return 'Evaluation Insights';
    }
  }

  // ── Analysis contract selector ──
  selectedContractView = 'DLC-2026-Alpha.pdf';

  // ── Computed ──
  get activeRuleCount(): number { return this.rules.filter(r => r.active).length; }
  get stepIndex(): number { return this.steps.findIndex(s => s.key === this.currentStep); }
  get uniqueContractNames(): string[] {
    return [...new Set(this.flags.map(f => f.contractName))];
  }
  get filteredFlagsByView(): Flag[] {
    return this.filteredFlags.filter(f => f.contractName === this.selectedContractView || this.selectedContractView === 'all');
  }

  // Dynamic highlights based on filtered flags
  get flaggedContractClauseNums(): Set<number> {
    return new Set(this.filteredFlagsByView.map(f => f.contractClauseNum));
  }
  get flaggedRegulationClauseIds(): Set<string> {
    return new Set(this.filteredFlagsByView.map(f => f.regulationClauseId));
  }
  getClauseHighlight(clauseNum: number): string {
    const matching = this.filteredFlagsByView.filter(f => f.contractClauseNum === clauseNum);
    if (matching.length === 0) return '';
    return matching.some(f => f.severity === 'high') ? 'violation' : 'warning';
  }
  getRegHighlight(clauseId: string): string {
    const matching = this.filteredFlagsByView.filter(f => f.regulationClauseId === clauseId);
    if (matching.length === 0) return '';
    return matching.some(f => f.severity === 'high') ? 'violation' : 'warning';
  }
  getEscalationClauseHighlight(clauseNum: number): string {
    const matching = this.escalatableFlags.filter(f => f.contractClauseNum === clauseNum);
    if (matching.length === 0) return '';
    return matching.some(f => f.severity === 'high') ? 'violation' : 'warning';
  }

  selectedFlagId: number | null = null;
  selectFlag(f: Flag) {
    this.selectedFlagId = this.selectedFlagId === f.id ? null : f.id;
  }
  isClauseFocused(clauseNum: number): boolean {
    if (this.selectedFlagId === null) return false;
    return this.filteredFlagsByView.some(f => f.id === this.selectedFlagId && f.contractClauseNum === clauseNum);
  }
  isRegFocused(clauseId: string): boolean {
    if (this.selectedFlagId === null) return false;
    return this.filteredFlagsByView.some(f => f.id === this.selectedFlagId && f.regulationClauseId === clauseId);
  }

  // ── Dynamic eval metrics ──
  get dynamicEvalMetrics() {
    const agreed = this.flags.filter(f => f.feedback === 'agreed').length;
    const dismissed = this.flags.filter(f => f.feedback === 'dismissed').length;
    const neutral = this.flags.filter(f => f.feedback === 'skipped').length;
    const reviewed = agreed + dismissed + neutral;
    const accuracy = reviewed > 0 ? ((agreed / reviewed) * 5).toFixed(1) : this.evalMetrics.accuracy;
    return {
      accuracy,
      total: 5,
      findings: this.flags.length,
      agreed: agreed || this.evalMetrics.agreed,
      dismissed: dismissed || this.evalMetrics.dismissed,
    };
  }

  // ── Methods ──
  goTo(step: Step) { this.currentStep = step; }
  nextStep() {
    const i = this.stepIndex;
    if (i < this.steps.length - 1) this.currentStep = this.steps[i + 1].key;
  }

  // Upload
  addFiles(names: string[]) {
    for (const n of names) {
      if (!this.uploadedFiles.find(f => f.name === n)) {
        const flagCount = this.flags.filter(f => f.contractName === n).length;
        this.uploadedFiles.push({ name: n, selected: true, flagCount, type: 'contract', previewText: '' });
      }
    }
  }
  removeFile(file: UploadedFile) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }
  onFileDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    this.addFiles(['DLC-2026-Alpha.pdf', 'SDALP-v2.1-2026.pdf']);
  }
  onDragOver(e: DragEvent) { e.preventDefault(); this.dragOver = true; }
  onDragLeave() { this.dragOver = false; }
  onFileSelect() {
    this.addFiles(['DLC-2026-Alpha.pdf', 'SDALP-v2.1-2026.pdf', 'vendor_registry.xlsx']);
  }

  // Rules
  loadSavedRuleset() { this.savedRulesetVisible = false; }
  dismissSavedBanner() { this.savedRulesetVisible = false; }
  addCustomRule() {
    if (this.customRuleForm.title) {
      const existingCount = this.rules.filter(r => r.id.startsWith('CUST-')).length;
      this.rules.push({
        id: `CUST-${existingCount + 1}`,
        title: this.customRuleForm.title,
        source: 'Custom',
        description: this.customRuleForm.description,
        active: true,
      });
      this.customRuleForm = { id: '', title: '', description: '' };
    }
  }

  // Analysis
  toggleFeedback(flag: Flag, fb: 'agreed' | 'dismissed' | 'skipped') {
    flag.feedback = flag.feedback === fb ? 'pending' : fb;
    flag.escalate = flag.feedback === 'agreed';
  }

  // Escalation
  sendEscalation() {
    this.escalationSent = true;
    setTimeout(() => this.nextStep(), 1500);
  }

  // Chat
  toggleChat() { this.chatOpen = !this.chatOpen; }
  sendChat() {
    if (!this.chatInput.trim()) return;
    this.chatMessages.push({ role: 'user', text: this.chatInput });
    const q = this.chatInput.toLowerCase();
    this.chatInput = '';
    setTimeout(() => {
      if (q.includes('interest') || q.includes('rate') || q.includes('transparency')) {
        this.chatMessages.push({ role: 'assistant', text: 'Under SDALP §2.1.1, variable interest rates require 72-hour advance notice, a hard-coded cap in the smart contract, and a public on-chain governance vote. DLC-2026-Alpha allows immediate adjustment by governance mechanism (0x1A2B...3C4D) without any of these safeguards — this is the highest-severity finding.' });
      } else if (q.includes('liquidation') || q.includes('grace')) {
        this.chatMessages.push({ role: 'assistant', text: 'SDALP §2.1.2 mandates a 48-hour grace period after LTV crosses the liquidation threshold. The borrower must be notified via on-chain event and may deposit additional collateral. DLC-2026-Alpha specifies immediate liquidation with no grace period — a direct violation.' });
      } else if (q.includes('compliant') || q.includes('clause') || q.includes('fix')) {
        this.chatMessages.push({ role: 'assistant', text: 'A compliant interest rate clause would state: "The annual interest rate is fixed at 10% APR. Any adjustment requires 72-hour advance on-chain notice, governance vote with minimum 3-of-5 approval, and shall not exceed the hard-coded cap of 15% APR embedded in the smart contract."' });
      } else if (q.includes('collateral') || q.includes('diversif')) {
        this.chatMessages.push({ role: 'assistant', text: 'SDALP §2.3.1 requires that no single collateral asset exceeds 90% of the pool. DLC-2026-Alpha uses 100% ETH as collateral and explicitly overrides diversification requirements in §3 — this violates the regulation and concentrates risk.' });
      } else {
        this.chatMessages.push({ role: 'assistant', text: 'Based on the SDALP analysis of DLC-2026-Alpha, I identified 13 potential compliance issues. The most critical are the missing liquidation grace period (§2.2) and uncontrolled interest rate adjustments (§1.2). Would you like me to explain a specific finding?' });
      }
    }, 600);
  }

  // Helpers
  barWidth(correct: number, total: number): number { return (correct / total) * 100; }
  grayWidth(correct: number, total: number): number { return ((total - correct) / total) * 100; }
  flagsByContract(name: string): Flag[] {
    return this.escalatableFlags.filter(f => f.contractName === name);
  }
}
