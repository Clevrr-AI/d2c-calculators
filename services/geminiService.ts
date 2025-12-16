import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client using the API key directly from the environment.
// As per guidelines, we assume process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialInsight = async (context: string, data: any): Promise<string> => {
  try {
    const model = 'gemini-3-pro-preview';
    const prompt = `
      You are an expert CFO for Direct-to-Consumer (D2C) brands in India. 
      Analyze the following ${context} data and provide 3 concise, high-impact strategic recommendations using bullet points.
      Focus on profitability, cash flow, and efficiency. Use a professional but encouraging tone.
      Currency is in INR (₹).
      
      Data:
      ${JSON.stringify(data, null, 2)}
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction: "You are a financial advisor for e-commerce brands.",
      }
    });

    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error generating insights. Please try again.";
  }
};

export const generateOptimization = async (context: string, currentData: any): Promise<any> => {
  try {
    const model = 'gemini-3-pro-preview';
    const prompt = `
      Act as a highly experienced D2C CFO. 
      The user has provided the following numbers for their ${context}.
      Your goal is to "Fix the numbers" to make the business healthier (higher profit, better cash flow, or lower risk).
      
      1. Analyze the Current Data.
      2. Suggest realistic, improved values for the input fields. Do not change values that are likely fixed constraints (like fixed costs) unless necessary, but optimize variable levers (like pricing, ad spend, inventory levels).
      3. Return a JSON object with the optimized values, a short explanation of the strategy, and the projected impact.
      
      Current Data:
      ${JSON.stringify(currentData, null, 2)}

      Output format (JSON only):
      {
        "optimizedData": { ...key-value pairs matching the input keys exactly... },
        "explanation": "Strategic reason for the changes (max 2 sentences)",
        "impact": "The outcome delta (e.g. 'Profit margin increases by 5%')"
      }
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a strategic CFO optimizer. Always return valid JSON.",
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return null;
  }
};
