import { useState } from 'react';
import { db } from '../mockFirebase';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Clock, 
  Cpu, 
  Save, 
  RefreshCcw, 
  Info,
  AppWindow
} from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState(db.getSettings());
  
  const [emailNotif, setEmailNotif] = useState(settings.notificationEmail);
  const [pushNotif, setPushNotif] = useState(settings.notificationPush);
  const [reminderTime, setReminderTime] = useState(settings.studyReminderTime);
  const [autoPlanner, setAutoPlanner] = useState(settings.autoPlanner);
  const [theme, setTheme] = useState(settings.theme);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = db.updateSettings({
      notificationEmail: emailNotif,
      notificationPush: pushNotif,
      studyReminderTime: reminderTime,
      autoPlanner: autoPlanner,
      theme: theme
    });
    setSettings(updated);
    alert("Application preferences saved successfully!");
  };

  const handleResetData = () => {
    if (confirm("WARNING: This will clear all custom study tasks, AI plans, messages, calendar events, and reset your student XP levels back to Level 4 defaults. Do you want to proceed?")) {
      localStorage.removeItem('study_pilot_user');
      localStorage.removeItem('study_pilot_tasks');
      localStorage.removeItem('study_pilot_plans');
      localStorage.removeItem('study_pilot_events');
      localStorage.removeItem('study_pilot_chats');
      localStorage.removeItem('study_pilot_profile');
      localStorage.removeItem('study_pilot_settings');
      
      alert("Mock database reset successful! Reloading StudyPilot AI sandbox environment...");
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Settings Panel Container */}
      <div className="glass-panel border border-gray-800 rounded-3xl p-6 lg:p-8">
        
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-gray-800/60">
          <SettingsIcon className="h-5 w-5 text-violet-400" />
          <h3 className="text-lg font-bold text-white tracking-wide">Application Preferences</h3>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Notifications Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bell className="h-4 w-4 text-violet-400" />
              <span>Notification Prompts</span>
            </h4>

            <div className="space-y-3 pl-5">
              {/* Email notifications checkbox */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-gray-850 hover:border-gray-800 text-xs font-medium cursor-pointer transition">
                <div className="space-y-0.5">
                  <span className="text-gray-200 block">Email Reminders</span>
                  <span className="text-[10px] text-gray-500 block font-normal">Receive summary digests of weekly study tasks.</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotif}
                  onChange={(e) => setEmailNotif(e.target.checked)}
                  className="rounded border-gray-800 text-violet-600 focus:ring-violet-500/50 bg-black h-4 w-4 cursor-pointer"
                />
              </label>

              {/* Push notifications checkbox */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-gray-850 hover:border-gray-800 text-xs font-medium cursor-pointer transition">
                <div className="space-y-0.5">
                  <span className="text-gray-200 block">Push Notifications</span>
                  <span className="text-[10px] text-gray-500 block font-normal">Prompt alert popups when Pomodoro blocks finish.</span>
                </div>
                <input
                  type="checkbox"
                  checked={pushNotif}
                  onChange={(e) => setPushNotif(e.target.checked)}
                  className="rounded border-gray-800 text-violet-600 focus:ring-violet-500/50 bg-black h-4 w-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Study Timing Reminder */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-violet-400" />
              <span>Daily Study Reminder</span>
            </h4>

            <div className="pl-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Trigger Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl text-xs glass-input"
                />
              </div>
            </div>
          </div>

          {/* AI Settings Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-violet-400 animate-float" />
              <span>AI Coaching Integration</span>
            </h4>

            <div className="space-y-3 pl-5">
              {/* AI Auto-Planner checkbox */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-gray-850 hover:border-gray-800 text-xs font-medium cursor-pointer transition">
                <div className="space-y-0.5">
                  <span className="text-gray-200 block">AI Auto-Scheduling Engine</span>
                  <span className="text-[10px] text-gray-500 block font-normal">Allow AI to automatically distribute study items across your calendar weekly.</span>
                </div>
                <input
                  type="checkbox"
                  checked={autoPlanner}
                  onChange={(e) => setAutoPlanner(e.target.checked)}
                  className="rounded border-gray-800 text-violet-600 focus:ring-violet-500/50 bg-black h-4 w-4 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Theme selection */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <AppWindow className="h-4 w-4 text-violet-400" />
              <span>Visual Appearance</span>
            </h4>

            <div className="pl-5 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-3.5 border text-xs font-bold rounded-xl transition ${
                  theme === 'dark' 
                    ? 'border-violet-500 bg-violet-950/20 text-violet-300' 
                    : 'border-gray-850 bg-black/10 text-gray-400 hover:text-gray-300'
                }`}
              >
                🌌 Dark Space Mode (Default)
              </button>
              <button
                type="button"
                disabled
                className="py-3.5 border border-gray-900 bg-black/5 text-gray-600 text-xs font-medium rounded-xl cursor-not-allowed"
                title="Light mode is locked to keep premium aesthetics"
              >
                ☀️ Light Mode (Aesthetic Lock)
              </button>
            </div>
          </div>

          {/* Save button */}
          <div className="pt-4 border-t border-gray-900 flex justify-between items-center">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white shadow-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Save className="h-4 w-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="glass-panel border border-red-900/30 rounded-3xl p-6 lg:p-8 bg-red-950/5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-red-900/20 text-red-400">
          <Info className="h-5 w-5" />
          <h3 className="text-lg font-bold tracking-wide">Danger Zone</h3>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 text-xs">
          <div className="space-y-0.5">
            <span className="font-semibold text-gray-200 block">Clear Sandbox Environment Database</span>
            <p className="text-[10px] text-gray-500 leading-normal max-w-md">
              Clear all localStorage state and restore the mock Firebase Auth and Firestore to initial Alex Mercer sandbox mock configurations.
            </p>
          </div>
          <button
            onClick={handleResetData}
            className="px-5 py-3 rounded-xl border border-red-500/20 hover:border-red-500/40 bg-red-950/20 hover:bg-red-950/30 text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Reset Local Database</span>
          </button>
        </div>
      </div>
    </div>
  );
}
