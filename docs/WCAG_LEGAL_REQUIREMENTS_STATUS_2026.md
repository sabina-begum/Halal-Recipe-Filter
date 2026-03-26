# WCAG Legal Requirements Gap Analysis - Recipe-App

Date: 2026-03-26  
Repository: `Recipe-App`  
Scope: Frontend codebase review + lint baseline (`npm run lint`)

## Compliance Target

- Recommended legal baseline: **WCAG 2.1 AA** (commonly required under ADA, EAA, UK Equality Act/Public Sector rules, and similar regulations).
- Current status: **Not yet compliant**. Several core Level A/AA requirements are partially implemented or missing.

## Status Key

- `Implemented` = requirement appears covered in current code
- `Partial` = some support exists, but gaps remain
- `Missing` = no reliable implementation found

## Requirement Status (Legal Priority)

| Requirement                                        | WCAG SC                                            | Status              | Evidence in Repo                                                                                                                     | What still needs to be implemented                                                                          |
| -------------------------------------------------- | -------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| Page language is declared                          | 3.1.1 (A)                                          | Implemented         | `index.html` has `lang="en"`                                                                                                         | Keep updated for localization support.                                                                      |
| Keyboard access for interactive controls           | 2.1.1 (A)                                          | Partial             | Many elements use real `button`/`a`; keyboard handlers exist in nav                                                                  | Validate all custom widgets and dropdown patterns are fully keyboard-operable in sequence.                  |
| No keyboard trap                                   | 2.1.2 (A)                                          | Partial             | No explicit traps seen                                                                                                               | Add robust modal focus management (trap inside dialog while open, return focus on close).                   |
| Bypass blocks (skip link)                          | 2.4.1 (A)                                          | Implemented         | Skip link in `Navbar` now maps to `id="main-content"` in `MainLayout`                                                                | Keep this landmark id stable and verify behavior in keyboard-only testing.                                  |
| Meaningful page title                              | 2.4.2 (A)                                          | Partial             | Title is set in `index.html`                                                                                                         | Ensure each route/page sets unique, descriptive `<title>` values.                                           |
| Focus visible                                      | 2.4.7 (AA)                                         | Partial             | Many components include focus rings                                                                                                  | Standardize `:focus-visible` across all controls and verify contrast in both themes.                        |
| Name/Role/Value for controls                       | 4.1.2 (A)                                          | Partial             | Many controls use `aria-label`; icons often hidden                                                                                   | Fix menu semantics and modal semantics so roles/states are correctly exposed.                               |
| Form labels and instructions                       | 3.3.2 (A)                                          | Partial             | Login fields have labels                                                                                                             | Ensure all forms across app have explicit labels, clear required indicators, and helper text where needed.  |
| Error identification / messaging                   | 3.3.1 (A), 3.3.3 (AA)                              | Partial             | Login shows visible error text                                                                                                       | Connect errors programmatically (`aria-invalid`, `aria-describedby`) and add suggestion text consistently.  |
| Status messages announced to assistive tech        | 4.1.3 (AA)                                         | Partial             | Toast uses `role="alert"`                                                                                                            | Add consistent live-region strategy for async updates (loading/success/filter results).                     |
| Reflow / responsive at 320px                       | 1.4.10 (AA)                                        | Partial             | Auth containers updated to responsive `w-full max-w-lg`                                                                              | Complete full-page reflow verification at 320px and 400% zoom across all core flows.                        |
| Use of color not sole cue                          | 1.4.1 (A)                                          | Partial             | Some badges include text                                                                                                             | Verify all state indicators include text/icon shape not just color.                                         |
| Contrast minimum                                   | 1.4.3 (AA)                                         | Partial             | Mixed light/dark palettes                                                                                                            | Run formal contrast checks and adjust low-contrast text/border/focus styles.                                |
| Non-text contrast (UI components)                  | 1.4.11 (AA)                                        | Partial             | Focus rings and borders present in places                                                                                            | Verify all interactive component states meet 3:1 contrast.                                                  |
| Resize text up to 200%                             | 1.4.4 (AA)                                         | Partial             | Relative units used in many places                                                                                                   | Validate no clipping/overlap at 200% zoom across key flows.                                                 |
| Reduced motion support                             | 2.2.2, 2.3.3 advisory + UX expectation             | Implemented/Partial | `prefers-reduced-motion` media query exists in `index.css`                                                                           | Ensure JS-driven smooth scrolling/animations respect reduced motion preference.                             |
| Dialog accessibility                               | 1.3.1 (A), 2.4.3 (A), 4.1.2 (A)                    | Implemented         | Accessible dialog pattern applied across `QuickAddModal`, `NotificationsModal`, `OnboardingModal`, `PremiumFeatures`, `CreateCollectionModal`, `AddRecipeModal`, `MealPlanningCalendar` modal, and `CookingVideos` modal | Run manual keyboard and screen-reader regression testing to validate behavior with assistive technologies.   |
| Accessibility statement + feedback channel         | Legal process requirement (jurisdiction dependent) | Implemented         | Added `docs/ACCESSIBILITY_STATEMENT.md` and linked it from `Footer` for in-app visibility                                           | Review statement quarterly and keep known limitations/current status in sync with audit evidence.           |
| Accessibility testing process (manual + automated) | Legal risk control / governance                    | Partial             | Lighthouse CI now has two enforced profiles: public routes (`lighthouserc.json`) and authenticated routes with scripted session seeding (`lighthouserc.auth.json`), and both profiles are currently passing at `minScore: 1.00` | Add manual keyboard/screen-reader QA checklist and keep expanding authenticated/modal-state coverage. |

