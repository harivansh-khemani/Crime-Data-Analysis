import { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, MapPin, Zap } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';

const Analytics = () => {
  const [insights, setInsights] = useState(null);
  const [sparkInsights, setSparkInsights] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loadingAI, setLoadingAI] = useState(true);
  const [loadingSpark, setLoadingSpark] = useState(true);

  useEffect(() => {
    fetchAI();
    fetchSpark();
  }, []);

  const fetchAI = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [insightsRes, trendsRes] = await Promise.all([
        axios.get('/api/analytics/insights', { headers }),
        axios.get('/api/analytics/trends', { headers })
      ]);
      setInsights(insightsRes.data.data);
      setTrends(trendsRes.data.data);
    } catch (err) {
      console.error('AI Analysis Error:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const fetchSpark = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.get('/api/analytics/spark-insights', { headers });
      setSparkInsights(res.data.data);
    } catch (err) {
      console.error('Spark Error:', err);
    } finally {
      setLoadingSpark(false);
    }
  };

  return (
    <div className="space-y-8 fade-in">
      <div>
        <h2 className="text-3xl font-bold flex items-center gap-3 italic">
          <Brain className="text-accent-purple" size={32} />
          AI Analytics Engine
        </h2>
        <p className="text-gray-400 mt-1">Predictive models and spatial clustering insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 border-accent-blue/20 bg-accent-blue/5">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-accent-blue" />
            Crime Forecast (Next 6 Months)
          </h3>
          <div className="h-[300px]">
            {loadingAI ? (
              <div className="h-full flex items-center justify-center text-gray-500 animate-pulse">Running AI Forecast...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={insights?.predictions}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                  <XAxis dataKey="date" stroke="#718096" fontSize={10} />
                  <YAxis stroke="#718096" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161B29', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-card p-6 border-accent-purple/20 bg-accent-purple/5">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-accent-purple" />
            Hotspot Intensity (DBSCAN Clusters)
          </h3>
          <div className="h-[300px]">
            {loadingAI ? (
              <div className="h-full flex items-center justify-center text-gray-500 animate-pulse">Analyzing Spatial Data...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights?.hotspots?.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" vertical={false} />
                  <XAxis dataKey="type" stroke="#718096" fontSize={10} />
                  <YAxis stroke="#718096" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#161B29', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="glass-card p-8 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Zap size={24} className="text-accent-blue animate-pulse" />
          Big Data (PySpark) Processing Results
        </h3>
        {loadingSpark ? (
           <div className="h-[200px] flex flex-col items-center justify-center text-gray-500 gap-3">
              <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs animate-pulse">Initializing Spark Engine & Processing Indian Dataset...</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider font-bold mb-4">Most Affected Districts (Spark Aggregation)</p>
              <div className="space-y-3">
                {sparkInsights?.districts?.slice(0, 5).map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-accent-blue/50 transition-colors">
                    <span className="font-medium">{d.district}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 text-xs">{d.crime_count} incidents</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] ${d.avg_severity > 3 ? 'bg-accent-red/20 text-accent-red' : 'bg-accent-blue/20 text-accent-blue'}`}>
                        Severity: {d.avg_severity.toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
               <div className="p-4 bg-accent-blue/10 rounded-xl border border-accent-blue/20">
                  <p className="text-sm font-bold text-accent-blue uppercase mb-2">Cluster Center Insights</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    PySpark K-Means identified {sparkInsights?.hotspots?.length || 0} primary hotspots across the subcontinent. 
                    Targeted patrolling in {sparkInsights?.districts?.[0]?.district || 'monitored areas'} is recommended based on high crime density and severity scores.
                  </p>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                     <p className="text-2xl font-bold">{sparkInsights?.distribution?.length || 0}</p>
                     <p className="text-[10px] text-gray-500 uppercase">Categories Tracked</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                     <p className="text-2xl font-bold">Spark 3.5</p>
                     <p className="text-[10px] text-gray-500 uppercase">Engine Version</p>
                  </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
