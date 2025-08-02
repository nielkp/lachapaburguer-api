import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.get('/status', (request, response) => {
  return response
    .status(200)
    .json({ message: '✅ API ⚙️ FUNCIONANDO!!! 🍔🚀' });
});

export default routes;
