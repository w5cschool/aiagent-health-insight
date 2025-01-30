import MedicalForm from "@/components/MedicalForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 sm:py-12">
      <div className="max-w-[95%] sm:max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Medical Diagnosis System
          </h1>
          <p className="mt-2 text-base sm:text-lg text-gray-700">
            Enter patient information for AI-powered diagnosis
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8">
          <MedicalForm />
        </div>
      </div>
    </div>
  );
}
