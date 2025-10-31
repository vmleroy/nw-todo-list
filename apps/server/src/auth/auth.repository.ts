import { Session, User } from '@prisma/client';
import { AuthSignInDTO, AuthSignUpDTO } from './auth.dto';

export abstract class AuthRepository {
  abstract signIn(data: AuthSignInDTO): Promise<{
    session: Session;
    user: User;
  } | null>;
  abstract signUp(data: AuthSignUpDTO): Promise<{ id: string }>;
  abstract logout(userId: string): Promise<void>;

  /**
   * Creates a new session for the given user ID and returns the session token.
   */
  abstract createSession(userId: string): Promise<Session>;

  /**
   * Retrieves the session associated with the given token.
   */
  abstract getSession(token: string): Promise<Session | null>;

  /**
   * Refreshes a token and returns a new token if the old one is valid.
   */
  abstract refreshToken(token: string): Promise<{ token: string } | null>;
}
