# AI Usage — Dino Go

Claude (Anthropic) was used throughout this project's backend, frontend, data, and tooling work. This document is an honest account of that usage, including the parts the AI got wrong.

---

## 1. How I Used AI

### Entry 1 — Backend bug review: `routes/dinos.js`
- **Date / Tool:** Sept 25, 2026 — Claude
- **What I asked:** Reviewed my self-written `dinos.js` for correctness before testing it live.
- **What it gave back:** Flagged three bugs — a non-interpolating search pattern (single quotes instead of backticks, so `%${search.trim()}%` was being sent as a literal string), a double-negated diet validation check (`!!VALID_DIETS.includes(...)`, which rejected *valid* diets and let invalid ones through), and a mismatched catch-block variable (`catch (error)` but `console.error('...', err)`, which would throw a `ReferenceError` on any real query failure).
- **What I kept / changed / why:** I fixed the search-pattern bug and the catch-block bug. **I did not fully apply the diet-validation fix** — the live code still has `!!VALID_DIETS.includes(diet)`, which is still backwards. This needs a real follow-up fix before submission (see Section 2).
- **Commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/4848c79df02b9fa11f791a0b69351f832766fa75

### Entry 2 — Frontend white-screen debugging, App.jsx/DinoListPage.jsx rebuild
- **Date / Tool:** Oct 1, 2026 — Claude
- **What I asked:** Helped debug a white screen and reviewed/rebuilt files that had been reduced to test stubs during an earlier bisection.
- **What it gave back:** Diagnosed two empty component files (`Button.jsx`, `StarIcon.jsx` — no default export, crashing the render tree), a `.includes()` vs `.has()` bug on a `Set`, and rebuilt `App.jsx` (data fetching, `favoriteIds` state, optimistic `toggleFavorite`) and `DinoListPage.jsx` (search/diet filter state, `DinoGrid` wiring) from scratch after confirming both had been left as test stubs.
- **What I kept / changed / why:** `App.jsx` and `DinoListPage.jsx` landed essentially as given. `StarIcon.jsx` was kept with two small changes: dropped `strokeLinecap`, added `aria-hidden="true"`. `Header.jsx`'s structure (NavLink pattern, brand mark) was kept, but `Header.module.css` was written independently, not from Claude.
- **Commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/7003d4be9b66116e1ef836eab570d855dde67105

### Entry 3 — Backend: real favorites endpoints (GET/POST/DELETE)
- **Date / Tool:** — Claude
- **What I asked:** Implementation for the favorites routes beyond the `501` stubs.
- **What it gave back:** Full `GET /api/favorites` (joined against `dinos`), `POST /api/favorites/:dinoId` (with a `409` on duplicate favorite), `DELETE /api/favorites/:dinoId` (with `404` on a favorite that doesn't exist).
- **What I kept / changed / why:** 
- **Commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/ccbb3f8566312092ca11e604f35002318f37f2c6 ("favorites get, post and delete done").

### Entry 4 — Dino Detail page
- **Date / Tool:** — Claude
- **What I asked:** Built the `/dino/:id` page — fetch by id, taming info panel, stats panel.
- **What it gave back:** `DinoDetailPage.jsx` using `useParams`, loading/error/not-found states, field names matched against the actual backend response shape.
- **What I kept / changed / why:** 
- **Commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/ac68846bb3678e9170f4dd9f420ff17a81499136 ("Added DinoDetailPage")

### Entry 5 — Favorites page
- **Date / Tool:** — Claude
- **What I asked:** Built the `/favorites` page.
- **What it gave back:** `FavoritesPage.jsx`, reusing `DinoGrid` rather than duplicating it — made `DinoGrid`'s empty-state message configurable via props so it could say "No favorites yet" instead of the List page's search-specific wording, without breaking the List page's existing usage.
- **What I kept / changed / why:** 
- **Commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/d2376be8d6c1dd69e1db89859c7cad9bc35bcbb3 ("Added Favorites page")

### Entry 6 — Real ARK taming data (seed data)
- **Date / Tool:** — Claude
- **What I asked:** Research real ARK: Survival Evolved taming data (method, food, weapon, base stats) for all 18 dinos to replace placeholder values, specifically verified against Survival Evolved and not Ascended.
- **What it gave back:** `db/seed.sql` and `db/update_seed_with_real_data.sql`, every value individually checked against Dododex's version-specific stat calculator.
- **What I kept / changed / why:** 
- **Commit:** **MISSING — resolve before submitting**

---

## 2. Where the AI Got It Wrong

### Wrong #1 — Claimed taming-calculator constants could be read off Dododex
- **What it gave me:** Early guidance suggesting the per-dino affinity constants (`affinity_needed`, `affinity_per_level`, etc.) could be read directly from Dododex.
- **What was wrong:** Dododex only displays calculated *results* (times, percentages), not the underlying constants. This sent the build in the wrong direction initially.
- **What I did instead:** Sourced the real constants from ARK Smart Breeding's open `values.json`, and food affinities from the ARK wiki.
- **Commit:** 

### Wrong #2 — Wrong taming-effectiveness formula
- **What it gave me:** An initial effectiveness formula where the total effectiveness lost stayed the same regardless of how many foods were fed.
- **What was wrong:** This contradicted Dododex's actual behavior — effectiveness loss compounds with each food fed, it doesn't stay flat. Verifying against real Dododex numbers for Rex and Trike exposed the mismatch.
- **What I did instead:** Replaced it with a per-food multiplicative model (`TE *= 1 − ineffectiveness / affinity_per_food`), fitted against Rex and validated against Trike.
- **Commit:** 

### Wrong #3 — Achatina taming method misclassified
- **What it gave me:** Initial seed data classifying Achatina as a `Passive` tame.
- **What was wrong:** Achatina is actually a `Knockout` tame in ARK: Survival Evolved — it just can't fight back while being knocked out, which is a different thing from a true passive tame (like taming via proximity/feeding with no combat at all).
- **What I did instead:** Caught during a verification pass against Dododex's ASE-specific taming pages (which explicitly tag Achatina "Knockout Taming" and note it "must be tamed violently"); corrected in both `seed.sql` and the update script.
- **Commit:** **MISSING — same issue as Entry 6 above; resolve before submitting**

---

## 3. Who Wrote What

> **This section needs to be written by you, in your own words.** The rubric is explicit that this is graded on the explanation, not on who typed the code — and I can't honestly write "here's what I understand and why I built it this way" on your behalf without defeating the point of the section. What I can do is suggest strong candidates based on what I watched happen across this project:

**Strong candidates for "parts you wrote yourself":**
- The taming calculator's effectiveness formula fitting (Rex/Trike verification, the four real bugs you found and fixed independently — duplicate import, foods query outside the handler, duplicate `/:id` route, the wrong effectiveness model) — this is extensively self-documented in your own handout already.
- Your own `dinos.js` first draft (even though Claude reviewed it afterward, you wrote the original).
- Any CSS/styling work not shown in this conversation (color tokens, spacing fixes) — e.g. the "Updated the color codes and spacing of grids" commit.
- The Supabase/Railway deployment debugging (the IPv6 pooler switch, the exposed-password catch, the `/api` path-duplication fix) — this was your own troubleshooting.

**For "the one piece of AI-written code you understand best"** — pick whichever single file you could actually explain line-by-line to someone else right now without looking anything up. The combined search+diet filter query in `dinos.js` is a reasonable choice: it directly implements the proposal's flagged risk (search and diet filter needing to combine with AND, not override each other), and the logic is short enough to genuinely hold in your head.

Write both parts of this section yourself — file, commit, and the actual explanation.
