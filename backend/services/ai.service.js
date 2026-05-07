import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export const getGeminiResponse = async (userPrompt, history=[],systemInstruction = "") => {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                ...history,
                {
                    role: "system",
                    content: systemInstruction,
                },
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            model: "llama-3.1-8b-instant", // Fast and very smart
            temperature: 0.7,
            max_completion_tokens: 4096
        });

        const content = chatCompletion.choices[0]?.message?.content;

        if (!content) {
            console.error("❌ Groq returned an empty response");
            return null;
        }

        console.log("📡 AI Response received (first 100 chars):", content.substring(0, 100) + "...");
        return content;
    } catch (error) {
        console.error("❌ Groq Service Error:", error.message);
        return null;
    }
};