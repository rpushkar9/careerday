export default function CareerCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row justify-between border rounded-2xl shadow-sm bg-white p-6 animate-pulse">
      {/* Left Content Skeleton */}
      <div className="flex-1">
        {/* Title */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
        
        {/* Description lines */}
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        
        {/* Majors */}
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        
        {/* Additional info */}
        <div className="flex gap-4 mt-3">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-32"></div>
        </div>
      </div>

      {/* Right Content Skeleton */}
      <div className="mt-4 md:mt-0 md:ml-6 p-4 rounded-xl w-full md:w-56" style={{ backgroundColor: '#e4e0f8' }}>
        <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto mb-4"></div>
        
        <div className="h-3 bg-gray-300 rounded w-3/4 mx-auto mb-2"></div>
        <div className="h-5 bg-gray-300 rounded w-2/3 mx-auto mb-4"></div>
        
        <div className="h-10 bg-gray-300 rounded-full w-full mt-4"></div>
      </div>
    </div>
  );
}