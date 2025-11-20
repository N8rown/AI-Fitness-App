import React, { useState, useMemo, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ======================== Types ========================
type Experience = 'novice' | 'intermediate' | 'advanced';
type Goal = 'strength' | 'fat-loss' | 'general';

type User = {
  id: number;
  email: string;
  name: string;
};

type OnboardingProfile = {
  name: string;
  email: string;
  password?: string;
  equipment: ('dumbbells' | 'bands' | 'bodyweight' | 'gym')[];
  schedule: number;
  experience: Experience;
  goal: Goal;
  unit: 'kg' | 'lb';
};

type SetTarget = { reps: number; rpe: number };

type Exercise = {
  id: string;
  name: string;
  equipment: ('dumbbells' | 'bands' | 'bodyweight' | 'gym')[];
  muscle: string;
  defaultSets: number;
  defaultReps: number;
};

type Workout = {
  id: string;
  title: string;
  exercises: { exerciseId: string; sets: SetTarget[] }[];
};

type Plan = {
  id: string;
  name: string;
  weeks: { days: Workout[] }[];
};

type LogEntry = {
  exerciseId: string;
  set: number;
  weight: number;
  reps: number;
  rpe: number;
  notes?: string;
};

type WorkoutLog = {
  workoutId: string;
  entries: LogEntry[];
  createdAt: string;
};

// ======================== API Functions ========================
async function apiCall(endpoint: string, method = 'GET', body?: any, token?: string) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

// ======================== Utilities ========================
const cid = (() => {
  let n = 1;
  return (p: string) => `${p}_${n++}`;
})();

const EXERCISES: Exercise[] = [
  { id: 'db_squat', name: 'Dumbbell Squat', equipment: ['dumbbells'], muscle: 'legs', defaultSets: 3, defaultReps: 8 },
  { id: 'db_press', name: 'Dumbbell Bench Press', equipment: ['dumbbells'], muscle: 'chest', defaultSets: 3, defaultReps: 8 },
  { id: 'db_row', name: 'Dumbbell Row', equipment: ['dumbbells'], muscle: 'back', defaultSets: 3, defaultReps: 10 },
  { id: 'plank', name: 'Plank', equipment: ['bodyweight'], muscle: 'core', defaultSets: 3, defaultReps: 45 },
  { id: 'bw_squat', name: 'Bodyweight Squat', equipment: ['bodyweight'], muscle: 'legs', defaultSets: 3, defaultReps: 12 },
  { id: 'pushup', name: 'Push-up', equipment: ['bodyweight'], muscle: 'chest', defaultSets: 3, defaultReps: 10 },
  { id: 'row_band', name: 'Band Row', equipment: ['bands'], muscle: 'back', defaultSets: 3, defaultReps: 12 },
  { id: 'ohp_db', name: 'DB Overhead Press', equipment: ['dumbbells'], muscle: 'shoulders', defaultSets: 3, defaultReps: 8 },
  { id: 'lat_pulldown', name: 'Lat Pulldown (Gym)', equipment: ['gym'], muscle: 'back', defaultSets: 3, defaultReps: 10 },
  { id: 'leg_press', name: 'Leg Press (Gym)', equipment: ['gym'], muscle: 'legs', defaultSets: 3, defaultReps: 10 },
  { id: 'bench', name: 'Barbell Bench (Gym)', equipment: ['gym'], muscle: 'chest', defaultSets: 3, defaultReps: 5 },
  { id: 'deadlift', name: 'Deadlift (Gym)', equipment: ['gym'], muscle: 'posterior', defaultSets: 3, defaultReps: 5 },
];

const getExercise = (id: string) => EXERCISES.find((e) => e.id === id)!;

function buildDeterministicPlan(ob: OnboardingProfile): Plan {
  const minimalEq = ob.equipment.every((e) => ['dumbbells', 'bands', 'bodyweight'].includes(e));
  const isThreeDay = ob.schedule <= 3;
  const template = minimalEq && isThreeDay ? 'full_body_3d' : 'upper_lower_4d';

  const sets = (n: number, reps: number, rpe: number): SetTarget[] =>
    Array.from({ length: n }, () => ({ reps, rpe }));

  const fullBodyA = (): Workout => ({
    id: cid('wo'),
    title: 'Full Body A',
    exercises: [
      { exerciseId: 'db_squat', sets: sets(3, 8, 7) },
      { exerciseId: 'db_press', sets: sets(3, 8, 7) },
      { exerciseId: 'db_row', sets: sets(3, 10, 7) },
      { exerciseId: 'plank', sets: sets(3, 45, 6) },
    ],
  });

  const fullBodyB = (): Workout => ({
    id: cid('wo'),
    title: 'Full Body B',
    exercises: [
      { exerciseId: 'bw_squat', sets: sets(3, 12, 6) },
      { exerciseId: 'ohp_db', sets: sets(3, 8, 7) },
      { exerciseId: 'row_band', sets: sets(3, 12, 7) },
      { exerciseId: 'plank', sets: sets(3, 45, 6) },
    ],
  });

  const upper = (): Workout => ({
    id: cid('wo'),
    title: 'Upper',
    exercises: [
      { exerciseId: 'bench', sets: sets(3, 5, 7) },
      { exerciseId: 'lat_pulldown', sets: sets(3, 10, 7) },
      { exerciseId: 'ohp_db', sets: sets(3, 8, 7) },
      { exerciseId: 'plank', sets: sets(3, 45, 6) },
    ],
  });

  const lower = (): Workout => ({
    id: cid('wo'),
    title: 'Lower',
    exercises: [
      { exerciseId: 'leg_press', sets: sets(3, 10, 7) },
      { exerciseId: 'deadlift', sets: sets(3, 5, 7) },
      { exerciseId: 'bw_squat', sets: sets(3, 12, 6) },
      { exerciseId: 'plank', sets: sets(3, 45, 6) },
    ],
  });

  let week1: Workout[] = [];
  if (template === 'full_body_3d') {
    week1 = [fullBodyA(), fullBodyB(), fullBodyA()];
  } else {
    week1 = [upper(), lower(), upper(), lower()].slice(0, Math.min(4, Math.max(3, ob.schedule)));
  }

  const bumpSets = (w: Workout): Workout => ({
    ...w,
    id: cid('wo'),
    exercises: w.exercises.map((ex, i) => {
      if (i === 0) {
        const first = { ...ex };
        const [firstSet] = first.sets;
        const isBW = getExercise(first.exerciseId).equipment.includes('bodyweight');
        if (isBW) {
          return {
            ...first,
            sets: first.sets.map((s, idx) => ({ ...s, reps: idx === 0 ? s.reps + 2 : s.reps })),
          };
        }
        return { ...first, sets: [...first.sets, { reps: firstSet.reps, rpe: Math.min(8, firstSet.rpe + 0) }] };
      }
      return ex;
    }),
  });

  const week2 = week1.map(bumpSets);
  return {
    id: cid('plan'),
    name: '2-week baseline',
    weeks: [{ days: week1 }, { days: week2 }],
  };
}

// ======================== UI Components ========================
function Section({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold text-slate-800">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <div className="text-sm font-medium text-slate-700 mb-1">{label}</div>
      {children}
    </label>
  );
}

function Pill({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`px-3 py-1.5 rounded-full text-sm border transition ${
        active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-300 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function TabButton({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium border ${
        active ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-300 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

// ======================== Main App ========================
export default function FitnessCoachApp() {
  // Auth state
  const [authTab, setAuthTab] = useState<'login' | 'signup' | 'app'>('login');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  // App state
  const [tab, setTab] = useState<'onboarding' | 'plan' | 'logger' | 'dashboard' | 'chat'>('onboarding');
  const [profile, setProfile] = useState<OnboardingProfile>({
    name: '',
    email: '',
    equipment: [],
    schedule: 3,
    experience: 'novice',
    goal: 'general',
    unit: 'kg',
  });

  const [plan, setPlan] = useState<Plan | null>(null);
  const [acceptedPlanId, setAcceptedPlanId] = useState<string | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(false);

  // Check auth on mount
  useEffect(() => {
    if (token) {
      validateToken();
    }
  }, []);

  async function validateToken() {
    try {
      const res = await apiCall('/auth/me', 'GET', undefined, token!);
      setCurrentUser(res.user);
      setAuthTab('app');
    } catch {
      localStorage.removeItem('token');
      setToken(null);
      setAuthTab('login');
    }
  }

  async function handleSignup(formData: OnboardingProfile) {
    try {
      setLoading(true);
      const res = await apiCall('/auth/signup', 'POST', {
        email: formData.email,
        password: formData.password,
        name: formData.name,
      });
      setToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem('token', res.token);
      setProfile(formData);
      setAuthTab('app');
    } catch (error) {
      alert('Signup failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(email: string, password: string) {
    try {
      setLoading(true);
      const res = await apiCall('/auth/login', 'POST', { email, password });
      setToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem('token', res.token);
      setAuthTab('app');
    } catch (error) {
      alert('Login failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken(null);
    setCurrentUser(null);
    setAuthTab('login');
    localStorage.removeItem('token');
  }

  const thisWeekScheduled = useMemo(() => {
    if (!plan) return 0;
    const days = plan.weeks[0]?.days?.length ?? 0;
    return Math.min(days, profile.schedule || 0);
  }, [plan, profile.schedule]);

  const thisWeekCompleted = useMemo(() => {
    if (!plan) return 0;
    const woIds = new Set(plan.weeks[0]?.days?.map((d) => d.id));
    return logs.filter((l) => woIds.has(l.workoutId)).length;
  }, [plan, logs]);

  const adherence = thisWeekScheduled ? Math.min(1, thisWeekCompleted / thisWeekScheduled) : 0;

  const toggleEquipment = (k: OnboardingProfile['equipment'][number]) => {
    setProfile((p) => ({
      ...p,
      equipment: p.equipment.includes(k) ? p.equipment.filter((x) => x !== k) : [...p.equipment, k],
    }));
  };

  const canSubmitOnboarding = profile.name && profile.email && profile.equipment.length > 0 && profile.schedule >= 1;

  const generatePlan = () => {
    const p = buildDeterministicPlan(profile);
    setPlan(p);
    setTab('plan');
  };

  const acceptPlan = async () => {
    if (!plan || !token) return;
    try {
      await apiCall('/plans', 'POST', { name: plan.name, plan_data: plan }, token);
      setAcceptedPlanId(plan.id);
      alert('Plan saved! You can now log a workout.');
      setTab('logger');
    } catch (error) {
      alert('Failed to save plan');
    }
  };

  const saveLog = async (workoutId: string, entries: WorkoutLog['entries']) => {
    if (!token) return;
    try {
      await apiCall('/logs', 'POST', { workout_id: workoutId, entries }, token);
      setLogs((prev) => [...prev, { workoutId, entries, createdAt: new Date().toISOString() }]);
      setTab('dashboard');
    } catch (error) {
      alert('Failed to save workout');
    }
  };

  // ======================== Render ========================
  if (authTab === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Section title="Sign In">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleLogin(formData.get('email') as string, formData.get('password') as string);
            }}
            className="space-y-4 w-80"
          >
            <Field label="Email">
              <input type="email" name="email" className="w-full border rounded-lg px-3 py-2" required />
            </Field>
            <Field label="Password">
              <input type="password" name="password" className="w-full border rounded-lg px-3 py-2" required />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('signup')}
              className="w-full text-slate-600 hover:text-slate-900 text-sm"
            >
              Don't have an account? Sign up
            </button>
          </form>
        </Section>
      </div>
    );
  }

  if (authTab === 'signup') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Section title="Create Account">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSignup({
                ...profile,
                name: formData.get('name') as string,
                email: formData.get('email') as string,
                password: formData.get('password') as string,
              });
            }}
            className="space-y-4 w-80"
          >
            <Field label="Name">
              <input type="text" name="name" className="w-full border rounded-lg px-3 py-2" required />
            </Field>
            <Field label="Email">
              <input type="email" name="email" className="w-full border rounded-lg px-3 py-2" required />
            </Field>
            <Field label="Password">
              <input type="password" name="password" className="w-full border rounded-lg px-3 py-2" required />
            </Field>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <button
              type="button"
              onClick={() => setAuthTab('login')}
              className="w-full text-slate-600 hover:text-slate-900 text-sm"
            >
              Already have an account? Sign in
            </button>
          </form>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-tight">AI Fitness & Health Trainer</div>
          <nav className="flex gap-2">
            <TabButton active={tab === 'onboarding'} onClick={() => setTab('onboarding')}>
              Onboarding
            </TabButton>
            <TabButton active={tab === 'plan'} onClick={() => setTab('plan')}>
              Plan
            </TabButton>
            <TabButton active={tab === 'logger'} onClick={() => setTab('logger')}>
              Logger
            </TabButton>
            <TabButton active={tab === 'dashboard'} onClick={() => setTab('dashboard')}>
              Dashboard
            </TabButton>
            <TabButton active={tab === 'chat'} onClick={() => setTab('chat')}>
              Chat
            </TabButton>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {tab === 'onboarding' && (
          <Section title="Onboarding & Goals">
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Goal">
                <select
                  value={profile.goal}
                  onChange={(e) => setProfile({ ...profile, goal: e.target.value as Goal })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="strength">Strength</option>
                  <option value="fat-loss">Fat Loss</option>
                  <option value="general">General Fitness</option>
                </select>
              </Field>
              <Field label="Experience">
                <select
                  value={profile.experience}
                  onChange={(e) => setProfile({ ...profile, experience: e.target.value as Experience })}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="novice">Novice</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </Field>
              <Field label="Equipment">
                <div className="flex flex-wrap gap-2">
                  {['dumbbells', 'bands', 'bodyweight', 'gym'].map((k) => (
                    <Pill
                      key={k}
                      active={profile.equipment.includes(k as any)}
                      onClick={() => toggleEquipment(k as any)}
                    >
                      {k}
                    </Pill>
                  ))}
                </div>
              </Field>
              <Field label="Days per week">
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={profile.schedule}
                  onChange={(e) => setProfile({ ...profile, schedule: parseInt(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={generatePlan}
                disabled={!canSubmitOnboarding}
                className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90 disabled:opacity-50"
              >
                Generate Plan
              </button>
            </div>
          </Section>
        )}

        {tab === 'plan' && (
          <div className="space-y-4">
            {plan ? (
              <>
                <Section
                  title={plan.name}
                  right={
                    <button
                      onClick={acceptPlan}
                      className="px-4 py-1 rounded-lg bg-green-600 text-white text-sm hover:opacity-90"
                    >
                      Accept Plan
                    </button>
                  }
                >
                  {plan.weeks.map((w, wi) => (
                    <div key={wi} className="mb-6">
                      <h3 className="font-semibold text-lg mb-3">Week {wi + 1}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {w.days.map((d, di) => (
                          <div key={di} className="border rounded-lg p-4">
                            <h4 className="font-medium mb-2">{d.title}</h4>
                            <ul className="text-sm space-y-1 text-slate-700">
                              {d.exercises.map((ex, ei) => (
                                <li key={ei}>{getExercise(ex.exerciseId).name}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Section>
              </>
            ) : (
              <p className="text-slate-600">No plan yet. Generate one from the Onboarding tab.</p>
            )}
          </div>
        )}

        {tab === 'logger' && acceptedPlanId && plan && (
          <Section title="Workout Logger">
            <WorkoutLoggerComponent workout={plan.weeks[0].days[0]} profile={profile} onSave={saveLog} />
          </Section>
        )}

        {tab === 'dashboard' && (
          <Section title="Dashboard">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-2xl border p-4 bg-white">
                <div className="text-sm text-slate-500">Scheduled (this week)</div>
                <div className="text-3xl font-semibold">{thisWeekScheduled}</div>
              </div>
              <div className="rounded-2xl border p-4 bg-white">
                <div className="text-sm text-slate-500">Completed (this week)</div>
                <div className="text-3xl font-semibold">{thisWeekCompleted}</div>
              </div>
              <div className="rounded-2xl border p-4 bg-white">
                <div className="text-sm text-slate-500">Adherence</div>
                <div className="text-3xl font-semibold">{Math.round(adherence * 100)}%</div>
              </div>
            </div>
          </Section>
        )}

        {tab === 'chat' && <ChatComponent token={token} goal={profile.goal} />}
      </main>
    </div>
  );
}

// ======================== Sub-components ========================
function WorkoutLoggerComponent({
  workout,
  profile,
  onSave,
}: {
  workout: Workout;
  profile: OnboardingProfile;
  onSave: (workoutId: string, entries: LogEntry[]) => Promise<void>;
}) {
  const [entries, setEntries] = useState<LogEntry[]>(() =>
    workout.exercises.flatMap((ex) =>
      ex.sets.map((s, i) => ({ exerciseId: ex.exerciseId, set: i + 1, weight: 0, reps: s.reps, rpe: s.rpe }))
    )
  );

  const update = (idx: number, patch: Partial<LogEntry>) => {
    setEntries((arr) => arr.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
  };

  return (
    <div className="space-y-3">
      {entries.map((e, i) => (
        <div key={i} className="border rounded-lg p-3 grid grid-cols-5 gap-2 items-end">
          <div>
            <label className="text-xs text-slate-600">Exercise</label>
            <div className="font-medium text-sm">{getExercise(e.exerciseId).name}</div>
          </div>
          <div>
            <label className="text-xs text-slate-600">Set</label>
            <input
              type="number"
              value={e.set}
              onChange={(ev) => update(i, { set: parseInt(ev.target.value) })}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Weight ({profile.unit})</label>
            <input
              type="number"
              value={e.weight}
              onChange={(ev) => update(i, { weight: parseFloat(ev.target.value) })}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">Reps</label>
            <input
              type="number"
              value={e.reps}
              onChange={(ev) => update(i, { reps: parseInt(ev.target.value) })}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-600">RPE</label>
            <input
              type="number"
              min="1"
              max="10"
              value={e.rpe}
              onChange={(ev) => update(i, { rpe: parseInt(ev.target.value) })}
              className="border rounded px-2 py-1 w-full text-sm"
            />
          </div>
        </div>
      ))}
      <button
        onClick={() => onSave(workout.id, entries)}
        className="px-6 py-2 rounded-lg bg-slate-900 text-white hover:opacity-90"
      >
        Save Workout
      </button>
    </div>
  );
}

function ChatComponent({ token, goal }: { token: string | null; goal: Goal }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Hi! I\'m your training buddy. Ask me for motivation or general training tips!' },
  ]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!text.trim() || !token) return;
    const userMsg = { role: 'user' as const, text };
    setMessages((m) => [...m, userMsg]);
    setText('');

    try {
      setLoading(true);
      const res = await apiCall('/chat/message', 'POST', { message: text, goal }, token);
      setMessages((m) => [...m, { role: 'assistant', text: res.message }]);
    } catch (error) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Sorry, I had an error. Try again!' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section title="Coach Chat">
      <div className="space-y-3">
        <div className="rounded-2xl border h-72 overflow-y-auto p-4 bg-white space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            disabled={loading}
            className="flex-1 border rounded-xl px-3 py-2 disabled:opacity-50"
            placeholder="Ask for motivation..."
          />
          <button
            onClick={send}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </Section>
  );
}
