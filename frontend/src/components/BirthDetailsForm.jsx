import React, { useState, useEffect } from 'react';
import useAstroStore from '../store/useAstroStore';

const BirthDetailsForm = ({ onSubmit }) => {
  const { activeProfileId, profiles } = useAstroStore();
  const [formData, setFormData] = useState({
    label: 'My Chart',
    name: '',
    gender: 'PREFER NOT TO SAY',
    dob: '',
    tob: '',
    city: '',
    country: '',
    latitude: '',
    longitude: '',
    timezone: '',
    is_primary: false,
  });
  
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Sync form with active profile from sidebar
  useEffect(() => {
    if (activeProfileId && profiles.length > 0) {
      const activeProfile = profiles.find(p => p._id === activeProfileId);
      if (activeProfile) {
        setFormData({
          label: activeProfile.label,
          name: activeProfile.name,
          gender: activeProfile.gender || 'PREFER NOT TO SAY',
          dob: activeProfile.dob ? activeProfile.dob.split('T')[0] : '',
          tob: activeProfile.tob,
          city: activeProfile.birth_city || '',
          country: activeProfile.birth_country || '',
          latitude: activeProfile.latitude,
          longitude: activeProfile.longitude,
          timezone: activeProfile.timezone,
          is_primary: activeProfile.is_primary || false,
        });
      }
    }
  }, [activeProfileId, profiles]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Debounced auto-fetch for lat/lng/timezone
  useEffect(() => {
    const fetchLocation = async () => {
      if (formData.city.length < 2 || formData.country.length < 2) {
        return; 
      }
      
      setIsFetchingLocation(true);
      setLocationError('');
      
      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(formData.city)}&count=10&format=json`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          let match = data.results.find(
            res => res.country && res.country.toLowerCase().includes(formData.country.toLowerCase())
          );
          if (!match) match = data.results[0];

          setFormData(prev => ({
            ...prev,
            latitude: match.latitude,
            longitude: match.longitude,
            timezone: match.timezone || 'UTC'
          }));
        } else {
          setLocationError('Location not found in database');
          setFormData(prev => ({ ...prev, latitude: '', longitude: '', timezone: '' }));
        }
      } catch (error) {
        setLocationError('Error fetching coordinates');
      } finally {
        setIsFetchingLocation(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchLocation();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [formData.city, formData.country]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      const payload = {
        label: formData.label,
        name: formData.name,
        dob: formData.dob,
        tob: formData.tob,
        tob_unknown: false,
        birth_city: formData.city,
        birth_country: formData.country,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        timezone: formData.timezone,
        gender: formData.gender,
        is_primary: formData.is_primary,
      };
      onSubmit(payload);
    }
  };

  return (
    <div className="relative w-full flex flex-col p-4 justify-center items-center bg-transparent">
      <div className="w-full max-w-xl flex flex-col items-center relative z-10">
        
        <div className="flex flex-col items-center mb-8 relative z-20 w-full text-center">
          <h2 className="text-4xl lg:text-5xl font-serif font-bold text-astra-brown tracking-wide mb-2">Birth Details</h2>
          <p className="text-lg italic text-astra-brown/80">Enter your celestial coordinates</p>
        </div>

        {/* Form Container with parchment style */}
        <div className="w-full bg-parchment p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#8B6E4A]/30 relative">
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8B6E4A]/40"></div>
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#8B6E4A]/40"></div>
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#8B6E4A]/40"></div>
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8B6E4A]/40"></div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Profile Label <span className="text-red-500">*</span></label>
                <input type="text" name="label" value={formData.label} onChange={handleChange} required placeholder="My Chart" className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] placeholder-[#8B6E4A]/50 focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Gender Essence <span className="text-red-500">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm cursor-pointer">
                  <option value="PREFER NOT TO SAY">Select Essence</option>
                  <option value="MALE">Masculine</option>
                  <option value="FEMALE">Feminine</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Full Name <span className="text-red-500">*</span></label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Seeker of Stars" className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] placeholder-[#8B6E4A]/50 focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Time of Birth <span className="text-red-500">*</span></label>
                <input type="time" name="tob" value={formData.tob} onChange={handleChange} required className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">City of Birth <span className="text-red-500">*</span></label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="Mumbai" className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] placeholder-[#8B6E4A]/50 focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Country <span className="text-red-500">*</span></label>
                <input type="text" name="country" value={formData.country} onChange={handleChange} required placeholder="India" className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] placeholder-[#8B6E4A]/50 focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm" />
              </div>
            </div>

            {(formData.latitude || isFetchingLocation || locationError) && (
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#C4A15A]/10">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#C4A15A] tracking-widest uppercase text-center block">LATITUDE</label>
                  <div className="px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-[#4A3319] text-xs font-bold font-mono text-center">{isFetchingLocation ? '...' : formData.latitude || '—'}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#C4A15A] tracking-widest uppercase text-center block">LONGITUDE</label>
                  <div className="px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-[#4A3319] text-xs font-bold font-mono text-center">{isFetchingLocation ? '...' : formData.longitude || '—'}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-[#C4A15A] tracking-widest uppercase text-center block">TIMEZONE</label>
                  <div className="px-4 py-3 rounded-xl bg-black/5 border border-black/5 text-[#4A3319] text-xs font-bold font-mono text-center truncate">{isFetchingLocation ? '...' : formData.timezone || '—'}</div>
                </div>
              </div>
            )}
            {locationError && <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 text-center">{locationError}</p>}

            <label className="flex items-center gap-4 cursor-pointer group py-2">
              <div className="relative flex-shrink-0">
                <input type="checkbox" id="is_primary" name="is_primary" checked={formData.is_primary} onChange={handleChange} className="sr-only peer" />
                <div className="w-12 h-6 rounded-full bg-black/5 border border-black/10 peer-checked:bg-[#C4A15A] transition-all"></div>
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all peer-checked:translate-x-6"></div>
              </div>
              <div>
                <p className="text-xs font-black text-[#4A3319] uppercase tracking-wider">Set as Primary Profile ⭐</p>
                <p className="text-[10px] text-[#8B6E4A] font-medium">Synced with transit alerts & dashboard card</p>
              </div>
            </label>

            <button
              type="submit"
              className="w-full py-4 mt-6 rounded-xl bg-[#4A3319] text-[#FFF5E1] font-bold text-sm tracking-widest shadow-[0_4px_14px_rgba(74,51,25,0.4)] hover:bg-[#3D2B15] hover:shadow-[0_6px_20px_rgba(74,51,25,0.6)] hover:-translate-y-0.5 transition-all active:translate-y-0 uppercase"
            >
              Generate Chart
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BirthDetailsForm;
