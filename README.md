# Requisitos

- Node
- Docker

### Como Instalar

1. Crie os containers com Docker

```docker run --name api-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
docker run --name api-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

```docker run --name api-mongodb -p 27017:27017 -d -t mongo
docker run --name api-mongodb -p 27017:27017 -d -t mongo
```

### Bibliotecas Utilizadas

- YUP
- CORS
- UUID
- Express
- BCRYPT
- MULTER
- Mongoose
- Sequelize
- JsonWebToken
