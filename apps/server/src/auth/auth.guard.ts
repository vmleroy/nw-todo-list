import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization || typeof authorization !== 'string') {
      throw new UnauthorizedException('No token provided');
    }

    const token = authorization.replace('Bearer ', '');
    const session = await this.authService.getSession(token);

    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // Add user info to request
    request.user = { id: session.userId };
    return true;
  }
}
