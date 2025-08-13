# 🍔 LaChapa Burger - API

API REST para sistema de e-commerce de hamburgueria com integração Stripe para pagamentos.

## 🚀 Funcionalidades

- ✅ Autenticação JWT
- ✅ CRUD de usuários, produtos e categorias
- ✅ Upload de imagens
- ✅ Integração com Stripe para pagamentos
- ✅ Gestão de pedidos
- ✅ Banco de dados PostgreSQL (usuários/produtos) e MongoDB (pedidos)

## 📋 Requisitos

- Node.js (v16+)
- Docker
- Conta Stripe (para pagamentos)

## 🛠️ Instalação

### 1. Clone o repositório e instale dependências

```bash
npm install
# ou
yarn install
```

### 2. Configure os bancos de dados com Docker

**PostgreSQL:**
```bash
docker run --name api-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

**MongoDB:**
```bash
docker run --name api-mongodb -p 27017:27017 -d -t mongo
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
API_PORT=3003
CORS_ORIGIN=http://localhost:5173

# JWT
JWT_TOKEN=seu_jwt_secret_aqui

# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASS=postgres

# MongoDB
MONGO_URL=mongodb://localhost:27017/lachapa-burger

# Stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_stripe_aqui
```

### 4. Execute as migrações do banco

```bash
npx sequelize-cli db:migrate
```

### 5. Compile e inicie a aplicação

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

## 📚 Endpoints Principais

### Autenticação
- `POST /users` - Criar usuário
- `POST /session` - Login

### Produtos
- `GET /products` - Listar produtos
- `POST /products` - Criar produto (autenticado)
- `PUT /products/:id` - Atualizar produto (autenticado)

### Categorias
- `GET /categories` - Listar categorias
- `POST /categories` - Criar categoria (autenticado)
- `PUT /categories/:id` - Atualizar categoria (autenticado)

### Pagamentos
- `POST /create-payment-intent` - Criar intenção de pagamento Stripe

### Pedidos
- `POST /orders` - Criar pedido
- `GET /orders` - Listar pedidos (autenticado)
- `PUT /orders/:id` - Atualizar status do pedido (autenticado)

### Status
- `GET /status` - Verificar status da API

## 🔧 Tecnologias Utilizadas

- **Express** - Framework web
- **Sequelize** - ORM para PostgreSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **Bcrypt** - Hash de senhas
- **Multer** - Upload de arquivos
- **Stripe** - Processamento de pagamentos
- **Yup** - Validação de dados
- **CORS** - Controle de acesso
- **UUID** - Geração de IDs únicos

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── controllers/     # Controladores das rotas
│   ├── middlewares/     # Middlewares (auth, etc.)
│   ├── models/          # Modelos Sequelize
│   └── schemas/         # Schemas Mongoose
├── config/              # Configurações (DB, Multer)
├── database/            # Migrações e conexão
├── app.js              # Configuração do Express
├── routes.js           # Definição das rotas
└── server.js           # Inicialização do servidor
```

## 🚀 Deploy

1. Configure as variáveis de ambiente no servidor
2. Execute `npm run build` para compilar
3. Execute `npm start` para iniciar em produção
4. Configure proxy reverso (Nginx) se necessário
