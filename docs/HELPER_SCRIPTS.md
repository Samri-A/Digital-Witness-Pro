# 🔧 Helper Scripts

Useful commands for common development tasks.

## Database Management

### Reset Database (WARNING: Deletes all data!)
```bash
cd backend
npm run init-db
npm run seed-data
```

### Add More Sample Cases
Create a file `backend/scripts/addCases.js`:
```javascript
require('dotenv').config();
const { Case } = require('../src/models');

async function addSampleCases() {
  await Case.create({
    reporterName: 'User 4',
    notes: 'Another test case...',
    classificationLabel: 'harassment',
    classificationConfidence: 0.85,
    classificationExplanation: 'Persistent unwanted contact',
    occurredAt: new Date()
  });
  console.log('Case added!');
  process.exit(0);
}

addSampleCases();
```

Run: `node backend/scripts/addCases.js`

### Backup Database (SQLite)
```bash
cp backend/dev-database.sqlite backend/backup-$(date +%Y%m%d).sqlite
```

### View Database Contents (SQLite)
```bash
# Install sqlite3
npm install -g sqlite3

# Open database
sqlite3 backend/dev-database.sqlite

# View tables
.tables

# Query cases
SELECT * FROM cases;

# Exit
.quit
```

## Development Workflow

### Start Both Backend and Frontend
Create a `start-all.sh` script:
```bash
#!/bin/bash
cd backend && npm start &
cd frontend && npm start &
wait
```

Make executable: `chmod +x start-all.sh`
Run: `./start-all.sh`

### Watch for Changes
Backend already uses nodemon in dev mode:
```bash
cd backend
npm run dev
```

### Clear All Uploads
```bash
rm -rf backend/uploads/*
touch backend/uploads/.gitkeep
```

## Testing

### Test Classification Endpoint
```bash
curl -X POST http://localhost:3001/api/classifyText \
  -H "Content-Type: application/json" \
  -d '{"text":"Test threatening message"}'
```

### Test All Endpoints
```bash
# Health
curl http://localhost:3001/api/health

# Get cases
curl http://localhost:3001/api/getCases

# Get quizzes
curl http://localhost:3001/api/getQuizzes
```

### Load Test (using Apache Bench)
```bash
# Install: apt-get install apache2-utils (Linux) or brew install ab (Mac)
ab -n 100 -c 10 http://localhost:3001/api/health
```

## Code Quality

### Format Code (if you add Prettier)
```bash
npx prettier --write "src/**/*.js"
```

### Lint Code (if you add ESLint)
```bash
npx eslint src/
```

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

Output in `frontend/build/` folder.

### Start Backend in Production Mode
```bash
cd backend
NODE_ENV=production npm start
```

### Run Both with PM2
```bash
# Install PM2
npm install -g pm2

# Start backend
cd backend
pm2 start src/server.js --name "dwp-backend"

# Build and serve frontend
cd ../frontend
npm run build
pm2 serve build 3000 --name "dwp-frontend"

# View status
pm2 status

# View logs
pm2 logs

# Stop all
pm2 stop all
```

## Debugging

### Enable Detailed Logging
Backend `.env`:
```env
NODE_ENV=development
```

### Check Node Version
```bash
node --version  # Should be 16+
npm --version
```

### Clear Node Cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Check Port Usage
```bash
# Mac/Linux
lsof -i :3001
lsof -i :3000

# Windows
netstat -ano | findstr :3001
netstat -ano | findstr :3000
```

## Database Queries

### Get Case Count
```bash
curl http://localhost:3001/api/getCases | jq '.total'
```

### Get All Quiz IDs
```bash
curl http://localhost:3001/api/getQuizzes | jq '.quizzes[].id'
```

## Git Workflows

### Create Feature Branch
```bash
git checkout -b feature/new-quiz-type
# Make changes
git add .
git commit -m "Add new quiz type"
git push origin feature/new-quiz-type
```

### Update from Main
```bash
git checkout main
git pull origin main
git checkout your-branch
git merge main
```

## Performance Testing

### Monitor Backend Performance
```bash
# Install clinic
npm install -g clinic

# Run with profiling
cd backend
clinic doctor -- node src/server.js

# Open generated HTML report
```

### Check Bundle Size (Frontend)
```bash
cd frontend
npm run build
ls -lh build/static/js/
```

## Quick Fixes

### Reset Everything
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json dev-database.sqlite
npm install
npm run init-db
npm run seed-data

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
```

### Update All Dependencies
```bash
npm update
```

### Check for Security Vulnerabilities
```bash
npm audit
npm audit fix
```

## Custom Scripts to Add

Add these to `backend/package.json` scripts:
```json
{
  "scripts": {
    "reset": "npm run init-db && npm run seed-data",
    "backup": "cp dev-database.sqlite backup-$(date +%Y%m%d).sqlite",
    "test:api": "newman run docs/Postman_Collection.json",
    "logs": "tail -f logs/*.log"
  }
}
```

## Environment Variables Cheat Sheet

```env
# Quick dev setup
USE_SQLITE=true
CLASSIFIER_TYPE=keyword
NODE_ENV=development

# Production setup
USE_SQLITE=false
DB_HOST=your-postgres-host
CLASSIFIER_TYPE=openai
OPENAI_API_KEY=sk-...
NODE_ENV=production
```

## Useful Commands Reference

| Command | Purpose |
|---------|---------|
| `npm start` | Start server |
| `npm run dev` | Start with auto-reload |
| `npm run init-db` | Create tables |
| `npm run seed-data` | Add sample data |
| `npm test` | Run tests |
| `npm run build` | Build for production |
| `pm2 status` | Check PM2 processes |
| `git status` | Check git status |

---

Save these commands for quick reference during development!
