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
  generateAIResponse(_chatId: string, userMessage: string, _persona: 'coach' | 'buddy' | 'scholar'): Promise<string> {
    const INTENT_RULES = [
      { key: 'SQL', keywords: ['sql'] },
      { key: 'Java', keywords: ['java'] },
      { key: 'Python', keywords: ['python'] },
      { key: 'DBMS', keywords: ['dbms', 'database', 'databases', 'relational'] },
      { key: 'Data Structures', keywords: ['data structure', 'data structures', 'dsa', 'algorithm', 'algorithms', 'tree', 'graph', 'stack', 'queue', 'heap'] },
      { key: 'Operating Systems', keywords: ['operating system', 'operating systems', 'os', 'kernel', 'scheduling', 'deadlock', 'paging', 'virtual memory'] },
      { key: 'Computer Networks', keywords: ['computer networks', 'computer network', 'networking', 'cn', 'tcp', 'udp', 'ip address', 'subnetting', 'dns', 'router'] },
      { key: 'Machine Learning', keywords: ['machine learning', 'ml', 'supervised', 'unsupervised', 'regression', 'classification', 'overfitting'] },
      { key: 'Artificial Intelligence', keywords: ['artificial intelligence', 'ai', 'heuristic', 'neural network', 'nlp', 'search algorithm'] },
      { key: 'Web Development', keywords: ['web development', 'web dev', 'html', 'css', 'api', 'http', 'responsive design'] },
      { key: 'JavaScript', keywords: ['javascript', 'js', 'promise', 'closure', 'event loop', 'dom'] },
      { key: 'React', keywords: ['react', 'hook', 'hooks', 'virtual dom', 'useeffect', 'usestate'] },
      { key: 'C++', keywords: ['c++', 'cpp', 'pointer', 'smart pointer', 'stl', 'templates'] },
      { key: 'Exam Preparation', keywords: ['exam prep', 'exam preparation', 'exam', 'exams', 'test prep', 'study schedule', 'mock exam'] },
      { key: 'Study Tips', keywords: ['study tips', 'study tip', 'how to study', 'study advice', 'active recall', 'spaced repetition', 'feynman technique'] },
      { key: 'Motivation', keywords: ['motivation', 'motivate', 'procrastination', 'push forward', 'keep studying'] },
      { key: 'Time Management', keywords: ['time management', 'pomodoro', 'eisenhower', 'time block', 'smart goal', 'goals'] }
    ];

    const TOPIC_RESPONSES: Record<string, string[]> = {
      'SQL': [
        "SQL (Structured Query Language) is the standard language for dealing with Relational Databases. A key tip is to always filter your results early using WHERE clauses to optimize performance. What SQL queries are you working on?",
        "When writing SQL, mastering JOINs is crucial. Remember: an INNER JOIN returns matching rows in both tables, whereas a LEFT JOIN returns all rows from the left table and matched rows from the right. Let me know if you want an example!",
        "Aggregation in SQL is done using functions like SUM, AVG, COUNT, and GROUP BY. Remember, if you want to filter groups, use HAVING, not WHERE! Need help structuring a group query?",
        "Subqueries in SQL can be written in the SELECT, FROM, or WHERE clauses. Correlated subqueries execute once for each row evaluated by the outer query. Let me know if you want to write one together.",
        "To optimize SQL queries, use INDEXES on columns frequently used in WHERE clauses and JOIN conditions. But beware—too many indexes can slow down INSERT and UPDATE operations. What database system are you using?"
      ],
      'Java': [
        "Java is a class-based, object-oriented programming language designed to have as few implementation dependencies as possible. A core concept is the Java Virtual Machine (JVM) which enables Write Once, Run Anywhere. What Java project are you working on?",
        "Java Collections Framework is a set of classes and interfaces. Remember that ArrayList is backed by an array and is fast for search, whereas LinkedList is better for insertions and deletions. Do you want to see a performance comparison?",
        "Exception Handling in Java uses try-catch-finally blocks. Checked exceptions are checked at compile-time (e.g., IOException), while Unchecked exceptions (RuntimeExceptions like NullPointerException) are checked at runtime. Need help debugging an exception?",
        "Java multithreading can be done by extending the Thread class or implementing the Runnable interface. To avoid race conditions, use the 'synchronized' keyword to lock resources. Let's write a thread-safe example!",
        "Java 8 introduced Lambda Expressions and the Stream API, allowing you to write cleaner functional-style code. For example, using stream().filter().map().collect() makes collection processing extremely elegant. Would you like to refactor a loop into a stream?"
      ],
      'Python': [
        "Python is a high-level, interpreted programming language known for its readability. One of its best features is list comprehensions, which let you create lists in a single readable line. What Python script are you developing?",
        "In Python, understanding the difference between mutable (like lists, dictionaries) and immutable (like tuples, strings) objects is critical to avoiding unexpected bugs in function calls. Need an example of this behavior?",
        "Python's PEP 8 is the official style guide. Writing 'pythonic' code involves using clean design patterns, meaningful variable names, and proper indentation. Let me know if you want me to review your code format!",
        "Decorators in Python are a powerful tool to modify the behavior of a function or class. They allow you to wrap another function to extend its behavior without permanently modifying it. Let's write a simple timing decorator!",
        "Python generators use the 'yield' keyword to produce values one-by-one on demand, which is highly memory-efficient for processing large datasets compared to returning whole lists. Want to see how to write a custom generator?"
      ],
      'DBMS': [
        "A Database Management System (DBMS) manages data storage, retrieval, and updates. A core concept is database normalization (1NF, 2NF, 3NF, BCNF) which minimizes redundancy. Which normal form are you studying?",
        "The ACID properties in DBMS guarantee reliable database transactions: Atomicity (all or nothing), Consistency (valid state), Isolation (independent execution), and Durability (permanent changes). Need help analyzing transaction conflicts?",
        "Concurrency control is essential in database systems. Protocols like Two-Phase Locking (2PL) prevent conflict serializability violations, but they can sometimes lead to deadlocks. What concurrency protocol are you studying?",
        "Data modeling typically starts with Entity-Relationship (ER) diagrams, mapping out entities, attributes, and relationships before translating them into physical database tables. Would you like to map an ER model to relational schemas?",
        "Modern databases can be relational (SQL) or non-relational (NoSQL like Document, Key-Value, Graph, Column-family). The choice depends on query patterns and scaling requirements. Let's discuss which database type fits your project!"
      ],
      'Data Structures': [
        "Data structures are ways of organizing and storing data. Linear structures like Arrays and Linked Lists have different trade-offs: Arrays offer O(1) random access, while Linked Lists allow O(1) dynamic insertions. What structure are you analyzing?",
        "Trees are hierarchical data structures. A Binary Search Tree (BST) maintains sorted order, enabling O(log n) searches on average. However, if unbalanced, it can degrade to O(n) performance. Let's look at AVL or Red-Black trees to keep them balanced!",
        "Graphs are powerful structures consisting of vertices and edges. To traverse a graph, you can use Depth-First Search (DFS) using a stack, or Breadth-First Search (BFS) using a queue. Want to write a graph traversal algorithm?",
        "A Hash Table maps keys to values using a hash function. When collisions happen, systems resolve them using Chaining (linked lists) or Open Addressing (probing). What collision resolution method are you implementing?",
        "Heaps are specialized tree-based structures that satisfy the heap property (Min-Heap or Max-Heap). They are perfect for implementing Priority Queues, allowing you to fetch the minimum/maximum element in O(1) time. Let's trace a heapify operation!"
      ],
      'Operating Systems': [
        "Operating Systems manage hardware resources and provide services for computer programs. A central topic is Process Scheduling, where the CPU decides which process runs next using algorithms like Round Robin or SJF. What scheduler are you analyzing?",
        "Virtual Memory and paging allow operating systems to execute processes larger than the physical RAM. When a requested page isn't in memory, a page fault occurs, triggering page replacement policies like LRU or FIFO. Let's solve a page replacement problem!",
        "Process synchronization prevents race conditions when multiple threads access shared data. Semaphores, mutexes, and monitors are standard primitives used to coordinate execution. Have you run into a deadlock or starvation scenario?",
        "Deadlocks occur when processes are stuck waiting for resources held by each other. The four necessary conditions for deadlock are Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Need help running the Banker's Algorithm?",
        "The file system is the OS structure that controls how data is stored and retrieved. It handles allocation methods (contiguous, linked, indexed) and free-space management. What file system mechanism are you looking at?"
      ],
      'Computer Networks': [
        "Computer Networks use layered architectures. The OSI model has 7 layers (Physical to Application), while the TCP/IP model has 4. Each layer has specific protocols like IP at the Network layer and TCP/UDP at the Transport layer. What layer are you studying?",
        "TCP (Transmission Control Protocol) is connection-oriented and guarantees delivery, whereas UDP (User Datagram Protocol) is connectionless and fast but unreliable. Which protocol fits your application's requirements?",
        "IP addressing and subnetting allow networks to route packets efficiently. Understanding CIDR notation and calculating subnet masks is a key networking skill. Let's work through a subnetting math problem!",
        "Routing protocols determine the best path for data packets across networks. Distance-vector routing (like RIP) uses hop counts, while Link-state routing (like OSPF) builds a complete map of the network. Want to discuss how they compare?",
        "The Domain Name System (DNS) is the phonebook of the internet, translating human-friendly domain names into machine-readable IP addresses through hierarchical servers. Let's trace a DNS resolution query step-by-step!"
      ],
      'Machine Learning': [
        "Machine learning involves algorithms that learn patterns from data. In Supervised Learning, models are trained on labeled data to perform regression (predicting continuous values) or classification (predicting classes). What model are you training?",
        "Evaluating machine learning models requires appropriate metrics. For classification, accuracy is often not enough; you should look at Precision, Recall, F1-Score, and the ROC-AUC curve. Let's analyze a confusion matrix!",
        "Overfitting happens when a model learns training data noise instead of general patterns. To combat overfitting, you can use Regularization (L1 Lasso, L2 Ridge), cross-validation, or prune decision trees. Let's check your model's bias-variance tradeoff!",
        "Unsupervised learning finds hidden patterns in unlabeled data. Popular algorithms include K-Means clustering (grouping similar points) and Principal Component Analysis (PCA) for dimensionality reduction. Want to discuss how PCA works?",
        "Ensemble methods combine multiple models to create a stronger predictor. Random Forests use Bagging (bootstrap aggregating), while XGBoost and AdaBoost use Boosting (training models sequentially to correct errors). Let's compare their performance!"
      ],
      'Artificial Intelligence': [
        "Artificial Intelligence is the broad field of creating systems capable of performing tasks that typically require human intelligence, such as reasoning, learning, and decision-making. What branch of AI interests you most?",
        "Search algorithms are fundamental to classical AI. Uninformed search (BFS, DFS) explores options blindly, while informed search (A* search, Greedy Best-First) uses heuristics to find paths efficiently. Need help writing an A* heuristic?",
        "Neural networks, inspired by biological brains, consist of layers of artificial neurons. Through forward propagation and backpropagation with gradient descent, they adjust weights to learn complex patterns. Let's discuss activation functions!",
        "Natural Language Processing (NLP) is the AI field focused on enabling computers to understand and generate human language. Modern NLP leverages transformer architectures (like BERT or GPT). What NLP tasks are you exploring?",
        "AI ethics is an increasingly important field, addressing bias in algorithms, data privacy, accountability, and the societal impact of automation. Let's talk about best practices in designing fair and transparent AI systems!"
      ],
      'Web Development': [
        "Web development combines front-end (user interface) and back-end (server/database) technologies. A solid foundation starts with semantic HTML, responsive CSS layouts (Flexbox, Grid), and interactive JavaScript. What web app are you building?",
        "Responsive web design ensures your website looks great on all devices. Using media queries, fluid grids, and flexible images allows layouts to adapt seamlessly to mobile, tablet, and desktop screens. Need help with a CSS layout?",
        "Modern web applications often use RESTful APIs or GraphQL to exchange data between client interfaces and server-side databases. Understanding HTTP status codes and request methods (GET, POST, PUT, DELETE) is essential. Let's design an API endpoint!",
        "Web performance optimization involves minifying assets, lazy loading images, caching strategies, and reducing server response times. Fast websites lead to better user experiences and SEO rankings. What optimizations are you planning?",
        "Web security is paramount. Always protect against common vulnerabilities like Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF), and SQL Injection by sanitizing inputs and using HTTPS. Let's audit your security headers!"
      ],
      'JavaScript': [
        "JavaScript is the programming language of the web. A core concept is the event loop, which handles asynchronous execution by processing callback queues. What async JavaScript patterns are you working on?",
        "In JavaScript, understanding scoping (global, function, block scope) and the differences between var, let, and const is key. Closures allow inner functions to access outer function variables even after the outer function returns. Need an example of closures?",
        "JavaScript Promises and async/await syntax provide an elegant way to handle asynchronous operations compared to nesting callback functions (callback hell). Let's refactor some asynchronous code together!",
        "JavaScript is prototype-based; objects inherit properties and methods directly from other prototype objects. Knowing how prototypal inheritance works under the hood makes object creation clearer. Let's look at prototype chains!",
        "DOM manipulation allows JavaScript to dynamically update HTML structure, styles, and content in response to user actions. For better performance, minimize direct DOM updates by batching changes. Want to write an event listener?"
      ],
      'React': [
        "React is a popular JavaScript library for building user interfaces. It uses a virtual DOM to optimize rendering performance, updating only the real DOM elements that changed. What React component are you building?",
        "React Hooks, introduced in version 16.8, let you use state and other React features without writing classes. The most common hooks are useState (for local state) and useEffect (for side effects). Need help managing a hook dependency array?",
        "State management in React can be handled locally via useState/useReducer, shared across components via Context API, or managed globally using libraries like Redux or Zustand. Let's talk about state design patterns!",
        "React components go through mounting, updating, and unmounting phases. Proper lifecycle management, such as cleaning up event listeners in useEffect cleanup functions, prevents memory leaks. Want to debug a component effect?",
        "Reusability is a core principle. Custom hooks let you extract component logic into reusable functions, making your codebase cleaner and easier to test. Let's design a custom hook together!"
      ],
      'C++': [
        "C++ is a powerful, high-performance programming language offering direct control over hardware and memory. A critical concept is pointer arithmetic and memory allocation using new/delete. What C++ program are you compiling?",
        "Object-Oriented Programming in C++ centers on classes, inheritance, polymorphism, and encapsulation. Standard Template Library (STL) containers like vectors, sets, and maps make data management highly efficient. Need help with STL?",
        "Memory management in modern C++ (C++11 and later) emphasizes Resource Acquisition Is Initialization (RAII) and smart pointers (std::unique_ptr, std::shared_ptr) to eliminate memory leaks automatically. Let's write a smart pointer example!",
        "C++ templates allow you to write generic programming code, enabling functions and classes to operate with different data types without duplication. Let's look at template specialization!",
        "Understanding undefined behavior, segmentation faults, and compilation errors is a regular part of C++ development. Remember to check your array bounds and initialize your variables! What compiler warnings are you getting?"
      ],
      'Exam Preparation': [
        "Preparing for exams is most effective when using Active Recall and Spaced Repetition. Instead of re-reading notes, create flashcards or take practice tests to actively retrieve information. What exam are you preparing for?",
        "Creating a study schedule leading up to your exam prevents cramming and reduces stress. Break down the syllabus into weekly chunks and allocate specific time blocks for review. Let's build an exam study plan!",
        "Taking mock exams under realistic time constraints helps you build stamina, manage exam anxiety, and identify areas of weakness that need further study. Shall we run a quick practice quiz right here?",
        "Collaborating in study groups can help clarify difficult topics. Teaching concepts to peers is one of the best ways to solidify your own understanding (Feynman Technique). What topics are you going to discuss?",
        "During exam week, prioritizing sleep, hydration, and nutrition is just as important as studying. A tired brain cannot recall information efficiently. Make sure you get at least 7-8 hours of sleep before test day!"
      ],
      'Study Tips': [
        "The Feynman Technique is a powerful study method: try explaining a complex concept in simple terms to a beginner. Wherever you struggle or use jargon, review the source material to patch your understanding. What topic should we try explaining?",
        "Avoid passive studying like highlighting or re-reading. Instead, use active recall: close your notebook and write down everything you remember, or answer practice questions. This builds stronger neural connections!",
        "Use Spaced Repetition to combat the forgetting curve. Review new material 24 hours later, then 3 days later, then a week later, and then a month later to lock the knowledge into your long-term memory.",
        "Create a dedicated, distraction-free study space. Keep your phone in another room or use website blockers during your study blocks. A clean, quiet workspace signals your brain that it's time to focus.",
        "Mix up your study subjects (interleaving) instead of focusing on one subject for too long. Studying different topics in a single session improves your brain's ability to differentiate between concepts."
      ],
      'Motivation': [
        "Remember why you started this academic journey. Every study session, no matter how small, is a step closer to your goals and the future you want to build. What is your big goal for this semester?",
        "You don't need to feel motivated to start studying. Action precedes motivation. Just commit to studying for 5 minutes—often, once you start, the momentum carries you forward. Let's open the book now!",
        "Success is the sum of small efforts repeated day in and day out. Don't be discouraged by difficult topics; view them as opportunities for your brain to grow and adapt. You can master this!",
        "Celebrate your small wins! Completing a difficult chapter, finishing a homework set, or studying for an hour are all achievements. Reward yourself with a short break or a favorite treat.",
        "Mistakes and confusion are not signs of failure; they are signs that you are learning. Every time you get a question wrong and correct it, you are training your brain to get it right next time. Keep pushing!"
      ],
      'Time Management': [
        "The Pomodoro Technique is highly effective: study with intense focus for 25 minutes, then take a 5-minute break. After four cycles, take a longer 15-30 minute break to recharge. Shall we start a Pomodoro session?",
        "Time blocking involves dividing your day into dedicated slots for specific tasks. This prevents multitasking and helps you focus entirely on one subject at a time. Let's structure your study blocks for today!",
        "Prioritize your tasks using the Eisenhower Matrix: categorize them into Urgent/Important, Important/Not Urgent, Urgent/Not Important, and neither. Focus on what's important first. What are your top priorities?",
        "Avoid the planning fallacy by allocating more time than you think you need for complex projects. Breaking larger assignments into smaller, daily milestones prevents last-minute procrastination.",
        "Set SMART goals: Specific, Measurable, Achievable, Relevant, and Time-bound. Instead of 'study database systems', set a goal to 'complete 3 practice queries on SQL joins by 5:00 PM'."
      ],
      'Generic': [
        "That's an interesting inquiry! While I don't have a specific response prepared for that, I recommend breaking it down: what are the core terms or fundamentals of this topic? Let's explore them together.",
        "I'm not completely sure about the details of that topic, but I'd love to help you research it. Could you explain the context or share what textbook/course this is from? We can analyze it step-by-step.",
        "That seems like a specialized academic topic! A good learning approach is to look up the formal definition, identify key components, and try explaining them in your own words. How would you describe it to a classmate?",
        "I don't have a direct answer for that question, but we can search for the main principles. What is the primary field of study (e.g. computer science, mathematics, literature) that this falls under? Let's map it out.",
        "That's a unique question! To help you learn it effectively, let's break it into smaller parts. What is the first concept or term in your question that we should define? Let's take it one step at a time."
      ]
    };

    return new Promise((resolve) => {
      setTimeout(() => {
        const lowerMessage = userMessage.toLowerCase();
        let matchedKey = 'Generic';

        for (const rule of INTENT_RULES) {
          for (const keyword of rule.keywords) {
            if (lowerMessage.includes(keyword)) {
              matchedKey = rule.key;
              break;
            }
          }
          if (matchedKey !== 'Generic') break;
        }

        const responses = TOPIC_RESPONSES[matchedKey];
        const response = responses[Math.floor(Math.random() * responses.length)];
        resolve(response);
      }, 1500);
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
