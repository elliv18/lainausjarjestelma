const { createLogger, format, transports } = require('winston');
const dailyRotateFile = require('winston-daily-rotate-file');
const fs = require('fs');
const moment = require('moment-timezone');

const logDir = 'logs';
const env = process.env.NODE_ENV || 'development';

const {
  combine,
  timestamp,
  splat,
  printf,
} = format;

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const tzTimestamp = format((info, opts) => {
  if (opts.tz) {
    info.timestamp = moment().tz(opts.tz).format('YYYY-MM-DD HH:mm:ss');
  }
  return info;
});

const logger = createLogger({
  format: combine(
    tzTimestamp({ tz: 'Europe/Helsinki' }),
    splat(), // Enables string formating, aka. %s %d
    printf((info) => {
      return `[${info.timestamp}] ${info.level}: ${info.message}`;
    }),
  ),
  transports: [
    new dailyRotateFile({
      filename: `${logDir}/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      // prepend: true,
      level: env === 'development' ? 'verbose' : 'info',
      maxFiles: '30d',
    }),
  ],
});

logger.on('rotate', (oldFilename, newFilename) => {
// do something fun
});

logger.log('info', 'Starting logging service...');

module.exports = logger;
