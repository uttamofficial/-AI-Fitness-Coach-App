<div align="center">

# 🏋️ AI Fitness Coach 💪

### *Your Personal AI-Powered Fitness & Nutrition Assistant*

[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.12-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google AI](https://img.shields.io/badge/Google_AI-Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)

[🚀 Live Demo](https://ai-fitness-coach-app-nine.vercel.app/) • [📖 Documentation](#-features) • [💬 Support](#-support)

---

</div>

## 🌟 Overview

Transform your fitness journey with **AI Fitness Coach** – a cutting-edge web application that leverages Google's latest Gemini AI technology to create personalized workout routines, nutrition plans, and wellness guidance tailored specifically to your goals and lifestyle.

Built with modern web technologies and powered by advanced AI models, this application delivers a seamless, intelligent, and engaging fitness planning experience.

---

## ✨ Features

### 🎯 **Personalized AI Plans**
- 📅 **7-Day Programs**: Complete workout and diet plans generated using Gemini 2.5 Flash
- 🎨 **Smart Customization**: Adapts to your fitness level, goals, location, and dietary preferences
- � **Instant Regeneration**: Don't like your plan? Regenerate with one click

### 🎙️ **AI Voice Assistant**
- 🔊 **Natural Text-to-Speech**: Listen to your plans with Google's Gemini TTS API
- 📖 **Read Anything**: Individual exercises, meals, or entire daily routines
- ⏯️ **Playback Controls**: Play, pause, and stop audio at any time

### 🖼️ **AI Image Generation**
- 🏃 **Exercise Visuals**: Click any exercise to generate realistic demonstration images
- 🍽️ **Meal Photos**: View AI-generated food photography for every meal
- ✨ **Powered by Imagen 3**: High-quality, photorealistic AI imagery

### 💾 **Smart Persistence**
- 🔐 **Local Storage**: Your data stays private and loads instantly
- 💼 **Form Memory**: Never re-enter your information
- 📊 **Plan History**: Your last generated plan is always available

### � **Beautiful UI/UX**
- 🌓 **Theme Toggle**: Smooth dark/light mode with animated transitions
- 📱 **Fully Responsive**: Perfect experience on desktop, tablet, and mobile
- ⚡ **Glassmorphism Design**: Modern, professional aesthetic
- 🎭 **Smooth Animations**: Delightful micro-interactions throughout

### 📝 **Multi-Step Form**
- 👤 **Personal Info**: Age, gender, height, weight
- 💪 **Fitness Profile**: Goals, experience level, workout location
- 🥗 **Preferences**: Diet type, medical conditions, lifestyle needs

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend Framework** | ![React](https://img.shields.io/badge/React_19.1.1-20232A?style=flat&logo=react&logoColor=61DAFB) |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite_7.1.12-646CFF?style=flat&logo=vite&logoColor=white) |
| **Styling** | ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white) ![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=flat&logo=postcss&logoColor=white) |
| **Icons** | ![Lucide](https://img.shields.io/badge/Lucide_React-000000?style=flat&logo=lucide&logoColor=white) |
| **AI - Text Generation** | Google Gemini 2.5 Flash (JSON Mode) |
| **AI - Voice** | Google Gemini TTS API |
| **AI - Images** | Google Imagen 3 API |
| **State Management** | React Hooks + LocalStorage |
| **Deployment** | ![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white) |

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Google AI API Key ([Get it here](https://ai.google.dev/))

### Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/ai-fitness-coach.git
cd ai-fitness-coach
```

2️⃣ **Install dependencies**
```bash
npm install
```

3️⃣ **Set up environment variables**

Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

> 💡 **Tip**: Get your free API key from [Google AI Studio](https://ai.google.dev/)
> 
> ⚠️ **Note**: The `VITE_` prefix is required by Vite

4️⃣ **Start the development server**
```bash
npm run dev
```

5️⃣ **Open your browser**

Navigate to `http://localhost:5173` 🎉

---

## � Build & Deploy

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

> 🔑 **Remember**: Add your `VITE_GEMINI_API_KEY` to Vercel environment variables

---

## �🔐 API Configuration & Security

### Environment Variables
This project uses `.env` files for secure API key management:

- ✅ Development: `.env` file (gitignored)
- ✅ Production: Platform environment variables (Vercel/Netlify)
- ✅ Never commit API keys to version control

### API Key Security
```javascript
// API key is accessed safely via Vite's env system
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
```

### .gitignore Protection
The `.gitignore` file is pre-configured to exclude:
- `.env*` files
- `node_modules/`
- `dist/`
- Build artifacts

---

## ⚠️ Important Notes

### 💳 **Billing Requirements**

| Feature | Free Tier | Requires Billing |
|---------|-----------|------------------|
| 🧠 Plan Generation (Gemini 2.5) | ✅ Yes | ❌ No |
| 🔊 Voice Reading (TTS) | ✅ Yes | ❌ No |
| 🖼️ Image Generation (Imagen 3) | ❌ No | ✅ Yes |

> **Note**: Image generation will return a 400 error without billing enabled. The core features work perfectly on the free tier!

---

## 📸 Screenshots

### 🌙 Dark Mode
Beautiful dark theme with glassmorphism effects

### ☀️ Light Mode  
Clean, professional light theme with blue accents

### 📱 Responsive Design
Perfectly adapted for all screen sizes

---

## 🎯 Key Features in Detail

### 🧠 AI-Powered Plan Generation
- Uses structured JSON schema for reliable output
- Multi-model fallback system for reliability
- Optimized prompts for speed and accuracy
- Handles malformed responses gracefully

### 🎨 Theme System
- Smooth animated transitions
- Loading effect during theme change
- Persistent preference storage
- Theme-aware components throughout

### 📊 Form Validation
- Real-time input validation
- Required field checking
- Type-safe number inputs
- User-friendly error messages

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

Need help? Have questions?

- 📧 Email: uttamofficial005@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/ai-fitness-coach/issues)
- 💡 Discussions: [GitHub Discussions](https://github.com/YOUR_USERNAME/ai-fitness-coach/discussions)

---

## 🙏 Acknowledgments

- Google AI team for the amazing Gemini API
- React team for the fantastic framework
- Tailwind CSS for the utility-first styling
- Lucide for beautiful icons
- Vercel for seamless deployment

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Made with ❤️ and AI**

[⬆ Back to Top](#-ai-fitness-coach-)

</div>
