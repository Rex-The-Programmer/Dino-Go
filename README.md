# Dino Go | ARK: Survival Evolved Taming Reference

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-Usage.md)

> Built with AI assistance (Claude) across backend scaffolding, bug review, frontend debugging, and the taming calculator's formula work; see [AI-Usage.md](AI-Usage.md) for the full log.

**Repo:** https://github.com/Rex-The-Programmer/Dino-Go
**Live:** _not yet deployed — add your Vercel/Railway URLs here once live_

---

## 1. Overview

Dino Go is a taming reference app for *ARK: Survival Evolved*, modeled structurally on Dododex. It lets a player look up a dinosaur and see its taming method, preferred food, knockout weapon, spawn location, and a live taming-effectiveness calculator before heading out to tame it — a personal coursework project covering 18 common dinosaurs.

**Core philosophy:** *A focused lookup, not a wiki crawl.* Search and filter by diet instead of scrolling walls of text.

Technologies: React + Vite, React Router, CSS Modules, Node.js + Express, PostgreSQL (hosted on Supabase).

---

## 2. Setup and installation

### Prerequisites

- Node.js 18+
- A free [Supabase](https://supabase.com) account (hosted Postgres, no local install needed)
- Git

### 2.1 Get the code

```bash
git clone https://github.com/Rex-The-Programmer/Dino-Go.git
cd Dino-Go
```

### 2.2 Install dependencies

Backend (repo root):
```bash
npm install
```

Frontend:
```bash
cd client
npm install
```

### 2.3 Environment and configuration

Backend `.env` (repo root):

| Variable | Required | Example value | Notes |
|---|---|---|---|
| `DATABASE_URL` | Yes | `postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres` | Use Supabase's **Session pooler** string, not the direct connection — the direct string is IPv6-only and many networks can't route it. URL-encode special characters in your password (`@` → `%40`). |
| `PORT` | No | `3000` | Falls back to 3000 if unset. |

Frontend `client/.env`:

| Variable | Required | Example value | Notes |
|---|---|---|---|
| `VITE_API_URL` | No | `http://localhost:3000` | Falls back to `localhost:3000` if unset. Set this to your deployed backend's URL in production. |

`.env` is git-ignored in both locations — never commit real credentials.

### 2.4 Set up the database

Run these in the Supabase SQL Editor, **in this order**:

1. `db/schema.sql` — creates `dinos` and `favorites`
2. `db/seed.sql` — loads all 18 dinos with real ARK: Survival Evolved taming data
3. `db/add_spawn_location.sql` then `db/update_spawn_locations.sql` — adds and populates spawn locations
4. `db/add_taming_calc.sql` then `db/update_taming_constants.sql` — adds taming-calculator columns and per-dino constants
5. `db/add_rex_foods.sql`, `db/add_foods_all.sql`, `db/add_estimated_foods.sql` — populates the `taming_foods` table
6. `db/update_image_urls.sql` — points `image_url` at local image files (requires the actual image files to exist first — see Known Issues)

If your database already has the old *placeholder* seed data in it, use `db/update_seed_with_real_data.sql` instead of re-running `seed.sql` — re-inserting would violate the `UNIQUE(name)` constraint.

---

## 3. How to run it

Backend:
```bash
npm start
```
```
Dino Go server running on http://localhost:3000
```

Frontend (second terminal):
```bash
cd client
npm run dev
```

Open http://localhost:5173. Confirm the backend separately at `http://localhost:3000/health` → `{"status":"ok"}`.

---

## 4. Features and usage

Primary flow: **Dino List → search/filter → Dino Detail (taming info + calculator) → Favorite it → find it again on Favorites.**

- **Dino List (`/`):** search by name, filter by diet (All / Carnivore / Herbivore / Omnivore) — both combine correctly, confirmed against live data (18 total → 10 carnivore + 7 herbivore + 1 omnivore).
- **Dino Detail (`/dino/:id`):** taming method, knockout weapon, preferred food, torpor drain, base stats, spawn location (general biome — see Known Issues), and a Dododex-style **taming calculator**: level input (default 150), taming speed, a Sanguine Elixir checkbox, and a top-3 food table showing fed/max, time, and effectiveness with bonus levels.
- **Favorites (`/favorites`):** star any dino from the List or Detail page — persisted to Postgres via the real `favorites` table, not just local state.
- **About (`/about`):** static project info.

### Main API endpoints

| Method | Path | What it does |
|---|---|---|
| GET | `/health` | Basic liveness check |
| GET | `/api/dinos?search=&diet=` | List dinos; `search` and `diet` combine with AND |
| GET | `/api/dinos/:id` | Full dino detail, including its `foods` array for the taming calculator; `404` if not found |
| GET | `/api/favorites` | List favorited dinos, joined against `dinos` |
| POST | `/api/favorites/:dinoId` | Add a favorite; `409` if already favorited, `404` if the dino doesn't exist |
| DELETE | `/api/favorites/:dinoId` | Remove a favorite; `404` if it wasn't favorited |

---

## 5. Project structure

```
Dino-Go/
  db/
    schema.sql, seed.sql, update_seed_with_real_data.sql
    add_spawn_location.sql, update_spawn_locations.sql
    add_taming_calc.sql, update_taming_constants.sql
    add_rex_foods.sql, add_foods_all.sql, add_estimated_foods.sql
    update_image_urls.sql
  routes/
    dinos.js       # GET / , GET /:id (+ taming_foods join)
    favorites.js    # GET / , POST /:dinoId , DELETE /:dinoId
  db.js             # Postgres pool, Supabase session pooler + SSL
  server.js         # Express app entry
  client/
    src/
      api/
        dinos.js, favorites.js
      components/
        atoms/       # Button, StarIcon, DietTag
        molecules/   # SearchBar, FilterChips, DinoCard
        organisms/   # Header, DinoGrid, TamingCalculator
      pages/
        DinoListPage.jsx, DinoDetailPage.jsx, FavoritesPage.jsx, AboutPage.jsx
      utils/
        tamingCalc.js   # pure taming-effectiveness calculation logic
      App.jsx
```

---

## 6. Screenshots

> Captured during local development, before the final color-token fixes were applied — see Known Issues.

![Dino List — all 18](screenshots/01-dino-list-all-18.jpg)
*All 18 dinosaurs, no filter applied.*

![Dino List — carnivore filter](screenshots/02-dino-list-carnivore-filter-10.jpg)
*Carnivore filter — 10 dinosaurs.*

![Dino List — herbivore filter](screenshots/03-dino-list-herbivore-filter-7.jpg)
*Herbivore filter — 7 dinosaurs.*

![Dino List — omnivore filter](screenshots/04-dino-list-omnivore-filter-1.jpg)
*Omnivore filter — 1 dinosaur (Therizinosaurus).*

---

## 7. Known issues and next steps

- **Diet validation is still backwards in `routes/dinos.js`.** `if (!!VALID_DIETS.includes(diet))` returns `400` for *valid* diets and lets invalid ones through — confirmed still live by diffing the actual commit. One-line fix: drop one `!`.
- Hero heading and filter-button text render in a near-invisible color — likely a shared `tokens.css` token, not yet fixed.
- 11 of 18 dinos' taming-calculator food data is flagged `estimated = true` — not yet individually verified against Dododex.
- 4 dinos (Megalodon, Beelzebufo, Achatina, Castoroides) have placeholder taming-calculator foods by request — need real values.
- The `4.15` taming-effectiveness scale constant was fitted against Rex and Trike, not sourced from an in-game name — worth re-checking as more dinos get verified.
- Sanguine Elixir's ×1.3 taming boost has never been checked against Dododex directly.
- Spawn location data is general-biome-level (the official wiki shows this as a heatmap image, not text) — coarser than the rest of the dataset.
- Not yet deployed. See the Vercel (frontend) + Railway (backend) deployment notes for the planned setup.

---

## License

Coursework project — no license specified.
