import jsPDF from "jspdf";

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // Set font
  pdf.setFont("helvetica");

  // Page dimensions
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const usableWidth = pageWidth - 2 * margin;

  // Starting position
  let yPosition = 20;

  // Add header
  pdf.setFontSize(24);
  pdf.setTextColor(29, 64, 175); // blue-600
  pdf.text("Medical Diagnosis Report", margin, yPosition);
  yPosition += 10;

  // Add date
  const dateElement = element.querySelector(".text-sm");
  if (dateElement) {
    pdf.setFontSize(12);
    pdf.setTextColor(107, 114, 128); // gray-500
    pdf.text(dateElement.textContent || "", margin, yPosition);
  }
  yPosition += 15;

  // Add medical analysis
  pdf.setFontSize(18);
  pdf.setTextColor(31, 41, 55); // gray-900
  pdf.text("Medical Analysis", margin, yPosition);
  yPosition += 10;

  // Add diagnosis content
  const diagnosisContent = element.querySelectorAll(".text-gray-700");
  pdf.setFontSize(12);
  pdf.setTextColor(55, 65, 81); // gray-700

  diagnosisContent.forEach((content) => {
    const text = content.textContent || "";
    const lines = pdf.splitTextToSize(text, usableWidth);

    lines.forEach((line: string) => {
      if (yPosition > 270) {
        // Check if we need a new page
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    });
  });

  // Add report details
  yPosition += 10;
  pdf.setFontSize(14);
  pdf.setTextColor(31, 41, 55); // gray-900
  pdf.text("Report Details", margin, yPosition);
  yPosition += 10;

  // Add IDs
  const reportId = element.querySelector(".font-mono")?.textContent;
  const patientId = element.querySelectorAll(".font-mono")[1]?.textContent;

  pdf.setFontSize(10);
  pdf.text(`Report ID: ${reportId || ""}`, margin, yPosition);
  pdf.text(
    `Patient ID: ${patientId || ""}`,
    pageWidth - margin - 60,
    yPosition
  );
  yPosition += 15;

  // Add footer
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128); // gray-500
  pdf.text("Disclaimer: This is an AI-generated report.", margin, yPosition);
  yPosition += 5;
  pdf.text("Created by Harsh Gajjar", margin, yPosition);
  yPosition += 10;

  // Add clickable links
  const linkY = yPosition;
  const linkSpacing = 30;

  pdf.setTextColor(75, 85, 99); // gray-600
  pdf.link(margin, linkY - 5, 20, 5, { url: "https://github.com/harshhh28" });
  pdf.text("GitHub", margin, linkY);

  pdf.link(margin + linkSpacing, linkY - 5, 30, 5, {
    url: "https://linkedin.com/in/harsh-gajjar-936536209",
  });
  pdf.text("LinkedIn", margin + linkSpacing, linkY);

  pdf.link(margin + linkSpacing * 2, linkY - 5, 25, 5, {
    url: "https://twitter.com/harshgajjar_28",
  });
  pdf.text("Twitter", margin + linkSpacing * 2, linkY);

  pdf.save(`${filename}.pdf`);
};
