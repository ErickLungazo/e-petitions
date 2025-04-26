import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";

interface Petitioner {
  id?: string;
  name: string;
  address: string;
  phone: string;
  nationalId: string;
}

interface PetitionFormData {
  petitionerIdentification: string;
  grievances: string;
  priorEffortsConfirmation: boolean;
  legalStatusConfirmation: boolean;
  prayer: string;
  petitioners: Petitioner[];
}

/**
 * Generates a PDF document representing the petition form data using Times New Roman font.
 * @param petitionData - The petition data object.
 * @param filename - Optional filename for the downloaded PDF.
 */
export const exportPetitionToPDF = (
  petitionData: PetitionFormData,
  filename: string = "petition.pdf",
): void => {
  // --- PDF Initialization ---
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  // --- Document Styling & Variables ---
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  const lineSpacing = 6;
  let currentY = margin;

  doc.setFont("times", "normal");
  doc.setTextColor(0, 0, 0);

  // --- Helper Function for Adding Text with Wrapping ---
  const addWrappedText = (
    text: string | undefined | null,
    x: number,
    y: number,
    options?: {
      maxWidth?: number;
      align?: "left" | "center" | "right";
      fontSize?: number;
      fontStyle?: "normal" | "bold" | "italic";
    },
  ): number => {
    const safeText = String(text || "");
    const originalSize = doc.getFontSize();
    const originalStyle = doc.getFont().fontStyle;

    if (options?.fontSize) doc.setFontSize(options.fontSize);
    doc.setFont(doc.getFont().fontName, options?.fontStyle || "normal");

    const lines = doc.splitTextToSize(
      safeText,
      options?.maxWidth || contentWidth,
    );
    doc.text(lines, x, y, { align: options?.align || "left" });

    // Calculate new Y, account for multiple lines and line spacing.
    const textHeight =
      (options?.fontSize || originalSize) * 0.35 * lines.length;
    doc.setFontSize(originalSize);
    doc.setFont(doc.getFont().fontName, originalStyle);
    return y + textHeight + 2;
  };

  // --- PDF Content Generation ---

  // 1. Title
  currentY = addWrappedText(
    "PUBLIC PETITION TO PARLIAMENT",
    pageWidth / 2,
    currentY,
    {
      fontSize: 16,
      fontStyle: "bold",
      align: "center",
    },
  );
  currentY += lineSpacing;

  // 2. Petitioner Identification
  currentY = addWrappedText("I/We, the undersigned,", margin, currentY, {
    fontSize: 12,
    fontStyle: "bold",
  });
  currentY = addWrappedText(
    `(${petitionData.petitionerIdentification})`,
    margin,
    currentY,
    { fontSize: 11 },
  );
  currentY += lineSpacing;

  // 3. Grievances / Reasons
  currentY = addWrappedText(
    "DRAW the attention of the House to the following:",
    margin,
    currentY,
    {
      fontSize: 12,
      fontStyle: "bold",
    },
  );
  // Use addWrappedText for grievances, define maxWidth
  currentY = addWrappedText(petitionData.grievances, margin, currentY, {
    fontSize: 11,
    maxWidth: contentWidth, // Important: Limit the text width
  });
  currentY += lineSpacing;

  // 4. Prior Efforts Confirmation
  currentY = addWrappedText("THAT,", margin, currentY, {
    fontSize: 12,
    fontStyle: "bold",
  });
  const priorEffortsText = petitionData.priorEffortsConfirmation
    ? "Efforts have been made to have the matter addressed by the relevant body, and it failed to give satisfactory response."
    : "Confirmation of prior efforts not provided.";
  currentY = addWrappedText(priorEffortsText, margin, currentY, {
    fontSize: 11,
    maxWidth: contentWidth,
  });
  currentY += lineSpacing;

  // 5. Legal Status Confirmation
  currentY = addWrappedText("THAT,", margin, currentY, {
    fontSize: 12,
    fontStyle: "bold",
  });
  const legalStatusText = petitionData.legalStatusConfirmation
    ? "The issues in respect of which the petition is made are not pending before any court of law, or constitutional or legal body."
    : "Confirmation of legal status not provided.";
  currentY = addWrappedText(legalStatusText, margin, currentY, {
    fontSize: 11,
    maxWidth: contentWidth,
  });
  currentY += lineSpacing;

  // 6. Prayer
  currentY = addWrappedText(
    "THEREFORE your humble petitioner(s) pray that Parliament—",
    margin,
    currentY,
    {
      fontSize: 12,
      fontStyle: "bold",
    },
  );
  currentY = addWrappedText(petitionData.prayer, margin, currentY, {
    fontSize: 11,
    maxWidth: contentWidth,
  });
  currentY += lineSpacing * 1.5;

  // 7. Petitioners Table Title
  currentY = addWrappedText("Details of Petitioner(s):", margin, currentY, {
    fontSize: 12,
    fontStyle: "bold",
  });
  currentY += lineSpacing / 2;

  const tableColumns = [
    { header: "Name of petitioner", dataKey: "name" },
    { header: "Full Address and Phone Number", dataKey: "addressPhone" },
    { header: "National ID./Passport No", dataKey: "nationalId" },
    { header: "Signature/Thumb impression", dataKey: "signature" },
  ];

  const tableData = petitionData.petitioners.map((p) => ({
    name: String(p.name || "N/A"),
    addressPhone: `${String(p.address || "N/A")}\n${String(p.phone || "N/A")}`,
    nationalId: String(p.nationalId || "N/A"),
    signature: "",
  }));

  const tableBody = tableData.map((row) =>
    tableColumns.map((col) => row[col.dataKey as keyof typeof row]),
  );

  const autoTableOptions: UserOptions = {
    head: [tableColumns.map((col) => col.header)],
    body: tableBody,
    startY: currentY,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 2,
      valign: "middle",
      font: "times",
      textColor: [0, 0, 0],
      lineColor: [150, 150, 150],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      font: "times",
      fontStyle: "bold",
      halign: "center",
      lineWidth: 0.2,
      lineColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 60 },
      2: { cellWidth: 35 },
      3: { cellWidth: "auto" },
    },
    margin: { left: margin, right: margin },
  };

  autoTable(doc, autoTableOptions);

  doc.save(filename);
  console.log(`Petition PDF generated: ${filename}`);
};
