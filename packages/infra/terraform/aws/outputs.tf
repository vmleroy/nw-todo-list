output "vpc_id" {
  description = "ID da VPC"
  value       = aws_vpc.main.id
}

output "ec2_public_ip" {
  description = "IP público da instância EC2"
  value       = aws_instance.web.public_ip
}

output "rds_endpoint" {
  description = "Endpoint do banco PostgreSQL"
  value       = aws_db_instance.postgres.endpoint
}

output "database_name" {
  description = "Nome do banco de dados"
  value       = aws_db_instance.postgres.db_name
}
