"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { DiagnosisReport } from "@/types";
import { notFound } from "next/navigation";
import { generatePDF } from "@/utils/generatePDF";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ReportPage({ params }: PageProps) {
  const [report, setReport] = useState<DiagnosisReport | null>(null);
  const [loading, setLoading] = useState(true);

  const handleDownloadPDF = async () => {
    if (!report) return;
    await generatePDF("report-content", `medical-report-${report.id}`);
  };

  useEffect(() => {
    const fetchReport = async () => {
      const { id } = await params;
      const reportRef = doc(db, "reports", id);
      const reportSnap = await getDoc(reportRef);

      if (!reportSnap.exists()) {
        notFound();
      }

      const data = reportSnap.data();
      const reportWithDate = {
        ...data,
        id: reportSnap.id,
        created_at: data.created_at?.toDate(),
      } as DiagnosisReport;

      setReport(reportWithDate);
      setLoading(false);
    };

    fetchReport();
  }, [params]);

  if (loading || !report) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const formatDiagnosisText = (text: string) => {
    return text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line) => line.replace(/[\*]+\s*/g, "").trim());
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PDF
          </button>
        </div>

        <div
          id="report-content"
          className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-6 text-white">
            <h1 className="text-2xl font-bold mb-2">
              Medical Diagnosis Report
            </h1>
            <p className="text-sm">
              Generated on{" "}
              {report.created_at.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              at{" "}
              {report.created_at.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>

          <div className="space-y-6 p-6">
            {/* Final Diagnosis Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <svg
                  className="w-5 h-5 text-blue-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h2 className="text-xl font-semibold text-gray-900">
                  Medical Analysis
                </h2>
              </div>
              <div className="space-y-4">
                {formatDiagnosisText(report.final_diagnosis).map(
                  (text, index) => {
                    // Check if the line is a heading (ends with ':')
                    if (text.endsWith(":")) {
                      return (
                        <h3
                          key={index}
                          className="text-lg font-semibold text-gray-900 mt-6 first:mt-0">
                          {text.slice(0, -1)} {/* Remove the colon */}
                        </h3>
                      );
                    }
                    return (
                      <p key={index} className="text-gray-700">
                        {text}
                      </p>
                    );
                  }
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  Report Details
                </span>
              </div>
            </div>

            {/* Report Details */}
            <div className="w-full">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500">Report ID</p>
                  <p className="text-sm font-mono text-gray-600">{report.id}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500">Patient ID</p>
                  <p className="text-sm font-mono text-gray-600">
                    {report.patient_id}
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 italic">
                  Disclaimer: This is an AI-generated report.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Created by Harsh Gajjar
                </p>
                <div className="flex justify-center space-x-4 mt-2">
                  <a
                    href="https://github.com/harshhh28"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600">
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/harsh-gajjar-936536209"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600">
                    LinkedIn
                  </a>
                  <a
                    href="https://twitter.com/harshgajjar_28"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-gray-600">
                    Twitter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
