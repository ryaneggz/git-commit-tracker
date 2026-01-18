# Light/Dark Mode Toggle Implementation Proposal

**Agent:** CRAFTSMAN (Clean Code, Maintainability, SOLID Principles)
**Feature:** Light/Dark Mode Toggle with Light Mode Default
**Date:** 2026-01-18

---

## 1. Executive Summary

Implement a theme toggle feature using a custom React context provider that manages theme state with localStorage persistence, defaulting to light mode. The solution leverages the existing CSS variable system already defined in `globals.css` and adds a minimal, accessible toggle component that integrates naturally into the existing navigation patterns. This approach follows SOLID principles by separating theme concerns into a dedicated provider while maintaining zero external dependencies.

---

## 2. Architectural Analysis

### 2.1 Current State Assessment

**Existing Infrastructure (Already in Place):**
- Complete light/dark CSS variable definitions in `/gitstat/src/app/globals.css`
  - `:root` contains light mode variables (oklch color space)
  - `.dark` class contains dark mode overrides
- Tailwind v4 custom variant configured: `@custom-variant dark (&:is(.dark *))`
- All UI components already use semantic CSS variables (`bg-background`, `text-foreground`, etc.)
- Recharts components use CSS variables directly (`var(--border)`, `var(--chart-1)`)

**Current Problems:**
1. Hard-coded `className="dark"` on `<html>` element in `layout.tsx` (line 28)
2. Toaster component hard-coded to `theme="dark"` in `providers.tsx` (line 11)
3. No theme state management or persistence mechanism
4. No user-facing toggle control

**Architectural Strengths to Preserve:**
- CSS variables approach enables instant theme switching without re-renders
- Existing hooks pattern (`use-media-query.ts`) demonstrates project conventions
- Provider pattern already established (`providers.tsx`)
- Semantic color naming abstracts theme from components

### 2.2 Proposed Changes

| File | Change Type | Description |
|------|-------------|-------------|
| `src/hooks/use-theme.ts` | NEW | Theme context provider and hook |
| `src/components/theme-toggle.tsx` | NEW | Theme toggle button component |
| `src/components/providers.tsx` | MODIFY | Wrap with ThemeProvider, dynamic Toaster theme |
| `src/app/layout.tsx` | MODIFY | Remove hard-coded "dark" class |
| `src/components/user-nav.tsx` | MODIFY | Add ThemeToggle to navigation |
| `src/app/page.tsx` | MODIFY | Add ThemeToggle to landing page header |
| `src/app/share/[id]/page.tsx` | MODIFY | Add ThemeToggle to share page header |

### 2.3 Integration Points and Dependencies

**Internal Dependencies:**
- `@/lib/utils` - `cn()` function for conditional class merging
- `lucide-react` - Sun/Moon icons (already installed)
- `@/components/ui/button` - Button component for toggle

**External Dependencies:**
- None required (zero new packages)

**Integration Points:**
- Theme state consumed by Toaster (sonner) for toast theming
- Theme state potentially useful for future Recharts theming
- Share pages need theme toggle for unauthenticated users

---

## 3. Implementation Strategy

### 3.1 Step-by-Step Implementation Plan

#### Step 1: Create Theme Hook and Provider

Create `/gitstat/src/hooks/use-theme.ts`:

```typescript
"use client";

import * as React from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "gitstat-theme";
const DEFAULT_THEME: Theme = "light";

/**
 * Retrieves theme from localStorage or returns default
 * Runs only on client-side
 */
function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_THEME;
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }

  return DEFAULT_THEME;
}

/**
 * Applies theme class to document root element
 */
function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme);
  const [mounted, setMounted] = React.useState(false);

  // Initialize theme from localStorage after mount
  React.useEffect(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyTheme(stored);
    setMounted(true);
  }, []);

  // Apply theme changes to DOM and persist
  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // Prevent hydration mismatch by not rendering until mounted
  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  // During SSR, render with default theme to prevent flash
  if (!mounted) {
    return (
      <ThemeContext.Provider
        value={{
          theme: defaultTheme,
          setTheme: () => {},
          toggleTheme: () => {},
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * @throws Error if used outside ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
```

#### Step 2: Create Theme Toggle Component

