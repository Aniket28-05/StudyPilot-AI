// Mock Firebase Authentication and Firestore Database Service for StudyPilot AI
// Uses LocalStorage to persist data and simulate database operations

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  subject: string;
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  duration: number; // in minutes
  completed: boolean;
}

export interface StudyPlan {
  id: string;
  subject: string;
  startDate: string;
  endDate: string;
  dailyHours: number;
  topics: {
    id: string;
    title: string;
    completed: boolean;
    week: number;
    day: string;
  }[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'exam' | 'class' | 'study' | 'deadline';
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // in minutes
  description?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  level: number;
  xp: number;
  targetXp: number;
  fieldOfStudy: string;
  university: string;
  dailyStudyGoal: number; // in hours
  weeklyStudyHours: number[]; // Mon-Sun
  badges: {
    id: string;
    name: string;
    icon: string;
    description: string;
    unlockedAt: string;
  }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  persona: 'coach' | 'buddy' | 'scholar';
  messages: ChatMessage[];
  updatedAt: string;
}

// Initial Mock Data
const INITIAL_PROFILE: UserProfile = {
  name: 'Alex Mercer',
  email: 'alex.mercer@university.edu',
  level: 4,
  xp: 1450,
  targetXp: 2500,
  fieldOfStudy: 'Computer Science & Mathematics',
  university: 'Silicon Valley Tech',
  dailyStudyGoal: 4,
  weeklyStudyHours: [3.5, 5, 2.5, 4, 6, 4.5, 3],
  badges: [
    { id: '1', name: 'Night Owl', icon: '🌙', description: 'Studied past midnight', unlockedAt: '2026-06-28' },
    { id: '2', name: 'Focus Master', icon: '⏱️', description: 'Completed 5 Pomodoro sessions in a row', unlockedAt: '2026-07-02' },
    { id: '3', name: 'Planner Pro', icon: '📅', description: 'Completed a generated study plan', unlockedAt: '2026-07-04' }
  ]
};

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Prepare Calculus Chapter 4 Exercises', subject: 'Mathematics', priority: 'High', dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], duration: 90, completed: false },
  { id: 't2', title: 'Implement Redux State Management in Web Project', subject: 'Computer Science', priority: 'Medium', dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], duration: 120, completed: false },
  { id: 't3', title: 'Write Physics Lab Report 3 (Optics)', subject: 'Physics', priority: 'High', dueDate: new Date().toISOString().split('T')[0], duration: 60, completed: true },
  { id: 't4', title: 'Read Chapter 5 of OS Textbook', subject: 'Computer Science', priority: 'Low', dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0], duration: 45, completed: false }
];

const INITIAL_PLANS: StudyPlan[] = [
  {
    id: 'p1',
    subject: 'Data Structures & Algorithms',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 14).toISOString().split('T')[0],
    dailyHours: 3,
    topics: [
      { id: 'p1_1', title: 'Arrays & Arraylists complexity analysis', completed: true, week: 1, day: 'Mon' },
      { id: 'p1_2', title: 'Linked Lists implementation & sentinel nodes', completed: true, week: 1, day: 'Tue' },
      { id: 'p1_3', title: 'Stacks & Queues using array / dynamic arrays', completed: false, week: 1, day: 'Wed' },
      { id: 'p1_4', title: 'Binary Trees traversal (pre, in, post order)', completed: false, week: 1, day: 'Thu' },
      { id: 'p1_5', title: 'Binary Search Trees (insert, delete operations)', completed: false, week: 1, day: 'Fri' },
      { id: 'p1_6', title: 'AVL Trees & Rotations balancing overview', completed: false, week: 1, day: 'Sat' },
      { id: 'p1_7', title: 'Week 1 Review & practice problems on Leetcode', completed: false, week: 1, day: 'Sun' },
      { id: 'p1_8', title: 'Heaps & Priority Queues implementation', completed: false, week: 2, day: 'Mon' },
      { id: 'p1_9', title: 'Hashing & Collision resolution mechanisms', completed: false, week: 2, day: 'Tue' }
    ]
  }
];

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 'e1', title: 'Data Structures Lecture', type: 'class', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 90, description: 'Prof. Davis - Hall A' },
  { id: 'e2', title: 'Physics Quiz 3', type: 'exam', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '14:30', duration: 45, description: 'Electromagnetism chapters 1-4' },
  { id: 'e3', title: 'Project Beta Submission', type: 'deadline', date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0], time: '23:59', duration: 0, description: 'Submit on portal' },
  { id: 'e4', title: 'Math Group Study', type: 'study', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '16:00', duration: 120, description: 'Library study room 4' }
];

