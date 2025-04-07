import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || "";

const genAI = new GoogleGenerativeAI(geminiApiKey);

export const generateItinerary = async (
  trekRegion: string,
  duration: number,
  fitnessLevel: string,
  budget: string,
  specialReq: string
): Promise<string> => {
  try {
    if (!geminiApiKey) {
      return "API key not configured. Please set up your environment variables.";
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Plan a comprehensive trekking itinerary for the ${trekRegion} region.

    TREK DETAILS:
    - Duration: ${duration} days
    - Fitness Level: ${fitnessLevel}
    - Budget: ${budget}
    - Special Requirements: ${specialReq || "None"}
    
    Please provide a detailed plan with particular emphasis on:
    
    1. REGIONAL OVERVIEW (±300 words)
       • Geographic highlights and unique features
       • Best seasons to visit and current conditions
       • Cultural significance and local customs
    
    2. COMPLETE BUDGET BREAKDOWN
       • Transportation costs (international flights, local travel)
       • Accommodation expenses (nightly rates, types available)
       • Meal costs (daily estimates, recommended food options)
       • Permit/entry fees and guide requirements
       • Equipment rental options and costs
       • Emergency fund recommendations
       • Total estimated cost with breakdown percentages
    
    3. DETAILED DAY-BY-DAY ITINERARY
       • Starting and ending points for each day with exact distances
       • Estimated hiking times including elevation changes
       • Key waypoints and landmarks with GPS coordinates when available
       • Accommodation details for each night
       • Meal recommendations and water source information
       • Scenic highlights and photo opportunities
       • Alternative routes for weather contingencies
    
    4. ESSENTIAL PREPARATION GUIDELINES
       • Required permits and documentation
       • Recommended training schedule before departure
       • Packing checklist with seasonal considerations
       • Health and safety precautions specific to the region
    
    Please format the response with clear headings, bullet points, and spacing for easy reading and reference during the trek.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching itinerary:", error);
    return (
      "Sorry, I couldn't generate the itinerary at this time. Error: " +
      (error instanceof Error ? error.message : String(error))
    );
  }
};
