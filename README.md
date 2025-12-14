# 📚 Text-to-Learn: AI-Powered Course Generator

## 🎯 Overview
Text-to-Learn is a full-stack web application that transforms any topic into a structured, multi-module online course using AI. Users can input a topic prompt, and the application automatically generates a complete course with modules, lessons, objectives, code examples, quizzes, and video suggestions.

## 🌐 Live Demo
- **Frontend:** https://text-to-learn-5v9z.vercel.app
- **Backend API:** https://text-to-learn-app.onrender.com/health

## ✨ Key Features
- ✅ **AI-Powered Course Generation** - Generate complete courses from topic prompts
- ✅ **Rich Lesson Content** - Text, code blocks, MCQs, video suggestions
- ✅ **User Authentication** - Secure login via Auth0
- ✅ **Save & Persist Courses** - Save generated courses to your library
- ✅ **PDF Export** - Download lessons as formatted PDFs
- ✅ **Multilingual Support** - Hinglish audio explanations (via Gemini TTS)
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **YouTube Integration** - Dynamic video suggestions for each lesson

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool (fast development)
- **React Router** - Navigation
- **Auth0** - Authentication
- **CSS** - Custom styling with animations
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Auth0** - JWT validation
- **Google Gemini API** - AI course generation & Hinglish TTS
- **YouTube Data API** - Video search

### Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

## 📋 Project Structure

## 📁 Project Structure

### Backend

```text
text-to-learn-backend/
├── server.js
│   ├── Initializes Express app
│   ├── Configures middleware (CORS, JSON parsing)
│   ├── Connects to MongoDB
│   ├── Registers routes
│   └── Starts server
│
├── config/
│   └── db.js
│       └── MongoDB connection logic
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── attachUser.js
│   └── errorMiddleware.js
│
├── models/
│   ├── Course.js
│   ├── Module.js
│   ├── Lesson.js
│   └── User.js
│
├── routes/
│   ├── aiRoutes.js
│   ├── courseRoutes.js
│   ├── moduleRoutes.js
│   ├── lessonRoutes.js
│   └── enrichment.js
│
├── controllers/
│   ├── aiController.js
│   ├── courseController.js
│   ├── moduleController.js
│   └── lessonController.js
│
├── services/
│   ├── aiService.js
│   ├── multilingualService.js
│   ├── youtubeService.js
│   ├── pdfExportService.js
│   ├── promptTemplates.js
│   └── validator.js
│
├── utils/
│
├── .env.example
├── .gitignore
├── package.json




text-to-learn-frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
│
├── src/
│   ├── index.js
│   ├── App.jsx
│   ├── App.css
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── context/
│   └── index.css
│
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md

└── README.md


