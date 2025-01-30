"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const symptomsList = [
  "fatigue",
  "shortness of breath",
  "chest pain",
  "anxiety",
  "depression",
  "cough",
  "fever",
  "headache",
  "weight gain",
  "weight loss",
] as const;

const formSchema = z.object({
  patient_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]*$/, "Name can only contain letters and spaces"),

  age: z
    .number()
    .min(0, "Age must be positive")
    .max(120, "Age must be less than 120")
    .int("Age must be a whole number"),

  gender: z.enum(["male", "female", "other"], {
    required_error: "Please select a gender",
  }),

  symptoms: z
    .array(z.string())
    .min(1, "Select at least one symptom")
    .max(5, "Maximum 5 symptoms can be selected"),

  vital_signs: z.object({
    blood_pressure_systolic: z
      .number()
      .min(70, "Systolic pressure must be at least 70")
      .max(200, "Systolic pressure must be less than 200")
      .int("Must be a whole number")
      .nonnegative("Cannot be negative"),

    blood_pressure_diastolic: z
      .number()
      .min(40, "Diastolic pressure must be at least 40")
      .max(130, "Diastolic pressure must be less than 130")
      .int("Must be a whole number")
      .nonnegative("Cannot be negative"),

    heart_rate: z
      .number()
      .min(40, "Heart rate must be at least 40 bpm")
      .max(200, "Heart rate must be less than 200 bpm")
      .int("Must be a whole number")
      .nonnegative("Cannot be negative"),

    temperature: z
      .number()
      .min(95, "Temperature must be at least 95°F")
      .max(105, "Temperature must be less than 105°F")
      .multipleOf(0.1, "Temperature must have at most 1 decimal place")
      .nonnegative("Cannot be negative"),
  }),

  medical_history: z
    .string()
    .max(1000, "Medical history must be less than 1000 characters")
    .optional()
    .transform((val) => (val === "" ? null : val)),
});

type FormData = z.infer<typeof formSchema>;

export default function MedicalForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    delayError: 500,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Clean up the data before submission
      const submissionData = {
        ...data,
        medical_history: data.medical_history || null, // Ensure null instead of undefined
        created_at: new Date(),
      };

      const docRef = await addDoc(collection(db, "patients"), submissionData);

      // Trigger the analysis
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_id: docRef.id, ...submissionData }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.details || "Analysis failed");
      }

      router.push(`/reports/${result.report_id}`);
    } catch (error) {
      console.error("Error:", error);
      // You might want to add some UI feedback here for the error
      alert("An error occurred while processing the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="space-y-6">
        {/* Patient Name */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Patient Name
          </label>
          <input
            type="text"
            {...register("patient_name")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter patient name"
          />
          {errors.patient_name && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {errors.patient_name.message}
            </p>
          )}
        </div>

        {/* Age and Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Age</label>
            <input
              type="number"
              {...register("age", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter age"
            />
            {errors.age && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {errors.age.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Gender</label>
            <select
              {...register("gender")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="mt-2 text-sm text-red-600 font-medium">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>

        {/* Symptoms */}
        <div>
          <label className="block text-sm font-semibold mb-2">Symptoms</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
            {symptomsList.map((symptom) => (
              <label
                key={symptom}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded cursor-pointer">
                <input
                  type="checkbox"
                  {...register("symptoms")}
                  value={symptom}
                  className="h-5 w-5 rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700">
                  {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                </span>
              </label>
            ))}
          </div>
          {errors.symptoms && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {errors.symptoms.message}
            </p>
          )}
        </div>

        {/* Vital Signs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Vital Signs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Pressure */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Blood Pressure (Systolic)
                </label>
                <input
                  type="number"
                  {...register("vital_signs.blood_pressure_systolic", {
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter systolic (e.g., 120)"
                />
                {errors.vital_signs?.blood_pressure_systolic && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.vital_signs.blood_pressure_systolic.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Blood Pressure (Diastolic)
                </label>
                <input
                  type="number"
                  {...register("vital_signs.blood_pressure_diastolic", {
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter diastolic (e.g., 80)"
                />
                {errors.vital_signs?.blood_pressure_diastolic && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.vital_signs.blood_pressure_diastolic.message}
                  </p>
                )}
              </div>
            </div>

            {/* Heart Rate and Temperature */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  {...register("vital_signs.heart_rate", {
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter heart rate"
                />
                {errors.vital_signs?.heart_rate && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.vital_signs.heart_rate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("vital_signs.temperature", {
                    valueAsNumber: true,
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter temperature"
                />
                {errors.vital_signs?.temperature && (
                  <p className="mt-2 text-sm text-red-600 font-medium">
                    {errors.vital_signs.temperature.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Medical History
          </label>
          <textarea
            {...register("medical_history")}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any relevant medical history... (optional)"
          />
          {errors.medical_history && (
            <p className="mt-2 text-sm text-red-600 font-medium">
              {errors.medical_history.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-sm flex items-center justify-center space-x-2">
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing...</span>
          </>
        ) : (
          "Submit Medical Report"
        )}
      </button>

      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-lg font-semibold text-gray-900">
              Analyzing patient data...
            </p>
          </div>
        </div>
      )}
    </form>
  );
}
