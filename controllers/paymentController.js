import Stripe from "stripe";
import dotenv from "dotenv";
import client from "../middleware/payPalConfig.js";
import paypal from "@paypal/checkout-server-sdk";
import { orderModel } from "../model/orderModel.js";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { orderStatus } from "../enums/orderEnum.js";
import { paymentModel } from "../model/paymentModel.js";
import { entity } from "../utils/entity.js";
import { currency } from "../utils/currency.js";

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

  switch (event.type) {
    case "checkout.session.completed":
      const checkout = event.data.object;
      const orderId = checkout.metadata.order_id;
      const payload = {
        paymentIntentId: checkout.payment_intent,
      };
      await entity.updateDataById(orderId, payload, orderModel);
      break;
    case "payment_intent.succeeded":
      const payment = event.data.object;
      const filter = {
        paymentIntentId: payment.id,
      };
      const update = {
        orderStatus: orderStatus.PAID,
      };
     const myorder = await orderModel.findOneAndUpdate(filter, update, { new: true });
      await savePayment(
        PaymentMethod.STRIPE,
        payment.id,
        paymentModel
      );
      break;
    default:
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.status(200).json({ received: true });
};

export const createStripeSession = async (req, res) => {
  try {
    const { products, orderData } = req.body;
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
    let order;
    if (orderData._id) {
      order = orderData;
    } else {
      order = await entity.saveOrder(orderData, req.id, orderModel);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        order_id: order._id.toString(),
        user_id: req.id.toString(),
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

// Create PayPal order

// both createOrder and captureOrder will work with reactJs , i've comfirmed it
export const createOrder = async (req, res) => {
  try {
    const { products, orderData } = req.body;
    const order = await entity.saveOrder(orderData, req.id, orderModel);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order._id,
          amount: {
            currency_code: "USD",
            value: Number(order.totalAmount) * 100,
          },
          // items: products,
          description: "order",
        },
      ],
    });
    const paypalOrder = await client.execute(request);
    const paypalOrderId = paypalOrder.result.id;

    const approveUrl = paypalOrder.result.links.find(
      (link) => link.rel === "approve"
    )?.href;

    if (!approveUrl) {
      return res.status(500).json({
        message: "Failed to retrieve PayPal approval URL",
      });
    }
    await savePayment(
      PaymentMethod.PAYPAL,
      paypalOrderId,
      paymentModel
    );

    res.status(201).json({
      orderID: paypalOrderId,
      approveUrl: approveUrl,
      message:
        "PayPal order created successfully. Redirect to the approval URL to complete the payment.",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while creating the PayPal order.",
      error: error.message,
    });
  }
};

// // Capture PayPal order
export const captureOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    // Capture the PayPal order
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const captureResponse = await client.execute(request);
    if (captureResponse.result.status !== "COMPLETED") {
      return res.status(400).json({ message: "Payment was not successful" });
    }
    // Find and update the payment record in the database
    const paymentRecord = await paymentModel.findOneAndUpdate(
      { paymentRef: paypalOrderId },
      {
        $set: {
          paymentStatus: orderStatus.PAID,
        },
      },
      { new: true }
    );
    const order = await orderModel.findById(paymentRecord.order);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const enrichedResponse = {
      ...captureResponse.result,
      orderDetails: {
        fullName: order.fullName,
        email: order.email,
        shippingAddress: {
          street: order.street,
          city: order.city,
          state: order.state,
          zipCode: order.zipCode,
          country: order.country,
        },
        phone: order.phone,
      },
    };

    if (!paymentRecord) {
      return res.status(404).json({ message: "Payment record not found" });
    }
    // update the orderStatus to PAID
    await entity.updateDataById(order, orderModel);

    res.status(200).json({
      message: "Payment captured successfully",
      paymentDetails: enrichedResponse,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while capturing the PayPal order.",
      error: error.message,
    });
  }
};

const savePayment = async (
  method,
  paymentRef,
  model
) => {
  const newPayment = new model({
    paymentMethod: method,
    paymentRef: paymentRef,
    paymentStatus: orderStatus.PAID
  });
  await newPayment.save();
};
