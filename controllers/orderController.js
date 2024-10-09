import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { orderModel } from "../model/orderModel.js";
import { productModel } from "../model/productModel.js";
import { entity } from "../utils/entity.js";
import { orderField } from "../utils/inputFields.js";
import { v4 as uuidv4 } from "uuid";
import { orderStatus } from "../enums/orderEnum.js";
import { currency } from "../utils/currency.js";

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
            phone,
            orderNote,
            orderedItems,
        } = req.body;
        const missingFields = entity.checkMissingFieldsInput(
            orderField,
            req.body
        );
        if (missingFields && missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing fields: ${missingFields.join(", ")}`,
            });
        }

        const newOrder = new orderModel({
            creatorId: userId,
            fullName: fullName,
            orderedItems: orderedItems,
            orderTrackingNumber: uuidv4(),
            paymentMethod: paymentMethod,
            totalAmount: totalAmount,
            orderStatus: orderStatus.PROCESSING,
            street: street,
            city: city,
            state: state,
            country: country,
            zipCode: zipCode,
            phone: phone,
            orderNote: orderNote || "",
            currency: currency.USD,
        });
        await newOrder.save();
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
