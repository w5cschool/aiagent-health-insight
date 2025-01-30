"use client";

export default function Error() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Error Loading Report
          </h2>
          <p className="mt-2 text-gray-600">
            There was an error loading the medical report. Please try again
            later.
          </p>
        </div>
      </div>
    </div>
  );
}
