import React, { useState, useEffect } from 'react';
import { db } from '../mockFirebase';
import type { Task } from '../mockFirebase';
import {
  ClipboardList,
  Sparkles,
  Trash2,
  CheckCircle,
  Plus,
  Clock,
  BookOpen,
  Calendar as CalendarIcon,
  Filter,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('Medium');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(60);
  const [showCompleted, setShowCompleted] = useState(false);
  const [filterSubject, setFilterSubject] = useState('All');
  const [aiSortingActive, setAiSortingActive] = useState(false);

  useEffect(() => {
    setTasks(db.getTasks());
  }, []);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim()) return;

    db.addTask({
      title,
      subject,
      priority,
      dueDate,
      duration,
      completed: false
    });

    setTasks(db.getTasks());
    setTitle('');
    setSubject('');

    // Trigger profile sync for XP
    window.dispatchEvent(new Event('profile-updated'));

    alert("Task added successfully! Earn +100 XP when you complete it.");
  };

  const handleToggleTask = (taskId: string, completed: boolean) => {
    const updated = db.updateTask(taskId, { completed });
    setTasks(updated);
    // Dispatch profile update to sync XP
    window.dispatchEvent(new Event('profile-updated'));
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = db.deleteTask(taskId);
    setTasks(updated);
  };

  const handleAISort = () => {
    setAiSortingActive(true);

    setTimeout(() => {
      // Priority weighting formula
      // High priority first, then closer due dates, then shorter duration for quick wins
      const sorted = [...tasks].sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;

        const weight = { High: 30, Medium: 20, Low: 10 };
        const scoreA = weight[a.priority] - (new Date(a.dueDate).getTime() / 86400000) * 0.5 - (a.duration / 60) * 0.1;
        const scoreB = weight[b.priority] - (new Date(b.dueDate).getTime() / 86400000) * 0.5 - (b.duration / 60) * 0.1;

        return scoreB - scoreA;
      });

      setTasks(sorted);
      setAiSortingActive(false);
      alert("AI Priority Optimization complete! Sorted by High priority deadlines first.");
    }, 1000);
  };

  // Extract unique subjects for filtering
  const subjects = ['All', ...Array.from(new Set(tasks.map(t => t.subject)))];

  // Filtering tasks
  const filteredTasks = tasks.filter(t => {
    const matchSubject = filterSubject === 'All' || t.subject === filterSubject;
    return matchSubject;
  });

  const pendingTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Left Column: Create Task Form */}
      <div className="lg:col-span-1 space-y-6">

        {/* Creator Form */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6">

          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800/60">
            <ClipboardList className="h-4.5 w-4.5 text-violet-400" />
            <h4 className="font-bold text-white text-sm">Add New Study Task</h4>
          </div>

          <form onSubmit={handleAddTask} className="space-y-4">

            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Task Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Read Operating Systems Chapter 3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Academic Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Computer Science, Calculus"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            {/* Priority & Duration */}
            <div className="grid grid-cols-2 gap-4">

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#120d22] border border-gray-800 text-gray-200 focus:outline-none focus:border-violet-500/50"
                >
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Est. Mins</label>
                <input
                  type="number"
                  min={5}
                  max={300}
                  required
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                />
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Due Date</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full glass-button py-3 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-1.5 hover:scale-[1.01] transition text-xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add to Study List</span>
            </button>
          </form>
        </div>

        {/* Task Dashboard Statistics */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-5 space-y-4">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Metrics Overview</span>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/10 border border-gray-800 p-3.5 rounded-2xl text-center">
              <span className="text-xl font-bold text-white block">{tasks.filter(t => !t.completed).length}</span>
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Pending Tasks</span>
            </div>
            <div className="bg-emerald-950/15 border border-emerald-900/10 p-3.5 rounded-2xl text-center">
              <span className="text-xl font-bold text-emerald-400 block">{tasks.filter(t => t.completed).length}</span>
              <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Completed Tasks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Task Tracker lists */}
      <div className="lg:col-span-2 space-y-6">

        {/* Controls: AI Sort & Subject Filter */}
        <div className="glass-panel border border-gray-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4">

          {/* Filter dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-gray-500 shrink-0" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs bg-[#120d22] border border-gray-800 text-gray-300 focus:outline-none focus:border-violet-500/50"
            >
              {subjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          </div>

          {/* AI Optimiser Button */}
          <button
            onClick={handleAISort}
            disabled={aiSortingActive}
            className="w-full sm:w-auto px-4 py-2 border border-violet-500/30 bg-violet-950/10 hover:bg-violet-950/20 text-violet-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 hover:border-violet-500/50 transition cursor-pointer disabled:opacity-50"
          >
            {aiSortingActive ? (
              <>
                <span className="w-3.5 h-3.5 border-t-2 border-r-2 border-violet-400 rounded-full animate-spin"></span>
                <span>Optimizing list...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                <span>AI Priority Optimization</span>
              </>
            )}
          </button>
        </div>

        {/* Tasks Checklist */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6 space-y-5">

          <div className="flex justify-between items-center pb-3 border-b border-gray-800/60">
            <h4 className="font-bold text-white text-sm">Study Task Checklist</h4>
            <span className="text-[10px] text-gray-500 font-semibold">{pendingTasks.length} left to complete</span>
          </div>

          {/* Pending items */}
          {pendingTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray-500 flex flex-col items-center justify-center space-y-3">
              <CheckCircle className="h-8 w-8 text-gray-700 animate-float" />
              <span>🎉 All caught up! Create a task to expand your list.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.01] border border-gray-850 hover:border-gray-800 transition text-xs font-medium"
                >
                  <div className="flex items-center gap-3.5 overflow-hidden mr-2">
                    <button
                      onClick={() => handleToggleTask(task.id, true)}
                      className="shrink-0 text-gray-600 hover:text-violet-400 transition"
                    >
                      <Circle className="h-5 w-5" />
                    </button>
                    <div className="overflow-hidden">
                      <span className="text-gray-200 block truncate font-semibold">{task.title}</span>

                      {/* Meta information tags */}
                      <div className="flex items-center gap-3 text-[9px] text-gray-500 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          <span>{task.subject}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{task.duration} mins</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>Due {task.dueDate}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {/* Priority indicator */}
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${task.priority === 'High'
                        ? 'bg-red-950/30 text-red-400 border-red-900/20'
                        : task.priority === 'Medium'
                          ? 'bg-blue-950/30 text-blue-400 border-blue-900/20'
                          : 'bg-gray-900 text-gray-400 border-gray-800'
                      }`}>
                      {task.priority}
                    </span>

                    {/* Trash */}
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 hover:text-red-400 text-gray-500 hover:bg-white/[0.05] rounded transition"
                      title="Delete task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Toggle for completed tasks */}
          {completedTasks.length > 0 && (
            <div className="pt-4 border-t border-gray-900">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-xs text-gray-500 hover:text-gray-400 font-semibold flex items-center gap-1 transition"
              >
                <span>{showCompleted ? 'Hide' : 'Show'} completed tasks ({completedTasks.length})</span>
              </button>

              {showCompleted && (
                <div className="space-y-2 mt-3 animate-fadeIn">
                  {completedTasks.map(task => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01]/40 border border-gray-900 text-xs opacity-50"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <button
                          onClick={() => handleToggleTask(task.id, false)}
                          className="shrink-0 text-emerald-400 hover:text-gray-600 transition"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </button>
                        <span className="line-through text-gray-400 truncate font-semibold">{task.title}</span>
                      </div>

                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1 text-gray-600 hover:text-red-400 rounded transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
