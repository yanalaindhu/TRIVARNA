import React from 'react';
import ModelSelector from './ModelSelector';
import DatabasePanel from './DatabasePanel';
import { useChatbotStore } from '../store/chatbotStore';
import { RAG_MODELS } from '../data/ragModels';
import { Info, RefreshCw } from 'lucide-react';

export default function ChatSidebar() {
  const { selectedModel, clearHistory } = useChatbotStore();
  const activeModel = RAG_MODELS.find(m => m.id === selectedModel) || RAG_MODELS[0];

  return (
    <div className="w-full md:w-80 border-r border-gray-100 flex flex-col justify-between h-full bg-white relative">
      {/* 1. Header */}
      <div className="p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <img
              src="/logo.png"
              alt="Trivarna AI Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-extrabold text-text-primary text-base tracking-tight">
              TRIVARNA AI
            </span>
          </div>
          <button
            onClick={clearHistory}
            title="Reset conversation"
            className="p-1.5 rounded-lg border border-gray-200 text-text-secondary hover:text-primary-purple hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Middle Configuration */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <ModelSelector />
        <DatabasePanel />
      </div>

      {/* 3. Footer System Prompt Indicator */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-inner flex items-start space-x-2">
          <Info className="w-3.5 h-3.5 text-primary-purple flex-shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed text-text-secondary">
            <span className="font-bold text-text-primary block mb-0.5">RAG System Context</span>
            {activeModel.systemPrompt}
          </div>
        </div>
      </div>
    </div>
  );
}
