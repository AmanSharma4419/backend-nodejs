import helmet from 'helmet';
import cors from 'cors';
import { Express } from 'express';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

export const configureSecurityMiddleware = (app: Express): void => {
  // Set security HTTP headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: true,
      crossOriginOpenerPolicy: true,
      crossOriginResourcePolicy: { policy: 'same-site' },
      dnsPrefetchControl: true,
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      hsts: true,
      ieNoOpen: true,
      noSniff: true,
      originAgentCluster: true,
      permittedCrossDomainPolicies: true,
      referrerPolicy: { policy: 'same-origin' },
      xssFilter: true,
    })
  );

  // Enable CORS with custom options
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Content-Range', 'X-Content-Range'],
      credentials: true,
      maxAge: 600, // 10 minutes
    })
  );

  // Data sanitization against XSS
  app.use(xss());

  // Data sanitization against NoSQL query injection
  app.use(mongoSanitize());

  // Prevent parameter pollution
  app.use(
    hpp({
      whitelist: ['order', 'sort', 'page', 'limit'], // Add your allowed parameters
    })
  );
}; 