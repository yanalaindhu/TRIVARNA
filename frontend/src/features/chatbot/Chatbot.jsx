import React from 'react';
import { useNavigate } from 'react-router-dom';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import { ArrowLeft } from 'lucide-react';

export default function Chatbot() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between antialiased">
      {/* 1. Global Navigation Bar */}
      <header className="bg-white border-b border-gray-100 py-4 px-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <img
              src="/logo.png"
              alt="Trivarna Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="text-xl font-black text-text-primary tracking-tight">
              TRIVARNA
            </span>
          </div>

          {/* Back to Dashboard Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-text-secondary hover:text-text-primary font-bold text-xs shadow-sm transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* 2. Main Chat Area Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-5xl bg-white border border-gray-100 rounded-2xl shadow-md overflow-hidden flex flex-col md:flex-row h-[75vh] min-h-[500px] transition-all duration-300">
          <ChatSidebar />
          <ChatWindow />
        </div>
      </main>

      {/* 3. Global Footer */}
      <footer className="bg-white border-t border-gray-100 py-4 text-center text-xs text-text-secondary">
        <div className="max-w-6xl mx-auto px-6">
          © {new Date().getFullYear()} TRIVARNA. All rights reserved. • Multi-RAG Cognitive Assistance System
        </div>
      </footer>
    </div>
  );
}
