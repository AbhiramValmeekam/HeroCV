# AI Resume Builder

A modern, production-ready AI-powered resume builder web application built with React, TypeScript, Node.js, Express, and MongoDB. Leverages Google Gemini AI for intelligent resume suggestions, ATS analysis, and job matching.

## Features

### Core
- 🔐 JWT Authentication (Register, Login, Logout)
- 📝 Full Resume CRUD (Create, Edit, Delete, Duplicate)
- 📄 4 Professional Templates (Modern, ATS-Friendly, Minimal, Creative)
- 👁️ Live Resume Preview with real-time updates
- 📥 One-click PDF Export

### AI-Powered
- 🤖 AI Professional Summary Generator
- ✨ AI Bullet Point Enhancer
- 🎯 AI Skills Recommender
- 📊 AI Resume Improvement Suggestions

### Analysis Tools
- 🔍 ATS Score Analyzer (0-100 score with detailed feedback)
- 🎯 Job Description Matcher (match percentage, missing skills)

### Resume Sections
Personal Info, Summary, Education, Experience, Projects, Skills, Certifications, Achievements, Languages, Social Links, Custom Sections

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Tailwind CSS v4, React Router, Axios |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB with Mongoose ODM |
| Authentication | JWT + bcrypt |
| AI | Google Gemini API |
| PDF | jsPDF + html2canvas |
| Icons | Lucide React |

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### Installation

1. **Clone and enter the project:**
```bash
cd ai-resume-builder
```

2. **Setup the backend:**
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and Gemini API key
npm install
npm run dev
```

3. **Setup the frontend (new terminal):**
```bash
cd client
npm install
npm run dev
```

4. **Open the app:** Navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the `server/` directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-resume-builder
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
GEMINI_API_KEY=your_google_gemini_api_key_here
```

## Project Structure

```
ai-resume-builder/
├── client/           # React Frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── context/      # React Context (Auth, Resume)
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── utils/        # Utilities (PDF export)
│   └── ...
├── server/           # Express Backend
│   ├── src/
│   │   ├── config/       # DB config
│   │   ├── controllers/  # Route handlers
│   │   ├── middleware/    # Auth, error handling
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── services/     # Gemini AI service
│   └── ...
└── README.md
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Resumes
- `GET /api/resumes` - List resumes
- `GET /api/resumes/:id` - Get resume
- `POST /api/resumes` - Create resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume
- `POST /api/resumes/:id/duplicate` - Duplicate resume

### AI
- `POST /api/ai/generate-summary` - Generate professional summary
- `POST /api/ai/enhance-bullet` - Enhance bullet point
- `POST /api/ai/suggest-skills` - Suggest skills
- `POST /api/ai/improve-resume` - Improvement suggestions
- `POST /api/ai/ats-analyze` - ATS analysis
- `POST /api/ai/job-match` - Job description matching

## License

MIT
