# CodeForge AI — Backend

> Node.js + Express REST API powering a 4-agent AI pipeline that turns startup ideas into complete software blueprints.

---

## Tech Stack

| Layer          | Technology                              |
|----------------|-----------------------------------------|
| Runtime        | Node.js (ES Modules)                    |
| Framework      | Express.js v5                           |
| Database       | MongoDB + Mongoose ODM                  |
| AI Provider    | Groq SDK (Meta LLaMA 4 Scout model)     |
| Authentication | JWT (jsonwebtoken) + bcryptjs           |
| Payments       | Razorpay (INR)                          |
| Dev Server     | Nodemon                                 |
| Config         | dotenv                                  |
| CORS           | cors middleware                         |

---

## Folder Structure

```
backend/
├── src/
│   ├── server.js                  ← App entry point, Express setup, route mounting
│   ├── config/
│   │   ├── db.js                  ← MongoDB connection via Mongoose
│   │   └── groq.js                ← Groq client + model constant
│   ├── agents/
│   │   ├── pmAgent.js             ← PM Agent: requirements & user stories
│   │   ├── architectAgent.js      ← Architect Agent: system design & tech stack
│   │   ├── backendAgent.js        ← Backend Agent: folder structure, models, APIs
│   │   └── qaAgent.js             ← QA Agent: test cases & QA report
│   ├── workflows/
│   │   └── projectWorkflow.js     ← Orchestrates all 4 agents sequentially
│   ├── controllers/
│   │   └── projectController.js   ← Project generation, history, single project fetch
│   ├── routes/
│   │   ├── authRoutes.js          ← /api/auth — register, login, me
│   │   ├── projectRoutes.js       ← /api/project — generate, history, :id
│   │   └── paymentRoutes.js       ← /api/payment — create-order, verify
│   ├── models/
│   │   ├── User.js                ← User schema: name, email, password, credits, plan
│   │   └── Project.js             ← Project schema: idea + 4 agent outputs
│   ├── middleware/
│   │   └── authMiddleware.js      ← JWT Bearer token verification
│   └── test files (testGroq, testPM, testArchitect, testBackendAgent, testQA, testWorkflow)
├── main.py                        ← Python entry point (FastAPI/LangGraph experiments)
├── requirements.txt               ← Python dependencies (FastAPI, LangGraph, LangChain)
├── package.json
├── .env                           ← Environment secrets (not committed)
└── .gitignore
```

---

## File-by-File Explanation

### `src/server.js` — Application Entry Point
The root of the Express application.
- Loads environment variables via `dotenv`.
- Calls `connectDB()` to establish the MongoDB connection before the server starts.
- Mounts three route groups: `/api/auth`, `/api/project`, `/api/payment`.
- Enables `cors()` so the React frontend (port 3000/5173) can communicate with the API (port 5000).
- Starts listening on **port 5000**.

---

### `src/config/db.js` — Database Connection
Connects to MongoDB using Mongoose.
- Reads `MONGO_URI` from `.env`.
- Exits the process (`process.exit(1)`) if the connection fails — prevents the app from running in a broken state.

---

### `src/config/groq.js` — AI Client Configuration
Central configuration for the Groq API client.
- Initialises the `Groq` client with `GROQ_API_KEY` from `.env`.
- Exports a shared `MODEL` constant (`meta-llama/llama-4-scout-17b-16e-instruct`) used by all four agents, so changing the model in one place updates all agents instantly.

---

### `src/agents/pmAgent.js` — PM Agent
Acts as a **Senior Product Manager**.

**Input:** Raw idea string (free text)  
**Output:** Markdown document with:
- Functional Requirements
- User Stories
- Acceptance Criteria

Uses `temperature: 0.3` for consistent, professional output.

---

### `src/agents/architectAgent.js` — Architect Agent
Acts as a **Senior Software Architect**.

**Input:** Requirements string from PM Agent (sliced to 1500 chars)  
**Output:** Markdown document with:
- High-Level Architecture
- Recommended Tech Stack
- Database Schema
- REST API Endpoints
- Folder Structure (tree format)

Uses `temperature: 0.2` for deterministic, precise technical decisions.

---

### `src/agents/backendAgent.js` — Backend Agent
Acts as a **Senior Backend Engineer**.

**Input:** Requirements + Architecture (both sliced to 800 chars each)  
**Output:** Markdown document with:
- Backend Folder Structure (tree format)
- Database Models with key fields
- Controller file list
- Route file list
- API methods and endpoints

---

### `src/agents/qaAgent.js` — QA Agent
Acts as a **Senior QA Engineer**.

**Input:** Requirements + Architecture + Backend (each sliced to 600 chars)  
**Output:** Markdown document with:
- Top 5 Functional Test Cases
- Top 5 API Test Cases
- Top 3 Edge Cases
- Top 3 Security Test Cases
- Top 3 Performance Test Cases

---

### `src/workflows/projectWorkflow.js` — Workflow Orchestrator
The **sequential pipeline** that wires all four agents together.

```
idea
  → pmAgent()        → requirements
  → architectAgent() → architecture
  → backendAgent()   → backend
  → qaAgent()        → qa
  → { requirements, architecture, backend, qa }
```

Each agent's output feeds the next one, building context progressively. This is the single function called by the project controller.

---

