# Audit & Furious — Presentation Story

**15 minutes. One story. Five acts.**

---

## OPENING (1 min) — The Pain

> "Every financial institution in the EU has a ticking clock. DORA, EU AI Act, MiFID II — new regulations are stacking up. A single compliance officer has to read a 40-page contract, cross-reference it against 5 different regulatory frameworks, flag violations, quantify risk, and escalate — all before the next one lands on their desk."

**The number:** A single non-compliance incident can cost up to **EUR 7 million** or 3% of global annual turnover.

> "Today, this process is entirely manual. Open contract. Open regulation. Read. Compare. Flag. Write an email. Repeat. It takes days per contract. It doesn't scale. And when it fails, it fails quietly — until a regulator finds the gap."

**The question:** What if a compliance officer could do this in 15 minutes instead of 3 days — with a full audit trail proving every decision?

---

## ACT 1: INGEST (2 min) — Show Step 1

> "Let's walk through it. A compliance officer receives a new DeFi lending contract — DLC-2026-Alpha — that needs review against the Standardized Digital Asset Lending Protocol."

**Demo Step 1 — Upload:**
- Files are already loaded: the contract (DLC-2026-Alpha.pdf), the regulation (SDALP-v2.1-2026.pdf), and the vendor registry (vendor_registry.xlsx)
- Point out: **three different data formats** — PDF contract, PDF regulation, Excel registry. This is reality. Data lives in fragments.
- Show the Compliance Rule Source panel: SDALP is auto-suggested based on the uploaded contract. The system reads the documents and suggests which regulations are relevant.
- **Human-in-the-loop #1:** The officer confirms or adds more regulations. They're steering, not spectating.

**Key talking point:**
> "This isn't 'upload and pray.' The system already understands what it's looking at. It suggests SDALP because it detected this is a digital lending contract. But the human decides."

---

## ACT 2: RULES (2 min) — Show Step 2

> "Next, the system generates structured compliance rules from the selected regulation. Each rule has an ID, a source reference, and clear criteria."

**Demo Step 2 — Rules:**
- Show the 5 pre-loaded rules derived from SDALP: Interest Rate Transparency, Liquidation Grace Period, Security Audit, Collateral Diversification, Governance Override
- Toggle a rule off to show the system is steerable
- Point out the "Previously saved ruleset" banner: rules can be reused across contracts. A compliance officer builds once, runs many times.
- **Add a custom rule live:** Type a title like "Borrower Consent Verification" — ID auto-generates. Show how domain expertise gets encoded.

**Key talking point:**
> "This is where Iris is the differentiator. We don't just run a prompt. We structure domain knowledge into reusable, auditable rules. The compliance officer's expertise becomes a digital asset."

---

## ACT 3: ANALYZE (4 min) — Show Step 3 (THE CORE)

> "Now the system checks every clause of the contract against every active rule. Here's what it found."

**Demo Step 3 — Analysis:**
- Show the Risk Threshold filter: defaults at Moderate. **7 findings visible out of 13 total.** Slide down to Rare/Trivial to reveal all 13 — show the full spectrum.
- Walk through the top findings:
  - **Flag 1 — Interest Rate Not Transparent (HIGH):** Contract allows immediate rate changes via governance mechanism. SDALP requires 72-hour notice + hard-coded cap. 96% confidence.
  - **Flag 2 — No Liquidation Grace Period (HIGH):** Contract says "IMMEDIATELY." SDALP requires 48 hours. 98% confidence.
- Show the left panel: the original contract text with **highlighted clauses** — violations glow red, warnings glow yellow
- **Click a finding** — corresponding contract clause highlights. The system shows you exactly where the problem is and why.
- **Human-in-the-loop #2 — Review each finding:**
  - Agree with Flag 1 (button turns green)
  - Agree with Flag 2
  - **Dismiss Flag 6** (Hourly Compounding Disclosure) — "This is intentional, not a violation"
  - Skip Flag 9 — "Need more context"
  - Show the counter: "5/7 reviewed" — NEXT button stays disabled until all are addressed
  - **Finish reviewing all** — NEXT enables

**Key talking points:**
> "Every single finding has a contract reference AND a regulation reference. The officer isn't trusting a black box — they can verify in seconds."

> "The Agree/Dismiss/Skip buttons aren't decoration. They create ground truth. This is how the system learns what a real violation looks like versus a false positive."

---

## ACT 4: ESCALATE (2 min) — Show Step 4

> "The officer has reviewed the findings. Now what? In the real world, compliance officers don't fix contracts — they escalate to the right people."

**Demo Step 4 — Escalation:**
- Risk banner updates dynamically: show the EUR amount based on agreed violations (e.g., EUR 28,000,000 for 4 violations)
- **Multi-team escalation:** Select Legal/Compliance AND DeFi Risk teams — this goes to multiple stakeholders
- Show attached contracts with preview text — the officer can verify what's being sent
- Show the **read-only violation summary** — exactly what the receiving team will see
- **Audit trail** (dynamic): every action recorded — files uploaded, regulations selected, rules loaded, findings reviewed, escalation sent. Full chain of custody.
- **Click SEND** — success message, auto-advances to evaluation

