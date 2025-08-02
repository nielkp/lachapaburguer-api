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

  init() {
    this.connection = new Sequelize(configDatabase);
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(MONGO);
  }
}

export default new Database();
