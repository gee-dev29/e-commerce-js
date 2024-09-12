import { orderStatus } from "../enums/orderEnum.js";
import { PaymentMethod } from "../enums/paymentMethodEnums.js";
import { orderModel } from "../model/orderModel.js";
import { productModel } from "../model/productModel.js";
import { checkShippingInfo } from "../middleware/checkShippingInfo.js";
import { entity } from "../utils/entity.js";
import { orderField } from "../utils/inputFields.js";

export const orderItem = async (req, res) => {
    try {
        const cart = req.cart;
        const productIds = cart.productIds;
        const userId = req.id;
        const shippingId = req.shippingId;
        const { paymentMethod } = req.body;

        const orderDetails = entity.checkMissingFieldsInput(
            orderField,
            req.body
        );
        if (!orderDetails) {
            return res.status(400).json({
                message: orderDetails.message,
            });
        }

        // Fetch products from the database using the product IDs in the cart
        const products = await productModel.find({ _id: { $in: productIds } });
        if (!products || products.length === 0) {
            return res.status(404).json({
                message: "No products found in the cart",
            });
        }

        // Create the new order
        const newOrder = new orderModel({
            creatorId: userId,
            orderedItems: products.map((product) => product._id), // Store product IDs in orderedItems
            shippingId: shippingId,
            paymentMethod: paymentMethod,
            orderStatus: orderStatus.PROCESSING, // default status
            totalAmount: cart.totalAmount,
        });

        // console.log(newOrder);
        // Save the new order to the database
        await newOrder.save();

        return res.status(201).json({
            message: "Order created successfully",
            orderId: newOrder._id,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const viewOrders = async (req, res) => {
    try {
        const order = await entity.getAllFilteredData(orderModel);
        return res.status(200).json({ data: order });
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
