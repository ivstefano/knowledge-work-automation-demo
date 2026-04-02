# Compliance Intelligence Demo — Remediation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all critical, important, and minor issues identified by the 5-agent code review swarm to make the demo bulletproof.

**Architecture:** Single Angular standalone component (`CopilotComponent`) with all logic, template, and styles. All data is mocked. Changes are purely within the 3 component files — no new files needed.

**Tech Stack:** Angular 19 (standalone components, new control flow syntax), TypeScript, SCSS, Tailwind

---

## File Structure

All changes are in these 3 files:
- **Modify:** `src/app/copilot/copilot.component.ts` — logic fixes, computed properties, data updates
- **Modify:** `src/app/copilot/copilot.component.html` — template fixes, empty states, UX guards
- **Modify:** `src/app/copilot/copilot.component.scss` — grid fix, new styles for empty states/preview

No new files. No tests (demo app, no test infrastructure beyond Karma scaffold).

---

### Task 1: Fix Critical Logic Bugs (C1, C2, M1)

**Files:**
- Modify: `src/app/copilot/copilot.component.ts:477-508`

- [ ] **Step 1: Fix `toggleFeedback()` — only set `escalate=true` for 'agreed'**

In `copilot.component.ts`, replace line 479:
```typescript
// BEFORE:
flag.escalate = flag.feedback !== 'dismissed';

// AFTER:
flag.escalate = flag.feedback === 'agreed';
```

- [ ] **Step 2: Fix `flagsByContract()` — use `escalatableFlags` instead of `this.flags`**

In `copilot.component.ts`, replace lines 506-508:
```typescript
// BEFORE:
flagsByContract(name: string): Flag[] {
    return this.flags.filter(f => f.contractName === name && f.escalate && f.feedback !== 'dismissed');
}

// AFTER:
flagsByContract(name: string): Flag[] {
    return this.escalatableFlags.filter(f => f.contractName === name);
}
```

- [ ] **Step 3: Remove dead `setFeedback()` method**

Delete lines 473-476:
```typescript
// DELETE:
setFeedback(flag: Flag, fb: 'agreed' | 'dismissed' | 'skipped') {
    flag.feedback = fb;
    if (fb === 'dismissed') flag.escalate = false;
}
```

- [ ] **Step 4: Verify build**

Run: `npx ng build 2>&1 | tail -5`
Expected: Build succeeds (warning about bundle size is OK)

- [ ] **Step 5: Commit and push**

```bash
git add src/app/copilot/copilot.component.ts
git commit -m "Fix toggleFeedback escalate logic, flagsByContract filter, remove dead setFeedback"
git push
```

---

### Task 2: Fix Step 4 Zero-State + Auto-Advance (C3, I2, I3)

**Files:**
- Modify: `src/app/copilot/copilot.component.ts:322-325,483`
- Modify: `src/app/copilot/copilot.component.html:295-298,325-330,409-416`

- [ ] **Step 1: Fix `totalRisk` formatting**

In `copilot.component.ts`, replace the `totalRisk` getter:
```typescript
// BEFORE:
get totalRisk(): string {
    const count = this.escalatableFlags.length;
    return '€' + (count * 7).toLocaleString() + ',000,000';
}

// AFTER:
get totalRisk(): string {
    const count = this.escalatableFlags.length;
    if (count === 0) return '€0';
    return '€' + (count * 7_000_000).toLocaleString();
}
```

- [ ] **Step 2: Make `sendEscalation()` auto-advance to Step 5**

In `copilot.component.ts`, replace `sendEscalation()`:
```typescript
// BEFORE:
sendEscalation() { this.escalationSent = true; }

// AFTER:
sendEscalation() {
    this.escalationSent = true;
    setTimeout(() => this.nextStep(), 1500);
}
```

- [ ] **Step 3: Add zero-state handling in Step 4 template**

In `copilot.component.html`, wrap the risk banner with a guard and add a fallback when no escalatable flags exist. Replace lines 325-330:
```html
          @if (!escalationSent) {
            @if (escalatableFlags.length > 0) {
            <!-- Risk banner -->
            <div class="risk-banner">
              <span class="risk-amount">{{ totalRisk }}</span>
              <span class="risk-sub">Total Potential Risk — {{ escalatableFlags.length }} violations across {{ selectedEscalationFiles.length }} contracts × €7M per incident</span>
            </div>
            }
```