### `src/controllers/projectController.js` — Project Controller

**`generateProject`**
1. Checks user has ≥ 5 credits.
2. Deducts 5 credits **before** calling the AI (prevents free abuse on failure).
3. Calls `runWorkflow(idea)` to run the 4-agent pipeline.
4. Saves the full result to MongoDB as a `Project` document.
5. Refunds credits if the workflow throws an error.

**`getHistory`**  
Returns all projects for the logged-in user, sorted newest first. Only returns `idea`, `createdAt`, and `_id` (lightweight list).

**`getProject`**  
Returns a single full project by ID. Verifies the requesting user owns the project.

---

### `src/routes/authRoutes.js` — Auth Routes

| Method | Endpoint            | Description                          |
|--------|---------------------|--------------------------------------|
| POST   | `/api/auth/register`| Create account, returns JWT + user   |
| POST   | `/api/auth/login`   | Login, returns JWT + user            |
| GET    | `/api/auth/me`      | Get logged-in user profile (protected)|

JWTs are signed with `JWT_SECRET`, expire in **7 days**.  
New users receive **10 free credits** on registration.

---

### `src/routes/projectRoutes.js` — Project Routes

| Method | Endpoint                 | Description                      |
|--------|--------------------------|----------------------------------|
| POST   | `/api/project/generate`  | Run the 4-agent pipeline         |
| GET    | `/api/project/history`   | Get user's project list          |
| GET    | `/api/project/:id`       | Get a single project by ID       |

All routes are protected by `authMiddleware`.

---

### `src/routes/paymentRoutes.js` — Payment Routes (Razorpay)

| Method | Endpoint                   | Description                           |
|--------|----------------------------|---------------------------------------|
| POST   | `/api/payment/create-order`| Creates a Razorpay order, returns order ID |
| POST   | `/api/payment/verify`      | Verifies HMAC signature, credits user |

**Plans:**
| Plan       | Amount (INR paise) | Credits |
|------------|--------------------|---------|
| Basic      | ₹5 (500 paise)     | 100     |
| Pro        | ₹19 (1900 paise)   | 400     |
| Enterprise | ₹49 (4900 paise)   | 1000    |

Payment verification uses HMAC-SHA256 to prevent forged webhooks.

---

### `src/middleware/authMiddleware.js` — Auth Middleware
`protect` function:
- Reads `Authorization: Bearer <token>` header.
- Verifies the JWT using `JWT_SECRET`.
- Fetches the user from MongoDB (excluding password).
- Attaches `req.user` for downstream route handlers.
- Returns `401` if the token is missing, invalid, or expired.

---

### `src/models/User.js` — User Model

| Field     | Type   | Default    | Notes                           |
|-----------|--------|------------|---------------------------------|
| name      | String | required   | Trimmed                         |
| email     | String | required   | Unique, lowercase               |
| password  | String | required   | Min 6 chars, bcrypt hashed      |
| credits   | Number | `10`       | Free credits on signup          |
| plan      | String | `"free"`   | enum: free/basic/pro/enterprise |
| createdAt | Date   | auto       | Added by `timestamps: true`     |
| updatedAt | Date   | auto       | Added by `timestamps: true`     |

Password is hashed with **bcrypt (salt rounds: 10)** via a `pre("save")` hook. Password comparison uses `matchPassword()` instance method.

---

### `src/models/Project.js` — Project Model

| Field        | Type     | Notes                                  |
|--------------|----------|----------------------------------------|
| user         | ObjectId | References `User` (ownership)          |
| idea         | String   | The raw input from the user            |
| requirements | String   | PM Agent output (markdown)             |
| architecture | String   | Architect Agent output (markdown)      |
| backend      | String   | Backend Agent output (markdown)        |
| qa           | String   | QA Agent output (markdown)             |
| createdAt    | Date     | Auto-generated                         |
| updatedAt    | Date     | Auto-generated                         |

---

### `main.py` & `requirements.txt` — Python Layer
An experimental Python FastAPI / LangGraph backend that was explored during development. Contains dependencies for:
- **FastAPI** + **Uvicorn** — async Python web server
- **LangChain** + **LangGraph** — alternative agent orchestration framework
- **OpenAI SDK** — alternative AI provider tested during development

Not active in the current production flow (Node.js is the active server).

---

### Test Files (`src/test*.js`)
Individual runner scripts for testing each layer in isolation during development:
- `testGroq.js` — raw Groq API connection test
- `testPM.js` — PM Agent output
- `testArchitect.js` — Architect Agent output
- `testBackendAgent.js` — Backend Agent output
- `testQA.js` — QA Agent output
- `testWorkflow.js` — full 4-agent pipeline end-to-end

---

## Environment Variables (`.env`)

```env
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/codeforge
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

---

## Running the Backend

```bash
# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server starts at: `http://localhost:5000`

---

## API Summary

```
POST   /api/auth/register        → Register user
POST   /api/auth/login           → Login user
GET    /api/auth/me              → Get current user (auth required)

POST   /api/project/generate     → Generate blueprint (auth + 5 credits)
GET    /api/project/history      → Get project list (auth required)
GET    /api/project/:id          → Get single project (auth required)

POST   /api/payment/create-order → Create Razorpay order (auth required)
POST   /api/payment/verify       → Verify payment + add credits (auth required)
```