**Key talking point:**
> "This is where knowledge work automation becomes action. Not a report that sits in a folder — a notification that reaches the right team, with the right context, with a full audit trail."

---

## ACT 5: EVALUATE (2 min) — Show Step 5

> "Here's the part that changes the conversation from 'cool demo' to 'I need this.'"

**Demo Step 5 — Evaluation:**
- **Dynamic accuracy score:** Based on the officer's Agree/Dismiss decisions from Step 3. Not a static number — it's computed from their feedback.
- **Baseline comparison table:** "Iris Pipeline vs Raw LLM"
  - Pipeline found more true violations
  - Pipeline had fewer false positives
  - Higher precision
- **Per-rule accuracy bars:** Show which rules the system is strong on (Interest Rate: 100%) vs where it needs improvement
- **Ground Truth Upload:** The officer can upload their own scored assessment. System correlates. This closes the feedback loop.

**Key talking point:**
> "This is the Iris loop. Ingest → Understand → Check → Human Review → Evaluate → Improve. Every cycle, the system gets better. That's not a chatbot. That's a knowledge work automation platform."

---

## CLOSE (2 min) — The Business Case

### Why This Matters to Customers (Customer Value — 20pts)

> "Every FSI institution we talk to has this problem. DORA alone affects 22,000+ financial entities across the EU. They're all hiring compliance officers and still falling behind. This doesn't replace the officer — it makes them 10x faster."

**Follow-up conversation trigger:** "We built this for SDALP in DeFi. But the same pipeline works for DORA, EU AI Act, GDPR, MiFID II. What regulations are keeping you up at night?"

### Why Iris is the Differentiator (Use of Iris — 20pts)

> "Anyone can prompt an LLM with 'find violations.' Here's what only Iris does:"

1. **Structured rule extraction** — Regulations become reusable, auditable rule sets
2. **Multi-source ingestion** — Contracts, regulations, vendor registries, Excel files — fragmented data, unified analysis
3. **Human-in-the-loop evaluation** — Not just output, but ground truth that improves accuracy
4. **Baseline comparison** — Prove the pipeline beats raw LLM. Show the receipts.
5. **Audit trail** — Every decision traced. Table stakes for regulated industries.

### Business Potential (15pts)

- **Reply Group** identified regulatory reporting as a top FSI use case AWS will push
- **Money 2020** (major financial conference) is coming — this is the demo
- **EUR 7M per incident** — the ROI conversation writes itself
- Transfers to: legal contract review, insurance claims, procurement compliance, any knowledge work with rules + documents

### What Happens Next (Presentation Clarity — 15pts)

> "Three things happen after today:"

1. **Pilot:** Take this to one FSI client with their actual contracts and regulations. 2-week proof of value.
2. **Platform:** The rule engine, evaluation loop, and escalation workflow become reusable Iris modules.
3. **Scale:** Every regulated industry has this problem. FSI is first. Healthcare, legal, and procurement are next.

---

## PRESENTER NOTES

### Demo Flow Cheat Sheet (keep on screen during practice)

| Step | Time | Key Action | Key Line |
|------|------|-----------|----------|
| Opening | 0:00-1:00 | No demo. Just talk. | "EUR 7 million per incident" |
| Step 1 | 1:00-3:00 | Show pre-loaded files, auto-suggested regulation | "Three data formats. One unified analysis." |
| Step 2 | 3:00-5:00 | Toggle rule, add custom rule live | "Domain expertise becomes a digital asset" |
| Step 3 | 5:00-9:00 | Walk through findings, agree/dismiss, show highlights | "Every finding has a receipt" |
| Step 4 | 9:00-11:00 | Select teams, send escalation | "Not a report — an action" |
| Step 5 | 11:00-13:00 | Show dynamic metrics, baseline comparison | "The Iris loop" |
| Close | 13:00-15:00 | Business case, next steps | "What regulations keep you up at night?" |

### If Something Breaks

- **Step 3 takes too long:** Pre-agree all findings quickly, focus on 2-3 key ones
- **Question about backend:** "The pipeline uses structured rule extraction + multi-step agent orchestration. Today we're showing the workflow and evaluation — the backend uses the same Iris agent framework."
- **"Is this real data?":** "Public regulatory text + mock DeFi contract. Zero client data. But the pipeline is regulation-agnostic — plug in your contracts and your regulations."
- **"What about accuracy?":** Point to Step 5. "That's exactly what the evaluation step answers. And it improves with every review cycle."

### Scoring Maximizer Checklist

- [ ] **Customer Value (20):** Name the customer pain. Quantify it (EUR 7M). Show the follow-up hook.
- [ ] **Demo Quality (20):** No crashes. Smooth flow. Every click does something. No dead buttons.
- [ ] **Iris Technology (20):** Say "only Iris" at least twice. Point to structured rules, evaluation loop, multi-source ingestion.
- [ ] **Business Potential (15):** Name Money 2020. Name Reply Group. Name the transferable verticals.
- [ ] **Innovation (10):** "Human-in-the-loop ground truth that improves the system" — not just AI output, but AI that learns from expert feedback.
- [ ] **Presentation Clarity (15):** Start with pain. End with next steps. Every act has one key line. No jargon without explanation.
