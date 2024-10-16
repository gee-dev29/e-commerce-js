import Stripe from "stripe";
import dotenv from "dotenv";
import client from "../middleware/payPalConfig.js";
import paypal from "@paypal/checkout-server-sdk";
import { orderModel } from "../model/orderModel.js";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { orderStatus } from "../enums/orderEnum.js";
import { paymentModel } from "../model/paymentModel.js";
import { entity } from "../utils/entity.js";

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

// Create PayPal order

// both createOrder and captureOrder will work with reactJs , i've comfirmed it
export const createOrder = async (req, res) => {
    try {
        // you should pass pass the orderId in the request body and this API will process the paypal payment
        const { orderId } = req.body;
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        const { totalAmount, currency, creatorId } = order;
        const creatorIdString = creatorId.toString();
        console.log(creatorIdString);
        console.log(totalAmount);

        if (!totalAmount || totalAmount <= 0) {
            return res.status(400).json({ message: "Invalid total amount" });
        }
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: order.totalAmount.toFixed(2),
                    },
                },
            ],
        });
        const paypalOrder = await client.execute(request);
        const paypalOrderId = paypalOrder.result.id;

        //This approvalUrl will be sent to the client which 
        //will redirect the user to the paypal 
        //approval page to comfirm the payment 
        const approveUrl = paypalOrder.result.links.find(
            (link) => link.rel === "approve"
        )?.href;

        if (!approveUrl) {
            return res.status(500).json({
                message: "Failed to retrieve PayPal approval URL",
            });
        }

        const newPayment = new paymentModel({
            creatorId: creatorIdString,
            paymentMethod: PaymentMethod.PAYPAL,
            paymentRef: paypalOrderId,
            order: orderId,
        });
        await newPayment.save();

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
        const { paypalOrderId } = req.body;

        // Capture the PayPal order
        const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
        request.requestBody({});
        const captureResponse = await client.execute(request);
        if (captureResponse.result.status !== "COMPLETED") {
            return res
                .status(400)
                .json({ message: "Payment was not successful" });
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
            return res
                .status(404)
                .json({ message: "Payment record not found" });
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
