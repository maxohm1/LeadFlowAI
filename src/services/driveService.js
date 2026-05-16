/**
 * Google Drive Archiving Service (BONUS)
 * Uploads generated PDF reports to a Google Drive folder
 */
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const { config } = require('../config/env');
const logger = require('../utils/logger');

const MODULE = 'Drive';

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
  
  if (!keyFile) {
     throw new Error("No service account JSON file found.");
  }

  return new google.auth.GoogleAuth({
    keyFile: keyFile,
    scopes: ['https://www.googleapis.com/auth/drive.file']
  });
}

function isConfigured() {
  return !!config.drive.folderId;
}

/**
 * Uploads a PDF file to Google Drive
 * @param {{ filePath: string, fileName: string }} pdfInfo
 * @returns {string|null} Drive file URL or null
 */
async function uploadToDrive(pdfInfo) {
  if (!isConfigured()) {
    logger.warn(MODULE, 'Google Drive not configured — skipping.');
    return null;
  }

  try {
    logger.info(MODULE, `Uploading PDF to Google Drive: ${pdfInfo.fileName}`);
    const auth = getAuth();
    const drive = google.drive({ version: 'v3', auth });

    const fileMetadata = {
      name: pdfInfo.fileName,
      parents: [config.drive.folderId],
    };

    const media = {
      mimeType: 'application/pdf',
      body: fs.createReadStream(pdfInfo.filePath),
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileUrl = response.data.webViewLink || `https://drive.google.com/file/d/${response.data.id}/view`;
    logger.success(MODULE, `PDF uploaded to Drive: ${fileUrl}`);
    return fileUrl;
  } catch (error) {
    logger.error(MODULE, `Drive upload failed: ${error.message}`);
    return null;
  }
}

module.exports = { uploadToDrive };
