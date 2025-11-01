import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserService } from '../user/user.service';
import { ROLES_KEY } from './roles.decorator';
import { PrismaService } from '#/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly userService: UserService;

  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {
    this.userService = new UserService(this.prismaService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.id) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user with roles from database
    const userWithRoles = await this.userService.findById(user.id as string);
    if (!userWithRoles) {
      throw new ForbiddenException('User not found');
    }

    // Check if user has any of the required roles
    const userRoles = userWithRoles.userRole.map((ur) => ur.role);
    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role as 'USER' | 'ADMIN'),
    );
    if (!hasRole) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
