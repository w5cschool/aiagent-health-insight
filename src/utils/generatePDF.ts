import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const generatePDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) return;

  // Add print-specific styles
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      #report-content {
        padding: 30mm 20mm !important;
        background-color: white !important;
      }
      
      /* Improved header styling */
      .bg-gradient-to-r {
        background: linear-gradient(to right, #1e40af, #2563eb) !important;
        padding: 1.5rem !important;
        border-radius: 8px !important;
        margin-bottom: 2rem !important;
      }
      
      /* Better text contrast */
      .text-blue-100 {
        color: #e5e7eb !important;
      }
      
      /* Enhanced diagnosis box */
      .bg-blue-50 {
        background-color: #f0f7ff !important;
        border: 2px solid #bfdbfe !important;
        border-radius: 8px !important;
        padding: 1.5rem !important;
        margin: 1.5rem 0 !important;
      }
      
      /* Improved typography */
      h1 {
        font-size: 24px !important;
        margin-bottom: 0.5rem !important;
      }
      
      h2 {
        font-size: 20px !important;
        color: #1e40af !important;
        margin-bottom: 1rem !important;
      }
      
      p {
        line-height: 1.6 !important;
        margin-bottom: 0.5rem !important;
      }
      
      /* Better spacing */
      .space-y-4 {
        margin-top: 1rem !important;
      }
      
      /* Clean up shadows and borders */
      .shadow-lg, .shadow-sm {
        box-shadow: none !important;
      }
      
      /* Report details styling */
      dl {
        margin-top: 2rem !important;
        padding-top: 1rem !important;
        border-top: 1px solid #e5e7eb !important;
      }
      
      dt {
        color: #6b7280 !important;
        font-size: 0.875rem !important;
      }
      
      dd {
        color: #111827 !important;
        font-size: 0.875rem !important;
        margin-top: 0.25rem !important;
      }
      
      /* Remove unnecessary backgrounds */
      .bg-white {
        background-color: transparent !important;
      }
      
      /* Page break control */
      .print-break {
        page-break-before: always !important;
      }
    }
  `;
  document.head.appendChild(style);

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
    onclone: (clonedDoc) => {
      const clonedElement = clonedDoc.getElementById(elementId);
      if (clonedElement) {
        clonedElement.style.padding = "30mm 20mm";
      }
    },
  });

  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 0; // Removed margins since we handle them in CSS

  const imgWidth = pageWidth - 2 * margin;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // First page
  pdf.addImage(imgData, "PNG", margin, margin, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Additional pages if needed
  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  // Cleanup
  document.head.removeChild(style);

  pdf.save(`${filename}.pdf`);
};
