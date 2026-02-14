# 🚀 Deployment Guide – Bug Tracker

This guide will walk you through deploying the Bug Tracker application to production using **Railway** (backend + database) and **Vercel** (frontend).

---

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account
- ✅ Your code pushed to a GitHub repository
- ✅ A Railway account (sign up at [railway.app](https://railway.app))
- ✅ A Vercel account (sign up at [vercel.com](https://vercel.com))

---

## 🎯 Deployment Overview

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   Vercel        │─────▶│   Railway       │─────▶│   PostgreSQL    │
│   (Frontend)    │      │   (Backend)     │      │   (Database)    │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

---

## Part 1: Deploy Backend to Railway 🚂

### Step 1: Create a New Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your Bug Tracker repository
5. Railway will detect it's a Python project

### Step 2: Add PostgreSQL Database

1. In your Railway project, click **"+ New"**
2. Select **"Database"** → **"PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. The `DATABASE_URL` environment variable will be auto-generated

### Step 3: Configure Environment Variables

1. Click on your **backend service** (not the database)
2. Go to the **"Variables"** tab
3. Add the following environment variables:

```env
SECRET_KEY=<generate-a-secure-random-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

**To generate a secure SECRET_KEY**, run this in your terminal:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

> **Note**: The `DATABASE_URL` is automatically set by Railway when you add PostgreSQL. Don't override it!

### Step 4: Configure Build Settings

1. Go to **"Settings"** tab
2. Under **"Build"**, set:
   - **Root Directory**: `backend` (if your backend is in a subdirectory)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

> **Note**: Railway automatically detects the `railway.json` file we created, so these settings should be pre-configured.

### Step 5: Deploy

1. Railway will automatically deploy your backend
2. Wait for the build to complete (check the **"Deployments"** tab)
3. Once deployed, click **"Settings"** → **"Networking"** → **"Generate Domain"**
4. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Step 6: Verify Backend Deployment

Visit your backend URL in a browser:
- **API Root**: `https://your-app.railway.app/`
- **API Docs**: `https://your-app.railway.app/docs`

You should see the Swagger UI with all your API endpoints!

---

## Part 2: Deploy Frontend to Vercel 🔺

### Step 1: Create a New Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Import your Bug Tracker repository from GitHub
4. Vercel will detect it's a Vite project

### Step 2: Configure Build Settings

1. **Framework Preset**: Vite (auto-detected)
2. **Root Directory**: `frontend` (if your frontend is in a subdirectory)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `dist` (default)

### Step 3: Add Environment Variables

1. Before deploying, click **"Environment Variables"**
2. Add the following variable:

```env
VITE_API_URL=https://your-backend.railway.app
```

> **Important**: Replace `your-backend.railway.app` with your actual Railway backend URL from Part 1, Step 5.

### Step 4: Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy your frontend
3. Wait for the deployment to complete
4. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

### Step 5: Update Backend CORS Settings

Now that you have your Vercel URL, update the Railway backend:

1. Go back to **Railway**
2. Click on your **backend service**
3. Go to **"Variables"** tab
4. Update the `ALLOWED_ORIGINS` variable:

```env
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

5. Save and redeploy

---

## Part 3: Verify Deployment ✅

### Test the Full Application

1. **Visit your frontend**: `https://your-app.vercel.app`
2. **Register a new user**
3. **Login** with your credentials
4. **Create a workspace**
5. **Create a project**
6. **Create tickets** and test the Kanban board
7. **Test drag-and-drop** functionality

### Check for Common Issues

#### ❌ CORS Errors
**Problem**: Frontend can't connect to backend  
**Solution**: Make sure `ALLOWED_ORIGINS` in Railway includes your Vercel URL

#### ❌ API Connection Failed
**Problem**: Frontend shows "Network Error"  
**Solution**: Verify `VITE_API_URL` in Vercel matches your Railway backend URL

#### ❌ Database Connection Error
**Problem**: Backend logs show database errors  
**Solution**: Check that Railway PostgreSQL is running and `DATABASE_URL` is set

#### ❌ 404 on Page Refresh
**Problem**: Refreshing a page shows 404  
**Solution**: Vercel should use the `vercel.json` config we created (check it exists)

---

## 🔧 Advanced Configuration

### Custom Domain (Optional)

#### For Frontend (Vercel):
1. Go to your project **"Settings"** → **"Domains"**
2. Add your custom domain
3. Follow Vercel's DNS configuration instructions

#### For Backend (Railway):
1. Go to **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Add your domain and configure DNS

### Environment-Specific Settings

You can create different environments in both platforms:

**Vercel**: Production, Preview, Development  
**Railway**: Production, Staging (create separate projects)

---

## 📊 Monitoring & Logs

### Railway Logs
1. Click on your backend service
2. Go to **"Deployments"** tab
3. Click on the latest deployment
4. View real-time logs

### Vercel Logs
1. Go to your project
2. Click **"Deployments"**
3. Click on a deployment
4. View **"Functions"** logs

---

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

- **Push to `main` branch** → Automatic production deployment
- **Push to other branches** → Preview deployments (Vercel) or manual deploy (Railway)

To disable auto-deploy:
- **Railway**: Settings → Deploys → Disable "Auto Deploy"
- **Vercel**: Settings → Git → Disable "Production Branch"

---

## 💰 Cost Considerations

### Free Tier Limits

**Railway Free Tier**:
- $5 free credits per month
- Enough for small projects
- Includes PostgreSQL database

**Vercel Free Tier**:
- 100 GB bandwidth per month
- Unlimited deployments
- Perfect for frontend hosting

### Scaling Up

If you exceed free tier limits:
- **Railway**: Pay-as-you-go pricing
- **Vercel**: Pro plan ($20/month)

---

## 🎉 Success!

Your Bug Tracker is now live! Share your deployment URLs:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`
- **API Docs**: `https://your-backend.railway.app/docs`

---

## 📝 Next Steps

1. **Update README.md** with your live demo links
2. **Add screenshots** to your repository
3. **Share your project** on LinkedIn, Twitter, or GitHub
4. **Monitor usage** and optimize as needed

---

## 🆘 Need Help?

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **React Docs**: https://react.dev

---

**Happy Deploying! 🚀**
