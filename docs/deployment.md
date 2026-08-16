# Deployment

## Core-only deployment

The default application needs no database or credentials:

```bash
npm ci
npm run build
npm start
```

Daily games, practice games, and self-contained long challenge links work in this mode. `GET /api/leaderboard` reports `configured: false`; persistence-dependent writes return 503.

## Redis-backed features

Set:

```text
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
LEADERBOARD_SIGNING_SECRET
```

Use a long random signing secret in production. Never expose it with a `NEXT_PUBLIC_` prefix. Short challenges expire after seven days. Daily leaderboard keys expire after 45 days. Production deliberately has no in-process persistence fallback.

## Docker

```bash
docker build -t color-memory-engine .
docker run --rm -p 3000:3000 --env-file .env.local color-memory-engine
```

The Dockerfile uses Next.js standalone output and runs as an unprivileged user.

## Platform notes

- Set `NEXT_PUBLIC_SITE_URL` to the canonical HTTPS origin before building metadata and challenge links.
- Keep secrets only in the deployment platform's encrypted environment settings.
- Verify `/api/health` and a complete daily round after deployment.
- Verify that a Redis outage returns 503 rather than a success response.
- Do not configure secrets for fork pull-request workflows.

## Rollback

Roll back the public application to the previous tagged release. If an asset has a rights problem, remove the pack, withdraw affected release assets, and publish a patch release. If a real secret is exposed, rotate it before rewriting public history.
