# Architectural Proposal: Renaming Project to "gitstat"

**Author:** AGENT_1 (ARCHITECT)
**Date:** 2026-01-18
**Status:** PROPOSAL

---

## 1. Executive Summary

This proposal outlines a comprehensive strategy for renaming the project from "Commitline" / "github-commit-tracker" / "git-commit-tracker" to "gitstat". The rename involves directory restructuring, package configuration updates, deployment reconfiguration, UI/brand updates, and documentation synchronization. The recommended approach is a single coordinated rename operation that updates all references atomically to maintain consistency across the codebase.

---

## 2. Architectural Analysis

### 2.1 Current State Assessment

The project currently uses three distinct naming conventions that create confusion:

| Layer | Current Name | Location |
|-------|--------------|----------|
| Root Directory | `github-commit-tracker` | Repository root |
| App Directory | `git-commit-tracker` | Next.js application folder |
| Brand Name | `Commitline` | UI components, metadata |
| Package Name | `git-commit-tracker` | package.json |
| Export Files | `commitline-chart` | PNG export filename |

**Naming Inconsistency Analysis:**
- Root directory: `github-commit-tracker` (includes "github")
- App directory: `git-commit-tracker` (omits "hub")
- Brand: `Commitline` (completely different naming pattern)
- This creates cognitive overhead and deployment complexity

### 2.2 Proposed Target State

Unified naming under "gitstat":

| Layer | New Name | Notes |
|-------|----------|-------|
| Root Directory | `gitstat` | Rename recommended but optional |
| App Directory | `gitstat` | Required for consistency |
| Brand Name | `GitStat` | Capital S for visual distinction |
| Package Name | `gitstat` | npm package name |
| Export Files | `gitstat-chart` | Consistent prefix |

### 2.3 Integration Points and Dependencies

**Internal Dependencies:**
1. **Netlify Configuration** (`netlify.toml`) - References `git-commit-tracker` as base directory
2. **Package Configuration** - `package.json` and `package-lock.json` contain package name
3. **TypeScript Path Aliases** - Uses `@/` prefix, directory-agnostic (no changes needed)
4. **Environment Variables** - Uses `NEXTAUTH_URL`, no hardcoded app names (no changes needed)

**External Dependencies:**
1. **GitHub OAuth App** - Application name registered as "Commitline" (update recommended)
2. **Netlify Site** - May need site name update if using custom domain
3. **Google Analytics** - No name dependency (uses ID only)

**Files Requiring Updates:**

| File | Change Type | Complexity |
|------|-------------|------------|
| `netlify.toml` | Directory path | Low |
| `git-commit-tracker/package.json` | Package name | Low |
| `git-commit-tracker/package-lock.json` | Package name | Low |
| `git-commit-tracker/src/app/layout.tsx` | Metadata title | Low |
| `git-commit-tracker/src/app/login/page.tsx` | Welcome text | Low |
| `git-commit-tracker/src/app/dashboard/layout.tsx` | Header text | Low |
| `git-commit-tracker/src/app/share/[id]/page.tsx` | Header text | Low |
| `git-commit-tracker/src/components/export-button.tsx` | Default filename | Low |
| `git-commit-tracker/src/app/dashboard/page.tsx` | Export filename | Low |
| `README.md` | Multiple references | Medium |
| `SPEC.md` | Multiple references | Medium |
| `AGENTS.md` | Project description | Low |
| `tasks/prd-commitline.md` | Document rename | Low |

---

## 3. Implementation Strategy

### 3.1 Phase 1: Directory Restructuring

**Step 1.1: Rename Application Directory**
```bash
# From repository root
mv git-commit-tracker gitstat
```

**Step 1.2: Update Netlify Configuration**
```toml
# netlify.toml
[build]
  base = "gitstat"
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

**Rationale:** The directory rename must happen first as it affects all relative paths in documentation and configuration.

### 3.2 Phase 2: Package Configuration

**Step 2.1: Update package.json**
```json
{
  "name": "gitstat",
  "version": "0.1.0",
  ...
}
```

**Step 2.2: Regenerate package-lock.json**
```bash
cd gitstat
rm package-lock.json
npm install
```

**Rationale:** Regenerating lock file ensures internal references are consistent.

### 3.3 Phase 3: UI/Brand Updates

**Step 3.1: Update Application Metadata** (`src/app/layout.tsx`)
```typescript
export const metadata: Metadata = {
  title: "GitStat",
  description: "Visualize your GitHub commit history as an interactive timeline",
};
```

**Step 3.2: Update Login Page** (`src/app/login/page.tsx`)
```typescript
<CardTitle className="text-2xl">Welcome to GitStat</CardTitle>
```

**Step 3.3: Update Dashboard Header** (`src/app/dashboard/layout.tsx`)
```typescript
<h1 className="text-xl font-bold">GitStat</h1>
```

**Step 3.4: Update Share Page Header** (`src/app/share/[id]/page.tsx`)
```typescript
<Link href="/" className="text-xl font-bold">
  GitStat