Then, after the closing `</div>` of `esc-buttons` (after the EXPORT PDF REPORT button, before the audit trail section), add:
```html
            @if (escalatableFlags.length === 0) {
              <div class="esc-empty-state">
                <span class="material-symbols-rounded" style="font-size:40px; color:#4a4a62">check_circle</span>
                <h4>No Violations Require Escalation</h4>
                <p class="sec-sub">All findings were dismissed or skipped. No escalation needed.</p>
                <button class="btn-dark" (click)="nextStep()">PROCEED TO EVALUATION →</button>
              </div>
            }
```

- [ ] **Step 4: Add empty-state styles**

In `copilot.component.scss`, add after the `.esc-buttons` styles:
```scss
.esc-empty-state {
  display:flex; flex-direction:column; align-items:center; gap:12px;
  text-align:center; padding:40px 20px;
  background:$s1; border:1px solid $b1; border-radius:$r;
  h4 { margin:0; font-size:16px; }
}
```

- [ ] **Step 5: Verify build**

Run: `npx ng build 2>&1 | tail -5`

- [ ] **Step 6: Commit and push**

```bash
git add src/app/copilot/copilot.component.ts src/app/copilot/copilot.component.html src/app/copilot/copilot.component.scss
git commit -m "Fix zero-state in Step 4, auto-advance after escalation, fix totalRisk formatting"
git push
```

---

### Task 3: Fix Demo Narrative — DORA→SDALP (C4, M6)

**Files:**
- Modify: `src/app/copilot/copilot.component.html:131`
- Modify: `src/app/copilot/copilot.component.ts:486-500`

- [ ] **Step 1: Fix saved banner text in Step 2**

In `copilot.component.html`, replace line 131:
```html
<!-- BEFORE: -->
<span class="saved-banner-text"><strong>Previously saved ruleset found</strong> for DORA (edited by J. Smith on 28 Mar 2026)</span>

<!-- AFTER: -->
<span class="saved-banner-text"><strong>Previously saved ruleset found</strong> for SDALP (edited by J. Smith on 28 Mar 2026)</span>
```

- [ ] **Step 2: Rewrite chat responses for SDALP/DLC context**

In `copilot.component.ts`, replace the entire `sendChat()` method body (the `setTimeout` callback):
```typescript
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
```

- [ ] **Step 3: Fix "EU/UK" label on source card**

In `copilot.component.html`, replace line 77:
```html
<!-- BEFORE: -->
<span class="sc-desc">Pre-parsed EU/UK regulations</span>

<!-- AFTER: -->
<span class="sc-desc">Pre-parsed financial regulations</span>
```

- [ ] **Step 4: Verify build and commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/copilot/copilot.component.html src/app/copilot/copilot.component.ts
git commit -m "Fix DORA references to SDALP, rewrite chat responses, fix EU/UK label"
git push
```

---

### Task 4: Step 4 Contract Preview + Escalation Highlights (C5, I9)

**Files:**
- Modify: `src/app/copilot/copilot.component.html:305-320`
- Modify: `src/app/copilot/copilot.component.ts` — add escalation-specific highlight getter
- Modify: `src/app/copilot/copilot.component.scss` — preview card styles

- [ ] **Step 1: Add escalation-specific clause highlight method**

In `copilot.component.ts`, add after `isRegFocused()`:
```typescript
getEscalationClauseHighlight(clauseNum: number): string {
    const matching = this.escalatableFlags.filter(f => f.contractClauseNum === clauseNum);
    if (matching.length === 0) return '';
    return matching.some(f => f.severity === 'high') ? 'violation' : 'warning';
}
```

- [ ] **Step 2: Update Step 4 left panel to use escalation-specific highlights**

In `copilot.component.html`, replace the Step 4 contract panel (lines 305-319):
```html
      <div class="analysis-grid">
        <!-- Left: Contract with confirmed issues + attached file previews -->
        <div class="contract-panel">
          <h3 class="panel-title">ORIGINAL CONTRACT — CONFIRMED ISSUES</h3>
          <div class="contract-body compact">
            @for (c of contractClauses; track c.num) {
              <p class="clause" [class]="getEscalationClauseHighlight(c.num)">
                <span class="clause-num">{{ c.num }}.</span>
                @if (getEscalationClauseHighlight(c.num) === 'violation') { <span class="hl-bar violation"></span> }
                @if (getEscalationClauseHighlight(c.num) === 'warning') { <span class="hl-bar warning"></span> }
                {{ c.text }}
              </p>
            }
          </div>

          @if (selectedEscalationFiles.length > 0) {
            <h3 class="panel-title" style="margin-top:20px">ATTACHED DOCUMENTS</h3>
            @for (file of selectedEscalationFiles; track file.name) {
              <div class="preview-card">
                <div class="preview-header">
                  <span class="material-symbols-rounded" style="font-size:18px">description</span>
                  <strong>{{ file.name }}</strong>
                  <span class="sev sm" [class]="file.type === 'contract' ? 'high' : 'low'">{{ file.type }}</span>
                </div>
                <p class="preview-text">{{ file.previewText }}</p>
              </div>
            }
          }
        </div>
