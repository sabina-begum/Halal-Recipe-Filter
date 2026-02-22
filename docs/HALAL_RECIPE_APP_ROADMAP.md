# Halal Recipe App — Feature Roadmap & Step-by-Step Guide

This document outlines all features and steps to turn your Recipe App into a **halal-focused recipe filter app** safely and incrementally. Each phase can be done in order; you can pause or adjust scope at any phase.

---

## Current State (What You Already Have)

| Area                 | Location                                                | Notes                                                                         |
| -------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Halal detection      | `src/utils/halal.ts`                                    | `isHalal(recipe)`, `isNonHalalIngredient(ingredient)`, `NON_HALAL_TERMS` list |
| Halal filter         | `src/App.tsx`, `src/features/recipes/AZRecipesPage.tsx` | API meals filtered by `isHalal()` before display                              |
| Leftover suggestions | `src/components/LeftoverIntegration.tsx`                | Uses `isHalal` and `isNonHalalIngredient` for suggestions                     |
| Dietary options      | `src/data/dietaryOptions.ts`                            | "Halal" already in list                                                       |
| Copy                 | `MainLayout.tsx`, `PageHeader.tsx`, `Home.tsx`          | "Discover Halal-Friendly Recipes" etc.                                        |
| Tests                | `src/utils/__tests__/halal.test.ts`                     | Tests for `isHalal` and `isNonHalalIngredient`                                |

**Do not remove or rewrite these.** The roadmap builds on them.

---

## Phase 0: Prep & Safety (Do First)

### 0.1 Backup and branch

- [ ] Commit all current work.
- [ ] Create a branch, e.g. `feature/halal-recipe-app`, so you can revert safely.

### 0.2 Document your “halal rules” (no code yet)

- [ ] Decide what you consider halal for the app (e.g. no pork/pork derivatives, no alcohol, no gelatin unless plant-based).
- [ ] Write a short **Halal Policy** (1–2 paragraphs) for an eventual “About Halal” or “How we classify recipes” page. You’ll use this in Phase 4.

### 0.3 Optional: feature flag

- [ ] If you want to ship halal-only UI behind a flag, add something like `VITE_HALAL_APP=true` in `.env` and read it in one place (e.g. a small `src/config/app.ts`). You can show/hide halal-specific nav or copy based on this. Skip if you’re all-in on halal from the start.

---

## Phase 1: Strengthen Halal Data & Logic

**Goal:** More accurate and transparent halal detection without changing UI flow.

### 1.1 Expand non-halal term list

- **File:** `src/utils/halal.ts`
- [ ] Add terms you’re comfortable with, e.g.:
  - Gelatin (unless you later add “plant-based gelatin” as allowed)
  - Common E-numbers or additive names that are often non-halal (optional; can be Phase 2).
- [ ] Keep the list in one place (e.g. `NON_HALAL_TERMS` or a small `getNonHalalTerms()`).
- [ ] Run `src/utils/__tests__/halal.test.ts` and add tests for any new terms.

### 1.2 “Questionable” / grey-area ingredients (optional but recommended)

- **File:** `src/utils/halal.ts`
- [ ] Add a second list, e.g. `QUESTIONABLE_TERMS` (e.g. "gelatin", "vanilla extract" if you want to flag alcohol-based extract).
- [ ] Add a function, e.g. `getHalalStatus(recipe): 'halal' | 'questionable' | 'non-halal'` that:
  - Returns `'non-halal'` if any `NON_HALAL_TERMS` match.
  - Returns `'questionable'` if any `QUESTIONABLE_TERMS` match and none non-halal.
  - Returns `'halal'` otherwise.
- [ ] Keep `isHalal(recipe)` working as now (e.g. `true` only for `'halal'`, or `true` for both `'halal'` and `'questionable'` depending on your policy). Document the behavior in a short comment.

### 1.3 Expose status on recipe (for UI later)

- **Files:** `src/global.d.ts` (optional), any place you pass recipe to UI.
- [ ] You don’t have to add a field to the API type; you can compute status when displaying. Optionally add a derived type or a small helper that returns `{ recipe, halalStatus: 'halal' | 'questionable' | 'non-halal' }` for a recipe so the UI can show a badge or tooltip in Phase 2.

---

## Phase 2: Halal-First UI (Filter, Badges, Copy)

**Goal:** Users clearly see that the app is halal-oriented and which recipes are halal/questionable.

### 2.1 Recipe list: halal-only toggle or default

- **Files:** `src/App.tsx`, `src/features/recipes/AZRecipesPage.tsx`
- [ ] Current behavior: you already filter by `isHalal(meal)`. Decide:
  - **Option A:** Keep “halal only” as the only mode (no toggle).
  - **Option B:** Add a setting or toggle “Show only halal recipes” (default on) and persist in `localStorage` so users can turn it off if they want to see all.
