import jsPDF from "jspdf";

// Field label emoji map matching the HTML reference format
const fieldEmojis: Record<string, string> = {
  Email: "Email",
  Password: "Password",
  "Encrypted password": "Encrypted password",
  "The date of registration": "Registration date",
  "Last activity": "Last activity",
  "Full name": "Full name",
  Name: "Name",
  Surname: "Surname",
  Nick: "Nickname",
  IP: "IP Address",
  Salt: "Salt",
  "Date of birth": "Date of birth",
  "Time zone": "Time zone",
  Titul: "Title",
  "Visits to the profile": "Profile visits",
  Reputation: "Reputation",
  "The number of publications": "Publications",
  "The number of subscribers": "Subscribers",
  Website: "Website",
  "The leakage site": "Leak source",
  Stat: "Status",
  Status: "Status",
  Category: "Category",
  Date: "Date",
  Phone: "Phone",
  Address: "Address",
  City: "City",
  Country: "Country",
};

function getFieldLabel(key: string): string {
  return fieldEmojis[key] || key;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generatePDF(data: any, query: string): void {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Colors
  const brandBlue: [number, number, number] = [37, 99, 235];
  const darkText: [number, number, number] = [23, 37, 84];
  const grayText: [number, number, number] = [100, 116, 139];
  const lightBg: [number, number, number] = [241, 245, 249];
  const white: [number, number, number] = [255, 255, 255];
  const cardBorder: [number, number, number] = [226, 232, 240];
  const accentTeal: [number, number, number] = [20, 184, 166];

  const databases = data.List ? Object.keys(data.List) : [];
  const validDbs = databases.filter((d) => d !== "No results found");
  const totalResults = validDbs.reduce((acc, db) => {
    return acc + (data.List[db]?.Data?.length || 0);
  }, 0);

  function addNewPage() {
    doc.addPage();
    y = margin;
    drawPageFooter();
  }

  function checkPageBreak(neededHeight: number) {
    if (y + neededHeight > pageHeight - 25) {
      addNewPage();
    }
  }

  function drawPageFooter() {
    const footerY = pageHeight - 10;
    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.text(
      "Golubaba420.online - OSINT Intelligence Report",
      margin,
      footerY
    );
    doc.text(
      `Page ${doc.getNumberOfPages()}`,
      pageWidth - margin,
      footerY,
      { align: "right" }
    );
    // Footer line
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
  }

  // ─── COVER PAGE ───
  // Background
  doc.setFillColor(...white);
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Top accent bar
  doc.setFillColor(...brandBlue);
  doc.rect(0, 0, pageWidth, 4, "F");

  // Brand logo area
  y = 40;
  doc.setFillColor(...brandBlue);
  doc.roundedRect(margin, y, 14, 14, 3, 3, "F");
  doc.setTextColor(...white);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("GL", margin + 7, y + 9, { align: "center" });

  // Brand name
  doc.setTextColor(...darkText);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("Golubaba420.online", margin + 18, y + 10);

  // Subtitle tag
  y += 22;
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, y, 62, 7, 2, 2, "F");
  doc.setFontSize(8);
  doc.setTextColor(...brandBlue);
  doc.setFont("helvetica", "normal");
  doc.text("OSINT Intelligence Report", margin + 3, y + 5);

  // Divider
  y += 16;
  doc.setDrawColor(...brandBlue);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 40, y);

  // Report info
  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("Search Query:", margin, y);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text(query, margin + 30, y);

  y += 7;
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("Generated:", margin, y);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text(new Date().toLocaleString(), margin + 30, y);

  y += 7;
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("Total Results:", margin, y);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text(String(totalResults), margin + 30, y);

  y += 7;
  doc.setTextColor(...grayText);
  doc.setFont("helvetica", "normal");
  doc.text("Databases:", margin, y);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text(String(validDbs.length), margin + 30, y);

  // ─── TABLE OF CONTENTS ───
  y += 18;
  doc.setFillColor(...lightBg);
  doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "F");
  doc.setFontSize(12);
  doc.setTextColor(...darkText);
  doc.setFont("helvetica", "bold");
  doc.text("Table of Contents", margin + 4, y + 7);
  y += 15;

  for (let i = 0; i < validDbs.length; i++) {
    const dbName = validDbs[i];
    const recordCount = data.List[dbName]?.Data?.length || 0;

    checkPageBreak(6);
    doc.setFontSize(9);

    // Index number
    doc.setTextColor(...brandBlue);
    doc.setFont("helvetica", "bold");
    doc.text(`${String(i + 1).padStart(2, "0")}`, margin + 2, y);

    // Database name
    doc.setTextColor(...darkText);
    doc.setFont("helvetica", "normal");
    const truncName =
      dbName.length > 55 ? `${dbName.substring(0, 55)}...` : dbName;
    doc.text(truncName, margin + 12, y);

    // Record count
    doc.setTextColor(...grayText);
    doc.setFontSize(8);
    doc.text(
      `${recordCount} record${recordCount !== 1 ? "s" : ""}`,
      pageWidth - margin,
      y,
      { align: "right" }
    );

    // Dotted line
    doc.setDrawColor(...cardBorder);
    doc.setLineDashPattern([0.5, 0.8], 0);
    doc.setLineWidth(0.2);
    const nameWidth = doc.getTextWidth(truncName);
    const countText = `${recordCount} record${recordCount !== 1 ? "s" : ""}`;
    doc.setFontSize(8);
    const countWidth = doc.getTextWidth(countText);
    doc.line(
      margin + 12 + nameWidth + 2,
      y - 0.5,
      pageWidth - margin - countWidth - 2,
      y - 0.5
    );
    doc.setLineDashPattern([], 0);

    y += 6;
  }

  drawPageFooter();

  // ─── DATABASE DETAIL PAGES ───
  for (let dbIndex = 0; dbIndex < validDbs.length; dbIndex++) {
    const dbName = validDbs[dbIndex];
    const dbData = data.List[dbName];
    const records = dbData?.Data || [];
    const infoLeak = dbData?.InfoLeak || "";

    addNewPage();

    // Database header
    doc.setFillColor(...brandBlue);
    doc.roundedRect(margin, y, contentWidth, 12, 2, 2, "F");
    doc.setFontSize(11);
    doc.setTextColor(...white);
    doc.setFont("helvetica", "bold");
    const headerText =
      dbName.length > 60 ? `${dbName.substring(0, 60)}...` : dbName;
    doc.text(headerText, margin + 4, y + 8);

    // Record count badge
    doc.setFillColor(255, 255, 255, 0.3);
    const badgeText = `${records.length} record${records.length !== 1 ? "s" : ""}`;
    doc.setFontSize(8);
    const badgeWidth = doc.getTextWidth(badgeText) + 6;
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(
      pageWidth - margin - badgeWidth - 3,
      y + 3,
      badgeWidth + 2,
      6,
      1.5,
      1.5,
      "F"
    );
    doc.setTextColor(...brandBlue);
    doc.setFont("helvetica", "bold");
    doc.text(badgeText, pageWidth - margin - badgeWidth, y + 7.5);

    y += 16;

    // Info/description
    if (infoLeak) {
      checkPageBreak(20);
      doc.setFillColor(...lightBg);
      const infoLines = doc.splitTextToSize(infoLeak, contentWidth - 8);
      const infoHeight = infoLines.length * 4 + 6;
      doc.roundedRect(margin, y, contentWidth, infoHeight, 2, 2, "F");

      // Left accent bar
      doc.setFillColor(...accentTeal);
      doc.rect(margin, y, 2.5, infoHeight, "F");

      doc.setFontSize(7.5);
      doc.setTextColor(...grayText);
      doc.setFont("helvetica", "italic");
      doc.text(infoLines, margin + 6, y + 5);
      y += infoHeight + 5;
    }

    // Records
    for (let recIndex = 0; recIndex < records.length; recIndex++) {
      const record = records[recIndex];
      const entries = Object.entries(record);

      // Estimate height needed for this record
      let estimatedHeight = 8; // header
      for (const [, value] of entries) {
        const valStr = String(value ?? "");
        const valLines = doc.splitTextToSize(valStr, contentWidth - 45);
        estimatedHeight += Math.max(valLines.length * 4, 5) + 1;
      }
      estimatedHeight += 4;

      checkPageBreak(Math.min(estimatedHeight, 60));

      // Record header
      doc.setFillColor(...lightBg);
      doc.roundedRect(margin, y, contentWidth, estimatedHeight, 2, 2, "F");

      // Record border
      doc.setDrawColor(...cardBorder);
      doc.setLineWidth(0.3);
      doc.roundedRect(margin, y, contentWidth, estimatedHeight, 2, 2, "S");

      // Record number chip
      doc.setFillColor(...accentTeal);
      doc.roundedRect(margin + 3, y + 2, 18, 5, 1.2, 1.2, "F");
      doc.setFontSize(7);
      doc.setTextColor(...white);
      doc.setFont("helvetica", "bold");
      doc.text(`Record ${recIndex + 1}`, margin + 4, y + 5.5);

      let fieldY = y + 11;

      for (const [key, value] of entries) {
        const valStr = String(value ?? "");
        const label = getFieldLabel(key);

        // Check if we need a new page mid-record
        if (fieldY > pageHeight - 25) {
          // Close current card partial
          addNewPage();
          fieldY = y + 4;
          // Continue label
          doc.setFontSize(7);
          doc.setTextColor(...grayText);
          doc.setFont("helvetica", "italic");
          doc.text(`...continued from ${dbName}, Record ${recIndex + 1}`, margin, fieldY);
          fieldY += 6;
        }

        // Field label
        doc.setFontSize(7.5);
        doc.setTextColor(...brandBlue);
        doc.setFont("helvetica", "bold");
        doc.text(`${label}:`, margin + 4, fieldY);

        // Field value
        doc.setTextColor(...darkText);
        doc.setFont("helvetica", "normal");
        const valueLines = doc.splitTextToSize(valStr, contentWidth - 45);
        doc.text(valueLines, margin + 38, fieldY);

        fieldY += Math.max(valueLines.length * 4, 5) + 1;
      }

      y += estimatedHeight + 4;
    }
  }

  // Fix page footers on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = pageHeight - 10;
    doc.setFontSize(7);
    doc.setTextColor(...grayText);
    doc.text("Golubaba420.online - OSINT Intelligence Report", margin, footerY);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, footerY, {
      align: "right",
    });
    doc.setDrawColor(...cardBorder);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
  }

  // Save the PDF
  const filename = `Golubaba420-${query.replace(/[^a-zA-Z0-9@._-]/g, "_")}-${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
}
