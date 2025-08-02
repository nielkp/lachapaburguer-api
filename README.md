# Requisitos

- Node
- Docker

### Como Instalar

1. Crie o container com Docker

```docker run --name api-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
docker run --name api-postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres
```

### Bibliotecas Utilizadas

- YUP
- UUID
- Express
- BCRYPT
- MULTER
- Sequelize
- JsonWebToken
