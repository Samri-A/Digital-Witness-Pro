# ⚡ Quick Start Guide

Get Digital Witness Pro running in **5 minutes**!

## Prerequisites
- Node.js 16+ installed
- Terminal/Command Prompt

## 1️⃣ Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Initialize database and add sample data
npm run init-db
npm run seed-data

# Start the server
npm start
```

✅ Backend should be running at `http://localhost:3001`

## 2️⃣ Frontend Setup (2 minutes)

**Open a NEW terminal window**

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend should open automatically at `http://localhost:3000`

## 3️⃣ Verify It Works (1 minute)

### Test the Backend
```bash
curl http://localhost:3001/api/health
```

Should return:
```json
{"status": "healthy", ...}
```

### Test the Frontend
1. Open browser to `http://localhost:3000`
2. Click "Dashboard" - you should see 3 sample cases
3. Click "Learn & Quiz" - you should see 2 quizzes

## 🎉 You're Done!

### What's Included
- ✅ 3 sample abuse cases
- ✅ 2 educational quizzes (6 questions)
- ✅ AI text classification (keyword-based)
- ✅ PDF report generation
- ✅ Full case management system

### Next Steps
1. **Try It Out:**
   - Create a new case on the "Report Abuse" page
   - Take a quiz
   - Generate a PDF report from case details

2. **Explore the Code:**
   - Backend API: `backend/src/`
   - Frontend UI: `frontend/src/`
   - Database models: `backend/src/models/`

3. **Customize:**
   - Add more quizzes in the database
   - Improve classification keywords
   - Modify UI styling in `frontend/src/App.css`

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Kill process on port 3001
lsof -i :3001  # Mac/Linux
# Then kill the process ID shown
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### "Cannot connect to backend"
- Make sure backend is running on port 3001
- Check browser console for CORS errors
- Verify `.env` file exists in backend folder

## 📚 Full Documentation

For detailed guides, see:
- [Complete Setup Guide](./SETUP.md)
- [API Documentation](./API.md)
- [Main README](../README.md)

## 🆘 Need Help?

Common issues and solutions:
1. **Port conflicts:** Change PORT in `backend/.env`
2. **Database errors:** Delete `.sqlite` file and run `npm run init-db` again
3. **Frontend won't start:** Clear browser cache, restart frontend

---

**That's it!** You now have a fully functional abuse reporting platform with AI classification and educational quizzes. 🚀
