import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsDateString, IsNotEmpty } from 'class-validator';

export class TaskCreateDto {
  @ApiProperty({
    example: 'Complete project documentation',
    description: 'Task title'
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Write comprehensive documentation for the todo application',
    description: 'Task description',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2024-01-15T09:00:00.000Z',
    description: 'Task start date',
    required: false
  })
  @IsDateString()
  @IsOptional()
  startDate?: string | Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'Task due date',
    required: false
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string | Date;
}

export class TaskUpdateDto {
  @ApiProperty({
    example: 'Updated task title',
    description: 'Task title',
    required: false
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: 'Updated task description',
    description: 'Task description',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Task completion status',
    required: false
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({
    example: '2024-01-15T09:00:00.000Z',
    description: 'Task start date',
    required: false
  })
  @IsDateString()
  @IsOptional()
  startDate?: string | Date;

  @ApiProperty({
    example: '2024-12-31T23:59:59.000Z',
    description: 'Task due date',
    required: false
  })
  @IsDateString()
  @IsOptional()
  dueDate?: string | Date;
}

export type TaskResponseDto = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  startDate: Date | null;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