const INITIAL_CHATS: ChatSession[] = [
  {
    id: 'c1',
    title: 'Calculus Help',
    persona: 'coach',
    updatedAt: new Date().toISOString(),
    messages: [
      { id: 'm1', role: 'assistant', content: 'Hello! I am your AI Study Coach. How can I help you excel in your studies today? We can design plans, test your knowledge, or break down difficult concepts.', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'm2', role: 'user', content: 'Can you help me understand the difference between local and global extrema?', timestamp: new Date(Date.now() - 3000000).toISOString() },
      { id: 'm3', role: 'assistant', content: 'Of course! Think of a **local extremum** as the highest or lowest point in a *specific neighborhood* (a small interval) of the graph. In contrast, a **global extremum** (or absolute extremum) is the highest or lowest point on the *entire domain* of the function.\n\nFor example, if you stand on top of a hill, you are at a local maximum (higher than anywhere close by). But if you climb Mount Everest, you are at the global maximum of Earth! 🏔️\n\nWould you like a mathematical example using derivatives?', timestamp: new Date(Date.now() - 2800000).toISOString() }
    ]
  }
];

const DEFAULT_SETTINGS = {
  notificationEmail: true,
  notificationPush: false,
  studyReminderTime: '20:00',
  autoPlanner: true,
  theme: 'dark'
};

// Initialize Storage Helpers
const getStorage = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultValue));
    return defaultValue;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultValue;
  }
};

const setStorage = <T>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Mock Auth Class
class MockAuth {
  private listeners: ((user: User | null) => void)[] = [];

  constructor() {
    // Initial check
    setTimeout(() => {
      const activeUser = this.getCurrentUser();
      this.notify(activeUser);
    }, 10);
  }

  getCurrentUser(): User | null {
    return getStorage<User | null>('study_pilot_user', null);
  }

  signIn(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simple mock behavior: accept any password of length >= 6
        if (!email.includes('@')) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }
        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters.'));
          return;
        }

        const displayName = email.split('@')[0];
        const user: User = {
          uid: 'u_' + Math.random().toString(36).substr(2, 9),
          email,
          displayName: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          createdAt: new Date().toISOString()
        };

        setStorage('study_pilot_user', user);
        this.notify(user);
        resolve(user);
      }, 800);
    });
  }

  signUp(email: string, password: string, name: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!email.includes('@')) {
          reject(new Error('Please enter a valid email address.'));
          return;
        }
        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters.'));
          return;
        }
        if (!name.trim()) {
          reject(new Error('Name cannot be empty.'));
          return;
        }

        const user: User = {
          uid: 'u_' + Math.random().toString(36).substr(2, 9),
          email,
          displayName: name,
          createdAt: new Date().toISOString()
        };

        setStorage('study_pilot_user', user);
        
        // Also initialize fresh profile
        const profile = { ...INITIAL_PROFILE, name, email };
        setStorage('study_pilot_profile', profile);

        this.notify(user);
        resolve(user);
      }, 800);
    });
  }

  signOut(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('study_pilot_user');
        this.notify(null);
        resolve();
      }, 300);
    });
  }

  onAuthStateChanged(callback: (user: User | null) => void) {
    this.listeners.push(callback);
    // Call immediately with current value
    callback(this.getCurrentUser());
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify(user: User | null) {
    this.listeners.forEach(callback => callback(user));
  }
}

// Mock Firestore Database Class
class MockFirestore {
  // Tasks
  getTasks(): Task[] {
    return getStorage<Task[]>('study_pilot_tasks', INITIAL_TASKS);
  }

  addTask(task: Omit<Task, 'id'>): Task {
    const tasks = this.getTasks();
    const newTask: Task = {
      ...task,
      id: 't_' + Math.random().toString(36).substr(2, 9)
    };
    tasks.push(newTask);
    setStorage('study_pilot_tasks', tasks);
    this.updateUserXp(20); // Award XP for adding task
    return newTask;
  }

  updateTask(taskId: string, updates: Partial<Task>): Task[] {
    let tasks = this.getTasks();
    let oldCompleted = false;
    let newCompleted = false;
    
    tasks = tasks.map(task => {
      if (task.id === taskId) {
        oldCompleted = task.completed;
        newCompleted = updates.completed !== undefined ? updates.completed : task.completed;
        return { ...task, ...updates };
      }
      return task;
    });

    setStorage('study_pilot_tasks', tasks);

    // Award XP on completing task
    if (!oldCompleted && newCompleted) {
      this.updateUserXp(100);
    } else if (oldCompleted && !newCompleted) {
      this.updateUserXp(-100);
    }
    
    return tasks;
  }

  deleteTask(taskId: string): Task[] {
    const tasks = this.getTasks().filter(task => task.id !== taskId);
    setStorage('study_pilot_tasks', tasks);
    return tasks;
  }

