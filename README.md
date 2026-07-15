<img width="1068" height="1600" alt="WhatsApp Image 2026-07-14 at 06 36 06" src="https://github.com/user-attachments/assets/21b09d5a-c605-4c77-a307-430a90231957" /># 🌍 SAVIOR AI

**Savior AI is an environmental impact platform built as a React + Vite prototype with a Node/Express backend scaffold.**

Users can explore waste analysis, food rescue, NGO giving, and a gamified sustainability journey. The frontend shows an immersive prototype experience, while the backend scaffold includes real routes for AI-powered waste analysis, database persistence, and Firebase-authenticated user sync.

##**Live link** : https://chipper-travesseiro-8c76fa.netlify.app/
## Project description

Savior AI helps users turn everyday waste and food sharing into measurable impact. The app combines an AI-driven waste lab, a food rescue marketplace, NGO donation campaigns, a global leaderboard, and a kid-friendly Guardian mode, all wrapped in a reward and premium system.

## Architecture overview

```
            +-----------------------------+
            |        User Browser         |
            |   (React + Vite frontend)   |
            +-------------+---------------+
                          |
                          | HTTP / App routes
                          v
            +-----------------------------+
            |      Express API Server      |
            |  server/index.js + routes/   |
            +-------------+---------------+
                          |
      +-------------------+-------------------+
      |                   |                   |
      v                   v                   v
+-------------+   +----------------+   +------------------------+
|   MySQL DB  |   |  Firebase Auth |   |  OpenAI Orchestrator    |
| server/database/ | server/middleware/ | server/agents/        |
+-------------+   +----------------+   +------------------------+

```

### What the architecture means

- The frontend is a standalone demo prototype using local state and mock data.
- The backend scaffold is ready to power the app with real data storage and AI.
- The `agents/orchestrator.js` module is designed to run multi-agent waste analysis.
- The `server/routes/api.js` file exposes endpoints for analysis, food sharing, donations, and leaderboard data.

## Repository structure

- `src/` — React frontend prototype
  - `components/` — UI screens and interactive panels
  - `context/SaviorContext.jsx` — app state and progress tracking
  - `data/mockData.js` — seeded content for demo flows
- `server/` — backend scaffold
  - `routes/api.js` — API endpoints for the app
  - `middleware/auth.js` — Firebase token verification
  - `agents/orchestrator.js` — AI waste analysis orchestration
  - `database/db.js` — MySQL connection helper
  - `database/schema.sql` — schema for users, scans, donations, leaderboard, and more
- `.gitignore` — git exclusions for Node/Vite projects
- `package.json` — frontend dependencies and scripts
- `server/package.json` — backend dependencies and scripts

## Features included

- Waste analysis prototype with a 10-agent orchestrator concept
- Food rescue listing and sharing UI
- NGO campaign and donation simulation
- Global leaderboard and impact scoring
- Kid-friendly Guardian mode and mission badges
- Premium credits system and in-app rewards
- Custom cursor and animated Earth recovery visuals

## Frontend setup

```bash
cd savior-ai
npm install
npm run dev
```

Open the local address shown by Vite (usually `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## Backend scaffold setup

```bash
cd server
npm install
```

Create an `.env` file from `.env.example` and add your configuration values.

Initialize the database:

```bash
mysql -u root -p < database/schema.sql
```

For Firebase auth, add a service account JSON file and set `FIREBASE_SERVICE_ACCOUNT_PATH` in `.env`.

Start the server:

```bash
npm run dev
```

## API endpoints

| Method | Route | Description |
| --- | --- | --- |
| GET | `/` | Health check for the API server |
| POST | `/api/users/sync` | Sync authenticated Firebase user to MySQL |
| GET | `/api/user-impact` | Fetch current user stats |
| POST | `/api/analyze-waste` | Run waste analysis orchestrator on an image URL |
| POST | `/api/food-share` | Create a food rescue listing |
| GET | `/api/food-share` | List available food shares |
| GET | `/api/campaigns` | Retrieve NGO campaigns |
| POST | `/api/donate` | Record a donation and update campaign totals |
| GET | `/api/leaderboard` | Return top user rankings |

## How to connect frontend to backend

1. Replace frontend mock data flows with calls to the backend API.
2. Use Firebase Web Auth in the frontend and send the ID token to `/api/users/sync`.
3. Point the food rescue and donation screens to `/api/food-share`, `/api/campaigns`, and `/api/donate`.
4. Update `CLIENT_ORIGIN` in `server/.env` after deployment.

##**POSTER** : <img width="1068" height="1600" alt="WhatsApp Image 2026-07-14 at 06 36 06" src="https://github.com/user-attachments/assets/1fb7efcb-4cc4-4ffa-9e7d-c49d958fc6ca" />


## Tech stack

- Frontend: React 19, Vite, Tailwind CSS, Framer Motion, Lucide icons
- Backend: Node.js, Express, MySQL, Firebase Admin, OpenAI

## Notes

- The current frontend is a demo/prototype and uses simulated data.
- The backend is scaffolded for real usage, but frontend integration requires additional wiring.
- Before production, add validation, security, rate limiting, and proper payment/donation handling.
