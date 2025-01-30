/**
 * Medical Diagnosis Analysis API Route
 *
 * This route handles the processing of patient data through multiple specialist AIs
 * and generates a comprehensive medical report.
 */

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { Groq } from "groq-sdk";

// Initialize GROQ client with API key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Specialist prompt templates
 * Each template defines the role and focus areas for different medical specialists
 */
const SPECIALIST_PROMPTS = {
  cardiologist: `You are an expert cardiologist with extensive experience in cardiovascular medicine.
    
    Focus your analysis on:
    - Heart rhythm and rate
    - Blood pressure patterns
    - Chest pain characteristics
    - Cardiovascular risk factors
    - ECG interpretations
    - Exercise tolerance
    - Circulation issues
    
    Consider common cardiac conditions such as:
    - Coronary artery disease
    - Arrhythmias
    - Heart failure
    - Hypertension
    - Valve disorders
    
    Provide specific cardiac-focused insights and note any concerning symptoms that require immediate attention.`,

  pulmonologist: `You are an expert pulmonologist specializing in respiratory medicine.
    
    Focus your analysis on:
    - Breathing patterns
    - Respiratory rate
    - Shortness of breath
    - Cough characteristics
    - Oxygen saturation
    - Lung sounds
    - Exercise capacity
    
    Consider common respiratory conditions such as:
    - Asthma
    - COPD
    - Bronchitis
    - Pneumonia
    - Sleep apnea
    - Pulmonary embolism
    
    Evaluate respiratory symptoms and their relationship to other systemic conditions.
    Note any concerning respiratory patterns that require immediate attention.`,

  psychologist: `You are an expert psychologist specializing in behavioral health and mental disorders.
    
    Focus your analysis on:
    - Anxiety and depression symptoms
    - Panic attack patterns
    - Stress-related manifestations
    - Sleep disturbances
    - Behavioral changes
    - Cognitive function
    - Social interactions
    
    Consider common psychological conditions such as:
    - Anxiety disorders
    - Depression
    - Panic disorder
    - PTSD
    - Somatization disorders
    
    Evaluate how psychological factors might be contributing to or affected by physical symptoms.
    Provide insights into the mental health aspects of the patient's condition.`,
};

/**
 * POST handler for medical analysis
 * @param req - Request object containing patient data
 * @returns JSON response with report ID or error details
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Run specialist analyses in parallel for efficiency
    const [cardioAnalysis, pulmoAnalysis, psychAnalysis] = await Promise.all([
      generateSpecialtyAnalysis(data, SPECIALIST_PROMPTS.cardiologist),
      generateSpecialtyAnalysis(data, SPECIALIST_PROMPTS.pulmonologist),
      generateSpecialtyAnalysis(data, SPECIALIST_PROMPTS.psychologist),
    ]);

    // Generate final comprehensive diagnosis
    const finalDiagnosis = await generateSpecialtyAnalysis(
      data,
      `You are an expert medical diagnostician.
      
      Review and synthesize these specialty analyses:
      Cardiology: ${cardioAnalysis}
      Pulmonology: ${pulmoAnalysis}
      Psychology: ${psychAnalysis}

      Provide a comprehensive final diagnosis that:
      1. Identifies primary conditions
      2. Notes interactions between different systems
      3. Highlights key concerns
      4. Recommends next steps
      Format your response as a clear clinical assessment.`
    );

    // Store the complete report in Firestore
    const reportRef = await addDoc(collection(db, "reports"), {
      patient_id: data.patient_id,
      cardiologist_analysis: cardioAnalysis || "",
      pulmonologist_analysis: pulmoAnalysis || "",
      psychologist_analysis: psychAnalysis || "",
      final_diagnosis: finalDiagnosis || "",
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      report_id: reportRef.id,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    return NextResponse.json(
      {
        error: "Analysis failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * Generates a specialist analysis using GROQ AI
 * @param data - Patient data to analyze
 * @param systemPrompt - Specialist-specific prompt template
 * @returns Analysis text from the AI model
 */
async function generateSpecialtyAnalysis(data: any, systemPrompt: string) {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `Analyze this patient data: ${JSON.stringify(data)}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content;
}
