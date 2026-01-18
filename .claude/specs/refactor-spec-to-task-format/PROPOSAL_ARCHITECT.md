# PROPOSAL: SPEC.md to TASK.md Transformation

**Agent:** ARCHITECT (Agent 1)
**Domain:** System Architecture, Information Hierarchy, Design Patterns
**Date:** 2026-01-17

---

## 1. Executive Summary

I recommend a **multi-TASK decomposition strategy** where the comprehensive SPEC.md (12-section PRD) is transformed into **4-6 focused TASK.md files**, each targeting a discrete feature or component from the MVP scope. This approach preserves the architectural intent of the PRD while producing actionable, testable task definitions that align with Ralph's autonomous execution model. The transformation prioritizes **testability over narrative** and **success criteria over vision**.

---

## 2. Architectural Analysis

### 2.1 Section Mapping: SPEC.md to TASK.md

| SPEC.md Section | TASK.md Element | Transformation Strategy |
|-----------------|-----------------|------------------------|
| 1. Problem Statement | *Omit* | Context only; not actionable |
| 2. Product Vision | Task description (1-2 sentences) | Distill to task purpose |
| 3. Goals & Success Metrics | Success Criteria checkboxes | Map metrics to testable assertions |
| 4. Target User & ICP | *Omit* | User context; not actionable |
| 5. Core User Journey | Requirements list + Success Criteria | Journey steps become testable flows |
| 6. Core Features (MVP) | **Primary source** for task decomposition | Each feature = potential TASK.md |
| 7. Non-Goals | Ralph Instructions (constraints) | Negative scope as guard rails |
| 8. Tech Stack & Architecture | `task` frontmatter + Requirements | Explicit tech constraints |
| 9. UX Principles | Success Criteria (quality gates) | Translate to testable UI assertions |
| 10. Risks & Mitigations | Ralph Instructions (edge cases) | Risk scenarios as test cases |
| 11. Future Extensions | *Omit* | Post-MVP; out of scope |
| 12. Positioning Summary | *Omit* | Marketing; not actionable |

### 2.2 Information Extraction vs. Omission

**Extract and Transform:**
- Feature specifications (Section 6) - Core task content
- Technical constraints (Section 8) - Frontmatter and requirements
- Success metrics (Section 3) - Testable success criteria
- User journey (Section 5) - End-to-end test scenarios
- UX principles (Section 9) - Quality assertions

**Omit or Summarize:**
- Problem statement - One-line context at most
- Product vision - Distill to single purpose sentence
- ICP details - Irrelevant for implementation tasks
- Future extensions - Explicitly out of scope
- Positioning - No implementation relevance

### 2.3 Multi-Feature PRD Handling

The SPEC.md contains **4 distinct MVP features** (Section 6):
1. Commit Timeline (Core visualization)
2. Velocity Indicators (Metrics overlay)
3. Shareability (Export/sharing)
4. Repo Controls (Configuration)

**Architectural Decision:** Each feature warrants its own TASK.md for:
- Independent development and testing
- Clear ownership boundaries
- Parallelizable work streams
- Focused success criteria

Additionally, a **foundation TASK.md** is needed for:
- GitHub OAuth integration
- API route setup
- Project scaffolding

---

## 3. Implementation Strategy

### 3.1 Step-by-Step Transformation Approach

```
Phase 1: Decomposition
   |
   +-- Identify discrete features from Section 6
   +-- Map cross-cutting concerns (auth, API, caching)
   +-- Define task boundaries
   |
Phase 2: Frontmatter Construction
   |
   +-- Define `task` as action-oriented summary
   +-- Determine `test_command` for each task
   +-- Set task scope/complexity
   |
Phase 3: Requirements Derivation
   |
   +-- Extract technical requirements from Section 8
   +-- Pull feature specifications from Section 6
   +-- Include relevant UX constraints from Section 9
   |
Phase 4: Success Criteria Formulation
   |
   +-- Transform feature bullets to checkbox assertions
   +-- Derive from success metrics (Section 3)
   +-- Add testable edge cases from Risks (Section 10)
   |
Phase 5: Ralph Instructions
   |
   +-- Standard workflow (6-step template)
   +-- Task-specific constraints from Non-Goals (Section 7)
   +-- Error handling guidance from Risks (Section 10)
```

