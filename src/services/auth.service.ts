import bcrypt from 'bcryptjs';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { db } from '../config/database';
import { SignupInput, LoginInput } from '../validations/auth.validation';
import { User, UserResponse } from '../types/user';
import { AuthenticationError, ConflictError } from '../utils/errors';

type JwtExpiration = '1h' | '24h' | '7d' | '30d';

export class AuthService {
  private static generateToken(userId: number): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const secret: Secret = process.env.JWT_SECRET;
    const expiresIn: JwtExpiration = '24h';
    const options: SignOptions = { expiresIn };

    return jwt.sign({ userId }, secret, options);
  }

  private static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async signup(data: SignupInput): Promise<UserResponse> {
    const existingUser = await db('users').where('email', data.email).first();
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await this.hashPassword(data.password);

    const [user] = await db('users')
      .insert({
        email: data.email,
        password: hashedPassword,
        name: data.name,
      })
      .returning(['id', 'email', 'name']);

    const token = this.generateToken(user.id);

    return {
      ...user,
      token,
    };
  }

  static async login(data: LoginInput): Promise<UserResponse> {
    const user = await db('users').where('email', data.email).first();
    if (!user) {
      throw new AuthenticationError('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = this.generateToken(user.id);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      token,
    };
  }
} 