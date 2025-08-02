import { v4 } from 'uuid';
import * as Yup from 'yup';

import User from '../models/User';

class UserController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string()
        .strict()
        .typeError('O nome precisar ser letras')
        .min(2, 'O nome precisa ter no minimo 2 caracteres')
        .required('O nome é obrigatório'),
      email: Yup.string().email('O email não é válido').required(),
      password: Yup.string()
        .min(6, 'A senha precisa ter no minimo 6 caracteres')
        .required(),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { name, email, password, admin } = request.body;

    const userExists = await User.findOne({
      where: {
        email,
      },
    });

    if (userExists) {
      return response.status(400).json({ error: 'Usuário já cadastrado!' });
    }

    console.log(userExists);

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    });

    return response.status(201).json({
      id: user.id,
      name,
      email,
      admin,
    });
  }
}

export default new UserController();
