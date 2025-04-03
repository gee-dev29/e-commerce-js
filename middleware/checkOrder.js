import { orderModel } from "../model/orderModel.js";

export const checkOrder = async (req, res, next) => {
    try {
        let orderId;
        if (req.body.orderId) {
            orderId = req.body.orderId;
        } else {
            orderId = req.params.orderId;
        }

        if (!orderId) {
            return res.status(400).json({ message: "Order Id is required" });
        }
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        req.order = order;
        next();
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
 