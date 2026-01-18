# 📈 Product Requirements Document (PRD)

**Product Name (Working):** Commitline
**Tagline:** *Show your momentum. Prove your compounding progress.*

---

## 1. Problem Statement

Modern developers—especially those building in public—are shipping at an accelerating pace. Existing tools (GitHub graphs, contribution heatmaps) are:

* **Non-linear** and hard to interpret at a glance
* **Not narrative-driven** (no story of momentum)
* **Not designed for sharing** (social, portfolio, or recruiting)

Developers want a **clean, linear, and visually compelling way** to show how their productivity compounds over time.

---

## 2. Product Vision

Build a **lightweight, opinionated visualization app** that transforms Git commit history into a **linear timeline of momentum**, making exponential growth obvious and shareable.

This is not analytics-heavy.
This is **signal > noise**.

---

## 3. Goals & Success Metrics

### Primary Goals

* Make **exponential dev activity visually obvious**
* Enable **one-click sharing** (image + link)
* Encourage **building in public**

### Success Metrics

* % of users generating a shareable link
* Social shares per user
* Time-to-first-visualization (<60 seconds)
* Returning users tracking growth weekly/monthly

---

## 4. Target User & ICP

### Ideal Customer Profile (ICP)

#### Primary ICP: Builder-in-Public Developer

* **Role:** Indie hacker, startup founder, OSS contributor, SWE
* **Experience:** Junior → Senior
* **Behavior:**

  * Ships frequently
  * Uses GitHub daily
  * Shares progress on X, LinkedIn, Discord
* **Pain Points:**

  * GitHub contribution graph doesn’t tell a story
  * Hard to show *rate of improvement*
  * Wants social proof without bragging

> “I *feel* like I’m shipping faster, but I can’t show it clearly.”

---

#### Secondary ICP: Hiring-Focused Developer

* **Role:** Job seeker, freelancer, consultant
* **Goal:** Prove consistency and momentum
* **Use Case:** Portfolio, resume link, recruiter follow-up

> “I want my work ethic to be undeniable.”

---

#### Tertiary ICP: Developer Influencer / Educator

* **Role:** Content creator, community lead
* **Use Case:** Teaching consistency, motivation, accountability

---

## 5. Core User Journey

1. **Authenticate with GitHub**
2. Select:

   * Repo(s)
   * Time window (30 / 90 / 180 / All-time)
3. App generates:

   * Linear timeline of commits
   * Growth curve (velocity & acceleration)
4. User:

   * Exports image
   * Shares public link
   * Optionally adds caption/annotation

---

## 6. Core Features (MVP)

### 6.1 Commit Timeline (Core)

* X-axis: Time
* Y-axis: Cumulative commits
* Emphasis on **slope change** (momentum)
* Smooth, minimal, dark-mode friendly

### 6.2 Velocity Indicators

* Weekly / monthly commit rate
* % growth vs prior period
* Optional “exponential highlight” zones

### 6.3 Shareability

* Public read-only link
* PNG export optimized for X / LinkedIn
* Minimal watermark or signature

### 6.4 Repo Controls

* Include / exclude repos
* Ignore bots & merge commits
* Timeframe presets

---

## 7. Non-Goals (Explicitly Out of Scope)

* Code quality analysis
* Lines of code metrics
* AI judgment or scoring
* Team analytics (initially)

This is **about momentum, not merit**.

---

## 8. Tech Stack & Architecture

### Frontend

* **Next.js (App Router)**
* **TypeScript**
* **shadcn/ui**
* Tailwind CSS
* Recharts / Visx (for charts)
* Server Components where possible

### Backend

* Next.js API routes
* GitHub OAuth
* GitHub GraphQL API
* Lightweight caching (Redis / edge cache)

### Data Model (Simplified)

```ts
CommitEvent {
  date: Date
  count: number
  cumulative: number
}
```

---

## 9. UX Principles

* **Opinionated defaults**
* **Zero configuration to value**
* Dark-mode first
* “Screenshot-ready” at all times
* No dashboards, no clutter

---

## 10. Risks & Mitigations

| Risk                         | Mitigation                         |
| ---------------------------- | ---------------------------------- |
| Vanity metrics perception    | Position as momentum & consistency |
| GitHub API limits            | Cache + scoped queries             |
| Misinterpretation of commits | Clear disclaimers & filters        |

---

## 11. Future Extensions (Post-MVP)

* Streak overlays
* Annotations (“Launched X”, “Refactor phase”)
* Team views
* Weekly digest emails
* Embed widgets

---

## 12. Positioning Summary

**Commitline is not GitHub Analytics.**
It’s a **visual proof of compounding effort**.

> *“Momentum is the real signal.”*