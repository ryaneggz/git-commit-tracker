# Implementation Tasks: SPEC.md to TASK.md Transformation

**Created:** 2026-01-17
**Source:** Council REVIEW.md (Architect, Craftsman, Guardian consensus)
**Feature:** Refactor SPEC.md in the format structure of TASK.md

---

## Pre-Implementation

- [ ] **Task P1:** Verify REVIEW.md council decisions are understood
  - Acceptance: All divergence resolutions in Section 3 acknowledged
  - Acceptance: Unified template from Section 4.2 confirmed as standard
  - Acceptance: File structure from Section 4.1 confirmed (7 files total)

- [ ] **Task P2:** Create output directory structure
  - Acceptance: Directory `.claude/specs/commitline/` exists
  - Acceptance: Directory is empty and ready for task files

---

## Core Implementation

### Task 1: Create README.md

**File:** `.claude/specs/commitline/README.md`

**Acceptance Criteria:**
- [ ] Contains execution order listing all 6 TASK files in sequence
- [ ] Includes ASCII dependency graph from REVIEW.md Section 4.1
- [ ] Links back to source SPEC.md for reference preservation
- [ ] Documents estimated total effort (~4-5 hours)
- [ ] Lists total success criteria count (35-45 range)
- [ ] Includes composite validation command from REVIEW.md Section 4.4

---

### Task 2: Create TASK_00_PROJECT_SETUP.md

**File:** `.claude/specs/commitline/TASK_00_PROJECT_SETUP.md`

**Acceptance Criteria:**
- [ ] YAML frontmatter includes `task` and `test_command` fields
- [ ] `test_command` is `npm run build && npm run lint` (Foundation tier)
- [ ] Contains 4-8 success criteria (target: 6)
- [ ] Success criteria cover: Next.js scaffolding, TypeScript config, shadcn/ui setup, Tailwind config
- [ ] Includes master Guard Rails section with 7 negative criteria from REVIEW.md Section 4.6
- [ ] Ralph Instructions follow standard 7-step template
- [ ] Example Output demonstrates successful build
- [ ] No `depends_on` field (this is the root task)

---

### Task 3: Create TASK_01_GITHUB_AUTH.md

**File:** `.claude/specs/commitline/TASK_01_GITHUB_AUTH.md`

**Acceptance Criteria:**
- [ ] YAML frontmatter includes `depends_on: TASK_00_PROJECT_SETUP.md`
- [ ] `test_command` is `npm run test -- --grep 'Auth'` (Feature tier)
- [ ] Contains 4-8 success criteria (target: 6)
- [ ] Success criteria cover: OAuth redirect, token storage, user data return, logout flow
- [ ] Criteria include at least 1 edge case (token expiry or invalid credentials)
- [ ] Ralph Instructions include Constraints section referencing non-goals
- [ ] Example Output shows OAuth flow completion evidence
- [ ] All criteria follow formula: [Action] + [Object] + [Outcome]

---

### Task 4: Create TASK_02_TIMELINE_CHART.md

**File:** `.claude/specs/commitline/TASK_02_TIMELINE_CHART.md`

**Acceptance Criteria:**
- [ ] YAML frontmatter includes `depends_on: TASK_01_GITHUB_AUTH.md`
- [ ] `test_command` is `npm run test -- --grep 'Timeline'` (Feature tier)
- [ ] Contains 4-8 success criteria (target: 6-8)
- [ ] Success criteria cover: Chart rendering, x-axis date labels, cumulative line, dark mode styling
- [ ] Criteria include responsive behavior (375px viewport width)
- [ ] Criteria include performance benchmark (renders 10,000 commits in <3 seconds)
- [ ] Subjective requirements ("smooth") are operationalized or omitted per REVIEW.md Section 3.5
- [ ] Example Output demonstrates chart render with sample data

---

### Task 5: Create TASK_03_VELOCITY_METRICS.md

**File:** `.claude/specs/commitline/TASK_03_VELOCITY_METRICS.md`

**Acceptance Criteria:**
- [ ] YAML frontmatter includes `depends_on: TASK_02_TIMELINE_CHART.md`
- [ ] `test_command` is `npm run test -- --grep 'Velocity'` (Feature tier)
- [ ] Contains 4-8 success criteria (target: 6)
- [ ] Success criteria cover: Weekly rate calculation, monthly rate calculation, growth percentage display
- [ ] Criteria include specific value examples (e.g., "displays '45 commits/week'")
- [ ] Edge case criterion for zero commits state included
- [ ] Ralph Instructions reference velocity display constraints
- [ ] All criteria are binary pass/fail with no subjective judgment

---

### Task 6: Create TASK_04_REPO_CONTROLS.md

**File:** `.claude/specs/commitline/TASK_04_REPO_CONTROLS.md`

