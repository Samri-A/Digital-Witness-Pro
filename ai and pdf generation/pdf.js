const PDFDocument = require("pdfkit");
const { PassThrough } = require("stream");

function generatePDF(text, aiResult) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = new PassThrough();
      const chunks = [];

      doc.pipe(stream);

      doc.fontSize(20).text("Case Report", { underline: true });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Text: ${text}`);
      doc.moveDown();

      doc.text(`Category: ${aiResult.category}`);
      doc.text(`Confidence: ${aiResult.confidence}`);
      doc.moveDown();

      doc.end();

      stream.on("data", (chunk) => chunks.push(chunk));
      stream.on("end", () => resolve(Buffer.concat(chunks)));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePDF };
