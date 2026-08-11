require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function run() {
  try {
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const response = await ai.models.list();
    
    const validModels = [];
    for await (const m of response) {
      if (m.supportedActions && m.supportedActions.includes('generateContent')) {
        validModels.push(m.name);
      }
    }
    
    console.log("VALID_MODELS:");
    console.log(JSON.stringify(validModels, null, 2));
  } catch(e) {
    console.error("Error listing models:", e.message);
  }
}
run();