</Link>
```

**Step 3.5: Update Export Filename** (`src/components/export-button.tsx`)
```typescript
export function ExportButton({
  targetRef,
  filename = "gitstat-chart",
  className,
}: ExportButtonProps) {
```

**Step 3.6: Update Dashboard Export Call** (`src/app/dashboard/page.tsx`)
```typescript
<ExportButton targetRef={chartRef} filename="gitstat-chart" />
```

### 3.4 Phase 4: Documentation Updates

**Step 4.1: Update README.md**
- Replace "Commitline" with "GitStat" in all headings and descriptions
- Update directory references from `git-commit-tracker` to `gitstat`
- Update example commands and paths
- Update OAuth app name recommendation

**Step 4.2: Update SPEC.md**
- Update task name and references
- Update example output filenames (`gitstat-username-date.png`)
- Update share URL example (`https://gitstat.app/share/abc123`)

**Step 4.3: Update AGENTS.md**
- Update project overview description
- Replace "Commitline" with "GitStat"

**Step 4.4: Rename PRD File**
```bash
mv tasks/prd-commitline.md tasks/prd-gitstat.md
```
- Update internal references

### 3.5 Phase 5: Optional Root Directory Rename

**Consideration:** Renaming the root directory (`github-commit-tracker` -> `gitstat`) is optional but recommended for full consistency.

**If renaming:**
```bash
# From parent directory
mv github-commit-tracker gitstat
```

**Impact:**
- Git history preserved (Git tracks content, not paths)
- Local development setup unaffected
- Remote repository URL unchanged (GitHub repo name separate from local directory)

---

## 4. Design Decisions

### 4.1 Brand Name: "GitStat" vs "gitstat"

**Decision:** Use "GitStat" (capital G and S) for user-facing brand, `gitstat` (lowercase) for package/directory names.

**Rationale:**
- Capital letters improve readability and brand recognition
- Lowercase for technical identifiers follows npm/directory conventions
- Similar pattern to "GitHub" (brand) vs "github" (username/slug)

### 4.2 Single Atomic Rename vs Phased Rollout

**Decision:** Single coordinated rename in one commit.

**Alternatives Considered:**
1. **Phased rollout** - Change package name first, then directories, then UI
   - Rejected: Creates intermediate inconsistent states
   - Rejected: Multiple commits harder to revert
2. **UI-only rename first** - Keep directories, change display name
   - Rejected: Creates more confusion, not less

**Rationale:** A single atomic change ensures the codebase never exists in an inconsistent state.

### 4.3 Directory Naming Strategy

**Decision:** Rename `git-commit-tracker` to `gitstat` (matching brand).

**Alternatives Considered:**
1. **Keep `git-commit-tracker`** - Only change brand
   - Rejected: Perpetuates confusion
2. **Use `git-stat`** - Hyphenated version
   - Rejected: Inconsistent with brand, longer to type

### 4.4 Export Filename Pattern

**Decision:** Use `gitstat-chart` as default export filename.

**Rationale:**
- Follows existing pattern (was `commitline-chart`)
- Brand-consistent
- No functional change to export logic

---

## 5. Risk Assessment

### 5.1 Potential Pitfalls

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Broken imports after directory rename | Low | High | Test build immediately after rename |
| Netlify deployment failure | Medium | High | Test deployment in preview before production |
| Cached old paths in `.next` | Medium | Low | Delete `.next` and rebuild |
| Missed string references | Medium | Medium | Use grep/search to verify all changes |
| OAuth callback URL mismatch | Low | High | Update GitHub OAuth app settings |

### 5.2 Edge Cases to Handle

1. **Shareable Links**: Existing share links use base64-encoded data that includes no brand references - these will continue to work.

2. **Browser Cache**: Users may see cached "Commitline" metadata temporarily. No action needed; clears naturally.

3. **SEO Impact**: If deployed publicly, search engines may temporarily show old brand. Use canonical URLs and meta tags correctly.

4. **Existing PNG Exports**: Previously exported files will retain `commitline-chart.png` filename. This is acceptable (historical artifacts).

### 5.3 Testing Considerations

**Pre-Implementation:**
1. Create backup branch before changes
2. Document current working state

**Post-Implementation:**
1. Run full build: `npm run build`
2. Run linter: `npm run lint`
3. Run type check: `npx tsc --noEmit`
4. Test OAuth flow end-to-end
5. Test export functionality
6. Test share link generation and viewing
7. Verify Netlify deployment

**Verification Checklist:**
- [ ] No "Commitline" references in codebase (except historical docs)
- [ ] No "git-commit-tracker" directory references
- [ ] All UI displays "GitStat"
- [ ] Export generates `gitstat-chart.png`
- [ ] Build completes without errors
- [ ] Deployment succeeds

---

## 6. Estimated Complexity

### 6.1 Scope Assessment

**Scope: Small-Medium**

- Total files to modify: ~14 files
- Lines of code to change: ~50 lines
- Directory operations: 1 rename
- No architectural changes
- No API changes
- No database migrations

### 6.2 Risk Level

**Risk Level: Low**

- All changes are cosmetic (naming only)
- No logic changes
- Easy to verify completeness via search
- Easy to revert if needed

### 6.3 Time Estimate

- Implementation: 30-45 minutes
- Testing: 15-20 minutes
- Documentation review: 10 minutes
- **Total: ~1 hour**

### 6.4 Suggested Priority Order

1. **Directory rename** (enables all subsequent changes)
2. **Netlify config update** (unblocks deployment)
3. **package.json update** (establishes new identity)
4. **UI component updates** (user-visible changes)
5. **Documentation updates** (reflects new reality)
6. **PRD file rename** (cleanup)

---

## 7. Implementation Checklist

### Pre-Flight
- [ ] Create feature branch: `feature/rename-to-gitstat`
- [ ] Ensure clean working directory (`git status`)

### Phase 1: Directory
- [ ] Rename `git-commit-tracker/` to `gitstat/`
- [ ] Update `netlify.toml` base directory

### Phase 2: Package
- [ ] Update `gitstat/package.json` name field
- [ ] Regenerate `package-lock.json`

### Phase 3: UI Components
- [ ] Update `src/app/layout.tsx` title
- [ ] Update `src/app/login/page.tsx` welcome text
- [ ] Update `src/app/dashboard/layout.tsx` header
- [ ] Update `src/app/share/[id]/page.tsx` header
- [ ] Update `src/components/export-button.tsx` default filename
- [ ] Update `src/app/dashboard/page.tsx` export filename prop

### Phase 4: Documentation
- [ ] Update `README.md` (all references)
- [ ] Update `SPEC.md` (all references)
- [ ] Update `AGENTS.md` (project description)
- [ ] Rename `tasks/prd-commitline.md` to `tasks/prd-gitstat.md`
- [ ] Update renamed PRD content

### Phase 5: Verification
- [ ] Run `npm run build`
- [ ] Run `npm run lint`
- [ ] Run `npx tsc --noEmit`
- [ ] Grep for remaining "Commitline" references
- [ ] Grep for remaining "git-commit-tracker" references
- [ ] Test local development server
- [ ] Test OAuth login flow
- [ ] Test export functionality

### Post-Flight
- [ ] Commit with message: "chore: rename project from Commitline to GitStat"
- [ ] Update GitHub OAuth app name (optional)
- [ ] Deploy to Netlify and verify

---

## 8. Files Reference

### Files to Modify (Full Paths)

```
/home/ryaneggz/ryaneggz/github-commit-tracker/netlify.toml
/home/ryaneggz/ryaneggz/github-commit-tracker/README.md
/home/ryaneggz/ryaneggz/github-commit-tracker/SPEC.md
/home/ryaneggz/ryaneggz/github-commit-tracker/AGENTS.md
/home/ryaneggz/ryaneggz/github-commit-tracker/git-commit-tracker/package.json
/home/ryaneggz/ryaneggz/github-commit-tracker/git-commit-tracker/src/app/layout.tsx
/home/ryaneggz/ryaneggz/github-commit-tracker/git-commit-tracker/src/app/login/page.tsx
/home/ryaneggz/ryaneggz/github-commit-tracker/git-commit-tracker/src/app/dashboard/layout.tsx
/home/ryaneggz/ryaneggz/github-commit-tracker/git-commit-tracker/src/app/dashboard/page.tsx
/home/ryaneggz/ryaneggz/github-commit-tracker/git-commit-tracker/src/app/share/[id]/page.tsx
/home/ryaneggz/ryaneggz/github-commit-tracker/git-commit-tracker/src/components/export-button.tsx
/home/ryaneggz/ryaneggz/github-commit-tracker/tasks/prd-commitline.md
```

### Directory to Rename

```
/home/ryaneggz/ryaneggz/github-commit-tracker/git-commit-tracker/
  -> /home/ryaneggz/ryaneggz/github-commit-tracker/gitstat/
```

### Files Containing Brand References (for grep verification)

Additional files with "Commitline" or "git-commit-tracker" references that should be reviewed:
- `.claude/specs/refactor-spec-to-task-format/` - Various proposal docs (historical, optional update)

---

## 9. Conclusion

The rename from "Commitline" to "GitStat" is a straightforward operation with low risk and clear benefits:

1. **Unified naming** eliminates confusion between multiple naming conventions
2. **Memorable brand** - "GitStat" clearly communicates purpose (Git statistics)
3. **Clean implementation** - No architectural changes required
4. **Reversible** - Easy to revert if needed

**Recommendation:** Proceed with implementation as a single coordinated change on a feature branch, with thorough verification before merging.

---

*End of Proposal*
