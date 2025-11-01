import { Controller, Post, Body, Delete, Param, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthSignInDTO, AuthSignUpDTO } from '@repo/api';
import { AuthService } from './auth.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  @ApiOperation({ summary: 'Sign in user' })
  @ApiResponse({ status: 200, description: 'User successfully signed in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({ type: Object, examples: {
    example1: {
      value: {
        email: 'user@example.com',
        password: 'password123'
      }
    }
  }})
  async signIn(@Body() data: AuthSignInDTO) {
    const result = await this.authService.signIn(data);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return {
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      expiresIn: result.tokens.expiresIn,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.userRole?.[0]?.role || 'USER',
      },
    };
  }

  @Post('signup')
  @ApiOperation({ summary: 'Sign up new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: Object, examples: {
    example1: {
      value: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      }
    }
  }})
  async signUp(@Body() data: AuthSignUpDTO) {
    console.log('Received sign up data:', data);
    return this.authService.signUp(data);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @ApiBody({ type: Object, examples: {
    example1: {
      value: {
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  }})
  async refreshTokens(@Body() body: { refreshToken: string }) {
    const tokens = await this.authService.refreshTokens(body.refreshToken);
    
    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    return tokens;
  }

  @Delete('logout/:userId')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User successfully logged out' })
  async logout(@Param('userId') userId: string) {
    return this.authService.logout(userId);
  }
}
