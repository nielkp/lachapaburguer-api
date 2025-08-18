import configDatabase from '../config/database';
import Category from '../app/models/Category';
import Product from '../app/models/Product';
import User from '../app/models/User';
import { Sequelize } from 'sequelize';
import mongoose from 'mongoose';

require('dotenv').config();

const models = [User, Product, Category];
const MONGO = process.env.MONGO_CONNECT;

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  async init() {
    try {
      this.connection = new Sequelize(configDatabase);
      
      // Testa a conexão com PostgreSQL
      await this.connection.authenticate();
      console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
      
      models
        .map((model) => model.init(this.connection))
        .map(
          (model) => model.associate && model.associate(this.connection.models)
        );
    } catch (error) {
      console.error('❌ Erro ao conectar com PostgreSQL:', error.message);
      console.error('🔧 Verifique se o PostgreSQL está rodando e as configurações estão corretas.');
      // Não mata o processo, apenas loga o erro
    }
  }

  async mongo() {
    try {
      this.mongoConnection = await mongoose.connect(MONGO, {
        serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
      });
      console.log('✅ Conexão com MongoDB estabelecida com sucesso!');
    } catch (error) {
      console.error('❌ Erro ao conectar com MongoDB:', error.message);
      console.error('🔧 Verifique se o MongoDB está rodando e as configurações estão corretas.');
      // Não mata o processo, apenas loga o erro
    }
  }
}

export default new Database();
