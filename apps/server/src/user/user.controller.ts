import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO } from '@repo/api';
import { AuthGuard } from '#/auth/auth.guard';
import { CurrentUser } from './user.decorator';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() UserCreateDTO: UserCreateDTO) {
    return this.userService.create(UserCreateDTO);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() UserUpdateDTO: Partial<UserCreateDTO>,
    @CurrentUser() currentUser: { id: string },
  ) {
    // Users can only update their own profile
    if (id !== currentUser.id) {
      throw new UnauthorizedException('Cannot update other users');
    }
    return this.userService.update(id, UserUpdateDTO);
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string },
  ) {
    // Users can only delete their own profile
    if (id !== currentUser.id) {
      throw new UnauthorizedException('Cannot delete other users');
    }
    return this.userService.delete(id);
  }

  @Get('me')
  async getProfile(@CurrentUser() currentUser: { id: string }) {
    return this.userService.findById(currentUser.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
  
  @Get()
  async getAll() {
    return this.userService.getAll();
  }
}
