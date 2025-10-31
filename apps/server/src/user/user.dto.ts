import { User } from "@prisma/client";

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

export type UserResponseDTO = User;