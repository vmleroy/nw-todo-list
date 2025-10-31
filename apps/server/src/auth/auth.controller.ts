import { Controller, Post, Body, Delete, Param, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AuthSignInDTO, AuthSignUpDTO } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  async signIn(@Body() data: AuthSignInDTO) {
    const result = await this.authService.signIn(data);
    if (!result) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    return {
      token: result.session.sessionToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
    };
  }

  @Post('signup')
  async signUp(@Body() data: AuthSignUpDTO) {
    return this.authService.signUp(data);
  }

  @Delete('logout/:userId')
  async logout(@Param('userId') userId: string) {
    return this.authService.logout(userId);
  }

  @Get('session')
  async getSession(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('No token provided');
    }
    
    const token = authorization.replace('Bearer ', '');
    const session = await this.authService.getSession(token);
    
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }
    
    return session;
  }

  @Post('refresh-token')
  async refreshToken(@Headers('authorization') authorization: string) {
    if (!authorization) {
      throw new UnauthorizedException('No token provided');
    }
    
    const token = authorization.replace('Bearer ', '');
    const result = await this.authService.refreshToken(token);
    
    if (!result) {
      throw new UnauthorizedException('Unable to refresh token');
    }
    
    return result;
  }
}
