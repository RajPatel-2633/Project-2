export const DrawingChart = () => (
  <div className="relative w-12 h-12 lg:w-16 lg:h-16 text-astra-brown/80 flex-shrink-0">
    <style>
      {`
        @keyframes drawChart {
          0% { stroke-dashoffset: 1000; opacity: 0; }
          5% { stroke-dashoffset: 1000; opacity: 1; }
          70% { stroke-dashoffset: 0; opacity: 1; }
          95% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        .animate-draw {
          stroke-dasharray: 1000;
          stroke-dashoffset: 1000;
          animation: drawChart 6s ease-in-out infinite;
        }
        @keyframes penMove {
          0% { left: 0%; top: 0%; transform: rotate(-20deg); opacity: 0; }
          5% { left: 0%; top: 0%; transform: rotate(-20deg); opacity: 1; }
          20% { left: 80%; top: 0%; transform: rotate(-10deg); opacity: 1; }
          40% { left: 80%; top: 80%; transform: rotate(-30deg); opacity: 1; }
          60% { left: 0%; top: 80%; transform: rotate(-15deg); opacity: 1; }
          70% { left: 40%; top: 40%; transform: rotate(-25deg); opacity: 1; }
          95% { left: 40%; top: 40%; transform: rotate(-20deg); opacity: 1; }
          100% { left: 40%; top: 40%; transform: rotate(-20deg); opacity: 0; }
        }
        .animate-pen {
          animation: penMove 6s ease-in-out infinite;
        }
      `}
    </style>
    {/* The Chart SVG */}
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path className="animate-draw" d="M 5 5 L 95 5 L 95 95 L 5 95 Z M 5 5 L 95 95 M 5 95 L 95 5 M 50 5 L 95 50 L 50 95 L 5 50 Z" strokeLinejoin="round" />
    </svg>
    {/* The Pen */}
    <div className="absolute w-6 h-6 -ml-1 -mt-4 text-astra-brown animate-pen origin-bottom-left pointer-events-none drop-shadow-md">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M 20.7 3.3 C 20.7 3.3 19.3 3 17.2 4.1 C 15.1 5.2 12.1 8.2 9.5 11.5 C 9.1 11.3 8.6 11.2 8.1 11.2 C 5.5 11.2 3.1 13 2.2 15.6 C 2 16.2 1.8 17.2 2 18 C 2.1 18.3 2.5 18.5 2.8 18.3 C 5 16.8 6.5 16.8 8.1 17 C 8.6 17.1 9 17.3 9.4 17.6 C 10.4 18.3 11 19.3 11.2 20.4 C 11.4 22 10.9 23.3 10.8 23.6 C 10.7 23.9 11 24.1 11.3 23.9 C 13.8 22.4 16.2 18.5 16.2 15.9 C 16.2 15.4 16.1 14.9 15.9 14.5 C 19.2 11.9 22.2 8.9 23.3 6.8 C 24.4 4.7 24.1 3.3 24.1 3.3 C 24.1 3.3 22.8 2.3 20.7 3.3 Z"/>
      </svg>
    </div>
  </div>
)

export const StarSwoosh = ({ flipped = false, className = "" }) => {
  return (
    <svg 
      viewBox="0 0 140 45" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`text-astra-brown/70 ${flipped ? 'transform -scale-x-100' : ''} ${className}`}
    >
      {/* Main sweeping lines */}
      <path d="M 5 30 C 30 10, 70 5, 135 30" stroke="currentColor" strokeWidth="1" strokeLinecap="round" fill="transparent" />
      <path d="M 0 20 C 40 40, 80 40, 130 20" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" fill="transparent" />
      <path d="M 15 25 C 45 0, 90 0, 125 25" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeDasharray="1 3" fill="transparent" />
      
      {/* Stars (4-point) */}
      <path d="M 30 10 Q 30 15 35 15 Q 30 15 30 20 Q 30 15 25 15 Q 30 15 30 10 Z" fill="currentColor" />
      <path d="M 100 5 Q 100 8 103 8 Q 100 8 100 11 Q 100 8 97 8 Q 100 8 100 5 Z" fill="currentColor" />
      <path d="M 15 40 Q 15 42 17 42 Q 15 42 15 44 Q 15 42 13 42 Q 15 42 15 40 Z" fill="currentColor" />

      {/* Little sparkle dots */}
      <circle cx="45" cy="8" r="1" fill="currentColor" />
      <circle cx="55" cy="18" r="1.5" fill="currentColor" />
      <circle cx="75" cy="5" r="1" fill="currentColor" />
      <circle cx="90" cy="35" r="1.2" fill="currentColor" />
      <circle cx="110" cy="28" r="0.8" fill="currentColor" />
      <circle cx="125" cy="32" r="1" fill="currentColor" />

      {/* Zodiac symbols */}
      <text x={flipped ? "-50" : "40"} y="28" fontSize="12" fill="currentColor" transform={flipped ? "scale(-1, 1)" : ""} style={{fontFamily: 'sans-serif'}}>♈</text>
      <text x={flipped ? "-115" : "105"} y="22" fontSize="10" fill="currentColor" transform={flipped ? "scale(-1, 1)" : ""} style={{fontFamily: 'sans-serif'}}>♓</text>
    </svg>
  );
}

