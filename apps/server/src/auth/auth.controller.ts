import { AuthSignInDTO, AuthSignUpDTO } from './auth.dto';
import { AuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async signIn(data: AuthSignInDTO) {
    return this.authService.signIn(data);
  }

  async signUp(data: AuthSignUpDTO) {
    return this.authService.signUp(data);
  }

  async logout(userId: string) {
    return this.authService.logout(userId);
  }

  async createSession(userId: string) {
    return this.authService.createSession(userId);
  }

  async getSession(token: string) {
    return this.authService.getSession(token);
  }

  async refreshToken(token: string) {
    return this.authService.refreshToken(token);
  }
}
