/**
 *  ------------------------------------------------------------------------
 *  
 *  Log Helper
 *  
 *  @author   Selva Ganapathi R <selva141289@gmail.com>
 *  @version  1.0.0
 * */

'use strict';

const winston = require('winston');
const successLogger = winston.createLogger({}); 
const errorLogger =  winston.createLogger({});;

successLogger.add(new winston.transports.File({
    'name' : 'access-file',
    'level': 'info',
    'filename': './logs/access.log',
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true
}));

errorLogger.add(new winston.transports.File({
    'name' : 'error-file',
    'level': 'error',
    'filename': './logs/error.log',
    'json': false,
    'datePattern': 'yyyy-MM-dd-',
    'prepend': true
}));

/**
 * Export constructor.
 */

module.exports = {
    successLog : successLogger,
    errorLog : errorLogger
}
