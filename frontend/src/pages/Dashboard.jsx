import Navbar from '../components/layout/Navbar';
import PanchangBar from '../components/dashboard/PanchangBar';
import TransitAlert from '../components/dashboard/TransitAlert';
import PersonalSignCard from '../components/dashboard/PersonalSignCard';
import HoroscopeCarousel from '../components/dashboard/HoroscopeCarousel';
import { Sparkles } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#EBD6A7] font-sans overflow-x-hidden flex flex-col relative z-0">
      {/* Soft central glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-white/30 to-transparent pointer-events-none -z-10"></div>
      
      <Navbar />
      
      <main className="flex-grow w-full px-[4vw] py-8 space-y-8 relative z-10">
        {/* Welcome & Panchang */}
        <div className="space-y-6">
          <h1 className="font-serif text-[#4A3319] font-bold tracking-wider mb-2 text-[clamp(2rem,4vw,3rem)]">Welcome back, Seeker</h1>
          <PanchangBar />
        </div>

        {/* Alerts & Personal Area */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,25vw)] gap-[3vw]">
          <div className="flex flex-col gap-6 w-full min-w-0">
            <TransitAlert />
            <HoroscopeCarousel />
          </div>
          <div className="h-full w-full">
            <PersonalSignCard />
          </div>
        </div>
      </main>

      {/* Decorative Star Bottom Right */}
      <div className="fixed bottom-12 right-12 text-[#FFF5E1] opacity-70 pointer-events-none -z-10">
        <Sparkles className="w-24 h-24" strokeWidth={1} />
      </div>
    </div>
  );
};

export default Dashboard;
