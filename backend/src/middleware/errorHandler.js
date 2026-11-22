import { env } from '../config/env.js';

// Throw this from controllers and services for errors the client should see.
// Example: throw new HttpError(404, 'Product not found', 'PRODUCT_NOT_FOUND');
export class HttpError extends Error {
  constructor(status, message, code = 'ERROR', details) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function notFound(req, res) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'The requested route does not exist.' },
  });
}

// Express recognises an error handler by its four arguments. Do not remove "next".
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  // Errors we raised on purpose
  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  // Bad request bodies caught by express.json()
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: { code: 'INVALID_JSON', message: 'The request body is not valid JSON.' },
    });
  }

  if (err.type === 'entity.too.large') {
    return res.status(413).json({
      error: { code: 'PAYLOAD_TOO_LARGE', message: 'The request body is too large.' },
    });
  }

  // Anything else is a bug on our side. Log it, but never show details to the client.
  if (!env.isTest) console.error(err);

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Something went wrong on our side. Please try again.',
      ...(env.isDevelopment && { stack: err.stack }),
    },
  });
}
