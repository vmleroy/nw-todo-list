import { UserCreateDTO, UserUpdateDTO, UserResponseDTO } from '@repo/api';

export abstract class UserRepository {
  abstract create(data: UserCreateDTO): Promise<{ id: string }>;
  abstract update(id: string, data: Partial<UserUpdateDTO>): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findById(id: string): Promise<UserResponseDTO | null>;
  abstract findByEmail(email: string): Promise<UserResponseDTO | null>;
  abstract getAll(): Promise<Array<UserResponseDTO>>;
}
