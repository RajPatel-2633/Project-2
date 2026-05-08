import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { DrawingChart } from './Graphics'
import useAppStore from '../store/useAppStore'

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, isAuthLoading, error, clearError } = useAppStore();

  useEffect(() => {
    return () => clearError(); // clear error on unmount
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
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

        {error && (
          <div className="alert alert-error shadow-lg mb-4 bg-red-100 text-red-800 border-red-200">
            <span>{error}</span>
          </div>
        )}

        <form className="w-full space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-sm font-medium text-astra-brown">Email Address</label>
            <input
              type="email"
              placeholder="seeker@astro.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/70 border border-[#C4A15A]/30 text-astra-brown placeholder-astra-brown/40 focus:outline-none focus:ring-2 focus:ring-astra-orange/50 transition-all"
              required
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/70 border border-[#C4A15A]/30 text-astra-brown placeholder-astra-brown/40 focus:outline-none focus:ring-2 focus:ring-astra-orange/50 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isAuthLoading}
            className="w-full py-4 mt-6 rounded-xl bg-[#4A3319] text-[#FFF5E1] font-bold text-sm tracking-widest shadow-[0_4px_14px_rgba(74,51,25,0.4)] hover:bg-[#3D2B15] hover:shadow-[0_6px_20px_rgba(74,51,25,0.6)] hover:-translate-y-0.5 transition-all active:translate-y-0 uppercase disabled:opacity-70"
          >
            {isAuthLoading ? 'Loading...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-astra-brown text-center">
          New here? <Link to="/signup" className="font-black text-[#4A3319] hover:underline decoration-2 underline-offset-4">Sign Up</Link>
        </p>

      </div>

      {/* The stars are whispering your name at the very bottom */}
      <h2 className="text-xl font-serif text-astra-brown mb-12 text-center mt-auto relative z-20 w-full whitespace-nowrap">The stars are whispering your name.</h2>

    </div>
  )
}

export default LoginForm