### 3.2 Section-by-Section Mapping (Commitline Example)

**SPEC.md Section 6.1 (Commit Timeline):**
```markdown
### 6.1 Commit Timeline (Core)
* X-axis: Time
* Y-axis: Cumulative commits
* Emphasis on **slope change** (momentum)
* Smooth, minimal, dark-mode friendly
```

**Transforms to TASK.md:**
```markdown
---
task: Build commit timeline visualization component
test_command: "npm run test -- --grep 'CommitTimeline'"
---

# Task: Commit Timeline Visualization

Build the core timeline chart showing cumulative commits over time.

## Requirements

1. Create `CommitTimeline.tsx` component using Recharts/Visx
2. X-axis displays time (dates), Y-axis shows cumulative commits
3. Dark-mode optimized styling with Tailwind CSS
4. Accepts `CommitEvent[]` data structure as prop
5. Responsive design (mobile-friendly)

## Success Criteria

1. [ ] Timeline renders with sample data without errors
2. [ ] X-axis shows date labels at appropriate intervals
3. [ ] Y-axis shows cumulative commit count
4. [ ] Slope changes (momentum shifts) are visually distinguishable
5. [ ] Component renders correctly in dark mode
6. [ ] Component is responsive (works on mobile viewport)
7. [ ] No TypeScript errors (`tsc --noEmit` passes)
```

### 3.3 Success Criteria Derivation Patterns

| SPEC.md Source | Derivation Pattern | Example |
|----------------|-------------------|---------|
| Feature bullet | Direct assertion | "Smooth, minimal" -> "No janky animations" |
| Success metric | Threshold test | "Time-to-first-visualization <60s" -> "[ ] Initial render completes in <60s" |
| UX principle | Quality gate | "Screenshot-ready at all times" -> "[ ] Chart exports as valid PNG" |
| Non-goal | Negative assertion | "No AI scoring" -> "[ ] No AI/ML dependencies in bundle" |
| Risk mitigation | Edge case test | "GitHub API limits" -> "[ ] Graceful degradation on rate limit" |

---

## 4. Design Decisions

### 4.1 Single TASK.md vs. Multiple per Feature

**Recommendation: Multiple TASK.md files**

| Approach | Pros | Cons |
|----------|------|------|
| Single TASK.md | Simple navigation | Unwieldy (50+ criteria); hard to test; blocks parallelization |
| Multiple TASK.md | Focused scope; independent testing; parallelizable | Requires orchestration; potential gaps |

**Proposed TASK.md Structure:**

```
.claude/specs/commitline/
  +-- TASK_00_foundation.md      # Auth, project setup
  +-- TASK_01_timeline.md        # Core visualization
  +-- TASK_02_velocity.md        # Velocity indicators
  +-- TASK_03_shareability.md    # Export & sharing
  +-- TASK_04_repo_controls.md   # Configuration UI
  +-- TASK_05_integration.md     # End-to-end flow
```

### 4.2 Frontmatter Structure for Complex PRDs

**Standard frontmatter:**
```yaml
---
task: [Action verb] + [Component/Feature] + [Context]
test_command: "[npm/npx command to verify task completion]"
depends_on: [optional: list of prerequisite TASK files]
priority: [optional: 1-5 for sequencing]
---
```

**Extended frontmatter for orchestration:**
```yaml
---
task: Build commit timeline visualization component
test_command: "npm run test -- --grep 'CommitTimeline'"
depends_on:
  - TASK_00_foundation.md
priority: 1
tech_stack:
  - TypeScript
  - React
  - Recharts
estimated_complexity: medium
---
```

### 4.3 Ralph Instruction Adaptation

**Standard Template (from example):**
```markdown
## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ])
2. Check off completed criteria (change [ ] to [x])
3. Run tests after changes
4. Commit your changes frequently
5. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`
6. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`
```

**Enhanced Template for Complex Tasks:**
```markdown
## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ])
2. Check off completed criteria (change [ ] to [x])
3. Run tests after changes: `npm run test`
4. Verify types: `npx tsc --noEmit`
5. Commit your changes frequently with descriptive messages
6. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`
7. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`

### Constraints (from Non-Goals)
- Do NOT implement code quality analysis
- Do NOT add lines-of-code metrics
- Do NOT introduce AI/ML scoring

### Edge Cases to Handle
- GitHub API rate limiting (graceful degradation)
- Invalid/missing commit data (show placeholder)
- User with zero commits (empty state UI)
```