Create `/gitstat/src/components/theme-toggle.tsx`:

```typescript
"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </Button>
  );
}
```

#### Step 3: Update Providers Component

Modify `/gitstat/src/components/providers.tsx`:

```typescript
"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "@/hooks/use-theme";

/**
 * Inner component that can access theme context
 */
function ToasterWithTheme() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "bg-card border border-border",
          title: "text-foreground",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="light">
      <SessionProvider>
        {children}
        <ToasterWithTheme />
      </SessionProvider>
    </ThemeProvider>
  );
}
```

#### Step 4: Update Root Layout

Modify `/gitstat/src/app/layout.tsx`:

```typescript
// Change line 28 from:
<html lang="en" className="dark">

// To:
<html lang="en">
```

This removes the hard-coded dark class. The ThemeProvider will add/remove the class dynamically.

#### Step 5: Add Toggle to User Navigation

Modify `/gitstat/src/components/user-nav.tsx`:

```typescript
"use client";

import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export function UserNav() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <div className="flex items-center gap-2">
        {session.user.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? "User avatar"}
            width={32}
            height={32}
            className="rounded-full"
          />
        )}
        <span className="text-sm font-medium">{session.user.name}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Logout
      </Button>
    </div>
  );
}
```

#### Step 6: Add Toggle to Landing Page

Modify `/gitstat/src/app/page.tsx` - Add header with theme toggle:

```typescript
// Add import at top:
import { ThemeToggle } from "@/components/theme-toggle";

// Add header before hero section (after line 108):
<header className="absolute top-0 right-0 p-4">
  <ThemeToggle />
</header>
```

#### Step 7: Add Toggle to Share Page

Modify `/gitstat/src/app/share/[id]/page.tsx` - Update header:

```typescript
// Add import:
import { ThemeToggle } from "@/components/theme-toggle";

// Modify header section (around line 109):
<header className="border-b bg-card">
  <div className="container mx-auto flex h-16 items-center justify-between px-4">
    <Link href="/" className="text-xl font-bold">
      GitStat
    </Link>
    <div className="flex items-center gap-4">
      <ThemeToggle />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>Shared by {shareData.username}</span>
      </div>
    </div>
  </div>
</header>
```

### 3.2 Key Code Patterns to Follow

1. **"use client" Directive**: All theme-related code requires client-side execution
2. **Hook Naming Convention**: `use-theme.ts` matches existing `use-media-query.ts`
3. **Component Props Pattern**: Use `interface ThemeToggleProps` with optional `className`
4. **Memoization**: Use `useMemo` and `useCallback` for context value stability
5. **Error Boundaries**: Throw descriptive errors when hooks used outside providers

---

## 4. Design Decisions

### 4.1 Trade-offs Considered

| Decision | Alternative Considered | Rationale for Choice |
|----------|----------------------|---------------------|
| Custom context provider | next-themes package | Zero dependencies, simpler API surface, full control over behavior |
| localStorage persistence | Cookies | Simpler implementation, no server-side concerns for this use case |
| Class-based theming | CSS media query | User preference override capability, explicit user control |
| Light mode default | System preference default | Requirement specifies light default; simpler first-time UX |
| Icon toggle button | Dropdown menu | Minimal UI footprint, matches "no clutter" principle |

### 4.2 Why This Approach Over Alternatives

**Custom Provider vs. next-themes:**
- `next-themes` adds 3KB to bundle
- Custom solution provides exactly what we need (2 themes, localStorage, no SSR complexity)
- Easier to debug and maintain
- No version compatibility concerns with Next.js 16

**Class Toggle vs. CSS Media Query:**
- User preference should override system preference per requirement
- Class-based allows for potential future "system" option
- Explicit state is easier to reason about and test

**Icon Button vs. Toggle Switch:**
- Smaller visual footprint
- Standard pattern (GitHub, Notion, etc.)
- Works well at small sizes in navigation

### 4.3 Alignment with Existing Codebase Patterns

1. **File Organization**: Hook in `/hooks`, component in `/components`
2. **Naming**: Follows existing `use-*.ts` pattern
3. **Provider Structure**: Mirrors `SessionProvider` wrapping in `providers.tsx`
4. **Component API**: Uses optional `className` prop like other components
5. **Imports**: Uses `@/` path aliases consistently

