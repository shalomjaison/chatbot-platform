# README.md

## Chatbot Platform (MVP)

A minimal chatbot platform where users sign in, create **projects/agents**, attach **prompts**, and chat with them. Backed by **Gemini** for LLM responses, **Clerk** for auth, and **Neon + Prisma** for persistence. Deployed on **Vercel**.

**Public demo:** [https://chatbot-platform-ecru.vercel.app](https://chatbot-platform-ecru.vercel.app)

### ✅ Features

* Authentication & registration with **Clerk**
* Create/read/update projects (agents) per user
* Associate a **system prompt** per project
* Chat UI with **persistent message history**
* LLM responses via **Google Gemini API**
* Multi-user isolation at the DB level
* (Nice to have) File uploads per project (scaffold ready)

### 🧰 Tech Stack

* **Next.js (App Router)**, **TypeScript**, **Tailwind**
* **Clerk** (middleware-protected routes)
* **Prisma** ORM + **Neon/Postgres**
* **Google Gemini** (`generative-language` / `ai.google.com` key)
* **Zod** (validation)
* **Vercel** (deployment)

---

## Getting Started

### 1) Clone & install

```bash
git clone <your-repo-url>
cd chatbot-platform
npm install
```

### 2) Environment variables

Create `.env` (or copy `.env.example`) and fill the values:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?sslmode=require"

# Clerk
CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Google Gemini
GEMINI_API_KEY="AIza..."

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

> Tip: in Neon, enable SSL and use the connection string with `sslmode=require`.

### 3) Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### 4) Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Usage (MVP Flow)

1. **Sign up / Sign in** (Clerk).
2. **Create Project** (agent) → give it a name.
3. **Add/Update System Prompt** for the project.
4. **Open Chat** → send messages → Gemini responds.
5. (Optional) Manage files for that project (if you enable the route).

---

## Architecture (Quick)

* **Auth**: Clerk protects routes via middleware in `src/` (App Router).
* **API**: Next.js route handlers (`/api/projects`, `/api/messages`, `/api/prompts`).
* **DB**: Postgres via Prisma models: `User`, `Project`, `Message`, `Prompt`, `ProjectFile`.
* **LLM**: Server route calls Gemini with system + user messages; responses stored as `assistant`.
* **Deploy**: Next.js on Vercel; Neon for Postgres.

See **ARCHITECTURE.md** for diagrams, indexes, and NFRs.

---

## Deployment (Vercel)

1. Connect the GitHub repo in Vercel.
2. Set all **Environment Variables** in *Project Settings → Environment Variables* (Production & Preview).
3. **Build command**: (default) `next build`
   **Install command**: (default) `npm install`
   **Output**: (default) `.vercel/output` handled by Next.js
4. Ensure Prisma client is generated during build (automatic with postinstall).
5. Point **Production Domain** to: `chatbot-platform-ecru.vercel.app`.

### Common pitfalls & fixes

* **“Prisma Client could not locate the Query Engine …”**

  * Keep Prisma client **in the default Node runtime** (not Edge).
  * Ensure `node_modules/.prisma/client` is present after build (Vercel does this by default).
  * Avoid importing Prisma in Edge routes. Mark LLM routes as **Node (runtime: 'nodejs')** if needed.
* **Auth not gating pages**

  * The **middleware must live under `src/`** for App Router.
  * Add a matcher that protects your `(protected)` group or `/dashboard` routes.
* **Neon connection limits**

  * Prefer short-lived connections; ensure you aren’t creating multiple Prisma clients.
  * Use a singleton Prisma client and enable pooling (Neon handles pooling via serverless driver if you adopt it later).

---

## Status & Roadmap

* Auth, Projects, Prompts, Chat
* DB persistence & multi-user isolation
* File uploads (scaffold)
* Streaming responses (Gemini → UI stream)
* Analytics & admin dashboard
* Project sharing/collaboration

---

## License

MIT (or your choice)
