# CodeForge AI — Frontend

> React 19 single-page application built with Vite and Tailwind CSS v4. Provides the user interface for authenticating, generating AI-powered software blueprints, managing credits, and making payments via Razorpay.

---

## Tech Stack

| Layer       | Technology                             |
|-------------|----------------------------------------|
| Framework   | React 19                               |
| Build Tool  | Vite 8                                 |
| Styling     | Tailwind CSS v4 (via @tailwindcss/vite)|
| HTTP Client | Axios                                  |
| Markdown    | react-markdown                         |
| Payments    | Razorpay Checkout JS (loaded dynamically)|
| Linting     | ESLint 10 + react-hooks + react-refresh|

---

## Folder Structure

```
frontend/
├── public/
│   ├── favicon.svg            ← Browser tab icon
│   └── icons.svg              ← SVG icon sprite
├── src/
│   ├── main.jsx               ← React DOM root, StrictMode wrapper
│   ├── App.jsx                ← Root component, page router, auth state
│   ├── index.css              ← Global Tailwind imports + custom CSS classes
│   ├── pages/
│   │   ├── LandingPage.jsx    ← Public marketing page with Navbar, Hero, Features, Pricing
│   │   ├── AuthPage.jsx       ← Sign In / Sign Up toggled form
│   │   └── DashboardPage.jsx  ← Authenticated workspace (generate + history)
│   ├── components/
│   │   ├── AgentPipeline.jsx  ← Animated 4-agent progress visualiser
│   │   ├── ResultsPanel.jsx   ← Tabbed markdown output viewer with copy/export
│   │   ├── InputCard.jsx      ← Idea textarea + Generate button
│   │   ├── ErrorCard.jsx      ← Error display with retry button
│   │   └── Hero.jsx           ← Hero section text block (used in older layout)
│   ├── api/
│   │   ├── auth.js            ← register(), login(), getMe() — axios wrappers
│   │   └── projects.js        ← generateProject(), getHistory(), getProject()
│   └── store/
│       └── useCredits.js      ← Custom hook for local credits state management
├── index.html                 ← Vite HTML shell, mounts #root
├── vite.config.js             ← Vite config with React + Tailwind plugins
├── eslint.config.js           ← ESLint flat config
└── package.json
```

---

## File-by-File Explanation

### `index.html` — HTML Shell
The single HTML file Vite serves. Contains the `<div id="root">` mount point and loads `/src/main.jsx` as an ES module. Vite injects the built JS bundle here during production builds.

---

### `src/main.jsx` — React Entry Point
Bootstraps the React application:
- Creates the React DOM root attached to `#root`.
- Wraps the `<App />` component in `<StrictMode>` to surface potential bugs in development.
- Imports `index.css` to activate Tailwind globally.

---

### `src/App.jsx` — Root Component & Page Router
The central state manager and client-side router. Uses simple `useState("page")` instead of React Router to keep the SPA minimal.

**Pages managed:**
- `"landing"` → `<LandingPage />`
- `"auth"` → `<AuthPage />`
- `"dashboard"` → `<DashboardPage />`

**Responsibilities:**
- On mount, reads `localStorage.getItem("token")` and calls `getMe()` to restore a saved session. Shows a spinner while checking.
- `handleLogin(userData, jwt)` — saves token to `localStorage`, updates state, navigates to dashboard.
- `handleLogout()` — clears token from `localStorage`, resets state, returns to landing.
- `handlePaymentSuccess(newCredits)` — updates `user.credits` without a page reload.

---

### `src/index.css` — Global Styles
Imports Tailwind CSS v4 and the typography plugin. Also defines reusable CSS classes used throughout the app:

| Class         | Purpose                                                         |
|---------------|-----------------------------------------------------------------|
| `.glow-purple`| Violet box-shadow glow effect for CTA buttons                   |
| `.glass-card` | Semi-transparent glassmorphism card (blur + subtle border)      |
| `.input-box`  | Transparent text area styling for the idea input                |
| `.dark-input` | Styled input for auth forms with focus ring                     |
| `.prose-dark` | Dark-mode typography overrides for react-markdown rendering     |

---

## Pages

### `src/pages/LandingPage.jsx` — Marketing / Public Page
The first page visitors see. Fully self-contained with its own data arrays.

**Sections:**
1. **Navbar** — sticky, blurred glass effect. Links scroll to page anchors. "Get Started" button navigates to Auth.
2. **Hero** — gradient headline, animated idea input box, "Generate with AI →" button.
3. **Features** — grid of 4 agent cards (PM, Architect, Backend, QA) explaining each agent's role.
4. **How It Works** — 4-step numbered cards explaining the user journey.
5. **Pricing** — 3 plan cards (Basic/Pro/Enterprise) with Razorpay buy buttons.
6. **Footer** — copyright line.

**Payment flow (within LandingPage):**
1. Dynamically loads the Razorpay checkout script from their CDN.
2. Calls `POST /api/payment/create-order` to get an `orderId`.
3. Opens the Razorpay popup modal.
4. On success, calls `POST /api/payment/verify` to validate the HMAC signature and credit the user.
5. Calls `onPaymentSuccess(credits)` prop to update App state.

---

