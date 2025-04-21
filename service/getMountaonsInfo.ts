import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

export const fetchMountainInfo = async (
  mountainName: string
): Promise<string> => {
  try {
    if (!geminiApiKey) {
      return "API key not configured. Please set up your environment variables.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Provide detailed information about ${mountainName} in Nepal.
    
    Please include:
    
    1. MOUNTAIN OVERVIEW
       • Height and global ranking
       • Location and coordinates
       • First ascent history
       • Local names and meanings
       • Geological formation and features
    
    2. CLIMBING INFORMATION
       • Difficulty rating and technical challenges
       • Common routes with success rates
       • Best seasons for climbing
       • Required permits and costs
       • Average expedition duration
    
    3. PRACTICAL VISITOR INFORMATION
       • Nearest transportation hubs
       • Base camp facilities
       • Guide service recommendations
       • Safety considerations
       • Environmental conservation efforts
    
    Please format the response with clear sections, factual information, and avoid any speculative content.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    console.log("Mountain Info Response:", response.text());
    return response.text();
  } catch (error) {
    console.error("Error fetching mountain information:", error);
    return (
      "Sorry, I couldn't retrieve information about this mountain at this time. Error: " +
      (error instanceof Error ? error.message : String(error))
    );
  }
};
