# 🛡️ Digital Witness Pro

A beginner-friendly platform for reporting and documenting online abuse with AI-powered classification, case management, PDF report generation, and educational quizzes.

## 📋 Overview

Digital Witness Pro helps users:
- 📤 **Upload Evidence**: Screenshots, text files, and documents
- 🤖 **AI Classification**: Automatically classify abuse types (threats, harassment, blackmail, hate speech)
- 💾 **Case Management**: Save and organize abuse reports
- 📄 **PDF Reports**: Generate professional evidence reports
- 🎓 **Educational Quizzes**: Learn about online safety through interactive quizzes

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- PostgreSQL (optional - SQLite included for quick development)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd digital-witness-pro
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file with your settings
npm run init-db
npm run seed-data
npm start
```

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
npm start
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📁 Project Structure

```
digital-witness-pro/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Database & initialization
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (AI, PDF)
│   │   └── server.js       # Main server file
│   ├── uploads/            # File storage
│   └── package.json
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/          # Main page components
│   │   ├── services/       # API service
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json
└── docs/                   # Documentation
```

## 🔌 API Endpoints

### Upload & Files
- `POST /api/upload` - Upload evidence files
- `GET /api/uploads/:fileId` - Get uploaded file

### Classification
- `POST /api/classifyText` - Classify text content

### Cases
- `POST /api/saveCase` - Save a new case
- `GET /api/getCases` - List all cases
- `GET /api/getCase/:id` - Get case details
- `POST /api/generatePDF` - Generate PDF report

### Quizzes
- `GET /api/getQuizzes` - List all quizzes
- `GET /api/getQuiz?quizId=xxx` - Get specific quiz
- `POST /api/submitQuiz` - Submit quiz answers

### Health
- `GET /api/health` - Check API status

## 🤖 AI Classification

The system supports multiple classification methods:

1. **Keyword-based (Default)**: No API key required, works out of the box
2. **OpenAI API**: Set `OPENAI_API_KEY` in `.env`
3. **HuggingFace**: Set `HUGGINGFACE_API_KEY` in `.env`

### Classification Categories
- **Threats**: Physical harm, violence threats
- **Blackmail**: Extortion, private information leverage
- **Hate Speech**: Discriminatory language, slurs
- **Harassment**: Persistent unwanted contact, insults
- **Other**: Doesn't match known patterns

## 📄 PDF Report Generation

Reports include:
- Case ID and metadata
- Reporter information
- Full notes and description
- AI classification results
- List of evidence files
- Timestamps and generation info

## 🎓 Educational Quizzes

Built-in quizzes teach users about:
- Recognizing abuse types
- Proper evidence collection
- When and how to report
- Online safety best practices

## 🗄️ Database

### Models
- **Cases**: Abuse reports with classification
- **Files**: Uploaded evidence files
- **Quizzes**: Educational quizzes
- **QuizQuestions**: Quiz questions
- **QuizChoices**: Answer choices with explanations

### Database Options
- **SQLite** (default): Perfect for development, zero setup
- **PostgreSQL**: For production, set `USE_SQLITE=false` in `.env`

## 🛠️ Configuration

### Backend Environment Variables (.env)
```env
PORT=3001
USE_SQLITE=true
SQLITE_PATH=./dev-database.sqlite
UPLOAD_DIR=./uploads
CLASSIFIER_TYPE=keyword
# Optional: OPENAI_API_KEY=sk-...
```

### Frontend Configuration
The frontend uses a proxy to the backend API (configured in package.json). For production, set `REACT_APP_API_URL` environment variable.

## 📝 Development Scripts

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
npm run init-db    # Initialize database
npm run seed-data  # Add sample data
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🧪 Testing

### Testing API Endpoints

Use curl, Postman, or the built-in health check:

```bash
# Health check
curl http://localhost:3001/api/health

# Classify text
curl -X POST http://localhost:3001/api/classifyText \
  -H "Content-Type: application/json" \
  -d '{"text":"I will find you and make you pay"}'

# Get all cases
curl http://localhost:3001/api/getCases
```

## 👥 Team Task Distribution

This 1-week MVP can be built by a 3-person team:

### Person A: AI + PDF + Quiz Logic
- Implement classification service
- PDF generation service
- Quiz submission logic
- Testing classification accuracy

### Person B: Frontend + Quiz UI
- Upload page
- Dashboard
- Case detail view
- Quiz interface
- Results display

### Person C: Backend + Database
- Database schema & models
- File upload handling
- Cases API endpoints
- Quiz API endpoints
- Data seeding

## 🚢 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Update `.env` with production settings
3. Run database initialization
4. Deploy to your hosting service (Heroku, Railway, DigitalOcean, etc.)

### Frontend Deployment
1. Build the production bundle: `npm run build`
2. Deploy the `build/` folder to static hosting (Netlify, Vercel, etc.)
3. Set `REACT_APP_API_URL` to your backend URL

## 🔒 Security Considerations

This is a demonstration MVP. For production use:
- Add authentication and authorization
- Implement rate limiting
- Use HTTPS for all communications
- Encrypt sensitive data at rest
- Regular security audits
- Proper input validation and sanitization

## 📚 Additional Resources

- [API Documentation](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## 🤝 Contributing

This is an educational MVP. Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## ⚠️ Important Disclaimer

**This is a demonstration MVP for educational purposes.** 

For actual cases of online abuse, threats, or harassment:
- Contact local law enforcement immediately
- Report to the platform where the abuse occurred
- Seek support from organizations specializing in online safety

This tool is meant to help document evidence, not replace professional authorities.

## 💬 Support

For questions or issues:
- Check the documentation in the `docs/` folder
- Review sample data and API examples
- Open an issue in the repository

---

Built with ❤️ by ETTA Solutions PLC
