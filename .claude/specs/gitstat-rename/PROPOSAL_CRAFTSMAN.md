# Implementation Proposal: Rename Project to "GitStat"

**Author:** AGENT_2: CRAFTSMAN
**Date:** 2026-01-18
**Subject:** Comprehensive renaming strategy from "Commitline"/"git-commit-tracker" to "GitStat"

---

## 1. Executive Summary

This proposal outlines a systematic approach to rename the project from "Commitline"/"git-commit-tracker"/"github-commit-tracker" to "GitStat". The rename affects 24 files across 4 categories: application code (7 files), configuration (3 files), documentation (8 files), and archived/historical files (6 files). I recommend a phased approach prioritizing application code first, then configuration, and finally documentation, with a clear naming convention of "GitStat" (title case) for branding and "gitstat" (lowercase) for technical identifiers.

---

## 2. Architectural Analysis

### 2.1 Complete File Inventory

#### Category A: Application Code (CRITICAL - Must Change)

| File | Current Reference | New Reference | Context |
|------|-------------------|---------------|---------|
| `git-commit-tracker/package.json` | `"name": "git-commit-tracker"` | `"name": "gitstat"` | npm package name |
| `git-commit-tracker/package-lock.json` | `"name": "git-commit-tracker"` (2 occurrences) | `"name": "gitstat"` | lockfile sync |
| `git-commit-tracker/src/app/layout.tsx` | `title: "Commitline"` | `title: "GitStat"` | metadata/SEO |
| `git-commit-tracker/src/app/dashboard/layout.tsx` | `<h1>Commitline</h1>` | `<h1>GitStat</h1>` | header branding |
| `git-commit-tracker/src/app/login/page.tsx` | `"Welcome to Commitline"` | `"Welcome to GitStat"` | login page text |
| `git-commit-tracker/src/app/share/[id]/page.tsx` | `Commitline` (link text) | `GitStat` | shared view header |
| `git-commit-tracker/src/components/export-button.tsx` | `filename = "commitline-chart"` | `filename = "gitstat-chart"` | exported file prefix |
| `git-commit-tracker/src/app/dashboard/page.tsx` | `filename="commitline-chart"` | `filename="gitstat-chart"` | ExportButton prop |

#### Category B: Configuration Files (CRITICAL - Must Change)

| File | Current Reference | New Reference | Context |
|------|-------------------|---------------|---------|
| `netlify.toml` | `base = "git-commit-tracker"` | `base = "gitstat"` | Netlify build config |

#### Category C: Documentation (IMPORTANT - Should Change)

| File | Changes Required |
|------|------------------|
| `README.md` | 13 occurrences: title, description, directory refs, OAuth app name |
| `SPEC.md` | 5 occurrences: task name, example output filename, share URL domain |
| `AGENTS.md` | 1 occurrence: project description |
| `tasks/prd-commitline.md` | 3 occurrences + filename itself should be renamed to `prd-gitstat.md` |

#### Category D: Specs and Historical (LOW PRIORITY - Consider Preserving)

| File | Changes |
|------|---------|
| `.claude/specs/refactor-spec-to-task-format/PROPOSAL_ARCHITECT.md` | 3 occurrences (example refs) |
| `.claude/specs/refactor-spec-to-task-format/PROPOSAL_CRAFTSMAN.md` | 4 occurrences (example refs) |
| `.claude/specs/refactor-spec-to-task-format/PROPOSAL_GUARDIAN.md` | 3 occurrences (example refs) |
| `.claude/specs/refactor-spec-to-task-format/TASKS.md` | 11 occurrences (directory paths) |
| `.claude/specs/refactor-spec-to-task-format/REVIEW.md` | 2 occurrences |
| `.ralph/archive/2026-01-17-site-finalization/prd.json` | 1 occurrence (`"project": "Commitline"`) |

#### Category E: Directory Rename (MOST IMPACTFUL)

| Current Path | Proposed Path |
|--------------|---------------|
| `git-commit-tracker/` | `gitstat/` |

---

### 2.2 Naming Convention Analysis

