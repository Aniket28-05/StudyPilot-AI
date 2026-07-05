import React, { useState, useEffect } from 'react';
import { db } from '../mockFirebase';
import type { UserProfile } from '../mockFirebase';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Check, 
  MapPin, 
  GraduationCap, 
  Sparkles,
  Lock
} from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(db.getProfile());
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form states
  const [name, setName] = useState(profile.name);
  const [fieldOfStudy, setFieldOfStudy] = useState(profile.fieldOfStudy);
  const [university, setUniversity] = useState(profile.university);
  const [dailyGoal, setDailyGoal] = useState(profile.dailyStudyGoal);

  // Sync profile live
  useEffect(() => {
    const handleProfileUpdate = () => {
      const p = db.getProfile();
      setProfile(p);
      setName(p.name);
      setFieldOfStudy(p.fieldOfStudy);
      setUniversity(p.university);
      setDailyGoal(p.dailyStudyGoal);
    };
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = db.updateProfile({
      name,
      fieldOfStudy,
      university,
      dailyStudyGoal: dailyGoal
    });
    setProfile(updated);
    setIsEditing(false);

    // Dispatch profile update to sync across layout
    window.dispatchEvent(new Event('profile-updated'));
    alert("Profile details updated successfully!");
  };

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.targetXp) * 100));

  // Compute statistics from LocalStorage arrays directly to make stats accurate
  const totalTasks = db.getTasks();
  const completedTasksCount = totalTasks.filter(t => t.completed).length;
  
  const studyPlans = db.getPlans();
  const completedPlanTopicsCount = studyPlans.reduce((acc, p) => acc + p.topics.filter(t => t.completed).length, 0);

  const mockLockedBadges = [
    { id: 'b4', name: 'XP Overlord', icon: '🏆', description: 'Reach Level 10 Student status' },
    { id: 'b5', name: 'Task Crusher', icon: '⚡', description: 'Complete 25 study checklist tasks' },
    { id: 'b6', name: 'Perfect Planner', icon: '🛡️', description: 'Generate and complete 3 study curricula' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Profile Overview Card */}
      <div className="glass-panel border border-gray-800 rounded-3xl p-6 lg:p-8 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-violet-600/5 blur-[90px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          
          {/* Avatar and Main Info */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 p-1">
              <div className="w-full h-full rounded-full bg-[#0d091a] flex items-center justify-center font-extrabold text-white text-3xl">
                {profile.name.charAt(0)}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">{profile.name}</h3>
              
              <div className="space-y-1">
                <span className="text-xs text-violet-400 font-semibold flex items-center justify-center md:justify-start gap-1.5">
                  <GraduationCap className="h-4 w-4" />
                  <span>{profile.fieldOfStudy}</span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium flex items-center justify-center md:justify-start gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{profile.university}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Edit Profile Switcher */}
          <div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl border border-gray-800 hover:border-violet-500/40 bg-white/[0.02] text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Editing Profile panel Form */}
        {isEditing && (
          <form onSubmit={handleSave} className="mt-8 pt-6 border-t border-gray-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn relative z-10">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-xl text-xs glass-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Field of Study</label>
              <input
                type="text"
                required
                value={fieldOfStudy}
                onChange={(e) => setFieldOfStudy(e.target.value)}
                className="w-full px-4 py-2 rounded-xl text-xs glass-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">University</label>
              <input
                type="text"
                required
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-4 py-2 rounded-xl text-xs glass-input"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Daily Study Goal (Hours)</label>
              <input
                type="number"
                min={1}
                max={15}
                required
                value={dailyGoal}
                onChange={(e) => setDailyGoal(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-xl text-xs glass-input"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white shadow-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Check className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Gamification Level & XP Progress card */}
      <div className="glass-panel border border-gray-800 rounded-3xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Leveling Progression</span>
            <h4 className="font-bold text-white tracking-wide mt-0.5">Experience & Level</h4>
          </div>
          <span className="text-xs text-violet-300 font-bold bg-violet-500/10 border border-violet-500/20 px-2.5 py-1 rounded-xl">
            Lvl {profile.level} Student
          </span>
        </div>

        {/* XP Progress slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400 font-semibold">
            <span>XP: {profile.xp} / {profile.targetXp}</span>
            <span>{xpPercent}% towards level {profile.level + 1}</span>
          </div>
          <div className="w-full bg-gray-950 rounded-full h-3.5 overflow-hidden border border-gray-900 p-0.5">
            <div 
              className="bg-gradient-to-r from-violet-500 to-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${xpPercent}%` }}
            ></div>
          </div>
          <p className="text-[9px] text-gray-550 leading-relaxed pt-1 flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-violet-400" />
            <span>Complete Pomodoro sessions (+50 XP), solve tasks (+100 XP), and update study calendar events (+15 XP) to level up!</span>
          </p>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Tasks Done */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-5 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">{completedTasksCount}</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Completed Tasks</span>
          </div>
        </div>

        {/* Study Hours Completed */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-5 flex items-center gap-4">
          <div className="p-3 bg-violet-500/10 rounded-2xl text-violet-400 border border-violet-500/20">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">{profile.weeklyStudyHours.reduce((a,b)=>a+b, 0)} hrs</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Weekly Focus Time</span>
          </div>
        </div>

        {/* Syllabus topics finished */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white block">{completedPlanTopicsCount}</span>
            <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Curriculum Items Checked</span>
          </div>
        </div>
      </div>

      {/* Badges Panel: Unlocked vs Locked */}
      <div className="glass-panel border border-gray-800 rounded-3xl p-6">
        <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-6 block border-b border-gray-850 pb-2">Academic Badge Accomplishments</span>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          
          {/* Unlocked Badges */}
          {profile.badges.map(badge => (
            <div key={badge.id} className="p-4 rounded-2xl border border-violet-900/30 bg-violet-950/5 flex gap-4 items-center">
              <div className="text-3xl p-2.5 rounded-2xl bg-violet-500/10 border border-violet-500/20 animate-float shadow shadow-violet-500/10">
                {badge.icon}
              </div>
              <div className="overflow-hidden">
                <h5 className="font-bold text-xs text-white truncate">{badge.name}</h5>
                <p className="text-[9px] text-gray-400 mt-0.5 leading-normal">{badge.description}</p>
                <span className="text-[8px] text-violet-400 block mt-1">Unlocked {badge.unlockedAt}</span>
              </div>
            </div>
          ))}

          {/* Locked Badges */}
          {mockLockedBadges.map(badge => (
            <div key={badge.id} className="p-4 rounded-2xl border border-gray-900 bg-black/10 flex gap-4 items-center opacity-45 hover:opacity-75 transition">
              <div className="text-3xl p-2.5 rounded-2xl bg-gray-900 border border-gray-800 text-gray-600 relative">
                <Lock className="h-3.5 w-3.5 text-gray-500 absolute top-1 right-1" />
                <span>{badge.icon}</span>
              </div>
              <div className="overflow-hidden">
                <h5 className="font-bold text-xs text-gray-400 truncate">{badge.name}</h5>
                <p className="text-[9px] text-gray-500 mt-0.5 leading-normal">{badge.description}</p>
                <span className="text-[8px] text-gray-600 block mt-1">Status: Locked</span>
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
