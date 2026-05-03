import React, { useEffect, useState, useRef } from 'react';
import { Send, User, Sparkles, Star, Map, Compass, TrendingUp, TrendingDown, Briefcase, Heart, Coins } from 'lucide-react';
import { AnimatedKundliChart } from '../Graphics';
import useChatStore from '../../store/useChatStore';
import useAppStore from '../../store/useAppStore';
import useAstroStore from '../../store/useAstroStore';

const rulingPlanets = {
  1: { name: "Sun", color: "from-amber-400 to-orange-500", quality: "Authority", element: "Fire", desc: "Leadership & Vitality" },
  2: { name: "Moon", color: "from-indigo-400 to-blue-500", quality: "Intuition", element: "Water", desc: "Mind & Emotions" },
  3: { name: "Jupiter", color: "from-yellow-400 to-amber-600", quality: "Wisdom", element: "Ether", desc: "Growth & Knowledge" },
  4: { name: "Rahu", color: "from-purple-500 to-indigo-800", quality: "Innovation", element: "Air", desc: "Ambition & Mystery" },
  5: { name: "Mercury", color: "from-emerald-400 to-teal-600", quality: "Logic", element: "Earth", desc: "Speech & Intellect" },
  6: { name: "Venus", color: "from-pink-400 to-rose-500", quality: "Harmony", element: "Water", desc: "Love & Art" },
  7: { name: "Ketu", color: "from-slate-400 to-gray-700", quality: "Spiritual", element: "Fire", desc: "Insight & Moksha" },
  8: { name: "Saturn", color: "from-blue-800 to-slate-900", quality: "Karma", element: "Air", desc: "Discipline & Time" },
  9: { name: "Mars", color: "from-red-500 to-rose-700", quality: "Vitality", element: "Fire", desc: "Courage & Energy" },
};

const calculateNumerology = (dobString) => {
  if (!dobString) return { mulank: null, bhagyank: null };
  const date = new Date(dobString);
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1;
  const year = date.getUTCFullYear();

  const reduce = (num) => {
    let sum = num;
    while (sum > 9) {
      sum = String(sum).split('').reduce((acc, d) => acc + parseInt(d), 0);
    }
    return sum;
  };

  const mulank = reduce(day);
  const dateStr = `${day}${month}${year}`;
  const totalSum = dateStr.split('').reduce((acc, d) => acc + parseInt(d), 0);
  const bhagyank = reduce(totalSum);

  return { mulank, bhagyank };
};

