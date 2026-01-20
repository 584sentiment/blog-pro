# Blog Deployment Guide (Vercel + Turso)

Since GitHub Pages only supports static sites, we are moving your blog to **Vercel** (for the website and API) and **Turso** (for the cloud database).

## Step 1: Set up Turso Database
1.  **Install Turso CLI**: [Follow instructions here](https://docs.turso.tech/cli/introduction).
2.  **Create Database**: `turso db create my-blog`
3.  **Import Local Data**: 
    - Inside `server/prisma/`, run: `turso db import my-blog dev.db`
4.  **Get Connection Details**:
    - URL: `turso db show my-blog --url`
    - Token: `turso db tokens create my-blog`
5.  **Update `.env`**: Copy these values into your `server/.env` file.

## Step 2: Push to GitHub
1.  Ensure all your latest changes are committed and pushed to your GitHub repository.

## Step 3: Deploy to Vercel
1.  **Create Vercel Account**: Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2.  **Import Project**: Click "Add New" -> "Project" and select your blog repository.
3.  **Configure Build**:
    - Framework Preset: `Vite`
    - Build Command: `npm run build`
    - Output Directory: `dist`
4.  **Environment Variables**: In the Vercel dashboard, add the following variables:
    - `TURSO_DATABASE_URL`: (Your Turso Database URL)
    - `TURSO_AUTH_TOKEN`: (Your Turso Auth Token)
    - `DATABASE_URL`: (Set this to any string, e.g., `sqlite://`, as it's required by Prisma even when using adapters)
5.  **Deploy**: Click "Deploy". Your site will be live in minutes!

## Maintenance
- To manage your cloud data, you can still use Prisma Studio locally by setting `DATABASE_URL` to your Turso URL (using `libsql://` protocol) or by using the Turso dashboard.
