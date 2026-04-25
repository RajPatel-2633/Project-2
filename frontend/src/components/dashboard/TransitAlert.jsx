import { AlertTriangle, ArrowRight } from 'lucide-react';

const TransitAlert = () => {
  return (
    <div className="w-full bg-[#E5CAA0] border border-[#CFA876] shadow-md rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden animate-subtle-pulse">
      {/* Spirograph/Swirl pattern overlay simulated via radial rings */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'repeating-radial-gradient(circle at center, transparent 0, transparent 15px, #fff 15px, #fff 16px)',
        backgroundSize: '100px 100px'
      }}></div>
      
      <div className="flex items-center gap-4 relative z-10">
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFA057]/40 to-[#FFD596]/40 flex items-center justify-center flex-shrink-0 text-[#C15822] shadow-[inset_0_0_10px_rgba(255,255,255,0.8),0_0_15px_rgba(255,160,87,0.5)] border border-white/50">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-[#4A3319] flex items-center gap-2 text-[clamp(0.8rem,1vw,0.9rem)]">
            Major Transit Alert
            <span className="px-2 py-0.5 rounded-full bg-[#B55B2E]/10 text-[#B55B2E] text-[10px] uppercase tracking-wider">High Impact</span>
          </h3>
          <p className="text-astra-brown/80 line-clamp-1 text-[clamp(0.7rem,0.9vw,0.85rem)]">Saturn has entered Pisces. This transit may bring structural changes to your career sector.</p>
        </div>
      </div>
      <button className="font-bold text-[#C15822] hover:text-[#9A4216] transition-colors flex items-center gap-1 whitespace-nowrap flex-shrink-0 pr-2 relative z-10 text-[clamp(0.8rem,1vw,0.9rem)]">
        Read Impact <span className="tracking-tighter">»</span>
      </button>
    </div>
  );
};

export default TransitAlert;
