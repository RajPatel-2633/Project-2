import { Moon, Sun, Clock, Sparkles, AlertCircle } from 'lucide-react';

const PanchangBar = () => {
  const panchangData = [
    { label: "Tithi", value: "Shukla Paksha Ekadashi", icon: <Moon className="w-4 h-4" /> },
    { label: "Nakshatra", value: "Rohini (Until 14:32)", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Yoga", value: "Siddhi", icon: <Sun className="w-4 h-4" /> },
    { label: "Karana", value: "Vanija", icon: <Sparkles className="w-4 h-4" /> },
    { label: "Moon Phase", value: "Waxing Gibbous", icon: <Moon className="w-4 h-4" /> },
    { label: "Rahu Kaal", value: "10:30 AM - 12:00 PM", icon: <Clock className="w-4 h-4 text-red-500" /> },
  ];

  return (
    <div className="w-full bg-metallic rounded-[16px] overflow-x-auto no-scrollbar shadow-lg">
      <div className="flex items-stretch min-w-max h-full relative">
        {panchangData.map((item, index) => (
          <div key={index} className="relative flex items-center gap-[1em] px-[2em] py-[1.2em] min-w-[200px]">
            {/* Metallic icon wrapper instead of white circle */}
            <div className="w-[2.5em] h-[2.5em] shrink-0 rounded-full flex items-center justify-center drop-shadow-md text-[#5C3A1D]">
              {item.icon}
            </div>
            <div className="flex flex-col z-10 relative">
              <span className="font-bold text-[#6D4C31] uppercase tracking-widest text-[clamp(0.6rem,1vw,0.7rem)]">{item.label}</span>
              <span className="font-semibold text-[#4A3319] truncate max-w-[150px] text-[clamp(0.8rem,1vw,0.9rem)]" title={item.value}>
                {item.value}
              </span>
            </div>

            {/* 3D Chevron Separator (simulated with rotated square) */}
            {index !== panchangData.length - 1 && (
              <div className="absolute right-[-15px] top-[15%] h-[70%] w-[30px] border-r-[3px] border-b-[3px] border-white/50 transform scale-y-[1.3] -rotate-45 shadow-[2px_2px_4px_rgba(0,0,0,0.2)] z-10 pointer-events-none drop-shadow-sm opacity-40"></div>
            )}
            
            {/* Dark inner shadow line for the chevron cut */}
            {index !== panchangData.length - 1 && (
              <div className="absolute right-[-17px] top-[15%] h-[70%] w-[30px] border-r-[2px] border-b-[2px] border-black/10 transform scale-y-[1.3] -rotate-45 z-0 pointer-events-none opacity-40"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanchangBar;
