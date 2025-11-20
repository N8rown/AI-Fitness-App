# Quick Start - AI Fitness App

## 🚀 Fastest Setup

### ⭐ Recommended: Local Development (Works Perfectly)

No Docker, no complexity. Just two terminals:

```bash
# Terminal 1 - Backend API
cd api
pnpm install
pnpm approve-builds  # (when prompted, select better-sqlite3)
pnpm dev             # runs on http://localhost:3000

# Terminal 2 - Frontend (in separate terminal)
cd ai-fitness-web
pnpm install
pnpm dev             # runs on http://localhost:5173
```

Then open: **http://localhost:5173**

---

### Docker (Advanced - WIP)

For production or if you prefer containers, Docker support is available but requires additional setup for native modules. Coming soon with improved stability.

---

## 🛠️ What I Built For You

Your AI Fitness App now has a complete backend with:

### ✅ Authentication System
- Sign up with email/password
- Login & JWT tokens
- Secure endpoints with middleware

### ✅ Database (SQLite - No Setup Required)
- User accounts
- Fitness plans & logs
- Chat history
- User profiles

### ✅ REST API (Express)
- `/api/auth/*` - Login/signup
- `/api/profile` - Onboarding data
- `/api/plans` - Save & retrieve plans
- `/api/logs` - Workout logging
- `/api/chat` - AI coaching

### ✅ React Frontend 
- Sign in/up screens
- Onboarding flow
- Plan generation & logging
- Dashboard with adherence %
- AI Chat (integrates with OpenAI)

### ✅ AI Integration
- OpenAI ChatGPT integration (optional)
- Fallback deterministic responses
- Safety checks for medical questions

---

## 📋 Files Created/Modified

### Backend (api/)
```
api/
├── src/
│   ├── db/
│   │   ├── connection.ts    - DB connection pool
│   │   ├── schema.ts        - Database initialization
│   │   └── migrate.ts       - Migration runner
│   ├── auth/index.ts        - JWT & password hashing
│   ├── middleware/auth.ts   - Auth middleware
│   ├── routes/
│   │   ├── auth.ts          - Sign up/login endpoints
│   │   ├── profile.ts       - User profile endpoints
│   │   ├── plans.ts         - Plan management
│   │   ├── logs.ts          - Workout logging
│   │   └── chat.ts          - AI chat endpoint
│   ├── services/ai.ts       - AI integration
│   └── index.ts             - Server entry point
├── package.json             - Dependencies
├── tsconfig.json            - TypeScript config
├── Dockerfile               - Container setup
└── .env.example             - Environment template
```

### Frontend (ai-fitness-web/)
```
src/
├── AppNew.tsx    - NEW: Full-stack version with auth & API
└── App.tsx       - OLD: Keep as backup for reference
```

### Configuration
```
├── docker-compose.yml  - UPDATED: Full stack setup
├── SETUP.md           - Complete setup guide
└── README files
```

---

## 🎯 Next Steps

### 1. Start the App (Choose One)

**Option A - Docker (Easiest):**
```bash
cd AI-Fitness-App
docker-compose up
```

**Option B - Local Development:**
```bash
# Terminal 1 - Backend
cd api
pnpm install
cp .env.example .env
# Edit .env, then:
pnpm migrate
pnpm dev

# Terminal 2 - Frontend  
cd ai-fitness-web
pnpm install
cp .env.example .env.local
pnpm dev
```

### 2. Test the Flow
1. Go to http://localhost:5173
2. Sign up with any email/password
3. Fill onboarding info
4. Generate a plan
5. Accept & log a workout
6. Check the dashboard

### 3. Add OpenAI (Optional)
1. Get API key from https://platform.openai.com/api-keys
2. Add to `api/.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ```
3. Restart the API server
4. Chat will now use real AI instead of fallback responses

### 4. Customize
- Edit `api/src/routes/*` to modify API behavior
- Edit `ai-fitness-web/src/AppNew.tsx` for UI changes
- Add more exercises to `EXERCISES` array
- Modify database schema in `api/src/db/schema.ts`

---

## 🔐 Security Notes

Before production:
- Change `JWT_SECRET` in `.env`
- Use strong database password
- Enable HTTPS
- Set `NODE_ENV=production`
- Add rate limiting
- Use environment-specific secrets

---

## 🐛 Troubleshooting

**Port 5173 or 3000 already in use?**
```bash
# Docker: restart services
docker-compose restart

# Local: kill the process
# macOS/Linux: lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9
# Windows: netstat -ano | findstr :3000 && taskkill /PID <PID> /F
```

**Database errors?**
```bash
# Docker: Check logs
docker-compose logs db

# Local: Verify PostgreSQL is running on port 5432
```

**API not responding?**
```bash
# Check if backend is running
curl http://localhost:3000/health
```

---

## 📚 API Examples

### Sign Up
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure123"
  }'
```

### Save Workout
```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "workout_id": "wo_1",
    "entries": [
      {
        "exerciseId": "db_squat",
        "set": 1,
        "weight": 135,
        "reps": 8,
        "rpe": 7
      }
    ]
  }'
```

---

## 🎓 Learn More

- Backend structure: `api/README.md` (can be created)
- Database schema: `api/src/db/schema.ts`
- API routes: `api/src/routes/`
- Frontend components: `ai-fitness-web/src/AppNew.tsx`

---

**You're all set! 🎉 Start with `docker-compose up` and enjoy your full-stack fitness app!**
