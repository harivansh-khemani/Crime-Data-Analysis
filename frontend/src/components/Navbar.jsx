import { Bell, Search, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="h-20 border-b border-white/10 px-8 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-10">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-blue transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search records, locations, or types..." 
            className="w-full pl-12 pr-4 py-2 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-blue/50 transition-all font-light"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent-red rounded-full border-2 border-background"></span>
        </button>

        <div className="h-8 w-px bg-white/10 mx-2"></div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
          </div>
          <div className="relative group">
            <button className="h-10 w-10 rounded-full bg-gradient-to-tr from-accent-blue to-accent-purple p-[2px]">
              <div className="h-full w-full rounded-full bg-surface flex items-center justify-center">
                <User size={20} />
              </div>
            </button>
            
            <div className="absolute right-0 top-12 w-48 glass-card py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-accent-red hover:bg-white/5 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
