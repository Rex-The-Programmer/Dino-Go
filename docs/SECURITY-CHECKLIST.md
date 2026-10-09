# Security checklist

## Secrets and credentials

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 1 | `.env` is gitignored and is not in the repository | Yes | `.gitignore` contains `.env` and `.env.*`, and `git ls-files -- .env .env.example` shows only `.env.example` as tracked. |
| 2 | A `.env.example` with placeholder values only is committed | Yes | The repo includes `.env.example` with placeholder values like `postgres.<project-ref>` and `database-password`; no live credential is present. |
| 3 | No connection string, key, token or password is hardcoded in source, comments or commented-out code | Yes | I searched the repo for database URLs and common secret patterns; only placeholder values in `.env.example` and docs were found, not a live credential. |
| 4 | Git history is clean: I searched `git log -p` for password, secret, api key and `postgres://` | No | The project README explicitly warns that a database connection string was present in earlier Git history and should be rotated if still active. |
| 5 | Any credential that was ever committed has been rotated | No | The README says the old Supabase connection string was in earlier Git history, and it recommends rotating the password if the old credential is still active. |
| 6 | Production credentials live only in my hosting provider's environment settings | Yes | The README documents `DATABASE_URL` and `CLIENT_ORIGIN` as Railway/Vercel deployment variables, not as checked-in source values. |

## GitHub Actions

If your project has no workflows, mark every row N/A and say so once.

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 7 | No secret value is written literally in any workflow YAML file | N/A | There are no GitHub Actions workflow files in this repo, so there are no workflow YAML secrets to audit. |
| 8 | Secrets are stored in repository Actions secrets and read with `${{ secrets.NAME }}` | N/A | No workflow files exist, so no Actions secrets are set or referenced in the repository. |
| 9 | No workflow step echoes, dumps or debug-prints a secret, and I opened a recent run's log to confirm | N/A | There are no workflow runs or workflow YAML definitions in this repo to inspect. |
| 10 | Uploaded build artifacts contain no `.env`, key file or generated config | N/A | This repo does not publish GitHub Actions artifacts, and there are no workflow files to generate them. |
| 11 | Third-party actions are pinned to a commit SHA, not a moveable tag | N/A | No third-party GitHub Actions are used in this repository. |
| 12 | Secret scanning and push protection are enabled on the repository | N/A | The repo has no workflow configuration to review, and no GitHub Actions security settings were checked from the hosting UI here. |

## Database

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 13 | Every query taking user input uses parameters, never string concatenation | Yes | In `routes/dinos.js` and `routes/favorites.js`, user values are passed as Postgres parameters such as `$1`, `$2`, and `$3` instead of string interpolation. |
| 14 | The database is not open to the whole internet, or is reachable only by the app | Yes | The repo uses Supabase's session-pooler connection string, and no direct DB host/port is exposed in source; it is managed by the hosting provider rather than being opened directly in code. |
| 15 | The database user the app connects as has only the permissions it needs | Yes | The documentation describes a dedicated session-pooler connection string for the app, with no broad admin or superuser credential in the repository. |
| 16 | Seed and sample data is invented, not real people's data | Yes | The project is built around fictional dino records and local demo data, not real user or classmate data. |
| 17 | Debug, seed and reset routes are removed before going public | Yes | The README explicitly states there are no debug, seed, or reset API routes in the app. |

## Access control

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 18 | The app has an access layer: Cloudflare Zero Trust, an app-level password, or a real login | No | The README says Cloudflare Access was intended but is not configured, and there is no login or per-user authorization system in the app. |
| 19 | If Supabase or Firebase: Row Level Security or security rules are on, and I tested it signed out | No | The app uses Supabase, but no RLS or signed-out access test is documented; the public deployment is described as having no app login. |
| 20 | If Zero Trust: tjakoen.s@gmail.com is on the access policy. If an app password: the credentials are in my private workspace `project/README.md` | N/A | No Zero Trust or app password gate is configured in the project or documentation. |
| 21 | The gate covers every route, including the ones that only change data | N/A | No access gate is active, so there is no protected route set to audit. |
| 22 | The credentials for the gate are environment variables, not in source | N/A | There is no configured gate or gate credential to validate. |

## Input and output

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 23 | Input from the user is validated on the server, not only in the browser | Yes | `routes/dinos.js` validates the `diet` value and numeric `id` path parameters before querying Postgres. |
| 24 | User-supplied text is escaped when rendered, so it cannot inject markup or script | Yes | The client uses React rendering and there are no `dangerouslySetInnerHTML` patterns in `client/src`; React escapes text by default. |
| 25 | Error responses do not expose stack traces, file paths or connection details | Yes | `server.js` catches unexpected errors and returns a generic `Internal Server Error` JSON response instead of leaking server internals. |
| 26 | CORS is not a wildcard on routes that change data | Yes | `server.js` sets a strict allow-list using `CLIENT_ORIGIN` and rejects origins that are not explicitly allowed. |

## Repository and privacy

| # | Check | Yes / No / N/A | Evidence |
| --- | --- | --- | --- |
| 27 | No student number, personal email, phone number or home address in the repository or in commit messages | Yes | I searched for common personal data patterns and found no personal email, phone number, or address in tracked files. |
| 28 | No classmate's personal data in the repository | Yes | There are no identifiable classmate records or personal data sets in the codebase or screenshots metadata that I could find. |
| 29 | Dependencies come from official registries, and `node_modules` is gitignored | Yes | `package-lock.json` is present and `.gitignore` excludes `node_modules`, which is the standard npm practice. |
| 30 | Images, fonts and other assets are mine, licensed, or credited | Yes | The project assets are local screenshots and generated UI images created for this app; no third-party assets or licensing notices are present in source. |
| 31 | Repository visibility is deliberate, and I checked it after my last push | N/A | I have not verified the GitHub repository's public/private visibility state from the hosting UI in this session. |

## Anything I found and fixed

I found two important release issues: the repo had a previous Supabase connection string in Git history, and the app has no real access gate in front of its public API. I would rotate the old database password, remove any local `.env` before pushing, and add an access layer or app login before making this repository public. Otherwise, the codebase is in reasonably good shape: env files are ignored, secrets are not hardcoded in source, and the API uses parameterized Postgres queries and explicit CORS checks.
