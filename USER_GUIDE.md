# 📚 AI Fitness App - User Guide for Developers

This guide helps team members quickly identify where to make edits and understand the project structure.

---

## 🎯 Quick Navigation

### Where to Make Edits?

| **What You Want to Change** | **File Location** | **What It Does** |
|---|---|---|
| **Login/Signup screens** | `ai-fitness-web/src/AppNew.tsx` (lines 200-300) | User authentication UI |
| **Dashboard & workout logging** | `ai-fitness-web/src/AppNew.tsx` (lines 400-600) | Main user interface |
| **Exercise database** | `ai-fitness-web/src/AppNew.tsx` (lines 85-110) | Add/modify exercises |
| **Backend authentication** | `api/src/routes/auth.ts` | Login/signup endpoints |
| **User profiles** | `api/src/routes/profile.ts` | Save user onboarding data |
| **Fitness plans** | `api/src/routes/plans.ts` | Plan generation/retrieval |
| **Workout logging** | `api/src/routes/logs.ts` | Save workout history |
| **AI chat responses** | `api/src/routes/chat.ts` + `api/src/services/ai.ts` | AI coaching integration |
| **Database structure** | `api/src/db/schema.ts` | Add/modify database tables |
| **API configuration** | `api/src/index.ts` | Add new routes or middleware |
| **Styling** | `ai-fitness-web/src/style.css` + `tailwind.config.js` | Visual customization |

---

## 📁 Project Structure

### **Backend (Express API)**

```
api/
├── src/
│   ├── index.ts                    ← SERVER ENTRY POINT
│   │                                  Register all routes here
│   │
│   ├── db/
│   │   ├── connection.ts           ← SQLite database connection
│   │   ├── schema.ts               ← TABLE DEFINITIONS (users, profiles, etc.)
│   │   └── migrate.ts              ← Database initialization script
│   │
│   ├── auth/
│   │   └── index.ts                ← JWT token generation & password hashing
│   │
│   ├── middleware/
│   │   └── auth.ts                 ← Protect routes with JWT verification
│   │
│   ├── routes/                      ← API ENDPOINTS
│   │   ├── auth.ts                 ← POST /api/auth/signup, /login, GET /me
│   │   ├── profile.ts              ← GET/POST /api/profile (onboarding)
│   │   ├── plans.ts                ← POST /api/plans, GET /api/plans/:id
│   │   ├── logs.ts                 ← POST /api/logs (save workouts)
│   │   └── chat.ts                 ← POST /api/chat (AI interaction)
│   │
│   └── services/
│       └── ai.ts                   ← OpenAI ChatGPT integration
│
├── package.json                    ← Dependencies (Express, SQLite, JWT, etc.)
├── tsconfig.json                   ← TypeScript configuration
├── .env.example                    ← Environment variable template
└── Dockerfile                      ← Container configuration

Key Database Tables:
  - users (id, email, password_hash, created_at)
  - user_profiles (user_id, name, experience, goal, equipment, etc.)
  - fitness_plans (id, user_id, name, workout_data, created_at)
  - workout_logs (id, user_id, workout_id, entries_json, created_at)
  - chat_messages (id, user_id, message, response, created_at)
```

### **Frontend (React + Vite)**

```
ai-fitness-web/
├── src/
│   ├── AppNew.tsx                  ← MAIN APP (650+ lines)
│   │                                  - Auth screens (signup/login)
│   │                                  - Onboarding flow
│   │                                  - Plan generation UI
│   │                                  - Workout logging
│   │                                  - Dashboard
│   │                                  - AI chat interface
│   │
│   ├── App.tsx                     ← OLD VERSION (backup/reference)
│   ├── main.tsx                    ← Vite entry point
│   ├── index.css                   ← Base styles
│   ├── style.css                   ← Additional styles
│   └── fitness-app-wireframes.tsx  ← Wireframe mockups
│
├── index.html                      ← HTML entry point
├── package.json                    ← Dependencies (React, Vite, Tailwind)
├── vite.config.ts                 ← Vite configuration
├── tailwind.config.js              ← Tailwind CSS config
├── .env.example                    ← Environment variables (API_URL)
└── Dockerfile                      ← Container configuration
```

---

## 🔄 Data Flow

### User Registration Flow
```
1. User fills signup form (AppNew.tsx ~line 250)
   ↓
2. POST /api/auth/signup (auth.ts)
   - Hash password with bcryptjs
   - Store in users table
   ↓
3. Return JWT token
   ↓
4. React saves token to localStorage
   ↓
5. Redirect to onboarding
```

