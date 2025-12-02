

import React, { useState, useEffect, useRef } from 'react';
import { Send, Phone, Video, Info, Bot, Mic, Image as ImageIcon, Sparkles, X, Brain, Plus, Users } from 'lucide-react';
import { ChatSession, User, Message } from '../types';
import { chatWithBot, textToSpeech, transcribeAudio } from '../services/geminiService';
import { LiveVoice } from './LiveVoice';

interface ChatProps {
  currentUser: User;
  users: User[];
  sessions: ChatSession[];
  setSessions: React.Dispatch<React.SetStateAction<ChatSession[]>>;
}

export const Chat: React.FC<ChatProps> = ({ currentUser, users, sessions, setSessions }) => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(sessions[0]?.id || null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showLiveVoice, setShowLiveVoice] = useState(false);
  const [botMode, setBotMode] = useState<'fast' | 'smart'>('fast');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const activeSession = sessions.find(s => s.id === activeSessionId);
  
  // Logic to determine chat type (Direct or Group)
  const isGroup = activeSession?.isGroup;
  const isAiChat = !isGroup && activeSession?.userId === 'ai-bot';
  
  let chatName = "Chat";
  let chatAvatar = "";
  let isOnline = false;

  if (activeSession) {
      if (isGroup) {
          chatName = activeSession.groupName || "Group Chat";
          chatAvatar = activeSession.groupAvatar || "https://ui-avatars.com/api/?name=Group&background=random";
          isOnline = true; // Assume group is always "active"
      } else {
          const otherUser = users.find(u => u.id === activeSession.userId);
          if (otherUser) {
              chatName = otherUser.name;
              chatAvatar = otherUser.avatar;
              isOnline = !!otherUser.isOnline;
          }
      }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession?.messages]);

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim() || !activeSessionId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      text: text,
      timestamp: new Date()
    };

    updateSession(newMessage);
    setInputText('');

    if (isAiChat) {
      setIsTyping(true);
      const history = (activeSession?.messages || []).map(m => ({
        role: m.senderId === currentUser.id ? 'user' as const : 'model' as const,
        parts: [{ text: m.text }]
      }));
      const currentHistory = [...history, { role: 'user' as const, parts: [{ text: text }] }];

      try {
        const responseText = await chatWithBot(history, text, botMode);
        
        const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            senderId: 'ai-bot',
            senderName: 'WTBot',
            text: responseText,
            timestamp: new Date(),
            isAi: true
        };

        updateSession(botMessage);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const updateSession = (msg: Message) => {
      setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
              return {
                  ...s,
                  messages: [...s.messages, msg],
                  lastMessage: isGroup ? `${msg.senderName}: ${msg.text}` : msg.text,
                  unread: 0
              };
          }
          return s;
      }));
  };

  const handleCreateGroup = () => {
      const name = prompt("Enter Group Name:");
      if (!name) return;
      const newSession: ChatSession = {
          id: Date.now().toString(),
          isGroup: true,
          groupName: name,
          groupAvatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
          participants: [currentUser.id, users[0].id], // Just mock add first user
          lastMessage: "Group created",
          unread: 0,
          messages: []
      };
      setSessions([newSession, ...sessions]);
      setActiveSessionId(newSession.id);
  }

  // Recording Logic for Transcription
  const toggleRecording = async () => {
      if (isRecording) {
          mediaRecorderRef.current?.stop();
          setIsRecording(false);
      } else {
          try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              const recorder = new MediaRecorder(stream);
              const chunks: BlobPart[] = [];
              
              recorder.ondataavailable = e => chunks.push(e.data);
              recorder.onstop = async () => {
                  const blob = new Blob(chunks, { type: 'audio/mp3' });
                  const reader = new FileReader();
                  reader.readAsDataURL(blob);
                  reader.onloadend = async () => {
                      const base64 = (reader.result as string).split(',')[1];
                      setIsTyping(true);
                      const text = await transcribeAudio(base64);
                      setIsTyping(false);
                      if (text) setInputText(text);
                  }
                  stream.getTracks().forEach(t => t.stop());
              };
              
              recorder.start();
              mediaRecorderRef.current = recorder;
              setIsRecording(true);
          } catch (e) {
              console.error("Mic Access Error", e);
          }
      }
  }

  return (
    <>
      {showLiveVoice && <LiveVoice onClose={() => setShowLiveVoice(false)} />}
      
      <div className="flex h-[calc(100vh-64px)] md:h-screen pt-0 md:pt-0 bg-white dark:bg-gray-800 md:ml-0 transition-colors">
        {/* Chat List */}
        <div className={`w-full md:w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col ${activeSessionId ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Messages</h2>
            <button onClick={handleCreateGroup} className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 p-2 rounded-full" title="New Group">
                <Users size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
            {sessions.map(session => {
              let sName = "Chat";
              let sAvatar = "";
              let sOnline = false;

              if (session.isGroup) {
                  sName = session.groupName!;
                  sAvatar = session.groupAvatar!;
              } else {
                  const u = users.find(usr => usr.id === session.userId);
                  if (u) {
                      sName = u.name;
                      sAvatar = u.avatar;
                      sOnline = !!u.isOnline;
                  }
              }

              return (
                <div 
                  key={session.id}
                  onClick={() => setActiveSessionId(session.id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-50 dark:border-gray-700 ${activeSessionId === session.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}
                >
                  <div className="relative">
                      <img src={sAvatar} alt={sName} className="w-12 h-12 rounded-full object-cover" />
                      {sOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">{sName}</h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">12:30</span>
                    </div>
                    <p className={`text-sm truncate ${session.unread > 0 ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {session.lastMessage}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Chat Area */}
        <div className={`flex-1 flex flex-col ${!activeSessionId ? 'hidden md:flex' : 'flex'} bg-[#f0f2f5] dark:bg-gray-900 md:bg-white dark:md:bg-gray-800`}>
          {activeSessionId ? (
            <>
              {/* Header */}
              <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveSessionId(null)} className="md:hidden text-gray-500 dark:text-gray-400">
                      <X size={24} />
                  </button>
                  <img src={chatAvatar} alt={chatName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      {chatName}
                      {isAiChat && <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">Bot</span>}
                    </h3>
                    <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        {isOnline && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                        {isOnline ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                   {isAiChat && (
                       <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mr-2">
                           <button 
                                onClick={() => setBotMode('fast')}
                                className={`px-3 py-1 text-xs rounded-md transition-all ${botMode === 'fast' ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-indigo-300 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
                           >
                               Fast
                           </button>
                           <button 
                                onClick={() => setBotMode('smart')}
                                className={`px-3 py-1 text-xs rounded-md transition-all flex items-center gap-1 ${botMode === 'smart' ? 'bg-white dark:bg-gray-600 shadow text-purple-600 dark:text-purple-300 font-bold' : 'text-gray-500 dark:text-gray-400'}`}
                           >
                               <Brain size={12} /> Smart (Pro)
                           </button>
                       </div>
                   )}
                   {isAiChat && (
                       <button onClick={() => setShowLiveVoice(true)} className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors" title="Live Voice Chat">
                           <Mic size={20} />
                       </button>
                   )}
                   <button className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full"><Phone size={20} /></button>
                   <button className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full"><Video size={20} /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-gray-900">
                {activeSession!.messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      {isGroup && !isMe && <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 mb-1">{msg.senderName}</span>}
                      <div 
                        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm ${
                          isMe 
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-br-none' 
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                        <span className={`text-[10px] block text-right mt-1 opacity-70`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
                             <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-3 items-center">
                  <button className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <ImageIcon size={24} />
                  </button>
                  <button 
                    onClick={toggleRecording}
                    className={`text-gray-400 hover:text-red-500 transition-colors ${isRecording ? 'text-red-600 animate-pulse' : ''}`}
                  >
                      <Mic size={24} />
                  </button>
                  <div className="flex-1 relative">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={isAiChat ? (botMode === 'smart' ? "Ask the Genius Bot (Thinking Mode)..." : "Chat with Fast Bot...") : "Type a message..."}
                        className="w-full bg-gray-100 dark:bg-gray-700 border-none rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white dark:placeholder-gray-400"
                    />
                  </div>
                  <button 
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-lg shadow-indigo-200 dark:shadow-none"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900">
               <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-sm mb-6">
                  <Bot size={48} className="text-indigo-300 dark:text-indigo-600" />
               </div>
              <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">Welcome to Messenger</h2>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Select a chat to start connecting.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
