import React, { useState, useEffect, useRef } from 'react';
import { db } from '../mockFirebase';
import type { ChatSession, ChatMessage } from '../mockFirebase';
import { 
  Send, 
  Plus, 
  Trash2, 
  User as UserIcon, 
  Bot, 
  GraduationCap, 
  Coffee,
  Brain
} from 'lucide-react';

export default function AIChat() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [persona, setPersona] = useState<'coach' | 'buddy' | 'scholar'>('coach');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize and load chat sessions
  useEffect(() => {
    const list = db.getChats();
    setSessions(list);
    if (list.length > 0) {
      setActiveSessionId(list[0].id);
      setMessages(list[0].messages);
      setPersona(list[0].persona);
    }
  }, []);

  // Reload messages when active session changes
  useEffect(() => {
    if (activeSessionId) {
      const active = sessions.find(s => s.id === activeSessionId);
      if (active) {
        setMessages(active.messages);
        setPersona(active.persona);
      }
    } else {
      setMessages([]);
    }
  }, [activeSessionId, sessions]);

  // Scroll to bottom on new messages
  useEffect(() => {
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
    return () => clearTimeout(timer);
  }, [messages, loading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateNewChat = () => {
    const titles = {
      coach: 'AI Study Coaching Session',
      buddy: 'Study Buddy Chat',
      scholar: 'Rigorous Academic Proofs'
    };
    const newChat = db.createChat(titles[persona], persona);
    setSessions(db.getChats());
    setActiveSessionId(newChat.id);
  };

  const handleDeleteChat = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const chats = db.getChats().filter(c => c.id !== id);
    localStorage.setItem('study_pilot_chats', JSON.stringify(chats));
    setSessions(chats);
    
    if (activeSessionId === id) {
      if (chats.length > 0) {
        setActiveSessionId(chats[0].id);
      } else {
        setActiveSessionId('');
        setMessages([]);
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    
    const textToSend = customText || inputText;
    if (!textToSend.trim() || !activeSessionId) return;

    if (!customText) setInputText('');

    // 1. Add User Message
    const updatedSession = db.addMessage(activeSessionId, textToSend, 'user');
    setSessions(db.getChats());
    setMessages(updatedSession.messages);
    setLoading(true);

    // Award user some XP for asking question
    db.updateUserXp(5);
    window.dispatchEvent(new Event('profile-updated'));

    // 2. Generate AI Response
    try {
      const aiReply = await db.generateAIResponse(activeSessionId, textToSend, persona);
      const finalSession = db.addMessage(activeSessionId, aiReply, 'assistant');
      setSessions(db.getChats());
      setMessages(finalSession.messages);
    } catch (err) {
      console.error("AI chat error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (prompt: string) => {
    handleSendMessage(undefined, prompt);
  };

  const activeSession = sessions.find(s => s.id === activeSessionId);

  const personaDetails = {
    coach: {
      title: 'AI Study Coach',
      desc: 'Adaptable guide focusing on planning, testing, and memory techniques.',
      icon: Brain,
      bgColor: 'bg-violet-950/40 border-violet-800/40 text-violet-400',
      tagline: 'Focused on structured, strategic learning methods.'
    },
    buddy: {
      title: 'Study Buddy',
      desc: 'Casual motivator emphasizing breaks, mental pacing, and simple terms.',
      icon: Coffee,
      bgColor: 'bg-amber-950/40 border-amber-800/40 text-amber-400',
      tagline: 'Casual support, active listening, and breaks advisor.'
    },
    scholar: {
      title: 'Rigorous Scholar',
      desc: 'High-level tutor analyzing code syntax, math derivations, and research papers.',
      icon: GraduationCap,
      bgColor: 'bg-blue-950/40 border-blue-800/40 text-blue-400',
      tagline: 'Formal, technical definitions and step-by-step proofs.'
    }
  };

  const presetChips = [
    "Explain recursion like I'm 5",
    "Suggest a Pomodoro breaks schedule",
    "Derivative of f(x) = 5x^3 - 4x",
    "What are Feynman technique steps?"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)] min-h-[500px]">
      
      {/* Sidebar - Sessions & Personas */}
      <div className="lg:col-span-1 flex flex-col justify-between h-full bg-white/[0.01] border border-gray-800/60 rounded-3xl p-4 overflow-hidden">
        <div className="space-y-5 overflow-hidden flex flex-col h-full">
          
          {/* Persona selector */}
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-2.5 block">AI Coach Persona</span>
            <div className="grid grid-cols-3 gap-2">
              {(Object.keys(personaDetails) as Array<keyof typeof personaDetails>).map((key) => {
                const item = personaDetails[key];
                const Icon = item.icon;
                const isSelected = persona === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setPersona(key);
                      // If there is an active session, let's update its persona or create new
                      if (activeSessionId) {
                        const chats = db.getChats().map(c => {
                          if (c.id === activeSessionId) return { ...c, persona: key };
                          return c;
                        });
                        localStorage.setItem('study_pilot_chats', JSON.stringify(chats));
                        setSessions(chats);
                      }
                    }}
                    className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition cursor-pointer ${
                      isSelected 
                        ? 'bg-violet-600/20 border-violet-500 text-violet-300 shadow-lg' 
                        : 'border-gray-800 hover:border-gray-700 text-gray-400 hover:text-gray-200 bg-black/20'
                    }`}
                    title={item.desc}
                  >
                    <Icon className="h-4.5 w-4.5 mb-1" />
                    <span className="text-[9px] font-bold truncate w-full">{item.title.split(' ')[1] || item.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleCreateNewChat}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white shadow-md rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat Session</span>
          </button>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider mb-1 block">Chat History</span>
            {sessions.length === 0 ? (
              <p className="text-[11px] text-gray-600 text-center py-4">No sessions created yet.</p>
            ) : (
              sessions.map(s => {
                const isActive = s.id === activeSessionId;
                const PersonaIcon = personaDetails[s.persona]?.icon || Bot;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveSessionId(s.id)}
                    className={`group flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                      isActive 
                        ? 'bg-white/[0.04] border-violet-500/30 text-white' 
                        : 'border-transparent text-gray-400 hover:bg-white/[0.02] hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      <PersonaIcon className={`h-4 w-4 shrink-0 ${isActive ? 'text-violet-400' : 'text-gray-500'}`} />
                      <span className="text-xs truncate font-medium">{s.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(e, s.id)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-1 text-gray-500 transition rounded hover:bg-white/[0.05]"
                      title="Delete chat"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Chat Display Panel */}
      <div className="lg:col-span-3 flex flex-col justify-between bg-white/[0.01] border border-gray-800/60 rounded-3xl overflow-hidden h-full relative">
        
        {/* Active Session info header */}
        <div className="p-4 border-b border-gray-800 flex items-center gap-3 bg-black/15">
          {activeSession ? (
            <>
              <div className={`p-2 rounded-xl ${personaDetails[persona].bgColor}`}>
                {React.createElement(personaDetails[persona].icon, { className: 'h-4 w-4' })}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{activeSession.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{personaDetails[persona].tagline}</p>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-400">Select or create a chat to begin</div>
          )}
        </div>

        {/* Message bubble track */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="p-3 bg-violet-600/10 border border-violet-500/20 text-violet-400 rounded-2xl animate-float">
                <Bot className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h5 className="font-bold text-white text-sm">Initiate Chat Session</h5>
                <p className="text-xs text-gray-500 max-w-xs leading-normal">
                  Ask StudyPilot AI questions, verify coding syntax, request math formulas, or build outlines.
                </p>
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.role === 'user';
              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
                  <div className={`flex items-start gap-2.5 max-w-[85%] ${isUser ? 'flex-row-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold ${
                      isUser 
                        ? 'bg-violet-950 text-violet-400 border-violet-900' 
                        : personaDetails[persona].bgColor
                    }`}>
                      {isUser ? <UserIcon className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 text-inherit" />}
                    </div>

                    {/* Bubble Content */}
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed border ${
                      isUser 
                        ? 'bg-gradient-to-tr from-violet-600 to-purple-600 border-violet-500/20 text-white shadow-md' 
                        : 'bg-white/[0.02] border-gray-800/80 text-gray-200'
                    }`}>
                      {/* Formatted Text rendering (support formatting lists and equations simple styles) */}
                      <p className="whitespace-pre-line">
                        {m.content}
                      </p>
                      <span className="text-[9px] block text-right mt-1.5 opacity-60">
                        {m.timestamp ? new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* Loader bubble */}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="flex items-start gap-2.5 max-w-[85%]">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs ${personaDetails[persona].bgColor}`}>
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="p-3.5 rounded-2xl text-xs bg-white/[0.02] border border-gray-800/80 text-gray-400 flex items-center gap-2">
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input box + Chips */}
        <div className="p-4 border-t border-gray-800 bg-black/10 space-y-3">
          
          {/* Quick chip suggestions */}
          {messages.length < 4 && (
            <div className="flex flex-wrap gap-2">
              {presetChips.map(chip => (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  disabled={loading || !activeSessionId}
                  className="px-3 py-1.5 rounded-lg border border-gray-800/80 bg-white/[0.01] hover:bg-white/[0.04] text-[10px] text-gray-400 hover:text-gray-200 transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input text form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <textarea
              required
              rows={1}
              disabled={loading || !activeSessionId}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={activeSessionId ? "Ask a study question or request an outline..." : "Select or create a chat session to begin..."}
              className="flex-1 py-3 px-4 rounded-xl text-sm glass-input disabled:opacity-40 resize-none h-[46px] overflow-y-auto leading-relaxed focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim() || !activeSessionId}
              className="p-3 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-800 text-white rounded-xl shadow-md transition disabled:opacity-50 cursor-pointer flex items-center justify-center shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
