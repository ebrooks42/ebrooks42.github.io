import type { Course } from '../lib/filters';

export default function Results({ results, onBack }: { results: Course[]; onBack: () => void }) {
  return (
    <div className="max-w-7xl mx-auto px-6 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-light text-gray-800 tracking-tight">Search Results</h1>
        <button onClick={onBack} className="py-3 px-3 border border-purple-400 text-purple-700 rounded-lg hover:bg-purple-50 font-medium transition-colors">Back to Search</button>
      </div>

      <div className="relative bg-white border-t border-b lg:border border-gray-100 lg:rounded-xl lg:shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50 text-sm font-bold text-gray-800">
          <div className="col-span-3">Course #</div>
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Meeting Time</div>
          <div className="col-span-2">Status</div>
        </div>

        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          {results.map((course) => (
            <div key={course.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center">
              <div className="col-span-3 font-medium text-gray-800">{course.code}</div>
              <div className="col-span-5 text-gray-700">{course.name}</div>
              <div className="col-span-2 text-gray-600 font-medium text-sm">{course.schedule}</div>
              <div className="col-span-2 text-sm font-medium text-gray-700">{course.isOpen ? 'Open' : 'Closed'}</div>
            </div>
          ))}

          <div className="h-6"></div>
        </div>
      </div>
    </div>
  );
}
