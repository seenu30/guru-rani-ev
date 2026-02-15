/**
 * Base application error class
 * All custom errors should extend this
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = 'INTERNAL_ERROR',
    public status: number = 500
  ) {
    super(message);
    this.name = 'AppError';
    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation error (400 Bad Request)
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Unauthorized error (401)
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Forbidden error (403)
 */
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access denied') {
    super(message, 'FORBIDDEN', 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Conflict error (409)
 */
export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
    this.name = 'ConflictError';
  }
}

/**
 * Rate limit error (429)
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 'RATE_LIMITED', 429);
    this.name = 'RateLimitError';
  }
}

/**
 * Database error (500)
 */
export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 'DATABASE_ERROR', 500);
    this.name = 'DatabaseError';
  }
}

/**
 * External service error (502)
 */
export class ExternalServiceError extends AppError {
  constructor(service: string, message?: string) {
    super(message || `${service} service unavailable`, 'EXTERNAL_SERVICE_ERROR', 502);
    this.name = 'ExternalServiceError';
  }
}

/**
 * Normalized error response type
 */
export interface NormalizedError {
  code: string;
  message: string;
  status: number;
}

/**
 * Normalize any error into a consistent format
 * IMPORTANT: Never expose raw database/internal errors to clients
 */
export function normalizeError(error: unknown): NormalizedError {
  // Handle our custom AppError
  if (error instanceof AppError) {
    return {
      code: error.code,
      message: error.message,
      status: error.status,
    };
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    const zodError = error as { issues: Array<{ message: string }> };
    return {
      code: 'VALIDATION_ERROR',
      message: zodError.issues.map((i) => i.message).join(', '),
      status: 400,
    };
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    // Log the actual error for debugging (server-side only)
    console.error('Unexpected error:', error);

    // Never expose raw error messages to clients
    return {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong. Please try again later.',
      status: 500,
    };
  }

  // Handle unknown errors
  console.error('Unknown error type:', error);
  return {
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    status: 500,
  };
}

/**
 * Check if an error is a specific type
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Check if an error is a validation error
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Check if an error is a not found error
 */
export function isNotFoundError(error: unknown): error is NotFoundError {
  return error instanceof NotFoundError;
}

/**
 * Check if an error is unauthorized
 */
export function isUnauthorizedError(error: unknown): error is UnauthorizedError {
  return error instanceof UnauthorizedError;
}
