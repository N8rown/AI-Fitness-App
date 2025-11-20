# AI Fitness App - Full Stack Setup

This is a complete full-stack fitness application with authentication, database, and AI chat integration.

## Project Structure

```
AI-Fitness-App/
├── api/                 # Node.js/Express backend
│   ├── src/
│   │   ├── db/         # Database utilities
│   │   ├── auth/       # Authentication
│   │   ├── routes/     # API endpoints
│   │   ├── middleware/ # Express middleware
│   │   ├── services/   # Business logic
│   │   └── index.ts    # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── ai-fitness-web/     # React frontend
│   ├── src/
│   │   ├── App.tsx     # Old monolithic version (backup)
│   │   ├── AppNew.tsx  # New version with API integration
│   │   ├── main.tsx
│   │   └── style files
│   ├── package.json
│   ├── Dockerfile
│   └── vite.config.ts
├── docker-compose.yml  # Orchestrate all services
└── README.md
```

## Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- OR: Node.js 20+, PostgreSQL 16

### Option 1: Using Docker Compose (Recommended)

1. **Clone and navigate to the project:**
```bash
cd AI-Fitness-App
```

2. **Create .env files:**
```bash
# Backend .env
cp api/.env.example api/.env

# Update api/.env with your settings (especially JWT_SECRET and OPENAI_API_KEY)
```

3. **Start all services:**
```bash
docker-compose up
```

This starts:
- PostgreSQL database (port 5432)
- Express API server (port 3000)
- React dev server (port 5173)

4. **Access the app:**
- Frontend: http://localhost:5173
- API: http://localhost:3000/api

### Option 2: Local Development Setup

#### Backend Setup

1. **Navigate to the API directory:**
```bash
cd api
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Update .env with your settings:**
```
DATABASE_URL=postgresql://app:app@localhost:5432/fitness
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=your-openai-key-here
```

5. **Start PostgreSQL** (if not running):
```bash
# Using Docker
docker run -d \
  --name fitness-db \
  -e POSTGRES_USER=app \
  -e POSTGRES_PASSWORD=app \
  -e POSTGRES_DB=fitness \
  -p 5432:5432 \
  postgres:16
```

6. **Run database migrations:**
```bash
pnpm migrate
```

7. **Start the API server:**
```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

#### Frontend Setup

1. **Navigate to the web directory:**
```bash
cd ai-fitness-web
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Create .env file:**
```bash
# .env or .env.local
VITE_API_URL=http://localhost:3000/api
```

4. **Start the dev server:**
```bash
pnpm dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Profile
- `POST /api/profile` - Create/update user profile
- `GET /api/profile` - Get user profile

### Plans
- `POST /api/plans` - Create fitness plan
- `GET /api/plans` - Get all user plans
- `GET /api/plans/:id` - Get specific plan
- `PUT /api/plans/:id/accept` - Accept a plan

### Workout Logs
- `POST /api/logs` - Log a workout
- `GET /api/logs` - Get all workout logs

### Chat
- `POST /api/chat/message` - Send message to AI coach
- `GET /api/chat/history` - Get chat history

## Features

### Frontend
- **Authentication**: Sign up and login with email/password
- **Onboarding**: Set goals, equipment, experience level, schedule
- **Plan Generation**: Deterministic plan generator (no network required)
- **Workout Logger**: Log sets, reps, weight, and RPE
- **Dashboard**: View adherence and workout history
- **AI Coach Chat**: Get motivation and training tips (integrates with OpenAI)

### Backend
- **JWT Authentication**: Secure token-based auth
- **Database**: PostgreSQL with structured schema
- **API**: RESTful endpoints for all features
- **AI Integration**: OpenAI ChatGPT for coaching
- **Safety**: Medical keyword detection to prevent medical advice

## Database Schema

- **users**: User accounts
- **user_profiles**: Onboarding data (goal, experience, equipment, schedule)
- **fitness_plans**: Saved workout plans
- **workout_logs**: Completed workouts with sets/reps
- **chat_messages**: User and AI conversation history

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
PORT=3000
NODE_ENV=development
OPENAI_API_KEY=sk-... (optional, for AI features)
```

### Frontend (.env.local)

```
VITE_API_URL=http://localhost:3000/api
```

## Next Steps

1. **Replace the old App.tsx**:
   - Once tested, delete `src/App.tsx` and rename `src/AppNew.tsx` to `src/App.tsx`

2. **Add OpenAI API Key**:
   - Get an API key from https://platform.openai.com/api-keys
   - Add it to your `.env` file for full AI chat capabilities

3. **Customize and Extend**:
   - Add more exercises to the database
   - Implement additional fitness metrics
   - Add social features or challenges
   - Deploy to production

## Troubleshooting

### Database Connection Error
- Ensure PostgreSQL is running
- Check DATABASE_URL in .env
- Verify password and username match

### CORS Errors
- Make sure VITE_API_URL points to the correct API URL
- API server should have CORS enabled (already set in docker-compose)

### OpenAI Errors
- Verify API key is correct and has credits
- Check rate limits

### Port Already in Use
```bash
# Find and kill the process using the port
# On macOS/Linux
lsof -i :3000
kill -9 <PID>

# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## Development Workflow

1. Make changes to either frontend or backend
2. With Docker: changes hot-reload automatically
3. With local dev: restart the dev server manually
4. Database migrations: Run `pnpm migrate` in api folder

## Production Deployment

Before deploying to production:

1. Change `JWT_SECRET` to a strong random value
2. Set `NODE_ENV=production`
3. Use a production-grade database
4. Enable HTTPS
5. Set up environment variables securely
6. Run database migrations on deployment

## Support

For issues or questions, check the API logs:
```bash
# With Docker
docker-compose logs api

# With local development
# Check terminal where `pnpm dev` is running
```

---

**Happy coding!** 💪
