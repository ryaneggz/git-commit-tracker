# PROPOSAL: SPEC.md to TASK.md Transformation
## Agent: GUARDIAN (Quality & Testing Focus)

---

## 1. Executive Summary

Transform the comprehensive 12-section PRD (SPEC.md) into a focused, testable TASK.md format by extracting verifiable acceptance criteria, defining binary pass/fail success criteria, and establishing guard rails derived from the documented risks and non-goals. The key challenge is converting narrative product vision into discrete, automatable checkpoints that Ralph can execute and validate.

---

## 2. Architectural Analysis

### 2.1 Mapping Risks to Success Criteria Guards

The SPEC.md identifies three critical risks that must inform defensive success criteria:

| Risk from SPEC.md | Guardian Implication | Success Criteria Guard |
|-------------------|---------------------|------------------------|
| **Vanity metrics perception** | UI must emphasize "momentum" language | `[ ] Chart title contains "momentum" or "progress" (not "productivity score")` |
| **GitHub API limits** | Must implement caching/rate limiting | `[ ] Repeated requests within 60s return cached data` |
| **Misinterpretation of commits** | Filters must be available and visible | `[ ] Bot commits are excluded by default; filter toggle visible` |

### 2.2 Non-Goals as Exclusion Tests

The explicit non-goals in Section 7 become **negative success criteria** (things that must NOT exist):

| Non-Goal | Negative Test |
|----------|---------------|
| Code quality analysis | `[ ] No code quality scores or badges displayed` |
| Lines of code metrics | `[ ] No LOC counts visible anywhere in UI` |
| AI judgment or scoring | `[ ] No AI-generated ratings or performance scores` |
| Team analytics | `[ ] No team comparison views or leaderboards` |

### 2.3 Test Command Strategy

Given the tech stack (Next.js + TypeScript), the test command should be comprehensive:

**Recommended test_command options (in order of preference):**

1. **Primary:** `npm run test` (if Jest/Vitest configured)
2. **Build validation:** `npm run build && npm run lint`
3. **Type check:** `npx tsc --noEmit`
4. **E2E fallback:** `npm run dev & sleep 5 && curl -s http://localhost:3000 | grep -q 'Commitline'`

**Recommendation:** Use a composite command:
```yaml
test_command: "npm run build && npm run lint && npm run test"
```

This ensures:
- TypeScript compiles without errors
- Code style is consistent
- Unit/integration tests pass

---

## 3. Implementation Strategy

### 3.1 Creating Binary (Pass/Fail) Success Criteria

Transform narrative features into testable checkpoints:

**From SPEC.md Section 6.1 (Commit Timeline):**
```
Original: "X-axis: Time, Y-axis: Cumulative commits"

Binary Criteria:
[ ] Chart renders with x-axis showing date labels
[ ] Chart renders with y-axis showing numeric commit counts
[ ] Cumulative totals increase monotonically (never decrease)
```

**From SPEC.md Section 5 (Core User Journey):**
```
Original: "Authenticate with GitHub"

Binary Criteria:
[ ] "Sign in with GitHub" button visible on landing page
[ ] OAuth flow redirects to GitHub authorization
[ ] Successful auth redirects back with user data displayed
[ ] Auth errors show user-friendly error message
```

### 3.2 Deriving Test Commands from Features

| Feature | Manual Test | Automated Test Approach |
|---------|-------------|------------------------|
| GitHub OAuth | Click login button | Cypress/Playwright E2E test |
| Chart rendering | Visual inspection | Jest + React Testing Library snapshot |
| Data persistence | Refresh page | Integration test checking cache |
| Image export | Click export | Unit test for canvas/SVG generation |
| Public link sharing | Copy link | API route test returning valid URL |

### 3.3 Validation Checkpoints

Proposed validation gates for Ralph:

1. **Gate 1: Build** - `npm run build` passes
2. **Gate 2: Types** - No TypeScript errors
3. **Gate 3: Lint** - ESLint passes
4. **Gate 4: Unit Tests** - All unit tests pass
5. **Gate 5: Integration** - API routes respond correctly
6. **Gate 6: Visual** - Key UI elements render (can be snapshot-tested)

---

## 4. Design Decisions

### 4.1 Test Command Selection for Complex Features

**Challenge:** The app has visual, interactive features that are hard to test automatically.

**Decision Matrix:**

| Feature Type | Test Strategy | Rationale |
|-------------|---------------|-----------|
| Chart rendering | Snapshot tests | Detect unintended visual changes |
| OAuth flow | Mock-based unit tests | Can't hit real GitHub in CI |
| API routes | Integration tests | Verify data transformation |
| Export (PNG) | Unit test on data prep | Canvas testing is fragile |

**Final test_command recommendation:**
```yaml
test_command: "npm run build && npm run test -- --coverage --passWithNoTests"
```

The `--passWithNoTests` flag allows incremental development (Ralph can start without tests, add them as features complete).

### 4.2 Guard Rails in Success Criteria

To prevent scope creep and mission drift, include explicit guard rails:

```markdown
## Guard Rails (Must NOT Implement)

- [ ] No database beyond JSON caching (no Postgres, no Prisma)
- [ ] No user accounts beyond GitHub OAuth (no email/password)
- [ ] No team features (single-user only for MVP)
- [ ] No paid tier or monetization UI
- [ ] No analytics dashboards (single visualization only)
```

### 4.3 Edge Case Documentation

**Critical edge cases to include as explicit criteria:**

