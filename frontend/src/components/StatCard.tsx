// components/StatCard.tsx
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  subtitle?: string;
  color: string;
}

export default function StatCard({ icon: Icon, title, value, subtitle, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all"
    >
      <div className="flex items-start gap-4">
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <div className="flex-1">
          <p className="text-gray-600 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-gray-500 text-sm">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}