# 🛠️ Setup Guide

Complete step-by-step guide to set up Digital Witness Pro on your local machine.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
1. **Node.js** (version 16 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Git** (for cloning the repository)
   - Download from: https://git-scm.com/
   - Verify installation: `git --version`

### Optional (for PostgreSQL)
4. **PostgreSQL** (if you want to use PostgreSQL instead of SQLite)
   - Download from: https://www.postgresql.org/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres`

---

## Backend Setup

### Step 1: Navigate to Backend Directory
```bash
cd digital-witness-pro/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- Express (web framework)
- Sequelize (ORM)
- Multer (file uploads)
- PDFKit (PDF generation)
- Other dependencies...

### Step 3: Configure Environment
```bash
cp .env.example .env
```

Edit the `.env` file with your preferred settings:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database - Use SQLite for quick start
USE_SQLITE=true
SQLITE_PATH=./dev-database.sqlite

# OR use PostgreSQL (set USE_SQLITE=false)
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=digital_witness_pro
# DB_USER=postgres
# DB_PASSWORD=your_password

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Classification (keyword-based by default)
CLASSIFIER_TYPE=keyword

# Optional: Add OpenAI API key for better classification
# OPENAI_API_KEY=sk-your-key-here
```

### Step 4: Initialize Database
```bash
npm run init-db
```

This creates all necessary database tables.

### Step 5: Seed Sample Data
```bash
npm run seed-data
```

This adds:
- 2 sample quizzes (6 questions total)
- 3 sample cases
- Explanations for all quiz answers

### Step 6: Verify Backend Setup
```bash
npm start
```

You should see:
```
✅ Database connection established
✅ Database models synchronized
🚀 Digital Witness Pro API Server Started
📡 Server running on http://localhost:3001
```

Test the API:
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z",
  "service": "Digital Witness Pro API"
}
```

---

## Frontend Setup

### Step 1: Navigate to Frontend Directory
Open a **new terminal window** and navigate to the frontend:
```bash
cd digital-witness-pro/frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- React
- React Router
- Axios
- Other dependencies...

### Step 3: Configure Environment (Optional)
The frontend uses a proxy to connect to the backend in development. No configuration needed for local development.

For production, create a `.env` file:
```env
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Step 4: Start Development Server
```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`.

You should see the Digital Witness Pro homepage with navigation.

---

## Database Setup

### Option 1: SQLite (Recommended for Development)

**Advantages:**
- Zero configuration
- No separate database server needed
- Perfect for learning and testing

**Setup:**
Already done! SQLite is configured by default in `.env`:
```env
USE_SQLITE=true
SQLITE_PATH=./dev-database.sqlite
```

The database file will be created automatically when you run `npm run init-db`.

### Option 2: PostgreSQL (Recommended for Production)

**Advantages:**
- Better performance
- More features
- Production-ready

**Setup:**

1. **Install PostgreSQL** (if not already installed)

2. **Create a database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE digital_witness_pro;

# Exit
\q
```

3. **Update `.env` file:**
```env
USE_SQLITE=false
DB_HOST=localhost
DB_PORT=5432
DB_NAME=digital_witness_pro
DB_USER=postgres
DB_PASSWORD=your_password_here
```

4. **Initialize the database:**
```bash
npm run init-db
npm run seed-data
```

---

## Configuration

### Backend Configuration Options

**Server Settings:**
- `PORT`: API server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

**Database Settings:**
- `USE_SQLITE`: Use SQLite (true) or PostgreSQL (false)
- `SQLITE_PATH`: Path to SQLite database file
- `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`: PostgreSQL settings

**File Upload Settings:**
- `UPLOAD_DIR`: Directory for uploaded files (default: ./uploads)
- `MAX_FILE_SIZE`: Maximum file size in bytes (default: 10MB)

**AI Classification:**
- `CLASSIFIER_TYPE`: Classification method
  - `keyword`: Built-in keyword-based (default, no API key needed)
  - `openai`: OpenAI GPT (requires API key)
  - `huggingface`: HuggingFace (requires API key)
- `OPENAI_API_KEY`: OpenAI API key (optional)
- `HUGGINGFACE_API_KEY`: HuggingFace API key (optional)

### Using OpenAI Classification

For more accurate classification:

1. **Get an OpenAI API key:**
   - Visit https://platform.openai.com/
   - Create an account
   - Generate an API key

2. **Update `.env`:**
```env
CLASSIFIER_TYPE=openai
OPENAI_API_KEY=sk-your-key-here
```

3. **Restart the backend:**
```bash
npm start
```

---

## Running the Application

### Development Mode

1. **Start the backend** (Terminal 1):
```bash
cd backend
npm run dev
```
Uses nodemon for auto-reload on code changes.

2. **Start the frontend** (Terminal 2):
```bash
cd frontend
npm start
```
Automatically opens in browser with hot reload.

### Production Mode

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Serve the frontend** (many options):
   - Use a static hosting service (Netlify, Vercel, etc.)
   - Serve from the backend using Express static
   - Use Nginx or Apache

3. **Run the backend:**
```bash
cd backend
NODE_ENV=production npm start
```

---

## Verification Checklist

After setup, verify everything works:

### Backend Checks
- [ ] Server starts without errors
- [ ] Health check returns 200 OK: `curl http://localhost:3001/api/health`
- [ ] Can get cases: `curl http://localhost:3001/api/getCases`
- [ ] Can get quizzes: `curl http://localhost:3001/api/getQuizzes`
- [ ] Sample data is loaded (3 cases, 2 quizzes)

### Frontend Checks
- [ ] Application loads in browser
- [ ] Navigation works (Report Abuse, Dashboard, Learn & Quiz)
- [ ] Can see sample cases in Dashboard
- [ ] Can view quizzes in Learn & Quiz section
- [ ] Upload page displays correctly

### Integration Checks
- [ ] Can classify text on Upload page
- [ ] Can create a new case
- [ ] Can view case details
- [ ] Can download PDF report
- [ ] Can take a quiz and see results

---

## Common Setup Issues

### Port Already in Use
**Error:** `EADDRINUSE: address already in use :::3001`

**Solution:**
```bash
# Find process using port 3001
lsof -i :3001  # Mac/Linux
netstat -ano | findstr :3001  # Windows

# Kill the process or change PORT in .env
```

### Database Connection Failed
**Error:** `Unable to connect to database`

**Solution:**
- For SQLite: Check that SQLITE_PATH is writable
- For PostgreSQL: Verify credentials and that PostgreSQL is running

### Module Not Found
**Error:** `Cannot find module 'express'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors in Browser
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Verify backend is running
- Check that frontend proxy is configured in `package.json`
- Ensure backend CORS settings allow frontend origin

---

## Next Steps

After successful setup:

1. **Explore the Application**
   - Create a test case
   - Try the AI classification
   - Take a quiz
   - Generate a PDF report

2. **Review the Code**
   - Check `backend/src/` for API logic
   - Check `frontend/src/` for UI components
   - Review `backend/src/services/` for AI and PDF services

3. **Customize**
   - Add more quiz questions
   - Improve classification keywords
   - Customize PDF templates
   - Add new features

4. **Read Documentation**
   - [API Documentation](./API.md)
   - [Troubleshooting Guide](./TROUBLESHOOTING.md)

---

## Getting Help

If you encounter issues:
1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Review error messages in terminal
3. Check browser console for frontend errors
4. Verify all prerequisites are installed
5. Ensure ports 3000 and 3001 are available

---

**Congratulations!** 🎉 You've successfully set up Digital Witness Pro!
