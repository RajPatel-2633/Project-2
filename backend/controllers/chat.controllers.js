import BirthChart from "../models/BirthChart.models.js";
import BirthProfile from "../models/BirthProfile.models.js";
import ChatSession from "../models/ChatSession.models.js";
import ChatMessage from "../models/ChatMessage.models.js";
import { getGeminiResponse } from "../services/ai.service.js";
import { BadRequestError, InternalServerError, NotFoundError } from "../utils/ApiError.utils.js";
import asyncHandler from "../utils/AsyncHandler.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";



const initialiseChat = asyncHandler(async (req, res) => {
    const { user_id, profile_id, title } = req.body;
    if (!user_id || !profile_id) {
        throw new BadRequestError("All Fields are required");
    }

    const profile = await BirthProfile.findById(profile_id);
    const birthChart = await BirthChart.findOne({ profile_id });

    if (!profile || !birthChart) {
        throw new NotFoundError("Birth Chart or Profile not found");
    }

    const chatsession = await ChatSession.create({ user_id, profile_id, title: title || `Consultation for ${profile.name}` });

    const systemPersona = "You are Astro AI, a professional Vedic astrologer. Use the provided birth chart data to give accurate, empathetic, and culturally relevant insights. Always refer to the user by their name.";
    // System Context for Gemini
    const chartContext = `
        User Name: ${profile.name}
        Lagna (Ascendant): ${birthChart.ascendant}
        Moon Sign: ${birthChart.moon_sign}
        Nakshatra: ${birthChart.nakshatra} (Pada ${birthChart.nakshatra_pada})
        Planetary Positions: ${birthChart.planets.map(p => `${p.name} in ${p.sign} at ${p.degree}°`).join(", ")}
    `;


    //Save this context as the first 'system' message (internal memory)
    const chatmessage = await ChatMessage.create({
        session_id: chatsession._id,
        role: "system",
        content: `You are now reading the chart of ${profile.name}. Context: ${chartContext}`
    });

    // Generate a dynamic greeting from Gemini
    let greetingText = `Namaste ${profile.name}, I am Astro AI. I have analyzed your ${birthChart.ascendant} ascendant chart. How can I guide you today?`;
    
    try {
        const greetingPrompt = `Give a very short, warm Vedic greeting to ${profile.name} and ask how you can help them with their ${birthChart.ascendant} chart today.`;
        // Use a shorter timeout or just a fast call
        const result = await getGeminiResponse(greetingPrompt, [], `${systemPersona}\n${chartContext}`);
        if (result) greetingText = result;
    } catch (aiErr) {
        console.error("AI Greeting timeout/error, using fallback");
    }

    console.log("AI Greeting Status: Ready");

    const initialMessage = await ChatMessage.create({
        session_id:chatsession._id,
        role:"model",
        content:greetingText
    });


    return res.status(201).json(new ApiResponse(201, {
        session: chatsession,
        greeting: initialMessage.content
    },
        "Chat initialised successfully"
    ));

});

const sendMessage = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;
    const { message } = req.body;

    if (!message) {
        throw new BadRequestError("Message content is required");
    }

    const session = await ChatSession.findById(sessionId);
    if (!session) {
        throw new NotFoundError("Chat Session Not Found");
    }

    // 1. Fetch history (including the system context saved during initialization)
    const historyMessages = await ChatMessage.find({ session_id: sessionId }).sort({ createdAt: 1 });

    // 2. Format history for Groq/Llama
    const formattedMessages = historyMessages.map(msg => ({
        // Map 'model' to 'assistant', keep 'user' and 'system' as they are
        role: msg.role === "model" ? "assistant" : msg.role,
        content: msg.content,
    }));

    // 3. Get AI Response
    // The AI now sees: [System Context] -> [Old Q&A] -> [Current Message]
    const aiResponse = await getGeminiResponse(message, formattedMessages);

    // 4. Save both messages to the database
    // Using sessionId (from params) to link to the session
    await ChatMessage.insertMany([
        { session_id: sessionId, role: "user", content: message },
        { session_id: sessionId, role: "model", content: aiResponse }
    ]);

    return res.status(200).json(new ApiResponse(200, {
        response: aiResponse,
    }, "Message sent successfully"));
});

const getChatHistory = asyncHandler(async (req, res) => {
    const { sessionId } = req.params;

    const session = await ChatSession.findById(sessionId);
    if (!session) {
        throw new NotFoundError("Chat Session Not Found");
    }

    const messages = await ChatMessage.find({
        session_id: sessionId,
        role: { $ne: "system" }
    }).sort({ createdAt: 1 });

    return res.status(200).json(new ApiResponse(200, messages, "Chat History retrieved successfully"));

});

const getUserSessions = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const sessions = await ChatSession.find({ user_id: userId }).sort({ createdAt: -1 }).populate("profile_id", "name");

    return res.status(200).json(new ApiResponse(200, sessions, "User sessions retrieved successfully"));
});

export { initialiseChat, sendMessage, getChatHistory, getUserSessions };