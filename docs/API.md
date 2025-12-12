# 🔌 API Documentation

Complete reference for all Digital Witness Pro API endpoints.

## Base URL
- Development: `http://localhost:3001/api`
- Production: `https://your-domain.com/api`

## Authentication
Currently no authentication is required (MVP). In production, implement JWT or session-based auth.

---

## 📤 Upload Endpoints

### Upload Files
Upload one or more evidence files.

**Endpoint:** `POST /upload`

**Content-Type:** `multipart/form-data`

**Request Body:**
- `files` (file[]): One or more files (images, PDFs, text)
- `notes` (string, optional): Case notes
- `reporterName` (string, optional): Reporter's name
- `textContent` (string, optional): Text to classify

**Response:**
```json
{
  "message": "Files uploaded successfully",
  "files": [
    {
      "id": "uuid",
      "filename": "screenshot.png",
      "mimetype": "image/png",
      "uploadedAt": "2024-01-20T10:30:00Z"
    }
  ],
  "prefillData": {
    "notes": "",
    "reporterName": "",
    "textContent": ""
  }
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "files=@screenshot.png" \
  -F "notes=Threatening messages received"
```

### Get File
Retrieve an uploaded file.

**Endpoint:** `GET /uploads/:fileId`

**Response:** File download

---

## 🤖 Classification Endpoint

### Classify Text
Classify text content using AI.

**Endpoint:** `POST /classifyText`

**Request Body:**
```json
{
  "text": "I will find you and make you pay",
  "caseId": "uuid-optional"
}
```

**Response:**
```json
{
  "label": "threats",
  "confidence": 0.92,
  "explanation": "Explicit threat of physical harm; contains direct threat verb 'find' + 'make you pay'.",
  "evidence": ["find you", "make you pay"]
}
```

**Classification Labels:**
- `threats`: Physical harm, violence
- `blackmail`: Extortion, private information leverage
- `hate_speech`: Discriminatory language
- `harassment`: Persistent unwanted contact
- `other`: Doesn't match patterns

**Example (curl):**
```bash
curl -X POST http://localhost:3001/api/classifyText \
  -H "Content-Type: application/json" \
  -d '{"text":"I will find you and make you pay"}'
```

---

## 📁 Case Endpoints

### Save Case
Create a new case with evidence and classification.

**Endpoint:** `POST /saveCase`

**Request Body:**
```json
{
  "reporterName": "John Doe",
  "notes": "Received threatening messages...",
  "fileIds": ["uuid1", "uuid2"],
  "classification": {
    "label": "threats",
    "confidence": 0.92,
    "explanation": "..."
  },
  "occurredAt": "2024-01-15T14:30:00Z"
}
```

**Response:**
```json
{
  "message": "Case saved successfully",
  "case": {
    "id": "uuid",
    "reporterName": "John Doe",
    "notes": "Received threatening messages...",
    "classificationLabel": "threats",
    "classificationConfidence": 0.92,
    "classificationExplanation": "...",
    "occurredAt": "2024-01-15T14:30:00Z",
    "createdAt": "2024-01-20T10:30:00Z",
    "files": [...]
  }
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:3001/api/saveCase \
  -H "Content-Type: application/json" \
  -d '{
    "reporterName": "Anonymous",
    "notes": "Threatening messages received",
    "fileIds": [],
    "classification": {
      "label": "threats",
      "confidence": 0.92,
      "explanation": "Direct threats"
    }
  }'
```

### Get All Cases
Retrieve list of all cases (summary view).

**Endpoint:** `GET /getCases`

**Response:**
```json
{
  "cases": [
    {
      "id": "uuid",
      "reporterName": "John Doe",
      "notesSnippet": "Received threatening messages...",
      "classificationLabel": "threats",
      "classificationConfidence": 0.92,
      "fileCount": 2,
      "occurredAt": "2024-01-15T14:30:00Z",
      "createdAt": "2024-01-20T10:30:00Z"
    }
  ],
  "total": 1
}
```

**Example (curl):**
```bash
curl http://localhost:3001/api/getCases
```

### Get Case Details
Retrieve full details of a specific case.

**Endpoint:** `GET /getCase/:id`

**Response:**
```json
{
  "case": {
    "id": "uuid",
    "reporterName": "John Doe",
    "notes": "Full notes text...",
    "classificationLabel": "threats",
    "classificationConfidence": 0.92,
    "classificationExplanation": "...",
    "occurredAt": "2024-01-15T14:30:00Z",
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z",
    "files": [
      {
        "id": "uuid",
        "filename": "screenshot.png",
        "filepath": "./uploads/...",
        "mimetype": "image/png",
        "uploadedAt": "2024-01-20T10:30:00Z"
      }
    ]
  }
}
```

