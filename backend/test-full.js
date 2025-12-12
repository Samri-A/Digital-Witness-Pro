const { classifyText } = require("./ai");
const { generatePDF } = require("./pdf");

async function runFullTest() {
  const userText = "This person is threatening to spread false rumors about me.";
  const classification = await classifyText(userText);

  const caseData = {
    title: "Sample Case Full Test",
    timestamp: new Date().toISOString(),
    category: classification.category,
    confidence: classification.confidence,
    notes: "User added some notes here.",
    files: ["screenshot.png"],
  };

  generatePDF(caseData, "full-test-case.pdf");
  console.log("Full workflow completed. PDF generated: full-test-case.pdf");
}

runFullTest();
