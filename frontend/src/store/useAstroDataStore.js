import { create } from 'zustand';
import axiosInstance from '../utils/axios';

const useAstroDataStore = create((set) => ({
  panchang: null,
  horoscopes: [],        // all 12 signs for today
  selectedHoroscope: null, // single sign detail view
  isLoadingPanchang: false,
  isLoadingHoroscopes: false,
  isLoadingSelected: false,
  error: null,
  lastFetchedDate: null, // Tracks which day the data belongs to

  checkAndRefresh: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { lastFetchedDate, fetchPanchang, fetchAllHoroscopes } = useAstroDataStore.getState();
    
    if (lastFetchedDate !== today) {
      console.log("🕒 New day detected, refreshing astro data...");
      await Promise.all([fetchPanchang(), fetchAllHoroscopes()]);
      set({ lastFetchedDate: today });
    }
  },

  fetchPanchang: async () => {
    set({ isLoadingPanchang: true, error: null });
    try {
      const res = await axiosInstance.get('/astro/panchang/today');
      if (res.data.success) {
        set({ panchang: res.data.data, isLoadingPanchang: false });
      }
    } catch (err) {
      // Silently fail if not seeded yet — show dashes as fallback
      set({ panchang: null, isLoadingPanchang: false });
    }
  },

  fetchAllHoroscopes: async () => {
    set({ isLoadingHoroscopes: true, error: null });
    try {
      const res = await axiosInstance.get('/astro/horoscopes/today');
      if (res.data.success) {
        // Ensure we always store an array, regardless of API response shape
        const data = res.data.data;
        const horoscopesArray = Array.isArray(data) ? data : (data ? [data] : []);
        set({ horoscopes: horoscopesArray, isLoadingHoroscopes: false });
      }
    } catch (err) {
      // If not seeded yet (404), silently fail - show empty state
      set({ horoscopes: [], isLoadingHoroscopes: false });
    }
  },

  fetchHoroscopeBySign: async (sign) => {
    set({ isLoadingSelected: true, selectedHoroscope: null });
    try {
      const res = await axiosInstance.get(`/astro/horoscopes/${sign.toLowerCase()}`);
      if (res.data.success) {
        set({ selectedHoroscope: res.data.data, isLoadingSelected: false });
      }
    } catch (err) {
      set({ isLoadingSelected: false });
    }
  },

  clearSelectedHoroscope: () => set({ selectedHoroscope: null }),
}));


export default useAstroDataStore;
