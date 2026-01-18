# Implementation Tasks: Rename Project to GitStat

**Created:** 2026-01-18
**Based On:** REVIEW.md Council Decision
**Status:** Ready for Implementation

---

## Pre-Implementation

- [ ] Create feature branch: `git checkout -b feature/rename-to-gitstat`
- [ ] Verify clean working directory: `git status`
- [ ] Verify current build passes: `cd git-commit-tracker && npm run build && npm run lint`
- [ ] Document current state: `git log -1 --oneline`

---

## Phase 1: Application Code - UI Branding

### Task 1.1: Update layout.tsx metadata
- [ ] Update `git-commit-tracker/src/app/layout.tsx`
  - Change `title: "Commitline"` to `title: "GitStat"`
  - Files: `src/app/layout.tsx:18`
  - Acceptance: Metadata export contains `title: "GitStat"`

### Task 1.2: Update login page welcome text
- [ ] Update `git-commit-tracker/src/app/login/page.tsx`
  - Change `"Welcome to Commitline"` to `"Welcome to GitStat"`
  - Files: `src/app/login/page.tsx`
  - Acceptance: CardTitle contains "Welcome to GitStat"

### Task 1.3: Update dashboard header
- [ ] Update `git-commit-tracker/src/app/dashboard/layout.tsx`
  - Change `<h1>Commitline</h1>` to `<h1>GitStat</h1>`
  - Files: `src/app/dashboard/layout.tsx`
  - Acceptance: h1 element contains "GitStat"

### Task 1.4: Update share page header
- [ ] Update `git-commit-tracker/src/app/share/[id]/page.tsx`
  - Change `Commitline` link text to `GitStat`
  - Files: `src/app/share/[id]/page.tsx`
  - Acceptance: Link text shows "GitStat"

### Task 1.5: Update export button default filename
- [ ] Update `git-commit-tracker/src/components/export-button.tsx`
  - Change `filename = "commitline-chart"` to `filename = "gitstat-chart"`
  - Files: `src/components/export-button.tsx`
  - Acceptance: Default filename prop is "gitstat-chart"

### Task 1.6: Update dashboard export button usage
- [ ] Update `git-commit-tracker/src/app/dashboard/page.tsx`
  - Change `filename="commitline-chart"` to `filename="gitstat-chart"`
  - Files: `src/app/dashboard/page.tsx`
  - Acceptance: ExportButton receives filename="gitstat-chart"

### Task 1.7: Update package.json name
- [ ] Update `git-commit-tracker/package.json`
  - Change `"name": "git-commit-tracker"` to `"name": "gitstat"`
  - Files: `package.json:2`
  - Acceptance: Package name is "gitstat"

### Verification Gate 1
- [ ] Run `cd git-commit-tracker && npm run build` - must pass
- [ ] Run `npm run lint` - must pass
- [ ] Run `npx tsc --noEmit` - must pass

---

## Phase 2: Directory Rename & Configuration

### Task 2.1: Rename application directory
- [ ] Rename directory from `git-commit-tracker` to `gitstat`
  - Command: `git mv git-commit-tracker gitstat`
  - Files: Directory rename
  - Acceptance: Directory exists at `gitstat/`

### Task 2.2: Update netlify.toml
- [ ] Update `netlify.toml`
  - Change `base = "git-commit-tracker"` to `base = "gitstat"`
  - Files: `netlify.toml:2`
  - Acceptance: Build config references "gitstat"

### Task 2.3: Regenerate package-lock.json
- [ ] Regenerate lock file
  - Commands: `cd gitstat && rm package-lock.json && npm install`
  - Files: `gitstat/package-lock.json`
  - Acceptance: Lock file regenerated with new package name

### Verification Gate 2
- [ ] Run `cd gitstat && npm run build` - must pass
- [ ] Run `npm run lint` - must pass
- [ ] Run `npx tsc --noEmit` - must pass
- [ ] Delete `.next` directory if caching issues: `rm -rf gitstat/.next`

---

## Phase 3: Documentation Updates

### Task 3.1: Update README.md
- [ ] Update `README.md`
  - Replace `# Commitline` with `# GitStat`
  - Replace `Commitline transforms` with `GitStat transforms`
  - Replace all `cd git-commit-tracker` with `cd gitstat`
  - Replace `Application name**: Commitline` with `Application name**: GitStat`
  - Replace `git-commit-tracker` path references with `gitstat`
  - Update project structure tree
  - Files: `README.md`
  - Acceptance: No "Commitline" or "git-commit-tracker" references remain