## Highest-Risk Gaps (Do First)

1. **Programmatic form-error linking** (`aria-invalid`, `aria-describedby`) in all key forms.
2. **Route-level page title coverage** for all views.
3. **Manual assistive-tech regression cadence** (screen reader + keyboard) per release.
4. **Contrast verification and token hardening** across future UI additions.
5. **Expand authenticated CI to modal-triggered states and deeper user journeys**.

## Implementation Backlog With Status

| Task                                                                     | Priority | Status      | Owner             | Notes                                                                                                                        |
| ------------------------------------------------------------------------ | -------- | ----------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Add semantic accessible dialog pattern (all modals)                      | P0       | Done        | Frontend          | Implemented across all currently identified modal/dialog components in `src/components`                                      |
| Add `id="main-content"` to main landmark                                 | P0       | Done        | Frontend          | Implemented in `MainLayout` for skip-link functionality                                                                      |
| Replace fixed auth min width with responsive sizing                      | P0       | Done        | Frontend          | Auth containers changed to responsive `w-full max-w-lg`; full viewport/zoom QA still recommended                             |
| Add route-specific document titles                                       | P1       | Not started | Frontend          | Use existing helmet setup                                                                                                    |
| Add programmatic form error linking (`aria-invalid`, `aria-describedby`) | P1       | Not started | Frontend          | Start with login/signup and high-use forms                                                                                   |
| Run contrast audit and patch design tokens/styles                        | P1       | Not started | Design + Frontend | Validate both light and dark themes                                                                                          |
| Create `docs/ACCESSIBILITY_STATEMENT.md`                                 | P1       | Done        | Product/Legal     | Statement published and linked in footer for user access                                                                     |
| Add a11y CI checks (axe/lighthouse)                                      | P1       | Done        | DevOps + Frontend | Public + authenticated Lighthouse CI profiles are enforced at `error`/`minScore: 1.00` and currently passing |
| Add keyboard + screen reader manual QA checklist                         | P2       | Not started | QA                | Attach to release checklist                                                                                                  |
| Add periodic re-audit cadence (quarterly)                                | P2       | Not started | Product/QA        | Track remediation progress over time                                                                                         |

## Verification Performed

- ESLint baseline: `npm run lint` (passes)
- Manual code review focus areas:
  - Landmarks/navigation/skip links
  - Form labels and errors
  - Modal semantics/focus behavior
  - Motion/reflow responsive patterns

## Notes

- This report is based on repository code review and lint checks, not full browser + assistive technology test execution.
- For legal defensibility, run manual audits with keyboard-only, NVDA/JAWS/VoiceOver, and mobile screen readers, then attach evidence to this document.
