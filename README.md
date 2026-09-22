# MediBot - AI-Powered Hospital Chatbot 🏥🤖

A full-stack, enterprise-grade AI hospital chatbot integrated into a Hospital Management System (HMS) for **MetroHealth Memorial Hospital**.

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | Node.js, Express.js |
| Database | MongoDB (with automatic in-memory fallback) |
| AI Engine | Google Gemini API / OpenAI API / Medical Knowledge Engine |
| Auth | JWT + bcryptjs |
| Icons | Lucide React |

---

## ✨ Features

### 🤖 MediBot AI Chatbot
- **Floating chatbot button** (bottom-right) with pulse animation
- **Modern glassmorphism chat window** — responsive for desktop & mobile
- **Suggested quick-prompt chips** for instant questions
- **Voice input** (Web Speech API) and **Text-to-Speech** for bot replies
- **Clear chat** history with confirmation
- **Typing animation** and loading states

### 💬 Chatbot Capabilities
- Hospital FAQs and department information
- Live OPD timings and visiting hours
- Doctor directory search by specialization
- Appointment booking (conversational & one-click)
- Cancel / reschedule appointments for logged-in patients
- Show upcoming appointments (patient-specific)
- Billing procedures and cashless insurance guidance
- Medical reports access instructions
- General health information
- **Emergency triage with red-alert safety guardrail**

### 🔐 Security & Auth
- JWT authentication for patients
- Role-based authorization (patients only see their own data)
- AI API keys **never exposed** to the frontend
- Passwords hashed with bcryptjs

### 🏥 Hospital Management System Landing Page
- Department cards with doctor counts
- Full doctor directory with search/filter
- Book appointment modal with time-slot picker
- Patient's My Appointments modal with cancel functionality
- Emergency banner with direct call button

---

## 🛡️ Medical Safety Guardrails

> **MediBot will NEVER diagnose diseases, interpret labs/imaging as definitive clinical findings, or prescribe medications/dosages.**

- Automatically detects emergency keywords (chest pain, stroke, unconscious, severe bleeding, etc.)
- Triggers **red high-priority emergency alerts** with the 24/7 hotline number
- Always directs users to consult qualified healthcare professionals for clinical concerns

---

## 📁 Project Structure

```
mediash/
├── backend/
│   ├── config/
│   │   ├── db.js                # MongoDB connection + in-memory fallback
│   │   └── memoryStore.js       # Zero-dependency in-memory data store
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── chatController.js
│   │   ├── departmentController.js
│   │   ├── doctorController.js
│   │   └── appointmentController.js
│   ├── middleware/
│   │   └── auth.js              # JWT protect + optionalAuth
│   ├── models/
│   │   ├── User.js
│   │   ├── Doctor.js
│   │   ├── Department.js
│   │   ├── Appointment.js
│   │   ├── ChatHistory.js
│   │   └── modelProxy.js        # Seamless Mongoose ↔ MemoryStore proxy
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── departmentRoutes.js
│   │   └── appointmentRoutes.js
│   ├── seeds/
│   │   └── seed.js              # Sample departments, doctors & patients
│   ├── services/
│   │   └── aiService.js         # Gemini / OpenAI / Medical Rule Engine
│   ├── .env.example
│   ├── server.js
│   └── test_api.js              # Automated 11-test API verification suite
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Chatbot/
    │   │   │   ├── MediBotWidget.jsx  # Floating launcher + session management
    │   │   │   ├── ChatWindow.jsx     # Full chat UI with controls
    │   │   │   ├── ChatMessage.jsx    # Rich message cards (doctor, appointment, emergency)
    │   │   │   └── SuggestedQuestions.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── HeroSection.jsx
    │   │   ├── DepartmentGrid.jsx
    │   │   ├── DoctorDirectory.jsx
    │   │   ├── EmergencyBanner.jsx
    │   │   ├── AuthModal.jsx
    │   │   ├── BookAppointmentModal.jsx
    │   │   ├── MyAppointmentsModal.jsx
    │   │   └── Footer.jsx
    │   ├── services/
    │   │   └── api.js            # Frontend API client (JWT-aware)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── index.html
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (optional — automatic in-memory fallback included)
- A Gemini or OpenAI API key (optional — Medical Knowledge Engine is the default)

### 1. Clone & Install

```bash
git clone https://github.com/harshgorlewar34-jpg/healthcare-assistant.git
cd healthcare-assistant
```

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/medibot

# JWT Secret
JWT_SECRET=medibot_super_secure_jwt_secret_2026_key

# AI Provider: "gemini", "openai", or leave blank for rule-based engine
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=
```

