import { Order } from "../enums/orderEnum";
import { orderModel } from "../interface/orderModel";
import { entity } from "../utils/entity";
import { orderField } from "../utils/inputFields";

export const orderItem = async (req, res) => {
  try {
    const order = req.order;
    const orderId = req.orderId;
    const userId = req.userId;
    const { orderedItems, shippingInfo, paymentMethod, orderStatus } = req.body;

    const orderDetails = entity.checkMissingFieldsInput(orderField, req.body);
    if (!orderDetails) {
      return res.status(400).json({
        message: orderDetails.message,
      });
    }

    const products = productModel.find();
    if (!products) {
      return res.status(404).json({
        message: "product not found",
      });
    }
    // loop through the products
    products.forEach((product) => {});
    const newOrder = new orderModel({
      creatorId: userId,
      orderedItems: orderedItems,
      shippingInfo: shippingInfo,
      paymentMethod: paymentMethod,
      orderStatus: Order.PROCESSING,
      totalAmount: totalAmount,
    });

    await newOrder.save();
    return res.status(201).json({
      message: "order created successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
