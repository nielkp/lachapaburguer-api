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
      paymentIntentId: Yup.string(),
      status: Yup.string(),
      user: Yup.object({
        id: Yup.string().required(),
        name: Yup.string().required(),
      }),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { products, address, deliveryTax, total, paymentIntentId, status, user } = request.body;

    const productsIds = products.map((product) => product.id);

    const findProducts = await Product.findAll({
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
    };

    const createdOrder = await Order.create(order);

    return response.status(201).json(createdOrder);
  }

  async index(request, response) {
    const orders = await Order.find();

    return response.json(orders);
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
