import React, { useMemo, useState } from "react";

/**
 * AI Fitness & Health Trainer — Single-File React Frontend Demo
 * --------------------------------------------------------------
 * What this file includes:
 * - Minimal single-file SPA with tabs: Onboarding, Plan, Logger, Dashboard, Chat
 * - Deterministic rule-based plan generator (no network)
 * - Workout logger for one session
 * - Simple adherence % on Dashboard
 * - Safety-aware Chat stub with refusals (non-medical guidance only)
 *
 * How to use in a real app:
 * - Replace mock API calls with real endpoints (/onboarding, /plans/generate, /logs, /chat)
 * - Wire auth & persist data
 * - Extract components into separate files & add routing
 */


// ----------------------------- Utilities -----------------------------

type Experience = "novice" | "intermediate" | "advanced";
type Goal = "strength" | "fat-loss" | "general";

type OnboardingProfile = {
  name: string;
  email: string;
  equipment: ("dumbbells" | "bands" | "bodyweight" | "gym")[];
  schedule: number; // days per week
  experience: Experience;
  goal: Goal;
  unit: "kg" | "lb";
};

type SetTarget = { reps: number; rpe: number };

type Exercise = {
  id: string;
  name: string;
  equipment: ("dumbbells" | "bands" | "bodyweight" | "gym")[];
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
  weeks: { days: Workout[] }[]; // weeks[0].days[0] is Day 1
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

// Simple deterministic ID helper
const cid = (() => {
  let n = 1;
  return (p: string) => `${p}_${n++}`;
})();

// Mock exercise registry
const EXERCISES: Exercise[] = [
  { id: "db_squat", name: "Dumbbell Squat", equipment: ["dumbbells"], muscle: "legs", defaultSets: 3, defaultReps: 8 },
  { id: "db_press", name: "Dumbbell Bench Press", equipment: ["dumbbells"], muscle: "chest", defaultSets: 3, defaultReps: 8 },
  { id: "db_row", name: "Dumbbell Row", equipment: ["dumbbells"], muscle: "back", defaultSets: 3, defaultReps: 10 },
  { id: "plank", name: "Plank", equipment: ["bodyweight"], muscle: "core", defaultSets: 3, defaultReps: 45 },
  { id: "bw_squat", name: "Bodyweight Squat", equipment: ["bodyweight"], muscle: "legs", defaultSets: 3, defaultReps: 12 },
  { id: "pushup", name: "Push-up", equipment: ["bodyweight"], muscle: "chest", defaultSets: 3, defaultReps: 10 },
  { id: "row_band", name: "Band Row", equipment: ["bands"], muscle: "back", defaultSets: 3, defaultReps: 12 },
  { id: "ohp_db", name: "DB Overhead Press", equipment: ["dumbbells"], muscle: "shoulders", defaultSets: 3, defaultReps: 8 },
  { id: "lat_pulldown", name: "Lat Pulldown (Gym)", equipment: ["gym"], muscle: "back", defaultSets: 3, defaultReps: 10 },
  { id: "leg_press", name: "Leg Press (Gym)", equipment: ["gym"], muscle: "legs", defaultSets: 3, defaultReps: 10 },
  { id: "bench", name: "Barbell Bench (Gym)", equipment: ["gym"], muscle: "chest", defaultSets: 3, defaultReps: 5 },
  { id: "deadlift", name: "Deadlift (Gym)", equipment: ["gym"], muscle: "posterior", defaultSets: 3, defaultReps: 5 },
];

const getExercise = (id: string) => EXERCISES.find((e) => e.id === id)!;

// ---------------- Deterministic Plan Generator (Mock) ----------------
function buildDeterministicPlan(ob: OnboardingProfile): Plan {
  // Choose template by schedule & equipment
  const minimalEq = ob.equipment.every((e) => ["dumbbells", "bands", "bodyweight"].includes(e));
  const isThreeDay = ob.schedule <= 3;
  const template = minimalEq && isThreeDay ? "full_body_3d" : "upper_lower_4d";

  // Helper to create sets with RPE targets
  const sets = (n: number, reps: number, rpe: number): SetTarget[] =>
    Array.from({ length: n }, () => ({ reps, rpe }));

  // Day builders
  const fullBodyA = (): Workout => ({
    id: cid("wo"),
    title: "Full Body A",
    exercises: [
      { exerciseId: "db_squat", sets: sets(3, 8, 7) },
      { exerciseId: "db_press", sets: sets(3, 8, 7) },
      { exerciseId: "db_row", sets: sets(3, 10, 7) },
      { exerciseId: "plank", sets: sets(3, 45, 6) },
    ],
  });
  const fullBodyB = (): Workout => ({
    id: cid("wo"),
    title: "Full Body B",
    exercises: [
      { exerciseId: "bw_squat", sets: sets(3, 12, 6) },
      { exerciseId: "ohp_db", sets: sets(3, 8, 7) },
      { exerciseId: "row_band", sets: sets(3, 12, 7) },
      { exerciseId: "plank", sets: sets(3, 45, 6) },
    ],
  });

  const upper = (): Workout => ({
    id: cid("wo"),
    title: "Upper",
    exercises: [
      { exerciseId: "bench", sets: sets(3, 5, 7) },
      { exerciseId: "lat_pulldown", sets: sets(3, 10, 7) },
      { exerciseId: "ohp_db", sets: sets(3, 8, 7) },
      { exerciseId: "plank", sets: sets(3, 45, 6) },
    ],
  });
  const lower = (): Workout => ({
    id: cid("wo"),
    title: "Lower",
    exercises: [
      { exerciseId: "leg_press", sets: sets(3, 10, 7) },
      { exerciseId: "deadlift", sets: sets(3, 5, 7) },
      { exerciseId: "bw_squat", sets: sets(3, 12, 6) },
      { exerciseId: "plank", sets: sets(3, 45, 6) },
    ],
  });

  // Build Week 1
  let week1: Workout[] = [];
  if (template === "full_body_3d") {
    week1 = [fullBodyA(), fullBodyB(), fullBodyA()];
  } else {
    // upper/lower 4-day (if schedule<4 we'll still return 3–4 days)
    week1 = [upper(), lower(), upper(), lower()].slice(0, Math.min(4, Math.max(3, ob.schedule)));
  }

  // Week 2: copy week1 and add +1 set to primary lift or +2 reps if bodyweight
  const bumpSets = (w: Workout): Workout => ({
    ...w,
    id: cid("wo"),
    exercises: w.exercises.map((ex, i) => {
      if (i === 0) {
        // primary movement progression
        const first = { ...ex };
        const [firstSet] = first.sets;
        const isBW = getExercise(first.exerciseId).equipment.includes("bodyweight");
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
    id: cid("plan"),
    name: "2-week baseline",
    weeks: [{ days: week1 }, { days: week2 }],
  };
}

// ----------------------------- Chat Safety ----------------------------
const MEDICAL_REGEX = /(diagnos|injur|fractur|ruptur|dosage|medicat|ibuprofen|antibiotic|tendon|sciatica|numbness|sharp pain|shooting pain|swollen|inflamm)/i;

function chatReply(message: string, goal: Goal): { type: "refusal" | "motivation"; text: string } {
  if (MEDICAL_REGEX.test(message)) {
    return {
      type: "refusal",
      text:
        "I can’t help with diagnosis or treatment. For medical concerns, please consult a licensed professional. I can help with motivation and general training tips that aren’t medical.",
    };
  }
  const bank: Record<Goal, string[]> = {
    strength: [
      "Today’s focus: quality sets at RPE 7. Leave one good rep in the tank and keep rest to ~120s.",
      "Small jumps win. Add 2.5–5% when all sets felt like RPE ≤7 last week.",
    ],
    "fat-loss": [
      "Consistency beats intensity: hit your planned days and keep rests tight (60–90s).",
      "Log your session today—short sessions count and keep the habit alive.",
    ],
    general: [
      "Show up for 30 minutes. You’ll feel better after the first set—start with the warm-up.",
      "Missed a day? Continue where you left off. Progress isn’t lost—just resume the plan.",
    ],
  };
  const choices = bank[goal] ?? bank.general;
  // deterministic pick based on length
  const idx = message.length % choices.length;
  return { type: "motivation", text: choices[idx] };
}

// ----------------------------- UI Helpers -----------------------------
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
        active ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300 hover:bg-slate-50"
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
        active ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-300 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

// ------------------------------- App ---------------------------------
export default function FitnessCoachApp() {
  const [tab, setTab] = useState<"onboarding" | "plan" | "logger" | "dashboard" | "chat">("onboarding");

  // Onboarding state
  const [profile, setProfile] = useState<OnboardingProfile>({
    name: "",
    email: "",
    equipment: [],
    schedule: 3,
    experience: "novice",
    goal: "general",
    unit: "kg",
  });

  // Plan + logs
  const [plan, setPlan] = useState<Plan | null>(null);
  const [acceptedPlanId, setAcceptedPlanId] = useState<string | null>(null);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);

  // Derived adherence
  const thisWeekScheduled = useMemo(() => {
    if (!plan) return 0;
    const days = plan.weeks[0]?.days?.length ?? 0; // use week 1 for demo
    return Math.min(days, profile.schedule || 0);
  }, [plan, profile.schedule]);
  const thisWeekCompleted = useMemo(() => {
    if (!plan) return 0;
    const woIds = new Set(plan.weeks[0]?.days?.map((d) => d.id));
    return logs.filter((l) => woIds.has(l.workoutId)).length;
  }, [plan, logs]);
  const adherence = thisWeekScheduled ? Math.min(1, thisWeekCompleted / thisWeekScheduled) : 0;

  // Helpers
  const toggleEquipment = (k: OnboardingProfile["equipment"][number]) => {
    setProfile((p) => ({
      ...p,
      equipment: p.equipment.includes(k) ? p.equipment.filter((x) => x !== k) : [...p.equipment, k],
    }));
  };

  const canSubmitOnboarding = profile.name && profile.email && profile.equipment.length > 0 && profile.schedule >= 1;

  const generatePlan = () => {
    const p = buildDeterministicPlan(profile);
    setPlan(p);
    setTab("plan");
  };

  const acceptPlan = () => {
    if (!plan) return;
    setAcceptedPlanId(plan.id);
    alert("Plan accepted! You can now log a workout.");
    setTab("logger");
  };

  const saveLog = (workoutId: string, entries: WorkoutLog["entries"]) => {
    setLogs((prev) => [...prev, { workoutId, entries, createdAt: new Date().toISOString() }]);
    setTab("dashboard");
  };

  // --------------------------- Render helpers ---------------------------
  const EquipmentSelector = () => (
    <div className="flex flex-wrap gap-2">
      {["dumbbells", "bands", "bodyweight", "gym"].map((k) => (
        <Pill key={k} active={profile.equipment.includes(k as any)} onClick={() => toggleEquipment(k as any)}>
          {k}
        </Pill>
      ))}
    </div>
  );

  const PlanView = () => {
    if (!plan) return <p className="text-slate-600">No plan yet. Generate one from the Onboarding tab.</p>;
    return (
      <div className="space-y-4">
        {plan.weeks.map((w, wi) => (
          <Section key={wi} title={`Week ${wi + 1}`}>
            <div className="grid md:grid-cols-2 gap-4">
              {w.days.map((d, di) => (
                <div key={d.id} className="rounded-xl border p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">Day {di + 1}: {d.title}</div>
                    <button
                      onClick={() => setTab("logger")}
                      className="text-xs px-2 py-1 rounded-lg border border-slate-300 hover:bg-slate-50"
                    >
                      Log this
                    </button>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-1">
                    {d.exercises.map((ex) => (
                      <li key={ex.exerciseId} className="flex items-center justify-between">
                        <span>
                          {getExercise(ex.exerciseId).name}
                        </span>
                        <span className="text-slate-500">
                          {ex.sets.length}×{ex.sets[0].reps} @ RPE {ex.sets[0].rpe}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>
        ))}
      </div>
    );
  };

  const FirstWorkoutLogger = () => {
    if (!plan) return null;
    const w = plan.weeks[0].days[0];
    const [entries, setEntries] = useState<WorkoutLog["entries"]>(() =>
      w.exercises.flatMap((ex) =>
        ex.sets.map((s, i) => ({ exerciseId: ex.exerciseId, set: i + 1, weight: 0, reps: s.reps, rpe: s.rpe }))
      )
    );

    const update = (idx: number, patch: Partial<LogEntry>) => {
      setEntries((arr) => arr.map((e, i) => (i === idx ? { ...e, ...patch } : e)));
    };

    return (
      <div className="space-y-4">
        <Section title={`Log: ${w.title}`} right={<span className="text-xs text-slate-500">Unit: {profile.unit}</span>}>
          <div className="space-y-3">
            {entries.map((e, i) => (
              <div key={i} className="grid grid-cols-12 items-end gap-2">
                <div className="col-span-4">
                  <div className="text-sm text-slate-700">{getExercise(e.exerciseId).name}</div>
                  <div className="text-xs text-slate-500">Set {e.set} • Target RPE {e.rpe}</div>
                </div>
                <div className="col-span-3">
                  <Field label={`Weight (${profile.unit})`}>
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2"
                      value={e.weight}
                      onChange={(ev) => update(i, { weight: Number(ev.target.value) })}
                      min={0}
                    />
                  </Field>
                </div>
                <div className="col-span-2">
                  <Field label="Reps">
                    <input
                      type="number"
                      className="w-full border rounded-lg px-3 py-2"
                      value={e.reps}
                      onChange={(ev) => update(i, { reps: Number(ev.target.value) })}
                      min={1}
                    />
                  </Field>
                </div>
                <div className="col-span-3">
                  <Field label="Notes (optional)">
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2"
                      placeholder="How did it feel?"
                      onChange={(ev) => update(i, { notes: ev.target.value })}
                    />
                  </Field>
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <button
                onClick={() => saveLog(w.id, entries)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90"
              >
                Save session
              </button>
            </div>
          </div>
        </Section>
      </div>
    );
  };

  const Dashboard = () => (
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
      <div className="md:col-span-3 rounded-2xl border p-4 bg-white">
        <div className="text-sm text-slate-600">Most recent logs</div>
        <ul className="mt-2 space-y-1 text-sm">
          {logs.slice(-5).map((l, i) => (
            <li key={i} className="text-slate-700">
              {new Date(l.createdAt).toLocaleString()} — {l.entries.length} sets logged
            </li>
          ))}
          {logs.length === 0 && <li className="text-slate-500">No logs yet.</li>}
        </ul>
      </div>
    </div>
  );

  const Chat = () => {
    const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
      { role: "assistant", text: "Hi! I’m your training buddy. I can help with motivation and general tips (not medical advice)." },
    ]);
    const [text, setText] = useState("");

    const send = () => {
      if (!text.trim()) return;
      const userMsg = { role: "user" as const, text };
      const reply = chatReply(text, profile.goal);
      const botMsg = { role: "assistant" as const, text: reply.text };
      setMessages((m) => [...m, userMsg, botMsg]);
      setText("");
    };

    return (
      <div className="space-y-3">
        <div className="rounded-xl border p-3 bg-amber-50 text-amber-900 text-sm">
          Coaching suggestions are general and <b>not medical advice</b>.
        </div>
        <div className="rounded-2xl border h-72 overflow-y-auto p-4 bg-white space-y-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.role === "user" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-800"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1 border rounded-xl px-3 py-2"
            placeholder="Ask for motivation or general training tips..."
          />
          <button onClick={send} className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Send</button>
        </div>
      </div>
    );
  };

  // ------------------------------- UI -------------------------------
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-tight">AI Fitness & Health Trainer</div>
          <nav className="flex gap-2">
            <TabButton active={tab === "onboarding"} onClick={() => setTab("onboarding")}>Onboarding</TabButton>
            <TabButton active={tab === "plan"} onClick={() => setTab("plan")}>Plan</TabButton>
            <TabButton active={tab === "logger"} onClick={() => setTab("logger")}>Logger</TabButton>
            <TabButton active={tab === "dashboard"} onClick={() => setTab("dashboard")}>Dashboard</TabButton>
            <TabButton active={tab === "chat"} onClick={() => setTab("chat")}>Chat</TabButton>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Onboarding */}
        {tab === "onboarding" && (
          <Section title="Onboarding & Goals" right={<span className="text-xs text-slate-500">Step 1</span>}>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Name">
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <input
                  className="w-full border rounded-lg px-3 py-2"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </Field>
              <Field label="Equipment (choose one or more)">
                <EquipmentSelector />
              </Field>
              <Field label="Days per week (1–6)">
                <input
                  type="number"
                  min={1}
                  max={6}
                  className="w-full border rounded-lg px-3 py-2"
                  value={profile.schedule}
                  onChange={(e) => setProfile({ ...profile, schedule: Math.max(1, Math.min(6, Number(e.target.value))) })}
                />
              </Field>
              <Field label="Experience">
                <div className="flex gap-2">
                  {(["novice", "intermediate", "advanced"] as Experience[]).map((v) => (
                    <Pill key={v} active={profile.experience === v} onClick={() => setProfile({ ...profile, experience: v })}>
                      {v}
                    </Pill>
                  ))}
                </div>
              </Field>
              <Field label="Primary Goal">
                <div className="flex gap-2">
                  {(["general", "strength", "fat-loss"] as Goal[]).map((v) => (
                    <Pill key={v} active={profile.goal === v} onClick={() => setProfile({ ...profile, goal: v })}>
                      {v}
                    </Pill>
                  ))}
                </div>
              </Field>
              <Field label="Units">
                <div className="flex gap-2">
                  {(["kg", "lb"] as const).map((v) => (
                    <Pill key={v} active={profile.unit === v} onClick={() => setProfile({ ...profile, unit: v })}>
                      {v}
                    </Pill>
                  ))}
                </div>
              </Field>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                disabled={!canSubmitOnboarding}
                onClick={generatePlan}
                className={`px-4 py-2 rounded-xl ${
                  canSubmitOnboarding ? "bg-slate-900 text-white hover:opacity-90" : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                Generate Plan
              </button>
            </div>
          </Section>
        )}

        {/* Plan */}
        {tab === "plan" && (
          <div className="space-y-4">
            <Section title="Your Plan" right={<span className="text-xs text-slate-500">Step 2</span>}>
              <PlanView />
              <div className="mt-4 flex items-center justify-end gap-2">
                <button onClick={generatePlan} className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50">Regenerate</button>
                <button onClick={acceptPlan} className="px-4 py-2 rounded-xl bg-slate-900 text-white hover:opacity-90">Accept Plan</button>
              </div>
            </Section>
          </div>
        )}

        {/* Logger */}
        {tab === "logger" && (
          <Section title="Workout Logger" right={<span className="text-xs text-slate-500">Step 3</span>}>
            {acceptedPlanId ? <FirstWorkoutLogger /> : <p className="text-slate-600">Accept a plan first to log a session.</p>}
          </Section>
        )}

        {/* Dashboard */}
        {tab === "dashboard" && (
          <Section title="Dashboard" right={<span className="text-xs text-slate-500">Overview</span>}>
            <Dashboard />
          </Section>
        )}

        {/* Chat */}
        {tab === "chat" && (
          <Section title="Coach Chat" right={<span className="text-xs text-slate-500">General guidance only</span>}>
            <Chat />
          </Section>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} AI Fitness & Health Trainer • Demo UI • Not medical advice
      </footer>
    </div>
  );
}
