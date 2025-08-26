import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-900">
          Generating your roadmap
        </h3>
        <p className="text-gray-500">This may take a few moments...</p>
      </div>
    </div>
  );
}
