/**
 * @go2asia/schemas
 * 
 * Zod schemas for runtime validation in Go2Asia services.
 * 
 * These schemas should match the types generated from OpenAPI specs.
 * They are used for runtime validation at API Gateway and service boundaries.
 */

import { z } from 'zod';

/**
 * Common validation schemas
 */

export const RequestIdSchema = z.string().uuid().or(z.string().min(1));

export const UserIdSchema = z.string().min(1);

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const SortOrderSchema = z.enum(['asc', 'desc']).default('desc');

/**
 * Error response schema
 */
export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.unknown()).optional(),
  }),
  requestId: RequestIdSchema.optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;

