/**
 * Email Delivery Service
 * Sends personalized emails with PDF report attachments using Nodemailer
 */
const nodemailer = require('nodemailer');
const fs = require('fs');
const { config } = require('../config/env');
const logger = require('../utils/logger');

const MODULE = 'Email';

/**
 * Creates the Nodemailer transporter
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: false,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
}

/**
 * Generates professional HTML email body
 */
function generateEmailHTML(lead, enrichment) {
  const highlights = [];
  if (enrichment.strengths?.length) highlights.push(enrichment.strengths[0]);
  if (enrichment.opportunities?.length) highlights.push(enrichment.opportunities[0]);
  if (enrichment.recommendations?.length) highlights.push(enrichment.recommendations[0]);

  return `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background: #f4f4f8; }
  .container { max-width: 600px; margin: 0 auto; background: #fff; }
  .header { background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%); padding: 40px 32px; text-align: center; }
  .header h1 { color: #fff; font-size: 24px; margin: 0 0 8px; }
  .header p { color: rgba(255,255,255,0.7); font-size: 14px; margin: 0; }
  .body { padding: 32px; }
  .body h2 { color: #1a1a2e; font-size: 20px; margin: 0 0 16px; }
  .body p { color: #374151; font-size: 15px; line-height: 1.6; margin: 0 0 16px; }
  .highlight-box { background: #f8fafc; border-left: 4px solid #6366f1; padding: 16px 20px; border-radius: 0 8px 8px 0; margin: 20px 0; }
  .highlight-box h3 { color: #6366f1; font-size: 14px; margin: 0 0 10px; letter-spacing: 1px; text-transform: uppercase; }
  .highlight-box li { color: #374151; font-size: 14px; margin: 6px 0; }
  .cta { text-align: center; margin: 28px 0; }
  .cta a { display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 15px; }
  .footer { background: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer p { color: #9ca3af; font-size: 12px; margin: 4px 0; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>Your Business Intelligence Report</h1>
    <p>Prepared exclusively for ${lead.companyName}</p>
  </div>
  <div class="body">
    <h2>Hi ${lead.fullName.split(' ')[0]},</h2>
    <p>Thank you for your interest! We've prepared a <strong>personalized business intelligence report</strong> for <strong>${lead.companyName}</strong>.</p>
    <p>Our AI-powered analysis has examined your company's market position, competitive landscape, and growth opportunities to deliver actionable insights.</p>

    ${highlights.length > 0 ? `
    <div class="highlight-box">
      <h3>Key Highlights from Your Report</h3>
      <ul>${highlights.map(h => `<li>✦ ${h}</li>`).join('')}</ul>
    </div>
    ` : ''}

    <p>📎 <strong>Your full report is attached as a PDF.</strong> It includes a comprehensive SWOT analysis, competitive landscape review, and strategic recommendations tailored specifically to your business.</p>

    <div class="cta">
      <a href="mailto:${config.smtp.user}?subject=Follow-up: ${lead.companyName} Report">Schedule a Follow-up →</a>
    </div>

    <p>We'd love to discuss these findings and explore how we can help ${lead.companyName} achieve its goals.</p>
    <p>Best regards,<br><strong>LeadFlowAI Team</strong></p>
  </div>
  <div class="footer">
    <p>This email was sent by LeadFlowAI — AI-Powered Business Intelligence</p>
    <p>© ${new Date().getFullYear()} LeadFlowAI. All rights reserved.</p>
  </div>
</div>
</body>
</html>`;
}

/**
 * Sends the report email with PDF attachment
 * @param {Object} lead - Lead data
 * @param {Object} enrichment - Enrichment data
 * @param {{ filePath: string, fileName: string }} pdfInfo - PDF file info
 * @returns {boolean} Success status
 */
async function sendReportEmail(lead, enrichment, pdfInfo) {
  logger.info(MODULE, `Sending report email to: ${lead.email}`);

  try {
    const transporter = createTransporter();
    const htmlContent = generateEmailHTML(lead, enrichment);

    const mailOptions = {
      from: config.smtp.from || `LeadFlowAI <${config.smtp.user}>`,
      to: lead.email,
      subject: `📊 Your Personalized Business Intelligence Report — ${lead.companyName}`,
      html: htmlContent,
      attachments: [
        {
          filename: pdfInfo.fileName,
          path: pdfInfo.filePath,
          contentType: 'application/pdf',
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    logger.success(MODULE, `Email sent successfully to ${lead.email}`);
    return true;
  } catch (error) {
    logger.error(MODULE, `Email delivery failed: ${error.message}`);
    // Retry once
    try {
      logger.info(MODULE, 'Retrying email delivery...');
      const transporter = createTransporter();
      const htmlContent = generateEmailHTML(lead, enrichment);
      await transporter.sendMail({
        from: config.smtp.from || `LeadFlowAI <${config.smtp.user}>`,
        to: lead.email,
        subject: `📊 Your Personalized Business Intelligence Report — ${lead.companyName}`,
        html: htmlContent,
        attachments: [{ filename: pdfInfo.fileName, path: pdfInfo.filePath, contentType: 'application/pdf' }],
      });
      logger.success(MODULE, `Email sent on retry to ${lead.email}`);
      return true;
    } catch (retryError) {
      logger.error(MODULE, `Email retry also failed: ${retryError.message}`);
      return false;
    }
  }
}

module.exports = { sendReportEmail };
