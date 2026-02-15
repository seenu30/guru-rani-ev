import pino from 'pino';

/**
 * Pino logger configuration
 * - Production: JSON format, info level
 * - Development: Pretty print, debug level
 */
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Create the base logger instance
 */
export const logger = pino({
  level: isProduction ? 'info' : 'debug',
  // In development, use pino-pretty for readable logs
  // In production, use JSON format for log aggregation
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  }),
  // Base properties included in all logs
  base: {
    env: process.env.NODE_ENV,
  },
  // Custom timestamp format
  timestamp: pino.stdTimeFunctions.isoTime,
});

/**
 * Create a child logger with additional context
 * Useful for adding request-specific info like userId, route, etc.
 */
export function createLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

/**
 * Log an API request (use in API routes)
 */
export function logRequest(
  method: string,
  route: string,
  userId?: string,
  meta?: Record<string, unknown>
) {
  logger.info({ method, route, userId, ...meta }, `${method} ${route}`);
}

/**
 * Log an API response
 */
export function logResponse(
  method: string,
  route: string,
  status: number,
  duration: number,
  userId?: string
) {
  const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';
  logger[level](
    { method, route, status, duration, userId },
    `${method} ${route} ${status} ${duration}ms`
  );
}

/**
 * Log an error with full context
 */
export function logError(
  error: unknown,
  context?: Record<string, unknown>
) {
  const errorInfo = error instanceof Error
    ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      }
    : { error };

  logger.error({ ...errorInfo, ...context }, 'Error occurred');
}

/**
 * Log a database operation
 */
export function logDatabase(
  operation: string,
  table: string,
  duration: number,
  success: boolean
) {
  const level = success ? 'debug' : 'error';
  logger[level](
    { operation, table, duration, success },
    `DB ${operation} on ${table} ${success ? 'succeeded' : 'failed'} in ${duration}ms`
  );
}

/**
 * Log an external service call
 */
export function logExternalService(
  service: string,
  operation: string,
  duration: number,
  success: boolean
) {
  const level = success ? 'debug' : 'warn';
  logger[level](
    { service, operation, duration, success },
    `${service} ${operation} ${success ? 'succeeded' : 'failed'} in ${duration}ms`
  );
}

export default logger;
