DevMind-AI


> Transform a raw startup idea into a complete software blueprint in seconds — powered by a pipeline of 4 specialized AI agents.

---

 What is DevMind-AI
?

DevMind-AI
 is a full-stack SaaS application that simulates a senior engineering team. You type your idea in plain English. Four AI agents — each with a distinct role — work sequentially to produce a professional software blueprint covering requirements, architecture, backend design, and QA.

What normally takes a team of engineers 1–2 weeks to plan gets produced in under 30 seconds.

---

## STAR Overview

### Situation
Early-stage founders, indie developers, and product managers often struggle to translate a raw idea into a structured technical plan. Hiring a product manager, architect, backend engineer, and QA engineer for the planning phase is expensive and slow.

### Task
Build an AI-powered platform that automates the entire software planning workflow — from idea to actionable blueprint — while being accessible to non-technical users.

### Action
Built a 4-agent AI pipeline where each agent has a specific role:
- A **PM Agent** that writes requirements and user stories
- An **Architect Agent** that designs the system and picks the tech stack
- A **Backend Agent** that defines models, controllers, and API endpoints
- A **QA Agent** that generates functional, API, security, and performance test cases

All agents are powered by **Meta LLaMA 4 Scout** via the **Groq API** for fast inference. The backend is a **Node.js + Express** REST API connected to **MongoDB**. The frontend is a **React 19 + Vite + Tailwind CSS v4** SPA. Users are authenticated via **JWT** and can buy more generation credits through **Razorpay** payment integration.

### Result
A complete, production-ready SaaS with:
- End-to-end AI-powered blueprint generation
- User authentication and per-user credit system
- Payment gateway integration with signature verification
- Project history and output export to Markdown
- Responsive dark-mode UI with real-time agent pipeline animation

---

## Languages & Technologies

### Backend
| Technology    | Purpose                                              |
|---------------|------------------------------------------------------|
| **JavaScript (Node.js)** | Server runtime, ES Modules               |
| **Express.js v5**        | REST API framework                       |
| **MongoDB + Mongoose**   | NoSQL database and ODM                   |
| **Groq SDK**             | AI inference — LLaMA 4 Scout model       |
| **JWT (jsonwebtoken)**   | Stateless authentication tokens          |
| **bcryptjs**             | Secure password hashing (salt rounds: 10)|
| **Razorpay**             | Indian payment gateway (INR)             |
| **dotenv**               | Environment variable management          |
| **cors**                 | Cross-origin request middleware          |
| **Nodemon**              | Dev server with auto-reload              |

### Frontend
| Technology          | Purpose                                         |
|---------------------|-------------------------------------------------|
| **JavaScript (React 19)** | UI component framework                    |
| **Vite 8**               | Build tool and dev server with HMR         |
| **Tailwind CSS v4**       | Utility-first CSS framework                |
| **Axios**                 | HTTP client for API communication          |
| **react-markdown**        | Renders AI markdown output in the UI       |
| **Razorpay Checkout JS**  | Client-side payment popup                  |

### AI / ML
| Technology              | Purpose                                       |
|-------------------------|-----------------------------------------------|
| **Groq API**            | Ultra-fast LLM inference cloud                |
| **Meta LLaMA 4 Scout**  | Foundation model for all 4 agents             |
| *(Python layer)*        | FastAPI + LangChain + LangGraph (experimental)|

---

## Project Structure

