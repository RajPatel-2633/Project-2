# Astro AI - Your Celestial Blueprint

Astro AI is a premium, AI-powered Vedic Astrology platform designed to bridge ancient cosmic wisdom with modern artificial intelligence. It provides users with highly personalized astrological insights, real-time transit tracking, and a direct line of communication to a "Cosmic Sage" AI.

## 🔗 Live Demo
Check out the live application here: [Astro AI on Vercel](https://project-2-jade-alpha.vercel.app/)

## ✨ Key Features

- **AI-Powered Daily Horoscopes**: Personalized daily forecasts for all 12 zodiac signs, generated using advanced LLMs (Groq/Gemini) to ensure deep, empathetic insights.
- **Dynamic Panchang**: Real-time Vedic calendar data including Tithi, Nakshatra, Yoga, and Karana.
- **Birth Chart Interpretation**: Generate comprehensive North Indian style Kundli charts with detailed AI-driven analysis of your planetary placements.
- **Personal AI Astrologer Chat**: An immersive, iPad-inspired chat interface where you can ask the "Astro Sage" deep questions about your destiny, relationships, and career.
- **Transit Alerts**: Stay updated with major planetary movements (Ingresses, Retrogrades) and how they affect your specific sign.
- **Kundli Matching**: Professional-grade compatibility analysis between two individuals based on Vedic principles.
- **Premium Aesthetic**: A meticulously designed UI featuring a "Parchment & Gold" theme, glassmorphism, and smooth celestial animations.

## 🚀 Tech Stack

### Frontend
- **React (Vite)**: For a lightning-fast, modern user interface.
- **Tailwind CSS & DaisyUI**: Custom-themed "Astra" design system with a retro, premium look.
- **Zustand**: Lightweight and scalable state management.
- **React Markdown**: For beautiful, structured LLM-style AI responses.
- **Lucide Icons**: For clean, consistent iconography.

### Backend
- **Node.js & Express**: Robust and scalable server architecture.
- **MongoDB & Mongoose**: Flexible document storage for profiles, charts, and chat history.
- **Astronomy Engine**: High-precision library for celestial calculations.
- **Groq/Gemini AI**: High-performance AI integration for generating accurate astrological text.
- **Node-Cron**: Automated daily background synchronization for horoscopes and transits.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB account (Atlas or local)
- API Key for Groq or Gemini
- Mailtrap account (for email notifications)

### 1. Clone the Repository
```bash
git clone https://github.com/RajPatel-2633/Astro-AI.git
cd Astro-AI/Project-2
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add the following:
```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
ACCESS_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_token_secret
GROQ_API_KEY=your_ai_api_key

# Email Configuration (Mailtrap)
MAILTRAP_HOST=smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_user_id
MAILTRAP_PASS=your_password
SENDER_MAIL=noreply@astroai.com
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Start the frontend:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`.

---
## 📜 License
This project is licensed under the MIT License.

