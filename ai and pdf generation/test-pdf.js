const fs = require("fs");
const { generatePDF } = require("./pdf.js");

async function testPDF() {
  const sampleText = "This is a test message to check if PDF generation works.";
  const aiResult = {
    category: "test-category",
    confidence: 0.99
  };

  const pdfBytes = await generatePDF(sampleText, aiResult);

  // Save the PDF
  fs.writeFileSync("test-output.pdf", pdfBytes);

  console.log("PDF generated successfully: test-output.pdf");
}

testPDF();