```

- [ ] **Step 3: Add preview card styles**

In `copilot.component.scss`, add after `.esc-empty-state`:
```scss
.preview-card {
  background:$s2; border:1px solid $b1; border-radius:$rs; padding:12px 16px; margin-bottom:8px;
}
.preview-header {
  display:flex; align-items:center; gap:8px; margin-bottom:6px;
  strong { font-size:13px; flex:1; }
}
.preview-text { font-size:12px; color:$t2; line-height:1.6; margin:0; }
```

- [ ] **Step 4: Verify build and commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/copilot/copilot.component.ts src/app/copilot/copilot.component.html src/app/copilot/copilot.component.scss
git commit -m "Add contract preview in Step 4, fix escalation clause highlights to only show agreed flags"
git push
```

---

### Task 5: Auto-Generate Custom Rule ID (I1)

**Files:**
- Modify: `src/app/copilot/copilot.component.ts:123,459-470`
- Modify: `src/app/copilot/copilot.component.html:168`

- [ ] **Step 1: Add auto-ID generation and fix `addCustomRule()`**

In `copilot.component.ts`, replace `addCustomRule()`:
```typescript
addCustomRule() {
    if (this.customRuleForm.title) {
      const existingCount = this.rules.filter(r => r.id.startsWith('CUST-')).length;
      const id = `CUST-${existingCount + 1}`;
      this.rules.push({
        id,
        title: this.customRuleForm.title,
        source: 'Custom',
        description: this.customRuleForm.description,
        active: true,
      });
      this.customRuleForm = { id: '', title: '', description: '' };
    }
}
```

- [ ] **Step 2: Remove ID input field from template**

In `copilot.component.html`, replace line 168:
```html
<!-- BEFORE: -->
<input class="crf-input id" placeholder="ID (e.g. CUST-2)" [(ngModel)]="customRuleForm.id" />

<!-- AFTER: (remove entirely — delete this line) -->
```

- [ ] **Step 3: Verify build and commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/copilot/copilot.component.ts src/app/copilot/copilot.component.html
git commit -m "Auto-generate custom rule IDs, remove manual ID input"
git push
```

---

### Task 6: Guard Progress Bar Navigation (I7, M7)

**Files:**
- Modify: `src/app/copilot/copilot.component.ts:427-431`

- [ ] **Step 1: Add navigation guard and reset escalation state**

In `copilot.component.ts`, replace `goTo()` and `nextStep()`:
```typescript
goTo(step: Step) {
    const target = this.steps.findIndex(s => s.key === step);
    // Allow backward navigation only; forward navigation uses nextStep()
    if (target <= this.stepIndex) {
      if (this.currentStep === 'escalation') this.escalationSent = false;
      this.currentStep = step;
    }
}
nextStep() {
    const i = this.stepIndex;
    if (i < this.steps.length - 1) {
      if (this.currentStep === 'escalation') this.escalationSent = false;
      this.currentStep = this.steps[i + 1].key;
    }
}
```

- [ ] **Step 2: Verify build and commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/copilot/copilot.component.ts
git commit -m "Guard progress bar to only allow backward navigation, reset escalation on leave"
git push
```

