# Documentação da API Todo List

## Visão Geral

Esta é a documentação da API REST do Todo List, construída com NestJS, Prisma e documentada com Swagger/OpenAPI.

## Como Acessar

1. **Inicie o servidor**:
   ```bash
   cd apps/server
   pnpm dev
   ```

2. **Acesse a documentação**:
   - URL: `http://localhost:3001/api-docs`
   - Base URL da API: `http://localhost:3001/api`

## Recursos da Documentação

### 🔐 Autenticação
- **Bearer Token**: A maioria dos endpoints requer autenticação JWT
- **Como autenticar**:
  1. Use o endpoint `POST /auth/signin` para fazer login
  2. Copie o `accessToken` da resposta
  3. Clique no botão "Authorize" no topo da documentação
  4. Cole o token no formato: `Bearer {seu-token-aqui}`

### 📚 Endpoints Organizados

#### **Authentication** 
- `POST /auth/signin` - Fazer login
- `POST /auth/signup` - Criar conta
- `POST /auth/refresh` - Renovar token
- `DELETE /auth/logout/{userId}` - Fazer logout

#### **Tasks**
- `POST /tasks` - Criar nova tarefa
- `GET /tasks` - Listar tarefas do usuário
- `GET /tasks/{id}` - Obter tarefa específica
- `PATCH /tasks/{id}` - Atualizar tarefa
- `DELETE /tasks/{id}` - Deletar tarefa
- `GET /tasks/admin/all` - Listar todas as tarefas (Admin)

#### **Users**
- `GET /user/me` - Perfil do usuário atual
- `POST /user` - Criar usuário
- `PATCH /user/{id}` - Atualizar usuário
- `DELETE /user/{id}` - Deletar usuário
- `GET /user/{id}` - Buscar usuário por ID
- `GET /user/email/{email}` - Buscar usuário por email
- `GET /user` - Listar todos os usuários (Admin)

#### **Health Check**
- `GET /` - Status da API
- `GET /health` - Health check

## Exemplos de Uso

### 1. Fazer Login
```json
POST /auth/signin
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. Criar Tarefa
```json
POST /tasks
Authorization: Bearer {seu-token}
{
  "title": "Terminar documentação",
  "description": "Finalizar a documentação da API",
  "dueDate": "2024-12-31T23:59:59.000Z",
  "startDate": "2024-01-15T09:00:00.000Z"
}
```

### 3. Atualizar Tarefa
```json
PATCH /tasks/{id}
Authorization: Bearer {seu-token}
{
  "title": "Documentação finalizada",
  "completed": true
}
```

## Validações

Todos os DTOs possuem validações automáticas:

- **Email**: Deve ser um email válido
- **Password**: Mínimo 6 caracteres
- **Strings**: Não podem estar vazias
- **Datas**: Devem estar no formato ISO 8601

## Códigos de Status

- `200` - Sucesso
- `201` - Criado com sucesso
- `400` - Dados inválidos
- `401` - Não autorizado
- `403` - Acesso negado
- `404` - Não encontrado

## Recursos Avançados

### Swagger UI Features
- **Try it out**: Teste os endpoints diretamente na interface
- **Filtros**: Filtre endpoints por tags
- **Persistência**: A autenticação fica salva durante a sessão
- **Exportar**: Baixe a especificação OpenAPI em JSON/YAML

### Validação Automática
- Validação de tipos de dados
- Sanitização automática de entrada
- Mensagens de erro detalhadas

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js
- **Swagger/OpenAPI**: Documentação da API
- **Class Validator**: Validação de DTOs
- **JWT**: Autenticação
- **Prisma**: ORM para banco de dados

## Desenvolvimento

Para adicionar novos endpoints:

1. Adicione decoradores Swagger aos controllers:
   ```typescript
   @ApiTags('Nome da Seção')
   @ApiOperation({ summary: 'Descrição do endpoint' })
   @ApiResponse({ status: 200, description: 'Sucesso' })
   ```

2. Use DTOs com validações:
   ```typescript
   @ApiProperty({ example: 'valor exemplo' })
   @IsString()
   @IsNotEmpty()
   propriedade: string;
   ```

3. A documentação será atualizada automaticamente!

---

**Nota**: Esta documentação é gerada automaticamente e está sempre atualizada com o código da aplicação.
