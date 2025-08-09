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
  }
}

export default new App().app;
