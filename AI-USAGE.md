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
- **Date / Tool:** Sept 25, 2026 — Claude
- **What I asked:** Implementation for the favorites routes beyond the `501` stubs.
- **What it gave back:** Full `GET /api/favorites` (joined against `dinos`), `POST /api/favorites/:dinoId` (with a `409` on duplicate favorite), `DELETE /api/favorites/:dinoId` (with `404` on a favorite that doesn't exist).
- **What I kept / changed / why:** The implementation was committed as described. The Git history does not record any separate edits to this implementation.
- **Commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/ccbb3f8566312092ca11e604f35002318f37f2c6 ("favorites get, post and delete done").

### Entry 4 — Dino Detail page
- **Date / Tool:** Oct 2, 2026 — Claude
- **What I asked:** Built the `/dino/:id` page — fetch by id, taming info panel, stats panel.
- **What it gave back:** `DinoDetailPage.jsx` using `useParams`, loading/error/not-found states, field names matched against the actual backend response shape.
- **What I kept / changed / why:** The page was committed as described. The Git history does not record any separate edits to this implementation.
- **Commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/ac68846bb3678e9170f4dd9f420ff17a81499136 ("Added DinoDetailPage")

### Entry 5 — Favorites page
- **Date / Tool:** Oct 2, 2026 — Claude
- **What I asked:** Built the `/favorites` page.
- **What it gave back:** `FavoritesPage.jsx`, reusing `DinoGrid` rather than duplicating it — made `DinoGrid`'s empty-state message configurable via props so it could say "No favorites yet" instead of the List page's search-specific wording, without breaking the List page's existing usage.
- **What I kept / changed / why:** The page was committed as described. The Git history does not record any separate edits to this implementation.
- **Commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/d2376be8d6c1dd69e1db89859c7cad9bc35bcbb3 ("Added Favorites page")

---

## 2. Where the AI Got It Wrong

### Wrong #1 — Claimed taming-calculator constants could be read off Dododex
- **What it gave me:** Early guidance suggesting the per-dino affinity constants (`affinity_needed`, `affinity_per_level`, etc.) could be read directly from Dododex.
- **What was wrong:** Dododex only displays calculated *results* (times, percentages), not the underlying constants. This sent the build in the wrong direction initially.
- **What I did instead:** Sourced the real constants from ARK Smart Breeding's open `values.json`, and food affinities from the ARK wiki.
- **Related implementation commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/fae372b7977536a488ccae6f35624c36a2ee16a9

### Wrong #2 — Wrong taming-effectiveness formula
- **What it gave me:** An initial effectiveness formula where the total effectiveness lost stayed the same regardless of how many foods were fed.
- **What was wrong:** This contradicted Dododex's actual behavior — effectiveness loss compounds with each food fed, it doesn't stay flat. Verifying against real Dododex numbers for Rex and Trike exposed the mismatch.
- **What I did instead:** Replaced it with a per-food multiplicative model (`TE *= 1 − ineffectiveness / affinity_per_food`), fitted against Rex and validated against Trike.
- **Correction commit:** https://github.com/Rex-The-Programmer/Dino-Go/commit/eaf21e6a84d4015a9b8ce9ef579ff5d89914ca84

---

## 3. Who Wrote What

### Work I wrote myself

I wrote `dino.js`, `favorites.js`, and `server.js` in the routes folder. I also created and managed the project's database in Supabase.

### AI-assisted code I understand best

The part of `routes/dinos.js` I understand best is the combined search and diet-filter query. I wrote the route's first draft, and Claude reviewed it and pointed out bugs that I fixed. The route adds a parameterized SQL condition for each selected filter, joins the conditions with `AND`, and orders the matching dinos by name. This means a search and diet filter can be applied together, while query values are passed separately instead of being inserted into the SQL string.
