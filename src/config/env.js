/**
 * Environment Configuration
 * Loads and validates environment variables from .env file
 */
const dotenv = require('dotenv');
const path = require('path');

// Load .env file from project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 3000,

  // Gemini AI
  geminiApiKey: process.env.GEMINI_API_KEY || '',

  // Email (SMTP)
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || '',
  },

  // Google Sheets (Bonus)
  sheets: {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID || '',
    serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '',
    privateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/^"|"$/g, '').replace(/\\n/g, '\n'),
  },

  // Google Drive (Bonus)
  drive: {
    folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
  },
};

/**
 * Validates that critical environment variables are set.
 * Logs warnings for optional/bonus features.
 */
function validateConfig() {
  const warnings = [];
  const errors = [];

  if (!config.geminiApiKey) {
    errors.push('GEMINI_API_KEY is required for AI-powered data enrichment.');
  }

  if (!config.smtp.user || !config.smtp.pass) {
    errors.push('SMTP_USER and SMTP_PASS are required for email delivery.');
  }

  if (!config.sheets.spreadsheetId || !config.sheets.privateKey) {
    warnings.push('Google Sheets credentials not configured — Sheets logging will be skipped.');
  }

  if (!config.drive.folderId) {
    warnings.push('Google Drive folder ID not configured — PDF archiving will be skipped.');
  }

  return { warnings, errors };
}

module.exports = { config, validateConfig };
