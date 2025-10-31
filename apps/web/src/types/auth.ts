import type { UserEntity } from './user';

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: UserEntity;
}

export type { SignInData, SignUpData, AuthResponse };
