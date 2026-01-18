# Council Review: Renaming Project to GitStat

**Date:** 2026-01-18
**Feature Under Review:** Rename project from "Commitline" / "git-commit-tracker" to "gitstat" / "GitStat"

---

## 1. Proposals Reviewed

| Agent | Focus Area | Document |
|-------|------------|----------|
| ARCHITECT | System design, scalability, architectural patterns | PROPOSAL_ARCHITECT.md |
| CRAFTSMAN | Clean code, maintainability, SOLID principles | PROPOSAL_CRAFTSMAN.md |
| GUARDIAN | Security, error handling, edge cases, testing | PROPOSAL_GUARDIAN.md |

---

## 2. Proposal Comparison Matrix

| Aspect | ARCHITECT | CRAFTSMAN | GUARDIAN | Council Verdict |
|--------|-----------|-----------|----------|-----------------|
| **Scope Assessment** | Small-Medium | Medium | Medium | **Medium** |
| **Risk Level** | Low | Low-Medium | Medium (LOW if domain unchanged) | **Low-Medium** |
| **Naming Convention** | GitStat (brand) / gitstat (technical) | GitStat (brand) / gitstat (technical) | GitStat (brand) / gitstat (technical) | **Unanimous: GitStat / gitstat** |
| **Directory Rename** | Required | Required | Required (with coordination) | **Required** |
| **Historical Specs** | Optional update | Preserve with note | N/A | **Preserve with annotation** |
| **OAuth Concerns** | Low priority | Low priority | HIGH priority if domain changes | **Domain unchanged = safe** |
| **Files to Modify** | ~14 files | 24 files (4 categories) | ~15 files | **15-20 core files** |

---

## 3. Consensus Points

All proposals unanimously agree on:

1. **Naming Convention**: Use `GitStat` (title case) for user-facing brand and `gitstat` (lowercase) for technical identifiers (package name, directory, URLs, export filenames)

2. **Directory Rename Required**: Rename `git-commit-tracker/` to `gitstat/` for consistency

3. **No Logic Changes**: This is purely cosmetic - no architectural, API, or functional changes

4. **netlify.toml Must Update**: The base directory reference must be updated simultaneously with the directory rename

5. **Package.json Update**: Change `"name": "git-commit-tracker"` to `"name": "gitstat"`

6. **Share Links Remain Valid**: The share link mechanism encodes data in base64, containing no branding references - existing links continue working

7. **Environment Variables Unchanged**: `GITHUB_ID`, `GITHUB_SECRET`, `NEXTAUTH_SECRET` must NOT change

8. **Core UI Files** (6 files):
   - `src/app/layout.tsx` - metadata title
   - `src/app/login/page.tsx` - welcome text
   - `src/app/dashboard/layout.tsx` - header
   - `src/app/share/[id]/page.tsx` - header link
   - `src/components/export-button.tsx` - default filename
   - `src/app/dashboard/page.tsx` - export filename prop

---

## 4. Divergence Analysis

### 4.1 Implementation Order

| ARCHITECT | CRAFTSMAN | GUARDIAN |
|-----------|-----------|----------|
| Directory first → Config → Package → UI → Docs | Directory first → Config → Package → UI → Docs | Safe changes first → Directory → External services last |

**Council Decision:** Adopt GUARDIAN's safer ordering - complete UI/branding changes first (low risk), then directory rename with config (medium risk), external services last (if applicable).

**Rationale:** This minimizes the window of potential deployment issues by ensuring all code changes are verified before structural changes.

### 4.2 Historical Specs Handling

| ARCHITECT | CRAFTSMAN | GUARDIAN |
|-----------|-----------|----------|
| Optional update | Three options: annotate, update, or archive | Not addressed |

**Council Decision:** Preserve historical references with annotation (CRAFTSMAN Option A).

**Rationale:** The specs document a specific point-in-time analysis. Future readers will understand this was a rename, and historical accuracy has value.

### 4.3 OAuth/External Service Risk

| ARCHITECT | CRAFTSMAN | GUARDIAN |
|-----------|-----------|----------|
| Low concern | Low concern | HIGH concern if domain changes |

**Council Decision:** Assume domain remains unchanged for this rename operation. If domain changes, follow GUARDIAN's phased OAuth update protocol.

**Rationale:** The rename itself does not require a domain change. If a domain change is desired, it should be a separate operation with its own review.

