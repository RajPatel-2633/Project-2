import { useEffect, useRef, useState } from 'react';
import { Heart, Briefcase, Activity, Loader2, Star, X, BookOpen, Sparkles, RefreshCw } from 'lucide-react';
import useAstroDataStore from '../../store/useAstroDataStore';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axios';

const signs = [
  { name: 'Aries', icon: '♈' }, { name: 'Taurus', icon: '♉' }, { name: 'Gemini', icon: '♊' },
  { name: 'Cancer', icon: '♋' }, { name: 'Leo', icon: '♌' }, { name: 'Virgo', icon: '♍' },
  { name: 'Libra', icon: '♎' }, { name: 'Scorpio', icon: '♏' }, { name: 'Sagittarius', icon: '♐' },
  { name: 'Capricorn', icon: '♑' }, { name: 'Aquarius', icon: '♒' }, { name: 'Pisces', icon: '♓' },
];

const ScoreBar = ({ value, stripColor }) => (
  <div className="flex-grow h-[6px] bg-gradient-to-b from-[#8B6E4A] to-[#A88B63] rounded-full shadow-[inset_0_2px_3px_rgba(0,0,0,0.6)] relative overflow-hidden border border-[#5C3A1D]">
    <div className="absolute top-0 left-0 h-full transition-all duration-700" style={{
      width: `${value ?? 50}%`,
      backgroundImage: `repeating-linear-gradient(to right, ${stripColor} 0px, ${stripColor} 4px, transparent 4px, transparent 6px)`,
      backgroundSize: '6px 100%',
    }} />
  </div>
);

