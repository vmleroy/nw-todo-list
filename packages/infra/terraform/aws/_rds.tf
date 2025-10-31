# Security Group para RDS (muito simples)
resource "aws_security_group" "rds_sg" {
  name        = "rds-sg"
  description = "Security group for RDS"
  vpc_id      = aws_vpc.main.id

  # Allow tráfego do EC2 para o RDS na porta 5432
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2_sg.id]
  }

  tags = {
    Name = "rds-sg"
  }
}

# Subnet group para RDS (precisa de pelo menos 2 AZs)
resource "aws_db_subnet_group" "main" {
  name       = "main-subnet-group"
  subnet_ids = [aws_subnet.private_a.id, aws_subnet.private_b.id]

  tags = {
    Name = "main-db-subnet-group"
  }
}

# PostgreSQL RDS
resource "aws_db_instance" "postgres" {
  identifier     = "nw-todo-list-db"
  engine         = "postgres"
  engine_version = "15.7"
  instance_class = "db.t3.micro"

  allocated_storage = 20

  db_name  = "nwtodolist"
  username = "postgres"
  password = var.db_password

  vpc_security_group_ids = [aws_security_group.rds_sg.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  skip_final_snapshot = true

  tags = {
    Name = "nw-todo-list-db"
  }
}