### Plan Generation Flow
```
1. User fills onboarding (equipment, goals, etc.) (AppNew.tsx ~line 350)
   ↓
2. POST /api/profile (profile.ts)
   - Save to user_profiles table
   ↓
3. Frontend generates plan locally (AppNew.tsx ~line 450)
   ↓
4. POST /api/plans (plans.ts)
   - Save to fitness_plans table
   ↓
5. Display plan on dashboard
```

### Workout Logging Flow
```
1. User completes workout, fills in sets/reps (AppNew.tsx ~line 550)
   ↓
2. POST /api/logs (logs.ts)
   - Save entries to workout_logs table
   ↓
3. Calculate adherence % from logged workouts
   ↓
4. Display on dashboard
```

### AI Chat Flow
```
1. User sends message (AppNew.tsx ~line 600)
   ↓
2. POST /api/chat (chat.ts)
   - Check if OpenAI key configured
   - Call OpenAI API OR use fallback responses (services/ai.ts)
   ↓
3. Save conversation to chat_messages table
   ↓
4. Return response to frontend
   ↓
5. Display in chat UI
```

---

## 🛠️ Common Edits

### ✏️ Add a New Exercise

**File:** `ai-fitness-web/src/AppNew.tsx` (around line 85)

```typescript
const EXERCISES: Exercise[] = [
  // ... existing exercises ...
  {
    id: 'leg_press',          // Unique identifier
    name: 'Leg Press',        // Display name
    equipment: ['gym'],       // Available equipment types
    muscle: 'legs',           // Muscle group
    defaultSets: 4,
    defaultReps: 10,
  },
];
```

### ✏️ Modify Authentication Logic

**File:** `api/src/routes/auth.ts`

```typescript
// Sign up endpoint - add validation here
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  
  // Example: Add email validation
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  
  // Rest of logic...
});
```

### ✏️ Modify Workout Plan Generation

**File:** `ai-fitness-web/src/AppNew.tsx` (around line 450)

```typescript
const generatePlan = (): Plan => {
  const { equipment, goal, experience } = profile;
  
  // Customize plan generation logic here
  // Return different exercises based on equipment/goal
  
  const plan: Plan = {
    id: cid('plan'),
    name: `${experience} ${goal} plan`,
    weeks: [
      // Modify structure/exercises
    ],
  };
  
  return plan;
};
```

### ✏️ Add a New API Endpoint

**File:** `api/src/index.ts`

```typescript
// Step 1: Create new route file (api/src/routes/myfeature.ts)
import express from 'express';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/my-endpoint', authMiddleware, async (req, res) => {
  // Your logic here
  res.json({ success: true });
});

export default router;

// Step 2: Register in api/src/index.ts
import myfeatureRoutes from './routes/myfeature.js';
app.use('/api/myfeature', myfeatureRoutes);
```

### ✏️ Add a New Database Table

**File:** `api/src/db/schema.ts`

```typescript
export async function initializeDatabase() {
  const db = getConnection();
  
  // Add your table creation here
  db.exec(`
    CREATE TABLE IF NOT EXISTS my_table (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
  
  // Create index for performance
  db.exec(`CREATE INDEX IF NOT EXISTS idx_my_table_user ON my_table(user_id)`);
}
```

### ✏️ Modify UI Components

**File:** `ai-fitness-web/src/AppNew.tsx`

The entire UI is in one file. Major sections:

- **Lines 200-300:** Login/Signup screens
- **Lines 320-380:** Onboarding flow
- **Lines 400-480:** Plan display
- **Lines 500-580:** Workout logging
- **Lines 600-700:** Dashboard & stats
- **Lines 720-771:** Render function (main JSX)

Find the section you want to edit and modify the JSX/styling.

---

## 🚀 Running the App Locally

### **First Time Setup**

```bash
# Backend Setup
cd api
pnpm install
pnpm approve-builds  # When prompted, approve better-sqlite3
cp .env.example .env
# Edit .env if needed (set OPENAI_API_KEY to use real AI)

# Frontend Setup (in new terminal)
cd ai-fitness-web
pnpm install
cp .env.example .env.local
```

### **Daily Development**

```bash
# Terminal 1 - Backend API (port 3000)
cd api
pnpm dev

# Terminal 2 - Frontend UI (port 5173)
cd ai-fitness-web
pnpm dev

