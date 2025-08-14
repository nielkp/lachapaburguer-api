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

    const { filename: path } = request.file;
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
      path,
    });

    return response.status(201).json({ id, name });
  }

  async update(request, response) {
    const schema = Yup.object({
      name: Yup.string(),
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

    const categoryExist = await Category.findByPk(id);

    if (!categoryExist) {
      return response
        .status(400)
        .json({ message: 'Verifique o ID da Categoria!' });
    }

    let path;
    if (request.file) {
      path = request.file.filename;
    }

    const { name } = request.body;

    if (name) {
      const categoryNameExist = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoryNameExist && categoryNameExist.id !== +id) {
        return response.status(400).json({ error: 'Categoria já existe!' });
      }
    }

    await Category.update(
      {
        name,
        path,
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
    const categories = await Category.findAll();
    //console.log({ userId: request.userId });
    return response.json(categories);
  }

  async delete(request, response) {
    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json({ error: 'Acesso negado!' });
    }

    const { id } = request.params;
    const categoryExist = await Category.findByPk(id);

    if (!categoryExist) {
      return response.status(404).json({ error: 'Categoria não encontrada!' });
    }

    try {
      await Category.destroy({
        where: {
          id,
        },
      });

      return response.status(200).json({ message: 'Categoria deletada com sucesso!' });
    } catch (err) {
      return response.status(500).json({ error: 'Erro interno do servidor!' });
    }
  }
}

export default new CategoryController();
