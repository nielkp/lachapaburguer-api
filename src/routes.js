import CategoryController from './app/controllers/CategoryController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import OrderController from './app/controllers/OrderController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';
import { Router } from 'express';
import multer from 'multer';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
//STATUS DO SERVIDOR!!!
routes.get('/status', (request, response) => {
  return response
    .status(200)
    .json({ message: '✅ API ⚙️ FUNCIONANDO!!! 🍔🚀' });
});
//TODAS AS ROTAS ABAIXO VÃO USAR O MIDDLEWARE!
routes.use(authMiddleware);
//ROTA DE PRODUTOS
routes.put('/products/:id', upload.single('file'), ProductController.update);
routes.post('/products', upload.single('file'), ProductController.store);
routes.get('/products', ProductController.index);
//ROTA DE CATEGORIAS
routes.put('/categories/:id', upload.single('file'), CategoryController.update);
routes.post('/categories', upload.single('file'), CategoryController.store);
routes.get('/categories', CategoryController.index);
//ROTA DE PEDIDOS
routes.put('/orders/:id', OrderController.update);
routes.post('/orders', OrderController.store);
routes.get('/orders', OrderController.index);

export default routes;
