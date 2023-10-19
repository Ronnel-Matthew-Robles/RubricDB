import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (rubric, teacher = null) => {
  const rubricId = rubric._id;
  const rubricName = "rubric-" + rubricId + ".pdf";
  const category_names = rubric.category_names;

  const columns = [
    { header: "Category", dataKey: "category" },
    {
      header:
        category_names[3] === "4"
          ? "Excellent (4)"
          : `${category_names[3]} (4)`,
      dataKey: "c4",
    },
    {
      header:
        category_names[2] === "3" ? "Good (3)" : `${category_names[2]} (3)`,
      dataKey: "c3",
    },
    {
      header:
        category_names[1] === "2"
          ? "Satisfying (2)"
          : `${category_names[1]} (2)`,
      dataKey: "c2",
    },
    {
      header:
        category_names[0] === "1"
          ? "Needs Improvement (1)"
          : `${category_names[0]} (1)`,
      dataKey: "c1",
    },
    { header: "Score", dataKey: "score" },
  ];

  const data = [];
  for (let criterion of rubric.criteria) {
    if (typeof criterion.criteria !== "undefined") {
      const c = criterion.criteria;
      data.push({
        category: `${criterion.new_name || c.title} ${
          criterion.weight ? `(${criterion.weight}%)` : ""
        }`,
        c4: c.c4,
        c3: c.c3,
        c2: c.c2,
        c1: c.c1,
        score: "",
      });
    }
  }

  var doc = new jsPDF();

  var logo = new Image();
  logo.src = "/images/lpulogo.png";
  doc.addImage(logo, "png", 10, 10, 13, 14);
  doc.text(rubric.title, 25, 15);
  doc.setFontSize(10);
  doc.setTextColor("Gray");
  doc.text("Lyceum of the Philippines University - Laguna", 25, 22);
  doc.line(205, 27, 10, 27);

  var marginTop = 30;

  if (rubric.instructions) {
    doc.setTextColor("Black");
    doc.setFontSize(14);
    doc.setFont("Helvetica", "bold");
    doc.text("INSTRUCTIONS", 10, 35);
    doc.setFontSize(10);
    doc.setFont("Helvetica", "normal");
    doc.text(rubric.instructions, 10, 42, {
      maxWidth: "180",
    });
    var numOfLines = rubric.instructions.length / 100;
    var numOfLineBreaks = rubric.instructions.split("\n").length;

    if (numOfLineBreaks > numOfLines) {
      doc.line(205, 27 + 8 * numOfLineBreaks, 10, 27 + 8 * numOfLineBreaks);
      marginTop += 8 * numOfLineBreaks;
    } else {
      doc.line(205, 27 + 5.5 * numOfLines, 10, 27 + 5.5 * numOfLines);
      marginTop += 5.5 * numOfLines;
    }
  }

  autoTable(doc, {
    theme: "plain",
    styles: { fontSize: 8 },
    headStyles: {
      fillColor: "#F5F5F5",
      textColor: "#000000",
      minCellWidth: 10,
    },
    columnStyles: { category: { fontStyle: "bold" } },
    margin: { top: marginTop, left: 10, right: 5 },
    columns: columns,
    body: data,
    didParseCell: function (data) {
      var s = data.cell.styles;
      s.lineWidth = 0.1;
      s.borders = "b";
    },
  });

  if (teacher.name !== null) {
    doc.setTextColor("Black");
    doc.text("Marked by:", 10, 265);
    doc.text(teacher.name, 10, 275);

    doc.text("Approved by:", 100, 265);
    doc.text("Celia Tibayan", 100, 275);
    doc.text("Chair, Committee on Assessments", 100, 280);

    var esig = new Image();
    esig.src = "/images/tenorio_esig.png";
    doc.addImage(esig, "png", 100, 262, 35, 14);
  }

  doc.save(rubricName);
};

export * from "./hooks";
