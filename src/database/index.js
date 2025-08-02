import configDatabase from '../config/database';
import Category from '../app/models/Category';
import Product from '../app/models/Product';
import User from '../app/models/User';
import { Sequelize } from 'sequelize';

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(configDatabase);
    models.map((model) => model.init(this.connection));
  }
}

export default new Database();
