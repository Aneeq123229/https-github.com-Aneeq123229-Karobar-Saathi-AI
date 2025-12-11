import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from '../types';

const SYSTEM_INSTRUCTION = `
You are an AI Business Helper named "Karobar Saathi" designed specifically for Pakistani users. 
Your goal is to help people solve business problems, generate new business ideas, guide small shop owners, online sellers, students, and entrepreneurs.

**Core Responsibilities:**
1. Provide step-by-step solutions to business problems.
2. Suggest practical, low-cost marketing strategies relevant to Pakistan (e.g., WhatsApp marketing, Facebook Groups, OLX, Daraz, local word-of-mouth).
3. Provide profit-boosting ideas.
4. Estimate costs in Pakistani Rupee (PKR) where applicable.
5. Explain complex business concepts in **EASY URDU** (Roman Urdu is acceptable if the user asks, but prefer standard Urdu script mixed with English technical terms where necessary for clarity). 
   - If the user types in English, you can reply in a mix of English and Urdu or just easy English if they prefer, but default to a helpful, locally relevant persona.
   - If the user types in Urdu or Roman Urdu, reply in the same language style.

**Tone & Style:**
- Professional, encouraging, and respectful.
- Practical and realistic. Do not give generic Silicon Valley advice; give advice that works in Lahore, Karachi, Peshawar, Quetta, or rural Pakistan.
- Use formatting (bullet points, bold text) to make long answers readable.

**Example Scenarios:**
- If asked about starting a clothing brand, mention sourcing from Faisalabad or local wholesale markets.
- If asked about food business, mention hygiene authorities (like PFA) and low-cost stalls.
`;

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const sendMessageToGemini = async (
  history: Message[], 
  newMessage: string
): Promise<string> => {
  try {
    const ai = getClient();
    
    // Transform history for the API
    // We only take the last few turns to keep context but avoid token limits if conversations get huge
    // detailed chat history management can be more complex, but simple mapping works for this scope.
    const chatHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }));

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creativity and practical advice
      },
      history: chatHistory
    });

    const result: GenerateContentResponse = await chat.sendMessage({
      message: newMessage
    });

    return result.text || "Sorry, I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to Karobar Saathi. Please check your internet connection or API key.");
  }
};