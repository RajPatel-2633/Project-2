import { Heart, Briefcase, Activity } from 'lucide-react';

const signs = [
  { name: "Aries", icon: "♈" }, { name: "Taurus", icon: "♉" }, { name: "Gemini", icon: "♊" },
  { name: "Cancer", icon: "♋" }, { name: "Leo", icon: "♌" }, { name: "Virgo", icon: "♍" },
  { name: "Libra", icon: "♎" }, { name: "Scorpio", icon: "♏" }, { name: "Sagittarius", icon: "♐" },
  { name: "Capricorn", icon: "♑" }, { name: "Aquarius", icon: "♒" }, { name: "Pisces", icon: "♓" }
];

const mockScores = () => ({
  love: Math.floor(Math.random() * 60) + 40,
  career: Math.floor(Math.random() * 60) + 40,
  health: Math.floor(Math.random() * 60) + 40,
});

const HoroscopeCarousel = () => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[1em] px-[0.5em]">
        <h2 className="font-serif text-astra-brown font-semibold text-[clamp(1.5rem,2vw,2rem)]">Today's Horoscopes</h2>
        <button className="text-[clamp(0.8rem,1vw,1rem)] font-medium text-astra-orange hover:text-astra-brown transition-colors pr-[20px]">View All</button>
      </div>
      
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
        {signs.map((signData) => {
          const sign = signData.name;
          const scores = mockScores();
          return (
            <div key={sign} className="snap-start shrink-0 w-[22vw] min-w-[280px] bg-parchment p-[1.5em] flex flex-col gap-[1.2em] relative">
              <div className="absolute top-[1em] left-[1em] w-[4em] h-[2em] engraved-oval flex items-center justify-center -z-0"></div>
              <h3 className="font-serif text-[#4A3319] font-bold relative z-10 text-[clamp(1.2rem,1.5vw,1.8rem)]">{sign}</h3>
              
              <div className="space-y-[1em]">
                {/* Love Score */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 w-16 text-xs font-bold text-[#5c3a1d]"><Heart className="w-3 h-3 text-[#B04C5A]" /> Love</span>
                  <div className="flex-grow h-[6px] bg-gradient-to-b from-[#8B6E4A] to-[#A88B63] rounded-full shadow-[inset_0_2px_3px_rgba(0,0,0,0.6)] relative overflow-hidden border border-[#5C3A1D]">
                    <div className="absolute top-0 left-0 h-full" style={{ 
                      width: `${scores.love}%`,
                      backgroundImage: 'repeating-linear-gradient(to right, #EC4899 0px, #EC4899 4px, transparent 4px, transparent 6px)',
                      backgroundSize: '6px 100%'
                    }}></div>
                  </div>
                  <span className="text-xs font-black text-[#5c3a1d] w-8 text-right">{scores.love}%</span>
                </div>

                {/* Career Score */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 w-16 text-xs font-bold text-[#5c3a1d]"><Briefcase className="w-3 h-3 text-[#4A5D91]" /> Career</span>
                  <div className="flex-grow h-[6px] bg-gradient-to-b from-[#8B6E4A] to-[#A88B63] rounded-full shadow-[inset_0_2px_3px_rgba(0,0,0,0.6)] relative overflow-hidden border border-[#5C3A1D]">
                    <div className="absolute top-0 left-0 h-full" style={{ 
                      width: `${scores.career}%`,
                      backgroundImage: 'repeating-linear-gradient(to right, #3B82F6 0px, #3B82F6 4px, transparent 4px, transparent 6px)',
                      backgroundSize: '6px 100%'
                    }}></div>
                  </div>
                  <span className="text-xs font-black text-[#5c3a1d] w-8 text-right">{scores.career}%</span>
                </div>

                {/* Health Score */}
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 w-16 text-xs font-bold text-[#5c3a1d]"><Activity className="w-3 h-3 text-[#4F8165]" /> Health</span>
                  <div className="flex-grow h-[6px] bg-gradient-to-b from-[#8B6E4A] to-[#A88B63] rounded-full shadow-[inset_0_2px_3px_rgba(0,0,0,0.6)] relative overflow-hidden border border-[#5C3A1D]">
                    <div className="absolute top-0 left-0 h-full" style={{ 
                      width: `${scores.health}%`,
                      backgroundImage: 'repeating-linear-gradient(to right, #10B981 0px, #10B981 4px, transparent 4px, transparent 6px)',
                      backgroundSize: '6px 100%'
                    }}></div>
                  </div>
                  <span className="text-xs font-black text-[#5c3a1d] w-8 text-right">{scores.health}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Zodiac Scrollbar Track */}
      <div className="w-full mt-4 h-6 bg-gradient-to-b from-[#CBAE75] to-[#EBD59E] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-[#8B6E4A] flex items-center justify-between px-2 text-[#6D4C31] font-bold text-xs select-none">
        <span className="cursor-pointer hover:text-black">◀</span>
        <div className="flex justify-around w-full px-4 tracking-widest text-black/40 gap-3">
          {signs.map((s, i) => <span key={i} className="mx-1">{s.icon}</span>)}
        </div>
        <span className="cursor-pointer hover:text-black">▶</span>
      </div>
    </div>
  );
};

export default HoroscopeCarousel;
