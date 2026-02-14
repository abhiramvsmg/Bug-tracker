# Railway Deployment - Important Notes

## Project Structure Issue

Your repository has this structure:
```
Bug-tracker/
├── backend/
│   ├── app/
│   ├── requirements.txt
│   └── alembic.ini
└── frontend/
```

Railway deploys from the **root directory** by default. You have two options:

---

## Option 1: Use Root Directory (Recommended for Railway)

Railway will use the `railway.json` in the root directory which includes `cd backend` commands.

**This is already configured!** Just push your changes and Railway will:
1. Change to `backend/` directory
2. Install dependencies from `backend/requirements.txt`
3. Run migrations and start the server

---

## Option 2: Configure Railway to Use Backend Directory

Alternatively, in Railway dashboard:

1. Go to your **backend service** settings
2. Under **"Source"** → **"Root Directory"**, set to: `backend`
3. Remove the `cd backend &&` parts from the commands

Then use this simpler `railway.json` in the root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## Current Configuration

The `railway.json` is now in the root directory with commands that navigate to the backend folder. This should work without any Railway dashboard configuration changes.

**Next steps:**
1. Commit and push these changes to GitHub
2. Railway will auto-deploy
3. Check the build logs

---

## If Build Still Fails

Check Railway logs for the specific error. Common issues:
- Missing `alembic.ini` file
- Database connection issues (make sure PostgreSQL service is added)
- Python version mismatch (Railway uses Python 3.11 by default)

You can specify Python version by adding a `runtime.txt` in the backend folder:
```
python-3.10.12
```
