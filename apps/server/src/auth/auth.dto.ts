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
};