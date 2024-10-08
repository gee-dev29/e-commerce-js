import { orderStatus } from "../enums/orderEnum.js";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { orderModel } from "../model/orderModel.js";
import { productModel } from "../model/productModel.js";
import { checkShippingInfo } from "../middleware/checkShippingInfo.js";
import { entity } from "../utils/entity.js";
import { orderField } from "../utils/inputFields.js";
import mongoose from "mongoose";

import { orderModel } from "./path-to-order-model";
import { productModel } from "./path-to-product-model"; // Ensure the path is correct
import { v4 as uuidv4 } from "uuid"; // For generating unique tracking numbers
import { orderStatus } from "../enums/orderEnum.js";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { currency } from "../utils/currency.js";

export const orderItem = async (req, res) => {
    try {
        const userId = req.id; // Assuming req.id holds the authenticated user's ID
        const {
            paymentMethod,
            fullName,
            orderedItems,
            street,
            city,
            state,
            country,
            zipCode,
            phone,
            orderNote,
        } = req.body;

        const missingFields = entity.checkMissingFieldsInput(
            orderField,
            req.body
        );
        if (missingFields) {
            return res.status(400).json({
                message: `Missing fields: ${missingFields.join(", ")}`,
            });
        }

        if (!Object.values(PaymentMethod).includes(paymentMethod)) {
            return res.status(400).json({
                message: "Invalid payment method",
            });
        }

        const productIds = orderedItems.map((item) => item.productId);
        const products = await productModel.find({ _id: { $in: productIds } });

        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found for the given items",
            });
        }
        let totalAmount = 0;
        orderedItems.forEach((item) => {
            const product = products.find(
                (p) => p._id.toString() === item.productId
            );
            if (product) {
                totalAmount += product.price * item.quantity;
            }
        });
        const newOrder = new orderModel({
            creatorId: userId,
            fullName: fullName,
            orderedItems: orderedItems.map((item) => ({
                product: item.productId,
                quantity: item.quantity,
                color: item.color,
                size: item.size,
            })),
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
