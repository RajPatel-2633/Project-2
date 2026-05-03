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
            max_completion_tokens:500.
        });

        const content = chatCompletion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("Groq returned an empty response");
        }

        return content;
    } catch (error) {
        console.error("❌ Groq Service Error:", error.message);
        // Fallback so Raj's controller doesn't crash
        return "Namaste! I am your Astro AI. How can I help you with your chart today?";
    }
};