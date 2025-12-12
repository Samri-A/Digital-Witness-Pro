// test-classify.js
const { classifyText } = require("./ai");

async function runTest() {
  const texts = [
    "I will hurt you if you don't comply!",
    "Stop sending me messages every day!",
    "I hate people from your group.",
    "If you don't pay, I will expose your secret."
  ];

  for (const t of texts) {
    const result = await classifyText(t);
    console.log(`Text: "${t}"`);
    console.log("Classification result:", result);
    console.log("------");
  }
}

runTest();
