# LeadFlowAI

LeadFlowAI is an automated lead intelligence platform that generates personalized business reports from inbound prospect submissions.

The system collects lead information, enriches company data using publicly available sources, generates audit reports, and delivers the final report via email through a fully automated workflow.

## Features

- Lead intake and validation
- Company data enrichment
- AI-assisted business analysis
- PDF report generation
- Automated email delivery
- Google Sheets lead logging
- Google Drive PDF archival

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




| Variable | Description | How to Get |
|:---|:---|:---|
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://aistudio.google.com/apikey) — free |
| `SMTP_USER` | Gmail address | Your Gmail account |
| `SMTP_PASS` | Gmail App Password | [Google App Passwords](https://myaccount.google.com/apppasswords) (requires 2FA) |


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


