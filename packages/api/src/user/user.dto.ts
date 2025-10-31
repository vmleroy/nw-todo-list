export type UserCreateDTO = {
  name: string;
  email: string;
  password: string;
};

export type UserUpdateDTO = Partial<{
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'ADMIN';
}>;

export type UserResponseDTO = {
  id: string;
  email: string;
  name: string | null;
  password: string;
  userRole: Array<{
    id: string;
    role: 'USER' | 'ADMIN';
    userId: string;
  }>;
};