const DeityIcon = ({ mulank }) => {
  const icons = {
    1: <path d="M12 2v2m0 16v2m8-10h2m-20 0h2m15.5-7.5l-1.5 1.5m-10.5 10.5l-1.5 1.5m13.5 0l-1.5-1.5m-10.5-10.5l-1.5-1.5M12 7a5 5 0 100 10 5 5 0 000-10z" />, // Sun / Shiva
    2: <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />, // Moon / Gauri
    3: <path d="M12 3v18M3 12h18m-3-9l-12 18m12 0L6 3" />, // Jupiter / Vishnu
    4: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />, // Rahu / Saraswati
    5: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />, // Mercury / Ganesha
    6: <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />, // Venus / Lakshmi
    7: <path d="M12 3L4 9v12h16V9l-8-6z" />, // Ketu / Ganesha
    8: <path d="M20 21l-2-2m-7 4l-3-3m5-2l3 3m1-7l-2-2m-2-1l-2-2m-5 4l3 3m1-7l-2-2m-2-1l-2-2" />, // Saturn / Hanuman
    9: <path d="M12 2l3 6 6 3-6 3-3 6-3-6-6-3 6-3 3-6z" />, // Mars / Kartikeya
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-[#8B6E4A]">
      {icons[mulank] || icons[1]}
    </svg>
  );
};

const getDivineAdvice = (mulank) => {
  const advice = {
    1: { deity: "Lord Shiva", task: "Offer water to the Sun at dawn.", reward: "Commanding leadership & respect." },
    2: { deity: "Goddess Gauri", task: "Meditate under the moonlight.", reward: "Emotional peace & strong intuition." },
    3: { deity: "Lord Vishnu", task: "Chant 'Om Namo Bhagavate Vasudevaya'.", reward: "Infinite wisdom & expansion." },
    4: { deity: "Goddess Saraswati", task: "Donate books to the needy.", reward: "Creative breakthroughs & focus." },
    5: { deity: "Lord Ganesha", task: "Offer green grass (Durva) to Ganesha.", reward: "Intellectual success & logic." },
    6: { deity: "Goddess Lakshmi", task: "Keep your workspace clean and fragrant.", reward: "Material luxury & loving relations." },
    7: { deity: "Lord Ganesha", task: "Perform selfless service (Seva).", reward: "Spiritual liberation & deep insight." },
    8: { deity: "Lord Hanuman", task: "Recite the Hanuman Chalisa.", reward: "Protection from delays & discipline." },
    9: { deity: "Lord Kartikeya", task: "Exercise regularly and stay disciplined.", reward: "Unstoppable courage & victory." },
  };
  return advice[mulank] || advice[1];
};

const NumerologyCard = ({ title, value, type }) => {
  const planet = rulingPlanets[value] || rulingPlanets[1];
  
  return (
    <div className="bg-parchment rounded-[32px] border border-[#8B6E4A]/30 shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col group transition-all hover:shadow-[0_15px_50px_rgba(139,110,74,0.15)] relative">
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#8B6E4A]/40 rounded-tl-xl"></div>
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#8B6E4A]/40 rounded-br-xl"></div>
      
      <div className="p-8 pb-4 flex justify-between items-start relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <h4 className="text-5xl font-serif font-black text-[#4A3319] leading-tight">{planet.name}</h4>
          <p className="text-sm font-black text-[#8B6E4A] uppercase tracking-[0.3em]">{title}</p>
        </div>

        <div className="relative flex-shrink-0">
          <div className="w-24 h-24 rounded-full border-[6px] border-white shadow-xl flex items-center justify-center relative overflow-hidden bg-white">
            <div className={`absolute inset-0 bg-gradient-to-br ${planet.color} opacity-90`}></div>
            <div className="absolute inset-0 border-[3px] border-white/30 rounded-full scale-90 border-dashed"></div>
            <div className="flex flex-col items-center relative z-10">
              <span className="text-3xl font-black text-white drop-shadow-sm">{value}</span>
              <Sparkles className="w-3 h-3 text-white/80 animate-pulse mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 pb-8 space-y-6">
        <div className="flex gap-3">
          <div className="flex-1 p-2 border-b border-[#8B6E4A]/20 transition-colors hover:border-[#8B6E4A]/40">
            <p className="text-sm font-black text-[#8B6E4A] uppercase tracking-wider mb-2">Quality</p>
            <p className="text-xl font-bold text-[#4A3319]">{planet.quality}</p>
          </div>
          <div className="flex-1 p-2 border-b border-[#8B6E4A]/20 transition-colors hover:border-[#8B6E4A]/40">
            <p className="text-sm font-black text-[#8B6E4A] uppercase tracking-wider mb-2">Element</p>
            <p className="text-xl font-bold text-[#4A3319]">{planet.element}</p>
          </div>
        </div>

        <div className="p-2 relative overflow-hidden transition-colors">
           <p className="text-sm font-black text-[#8B6E4A] uppercase tracking-wider mb-2">Cosmic Essence</p>
           <p className="text-lg text-[#4A3319] font-medium leading-relaxed italic">
             "{planet.desc}. Your celestial path is illuminated by this frequency."
           </p>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="bg-parchment rounded-[32px] border border-[#8B6E4A]/30 shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col group transition-all hover:shadow-[0_15px_50px_rgba(139,110,74,0.15)] relative min-h-[320px]">
    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#8B6E4A]/40 rounded-tl-xl"></div>
    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#8B6E4A]/40 rounded-br-xl"></div>
    
    <div className="p-8 pb-4 flex items-center gap-4 border-b border-[#8B6E4A]/10">
      <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#8B6E4A]">
         <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-2xl font-serif font-black text-[#4A3319] leading-tight">{title}</h4>
    </div>

    <div className="p-8 flex-grow">
      <div className="h-full flex flex-col justify-center">
         <div className="text-[#4A3319] text-lg md:text-xl leading-relaxed font-medium">
           {children}
         </div>
      </div>
    </div>
  </div>
);

const ChartResults = ({ chartData }) => {
  const { user } = useAppStore();
  const { activeProfileId, profiles } = useAstroStore();
  const { initChat, sendMessage, messages, isChatLoading } = useChatStore();
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const activeProfile = profiles.find(p => p._id === activeProfileId);
  const { mulank, bhagyank } = calculateNumerology(activeProfile?.dob);
  const topRef = useRef(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (user?._id && activeProfileId) {
      initChat(user._id, activeProfileId);
    }
  }, [user?._id, activeProfileId, initChat]);

  useEffect(() => {
    if (messages.length > 0) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages.length]);

  const handleSend = () => {
    if (chatInput.trim() && !isChatLoading) {
      sendMessage(chatInput);
      setChatInput('');
    }
  };

  return (
    <div ref={topRef} className="w-full bg-[#F5E6C4] bg-gradient-to-b from-[#F5E6C4] via-[#EBD6A7] to-[#DFD0AB] min-h-screen py-12 px-[4vw] relative z-10 flex flex-col items-center">
      <div className="w-full max-w-[1400px] space-y-12">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-[#4A3319] font-bold tracking-tight">Your Celestial Blueprint</h2>
          <p className="text-xl text-[#8B6E4A] italic opacity-80">Calculated with precision</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
          <div className="bg-parchment rounded-3xl shadow-2xl border border-[#8B6E4A]/30 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[500px]">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#8B6E4A]/30"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#8B6E4A]/30"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#8B6E4A]/30"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#8B6E4A]/30"></div>

            <div className="w-full max-w-[480px] md:scale-110 transition-transform">
              <AnimatedKundliChart chartData={chartData} />
            </div>

            <div className="mt-12 pt-8 border-t border-[#8B6E4A]/10 w-full text-center">
              <p className="text-[#8B6E4A] font-black tracking-[0.4em] uppercase text-sm opacity-60">North Indian Style Chart</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 justify-center">
            <NumerologyCard title="Mulank (Birth Number)" value={mulank} type="mulank" />
            <NumerologyCard title="Bhagyank (Destiny Number)" value={bhagyank} type="bhagyank" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoCard title="Birth Positions" icon={Star}>
            {chartData && chartData.planets ? (
              <div className="grid grid-cols-1 gap-y-2 text-xl">
                <div className="flex justify-between border-b border-[#8B6E4A]/10 pb-2 mb-1">
                  <span className="font-bold">Lagna (Asc):</span> <span>{chartData.ascendant}</span>
                </div>
                {chartData.planets.slice(0, 5).map((planet, idx) => (
                  <div key={idx} className="flex justify-between border-b border-[#8B6E4A]/5 pb-1">
                    <span className="font-bold">{planet.name}:</span> <span>{planet.sign} {Math.round(planet.degree)}°</span>
                  </div>
                ))}
              </div>
            ) : "Placements at birth."}
          </InfoCard>
          
          <InfoCard title="Current Transits" icon={Map}>
             <div className="grid grid-cols-1 gap-y-2 text-xl">
              <div className="flex justify-between border-b border-[#8B6E4A]/5 pb-1"><span>Sun:</span> <span className="font-bold">Pisces 20°</span></div>
              <div className="flex justify-between border-b border-[#8B6E4A]/5 pb-1"><span>Moon:</span> <span className="font-bold text-lg">Virgo 11°</span></div>
              <div className="flex justify-between border-b border-[#8B6E4A]/5 pb-1"><span>Mars:</span> <span className="font-bold text-lg">Aqua 4°</span></div>
              <div className="flex justify-between border-b border-[#8B6E4A]/5 pb-1"><span>Saturn:</span> <span className="font-bold text-lg">Pisces 12°</span></div>
            </div>
          </InfoCard>

          <InfoCard title="Exalted / Strong" icon={TrendingUp}>
            <p className="text-xl font-medium italic">{typeof chartData?.interpretations?.exalted_planets === 'string' ? chartData.interpretations.exalted_planets : "High strength placements."}</p>
          </InfoCard>

          <InfoCard title="Weak Placements" icon={TrendingDown}>
            <p className="text-xl font-medium italic">{typeof chartData?.interpretations?.weaker_placements === 'string' ? chartData.interpretations.weaker_placements : "Areas for growth."}</p>
          </InfoCard>

          <InfoCard title="Career & Success" icon={Briefcase}>
            <p className="text-xl font-medium">{typeof chartData?.interpretations?.profession === 'string' ? chartData.interpretations.profession : "Vocational path."}</p>
          </InfoCard>

          <InfoCard title="Love & Relations" icon={Heart}>
            <p className="text-xl font-medium">{typeof chartData?.interpretations?.love_life === 'string' ? chartData.interpretations.love_life : "Relationship dynamics."}</p>
          </InfoCard>

          <InfoCard title="Wealth & Assets" icon={Coins}>
            <p className="text-xl font-medium">{typeof chartData?.interpretations?.wealth === 'string' ? chartData.interpretations.wealth : "Financial stability."}</p>
          </InfoCard>

          <InfoCard title="Divine Guidance" icon={Sparkles}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-full bg-[#8B6E4A]/5 border border-[#8B6E4A]/10 shadow-inner">
                <DeityIcon mulank={mulank} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-[#8B6E4A] uppercase tracking-widest">Worship</p>
                <p className="text-xl font-bold text-[#4A3319]">{getDivineAdvice(mulank).deity}</p>
              </div>
              <div className="pt-2 border-t border-[#8B6E4A]/10 w-full">
                <p className="text-base text-[#4A3319] leading-tight font-medium italic">
                  "{getDivineAdvice(mulank).task}"
                </p>
                <p className="text-sm text-[#8B6E4A] font-bold mt-2">
                  Benefit: {getDivineAdvice(mulank).reward}
                </p>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Call to Action & AI Chat */}
        <div className="space-y-8 pt-12">
          <div className="text-center space-y-3">
             <h3 className="text-3xl md:text-4xl font-serif font-black text-[#4A3319]">Want to know more about yourself?</h3>
             <p className="text-xl text-[#8B6E4A] italic font-medium">Get your questions answered by your own personal celestial astrologer.</p>
          </div>

          <div className="bg-parchment rounded-[48px] shadow-2xl border border-[#8B6E4A]/30 flex flex-col h-[700px] overflow-hidden relative group transition-all hover:shadow-[0_30px_70px_rgba(139,110,74,0.2)]">
            {/* Decorative corner accents */}
            <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-[#8B6E4A]/20 rounded-tl-3xl"></div>
            <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-[#8B6E4A]/20 rounded-br-3xl"></div>

            <div className="bg-gradient-to-r from-[#4A3319] via-[#8B6E4A] to-[#4A3319] p-10 text-white flex items-center justify-between shadow-lg z-10">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center border-2 border-white/20 backdrop-blur-md shadow-2xl">
                  <Sparkles className="w-10 h-10 text-[#FFF5E1] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-4xl font-bold tracking-tight">Astro AI Sage</h3>
                  <p className="text-base text-white/70 font-medium tracking-[0.3em] uppercase">Private Consultation</p>
                </div>
              </div>
              {isChatLoading && (
                <div className="flex items-center gap-3 bg-white/20 px-6 py-3 rounded-full border border-white/30 backdrop-blur-md">
                   <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                   <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              )}
            </div>

            <div className="flex-grow p-12 overflow-y-auto flex flex-col gap-8 bg-white/40 relative custom-scrollbar">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 opacity-40">
                  <div className="w-24 h-24 rounded-full bg-[#EBD6A7] flex items-center justify-center shadow-xl">
                    <User className="w-12 h-12 text-[#8B6E4A]" />
                  </div>
                  <div className="max-w-md">
                    <p className="text-2xl font-serif text-[#4A3319] font-bold">The stars are listening...</p>
                    <p className="text-lg text-[#8B6E4A] mt-2">Ask about your career, love, or specific planetary transits.</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-6 rounded-3xl text-xl leading-relaxed shadow-sm transition-all hover:shadow-md ${
                      msg.role === 'user' 
                        ? 'bg-[#4A3319] text-[#F5E6C4] rounded-tr-none' 
                        : 'bg-white text-[#4A3319] border border-[#8B6E4A]/10 rounded-tl-none'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-10 bg-white/60 border-t border-[#8B6E4A]/20 backdrop-blur-md">
              <div className="max-w-5xl mx-auto relative flex items-center gap-4">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Whisper your question to the cosmos..."
                  className="w-full bg-white/80 border border-[#8B6E4A]/20 rounded-3xl px-8 py-6 text-xl focus:outline-none focus:border-[#4A3319] transition-all shadow-inner placeholder:text-[#8B6E4A]/40"
                />
                <button
                  onClick={handleSend}
                  disabled={isChatLoading || !chatInput.trim()}
                  className="p-6 rounded-3xl bg-[#4A3319] text-white hover:bg-[#5D4037] transition-all disabled:opacity-50 shadow-2xl active:scale-95"
                >
                   <Send className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartResults;
