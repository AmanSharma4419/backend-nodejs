import debug from 'debug';
import { performance } from 'perf_hooks';
import { Request, Response, NextFunction } from 'express';
import logger from './logger';

// Create debuggers for different parts of the application
export const debugAuth = debug('app:auth');
export const debugDB = debug('app:db');
export const debugHTTP = debug('app:http');
export const debugError = debug('app:error');

// Performance monitoring
export class PerformanceMonitor {
  private static timers: Map<string, number> = new Map();

  static start(label: string): void {
    this.timers.set(label, performance.now());
    debugHTTP(`⏱️ Starting ${label}`);
  }

  static end(label: string): number {
    const start = this.timers.get(label);
    if (!start) {
      debugError(`No timer found for ${label}`);
      return 0;
    }
    const duration = performance.now() - start;
    this.timers.delete(label);
    debugHTTP(`⏱️ ${label} took ${duration.toFixed(2)}ms`);
    return duration;
  }
}

// Request debugging middleware
export const requestDebugger = (req: Request, res: Response, next: NextFunction) => {
  const requestId = Math.random().toString(36).substring(7);
  req.requestId = requestId;

  debugHTTP(`📥 [${requestId}] ${req.method} ${req.url}`);
  debugHTTP(`Headers: ${JSON.stringify(req.headers)}`);
  debugHTTP(`Body: ${JSON.stringify(req.body)}`);

  // Track response time
  PerformanceMonitor.start(requestId);

  // Track response
  const originalSend = res.send;
  res.send = function(body: any): Response {
    debugHTTP(`📤 [${requestId}] Response: ${JSON.stringify(body)}`);
    PerformanceMonitor.end(requestId);
    return originalSend.call(this, body);
  };

  next();
};

// SQL Query debugger
export const queryDebugger = (query: string, params: any[]): void => {
  debugDB(`🔍 SQL Query: ${query}`);
  debugDB(`Parameters: ${JSON.stringify(params)}`);
};

// Memory usage tracker
export const memoryDebugger = (): void => {
  const used = process.memoryUsage();
  debugHTTP('Memory Usage 💾:');
  for (const [key, value] of Object.entries(used)) {
    debugHTTP(`${key}: ${(value / 1024 / 1024).toFixed(2)} MB`);
  }
};

// Stack trace enhancer
export const enhanceError = (error: Error): Error => {
  debugError('🚨 Error Details:');
  debugError(error.stack || error.message);
  return error;
};

// Request rate monitor
export class RequestMonitor {
  private static requests: { [key: string]: number } = {};
  private static interval = 60000; // 1 minute

  static track(route: string): void {
    this.requests[route] = (this.requests[route] || 0) + 1;
    debugHTTP(`👁️ Route ${route} called ${this.requests[route]} times in the last minute`);
  }

  static startMonitoring(): void {
    setInterval(() => {
      debugHTTP('📊 Request counts for the last minute:');
      debugHTTP(JSON.stringify(this.requests, null, 2));
      this.requests = {};
    }, this.interval);
  }
}

// Type definition for extended Request
declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
} 