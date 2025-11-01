output "vpc_id" {
  description = "ID da VPC"
  value       = aws_vpc.main.id
}

# ECR Repository URLs
output "web_ecr_url" {
  description = "URL of the web ECR repository"
  value       = aws_ecr_repository.web.repository_url
}

output "server_ecr_url" {
  description = "URL of the server ECR repository"
  value       = aws_ecr_repository.server.repository_url
}

# ECS Cluster
output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "rds_endpoint" {
  description = "Endpoint do banco PostgreSQL"
  value       = aws_db_instance.postgres.endpoint
}

output "database_name" {
  description = "Nome do banco de dados"
  value       = aws_db_instance.postgres.db_name
}

output "ecr_web_url" {
  description = "URL do repositório ECR para web"
  value       = aws_ecr_repository.web.repository_url
}

output "ecr_server_url" {
  description = "URL do repositório ECR para server"
  value       = aws_ecr_repository.server.repository_url
}
