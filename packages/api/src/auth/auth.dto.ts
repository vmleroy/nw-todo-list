export type AuthSignInDTO = {
  email: string;
  password: string;
};

export type AuthSignUpDTO = {
  name: string;
  email: string;
  password: string;
};

export type AuthJWTPayload = {
  sub: string;
  email: string;
  type: 'access' | 'refresh';
};

export type TokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    name: string | null;
    email: string;
    role: 'USER' | 'ADMIN';
  };
};
