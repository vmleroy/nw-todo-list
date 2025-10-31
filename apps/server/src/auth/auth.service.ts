import * as bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '#/prisma.service';
import { AuthRepository } from './auth.repository';
import {
  AuthJWTPayload,
  AuthSignInDTO,
  AuthSignUpDTO,
  TokenResponse,
} from '@repo/api';
import { UserService } from '#/user/user.service';
import { UserResponseDTO } from '@repo/api';

@Injectable()
export class AuthService extends AuthRepository {
  private readonly accessTokenExpiry = 15 * 60 * 1000; // 15 minutes in milliseconds

  private readonly refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  private readonly userService: UserService;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    super();
    this.userService = new UserService(prismaService);
  }

  async signIn(data: AuthSignInDTO): Promise<{
    tokens: TokenResponse;
    user: Omit<UserResponseDTO, 'password'>;
  } | null> {
    // Find user with password included for verification
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create tokens
    const tokens = await this.createTokens({
      sub: user.id,
      email: user.email,
    });

    // Store refresh token
    const refreshExpiresAt = new Date(Date.now() + this.refreshTokenExpiry);
    await this.storeRefreshToken(
      user.id,
      tokens.refreshToken,
      refreshExpiresAt,
    );

    // Remove password from user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      tokens,
      user: userWithoutPassword,
    };
  }

  async signUp(data: AuthSignUpDTO): Promise<{ id: string }> {
    // Check if user already exists
    const existingUser = await this.userService.findByEmail(data.email);
    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    const user = await this.userService.create(data);

    return { id: user.id };
  }

  async logout(userId: string): Promise<void> {
    // Remove all refresh tokens for the user
    await this.prismaService.session.deleteMany({ where: { userId } });
  }

  async createTokens(
    payload: Omit<AuthJWTPayload, 'type'>,
  ): Promise<TokenResponse> {
    const accessTokenPayload: AuthJWTPayload = { ...payload, type: 'access' };
    const refreshTokenPayload: AuthJWTPayload = { ...payload, type: 'refresh' };

    const accessToken = this.jwtService.sign(accessTokenPayload, {
      expiresIn: this.accessTokenExpiry / 1000, // in seconds
    });

    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      expiresIn: this.refreshTokenExpiry / 1000, // in seconds
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
    };
  }

  async validateAccessToken(token: string): Promise<AuthJWTPayload | null> {
    try {
      const payload = this.jwtService.verify(token) as AuthJWTPayload;
      if (payload.type !== 'access') {
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  }

  async validateRefreshToken(token: string): Promise<AuthJWTPayload | null> {
    try {
      const payload = this.jwtService.verify(token) as AuthJWTPayload;
      if (payload.type !== 'refresh') {
        return null;
      }

      // Check if refresh token exists in database
      const session = await this.prismaService.session.findUnique({
        where: { sessionToken: token },
      });

      if (!session || session.expiresAt < new Date()) {
        return null;
      }

      return payload;
    } catch {
      return null;
    }
  }

  async refreshTokens(refreshToken: string): Promise<TokenResponse | null> {
    const payload = await this.validateRefreshToken(refreshToken);
    if (!payload) {
      return null;
    }

    // Remove old refresh token
    await this.removeRefreshToken(refreshToken);

    // Create new tokens
    const tokens = await this.createTokens({
      sub: payload.sub,
      email: payload.email,
    });

    // Store new refresh token
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.storeRefreshToken(
      payload.sub,
      tokens.refreshToken,
      refreshExpiresAt,
    );

    return tokens;
  }

  async storeRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.prismaService.session.create({
      data: {
        userId,
        sessionToken: token,
        expiresAt,
      },
    });
  }

  async removeRefreshToken(token: string): Promise<void> {
    await this.prismaService.session.deleteMany({
      where: { sessionToken: token },
    });
  }
}
