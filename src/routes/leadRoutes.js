/**
 * Lead API Routes
 * Defines all lead-related API endpoints
 */
const express = require('express');
const router = express.Router();
const { handleLeadSubmission } = require('../controllers/leadController');

// POST /api/leads — Submit a new lead
router.post('/leads', handleLeadSubmission);

// GET /api/health — Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'LeadFlowAI',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

module.exports = router;
