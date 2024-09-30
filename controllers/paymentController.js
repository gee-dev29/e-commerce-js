import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
export const getClientIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {}
};

export const getStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Handle successful payment
      break;
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  res.json({ received: true });
};

export const createStripeSession = async (req, res) => {
  try {
    const { products } = req.body;
    const lineItems = products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.productTitle,
          images: item.product.productImages,
        },
        unit_amount: Math.round(item.product.productPrice * 100),
      },
      quantity: item.quantity,
    }));
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: "http://localhost:5173/checkout-summary",
      cancel_url: "http://localhost:5173/checkout-summary",
    });

    res.json({
      id: session.id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
