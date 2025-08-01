import { Router } from 'express';
import UserController from './app/controllers/UserController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.get('/status', (request, response) => {
  return response
    .status(200)
    .json({ message: '✅ API ⚙️ FUNCIONANDO!!! 🍔🚀' });
});

export default routes;
