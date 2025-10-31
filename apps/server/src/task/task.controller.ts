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
import { AuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';
import { TaskCreateDto, TaskResponseDto, TaskUpdateDto } from '@repo/api';

interface AuthenticatedRequest {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('tasks')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(
    @Body() createTaskDto: TaskCreateDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    return this.taskService.create(req.user.sub, createTaskDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: TaskUpdateDto,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto> {
    return this.taskService.update(req.user.sub, id, updateTaskDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<void> {
    return this.taskService.delete(req.user.sub, id);
  }

  @Get()
  async findAll(
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto[]> {
    return this.taskService.findAll(req.user.sub);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequest,
  ): Promise<TaskResponseDto | null> {
    return this.taskService.findById(req.user.sub, id);
  }

  @Get('admin/all')
  async findAllForAdmin(): Promise<TaskResponseDto[]> {
    return this.taskService.getAll();
  }
}
