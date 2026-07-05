import React, { useState, useEffect } from 'react';
import { db } from '../mockFirebase';
import type { StudyPlan } from '../mockFirebase';
import { 
  BookOpen, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  Brain
} from 'lucide-react';

export default function StudyPlanner() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [subject, setSubject] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(2);
  const [dailyHours, setDailyHours] = useState(2);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string>('');

  useEffect(() => {
    const list = db.getPlans();
    setPlans(list);
    if (list.length > 0) {
      setActivePlanId(list[0].id);
    }
  }, []);

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setLoading(true);

    setTimeout(() => {
      // Generate mock topics based on weeks
      const mockTopicTemplates = [
        "Core Terminology & foundational axioms review",
        "Key equations & formula derivation practices",
        "Analyzing complex case studies or code architectures",
        "Problem set review & peer discussion topics",
        "Intermediate review & milestone self-assessments",
        "Advanced implementation & performance tweaks",
        "Past exams analysis & review of weak concepts",
        "Mock final assessment under exam timings",
        "Final checklist review & summary sheet building"
      ];

      const topics: StudyPlan['topics'] = [];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      const totalTopicsCount = durationWeeks * 4; // 4 topics per week
      for (let i = 0; i < totalTopicsCount; i++) {
        const week = Math.floor(i / 4) + 1;
        const day = days[i % days.length];
        const template = mockTopicTemplates[i % mockTopicTemplates.length];
        
        topics.push({
          id: `t_${Math.random().toString(36).substr(2, 9)}`,
          title: `[W${week}] ${template}`,
          completed: false,
          week,
          day
        });
      }

      const endDate = new Date(new Date(startDate).getTime() + (durationWeeks * 7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];

      const newPlan = db.addPlan({
        subject,
        startDate,
        endDate,
        dailyHours,
        topics
      });

      const updatedList = db.getPlans();
      setPlans(updatedList);
      setActivePlanId(newPlan.id);
      setSubject('');
      setLoading(false);

      // Dispatch profile XP update
      window.dispatchEvent(new Event('profile-updated'));

      alert(`AI Study Coach generated a ${durationWeeks}-week study plan for ${subject}! You earned +150 XP.`);
    }, 1500);
  };

  const handleToggleTopic = (planId: string, topicId: string, completed: boolean) => {
    const updated = db.updatePlanTopic(planId, topicId, completed);
    setPlans(updated);
    // Dispatch profile update to sync XP
    window.dispatchEvent(new Event('profile-updated'));
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm("Are you sure you want to delete this study plan? All progress will be lost.")) {
      const updated = db.deletePlan(planId);
      setPlans(updated);
      if (activePlanId === planId) {
        if (updated.length > 0) {
          setActivePlanId(updated[0].id);
        } else {
          setActivePlanId('');
        }
      }
    }
  };

  const activePlan = plans.find(p => p.id === activePlanId);
  const completedTopicsCount = activePlan ? activePlan.topics.filter(t => t.completed).length : 0;
  const totalTopicsCount = activePlan ? activePlan.topics.length : 0;
  const percentComplete = totalTopicsCount > 0 ? Math.round((completedTopicsCount / totalTopicsCount) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: Form & Plans list */}
      <div className="space-y-6 lg:col-span-1">
        
        {/* Planner Creator Form */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800/60">
            <Brain className="h-4.5 w-4.5 text-violet-400 animate-float" />
            <h4 className="font-bold text-white text-sm">AI Planner Engine</h4>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-4">
            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Subject / Course Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Linear Algebra, Chemistry"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            {/* Weeks */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Weeks Duration</label>
                <select
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#120d22] border border-gray-800 text-gray-200 focus:outline-none focus:border-violet-500/50"
                >
                  <option value={1}>1 Week</option>
                  <option value={2}>2 Weeks</option>
                  <option value={3}>3 Weeks</option>
                  <option value={4}>4 Weeks</option>
                  <option value={6}>6 Weeks</option>
                </select>
              </div>

              {/* Hours */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Daily Study (Hrs)</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  required
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                />
              </div>
            </div>

            {/* Start Date */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            {/* Generate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-1.5 hover:scale-[1.01] transition text-xs cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-t-2 border-r-2 border-white rounded-full animate-spin"></span>
                  <span>Generating Milestones...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Plan with AI</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Active Plans List */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-3 block">My Active Curriculum Plans</span>
          
          {plans.length === 0 ? (
            <div className="py-6 text-center text-xs text-gray-500">
              No active study plans yet. Generate one above!
            </div>
          ) : (
            <div className="space-y-2.5">
              {plans.map(plan => {
                const isActive = plan.id === activePlanId;
                const completed = plan.topics.filter(t => t.completed).length;
                const total = plan.topics.length;
                const percent = Math.round((completed / total) * 100);

                return (
                  <div
                    key={plan.id}
                    onClick={() => setActivePlanId(plan.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex flex-col justify-between h-24 ${
                      isActive 
                        ? 'bg-white/[0.04] border-violet-500/30' 
                        : 'border-gray-800/80 bg-black/10 hover:border-gray-700/60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <h5 className="font-bold text-xs text-white truncate max-w-[80%]">{plan.subject}</h5>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePlan(plan.id);
                        }}
                        className="p-1 hover:text-red-400 text-gray-500 hover:bg-white/[0.05] rounded transition"
                        title="Delete Plan"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between text-[9px] text-gray-500 font-bold mb-1.5">
                        <span>{completed} / {total} topics complete</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-950 rounded-full h-1 border border-gray-900">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-blue-500 h-full rounded-full" 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Active plan curriculum layout */}
      <div className="lg:col-span-2 space-y-6">
        {activePlan ? (
          <div className="glass-panel border border-gray-800 rounded-3xl p-6 space-y-6">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-800/60">
              <div>
                <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Active Plan Summary</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activePlan.subject} Study Track</h3>
                
                <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-400 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="h-3.5 w-3.5 text-violet-400" />
                    <span>Starts {activePlan.startDate} &middot; Ends {activePlan.endDate}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    <span>Daily commitment: {activePlan.dailyHours} hrs</span>
                  </span>
                </div>
              </div>

              {/* Circle percentage tracker */}
              <div className="flex items-center gap-3 bg-violet-950/20 border border-violet-900/30 px-4 py-2 rounded-2xl">
                <TrendingUp className="h-4.5 w-4.5 text-violet-400" />
                <div>
                  <span className="text-lg font-bold text-white block leading-tight">{percentComplete}%</span>
                  <span className="text-[9px] text-gray-500 font-bold uppercase">Syllabus Completion</span>
                </div>
              </div>
            </div>

            {/* Checklist Grid grouped by weeks */}
            <div className="space-y-6">
              {Array.from({ length: Math.max(...activePlan.topics.map(t => t.week)) }).map((_, wIdx) => {
                const weekNum = wIdx + 1;
                const weekTopics = activePlan.topics.filter(t => t.week === weekNum);

                if (weekTopics.length === 0) return null;

                return (
                  <div key={weekNum} className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-400 border-l-2 border-violet-500 pl-2">
                      Week {weekNum} Milestone Goals
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {weekTopics.map(topic => (
                        <div 
                          key={topic.id}
                          onClick={() => handleToggleTopic(activePlan.id, topic.id, !topic.completed)}
                          className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs font-medium ${
                            topic.completed 
                              ? 'bg-emerald-950/10 border-emerald-900/20 text-gray-500' 
                              : 'bg-white/[0.01] border-gray-800/60 text-gray-300 hover:border-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden mr-2">
                            <span className="shrink-0">
                              {topic.completed ? (
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
                              ) : (
                                <Circle className="h-4.5 w-4.5 text-gray-600 hover:text-violet-400" />
                              )}
                            </span>
                            <span className={`truncate ${topic.completed ? 'line-through' : ''}`}>
                              {topic.title}
                            </span>
                          </div>
                          
                          <span className="text-[9px] px-2 py-0.5 bg-black/30 border border-gray-850 rounded text-gray-500">
                            {topic.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="glass-panel border border-gray-800 rounded-3xl p-12 text-center text-xs text-gray-500 flex flex-col items-center justify-center space-y-4">
            <div className="p-4 bg-gray-900 border border-gray-850 rounded-full">
              <BookOpen className="h-10 w-10 text-gray-700 animate-float" />
            </div>
            <div className="space-y-1">
              <h5 className="font-bold text-white text-sm">No Active Study Track Selected</h5>
              <p className="max-w-xs leading-normal">Select an existing curriculum study plan from the list on the left, or configure the AI planner to generate a brand new study trajectory.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
