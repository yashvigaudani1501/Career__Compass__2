

```markdown
# 🧠 ATS Tracker - Django ML Microservice Documentation

## 📌 Overview
The ML Microservice is the "AI Brain" of the ATS Tracker platform. Built with **Django and Python**, it is a *stateless* microservice. It does not connect to any database; instead, it receives requests from the Node.js backend, performs heavy computational tasks (PDF extraction, Web Scraping, and LLM prompting), and returns structured JSON data back to Node.js.

## 🛠 Tech Stack
- **Framework:** Django & Django REST Framework (DRF)
- **Language:** Python 3
- **AI / LLM:** Groq API (`llama-3.1-8b-instant` model)
- **PDF Extraction:** `pdfplumber` (Handles complex resume layouts and vector graphics)
- **Web Scraping:** `BeautifulSoup4` & `requests`
- **Server:** Gunicorn (for Render deployment) & `django-cors-headers`

---

## 📂 Folder Structure
```text
ML/
├── api/                      # Main Django Application
│   ├── utils/                # Core AI and Logic Modules
│   │   ├── groq_service.py   # Prompts and communicates with the Groq AI API
│   │   ├── pdf_extractor.py  # Uses pdfplumber to extract raw text from PDF files
│   │   └── scraper.py        # Uses BeautifulSoup to scrape and clean website text
│   ├── urls.py               # API route definitions
│   └── views.py              # Controller functions linking utils to API routes
├── core/                     # Main Django Project Settings
│   ├── settings.py           # Config, CORS, Allowed Hosts
│   └── urls.py               # Main URL router linking to the 'api' app
├── .env                      # Environment variables (API Keys)
├── manage.py                 # Django command-line utility
└── requirements.txt          # Python dependencies for deployment
```

---

## 🔐 Environment Variables (`.env`)
To run this service locally or in production, you need an active API key from Groq Cloud.
```env
GROQ_API_KEY=gsk_your_groq_api_key_here
```

---

## ⚙️ Core Modules (The "Brain")

### 1. PDF Extractor (`pdf_extractor.py`)
- **Library:** `pdfplumber`
- **Logic:** Receives an in-memory PDF file object from the API request. It rewinds the file pointer (`seek(0)`), iterates through all pages, and extracts visible text while ignoring complex styling. Returns a single raw text string.

### 2. Web Scraper (`scraper.py`)
- **Library:** `requests`, `BeautifulSoup`
- **Logic:** Takes a target URL, fetches the HTML, and strips out all `<script>` and `<style>` tags to isolate human-readable text. It returns the first 3000 characters to prevent overloading the AI token limit.

### 3. Groq AI Service (`groq_service.py`)
Handles all communication with the `llama-3.1-8b-instant` LLM. It enforces a strict `temperature=0.1` to prevent hallucination and forces the AI to output **only** valid JSON.
- **`analyze_resume_with_groq(text)`:** Prompts the AI to act as an ATS system, calculates a score (0-100), extracts top 5 skills, and suggests 3 job titles.
- **`summarize_company_with_groq(text)`:** Prompts the AI to act as a business analyst, identifies the company's industry, and writes a professional 2-3 sentence summary based on scraped website data.

---

## 📡 API Endpoints

Base URL (Production): `https://ats-ml-service-xxxxx.onrender.com/api`

### 1. Resume Processing
- **Endpoint:** `POST /process-resume/`
- **Payload:** `multipart/form-data` -> `resume: [PDF FILE]`
- **Description:** Receives a PDF file, extracts the text, sends it to Groq AI, and returns the ATS analysis.
- **Expected Response (200 OK):**
  ```json
  {
      "ats_score": 85,
      "extracted_skills": ["React", "Python", "MongoDB", "Node.js", "Docker"],
      "suggested_jobs": ["Full Stack Developer", "Software Engineer", "Backend Developer"]
  }
  ```

### 2. Company Web Scraping
- **Endpoint:** `POST /scrape-company/`
- **Payload:** `application/json` -> `{ "website": "https://stripe.com" }`
- **Description:** Scrapes the provided URL and uses AI to generate a professional company profile.
- **Expected Response (200 OK):**
  ```json
  {
      "work": "Financial Services",
      "companyInfo": "Stripe provides financial infrastructure to help businesses grow their revenue..."
  }
  ```

### 3. Health Check
- **Endpoint:** `GET /health/`
- **Description:** Pings the service to verify it is awake and functioning (Useful for Render's cold-start delays).
- **Expected Response (200 OK):**
  ```json
  {
      "status": "Active",
      "message": "Django ML Microservice is up and running! 🧠🚀",
      "environment": "Production"
  }
  ```

---

## 🚀 Deployment Notes
- Hosted on **Render.com** as a Python Web Service.
- Uses **Gunicorn** (`gunicorn core.wsgi:application`) as the production WSGI HTTP server.
- `ALLOWED_HOSTS = ['*']` and `CORS_ALLOW_ALL_ORIGINS = True` are configured to accept requests securely from the Node.js backend.
```