**Acceptance Criteria:**
- [ ] YAML frontmatter includes `depends_on: TASK_01_GITHUB_AUTH.md`
- [ ] `test_command` is `npm run test -- --grep 'Repo'` (Feature tier)
- [ ] Contains 4-8 success criteria (target: 5)
- [ ] Success criteria cover: Repository selection dropdown, multi-repo selection, date range filtering
- [ ] Criteria include UI element rendering verification
- [ ] Edge case for no repositories found included
- [ ] Constraints section mentions "No team comparison features"

---

### Task 7: Create TASK_05_SHARING.md

**File:** `.claude/specs/commitline/TASK_05_SHARING.md`

**Acceptance Criteria:**
- [ ] YAML frontmatter includes `depends_on: TASK_01_GITHUB_AUTH.md`
- [ ] `test_command` is `npm run test -- --grep 'Share'` (Feature tier)
- [ ] Contains 4-8 success criteria (target: 6)
- [ ] Success criteria cover: PNG export, fixed aspect ratio, public link generation
- [ ] Criteria include "exports valid PNG file" (binary verifiable)
- [ ] "Screenshot-ready" requirement operationalized as specific dimensions or classes present
- [ ] Edge case for export failure handling included
- [ ] Example Output shows export command and file verification

---

### Task 8: Create TASK_06_INTEGRATION.md

**File:** `.claude/specs/commitline/TASK_06_INTEGRATION.md`

**Acceptance Criteria:**
- [ ] YAML frontmatter includes `depends_on` array with TASK_03, TASK_04, TASK_05
- [ ] `test_command` is `npm run build && npm run test` (Integration tier)
- [ ] Contains 4-8 success criteria (target: 6)
- [ ] Success criteria cover: Full user journey from SPEC.md Section 5
- [ ] Includes Guard Rails Validation section with 4 negative criteria from REVIEW.md Section 4.6
- [ ] E2E scenario: OAuth -> Select Repo -> View Chart -> Export PNG
- [ ] Edge cases from SPEC.md Section 10 covered (API rate limiting, network failure)
- [ ] Final criterion: "All previous TASK files show [x] for every criterion"

---

## Verification

- [ ] **V1:** All 8 task files created in `.claude/specs/commitline/` directory
- [ ] **V2:** All task files follow unified template from REVIEW.md Section 4.2
- [ ] **V3:** Total success criteria count is 35-45 across all files
- [ ] **V4:** Every criterion is binary (pass/fail) - no subjective language
- [ ] **V5:** Guard rails documented in TASK_00 and validated in TASK_06
- [ ] **V6:** All test commands are valid npm commands (CI-compatible)
- [ ] **V7:** Dependency graph in README matches `depends_on` fields in tasks
- [ ] **V8:** No criterion requires human judgment (Ralph-verifiable only)

---

## Quality Assurance Checklist (Per REVIEW.md Section 6)

For EACH task file, verify:
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

## Completion Signature

| Metric | Target |
|--------|--------|
| **Total Files** | 8 (1 README + 7 TASK files) |
| **Total Success Criteria** | 35-45 |
| **Criteria per Task** | 4-8 (optimal: 6) |
| **Guard Rails** | 7 master + 4 validation |
| **Estimated Effort** | 4-5 hours |

---

## Implementation Order

```
1. Pre-Implementation (P1, P2)           ~15 min
2. README.md (Task 1)                    ~20 min
3. TASK_00_PROJECT_SETUP.md (Task 2)     ~30 min
4. TASK_01_GITHUB_AUTH.md (Task 3)       ~30 min
5. TASK_02_TIMELINE_CHART.md (Task 4)    ~45 min
6. TASK_03_VELOCITY_METRICS.md (Task 5)  ~30 min
7. TASK_04_REPO_CONTROLS.md (Task 6)     ~30 min
8. TASK_05_SHARING.md (Task 7)           ~30 min
9. TASK_06_INTEGRATION.md (Task 8)       ~45 min
10. Verification (V1-V8)                 ~30 min
                                    ─────────────
                                    Total: ~5 hours
```

---

## Source References

- **Council Review:** `/home/ryaneggz/ryaneggz/github-commit-tracker/.claude/specs/refactor-spec-to-task-format/REVIEW.md`
- **Original SPEC:** `/home/ryaneggz/ryaneggz/github-commit-tracker/SPEC.md`
- **TASK Template:** `/home/ryaneggz/ryaneggz/github-commit-tracker/.claude/prompts/examples/ralph/TASK.md`
- **Project Context:** `/home/ryaneggz/ryaneggz/github-commit-tracker/AGENTS.md`

---

*Task Contract Created: 2026-01-17*
*Status: READY FOR IMPLEMENTATION*
