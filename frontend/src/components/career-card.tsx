import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BriefcaseIcon } from 'lucide-react';

interface CareerCardProps {
  id: string;
  title: string;
  description: string;
  income?: string;
  growth?: string;
}

export default function CareerCard({
  id,
  title,
  description,
  income = 'Not Available',
  growth = 'Not Available',
}: CareerCardProps) {
  return (
    <div className="w-full border rounded-lg p-6 mb-4 bg-white shadow-sm">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start space-x-3">
          <div className="bg-amber-100 p-2 rounded-md">
            <BriefcaseIcon className="h-6 w-6 text-amber-800" />
          </div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>

        <p className="text-gray-600">{description}</p>

        <div className="flex flex-col space-y-1 md:space-y-0 md:flex-row md:justify-between md:items-center mt-4">
          <div className="flex flex-col text-right">
            <span className="text-gray-700 font-medium">
              Median Yearly Income:
            </span>
            <span className="text-gray-700">{income}</span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-gray-700 font-medium">
              Projected Job Growth:
            </span>
            <span className="text-gray-700">{growth}</span>
          </div>
        </div>

        <div className="flex justify-end mt-2">
          <Link href={`/roadmap/${id}`}>
            <Button className="bg-indigo-500 hover:bg-indigo-600">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
