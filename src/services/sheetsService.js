/**
 * Google Sheets Logging Service (BONUS)
 * Appends lead data to a Google Sheet as a live leads tracker
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { config } = require('../config/env');
const logger = require('../utils/logger');

const MODULE = 'Sheets';

// Use GoogleAuth with keyFile pointing to the JSON credentials
function getAuth() {
  const keyFiles = ['service-account.json', 'gen-lang-client-0414862100-fc77bb18875d.json'];
  let keyFile = null;
  for (const file of keyFiles) {
    const filePath = path.resolve(__dirname, '../../', file);
    if (fs.existsSync(filePath)) {
      keyFile = filePath;
      break;
    }
  }
  if (keyFile) {
    return new google.auth.GoogleAuth({
      keyFile: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });
  }

  // Fallback to environment variables (Vercel)
  if (!config.sheets.serviceAccountEmail || !config.sheets.privateKey) {
    throw new Error("Missing Google Service Account credentials.");
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: config.sheets.serviceAccountEmail,
      private_key: config.sheets.privateKey
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });
}

function isConfigured() {
  return !!config.sheets.spreadsheetId;
}

async function ensureHeaders(sheets, spreadsheetId) {
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A1:H1',
    });
    if (!res.data.values || res.data.values.length === 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: 'Sheet1!A1:H1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [['Timestamp', 'Full Name', 'Email', 'Company', 'Industry', 'Company Size', 'Report Status', 'Email Status']],
        },
      });
      logger.info(MODULE, 'Created sheet headers.');
    }
  } catch (error) {
    logger.warn(MODULE, `Could not verify headers: ${error.message}`);
  }
}

/**
 * Logs a lead submission to Google Sheets
 * @param {Object} lead - Lead data
 * @param {string} reportStatus - 'Generated' | 'Failed'
 * @param {string} emailStatus - 'Sent' | 'Failed'
 */
async function logToSheets(lead, reportStatus, emailStatus) {
  if (!isConfigured()) {
    logger.warn(MODULE, 'Google Sheets not configured — skipping.');
    return false;
  }

  try {
    logger.info(MODULE, 'Logging lead to Google Sheets...');
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    await ensureHeaders(sheets, config.sheets.spreadsheetId);

    const timestamp = new Date().toISOString();
    await sheets.spreadsheets.values.append({
      spreadsheetId: config.sheets.spreadsheetId,
      range: 'Sheet1!A:H',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[timestamp, lead.fullName, lead.email, lead.companyName, lead.industry, lead.companySize, reportStatus, emailStatus]],
      },
    });

    logger.success(MODULE, 'Lead logged to Google Sheets.');
    return true;
  } catch (error) {
    logger.error(MODULE, `Sheets logging failed: ${error.message}`);
    return false;
  }
}

module.exports = { logToSheets };