```
DevMind-AI/
├── backend/
│   ├── src/
│   │   ├── server.js              ← Express app entry point
│   │   ├── config/
│   │   │   ├── db.js              ← MongoDB connection
│   │   │   └── groq.js            ← Groq client + model config
│   │   ├── agents/
│   │   │   ├── pmAgent.js         ← PM Agent (requirements)
│   │   │   ├── architectAgent.js  ← Architect Agent (system design)
│   │   │   ├── backendAgent.js    ← Backend Agent (code structure)
│   │   │   └── qaAgent.js         ← QA Agent (test cases)
│   │   ├── workflows/
│   │   │   └── projectWorkflow.js ← Sequential 4-agent pipeline
│   │   ├── controllers/
│   │   │   └── projectController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── paymentRoutes.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Project.js
│   │   └── middleware/
│   │       └── authMiddleware.js
│   ├── main.py                    ← Python/FastAPI experimental layer
│   ├── requirements.txt           ← Python dependencies
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── main.jsx               ← React DOM entry
│   │   ├── App.jsx                ← Root component + page state
│   │   ├── index.css              ← Global styles + Tailwind
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    ← Marketing page + pricing
│   │   │   ├── AuthPage.jsx       ← Login / Register
│   │   │   └── DashboardPage.jsx  ← Main app workspace
│   │   ├── components/
│   │   │   ├── AgentPipeline.jsx  ← Animated agent progress UI
│   │   │   ├── ResultsPanel.jsx   ← Tabbed output with copy/export
│   │   │   ├── InputCard.jsx      ← Idea input component
│   │   │   ├── ErrorCard.jsx      ← Error display component
│   │   │   └── Hero.jsx           ← Landing hero text
│   │   ├── api/
│   │   │   ├── auth.js            ← Auth API wrappers
│   │   │   └── projects.js        ← Project API wrappers
│   │   └── store/
│   │       └── useCredits.js      ← Local credits state hook
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── package.json                   ← Root-level shared dependencies
```

---

## How the AI Pipeline Works

```
User Input (idea)
        │
        ▼
  ┌─────────────┐
  │  PM Agent   │  ← "You are a Senior Product Manager"
  │             │     Generates: Requirements, User Stories, Acceptance Criteria
  └──────┬──────┘
         │ requirements
         ▼
  ┌─────────────────┐
  │ Architect Agent │  ← "You are a Senior Software Architect"
  │                 │     Generates: Architecture, Tech Stack, DB Schema, APIs, Folder Structure
  └────────┬────────┘
           │ architecture
           ▼
  ┌────────────────┐
  │ Backend Agent  │  ← "You are a Senior Backend Engineer"
  │                │     Generates: Folder Structure, Models, Controllers, Routes, APIs
  └───────┬────────┘
          │ backend
          ▼
  ┌───────────────┐
  │   QA Agent    │  ← "You are a Senior QA Engineer"
  │               │     Generates: Functional, API, Edge, Security, Performance tests
  └───────┬───────┘
          │ qa
          ▼
  Full Blueprint { requirements, architecture, backend, qa }
```

Each agent receives the output of the previous one as context, so the QA report is grounded in the actual architecture and backend design — not generic test cases.

---

## AI Model

