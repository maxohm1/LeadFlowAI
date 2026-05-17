/**
 * LeadFlowAI — Express Server
 * Entry point for the application
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const { config, validateConfig } = require('./config/env');
const leadRoutes = require('./routes/leadRoutes');
const logger = require('./utils/logger');

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Static Files ──
app.use(express.static(path.resolve(__dirname, '../public')));

// ── API Routes ──
app.use('/api', leadRoutes);

// ── Catch-all: serve index.html for SPA routing ──
app.get('/{*splat}', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// ── Global Error Handler ──
app.use((err, req, res, next) => {
  logger.error('Server', `Unhandled error: ${err.message}`);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start Server ──
const PORT = config.port;

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('\n');
    console.log('  ╔═══════════════════════════════════════════════╗');
    console.log('  ║                                               ║');
    console.log('  ║      🚀 LeadFlowAI Server is Running!         ║');
    console.log(`  ║      📡 http://localhost:${PORT}                  ║`);
    console.log('  ║                                               ║');
    console.log('  ╚═══════════════════════════════════════════════╝');
    console.log('\n');

    // Validate configuration
    const { warnings, errors } = validateConfig();
    errors.forEach(e => logger.error('Config', e));
    warnings.forEach(w => logger.warn('Config', w));

    if (errors.length === 0) {
      logger.success('Config', 'All required configurations are set.');
    }
  });
}

module.exports = app;
