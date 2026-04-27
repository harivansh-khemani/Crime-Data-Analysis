import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, BarChart3, Map, Zap, Globe, Search } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="h-20 px-8 flex items-center justify-between border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-accent-blue p-2 rounded-xl">
            <ShieldAlert size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter italic">Crimify</span>
        </div>
        <div className="flex items-center gap-8">
          <Link to="/login" className="text-sm font-medium hover:text-accent-blue transition-colors">Sign In</Link>
          <Link to="/signup" className="primary-button text-sm">Join the Network</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-blue/5 blur-[120px] rounded-full -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent-purple/5 blur-[100px] rounded-full -z-10"></div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-semibold text-accent-blue uppercase tracking-widest">
            <Zap size={14} className="fill-accent-blue" />
            Empowering Public Safety with Data
          </div>
          <h1 className="text-7xl lg:text-8xl font-bold tracking-tight leading-[0.9] italic">
            Predict. Prevent. <br />
            <span className="text-accent-blue">Protect.</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Crimify is the next-generation crime intelligence platform. Levering advanced machine learning and real-time big data analytics to decode urban crime patterns.
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <Link to="/signup" className="primary-button text-lg px-10 py-4">Explore Dashboard</Link>
            <Link to="/about" className="secondary-button text-lg px-10 py-4">How it works</Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="p-24 bg-surface/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <FeatureCard 
            icon={BarChart3} 
            title="Real-time Analytics" 
            desc="Process millions of crime records instantly to uncover hidden trends and seasonal cycles."
            color="bg-accent-blue"
          />
          <FeatureCard 
            icon={Map} 
            title="Spatial Hotspots" 
            desc="Dynamic heatmaps and DBSCAN clustering identify dangerous zones with surgical precision."
            color="bg-accent-purple"
          />
          <FeatureCard 
            icon={Globe} 
            title="Predictive Models" 
            desc="AI-driven forecasting models predict future crime spikes before they happen."
            color="bg-accent-green"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="p-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2026 Crimify Intelligence Systems. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color }) => (
  <div className="space-y-4 group">
    <div className={`${color} w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl shadow-white/5`}>
      <Icon size={28} className="text-white" />
    </div>
    <h3 className="text-2xl font-bold italic">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
