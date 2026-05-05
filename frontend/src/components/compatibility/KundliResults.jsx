import React, { useEffect, useState, useRef } from 'react';
import { Send, User, Sparkles, Star, Map, ShieldAlert, Heart, Home, Baby, Scale, ShieldCheck, TrendingUp, TrendingDown, Briefcase, Coins, Activity } from 'lucide-react';
import { AnimatedKundliChart, CosmicScene } from '../Graphics';
import useChatStore from '../../store/useChatStore';
import useAppStore from '../../store/useAppStore';

const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="bg-parchment rounded-[32px] border border-[#8B6E4A]/30 shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col group transition-all hover:shadow-[0_15px_50px_rgba(139,110,74,0.15)] relative min-h-[320px]">
    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-[#8B6E4A]/40 rounded-tl-xl"></div>
    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-[#8B6E4A]/40 rounded-br-xl"></div>

    <div className="p-8 pb-4 flex items-center gap-4 border-b border-[#8B6E4A]/10">
      <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center text-[#8B6E4A]">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-xl lg:text-2xl font-serif font-black text-[#4A3319] leading-tight">{title}</h4>
    </div>

    <div className="p-8 flex-grow">
      <div className="h-full flex flex-col justify-center">
        <div className="text-[#4A3319] text-base lg:text-lg leading-relaxed font-medium italic">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const IpadFrame = ({ children }) => (
  <div className="relative mx-auto w-full max-w-[550px] aspect-[3/4] bg-[#1a1a1a] rounded-[3rem] p-4 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[8px] border-[#2d2d2d] group transition-transform duration-700 hover:scale-[1.02]">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-[2.5rem] z-20"></div>
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#1a1a1a] rounded-b-2xl z-30 flex items-center justify-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-[#333] shadow-inner"></div>
      <div className="w-1 h-1 rounded-full bg-[#1e1e1e]"></div>
    </div>
    <div className="relative w-full h-full bg-white/10 rounded-[2.5rem] overflow-hidden shadow-inner border border-white/5 z-10 flex flex-col">
      {children}
    </div>
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

const KundliResults = ({ matchData }) => {
  const { user } = useAppStore();
  const { initChat, sendMessage, messages, isChatLoading } = useChatStore();
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);
  
  if (!matchData) return null;
  const { match, chart1, chart2 } = matchData;

  const targetProfileId = chart1?.profile_id?._id || chart1?.profile_id;

  useEffect(() => {
    if (user?._id && targetProfileId) {
        initChat(user._id, targetProfileId);
    }
  }, [user?._id, targetProfileId, initChat]);

  useEffect(() => {
    if (messages.length > 1) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [messages.length]);

  const handleSend = () => {
    if (chatInput.trim() && !isChatLoading) {
      sendMessage(chatInput, user?._id, targetProfileId);
      setChatInput('');
    }
  };

  // Dynamic Interpretation Logic
  const getSoulResonance = () => {
    const score = match?.total_score || 0;
    if (score >= 28) return `With a high score of ${score}, your moons are in perfect symphony. This indicates a rare spiritual bond that transcends the physical realm, allowing for a relationship where silence is as comfortable as conversation.`;
    if (score >= 18) return `Your emotional frequencies are well-aligned at ${score}/36. This suggests an intellectual connection rooted in shared values and mutual respect, fostering a sanctuary of understanding and profound empathy.`;
    return `Your connection is a work in progress. While your paths are different, your score of ${score} shows a unique opportunity to grow through contrast, building a bridge between two distinct worlds with conscious effort.`;
  };

  const getFutureStability = () => {
    const p1Jup = chart1?.planets?.find(p => p.name === 'Jupiter')?.house;
    const p2Jup = chart2?.planets?.find(p => p.name === 'Jupiter')?.house;
    const hasStrongJup = p1Jup === 4 || p1Jup === 9 || p2Jup === 4 || p2Jup === 9;
    
    return hasStrongJup 
      ? `Strong Jupiter aspects on the houses of home indicate a shared destiny involving stable property ownership and a peaceful domestic sanctuary. Together, you will build a foundation that is physically secure and spiritually grounding.`
      : `Your stability will be built through shared discipline. While the stars suggest a grounded life, your combined focus on financial planning and domestic harmony will be the key to your long-lasting ancestral blessings.`;
  };

  const getProgenyGrowth = () => {
    const p1Fifth = chart1?.planets?.filter(p => p.house === 5).length || 0;
    const p2Fifth = chart2?.planets?.filter(p => p.house === 5).length || 0;
    
    if (p1Fifth > 0 || p2Fifth > 0) return `With active energy in your 5th houses, your lineage is characterized by creativity and vitality. You will likely experience significant growth in your family legacy, bringing forth children who carry the best traits of both souls.`;
    return `Your path to growth lies in shared creation. Whether through family or joint creative ventures, the benefic alignment of your charts suggests a bright, spiritually-enriched future that expands with every passing year.`;
  };

  const getKarmaLessons = () => {
    const nadiScore = match?.nadi || 0;
    const hasSaturnStress = chart1?.planets?.find(p => p.name === 'Saturn')?.house === 7 || chart2?.planets?.find(p => p.name === 'Saturn')?.house === 7;
    
    if (nadiScore === 0) return `Your primary sacred lesson involves navigating communication through deep patience. This Nadi Dosha is an opportunity to transform individual ego into shared victory by mastering the art of listening.`;
    if (hasSaturnStress) return `Saturn's presence in the house of union suggests that your bond is a karmic contract of discipline. You are here to teach each other resilience and the value of time, strengthening the knot that binds your destinies.`;
    return `Your karmic path is one of mutual support. You are here to cultivate patience and shared wisdom as you walk the path together, transforming every obstacle into a stepping stone for your collective soul evolution.`;
  };

  return (
    <div className="w-full bg-[#F5E6C4] bg-gradient-to-b from-[#F5E6C4] via-[#EBD6A7] to-[#DFD0AB] min-h-screen py-12 px-[4vw] relative z-10 flex flex-col items-center">
      <div className="w-full max-w-[1400px] space-y-12">
        
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-[#4A3319] font-bold tracking-tight">Cosmic Compatibility</h2>
          <p className="text-xl text-[#8B6E4A] italic opacity-80">The divine alignment of two souls</p>
        </div>

        {/* Dual Charts Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Chart 1 */}
          <div className="bg-parchment rounded-3xl shadow-2xl border border-[#8B6E4A]/30 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[500px]">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#8B6E4A]/30"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#8B6E4A]/30"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#8B6E4A]/30"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#8B6E4A]/30"></div>
            
            <h3 className="font-serif text-[#4A3319] text-2xl font-bold mb-8 border-b border-[#8B6E4A]/20 pb-4 w-full text-center tracking-wide">{chart1?.profile_id?.name || 'Partner One'}'s Chart</h3>
            <div className="w-full max-w-[420px] md:scale-105 transition-transform">
              <AnimatedKundliChart chartData={chart1} />
            </div>
            <div className="mt-8 pt-6 border-t border-[#8B6E4A]/10 w-full text-center">
              <p className="text-[#8B6E4A] font-black tracking-[0.3em] uppercase text-xs opacity-60">Lagna: {chart1?.ascendant}</p>
            </div>
          </div>

          {/* Chart 2 */}
          <div className="bg-parchment rounded-3xl shadow-2xl border border-[#8B6E4A]/30 p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden h-full min-h-[500px]">
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#8B6E4A]/30"></div>
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#8B6E4A]/30"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#8B6E4A]/30"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#8B6E4A]/30"></div>
            
            <h3 className="font-serif text-[#4A3319] text-2xl font-bold mb-8 border-b border-[#8B6E4A]/20 pb-4 w-full text-center tracking-wide">{chart2?.profile_id?.name || 'Partner Two'}'s Chart</h3>
            <div className="w-full max-w-[420px] md:scale-105 transition-transform">
              <AnimatedKundliChart chartData={chart2} />
            </div>
            <div className="mt-8 pt-6 border-t border-[#8B6E4A]/10 w-full text-center">
              <p className="text-[#8B6E4A] font-black tracking-[0.3em] uppercase text-xs opacity-60">Lagna: {chart2?.ascendant}</p>
            </div>
          </div>
        </div>

        {/* Informational Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <InfoCard title="Ashtakoot Score" icon={Scale}>
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-6xl font-serif font-black text-[#4A3319] flex items-baseline gap-1">
                {match?.total_score || 0}
                <span className="text-2xl text-[#8B6E4A]/60">/36</span>
              </div>
              <div className="grid grid-cols-3 gap-6 w-full pt-4 border-t border-[#8B6E4A]/10">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#8B6E4A] uppercase tracking-widest">Nadi</p>
                  <p className="text-xl font-bold text-[#4A3319]">{match?.nadi}/8</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#8B6E4A] uppercase tracking-widest">Bhakoot</p>
                  <p className="text-xl font-bold text-[#4A3319]">{match?.bhakoot}/7</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#8B6E4A] uppercase tracking-widest">Gana</p>
                  <p className="text-xl font-bold text-[#4A3319]">{match?.gana}/6</p>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Manglik Synergy" icon={ShieldAlert}>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span>{chart1?.profile_id?.name}:</span>
                <span className={`font-bold ${match?.manglik_p1 ? 'text-red-500' : 'text-green-600'}`}>{match?.manglik_p1 ? 'MANGLIK' : 'NON-MANGLIK'}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>{chart2?.profile_id?.name}:</span>
                <span className={`font-bold ${match?.manglik_p2 ? 'text-red-500' : 'text-green-600'}`}>{match?.manglik_p2 ? 'MANGLIK' : 'NON-MANGLIK'}</span>
              </div>
              <p className="text-base mt-4 pt-4 border-t border-[#8B6E4A]/10">
                {match?.manglik_p1 === match?.manglik_p2 ? "Balance achieved. Mars energy is neutralized." : "Energy variance detected. Remedies may be required."}
              </p>
            </div>
          </InfoCard>

          <InfoCard title="Soul Resonance" icon={Heart}>
            <p>{getSoulResonance()}</p>
          </InfoCard>

          <InfoCard title="Future Stability" icon={Home}>
             <p>{getFutureStability()}</p>
          </InfoCard>

          <InfoCard title="Progeny & Growth" icon={Baby}>
             <p>{getProgenyGrowth()}</p>
          </InfoCard>

          <InfoCard title="Karma & Lessons" icon={Activity}>
             <p>{getKarmaLessons()}</p>
          </InfoCard>
        </div>

        {/* AI Chat Area */}
        <div className="pt-24 pb-12">
           <div className="text-center mb-16 space-y-4">
             <h2 className="text-4xl md:text-6xl font-serif font-black text-[#4A3319] tracking-tight">Relationship Sage</h2>
             <p className="text-2xl text-[#8B6E4A] font-medium italic">Deep dive into your union</p>
             <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#8B6E4A]/30 to-transparent mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="hidden lg:flex flex-col items-center text-center space-y-10 order-2 lg:order-1">
              <CosmicScene className="w-full max-w-[500px]" />
              <div className="space-y-6 max-w-lg">
                <h3 className="text-4xl md:text-5xl font-serif font-black text-[#4A3319] leading-tight">
                  Consult the <span className="text-[#8B6E4A]">Union Oracle</span>
                </h3>
                <p className="text-xl text-[#8B6E4A] italic font-medium leading-relaxed">
                  The stars have matched your paths. Ask the Relationship Sage to reveal the secrets of your shared destiny.
                </p>
                <div className="flex justify-center gap-4 text-[#8B6E4A]/40">
                  <Heart className="w-6 h-6 animate-pulse text-red-400" />
                  <Sparkles className="w-6 h-6 animate-pulse [animation-delay:0.5s]" />
                  <Heart className="w-6 h-6 animate-pulse [animation-delay:1s] text-red-400" />
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 lg:pt-20">
              <IpadFrame>
                <div className="flex flex-col h-full bg-parchment/90 backdrop-blur-sm">
                  <div className="bg-gradient-to-r from-[#4A3319] to-[#8B6E4A] p-6 text-white flex items-center justify-between shadow-lg shrink-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-md">
                        <Heart className="w-6 h-6 text-red-200 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="font-serif text-xl font-bold tracking-tight">Relationship Sage</h3>
                        <p className="text-[10px] text-white/60 font-medium tracking-[0.2em] uppercase">Private Match AI</p>
                      </div>
                    </div>
                    {isChatLoading && (
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar bg-white/20">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-40 px-4">
                        <div className="w-16 h-16 rounded-full bg-[#EBD6A7] flex items-center justify-center shadow-lg">
                          <Heart className="w-8 h-8 text-red-500" />
                        </div>
                        <div className="space-y-4">
                          <p className="text-xl font-serif text-[#4A3319] font-bold italic">
                            "I have analyzed the cosmic resonance between {chart1?.profile_id?.name} and {chart2?.profile_id?.name}. How may I guide your union today?"
                          </p>
                          <p className="text-xs text-[#8B6E4A] uppercase tracking-[0.2em] font-black opacity-60">Consultation Live</p>
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

                  <div className="p-6 bg-white/40 border-t border-[#8B6E4A]/10 backdrop-blur-md shrink-0">
                    <div className="relative flex items-center gap-3">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about your union..."
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

export default KundliResults;
