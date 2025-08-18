import { resolve } from 'node:path';
import express from 'express';
import routes from './routes';
import dotenv from 'dotenv';
import cors from 'cors';
import './database';
dotenv.config();

class App {
  constructor() {
    this.app = express();
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN,
      })
    );
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );

    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
    
    // Middleware de tratamento de erro global
    this.app.use((error, request, response, next) => {
      console.error('❌ Erro não tratado capturado:', error);
      
      // Se for erro de conexão com banco de dados
      if (error.name === 'SequelizeConnectionError' || error.name === 'MongooseError') {
        return response.status(503).json({
          error: 'Serviço temporariamente indisponível',
          message: 'Erro de conexão com banco de dados. Tente novamente em alguns instantes.',
          code: 'DATABASE_CONNECTION_ERROR'
        });
      }
      
      // Outros erros
      return response.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Algo deu errado. Tente novamente mais tarde.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    });
     
     // Nota: Middleware de rota não encontrada removido para evitar conflito com path-to-regexp
  }
}

export default new App().app;
