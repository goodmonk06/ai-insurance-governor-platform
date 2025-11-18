"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logHelpers = exports.ConsoleLogger = void 0;
exports.setGlobalLogger = setGlobalLogger;
exports.getLogger = getLogger;
/**
 * Simple console logger implementation with structured output.
 * For production, consider using Winston, Pino, or cloud-native logging services.
 */
class ConsoleLogger {
    baseContext;
    minLevel;
    static levelPriority = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3,
        fatal: 4,
    };
    constructor(options) {
        this.baseContext = options?.context || {};
        this.minLevel = options?.minLevel || 'info';
    }
    debug(message, context, data) {
        this.log('debug', message, context, data);
    }
    info(message, context, data) {
        this.log('info', message, context, data);
    }
    warn(message, context, data) {
        this.log('warn', message, context, data);
    }
    error(message, error, context, data) {
        this.log('error', message, context, data, error);
    }
    fatal(message, error, context, data) {
        this.log('fatal', message, context, data, error);
    }
    child(context) {
        return new ConsoleLogger({
            context: { ...this.baseContext, ...context },
            minLevel: this.minLevel,
        });
    }
    log(level, message, context, data, error) {
        // Check if this log level should be output
        if (ConsoleLogger.levelPriority[level] < ConsoleLogger.levelPriority[this.minLevel]) {
            return;
        }
        const entry = {
            level,
            message,
            timestamp: new Date(),
            context: { ...this.baseContext, ...context },
            data,
            error,
        };
        const output = this.formatEntry(entry);
        switch (level) {
            case 'debug':
            case 'info':
                console.log(output);
                break;
            case 'warn':
                console.warn(output);
                break;
            case 'error':
            case 'fatal':
                console.error(output);
                if (error) {
                    console.error(error.stack);
                }
                break;
        }
    }
    formatEntry(entry) {
        const parts = [
            `[${entry.timestamp.toISOString()}]`,
            `[${entry.level.toUpperCase()}]`,
            entry.message,
        ];
        if (entry.context && Object.keys(entry.context).length > 0) {
            parts.push(`- Context: ${JSON.stringify(entry.context)}`);
        }
        if (entry.data && Object.keys(entry.data).length > 0) {
            parts.push(`- Data: ${JSON.stringify(entry.data)}`);
        }
        if (entry.error) {
            parts.push(`- Error: ${entry.error.message}`);
        }
        return parts.join(' ');
    }
}
exports.ConsoleLogger = ConsoleLogger;
/**
 * Global logger instance
 */
let globalLogger = new ConsoleLogger();
function setGlobalLogger(logger) {
    globalLogger = logger;
}
function getLogger(context) {
    return context ? globalLogger.child(context) : globalLogger;
}
/**
 * Structured log helpers for common operations
 */
exports.logHelpers = {
    logApiRequest: (method, path, context) => {
        getLogger(context).info(`API Request: ${method} ${path}`);
    },
    logApiResponse: (method, path, statusCode, duration, context) => {
        getLogger(context).info(`API Response: ${method} ${path} - ${statusCode} (${duration}ms)`);
    },
    logDatabaseQuery: (query, duration, context) => {
        getLogger(context).debug(`Database Query: ${query} (${duration}ms)`);
    },
    logBusinessEvent: (eventType, data, context) => {
        getLogger(context).info(`Business Event: ${eventType}`, context, data);
    },
    logError: (message, error, context) => {
        getLogger(context).error(message, error, context);
    },
    logSecurityEvent: (event, data, context) => {
        getLogger(context).warn(`Security Event: ${event}`, context, data);
    },
};
//# sourceMappingURL=logger.js.map