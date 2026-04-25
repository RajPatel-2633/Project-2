const PersonalSignCard = () => {
  const luckScore = 85; // Mock score out of 100
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (luckScore / 100) * circumference;

  return (
    <div className="w-full rounded-[1.5rem] overflow-hidden flex flex-col relative h-full bg-parchment p-1 shadow-[0_8px_16px_rgba(0,0,0,0.15)] border border-[#CBAE75]">
      <div className="w-full h-full rounded-[1.25rem] border border-[#8B6E4A]/30 overflow-hidden relative flex flex-col bg-[#F4E8D3]">
      
      {/* Top Banner (Darker Beige) */}
        <div className="w-full bg-gradient-to-b from-[#E5CAA0] to-[#E0C090] px-[1.5em] pt-[1.5em] pb-[2em] relative z-0 border-b border-[#CBAE75] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-start">
            <div className="mt-2">
              <h2 className="font-serif text-[#4A3319] font-bold tracking-tight drop-shadow-sm text-[clamp(2rem,3vw,2.5rem)]">Taurus</h2>
              <p className="text-[clamp(0.8rem,1vw,1rem)] text-[#4A3319]/80 font-semibold tracking-wide mt-1">Sun Sign • The Bull</p>
            </div>
          </div>
        </div>
      
        {/* 3D Astrolabe Luck Ring (Overlapping) */}
        <div className="absolute right-6 top-[2.5rem] z-20">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full astrolabe-ring border-[4px] border-[#FFF8E7]">
            {/* Gear teeth/ticks around the edge */}
            <div className="absolute inset-0 rounded-full border-[6px] border-dashed border-[#8B6E4A]/40 m-1 pointer-events-none"></div>
            
            {/* Inner track */}
            <div className="w-[100px] h-[100px] rounded-full astrolabe-inner bg-[#F4E8D3] flex items-center justify-center relative">
              <svg className="w-[100px] h-[100px] transform -rotate-90 absolute top-0 left-0">
                <circle cx="50" cy="50" r="44" stroke="#DDC8A3" strokeWidth="6" fill="transparent" />
                <circle
                  cx="50" cy="50" r="44"
                  stroke="#FFFFFF"
                  strokeWidth="6" fill="transparent"
                  strokeDasharray={2 * Math.PI * 44}
                  strokeDashoffset={(2 * Math.PI * 44) - (luckScore / 100) * (2 * Math.PI * 44)}
                  className="transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(255,255,255,1)]"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
                <span className="text-3xl font-bold text-[#4A3319] leading-none drop-shadow-sm">{luckScore}%</span>
                <span className="text-[10px] uppercase font-bold text-[#4A3319]/70 tracking-widest mt-0.5">Luck</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Content Area */}
        <div className="px-[1.5em] pb-[1.5em] relative z-10 flex-grow flex flex-col pt-[2em] bg-parchment">
          <div className="space-y-[1em] flex-grow">
            <div>
              <h3 className="text-[clamp(0.7rem,1vw,0.85rem)] font-bold text-[#4A3319] uppercase tracking-wider mb-2 drop-shadow-sm">Cosmic Guidance</h3>
              <p className="text-[clamp(0.8rem,1vw,1rem)] text-[#4A3319]/90 font-medium leading-relaxed line-clamp-4">
                Venus aligns favorably today, enhancing your natural magnetism. It is a perfect day for financial planning and creative endeavors. Avoid...
              </p>
            </div>
          </div>

          <button className="w-full mt-[1.5em] py-[1em] rounded-xl bg-gradient-to-b from-[#6A4B29] to-[#4A3319] text-[#F4E8D3] font-bold hover:from-[#5C4020] hover:to-[#3A2814] transition-all shadow-[0_4px_15px_rgba(62,39,0,0.3)] border border-[#3A2814] active:scale-[0.98]">
            Ask AI Astrologer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersonalSignCard;
