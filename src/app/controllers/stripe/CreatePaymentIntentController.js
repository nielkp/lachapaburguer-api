import Stripe from 'stripe';
import * as Yup from 'yup';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class CreatePaymentIntentController {
  async store(request, response) {
    const schema = Yup.object({
      products: Yup.array()
        .required()
        .of(
          Yup.object({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
            price: Yup.number().required(),
          })
        ),
      deliveryTax: Yup.number().nullable(),
      address: Yup.string().required(),
      total: Yup.number().required(),
    });

    try {
      await schema.validate(request.body, { abortEarly: false });
    } catch (err) {
      console.error('Validation error:', err.errors);
      return response.status(400).json({
        error: 'Dados inválidos',
        details: err.errors,
      });
    }

    const { products, deliveryTax, address, total } = request.body;

    console.log('Novo pedido:', {
      products: products,
      deliveryTax: deliveryTax,
      address: address,
      total,
    });

    try {
      // Validar e converter o total para centavos (Stripe trabalha em centavos)
      if (typeof total !== 'number' || isNaN(total) || total <= 0) {
        return response.status(400).json({
          error: 'Valor total inválido',
          details: 'O valor total deve ser um número positivo',
        });
      }

      const amount = Math.round(total);

      console.log('Amount to charge:', amount, '(total already in cents)');

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'brl',
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          address: address,
          deliveryTax: deliveryTax?.toString() || '0',
          productsCount: products.length.toString(),
          totalAmount: total.toString(),
          productsInfo: JSON.stringify(
            products.map((p) => ({ id: p.id, quantity: p.quantity }))
          ),
          createdAt: new Date().toISOString(),
        },
      });

      console.log('PaymentIntent created:', paymentIntent.id);

      return response.status(200).json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    } catch (stripeError) {
      console.error('Stripe error:', stripeError);

      // Tratamento de erros específicos do Stripe
      let statusCode = 500;
      let errorMessage = 'Erro ao criar pagamento';

      if (stripeError.type === 'StripeCardError') {
        // Erro relacionado ao cartão
        statusCode = 400;
        errorMessage = 'Erro no cartão de pagamento';
      } else if (stripeError.type === 'StripeInvalidRequestError') {
        // Erro de requisição inválida
        statusCode = 400;
        errorMessage = 'Requisição inválida para o Stripe';
      } else if (stripeError.type === 'StripeAPIError') {
        // Erro na API do Stripe
        statusCode = 503;
        errorMessage = 'Serviço do Stripe indisponível no momento';
      } else if (stripeError.type === 'StripeConnectionError') {
        // Erro de conexão com o Stripe
        statusCode = 503;
        errorMessage = 'Erro de conexão com o serviço de pagamento';
      } else if (stripeError.type === 'StripeAuthenticationError') {
        // Erro de autenticação com o Stripe
        statusCode = 401;
        errorMessage = 'Erro de autenticação com o serviço de pagamento';
        console.error('Possível problema com a chave do Stripe!');
      }

      return response.status(statusCode).json({
        error: errorMessage,
        details: stripeError.message,
        code: stripeError.code || 'unknown',
      });
    }
  }
}

export default new CreatePaymentIntentController();
