# 🚀 LeadFlowAI — AI-Powered Lead Automation System

> End-to-end lead capture → data enrichment → PDF report generation → email delivery pipeline.

Built for the **SimplifIQ AI Software Developer Intern Assessment**.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [How It Works](#how-it-works)
- [Project Structure](#project-structure)
- [Design Decisions & Tradeoffs](#design-decisions--tradeoffs)
- [Assumptions & Limitations](#assumptions--limitations)
- [Bonus Features](#bonus-features)

---

## 🎯 Overview

**LeadFlowAI** automates the entire lead intake-to-outreach workflow. When a prospect submits a form with their company details, the system automatically:

1. **Captures & validates** the submitted lead information
2. **Enriches** company data using web scraping + Google Gemini AI
3. **Generates** a personalized, professional audit report in PDF format
4. **Sends** the report to the prospect via email
5. **(Bonus)** Logs the lead to Google Sheets & archives the PDF to Google Drive

All without any human intervention.

---

## 🏗️ Architecture

```
┌─────────────────┐     POST /api/leads     ┌──────────────────┐
│   Lead Intake    │ ──────────────────────► │   Express API    │
│   Form (HTML)    │ ◄────── 202 Accepted ── │   Server         │
└─────────────────┘                          └────────┬─────────┘
                                                      │ (async pipeline)
                                                      ▼
                                             ┌──────────────────┐
                                             │  1. Enrichment   │
                                             │  - Web Scraping  │
                                             │  - Gemini AI     │
                                             └────────┬─────────┘
                                                      ▼
                                             ┌──────────────────┐
                                             │  2. PDF Report   │
                                             │  - Puppeteer     │
                                             │  - HTML Template  │
                                             └────────┬─────────┘
                                                      ▼
                                             ┌──────────────────┐
                                             │  3. Email        │
                                             │  - Nodemailer    │
                                             │  - SMTP (Gmail)  │
                                             └────────┬─────────┘
                                                      ▼
                                       ┌──────────────┴──────────────┐
                                       ▼                              ▼
                              ┌─────────────────┐          ┌─────────────────┐
                              │ 4. Google Sheets │          │ 5. Google Drive  │
                              │    (Logging)     │          │   (Archiving)    │
                              └─────────────────┘          └─────────────────┘
```

---

## ✨ Features

### Core Features
- **🌐 Premium Lead Intake Form** — Glassmorphism dark-theme design with real-time validation
- **🔍 Multi-Layered Data Enrichment** — Combines website scraping (Cheerio) with AI research (Google Gemini)
- **📄 Professional PDF Reports** — Cover page, executive summary, SWOT analysis, competitive landscape, strategic recommendations
- **📧 Automated Email Delivery** — Professional HTML email with personalized highlights and PDF attachment
- **🛡️ Graceful Error Handling** — Fallbacks at every step; system never crashes on bad data

### Bonus Features
- **📊 Google Sheets Logging** — Live leads tracker with auto-created headers
- **☁️ Google Drive Archiving** — PDF reports automatically uploaded to Drive

---

## 🛠️ Tech Stack

| Component | Technology | Purpose |
|:---|:---|:---|
| Frontend | HTML / CSS / JavaScript | Premium lead intake form |
| Backend | Node.js + Express | API server & pipeline orchestration |
| AI Engine | Google Gemini API (Flash) | Deep company research & insights |
| Web Scraping | Cheerio + Axios | Extract company website data |
| PDF Generation | Puppeteer | HTML-to-PDF rendering |
| Email | Nodemailer (Gmail SMTP) | Email delivery with attachments |
| Sheets API | Google Sheets v4 | Lead logging (bonus) |
| Drive API | Google Drive v3 | PDF archiving (bonus) |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js 18+** and **npm**
- **Google Gemini API Key** (free) — [Get it here](https://aistudio.google.com/apikey)
- **Gmail Account** with 2FA + App Password for email delivery

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/LeadFlowAI.git
cd LeadFlowAI

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env with your API keys (see Configuration section)

# 5. Start the server
npm start

# Or with auto-reload during development
npm run dev
```

The server will start at **http://localhost:3000**

---

## ⚙️ Configuration

Copy `.env.example` to `.env` and fill in your credentials:

### Required

| Variable | Description | How to Get |
|:---|:---|:---|
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://aistudio.google.com/apikey) — free |
| `SMTP_USER` | Gmail address | Your Gmail account |
| `SMTP_PASS` | Gmail App Password | [Google App Passwords](https://myaccount.google.com/apppasswords) (requires 2FA) |

### Gmail App Password Setup
1. Go to your Google Account → Security
2. Enable **2-Step Verification** if not already enabled
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** and generate a 16-character password
5. Use this as `SMTP_PASS` in your `.env`

### Optional (Bonus Features)

| Variable | Description |
|:---|:---|
| `GOOGLE_SHEETS_ID` | Your Google Sheets spreadsheet ID |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Service account private key |
| `GOOGLE_DRIVE_FOLDER_ID` | Drive folder for PDF archives |

---

## 🔄 How It Works

### Pipeline Flow (After Form Submission)

1. **Validation** — Server validates all inputs (name, email format, company name)
2. **Immediate Response** — Client receives a 202 Accepted with confirmation message
3. **Web Scraping** — System scrapes the company's website for metadata, about info, services
4. **AI Research** — Google Gemini analyzes the company using scraped data + its knowledge
5. **PDF Generation** — Puppeteer renders a styled HTML template into a professional PDF
6. **Email Delivery** — Nodemailer sends the PDF as an attachment with a personalized email
7. **Sheets Logging** — Lead data is appended to Google Sheets (if configured)
8. **Drive Archive** — PDF is uploaded to Google Drive (if configured)

### Error Handling Strategy

| Scenario | Behavior |
|:---|:---|
| Website URL not provided | Skip scraping, rely on AI research |
| Website scraping fails | Log warning, proceed with AI-only research |
| Gemini API fails | Use fallback template with generic insights |
| Both scraping + AI fail | Generate basic report with available data |
| Email delivery fails | Retry once; log failure status |
| Sheets/Drive fail | Log warning; never blocks the main pipeline |

---

## 📁 Project Structure

```
LeadFlowAI/
├── public/                         # Frontend assets
│   ├── index.html                  # Lead intake form page
│   ├── css/styles.css              # Premium dark theme CSS
│   └── js/app.js                   # Form validation & submission
├── src/
│   ├── server.js                   # Express server entry point
│   ├── config/env.js               # Environment configuration
│   ├── routes/leadRoutes.js        # API route definitions
│   ├── controllers/leadController.js  # Pipeline orchestration
│   ├── services/
│   │   ├── enrichmentService.js    # AI + scraping enrichment
│   │   ├── pdfService.js           # Puppeteer PDF generation
│   │   ├── emailService.js         # Nodemailer email delivery
│   │   ├── sheetsService.js        # Google Sheets logging
│   │   └── driveService.js         # Google Drive archiving
│   ├── templates/reportTemplate.js # HTML template for PDF
│   └── utils/
│       ├── validators.js           # Input validation
│       └── logger.js               # Structured logging
├── reports/                        # Generated PDFs (gitignored)
├── .env.example                    # Environment template
├── .gitignore
├── package.json
└── README.md
```

---

## 🎨 Design Decisions & Tradeoffs

### 1. Asynchronous Pipeline
**Decision:** The API returns a 202 Accepted immediately and processes the pipeline asynchronously.
**Why:** The enrichment + PDF + email flow takes 15-30 seconds. Blocking the HTTP response would cause timeouts and poor UX.

### 2. Google Gemini over Other AI APIs
**Decision:** Used Google Gemini (Flash model) for company research.
**Why:** Free tier is generous, API is fast, and it provides excellent structured output for business analysis. Flash models balance cost and quality.

### 3. Puppeteer for PDF Generation
**Decision:** Used Puppeteer (HTML-to-PDF) instead of PDFKit or pdfmake.
**Why:** Allows designing reports with HTML/CSS — more flexible, visually richer, and easier to iterate on design.

### 4. Cheerio over Puppeteer for Scraping
**Decision:** Used Cheerio (lightweight) instead of launching a full browser for scraping.
**Why:** Most company websites serve sufficient metadata in static HTML. Cheerio is 10x faster and uses minimal resources.

### 5. Graceful Degradation
**Decision:** Every service has fallbacks — the system never crashes.
**Why:** Real-world scenarios include bad URLs, API rate limits, and missing data. The system should always deliver *something* useful.

### 6. No Database
**Decision:** No database — PDFs stored on disk, leads logged to Sheets.
**Why:** For a prototype, file storage + Google Sheets is simpler and demonstrates the concept without infrastructure overhead.

---

## ⚠️ Assumptions & Limitations

### Assumptions
- The user has a Gmail account with 2FA enabled for SMTP email delivery
- Google Gemini API key is available (free tier)
- Company websites are publicly accessible for scraping
- The system runs on a machine with sufficient RAM for Puppeteer (~100MB per PDF generation)

### Limitations
- **No persistent database** — lead data lives in Sheets only; restarting the server doesn't preserve state
- **Single-threaded PDF generation** — concurrent requests will queue; for production, use a job queue (Bull/Redis)
- **Scraping limitations** — heavily JavaScript-rendered sites may not yield much data via Cheerio
- **Gemini rate limits** — free tier has RPM/RPD limits; high traffic may hit quota
- **Email deliverability** — Gmail SMTP may land in spam for unknown recipients; production should use SendGrid/SES
- **No authentication** — the form is public; production should add rate limiting and CAPTCHA

---

## 🏆 Bonus Features

### Google Sheets Logging
- Automatically appends each lead's data to a Google Sheet
- Columns: Timestamp, Full Name, Email, Company, Industry, Size, Report Status, Email Status
- Creates headers automatically on first run
- **Setup:** Create a Google Cloud service account, share your spreadsheet with the service account email

### Google Drive Archiving
- Uploads each generated PDF to a specified Google Drive folder
- Files named: `{CompanyName}_Audit_Report_{Date}.pdf`
- **Setup:** Share your Drive folder with the service account email

---

## 📜 License

ISC © Amit Mandal
