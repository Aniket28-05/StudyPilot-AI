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

const SUBJECT_CURRICULA: Record<string, string[][]> = {
  'SQL': [
    [
      "Relational database fundamentals, tables, columns, and data types",
      "SELECT statements, filtering with WHERE, and sorting with ORDER BY",
      "Comparison operators (=, <>, LIKE, BETWEEN, IN) and logical operators",
      "Querying and filtering NULL values (IS NULL)"
    ],
    [
      "Aggregation functions (SUM, AVG, COUNT, MIN, MAX)",
      "Grouping data using GROUP BY and filtering groups with HAVING",
      "Working with date/time functions and string manipulation in SQL",
      "Subqueries and nested queries in WHERE and SELECT clauses"
    ],
    [
      "INNER JOIN and OUTER JOIN (LEFT, RIGHT, FULL) syntax and usage",
      "Self joins, cross joins, and multiple-table joins",
      "Set operations (UNION, UNION ALL, INTERSECT, EXCEPT)",
      "Practice complex multi-table relational queries"
    ],
    [
      "Advanced subqueries: correlated subqueries and EXISTS vs IN",
      "Common Table Expressions (CTEs) using the WITH clause",
      "Window functions: ROW_NUMBER, RANK, DENSE_RANK, and PARTITION BY",
      "Running totals, moving averages, and lead/lag operations"
    ],
    [
      "Data Definition Language (CREATE, ALTER, DROP tables, constraints, indexes)",
      "Data Manipulation Language (INSERT, UPDATE, DELETE) and Transaction Control (COMMIT, ROLLBACK)",
      "Database design: primary keys, foreign keys, and referential integrity",
      "Views and Materialized Views: creation, benefits, and maintenance"
    ],
    [
      "Indexing strategies (B-Tree, Hash, clustered vs non-clustered)",
      "Analyzing query plans using EXPLAIN and EXPLAIN ANALYZE",
      "Query optimization: avoiding SELECT *, optimizing joins, and partition pruning",
      "Database security, user roles, permissions, and SQL Injection prevention"
    ]
  ],
  'DBMS': [
    [
      "Database System architecture, 3-tier schema, and data independence",
      "Entity-Relationship (ER) model: entities, attributes, relationships, and constraints",
      "Enhancing ER diagrams (specialization, generalization, aggregation)",
      "Mapping ER/EER diagrams to relational schemas"
    ],
    [
      "Relational model concepts and keys (Super, Candidate, Primary, Foreign)",
      "Relational algebra operations: select, project, rename, join, division",
      "Relational calculus (tuple and domain relational calculus)",
      "Integrity constraints and domain constraints in relational systems"
    ],
    [
      "Functional dependencies and inference rules (Armstrong's axioms)",
      "First, Second, and Third Normal Forms (1NF, 2NF, 3NF)",
      "Boyce-Codd Normal Form (BCNF) and multi-valued dependencies (4NF)",
      "Dependency preservation and lossless-join decomposition testing"
    ],
    [
      "ACID properties of transactions and state transitions",
      "Serializability: conflict and view serializability, precedence graphs",
      "Concurrency control protocols: Lock-based (2PL, Strict 2PL)",
      "Timestamp ordering protocol, Thomas' write rule, and Deadlock handling"
    ],
    [
      "Database recovery concepts, log-based recovery (deferred/immediate update)",
      "Checkpointing and ARIES recovery algorithm",
      "File organization: sequential, hashed, and indexed file structures",
      "RAID levels and storage hierarchy comparison"
    ],
    [
      "NoSQL databases overview: Key-Value, Document, Column-family, Graph",
      "CAP Theorem (Consistency, Availability, Partition Tolerance) and BASE properties",
      "Distributed database architectures, replication, and sharding",
      "Data warehousing, ETL processes, and OLAP vs OLTP concepts"
    ]
  ],
  'Java': [
    [
      "JVM, JRE, JDK architecture, compilation, and bytecode execution",
      "Java primitives, variables, type casting, and operators",
      "Control flow: if-else, switch-case, loops (for, while, do-while, nested loops)",
      "String handling in Java: String, StringBuilder, StringBuffer, and memory pool"
    ],
    [
      "Classes, objects, constructors, and garbage collection basics",
      "Encapsulation: access modifiers (private, default, protected, public) and getters/setters",
      "Inheritance: 'extends', super keyword, method overriding, and polymorphism",
      "Abstract classes and Interfaces: differences, multiple inheritance simulation, default/static methods"
    ],
    [
      "Exception hierarchy: checked vs unchecked exceptions",
      "Try-catch-finally block, try-with-resources, and custom exceptions",
      "File I/O: Byte streams, character streams, FileReader, FileWriter, and BufferedReader",
      "Java Serialization and Deserialization concepts"
    ],
    [
      "Collections hierarchy, List interface (ArrayList, LinkedList, Vector)",
      "Set interface (HashSet, LinkedHashSet, TreeSet) and hashing internals",
      "Map interface (HashMap, LinkedHashMap, TreeMap) and collision resolution",
      "Iterators, Comparators, and Comparable interfaces for custom sorting"
    ],
    [
      "Creating threads: extending Thread class, implementing Runnable interface",
      "Thread lifecycle, state transitions, priority, and daemon threads",
      "Synchronization: synchronized blocks/methods, volatile keyword, and deadlock prevention",
      "Inter-thread communication: wait(), notify(), notifyAll(), and Producer-Consumer problem"
    ],
    [
      "Lambda expressions, Functional interfaces, and Method references",
      "Java Stream API: filter, map, reduce, collect, and parallel streams",
      "Generics in Java: classes, methods, wildcards, and type erasure",
      "Reflection API, Annotations, and JDBC database connection basics"
    ]
  ],
  'Python': [
    [
      "Python syntax, dynamic typing, variables, and basic I/O operations",
      "Numeric types, Boolean logic, operators, and expressions",
      "Control flow: if-elif-else statements and loops (for, while) with break/continue/pass",
      "Built-in data structures: Lists, Tuples, and basic operations"
    ],
    [
      "Dictionaries and Sets: creation, manipulation, and time complexities",
      "User-defined functions: arguments (*args, **kwargs), return values, and scope (LEGB rule)",
      "Lambda functions, map(), filter(), reduce(), and list comprehensions",
      "String methods, formatting (f-strings), and regular expressions (re module)"
    ],
    [
      "File I/O: reading and writing files (txt, csv, json) with context managers (with statement)",
      "Module imports, custom modules, packages, and namespaces",
      "Exception handling: try-except-else-finally blocks, raising exceptions, and custom exceptions",
      "Virtual environments (venv), pip package manager, and dependency management"
    ],
    [
      "Classes, objects, self parameter, and constructor (__init__)",
      "Encapsulation (public, private attributes using underscores) and property decorators",
      "Inheritance, method overriding, super() function, and multiple inheritance (MRO)",
      "Magic methods / Dunder methods (e.g., __str__, __repr__, __len__, __eq__)"
    ],
    [
      "Iterators, iterables, and generator functions using yield",
      "Decorators: writing custom decorators and nesting decorators",
      "Context managers: custom context managers using class (__enter__, __exit__) and contextlib",
      "Multiprocessing and Multithreading: Global Interpreter Lock (GIL) implications"
    ],
    [
      "Introduction to NumPy: arrays, vectorization, and broadcasting operations",
      "Introduction to Pandas: DataFrames, Series, reading datasets, and data cleaning",
      "Data visualization basics: Matplotlib and Seaborn plotting",
      "Testing in Python (unittest, pytest) and code quality guidelines (PEP 8)"
    ]
  ],
  'Data Structures': [
    [
      "Memory representation of arrays, dynamic sizing, and address calculations",
      "Single, Double, and Circular Linked Lists: insertion, deletion, and traversal",
      "Time and space complexity analysis (Big O, Omega, Theta notation)",
      "Interview problems: reversing a list, loop detection (Floyd's cycle-finding)"
    ],
    [
      "Stack ADT: array and linked list implementation, push/pop operations",
      "Applications of Stacks: infix to postfix conversion, parenthesis matching",
      "Queue ADT: Linear Queue, Circular Queue, and Double-Ended Queue (Deque)",
      "Priority Queues, Monotonic Stacks, and sliding window problems"
    ],
    [
      "Tree terminology, Binary Trees properties, and traversal algorithms (DFS & BFS)",
      "Binary Search Trees (BST): insertion, deletion, searching, and time complexity",
      "Self-balancing trees: AVL trees (single and double rotations) and Red-Black Trees properties",
      "Trie (Prefix Tree) implementation: insert, search, and startswith operations"
    ],
    [
      "Binary Heap representation, Min-Heap, Max-Heap, and heapify operations",
      "Heap sort algorithm and Heap-based priority queue applications",
      "Hash Tables: hash functions, load factor, and collision handling (Chaining vs Open Addressing)",
      "Design a HashMap from scratch: time-complexity analysis of operations"
    ],
    [
      "Graph representations: Adjacency Matrix and Adjacency List",
      "Graph traversal: Breadth-First Search (BFS) and Depth-First Search (DFS)",
      "Shortest path algorithms: Dijkstra's algorithm and Bellman-Ford algorithm",
      "Minimum Spanning Trees (MST): Prim's and Kruskal's algorithms"
    ],
    [
      "Disjoint Set Union (Union-Find) with path compression and rank optimization",
      "Segment Trees / Fenwick Trees for range query operations",
      "Core sorting algorithms (Merge Sort, Quick Sort, Radix Sort) review",
      "Solving mixed Leetcode Medium/Hard problems on graphs, trees, and heaps"
    ]
  ],
  'Operating System': [
    [
      "Operating System functions, kernel types (microkernel, monolithic), and system calls",
      "Process concept, Process Control Block (PCB), and process state transitions",
      "Operations on processes (fork, exec, wait, exit) and IPC (pipes, shared memory)",
      "Threads vs Processes, user-level vs kernel-level threads, and multi-core programming"
    ],
    [
      "Preemptive and Non-Preemptive scheduling concepts and metrics",
      "Scheduling algorithms: First Come First Served (FCFS), Shortest Job First (SJF)",
      "Round Robin (RR), Priority Scheduling, and Multi-Level Queue Scheduling",
      "Numerical scheduling problems: waiting time, turnaround time, and response time"
    ],
    [
      "Critical section problem, race conditions, and software solutions (Peterson's)",
      "Hardware solutions (Test-And-Set, Compare-And-Swap) and Semaphores (binary/counting)",
      "Classical synchronization problems: Bounded-Buffer, Readers-Writers, Dining Philosophers",
      "Monitors and Mutexes: differences, locking mechanisms, and spinlocks"
    ],
    [
      "Deadlock characterization: four necessary conditions for deadlock",
      "Resource allocation graphs and Deadlock Prevention strategies",
      "Deadlock Avoidance: Banker's algorithm for single and multiple resource types",
      "Deadlock Detection, recovery methods, and starvation vs deadlock"
    ],
    [
      "Logical vs Physical address space, contiguous allocation, and fragmentation",
      "Paging mechanism: Page Table, Translation Lookaside Buffer (TLB), and multi-level paging",
      "Segmentation: concept, hardware implementation, and paging/segmentation hybrid",
      "Virtual Memory: demand paging, page faults, and page replacement policies (FIFO, LRU, Optimal)"
    ],
    [
      "Disk structure, disk scheduling algorithms (FCFS, SSTF, SCAN, LOOK, C-SCAN)",
      "File concepts, access methods, directory structures, and file system mounting",
      "Allocation methods (contiguous, linked, indexed) and free-space management",
      "Protection, security access control lists, and RAID storage systems"
    ]
  ],
  'Computer Networks': [
    [
      "Network topologies, LAN/WAN/MAN, and client-server vs peer-to-peer networks",
      "OSI reference model vs TCP/IP protocol suite (layer functions and protocols)",
      "Transmission media (guided vs unguided) and physical layer properties",
      "Multiplexing (FDM, TDM, WDM) and switching (packet, circuit, message switching)"
    ],
    [
      "Framing, error detection and correction (Parity, CRC, Hamming code)",
      "Flow control protocols (Stop-and-Wait, Go-Back-N, Selective Repeat ARQ)",
      "Multiple access protocols: CSMA/CD, CSMA/CA, and Aloha protocols",
      "Ethernet standards (IEEE 802.3), MAC addresses, ARP, and Layer 2 switching"
    ],
    [
      "IP addressing: IPv4 structure, classful vs classless addressing, and subnetting",
      "Classless Inter-Domain Routing (CIDR) and Network Address Translation (NAT)",
      "Routing algorithms: Link State (OSPF) and Distance Vector (RIP) routing",
      "ICMP protocol, packet fragmentation, and IPv6 header changes/advancements"
    ],
    [
      "Transport layer services, multiplexing, demultiplexing, and socket programming",
      "User Datagram Protocol (UDP): header format, characteristics, and use cases",
      "Transmission Control Protocol (TCP): connection establishment (3-way handshake) and teardown",
      "TCP Congestion Control (slow start, congestion avoidance, fast recovery) and flow control (sliding window)"
    ],
    [
      "Domain Name System (DNS) resolution process, hierarchy, and record types",
      "Hypertext Transfer Protocol (HTTP/1.x, HTTP/2, HTTPS) and SSL/TLS handshake",
      "Email protocols: SMTP, POP3, IMAP, and MIME extensions",
      "File transfer and management: FTP, TFTP, and DHCP dynamic addressing"
    ],
    [
      "Cryptography basics: symmetric vs asymmetric encryption, digital signatures",
      "Firewalls (packet filtering, stateful inspection) and Intrusion Detection Systems (IDS)",
      "Virtual Private Networks (VPNs), IPsec, and tunneling protocols",
      "Introduction to Software Defined Networking (SDN) and Cloud Networking concepts"
    ]
  ],
  'Machine Learning': [
    [
      "Types of Machine Learning: Supervised, Unsupervised, Semi-supervised, Reinforcement Learning",
      "Data preprocessing: normalization, encoding categorical variables, handling missing data",
      "Linear Regression: cost function, gradient descent, and evaluation metrics (MSE, R2 score)",
      "Regularization techniques: Ridge (L2) and Lasso (L1) regression concepts"
    ],
    [
      "Logistic Regression: sigmoid function, decision boundary, and binary cross-entropy",
      "Classification metrics: Confusion Matrix, Accuracy, Precision, Recall, F1-Score, and ROC-AUC",
      "Support Vector Machines (SVM): margins, hyperplanes, and kernel trick",
      "Naive Bayes Classifier: Bayes theorem, independence assumption, and application in spam filtering"
    ],
    [
      "Decision Trees: entropy, information gain, Gini impurity, and pruning strategies",
      "Ensemble learning concepts: Bagging vs Boosting",
      "Random Forest classifier/regressor implementation and feature importance analysis",
      "Gradient Boosting Machines, XGBoost, and AdaBoost principles"
    ],
    [
      "Clustering concepts and K-Means clustering algorithm: elbow method for optimal K",
      "Hierarchical clustering (agglomerative vs divisive) and DBSCAN density clustering",
      "Dimensionality reduction: Principal Component Analysis (PCA) mathematics and execution",
      "Anomaly detection and Association Rule Learning (Apriori algorithm)"
    ],
    [
      "Biological vs artificial neurons, Multi-Layer Perceptrons (MLP) architecture",
      "Activation functions: Sigmoid, Tanh, ReLU, Leaky ReLU, Softmax",
      "Backpropagation algorithm, chain rule, and optimization algorithms (SGD, Adam)",
      "Introduction to Convolutional Neural Networks (CNNs) for image classification"
    ],
    [
      "Underfitting vs Overfitting, Bias-Variance tradeoff, and regularization strategies",
      "Cross-Validation techniques (K-Fold, Stratified K-Fold) and Hyperparameter tuning (GridSearch, RandomSearch)",
      "Feature selection methods: filter, wrapper, and embedded approaches",
      "Model deployment basics, ML pipelines, and MLOps lifecycle overview"
    ]
  ],
  'Generic': [
    [
      "Introduction to primary terminology and defining structural scope",
      "Core concepts and foundational axioms review",
      "Exploring standard workflows and basic operation sequences",
      "Practical exercises on basic structures and setups"
    ],
    [
      "Key equations & formula derivation practices",
      "Examining methodology and rule-based procedures",
      "Analyzing case studies and typical layouts",
      "Reviewing common problems and standard solutions"
    ],
    [
      "Advanced rules and complex interactions",
      "Integration of components and modular coordination",
      "Intermediate review & milestone self-assessments",
      "Hands-on implementation of composite exercises"
    ],
    [
      "Edge cases and performance bottleneck analysis",
      "Optimizations, refactoring, and efficiency practices",
      "Peer-level review and discussion of design alternatives",
      "Advanced implementation & performance tweaks"
    ],
    [
      "Diagnostic procedures and troubleshooting routines",
      "Comprehensive validation, debugging, and verification",
      "Past exams analysis & review of weak concepts",
      "Developing reference summary sheets and checklist revision"
    ],
    [
      "Simulated scenario walkthrough and time management review",
      "Comprehensive exam preparation and final checklist review",
      "Mock final assessment under exam timings",
      "Final project or paper assembly and post-mortem discussion"
    ]
  ]
};

