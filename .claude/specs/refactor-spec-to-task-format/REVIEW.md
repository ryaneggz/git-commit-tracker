# ELITE COUNCIL REVIEW: SPEC.md to TASK.md Transformation

**Review Date:** 2026-01-17
**Feature:** Refactor SPEC.md in the format structure of TASK.md
**Council Members:** Architect, Craftsman, Guardian
**Document Version:** 1.0

---

## 1. Proposal Comparison Matrix

| Dimension | ARCHITECT | CRAFTSMAN | GUARDIAN |
|-----------|-----------|-----------|----------|
| **Architecture Approach** | Multi-TASK decomposition (4-6 files); dependency-ordered; feature-based isolation | Atomic tasks with SRP; 5-7 files; `depends_on` in frontmatter | Single consolidated TASK.md with sectioned criteria; guard rails emphasis |
| **File Structure** | `TASK_00_foundation.md` through `TASK_05_integration.md` in numbered sequence | `TASK_00_PROJECT_SETUP.md` through `TASK_06_INTEGRATION.md` with feature naming | Single file with grouped sections (Auth, Chart, Velocity, Sharing, Controls, Edge Cases) |
| **Success Criteria Strategy** | Testable assertions derived from features, UX, and risks; 6-8 per task | Formula-based: `[Action] + [Object] + [Outcome] + [Values]`; 4-8 per task | Binary pass/fail only; includes negative criteria (guard rails); 25-30 total |
| **Risk Handling** | Information loss matrix; scope creep prevention; testability checklist | Over/under-specification balance; task drift prevention | Explicit guard rails section; untestable criteria flagged; missing edge cases identified |
| **Estimated Effort** | 3-4 hours total | 5.5 hours total | Not explicitly stated (implied medium) |
| **Complexity Assessment** | Medium scope, Low risk | Medium scope, Low risk | Medium scope, Medium risk |

---

## 2. Consensus Points

All three proposals agree on the following:

### 2.1 Core Structure Requirements
- **YAML frontmatter is mandatory** with `task` and `test_command` fields
- **Success criteria must use checkboxes** (`[ ]`) for trackable progress
- **Ralph Instructions section follows a standard 6-step template**
- **Example Output section provides concrete completion evidence**

### 2.2 Section Mapping from SPEC.md
All proposals agree to:
- **Extract:** Sections 6 (Core Features), 8 (Tech Stack), 3 (Success Metrics), 5 (User Journey)
- **Omit:** Sections 1 (Problem Statement), 2 (Vision), 4 (ICP), 11 (Future Extensions), 12 (Positioning)
- **Transform:** Section 7 (Non-Goals) into constraints/guard rails, Section 10 (Risks) into edge case tests

### 2.3 Feature Decomposition
All proposals identify the same 4 MVP features requiring task coverage:
1. Commit Timeline (Core visualization)
2. Velocity Indicators (Metrics)
3. Shareability (Export/links)
4. Repo Controls (Configuration)

Plus foundational work:
- GitHub OAuth integration
- Project scaffolding/setup

### 2.4 Testability Requirements
- Success criteria must be **binary (pass/fail)**
- Subjective requirements ("smooth", "minimal") must be **operationalized or omitted**
- Test commands must be **CI-compatible and executable**

### 2.5 Non-Goals Transformation
All proposals convert SPEC.md Section 7 (Non-Goals) into explicit negative constraints that prevent scope creep.

---

## 3. Divergence Analysis

### 3.1 Single vs. Multiple TASK Files

| Position | Advocate | Rationale |
|----------|----------|-----------|
| **Multiple files (5-7)** | ARCHITECT, CRAFTSMAN | Enables parallel development; focused testing; clear ownership; SRP adherence |
| **Single consolidated file** | GUARDIAN | Holistic view; simpler navigation; unified test command |

**Council Decision:** **MULTIPLE FILES**

**Reasoning:** The MVP has 4 distinct features plus foundation and integration concerns. Multiple files enable:
- Parallel work streams for faster development
- Independent testing and validation
- Clear task boundaries without cross-contamination
- Incremental delivery of value

**Mitigation for GUARDIAN's concerns:** Include a master index or README listing all tasks in execution order.

### 3.2 Success Criteria Count per Task

| Position | Advocate | Range |
|----------|----------|-------|
| 6-8 criteria | ARCHITECT | Optimal for focused tasks |
| 4-8 criteria | CRAFTSMAN | Flexibility for simple/complex tasks |
| 25-30 total (consolidated) | GUARDIAN | Comprehensive coverage |

**Council Decision:** **4-8 criteria per task, targeting 6 as optimal**