  // Study Plans
  getPlans(): StudyPlan[] {
    return getStorage<StudyPlan[]>('study_pilot_plans', INITIAL_PLANS);
  }

  addPlan(plan: Omit<StudyPlan, 'id'>): StudyPlan {
    const plans = this.getPlans();
    const newPlan: StudyPlan = {
      ...plan,
      id: 'p_' + Math.random().toString(36).substr(2, 9)
    };
    plans.push(newPlan);
    setStorage('study_pilot_plans', plans);
    this.updateUserXp(150); // XP for starting a study plan
    return newPlan;
  }

  updatePlanTopic(planId: string, topicId: string, completed: boolean): StudyPlan[] {
    let plans = this.getPlans();
    plans = plans.map(p => {
      if (p.id === planId) {
        const topics = p.topics.map(t => {
          if (t.id === topicId) {
            if (!t.completed && completed) this.updateUserXp(30);
            return { ...t, completed };
          }
          return t;
        });
        return { ...p, topics };
      }
      return p;
    });
    setStorage('study_pilot_plans', plans);
    return plans;
  }

  deletePlan(planId: string): StudyPlan[] {
    const plans = this.getPlans().filter(p => p.id !== planId);
    setStorage('study_pilot_plans', plans);
    return plans;
  }

  // Calendar Events
  getEvents(): CalendarEvent[] {
    return getStorage<CalendarEvent[]>('study_pilot_events', INITIAL_EVENTS);
  }

  addEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const events = this.getEvents();
    const newEvent: CalendarEvent = {
      ...event,
      id: 'e_' + Math.random().toString(36).substr(2, 9)
    };
    events.push(newEvent);
    setStorage('study_pilot_events', events);
    this.updateUserXp(15);
    return newEvent;
  }

  deleteEvent(eventId: string): CalendarEvent[] {
    const events = this.getEvents().filter(e => e.id !== eventId);
    setStorage('study_pilot_events', events);
    return events;
  }

  // Profile Operations
  getProfile(): UserProfile {
    return getStorage<UserProfile>('study_pilot_profile', INITIAL_PROFILE);
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const profile = this.getProfile();
    const newProfile = { ...profile, ...updates };
    setStorage('study_pilot_profile', newProfile);
    return newProfile;
  }

  updateUserXp(amount: number): UserProfile {
    const profile = this.getProfile();
    let newXp = profile.xp + amount;
    let newLevel = profile.level;
    let targetXp = profile.targetXp;

    if (newXp < 0) newXp = 0;

    // Simple level up mechanics (each level requires +1000 xp more than previous)
    // Level 1: 0 - 1000
    // Level 2: 1000 - 2000
    // Level 3: 2000 - 3500
    // Level 4: 3500 - 5500
    while (newXp >= targetXp) {
      newLevel += 1;
      newXp = newXp - targetXp;
      targetXp = Math.floor(targetXp * 1.5);
      // Trigger level-up award badge or notification in actual app
    }

    const updatedProfile = this.updateProfile({ xp: newXp, level: newLevel, targetXp });
    return updatedProfile;
  }

  // AI Chat Operations
  getChats(): ChatSession[] {
    return getStorage<ChatSession[]>('study_pilot_chats', INITIAL_CHATS);
  }

  createChat(title: string, persona: 'coach' | 'buddy' | 'scholar'): ChatSession {
    const chats = this.getChats();
    const newChat: ChatSession = {
      id: 'c_' + Math.random().toString(36).substr(2, 9),
      title,
      persona,
      messages: [
        {
          id: 'm_init',
          role: 'assistant',
          content: this.getInitialMessageForPersona(persona),
          timestamp: new Date().toISOString()
        }
      ],
      updatedAt: new Date().toISOString()
    };
    chats.unshift(newChat);
    setStorage('study_pilot_chats', chats);
    return newChat;
  }

  private getInitialMessageForPersona(persona: 'coach' | 'buddy' | 'scholar'): string {
    switch (persona) {
      case 'buddy':
        return "Hey there! Ready to crush some studying today? Let's keep it simple, talk through the concepts, and keep our spirits high! Whacha working on?";
      case 'scholar':
        return "Greetings. I am here to assist with rigorous academic queries, mathematical proofs, and analytical assessments. Please specify the topic or equations you would like to examine.";
      case 'coach':
      default:
        return "Hello! I am your AI Study Coach. How can I help you excel in your studies today? We can design plans, test your knowledge, or break down difficult concepts.";
    }
  }

  addMessage(chatId: string, content: string, role: 'user' | 'assistant'): ChatSession {
    const chats = this.getChats();
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        const messages = [
          ...chat.messages,
          {
            id: 'm_' + Math.random().toString(36).substr(2, 9),
            role,
            content,
            timestamp: new Date().toISOString()
          }
        ];
        return {
          ...chat,
          messages,
          updatedAt: new Date().toISOString()
        };
      }
      return chat;
    });

    setStorage('study_pilot_chats', updatedChats);
    return updatedChats.find(c => c.id === chatId)!;
  }

  // Generate Mock AI Response
  generateAIResponse(_chatId: string, userMessage: string, persona: 'coach' | 'buddy' | 'scholar'): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let response = '';
        const lowerMessage = userMessage.toLowerCase();

        // 1. Check if user is asking for a study plan
        if (lowerMessage.includes('study plan') || lowerMessage.includes('schedule') || lowerMessage.includes('planner')) {
          response = `Based on your request, I suggest initiating a structured study plan for your course. I've designed a draft study schedule for you! \n\n**Subject:** Dynamic Learning & Review\n**Phase 1 (Days 1-3):** Foundation & Concept mapping.\n**Phase 2 (Days 4-7):** Active Recall testing & practice problems.\n**Phase 3 (Days 8-10):** Mock examination and reviewing mistakes.\n\nGo to the **Study Planner** tab on the sidebar where I can automatically construct a custom tracking list for this subject!`;
        }
        // 2. Check if user is asking for math help
        else if (lowerMessage.includes('math') || lowerMessage.includes('calculus') || lowerMessage.includes('equation') || lowerMessage.includes('derivative')) {
          response = `Sure, let's look at a key concept in calculus. If you have the function: \n\n$$\\mathbf{f(x) = 3x^2 + 5x - 2}$$\n\nThe derivative (rate of change) is found using the Power Rule:\n\n$$\\mathbf{f'(x) = 6x + 5}$$\n\nHere's a breakdown:\n1. Bring the exponent down and multiply it: $3 \\times 2x^{2-1} = 6x$\n2. The derivative of a linear term $5x$ is just the coefficient $5$\n3. The derivative of a constant term $-2$ is $0$\n\nDoes this make sense? Try finding the derivative of $f(x) = 5x^3 - 4x$!`;
        }
        // 3. Check if user is asking for help with coding / programming
        else if (lowerMessage.includes('code') || lowerMessage.includes('react') || lowerMessage.includes('function') || lowerMessage.includes('programming')) {
          response = `Here is a clean React state toggle pattern. In modern React, you can manage active states easily with hooks:

\`\`\`tsx
import React, { useState } from 'react';

export function StudyTimer() {
  const [isActive, setIsActive] = useState<boolean>(false);
  
  return (
    <button 
      onClick={() => setIsActive(!isActive)}
      className="px-4 py-2 bg-violet-600 rounded-lg hover:bg-violet-700 transition"
    >
      {isActive ? 'Pause Study Session' : 'Start Study Session'}
    </button>
  );
}
\`\`\`

This pattern utilizes the current functional update mechanism and typescript typing. Do you have any specific algorithms you would like to optimize?`;
        }
        // 4. Default Persona-specific responses
        else {
          if (persona === 'buddy') {
            response = `Oh, nice! That sounds super interesting. I think the key is to take breaks (ever tried Pomodoro? 25m on, 5m off) and explain it back to me. \n\nTell me, what's the hardest part about this topic for you right now? Let's tackle it together! 👊`;
          } else if (persona === 'scholar') {
            response = `I have logged your inquiry. To optimize memory retention and cognitive consolidation on this subject, I advise applying the **Feynman Technique**:\n\n1. Explain the topic in plain language as if instructing a novice.\n2. Identify cognitive gaps in your understanding.\n3. Return to the source literature to resolve those gaps.\n4. Simplify the explanation further using analogies.\n\nWhich specific aspect of the topic shall we formalize next?`;
          } else {
            response = `That's a very common challenge. A highly effective method to master this is **Active Recall** combined with **Spaced Repetition**.\n\nInstead of just re-reading, close the book and write down everything you remember. This forces the brain to retrieve info, which strengthens neural pathways.\n\nShould we set up a mock quiz on this topic? Let me know, and I'll generate 3 practice questions for you right now!`;
          }
        }

        resolve(response);
      }, 1000);
    });
  }

  // Settings
  getSettings() {
    return getStorage('study_pilot_settings', DEFAULT_SETTINGS);
  }

  updateSettings(updates: Partial<typeof DEFAULT_SETTINGS>) {
    const settings = this.getSettings();
    const newSettings = { ...settings, ...updates };
    setStorage('study_pilot_settings', newSettings);
    return newSettings;
  }
}

export const auth = new MockAuth();
export const db = new MockFirestore();