---

## 5. Risk Assessment

### 5.1 Information Loss Concerns

| Risk | Severity | Mitigation |
|------|----------|------------|
| Vision/strategy context lost | Low | Keep SPEC.md as reference document; link in TASK.md header |
| Cross-cutting concerns fragmented | Medium | Create TASK_00_foundation.md for shared setup |
| UX cohesion degraded | Medium | Include "Design Principles" section in foundation task |
| Success metric granularity lost | Low | Map high-level metrics to multiple specific criteria |

### 5.2 Scope Creep in Success Criteria

| Risk | Severity | Mitigation |
|------|----------|------------|
| Criteria become too granular | Medium | Limit to 6-8 criteria per task |
| Implicit requirements missed | Medium | Explicit "implicit" checklist review |
| Gold-plating via criteria | Low | Strict adherence to MVP scope in SPEC.md Section 6 |

### 5.3 Testability of Success Criteria

| Risk | Severity | Mitigation |
|------|----------|------------|
| Subjective criteria ("smooth", "minimal") | High | Quantify or operationalize: "animation <300ms", "< 5 DOM elements" |
| Integration dependencies | Medium | Mock external services in test_command |
| Environment-specific failures | Low | Use CI-compatible test commands |

**Testability Checklist for Criteria:**
- [ ] Can be verified with a single command?
- [ ] Has deterministic pass/fail outcome?
- [ ] Does not require manual inspection?
- [ ] Works in CI environment?

---

## 6. Estimated Complexity

| Dimension | Assessment | Rationale |
|-----------|------------|-----------|
| **Scope** | **Medium** | 4 MVP features + foundation = 5-6 TASK.md files; moderate transformation complexity |
| **Risk Level** | **Low** | Transformation is mechanical; original SPEC.md is well-structured; no ambiguity in feature boundaries |

**Effort Breakdown:**
- TASK_00_foundation.md: 30 min (Auth + setup)
- TASK_01_timeline.md: 45 min (Core feature, most complex)
- TASK_02_velocity.md: 30 min (Derivative of timeline)
- TASK_03_shareability.md: 30 min (Export features)
- TASK_04_repo_controls.md: 30 min (Configuration)
- TASK_05_integration.md: 45 min (E2E validation)

**Total Estimated Effort:** 3-4 hours for complete transformation

---

## 7. Recommended Next Steps

1. **Create directory structure:** `.claude/specs/commitline/`
2. **Transform in dependency order:** foundation -> timeline -> velocity -> shareability -> controls -> integration
3. **Validate each TASK.md:** Ensure test_command is executable
4. **Cross-reference:** Add `depends_on` frontmatter where needed
5. **Archive original:** Keep SPEC.md as reference, link from TASK files

---

## 8. Appendix: Proposed TASK File Templates

### Template A: Feature Component Task

```markdown
---
task: Build [component name] for [feature]
test_command: "npm run test -- --grep '[ComponentName]'"
---

# Task: [Feature Name]

[1-2 sentence description from SPEC.md vision]

## Requirements

1. [File/component to create]
2. [Technical specification from Section 8]
3. [Feature requirement from Section 6]
4. [Constraint from Section 9 UX]

## Success Criteria

1. [ ] [Testable assertion #1]
2. [ ] [Testable assertion #2]
...
6. [ ] [Testable assertion #6]

## Example Output

[Code block or screenshot description]

---

## Ralph Instructions

[Standard 6-step + task-specific constraints]
```

### Template B: Integration Task

```markdown
---
task: Validate end-to-end [flow name]
test_command: "npm run test:e2e"
depends_on:
  - TASK_01_*.md
  - TASK_02_*.md
---

# Task: [Flow Name] Integration

[Description of user journey being validated]

## Requirements

1. All prerequisite tasks complete
2. [Integration point #1]
3. [Integration point #2]

## Success Criteria

1. [ ] [E2E scenario #1 from Section 5]
2. [ ] [E2E scenario #2 from Section 5]
...

---

## Ralph Instructions

[Standard steps + integration-specific guidance]
```

---

*End of Proposal*
