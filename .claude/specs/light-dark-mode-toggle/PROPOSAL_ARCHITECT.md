# Implementation Proposal: Light/Dark Mode Toggle

**Feature:** Allow users to toggle between light and dark mode, defaulting to light mode
**Agent:** ARCHITECT
**Date:** 2026-01-18

---

## 1. Executive Summary

This proposal recommends implementing a theme toggle using React Context with localStorage persistence, leveraging the existing CSS variable infrastructure already defined in `globals.css`. The implementation requires minimal changes: a ThemeProvider wrapper, a theme toggle button component, and updates to three existing files. This approach provides immediate value with zero configuration while maintaining the "screenshot-ready" aesthetic.

---

## 2. Architectural Analysis

### 2.1 Current State Assessment

**Strengths of Existing Infrastructure:**

| Component | Current State | Readiness |
|-----------|--------------|-----------|
| CSS Variables | Complete light (`:root`) and dark (`.dark`) schemes defined | Ready |
| Tailwind v4 Dark Variant | `@custom-variant dark (&:is(.dark *))` configured | Ready |
| Component Styling | All components use CSS variables (`bg-background`, `text-foreground`, etc.) | Ready |
| Recharts Integration | Charts already use CSS variables (`var(--chart-1)`, `var(--border)`) | Ready |

**Current Limitations:**

1. **Hardcoded Dark Mode**: `layout.tsx` has `className="dark"` hardcoded on `<html>` element
2. **Hardcoded Toaster Theme**: `providers.tsx` Toaster has `theme="dark"` hardcoded
3. **No Theme State Management**: No context or state mechanism for theme switching
4. **No Persistence**: No localStorage or cookie-based theme persistence

### 2.2 Integration Points

```
                    +------------------+
                    |   layout.tsx     |
                    |  (Server Comp)   |
                    +--------+---------+
                             |
                             v
                    +------------------+
                    |   Providers      |
                    |  (Client Comp)   |
                    +--------+---------+
                             |
        +--------------------+--------------------+
        |                    |                    |
        v                    v                    v
+---------------+    +---------------+    +---------------+
| Dashboard     |    | Share Page    |    | Landing/Login |
| (user-nav.tsx)|    | (public view) |    |   Pages       |
+---------------+    +---------------+    +---------------+
```

**Key Integration Points:**

1. **`layout.tsx`** - Entry point where theme class is applied to `<html>`
2. **`providers.tsx`** - Wraps entire app, ideal location for ThemeProvider
3. **`user-nav.tsx`** - Dashboard header, natural location for toggle button
4. **Share page header** - Should also have toggle for consistent UX

### 2.3 Proposed Architecture

```
+-------------------------------------------------------------------+
|                          layout.tsx                                |
|  +-------------------------------------------------------------+  |
|  |                      Providers                               |  |
|  |  +-------------------------------------------------------+  |  |
|  |  |                  ThemeProvider                         |  |  |
|  |  |  - Manages theme state                                 |  |  |
|  |  |  - Syncs to <html> class                              |  |  |
|  |  |  - Persists to localStorage                           |  |  |
|  |  |  +-----------------------------------------------+    |  |  |
|  |  |  |              Application                       |    |  |  |
|  |  |  |  +------------------+  +------------------+    |    |  |  |
|  |  |  |  | ThemeToggle      |  | Toaster          |    |    |  |  |
|  |  |  |  | (consumes theme) |  | (theme-aware)    |    |    |  |  |
|  |  |  |  +------------------+  +------------------+    |    |  |  |
|  |  |  +-----------------------------------------------+    |  |  |
|  |  +-------------------------------------------------------+  |  |
|  +-------------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

---

## 3. Implementation Strategy

### 3.1 Step-by-Step Implementation Plan

**Phase 1: Core Theme Infrastructure**

| Step | Action | File |
|------|--------|------|
| 1.1 | Create theme context with provider | `src/contexts/theme-context.tsx` (new) |
| 1.2 | Create theme toggle component | `src/components/theme-toggle.tsx` (new) |

**Phase 2: Integration**

| Step | Action | File |
|------|--------|------|
| 2.1 | Remove hardcoded dark class | `src/app/layout.tsx` |
| 2.2 | Wrap app with ThemeProvider | `src/components/providers.tsx` |
| 2.3 | Add toggle to user navigation | `src/components/user-nav.tsx` |
| 2.4 | Add toggle to share page header | `src/app/share/[id]/page.tsx` |
| 2.5 | Add toggle to landing page | `src/app/page.tsx` |

### 3.2 File Changes Required

#### New Files

**`src/contexts/theme-context.tsx`**
```typescript
"use client";

