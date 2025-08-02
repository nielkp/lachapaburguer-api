import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';

class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { filename: path } = request.file;
    const { name, price, category_id, description } = request.body;

    const product = await Product.create({
      name,
      price,
      category_id,
      description,
      path,
    });

    return response.status(201).json(product);
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
