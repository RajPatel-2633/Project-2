import { create } from 'zustand';
import axiosInstance from '../utils/axios';

const useChatStore = create((set, get) => ({
  sessionId: null,
  messages: [],
  chatHistory: [],
  isChatLoading: false,
  error: null,

  initChat: async (userId, profileId, title = "Consultation") => {
    set({ isChatLoading: true, error: null, messages: [] });
    try {
      const response = await axiosInstance.post('/chat/initialise-chat', {
        user_id: userId,
        profile_id: profileId,
        title
      });

      if (response.data.success) {
        const { session, greeting } = response.data.data;
        set({ 
          sessionId: session._id, 
          messages: [{ role: 'model', content: greeting }],
          isChatLoading: false 
        });
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      set({ 
        error: error.response?.data?.message || 'Failed to initialize chat.',
        isChatLoading: false 
      });
    }
  },

  sendMessage: async (message, userId, profileId) => {
    const { sessionId, messages, initChat } = get();
    if (!message.trim()) return;

    // Optimistically add user message immediately
    const userMsg = { role: 'user', content: message };
    set({ 
      messages: [...messages, userMsg],
      isChatLoading: true,
      error: null
    });

    try {
      let activeSessionId = sessionId;

      // 1. If no session exists, try to initialize it on the fly
      if (!activeSessionId) {
        console.log("🚀 No session ID found, initializing chat on the fly...");
        if (!userId || !profileId) {
            throw new Error("Cannot initialize chat without user and profile context.");
        }
        
        const initResponse = await axiosInstance.post('/chat/initialise-chat', {
            user_id: userId,
            profile_id: profileId,
            title: "Quick Consultation"
        });

        if (initResponse.data.success) {
            activeSessionId = initResponse.data.data.session._id;
            // Update store with new session ID but keep the optimistic user message
            set({ sessionId: activeSessionId });
        } else {
            throw new Error("Auto-initialization failed");
        }
      }

      // 2. Now send the message
      const response = await axiosInstance.post(`/chat/send-message/${activeSessionId}`, { message });
      
      if (response.data.success) {
        const aiResponse = response.data.data.response;
        set({ 
          messages: [...get().messages, { role: 'model', content: aiResponse }],
          isChatLoading: false 
        });
      }
    } catch (error) {
      console.error("❌ Error in Chat Flow:", error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to communicate with Astro AI.';
      set({ 
        error: errorMsg,
        messages: [...get().messages, { role: 'model', content: "I am having trouble connecting to the stars right now. Please try again in a moment." }],
        isChatLoading: false 
      });
    }
  },

  fetchChatHistory: async () => {
    set({ isChatLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/chat/sessions');
      if (response.data.success) {
        set({ chatHistory: response.data.data, isChatLoading: false });
      }
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch sessions', isChatLoading: false });
    }
  },

  fetchSessionMessages: async (sessionId) => {
    set({ isChatLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/chat/messages/${sessionId}`);
      if (response.data.success) {
        set({ 
          messages: response.data.data, 
          sessionId, 
          isChatLoading: false 
        });
        return true;
      }
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch messages', isChatLoading: false });
      return false;
    }
  },

  clearChat: () => set({ sessionId: null, messages: [], error: null })
}));

export default useChatStore;
