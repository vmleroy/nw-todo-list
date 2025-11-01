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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserCreateDTO } from '@repo/api';
import { AuthGuard } from '#/auth/auth.guard';
import { CurrentUser } from './user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, description: 'User successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiBody({ type: Object, examples: {
    example1: {
      value: {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
      }
    }
  }})
  async create(@Body() UserCreateDTO: UserCreateDTO) {
    return this.userService.create(UserCreateDTO);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User successfully updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User successfully deleted' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@CurrentUser() currentUser: { id: string }) {
    return this.userService.findById(currentUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }
  
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async getAll() {
    return this.userService.getAll();
  }
}
