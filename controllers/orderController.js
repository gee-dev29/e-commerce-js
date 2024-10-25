import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { orderModel } from "../model/orderModel.js";
import { productModel } from "../model/productModel.js";
import { entity } from "../utils/entity.js";
import { orderField } from "../utils/inputFields.js";
import { v4 as uuidv4 } from "uuid";
import { orderStatus } from "../enums/orderEnum.js";
import { currency } from "../utils/currency.js";
import { receiptEmailTemplate } from "../emailService/template/template.js";
import { sendEmail } from "../emailService/email.js";

export const createOrderItem = async (req, res) => {
  try {
    const userId = req.id;
    const {
      fullName,
      paymentMethod,
      street,
      city,
      state,
      country,
      zipCode,
      totalAmount,
      phone,
      email,
      orderNote,
      orderedItems,
    } = req.body;
    const missingFields = entity.checkMissingFieldsInput(orderField, req.body);
    if (missingFields && missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

    const newOrder = new orderModel({
      creatorId: userId,
      fullName: fullName,
      orderedItems: orderedItems,
      orderTrackingNumber: entity.generateOrderNumber(),
      paymentMethod: paymentMethod,
      totalAmount: totalAmount,
      street: street,
      email: email,
      city: city,
      state: state,
      country: country,
      zipCode: zipCode,
      phone: phone,
      orderNote: orderNote || "",
      currency: currency.USD,
    });
    await newOrder.save();
    const orderEmail = receiptEmailTemplate(
      newOrder.orderTrackingNumber,
      new Date().toISOString(),
      newOrder.country,
      newOrder.state,
      newOrder.city,
      newOrder.totalAmount,
      orderedItems
    );
    const emailService = {
      recieverEmail: email,
      subject: "Your Order Receipt",
      text: orderEmail,
    };
    await sendEmail(emailService);
    return res.status(201).json({
      message: "Order created successfully",
      orderId: newOrder._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const adminViewOrders = async (req, res) => {
  try {
    const order = await entity.getAllFilteredData(orderModel, {});
    return res.status(200).json({ payload: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const viewOrders = async (req, res) => {
  try {
    const order = await entity.getAllFilteredData(orderModel, {
      creatorId: req.id.id || req.id,
    });
    return res.status(200).json({ payload: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const viewOrder = async (req, res) => {
  try {
    const order = req.order;
    // console.log(order)
    // const orderItem = await orderModel.findById(orderId);
    return res.status(200).json({ data: order });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const changeOrderStatus = async (req, res) => {
  try {
    const orderId = req.orderId;
    const { orderStatus } = req.body;
    const payload = { orderStatus: orderStatus };
    await entity.updateDataById(orderId, payload, orderModel).then(() => {
      return res
        .status(200)
        .json({ message: "order status updated successfully" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.id;
    const filter = { creatorId: userId };
    const { skip, limit } = req.query;
    const data = await entity.getPaginatedDataWithPopulate(
      orderModel,
      filter,
      skip,
      limit,
      "orderedItems.product",
      "product"
    );

    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderByStatus = async (req, res) => {
  try {
    const orderStatus = req.body;
    const { skip, limit } = req.query;
    const filter = { orderStatus: orderStatus };
    const data = await entity.getPaginatedData(orderModel, filter, skip, limit);
    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skip, limit } = req.query;
    const filter = { creatorId: userId };
    const data = await entity.getPaginatedData(orderModel, filter, skip, limit);
    return res.status(200).json({ payload: data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const processOrder = async (req, res) => {
  try {
    const { _id, note, orderStatus } = req.body;
    const payload = {
      orderStatus: orderStatus,
    };
    await entity.updateDataById(_id, payload, orderModel);
    return res.status(200).json({ message: "order process successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
