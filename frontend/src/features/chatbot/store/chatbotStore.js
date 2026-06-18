import { create } from 'zustand';
import { RAG_MODELS } from '../data/ragModels';
import { VECTOR_DATABASES } from '../data/vectorDatabases';
import { MOCK_RESPONSES } from '../data/mockConversations';
import api from '../../../services/api';

const getWelcomeMessage = (modelId) => {
  const model = RAG_MODELS.find(m => m.id === modelId) || RAG_MODELS[0];
  return {
    id: 'welcome-' + modelId,
    sender: 'assistant',
    text: model.welcomeMessage,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sources: []
  };
};

export const useChatbotStore = create((set, get) => ({
  selectedModel: 'mind_rag',
  isTyping: false,
  messages: [getWelcomeMessage('mind_rag')],
  activeDatabases: VECTOR_DATABASES['mind_rag'],

  setSelectedModel: (modelId) => {
    set({
      selectedModel: modelId,
      messages: [getWelcomeMessage(modelId)],
      activeDatabases: VECTOR_DATABASES[modelId] || [],
      isTyping: false
    });
  },

  setTyping: (isTyping) => set({ isTyping }),

  sendMessage: async (text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: 'msg-' + Date.now() + '-user',
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: []
    };

    // Append user message and set typing state
    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true
    }));

    try {
      const response = await api.post('/api/chatbot/query', {
        model_id: get().selectedModel,
        prompt: text
      });

      const assistantMessage = {
        id: 'msg-' + Date.now() + '-assistant',
        sender: 'assistant',
        text: response.data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: response.data.sources || []
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false
      }));
    } catch (error) {
      console.error("RAG Query failed:", error);
      const errorMessage = {
        id: 'msg-' + Date.now() + '-error',
        sender: 'assistant',
        text: "Sorry, I encountered an issue querying your vector stores. Please ensure the backend server is running and try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: []
      };
      set((state) => ({
        messages: [...state.messages, errorMessage],
        isTyping: false
      }));
    }
  },

  clearHistory: () => {
    const currentModel = get().selectedModel;
    set({
      messages: [getWelcomeMessage(currentModel)],
      isTyping: false
    });
  }
}));
