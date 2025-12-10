import { GoogleGenAI } from "@google/genai";

// Initialize the Google GenAI client using the API key directly from the environment.
// As per guidelines, we assume process.env.API_KEY is pre-configured and valid.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateFinancialInsight = async (context: string, data: any): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
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