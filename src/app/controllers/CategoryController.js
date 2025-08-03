import Category from '../models/Category';
import User from '../models/User';
import * as Yup from 'yup';

class CategoryController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
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

    const { name } = request.body;

    const categoryExist = await Category.findOne({
      where: {
        name,
      },
    });

    if (categoryExist) {
      return response.status(400).json({ error: 'Categoria já existe!' });
    }

    const { id } = await Category.create({
      name,
    });

    return response.status(201).json({ id, name });
  }

  async index(request, response) {
    const categories = await Category.findAll();
    //console.log({ userId: request.userId });
    return response.json(categories);
  }
}

export default new CategoryController();
