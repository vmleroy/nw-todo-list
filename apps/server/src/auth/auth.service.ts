import { Session, User } from '@prisma/client';
import crypto from 'crypto';

import { PrismaService } from '#/prisma.service';
import { AuthRepository } from './auth.repository';
import { AuthSignInDTO, AuthSignUpDTO } from './auth.dto';

export class AuthService extends AuthRepository {
  expiryDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async signIn(data: AuthSignInDTO): Promise<{
    session: Session;
    user: User;
  } | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email, password: data.password },
    });
    if (!user) {
      return null;
    }
    // In a real application, generate a JWT or similar token here
    const session = await this.createSession(user.id);
    if (!session) {
      return null;
    }

    return {
      session,
      user,
    };
  }

  async signUp(data: AuthSignUpDTO): Promise<{ id: string }> {
    const user = await this.prismaService.user.create({ data });
    return { id: user.id };
  }

  async logout(userId: string): Promise<void> {
    await this.prismaService.session.deleteMany({ where: { userId } });
    return;
  }

  async createSession(userId: string): Promise<Session> {
    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + this.expiryDuration);

    const session = await this.prismaService.session.create({
      data: {
        userId,
        sessionToken: token,
        expiresAt,
      },
    });

    return session;
  }

  async getSession(token: string): Promise<Session | null> {
    const userSession = await this.prismaService.session.findUnique({
      where: { sessionToken: token },
    });
    if (!userSession) {
      return null;
    }

    return userSession;
  }

  async refreshToken(token: string): Promise<{ token: string } | null> {
    const session = await this.getSession(token);
    if (!session) {
      return null;
    }

    if (session.expiresAt < new Date()) {
      return null;
    }

    const newToken = crypto.randomBytes(32).toString('base64url');
    const newExpiry = new Date();
    newExpiry.setDate(newExpiry.getDate() + 7); // Extend expiry by 7 days

    await this.prismaService.session.update({
      where: { sessionToken: token },
      data: { sessionToken: newToken, expiresAt: newExpiry },
    });

    return { token: newToken };
  }
}
