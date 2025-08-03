import Category from '../models/Category';
import Product from '../models/Product';
import User from '../models/User';
import * as Yup from 'yup';

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
  }
}

export default new ProductController();
