/**
 * Structured Logger Utility
 * Provides consistent, timestamped logging across the application
 */

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

function timestamp() {
  return new Date().toISOString();
}

function formatMessage(level, emoji, color, module, message, data) {
  const ts = timestamp();
  const prefix = `${color}${COLORS.bright}[${level}]${COLORS.reset}`;
  const moduleTag = module ? `${COLORS.cyan}[${module}]${COLORS.reset}` : '';
  const msg = `${prefix} ${COLORS.dim}${ts}${COLORS.reset} ${emoji} ${moduleTag} ${message}`;

  if (data) {
    console.log(msg, typeof data === 'object' ? JSON.stringify(data, null, 2) : data);
  } else {
    console.log(msg);
  }
}

const logger = {
  info: (module, message, data) =>
    formatMessage('INFO', '📋', COLORS.blue, module, message, data),

  success: (module, message, data) =>
    formatMessage('SUCCESS', '✅', COLORS.green, module, message, data),

  warn: (module, message, data) =>
    formatMessage('WARN', '⚠️', COLORS.yellow, module, message, data),

  error: (module, message, data) =>
    formatMessage('ERROR', '❌', COLORS.red, module, message, data),

  step: (module, step, total, message) =>
    formatMessage('STEP', '🔄', COLORS.magenta, module, `[${step}/${total}] ${message}`),

  pipeline: (message) =>
    formatMessage('PIPELINE', '🚀', COLORS.cyan, null, message),
};

module.exports = logger;