> **Note:** If no API key is provided, the built-in Medical Knowledge Engine handles all queries — the app is 100% functional without any AI key.

> **Note:** If MongoDB is not running, the server automatically switches to an instant in-memory database with pre-seeded sample data — no setup required.

### 3. Run the Application

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🚀

---

## 🧪 Automated Tests

Run 11 end-to-end API tests:

```bash
cd backend
# Make sure server is running first (node server.js)
node test_api.js
```

Tests cover:
1. Health check
2. Fetch all departments
3. Fetch all doctors
4. Patient login (JWT)
5. View patient appointments
6. Chat — Hospital timings query
7. Chat — Doctor search by specialization
8. **Chat — Emergency medical safety guardrail** ✅
9. Chat — Show authenticated user's appointments
10. Book appointment via API
11. Cancel appointment via API

---

## 🔌 API Documentation

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Create patient account | — |
| POST | `/api/auth/login` | Login, returns JWT | — |
| GET | `/api/auth/me` | Get current user profile | ✅ JWT |

### Hospital Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/departments` | List all departments with doctor counts |
| GET | `/api/departments/:id` | Single department + doctors |
| GET | `/api/doctors` | List all doctors (filter: `?specialization=`, `?search=`) |
| GET | `/api/doctors/:id` | Single doctor details |

### Appointments
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/appointments` | List current patient's appointments | ✅ JWT |
| POST | `/api/appointments` | Book a new appointment | ✅ JWT |
| DELETE | `/api/appointments/:id` | Cancel an appointment | ✅ JWT |
| PATCH | `/api/appointments/:id/reschedule` | Reschedule appointment | ✅ JWT |

### AI Chatbot
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/chat` | Send message, get AI reply | Optional JWT |
| GET | `/api/chat/history` | Retrieve chat session messages | Optional JWT |
| DELETE | `/api/chat/history` | Clear chat session | Optional JWT |

**Chat Request Body:**
```json
{
  "message": "Which cardiologists are available?",
  "sessionId": "optional-session-id"
}
```

---

## 👤 Demo Credentials

| Name | Email | Password | MRN | Role |
|------|-------|----------|-----|------|
| John Doe | `john@example.com` | `password123` | MED-1001 | Patient |
| Sarah Connor | `sarah@example.com` | `password123` | MED-1002 | Patient |

---

## 🩺 Sample Departments

Cardiology • Neurology • Pediatrics • Orthopedics & Joint Care • Oncology • Dermatology • General Medicine • Radiology & Diagnostic Imaging

---

## 🤖 AI Configuration

### Option 1: Google Gemini (Recommended)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_api_key_from_aistudio.google.com
```

### Option 2: OpenAI
```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_api_key_from_platform.openai.com
```

### Option 3: Built-in Medical Knowledge Engine (Default / No Key Needed)
The deterministic rule engine handles all standard hospital queries:
- Hospital timings, departments, billing, reports
- Doctor search by specialization with rich doctor cards
- Appointment viewing and cancellation actions
- Emergency triage with red-alert cards
- General health guidance (with medical safety reminders)

---

## 📋 Medical Disclaimer

This application is for informational and administrative hospital guidance only. MediBot is **not a licensed medical professional** and does not provide clinical diagnosis or prescription services. Always consult a qualified healthcare professional for medical advice.

---

*Built with ❤️ — MetroHealth Memorial Hospital AI Suite*
