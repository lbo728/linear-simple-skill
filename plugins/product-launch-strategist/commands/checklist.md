---
description: Review launch readiness with comprehensive checklist
argument-hint: [product-description]
---

# Launch Checklist

Review launch readiness for: $ARGUMENTS

## Step 1: Gather Context

If `$ARGUMENTS` is empty, ask user:
- "어떤 제품의 런칭 준비 상태를 점검할까요?"

Additional questions:
- "예상 런칭 시점은?"
- "주요 런칭 플랫폼은? (Product Hunt, HN, Reddit, etc.)"
- "현재 준비 상태는 어느 정도인가요?"

## Step 2: Load Framework

Read `references/launch-checklist.md` from this plugin's skills directory.

## Step 3: Execute Checklist Review

### 3.1 Product Readiness
- [ ] Core feature complete and stable
- [ ] Critical bugs fixed
- [ ] Error handling in place
- [ ] Loading states implemented
- [ ] Mobile responsive (if web)

### 3.2 Legal & Compliance
- [ ] Privacy Policy written
- [ ] Terms of Service written
- [ ] Cookie consent (if EU users)
- [ ] GDPR compliance (data export/delete)

### 3.3 Analytics & Monitoring
- [ ] Analytics installed
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Key events tracked (signup, activation, conversion)

### 3.4 Payment Setup
- [ ] Payment provider configured
- [ ] Test transactions verified
- [ ] Webhook handling implemented
- [ ] Receipt emails working

### 3.5 Marketing Assets
- [ ] Landing page live
- [ ] Product screenshots (5-8)
- [ ] Demo video/GIF
- [ ] Social media images
- [ ] Press kit ready

### 3.6 Launch Platforms
- [ ] Product Hunt submission ready
- [ ] Hacker News Show HN draft
- [ ] Reddit subreddits identified
- [ ] Twitter announcement thread
- [ ] Email to waitlist

### 3.7 Support Readiness
- [ ] FAQ documented
- [ ] Support email/channel ready
- [ ] Response templates prepared

## Step 4: Deliver Results

```
## Launch Readiness: [Product]

### Overall Score: X/10

### Status by Category
| Category | Status | Items Done | Total |
|----------|--------|------------|-------|
| Product | [Ready/Partial/Not Ready] | X | Y |
| Legal | | | |
| Analytics | | | |
| Payment | | | |
| Marketing | | | |
| Launch Platforms | | | |
| Support | | | |

### Critical Gaps (Must Fix Before Launch)
1. [ ] [Gap 1]
2. [ ] [Gap 2]

### Nice-to-Have (Can Launch Without)
1. [ ] [Item 1]
2. [ ] [Item 2]

### Recommended Launch Date
[Date] - [Reasoning]

### Launch Day Sequence
1. [Time] - [Action]
2. [Time] - [Action]
3. [Time] - [Action]

### Post-Launch Week 1 Priorities
1. [ ] [Priority 1]
2. [ ] [Priority 2]
3. [ ] [Priority 3]
```
