import React, { useEffect, useState, useRef } from 'react';
import { Send, User, Sparkles, Star, Map, Compass, TrendingUp, TrendingDown, Briefcase, Heart, Coins } from 'lucide-react';
import { AnimatedKundliChart, CosmicScene } from '../Graphics';
import useChatStore from '../../store/useChatStore';
import useAppStore from '../../store/useAppStore';
import useAstroStore from '../../store/useAstroStore';

// Deity Images
import shivaImg from '../../assets/deities/shiva.png';
import gauriImg from '../../assets/deities/gauri.png';
import vishnuImg from '../../assets/deities/vishnu.png';
import saraswatiImg from '../../assets/deities/saraswati.png';
import ganeshaImg from '../../assets/deities/ganesha.png';
import lakshmiImg from '../../assets/deities/lakshmi.png';
import hanumanImg from '../../assets/deities/hanuman.png';
import kartikeyaImg from '../../assets/deities/kartikeya.png';

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
  const images = {
    1: shivaImg,      // Shiva
    2: gauriImg,      // Gauri
    3: vishnuImg,     // Vishnu
    4: saraswatiImg,  // Saraswati
    5: ganeshaImg,    // Ganesha
    6: lakshmiImg,    // Lakshmi
    7: ganeshaImg,    // Ganesha (Ketu)
    8: hanumanImg,    // Hanuman
    9: kartikeyaImg,  // Kartikeya
  };

  const imgSrc = images[mulank] || images[1];

  return (
    <div className="relative group/deity">
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-amber-200/50 via-orange-100/30 to-amber-200/50 rounded-full blur-2xl opacity-0 group-hover/deity:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative w-48 h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden transform transition-all duration-700 group-hover/deity:scale-105 group-hover/deity:rotate-1">
        <img 
          src={imgSrc} 
          alt="Divine Deity" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover/deity:scale-110"
        />
        {/* Divine Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#4A3319]/40 via-transparent to-transparent opacity-60"></div>
        <div className="absolute inset-0 border-[8px] border-white/20 rounded-full scale-95 pointer-events-none"></div>
      </div>
      
      {/* Sparkles Effect */}
      <div className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 opacity-0 group-hover/deity:opacity-100 transition-opacity duration-500 delay-100">
        <Sparkles className="w-full h-full animate-pulse" />
      </div>
    </div>
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

const IpadFrame = ({ children }) => (
  <div className="relative mx-auto w-full max-w-[550px] aspect-[3/4] bg-[#1a1a1a] rounded-[3rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-[#2d2d2d] group transition-transform duration-700 hover:scale-[1.02]">
    {/* Screen Overlay/Reflection */}
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2.5rem] z-20"></div>
    
    {/* Camera Notch */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#1a1a1a] rounded-b-2xl z-30 flex items-center justify-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#333] shadow-inner"></div>
      <div className="w-1 h-1 rounded-full bg-[#1e1e1e]"></div>
    </div>

    {/* The Screen */}
    <div className="relative w-full h-full bg-white/10 rounded-[2.5rem] overflow-hidden shadow-inner border border-white/5 z-10 flex flex-col">
      {children}
    </div>

    {/* Side Buttons */}
    <div className="absolute -right-2 top-24 w-1 h-12 bg-[#2d2d2d] rounded-r-md"></div>
    <div className="absolute -right-2 top-40 w-1 h-20 bg-[#2d2d2d] rounded-r-md"></div>
  </div>
);

const StreamingText = ({ content, isLast, role }) => {
  const [displayed, setDisplayed] = useState(isLast && role === 'model' ? "" : content);
  const [isDone, setIsDone] = useState(!(isLast && role === 'model'));

  useEffect(() => {
    if (isLast && role === 'model' && !isDone) {
      if (displayed.length < content.length) {
        const timeout = setTimeout(() => {
          setDisplayed(content.slice(0, displayed.length + 1));
        }, 15);
        return () => clearTimeout(timeout);
      } else {
        setIsDone(true);
      }
    }
  }, [content, displayed, isLast, role, isDone]);

  // Handle cases where history is loaded - shouldn't animate
  useEffect(() => {
    if (!isLast) {
      setDisplayed(content);
      setIsDone(true);
    }
  }, [isLast, content]);

  return (
    <span>
      {displayed}
      {isLast && role === 'model' && !isDone && (
        <span className="inline-block w-1.5 h-4 bg-[#8B6E4A] ml-1 animate-pulse align-middle" />
      )}
    </span>
  );
};

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
              <div className="relative mb-6">
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
        <div className="pt-24 pb-12">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-4xl md:text-6xl font-serif font-black text-[#4A3319] tracking-tight">
               Got more questions?
             </h2>
             <p className="text-2xl text-[#8B6E4A] font-medium italic">
               Ask your own personal Astrologer
             </p>
             <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#8B6E4A]/30 to-transparent mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Cosmic Illustration */}
            <div className="hidden lg:flex flex-col items-center text-center space-y-10 order-2 lg:order-1">
              <CosmicScene className="w-full max-w-[500px]" />
              <div className="space-y-6 max-w-lg">
                <h3 className="text-4xl md:text-5xl font-serif font-black text-[#4A3319] leading-tight">
                  Consult the <span className="text-[#8B6E4A]">Cosmic Oracle</span>
                </h3>
                <p className="text-xl text-[#8B6E4A] italic font-medium leading-relaxed">
                  The stars have whispered your secrets. Ask the Astro AI Sage to decode the celestial patterns of your destiny.
                </p>
                <div className="flex justify-center gap-4 text-[#8B6E4A]/40">
                  <Star className="w-6 h-6 animate-pulse" />
                  <Sparkles className="w-6 h-6 animate-pulse [animation-delay:0.5s]" />
                  <Star className="w-6 h-6 animate-pulse [animation-delay:1s]" />
                </div>
              </div>
            </div>

            {/* Right Column: iPad Chat */}
            <div className="order-1 lg:order-2">
              <div className="lg:hidden text-center space-y-4 mb-12">
                 <h3 className="text-3xl font-serif font-black text-[#4A3319]">Astro AI Sage</h3>
                 <p className="text-lg text-[#8B6E4A] italic">Private Consultation</p>
              </div>

              <IpadFrame>
                <div className="flex flex-col h-full bg-parchment/90 backdrop-blur-sm">
                  {/* iPad Chat Header */}
                  <div className="bg-gradient-to-r from-[#4A3319] to-[#8B6E4A] p-6 text-white flex items-center justify-between shadow-lg shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                        <Sparkles className="w-6 h-6 text-[#FFF5E1] animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold tracking-tight">Astro Sage</h3>
                        <p className="text-[10px] text-white/60 font-medium tracking-[0.2em] uppercase">Private AI</p>
                      </div>
                    </div>
                    {isChatLoading && (
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      </div>
                    )}
                  </div>

                  {/* Chat Content */}
                  <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar bg-white/20">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40 px-4">
                        <div className="w-16 h-16 rounded-full bg-[#EBD6A7] flex items-center justify-center shadow-lg">
                          <User className="w-8 h-8 text-[#8B6E4A]" />
                        </div>
                        <div>
                          <p className="text-xl font-serif text-[#4A3319] font-bold">The cosmos awaits...</p>
                          <p className="text-sm text-[#8B6E4A] mt-1">What celestial questions do you have?</p>
                        </div>
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-4 rounded-2xl text-base leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                              ? 'bg-[#4A3319] text-[#F5E6C4] rounded-tr-none' 
                              : 'bg-white/80 text-[#4A3319] border border-[#8B6E4A]/10 rounded-tl-none'
                          }`}>
                            <StreamingText 
                              content={msg.content} 
                              isLast={i === messages.length - 1} 
                              role={msg.role} 
                            />
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input */}
                  <div className="p-6 bg-white/40 border-t border-[#8B6E4A]/10 backdrop-blur-md shrink-0">
                    <div className="relative flex items-center gap-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask the cosmos..."
                        className="w-full bg-white/80 border border-[#8B6E4A]/20 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-[#4A3319] transition-all shadow-inner placeholder:text-[#8B6E4A]/40"
                      />
                      <button
                        onClick={handleSend}
                        disabled={isChatLoading || !chatInput.trim()}
                        className="p-4 rounded-2xl bg-[#4A3319] text-white hover:bg-[#5D4037] transition-all disabled:opacity-50 shadow-lg active:scale-95"
                      >
                         <Send className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              </IpadFrame>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartResults;
