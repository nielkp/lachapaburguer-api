import Category from '../models/Category';
import Product from '../models/Product';
import Order from '../schemas/Order';
import User from '../models/User';
import * as Yup from 'yup';

class OrderController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
      address: Yup.string().required('O endereço é obrigatório!'),
      deliveryTax: Yup.number().required('A taxa de entrega é obrigatória!'),
      total: Yup.number().required('O total é obrigatório!'),
      paymentIntentId: Yup.string().nullable(),
      status: Yup.string(),
      paymentMethod: Yup.string().required().oneOf(['pix', 'dinheiro', 'cartao_online', 'cartao_entrega']),
      changeFor: Yup.number().nullable(),
      needsChange: Yup.boolean(),
      user: Yup.object({
        id: Yup.string().required(),
        name: Yup.string().required(),
      }),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      console.log('❌ Erro de validação:', err.errors);
      console.log('📦 Dados recebidos:', JSON.stringify(request.body, null, 2));
      return response.status(400).json({ error: err.errors });
    }

    const { products, address, deliveryTax, total, paymentIntentId, status, user, paymentMethod, changeFor, needsChange } = request.body;

    const productsIds = products.map((product) => product.id);

    let findProducts;
    try {
      findProducts = await Product.findAll({
        where: {
          id: productsIds,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    });
    } catch (error) {
      console.error('❌ Erro ao buscar produtos para o pedido:', error.message);
      
      // Se for erro de conexão com banco
      if (error.name === 'SequelizeConnectionError' || error.original?.code === 'ECONNREFUSED') {
        return response.status(503).json({
          error: 'Serviço temporariamente indisponível',
          message: 'Não foi possível conectar ao banco de dados. Tente novamente em alguns instantes.',
          code: 'DATABASE_CONNECTION_ERROR'
        });
      }
      
      return response.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao processar produtos do pedido. Tente novamente mais tarde.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }

    const formattedProducts = findProducts.map((product) => {
      const productIndex = products.findIndex((item) => item.id === product.id);

      const newProduct = {
        id: product.id,
        name: product.name,
        category: product.category.name,
        price: product.price,
        url: product.url,
        quantity: products[productIndex].quantity,
      };

      return newProduct;
    });

    const order = {
      user: user || {
        id: request.userId,
        name: request.userName,
      },
      address,
      deliveryTax,
      total,
      status: status || 'Pedido realizado',
      products: formattedProducts,
      paymentIntentId,
      paymentMethod,
      changeFor,
      needsChange,
    };

    console.log('✅ Criando pedido:', JSON.stringify(order, null, 2));
    
    try {
      const createdOrder = await Order.create(order);
      console.log('🎉 Pedido criado com sucesso:', createdOrder._id);
      return response.status(201).json(createdOrder);
    } catch (error) {
      console.error('❌ Erro ao criar pedido no MongoDB:', error.message);
      
      // Se for erro de conexão com MongoDB
      if (error.name === 'MongooseError' || error.name === 'MongoServerError') {
        return response.status(503).json({
          error: 'Serviço temporariamente indisponível',
          message: 'Não foi possível conectar ao banco de dados de pedidos. Tente novamente em alguns instantes.',
          code: 'DATABASE_CONNECTION_ERROR'
        });
      }
      
      return response.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao criar pedido. Tente novamente mais tarde.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  async index(request, response) {
    try {
      const orders = await Order.find().sort({ createdAt: -1 });
      return response.json(orders);
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error.message);
      
      // Se for erro de conexão com MongoDB
      if (error.name === 'MongooseError' || error.name === 'MongoServerError') {
        return response.status(503).json({
          error: 'Serviço temporariamente indisponível',
          message: 'Não foi possível conectar ao banco de dados de pedidos. Tente novamente em alguns instantes.',
          code: 'DATABASE_CONNECTION_ERROR'
        });
      }
      
      return response.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar pedidos. Tente novamente mais tarde.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  async userOrders(request, response) {
    try {
      const orders = await Order.find({ 'user.id': request.userId }).sort({ createdAt: -1 });
      return response.json(orders);
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos do usuário:', error.message);
      
      // Se for erro de conexão com MongoDB
      if (error.name === 'MongooseError' || error.name === 'MongoServerError') {
        return response.status(503).json({
          error: 'Serviço temporariamente indisponível',
          message: 'Não foi possível conectar ao banco de dados de pedidos. Tente novamente em alguns instantes.',
          code: 'DATABASE_CONNECTION_ERROR'
        });
      }
      
      return response.status(500).json({
        error: 'Erro interno do servidor',
        message: 'Erro ao buscar seus pedidos. Tente novamente mais tarde.',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }

  async update(request, response) {
    const schema = Yup.object({
      status: Yup.string().required(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { admin: isAdmin } = await User.findByPk(request.userId);

    if (!isAdmin) {
      return response.status(401).json();
    }

    const { id } = request.params;
    const { status } = request.body;

    try {
      await Order.updateOne({ _id: id }, { status });
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }

    return response.json({ message: 'Status Atualizado com Sucesso!' });
  }
}

export default new OrderController();
