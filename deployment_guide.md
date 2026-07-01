# Afya Flow - Deployment Manual

This guide describes how to publish the **Afya Flow** codebase to **GitHub** and deploy both the backend API and frontend dashboard to production platforms.

---

## 1. Pushing to GitHub

All local workspace files have been staged and committed locally under the commit name `feat: secure access control and dynamic patient profiling`. 

To push them to your GitHub:
1. Create a new repository on your GitHub account (do not initialize with README, license, or `.gitignore`).
2. Run the following commands in your shell inside the project folder:
   ```powershell
   # Rename default branch to main if not already
   git branch -M main

   # Add your GitHub repository as the remote origin
   git remote add origin <YOUR_GITHUB_REPO_URL>

   # Push to main
   git push -u origin main
   ```

---

## 2. Deploying the Backend API (Render / Railway / Fly.io)

> [!WARNING]
> **Do not deploy the backend node server directly to Vercel.** Vercel Serverless Functions have a read-only filesystem (except `/tmp`), meaning write operations to the SQLite file `dev.db` will fail and the database will reset on every cold start.

Deploy the backend to a service that supports persistent disk storage or Postgres (like **Railway**, **Render**, or **Fly.io**):

### Option A: Railway (Easiest)
1. Link your GitHub repository to Railway.
2. Add a **PostgreSQL** database service in Railway.
3. Railway will automatically populate the database connection string environment variable (`DATABASE_URL`).
4. Set the following environment variables in your API service dashboard:
   - `DATABASE_URL` (points to the PostgreSQL service URL).
   - `CORS_ORIGIN` (points to your deployed Vercel frontend domain).
   - `JWT_SECRET` (a secure random string).
   - `PORT=5000`

### Option B: Render
1. Create a **Web Service** in Render linked to your repository.
2. Under "Root Directory", specify `backend`.
3. Build Command: `npm install && npm run build && npx prisma migrate deploy`
4. Start Command: `node dist/server.js`
5. Create a free **PostgreSQL Database** in Render and copy the *Internal Database URL*.
6. Add these environment variables under the Web Service "Environment" tab:
   - `DATABASE_URL`
   - `CORS_ORIGIN`
   - `JWT_SECRET`

---

## 3. Deploying the Frontend to Vercel

The React Vite frontend (`web/`) can be deployed directly to Vercel:

1. Import your GitHub repository into Vercel.
2. Under **Project Settings**:
   - Set **Framework Preset** to `Vite`.
   - Set the **Root Directory** to `web`.
3. Add the following **Environment Variable** in the Vercel dashboard:
   - **`VITE_API_URL`**: Point this to your deployed backend service URL (e.g. `https://afya-flow-api.up.railway.app/api/v1`).
4. Click **Deploy**.
