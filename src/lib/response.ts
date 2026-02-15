import { normalizeError } from './errors';

/**
 * Standard success response format
 */
export interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Standard error response format
 */
export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

/**
 * Combined API response type
 */
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

/**
 * API response helper functions
 * Use these in all API routes for consistent responses
 */
export const apiResponse = {
  /**
   * Success response (200)
   */
  success<T>(data: T, meta?: SuccessResponse<T>['meta']): Response {
    const body: SuccessResponse<T> = { success: true, data };
    if (meta) body.meta = meta;
    return Response.json(body, { status: 200 });
  },

  /**
   * Created response (201)
   */
  created<T>(data: T): Response {
    const body: SuccessResponse<T> = { success: true, data };
    return Response.json(body, { status: 201 });
  },

  /**
   * No content response (204)
   */
  noContent(): Response {
    return new Response(null, { status: 204 });
  },

  /**
   * Paginated response with meta info
   */
  paginated<T>(data: T[], page: number, limit: number, total: number): Response {
    const totalPages = Math.ceil(total / limit);
    const body: SuccessResponse<T[]> = {
      success: true,
      data,
      meta: { page, limit, total, totalPages },
    };
    return Response.json(body, { status: 200 });
  },

  /**
   * Error response - normalizes any error into standard format
   */
  error(error: unknown): Response {
    const { code, message, status } = normalizeError(error);
    const body: ErrorResponse = {
      success: false,
      error: { code, message },
    };
    return Response.json(body, { status });
  },

  /**
   * Bad request (400)
   */
  badRequest(message: string): Response {
    const body: ErrorResponse = {
      success: false,
      error: { code: 'BAD_REQUEST', message },
    };
    return Response.json(body, { status: 400 });
  },

  /**
   * Unauthorized (401)
   */
  unauthorized(message: string = 'Unauthorized'): Response {
    const body: ErrorResponse = {
      success: false,
      error: { code: 'UNAUTHORIZED', message },
    };
    return Response.json(body, { status: 401 });
  },

  /**
   * Forbidden (403)
   */
  forbidden(message: string = 'Access denied'): Response {
    const body: ErrorResponse = {
      success: false,
      error: { code: 'FORBIDDEN', message },
    };
    return Response.json(body, { status: 403 });
  },

  /**
   * Not found (404)
   */
  notFound(resource: string = 'Resource'): Response {
    const body: ErrorResponse = {
      success: false,
      error: { code: 'NOT_FOUND', message: `${resource} not found` },
    };
    return Response.json(body, { status: 404 });
  },

  /**
   * Conflict (409)
   */
  conflict(message: string): Response {
    const body: ErrorResponse = {
      success: false,
      error: { code: 'CONFLICT', message },
    };
    return Response.json(body, { status: 409 });
  },

  /**
   * Rate limited (429)
   */
  rateLimited(message: string = 'Too many requests'): Response {
    const body: ErrorResponse = {
      success: false,
      error: { code: 'RATE_LIMITED', message },
    };
    return Response.json(body, { status: 429 });
  },

  /**
   * Internal server error (500)
   */
  internalError(message: string = 'Something went wrong'): Response {
    const body: ErrorResponse = {
      success: false,
      error: { code: 'INTERNAL_ERROR', message },
    };
    return Response.json(body, { status: 500 });
  },
};

/**
 * Type guard to check if response is successful
 */
export function isSuccessResponse<T>(response: ApiResponse<T>): response is SuccessResponse<T> {
  return response.success === true;
}

/**
 * Type guard to check if response is an error
 */
export function isErrorResponse<T>(response: ApiResponse<T>): response is ErrorResponse {
  return response.success === false;
}
