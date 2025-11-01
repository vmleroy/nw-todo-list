# ECR Repositories
resource "aws_ecr_repository" "web" {
  name                 = "nw-todo-web"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = "nw-todo-web"
  }
}

resource "aws_ecr_repository" "server" {
  name                 = "nw-todo-server"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  lifecycle {
    prevent_destroy = true
  }

  tags = {
    Name = "nw-todo-server"
  }
}

# Docker Images - Build and Push
resource "docker_image" "web" {
  name = "${aws_ecr_repository.web.repository_url}:latest"
  
  build {
    context    = "../../../../"  # Root of the project
    dockerfile = "apps/web/Dockerfile"
    tag        = ["${aws_ecr_repository.web.repository_url}:latest"]
  }

  triggers = {
    dir_sha1 = sha1(join("", [
      for f in fileset("${path.module}/../../../../", "apps/web/**") : filesha1("${path.module}/../../../../${f}")
    ]))
  }

  depends_on = [aws_ecr_repository.web]
}

resource "docker_image" "server" {
  name = "${aws_ecr_repository.server.repository_url}:latest"
  
  build {
    context    = "../../../../"  # Root of the project
    dockerfile = "apps/server/Dockerfile"
    tag        = ["${aws_ecr_repository.server.repository_url}:latest"]
  }

  triggers = {
    dir_sha1 = sha1(join("", [
      for f in fileset("${path.module}/../../../../", "apps/server/**") : filesha1("${path.module}/../../../../${f}")
    ]))
  }

  depends_on = [aws_ecr_repository.server]
}

resource "docker_registry_image" "web" {
  name = docker_image.web.name
  
  depends_on = [docker_image.web]
}

resource "docker_registry_image" "server" {
  name = docker_image.server.name
  
  depends_on = [docker_image.server]
}
