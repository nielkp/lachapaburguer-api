import CategoryController from './app/controllers/CategoryController';
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
//ROTA DE PRODUTOS
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
//ROTA DE CATEGORIAS
routes.post('/categories', CategoryController.store);
routes.get('/categories', CategoryController.index);

//STATUS DO SERVIDOR!!!
routes.get('/status', (request, response) => {
  return response
    .status(200)
    .json({ message: '✅ API ⚙️ FUNCIONANDO!!! 🍔🚀' });
});

export default routes;