| Format | Use Case | Rationale |
|--------|----------|-----------|
| `GitStat` | Brand name, UI text, titles | Title case for visual appeal and brand identity |
| `gitstat` | Package name, directory, URLs, file exports | Lowercase for technical identifiers (npm convention, URL-safe) |
| `gitstat-chart` | Exported file names | Hyphenated for readability in filenames |
| `gitstat.app` | Domain name (future) | Lowercase, standard domain format |

### 2.3 Dependencies Between Changes

```
1. Directory rename (git-commit-tracker -> gitstat)
   |
   +-- 2. netlify.toml base path update
   |
   +-- 3. package.json name field
   |       |
   |       +-- 4. package-lock.json regeneration (npm install)
   |
   +-- 5. README.md directory references

6. Application code changes (independent, can run in parallel):
   - layout.tsx
   - dashboard/layout.tsx
   - login/page.tsx
   - share/[id]/page.tsx
   - export-button.tsx
   - dashboard/page.tsx

7. Documentation updates (independent, can run in parallel):
   - SPEC.md
   - AGENTS.md
   - tasks/prd-commitline.md -> prd-gitstat.md

8. Historical specs (optional, low priority)
```

---

## 3. Implementation Strategy

### Phase 1: Directory Rename (High Risk)

**Step 1.1:** Rename the application directory
```bash
mv git-commit-tracker gitstat
```

**Step 1.2:** Update netlify.toml
```diff
[build]
-  base = "git-commit-tracker"
+  base = "gitstat"
  command = "npm run build"
  publish = ".next"
```

**Risk Mitigation:** Create a git branch before proceeding. This is the most impactful change.

### Phase 2: Package Configuration

**Step 2.1:** Update package.json name field
```diff
{
-  "name": "git-commit-tracker",
+  "name": "gitstat",
   "version": "0.1.0",
```

**Step 2.2:** Regenerate package-lock.json
```bash
cd gitstat
rm package-lock.json
npm install
```

### Phase 3: Application Code (Branding)

**Step 3.1:** Update metadata in `src/app/layout.tsx`
```diff
export const metadata: Metadata = {
-  title: "Commitline",
+  title: "GitStat",
   description: "Visualize your GitHub commit history as an interactive timeline",
};
```

**Step 3.2:** Update header in `src/app/dashboard/layout.tsx`
```diff
-          <h1 className="text-xl font-bold">Commitline</h1>
+          <h1 className="text-xl font-bold">GitStat</h1>
```

**Step 3.3:** Update login page in `src/app/login/page.tsx`
```diff
-          <CardTitle className="text-2xl">Welcome to Commitline</CardTitle>
+          <CardTitle className="text-2xl">Welcome to GitStat</CardTitle>
```

**Step 3.4:** Update share page header in `src/app/share/[id]/page.tsx`
```diff
         <Link href="/" className="text-xl font-bold">
-            Commitline
+            GitStat
         </Link>
```

**Step 3.5:** Update export button default in `src/components/export-button.tsx`
```diff
export function ExportButton({
  targetRef,
-  filename = "commitline-chart",
+  filename = "gitstat-chart",
  className,
}: ExportButtonProps) {
```

**Step 3.6:** Update dashboard export button usage in `src/app/dashboard/page.tsx`
```diff
-              <ExportButton targetRef={chartRef} filename="commitline-chart" />
+              <ExportButton targetRef={chartRef} filename="gitstat-chart" />
```

### Phase 4: Documentation Updates

**Step 4.1:** Update README.md with comprehensive replacements

| Search | Replace | Count |
|--------|---------|-------|
| `# Commitline` | `# GitStat` | 1 |
| `Commitline transforms` | `GitStat transforms` | 1 |
| `cd git-commit-tracker` | `cd gitstat` | 3 |
| `Application name**: Commitline` | `Application name**: GitStat` | 1 |
| `Base directory**: \`git-commit-tracker\`` | `Base directory**: \`gitstat\`` | 1 |
| `Publish directory**: \`git-commit-tracker/.next\`` | `Publish directory**: \`gitstat/.next\`` | 1 |
| `base = "git-commit-tracker"` (in code block) | `base = "gitstat"` | 1 |
| `git-commit-tracker/` (in tree) | `gitstat/` | 1 |

