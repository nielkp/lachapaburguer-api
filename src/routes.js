import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import UserController from './app/controllers/UserController';
import multerConfig from './config/multer';
import { Router } from 'express';
import multer from 'multer';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.post('/products', upload.single('file'), ProductController.store);

routes.get('/status', (request, response) => {
  return response
    .status(200)
    .json({ message: '✅ API ⚙️ FUNCIONANDO!!! 🍔🚀' });
});

export default routes;