| Edge Case | Success Criterion |
|-----------|-------------------|
| User with 0 commits | `[ ] Empty state shows helpful message, not broken chart` |
| User with 10,000+ commits | `[ ] Performance: chart renders in <3 seconds` |
| Private repos only | `[ ] OAuth requests appropriate scopes (repo access)` |
| Rate limited by GitHub | `[ ] Rate limit error shows retry message with countdown` |
| Invalid time window | `[ ] Date range validation prevents future dates` |
| Repo with merge commits only | `[ ] Filter toggle clearly indicates excluded commits` |

---

## 5. Risk Assessment

### 5.1 Untestable Criteria (Flagged)

Some SPEC.md requirements are inherently subjective and cannot be binary-tested:

| Requirement | Issue | Mitigation |
|-------------|-------|------------|
| "Smooth, minimal, dark-mode friendly" | Subjective design | Remove from TASK.md or convert to "dark mode CSS class present" |
| "Screenshot-ready at all times" | Requires human judgment | Convert to "chart container has fixed aspect ratio" |
| "Signal > noise" | Philosophy, not testable | Omit from success criteria |
| "Zero configuration to value" | Time-based, variable | Convert to "default repo selection works without user input" |

**Recommendation:** These should be documented in a separate "Design Principles" section, not as checkboxes.

### 5.2 Missing Edge Cases (Gaps in SPEC.md)

The SPEC.md does not address:

1. **Offline behavior** - What happens if GitHub API is unreachable?
2. **Token expiration** - How to handle expired OAuth tokens?
3. **Timezone handling** - Whose timezone for commit dates?
4. **Repository permissions** - What if user revokes access mid-session?
5. **Large org accounts** - Pagination for users with 100+ repos?

**Recommendation:** Add explicit criteria:
```markdown
[ ] Network error shows offline message (not crash)
[ ] Expired token prompts re-authentication
[ ] All dates displayed in user's local timezone
[ ] Repository list supports pagination (>50 repos)
```

### 5.3 Scope Boundary Violations (Risk Flags)

Potential scope creep vectors to guard against:

| Temptation | Why It's Out of Scope | Guard |
|------------|----------------------|-------|
| Adding streak badges | Gamification not in MVP | Non-goal check |
| Team comparison view | Explicitly excluded | Non-goal check |
| Code complexity metrics | Not about momentum | Non-goal check |
| Email notifications | Future extension only | Version check |

---

## 6. Estimated Complexity

| Dimension | Assessment | Justification |
|-----------|------------|---------------|
| **Scope** | **Medium** | 4 core features (timeline, velocity, share, controls), each with 3-5 criteria |
| **Risk Level** | **Medium** | OAuth + GitHub API introduce external dependencies; visual testing is challenging |

**Breakdown:**

- **Low complexity:** Data model, API routes, basic UI structure
- **Medium complexity:** Chart rendering, OAuth flow, image export
- **High complexity:** Comprehensive test coverage, edge case handling

**Estimated Success Criteria Count:** 25-30 checkboxes

---

## 7. Recommended TASK.md Structure

```yaml
---
task: Build Commitline - GitHub commit visualization app
test_command: "npm run build && npm run lint && npm run test"
---

# Task: Commitline MVP

Build a lightweight visualization app that transforms Git commit history into a linear timeline of momentum.

## Requirements

1. Next.js App Router with TypeScript
2. GitHub OAuth authentication
3. Commit timeline chart (cumulative, linear)
4. Velocity indicators (weekly/monthly rate)
5. Shareable public link and PNG export
6. Repo selection with filters

## Success Criteria

### Authentication
- [ ] Landing page shows "Sign in with GitHub" button
- [ ] OAuth flow completes and displays username
- [ ] Auth errors show user-friendly message

### Chart Visualization
- [ ] Chart renders with time on x-axis, commits on y-axis
- [ ] Cumulative commit line displays correctly
- [ ] Dark mode styling applied by default
- [ ] Chart renders in <3 seconds for 10,000 commits

### Velocity Indicators
- [ ] Weekly commit rate displayed
- [ ] % growth vs prior period calculated
- [ ] Velocity numbers update with time window changes

### Sharing
- [ ] "Copy Link" generates public read-only URL
- [ ] "Export PNG" downloads chart image
- [ ] Exported image includes minimal watermark

### Repo Controls
- [ ] Repo multi-select dropdown works
- [ ] Time presets (30/90/180/All) filter data
- [ ] Bot commits excluded by default

### Edge Cases
- [ ] Zero commits shows empty state message
- [ ] Rate limit error shows retry countdown
- [ ] Network error shows offline message

## Guard Rails (Must NOT Include)
- [ ] No code quality analysis
- [ ] No lines of code metrics
- [ ] No AI scoring or judgment
- [ ] No team comparison features

## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ])
2. Check off completed criteria (change [ ] to [x])
3. Run tests after changes: `npm run build && npm run test`
4. Commit frequently with descriptive messages
5. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`
6. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`
```

---

## 8. Quality Checklist for Final TASK.md

Before finalizing, verify:

- [ ] Every criterion is binary (pass/fail, not subjective)
- [ ] Test command validates build integrity
- [ ] Edge cases from risk analysis included
- [ ] Non-goals converted to guard rail checkboxes
- [ ] No criterion requires human judgment
- [ ] Ralph instructions are clear and unambiguous
- [ ] Success metrics from SPEC.md have corresponding criteria

---

*Proposal prepared by AGENT_3: GUARDIAN*
*Focus: Testability, Validation, Edge Cases*
