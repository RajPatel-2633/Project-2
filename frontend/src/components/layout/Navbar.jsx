import { Link, useLocation } from 'react-router-dom';
import { Menu, User, Bell, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full relative z-50">
      {/* Top subtle gradient instead of solid backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EBD6A7]/80 to-transparent pointer-events-none"></div>
      
      <div className="w-full px-[4vw] relative z-10">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/dashboard" className="font-serif text-gold-3d font-bold tracking-wide text-[clamp(1.5rem,3vw,2.5rem)]">
              Astro AI
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-8">
            <Link 
              to="/dashboard" 
              className={`px-3 py-2 text-sm font-bold transition-all ${isActive('/dashboard') ? 'text-[#8A5A2B] border-b-[3px] border-[#8A5A2B]' : 'text-[#8A5A2B]/70 hover:text-[#8A5A2B]'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/chart" 
              className="px-3 py-2 text-sm font-bold text-[#8A5A2B]/70 hover:text-[#8A5A2B] transition-colors"
            >
              Birth Chart
            </Link>
            <Link 
              to="/compatibility" 
              className="px-3 py-2 text-sm font-bold text-[#8A5A2B]/70 hover:text-[#8A5A2B] transition-colors"
            >
              Compatibility
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-6">
            <button className="relative drop-shadow-md hover:drop-shadow-lg transition-all text-[#C19E63] hover:text-[#D8BD8A]">
              <Bell className="w-6 h-6 fill-current" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-600 rounded-full border border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-metallic flex items-center justify-center text-white shadow-lg overflow-hidden">
              {/* Simulate the sage avatar with a metallic gradient base and a User icon */}
              <div className="w-full h-full bg-gradient-to-b from-[#C4A15A] to-[#8C642A] flex items-center justify-center">
                <User className="w-6 h-6 text-[#EAD7A1]" strokeWidth={2} />
              </div>
            </div>
            {/* Mobile menu button */}
            <button className="md:hidden text-[#8A5A2B]">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