**Example (curl):**
```bash
curl http://localhost:3001/api/getCase/your-case-uuid
```

### Generate PDF Report
Generate and download a PDF report for a case.

**Endpoint:** `POST /generatePDF`

**Request Body:**
```json
{
  "caseId": "uuid"
}
```

**Response:** PDF file download (`Content-Type: application/pdf`)

**Example (curl):**
```bash
curl -X POST http://localhost:3001/api/generatePDF \
  -H "Content-Type: application/json" \
  -d '{"caseId":"your-case-uuid"}' \
  --output case-report.pdf
```

---

## 🎓 Quiz Endpoints

### Get All Quizzes
Retrieve list of available quizzes.

**Endpoint:** `GET /getQuizzes`

**Response:**
```json
{
  "quizzes": [
    {
      "id": "uuid",
      "title": "Online Safety Basics",
      "description": "Short quiz about recognizing harassment...",
      "questionCount": 3
    }
  ],
  "total": 1
}
```

**Example (curl):**
```bash
curl http://localhost:3001/api/getQuizzes
```

### Get Quiz
Retrieve a specific quiz with questions and choices.

**Endpoint:** `GET /getQuiz?quizId=xxx`

**Query Parameters:**
- `quizId` (required): Quiz UUID

**Response:**
```json
{
  "quizId": "uuid",
  "title": "Online Safety Basics",
  "description": "Short quiz about...",
  "questions": [
    {
      "id": "uuid",
      "text": "If someone repeatedly sends you insulting messages...",
      "imageUrl": null,
      "choices": [
        {
          "id": "uuid",
          "text": "Reply and insult them back"
        },
        {
          "id": "uuid",
          "text": "Screenshot the messages and block the sender"
        }
      ]
    }
  ]
}
```

**Note:** Correct answers are NOT included in this response. They're revealed after submission.

**Example (curl):**
```bash
curl http://localhost:3001/api/getQuiz?quizId=your-quiz-uuid
```

### Submit Quiz Answers
Submit answers and receive results with explanations.

**Endpoint:** `POST /submitQuiz`

**Request Body:**
```json
{
  "quizId": "uuid",
  "answers": [
    {
      "questionId": "uuid",
      "choiceId": "uuid"
    }
  ]
}
```

**Response:**
```json
{
  "quizId": "uuid",
  "quizTitle": "Online Safety Basics",
  "results": [
    {
      "questionId": "uuid",
      "questionText": "If someone repeatedly...",
      "userChoiceId": "uuid",
      "userChoiceText": "Screenshot the messages...",
      "correctChoiceId": "uuid",
      "correctChoiceText": "Screenshot the messages...",
      "explanation": "Screenshotting preserves evidence...",
      "isCorrect": true
    }
  ],
  "score": "3/3",
  "correctCount": 3,
  "totalQuestions": 3
}
```

**Example (curl):**
```bash
curl -X POST http://localhost:3001/api/submitQuiz \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": "your-quiz-uuid",
    "answers": [
      {"questionId": "q1-uuid", "choiceId": "choice-uuid"}
    ]
  }'
```

---

## 🏥 Health Check

### Health Status
Check if the API is running.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-20T10:30:00Z",
  "service": "Digital Witness Pro API"
}
```

**Example (curl):**
```bash
curl http://localhost:3001/api/health
```

---

## ⚠️ Error Responses

All endpoints return errors in the following format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `201`: Created (for new resources)
- `400`: Bad Request (invalid input)
- `404`: Not Found
- `500`: Internal Server Error

---

## 📊 Rate Limiting

Currently no rate limiting (MVP). In production, implement:
- Per-IP rate limits
- Per-user rate limits (if authenticated)
- Exponential backoff for repeated errors

---

## 🔐 Security Headers

Production deployments should include:
- HTTPS only
- CORS properly configured
- CSP headers
- Rate limiting
- Request size limits
- Input sanitization

---

## 📝 Notes

1. All timestamps are in ISO 8601 format (UTC)
2. UUIDs are used for all IDs
3. File uploads limited to 10MB by default
4. Maximum 10 files per upload request
5. Supported file types: images, PDFs, text files

---

## 🧪 Testing

Use the included Postman collection or test with curl commands shown above.

For automated testing, mock the API responses or run a test database.
