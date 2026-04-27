import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Map, List, Settings, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Analytics', icon: BarChart3, path: '/analytics' },
    { name: 'Crime Map', icon: Map, path: '/map' },
    { name: 'Crime List', icon: List, path: '/crimes' },
  ];

  return (
    <aside className="w-64 border-r border-white/10 bg-surface flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-accent-blue p-2 rounded-lg">
          <ShieldAlert className="text-white" size={24} />
        </div>
        <h1 className="text-xl font-bold tracking-tight">Crimify</h1>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={clsx(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group',
              location.pathname === item.path
                ? 'bg-accent-blue/10 text-accent-blue'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            )}
          >
            <item.icon size={20} className={clsx(
              'transition-colors',
              location.pathname === item.path ? 'text-accent-blue' : 'text-gray-400 group-hover:text-white'
            )} />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-6 border-t border-white/10">
        <div className="glass-card p-4 bg-accent-purple/5 border-accent-purple/20">
          <p className="text-xs text-accent-purple font-semibold mb-1">PRO FEATURES</p>
          <p className="text-sm text-gray-400">Unlock predictive AI insights and real-time alerts.</p>
          <button className="mt-3 w-full py-2 bg-accent-purple text-white rounded-lg text-sm font-medium hover:bg-accent-purple/80 transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
