Space Shooter backend for global reset

This simple Express backend provides a `/reset` endpoint used by the game's admin panel to trigger a global reset across clients.

Endpoints
- GET /reset -> returns { resetTS }
- POST /reset -> updates resetTS to current server time and returns { resetTS }
  - If `RESET_TOKEN` environment variable is set, POST requires header `x-reset-token: <token>` or body `{ token: <token> }`.

Run locally
1. cd backend
2. npm install
3. node index.js

Deploy on Railway
- Create a new Railway project
- Add repository or push code
- Set environment variable `RESET_TOKEN` (optional) in Railway secrets
- Deploy; set service port to default (Railway provides PORT env var)
- Copy deployment URL and paste into game admin `Global Reset URL` (use full URL e.g. `https://your-service.up.railway.app/reset`)
