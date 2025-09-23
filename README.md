# Chatbot Platform (MVP)

A minimal chatbot platform that allows users to create projects/agents, associate prompts with these agents, and interact with them through an integrated chat interface.



## Features

* User authentication & registration (via **Clerk**)
* Secure login with email & password
* Create projects/agents under a user
* Store and associate prompts with each project/agent
* Chat interface to interact with projects using LLM APIs (Gemini)
* Persistent message history per project
* Multi-user support with isolated projects
* (Good to have) Upload and manage files within a project

---

## Tech Stack

* **Frontend & Backend**: Next.js (App Router)
* **Database**: PostgreSQL (via Prisma ORM)
* **Auth**: Clerk (JWT/OAuth2-based)
* **LLM**: OpenAI Responses API / OpenRouter API
* **Deployment**: Vercel
* **Other**: TypeScript, TailwindCSS, Zod

---

## Setup Instructions

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd chatbot-platform
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file (or copy `.env.example`) and fill in:

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
OPENAI_API_KEY=your_openai_key
CLERK_PUBLISHABLE_KEY=your_clerk_pk
CLERK_SECRET_KEY=your_clerk_sk
```

### 4. Run Prisma migrations

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

Visit: `http://localhost:3000`

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub.
2. Import project in [Vercel](https://vercel.com).
3. Add environment variables in Vercel dashboard.
4. Run `npx prisma generate` in a build step if needed.
5. Use **Prisma Accelerate / Data Proxy** if you encounter connection or engine errors.

---

## 🎮 Usage

1. Sign up or log in.
2. Create a new project/agent.
3. Add a system prompt.
4. Open the chat interface and start interacting.
5. (Optional) Upload files to associate with a project.

---

## 🏗️ Architecture Overview

* **Auth Layer**: Clerk (session tokens, middleware-protected routes)
* **API Layer**: Next.js route handlers (`/api/projects`, `/api/messages`, `/api/prompts`)
* **Database**: Postgres schema with `User`, `Project`, `Message`, `Prompt`, `ProjectFile`
* **LLM Integration**: API calls to OpenAI/OpenRouter with streaming chat responses
* **Deployment**: Next.js + Prisma on Vercel, NeonDB for Postgres

---

## 📚 Deliverables

* ✅ Source code hosted in GitHub
* ✅ Setup instructions (this README)
* ✅ Architecture/design explanation (see `ARCHITECTURE.md`)
* ✅ Publicly hosted demo: **\[Add Vercel link here]**

---

⚡ Built with care by **Shalom Jaison**

---

Now, to make this **accurate to your project**, I’ll need a few details from you:

1. **Auth** – Are you using Clerk, NextAuth, or custom JWT?
2. **Database** – Are you on Neon/Postgres or another provider?
3. **LLM provider** – Which one did you wire up for chat? OpenAI, OpenRouter, or both?
4. **Deployment status** – Are you targeting Vercel for final hosting?

Once you confirm these, I’ll polish this README and then move on to drafting **ARCHITECTURE.md**.
