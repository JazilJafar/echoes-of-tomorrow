# Echoes of Tomorrow

> Small signals. Connected intelligence. Better tomorrows.

Echoes of Tomorrow is a community early-warning and intelligence platform. Residents submit small observations — a blocked drain, a broken streetlight, repeated waste — and the product helps connect those signals into explainable, preventive next steps.

## What is included

- Responsive civic-intelligence dashboard with evidence-oriented metrics.
- Demonstration dataset of 16 clearly fictional observations.
- Interactive Leaflet / OpenStreetMap community map.
- Observation submission workflow with validation and in-memory demo storage for the session.
- Pattern discovery interface with transparent local fallback analysis.
- Risk insights that distinguish potential concerns from verified findings.
- Observation archive, filters, empty states, and mobile navigation.
- Gemini-ready and Supabase-ready environment variable template.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Build for production with `npm run build`.

## AI and data disclosure

The demo intentionally uses a transparent local analysis fallback when no Gemini server endpoint is configured. The fallback connects observations using category, keywords, proximity, and timing; it does not pretend to be a live model. In a production deployment, call Gemini from a secure server-side endpoint, store structured analysis separately from observations, and show evidence alongside every hypothesis.

`GEMINI_API_KEY` must never be exposed in frontend code. Supabase credentials should be supplied through environment variables and Row Level Security should protect private user data. The current standalone demo keeps data in memory and uses fictional observations, so it is safe to explore without credentials.

## Production next steps

1. Add a server-side Gemini route that returns validated structured JSON.
2. Connect Supabase Auth, Storage, and tables for observations, profiles, and analyses.
3. Add moderation and verification workflows before surfacing public reports.
4. Add consent, retention, privacy, and location-precision policies.

## Limitations

Risk scores and pattern confidence are explainable estimates, not scientifically validated predictions. A potential relationship must be verified by community members or relevant authorities before action. The demo map uses fictional coordinates labelled as demonstration data.
