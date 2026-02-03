import type { Course } from '../lib/filters';

export default function DegreeRemainingList({ courses }: { courses: Course[] }) {
  return (
    <div className="lg:col-span-7 xl:col-span-8 pt-4 lg:pt-0">
      <div className="lg:pl-12">
        <h2 className="text-2xl text-gray-700 mb-8 font-light">
          Remaining Required Courses in Your Degree
        </h2>

        <div className="relative bg-white border-t border-b lg:border border-gray-100 lg:rounded-xl lg:shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 bg-gray-50/50 text-sm font-bold text-gray-800">
            <div className="col-span-4">Course #</div>
            <div className="col-span-8">Name</div>
          </div>

          <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
            {courses.map((course) => (
              <div key={course.id} className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 items-center">
                <div className="col-span-4 font-medium text-gray-800">{course.code}</div>
                <div className="col-span-8 text-gray-700">{course.name}</div>
              </div>
            ))}

            <div className="h-6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
