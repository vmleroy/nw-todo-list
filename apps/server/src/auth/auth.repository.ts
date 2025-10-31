import {
  AuthJWTPayload,
  AuthSignInDTO,
  AuthSignUpDTO,
  TokenResponse,
} from './auth.dto';
import { UserResponseDTO } from '#/user/user.dto';

export abstract class AuthRepository {
  abstract signIn(data: AuthSignInDTO): Promise<{
    tokens: TokenResponse;
    user: Omit<UserResponseDTO, 'password'>;
  } | null>;
  abstract signUp(data: AuthSignUpDTO): Promise<{ id: string }>;
  abstract logout(userId: string): Promise<void>;

  /**
   * Creates access and refresh tokens for the given user ID.
   */
  abstract createTokens(
    payload: Omit<AuthJWTPayload, 'type'>,
  ): Promise<TokenResponse>;

  /**
   * Validates an access token and returns the payload.
   */
  abstract validateAccessToken(token: string): Promise<AuthJWTPayload | null>;

  /**
   * Validates a refresh token and returns the payload.
   */
  abstract validateRefreshToken(token: string): Promise<AuthJWTPayload | null>;

  /**
   * Refreshes tokens using a valid refresh token.
   */
  abstract refreshTokens(refreshToken: string): Promise<TokenResponse | null>;

  /**
   * Stores refresh token in database.
   */
  abstract storeRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<void>;

  /**
   * Removes refresh token from database.
   */
  abstract removeRefreshToken(token: string): Promise<void>;
}
