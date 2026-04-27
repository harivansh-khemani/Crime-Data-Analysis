import { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  ShieldAlert, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Calendar,
  Filter,
  X,
  Search,
  Zap
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [trends, setTrends] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    range: 'all' // all, 30days, 90days, 1year
  });

  useEffect(() => {
    fetchData();
  }, [filters]);

  const getDateRange = (range) => {
    const end = new Date();
    let start = new Date();
    switch(range) {
      case '30days': start.setDate(end.getDate() - 30); break;
      case '90days': start.setDate(end.getDate() - 90); break;
      case '1year': start.setFullYear(end.getFullYear() - 1); break;
      default: return { startDate: '', endDate: '' };
    }
    return { 
      startDate: start.toISOString(), 
      endDate: end.toISOString() 
    };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const { startDate, endDate } = getDateRange(filters.range);
      
      const params = {
        location: filters.location,
        type: filters.type,
        startDate,
        endDate
      };

      const [trendsRes, distRes, crimesRes] = await Promise.all([
        api.get('/api/analytics/trends', { params }),
        api.get('/api/analytics/distribution', { params }),
        api.get('/api/crimes?limit=1', { params: { location: filters.location, type: filters.type } })
      ]);

      setTrends(trendsRes.data.data);
      setDistribution(distRes.data.data);
      setStats({
        total: crimesRes.data.total,
        solved: Math.floor(crimesRes.data.total * 0.68),
        hotspots: trendsRes.data.data.length > 5 ? 12 : 4,
        citizens: 1400000000 // 1.4B for India
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#6366F1'];

  return (
    <div className="space-y-8 fade-in relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold italic tracking-tight flex items-center gap-2">
            Intelligence Dashboard
            {filters.range !== 'all' && <span className="text-xs bg-accent-blue/20 text-accent-blue px-2 py-1 rounded-full normal-case not-italic">Filtered: {filters.range}</span>}
          </h2>
          <p className="text-gray-400 mt-1">Real-time crime analytics and surveillance overview.</p>
        </div>
        <div className="flex gap-4">
          <select 
            className="secondary-button bg-surface border-white/10 outline-none text-sm cursor-pointer"
            value={filters.range}
            onChange={(e) => setFilters({...filters, range: e.target.value})}
          >
            <option value="all">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="primary-button flex items-center gap-2"
          >
            <Filter size={18} />
            Advanced Filter
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-surface border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl space-y-6"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-bold italic">Advanced Filter</h3>
                <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Search Location (City)</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                      type="text"
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent-blue/50 outline-none transition-all"
                      placeholder="e.g. Mumbai, Delhi..."
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Crime Category</label>
                  <select 
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-accent-blue/50 outline-none transition-all appearance-none"
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                    <option value="" className="bg-surface">All Categories</option>
                    <option value="Theft" className="bg-surface">Theft</option>
                    <option value="Assault" className="bg-surface">Assault</option>
                    <option value="Cyber Crime" className="bg-surface">Cyber Crime</option>
                    <option value="Drug Trafficking" className="bg-surface">Drug Trafficking</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => {
                    setFilters({ location: '', type: '', range: 'all' });
                    setIsFilterOpen(false);
                  }}
                  className="flex-1 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all font-bold"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 py-3 bg-accent-blue text-white rounded-xl hover:bg-accent-blue/80 transition-all font-bold"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Crimes" 
          value={stats?.total?.toLocaleString() || '0'} 
          icon={ShieldAlert} 
          trend={12.5} 
          color="bg-accent-red/20 text-accent-red" 
        />
        <DashboardCard 
          title="Hotspots Detected" 
          value={stats?.hotspots || '0'} 
          icon={MapPin} 
          trend={-4.2} 
          color="bg-accent-purple/20 text-accent-purple" 
        />
        <DashboardCard 
          title="Total Inhabitants" 
          value="1.4B" 
          icon={Users} 
          trend={2.1} 
          color="bg-accent-blue/20 text-accent-blue" 
        />
        <DashboardCard 
          title="Solved Cases" 
          value={stats?.solved?.toLocaleString() || '0'} 
          icon={CheckCircle2} 
          trend={8.7} 
          color="bg-accent-green/20 text-accent-green" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Crime Trend Analysis</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400">
               <div className="w-2 h-2 rounded-full bg-accent-blue"></div>
               Reports Over Time
            </div>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-500 animate-pulse">Loading Trends...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trends}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                  <XAxis dataKey="date" stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#718096" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161B29', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#3B82F6" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-xl font-bold mb-6">Crime Categories</h3>
          <div className="h-[300px] w-full">
             {loading ? (
                <div className="h-full flex items-center justify-center text-gray-500 animate-pulse">Analyzing...</div>
             ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="_id"
                  >
                    {distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161B29', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#718096' }} />
                </PieChart>
              </ResponsiveContainer>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
