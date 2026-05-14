# Prompt 3 — Responsiveness Fix

**Goal:** Fix horizontal overflow across all pages. No redesign, no new features, layout only.

---

## Prompt (condensed)

The application currently causes horizontal overflow on multiple pages. Sections are cut off to the right and the user has to scroll left/right to see content. Fix this across the entire app for all screen sizes.

**Constraint:** Do not redesign the app. Do not add new features. Only fix layout responsiveness and overflow.

### Root causes to fix

1. `html/body/#root` — missing `overflow-x: hidden` and `max-width: 100%`
2. Fixed sidebar (`width: 252px`) — no mobile handling; consumes full viewport width on small screens
3. All page wrappers use `px-8` with no responsive breakpoints
4. Dashboard queue table — fixed 8-column grid with no overflow wrapper
5. Two-column layouts (`grid-cols-[1fr_280px]` etc.) — no responsive collapse
6. Evaluation test cases table — 7-column fixed grid with no overflow wrapper
7. `code-block` — no `overflow-wrap: break-word`
8. FindingCard inner grids — no responsive breakpoints
9. Metric grids — fixed 4-column with no wrap

### Required fixes

**Global:**
- `html, body, #root`: add `overflow-x: hidden; max-width: 100%`
- `.code-block`: add `overflow-wrap: break-word; word-break: break-word; max-width: 100%`

**Layout.tsx:**
- Hide sidebar below `md:` breakpoint
- Add mobile hamburger button + slide-in drawer overlay
- Mobile top bar: brand logo + menu toggle
- Main content: `min-w-0 overflow-x-hidden`, add `pt-[52px]` on mobile for top bar

**All page wrappers:**
- Replace `px-8` with `px-4 sm:px-6 lg:px-8`
- Replace `max-w-[X]` with `w-full max-w-[X]`

**All two-column grids:**
- Replace `grid-cols-[1fr_Xpx]` with `grid-cols-1 xl:grid-cols-[1fr_Xpx]`
- Add `min-w-0` to the left column

**All metric grids:**
- Replace `grid-cols-4` with `grid-cols-2 lg:grid-cols-4`
- Replace `grid-cols-3` with `grid-cols-2 lg:grid-cols-3`

**Tables:**
- Wrap queue table in `overflow-x-auto` with `min-width: 700px` inner container
- Wrap eval test cases table in `overflow-x-auto` with `min-width: 760px` inner container

**FindingCard:**
- `grid-cols-3` → `grid-cols-1 sm:grid-cols-3`
- `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`
- Decision row buttons: add `flex-wrap`

**RedlineCard:**
- `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`
- Code blocks: add `overflow-x-auto`

**NewReview form:**
- Metadata grid: `grid-cols-2` → `grid-cols-1 sm:grid-cols-2`
- Textarea: add `maxWidth: 100%`, `overflowWrap: break-word`, `whiteSpace: pre-wrap`
- Action row: add `flex-wrap`

### Verification

After all fixes: run `npm run build`. Verify no horizontal scroll at 1440px, 1024px, 768px, 430px, 390px.
