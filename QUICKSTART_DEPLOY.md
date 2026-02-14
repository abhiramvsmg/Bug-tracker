# 🚀 Quick Start Deployment Guide

## TL;DR - Deploy in 15 Minutes

> **Important**: Make sure `railway.json` is in the **root directory** (not in backend folder)

### Step 1: Railway (Backend + Database)
1. Go to [railway.app](https://railway.app) → Sign in with GitHub
2. **New Project** → **Deploy from GitHub** → Select your repo
3. **+ New** → **Database** → **PostgreSQL**
4. Click **backend service** → **Variables** → Add:
   ```
   SECRET_KEY=<run: python -c "import secrets; print(secrets.token_hex(32))">
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=http://localhost:5173
   ```
5. **Settings** → **Networking** → **Generate Domain**
6. Copy your backend URL: `https://xxx.railway.app`

### Step 2: Vercel (Frontend)
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. **New Project** → Import your repo
3. **Root Directory**: `frontend`
4. **Environment Variables**:
   ```
   VITE_API_URL=https://xxx.railway.app
   ```
   (Use your Railway URL from Step 1)
5. **Deploy**
6. Copy your frontend URL: `https://xxx.vercel.app`

### Step 3: Update CORS
1. Go back to **Railway** → **backend** → **Variables**
2. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://xxx.vercel.app,http://localhost:5173
   ```
   (Use your Vercel URL from Step 2)
3. Save → Auto redeploys

### Step 4: Test
1. Visit your Vercel URL
2. Register → Login → Create Project → Create Ticket
3. ✅ Done!

---

## 📝 Environment Variables Cheat Sheet

### Railway Backend
```env
SECRET_KEY=<generate-random-32-char-hex>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://your-app.vercel.app,http://localhost:5173
```

### Vercel Frontend
```env
VITE_API_URL=https://your-backend.railway.app
```

---

## 🔧 Generate SECRET_KEY

**Windows PowerShell:**
```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```

**Linux/Mac:**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

---

## ❌ Common Issues

| Problem | Solution |
|---------|----------|
| CORS Error | Update `ALLOWED_ORIGINS` in Railway with Vercel URL |
| 404 on refresh | Check `vercel.json` exists in frontend folder |
| Database error | Railway auto-sets `DATABASE_URL`, don't override it |
| Build fails | Check `requirements.txt` and `package.json` are correct |

---

## 📚 Full Documentation

For detailed instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Happy Deploying! 🎉**
