import { Link, useNavigate } from 'react-router-dom'
import { DrawingChart } from './Graphics'

const LoginForm = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="relative w-full lg:w-1/2 flex flex-col p-8 justify-between items-center overflow-hidden min-h-screen lg:min-h-0">

      {/* Invisible spacer to balance the flex-between layout */}
      <div className="w-full mt-2" />

      <div className="w-full max-w-md flex flex-col items-center relative z-10 -mt-8">

        {/* Main Logo & Title Area */}
        <div className="flex flex-col items-center mt-8 mb-6 relative z-20 w-full">
          <div className="relative flex items-center justify-center mb-2">
            <h2 className="text-5xl lg:text-6xl font-serif font-normal text-astra-brown tracking-widest whitespace-nowrap">Astro AI</h2>
            <div className="absolute left-full ml-4 lg:ml-6">
              <DrawingChart />
            </div>
          </div>
          <p className="text-xl lg:text-2xl italic text-astra-brown/80">Your Personalised Astrologer</p>
        </div>

        {/* Semi-Bold Login Header */}
        <h1 className="text-4xl font-serif text-astra-brown mt-6 mb-8 text-center font-semibold">Login</h1>

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-astra-brown">Email Address</label>
            <input
              type="email"
              placeholder="seeker@celestial.ai"
              className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/60 text-astra-brown placeholder-astra-brown/40 focus:outline-none focus:ring-2 focus:ring-astra-orange/50 transition-all"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-astra-brown">Password</label>
              <a href="#" className="text-xs text-astra-brown hover:underline font-medium">Forgot alignment?</a>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white/50 border border-white/60 text-astra-brown placeholder-astra-brown/40 focus:outline-none focus:ring-2 focus:ring-astra-orange/50 transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-astra-orange to-[#EEB86D] text-astra-brown font-semibold shadow-md hover:shadow-lg transition-all active:scale-[0.98] mt-6"
          >
            Enter the Cosmos
          </button>
        </form>

        <p className="mt-6 text-sm text-astra-brown text-center">
          New here? <Link to="/signup" className="font-bold hover:underline">Sign Up</Link>
        </p>

      </div>

      {/* The stars are whispering your name at the very bottom */}
      <h2 className="text-xl font-serif text-astra-brown mb-12 text-center mt-auto relative z-20 w-full whitespace-nowrap">The stars are whispering your name.</h2>

    </div>
  )
}

export default LoginForm