---

### Task 7: Fix Evaluation Metrics (I4, I5, I6)

**Files:**
- Modify: `src/app/copilot/copilot.component.ts:335-348,410-424`

- [ ] **Step 1: Fix `dynamicEvalMetrics` — use filteredFlags, remove falsy fallback, fix variable name**

In `copilot.component.ts`, replace the entire `dynamicEvalMetrics` getter:
```typescript
get dynamicEvalMetrics() {
    const pool = this.filteredFlags;
    const agreed = pool.filter(f => f.feedback === 'agreed').length;
    const dismissed = pool.filter(f => f.feedback === 'dismissed').length;
    const skipped = pool.filter(f => f.feedback === 'skipped').length;
    const reviewed = agreed + dismissed + skipped;
    const accuracy = reviewed > 0 ? ((agreed / reviewed) * 5).toFixed(1) : '0.0';
    return {
      accuracy,
      total: 5,
      findings: pool.length,
      agreed,
      dismissed,
    };
}
```

- [ ] **Step 2: Make `comparisonTable` a computed getter**

Replace the static `comparisonTable` and `perRuleAccuracy` arrays with:
```typescript
get comparisonTable() {
    const total = this.filteredFlags.length;
    const agreed = this.filteredFlags.filter(f => f.feedback === 'agreed').length;
    const dismissed = this.filteredFlags.filter(f => f.feedback === 'dismissed').length;
    const groundTruth = Math.max(total - dismissed, 1);
    const baselineFound = Math.round(groundTruth * 0.5);
    return [
      { metric: 'True violations found', pipeline: `${agreed} / ${groundTruth}`, baseline: `${baselineFound} / ${groundTruth}` },
      { metric: 'False positives', pipeline: `${dismissed}`, baseline: `${Math.round(total * 0.54)}` },
      { metric: 'Missed violations', pipeline: `${groundTruth - agreed}`, baseline: `${groundTruth - baselineFound}` },
      { metric: 'Precision', pipeline: `${total > 0 ? Math.round((agreed / total) * 100) : 0}%`, baseline: '42%' },
    ];
  }
```

- [ ] **Step 3: Make `perRuleAccuracy` a computed getter**

Replace the static `perRuleAccuracy` array with:
```typescript
get perRuleAccuracy() {
    const ruleIds = [...new Set(this.rules.map(r => r.id))];
    return ruleIds.map(ruleId => {
      const ruleFlags = this.filteredFlags.filter(f => f.ruleId === ruleId);
      const agreed = ruleFlags.filter(f => f.feedback === 'agreed').length;
      const total = ruleFlags.length;
      const rule = this.rules.find(r => r.id === ruleId);
      const ratio = total > 0 ? agreed / total : 0;
      const color = ratio >= 0.75 ? '#4ade80' : ratio >= 0.5 ? '#facc15' : '#f87171';
      return {
        rule: `${ruleId} ${rule?.title || ''}`,
        correct: agreed,
        total,
        color,
      };
    }).filter(r => r.total > 0);
  }
```

- [ ] **Step 4: Remove static `evalMetrics` since it's no longer used**

Delete:
```typescript
evalMetrics = { accuracy: '4.2', total: 5, findings: 12, agreed: 8, dismissed: 3 };
```

- [ ] **Step 5: Verify build and commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/copilot/copilot.component.ts
git commit -m "Make evaluation metrics dynamic based on actual user review decisions"
git push
```

---

### Task 8: Fix Audit Trail + Data Cleanup (I11, I12, I10, M2, M3, M4)

**Files:**
- Modify: `src/app/copilot/copilot.component.ts:90-93,96,307-314,368,445-454`
- Modify: `src/app/copilot/copilot.component.scss:149`

- [ ] **Step 1: Remove dead `flagCount` from UploadedFile interface and data**

In `copilot.component.ts`, remove `flagCount` from the interface:
```typescript
// BEFORE:
interface UploadedFile {
  name: string;
  selected: boolean;
  flagCount: number;
  type: 'contract' | 'regulation' | 'registry';
  pdfPath?: string;
  previewText: string;
}

