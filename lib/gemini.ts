import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export const getAIClient = () => {
  if (!apiKey) {
    throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export async function generateDesignConcept(prompt: string, category: string | null) {
  const ai = getAIClient();
  
  const categoryContext = category ? `Context: This is for a ${category} project.` : "";
  
  const systemPrompt = `You are a creative design assistant for Canva AI. 
  The user wants help with: "${prompt}"
  ${categoryContext}
  
  Generate a creative design concept. Provide:
  1. A catchy title for the design.
  2. A brief 2-sentence description of the layout and visual style.
  3. A list of 3 key elements or assets to include (e.g., "Neon abstract shapes", "Minimalist topography").
  4. 3 suggested color hex codes.
  
  Format the response as JSON:
  {
    "title": "...",
    "description": "...",
    "elements": ["...", "...", "..."],
    "colors": ["#...", "#...", "#..."]
  }`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [{ parts: [{ text: systemPrompt }] }],
  });

  const text = response.text || "";
  
  try {
    // Extract JSON from the response text (it might be wrapped in markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error("Could not parse AI response");
  } catch (e) {
    console.error("Failed to parse Gemini response", text);
    return {
      title: "Creative Spark",
      description: "A beautiful design inspired by your idea.",
      elements: ["Vibrant colors", "Modern layout", "Clean typography"],
      colors: ["#7D2AE8", "#00C4CC", "#0E1318"]
    };
  }
}
