# PRD: GitStat - GitHub Commit Visualization

## Introduction

GitStat is a personal GitHub commit visualization tool that displays a user's commit history as an interactive timeline chart. Users authenticate via GitHub OAuth, select repositories to track, and view their commit velocity over time. The app supports exporting visualizations as shareable images.

## Goals

- Enable GitHub users to visualize their commit history across repositories
- Display commit velocity metrics (weekly/monthly rates, growth trends)
- Provide interactive filtering by repository and date range
- Support dark mode with responsive design (mobile to desktop)
- Allow exporting charts as PNG images for sharing
- Render 10,000+ commits with acceptable performance (<3 seconds)

## User Stories

### US-001: Project Foundation Setup
**Description:** As a developer, I need the project scaffolded with Next.js, TypeScript, shadcn/ui, and Tailwind CSS so development can begin.

**Acceptance Criteria:**
- [ ] Next.js project initialized with TypeScript configuration
- [ ] Tailwind CSS configured with dark mode support
- [ ] shadcn/ui components installed and configured
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes with no warnings
- [ ] Typecheck passes

### US-002: GitHub OAuth Login
**Description:** As a user, I want to log in with my GitHub account so the app can access my commit history.

**Acceptance Criteria:**
- [ ] Login button redirects to GitHub OAuth authorization page
- [ ] OAuth callback stores access token securely (httpOnly cookie or encrypted storage)
- [ ] User data (username, avatar) retrieved and displayed after login
- [ ] Invalid or expired tokens redirect user to login flow
- [ ] Typecheck passes

### US-003: GitHub OAuth Logout
**Description:** As a user, I want to log out so I can switch accounts or end my session.

**Acceptance Criteria:**
- [ ] Logout button visible when authenticated
- [ ] Clicking logout clears stored tokens and user data
- [ ] User redirected to landing/login page after logout
- [ ] Subsequent page loads do not restore previous session
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-004: Timeline Chart Rendering
**Description:** As a user, I want to see my commit history as a cumulative timeline chart so I can visualize my coding activity.

**Acceptance Criteria:**
- [ ] Chart displays cumulative commit count on y-axis
- [ ] X-axis shows date labels (daily/weekly/monthly based on range)
- [ ] Cumulative line connects data points chronologically
- [ ] Chart renders correctly with dark mode styling
- [ ] Chart is responsive at 375px viewport width (mobile)
- [ ] 10,000 commits render in under 3 seconds
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-005: Velocity Metrics Display
**Description:** As a user, I want to see my commit velocity metrics so I can understand my coding pace.

**Acceptance Criteria:**
- [ ] Weekly commit rate displayed (e.g., "45 commits/week")
- [ ] Monthly commit rate displayed (e.g., "180 commits/month")
- [ ] Growth percentage displayed comparing current period to previous
- [ ] Zero commits state shows "0 commits/week" (not blank or error)
- [ ] Metrics update when date range or repository filter changes
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-006: Repository Selection
**Description:** As a user, I want to select which repositories to include so I can focus on specific projects.

**Acceptance Criteria:**
- [ ] Dropdown lists all repositories accessible to the authenticated user
- [ ] Multi-select enabled to choose multiple repositories
- [ ] Chart updates when repository selection changes
- [ ] "No repositories found" message displayed when user has no repos
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-007: Date Range Filtering
**Description:** As a user, I want to filter by date range so I can view specific time periods.

**Acceptance Criteria:**
- [ ] Date range picker with start and end date inputs
- [ ] Preset options available (Last 7 days, Last 30 days, Last year, All time)
- [ ] Chart and metrics update when date range changes
- [ ] Invalid date range (end before start) shows validation error
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-008: PNG Export
**Description:** As a user, I want to export my chart as a PNG image so I can share it on social media.

**Acceptance Criteria:**
- [ ] Export button visible on chart view
- [ ] Clicking export generates valid PNG file
- [ ] Exported image has fixed aspect ratio (16:9 or similar)
- [ ] Exported image includes chart, metrics, and branding
- [ ] Export failure shows error message (not silent failure)
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-009: Public Shareable Link
**Description:** As a user, I want to generate a public link to my chart so others can view it without logging in.

**Acceptance Criteria:**
- [ ] "Generate Link" button creates unique shareable URL
- [ ] Shareable URL displays chart without requiring authentication
- [ ] Link includes current repository and date range selection
- [ ] Copy-to-clipboard functionality works
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

### US-010: End-to-End User Journey
**Description:** As a user, I want to complete the full flow from login to export so the app works cohesively.

**Acceptance Criteria:**
- [ ] User can: OAuth login -> Select repository -> View chart -> Export PNG
- [ ] All transitions between steps work without page refresh errors
- [ ] API rate limiting handled gracefully (shows message, does not crash)
- [ ] Network failure during data fetch shows retry option
- [ ] All previous user stories pass their acceptance criteria
- [ ] Typecheck passes
- [ ] Verify in browser using dev-browser skill

## Functional Requirements

- FR-1: Implement GitHub OAuth 2.0 authentication flow with secure token storage
- FR-2: Fetch commit data from GitHub API for selected repositories and date range
- FR-3: Render cumulative commit timeline using a charting library (e.g., Recharts, Chart.js)
- FR-4: Calculate and display weekly/monthly commit velocity and growth percentage
- FR-5: Provide multi-select repository dropdown populated from user's GitHub account
- FR-6: Provide date range picker with preset options and custom range selection
- FR-7: Export current chart view as PNG image with fixed dimensions
- FR-8: Generate unique shareable URLs that display chart without authentication
- FR-9: Support dark mode via Tailwind CSS dark variant
- FR-10: Ensure responsive layout from 375px (mobile) to 1920px (desktop)

## Non-Goals

- No team comparison features (individual use only)
- No commit content analysis or code metrics
- No repository write access (read-only OAuth scope)
- No historical data storage beyond session (fetches fresh from GitHub API)
- No user accounts or profiles beyond OAuth session
- No email notifications or scheduled reports
- No integration with other Git providers (GitHub only)

## Technical Considerations

- **Framework:** Next.js 14+ with App Router
- **Styling:** Tailwind CSS with shadcn/ui components
- **Auth:** NextAuth.js or similar for GitHub OAuth
- **Charts:** Recharts or Chart.js for timeline visualization
- **Export:** html2canvas or similar for PNG generation
- **API:** GitHub REST API v3 for commit data
- **Performance:** Virtualization or data aggregation for large commit counts

## Success Metrics

- OAuth flow completes in under 3 clicks
- Chart renders 10,000 commits in under 3 seconds
- PNG export generates file in under 5 seconds
- Mobile layout (375px) is fully functional
- Zero runtime errors in production build

## Open Questions

- Should shareable links expire after a certain time period?
- What aggregation level for charts with 1+ year of data (daily vs weekly)?
- Should we cache GitHub API responses to reduce rate limit impact?
