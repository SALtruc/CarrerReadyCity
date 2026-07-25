# Results → Google Sheets

`api/submit-result.js` validates and forwards each finished playthrough (SID, profile
info, and Holland scores) to a Google Apps Script web app, which appends a row to a
Sheet. This mirrors the pattern already used in
[CarrerReadyRMIT-Roadmap](https://github.com/SALtruc/CarrerReadyRMIT-Roadmap)'s
`api/unlock.js`, so the same Google account / Sheet setup flow applies.

## One-time setup

1. Create (or open) the Google Sheet you want results saved to. Add a tab named
   exactly `Results` (the API returns `missing_sheet` if it can't find this tab).
2. In the Sheet, open **Extensions → Apps Script**, delete the boilerplate, and paste
   in [`submit-result.gs`](./submit-result.gs).
3. In the Apps Script editor, open **Project Settings → Script Properties** and add a
   property named `INGEST_SECRET` with a long random value. This must match
   `APPS_SCRIPT_SECRET` in Vercel (step 5).
4. Click **Deploy → New deployment → Web app**. Set "Execute as" to yourself and
   "Who has access" to **Anyone**. Deploy, and copy the `/exec` URL.
5. In the Vercel project for this app, set these environment variables:
   - `APPS_SCRIPT_URL` — the `/exec` URL from step 4.
   - `APPS_SCRIPT_SECRET` — the same value as `INGEST_SECRET` from step 3.
   - `ALLOWED_ORIGINS` — leave blank if the frontend is served from the same Vercel
     project; otherwise a comma-separated list of origins allowed to call the API.

Redeploy the Vercel project after setting the env vars. Local development never calls
this API — the frontend auto-bypasses it on `localhost`/`file://`
(`src/config/runtime.ts`).

## Payload written per row

`submittedAt, sid, year, program, accessCode, avatar, placesVisited, hollandCode,
scoreRealistic, scoreInvestigative, scoreArtistic, scoreSocial, scoreEnterprising,
scoreConventional`

Scores are recomputed server-side in `api/submit-result.js` from the raw place
answers, not trusted from the client.
