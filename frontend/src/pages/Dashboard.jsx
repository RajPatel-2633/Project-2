import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Navbar from '../components/layout/Navbar';
import PanchangBar from '../components/dashboard/PanchangBar';
import TransitAlert from '../components/dashboard/TransitAlert';
import PersonalSignCard from '../components/dashboard/PersonalSignCard';
import HoroscopeCarousel from '../components/dashboard/HoroscopeCarousel';
import QuickMatch from '../components/dashboard/QuickMatch';
import { Sparkles, AlertTriangle, Loader2 } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useAstroStore from '../store/useAstroStore';
import ServiceCarousel from '../components/dashboard/ServiceCarousel';
import { useEffect } from 'react';
import useAstroDataStore from '../store/useAstroDataStore';

// Graceful fallback shown if any dashboard card crashes
const CardFallback = ({ error }) => (
  <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700">
    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
    <div>
      <p className="font-bold text-sm">This section could not load</p>
      <p className="text-xs mt-0.5 opacity-70">{error?.message || 'An unexpected error occurred.'}</p>
    </div>
  </div>
);

const LoadingFallback = () => (
  <div className="w-full bg-[#E5CAA0]/50 rounded-2xl p-6 flex items-center justify-center gap-2 text-[#8B6E4A]">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span className="text-sm font-medium">Loading...</span>
  </div>
);

const Dashboard = () => {
  const user = useAppStore(state => state.user);
  const { profiles, fetchProfiles } = useAstroStore();
  const { checkAndRefresh } = useAstroDataStore();
  const firstName = user?.name?.split(' ')[0] || 'Seeker';

  useEffect(() => {
    fetchProfiles();
    
    // Initial check and set interval for auto-refresh at midnight
    checkAndRefresh();
    const interval = setInterval(() => {
      checkAndRefresh();
    }, 1000 * 60 * 5); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [fetchProfiles, checkAndRefresh]);

  const isFirstTime = !profiles || profiles.length === 0;

  return (
    <div className="min-h-screen bg-[#EBD6A7] font-sans overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow w-full px-[4vw] py-8 space-y-8 relative z-10">
        {/* Welcome & Panchang */}
        <div className="space-y-6">
          <h1 className="font-serif text-[#4A3319] font-bold tracking-wider mb-2 text-[clamp(2rem,4vw,3rem)]">
            {isFirstTime ? 'Explore Your Cosmic Path' : <>Welcome back, <span className="text-[#8A5A2B]">{firstName}</span></>} ✨
          </h1>
          <ErrorBoundary FallbackComponent={CardFallback}>
            <Suspense fallback={<LoadingFallback />}>
              <PanchangBar />
            </Suspense>
          </ErrorBoundary>
        </div>

        {/* Conditional Layout based on Profile Data */}
        {isFirstTime ? (
          /* First Time User View */
          <div className="space-y-4">
            <ErrorBoundary FallbackComponent={CardFallback}>
              <Suspense fallback={<LoadingFallback />}>
                <ServiceCarousel />
              </Suspense>
            </ErrorBoundary>

            <div className="-mt-4">
              <ErrorBoundary FallbackComponent={CardFallback}>
                <Suspense fallback={<LoadingFallback />}>
                  <HoroscopeCarousel />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        ) : (
          /* Returning User View */
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 w-full items-start">
              {/* Left Content: Transits */}
              <div className="space-y-6 min-w-0">
                <ErrorBoundary FallbackComponent={CardFallback}>
                  <Suspense fallback={<LoadingFallback />}>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-serif font-bold text-[#4A3319] flex items-center gap-2">
                        <AlertTriangle className="w-8 h-8 text-astra-orange" />
                        Critical Planetary Transits
                      </h2>
                      <TransitAlert />
                    </div>
                  </Suspense>
                </ErrorBoundary>
              </div>

              {/* Right Side: Fixed Profile & Tools Area */}
              <div className="space-y-6 sticky top-24">
                <div className="bg-parchment/30 p-1 rounded-2xl border border-[#8B6E4A]/10 shadow-inner">
                  <ErrorBoundary FallbackComponent={CardFallback}>
                    <PersonalSignCard />
                  </ErrorBoundary>
                </div>
                
                <div className="bg-parchment p-6 rounded-2xl border border-[#8B6E4A]/30 shadow-lg relative">
                  <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#8B6E4A]/40"></div>
                  <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#8B6E4A]/40"></div>
                  <h3 className="text-lg font-serif font-bold text-[#4A3319] mb-4 text-center">Compatibility Engine</h3>
                  <ErrorBoundary FallbackComponent={CardFallback}>
                    <QuickMatch />
                  </ErrorBoundary>
                </div>
              </div>
            </div>

            {/* Full Width Horoscope Section */}
            <div className="-mt-12">
              <ErrorBoundary FallbackComponent={CardFallback}>
                <Suspense fallback={<LoadingFallback />}>
                  <HoroscopeCarousel />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
