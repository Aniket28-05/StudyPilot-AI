import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Calendar, CheckSquare, Award, ArrowRight, Flame } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI Study Assistant & Coach',
      desc: 'Ask complex academic questions and interact with tailored study coach personas designed to adapt to your style.',
      color: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400'
    },
    {
      icon: Calendar,
      title: 'AI Custom Study Planner',
      desc: 'Input your exam date and subject matter, and watch our smart planner generate daily checklist goals that balance workload.',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30 text-blue-400'
    },
    {
      icon: CheckSquare,
      title: 'Smart Task Prioritizer',
      desc: 'Add tasks and let the AI organize your work automatically by importance, estimated time, and deadline proximity.',
      color: 'from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400'
    },
    {
      icon: Award,
      title: 'Gamified Progress & XP',
      desc: 'Earn experience points for checking off study tasks and unlocking badges. Levels and streaks keep you motivated.',
      color: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400'
    }
  ];

  return (
    <div className="min-h-screen bg-[#08060f] relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-violet-900/10 blur-[150px] animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[150px] animate-pulse-slow" style={{ animationDelay: '4s' }}></div>

      {/* Top Navbar */}
      <header className="relative w-full max-w-7xl mx-auto px-6 h-20 flex justify-between items-center z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="h-5 w-5 text-white animate-float" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wider text-white">
              STUDY<span className="text-violet-400">PILOT</span>
            </h1>
            <span className="text-[10px] text-gray-400 font-medium block">AI Learning Companion</span>
          </div>
        </div>
        <div>
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 rounded-xl border border-gray-800 hover:border-violet-500/40 bg-white/[0.02] text-sm text-gray-300 hover:text-white transition duration-200"
          >
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row items-center gap-16 z-10 flex-1">
        
        {/* Left text description */}
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-xs text-violet-300 font-medium">
            <Flame className="h-3.5 w-3.5 text-amber-500" />
            <span>Power Up Your Exams with AI</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Pilot Your Way to <br className="hidden sm:inline" />
            <span className="text-gradient">Academic Excellence</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
            StudyPilot AI is the ultimate gamified student assistant. Instantly generate customized study timetables, debug code, tackle math with step-by-step guidance, and track your study focus as you gain levels and badges.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-2">
            <button
              onClick={() => navigate('/login')}
              className="glass-button px-8 py-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition cursor-pointer"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl border border-gray-800 hover:border-gray-700 bg-white/[0.01] hover:bg-white/[0.04] text-gray-300 hover:text-white font-medium text-center transition"
            >
              Explore Features
            </a>
          </div>

          {/* Quick numbers */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-800/80">
            <div>
              <div className="text-2xl font-bold text-white">94%</div>
              <div className="text-xs text-gray-500 mt-0.5">Grade Improvement</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">40h+</div>
              <div className="text-xs text-gray-500 mt-0.5">Study Time Saved/mo</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">100k+</div>
              <div className="text-xs text-gray-500 mt-0.5">Flashcards Generated</div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Mockup */}
        <div className="flex-1 w-full max-w-md lg:max-w-none relative animate-float">
          
          {/* Glass Card Container */}
          <div className="glass-panel border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            
            {/* Mock Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-800/60 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-xs text-violet-400 font-semibold uppercase tracking-wider bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/20">AI Study Coach Active</span>
            </div>

            {/* Mock Chat Prompt bubbles */}
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-white/[0.02] border border-gray-800/50 rounded-2xl max-w-[85%] text-xs text-gray-400">
                How do I calculate the limit of f(x) as x approaches infinity?
              </div>
              <div className="p-4 bg-violet-950/20 border border-violet-900/30 rounded-2xl text-xs text-violet-200">
                🧠 <strong>StudyCoach AI:</strong> As x approaches infinity, check the highest powers of the numerator and denominator:
                <div className="bg-black/40 p-2 rounded-lg font-mono text-[10px] text-purple-300 my-2">
                  lim(x-&gt;inf) (2x^2 + 5) / (3x^2 - 1) = 2/3
                </div>
                Since the degrees are equal, the limit is the ratio of leading coefficients. Ready to practice?
              </div>
            </div>

            {/* Mock Task List */}
            <div className="space-y-2 border-t border-gray-800/60 pt-4">
              <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Today's Smart List</span>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-gray-800/40 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-violet-500 flex items-center justify-center bg-violet-500/20 text-violet-300 font-bold text-[10px]">✓</div>
                  <span className="line-through text-gray-500">Physics Optics Lab Report</span>
                </div>
                <span className="text-[10px] bg-red-950/30 text-red-400 px-2 py-0.5 rounded border border-red-900/20 font-medium">High</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-gray-800/40 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border border-gray-600"></div>
                  <span className="text-gray-300">Prepare Calculus derivatives quiz</span>
                </div>
                <span className="text-[10px] bg-blue-950/30 text-blue-400 px-2 py-0.5 rounded border border-blue-900/20 font-medium">Medium</span>
              </div>
            </div>

            {/* Glowing Orb Overlay */}
            <div className="absolute right-[-40px] top-[-40px] w-36 h-36 rounded-full bg-violet-600/10 blur-xl pointer-events-none"></div>
          </div>
        </div>
      </main>

      {/* Features Grid Section */}
      <section id="features" className="relative max-w-7xl mx-auto px-6 py-16 lg:py-24 border-t border-gray-900 z-10">
        <div className="text-center max-w-xl mx-auto space-y-4 mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Everything a Student Needs, Powered by AI</h3>
          <p className="text-sm text-gray-400">StudyPilot integrates your schedules, task lists, study guides, and messaging into one unified gamified hub.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div key={feat.title} className="glass-panel-interactive border rounded-2xl p-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center border shadow-inner`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-lg text-white">{feat.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="relative w-full max-w-7xl mx-auto px-6 py-6 border-t border-gray-900/60 z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <div>
          &copy; {new Date().getFullYear()} StudyPilot AI. All rights reserved. Made for academic success.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-300">Privacy Policy</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-gray-300">Terms of Service</a>
          <span>&middot;</span>
          <a href="#" className="hover:text-gray-300">Support</a>
        </div>
      </footer>
    </div>
  );
}
