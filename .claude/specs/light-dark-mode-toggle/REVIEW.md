# Council Review: Light/Dark Mode Toggle

**Feature:** Allow users to toggle between light and dark mode, defaulting to light mode
**Date:** 2026-01-18
**Proposals Reviewed:** ARCHITECT, CRAFTSMAN, GUARDIAN

---

## 1. Proposal Comparison Matrix

| Aspect | ARCHITECT | CRAFTSMAN | GUARDIAN | Council Verdict |
|--------|-----------|-----------|----------|-----------------|
| **Architecture** | Custom React Context | Custom React Context | Custom React Context | **Consensus**: Custom context (no next-themes) |
| **File Location** | `src/contexts/theme-context.tsx` | `src/hooks/use-theme.ts` | `src/hooks/use-theme.ts` | **Verdict**: `src/hooks/use-theme.ts` (matches existing pattern) |
| **Hydration Safety** | Mounted state check | Mounted state check | Inline blocking script + mounted state | **Verdict**: GUARDIAN approach (inline script prevents FOIT) |
| **localStorage Safety** | Basic implementation | Basic with `typeof window` check | Full error handling + value validation | **Verdict**: GUARDIAN approach (comprehensive) |
| **Default Theme** | Light | Light | Light | **Consensus**: Light mode default |
| **Toggle Component** | Icon button (Sun/Moon) | Icon button (Sun/Moon) | Icon button (Sun/Moon) | **Consensus**: Ghost button with lucide icons |
| **Toaster Integration** | Dynamic theme prop | ToasterWithTheme wrapper | ToasterWithTheme wrapper | **Verdict**: ToasterWithTheme wrapper pattern |
| **Scope** | Small | Small | Small | **Consensus**: Small scope, low risk |

---

## 2. Consensus Points

All three proposals agree on:

1. **Custom React Context over next-themes library**
   - Zero additional dependencies
   - Simpler for binary light/dark toggle
   - Full control over behavior

2. **Light mode as explicit default**
   - Per requirements: "default to light mode"
   - No system preference detection for MVP

3. **localStorage for persistence**
   - No server-side complexity
   - Appropriate for client preference

4. **Icon toggle button (Sun/Moon)**
   - Minimal UI footprint
   - Standard pattern (GitHub, Notion)
   - Uses existing lucide-react icons

5. **CSS infrastructure is ready**
   - `globals.css` already has light/dark variables
   - All components use CSS variables
   - Charts use CSS variables - will auto-adapt

6. **Files to modify:**
   - `providers.tsx` - Add ThemeProvider
   - `layout.tsx` - Remove hardcoded dark class
   - `user-nav.tsx` - Add toggle to dashboard
   - `page.tsx` - Add toggle to landing page
   - `share/[id]/page.tsx` - Add toggle to share page

---

## 3. Divergence Analysis

### 3.1 File Organization

| Proposal | Location |
|----------|----------|
| ARCHITECT | `src/contexts/theme-context.tsx` |
| CRAFTSMAN | `src/hooks/use-theme.ts` |
| GUARDIAN | `src/hooks/use-theme.ts` |

**Council Decision:** `src/hooks/use-theme.ts`

**Rationale:** The project already has a hooks pattern established with `use-media-query.ts`. Placing theme logic in `hooks/` maintains consistency. The provider can be exported from the same file as the hook (this is a common pattern in shadcn/ui).

### 3.2 Flash of Incorrect Theme (FOIT) Prevention

| Proposal | Approach |
|----------|----------|
| ARCHITECT | Rely on mounted state; accept brief flash |
| CRAFTSMAN | Mounted state + apply theme in useEffect before setting mounted |
| GUARDIAN | Blocking inline script + mounted state |

**Council Decision:** GUARDIAN's inline script approach

**Rationale:** The inline blocking script runs synchronously before React hydration, ensuring the correct theme class is applied before first paint. This completely eliminates the flash for returning dark-mode users. The trade-off (adding `suppressHydrationWarning` and `dangerouslySetInnerHTML`) is acceptable for the UX improvement.

