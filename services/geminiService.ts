
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const nutritionSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: {
      type: Type.STRING,
      description: "A concise, descriptive name for the meal, e.g., 'Pancakes with Blueberries & Syrup'."
    },
    calories: {
      type: Type.NUMBER,
      description: "Estimated total calories for the meal."
    },
    protein: {
      type: Type.NUMBER,
      description: "Estimated grams of protein."
    },
    carbs: {
      type: Type.NUMBER,
      description: "Estimated grams of carbohydrates."
    },
    fats: {
      type: Type.NUMBER,
      description: "Estimated grams of fats."
    },
    healthScore: {
      type: Type.NUMBER,
      description: "A health score from 1 to 10, where 10 is healthiest."
    }
  },
  required: ["foodName", "calories", "protein", "carbs", "fats", "healthScore"]
};

export const analyzeFoodImage = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          },
          {
            text: "Analyze the food in this image. Identify the main dish and estimate its nutritional information for a single serving. Provide the response in the requested JSON format."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: nutritionSchema
      }
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);

    return {
        name: parsedData.foodName,
        calories: parsedData.calories,
        protein: parsedData.protein,
        carbs: parsedData.carbs,
        fats: parsedData.fats,
        healthScore: parsedData.healthScore
    };
  } catch (error) {
    console.error("Error analyzing food image:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};