**Reasoning:**
- Fewer than 4 suggests task is too trivial or criteria too vague
- More than 8 indicates task should be split
- 6 provides focused scope while ensuring thoroughness
- Total across all tasks will approximate GUARDIAN's 25-30 range

### 3.3 Guard Rails Section Placement

| Position | Advocate | Approach |
|----------|----------|----------|
| In Ralph Instructions | ARCHITECT | Constraints as workflow guidance |
| Optional per-task Non-Goals | CRAFTSMAN | Task-specific scope limits |
| Dedicated Guard Rails section | GUARDIAN | Explicit negative criteria with checkboxes |

**Council Decision:** **HYBRID APPROACH**

- **Foundation/Integration tasks:** Include a "Guard Rails" section with negative criteria checkboxes
- **Feature tasks:** Include brief "Constraints" subsection in Ralph Instructions
- **All tasks:** Reference master guard rails in foundation task

### 3.4 Test Command Complexity

| Position | Advocate | Command |
|----------|----------|---------|
| Feature-specific grep | ARCHITECT | `npm run test -- --grep 'ComponentName'` |
| Build + verification | CRAFTSMAN | `npm run dev && curl check` |
| Composite validation | GUARDIAN | `npm run build && npm run lint && npm run test` |

**Council Decision:** **TIERED APPROACH**

- **Foundation task:** `npm run build && npm run lint && npm run test`
- **Feature tasks:** `npm run test -- --grep '[FeatureName]'` (focused testing)
- **Integration task:** `npm run build && npm run test:e2e`

### 3.5 Handling Subjective Requirements

| Requirement | ARCHITECT | CRAFTSMAN | GUARDIAN |
|-------------|-----------|-----------|----------|
| "Smooth, minimal" | Quantify: "<300ms animation" | Outcome-focused: "No janky animations" | Omit or convert to "CSS class present" |
| "Screenshot-ready" | "Chart exports as valid PNG" | "Chart has fixed aspect ratio" | Move to Design Principles, not criteria |

**Council Decision:** **OPERATIONALIZE WHERE POSSIBLE, OMIT WHEN NOT**

- Convert to measurable criteria when feasible (e.g., "animation completes in <300ms")
- For truly subjective requirements, document in a "Design Principles" note but exclude from success criteria checkboxes
- Principle: If Ralph cannot verify it automatically, it is not a success criterion

---

## 4. Unified Implementation Plan

### 4.1 Recommended Task File Structure

```
.claude/specs/commitline/
  |-- README.md                    # Execution order, dependencies, overview
  |-- TASK_00_PROJECT_SETUP.md     # Scaffolding, config, structure
  |-- TASK_01_GITHUB_AUTH.md       # OAuth integration
  |-- TASK_02_TIMELINE_CHART.md    # Core visualization component
  |-- TASK_03_VELOCITY_METRICS.md  # Rate calculation and display
  |-- TASK_04_REPO_CONTROLS.md     # Selection and filtering UI
  |-- TASK_05_SHARING.md           # Export and public links
  |-- TASK_06_INTEGRATION.md       # E2E validation and guard rails
```

**Dependency Graph:**
```
TASK_00 (Project Setup)
    |
    v
TASK_01 (GitHub Auth)
    |
    +---> TASK_02 (Timeline Chart)
    |         |
    |         v
    |     TASK_03 (Velocity Metrics)
    |
    +---> TASK_04 (Repo Controls)
    |
    +---> TASK_05 (Sharing)
              |
              v
        TASK_06 (Integration)
```

### 4.2 Standard Task Template

```markdown
---
task: [Imperative verb] [component/feature] [context]
test_command: "[npm command to verify completion]"
depends_on:
  - TASK_XX_PREVIOUS.md  # Optional
---

# Task: [Descriptive Title]

[1-2 sentence description of what this task accomplishes]

## Requirements

1. [Technical constraint or specification]
2. [File/component to create]
3. [Technology to use]
4. [Behavior to implement]

## Success Criteria

- [ ] [Binary testable criterion #1]
- [ ] [Binary testable criterion #2]
- [ ] [Binary testable criterion #3]
- [ ] [Binary testable criterion #4]
- [ ] [Binary testable criterion #5]
- [ ] [Binary testable criterion #6]

## Example Output

```
[Concrete demonstration of completed task]
[Command + expected result]
```

---

## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ])
2. Check off completed criteria (change [ ] to [x])
3. Run tests after changes: `[test_command]`
4. Verify types: `npx tsc --noEmit`
5. Commit your changes frequently with descriptive messages
6. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`
7. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`

### Constraints
- [Relevant non-goal from SPEC.md Section 7]
- [Edge case to handle from SPEC.md Section 10]
```