# Open browser: http://localhost:5173
```

### **Stop Everything**

```powershell
# Windows PowerShell
Get-Process | Where-Object {$_.ProcessName -match "node|pnpm"} | Stop-Process -Force
```

---

## 🧪 Testing Your Changes

### **Test Backend Endpoints**

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","name":"Test User"}'

# Get token from signup response
# Test protected endpoint
curl -X GET http://localhost:3000/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Test Frontend**

1. Open http://localhost:5173
2. Sign up with test email
3. Complete onboarding
4. Generate a plan
5. Log a workout
6. Check dashboard stats

### **Check Database**

```bash
# SQLite database is at: api/fitness.db
# Query it with any SQLite browser or command:
sqlite3 api/fitness.db ".tables"
sqlite3 api/fitness.db "SELECT * FROM users;"
```

---

## 🔍 Debugging Tips

### **Backend Errors**

Check terminal where `pnpm dev` is running in `api/` folder. Look for:
- TypeScript compilation errors (usually not blocking)
- Runtime errors (check stack trace)
- Database connection errors

### **Frontend Errors**

Check:
- Browser DevTools Console (F12 → Console tab)
- Terminal where `pnpm dev` is running in `ai-fitness-web/` folder
- Network tab to see API requests/responses

### **API Not Responding?**

```bash
# Check if backend is running
curl http://localhost:3000/health

# Should return: {"status":"ok"}
```

### **Port Already in Use?**

```bash
# Kill existing processes
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
```

---

## 📦 Dependencies

### **Backend (api/package.json)**

| Package | Purpose |
|---------|---------|
| `express` | Web framework |
| `better-sqlite3` | Local database |
| `jsonwebtoken` | JWT auth tokens |
| `bcryptjs` | Password hashing |
| `cors` | Cross-origin requests |
| `axios` | HTTP requests (for OpenAI API) |
| `tsx` | Run TypeScript directly |
| `typescript` | Type checking |

### **Frontend (ai-fitness-web/package.json)**

| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `vite` | Build tool |
| `tailwindcss` | Styling |
| `typescript` | Type checking |

---

## 📝 Common Patterns

### **Using the Database**

```typescript
import { getConnection } from '../db/connection.js';

const db = getConnection();

// Query
const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

// Insert
db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)').run(email, hash);

// Update
db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name, userId);

// Delete
db.prepare('DELETE FROM users WHERE id = ?').run(userId);
```

### **Using Authentication Middleware**

```typescript
import { authMiddleware } from '../middleware/auth.js';

// Protected route
router.get('/protected', authMiddleware, (req, res) => {
  const userId = (req as any).userId;  // Added by authMiddleware
  // Do something with userId
});
```

### **Making API Calls from Frontend**

```typescript
// In AppNew.tsx
const token = localStorage.getItem('token');

const response = await apiCall('/profile', 'POST', {
  name: 'John Doe',
  equipment: ['dumbbells', 'gym'],
}, token);
```

---

## ✅ Checklist Before Committing

- [ ] Code runs without crashes
- [ ] No `console.error` messages in terminals
- [ ] Frontend loads on http://localhost:5173
- [ ] Can sign up and log in
- [ ] Database tables created successfully
- [ ] API endpoints respond to requests
- [ ] No uncommitted `.env` files (use `.env.example` instead)

---

## 🤝 Team Responsibilities

### **Frontend Development**
- Edit `ai-fitness-web/src/AppNew.tsx`
- Modify `ai-fitness-web/src/style.css` for styling
- Update `tailwind.config.js` for Tailwind customization
- Test on http://localhost:5173

### **Backend Development**
- Edit files in `api/src/routes/` for API endpoints
- Modify `api/src/db/schema.ts` for database changes
- Update `api/src/services/ai.ts` for AI features
- Test with curl or Postman

### **Database**
- Schema changes in `api/src/db/schema.ts`
- Run migrations if needed: `pnpm migrate`
- Keep `.env` files local (use `.env.example`)

### **AI Features**
- Get OpenAI API key from https://platform.openai.com
- Add to `api/.env`: `OPENAI_API_KEY=sk-...`
- Modify fallback responses in `api/src/services/ai.ts`
- Test in chat UI on http://localhost:5173

---

## 📞 Need Help?

1. **Check the Quick Start Guide:** `QUICKSTART.md`
2. **Review this guide** for your specific use case
3. **Look at existing code** in the same file as similar examples
4. **Check terminal output** for error messages
5. **Use browser DevTools** for frontend debugging (F12)

---

## 🎓 Key Concepts

### **JWT Tokens**
- Issued on login/signup
- Stored in localStorage on frontend
- Sent in `Authorization: Bearer TOKEN` header
- Verified by `authMiddleware` on protected routes
- Contains encoded `userId`

### **SQLite Database**
- File-based (no server needed)
- Located at `api/fitness.db`
- Auto-initialized on first startup
- Can browse with any SQLite viewer

### **Vite vs Create React App**
- **Vite** is faster (used here)
- Instant HMR (hot module replacement)
- Run with `pnpm dev` (not `npm start`)

### **TypeScript Errors**
- Compilation warnings are normal (don't stop the app)
- The app still runs if TypeScript has errors
- Fix them for production builds (`pnpm build`)

---

**Last Updated:** November 2024
**Questions?** Review the specific file paths above or check the code comments directly!