---

## 5. Unified Implementation Plan

### Phase 1: Pre-Flight Preparation
- [ ] Create feature branch: `feature/rename-to-gitstat`
- [ ] Ensure clean working directory
- [ ] Verify current build passes: `npm run build && npm run lint`

### Phase 2: Application Code (Low Risk - Cosmetic)
1. [ ] Update `src/app/layout.tsx` - change title to "GitStat"
2. [ ] Update `src/app/login/page.tsx` - change welcome text
3. [ ] Update `src/app/dashboard/layout.tsx` - change header
4. [ ] Update `src/app/share/[id]/page.tsx` - change header link
5. [ ] Update `src/components/export-button.tsx` - change default filename
6. [ ] Update `src/app/dashboard/page.tsx` - change export filename prop
7. [ ] Update `package.json` - change name to "gitstat"
8. [ ] **Verification Gate:** `npm run build && npm run lint`

### Phase 3: Directory Rename (Medium Risk)
1. [ ] Rename directory: `mv git-commit-tracker gitstat`
2. [ ] Update `netlify.toml` base path to "gitstat"
3. [ ] Regenerate `package-lock.json`: `cd gitstat && rm package-lock.json && npm install`
4. [ ] **Verification Gate:** `npm run build && npm run lint && npx tsc --noEmit`

### Phase 4: Documentation Updates
1. [ ] Update `README.md` - all branding and path references
2. [ ] Update `SPEC.md` - branding references
3. [ ] Update `AGENTS.md` - project description
4. [ ] Rename `tasks/prd-commitline.md` to `tasks/prd-gitstat.md`
5. [ ] Update content of `tasks/prd-gitstat.md`

### Phase 5: Historical Specs (Optional)
1. [ ] Add annotation to `.claude/specs/refactor-spec-to-task-format/*.md`:
   `<!-- Note: This document references the project by its former name "Commitline" -->`

### Phase 6: Final Verification
1. [ ] Grep for remaining "Commitline" references (excluding historical)
2. [ ] Grep for remaining "git-commit-tracker" references
3. [ ] Test local development server
4. [ ] Test OAuth login flow
5. [ ] Test export functionality
6. [ ] Test share link generation

### Phase 7: Deployment
1. [ ] Commit with message: "chore: rename project from Commitline to GitStat"
2. [ ] Push to remote
3. [ ] Verify Netlify deployment succeeds
4. [ ] Verify production site loads correctly

---

## 6. Risk Consolidation

### Combined Risk Matrix

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Build failure after directory rename | Low | High | Verify build immediately after rename |
| Netlify deployment failure | Medium | High | Update netlify.toml simultaneously |
| Missed string references | Medium | Medium | Use grep verification commands |
| Cached paths in `.next` | Medium | Low | Delete `.next` and rebuild if issues |
| OAuth callback mismatch | N/A (domain unchanged) | Critical | Not applicable for this operation |

### Edge Cases Addressed

1. **Existing Share Links**: Continue to work (data encoded in URL, not branding-dependent)
2. **Existing PNG Exports**: Remain with old filename (historical artifacts, acceptable)
3. **Browser Cache**: Will clear naturally; no action needed
4. **Package-lock.json**: Regenerate after directory rename

---

## 7. Final Verdict

### Recommendation: **GO**

### Conditions:
1. Domain remains unchanged (same Netlify URL)
2. Follow phased implementation order
3. Verify build at each phase gate
4. Complete all verification steps before deployment

### Confidence Level: **HIGH**

### Rationale:
- All changes are cosmetic (naming only)
- No architectural or functional changes
- Easy to verify completeness via grep
- Easy to revert if issues arise
- Clear consensus across all proposals

---

## 8. Implementation Summary

| Metric | Value |
|--------|-------|
| **Total Files to Modify** | ~15 core files |
| **Lines of Code Changed** | ~50 lines |
| **Directory Operations** | 1 rename |
| **Estimated Implementation Time** | 30-45 minutes |
| **Estimated Testing Time** | 15-20 minutes |

### Critical Path
1. Directory rename + netlify.toml update (must be simultaneous)
2. Build verification after each phase

### Non-Negotiable Requirements
- `npm run build` must pass after each phase
- `npm run lint` must pass
- `npx tsc --noEmit` must pass
- All UI must display "GitStat" after completion

---

*Council Review Complete*
