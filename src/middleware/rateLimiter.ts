import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Auth routes limiter (more strict)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs per IP
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// API routes limiter (more lenient)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs per IP
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes',
    timestamp: new Date().toISOString(),
  },
  standardHeaders: true,
  legacyHeaders: false,
}); 