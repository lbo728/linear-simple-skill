---
description: Analyze competitive landscape and positioning
argument-hint: [product-description]
---

# Competitive Analysis

Analyze competitive position for: $ARGUMENTS

## Step 1: Gather Context

If `$ARGUMENTS` is empty, ask user:
- "어떤 제품의 경쟁 분석을 할까요?"

Additional questions:
- "주요 경쟁사가 있다면 알려주세요 (없으면 제가 찾아볼게요)"
- "타겟 고객은 누구인가요?"

## Step 2: Load Framework

Read `references/competitive-analysis.md` from this plugin's skills directory.

## Step 3: Execute Analysis

### 3.1 Market Research
- Search for direct competitors (same problem, same solution)
- Search for indirect competitors (same problem, different solution)
- Identify substitutes

### 3.2 Apply Quick Assessment Matrix

| Factor | Your Product | Competitor A | Competitor B |
|--------|--------------|--------------|--------------|
| Core Feature | | | |
| Price | | | |
| Target User | | | |
| Distribution | | | |
| Differentiator | | | |

### 3.3 Porter's Five Forces (Simplified)
- Existing competitor intensity
- New entrant threat
- Substitute availability
- Buyer power
- Supplier/platform dependency

### 3.4 Differentiation Strategy
Recommend one of:
- Feature differentiation
- UX differentiation
- Price differentiation
- Niche focus
- Integration ecosystem

## Step 4: Deliver Results

```
## Competitive Analysis: [Product]

### Market Overview
- Market size estimate
- Saturation level
- Growth trend

### Direct Competitors
| Competitor | Strength | Weakness | Threat Level |
|------------|----------|----------|--------------|

### Indirect Competitors
| Alternative | User Overlap | Migration Risk |
|-------------|--------------|----------------|

### Your Position
- **Differentiator**: [What makes you unique]
- **Defensibility**: [How hard to copy]
- **Gap Opportunity**: [Underserved need]

### Recommendation
[Go/Caution/No-go with reasoning]
```