### 4.3 Success Criteria Guidelines

**Formula for Writing Criteria:**
```
[Action] + [Object] + [Observable Outcome] + [Specific Values (optional)]
```

**Examples:**
| Bad (Untestable) | Good (Testable) |
|------------------|-----------------|
| Timeline looks good | Chart renders with x-axis showing date labels |
| Chart is responsive | Chart maintains readability at 375px viewport width |
| Auth works | OAuth flow redirects to GitHub and returns user data |
| Fast performance | Chart renders 10,000 commits in <3 seconds |

**Criteria Categories per Task:**
1. **Functional:** Core behavior works as specified
2. **Technical:** TypeScript compiles, no errors
3. **Visual:** UI elements render correctly
4. **Edge Case:** Error states handled gracefully

### 4.4 Test Command Strategy

| Task Type | Test Command | Purpose |
|-----------|--------------|---------|
| Foundation | `npm run build && npm run lint` | Verify project compiles |
| Feature | `npm run test -- --grep '[Feature]'` | Focused unit tests |
| Integration | `npm run build && npm run test` | Full validation |

**Composite Command for Final Validation:**
```bash
npm run build && npm run lint && npm run test && npx tsc --noEmit
```

### 4.5 Ralph Instruction Enhancements

**Standard Template (Required for all tasks):**
```markdown
## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ])
2. Check off completed criteria (change [ ] to [x])
3. Run tests after changes: `npm run test`
4. Verify types: `npx tsc --noEmit`
5. Commit your changes frequently with descriptive messages
6. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`
7. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`
```

**Enhanced Template (For complex tasks):**
```markdown
## Ralph Instructions

[Standard 7 steps above]

### Constraints (Derived from Non-Goals)
- Do NOT implement code quality analysis
- Do NOT add lines-of-code metrics
- Do NOT introduce AI/ML scoring
- Do NOT add team comparison features

### Edge Cases to Handle
- GitHub API rate limiting: Show retry countdown
- Zero commits: Display empty state message
- Invalid data: Show graceful error, not crash
- Network failure: Display offline message
```

### 4.6 Guard Rails Implementation

**Foundation Task (TASK_00) includes master guard rails:**
```markdown
## Guard Rails (Must NOT Implement)

- [ ] No database beyond JSON/edge caching (no Postgres, no Prisma)
- [ ] No user accounts beyond GitHub OAuth (no email/password)
- [ ] No team features (single-user only for MVP)
- [ ] No paid tier or monetization UI
- [ ] No code quality analysis or scoring
- [ ] No lines-of-code metrics
- [ ] No AI judgment or ratings
```

**Integration Task (TASK_06) validates guard rails:**
```markdown
## Guard Rails Validation

- [ ] No code quality scores visible in UI
- [ ] No LOC counts displayed anywhere
- [ ] No AI-generated ratings present
- [ ] No team comparison views exist
```

---

## 5. Risk Consolidation

### 5.1 Combined Risk Matrix

| Risk | Severity | Source | Mitigation |
|------|----------|--------|------------|
| Information loss from PRD | Low | ARCHITECT | Keep SPEC.md as reference; link in README |
| Cross-cutting concerns fragmented | Medium | ARCHITECT | TASK_00 handles shared setup; README documents dependencies |
| Subjective criteria cannot be tested | High | GUARDIAN, CRAFTSMAN | Operationalize or exclude; no checkbox for unmeasurable items |
| Over-specification constrains implementation | Medium | CRAFTSMAN | Focus on outcomes, not internals |
| Under-specification leaves ambiguity | Medium | CRAFTSMAN | Include specific values where relevant |
| Missing edge cases | Medium | GUARDIAN | Add explicit edge case criteria section |
| GitHub API external dependency | Medium | GUARDIAN | Mock in tests; graceful degradation criteria |
| Scope creep during implementation | Medium | ALL | Guard rails section; explicit non-goals |
| Test command not CI-compatible | Low | GUARDIAN | Use standard npm commands; no interactive flags |

### 5.2 Mitigation Strategies Summary

1. **Reference Preservation:** Original SPEC.md remains in repository; each TASK.md links back to it
2. **Dependency Clarity:** README.md in specs folder documents execution order and dependencies
3. **Testability Enforcement:** Every criterion must pass the "Can Ralph verify this automatically?" test
4. **Guard Rails:** Explicit negative criteria prevent scope creep
5. **Edge Case Coverage:** Dedicated criteria section for error states and boundary conditions
6. **Mock Strategy:** External dependencies (GitHub API) mocked in test environment

---

## 6. Quality Assurance Checklist

Before finalizing each TASK.md, verify:

