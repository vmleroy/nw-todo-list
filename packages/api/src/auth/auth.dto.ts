import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class AuthSignInDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthSignUpDTO {
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name'
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class RefreshTokenDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token'
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export type AuthJWTPayload = {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: 'USER' | 'ADMIN';
  };
};
