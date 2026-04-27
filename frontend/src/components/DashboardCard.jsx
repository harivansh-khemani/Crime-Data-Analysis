import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

const DashboardCard = ({ title, value, icon: Icon, trend, color }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <div className={clsx("p-3 rounded-xl", color)}>
          <Icon size={24} className="text-white" />
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center gap-1 text-sm font-medium",
            trend > 0 ? "text-accent-green" : "text-accent-red"
          )}>
            {trend > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-1">{value}</h3>
      </div>
    </motion.div>
  );
};

export default DashboardCard;
