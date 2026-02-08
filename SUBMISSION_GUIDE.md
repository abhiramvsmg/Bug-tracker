# BugTracker V2 - Submission & Troubleshooting Guide

This project has been optimized for high performance and stability. Below is the explanation of the issues resolved and how to run/submit the project.

## 🛠️ Issues Resolved

1.  **Rendering Performance (White Page Issue)**:
    *   **Old Problem**: The app would show a blank white page for 2 seconds while fetching project data.
    *   **Solution**: Implemented **Skeleton Loaders** (darkened for visibility) and a **Background Sync** mode. The UI now stays on the screen at all times, showing a subtle "Syncing..." bubble in the corner instead of flickering.
    
2.  **Member Access & Creation Fix**: 
    *   **Old Problem**: The "Create Project" button was unresponsive for some users.
    *   **Solution**: Expanded permissions so that all workspace members (not just Owners) can create projects and tickets.

3.  **Real-Time Data Integrity & Async Fix**:
    *   **Old Problem**: The backend was crashing silently ("Network Error") when trying to load tickets with different cases (e.g., 'HIGH' vs 'high').
    *   **Solution**: Implemented **Deep Eager Loading** and **Case-Insensitive Normalization**. The system now handles all data variations automatically without dropping the connection.

## 🚀 How to Run (Stable Mode)

Follow these exact commands to ensure the project runs perfectly for your submission:

### 1. Start the Backend
Open a terminal in the `backend` folder:
```powershell
.\venv\Scripts\python -m uvicorn app.main:app --reload --port 8001
```
*Note: We use port 8001 to avoid conflicts.*

### 2. Start the Frontend
Open a terminal in the `frontend` folder:
```powershell
npm run dev
```

## 📝 Common Troubleshooting for Submission

| Error | Cause | Fix |
| :--- | :--- | :--- |
| **Network Error** | Browser blocked 'localhost' via IPv6. | Use **127.0.0.1:8001** as the backend URL. |
| **ModuleNotFoundError** | Running Python from the wrong location. | Use `.\venv\Scripts\python` to start the server. |
| **Blank Sidebar** | Workspace selection reset. | Re-select your workspace from the sidebar. |

---
**Project Status**: Optimized, Stable, and Ready for Submission.
