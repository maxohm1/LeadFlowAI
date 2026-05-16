/**
 * Lead Controller
 * Orchestrates the full lead processing pipeline:
 * Validate → Enrich → Generate PDF → Send Email → Log → Archive
 */
const { validateLeadData } = require('../utils/validators');
const { enrichCompanyData } = require('../services/enrichmentService');
const { generatePDF } = require('../services/pdfService');
const { sendReportEmail } = require('../services/emailService');
const { logToSheets } = require('../services/sheetsService');
const { uploadToDrive } = require('../services/driveService');
const logger = require('../utils/logger');

const MODULE = 'Controller';

/**
 * Handles lead form submission
 * Returns immediate acknowledgment, processes pipeline asynchronously
 */
async function handleLeadSubmission(req, res) {
  // ── Step 1: Validate Input ──
  const { valid, errors, sanitized } = validateLeadData(req.body);

  if (!valid) {
    logger.warn(MODULE, 'Validation failed', errors);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  logger.pipeline(`New lead received: ${sanitized.fullName} from ${sanitized.companyName}`);

  // Send immediate response to the client
  res.status(202).json({
    success: true,
    message: `Thank you, ${sanitized.fullName}! We're preparing a personalized business intelligence report for ${sanitized.companyName}. You'll receive it at ${sanitized.email} shortly.`,
    lead: {
      fullName: sanitized.fullName,
      company: sanitized.companyName,
      email: sanitized.email,
    },
  });

  // ── Process pipeline asynchronously ──
  let reportStatus = 'Failed';
  let emailStatus = 'Failed';
  let pdfInfo = null;

  try {
    // Step 2: Data Enrichment
    logger.step(MODULE, 1, 5, 'Enriching company data...');
    const enrichedData = await enrichCompanyData(sanitized);

    // Step 3: PDF Generation
    logger.step(MODULE, 2, 5, 'Generating PDF report...');
    pdfInfo = await generatePDF(enrichedData);
    reportStatus = 'Generated';

    // Step 4: Email Delivery
    logger.step(MODULE, 3, 5, 'Sending email...');
    const emailSent = await sendReportEmail(sanitized, enrichedData.enrichment, pdfInfo);
    emailStatus = emailSent ? 'Sent' : 'Failed';

    // Step 5: Google Sheets Logging (BONUS — non-blocking)
    logger.step(MODULE, 4, 5, 'Logging to Google Sheets...');
    await logToSheets(sanitized, reportStatus, emailStatus).catch(err =>
      logger.warn(MODULE, `Sheets logging skipped: ${err.message}`)
    );

    // Step 6: Google Drive Archiving (BONUS — non-blocking)
    logger.step(MODULE, 5, 5, 'Archiving to Google Drive...');
    if (pdfInfo) {
      await uploadToDrive(pdfInfo).catch(err =>
        logger.warn(MODULE, `Drive archiving skipped: ${err.message}`)
      );
    }

    logger.pipeline(`✨ Pipeline complete for ${sanitized.companyName} — Report: ${reportStatus}, Email: ${emailStatus}`);
  } catch (error) {
    logger.error(MODULE, `Pipeline error: ${error.message}`);
    // Still try to log to sheets even on failure
    await logToSheets(sanitized, reportStatus, emailStatus).catch(() => {});
  }
}

module.exports = { handleLeadSubmission };
