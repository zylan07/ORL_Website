import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";

export interface ExportField {
  label: string;
  key: string;
}

/**
 * Exports data array to a styled Excel sheet (.xlsx)
 */
export function exportToExcel(
  data: any[],
  fields: ExportField[],
  filename: string
) {
  const headers = fields.map(f => f.label);
  const keys = fields.map(f => f.key);

  const sheetData = [
    headers,
    ...data.map(item => keys.map(key => {
      const val = item[key];
      if (Array.isArray(val)) {
        return val.map((a: any) => a.name || a.title || "").join(", ");
      }
      return val === undefined || val === null ? "" : String(val);
    }))
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Records");

  // Adjust column widths dynamically
  const maxColWidths = sheetData[0].map((_, colIdx) => {
    return Math.max(...sheetData.map(row => String(row[colIdx] || "").length));
  });
  worksheet["!cols"] = maxColWidths.map(w => ({ wch: Math.min(Math.max(w + 3, 12), 60) }));

  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * Exports data array to a clean, readable PDF document (.pdf)
 */
export function exportToPdf(
  pageTitle: string,
  records: any[],
  fields: ExportField[],
  filename: string,
  filterText?: string
) {
  const doc = new jsPDF();
  let y = 20;

  // Header Style
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(15, 118, 110); // Teal-600
  doc.text(pageTitle, 20, y);
  y += 10;

  // Metadata block
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 20, y);
  y += 5;
  if (filterText) {
    doc.text(`Search Filters: "${filterText}"`, 20, y);
    y += 5;
  }
  doc.text(`Total Records: ${records.length}`, 20, y);
  y += 8;

  // Horizontal separator line
  doc.setDrawColor(229, 231, 235); // border gray-200
  doc.line(20, y, 190, y);
  y += 10;

  // Reset colors for records
  doc.setTextColor(31, 41, 55); // text gray-800

  records.forEach((rec, idx) => {
    // Check page overflow
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const titleText = `${idx + 1}. ${rec.title || rec.recipient || "Untitled Record"}`;
    const splitTitle = doc.splitTextToSize(titleText, 170);
    doc.text(splitTitle, 20, y);
    y += splitTitle.length * 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99); // text gray-600

    fields.forEach(field => {
      const val = rec[field.key];
      if (val !== undefined && val !== null && val !== "") {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        let displayVal = "";
        if (Array.isArray(val)) {
          displayVal = val.map((a: any) => a.name || a.title || "").filter(Boolean).join(", ");
        } else {
          displayVal = String(val);
        }

        if (displayVal.trim()) {
          const lineText = `${field.label}: ${displayVal}`;
          const splitLines = doc.splitTextToSize(lineText, 160);
          doc.text(splitLines, 25, y);
          y += splitLines.length * 4.5;
        }
      }
    });

    y += 5; // spacing between cards
    doc.setTextColor(31, 41, 55); // Reset record title color
  });

  doc.save(`${filename}.pdf`);
}
