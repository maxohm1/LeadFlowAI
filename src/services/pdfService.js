/**
 * PDF Generation Service
 * Uses Puppeteer to render HTML templates into professional PDF documents
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { generateReportHTML } = require('../templates/reportTemplate');
const logger = require('../utils/logger');

const MODULE = 'PDF';
const REPORTS_DIR = path.resolve(__dirname, '../../reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Generates a PDF report from enriched company data
 * @param {Object} enrichedData - Complete enrichment result
 * @returns {{ filePath: string, fileName: string }} PDF file info
 */
async function generatePDF(enrichedData) {
  const { lead } = enrichedData;
  const sanitizedName = lead.companyName.replace(/[^a-zA-Z0-9]/g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `${sanitizedName}_Audit_Report_${dateStr}.pdf`;
  const filePath = path.join(REPORTS_DIR, fileName);

  logger.info(MODULE, `Generating PDF report: ${fileName}`);

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    const html = generateReportHTML(enrichedData);

    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Give fonts a moment to load, but don't block on them
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.pdf({
      path: filePath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      preferCSSPageSize: true,
    });

    logger.success(MODULE, `PDF generated: ${filePath}`);
    return { filePath, fileName };
  } catch (error) {
    logger.error(MODULE, `PDF generation failed: ${error.message}`);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
}

module.exports = { generatePDF };
