# Ultra-Simple Terraform Deployment for NW Todo List
# This deploys containers to ECS with minimal configuration

# Variables
variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
  default     = "todopassword123"
}

# Simple VPC (Single Public Subnet)
resource "aws_vpc" "simple" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = { Name = "simple-vpc" }
}

resource "aws_subnet" "simple" {
  vpc_id                  = aws_vpc.simple.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = { Name = "simple-subnet" }
}

resource "aws_internet_gateway" "simple" {
  vpc_id = aws_vpc.simple.id
  tags = { Name = "simple-igw" }
}

resource "aws_route_table" "simple" {
  vpc_id = aws_vpc.simple.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.simple.id
  }

  tags = { Name = "simple-rt" }
}

resource "aws_route_table_association" "simple" {
  subnet_id      = aws_subnet.simple.id
  route_table_id = aws_route_table.simple.id
}

resource "aws_route_table_association" "simple_2" {
  subnet_id      = aws_subnet.simple_2.id
  route_table_id = aws_route_table.simple.id
}

# Simple Security Group (Open to Internet)
resource "aws_security_group" "simple" {
  name_prefix = "simple-sg"
  vpc_id      = aws_vpc.simple.id

  # Allow web traffic
  ingress {
    from_port   = 3000
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow all outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "simple-sg" }
}

# ECR Repositories
resource "aws_ecr_repository" "nw_web_v2" {
  name                 = "nw-web-v2"
  image_tag_mutability = "MUTABLE"
}

resource "aws_ecr_repository" "nw_server_v2" {
  name                 = "nw-server-v2"
  image_tag_mutability = "MUTABLE"
}

# ECS Cluster
resource "aws_ecs_cluster" "nw_cluster_v2" {
  name = "nw-cluster-v2"
}

# IAM Role for ECS
resource "aws_iam_role" "nw_ecs_v2" {
  name = "nw-ecs-role-v2"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = { Service = "ecs-tasks.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "nw_ecs_v2" {
  role       = aws_iam_role.nw_ecs_v2.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Database Subnet Group (Required for VPC)
resource "aws_db_subnet_group" "nw_db_v2" {
  name       = "nw-db-subnet-group-v2"
  subnet_ids = [aws_subnet.simple.id, aws_subnet.simple_2.id]

  tags = { Name = "nw-db-subnet-group-v2" }
}

# Second subnet for RDS (requires 2+ subnets in different AZs)
resource "aws_subnet" "simple_2" {
  vpc_id                  = aws_vpc.simple.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "${var.aws_region}b"
  map_public_ip_on_launch = true

  tags = { Name = "simple-subnet-2" }
}

# Database (Simple RDS)
resource "aws_db_instance" "nw_db_v2" {
  identifier               = "nw-db-v2"
  engine                   = "postgres"
  engine_version           = "15.8"
  instance_class           = "db.t3.micro"
  allocated_storage        = 20
  db_name                  = "todolist"
  username                 = "postgres"
  password                 = var.db_password
  skip_final_snapshot      = true
  publicly_accessible      = true
  vpc_security_group_ids   = [aws_security_group.simple_db.id]
  db_subnet_group_name     = aws_db_subnet_group.nw_db_v2.name

  tags = { Name = "nw-db-v2" }
}

# Database Security Group
resource "aws_security_group" "simple_db" {
  name_prefix = "simple-db-sg"
  vpc_id      = aws_vpc.simple.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.simple.id]
    cidr_blocks     = ["0.0.0.0/0"]  # Simplified for demo
  }

  tags = { Name = "simple-db-sg" }
}

# ECS Task Definitions
resource "aws_ecs_task_definition" "nw_web_v2" {
  family                   = "nw-web-v2"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.nw_ecs_v2.arn

  container_definitions = jsonencode([
    {
      name      = "web"
      image     = "${aws_ecr_repository.nw_web_v2.repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "NEXT_PUBLIC_API_URL", value = "http://${aws_db_instance.nw_db_v2.endpoint}:3001" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.nw_web_v2.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "web"
        }
      }
    }
  ])
}

resource "aws_ecs_task_definition" "nw_server_v2" {
  family                   = "nw-server-v2"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = aws_iam_role.nw_ecs_v2.arn

  container_definitions = jsonencode([
    {
      name      = "server"
      image     = "${aws_ecr_repository.nw_server_v2.repository_url}:latest"
      essential = true
      
      portMappings = [
        {
          containerPort = 3001
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "NODE_ENV", value = "production" },
        { name = "PORT", value = "3001" },
        { name = "DATABASE_URL", value = "postgresql://postgres:${var.db_password}@${aws_db_instance.nw_db_v2.endpoint}/todolist" },
        { name = "JWT_SECRET", value = "nw-jwt-secret-v2-change-me" },
        { name = "CORS_ORIGIN", value = "*" }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.nw_server_v2.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "server"
        }
      }
    }
  ])
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "nw_web_v2" {
  name              = "/ecs/nw-web-v2"
  retention_in_days = 3
}

resource "aws_cloudwatch_log_group" "nw_server_v2" {
  name              = "/ecs/nw-server-v2"
  retention_in_days = 3
}

# ECS Services
resource "aws_ecs_service" "nw_web_v2" {
  name            = "nw-web-v2"
  cluster         = aws_ecs_cluster.nw_cluster_v2.id
  task_definition = aws_ecs_task_definition.nw_web_v2.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.simple.id]
    security_groups  = [aws_security_group.simple.id]
    assign_public_ip = true
  }
}

resource "aws_ecs_service" "nw_server_v2" {
  name            = "nw-server-v2"
  cluster         = aws_ecs_cluster.nw_cluster_v2.id
  task_definition = aws_ecs_task_definition.nw_server_v2.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.simple.id]
    security_groups  = [aws_security_group.simple.id]
    assign_public_ip = true
  }
}

# Outputs
output "nw_web_ecr_v2" {
  value = aws_ecr_repository.nw_web_v2.repository_url
}

output "nw_server_ecr_v2" {
  value = aws_ecr_repository.nw_server_v2.repository_url
}

output "nw_db_endpoint_v2" {
  value = aws_db_instance.nw_db_v2.endpoint
}

output "deployment_instructions" {
  value = <<EOF
🚀 NW TODO DEPLOYMENT READY (V2)!

1. Build and push your Docker images:
   
   # Build web image
   docker build -t ${aws_ecr_repository.nw_web_v2.repository_url}:latest -f apps/web/Dockerfile .
   
   # Build server image  
   docker build -t ${aws_ecr_repository.nw_server_v2.repository_url}:latest -f apps/server/Dockerfile .
   
   # Login to ECR
   aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.nw_web_v2.repository_url}
   
   # Push images
   docker push ${aws_ecr_repository.nw_web_v2.repository_url}:latest
   docker push ${aws_ecr_repository.nw_server_v2.repository_url}:latest

2. Your apps will be accessible via ECS service public IPs
3. Database: ${aws_db_instance.nw_db_v2.endpoint}:5432

Note: This is a simplified setup for development/testing.
EOF
}
