import React, { useRef, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import PersonForm from '../components/compatibility/PersonForm';
import KundliResults from '../components/compatibility/KundliResults';
import { ZodiacLoader } from '../components/Graphics';
import useCompatibilityStore from '../store/useCompatibilityStore';

const Compatibility = () => {
  const resultsRef = useRef(null);
  const [showResults, setShowResults] = useState(false);
  const { calculateMatch, matchData, isLoading, error } = useCompatibilityStore();
  
  const [person1Data, setPerson1Data] = useState({
    name: '', gender: 'PREFER NOT TO SAY', dob: '', tob: '', city: '', country: '', latitude: '', longitude: ''
  });
  
  const [person2Data, setPerson2Data] = useState({
    name: '', gender: 'PREFER NOT TO SAY', dob: '', tob: '', city: '', country: '', latitude: '', longitude: ''
  });

  const handlePerson1Change = (name, value) => {
    setPerson1Data(prev => ({ ...prev, [name]: value }));
  };

  const handlePerson2Change = (name, value) => {
    setPerson2Data(prev => ({ ...prev, [name]: value }));
  };

  const handleMatchSubmit = async () => {
    setShowResults(false);
    
    // Ensure payload matches backend BirthProfile schema exactly
    const p1Payload = { 
      ...person1Data, 
      birth_city: person1Data.city,
      birth_country: person1Data.country,
      timezone: person1Data.timezone || 'UTC',
      gender: person1Data.gender || 'PREFER NOT TO SAY',
      label: 'Compatibility Partner 1'
    };
    
    const p2Payload = { 
      ...person2Data, 
      birth_city: person2Data.city,
      birth_country: person2Data.country,
      timezone: person2Data.timezone || 'UTC',
      gender: person2Data.gender || 'PREFER NOT TO SAY',
      label: 'Compatibility Partner 2'
    };

    const success = await calculateMatch(p1Payload, p2Payload);

    if (success) {
      setShowResults(true);
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBD6A7] font-sans overflow-x-hidden flex flex-col relative z-0">
      {/* Soft top gradient */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none -z-10"></div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md transition-all duration-500">
          <div className="flex flex-col items-center gap-10">
            <div className="scale-125">
              <ZodiacLoader />
            </div>
            <div className="space-y-4 text-center">
              <h3 className="font-serif text-4xl text-[#FFF5E1] font-bold tracking-[0.2em] animate-pulse drop-shadow-2xl">Aligning the Stars</h3>
              <p className="text-[#C4A15A] font-bold text-xs uppercase tracking-[0.5em] opacity-80">Calculating soul harmony...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-red-100 border border-red-200 text-red-700 px-8 py-4 rounded-2xl shadow-2xl">
          <p className="font-bold text-sm tracking-tight">{error}</p>
        </div>
      )}
      
      <Navbar />
      
      <main className="flex-grow flex flex-col w-full relative z-10">
        {/* Top 50/50 Split Section */}
        <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center w-full px-8 py-20">
          
          {/* Page Title */}
          <div className="text-center mb-12 space-y-2">
             <h1 className="text-4xl lg:text-5xl font-serif text-[#4A3319] font-bold tracking-tight">Kundli Milan</h1>
             <p className="text-lg italic text-[#8B6E4A]">Discover the cosmic harmony between two souls</p>
          </div>

          {/* Forms Grid */}
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 relative">
            
            {/* Animated Divider & Heart for Desktop */}
            <div className="hidden lg:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 flex-col items-center justify-center pointer-events-none">
              <div className="w-[1px] h-full bg-gradient-to-b from-transparent via-[#8B6E4A]/40 to-transparent relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="relative group">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-red-500 blur-2xl opacity-30 group-hover:opacity-50 transition-opacity animate-pulse"></div>
                    
                    <div className="relative bg-[#F5E6C4] p-4 rounded-full border border-red-200 shadow-xl transform group-hover:scale-110 transition-transform duration-700">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-500 drop-shadow-sm">
                        <path 
                          d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" 
                          fill="currentColor" 
                          fillOpacity="0.15"
                          stroke="currentColor" 
                          strokeWidth="1.5"
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <path 
                          d="M12 18L11.5 17.5C8.5 14.5 6 12 6 9.5C6 7.5 7.5 6 9.5 6C10.7 6 11.5 6.5 12 7.2C12.5 6.5 13.3 6 14.5 6C16.5 6 18 7.5 18 9.5C18 12 15.5 14.5 12.5 17.5L12 18Z" 
                          fill="currentColor"
                        >
                          <animate 
                            attributeName="opacity" 
                            values="0.5;1;0.5" 
                            dur="2s" 
                            repeatCount="indefinite" 
                          />
                        </path>
                      </svg>
                      
                      {/* Floating Sparkles around heart */}
                      <div className="absolute -top-2 -right-2 text-[#C4A15A] animate-bounce [animation-duration:3s]">✨</div>
                      <div className="absolute -bottom-1 -left-1 text-[#C4A15A] animate-bounce [animation-duration:4s]">✨</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <PersonForm title="Partner One" subtitle="Celestial details for first soul" formData={person1Data} onChange={handlePerson1Change} />
            <PersonForm title="Partner Two" subtitle="Celestial details for second soul" formData={person2Data} onChange={handlePerson2Change} />
          </div>

          {/* Submit Button */}
          <div className="mt-16 w-full flex justify-center">
            <button
              onClick={handleMatchSubmit}
              className="px-12 py-4 rounded-xl bg-[#4A3319] text-[#FFF5E1] font-bold text-sm tracking-widest shadow-[0_4px_14px_rgba(74,51,25,0.4)] hover:bg-[#3D2B15] hover:shadow-[0_6px_20px_rgba(74,51,25,0.6)] hover:-translate-y-0.5 transition-all active:translate-y-0 uppercase"
            >
              Consult the Harmony
            </button>
          </div>
        </div>

        {/* Bottom Results Section */}
        <div 
          ref={resultsRef} 
          className={`w-full transition-all duration-1000 ${showResults ? 'opacity-100 py-24' : 'opacity-0 h-0 overflow-hidden'}`}
        >
          {showResults && matchData && <KundliResults matchData={matchData} />}
        </div>
      </main>

    </div>
  );
};

export default Compatibility;