### Task 3.2: Update SPEC.md
- [ ] Update `SPEC.md`
  - Replace `Build Commitline` with `Build GitStat`
  - Replace `Task: Commitline MVP` with `Task: GitStat MVP`
  - Replace `commitline-username-2026` with `gitstat-username-2026`
  - Replace `commitline.app` with `gitstat.app`
  - Files: `SPEC.md`
  - Acceptance: No "Commitline" references remain

### Task 3.3: Update AGENTS.md
- [ ] Update `AGENTS.md`
  - Replace `**Commitline**` with `**GitStat**`
  - Files: `AGENTS.md`
  - Acceptance: Project description uses "GitStat"

### Task 3.4: Rename and update PRD file
- [ ] Rename `tasks/prd-commitline.md` to `tasks/prd-gitstat.md`
  - Command: `git mv tasks/prd-commitline.md tasks/prd-gitstat.md`
  - Update content to replace "Commitline" with "GitStat"
  - Files: `tasks/prd-gitstat.md`
  - Acceptance: File renamed and content updated

---

## Phase 4: Historical Specs (Optional)

### Task 4.1: Annotate historical specs
- [ ] Add annotation to historical spec files
  - Add comment: `<!-- Note: This document references the project by its former name "Commitline" -->`
  - Files: `.claude/specs/refactor-spec-to-task-format/*.md`
  - Acceptance: Historical context preserved with annotation

---

## Phase 5: Final Verification

### Task 5.1: Verify no remaining old references
- [ ] Search for remaining "Commitline" references
  - Command: `grep -ri "commitline" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.toml" gitstat/`
  - Acceptance: No matches found (excluding historical specs)

### Task 5.2: Verify no remaining directory references
- [ ] Search for remaining "git-commit-tracker" references
  - Command: `grep -ri "git-commit-tracker" --include="*.ts" --include="*.tsx" --include="*.md" --include="*.json" --include="*.toml" .`
  - Acceptance: No matches found (excluding historical specs)

### Task 5.3: Test local development server
- [ ] Start dev server and verify branding
  - Command: `cd gitstat && npm run dev`
  - Check: Landing page shows correct branding
  - Check: Login page shows "Welcome to GitStat"
  - Check: Dashboard header shows "GitStat"
  - Acceptance: All UI displays "GitStat"

### Task 5.4: Test core functionality
- [ ] Test OAuth login flow
  - Action: Click "Sign in with GitHub"
  - Acceptance: Authentication completes successfully

- [ ] Test export functionality
  - Action: Click "Export PNG" button
  - Acceptance: File downloads with name `gitstat-chart.png`

- [ ] Test share link generation
  - Action: Click share button
  - Acceptance: Share link generates correctly

---

## Phase 6: Deployment

### Task 6.1: Create commit
- [ ] Stage all changes and commit
  - Command: `git add -A && git commit -m "chore: rename project from Commitline to GitStat"`
  - Acceptance: Clean commit with descriptive message

### Task 6.2: Push to remote
- [ ] Push feature branch
  - Command: `git push -u origin feature/rename-to-gitstat`
  - Acceptance: Branch pushed successfully

### Task 6.3: Create pull request
- [ ] Create PR for review
  - Title: "chore: Rename project from Commitline to GitStat"
  - Description: Include summary of changes
  - Acceptance: PR created and ready for review

### Task 6.4: Verify Netlify deployment
- [ ] Check Netlify preview deployment
  - Action: Visit Netlify deploy preview URL
  - Check: Build succeeded
  - Check: Site loads correctly
  - Acceptance: Preview deployment works

---

## Completion Checklist

- [ ] All phases completed
- [ ] All verification gates passed
- [ ] Build succeeds: `npm run build`
- [ ] Lint passes: `npm run lint`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] No remaining old brand references
- [ ] UI displays "GitStat" everywhere
- [ ] Export generates `gitstat-chart.png`
- [ ] Netlify deployment succeeds

---

## Completion Signature

- **Total Tasks:** 24
- **Estimated Effort:** 45-60 minutes
- **Dependencies:** None (self-contained rename)
- **Rollback Plan:** `git revert` or Netlify rollback to previous deploy

---

## Validation Results

*(To be filled after implementation)*

| Check | Status | Notes |
|-------|--------|-------|
| Build passes | | |
| Lint passes | | |
| TypeScript compiles | | |
| UI branding correct | | |
| Export filename correct | | |
| OAuth works | | |
| Share links work | | |
| Netlify deployed | | |

**Final Status:** _(Pending)_
**Completed By:** _(To be filled)_
**Completion Date:** _(To be filled)_
