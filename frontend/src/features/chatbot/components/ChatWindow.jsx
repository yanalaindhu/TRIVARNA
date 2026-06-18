import React, { useState, useRef, useEffect } from 'react';
import { useChatbotStore } from '../store/chatbotStore';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import SuggestionChips from './SuggestionChips';
import { RAG_MODELS } from '../data/ragModels';
import { Send, Sparkles, MessageSquare } from 'lucide-react';

export default function ChatWindow() {
  const { messages, sendMessage, isTyping, selectedModel } = useChatbotStore();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const activeModel = RAG_MODELS.find(m => m.id === selectedModel) || RAG_MODELS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    sendMessage(input);
    setInput('');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50/50 relative overflow-hidden">
      {/* 1. Header Info Bar */}
      <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shadow-sm relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 rounded-full bg-success-green animate-pulse" />
          <div>
            <h2 className="font-extrabold text-sm text-text-primary tracking-tight">
              {activeModel.name} Active Session
            </h2>
            <p className="text-[10px] font-semibold text-text-secondary">
              RAG Vector Match: ONLINE • Engine: {activeModel.engine}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Chat Messages Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto">
            <div className="w-12 h-12 bg-light-purple border border-primary-purple/15 text-primary-purple rounded-xl flex items-center justify-center shadow-inner">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-text-primary">No Messages</h4>
              <p className="text-xs text-text-secondary">
                Start a conversation to query your TRIVARNA vector stores.
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}

        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input & Suggestion Section */}
      <div className="p-4 border-t border-gray-100 bg-white shadow-lg relative z-10">
        <div className="max-w-3xl mx-auto space-y-3">
          {/* Quick prompt suggestion chips */}
          <SuggestionChips />

          {/* Form Text Field */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping}
                placeholder={`Ask ${activeModel.name}... (e.g. try clicking the suggestion chips below)`}
                className="w-full pl-4 pr-12 py-3.5 border border-gray-200 rounded-xl focus:border-[#6C4CF1] focus:ring-1 focus:ring-[#6C4CF1] outline-none transition-all duration-200 text-slate-800 text-sm font-medium hover:border-gray-300 disabled:bg-gray-50/50"
              />
              <div className="absolute right-4 text-text-secondary/40">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className={`p-3.5 rounded-xl border font-bold text-sm transition-all duration-200 flex items-center justify-center text-white ${
                input.trim() && !isTyping
                  ? 'bg-[#6C4CF1] border-[#6C4CF1] hover:bg-[#583cd1] shadow'
                  : 'bg-gray-200 border-gray-200 cursor-not-allowed text-gray-400'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-[10px] text-text-secondary/60 text-center">
            TRIVARNA Multi-RAG securely runs vector embedding queries locally on your cached database instances.
          </p>
        </div>
      </div>
    </div>
  );
}
