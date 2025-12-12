// ai.js
const { fetch } = require("undici");
require("dotenv").config();

// If you prefer, you can put the key in .env instead of hardcoding
const UCLASSIFY_KEY = process.env.UCLASSIFY_KEY;

const CLASSIFIER_OWNER = "ebenezer";      // your username
const CLASSIFIER_NAME = "abuse classifier";  // your classifier name

async function classifyText(text) {
  // REST API URL for uClassify
  const url = `https://api.uclassify.com/v1/${CLASSIFIER_OWNER}/${encodeURIComponent(CLASSIFIER_NAME)}/classify`;

  const body = { texts: [text] };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Token ${UCLASSIFY_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();

    // Check for errors
    if (data.error) {
      console.error("Hugging Face error:", data.error);
      return { category: "unknown", confidence: 0 };
    }

    // data[0].classification contains class probabilities
    if (data && Array.isArray(data) && data[0] && data[0].classification) {
      const classifications = data[0].classification;

      // Find the class with the highest probability
      let topClass = classifications[0];
      classifications.forEach(c => {
        if (c.p > topClass.p) topClass = c;
      });

      return { category: topClass.className, confidence: topClass.p };
    }

    return { category: "unknown", confidence: 0 };
  } catch (err) {
    console.error("Classification error:", err);
    return { category: "unknown", confidence: 0 };
  }
}

module.exports = { classifyText };
