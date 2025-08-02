import * as Yup from 'yup';
import jwt from 'jsonwebtoken';
import User from '../models/User';

require('dotenv').config();

class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(request.body);

    const emailOrPasswordIncorrect = () => {
      return response.status(401).json({ error: 'Senha ou email incorretos!' });
    };

    if (!isValid) {
      return emailOrPasswordIncorrect();
    }

    const { email, password } = request.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return emailOrPasswordIncorrect();
    }

    const isSamePassword = await user.checkPassword(password);

    if (!isSamePassword) {
      return emailOrPasswordIncorrect();
    }

    const TOKEN_HASH = process.env.JWT_TOKEN;
    const TOKEN_EXPIRES = process.env.JWT_EXPIRES;

    return response.status(201).json({
      id: user.id,
      name: user.name,
      email,
      admin: user.admin,
      token: jwt.sign({ id: user.id }, TOKEN_HASH, {
        expiresIn: TOKEN_EXPIRES,
      }),
    });
  }
}

export default new SessionController();
