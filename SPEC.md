---
task: Build GitStat - GitHub commit visualization app
test_command: "npm run build && npm run lint && npm run test"
---

# Task: GitStat MVP

Build a lightweight visualization app that transforms Git commit history into a linear timeline of momentum, making exponential growth obvious and shareable.

## Requirements

1. Next.js App Router with TypeScript
2. shadcn/ui component library with Tailwind CSS
3. Recharts or Visx for chart rendering
4. GitHub OAuth authentication
5. GitHub GraphQL API for commit data
6. Lightweight caching (edge cache or Redis)
7. Data model: `CommitEvent { date: Date, count: number, cumulative: number }`

## Success Criteria

### Authentication
- [ ] Landing page displays "Sign in with GitHub" button
- [ ] OAuth flow redirects to GitHub and returns with user data
- [ ] Authenticated user sees their GitHub username displayed
- [ ] Auth errors show user-friendly error message
- [ ] Logout button clears session and returns to landing page

### Timeline Chart
- [ ] Chart renders with x-axis showing date labels
- [ ] Chart renders with y-axis showing cumulative commit count
- [ ] Cumulative line increases monotonically (never decreases)
- [ ] Slope changes (momentum shifts) are visually distinguishable
- [ ] Dark mode styling applied by default
- [ ] Chart maintains readability at 375px mobile viewport width
- [ ] Chart renders 10,000 commits in <3 seconds

### Velocity Indicators
- [ ] Weekly commit rate displayed (e.g., "45 commits/week")
- [ ] Monthly commit rate displayed
- [ ] % growth vs prior period calculated and shown
- [ ] Velocity numbers update when time window changes
- [ ] Zero commits shows "No activity" message, not broken UI

### Sharing
- [ ] "Copy Link" button generates public read-only URL
- [ ] "Export PNG" button downloads chart image
- [ ] Exported PNG has fixed dimensions optimized for social (1200x630)
- [ ] Exported image includes minimal watermark
- [ ] Export failure shows error message with retry option

### Repo Controls
- [ ] Repository dropdown lists user's accessible repos
- [ ] Multi-select allows choosing multiple repositories
- [ ] Time presets (30/90/180/All-time) filter displayed data
- [ ] "Exclude bots" toggle filters out bot commits by default
- [ ] "Exclude merge commits" toggle available
- [ ] Empty repo list shows helpful empty state message

### Edge Cases
- [ ] Zero commits displays empty state with guidance message
- [ ] GitHub API rate limit error shows retry countdown
- [ ] Network failure shows offline message (not crash)
- [ ] Expired OAuth token prompts re-authentication
- [ ] Repository with 100+ repos supports pagination

## Guard Rails (Must NOT Implement)

- [ ] No code quality analysis or scoring
- [ ] No lines-of-code metrics
- [ ] No AI judgment or ratings
- [ ] No team comparison features or leaderboards
- [ ] No database beyond JSON/edge caching (no Postgres, no Prisma)
- [ ] No user accounts beyond GitHub OAuth (no email/password)
- [ ] No paid tier or monetization UI

## Example Output

```
$ npm run dev
# Navigate to http://localhost:3000

1. Landing page shows "Sign in with GitHub" button
2. After OAuth: "Welcome, @username" with repo selector
3. Select repos + time window (e.g., 90 days)
4. Chart renders showing:
   - X-axis: "Oct 2025" through "Jan 2026"
   - Y-axis: 0 to 847 commits
   - Cumulative line with visible acceleration
   - Velocity badge: "127 commits/month (+23%)"
5. Click "Export PNG" -> downloads gitstat-username-2026-01-17.png
6. Click "Copy Link" -> copies https://gitstat.app/share/abc123
```

---

## Ralph Instructions

1. Work on the next incomplete criterion (marked [ ])
2. Check off completed criteria (change [ ] to [x])
3. Run tests after changes: `npm run build && npm run test`
4. Verify types: `npx tsc --noEmit`
5. Commit your changes frequently with descriptive messages
6. When ALL criteria are [x], output: `<ralph>COMPLETE</ralph>`
7. If stuck on the same issue 3+ times, output: `<ralph>GUTTER</ralph>`

### Constraints (from Non-Goals)
- Do NOT implement code quality analysis
- Do NOT add lines-of-code metrics
- Do NOT introduce AI/ML scoring or judgment
- Do NOT add team analytics or comparison features
- Focus on momentum visualization, not merit evaluation

### Edge Cases to Handle
- GitHub API rate limiting: Show retry countdown, use cached data
- Invalid/missing commit data: Show placeholder with guidance
- User with zero commits: Display encouraging empty state
- Network failure: Graceful degradation with offline message
- Token expiration: Prompt re-authentication seamlessly