- [ ] Ensure featured/random recipe on home is always halal when “halal only” is on (you already set `selected` only when `isHalal(meal)` in `App.tsx`; double-check home hero uses that `selected`).

### 2.2 Halal badge on cards and detail

- **Files:** `src/features/recipes/RecipeCard.tsx`, `src/features/recipes/RecipeDetailsSection.tsx` (or wherever you show one recipe).
- [ ] Use your `getHalalStatus(recipe)` or `isHalal(recipe)` (and optional `questionable`) to show:
  - A small “Halal” badge (e.g. green) when status is halal.
  - Optional “Check ingredients” or “Questionable” badge when status is questionable (if you added that).
- [ ] Do **not** show a “Non-halal” badge on recipe cards if you’re already filtering them out; only if you add Option B (show all) in 2.1.

### 2.3 Ingredient-level warnings on recipe detail

- **File:** Where you render ingredients (e.g. `src/components/Ingredients.tsx` or inside `RecipeDetailsSection`).
- [ ] For each ingredient, if `isNonHalalIngredient(ingredient)` is true, show a small warning (e.g. icon + “Not halal” or “Contains alcohol/pork”). This protects you in case a recipe slips through or is user-submitted.
- [ ] If you have “questionable” ingredients, show a softer line (e.g. “Verify: gelatin”) with a short tooltip or link to “How we classify recipes”.

### 2.4 Copy and nav

- **Files:** `src/components/Navbar.tsx`, `MainLayout.tsx`, `PageHeader.tsx`, `About.tsx`, meta tags in `HeadManager.tsx` or similar.
- [ ] Update tagline/headings to something like “Halal Recipe Finder” or “Smart Halal Recipes” so it’s clear the app is halal-focused.
- [ ] Add one nav or footer link: “Halal” or “About Halal” that will point to the page you add in Phase 4.

---

## Phase 3: Halal-Specific Features

**Goal:** Add features that make the app clearly more than “generic app + halal filter”.

### 3.1 Halal filter on search/advanced search

- **File:** `src/components/AdvancedSearch.tsx`
- [ ] Ensure “Halal” in dietary filters actually applies your `isHalal(recipe)` (or `getHalalStatus(recipe) === 'halal'`) to results, not just a tag. If it’s only a tag today, wire the filter to your halal util.

### 3.2 “Halal recipes” or “Browse halal” entry point

- **Files:** `src/components/MainRoutes.tsx`, navbar/home.
- [ ] Add a route, e.g. `/halal` or `/recipes/halal`, that shows a list of recipes that pass `isHalal` (and optionally “questionable” with a note). Reuse your existing recipe list/card components.
- [ ] Add a link in the navbar or home “Quick access” so users can go straight to “Halal recipes”.

### 3.3 User profile: halal preference

- **Files:** `src/components/UserProfile` (or `DietaryRestrictionsSection`), profile data type in `src/global.d.ts` if you store restrictions.
- [ ] Ensure “Halal” is a prominent option in dietary restrictions (it’s already in `dietaryOptions`). If you have “default view = halal only”, consider saving “Prefer halal only” in profile so you can respect it everywhere (search, recommendations, meal plan).

### 3.4 Favorites, collections, meal plan

- **Files:** Favorites, RecipeCollections, MealPlanningCalendar.
- [ ] When showing lists, respect the “halal only” default if you have it (e.g. don’t show non-halal recipes in “My meal plan” if user preference is halal-only). If you don’t store non-halal recipes at all, no change needed.

### 3.5 Substitutions and leftovers

- **File:** `src/components/LeftoverIntegration.tsx`, `src/components/AISubstitutions.tsx` (if present).
- [ ] You already filter by `isHalal` and `isNonHalalIngredient` in LeftoverIntegration. Ensure AISubstitutions (or any suggestion engine) never suggests non-halal ingredients when the recipe is halal; use `isNonHalalIngredient` in suggestion logic.

---

## Phase 4: Trust & Transparency

**Goal:** Users understand how you classify recipes and what “halal” means in your app.

### 4.1 “About Halal” / “How we classify recipes” page

- **New file:** e.g. `src/components/AboutHalal.tsx` or `src/features/halal/AboutHalal.tsx`.
- [ ] Content: your short Halal Policy (from Phase 0), e.g.:
  - We consider a recipe halal if it contains no pork/pork derivatives and no alcohol.
  - We flag “questionable” when we detect ingredients like gelatin; we recommend you verify with your own standards.
  - List is not exhaustive; when in doubt, check ingredients and your scholar.
- [ ] Add a link to your term list (or a summarized list) so power users can see what you block.
- [ ] Route: e.g. `/about-halal` in `MainRoutes.tsx`, link from footer and from “Halal” in nav.