- [ ] YAML frontmatter includes `task` and `test_command`
- [ ] Task description is 1-2 sentences maximum
- [ ] Requirements are numbered and technical
- [ ] Success criteria count is between 4-8
- [ ] Every criterion is binary (pass/fail)
- [ ] No criterion requires human judgment
- [ ] Example output demonstrates concrete completion
- [ ] Ralph Instructions include test command reminder
- [ ] Constraints section references relevant non-goals
- [ ] Edge cases from SPEC.md risks are covered

---

## 7. Implementation Roadmap

### Phase 1: Structure Setup (30 min)
1. Create `.claude/specs/commitline/` directory
2. Create README.md with task overview and dependency graph
3. Create empty task files with proper naming

### Phase 2: Foundation Tasks (45 min)
1. TASK_00_PROJECT_SETUP.md - Scaffolding and configuration
2. TASK_01_GITHUB_AUTH.md - OAuth integration

### Phase 3: Feature Tasks (2 hours)
1. TASK_02_TIMELINE_CHART.md - Core visualization
2. TASK_03_VELOCITY_METRICS.md - Rate calculations
3. TASK_04_REPO_CONTROLS.md - Selection UI
4. TASK_05_SHARING.md - Export and links

### Phase 4: Validation (45 min)
1. TASK_06_INTEGRATION.md - E2E testing and guard rails
2. Review all files for consistency
3. Validate test commands are executable

**Total Estimated Effort:** 4-5 hours

---

## 8. Final Verdict

### Recommendation: **GO**

### Confidence Level: **High**

### Rationale

1. **Clear consensus** on structure, format, and methodology across all three proposals
2. **Well-defined source material** - SPEC.md is comprehensive and well-organized
3. **Mechanical transformation** - The mapping from PRD sections to TASK elements is systematic
4. **Low execution risk** - No code execution; purely documentation transformation
5. **High value delivery** - Produces actionable, testable tasks from narrative requirements

### Conditions for Success

1. **Follow the unified template** defined in Section 4.2
2. **Apply testability criteria** - Every checkbox must be automatically verifiable
3. **Include guard rails** - Prevent scope creep via explicit negative criteria
4. **Document dependencies** - Use README.md and `depends_on` frontmatter
5. **Preserve reference** - Keep SPEC.md accessible for context

### Expected Outcomes

- 7 focused TASK.md files (including README)
- Approximately 35-45 total success criteria across all tasks
- Clear execution path for Ralph autonomous agent
- Complete MVP scope coverage with no gaps

---

## Appendix A: Section-to-Task Mapping Quick Reference

| SPEC.md Section | Destination | Treatment |
|-----------------|-------------|-----------|
| 1. Problem Statement | Omit | Context only |
| 2. Product Vision | Task descriptions (1-2 sentences) | Distill |
| 3. Goals & Success Metrics | Success criteria | Transform to checkboxes |
| 4. Target User & ICP | Omit | Not actionable |
| 5. Core User Journey | TASK_01, TASK_06 | E2E test scenarios |
| 6.1 Commit Timeline | TASK_02_TIMELINE_CHART.md | Primary content |
| 6.2 Velocity Indicators | TASK_03_VELOCITY_METRICS.md | Primary content |
| 6.3 Shareability | TASK_05_SHARING.md | Primary content |
| 6.4 Repo Controls | TASK_04_REPO_CONTROLS.md | Primary content |
| 7. Non-Goals | Guard Rails section | Negative criteria |
| 8. Tech Stack | TASK_00, Requirements sections | Technical constraints |
| 9. UX Principles | Success criteria | Operationalize where possible |
| 10. Risks & Mitigations | Edge case criteria, Constraints | Test scenarios |
| 11. Future Extensions | Omit | Out of MVP scope |
| 12. Positioning Summary | Omit | Marketing, not implementation |

---

## Appendix B: Proposal Attribution

| Element in Unified Plan | Primary Source |
|-------------------------|----------------|
| Multi-file structure with numbering | ARCHITECT |
| `depends_on` frontmatter | ARCHITECT, CRAFTSMAN |
| Testability formula | CRAFTSMAN |
| 4-8 criteria range | CRAFTSMAN |
| Guard rails as checkboxes | GUARDIAN |
| Edge case coverage | GUARDIAN |
| Negative success criteria | GUARDIAN |
| Composite test commands | GUARDIAN |
| Enhanced Ralph Instructions | ARCHITECT |
| Example output format | CRAFTSMAN |

---

*Council Review Complete*

*Prepared by: Elite Council (Architect, Craftsman, Guardian)*
*Review Date: 2026-01-17*
*Status: APPROVED FOR IMPLEMENTATION*
