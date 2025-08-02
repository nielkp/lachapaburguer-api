import jwt from 'jsonwebtoken';
require('dotenv').config();

function authMiddleware(request, response, next) {
  const authToken = request.headers.authorization;
  const SECRET = process.env.JWT_TOKEN;

  if (!authToken) {
    return response.status(401).json({ error: 'Token não fornecido!' });
  }

  const token = authToken.split(' ').at(1);

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return response.status(401).json({ error: 'Token inválido!' });
    }

    request.userId = decoded.id;
    next(); // Chama o próximo middleware/rota
  });
}

export default authMiddleware;
