import React, { useState, useEffect } from 'react';
import { db } from '../mockFirebase';
import type { CalendarEvent } from '../mockFirebase';
import { 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';

export default function Calendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  // Event creator form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'exam' | 'class' | 'study' | 'deadline'>('study');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [duration, setDuration] = useState(60);
  const [description, setDescription] = useState('');

  // Calendar display state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  useEffect(() => {
    setEvents(db.getEvents());
  }, []);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    db.addEvent({
      title,
      type,
      date,
      time,
      duration,
      description
    });

    setEvents(db.getEvents());
    setTitle('');
    setDescription('');
    
    // Trigger profile sync for XP
    window.dispatchEvent(new Event('profile-updated'));

    alert(`Event scheduled! Earned +15 XP.`);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Delete this event from your study calendar?")) {
      const updated = db.deleteEvent(id);
      setEvents(updated);
    }
  };

  // Calendar Calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  const firstDayIndex = new Date(year, month, 1).getDay(); // Day index of the first of the month
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate(); // Number of days in current month

  // Create empty padding for the days before the first day of the month
  const daysPadding = Array(firstDayIndex === 0 ? 6 : firstDayIndex - 1).fill(null); // Aligning with Monday starting week
  const monthDays = Array.from({ length: totalDaysInMonth }, (_, idx) => idx + 1);
  const gridCells = [...daysPadding, ...monthDays];

  // Helper to change month
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (dayNum: number) => {
    const formattedDay = dayNum.toString().padStart(2, '0');
    const formattedMonth = (month + 1).toString().padStart(2, '0');
    const checkDateStr = `${year}-${formattedMonth}-${formattedDay}`;
    return events.filter(e => e.date === checkDateStr);
  };

  const getBadgeStyles = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'exam':
        return 'bg-red-500/20 text-red-400 border border-red-500/20';
      case 'class':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/20';
      case 'deadline':
        return 'bg-amber-500/20 text-amber-400 border border-amber-500/20';
      case 'study':
      default:
        return 'bg-violet-500/20 text-violet-400 border border-violet-500/20';
    }
  };

  const sortedSchedule = [...events]
    .filter(e => new Date(e.date) >= new Date(new Date().toDateString()))
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Left Column: Form & Schedule List */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Event Creator Form */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-800/60">
            <Plus className="h-4.5 w-4.5 text-violet-400 animate-float" />
            <h4 className="font-bold text-white text-sm">Schedule Session</h4>
          </div>

          <form onSubmit={handleAddEvent} className="space-y-4">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Event Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Calculus Exam prep"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            {/* Type & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-[#120d22] border border-gray-800 text-gray-200 focus:outline-none"
                >
                  <option value="study">📚 Study</option>
                  <option value="class">🏫 Class</option>
                  <option value="exam">📝 Exam</option>
                  <option value="deadline">⚠️ Deadline</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Duration (m)</label>
                <input
                  type="number"
                  min={0}
                  max={300}
                  required
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
                />
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Date</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Time</label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs glass-input"
                />
              </div>
            </div>

            {/* Location / Desc */}
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-400">Room / Info</label>
              <input
                type="text"
                placeholder="e.g. Hall A, Zoom link"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-xs glass-input"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full glass-button py-3 rounded-xl font-bold text-white shadow-lg text-xs cursor-pointer"
            >
              <span>Add to Calendar</span>
            </button>
          </form>
        </div>

        {/* Schedule List */}
        <div className="glass-panel border border-gray-800 rounded-3xl p-5 space-y-4">
          <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block border-b border-gray-800/60 pb-2">Upcoming Events</span>
          {sortedSchedule.length === 0 ? (
            <p className="text-[10px] text-gray-650 text-center py-4">No scheduled upcoming dates.</p>
          ) : (
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {sortedSchedule.map(e => (
                <div key={e.id} className="flex justify-between items-start gap-2 text-xs border-b border-gray-850 pb-2 last:border-none">
                  <div>
                    <h5 className="font-semibold text-gray-200">{e.title}</h5>
                    <div className="flex gap-2 text-[9px] text-gray-500 mt-1 font-medium">
                      <span>{e.date} at {e.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(e.id)}
                    className="p-1 hover:text-red-400 text-gray-600 transition"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Month Grid display */}
      <div className="lg:col-span-3 glass-panel border border-gray-800 rounded-3xl p-6 flex flex-col justify-between">
        
        {/* Month Selector header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-violet-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              {monthNames[month]} {year}
            </h3>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={prevMonth}
              className="p-2.5 bg-white/[0.02] border border-gray-800 hover:border-gray-700 rounded-xl text-gray-300 hover:text-white transition cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2.5 bg-white/[0.02] border border-gray-800 hover:border-gray-700 rounded-xl text-gray-300 hover:text-white transition cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days of Week header */}
        <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-2.5 flex-1 min-h-[300px]">
          {gridCells.map((day, idx) => {
            const hasDay = day !== null;
            const dayEvents = hasDay ? getEventsForDate(day) : [];
            const isToday = hasDay && day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

            return (
              <div
                key={idx}
                className={`p-1.5 min-h-[70px] rounded-2xl border transition flex flex-col justify-between ${
                  !hasDay 
                    ? 'border-transparent bg-transparent opacity-0' 
                    : isToday
                      ? 'border-violet-500 bg-violet-950/15 shadow shadow-violet-500/10'
                      : 'border-gray-850 bg-black/15 hover:border-gray-850 hover:bg-white/[0.01]'
                }`}
              >
                {hasDay && (
                  <>
                    {/* Day Number */}
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] font-bold ${isToday ? 'text-violet-400 bg-violet-500/10 w-5 h-5 flex items-center justify-center rounded-full border border-violet-500/20' : 'text-gray-400'}`}>
                        {day}
                      </span>
                    </div>

                    {/* Day events badges list */}
                    <div className="space-y-1 mt-1.5 overflow-hidden max-h-[48px]">
                      {dayEvents.map(e => (
                        <div
                          key={e.id}
                          className={`text-[8px] px-1.5 py-0.5 rounded truncate font-medium ${getBadgeStyles(e.type)}`}
                          title={`${e.title} - ${e.time}`}
                        >
                          {e.title}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