export const ZodiacLoader = () => {
  const signs = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <style>
        {`
          @keyframes spinWheel {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-wheel {
            animation: spinWheel 4s linear infinite;
          }
        `}
      </style>
      <svg viewBox="0 0 100 100" className="w-full h-full animate-spin-wheel text-[#C4A15A]">
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="opacity-50" />
        <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-30" />
        {signs.map((sign, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x = 50 + 40 * Math.sin(angle);
          const y = 50 - 40 * Math.cos(angle);
          return (
            <text 
              key={i} 
              x={x} 
              y={y} 
              fontSize="8" 
              fill="currentColor" 
              textAnchor="middle" 
              dominantBaseline="middle"
              transform={`rotate(${i * 30}, ${x}, ${y})`}
            >
              {sign}
            </text>
          );
        })}
      </svg>
      {/* Central Sun/Star */}
      <div className="absolute w-12 h-12 rounded-full border-2 border-[#C4A15A] flex items-center justify-center bg-parchment shadow-[0_0_15px_rgba(196,161,90,0.5)]">
        <span className="text-xl text-[#8B6E4A]">✨</span>
      </div>
    </div>
  );
};

export const AnimatedKundliChart = ({ chartData }) => {
  const zodiacSigns = {
    "Aries": 1, "Taurus": 2, "Gemini": 3, "Cancer": 4, "Leo": 5, "Virgo": 6,
    "Libra": 7, "Scorpio": 8, "Sagittarius": 9, "Capricorn": 10, "Aquarius": 11, "Pisces": 12
  };

  const ascNum = zodiacSigns[chartData?.ascendant] || 1;
  const getSignForHouse = (house) => ((ascNum + house - 2) % 12) + 1;

  const planetsByHouse = Array.from({ length: 12 }, () => []);
  if (chartData?.planets) {
    chartData.planets.forEach(p => {
      if (p.house >= 1 && p.house <= 12) {
        planetsByHouse[p.house - 1].push(p);
      }
    });
  }

  const getPlanetAbbr = (name) => {
    if (!name) return "";
    const map = {
      Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me",
      Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke"
    };
    return map[name] || name.substring(0, 2);
  };

  const houseCoordinates = [
    { house: 1, x: 50, y: 27.5 },
    { house: 2, x: 27.5, y: 12.5 },
    { house: 3, x: 12.5, y: 27.5 },
    { house: 4, x: 27.5, y: 50 },
    { house: 5, x: 12.5, y: 72.5 },
    { house: 6, x: 27.5, y: 87.5 },
    { house: 7, x: 50, y: 72.5 },
    { house: 8, x: 72.5, y: 87.5 },
    { house: 9, x: 87.5, y: 72.5 },
    { house: 10, x: 72.5, y: 50 },
    { house: 11, x: 87.5, y: 27.5 },
    { house: 12, x: 72.5, y: 12.5 },
  ];

  return (
    <div className="relative w-full aspect-square text-[#8B6E4A]">
      <style>
        {`
          @keyframes drawKundli {
            0% { stroke-dashoffset: 800; }
            100% { stroke-dashoffset: 0; }
          }
          .animate-draw-kundli {
            stroke-dasharray: 800;
            stroke-dashoffset: 800;
            animation: drawKundli 2s ease-in-out forwards;
          }
          @keyframes penTrace {
            0% { left: 0%; top: 0%; opacity: 1; }
            15% { left: 100%; top: 0%; opacity: 1; }
            30% { left: 100%; top: 100%; opacity: 1; }
            45% { left: 0%; top: 100%; opacity: 1; }
            60% { left: 0%; top: 0%; opacity: 1; }
            70% { left: 100%; top: 100%; opacity: 1; }
            80% { left: 0%; top: 100%; opacity: 1; }
            90% { left: 100%; top: 0%; opacity: 1; }
            100% { left: 50%; top: 50%; opacity: 0; }
          }
          .animate-pen-trace {
            animation: penTrace 2s ease-in-out forwards;
          }
          @keyframes fadeInPlanets {
            0% { opacity: 0; transform: scale(0.8); }
            100% { opacity: 1; transform: scale(1); }
          }
          .animate-fade-planets {
            opacity: 0;
            animation: fadeInPlanets 1s ease-out 2s forwards;
          }
        `}
      </style>
      
      {/* The Chart lines */}
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" stroke="currentColor" strokeWidth="1.5">
        {/* Outer Square */}
        <path className="animate-draw-kundli" d="M 5 5 L 95 5 L 95 95 L 5 95 Z" strokeLinejoin="round" />
        {/* Diagonals */}
        <path className="animate-draw-kundli" d="M 5 5 L 95 95 M 5 95 L 95 5" style={{ animationDelay: '0.2s' }} />
        {/* Inner Diamond */}
        <path className="animate-draw-kundli" d="M 50 5 L 95 50 L 50 95 L 5 50 Z" strokeLinejoin="round" style={{ animationDelay: '0.4s' }} />
      </svg>
      
      {/* The Pen */}
      <div className="absolute w-8 h-8 -ml-2 -mt-6 text-[#5c3a1d] animate-pen-trace origin-bottom-left pointer-events-none drop-shadow-lg z-20">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M 20.7 3.3 C 20.7 3.3 19.3 3 17.2 4.1 C 15.1 5.2 12.1 8.2 9.5 11.5 C 9.1 11.3 8.6 11.2 8.1 11.2 C 5.5 11.2 3.1 13 2.2 15.6 C 2 16.2 1.8 17.2 2 18 C 2.1 18.3 2.5 18.5 2.8 18.3 C 5 16.8 6.5 16.8 8.1 17 C 8.6 17.1 9 17.3 9.4 17.6 C 10.4 18.3 11 19.3 11.2 20.4 C 11.4 22 10.9 23.3 10.8 23.6 C 10.7 23.9 11 24.1 11.3 23.9 C 13.8 22.4 16.2 18.5 16.2 15.9 C 16.2 15.4 16.1 14.9 15.9 14.5 C 19.2 11.9 22.2 8.9 23.3 6.8 C 24.4 4.7 24.1 3.3 24.1 3.3 C 24.1 3.3 22.8 2.3 20.7 3.3 Z"/>
        </svg>
      </div>

      {/* Planets and Signs (fading in after drawing) */}
      <div className="absolute inset-0 animate-fade-planets pointer-events-none">
        {houseCoordinates.map((coord) => {
          const houseNum = coord.house;
          const signNum = getSignForHouse(houseNum);
          const planetsInThisHouse = planetsByHouse[houseNum - 1];

          return (
            <div 
              key={houseNum}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center leading-[1.1]"
              style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
            >
              {/* Zodiac Sign Number */}
              {chartData && (
                 <span className="text-[10px] md:text-xs opacity-60 text-[#8B6E4A] font-bold mb-0.5">
                   {signNum}
                 </span>
              )}
              
              {/* Fallback mock planets if no chartData */}
              {!chartData && houseNum === 1 && <span className="font-bold text-[#5c3a1d] text-[10px] md:text-sm">Asc</span>}
              {!chartData && houseNum === 4 && <span className="font-bold text-[#5c3a1d] text-[10px] md:text-sm">Mo</span>}
              {!chartData && houseNum === 7 && <span className="font-bold text-[#5c3a1d] text-[10px] md:text-sm">Sa</span>}
              {!chartData && houseNum === 10 && <span className="font-bold text-[#5c3a1d] text-[10px] md:text-sm">Su</span>}

              {/* Dynamic Planets */}
              {chartData && planetsInThisHouse.map((p, i) => (
                <span key={i} className="font-bold text-[#5c3a1d] text-[11px] md:text-sm">
                  {getPlanetAbbr(p.name)}{p.is_retrograde ? '*' : ''}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CelestialIllustration = ({ className = "" }) => (
  <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" className="opacity-30" />
    <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" className="opacity-20" />
    
    {/* Geometric mandala patterns */}
    <path d="M100 10 L115 85 L190 100 L115 115 L100 190 L85 115 L10 100 L85 85 Z" stroke="currentColor" strokeWidth="0.5" className="opacity-40" />
    <path d="M100 30 L110 90 L170 100 L110 110 L100 170 L90 110 L30 100 L90 90 Z" stroke="currentColor" strokeWidth="0.5" className="opacity-30" />
    
    {/* Moons */}
    <path d="M160 40 A 20 20 0 1 0 140 60 A 15 15 0 1 1 160 40" fill="currentColor" className="opacity-20" />
    <path d="M40 160 A 20 20 0 1 1 60 140 A 15 15 0 1 0 40 160" fill="currentColor" className="opacity-20" />
    
    {/* Orbits */}
    <circle cx="100" cy="100" r="45" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 6" className="opacity-50" />
    
    {/* Sun center */}
    <circle cx="100" cy="100" r="15" fill="currentColor" className="opacity-10" />
    <circle cx="100" cy="100" r="8" fill="currentColor" className="opacity-30" />
    
    {/* Scattered Stars */}
    {[
      [150, 70], [170, 120], [130, 160], [70, 170], [30, 130], [40, 70], [80, 30]
    ].map(([x, y], i) => (
      <path 
        key={i}
        d={`M${x} ${y-3} L${x+1} ${y-1} L${x+3} ${y} L${x+1} ${y+1} L${x} ${y+3} L${x-1} ${y+1} L${x-3} ${y} L${x-1} ${y-1} Z`} 
        fill="currentColor" 
        className="opacity-40"
      />
    ))}
  </svg>
);
