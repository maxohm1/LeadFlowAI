# LeadFlowAI

LeadFlowAI is an automated lead intelligence platform that generates personalized business reports from inbound prospect submissions.

The system collects lead information, enriches company data using publicly available sources, generates audit reports, and delivers the final report via email through a fully automated workflow.

Click here to access Live Website 👉 - https://automail-topaz.vercel.app/
Track Live Google sheets data entry 👉- https://docs.google.com/spreadsheets/d/1a0Rr13VcdPZUOjTUP-7tgs300EsfjUcG_l7QJ6vgRjk/edit?gid=0#gid=0




## Screenshots and Video
---

<table>
<tr>
<td align="center">
<b>Demo Video</b><br>
<video src="https://github.com/user-attachments/assets/1b535746-b9ad-4a19-9cfd-30a841161b83" controls width="400"></video>
</td>

<td align="center">
<b>PDF First Page</b><br>
<img src="https://github.com/user-attachments/assets/9496c607-e756-470d-8ce6-da7ea149993c" width="400"/>
</td>
</tr>
</table>

| Data Entry | After Send Mail |
|------------|------------------|
| ![Screenshot 2](https://github.com/user-attachments/assets/6a9a78c1-2505-40e5-b3b9-b96d05aeab01) | ![Screensh](https://github.com/user-attachments/assets/5f34abd6-0903-462c-84da-40b6927e88c0) |

---

| Auto Send on Gmail | Google Sheet Live Update |
|--------------------|--------------------------|
| ![](https://github.com/user-attachments/assets/2b8cd309-722d-49af-b1c0-81fcf8213f28) | ![](https://github.com/user-attachments/assets/c767cabd-c924-4516-9529-73642f2845dd) |

---

##  System Design

![](https://github.com/user-attachments/assets/3bccada3-f793-49c9-a1ff-61432f1e6ec7)

---

## Features

- Lead intake and validation
- Company data enrichment
- AI-assisted business analysis
- PDF report generation
- Automated email delivery
- Google Sheets lead logging
- Google Drive PDF archival







## Environment Variables(No need to setup Credential Key)

The following credential keys are already configured:

- GEMINI_API_KEY
- SMTP_USER
- SMTP_PASS
- GOOGLE_SHEETS_ID
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_PRIVATE_KEY
- GOOGLE_DRIVE_FOLDER_ID

You can also use your own credential keys by replacing them in the `.env` file.


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
in my case Drive folder is not working due to Quota limitation.

---



<div align="center">

**This Assesement take so much time please have a look onces<img src="https://images.emojiterra.com/google/noto-emoji/animated-emoji/2764.gif" height="30" alt="love" />CheckOut Out More <img src="https://github.com/maxohm1/OneAI-ScreenShot/blob/main/200w.gif" height="40" />**

<br><br>

<a href="https://www.linkedin.com/in/om-prakash-mandal-a253a12a6/" target="_blank">
    <img src="https://github.com/maxohm1/OneAI-ScreenShot/blob/main/372102050_LINKEDIN_ICON_TRANSPARENT_1080.gif" width="150" />
</a>

<a href="https://play.google.com/store/apps/details?id=max.ohm.oneai&hl=en" target="_blank">
    <img src="https://user-images.githubusercontent.com/74038190/212281763-e6ecd7ef-c4aa-45b6-a97c-f33f6bb592bd.gif" width="100" />
</a>

<a href="https://github.com/Android-by-Kotlin/OneAI-2.0" target="_blank">
    <img src="https://user-images.githubusercontent.com/74038190/212257468-1e9a91f1-b626-4baa-b15d-5c385dfa7ed2.gif" width="140" />
</a>

</div>

