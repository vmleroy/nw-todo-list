import { Controller, Post, Body, Delete, Param, UnauthorizedException } from '@nestjs/common';
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
      accessToken: result.tokens.accessToken,
      refreshToken: result.tokens.refreshToken,
      expiresIn: result.tokens.expiresIn,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.userRole[0].role,
      },
    };
  }

  @Post('signup')
  async signUp(@Body() data: AuthSignUpDTO) {
    return this.authService.signUp(data);
  }

  @Post('refresh')
  async refreshTokens(@Body() body: { refreshToken: string }) {
    const tokens = await this.authService.refreshTokens(body.refreshToken);
    
    if (!tokens) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    
    return tokens;
  }

  @Delete('logout/:userId')
  async logout(@Param('userId') userId: string) {
    return this.authService.logout(userId);
  }
}
