'use strict';

// Dependencies
const winston = require('winston');
const fs = require('fs');
const env = process.env.NODE_ENV || 'dev';
const log_directory = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(log_directory)) {
	fs.mkdirSync(log_directory);
}
const tsFormat = function () {
	return new Date().toLocaleTimeString();
};
let logger;
// Turn off console logging during testing
if (process.env.NODE_ENV !== 'test') {
	logger = new (winston.Logger)({
		transports: [
			// Colorize and add timestamps to console output
			new (winston.transports.Console)({
				colorize: true,
				level: 'debug'
			}),
			new (winston.transports.File)({
				filename: `${log_directory}/logs.log`,
				timestamp: tsFormat,
				level: env === 'dev' ? 'debug' : 'info'
			})
		]
	});

}
else {

	logger = new (winston.Logger)({
		transports: [
			new (winston.transports.File)({
				filename: `${log_directory}/logs.log`,
				timestamp: tsFormat,
				level: env === 'dev' ? 'debug' : 'info'
			})
		]
	});
}

module.exports = logger;
