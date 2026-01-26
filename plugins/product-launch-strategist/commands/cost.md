---
description: Analyze cost structure and unit economics
argument-hint: [product-description]
---

# Cost Analysis

Analyze costs for: $ARGUMENTS

## Step 1: Gather Context

If `$ARGUMENTS` is empty, ask user:
- "어떤 제품의 비용 분석을 할까요?"

Additional questions:
- "예상 기술 스택은? (서버리스/VPS/PaaS)"
- "외부 API 사용 예정? (OpenAI, Stripe 등)"
- "예상 사용자 수는? (초기 목표)"
- "현재 가용 자금은?"

## Step 2: Load Framework

Read `references/cost-analysis.md` from this plugin's skills directory.

## Step 3: Execute Analysis

### 3.1 Fixed Costs (Monthly)

| Item | Estimated Cost | Notes |
|------|----------------|-------|
| Domain | $1-2 | Annual/12 |
| Hosting | $5-50 | Vercel, Railway, etc. |
| Database | $0-25 | Supabase, PlanetScale |
| Email service | $0-20 | Resend, Postmark |
| Analytics | $0-10 | Posthog, Mixpanel |
| Monitoring | $0-20 | Sentry, LogRocket |
| **Subtotal** | | |

### 3.2 Variable Costs (Per User)

| Item | Unit Cost | Notes |
|------|-----------|-------|
| AI API calls | $0.001-0.05/call | OpenAI, Anthropic |
| Storage | $0.023/GB | S3, R2 |
| Bandwidth | $0.09/GB | CDN |
| Payment processing | 2.9% + $0.30 | Stripe |

### 3.3 Unit Economics

**CAC (Customer Acquisition Cost):**
```
CAC = Total Marketing Spend / New Customers
```

**LTV (Lifetime Value):**
```
LTV = Monthly Price × (1 / Monthly Churn Rate)
```

**LTV:CAC Ratio:**
- Target: > 3:1
- Healthy: 3:1 to 5:1
- Excellent: > 5:1

### 3.4 Break-even Analysis
```
Break-even Users = Fixed Costs / (Price - Variable Cost per User)
```

### 3.5 Runway Calculation
```
Runway (months) = Cash / Monthly Burn
```

## Step 4: Deliver Results

```
## Cost Analysis: [Product]

### Monthly Operating Costs
| Category | Amount |
|----------|--------|
| Fixed | $X |
| Variable (at Y users) | $X |
| **Total** | $X |

### Unit Economics
| Metric | Value | Health |
|--------|-------|--------|
| CAC | $X | [Good/Warning/Bad] |
| LTV | $X | |
| LTV:CAC | X:1 | |
| Payback | X months | |

### Break-even Point
- Users needed: X
- Monthly revenue needed: $X
- Timeline estimate: X months

### Runway Assessment
- Current cash: $X
- Monthly burn: $X
- Runway: X months

### Recommendations
1. [Cost optimization opportunity]
2. [Scaling concern to watch]
3. [Revenue milestone to hit]
```
