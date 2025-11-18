export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  tenantId?: string;
  userId?: string;
  requestId?: string;
  sessionId?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: LogContext;
  error?: Error;
  data?: Record<string, any>;
}

export interface ILogger {
  debug(message: string, context?: LogContext, data?: Record<string, any>): void;
  info(message: string, context?: LogContext, data?: Record<string, any>): void;
  warn(message: string, context?: LogContext, data?: Record<string, any>): void;
  error(message: string, error?: Error, context?: LogContext, data?: Record<string, any>): void;
  fatal(message: string, error?: Error, context?: LogContext, data?: Record<string, any>): void;
  child(context: LogContext): ILogger;
}

/**
 * Simple console logger implementation with structured output.
 * For production, consider using Winston, Pino, or cloud-native logging services.
 */
export class ConsoleLogger implements ILogger {
  private baseContext: LogContext;
  private minLevel: LogLevel;

  private static levelPriority: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    fatal: 4,
  };

  constructor(options?: { context?: LogContext; minLevel?: LogLevel }) {
    this.baseContext = options?.context || {};
    this.minLevel = options?.minLevel || 'info';
  }

  debug(message: string, context?: LogContext, data?: Record<string, any>): void {
    this.log('debug', message, context, data);
  }

  info(message: string, context?: LogContext, data?: Record<string, any>): void {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: LogContext, data?: Record<string, any>): void {
    this.log('warn', message, context, data);
  }

  error(message: string, error?: Error, context?: LogContext, data?: Record<string, any>): void {
    this.log('error', message, context, data, error);
  }

  fatal(message: string, error?: Error, context?: LogContext, data?: Record<string, any>): void {
    this.log('fatal', message, context, data, error);
  }

  child(context: LogContext): ILogger {
    return new ConsoleLogger({
      context: { ...this.baseContext, ...context },
      minLevel: this.minLevel,
    });
  }

  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    data?: Record<string, any>,
    error?: Error,
  ): void {
    // Check if this log level should be output
    if (ConsoleLogger.levelPriority[level] < ConsoleLogger.levelPriority[this.minLevel]) {
      return;
    }

    const entry: LogEntry = {
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

  private formatEntry(entry: LogEntry): string {
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

/**
 * Global logger instance
 */
let globalLogger: ILogger = new ConsoleLogger();

export function setGlobalLogger(logger: ILogger): void {
  globalLogger = logger;
}

export function getLogger(context?: LogContext): ILogger {
  return context ? globalLogger.child(context) : globalLogger;
}

/**
 * Structured log helpers for common operations
 */
export const logHelpers = {
  logApiRequest: (method: string, path: string, context: LogContext) => {
    getLogger(context).info(`API Request: ${method} ${path}`);
  },

  logApiResponse: (method: string, path: string, statusCode: number, duration: number, context: LogContext) => {
    getLogger(context).info(`API Response: ${method} ${path} - ${statusCode} (${duration}ms)`);
  },

  logDatabaseQuery: (query: string, duration: number, context: LogContext) => {
    getLogger(context).debug(`Database Query: ${query} (${duration}ms)`);
  },

  logBusinessEvent: (eventType: string, data: Record<string, any>, context: LogContext) => {
    getLogger(context).info(`Business Event: ${eventType}`, context, data);
  },

  logError: (message: string, error: Error, context: LogContext) => {
    getLogger(context).error(message, error, context);
  },

  logSecurityEvent: (event: string, data: Record<string, any>, context: LogContext) => {
    getLogger(context).warn(`Security Event: ${event}`, context, data);
  },
};