**Model used:** `meta-llama/llama-4-scout-17b-16e-instruct`  
**Provider:** [Groq](https://groq.com) — known for extremely fast inference (GroqChip hardware)  
**Temperature settings:**
- PM Agent: `0.3` (slightly creative, professional tone)
- Architect, Backend, QA Agents: `0.2` (deterministic, precise technical output)

The model is defined once in `backend/src/config/groq.js` and imported by all agents. Switching to a different model (e.g., `llama-3.3-70b-versatile`) requires a single line change.

---

## Datasets

CodeForge AI does not use any pre-trained dataset or fine-tuned model. It relies entirely on:

1. **Prompt Engineering** — Each agent is given a carefully crafted system prompt that assigns a role and specifies the exact output format (markdown, tree format, numbered sections).
2. **Context Chaining** — The output of each agent is passed as input context to the next one. This creates a coherent, project-specific output rather than generic responses.
3. **Input Slicing** — Each agent receives a sliced portion of its inputs (e.g., architecture is sliced to 1500 chars for the PM agent) to stay within token limits while preserving quality.

No training data, vector databases, embeddings, or RAG is involved in the current implementation.

---

## How Frontend and Backend are Connected

### Communication Protocol
The frontend and backend communicate over **HTTP/REST** using **Axios** on the client side and **Express.js** on the server side.

### Base URL
All API calls from the frontend point to:
```
http://localhost:5000/api
```
Defined in `frontend/src/api/auth.js` and `frontend/src/api/projects.js`.

### Authentication Flow
```
1. User registers or logs in via AuthPage
2. Backend validates credentials, signs a JWT (7-day expiry)
3. Frontend receives { token, user } and stores token in localStorage
4. App.jsx reads token from localStorage on every page load
5. getMe(token) is called to validate the token is still active
6. Every protected API call includes: Authorization: Bearer <token>
7. Backend authMiddleware verifies the token and attaches req.user
```

### Data Flow — Blueprint Generation
```
1. User types idea in DashboardPage textarea
2. User clicks "Generate with AI →"
3. DashboardPage calls apiGenerate(idea, token) from projects.js
4. Axios sends POST /api/project/generate with { idea } + Bearer token
5. Express authMiddleware verifies JWT
6. projectController checks user has ≥ 5 credits
7. Credits are deducted in MongoDB
8. runWorkflow(idea) fires the 4-agent pipeline via Groq API
9. Results { requirements, architecture, backend, qa } are saved to MongoDB
10. JSON response returned to frontend
11. DashboardPage sets result state
12. ResultsPanel renders the markdown output in 4 tabs
```

### Payment Flow
```
1. User clicks a plan on LandingPage pricing section
2. Razorpay checkout.js is loaded dynamically from Razorpay CDN
3. Frontend calls POST /api/payment/create-order with { plan }
4. Backend creates a Razorpay order, returns { orderId, amount, keyId }
5. Razorpay popup opens in the browser (handled by Razorpay JS SDK)
6. User completes payment inside the popup
7. Razorpay calls the handler function with { orderId, paymentId, signature }
8. Frontend calls POST /api/payment/verify with the 3 Razorpay fields
9. Backend verifies HMAC-SHA256 signature using RAZORPAY_KEY_SECRET
10. On valid signature: credits are added to User in MongoDB
11. Backend returns { success: true, credits: newTotal }
12. App.jsx updates user.credits in state — no page reload needed
```

### CORS
The backend uses the `cors()` middleware with no origin restrictions in development, allowing the Vite dev server (port 5173) to communicate with Express (port 5000) without browser blocking.

---

## Credit System

| Action      | Cost / Reward              |
|-------------|----------------------------|
| Sign up     | +10 free credits           |
| Generate    | −5 credits per generation  |
| Basic plan  | +100 credits (₹5)          |
| Pro plan    | +400 credits (₹19)         |
| Enterprise  | +1000 credits (₹49)        |

Credits are stored in MongoDB on the `User` document. The backend deducts credits **before** calling the AI to prevent free abuse. Credits are refunded if the AI workflow throws an error.

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Razorpay test account (free at [razorpay.com](https://razorpay.com))

### 1. Clone and install

```bash
git clone https://github.com/your-username/CodeForge-AI.git
cd CodeForge-AI

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure environment

Create `backend/.env`:

```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/codeforge
JWT_SECRET=your_super_secret_jwt_key_here
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

### 3. Run the backend

```bash
cd backend
npm run dev
# → Server running on http://localhost:5000
```

### 4. Run the frontend

```bash
cd frontend
npm run dev
# → App running on http://localhost:5173
```

### 5. Open in browser

Navigate to `http://localhost:5173`, register an account (get 10 free credits), and generate your first blueprint.

---

## API Reference

### Auth
| Method | Endpoint              | Body                        | Auth |
|--------|-----------------------|-----------------------------|------|
| POST   | `/api/auth/register`  | `{ name, email, password }` | No   |
| POST   | `/api/auth/login`     | `{ email, password }`       | No   |
| GET    | `/api/auth/me`        | —                           | Yes  |

### Projects
| Method | Endpoint                 | Body         | Auth |
|--------|--------------------------|--------------|------|
| POST   | `/api/project/generate`  | `{ idea }`   | Yes  |
| GET    | `/api/project/history`   | —            | Yes  |
| GET    | `/api/project/:id`       | —            | Yes  |

### Payments
| Method | Endpoint                    | Body                                    | Auth |
|--------|-----------------------------|-----------------------------------------|------|
| POST   | `/api/payment/create-order` | `{ plan }`                              | Yes  |
| POST   | `/api/payment/verify`       | `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, credits }` | Yes |

---

## Security Notes

- Passwords are hashed with **bcrypt** (never stored in plaintext).
- JWTs are verified on every protected request via middleware.
- Payment signatures are validated using **HMAC-SHA256** before crediting any user.
- Credits are deducted before AI calls to prevent abuse on server errors.
- Environment secrets are loaded from `.env` and never committed to source control.

---

## Future Enhancements

- Frontend Agent: Generate full React component code
- PDF export of blueprints
- Team collaboration and shared workspaces
- Webhook-based payment confirmation (production hardening)
- LangGraph multi-agent orchestration (Python layer is scaffolded)
- Rate limiting and abuse protection

---

*Built for developers who move fast. — DevMind AI*
