import Stripe from "stripe";
import dotenv from "dotenv";
import client from "../middleware/payPalConfig.js";
import paypal from "@paypal/checkout-server-sdk";
import { orderModel } from "../model/orderModel.js";
import { orderStatus } from "../enums/orderEnum.js";
import { paymentModel } from "../model/paymentModel.js";
import { entity } from "../utils/entity.js";
import { currency } from "../utils/currency.js";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { cartModel } from "../model/cartModel.js";
import { sendEmail } from "../emailService/email.js";
import { receiptEmailTemplate } from "../emailService/template/template.js";
import { shippingModel } from "../model/shippingModel.js";

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
      const myorder = await orderModel.findOneAndUpdate(filter, update, {
        new: true,
      });

      const newPayment = new paymentModel({
        creatorId: req.id,
        amount: myorder?.totalAmount,
        paymentMethod: PaymentMethod.STRIPE,
        paymentRef: payment.id,
        paymentStatus: orderStatus.PAID,
      });
      await newPayment.save();
      break;
    default:
  }

  // Return a 200 response to acknowledge receipt of the event
  return res.status(200).json({ received: true });
};

export const createStripeSession = async (req, res) => {
  try {
    const { products, shippingId, orderData } = req.body;
    const shipping = await shippingModel.findById(shippingId);

    const lineItems = products.map((item) => ({
      price_data: {
        currency: "USD",
        product_data: {
          name: item.product.productTitle,
          images: item.product.productImages,
        },
        unit_amount: Math.round(
          (item.product.productPrice -
            item.product.productPrice * (item.product?.productDiscount / 100) +
            shipping.shippingRate) *
            100
        ),
      },

      quantity: item.quantity,
    }));
    let order;
    if (orderData.totalAmount > 0) {
      order = await entity.saveOrder(orderData, req.id, shippingId, orderModel);
      const filter = {
        creatorId: req.id,
      };
      await cartModel.deleteOne(filter);
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      metadata: {
        order_id: order._id.toString(),
        user_id: req.id.toString(),
      },
      mode: "payment",
      success_url: `https://ecommerce-frontend-pi-cyan.vercel.app/success/${order._id}`,
      cancel_url:
        "https://ecommerce-frontend-pi-cyan.vercel.app/checkout-summary",
    });
    // const emailHtml = receiptEmailTemplate(
    //   order.orderTrackingNumber,
    //   new Date().toISOString(),
    //   order.country,
    //   order.state,
    //   order.city,
    //   order.totalAmount,
    //   products
    // );
    // await sendEmail(order.email, "Your Order Receipt", emailHtml);

    res.json({
      id: session.id,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Create PayPal order

// both createOrder and captureOrder will work with reactJs , i've comfirmed it
export const createOrder = async (req, res) => {
  try {
    const { products, shippingId, orderData } = req.body;
    const order = await entity.saveOrder(
      orderData,
      req.id,
      shippingId,
      orderModel
    );

    const filter = {
      creatorId: req.id,
    };
    await cartModel.deleteOne(filter);

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: order._id,
          amount: {
            currency_code: "USD",
            value: Number(order.totalAmount),
          },
          description: "order",
        },
      ],
    });
    const paypalOrder = await client.execute(request);
    const id = paypalOrder.result.id;
    const payload = {
      paymentIntentId: id,
    };
    await entity.updateDataById(order._id, payload, orderModel);

    const newPayment = new paymentModel({
      creatorId: req.id,
      amount: orderData?.totalAmount,
      paymentMethod: PaymentMethod.PAYPAL,
      paymentRef: id,
      paymentStatus: orderStatus.AWAITING_PAYMENT,
    });
    await newPayment.save();

    res.status(201).json({
      id: id,
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
      { paymentRef: orderId },
      {
        $set: {
          paymentStatus: orderStatus.PAID,
        },
      },
      { new: true }
    );

    if (!paymentRecord) {
      return res.status(404).json({ message: "Payment record not found" });
    }
    const updatePayload = {
      orderStatus: orderStatus.PAID,
      canReview: true,
    };

    const order = await orderModel.updateOne(
      { paymentIntentId: orderId },
      updatePayload,
      { new: true }
    );

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

export const getPayments = async (req, res) => {
  try {
    const userId = req.id;
    const filter = {
      creatorId: userId,
    };
    const data = await entity.getAllFilteredData(paymentModel, filter);
    return res.status(200).json({
      payload: data,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
