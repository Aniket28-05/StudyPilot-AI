import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '../mockFirebase';
import type { Task, CalendarEvent, UserProfile } from '../mockFirebase';
import { 
  Flame, 
  Clock, 
  Award, 
  Play, 
  Pause, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  Zap 
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>(db.getProfile());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Pomodoro timer state
  const [pomodoroMode, setPomodoroMode] = useState<'study' | 'break'>('study');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [timerActive, setTimerActive] = useState(false);
  const [pomodoroSessionsCompleted, setPomodoroSessionsCompleted] = useState(0);

  // Daily AI Study Tip selection based on current day of week
  const studyTips = [
    { title: "Active Recall", text: "Instead of passively re-reading slides, test your memory. Close the notebook and write down everything you remember. This strengthens retrieval pathways." },
    { title: "Spaced Repetition", text: "Review topics 1 day, 3 days, and 7 days after learning. It prevents the forgetting curve from wiping out your progress." },
    { title: "Feynman Technique", text: "Explain a concept to a 10-year-old in simple terms. If you struggle with the analogy, that is exactly where your understanding is weak." },
    { title: "Interleaving Study", text: "Mix different subjects during a session. Studying math and biology in turns forces the brain to classify and compare patterns." },
    { title: "Cognitive Offloading", text: "Don't store lists in your head. Write down tasks on the Smart To-Do list so you can focus 100% of your energy on studying." },
    { title: "Ultradian Rhythm", text: "Your brain can only sustain peak focus for 90 minutes. Take a 15-minute screen-free break after every long block." }
  ];

  const currentTip = studyTips[new Date().getDay() % studyTips.length];

  useEffect(() => {
    // Load database values
    setTasks(db.getTasks());
    setEvents(db.getEvents());

    // Sync profile
    const syncProfileData = () => {
      setProfile(db.getProfile());
    };
    window.addEventListener('profile-updated', syncProfileData);
    return () => {
      window.removeEventListener('profile-updated', syncProfileData);
    };
  }, []);

  // Pomodoro interval handler
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timerActive && timeLeft === 0) {
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleTimerComplete = () => {
    setTimerActive(false);
    if (pomodoroMode === 'study') {
      // Award XP
      const updated = db.updateUserXp(50); // Completed study session
      setProfile(updated);
      
      // Dispatch profile update event to sidebar
      window.dispatchEvent(new Event('profile-updated'));

      alert("Great job! You finished a 25-minute Pomodoro session and earned +50 XP! Take a short break.");
      
      setPomodoroSessionsCompleted(prev => prev + 1);
      setPomodoroMode('break');
      setTimeLeft(5 * 60); // 5 minute break
    } else {
      alert("Break is over! Time to focus.");
      setPomodoroMode('study');
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(pomodoroMode === 'study' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Process data for dashboard
  const uncompletedTasks = tasks.filter(t => !t.completed);
  const urgentTasks = uncompletedTasks
    .sort((a, b) => {
      const priorityWeights = { High: 3, Medium: 2, Low: 1 };
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    })
    .slice(0, 3);

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
    .slice(0, 2);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Calculate average study hours
  const avgStudyHours = (profile.weeklyStudyHours.reduce((a, b) => a + b, 0) / 7).toFixed(1);

  const handleTaskToggle = (taskId: string, completed: boolean) => {
    const updated = db.updateTask(taskId, { completed });
    setTasks(updated);
    // Dispatch profile update to sync XP
    window.dispatchEvent(new Event('profile-updated'));
    setProfile(db.getProfile());
  };

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="glass-panel border border-violet-500/20 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-violet-600/10 blur-[90px] pointer-events-none"></div>
        <div className="absolute left-[-50px] bottom-[-50px] w-64 h-64 rounded-full bg-blue-600/10 blur-[80px] pointer-events-none"></div>

        <div className="space-y-2 relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 text-xs font-semibold text-violet-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Powered Student Hub</span>
          </div>
          <h3 className="text-2xl lg:text-3xl font-extrabold text-white">
            Welcome back, {profile.name}!
          </h3>
          <p className="text-xs lg:text-sm text-gray-400 max-w-xl">
            You completed <span className="text-violet-400 font-semibold">{tasks.filter(t => t.completed).length} tasks</span> this week. Complete tasks and focus sessions to keep your levels climbing!
          </p>
          
          <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
            <Link 
              to="/chat" 
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white shadow-md shadow-violet-500/20 flex items-center gap-1.5 transition"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI Coach</span>
            </Link>
            <Link 
              to="/planner" 
              className="px-4 py-2 rounded-xl border border-gray-800 bg-white/[0.02] hover:bg-white/[0.05] text-xs font-semibold text-gray-300 transition"
            >
              Generate Study Plan
            </Link>
          </div>
        </div>

        {/* Stats Grid Widget */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0 relative z-10">
          
          {/* Study Streak Card */}
          <div className="glass-panel-light p-4 rounded-2xl flex flex-col justify-between items-center text-center w-36 h-32 border border-gray-800">
            <div className="p-2 bg-orange-500/10 rounded-xl text-orange-400 border border-orange-500/20">
              <Flame className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">5 Days</span>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Study Streak</p>
            </div>
          </div>

          {/* Level Badge Card */}
          <div className="glass-panel-light p-4 rounded-2xl flex flex-col justify-between items-center text-center w-36 h-32 border border-gray-800">
            <div className="p-2 bg-violet-500/10 rounded-xl text-violet-400 border border-violet-500/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Lvl {profile.level}</span>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Academic Grade</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Graph, Pomodoro, Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Weekly study hours graph */}
        <div className="lg:col-span-2 glass-panel border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="font-bold text-white tracking-wide">Weekly Study Statistics</h4>
              <p className="text-xs text-gray-500 mt-0.5">Average study time: {avgStudyHours}h / day</p>
            </div>
            <div className="flex items-center gap-1 bg-white/[0.02] border border-gray-800 px-3 py-1.5 rounded-xl text-[10px] font-bold text-gray-400">
              <Clock className="h-3 w-3 text-violet-400" />
              <span>Current Goal: {profile.dailyStudyGoal}h/day</span>
            </div>
          </div>

          {/* Styled HTML Bar Graph */}
          <div className="flex-1 flex items-end justify-between gap-2.5 h-48 px-2">
            {profile.weeklyStudyHours.map((hours, idx) => {
              const heightPercent = Math.max(10, Math.min(100, (hours / 8) * 100)); // cap max at 8 hours for scale
              const isGoalMet = hours >= profile.dailyStudyGoal;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 bg-gray-900 border border-gray-800 text-[9px] text-gray-200 px-2 py-0.5 rounded shadow-lg transition duration-200 pointer-events-none transform -translate-y-1">
                    {hours} hrs
                  </div>
                  {/* Bar */}
                  <div className="w-full relative rounded-t-lg bg-gray-800/40 border border-gray-800/80 overflow-hidden h-36">
                    <div 
                      className={`absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-500 ${
                        isGoalMet 
                          ? 'bg-gradient-to-t from-violet-600 to-blue-500 group-hover:from-violet-500 group-hover:to-blue-400' 
                          : 'bg-gradient-to-t from-gray-700 to-gray-500 group-hover:from-gray-600 group-hover:to-gray-400'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Glow inside active bars */}
                      {isGoalMet && (
                        <div className="absolute top-0 inset-x-0 h-1 bg-white/20 animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  {/* Day Label */}
                  <span className={`text-[10px] font-semibold ${isGoalMet ? 'text-violet-300' : 'text-gray-500'}`}>
                    {daysOfWeek[idx]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Pomodoro Focus Timer */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 text-center flex flex-col justify-between min-h-[320px] relative overflow-hidden">
          
          {/* Animated gradient ring simulation on study */}
          {timerActive && (
            <div className="absolute inset-0 bg-violet-600/[0.01] pointer-events-none animate-pulse"></div>
          )}

          <div className="flex justify-between items-center border-b border-gray-800/60 pb-3">
            <h4 className="font-bold text-white text-sm tracking-wide text-left flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-violet-400 animate-float" />
              <span>Pomodoro Study Timer</span>
            </h4>
            <span className="text-[10px] text-gray-500 font-semibold">Done: {pomodoroSessionsCompleted}</span>
          </div>

          <div className="my-6">
            {/* Timer Toggle buttons */}
            <div className="inline-flex bg-[#120d22] p-1 rounded-xl border border-gray-800 text-[10px] font-bold mb-5">
              <button 
                onClick={() => {
                  setPomodoroMode('study');
                  setTimerActive(false);
                  setTimeLeft(25 * 60);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${pomodoroMode === 'study' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Focus Block (25m)
              </button>
              <button 
                onClick={() => {
                  setPomodoroMode('break');
                  setTimerActive(false);
                  setTimeLeft(5 * 60);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${pomodoroMode === 'break' ? 'bg-violet-600 text-white shadow' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Rest Break (5m)
              </button>
            </div>

            {/* Time Indicator */}
            <div className="text-4xl font-extrabold text-white tracking-widest font-mono">
              {formatTime(timeLeft)}
            </div>
            <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
              {pomodoroMode === 'study' ? '🔒 Time to focus' : '☕ Relax & Recharge'}
            </p>
          </div>

          {/* Action controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={resetTimer}
              className="p-3 bg-white/[0.02] border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-2xl transition"
              title="Reset timer"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              onClick={toggleTimer}
              className={`px-6 py-3 rounded-2xl font-bold flex items-center gap-1.5 shadow-lg transition hover:scale-[1.03] cursor-pointer text-xs ${
                timerActive 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-violet-500/20'
              }`}
            >
              {timerActive ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Start Focus</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Urgent To-Do and Upcoming Events, and AI Coach Tip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Urgent To-Do Card */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800/60">
              <h4 className="font-bold text-white text-sm">Urgent Tasks</h4>
              <Link to="/todo" className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            
            {urgentTasks.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500">
                🎉 No pending tasks! All caught up.
              </div>
            ) : (
              <div className="space-y-3">
                {urgentTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-gray-800/40 text-xs">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <input 
                        type="checkbox" 
                        checked={task.completed} 
                        onChange={() => handleTaskToggle(task.id, !task.completed)}
                        className="rounded border-gray-800 text-violet-600 focus:ring-violet-500/50 bg-black h-4 w-4 cursor-pointer"
                      />
                      <span className="text-gray-300 truncate font-medium">{task.title}</span>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                      task.priority === 'High' 
                        ? 'bg-red-950/30 text-red-400 border-red-900/20' 
                        : task.priority === 'Medium'
                          ? 'bg-blue-950/30 text-blue-400 border-blue-900/20'
                          : 'bg-gray-900 text-gray-400 border-gray-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-900 mt-4">
            <Link 
              to="/todo" 
              className="w-full py-2 bg-white/[0.02] border border-gray-800 hover:border-gray-700 text-xs text-gray-400 hover:text-white font-semibold flex items-center justify-center gap-1.5 rounded-xl transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create New Task</span>
            </Link>
          </div>
        </div>

        {/* Upcoming Calendar Events Card */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-800/60">
              <h4 className="font-bold text-white text-sm">Next Study Sessions</h4>
              <Link to="/calendar" className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-0.5">
                <span>Calendar</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            
            {upcomingEvents.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-500">
                📅 No events scheduled this week.
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="p-3 rounded-xl bg-white/[0.01] border border-gray-800/40 text-xs flex gap-3 items-center">
                    <div className="text-center p-2 rounded-lg bg-violet-950/20 border border-violet-900/20 w-12 shrink-0">
                      <span className="text-[10px] text-violet-400 block font-bold uppercase">{event.time}</span>
                    </div>
                    <div className="overflow-hidden">
                      <h5 className="font-semibold text-gray-200 truncate">{event.title}</h5>
                      <span className="text-[9px] text-gray-500 block mt-0.5">{event.date} &middot; {event.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-900 mt-4">
            <Link 
              to="/calendar" 
              className="w-full py-2 bg-white/[0.02] border border-gray-800 hover:border-gray-700 text-xs text-gray-400 hover:text-white font-semibold flex items-center justify-center gap-1.5 rounded-xl transition"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Schedule Event</span>
            </Link>
          </div>
        </div>

        {/* AI Tip of the Day Card */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 bg-gradient-to-br from-violet-950/10 to-blue-950/10 flex flex-col justify-between border-violet-900/30">
          <div>
            <div className="flex items-center gap-2 border-b border-gray-800/60 pb-3 mb-4">
              <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Sparkles className="h-4 w-4 animate-float" />
              </div>
              <h4 className="font-bold text-white text-sm">AI Coach Tip of the Day</h4>
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-violet-300">{currentTip.title}</span>
              <p className="text-xs text-gray-400 leading-relaxed">
                {currentTip.text}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-900/60 mt-4 text-center">
            <button 
              onClick={() => navigate('/chat')}
              className="text-xs font-bold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1 transition"
            >
              <span>Learn how with AI Chat</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
