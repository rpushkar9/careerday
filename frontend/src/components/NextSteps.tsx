// components/NextSteps.tsx
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function NextSteps() {
  const steps = [
    {
      title: 'Register for Classes',
      description:
        'Use your university portal to enroll in the courses listed above',
      status: 'upcoming',
    },
    {
      title: 'Attend Orientation',
      description:
        'Learn about campus resources, meet fellow students, and get oriented',
      status: 'upcoming',
    },
    {
      title: 'Connect with Advisor',
      description: 'Schedule a meeting to review your plan and ask questions',
      status: 'upcoming',
    },
    {
      title: 'Join Student Organizations',
      description: 'Explore clubs related to your major and interests',
      status: 'upcoming',
    },
    {
      title: 'Set Up Study Space',
      description: 'Create an organized environment for focused learning',
      status: 'upcoming',
    },
    {
      title: 'Review Financial Aid',
      description:
        'Ensure all paperwork is complete and understand your aid package',
      status: 'upcoming',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-green-100 rounded-xl">
          <CheckCircle2 className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Next Steps</h2>
          <p className="text-gray-600">Action items to prepare for Year 1</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + idx * 0.05 }}
            className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors group"
          >
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-[#6d6bd3]/10 border-2 border-[#6d6bd3] flex items-center justify-center">
                <span className="text-[#6d6bd3] font-bold text-sm">
                  {idx + 1}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1 group-hover:text-[#6d6bd3] transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-[#6d6bd3] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
