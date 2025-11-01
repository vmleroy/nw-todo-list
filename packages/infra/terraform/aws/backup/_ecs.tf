# Simple ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "nw-todo-cluster"

  tags = {
    Name = "nw-todo-cluster"
  }
}

# Simple IAM Role for ECS Tasks
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_policy" {
  role       = aws_iam_role.ecs_task_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Simple Security Group for ECS
resource "aws_security_group" "ecs_sg" {
  name        = "ecs-sg"
  description = "Security group for ECS services"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecs-sg"
  }
}

# Simple ECS Task Definitions

# ECS Task Definitions
resource "aws_ecs_task_definition" "web" {
  family                   = "nw-todo-web"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "web"
      image = "${aws_ecr_repository.web.repository_url}:latest"
      
      essential = true
      
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/nw-todo-web"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  depends_on = [docker_registry_image.web]
}

resource "aws_ecs_task_definition" "server" {
  family                   = "nw-todo-server"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn

  container_definitions = jsonencode([
    {
      name  = "server"
      image = "${aws_ecr_repository.server.repository_url}:latest"
      
      essential = true
      
      portMappings = [
        {
          containerPort = 3001
          hostPort      = 3001
          protocol      = "tcp"
        }
      ]
      
      environment = [
        {
          name  = "DATABASE_URL"
          value = "postgresql://postgres:${var.db_password}@${aws_db_instance.postgres.endpoint}:5432/nwtodolist"
        },
        {
          name  = "JWT_SECRET"
          value = "your-jwt-secret-key-change-this"
        },
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "PORT"
          value = "3001"
        },
        {
            name = "CORS_ORIGIN"
            value = "*"
        }
      ]
      
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/nw-todo-server"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  depends_on = [docker_registry_image.server]
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "web" {
  name              = "/ecs/nw-todo-web"
  retention_in_days = 7

  tags = {
    Name = "nw-todo-web-logs"
  }
}

resource "aws_cloudwatch_log_group" "server" {
  name              = "/ecs/nw-todo-server"
  retention_in_days = 7

  tags = {
    Name = "nw-todo-server-logs"
  }
}

# Simple ECS Services
resource "aws_ecs_service" "web" {
  name            = "web"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.web.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  tags = {
    Name = "web-service"
  }
}

resource "aws_ecs_service" "server" {
  name            = "server"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.server.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public.id]
    security_groups  = [aws_security_group.ecs_sg.id]
    assign_public_ip = true
  }

  tags = {
    Name = "server-service"
  }
}