**Step 4.2:** Update SPEC.md

| Search | Replace | Count |
|--------|---------|-------|
| `Build Commitline` | `Build GitStat` | 1 |
| `Task: Commitline MVP` | `Task: GitStat MVP` | 1 |
| `commitline-username-2026` | `gitstat-username-2026` | 1 |
| `commitline.app` | `gitstat.app` | 1 |

**Step 4.3:** Update AGENTS.md

| Search | Replace | Count |
|--------|---------|-------|
| `**Commitline**` | `**GitStat**` | 1 |

**Step 4.4:** Rename and update tasks/prd-commitline.md

```bash
mv tasks/prd-commitline.md tasks/prd-gitstat.md
```

Then update content:
| Search | Replace | Count |
|--------|---------|-------|
| `PRD: Commitline` | `PRD: GitStat` | 1 |
| `Commitline is a personal` | `GitStat is a personal` | 1 |

### Phase 5: Historical/Archived Files (Optional)

These files are historical records of previous work. Consider these options:

**Option A (Recommended):** Leave as-is with a note
- Add a comment at the top: `<!-- Note: This document references the project by its former name "Commitline" -->`
- Preserves historical accuracy of the council review process

**Option B:** Update all references
- More consistent, but loses historical context
- 6 files with ~25 total replacements

**Option C:** Archive the entire spec directory
- Move `.claude/specs/refactor-spec-to-task-format/` to `.claude/specs/archive/`

---

## 4. Design Decisions

### 4.1 Naming Convention Choice: `GitStat` / `gitstat`

**Recommendation:** Use `GitStat` (title case) for brand/UI and `gitstat` (lowercase) for technical identifiers.

**Rationale:**
- `GitStat` follows the pattern of established tools: GitHub, GitLab, GitKraken
- The "Git" prefix immediately communicates the domain
- "Stat" is concise and suggests statistics/visualization
- Lowercase `gitstat` is npm-compliant and URL-safe
- Hyphenated `git-stat` was considered but rejected for consistency with single-word branding

### 4.2 Directory Rename vs. Content-Only Changes

**Decision:** Rename the directory from `git-commit-tracker` to `gitstat`.

