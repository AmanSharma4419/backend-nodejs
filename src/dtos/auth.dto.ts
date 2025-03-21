import { IsEmail, IsString, MinLength, Matches } from 'class-validator';
import { Expose } from 'class-transformer';

export class SignupDto {
  @Expose()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @Expose()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
  })
  password!: string;

  @Expose()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name!: string;
}

export class LoginDto {
  @Expose()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email!: string;

  @Expose()
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password!: string;
} 