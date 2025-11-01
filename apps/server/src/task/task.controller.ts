import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';
import { TaskCreateDto, TaskResponseDto, TaskUpdateDto } from '@repo/api';
import { Roles } from '#/roles/roles.decorator';
import { RolesGuard } from '#/roles/roles.guard';

interface AuthenticatedRequest {
  user: {
    sub: string;
    email: string;
  };
}

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task successfully created' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: Object, examples: {
    example1: {
      value: {
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the todo app',
        dueDate: '2024-12-31T23:59:59.000Z',
        startDate: '2024-01-15T09:00:00.000Z'
      }
    }
  }})
  async create(
    @Body() createTaskDto: TaskCreateDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    return this.taskService.create(req.user.sub, createTaskDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiResponse({ status: 200, description: 'Task successfully updated' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBody({ type: Object, examples: {
    example1: {
      value: {
        title: 'Updated task title',
        description: 'Updated description',
        completed: true,
        dueDate: '2024-12-31T23:59:59.000Z'
      }
    }
  }})
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: TaskUpdateDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    return this.taskService.update(req.user.sub, id, updateTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiResponse({ status: 200, description: 'Task successfully deleted' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.taskService.delete(req.user.sub, id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for current user' })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto[]> {
    return this.taskService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto | null> {
    return this.taskService.findById(req.user.sub, id);
  }

  @Get('admin/all')
  @Roles('ADMIN')
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all tasks (Admin only)' })
  @ApiResponse({ status: 200, description: 'All tasks retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async findAllForAdmin(): Promise<TaskResponseDto[]> {    
    return this.taskService.getAll();
  }
}
