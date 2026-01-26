---
description: Assess risks and failure scenarios
argument-hint: [product-description]
---

# Risk Assessment

Assess risks for: $ARGUMENTS

## Step 1: Gather Context

If `$ARGUMENTS` is empty, ask user:
- "어떤 제품의 리스크를 분석할까요?"

Additional questions:
- "가장 걱정되는 부분이 있나요?"
- "외부 서비스 의존성은? (API, 플랫폼 등)"
- "팀 구성은? (솔로/소규모팀)"

## Step 2: Load Framework

Read `references/risk-analysis.md` from this plugin's skills directory.

## Step 3: Execute Risk Analysis

### 3.1 Risk Categories

**Market Risk**
- No demand / timing wrong
- Competition too strong
- Market too small

**Technical Risk**
- Feasibility issues
- Scalability concerns
- Third-party dependencies

**Financial Risk**
- Runway too short
- Unit economics negative
- Can't charge enough

**Execution Risk**
- Takes too long to build
- Scope creep
- Burnout risk

**Legal/Regulatory Risk**
- Compliance requirements
- Platform policies
- IP concerns

### 3.2 Risk Matrix

| Risk | Likelihood | Impact | Score | Mitigation |
|------|------------|--------|-------|------------|
| | L/M/H | L/M/H | 1-9 | |

Scoring: Low=1, Medium=2, High=3
Score = Likelihood × Impact
- Score > 6: Critical
- Score 4-6: Monitor
- Score < 4: Accept

### 3.3 Pre-mortem Exercise

> "It's 6 months from now. The product failed. Why?"

Top 5 failure scenarios:
1. [Scenario]
2. [Scenario]
3. [Scenario]
4. [Scenario]
5. [Scenario]

### 3.4 Dependency Analysis

| Dependency | Risk Level | Mitigation |
|------------|------------|------------|
| OpenAI API | High | Anthropic fallback |
| App Store | Medium | Web fallback |
| Stripe | Low | Alternatives exist |

## Step 4: Deliver Results

```
## Risk Assessment: [Product]

### Risk Summary
| Category | Top Risk | Score | Status |
|----------|----------|-------|--------|
| Market | [Risk] | X | [Critical/Monitor/Accept] |
| Technical | [Risk] | X | |
| Financial | [Risk] | X | |
| Execution | [Risk] | X | |
| Legal | [Risk] | X | |

### Critical Risks (Score > 6)
1. **[Risk Name]**
   - Description: [What could happen]
   - Mitigation: [How to prevent]
   - Contingency: [Backup plan if it happens]

### Pre-mortem: Top Failure Scenarios
1. **[Scenario]**: [Prevention strategy]
2. **[Scenario]**: [Prevention strategy]
3. **[Scenario]**: [Prevention strategy]

### Red Flags to Watch
- [ ] [Warning sign 1]
- [ ] [Warning sign 2]
- [ ] [Warning sign 3]

### Go/No-Go Recommendation
**[Go / Caution / No-Go]**

Reasoning: [Clear explanation]

Conditions for Go:
- [ ] [Condition 1]
- [ ] [Condition 2]
```
