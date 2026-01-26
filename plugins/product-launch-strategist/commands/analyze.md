---
description: Run full product launch analysis (competitive, pricing, cost, checklist, risk)
argument-hint: [product-description]
---

# Full Product Launch Analysis

Perform comprehensive launch analysis for: $ARGUMENTS

## Step 1: Gather Context

If `$ARGUMENTS` is empty or unclear, ask user:
- "어떤 제품/앱을 분석할까요? 간단히 설명해주세요."

Gather additional context:
- Product type (app/SaaS/tool/game)
- Target market (B2C/B2B, geography)
- Current stage (idea/MVP/ready)
- Budget/resources available

## Step 2: Load Frameworks

Read the following reference files from this plugin's skills directory:
1. `references/competitive-analysis.md`
2. `references/pricing-models.md`
3. `references/cost-analysis.md`
4. `references/launch-checklist.md`
5. `references/risk-analysis.md`

## Step 3: Execute Analysis

Apply each framework sequentially:

### 3.1 Competitive Analysis
- Identify direct/indirect competitors
- Apply Quick Assessment Matrix
- Determine differentiation strategy

### 3.2 Pricing Strategy
- Recommend pricing model
- Calculate suggested price points
- Consider indie benchmarks

### 3.3 Cost Analysis
- Estimate fixed/variable costs
- Calculate break-even point
- Assess runway

### 3.4 Launch Readiness
- Check against launch checklist
- Identify gaps
- Prioritize pre-launch tasks

### 3.5 Risk Assessment
- Apply risk matrix
- Conduct pre-mortem
- Determine go/no-go recommendation

## Step 4: Deliver Results

Format output as:

```
## Executive Summary
[2-3 sentences overall assessment]

## Key Findings
- [Finding 1]
- [Finding 2]
- [Finding 3]

## Recommendations
1. [Priority 1 action]
2. [Priority 2 action]
3. [Priority 3 action]

## Go/No-Go Assessment
[Clear recommendation with reasoning]

## Next Steps
- [ ] [Specific action 1]
- [ ] [Specific action 2]
- [ ] [Specific action 3]
```
