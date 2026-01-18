# PROPOSAL: SPEC.md to TASK.md Transformation

**Agent:** CRAFTSMAN (Clean Code & Maintainability Expert)
**Date:** 2026-01-17
**Subject:** Transforming Commitline PRD into Actionable Task Format

---

## 1. Executive Summary

The transformation from SPEC.md (narrative PRD) to TASK.md (checklist-based) requires applying the Single Responsibility Principle to decompose 12 PRD sections into atomic, testable tasks. I recommend creating **5-7 focused TASK.md files** rather than one monolithic file, each with clear success criteria that can be objectively verified. This approach maximizes maintainability, enables parallel development, and ensures each task has a clear "done" definition.

---

## 2. Architectural Analysis

### 2.1 Applying Single Responsibility to Task Breakdown

The PRD contains several distinct concerns that should be separated:

| PRD Section(s) | Proposed Task File | Responsibility |
|----------------|-------------------|----------------|
| 6.1 Commit Timeline | `TASK_01_TIMELINE_CHART.md` | Core visualization component |
| 6.2 Velocity Indicators | `TASK_02_VELOCITY_METRICS.md` | Data calculation and display |
| 6.3 Shareability | `TASK_03_SHARING.md` | Export and link generation |
| 6.4 Repo Controls | `TASK_04_REPO_CONTROLS.md` | User input and filtering |
| 5 User Journey (Auth) | `TASK_00_GITHUB_AUTH.md` | OAuth integration |
| 8 Tech Stack | `TASK_SETUP_PROJECT.md` | Initial scaffolding |

**Rationale:** Each task file should change for exactly one reason. Mixing visualization logic with authentication concerns violates SRP and creates maintenance burden.

### 2.2 Clean Structure for Maximum Readability

Following the example TASK.md template, each file should maintain this structure:

```
---
task: [One-line imperative description]
test_command: "[Executable verification command]"
---

# Task: [Descriptive Title]

[1-2 sentence context paragraph]

## Requirements
[Numbered list of technical constraints]

## Success Criteria
[Checkbox list of verifiable outcomes]

## Example Output
[Concrete demonstration of completion]

---

## Ralph Instructions
[Standard agent workflow guidance]
```

**Key Principle:** Requirements define WHAT; Success Criteria define HOW TO VERIFY.

### 2.3 Maintaining Consistency with Template

The example TASK.md demonstrates several patterns to preserve:

1. **YAML frontmatter** with `task` and `test_command` is mandatory
2. **Success criteria use checkboxes** (`[ ]`) for trackable progress
3. **Example output is concrete**, not abstract
4. **Ralph Instructions remain standard** across all task files

---

## 3. Implementation Strategy

### 3.1 Writing Testable Success Criteria

**Bad (Untestable):**
```
- [ ] Timeline looks good
- [ ] Chart is responsive
```

**Good (Testable):**
```
- [ ] Running `npm run dev` shows commit timeline at `/` route
- [ ] Timeline renders with X-axis showing dates and Y-axis showing cumulative commits
- [ ] Resizing browser window from 1920px to 375px keeps chart readable without horizontal scroll
```

**Formula for Testable Criteria:**
```
[Action] + [Object] + [Observable Outcome] + [Optional: Specific Values]
```

### 3.2 Naming Conventions for Clarity

| Element | Convention | Example |
|---------|------------|---------|
| Task files | `TASK_[NN]_[FEATURE].md` | `TASK_01_TIMELINE_CHART.md` |
| Task title | Imperative verb phrase | "Build the commit timeline chart" |
| Requirements | Numbered, constraint-focused | "1. Use Recharts library" |
| Success criteria | Checkbox, outcome-focused | "- [ ] Chart displays mock data" |

### 3.3 Example Outputs That Demonstrate Completion

For Commitline, example outputs should include:

**Timeline Chart Task:**
```
$ npm run dev
# Navigate to http://localhost:3000

Expected: Linear chart visible showing:
- X-axis: "Jan 2026" through "Dec 2026"
- Y-axis: 0 to N commits
- Line showing cumulative growth curve
- Dark mode styling applied
```

**Sharing Task:**
```
$ # Click "Share" button on timeline view

Expected:
1. PNG downloads with filename: commitline-[username]-[date].png
2. Public link copied to clipboard: https://commitline.app/share/[hash]
3. Toast notification: "Link copied!"
```

---

## 4. Design Decisions

### 4.1 Atomic vs. Composite Tasks

**Decision: Prefer atomic tasks with dependencies declared.**

| Approach | Pros | Cons |
|----------|------|------|
| Atomic (5-7 files) | Parallel work, clear ownership, focused testing | More files to manage |
| Composite (1-2 files) | Single source of truth | Bloated, hard to track progress |

**Recommendation:** Use atomic tasks with a `depends_on` field in frontmatter:

```yaml
---
task: Build velocity indicators
test_command: "npm test -- --grep 'velocity'"
depends_on: ["TASK_01_TIMELINE_CHART.md"]
---
```

### 4.2 Success Criteria Granularity

**Target: 4-8 criteria per task.**

- Fewer than 4: Task may be too trivial or criteria too vague
- More than 8: Task should be split

**Granularity Spectrum for Commitline:**

```
Too Coarse:                     Optimal:                        Too Fine:
- [ ] Timeline works            - [ ] Chart renders data        - [ ] Import Recharts
                                - [ ] X-axis shows time         - [ ] Create component file
                                - [ ] Y-axis shows commits      - [ ] Add useState hook
                                - [ ] Dark mode applies         - [ ] Define interface
```

### 4.3 Balance Between Brevity and Completeness

**Guideline: Include enough detail to be unambiguous, no more.**