// AFTER:
interface UploadedFile {
  name: string;
  selected: boolean;
  type: 'contract' | 'regulation' | 'registry';
  pdfPath?: string;
  previewText: string;
}
```

Remove `flagCount` from the uploaded files data (lines 91-93):
```typescript
uploadedFiles: UploadedFile[] = [
    { name: 'DLC-2026-Alpha.pdf', selected: true, type: 'contract', previewText: 'Draft Digital Lending Contract — Decentralized Peer-to-Peer Loan Agreement between Borrower Alpha (0x4fA6...B1cE) and Lender Omega (0x9eD5...C8fF). Principal: 10,000 USDC, Term: 180 Days, Collateral: 5 ETH.' },
    { name: 'SDALP-v2.1-2026.pdf', selected: true, type: 'regulation', previewText: 'Standardized Digital Asset Lending Protocol v2.1 — Industry standard for DeFi lending contracts covering interest rate transparency, liquidation procedures, collateral requirements, and audit obligations.' },
    { name: 'vendor_registry.xlsx', selected: true, type: 'registry', previewText: 'Vendor registry containing counterparty details: Borrower Alpha (High risk), Lender Omega (Medium risk), Liquidation Agent (Low risk).' },
];
```

Also remove `flagCount` from `addFiles()`:
```typescript
addFiles(names: string[]) {
    for (const n of names) {
      if (!this.uploadedFiles.find(f => f.name === n)) {
        this.uploadedFiles.push({ name: n, selected: true, type: 'contract', previewText: '' });
      }
    }
}
```

- [ ] **Step 2: Remove dead 'manual' from ruleSource type**

```typescript
// BEFORE:
ruleSource: 'database' | 'upload' | 'manual' = 'database';

// AFTER:
ruleSource: 'database' | 'upload' = 'database';
```

- [ ] **Step 3: Make audit trail dynamic**

Replace the static `auditTrail` with a computed getter:
```typescript
get auditTrail(): AuditEntry[] {
    const agreed = this.filteredFlags.filter(f => f.feedback === 'agreed');
    const dismissed = this.filteredFlags.filter(f => f.feedback === 'dismissed');
    const entries: AuditEntry[] = [
      { time: '14:32', text: `${this.uploadedFiles.map(f => f.name).join(' + ')} uploaded` },
      { time: '14:33', text: `${this.regulations.filter(r => r.selected).map(r => r.label).join(', ')} selected as regulatory sources` },
      { time: '14:33', text: `${this.rules.length} compliance rules loaded (${this.rules.filter(r => r.id.startsWith('CUST-')).length} custom), ${this.activeRuleCount} active` },
      { time: '14:34', text: `Analysis complete — ${this.flags.length} findings flagged (${this.filteredFlags.length} above risk threshold)` },
    ];
    if (agreed.length > 0 || dismissed.length > 0) {
      const parts: string[] = [];
      if (agreed.length > 0) parts.push(`Agreed: ${agreed.map(f => f.id).join(', ')}`);
      if (dismissed.length > 0) parts.push(`Dismissed: ${dismissed.map(f => f.id).join(', ')}`);
      entries.push({ time: '14:35', text: parts.join(' · ') });
    }
    if (this.escalationSent) {
      entries.push({ time: '14:36', text: `Escalation sent to ${this.escalationTeams.filter(t => t.selected).map(t => t.name).join(', ')}` });
    }
    return entries;
}
```

- [ ] **Step 4: Fix default `selectedContractView` to 'all'**

```typescript
// BEFORE:
selectedContractView = 'DLC-2026-Alpha.pdf';

// AFTER:
selectedContractView = 'all';
```

- [ ] **Step 5: Make drag-drop and browse consistent**

```typescript
// BEFORE:
onFileDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    this.addFiles(['DLC-2026-Alpha.pdf', 'SDALP-v2.1-2026.pdf']);
}

// AFTER:
onFileDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver = false;
    this.addFiles(['DLC-2026-Alpha.pdf', 'SDALP-v2.1-2026.pdf', 'vendor_registry.xlsx']);
}
```

- [ ] **Step 6: Fix source cards grid from 3 to 2 columns**

In `copilot.component.scss`, line 149:
```scss
// BEFORE:
.source-cards { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:20px; }

