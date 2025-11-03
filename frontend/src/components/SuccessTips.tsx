// components/SuccessTips.tsx
import { motion } from 'framer-motion';
import { Lightbulb, Users, Clock, Target, BookOpen, Star } from 'lucide-react';

export default function SuccessTips() {
  const tips = [
    {
      icon: Clock,
      title: 'Time Management',
      description:
        'Use a planner to track assignments and create a study schedule that works for you.',
      color: '#f59e0b',
    },
    {
      icon: Users,
      title: 'Build Connections',
      description:
        'Join study groups, attend office hours, and connect with peers in your major.',
      color: '#10b981',
    },
    {
      icon: Target,
      title: 'Set Goals',
      description:
        'Break down big objectives into smaller, achievable milestones each semester.',
      color: '#6d6bd3',
    },
    {
      icon: BookOpen,
      title: 'Stay Organized',
      description:
        'Keep track of syllabi, notes, and resources using digital or physical organization systems.',
      color: '#06b6d4',
    },
    {
      icon: Star,
      title: 'Seek Help Early',
      description:
        "Don't wait until you're struggling - utilize tutoring, academic support, and professor office hours.",
      color: '#ec4899',
    },
    {
      icon: Lightbulb,
      title: 'Balance is Key',
      description:
        'Make time for self-care, hobbies, and social activities alongside your studies.',
      color: '#8b5cf6',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg p-8 mb-12 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-amber-100 rounded-xl">
          <Lightbulb className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tips for Success</h2>
          <p className="text-gray-600">Make the most of your first year</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + idx * 0.1 }}
            className="p-5 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div
              className="p-3 rounded-lg w-fit mb-3"
              style={{ backgroundColor: `${tip.color}15` }}
            >
              <tip.icon className="w-5 h-5" style={{ color: tip.color }} />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
            <p className="text-gray-600 text-sm">{tip.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
