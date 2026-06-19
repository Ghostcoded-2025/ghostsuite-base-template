# FastAPI backend

Minimal **FastAPI** starter under `api/` — deployable to [FastAPI Cloud](https://fastapicloud.com) alongside the Vue frontend at the repo root.

## Layout

| Path | Role |
| --- | --- |
| `api/pyproject.toml` | Dependencies, `requires-python`, **`[tool.fastapi] entrypoint`** |
| `api/app/main.py` | `app` instance, CORS, router includes |
| `api/app/config.py` | Pydantic Settings (`APP_NAME`, `CORS_ORIGINS`, optional Supabase secrets) |
| `api/app/routers/health.py` | `GET /health` liveness probe |

## Local development

From `api/` (Python **3.12+**):

```bash
python3.12 -m venv .venv
source .venv/bin/activate
pip install .
cp .env.example .env
fastapi dev
```

`fastapi dev` uses the entrypoint in `pyproject.toml` — no file path argument needed.

## FastAPI Cloud

1. Ensure `fastapi[standard]` is installed (already in `pyproject.toml`).
2. `requires-python = ">=3.12"` is set for the build.
3. Entrypoint: `app.main:app` via `[tool.fastapi]`.
4. Authenticate: `fastapi login`.
5. Deploy from `api/`: `fastapi deploy`.
6. Set environment variables in the FastAPI Cloud dashboard (or import from `.env`). Mark secrets (e.g. `SUPABASE_SERVICE_ROLE_KEY`) as **secret** at creation time.

Optional: add `.fastapicloudignore` in `api/` to exclude paths from upload (same syntax as `.gitignore`; takes precedence over `.gitignore`).

## Extending

- Add routers under `api/app/routers/` and `app.include_router(...)` in `main.py`.
- Read config through `app.config.settings` or inject `get_settings()` as a FastAPI dependency.
- Browser calls from the Vite app: set `CORS_ORIGINS` to your dev and production frontend URLs.

## Frontend integration

The Vue app does **not** call this API yet. When you add endpoints, create a `src/lib/api.ts` (or similar) and point it at `VITE_API_URL` — add that env var to `.env.example` at the repo root in the same change.