import * as React from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "gitstat-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("light");
  const [mounted, setMounted] = React.useState(false);

  // Initialize theme from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === "light" || stored === "dark") {
      setThemeState(stored);
    }
    setMounted(true);
  }, []);

  // Sync theme to document and localStorage
  React.useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  const setTheme = React.useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  // Return children immediately but context will handle the class sync
  const value = React.useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
```

**`src/components/theme-toggle.tsx`**
```typescript
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/theme-context";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch - render placeholder during SSR
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className={className}
        disabled
        aria-label="Toggle theme"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      className={className}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}
```

#### Modified Files

**`src/app/layout.tsx`**
- Remove `className="dark"` from `<html>` element
- HTML will start without theme class (light mode default)

**`src/components/providers.tsx`**
- Import and wrap with `ThemeProvider`
- Update Toaster to use dynamic theme from context

**`src/components/user-nav.tsx`**
- Add `ThemeToggle` component to the navigation

**`src/app/share/[id]/page.tsx`**
- Add `ThemeToggle` to header for public share pages

**`src/app/page.tsx`**
- Add `ThemeToggle` to landing page header area

### 3.3 Key Code Patterns to Follow

**Pattern 1: Hydration-Safe Component**
```typescript
// Always check mounted state before rendering theme-dependent content
const [mounted, setMounted] = React.useState(false);
React.useEffect(() => setMounted(true), []);
if (!mounted) return <Placeholder />;
```

**Pattern 2: CSS Variable Usage (Already Established)**
```typescript
// Components already use CSS variables - no changes needed
<div className="bg-background text-foreground" />
<Line stroke="var(--chart-1)" />
```

**Pattern 3: Semantic Color Classes**
```typescript
// Use semantic Tailwind classes, not raw colors
className="text-muted-foreground"  // Correct
className="text-gray-500"          // Avoid
```

---

## 4. Design Decisions

### 4.1 Trade-offs Considered

| Decision | Alternative | Chosen | Rationale |
|----------|-------------|--------|-----------|
| Custom Context vs next-themes | next-themes library | Custom Context | Fewer dependencies, simpler for binary light/dark, full control over behavior |
| localStorage vs Cookies | Cookies for SSR | localStorage | Simpler implementation, acceptable FOUC mitigation, no server-side complexity |
| Toggle Button vs Dropdown | Dropdown with system option | Toggle Button | Matches "opinionated defaults" principle, cleaner UI, fewer choices |
| Default Light vs Dark | Default to system preference | Default to Light | Explicit requirement; predictable behavior |

### 4.2 Why Custom Context Over next-themes

**Pros of Custom Context:**
- Zero additional dependencies
- Full control over behavior and storage key
- Simpler API for binary light/dark
- No configuration overhead
- Easier to debug

**Cons of Custom Context:**
- Must handle hydration ourselves
- No system preference detection (by design per requirements)

**Conclusion:** For a simple light/dark toggle with explicit default, custom context is more aligned with the project's "zero configuration to value" principle.

### 4.3 Alignment with Codebase Patterns

| Pattern | Existing Usage | Proposed Implementation |
|---------|----------------|------------------------|
| "use client" directive | All interactive components | ThemeProvider and ThemeToggle |
| React.useEffect for side effects | use-media-query.ts | Theme sync to DOM |
| Context + Hook pattern | Not currently used, but standard React | ThemeProvider + useTheme |
| Lucide icons | Used throughout (Loader2, AlertCircle, etc.) | Sun and Moon icons |
| Button variants | ghost, outline, etc. | ghost variant for toggle |
| Memoized callbacks | Dashboard state handlers | setTheme, toggleTheme |

---

## 5. Risk Assessment

### 5.1 Potential Pitfalls

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Hydration Mismatch | Medium | High (breaks app) | Mounted state check before rendering theme-dependent UI |
| Flash of Unstyled Content (FOUC) | Low | Low (cosmetic) | Default to light in HTML, sync immediately on mount |
| Chart Colors Not Updating | Low | Medium | Charts already use CSS variables; will update automatically |
| Toaster Theme Out of Sync | Medium | Low | Pass theme from context to Toaster component |
| localStorage Not Available | Very Low | Low | Fallback to default theme |

### 5.2 Edge Cases to Handle

1. **First Visit (No localStorage)**
   - Default to light mode
   - No flash since HTML starts without dark class

2. **Returning User with Stored Preference**
   - Brief flash possible if stored preference is dark
   - Acceptable trade-off for simplicity

3. **Share Page (Unauthenticated)**
   - Toggle should still work
   - Theme preference should persist across pages

4. **Mobile/Responsive**
   - Toggle button uses icon-sm size
   - Works well in existing header layout

5. **Export/Screenshot**
   - html2canvas captures current theme state
   - No special handling needed

### 5.3 Testing Considerations

**Manual Testing Checklist:**
- [ ] Toggle switches between light and dark modes
- [ ] Theme persists across page refreshes
- [ ] Theme persists across navigation
- [ ] No console hydration warnings
- [ ] Charts render correctly in both themes
- [ ] Toasts appear with correct theme
- [ ] Share page respects theme preference
- [ ] Landing page toggle works for unauthenticated users
- [ ] Export captures current theme state

**Automated Testing (If Added Later):**
```typescript
// Example test cases
describe("ThemeProvider", () => {
  it("defaults to light theme");
  it("persists theme to localStorage");
  it("loads theme from localStorage");
  it("toggles between light and dark");
});
```

---

## 6. Estimated Complexity

### 6.1 Scope Assessment

| Metric | Value |
|--------|-------|
| **Scope** | Small |
| **Risk Level** | Low |
| **New Files** | 2 |
| **Modified Files** | 5 |
| **Lines of Code** | ~150 new, ~20 modified |
| **Estimated Time** | 1-2 hours |

### 6.2 Implementation Priority Order

| Priority | Task | Rationale |
|----------|------|-----------|
| 1 | Create `theme-context.tsx` | Core infrastructure; other changes depend on this |
| 2 | Create `theme-toggle.tsx` | Reusable component needed by multiple pages |
| 3 | Update `providers.tsx` | Wire up ThemeProvider and dynamic Toaster theme |
| 4 | Update `layout.tsx` | Remove hardcoded dark class |
| 5 | Update `user-nav.tsx` | Primary toggle location for authenticated users |
| 6 | Update `page.tsx` (landing) | Toggle for unauthenticated users |
| 7 | Update `share/[id]/page.tsx` | Toggle for public share pages |

### 6.3 Dependency Graph

```
theme-context.tsx
       |
       v
theme-toggle.tsx
       |
       +---> user-nav.tsx
       |
       +---> page.tsx (landing)
       |
       +---> share/[id]/page.tsx

providers.tsx (depends on theme-context.tsx)
       |
       v
layout.tsx (remove dark class)
```

---

## 7. Summary

This implementation leverages the existing CSS variable infrastructure to deliver a clean, maintainable theme toggle with minimal code changes. The architecture follows established React patterns and aligns with the project's principles of opinionated defaults and zero-configuration value.

**Key Deliverables:**
1. New `ThemeProvider` context with localStorage persistence
2. New `ThemeToggle` button component using Lucide icons
3. Integration across dashboard, landing page, and share pages
4. Default light mode per requirements

**Not Included (By Design):**
- System preference detection (explicit light default required)
- Theme dropdown (simple toggle preferred)
- Additional themes beyond light/dark

The implementation is self-contained, introduces no new dependencies, and can be completed in a single development session.
