export type UserCreateDTO = {
  name: string;
  email: string;
  password: string;
};

export type UserUpdateDTO = Partial<{
  name: string;
  email: string;
  password: string;
}>;

export type UserResponseDTO = {
  id: string;
  name: string;
};