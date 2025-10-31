import { PrismaService } from '#/prisma.service';
import { UserCreateDTO, UserUpdateDTO } from './user.dto';
import { UserRepository } from './user.repository';

export class UserService extends UserRepository {
  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async create(data: UserCreateDTO): Promise<{ id: string }> {
    const user = await this.prismaService.user.create({ data });
    await this.prismaService.userRole.create({
      data: {
        userId: user.id,
        role: 'USER',
      },
    });

    return { id: user.id };
  }

  async update(
    id: string,
    data: UserUpdateDTO,
  ): Promise<void> {
    await this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.user.delete({ where: { id } });
  }

  async findById(id: string): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
  } | null> {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, password: true },
    });
    return user;
  }

  async findByEmail(email: string): Promise<{
    id: string;
    name: string;
    email: string;
    password: string;
  } | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });
    return user;
  }

  async getAll(): Promise<
    Array<{ id: string; name: string; email: string; password: string }>
  > {
    const users = await this.prismaService.user.findMany({
      select: { id: true, name: true, email: true, password: true },
    });
    return users;
  }
}
