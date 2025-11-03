// 'use client';

// import { Button } from '@/components/ui/button';

// interface CareerCardProps {
//   title: string;
//   description: string;
//   majors: string[];
//   income: string;
//   education: string;
// }

// export default function CareerCard({
//   title,
//   description,
//   majors,
//   income,
//   education,
// }: CareerCardProps) {
//   return (
//     <div className="flex flex-col md:flex-row justify-between border rounded-2xl shadow-sm bg-white p-6 transition hover:shadow-md">
//       {/* Left Content */}
//       <div className="flex-1">
//         <h2 className="text-xl font-bold text-gray-900">{title}</h2>
//         <p className="text-gray-600 mt-2 mb-3">{description}</p>
//         <p className="text-sm">
//           <span className="font-semibold text-gray-800">Majors:</span>{' '}
//           {majors.join(', ')}
//         </p>
//       </div>

//       {/* Right Content */}
//       <div
//         className="mt-4 md:mt-0 md:ml-6 p-4 rounded-xl text-center w-full md:w-56"
//         style={{ backgroundColor: '#e4e0f8' }} // light purple background
//       >
//         <p className="text-sm text-gray-600">Median Yearly Income</p>
//         <p className="text-lg font-bold text-gray-900">{income}</p>
//         <p className="text-sm text-gray-600 mt-3">Most Common Education</p>
//         <p className="font-bold text-gray-900">{education}</p>
//         <Button
//           className="mt-4 w-full font-medium text-white rounded-full shadow-sm transition"
//           style={{ backgroundColor: '#6d6bd3' }}
//           onMouseEnter={e =>
//             (e.currentTarget.style.backgroundColor = '#5b59c0')
//           }
//           onMouseLeave={e =>
//             (e.currentTarget.style.backgroundColor = '#6d6bd3')
//           }
//         >
//           Learn More
//         </Button>
//       </div>
//     </div>
//   );
// }

'use client';

import { Button } from '@/components/ui/button';

interface CareerCardProps {
  title: string;
  description: string;
  majors: string[];
  income: string;
  education: string;
  soc_code?: string;
  growth?: string;
  employment?: string;
}

export default function CareerCard({
  title,
  description,
  majors,
  income,
  education,
  soc_code,
  growth,
  employment,
}: CareerCardProps) {
  const handleLearnMore = () => {
    // Open O*NET page
    if (soc_code) {
      window.open(
        `https://www.onetonline.org/link/summary/${soc_code}`,
        '_blank'
      );
    } else {
      window.open(
        `https://www.onetonline.org/find/quick?s=${encodeURIComponent(title)}`,
        '_blank'
      );
    }
  };

  const formatIncome = (income: string) => {
    if (!income || income === 'N/A') return 'Not Available';
    return income;
  };

  const formatGrowth = (growth: string) => {
    if (!growth || growth === 'N/A') return '';
    return growth;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between border rounded-2xl shadow-sm bg-white p-6 transition hover:shadow-md">
      {/* Left Content */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <p className="text-gray-600 mt-2 mb-3 line-clamp-3">{description}</p>
        <p className="text-sm mb-2">
          <span className="font-semibold text-gray-800">Majors:</span>{' '}
          {majors.join(', ')}
        </p>

        {/* Additional Info */}
        <div className="flex gap-4 text-sm text-gray-600 mt-3">
          {growth && growth !== 'N/A' && (
            <div>
              <span className="font-semibold">Growth:</span>{' '}
              {formatGrowth(growth)}
            </div>
          )}
          {employment && employment !== 'N/A' && (
            <div>
              <span className="font-semibold">Jobs (2023):</span>{' '}
              {employment.toLocaleString()}
            </div>
          )}
        </div>

        {soc_code && (
          <p className="text-xs text-gray-400 mt-2">SOC Code: {soc_code}</p>
        )}
      </div>

      {/* Right Content */}
      <div
        className="mt-4 md:mt-0 md:ml-6 p-4 rounded-xl text-center w-full md:w-56 flex flex-col justify-between"
        style={{ backgroundColor: '#e4e0f8' }}
      >
        <div>
          <p className="text-sm text-gray-600">Median Yearly Income</p>
          <p className="text-lg font-bold text-gray-900">
            {formatIncome(income)}
          </p>
          <p className="text-sm text-gray-600 mt-3">Most Common Education</p>
          <p className="font-bold text-gray-900 text-sm">{education}</p>
        </div>

        <Button
          onClick={handleLearnMore}
          className="mt-4 w-full font-medium text-white rounded-full shadow-sm transition"
          style={{ backgroundColor: '#6d6bd3' }}
          onMouseEnter={e =>
            (e.currentTarget.style.backgroundColor = '#5b59c0')
          }
          onMouseLeave={e =>
            (e.currentTarget.style.backgroundColor = '#6d6bd3')
          }
        >
          Learn More
        </Button>
      </div>
    </div>
  );
}
