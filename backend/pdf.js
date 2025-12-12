const puppeteer = require('puppeteer');
const { format } = require('date-fns');
const fs = require('fs');

const ABUSE_TYPE_LABELS = {
  harassment: 'Harassment',
  cyberbullying: 'Cyberbullying',
  hate_speech: 'Hate Speech',
  threats: 'Threats',
  doxxing: 'Doxxing',
  impersonation: 'Impersonation',
  stalking: 'Stalking',
};

// Safe HTML escape without JSDOM
function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Convert local image paths to file:// URLs
function fixImagePath(content) {
  if (!content) return "";
  if (content.startsWith("http")) return content;
  return `file://${process.cwd()}/${content}`;
}

async function generateCaseReport(caseData, pdfPath) {

  // Fix image paths in evidence
  caseData.evidence = caseData.evidence.map(ev => ({
    ...ev,
    content: ev.type === "image" ? fixImagePath(ev.content) : ev.content,
  }));

  const reportDate = format(new Date(), 'MMMM d, yyyy');
  const reportTime = format(new Date(), 'h:mm:ss a');
  const caseNumber = `DWP-${caseData.id.substring(0, 8).toUpperCase()}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 12pt; }
      </style>
    </head>
    <body>
      <h1>Case Report: ${caseNumber}</h1>
      <p><strong>Generated:</strong> ${reportDate} at ${reportTime}</p>

      <h2>Case Summary</h2>
      <p><strong>Title:</strong> ${escapeHtml(caseData.title)}</p>
      <p><strong>Notes:</strong> ${escapeHtml(caseData.notes)}</p>

      <h2>Evidence</h2>
      ${caseData.evidence.map((ev, i) => `
        <div style="margin-bottom:20px;">
          <h3>Evidence ${i + 1}</h3>
          <p><strong>Type:</strong> ${ev.type}</p>
          ${ev.type === "image" ? `
            <img src="${ev.content}" style="max-width:100%; border:1px solid #000;" />
          ` : `
            <pre>${escapeHtml(ev.content)}</pre>
          `}
        </div>
      `).join('')}
    </body>
    </html>
  `;

  // ---------- FIXED PUPPETEER SETTINGS ----------
  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
  await browser.close();
}

module.exports = {
  generateCaseReport,
};
