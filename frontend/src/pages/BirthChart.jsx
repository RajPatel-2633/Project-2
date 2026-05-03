import React, { useRef, useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import BirthDetailsForm from '../components/BirthDetailsForm';
import ChartResults from '../components/chart/ChartResults';
import { ZodiacLoader, CelestialIllustration } from '../components/Graphics';
import useAstroStore from '../store/useAstroStore';
import { ErrorBoundary } from 'react-error-boundary';
import { Trash2, User, ChevronRight, Bookmark } from 'lucide-react';

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-100 text-red-900 rounded-xl max-w-2xl mx-auto mt-10 shadow-lg border border-red-300">
      <h2 className="text-xl font-bold mb-2">Something went wrong in the Chart View:</h2>
      <pre className="text-sm bg-red-50 p-3 rounded overflow-auto">{error.message}</pre>
      <pre className="text-xs mt-2 text-red-700 overflow-auto">{error.stack}</pre>
      <button onClick={resetErrorBoundary} className="mt-4 px-4 py-2 bg-red-600 text-white rounded shadow">Try again</button>
    </div>
  );
}

const BirthChart = () => {
  const resultsRef = useRef(null);
  const [showResults, setShowResults] = useState(false);
  const { generateChart, fetchProfiles, fetchChartByProfileId, profiles, isLoading, chartData, error } = useAstroStore();

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleFormSubmit = async (formData) => {
    setShowResults(false); // Hide if previously open

    // Call the backend API
    const success = await generateChart(formData);

    if (success) {
      setShowResults(true);

      // Use a slight timeout to ensure the DOM has updated and element is visible
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const selectProfile = async (profileId) => {
    if (!profileId) return;
    setShowResults(false);
    const success = await fetchChartByProfileId(profileId);
    if (success) {
      setShowResults(true);
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const { deleteProfile, activeProfileId } = useAstroStore();

  const handleDeleteProfile = async (e, profileId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this profile?')) {
      await deleteProfile(profileId);
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
              <h3 className="font-serif text-4xl text-[#FFF5E1] font-bold tracking-[0.2em] animate-pulse drop-shadow-2xl">Consulting the Cosmos</h3>
              <p className="text-[#C4A15A] font-bold text-xs uppercase tracking-[0.5em] opacity-80">Aligning planetary spheres...</p>
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
        {/* Balanced Split Layout: Form + Profiles */}
        <div className="w-full px-[8vw] py-16 flex flex-col lg:flex-row gap-16 justify-center items-start">
          {/* Main Form Area: Centered in its section */}
          <div className="flex-grow lg:w-[65%] flex flex-col items-center">
            <div className="w-full max-w-2xl">
              <BirthDetailsForm
                onSubmit={handleFormSubmit}
              />
            </div>
          </div>

          {/* Sidebar Area: Saved Profiles */}
          <aside className="lg:w-[35%] flex flex-col gap-6">
            <div className="bg-parchment p-6 rounded-2xl border border-[#8B6E4A]/30 shadow-lg sticky top-28">
              <div className="flex items-center gap-2 mb-6 border-b border-[#8B6E4A]/10 pb-4">
                <Bookmark className="w-5 h-5 text-[#8B6E4A]" />
                <h3 className="font-serif font-bold text-[#4A3319] text-xl">Saved Profiles</h3>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {profiles && profiles.length > 0 ? (
                  profiles.map((p) => (
                    <div 
                      key={p._id}
                      onClick={() => selectProfile(p._id)}
                      className={`group p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        activeProfileId === p._id 
                        ? 'bg-[#C4A15A]/20 border-[#C4A15A] shadow-sm' 
                        : 'bg-white/40 border-[#8B6E4A]/10 hover:border-[#C4A15A]/40 hover:bg-white/60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${activeProfileId === p._id ? 'bg-[#C4A15A] text-white' : 'bg-[#EBD6A7] text-[#8B6E4A]'}`}>
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-[#4A3319] truncate">{p.label}</p>
                          <p className="text-[10px] text-[#8B6E4A] font-medium truncate uppercase tracking-tighter">{p.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => handleDeleteProfile(e, p._id)}
                          className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                          title="Delete Profile"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <ChevronRight className={`w-4 h-4 transition-transform ${activeProfileId === p._id ? 'text-[#C4A15A]' : 'text-[#8B6E4A]/30 group-hover:translate-x-0.5'}`} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 px-6 bg-white/20 rounded-2xl border border-dashed border-[#8B6E4A]/30 flex flex-col items-center gap-6">
                    <CelestialIllustration className="w-32 h-32 text-[#8B6E4A] opacity-40 animate-pulse-slow" />
                    <p className="text-sm text-[#8B6E4A] italic leading-relaxed">
                      No profiles saved yet.<br/>
                      <span className="text-[10px] uppercase font-bold tracking-widest mt-2 block opacity-60">Generate your first chart to save details.</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-6 border-t border-[#8B6E4A]/10">
                 <p className="text-[10px] text-[#8B6E4A] font-medium leading-relaxed italic">
                   Tip: Click a profile to quickly reload its birth data and planetary chart.
                 </p>
              </div>
            </div>
          </aside>
        </div>

        {/* Bottom Results Section */}
        <div
          ref={resultsRef}
          className={`w-full transition-all duration-1000 ${showResults ? 'opacity-100 py-20' : 'opacity-0 h-0 overflow-hidden'}`}
        >
          {showResults && (
            <ErrorBoundary FallbackComponent={Fallback}>
              <ChartResults chartData={chartData} />
            </ErrorBoundary>
          )}
        </div>
      </main>

    </div>
  );
};

export default BirthChart;
