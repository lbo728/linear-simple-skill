---
description: Develop pricing strategy and recommend price points
argument-hint: [product-description]
---

# Pricing Strategy

Develop pricing strategy for: $ARGUMENTS

## Step 1: Gather Context

If `$ARGUMENTS` is empty, ask user:
- "어떤 제품의 가격 전략을 세울까요?"

Additional questions:
- "제품 카테고리는? (유틸리티/생산성/개발자도구/디자인/AI)"
- "타겟 고객은? (B2C/B2B/개발자)"
- "경쟁사 가격대를 알고 있나요?"
- "예상 운영 비용은? (서버, API 등)"

## Step 2: Load Framework

Read `references/pricing-models.md` from this plugin's skills directory.

## Step 3: Execute Analysis

### 3.1 Model Selection
Evaluate fit for:
- Freemium (viral potential, low marginal cost)
- Subscription (continuous value, regular updates)
- One-time (tools, utilities)
- Usage-based (variable usage, B2B)
- Hybrid (predictability + scalability)

### 3.2 Price Calculation

**Value-based:**
```
Price = (User Value Gained) × (Capture Rate 10-20%)
```

**Cost-plus:**
```
Price = (Cost per User) × (1 + Target Margin)
```

**Competitive:**
```
Price = Competitor Price × (Value Multiplier)
```

### 3.3 Apply Benchmarks

| Category | Typical Monthly | Typical One-time |
|----------|-----------------|------------------|
| Utility app | $3-9 | $9-29 |
| Productivity tool | $5-15 | $19-49 |
| Developer tool | $10-30 | $29-99 |
| Design tool | $10-20 | $29-79 |
| AI-powered app | $10-30 | Rare |

### 3.4 Tier Design (Rule of 3)
- Starter: Entry point, limited
- Pro: Most popular, best value (highlight)
- Enterprise: Custom, high-touch (if applicable)

## Step 4: Deliver Results

```
## Pricing Recommendation: [Product]

### Recommended Model
[Model type with reasoning]

### Suggested Tiers
| Tier | Price | Target User | Key Features |
|------|-------|-------------|--------------|
| Free | $0 | Evaluators | [Limited features] |
| Pro | $X/mo | Core users | [Full features] |
| Team | $X/mo | Teams | [Collaboration] |

### Justification
- **Value analysis**: [User saves X hours = $Y value]
- **Cost floor**: [Minimum $X to cover costs]
- **Competitive context**: [Competitors charge $X-Y]

### Implementation Notes
- Launch discount: [X% for early adopters]
- Annual discount: [2 months free]
- Grandfathering: [Policy for existing users]
```
