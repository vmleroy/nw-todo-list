import { PrismaService } from '#/prisma.service';
import { UserCreateDTO, UserResponseDTO, UserUpdateDTO } from '@repo/api';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

export class UserService extends UserRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async create(data: UserCreateDTO): Promise<{ id: string }> {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prismaService.user.create({
      data: { ...data, password: hashedPassword },
    });
    await this.prismaService.userRole.create({
      data: {
        userId: user.id,
        role: 'USER',
      },
    });

    return { id: user.id };
  }

  async createAdmin(data: UserCreateDTO): Promise<{ id: string }> {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prismaService.user.create({
      data: { ...data, password: hashedPassword },
    });
    await this.prismaService.userRole.create({
      data: {
        userId: user.id,
        role: 'ADMIN',
      },
    });

    return { id: user.id };
  }

  async update(id: string, data: UserUpdateDTO): Promise<void> {
    await this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }

  async findById(id: string): Promise<UserResponseDTO | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        userRole: true,
      },
    });
    return user;
  }

  async findByEmail(email: string): Promise<UserResponseDTO | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        userRole: true,
      },
    });
    return user;
  }

  async getAll(): Promise<Array<UserResponseDTO>> {
    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        userRole: true,
      },
    });
    return users;
  }
}