**Implementation:**
```tsx
// In layout.tsx
const themeInitScript = `
  (function() {
    try {
      var theme = localStorage.getItem('gitstat-theme');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`;
```

### 3.3 localStorage Error Handling

| Proposal | Approach |
|----------|----------|
| ARCHITECT | Basic get/set, minimal error handling |
| CRAFTSMAN | `typeof window` check, basic try-catch |
| GUARDIAN | Comprehensive: typeof check, try-catch, value validation |

**Council Decision:** GUARDIAN's comprehensive approach

**Rationale:** The additional validation against an allowlist (`'light'` or `'dark'`) prevents potential issues from corrupted/tampered values. Try-catch on both read and write handles private browsing and quota errors gracefully.

### 3.4 ThemeToggle Component - Hydration Placeholder

| Proposal | Approach |
|----------|----------|
| ARCHITECT | Disabled button with Sun icon placeholder |
| CRAFTSMAN | No explicit placeholder (uses context default) |
| GUARDIAN | Disabled button with empty span placeholder |

**Council Decision:** ARCHITECT's approach (disabled button with Sun icon)

**Rationale:** Since light mode is the default, showing the Sun icon (light mode indicator) during SSR/hydration provides visual consistency. The button should show the icon for the current theme (Moon in light mode, Sun in dark mode to indicate what clicking will do).

**Correction:** Actually, the UX convention is:
- In light mode: Show Moon icon (click to go dark)
- In dark mode: Show Sun icon (click to go light)

So the placeholder should show the Moon icon (what appears in light mode default).

---

## 4. Unified Implementation Plan

### 4.1 Recommended Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       layout.tsx                            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Inline Blocking Script                   │  │
│  │  - Reads localStorage synchronously before React      │  │
│  │  - Adds 'dark' class if stored preference is dark    │  │
│  └───────────────────────────────────────────────────────┘  │
│  <html lang="en" suppressHydrationWarning>                  │
│    ┌─────────────────────────────────────────────────────┐  │
│    │                   Providers                         │  │
│    │  ┌───────────────────────────────────────────────┐  │  │
│    │  │              ThemeProvider                    │  │  │
│    │  │  - Manages theme state (React Context)        │  │  │
│    │  │  - Syncs to document.documentElement class    │  │  │
│    │  │  - Persists to localStorage                   │  │  │
│    │  │  ┌─────────────────────────────────────────┐  │  │  │
│    │  │  │           SessionProvider               │  │  │  │
│    │  │  │  ┌───────────────────────────────────┐  │  │  │  │
│    │  │  │  │         Application               │  │  │  │  │
│    │  │  │  │  - ThemeToggle in headers         │  │  │  │  │
│    │  │  │  │  - All components use CSS vars    │  │  │  │  │
│    │  │  │  └───────────────────────────────────┘  │  │  │  │
│    │  │  │  ┌───────────────────────────────────┐  │  │  │  │
│    │  │  │  │     ToasterWithTheme              │  │  │  │  │
│    │  │  │  │  - Uses theme from context        │  │  │  │  │
│    │  │  │  └───────────────────────────────────┘  │  │  │  │
│    │  │  └─────────────────────────────────────────┘  │  │  │
│    │  └───────────────────────────────────────────────┘  │  │
│    └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Implementation Sequence

| Order | Task | File | Rationale |
|-------|------|------|-----------|
| 1 | Create theme hook + provider | `src/hooks/use-theme.ts` | Core infrastructure |
| 2 | Create toggle component | `src/components/theme-toggle.tsx` | UI component |
| 3 | Update root layout | `src/app/layout.tsx` | Remove hardcoded dark, add inline script |
| 4 | Update providers | `src/components/providers.tsx` | Wire ThemeProvider + dynamic Toaster |
| 5 | Add to dashboard navigation | `src/components/user-nav.tsx` | Primary authenticated UX |
| 6 | Add to landing page | `src/app/page.tsx` | Unauthenticated UX |
| 7 | Add to share page | `src/app/share/[id]/page.tsx` | Public page UX |

### 4.3 Critical Path Items

1. **Theme hook must be created first** - All other changes depend on it
2. **Layout.tsx changes are high-risk** - Must remove hardcoded dark AND add inline script
3. **Providers.tsx must wrap with ThemeProvider** - Otherwise useTheme will throw

### 4.4 Non-Negotiable Requirements

1. **Default to light mode** - Explicit requirement
2. **Persist preference in localStorage** - Core functionality
3. **No flash of incorrect theme** - Use inline blocking script
4. **Validate localStorage values** - Security best practice
5. **Handle private browsing mode** - Graceful degradation

---

## 5. Risk Consolidation

### Combined Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Hydration mismatch | High | Medium | Inline script + mounted state + suppressHydrationWarning |
| Flash of incorrect theme | Medium | Low | Inline blocking script before React hydration |
| localStorage unavailable | Low | Low | Try-catch with fallback to default |
| Corrupted localStorage value | Low | Very Low | Validate against allowlist |
| Charts not updating | Low | Very Low | Already use CSS variables |
| Toaster theme mismatch | Low | Medium | ToasterWithTheme wrapper reads from context |

### Mitigation Strategies

1. **Hydration**: Use `suppressHydrationWarning` on `<html>` element, inline script sets class before React
2. **Storage errors**: All localStorage operations wrapped in try-catch
3. **Invalid values**: Only accept `'light'` or `'dark'`, fallback to default
4. **Testing**: Manual QA checklist to verify all scenarios

---

## 6. Final Verdict

### Recommendation: **GO**

### Confidence Level: **High**

### Rationale:
- All CSS infrastructure is already in place
- Implementation is small scope (~150 lines new, ~30 modified)
- Risk is low - feature is additive, not modifying core functionality
- All three agents reached consensus on approach
- Zero new dependencies required
- Easy to test and revert if issues arise

### Conditions:
- Must use inline blocking script for FOIT prevention
- Must validate localStorage values against allowlist
- Must test on multiple browsers including Safari private browsing
- Must verify charts render correctly in both themes
- Must verify exported images use current theme

---

## 7. Approved Implementation Specifications

### New Files

**`gitstat/src/hooks/use-theme.ts`**
- Exports: `ThemeProvider`, `useTheme`
- Theme type: `"light" | "dark"`
- Storage key: `"gitstat-theme"`
- Default: `"light"`
- Features: localStorage persistence with error handling, value validation, DOM sync

**`gitstat/src/components/theme-toggle.tsx`**
- Exports: `ThemeToggle`
- Props: `className?: string`
- Icons: Moon (shown in light mode), Sun (shown in dark mode)
- Variant: ghost button, icon size

### Modified Files

1. **`gitstat/src/app/layout.tsx`**
   - Remove `className="dark"` from `<html>`
   - Add `suppressHydrationWarning` to `<html>`
   - Add inline blocking script in `<head>`

2. **`gitstat/src/components/providers.tsx`**
   - Import and wrap with `ThemeProvider`
   - Create `ToasterWithTheme` component that reads theme from context
   - Replace hardcoded `theme="dark"` with dynamic theme

3. **`gitstat/src/components/user-nav.tsx`**
   - Import `ThemeToggle`
   - Add toggle to the navigation (before user avatar)

4. **`gitstat/src/app/page.tsx`**
   - Import `ThemeToggle`
   - Add toggle to header area (top-right corner)

5. **`gitstat/src/app/share/[id]/page.tsx`**
   - Import `ThemeToggle`
   - Add toggle to header (alongside share info)

---

## 8. Manual QA Checklist

Post-implementation, verify:

- [ ] Landing page renders in light mode by default (new visitor)
- [ ] Toggle switches immediately between light and dark
- [ ] Theme persists across page refresh
- [ ] Theme persists across navigation
- [ ] No visible flash on page load (light mode default)
- [ ] No visible flash on page refresh (dark mode stored)
- [ ] Charts render correctly in light mode
- [ ] Charts render correctly in dark mode
- [ ] Toasts appear with correct theme
- [ ] Share page has working toggle
- [ ] Dashboard has working toggle
- [ ] Toggle works in Safari private browsing (session-only)
- [ ] No console hydration warnings
- [ ] Build completes without errors

---

*Council Review Complete - Approved for Implementation*