### `src/pages/AuthPage.jsx` — Authentication Page
A single page with a toggle between **Sign In** and **Sign Up** modes.

**Sign Up flow:**
- Collects name, email, password.
- Calls `register()` from `src/api/auth.js`.
- Saves JWT to `localStorage`.
- Calls `onLogin(user, token)` prop to update App state.

**Sign In flow:**
- Collects email, password.
- Calls `login()` from `src/api/auth.js`.
- Same post-login handling as Sign Up.

Displays inline validation errors (empty fields, short password) and server errors from the API response.

---

### `src/pages/DashboardPage.jsx` — Main Workspace (Authenticated)
The core product experience. Only accessible after login.

**Layout:**
- **Navbar** — shows credit balance (colour-coded: violet when positive, red when zero), History toggle, username, Sign Out.
- **Sidebar** — slides in when History is toggled. Lists past projects with idea preview and date. Clicking a project loads its full output.
- **Main Area** — idea input, agent pipeline animation, results panel.

**Key behaviours:**
- `handleGenerate()` — sends idea to `/api/project/generate`, shows `<AgentPipeline>` during loading, renders `<ResultsPanel>` on success.
- Credits deducted locally by 5 after each successful generation (server-side deduction already happened).
- Out-of-credits banner with a "Buy credits →" button that navigates back to the landing page pricing section.
- Enter key triggers generation (Shift+Enter for newline).

---

## Components

### `src/components/AgentPipeline.jsx` — Agent Progress Visualiser
Displays a live animated view of which agent is currently running.

- Only renders when `loading` is `true`.
- Cycles through 4 agents, advancing every **8 seconds** using `setTimeout`.
- Each agent card shows one of three states:
  - **Running** — highlighted background, bouncing icon, coloured "Running" badge.
  - **Done** — muted, green "Done ✓" badge.
  - **Waiting** — dimmed (opacity 0.35).
- Cleans up all timeouts on unmount or when `loading` becomes `false`.

---

### `src/components/ResultsPanel.jsx` — Output Viewer
Renders the 4-agent output in a tabbed interface.

**Tabs:** PM Report · Architecture · Backend · Backend

**Features:**
- Tab bar with colour-coded active state per agent (violet/green/blue/rose).
- `📋 Copy` button — copies current tab's markdown to clipboard via `navigator.clipboard`.
- `⬇ Export` button — downloads current tab as a `.md` file using a Blob URL.
- Renders markdown via `<ReactMarkdown>` inside `.prose-dark` styles for clean dark-mode typography.

---

### `src/components/InputCard.jsx` — Idea Input
Reusable textarea card with a Generate button.
- "🎲 Try an Example" button fills the textarea with a sample food delivery app idea.
- Generate button is disabled when `loading` is true or the idea is empty.
- Shows an animated spinner inside the button while loading.

*(Used in the older DashboardPage layout; current DashboardPage has its own inline input.)*

---

### `src/components/ErrorCard.jsx` — Error Display
A rose-coloured error banner shown when generation fails.
- Displays the error message from the API.
- "🔄 Retry" button calls `onRetry` prop to re-trigger generation.

---

### `src/components/Hero.jsx` — Hero Text Block
A simple presentational component containing the landing headline and subtitle. Stateless — no props, no logic.

---

## API Layer (`src/api/`)

All API functions use Axios and point to `http://localhost:5000/api`.

### `src/api/auth.js`

| Function          | Method | Endpoint           | Auth Required |
|-------------------|--------|--------------------|---------------|
| `register(name, email, password)` | POST | `/auth/register` | No |
| `login(email, password)`          | POST | `/auth/login`    | No |
| `getMe(token)`                    | GET  | `/auth/me`       | Yes (Bearer)  |

All return `{ token, user }` on success.

### `src/api/projects.js`

| Function                    | Method | Endpoint              | Auth Required |
|-----------------------------|--------|-----------------------|---------------|
| `generateProject(idea, token)` | POST | `/project/generate` | Yes           |
| `getHistory(token)`            | GET  | `/project/history`  | Yes           |
| `getProject(id, token)`        | GET  | `/project/:id`      | Yes           |

Token is passed as `Authorization: Bearer <token>` header on every call.

---

## Store (`src/store/`)

### `src/store/useCredits.js` — Credits Hook
A minimal custom React hook for local credit state management.

```js
const { credits, addCredits, spendCredits } = useCredits(initialCredits);
```

- `spendCredits()` — deducts `GENERATION_COST` (5) and returns `false` if insufficient balance.
- `addCredits(amount)` — adds credits after a successful payment.
- Exported constant `GENERATION_COST = 5` is shared with the dashboard.

*Note: The dashboard uses this as a local optimistic update. The authoritative credit value lives in MongoDB.*

---

## Running the Frontend

```bash
# Install dependencies
npm install

# Development server (hot module replacement)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

Development server starts at: `http://localhost:5173`

---

## How Frontend Connects to Backend

All communication goes through Axios in `src/api/`. The base URL is hardcoded to `http://localhost:5000/api`.

```
User Action → React Component → api/*.js (Axios) → Express API (port 5000) → MongoDB / Groq
```

Authentication is stateless — the JWT token stored in `localStorage` is attached to every protected request as a Bearer token. No cookies or sessions are used.
