import React, { useState, useEffect } from 'react';

const PersonForm = ({ title, subtitle, formData, onChange }) => {
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  // Debounced auto-fetch for lat/lng
  useEffect(() => {
    const fetchLocation = async () => {
      // Need both city and country to be somewhat filled before searching
      if (!formData.city || formData.city.length < 2 || !formData.country || formData.country.length < 2) {
        return; 
      }
      
      setIsFetchingLocation(true);
      setLocationError('');
      
      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(formData.city)}&count=10&format=json`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          // Try to find an exact match for the country
          let match = data.results.find(
            res => res.country && res.country.toLowerCase().includes(formData.country.toLowerCase())
          );
          
          // Fallback to first result if no exact country match but we have results
          if (!match) match = data.results[0];

          onChange('latitude', match.latitude);
          onChange('longitude', match.longitude);
          onChange('timezone', match.timezone || 'UTC');
        } else {
          setLocationError('Location not found in database');
          onChange('latitude', '');
          onChange('longitude', '');
          onChange('timezone', '');
        }
      } catch (error) {
        setLocationError('Error fetching coordinates');
      } finally {
        setIsFetchingLocation(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchLocation();
    }, 1000); // Wait 1 second after user stops typing to call API

    return () => clearTimeout(delayDebounceFn);
  }, [formData.city, formData.country]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Header */}
      <div className="flex flex-col items-center mb-6 relative z-20 w-full text-center">
        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-astra-brown tracking-wide mb-1">{title}</h2>
        <p className="text-md italic text-astra-brown/80">{subtitle}</p>
      </div>

      {/* Form Container with parchment style */}
      <div className="w-full max-w-md bg-parchment p-8 lg:p-10 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[#8B6E4A]/30 relative group transition-all">
        {/* Decorative Corner Ornaments */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#8B6E4A]/40 transition-all group-hover:border-[#C4A15A]"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#8B6E4A]/40 transition-all group-hover:border-[#C4A15A]"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#8B6E4A]/40 transition-all group-hover:border-[#C4A15A]"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#8B6E4A]/40 transition-all group-hover:border-[#C4A15A]"></div>

        <div className="space-y-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor={`name-${title}`} className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Full Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                id={`name-${title}`}
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                autoComplete="name"
                placeholder="Seeker of Stars"
                className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] placeholder-[#8B6E4A]/50 focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`gender-${title}`} className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Gender Essence <span className="text-red-500">*</span></label>
              <select
                id={`gender-${title}`}
                name="gender"
                value={formData.gender || 'PREFER NOT TO SAY'}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm cursor-pointer"
              >
                <option value="PREFER NOT TO SAY">Select Essence</option>
                <option value="MALE">Masculine</option>
                <option value="FEMALE">Feminine</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor={`dob-${title}`} className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Date of Birth <span className="text-red-500">*</span></label>
              <input
                type="date"
                id={`dob-${title}`}
                name="dob"
                value={formData.dob || ''}
                onChange={handleChange}
                required
                autoComplete="bday"
                className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor={`tob-${title}`} className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Time of Birth <span className="text-red-500">*</span></label>
              <input
                type="time"
                id={`tob-${title}`}
                name="tob"
                value={formData.tob || ''}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label htmlFor={`city-${title}`} className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">City of Birth <span className="text-red-500">*</span></label>
              <input
                type="text"
                id={`city-${title}`}
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                required
                autoComplete="address-level2"
                placeholder="Mumbai"
                className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] placeholder-[#8B6E4A]/50 focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={`country-${title}`} className="text-xs font-bold text-[#5c3a1d] tracking-wide uppercase">Country <span className="text-red-500">*</span></label>
              <input
                type="text"
                id={`country-${title}`}
                name="country"
                value={formData.country || ''}
                onChange={handleChange}
                required
                autoComplete="country-name"
                placeholder="India"
                className="w-full px-5 py-4 rounded-xl bg-white/60 border border-[#8B6E4A]/40 text-[#4A3319] placeholder-[#8B6E4A]/50 focus:outline-none focus:ring-2 focus:ring-[#C19E63] transition-all font-medium text-sm"
              />
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
        </div>
      </div>
    </div>
  );
};

export default PersonForm;