// Full-detail modal for a single sign
const HoroscopeModal = ({ signData, onClose }) => {
  const { selectedHoroscope, isLoadingSelected, fetchHoroscopeBySign } = useAstroDataStore();

  useEffect(() => {
    fetchHoroscopeBySign(signData.name);
  }, [signData.name]);

  const h = selectedHoroscope;
  const scores = h?.scores ?? {};

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-[#FBF3E2] rounded-3xl shadow-2xl border border-[#C4A15A]/40 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C4A15A] to-[#8C642A] p-6 text-[#FFF5E1] rounded-t-3xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{signData.icon}</span>
            <div>
              <h2 className="font-serif text-2xl font-bold">{signData.name}</h2>
              <p className="text-sm text-white/70">Today's Full Reading</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {isLoadingSelected ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#8B6E4A]">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-medium">Consulting the stars...</span>
          </div>
        ) : h ? (
          <div className="p-6 space-y-6">
            {/* Scores */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Luck', value: scores.luck, color: '#F59E0B' },
                { label: 'Love', value: scores.love, color: '#EC4899' },
                { label: 'Career', value: scores.career, color: '#3B82F6' },
                { label: 'Health', value: scores.health, color: '#10B981' },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-white/60 rounded-xl p-3 border border-[#C4A15A]/20">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#5c3a1d] uppercase tracking-wide">{label}</span>
                    <span className="text-sm font-black text-[#4A3319]">{value ?? '—'}%</span>
                  </div>
                  <ScoreBar value={value} stripColor={color} />
                </div>
              ))}
            </div>

            {/* Predictions */}
            {h.prediction && (
              <div className="space-y-4">
                {[
                  { key: 'general', label: '✨ General', icon: Sparkles },
                  { key: 'love', label: '❤️ Love', icon: Heart },
                  { key: 'career', label: '💼 Career', icon: Briefcase },
                  { key: 'health', label: '⚡ Health', icon: Activity },
                ].map(({ key, label }) => h.prediction[key] && (
                  <div key={key} className="bg-white/60 rounded-xl p-4 border border-[#C4A15A]/20">
                    <p className="text-xs font-bold text-[#8B6E4A] uppercase tracking-wider mb-2">{label}</p>
                    <p className="text-sm text-[#4A3319] leading-relaxed">{h.prediction[key]}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Lucky details */}
            {(h.lucky_color || h.lucky_number) && (
              <div className="flex gap-4 pt-2 border-t border-[#C4A15A]/20">
                {h.lucky_color && (
                  <div className="flex-1 bg-white/60 rounded-xl p-3 border border-[#C4A15A]/20 text-center">
                    <p className="text-[10px] font-bold text-[#8B6E4A] uppercase tracking-wide mb-1">Lucky Color</p>
                    <p className="font-bold text-[#4A3319]">{h.lucky_color}</p>
                  </div>
                )}
                {h.lucky_number && (
                  <div className="flex-1 bg-white/60 rounded-xl p-3 border border-[#C4A15A]/20 text-center">
                    <p className="text-[10px] font-bold text-[#8B6E4A] uppercase tracking-wide mb-1">Lucky Number</p>
                    <p className="font-bold text-[#4A3319] text-2xl">{h.lucky_number}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-[#8B6E4A]">
            <BookOpen className="w-8 h-8 opacity-40" />
            <div className="text-center">
              <p className="font-medium text-sm">No reading available yet.</p>
              <p className="text-xs opacity-70">Sync with the AI to generate today's cosmic insights.</p>
            </div>
            <button
              onClick={async () => {
                const toastId = toast.loading("Syncing with the cosmos...");
                try {
                  await axiosInstance.get('/astro/seed-db?ai=true&force=true');
                  toast.success("Stars aligned! Refreshing...", { id: toastId });
                  setTimeout(() => window.location.reload(), 1000);
                } catch (e) {
                  toast.error("Cosmic interference. Try again later.", { id: toastId });
                }
              }}
              className="px-6 py-2 bg-gradient-to-r from-[#C4A15A] to-[#8C642A] text-[#FFF5E1] rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all"
            >
              Sync with AI
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const HoroscopeCard = ({ signData, horoscope, onClick }) => {
  const scores = horoscope?.scores ?? {};
  return (
    <div
      className="snap-start shrink-0 w-[280px] lg:w-[320px] bg-parchment p-[1.5em] flex flex-col gap-[1.2em] relative rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
      onClick={onClick}
    >
      <div className="absolute top-[1em] left-[1em] w-[4em] h-[2em] engraved-oval flex items-center justify-center -z-0" />
      <div className="flex items-center justify-between relative z-10">
        <div>
          <span className="text-2xl">{signData.icon}</span>
          <h3 className="font-serif text-[#4A3319] font-bold text-[clamp(1.2rem,1.5vw,1.8rem)] inline ml-2">{signData.name}</h3>
        </div>
        {horoscope?.scores?.luck != null ? (
          <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
            <Star className="w-3 h-3" /> {horoscope.scores.luck}%
          </span>
        ) : (
          <span className="text-xs text-[#8B6E4A]/50 italic">Not seeded</span>
        )}
      </div>

      {horoscope?.prediction?.general ? (
        <p className="text-xs text-[#5c3a1d] leading-relaxed line-clamp-3 italic border-l-2 border-[#C4A15A]/40 pl-3">
          {horoscope.prediction.general}
        </p>
      ) : (
        <p className="text-xs text-[#8B6E4A]/50 italic pl-3">Daily reading not available. Seed the DB to generate.</p>
      )}

      <div className="space-y-[1em]">
        {[
          { label: 'Love', icon: <Heart className="w-3 h-3 text-[#B04C5A]" />, value: scores.love, color: '#EC4899' },
          { label: 'Career', icon: <Briefcase className="w-3 h-3 text-[#4A5D91]" />, value: scores.career, color: '#3B82F6' },
          { label: 'Health', icon: <Activity className="w-3 h-3 text-[#4F8165]" />, value: scores.health, color: '#10B981' },
        ].map(({ label, icon, value, color }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="flex items-center gap-1 w-16 text-xs font-bold text-[#5c3a1d]">{icon} {label}</span>
            <ScoreBar value={value} stripColor={color} />
            <span className="text-xs font-black text-[#5c3a1d] w-8 text-right">{value ?? '—'}%</span>
          </div>
        ))}
      </div>

      {(horoscope?.lucky_color || horoscope?.lucky_number) && (
        <div className="flex gap-3 pt-1 border-t border-[#8B6E4A]/20 text-[10px] font-bold text-[#8B6E4A] uppercase tracking-wide">
          {horoscope.lucky_color && <span>Color: <span className="text-[#4A3319]">{horoscope.lucky_color}</span></span>}
          {horoscope.lucky_number && <span>Number: <span className="text-[#4A3319]">{horoscope.lucky_number}</span></span>}
        </div>
      )}

      <div className="absolute bottom-3 right-4 text-xs text-[#C4A15A] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        Full Reading →
      </div>
    </div>
  );
};

const HoroscopeCarousel = () => {
  const scrollContainerRef = useRef(null);
  const { horoscopes, isLoadingHoroscopes, fetchAllHoroscopes, clearSelectedHoroscope } = useAstroDataStore();
  const [selectedSign, setSelectedSign] = useState(null);

  useEffect(() => {
    fetchAllHoroscopes();
  }, []);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const card = container.querySelector('.snap-start');
      const scrollAmount = card ? card.offsetWidth + 16 : 300;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const horoscopeMap = {};
  if (Array.isArray(horoscopes)) {
    horoscopes.forEach(h => { if (h.sign) horoscopeMap[h.sign.toLowerCase()] = h; });
  }

  const handleSignClick = (signData) => {
    setSelectedSign(signData);
  };

  const handleCloseModal = () => {
    setSelectedSign(null);
    clearSelectedHoroscope();
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {selectedSign && (
        <HoroscopeModal signData={selectedSign} onClose={handleCloseModal} />
      )}

      <div className="flex items-center justify-between mt-12 mb-8 px-2">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#8B6E4A]" />
          <h2 className="font-serif text-astra-brown font-bold text-3xl md:text-4xl tracking-wide">Today's Horoscopes</h2>
          <button
            onClick={async () => {
              const toastId = toast.loading("Syncing with AI...");
              try {
                await axiosInstance.get('/astro/seed-db?ai=true&force=true');
                toast.success("Stars aligned! Refreshing...", { id: toastId });
                setTimeout(() => window.location.reload(), 1000);
              } catch (e) {
                toast.error("Failed to sync.", { id: toastId });
              }
            }}
            className="p-1.5 rounded-full bg-[#C4A15A]/10 text-[#8B6E4A] hover:bg-[#C4A15A]/20 transition-all group"
            title="Refresh with AI"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
        {isLoadingHoroscopes && <Loader2 className="w-5 h-5 animate-spin text-[#8B6E4A]" />}
      </div>

      <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 pb-4 snap-x px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.overflow-x-auto::-webkit-scrollbar { display: none; }`}</style>
        {signs.map((signData) => (
          <HoroscopeCard
            key={signData.name}
            signData={signData}
            horoscope={horoscopeMap[signData.name.toLowerCase()]}
            onClick={() => handleSignClick(signData)}
          />
        ))}
      </div>

      <div className="w-full mt-4 h-6 bg-gradient-to-b from-[#CBAE75] to-[#EBD59E] rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] border border-[#8B6E4A] flex items-center justify-between px-2 text-[#6D4C31] font-bold text-xs select-none">
        <span className="cursor-pointer hover:text-black px-2" onClick={() => scroll('left')}>◀</span>
        <div className="flex justify-around w-full px-4 tracking-widest text-black/40 gap-3">
          {signs.map((s, i) => <span key={i} className="mx-1 cursor-pointer hover:text-black/70 transition-colors" onClick={() => handleSignClick(s)}>{s.icon}</span>)}
        </div>
        <span className="cursor-pointer hover:text-black px-2" onClick={() => scroll('right')}>▶</span>
      </div>
    </div>
  );
};

export default HoroscopeCarousel;
