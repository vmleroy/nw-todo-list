import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class UserCreateDTO {
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

export class UserUpdateDTO {
  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
    required: false
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    required: false,
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({
    example: 'USER',
    description: 'User role',
    enum: ['USER', 'ADMIN'],
    required: false
  })
  @IsEnum(['USER', 'ADMIN'])
  @IsOptional()
  role?: 'USER' | 'ADMIN';
}

export type UserResponseDTO = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  userRole: Array<{
    id: string;
    role: 'USER' | 'ADMIN';
    userId: string;
  }>;
};
