import CategoryController from './app/controllers/CategoryController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import OrderController from './app/controllers/OrderController';
import UserController from './app/controllers/UserController';
import authMiddleware from './app/middlewares/auth';
import multerConfig from './config/multer';
import { Router } from 'express';
import multer from 'multer';
import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController';

const routes = new Router();

const upload = multer(multerConfig);
// Rotas sem Autenticação!
routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);
routes.get('/products', ProductController.index);
routes.get('/categories', CategoryController.index);
// Rotas de pagamento e pedidos sem autenticação para facilitar o checkout
routes.post('/create-payment-intent', CreatePaymentIntentController.store);
routes.post('/orders', OrderController.store);
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
routes.delete('/products/:id', ProductController.delete);
//ROTA DE CATEGORIAS
routes.put('/categories/:id', upload.single('file'), CategoryController.update);
routes.post('/categories', upload.single('file'), CategoryController.store);
routes.delete('/categories/:id', CategoryController.delete);
//ROTA DE PEDIDOS (apenas update e index precisam de autenticação)
routes.put('/orders/:id', OrderController.update);
routes.get('/orders', OrderController.index);
routes.get('/user-orders', OrderController.userOrders);

export default routes;