// AFTER:
.source-cards { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:20px; }
```

- [ ] **Step 7: Verify build and commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/copilot/copilot.component.ts src/app/copilot/copilot.component.scss
git commit -m "Dynamic audit trail, remove dead flagCount/manual, fix defaults and grid"
git push
```

---

### Task 9: Disable Unimplemented Buttons + Empty States (I8, SE2-Tab-Empty, M5)

**Files:**
- Modify: `src/app/copilot/copilot.component.html:109-113,178-179,251,393`
- Modify: `src/app/copilot/copilot.component.scss`

- [ ] **Step 1: Disable Save Ruleset and Export PDF buttons**

In `copilot.component.html`, line 178-180:
```html
<!-- BEFORE: -->
<button class="btn-outline">
    <span class="material-symbols-rounded" style="font-size:16px">save</span> Save Ruleset
</button>

<!-- AFTER: -->
<button class="btn-outline" disabled title="Coming soon">
    <span class="material-symbols-rounded" style="font-size:16px">save</span> Save Ruleset
</button>
```

Line 393:
```html
<!-- BEFORE: -->
<button class="btn-outline">EXPORT PDF REPORT</button>

<!-- AFTER: -->
<button class="btn-outline" disabled title="Coming soon">EXPORT PDF REPORT</button>
```

- [ ] **Step 2: Add empty state for Step 3 flags panel**

In `copilot.component.html`, after the `@for (f of filteredFlagsByView` block (after its closing `}`), add:
```html
            @if (filteredFlagsByView.length === 0) {
              <div class="empty-state">
                <span class="material-symbols-rounded" style="font-size:32px; color:#4a4a62">search_off</span>
                <p>No compliance findings for this document.</p>
              </div>
            }
```

- [ ] **Step 3: Disable custom regulation upload drop zone**

In `copilot.component.html`, replace the upload custom source panel content (lines 108-114):
```html
          @if (ruleSource === 'upload') {
            <div class="source-panel-content">
              <div class="drop-zone mini" style="opacity:0.6; cursor:default">
                <span class="material-symbols-rounded drop-icon">upload_file</span>
                <p>Upload your own regulatory documents or internal compliance policies</p>
                <span class="drop-formats">PDF, DOCX — coming soon</span>
              </div>
            </div>
          }
```

- [ ] **Step 4: Add empty-state styles**

In `copilot.component.scss`:
```scss
.empty-state {
  display:flex; flex-direction:column; align-items:center; gap:8px;
  text-align:center; padding:32px 16px; color:$t3;
  p { margin:0; font-size:13px; }
}
```

- [ ] **Step 5: Verify build and commit**

```bash
npx ng build 2>&1 | tail -5
git add src/app/copilot/copilot.component.html src/app/copilot/copilot.component.scss
git commit -m "Disable unimplemented buttons, add empty states for findings panel"
git push
```

---

### Task 10: Final Verification

- [ ] **Step 1: Full build check**

Run: `npx ng build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 2: Start dev server and verify**

Run: `npx ng serve --port 4200 &; sleep 10; curl -s -o /dev/null -w "%{http_code}" http://localhost:4200`
Expected: 200

- [ ] **Step 3: Walk through demo flow mentally**

Verify:
1. Step 1: Files pre-loaded, 2 source cards, SDALP auto-suggested
2. Step 2: Saved banner says "SDALP", custom rule auto-generates ID
3. Step 3: "All Documents" tab selected, 7 findings visible (Moderate defaults), all buttons toggle, counter tracks, NEXT disabled until all reviewed
4. Step 4: Only agreed findings shown, risk amount correct, contract preview visible, auto-advances after send. If all dismissed → "No Violations" with proceed button
5. Step 5: Dynamic metrics reflecting actual decisions, per-rule accuracy from real data
6. Chat: SDALP/DLC responses
7. Progress bar: can go back, cannot skip forward

- [ ] **Step 4: Commit any missed changes**

```bash
git status
# If clean: done
# If changes: git add and commit
```
