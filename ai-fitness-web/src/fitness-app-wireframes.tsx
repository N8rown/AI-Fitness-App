import { useState } from 'react';
import { Menu, User, MessageSquare, Calendar, TrendingUp, Trophy, ChevronRight, Plus, Check, Bell } from 'lucide-react';

const WireframeApp = () => {
  const [currentScreen, setCurrentScreen] = useState('home');

  const Screen = ({ children, title }: { children: React.ReactNode; title: string }) => (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-2xl overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b flex items-center justify-between">
        <Menu className="w-6 h-6 text-gray-600" />
        <span className="font-semibold text-gray-800">{title}</span>
        <Bell className="w-6 h-6 text-gray-600" />
      </div>
      <div className="h-[600px] overflow-y-auto">
        {children}
      </div>
    </div>
  );

  const NavBar = ({ active }: { active: string }) => (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t flex justify-around py-3">
      {[
        { id: 'home', icon: Calendar, label: 'Plan' },
        { id: 'log', icon: Plus, label: 'Log' },
        { id: 'chat', icon: MessageSquare, label: 'Coach' },
        { id: 'challenges', icon: Trophy, label: 'Compete' },
        { id: 'profile', icon: User, label: 'Profile' }
      ].map(item => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setCurrentScreen(item.id)}
            className={`flex flex-col items-center gap-1 ${active === item.id ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Fitness App - UI/UX Wireframes</h1>
          <p className="text-gray-600">Click the buttons to explore different screens</p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2 justify-center">
          {[
            { id: 'signin', label: 'Sign In' },
            { id: 'onboarding', label: 'Onboarding' },
            { id: 'home', label: 'Plan View' },
            { id: 'log', label: 'Log Workout' },
            { id: 'chat', label: 'AI Coach' },
            { id: 'challenges', label: 'Challenges' },
            { id: 'profile', label: 'Profile' }
          ].map(screen => (
            <button
              key={screen.id}
              onClick={() => setCurrentScreen(screen.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentScreen === screen.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              }`}
            >
              {screen.label}
            </button>
          ))}
        </div>

        {currentScreen === 'signin' && (
          <Screen title="Welcome">
            <div className="p-6 space-y-6">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">FitAI Coach</h1>
                <p className="text-gray-600">Your personal AI fitness companion</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full px-4 py-2 border rounded-lg" placeholder="your@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" className="w-full px-4 py-2 border rounded-lg" placeholder="••••••••" />
                </div>
              </div>
              <button onClick={() => setCurrentScreen('onboarding')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Sign In</button>
              <div className="text-center">
                <button className="text-blue-600 text-sm">Create Account</button>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 border-t"></div>
                <span className="text-gray-400 text-sm">OR</span>
                <div className="flex-1 border-t"></div>
              </div>
              <div className="space-y-2">
                <button className="w-full border py-2 rounded-lg flex items-center justify-center gap-2">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>Continue with Google
                </button>
                <button className="w-full border py-2 rounded-lg flex items-center justify-center gap-2">
                  <div className="w-5 h-5 bg-gray-300 rounded"></div>Continue with Apple
                </button>
              </div>
            </div>
          </Screen>
        )}

        {currentScreen === 'onboarding' && (
          <Screen title="Get Started">
            <div className="p-6 space-y-6">
              <div className="flex gap-2 mb-4">
                <div className="flex-1 h-2 bg-blue-600 rounded"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                <div className="flex-1 h-2 bg-gray-200 rounded"></div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">What's your primary goal?</h2>
                <p className="text-gray-600 text-sm">We'll create a personalized plan for you</p>
              </div>
              <div className="space-y-3">
                {['Lose Weight', 'Build Muscle', 'Improve Endurance', 'General Fitness', 'Gain Flexibility'].map(goal => (
                  <button key={goal} className="w-full border-2 border-gray-300 hover:border-blue-600 py-4 rounded-lg text-left px-4 flex justify-between items-center">
                    <span className="font-medium">{goal}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                ))}
              </div>
              <div className="pt-4">
                <button onClick={() => setCurrentScreen('home')} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Continue</button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <div className="text-yellow-600 text-xl">⚠️</div>
                  <div className="text-sm text-gray-700">
                    <p className="font-semibold mb-1">Important Safety Notice</p>
                    <p className="text-xs">Consult your physician before starting any fitness program. This app provides general guidance only.</p>
                  </div>
                </div>
              </div>
            </div>
          </Screen>
        )}

        {currentScreen === 'home' && (
          <Screen title="Your Plan">
            <div className="p-6 space-y-6 pb-20">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="text-sm opacity-90 mb-1">Today's Focus</div>
                <h2 className="text-2xl font-bold mb-4">Upper Body Strength</h2>
                <div className="flex gap-4">
                  <div>
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-xs opacity-90">minutes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs opacity-90">exercises</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs opacity-90">sets each</div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">This Week</h3>
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} className={`text-center ${i === 2 ? 'bg-blue-600 text-white' : 'bg-gray-100'} rounded-lg py-3`}>
                      <div className="text-xs mb-1">{day}</div>
                      <div className="text-lg font-bold">{15 + i}</div>
                      {i < 2 && <Check className="w-4 h-4 mx-auto mt-1 text-green-600" />}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Today's Workout</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Barbell Bench Press', sets: '3 sets × 10 reps', time: '5 min' },
                    { name: 'Dumbbell Rows', sets: '3 sets × 12 reps', time: '6 min' },
                    { name: 'Overhead Press', sets: '3 sets × 8 reps', time: '5 min' },
                    { name: 'Pull-ups', sets: '3 sets × 6 reps', time: '4 min' }
                  ].map((exercise, i) => (
                    <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800">{exercise.name}</div>
                        <div className="text-sm text-gray-600">{exercise.sets}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{exercise.time}</div>
                        <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold flex items-center justify-center gap-2">
                Start Workout
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <NavBar active="home" />
          </Screen>
        )}

        {currentScreen === 'log' && (
          <Screen title="Log Activity">
            <div className="p-6 space-y-6 pb-20">
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold">Workout</button>
                <button className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold text-gray-700">Nutrition</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exercise</label>
                <select className="w-full px-4 py-3 border rounded-lg">
                  <option>Select exercise...</option>
                  <option>Bench Press</option>
                  <option>Squats</option>
                  <option>Deadlift</option>
                </select>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sets</label>
                  <input type="number" className="w-full px-4 py-3 border rounded-lg" placeholder="3" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reps</label>
                  <input type="number" className="w-full px-4 py-3 border rounded-lg" placeholder="10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                  <input type="number" className="w-full px-4 py-3 border rounded-lg" placeholder="135" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">How did it feel?</label>
                <div className="flex gap-2">
                  {['Too Easy', 'Just Right', 'Challenging', 'Too Hard'].map(level => (
                    <button key={level} className="flex-1 border-2 border-gray-300 py-2 rounded-lg text-xs hover:border-blue-600">{level}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                <textarea className="w-full px-4 py-3 border rounded-lg" rows={3} placeholder="Form felt good, increased weight from last week..."></textarea>
              </div>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold">Save & Add Another</button>
                <button className="w-full border-2 border-gray-300 py-3 rounded-lg font-semibold text-gray-700">Finish Workout</button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-medium text-gray-800 mb-2">Today's Summary</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex justify-between"><span>Exercises completed:</span><span className="font-semibold">6</span></div>
                  <div className="flex justify-between"><span>Total volume:</span><span className="font-semibold">12,450 lbs</span></div>
                  <div className="flex justify-between"><span>Duration:</span><span className="font-semibold">42 min</span></div>
                </div>
              </div>
            </div>
            <NavBar active="log" />
          </Screen>
        )}

        {currentScreen === 'chat' && (
          <Screen title="AI Coach">
            <div className="flex flex-col h-full pb-20">
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">AI</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Hi! I'm your AI fitness coach. I noticed you completed today's workout. Great job! How are you feeling?</p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="bg-blue-600 text-white rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">Feeling good! But I'm not sure my bench press form is correct</p>
                  </div>
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">AI</div>
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <p className="text-sm">I'd be happy to help with your bench press form! Here are the key points:</p>
                    <ul className="text-sm mt-2 space-y-1 list-disc list-inside">
                      <li>Keep your feet flat on the floor</li>
                      <li>Arch your lower back slightly</li>
                      <li>Grip width slightly wider than shoulders</li>
                      <li>Lower the bar to mid-chest</li>
                    </ul>
                    <p className="text-sm mt-2">Would you like me to send you a video demonstration?</p>
                  </div>
                </div>
                <div className="flex gap-2 justify-center">
                  <button className="bg-white border px-4 py-2 rounded-full text-sm">Send Video</button>
                  <button className="bg-white border px-4 py-2 rounded-full text-sm">Modify My Plan</button>
                  <button className="bg-white border px-4 py-2 rounded-full text-sm">More Tips</button>
                </div>
              </div>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <input type="text" placeholder="Ask me anything..." className="flex-1 px-4 py-3 border rounded-full" />
                  <button className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <NavBar active="chat" />
          </Screen>
        )}

        {currentScreen === 'challenges' && (
          <Screen title="Challenges">
            <div className="p-6 space-y-6 pb-20">
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm">Active</button>
                <button className="flex-1 border-2 border-gray-300 py-2 rounded-lg font-semibold text-sm text-gray-700">Browse</button>
                <button className="flex-1 border-2 border-gray-300 py-2 rounded-lg font-semibold text-sm text-gray-700">Completed</button>
              </div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 text-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-sm opacity-90 mb-1">Current Challenge</div>
                    <h3 className="text-xl font-bold">30-Day Core Strength</h3>
                  </div>
                  <Trophy className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Progress</span><span>12 / 30 days</span></div>
                  <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                    <div className="bg-white rounded-full h-2" style={{width: '40%'}}></div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white border-opacity-30 flex justify-between text-sm">
                  <div><div className="opacity-90">Your Rank</div><div className="text-lg font-bold">#247</div></div>
                  <div><div className="opacity-90">Participants</div><div className="text-lg font-bold">1,823</div></div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Leaderboard</h3>
                <div className="space-y-2">
                  {[
                    { name: 'Sarah M.', score: 2850, rank: 1, avatar: '🥇' },
                    { name: 'Mike R.', score: 2720, rank: 2, avatar: '🥈' },
                    { name: 'Emma K.', score: 2680, rank: 3, avatar: '🥉' },
                    { name: 'You', score: 1940, rank: 247, avatar: '👤' }
                  ].map((user, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${user.name === 'You' ? 'bg-blue-50 border-2 border-blue-600' : 'bg-gray-50'}`}>
                      <div className="text-2xl">{user.avatar}</div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{user.name}</div>
                        <div className="text-sm text-gray-600">{user.score} points</div>
                      </div>
                      <div className="text-gray-500 font-semibold">#{user.rank}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Join New Challenge</h3>
                <div className="space-y-3">
                  {[
                    { name: '10K Steps Daily', participants: 3421, days: 30 },
                    { name: 'Push-up Master', participants: 1829, days: 21 }
                  ].map((challenge, i) => (
                    <div key={i} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-800">{challenge.name}</h4>
                        <button className="text-blue-600 text-sm font-semibold">Join</button>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>{challenge.participants} joined</span>
                        <span>{challenge.days} days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <NavBar active="challenges" />
          </Screen>
        )}

        {currentScreen === 'profile' && (
          <Screen title="Profile">
            <div className="p-6 space-y-6 pb-20">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-300 rounded-full"></div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">Alex Johnson</h2>
                  <p className="text-gray-600 text-sm">Member since Jan 2025</p>
                </div>
                <button className="text-blue-600 text-sm font-semibold">Edit</button>
              </div>
              <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">127</div>
                  <div className="text-xs text-gray-600">Workouts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">89</div>
                  <div className="text-xs text-gray-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">-12</div>
                  <div className="text-xs text-gray-600">lbs Lost</div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Progress</h3>
                <div className="border rounded-lg p-4 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Current Goal</span>
                      <span className="font-semibold">Lose 20 lbs</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 rounded-full h-2" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Start Weight:</span>
                    <span className="font-semibold">185 lbs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current:</span>
                    <span className="font-semibold">173 lbs</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Target:</span>
                    <span className="font-semibold">165 lbs</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Achievements</h3>
                <div className="grid grid-cols-4 gap-3">
                  {['🔥', '💪', '🏆', '⭐', '🎯', '👑', '🌟', '✨'].map((emoji, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-3xl">{emoji}</div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Settings</h3>
                <div className="space-y-2">
                  {['Notifications', 'Privacy', 'Subscription', 'Help & Support', 'About'].map(item => (
                    <button key={item} className="w-full flex justify-between items-center p-3 border rounded-lg">
                      <span className="text-gray-800">{item}</span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
              <button className="w-full text-red-600 py-3 rounded-lg font-semibold border border-red-600">Sign Out</button>
            </div>
            <NavBar active="profile" />
          </Screen>
        )}
      </div>
    </div>
  );
};

export default WireframeApp;