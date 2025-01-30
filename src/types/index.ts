export interface VitalSigns {
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  temperature: number;
}

export interface PatientData {
  id?: string;
  patient_name: string;
  age: number;
  gender: "male" | "female" | "other";
  symptoms: string[];
  vital_signs: VitalSigns;
  medical_history?: string;
  created_at?: Date;
}

export interface DiagnosisReport {
  id: string;
  patient_id: string;
  cardiologist_analysis: string;
  pulmonologist_analysis: string;
  psychologist_analysis: string;
  final_diagnosis: string;
  created_at: Date;
}
