import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDTO } from './user.dto';

@Controller('user')
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
  ) {
    return this.userService.update(id, UserUpdateDTO);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.userService.delete(id);
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
