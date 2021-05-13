const winston = require("winston");

var logger = winston.createLogger({
	level: "debug",
	format: winston.format.combine(
		winston.format.colorize(),
		winston.format.timestamp(),
		winston.format.printf(({ level, message, timestamp }) => {
			return `${timestamp}-${level}:\n${message}\n`;
		})
	),
	transports: [
    new winston.transports.File({
			filename: 'error.log',
			level: 'error',
			handleExceptions: true
		}),
    new winston.transports.File({
			filename: 'combined.log',
			level: 'info'
		}),
  ],
	exitOnError: false,
});
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
		level: "debug",
		handleExceptions: true
	}));
}
module.exports=logger;

// Use winston instead of default logger
console.log = (...args) => logger.info.call(logger, ...args);
console.info = (...args) => logger.info.call(logger, ...args);
console.warn = (...args) => logger.warn.call(logger, ...args);
console.error = (...args) => logger.error.call(logger, ...args);
console.debug = (...args) => logger.debug.call(logger, ...args);
