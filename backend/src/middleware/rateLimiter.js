import { rateLimit } from 'express-rate-limit';

// General limit for the whole API: 300 requests per 15 minutes per IP address.
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    error: {
      code: 'RATE_LIMITED',
      message: 'Too many requests. Please wait a few minutes and try again.',
    },
  },
});
