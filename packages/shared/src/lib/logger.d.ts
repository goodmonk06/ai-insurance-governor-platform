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
export declare class ConsoleLogger implements ILogger {
    private baseContext;
    private minLevel;
    private static levelPriority;
    constructor(options?: {
        context?: LogContext;
        minLevel?: LogLevel;
    });
    debug(message: string, context?: LogContext, data?: Record<string, any>): void;
    info(message: string, context?: LogContext, data?: Record<string, any>): void;
    warn(message: string, context?: LogContext, data?: Record<string, any>): void;
    error(message: string, error?: Error, context?: LogContext, data?: Record<string, any>): void;
    fatal(message: string, error?: Error, context?: LogContext, data?: Record<string, any>): void;
    child(context: LogContext): ILogger;
    private log;
    private formatEntry;
}
export declare function setGlobalLogger(logger: ILogger): void;
export declare function getLogger(context?: LogContext): ILogger;
/**
 * Structured log helpers for common operations
 */
export declare const logHelpers: {
    logApiRequest: (method: string, path: string, context: LogContext) => void;
    logApiResponse: (method: string, path: string, statusCode: number, duration: number, context: LogContext) => void;
    logDatabaseQuery: (query: string, duration: number, context: LogContext) => void;
    logBusinessEvent: (eventType: string, data: Record<string, any>, context: LogContext) => void;
    logError: (message: string, error: Error, context: LogContext) => void;
    logSecurityEvent: (event: string, data: Record<string, any>, context: LogContext) => void;
};
//# sourceMappingURL=logger.d.ts.map