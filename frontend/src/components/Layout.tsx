import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { auth, db } from '../mockFirebase';
import type { User, UserProfile } from '../mockFirebase';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Calendar as CalendarIcon, 
  ClipboardList, 
  BookOpen, 
  User as UserIcon, 
  Settings as SettingsIcon, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Sparkles,
  Award
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currUser) => {
      setUser(currUser);
      if (currUser) {
        setProfile(db.getProfile());
      } else {
        setProfile(null);
        navigate('/');
      }
    });

    // Listen to localstorage updates for live profile XP syncing
    const handleStorageChange = () => {
      if (auth.getCurrentUser()) {
        setProfile(db.getProfile());
      }
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event dispatch inside the same window
    window.addEventListener('profile-updated', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleStorageChange);
    };
  }, [navigate]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  if (!user || !profile) {
    return (
      <div className="min-height-screen flex items-center justify-center bg-[#08060f]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Chat Assist', path: '/chat', icon: MessageSquare },
    { name: 'AI Study Planner', path: '/planner', icon: BookOpen },
    { name: 'Smart To-Do', path: '/todo', icon: ClipboardList },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Profile & Badges', path: '/profile', icon: UserIcon },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ];

  const mockNotifications = [
    { id: 1, text: "AI Study Coach: You're close to level 5! Study 30 more minutes to unlock.", time: "10m ago", read: false },
    { id: 2, text: "Upcoming Exam: Physics Quiz 3 tomorrow at 14:30.", time: "1h ago", read: false },
    { id: 3, text: "Streak Alert: You have maintained a 5-day study streak. Keep going!", time: "4h ago", read: true }
  ];

  const xpPercent = Math.min(100, Math.round((profile.xp / profile.targetXp) * 100));

  return (
    <div className="min-h-screen flex bg-[#0a0814] text-gray-100">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 glass-panel border-r border-gray-800 shrink-0 sticky top-0 h-screen z-20">
        
        {/* Logo */}
        <div className="p-6 border-b border-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <Sparkles className="h-5 w-5 text-white animate-float" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-wider text-white">
              STUDY<span className="text-violet-400">PILOT</span>
            </h1>
            <span className="text-xs text-gray-400 font-medium">AI Learning Companion</span>
          </div>
        </div>

        {/* User Quick Info */}
        <div className="p-4 border-b border-gray-800/60 bg-white/[0.01]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-violet-900/60 border border-violet-500/30 flex items-center justify-center font-bold text-violet-300">
              {profile.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold truncate text-white">{profile.name}</h4>
              <div className="flex items-center gap-1.5 text-xs text-violet-400 font-medium mt-0.5">
                <Award className="h-3 w-3" />
                <span>Level {profile.level} Student</span>
              </div>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between text-[10px] text-gray-400 mb-1">
              <span>XP: {profile.xp} / {profile.targetXp}</span>
              <span>{xpPercent}%</span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden border border-gray-800">
              <div 
                className="bg-gradient-to-r from-violet-500 to-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${xpPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600/80 to-blue-600/80 text-white shadow-md shadow-violet-500/10 border border-violet-500/20' 
                    : 'text-gray-400 hover:bg-white/[0.04] hover:text-white'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header - Desktop & Mobile */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-gray-800/80 glass-panel sticky top-0 z-30">
          
          {/* Mobile hamburger button */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-sm leading-tight tracking-wider text-white">
                STUDY<span className="text-violet-400">PILOT</span>
              </span>
            </div>
          </div>

          {/* Page Title */}
          <div className="hidden lg:block">
            <h2 className="text-lg font-bold text-white tracking-wide">
              {menuItems.find(item => item.path === location.pathname)?.name || 'StudyPilot AI'}
            </h2>
          </div>

          {/* Topbar Actions */}
          <div className="flex items-center gap-4 ml-auto">
            
            {/* XP Badge (Header Small view) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-950/40 border border-violet-800/40 text-xs text-violet-300 font-medium">
              <Award className="h-3.5 w-3.5 text-violet-400 animate-pulse" />
              <span>Level {profile.level}</span>
              <span className="text-gray-500">|</span>
              <span>{profile.xp} XP</span>
            </div>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 bg-white/[0.03] border border-gray-800 hover:border-violet-500/30 hover:bg-white/[0.06] rounded-xl text-gray-300 hover:text-white transition-all duration-200"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-violet-500 rounded-full animate-pulse"></span>
              </button>

              {/* Notification dropdown */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)}></div>
                  <div className="absolute right-0 mt-2 w-80 glass-panel border border-gray-800 rounded-2xl p-4 shadow-xl z-50 animate-fadeIn">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-800 mb-3">
                      <h4 className="font-bold text-sm text-white">Notifications</h4>
                      <button className="text-xs text-violet-400 hover:text-violet-300 font-medium">Mark all read</button>
                    </div>
                    <div className="space-y-3">
                      {mockNotifications.map(notif => (
                        <div key={notif.id} className={`p-2.5 rounded-xl text-xs transition ${notif.read ? 'opacity-60 hover:opacity-100' : 'bg-violet-950/20 border border-violet-900/30'}`}>
                          <p className="text-gray-200 leading-normal">{notif.text}</p>
                          <span className="text-[10px] text-gray-500 block mt-1">{notif.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Header Profile Icon */}
            <Link 
              to="/profile"
              className="flex items-center gap-2 pl-2 border-l border-gray-800/80 hover:opacity-85 transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-900/50 border border-blue-500/30 flex items-center justify-center font-bold text-blue-300 text-sm">
                {profile.name.charAt(0)}
              </div>
              <span className="text-sm font-medium text-gray-300 hidden md:block">{profile.name}</span>
            </Link>
          </div>
        </header>

        {/* Page Content Panel */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* Drawer Panel */}
          <aside className="relative flex flex-col w-64 max-w-xs bg-[#0b0816] border-r border-gray-800 h-full p-4 z-50 animate-slideRight">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold text-sm tracking-wider text-white">STUDY PILOT</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User XP stats inside mobile drawer */}
            <div className="p-3 bg-white/[0.02] border border-gray-800/60 rounded-xl mb-4">
              <p className="text-xs text-gray-300 font-semibold truncate mb-1">{profile.name}</p>
              <div className="flex justify-between text-[10px] text-violet-400 font-medium mb-1.5">
                <span>Lvl {profile.level}</span>
                <span>{profile.xp} / {profile.targetXp} XP</span>
              </div>
              <div className="w-full bg-gray-950 rounded-full h-1 border border-gray-900">
                <div 
                  className="bg-violet-500 h-full rounded-full"
                  style={{ width: `${xpPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                      isActive 
                        ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white border border-violet-500/20' 
                        : 'text-gray-400 hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Sign Out */}
            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
