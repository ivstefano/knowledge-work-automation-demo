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
  feedback: 'pending' | 'agreed' | 'dismissed' | 'neutral';
  escalate: boolean;
  contractName: string;
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
  uploadedFiles: UploadedFile[] = [];
  previewFile: UploadedFile | null = null;
  ruleSource: 'database' | 'upload' | 'manual' = 'database';
  regulationSearch = '';
  regulations: Regulation[] = [
    { id: 'SDALP', label: 'SDALP', description: 'Standardized Digital Asset Lending Protocol', selected: true, autoSuggested: true },
    { id: 'DORA', label: 'DORA', description: 'Digital Operational Resilience Act', selected: false, autoSuggested: false },
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
    { num: 1, text: 'Draft Digital Lending Contract (DLC-2026-Alpha). Decentralized Peer-to-Peer Loan Agreement. Effective Date: 2 April 2026. Borrower: 0x4fA6...B1cE (Borrower Alpha). Lender: 0x9eD5...C8fF (Lender Omega).', highlight: '' },
    { num: 2, text: '§1.1 Principal and Term — Principal Asset: 10,000 USDC. Term: 180 Days. Repayment Asset: USDC.', highlight: '' },
    { num: 3, text: '§1.2 Interest Rate — The annual interest rate is set at 10% APR, compounded hourly. The interest rate is subject to dynamic adjustment by the Lender\'s governance mechanism (0x1A2B...3C4D). Adjustments may occur immediately upon governance consensus.', highlight: 'violation' },
    { num: 4, text: '§1.3 Collateral — Collateral Asset: 5 ETH. Collateral Deposit Address: 0x4fA6...B1cE (Locked in Smart Contract Escrow).', highlight: '' },
    { num: 5, text: '§2.1 LTV and Liquidation Threshold — LTV at Origination: based on ETH/USDC price feed. Liquidation Threshold: 85% LTV.', highlight: '' },
    { num: 6, text: '§2.2 Liquidation Procedure — If LTV exceeds 85%, the Smart Contract will IMMEDIATELY initiate sale of Collateral Asset (ETH) via public AMM pool. No grace period specified.', highlight: 'violation' },
    { num: 7, text: '§2.3 Fees — A liquidation fee of 1% of the sold collateral value will be deducted and paid to the Liquidation Agent.', highlight: '' },
    { num: 8, text: '§3 Governing Clause — Borrower warrants 5 ETH collateral represents 100% of assets used as collateral. Contract allows addition of further collateral only with written consent, overriding any pool diversification requirements.', highlight: 'violation' },
    { num: 9, text: '§4 Audit — This DLC has not yet been submitted for an independent security audit but is pending internal review.', highlight: 'warning' },
  ];

  // ── Analysis ──
  likelihoodLevels = ['Rare', 'Unlikely', 'Moderate', 'Likely', 'Very Likely'] as const;
  impactLevels = ['Trivial', 'Minor', 'Moderate', 'Major', 'Extreme'] as const;
  minLikelihood = 0;
  minImpact = 0;

  flags: Flag[] = [
    {
      id: 1, title: 'Missing Transparency Clause', ruleId: 'EUAI-1', severity: 'high',
      issue: 'Vendor explicitly refuses to disclose AI methodology — violates transparency requirements for high-risk AI systems.',
      contractRef: '§4: "shall not be required to disclose the methodology..."',
      regulationRef: '"Providers of high-risk AI systems shall ensure transparency..."',
      confidence: 94, likelihood: 'Very Likely', impact: 'Extreme',
      feedback: 'pending', escalate: true, contractName: 'GOV-UK-2024-AI-001.pdf',
    },
    {
      id: 2, title: 'Late Incident Reporting', ruleId: 'DORA-3', severity: 'high',
      issue: '30 business days notification window far exceeds DORA\'s "without undue delay" requirement.',
      contractRef: '§6: "notify the Client within 30 business days"',
      regulationRef: '"shall report major ICT-related incidents without undue delay"',
      confidence: 91, likelihood: 'Likely', impact: 'Major',
      feedback: 'pending', escalate: true, contractName: 'GOV-UK-2024-AI-001.pdf',
    },
    {
      id: 3, title: 'Insufficient Data Retention', ruleId: 'EUAI-2', severity: 'medium',
      issue: '12-month retention may not meet regulatory minimum for AI training data records.',
      contractRef: '§3: "stored for a period of 12 months"',
      regulationRef: '"Training data records shall be maintained for the operational lifetime of the system"',
      confidence: 76, likelihood: 'Moderate', impact: 'Moderate',
      feedback: 'pending', escalate: true, contractName: 'GOV-UK-2024-AI-001.pdf',
    },
    {
      id: 4, title: 'No ICT Risk Framework', ruleId: 'DORA-1', severity: 'medium',
      issue: 'No explicit reference to operational resilience testing or ICT risk framework.',
      contractRef: '§8: No reference found',
      regulationRef: '"Financial entities shall have in place an ICT risk management framework"',
      confidence: 62, likelihood: 'Unlikely', impact: 'Major',
      feedback: 'pending', escalate: false, contractName: 'GOV-UK-2024-AI-001.pdf',
    },
    {
      id: 5, title: 'No Audit Clause', ruleId: 'DORA-2', severity: 'high',
      issue: 'Contract does not include audit rights for third-party ICT service providers.',
      contractRef: 'No audit clause found',
      regulationRef: '"Financial entities shall ensure contractual arrangements include audit rights"',
      confidence: 88, likelihood: 'Likely', impact: 'Extreme',
      feedback: 'pending', escalate: true, contractName: 'GOV-UK-2024-AI-002.pdf',
    },
  ];

  get filteredFlags(): Flag[] {
    return this.flags.filter(f => {
      const li = this.likelihoodLevels.indexOf(f.likelihood as any);
      const im = this.impactLevels.indexOf(f.impact as any);
      return li >= this.minLikelihood && im >= this.minImpact;
    });
  }

  // ── Escalation ──
  escalationTeam = 'Legal / Compliance Team — John Smith';
  escalationComment = '';
  escalationSent = false;

  auditTrail: AuditEntry[] = [
    { time: '14:32', text: 'Contracts uploaded by I. Wight' },
    { time: '14:33', text: 'DORA + EU AI Act selected as regulatory sources' },
    { time: '14:33', text: '7 compliance rules loaded (1 custom), 1 disabled by user' },
    { time: '14:34', text: 'Analysis complete — 5 findings flagged across 2 contracts' },
    { time: '14:35', text: 'User agreed with Flag 1, 2, 3, 5. Dismissed Flag 4.' },
    { time: '14:36', text: 'Escalation initiated to Legal / Compliance Team' },
  ];

  get escalatableFlags(): Flag[] { return this.flags.filter(f => f.escalate && f.feedback !== 'dismissed'); }
  get selectedContracts(): UploadedFile[] { return this.uploadedFiles.filter(f => f.selected); }
  get totalRisk(): string {
    const count = this.escalatableFlags.length;
    return '€' + (count * 7).toLocaleString() + ',000,000';
  }
  get contractNames(): string[] {
    return [...new Set(this.escalatableFlags.map(f => f.contractName))];
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
    { rule: 'DORA-3 Incident Reporting', correct: 5, total: 5, color: '#4ade80' },
    { rule: 'EUAI-1 AI Classification', correct: 4, total: 5, color: '#4ade80' },
    { rule: 'EUAI-2 Data Governance', correct: 2, total: 3, color: '#facc15' },
    { rule: 'DORA-1 ICT Risk Mgmt', correct: 1, total: 4, color: '#f87171' },
    { rule: 'DORA-2 Third-Party Risk', correct: 3, total: 4, color: '#4ade80' },
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
      case 'analysis': return 'Analysis — DORA & EU AI Act';
      case 'escalation': return 'Escalation Helper';
      case 'evaluation': return 'Evaluation Insights';
    }
  }

  // ── Analysis contract selector ──
  selectedContractView = 'GOV-UK-2024-AI-001.pdf';

  // ── Computed ──
  get activeRuleCount(): number { return this.rules.filter(r => r.active).length; }
  get stepIndex(): number { return this.steps.findIndex(s => s.key === this.currentStep); }
  get uniqueContractNames(): string[] {
    return [...new Set(this.flags.map(f => f.contractName))];
  }
  get filteredFlagsByView(): Flag[] {
    return this.filteredFlags.filter(f => f.contractName === this.selectedContractView || this.selectedContractView === 'all');
  }

  // ── Dynamic eval metrics ──
  get dynamicEvalMetrics() {
    const agreed = this.flags.filter(f => f.feedback === 'agreed').length;
    const dismissed = this.flags.filter(f => f.feedback === 'dismissed').length;
    const neutral = this.flags.filter(f => f.feedback === 'neutral').length;
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
        this.uploadedFiles.push({ name: n, selected: true, flagCount });
      }
    }
  }
  removeFile(file: UploadedFile) {
    this.uploadedFiles = this.uploadedFiles.filter(f => f !== file);
  }
  onFileDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    this.addFiles(['GOV-UK-2024-AI-001.pdf', 'GOV-UK-2024-AI-002.pdf']);
  }
  onDragOver(e: DragEvent) { e.preventDefault(); this.dragOver = true; }
  onDragLeave() { this.dragOver = false; }
  onFileSelect() {
    this.addFiles(['GOV-UK-2024-AI-001.pdf', 'GOV-UK-2024-AI-002.pdf', 'vendor_registry.xlsx']);
  }

  // Rules
  loadSavedRuleset() { this.savedRulesetVisible = false; }
  dismissSavedBanner() { this.savedRulesetVisible = false; }
  addCustomRule() {
    if (this.customRuleForm.id && this.customRuleForm.title) {
      this.rules.push({
        id: this.customRuleForm.id,
        title: this.customRuleForm.title,
        source: 'Custom',
        description: this.customRuleForm.description,
        active: true,
      });
      this.customRuleForm = { id: '', title: '', description: '' };
    }
  }

  // Analysis
  setFeedback(flag: Flag, fb: 'agreed' | 'dismissed' | 'neutral') {
    flag.feedback = fb;
    if (fb === 'dismissed') flag.escalate = false;
  }

  // Escalation
  sendEscalation() { this.escalationSent = true; }

  // Chat
  toggleChat() { this.chatOpen = !this.chatOpen; }
  sendChat() {
    if (!this.chatInput.trim()) return;
    this.chatMessages.push({ role: 'user', text: this.chatInput });
    const q = this.chatInput;
    this.chatInput = '';
    setTimeout(() => {
      if (q.toLowerCase().includes('dora') || q.toLowerCase().includes('incident')) {
        this.chatMessages.push({ role: 'assistant', text: 'Under DORA Article 19, "without undue delay" for major ICT incidents means initial notification within 4 hours of classification, with an intermediate report within 72 hours. The contract\'s 30 business days significantly exceeds this requirement.' });
      } else if (q.toLowerCase().includes('compliant') || q.toLowerCase().includes('clause')) {
        this.chatMessages.push({ role: 'assistant', text: 'A compliant clause would state: "The Vendor shall notify the Client of any major ICT-related incident within 4 hours of classification as major, with an intermediate report within 72 hours containing initial analysis and remediation measures."' });
      } else {
        this.chatMessages.push({ role: 'assistant', text: 'Based on the current regulatory context and your uploaded contracts, I recommend reviewing the flagged clauses against the specific articles mentioned in each finding. Would you like me to explain a specific regulation in more detail?' });
      }
    }, 600);
  }

  // Helpers
  barWidth(correct: number, total: number): number { return (correct / total) * 100; }
  grayWidth(correct: number, total: number): number { return ((total - correct) / total) * 100; }
  flagsByContract(name: string): Flag[] {
    return this.flags.filter(f => f.contractName === name && f.escalate && f.feedback !== 'dismissed');
  }
}