function getSubjectCurriculum(subjectStr: string): string[][] {
  const norm = subjectStr.trim().toLowerCase();
  if (norm === 'sql') return SUBJECT_CURRICULA['SQL'];
  if (norm === 'dbms') return SUBJECT_CURRICULA['DBMS'];
  if (norm === 'java') return SUBJECT_CURRICULA['Java'];
  if (norm === 'python') return SUBJECT_CURRICULA['Python'];
  if (norm === 'data structures' || norm === 'data structure' || norm === 'dsa') return SUBJECT_CURRICULA['Data Structures'];
  if (norm === 'operating system' || norm === 'operating systems' || norm === 'os') return SUBJECT_CURRICULA['Operating System'];
  if (norm === 'computer networks' || norm === 'computer network' || norm === 'cn') return SUBJECT_CURRICULA['Computer Networks'];
  if (norm === 'machine learning' || norm === 'ml') return SUBJECT_CURRICULA['Machine Learning'];
  return SUBJECT_CURRICULA['Generic'];
}

export default function StudyPlanner() {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [subject, setSubject] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(2);
  const [dailyHours, setDailyHours] = useState(2);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string>('');
  const [planIdToDelete, setPlanIdToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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
      const curriculum = getSubjectCurriculum(subject);
      const topics: StudyPlan['topics'] = [];
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      const totalTopicsCount = durationWeeks * 4; // 4 topics per week
      for (let i = 0; i < totalTopicsCount; i++) {
        const week = Math.floor(i / 4) + 1;
        const day = days[i % days.length];
        
        const weekIdx = (week - 1) % curriculum.length;
        const topicIdx = i % curriculum[weekIdx].length;
        const template = curriculum[weekIdx][topicIdx];
        
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
    setPlanIdToDelete(planId);
    setIsConfirmOpen(true);
  };

  const executeDeletePlan = () => {
    if (!planIdToDelete) return;
    const updated = db.deletePlan(planIdToDelete);
    setPlans(updated);
    if (activePlanId === planIdToDelete) {
      if (updated.length > 0) {
        setActivePlanId(updated[0].id);
      } else {
        setActivePlanId('');
      }
    }
    setPlanIdToDelete(null);
    setIsConfirmOpen(false);
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

      {/* Custom Glassmorphic Delete Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-modal-backdrop">
          <div className="glass-panel border border-gray-800 bg-[#120d22]/90 rounded-3xl p-6 max-w-sm w-full mx-4 shadow-2xl animate-modal-content">
            <h3 className="text-base font-bold text-white mb-2">Delete Study Plan?</h3>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setPlanIdToDelete(null);
                  setIsConfirmOpen(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/[0.02] border border-gray-805/80 hover:border-gray-700/60 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={executeDeletePlan}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-950/20 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