**Rationale:**
- Maintains consistency between package name and directory name
- Simplifies onboarding (new developers won't be confused by mismatched names)
- Netlify configuration already references the directory name
- One-time change with clear migration path

### 4.3 Handling Historical References

**Decision:** Preserve historical references in archived spec files.

**Rationale:**
- The specs document a specific point-in-time analysis
- Historical accuracy has value for understanding project evolution
- Future readers will understand this was a rename

### 4.4 URL/Domain References

**Decision:** Update `commitline.app` references to `gitstat.app` in documentation.

**Note:** This assumes a future domain registration. If the domain is not secured, consider using `gitstat.example.com` as a placeholder.

---

## 5. Risk Assessment

### 5.1 Breaking Changes to Avoid

| Risk | Impact | Mitigation |
|------|--------|------------|
| Git history disruption | Medium | Use `git mv` for directory rename to preserve history |
| Netlify deployment failure | High | Update netlify.toml BEFORE pushing renamed directory |
| npm package name collision | Low | Verify `gitstat` is available on npm (or mark private) |
| Broken local dev environments | Medium | Document the rename; team members need to `git pull` and `npm install` |
| OAuth app name mismatch | Low | GitHub OAuth app name is cosmetic; no code change needed |

### 5.2 Edge Cases

| Edge Case | Risk | Handling |
|-----------|------|----------|
| Existing PNG exports with "commitline-" prefix | Low | Old exports remain valid; new exports use "gitstat-" |
| Existing shared links | None | Share links encode data in URL, not branding |
| Cached pages with old title | Low | Browser cache will refresh; no action needed |
| CI/CD pipelines | Medium | Update any scripts that reference `git-commit-tracker` path |
| `.env` files with NEXTAUTH_URL | None | URL path doesn't include app name |

### 5.3 Testing Verification Steps

1. **Post-rename build test:**
   ```bash
   cd gitstat
   npm run build
   npm run lint
   npx tsc --noEmit
   ```

2. **Visual verification:**
   - Landing page shows "GitStat" title in browser tab
   - Dashboard header shows "GitStat"
   - Login page shows "Welcome to GitStat"
   - Share page shows "GitStat" link
   - Exported PNG file is named `gitstat-chart.png`

3. **Deployment verification:**
   - Netlify build succeeds with new `base` path
   - Production site loads correctly

---

## 6. Estimated Complexity

| Dimension | Assessment |
|-----------|------------|
| **Scope** | Medium |
| **Risk Level** | Low-Medium |
| **Estimated LOC Changed** | ~50 lines across 15 files |
| **Estimated Time** | 30-60 minutes |

### Priority Order for Implementation

1. **P0 (Critical):** Directory rename + netlify.toml + package.json
2. **P1 (High):** Application code branding (6 files)
3. **P2 (Medium):** Documentation (README.md, SPEC.md, AGENTS.md)
4. **P3 (Low):** Task files and archived specs

---

## 7. Implementation Checklist

### Pre-Implementation
- [ ] Create feature branch: `git checkout -b refactor/rename-to-gitstat`
- [ ] Verify npm package name availability (if not private)
- [ ] Communicate rename to team (if applicable)

### Phase 1: Directory & Config
- [ ] `git mv git-commit-tracker gitstat`
- [ ] Update `netlify.toml` base path
- [ ] Update `package.json` name field
- [ ] Regenerate `package-lock.json`
- [ ] Verify: `npm run build` succeeds

### Phase 2: Application Code
- [ ] Update `src/app/layout.tsx` title
- [ ] Update `src/app/dashboard/layout.tsx` header
- [ ] Update `src/app/login/page.tsx` welcome text
- [ ] Update `src/app/share/[id]/page.tsx` link text
- [ ] Update `src/components/export-button.tsx` default filename
- [ ] Update `src/app/dashboard/page.tsx` filename prop
- [ ] Verify: All UI shows "GitStat"

### Phase 3: Documentation
- [ ] Update `README.md` (13 replacements)
- [ ] Update `SPEC.md` (4 replacements)
- [ ] Update `AGENTS.md` (1 replacement)
- [ ] Rename `tasks/prd-commitline.md` to `tasks/prd-gitstat.md`
- [ ] Update content of `tasks/prd-gitstat.md`

### Phase 4: Historical (Optional)
- [ ] Decide: Update, annotate, or archive historical specs
- [ ] Execute chosen approach

### Post-Implementation
- [ ] Run full test suite: `npm run build && npm run lint`
- [ ] Verify local dev server displays correctly
- [ ] Create commit with descriptive message
- [ ] Deploy to staging/preview
- [ ] Verify production deployment

---

## 8. Search/Replace Reference

For automated replacement, use these patterns:

```bash
# Brand name (case-sensitive)
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.md" \) -exec sed -i 's/Commitline/GitStat/g' {} \;

# Package/directory name
find . -type f \( -name "*.json" -o -name "*.toml" -o -name "*.md" \) -exec sed -i 's/git-commit-tracker/gitstat/g' {} \;

# File export prefix
find . -type f -name "*.tsx" -exec sed -i 's/commitline-chart/gitstat-chart/g' {} \;

# URL domain (in docs)
find . -type f -name "*.md" -exec sed -i 's/commitline\.app/gitstat.app/g' {} \;
```

**Warning:** Always review changes before committing. The above commands are illustrative; manual verification is recommended.

---

## 9. Conclusion

This rename is a straightforward refactoring task with well-defined scope. The primary risk is the directory rename affecting the Netlify build configuration, which is mitigated by updating the config file immediately after the rename. The phased approach ensures that the application remains functional at each step, and the comprehensive checklist provides clear verification points.

The choice of "GitStat" as the new name aligns with established Git tooling naming conventions while being concise and descriptive. The lowercase "gitstat" variant for technical identifiers follows npm and URL conventions.

**Recommended next step:** Create a feature branch and begin with Phase 1 (directory rename + config updates).