---

## 5. Risk Assessment

### 5.1 Potential Pitfalls

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hydration mismatch | Medium | High | Use `mounted` state to defer client-specific rendering |
| Flash of wrong theme | Medium | Low | Apply theme in useEffect before setting mounted |
| LocalStorage unavailable | Low | Low | Fallback to default theme, no error thrown |
| Recharts not updating | Low | Medium | Already uses CSS variables, should work automatically |

### 5.2 Edge Cases to Handle

1. **First-time visitors**: No localStorage key exists, default to light mode
2. **localStorage disabled**: Gracefully fallback to default without errors
3. **Server-side rendering**: Provider renders with default theme to prevent mismatch
4. **Rapid toggling**: `useCallback` ensures stable function references
5. **Share page without auth**: Theme toggle works independently of session

### 5.3 Testing Considerations

**Manual Testing Checklist:**
- [ ] Landing page renders in light mode by default
- [ ] Toggle switches between light and dark modes
- [ ] Theme persists across page navigation
- [ ] Theme persists across browser refresh
- [ ] Toast notifications follow theme
- [ ] Charts render correctly in both themes
- [ ] Share page respects user's theme preference
- [ ] No console errors during theme toggle
- [ ] No visible flash on page load

**Automated Testing (Future):**
- Unit tests for `useTheme` hook logic
- Component tests for `ThemeToggle` button behavior
- E2E tests for persistence across navigation

---

## 6. Estimated Complexity

### 6.1 Scope Assessment

**Scope: Small**

| Metric | Value |
|--------|-------|
| New files | 2 |
| Modified files | 5 |
| Lines of code (new) | ~120 |
| Lines of code (modified) | ~30 |
| External dependencies | 0 |

### 6.2 Risk Level

**Risk Level: Low**

- All infrastructure (CSS variables, Tailwind config) already in place
- No database changes required
- No API changes required
- Feature is additive, not modifying core functionality
- Easy to test manually
- Easy to revert if issues arise

### 6.3 Suggested Implementation Order

1. **Phase 1 - Core Infrastructure** (Priority: High)
   - Create `use-theme.ts` hook and provider
   - Update `providers.tsx` to include ThemeProvider
   - Remove hard-coded "dark" class from layout.tsx

2. **Phase 2 - UI Integration** (Priority: High)
   - Create `theme-toggle.tsx` component
   - Add toggle to `user-nav.tsx`

3. **Phase 3 - Complete Coverage** (Priority: Medium)
   - Add toggle to landing page
   - Add toggle to share page

4. **Phase 4 - Polish** (Priority: Low)
   - Add smooth transition animation for theme switch
   - Consider adding "system" preference option

### 6.4 Estimated Time

- Implementation: 1-2 hours
- Testing: 30 minutes
- Total: 2-3 hours

---

## 7. File Reference Summary

### New Files

| File Path | Purpose |
|-----------|---------|
| `/gitstat/src/hooks/use-theme.ts` | Theme context provider and hook |
| `/gitstat/src/components/theme-toggle.tsx` | Theme toggle button component |

### Modified Files

| File Path | Changes |
|-----------|---------|
| `/gitstat/src/components/providers.tsx` | Add ThemeProvider wrapper, dynamic Toaster theme |
| `/gitstat/src/app/layout.tsx` | Remove `className="dark"` from html element |
| `/gitstat/src/components/user-nav.tsx` | Add ThemeToggle component |
| `/gitstat/src/app/page.tsx` | Add ThemeToggle to header area |
| `/gitstat/src/app/share/[id]/page.tsx` | Add ThemeToggle to header |

---

## 8. Appendix: CSS Variable Reference

The following CSS variables are already defined and will automatically switch with the theme:

**Core Colors:**
- `--background` / `--foreground`
- `--card` / `--card-foreground`
- `--popover` / `--popover-foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--accent` / `--accent-foreground`
- `--destructive`

**UI Elements:**
- `--border`
- `--input`
- `--ring`

**Chart Colors:**
- `--chart-1` through `--chart-5`

**Sidebar (if used):**
- `--sidebar` and related variables

All these variables have both light (`:root`) and dark (`.dark`) values defined in `/gitstat/src/app/globals.css`.