### 4.2 Disclaimer on user-submitted recipes

- **File:** `src/components/UserRecipeSubmission.tsx`
- [ ] Add a line: “Recipes you submit will be checked for obvious non-halal ingredients, but you are responsible for ensuring the recipe meets your halal standards.”

### 4.3 Optional: “Report” or “Wrong classification”

- [ ] Later you can add a “Report” or “Not halal” button on recipe detail that sends feedback (e.g. to Firestore or email). Not required for the first version.

---

## Phase 5: Content & Discovery (Optional)

**Goal:** Feel more like a halal recipe hub than a generic app with a filter.

### 5.1 Featured recipes

- **File:** `src/data/recipes.ts` (featured recipes).
- [ ] Audit each featured recipe with `isHalal` (and your questionable logic). Remove or replace any that aren’t halal (or mark them so they don’t show when “halal only” is on).
- [ ] Add 2–3 featured recipes that are clearly “halal-friendly” or from cuisines your audience cares about (e.g. South Asian, Middle Eastern, or “Western halal”).

### 5.2 Categories or tags

- **Files:** Categories/tags data, `CategoriesPage.tsx`.
- [ ] Add categories or tags like “Halal-friendly”, “No alcohol”, “Quick halal”, or by region (e.g. “Middle Eastern”, “South Asian”) so users can browse by theme.

### 5.3 Notifications and recommendations

- **File:** `src/components/SmartNotifications.tsx`, recommendation logic.
- [ ] Ensure in-app notifications and “recommended for you” only suggest halal recipes when user preference is halal (or by default).

---

## Phase 6: Polish & Launch

### 6.1 SEO and meta

- **File:** Meta tags, `HeadManager.tsx`, any `RecipeMetaHelmet.tsx`.
- [ ] Set default title/description to include “Halal recipes” or “Halal recipe finder”.
- [ ] For recipe pages, consider adding structured data (JSON-LD) with a property that indicates the recipe is halal (if you have a standard way to express it).

### 6.2 Accessibility and wording

- [ ] Ensure “Halal” badge has an accessible label (e.g. “Halal recipe” or “Classified as halal by ingredient check”).
- [ ] Avoid implying religious certification unless you actually have one; prefer “Halal-friendly” or “Checked for common non-halal ingredients” in public copy.

### 6.3 Final checks

- [ ] Run full app: home, search, advanced search, recipe detail, favorites, meal plan, submit recipe.
- [ ] Run tests: `npm test` (including `halal.test.ts`).
- [ ] Read through `HALAL_RECIPE_APP_ROADMAP.md` and tick off completed steps.

---

## File Checklist (Quick Reference)

| Step                                           | File(s)                                                             |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| Expand terms, add questionable, getHalalStatus | `src/utils/halal.ts`                                                |
| Halal tests                                    | `src/utils/__tests__/halal.test.ts`                                 |
| Default “halal only” / toggle                  | `src/App.tsx`, `src/features/recipes/AZRecipesPage.tsx`             |
| Badges on card & detail                        | `RecipeCard.tsx`, `RecipeDetailsSection.tsx`                        |
| Ingredient warnings                            | `Ingredients.tsx` or recipe detail                                  |
| Copy & nav                                     | `Navbar.tsx`, `MainLayout.tsx`, `PageHeader.tsx`, `HeadManager.tsx` |
| Search filter                                  | `AdvancedSearch.tsx`                                                |
| Route /halal                                   | `MainRoutes.tsx`, new page or reuse list                            |
| Profile halal preference                       | `UserProfile` / `DietaryRestrictionsSection`                        |
| About Halal page                               | New `AboutHalal.tsx`, `MainRoutes.tsx`                              |
| Submit recipe disclaimer                       | `UserRecipeSubmission.tsx`                                          |
| Featured recipes audit                         | `src/data/recipes.ts`                                               |
| Notifications/recommendations                  | `SmartNotifications.tsx`, recommendation logic                      |

---

## Summary: Recommended Order

1. **Phase 0** — Branch, policy note, optional feature flag.
2. **Phase 1** — Improve `halal.ts` (terms, optional questionable status, tests).
3. **Phase 2** — Badges, ingredient warnings, copy/nav (halal-first UI).
4. **Phase 3** — Halal route, search filter, profile preference, favorites/meal plan/leftovers.
5. **Phase 4** — About Halal page, submit-recipe disclaimer.
6. **Phase 5** — Featured recipes, categories/tags, notifications (optional).
7. **Phase 6** — SEO, a11y, final test and launch.

You can stop after Phase 2 for a “minimal halal app”, or after Phase 4 for a “trustworthy halal app”. Phases 5 and 6 make it feel more complete and discoverable.
