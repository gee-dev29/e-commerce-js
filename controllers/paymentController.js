import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
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
  let event;
  try {
    const signature = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  res.json({ received: true });
  console.log(event);
  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;
      console.log(paymentIntentSucceeded);

      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // Return a 200 response to acknowledge receipt of the event
  res.send();
};

export const createStripeSession = async (req, res) => {
  try {
    const { products, orderId } = req.body;
    const lineItems = products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.product.productTitle,
          images: item.product.productImages,
        },
        unit_amount: Math.round(
          (item.product.productPrice -
            item.product.productPrice * (item.product?.productDiscount / 100)) *
            100
        ),
      },

      quantity: item.quantity,
    }));
    console.log(orderId);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        order_id: orderId, // Ensure orderId is defined here
      },
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

export const createPaypalSession = async (req, res) => {
  try {
    const { products } = req.body;
    const purchase = products.map((item) => {
      return { currency_code: "USD", value: item.product.productPrice };
    });
    let lineItems = {
      purchase_units: purchase,
      intent: "CAPTURE ",
    };
    console.log(lineItems);
  } catch (error) {}
};
