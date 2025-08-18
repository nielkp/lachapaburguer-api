import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';
import * as Yup from 'yup';
import fs from 'fs';
import path from 'path';

class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      description: Yup.string().required(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    if (!request.file) {
      return response.status(400).json({ error: 'File is required' });
    }

    const { filename: path } = request.file;
    const { name, price, category_id, description, offer } = request.body;

    const product = await Product.create({
      name,
      price,
      category_id,
      description,
      path,
      offer,
    });

    return response.status(201).json(product);
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
      price: Yup.number(),
      category_id: Yup.number(),
      description: Yup.string(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;
    const findProduct = await Product.findByPk(id);

    if (!findProduct) {
      return response.status(400).json({ error: 'Confirme o ID do Produto!' });
    }

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name, price, category_id, description, offer } = request.body;

    await Product.update(
      {
        name,
        price,
        category_id,
        description,
        path,
        offer,
      },
      {
        where: {
          id,
        },
      }
    );

    return response.status(200).json();
  }

  async index(request, response) {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
          },
        ],
      });

      //console.log({ userId: request.userId });

      return response.json(products);
    } catch (error) {
      console.error('❌ Erro ao buscar produtos:', error.message);
      
      // Se for erro de conexão com banco
      if (error.name === 'SequelizeConnectionError' || error.original?.code === 'ECONNREFUSED') {
        return response.status(503).json({
          error: 'Serviço temporariamente indisponível',
          message: 'Não foi possível conectar ao banco de dados. Tente novamente em alguns instantes.',
          code: 'DATABASE_CONNECTION_ERROR'
        });
      }
      
      return response.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar produtos. Tente novamente mais tarde.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  async delete(request, response) {
    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json({ error: 'Acesso negado!' });
    }

    const { id } = request.params;
    const findProduct = await Product.findByPk(id);

    if (!findProduct) {
      return response.status(404).json({ error: 'Produto não encontrado!' });
    }

    try {
      // Deletar o arquivo físico se existir
      if (findProduct.path) {
        try {
          const filePath = path.resolve(__dirname, '..', '..', '..', 'uploads', findProduct.path);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (fileError) {
          console.log('Erro ao deletar arquivo do produto:', fileError.message);
          // Continua com a exclusão do registro mesmo se houver erro no arquivo
        }
      }

      await Product.destroy({
        where: {
          id,
        },
      });

      return response.status(200).json({ message: 'Produto deletado com sucesso!' });
    } catch (err) {
      return response.status(500).json({ error: 'Erro interno do servidor!' });
    }
  }
}

export default new ProductController();
