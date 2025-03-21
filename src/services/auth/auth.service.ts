import { db } from '../../config/database';
import { BaseService } from '../base/IService';
import { IAuthService, ISignupData, IUserCredentials, IAuthResponse } from '../types/auth.types';
import { ValidationError } from '../../utils/errors';
import { hashPassword, comparePasswords, generateToken } from '../../utils/auth';
import { debugAuth, PerformanceMonitor, queryDebugger } from '../../utils/debug';
import logger from '../../utils/logger';

export class AuthService extends BaseService implements IAuthService {
  constructor() {
    super('AuthService');
  }

  async signup(data: ISignupData): Promise<IAuthResponse> {
    const operationId = `signup-${Date.now()}`;
    debugAuth(`🚀 Starting signup process for email: ${data.email}`);
    PerformanceMonitor.start(operationId);

    try {
      // Check if user exists
      debugAuth('🔍 Checking for existing user...');
      const existingUserQuery = db('users').where('email', data.email);
      queryDebugger(existingUserQuery.toString(), [data.email]);
      
      const existingUser = await existingUserQuery.first();
      
      if (existingUser) {
        debugAuth(`⚠️ User already exists with email: ${data.email}`);
        throw new ValidationError('User already exists');
      }

      // Hash password
      debugAuth('🔒 Hashing password...');
      const hashedPassword = await hashPassword(data.password);
      debugAuth('✅ Password hashed successfully');

      // Create user
      debugAuth('👤 Creating new user...');
      const insertQuery = db('users').insert({
        email: data.email,
        password: hashedPassword,
        name: data.name,
      }).returning(['id', 'email', 'name']);

      queryDebugger(insertQuery.toString(), [data.email, '***HASHED_PASSWORD***', data.name]);
      
      const [user] = await insertQuery;
      debugAuth(`✅ User created successfully with ID: ${user.id}`);

      // Generate token
      debugAuth('🎫 Generating authentication token...');
      const token = generateToken(user);
      debugAuth('✅ Token generated successfully');

      const duration = PerformanceMonitor.end(operationId);
      debugAuth(`✨ Signup process completed in ${duration.toFixed(2)}ms`);

      logger.info(`User registered successfully: ${user.email}`);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      const duration = PerformanceMonitor.end(operationId);
      debugAuth(`❌ Signup process failed after ${duration.toFixed(2)}ms`);
      logger.error('Signup error:', error);
      return this.handleError(error as Error);
    }
  }

  async login(credentials: IUserCredentials): Promise<IAuthResponse> {
    const operationId = `login-${Date.now()}`;
    debugAuth(`🚀 Starting login process for email: ${credentials.email}`);
    PerformanceMonitor.start(operationId);

    try {
      // Find user
      debugAuth('🔍 Finding user...');
      const user = await db('users').where('email', credentials.email).first();
      if (!user) {
        throw new ValidationError('Invalid credentials');
      }

      // Verify password
      debugAuth('🔒 Verifying password...');
      const isValid = await comparePasswords(credentials.password, user.password);
      if (!isValid) {
        throw new ValidationError('Invalid credentials');
      }

      // Generate token
      debugAuth('🎫 Generating token...');
      const token = generateToken(user);

      const duration = PerformanceMonitor.end(operationId);
      debugAuth(`✨ Login successful in ${duration.toFixed(2)}ms`);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      const duration = PerformanceMonitor.end(operationId);
      debugAuth(`❌ Login failed after ${duration.toFixed(2)}ms`);
      return this.handleError(error as Error);
    }
  }

  // ... rest of the service code ...
} 