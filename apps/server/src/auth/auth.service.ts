import { Session, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import { PrismaService } from '#/prisma.service';

import { AuthRepository } from './auth.repository';
import { AuthJWTPayload, AuthSignInDTO, AuthSignUpDTO } from './auth.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService extends AuthRepository {
  expiryDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async signIn(data: AuthSignInDTO): Promise<{
    session: Session;
    user: Omit<User, 'password'> & { role: string };
  } | null> {
    // Find user with password included for verification
    const user = await this.prismaService.user.findUnique({
      where: { email: data.email },
      include: {
        userRole: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: AuthJWTPayload = { sub: user.id, email: user.email };
    const session = await this.createSession(payload);

    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, userRole, ...userWithoutPassword } = user;

    return {
      session,
      user: { ...userWithoutPassword, role: userRole[0].role as string },
    };
  }

  async signUp(data: AuthSignUpDTO): Promise<{ id: string }> {
    // Check if user already exists
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    await this.prismaService.userRole.create({
      data: {
        userId: user.id,
        role: 'USER',
      },
    });

    return { id: user.id };
  }

  async logout(userId: string): Promise<void> {
    await this.prismaService.session.deleteMany({ where: { userId } });
    return;
  }

  async createSession(payload: AuthJWTPayload): Promise<Session> {
    const token = crypto.randomBytes(32).toString('base64url');
    const expiresAt = new Date(Date.now() + this.expiryDuration);

    const session = await this.prismaService.session.create({
      data: {
        userId: payload.sub,
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
