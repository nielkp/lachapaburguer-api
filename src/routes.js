import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import UserController from './app/controllers/UserController';
import authMiddleware from './middlewares/auth';
import multerConfig from './config/multer';
import { Router } from 'express';
import multer from 'multer';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);
//TODAS AS ROTAS ABAIXO VÃO USAR O MIDDLEWARE!
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);

routes.get('/status', (request, response) => {
  return response
    .status(200)
    .json({ message: '✅ API ⚙️ FUNCIONANDO!!! 🍔🚀' });
});

export default routes;
