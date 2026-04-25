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
