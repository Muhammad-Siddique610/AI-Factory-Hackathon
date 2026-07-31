import { jsPDF } from "jspdf";

interface PredictionReport {
  id: string;
  originalImageUrl: string;
  maskUrl: string | null;
  floodPercentage: number;
  riskLevel: string;
  confidence: number;
  createdAt: string;
}

/**
 * Fetch an image from a URL and return it as a base64 data URL.
 */
async function imageUrlToBase64(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate a branded PDF report for a flood prediction result.
 */
export async function generatePdfReport(prediction: PredictionReport): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = margin;

  // ── Color palette ──
  const PRIMARY = [37, 99, 235]; // Blue
  const ACCENT = [14, 165, 233]; // Sky
  const DARK = [30, 41, 59];
  const MUTED = [148, 163, 184];
  const LIGHT_BG = [241, 245, 249];
  const WHITE = [255, 255, 255];

  const riskColors: Record<string, number[]> = {
    low: [34, 197, 94],
    medium: [234, 179, 8],
    high: [239, 68, 68],
    critical: [220, 38, 38],
  };
  const riskColor = riskColors[prediction.riskLevel] || MUTED;

  // ── Header bar ──
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, pageWidth, 38, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...WHITE);
  doc.text("FloodScope", margin, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("AI-Powered Flood Detection Report", margin, 26);

  y = 48;

  // ── Report title ──
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Flood Analysis Report", margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text(`Report ID: ${prediction.id}`, margin, y);
  y += 5;
  doc.text(`Date: ${new Date(prediction.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`, margin, y);
  y += 12;

  // ── Stats cards ──
  const cardW = (pageWidth - margin * 2 - 8 * 3) / 4;
  const cardH = 36;
  const stats = [
    { label: "Flood Area", value: `${prediction.floodPercentage.toFixed(1)}%`, color: ACCENT },
    { label: "Risk Level", value: prediction.riskLevel.toUpperCase(), color: riskColor },
    { label: "Confidence", value: `${prediction.confidence.toFixed(1)}%`, color: [34, 197, 94] },
    { label: "Status", value: "COMPLETE", color: [34, 197, 94] },
  ];

  stats.forEach((stat, i) => {
    const x = margin + i * (cardW + 8);

    // Card background
    doc.setFillColor(...LIGHT_BG);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, cardW, cardH, 3, 3, "FD");

    // Label
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MUTED);
    doc.text(stat.label, x + 3, y + 9);

    // Value
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...stat.color);
    doc.text(stat.value, x + 3, y + 21);

    // Accent line at top of card
    doc.setFillColor(...stat.color);
    doc.roundedRect(x, y, cardW, 2, 3, 3, "F");
  });

  y += cardH + 16;

  // ── Images section ──
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...DARK);
  doc.text("Image Analysis", margin, y);
  y += 10;

  // Load and embed original image
  try {
    const originalBase64 = await imageUrlToBase64(prediction.originalImageUrl);
    const imgW = pageWidth - margin * 2;
    const imgH = 80;

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MUTED);
    doc.text("ORIGINAL IMAGE", margin, y);
    y += 4;

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.addImage(originalBase64, "JPEG", margin, y, imgW, imgH);
    y += imgH + 12;

    // Mask image (if available)
    if (prediction.maskUrl) {
      // Check if new page needed
      if (y + 80 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        y = margin;
      }

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...MUTED);
      doc.text("FLOOD MASK OVERLAY", margin, y);
      y += 4;

      const maskBase64 = await imageUrlToBase64(prediction.maskUrl);
      doc.addImage(maskBase64, "PNG", margin, y, imgW, imgH);
      y += imgH + 10;
    }
  } catch {
    // If images fail to load, show a note
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MUTED);
    doc.text("Image data unavailable for this report.", margin, y);
    y += 10;
  }

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 14;
  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, footerY - 4, pageWidth, 18, "F");

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text(
    "Generated by FloodScope — AI-powered flood detection and analysis",
    margin,
    footerY + 2
  );
  doc.text(
    `Page 1/1`,
    pageWidth - margin,
    footerY + 2,
    { align: "right" }
  );

  // ── Save ──
  const safeDate = new Date(prediction.createdAt)
    .toISOString()
    .split("T")[0];
  doc.save(`FloodScope_Report_${safeDate}.pdf`);
}