The PRD's 210 lines should compress to approximately:
- 6 task files x ~50 lines each = ~300 lines total
- BUT each line is actionable vs. narrative

**What to Keep:**
- Technical constraints (tech stack choices)
- User-facing behaviors (from User Journey)
- Explicit non-goals (prevent scope creep)

**What to Omit:**
- Problem statements (context, not action)
- Vision statements (motivation, not specification)
- Future extensions (out of scope)

---

## 5. Risk Assessment

### 5.1 Ambiguous Success Criteria

**Risk:** Criteria like "chart is responsive" have no objective verification.

**Mitigation:**
- Every criterion must specify a test action
- Include specific viewport sizes or data values where relevant
- Use `test_command` to enable automated verification

### 5.2 Over-Specification vs. Under-Specification

| Risk | Symptom | Mitigation |
|------|---------|------------|
| Over-specification | Criteria dictate implementation details | Focus on outcomes, not internals |
| Under-specification | "It works" without definition | Add observable behaviors |

**Example Balance:**
```
Over-specified: "Use useState with initial value []"
Under-specified: "State management works"
Balanced: "Adding a repo updates the displayed list without page refresh"
```

### 5.3 Maintaining Task Focus

**Risk:** Tasks drift to include adjacent features.

**Mitigation:**
- Explicit "Non-Goals" section per task (borrowed from PRD)
- Cross-reference related tasks without duplicating criteria
- Review each criterion against the task title

---

## 6. Estimated Complexity

| Dimension | Assessment | Rationale |
|-----------|------------|-----------|
| **Scope** | **Medium** | 210 lines of PRD to transform, 5-7 output files, requires understanding of both formats |
| **Risk Level** | **Low** | Transformation is mechanical once principles are understood; no code execution risk |

### Effort Breakdown

| Activity | Estimated Time |
|----------|----------------|
| Task decomposition (identify 5-7 tasks) | 30 min |
| Write frontmatter and requirements per task | 15 min x 6 = 90 min |
| Craft testable success criteria | 20 min x 6 = 120 min |
| Create example outputs | 10 min x 6 = 60 min |
| Review for consistency and completeness | 30 min |
| **Total** | **~5.5 hours** |

---

## 7. Proposed Task File Structure

Based on analysis, I recommend the following task breakdown:

### TASK_00_PROJECT_SETUP.md
- Initialize Next.js with App Router
- Configure TypeScript, Tailwind, shadcn/ui
- Set up project structure

### TASK_01_GITHUB_AUTH.md
- GitHub OAuth integration
- Token storage and refresh
- Authenticated API client

### TASK_02_TIMELINE_CHART.md
- Core visualization component
- X-axis (time), Y-axis (cumulative commits)
- Dark mode styling
- Slope/momentum emphasis

### TASK_03_VELOCITY_METRICS.md
- Weekly/monthly commit rate calculation
- Percentage growth display
- Exponential highlight zones (optional)

### TASK_04_REPO_CONTROLS.md
- Repo selection UI
- Time window presets (30/90/180/All)
- Bot/merge commit filtering

### TASK_05_SHARING.md
- PNG export (social-optimized dimensions)
- Public read-only link generation
- Watermark/signature

### TASK_06_INTEGRATION.md
- End-to-end user journey
- Performance verification (<60s to first visualization)
- Cross-feature integration testing

---

## 8. Sample Transformation

To illustrate the approach, here is Section 6.1 (Commit Timeline) transformed:

```markdown
---
task: Build the commit timeline visualization component
test_command: "npm run dev && curl -s http://localhost:3000 | grep -q 'timeline'"
---

# Task: Commit Timeline Chart

Build the core visualization component that displays cumulative commits over time as a linear chart.

## Requirements

1. Use Recharts or Visx for chart rendering
2. Component located at `components/timeline-chart.tsx`
3. Accept data in format: `{ date: Date, count: number, cumulative: number }[]`
4. Dark-mode first styling with Tailwind CSS
5. Responsive from 375px to 1920px viewport width

## Success Criteria

- [ ] Component renders without errors given valid commit data
- [ ] X-axis displays time with appropriate labels (days/weeks/months based on range)
- [ ] Y-axis displays cumulative commit count starting from 0
- [ ] Chart line shows slope changes (acceleration visible)
- [ ] Hovering on data points shows tooltip with date and count
- [ ] Chart maintains readability at 375px mobile width
- [ ] Dark mode colors applied (dark background, light line)

## Example Output

```
# With mock data: [
#   { date: "2026-01-01", count: 5, cumulative: 5 },
#   { date: "2026-01-08", count: 8, cumulative: 13 },
#   { date: "2026-01-15", count: 12, cumulative: 25 }
# ]

Expected render:
- Chart shows upward curve from 5 -> 13 -> 25
- Steeper slope visible in second week (8 commits vs 5)
- Tooltip on Jan 15 shows: "25 total commits (+12 this period)"
```

---

## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ])
2. Check off completed criteria (change [ ] to [x])
3. Run tests after changes
4. Commit your changes frequently
5. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`
6. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`
```

---

## 9. Conclusion

Transforming SPEC.md to TASK.md format is an exercise in applying clean code principles to documentation. By decomposing the narrative PRD into atomic, testable tasks with clear success criteria, we create a maintainable system that:

1. **Enables parallel development** - Independent tasks can be worked on simultaneously
2. **Provides clear completion signals** - Every checkbox is objectively verifiable
3. **Reduces ambiguity** - Example outputs demonstrate expected outcomes
4. **Supports incremental delivery** - Each task delivers standalone value

The transformation preserves the essential requirements from the PRD while discarding narrative context that, while valuable for understanding, does not contribute to actionable implementation guidance.

---

*Prepared by CRAFTSMAN Agent*
*Expertise: Clean Code, Maintainability, SOLID Principles*
