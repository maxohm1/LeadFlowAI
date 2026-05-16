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

##  System Design

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


## No need to setup Credential Key
Here are all the credential key are already setup - 
GEMINI_API_KEY, SMTP_USER, SMTP_PASS, GOOGLE_SHEETS_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_DRIVE_FOLDER_ID. you can also use own credentail key by replacing your credentail in .env file

Warning: Please don't use this creadential key for personal use. it automatically close after 7 days.


##  Working Process

### Pipeline Flow (After Form Submission)

1. **Validation** — Server validates all inputs (name, email format, company name)
2. **Immediate Response** — Client receives a 202 Accepted with confirmation message
3. **Web Scraping** — System scrapes the company's website for metadata, about info, services
4. **AI Research** — Google Gemini analyzes the company using scraped data + its knowledge
5. **PDF Generation** — Puppeteer renders a styled HTML template into a professional PDF
6. **Email Delivery** — Nodemailer sends the PDF as an attachment with a personalized email
7. **Sheets Logging** — Lead data is appended to Google Sheets (if configured)
8. **Drive Archive** — PDF is uploaded to Google Drive (if configured)



##  Bonus Features

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


