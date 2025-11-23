import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Hand, Wrench, Lightbulb } from 'lucide-react';
import apiClient from '../api/axios';

function AIChatbot() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = user.role || 'student';
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm HostelBot, your AI assistant. Ask me about mess menu, hostel rules, your room, dues, or anything else!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');

    // Add user message
    setMessages(prev => [...prev, {
      role: 'user',
      text: userMessage,
      timestamp: new Date()
    }]);

    setIsLoading(true);

    try {
      const response = await apiClient.post('/ai/chat', { message: userMessage });
      
      // Add bot response
      setMessages(prev => [...prev, {
        role: 'bot',
        text: response.data.reply,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Role-specific quick questions
  const getQuickQuestions = () => {
    if (userRole === 'student') {
      return [
        "What's on the menu today?",
        "What are my pending dues?",
        "What are the gate timings?",
        "Show me hostel rules"
      ];
    } else if (userRole === 'staff') {
      return [
        "What's on the menu today?",
        "Show my pending tasks",
        "What are my responsibilities?",
        "Show hostel rules"
      ];
    } else if (user.designation === 'Resident Tutor') {
      // Resident Tutor specific questions
      return [
        "What floors am I assigned to?",
        "How many students under my care?",
        "Show my floor occupancy",
        "What's on the menu today?"
      ];
    } else if (userRole === 'admin' || userRole === 'warden') {
      return [
        "Show occupancy statistics",
        "How many pending queries?",
        "What are total pending dues?",
        "Show high priority issues"
      ];
    }
    return ["What's on the menu today?", "Show hostel rules"];
  };

  const quickQuestions = getQuickQuestions();

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
    setTimeout(() => handleSendMessage(), 100);
  };

  return (
    <>
      {/* Chat Button - Bottom Right */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all duration-300 hover:scale-105 group"
        >
          <div className="relative">
            <MessageCircle size={28} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse border-2 border-white"></span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-slate-900 rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-700">
          {/* Header */}
          <div className="bg-slate-800 border-b border-slate-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base">HostelBot AI</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span>Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-indigo-400'
                  }`}
                >
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] rounded-xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 rounded-tr-none'
                      : msg.isError
                      ? 'bg-red-900/30 text-red-400 border border-red-600/50 rounded-tl-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <span
                    className={`text-xs mt-1 block ${
                      msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-indigo-400">
                  <Bot size={16} />
                </div>
                <div className="bg-slate-800 rounded-xl rounded-tl-none px-4 py-3 border border-slate-700">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    <span className="text-sm text-slate-300">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Questions - Show only if no messages yet or last message is from bot */}
            {messages.length === 1 && !isLoading && (
              <div className="pt-2">
                <p className="text-xs text-slate-400 mb-2 px-1 flex items-center gap-1">
                  <Lightbulb size={14} /> Quick questions:
                </p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(q)}
                      className="text-xs bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-3 py-2 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-800 border-t border-slate-700">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/30"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
              <Sparkles size={12} className="text-indigo-400" />
              Powered by Gemini AI • Menu, Rules, Dues & More
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;
